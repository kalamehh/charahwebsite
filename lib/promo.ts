/**
 * Promo-code validation, shared by /api/promo (the checkout step's "Apply"
 * button) and /api/checkout (which re-validates before starting payment --
 * never trust the client's word that a code was checked).
 *
 * Codes live in Stripe as Promotion Codes (Dashboard -> Product catalog ->
 * Coupons). Stripe itself enforces expiry, max redemptions and the minimum
 * order. What Stripe can't do is "each customer email may use this code once",
 * so a code marked with metadata `once_per_email = true` is checked here
 * against past successful payments (they carry `promo_id` + `email_key`
 * metadata, set in app/api/checkout/route.ts).
 *
 * Supported: percent-off or dollar-off coupons, usable on any item; codes tied
 * to one Stripe customer (matched by email, see findCustomerId); and
 * "first order only" codes. Not supported (rejected, so a customer is never
 * promised a discount that won't apply): coupons limited to specific Stripe
 * products (our line items are inline price_data, so they'd match nothing).
 */

import type Stripe from "stripe"

export type PromoResult =
  | {
      ok: true
      promotionCodeId: string
      /** Canonical code as stored in Stripe, e.g. "FOUNDER". */
      code: string
      discountCents: number
      /** Human label for the discount line, e.g. "10% off" or "$5.00 off". */
      label: string
    }
  | { ok: false; error: string; status: number }

const EMAIL_RE = /^[^\s@'"\\]+@[^\s@'"\\]+\.[^\s@'"\\]+$/

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email)
}

/**
 * The key a customer is identified by for "once per email": lowercased, with
 * a "+tag" suffix dropped and, for Gmail, dots dropped -- so a.b+x@gmail.com
 * and ab@gmail.com count as the same person. This makes casual repeats
 * harder; it can't stop someone with a genuinely different address.
 */
export function emailKey(email: string): string {
  const [rawLocal, rawDomain] = email.trim().toLowerCase().split("@")
  let local = rawLocal.split("+")[0]
  let domain = rawDomain
  if (domain === "googlemail.com") domain = "gmail.com"
  if (domain === "gmail.com") local = local.replace(/\./g, "")
  return `${local}@${domain}`
}

function usd(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
}

/**
 * The Stripe Customer for an email, if one exists. Checkout creates a Customer
 * on a buyer's first order (customer_creation in app/api/checkout) and reuses
 * it afterwards. Emails are stored and looked up lower-cased, because Stripe's
 * email filter is case-sensitive.
 */
export async function findCustomerId(stripe: Stripe, email: string): Promise<string | null> {
  const found = await stripe.customers.list({ email: email.trim().toLowerCase(), limit: 1 })
  return found.data[0]?.id ?? null
}

const INVALID: PromoResult = { ok: false, error: "That code isn't valid.", status: 404 }

export async function validatePromo(
  stripe: Stripe,
  params: {
    code: string
    email: string
    subtotalCents: number
    /** The buyer's existing Stripe Customer id, null if none, or leave out to look it up. */
    customerId?: string | null
  },
): Promise<PromoResult> {
  const typed = params.code.trim()
  if (!typed || typed.length > 64 || !/^[A-Za-z0-9-]+$/.test(typed)) return INVALID
  if (!isValidEmail(params.email)) {
    return { ok: false, error: "Enter your email first, then apply the code.", status: 400 }
  }

  // Stripe's `code` filter is exact-match, and codes are conventionally created
  // in upper case, so try that first and then the code as typed.
  // Inactive codes are fetched too (not just active ones) so a code that was
  // used up or has expired can say so, instead of the same "isn't valid" an
  // unknown code gets. Stripe switches a code off when it runs out or expires;
  // the same code can also exist several times (old ones deactivated), so an
  // active match wins over an inactive one.
  let promo: Stripe.PromotionCode | undefined
  for (const candidate of Array.from(new Set([typed.toUpperCase(), typed]))) {
    const found = await stripe.promotionCodes.list({
      code: candidate,
      limit: 10,
      expand: ["data.promotion.coupon"],
    })
    promo = found.data.find((p) => p.active) ?? found.data[0]
    if (promo) break
  }
  if (!promo) return INVALID

  if (promo.max_redemptions !== null && promo.times_redeemed >= promo.max_redemptions) {
    return { ok: false, error: "That code is already used.", status: 409 }
  }
  if (promo.expires_at && promo.expires_at * 1000 < Date.now()) {
    return { ok: false, error: "That code has expired.", status: 410 }
  }
  if (!promo.active) return INVALID

  const coupon = promo.promotion.coupon
  if (!coupon || typeof coupon === "string" || !coupon.valid) return INVALID
  if (promo.customer_account) return INVALID
  const customerId = params.customerId === undefined ? await findCustomerId(stripe, params.email) : params.customerId
  const restrictedTo = typeof promo.customer === "string" ? promo.customer : promo.customer?.id
  if (restrictedTo && restrictedTo !== customerId) return INVALID
  if (coupon.applies_to?.products?.length) {
    console.error(`[promo] ${promo.code}: coupon is limited to Stripe products, which this checkout doesn't support`)
    return INVALID
  }

  const min = promo.restrictions.minimum_amount
  if (min && promo.restrictions.minimum_amount_currency === "usd" && params.subtotalCents < min) {
    return { ok: false, error: `This code needs an order of at least ${usd(min)}.`, status: 400 }
  }

  if (promo.restrictions.first_time_transaction && customerId) {
    const prior = await stripe.paymentIntents.search({
      query: `customer:'${customerId}' AND status:'succeeded'`,
      limit: 1,
    })
    if (prior.data.length > 0) {
      return { ok: false, error: "That code is for first orders only.", status: 409 }
    }
  }

  if (promo.metadata?.once_per_email === "true") {
    const key = emailKey(params.email)
    const prior = await stripe.paymentIntents.search({
      query: `metadata['promo_id']:'${promo.id}' AND metadata['email_key']:'${key}' AND status:'succeeded'`,
      limit: 1,
    })
    if (prior.data.length > 0) {
      return { ok: false, error: "This code has already been used with this email.", status: 409 }
    }
  }

  let discountCents: number
  let label: string
  if (coupon.percent_off) {
    discountCents = Math.round((params.subtotalCents * coupon.percent_off) / 100)
    label = `${coupon.percent_off}% off`
  } else if (coupon.amount_off && coupon.currency === "usd") {
    discountCents = Math.min(coupon.amount_off, params.subtotalCents)
    label = `${usd(coupon.amount_off)} off`
  } else {
    return INVALID
  }

  return { ok: true, promotionCodeId: promo.id, code: promo.code, discountCents, label }
}
