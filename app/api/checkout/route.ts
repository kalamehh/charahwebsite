import { NextResponse } from "next/server"
import Stripe from "stripe"
import { priceCart, type CartLine } from "@/lib/commerce"
import { site } from "@/content/site"
import { emailKey, findCustomerId, isValidEmail, validatePromo, type PromoResult } from "@/lib/promo"

export const runtime = "nodejs"

function resolveOrigin(req: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  const origin = req.headers.get("origin")
  if (origin) return origin
  const host = req.headers.get("host")
  if (host) return `${host.startsWith("localhost") ? "http" : "https"}://${host}`
  return site.url
}

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return NextResponse.json(
      { error: "Checkout isn't configured yet. Set STRIPE_SECRET_KEY." },
      { status: 500 },
    )
  }

  let lines: CartLine[]
  let email = ""
  let promoCode = ""
  let returnTo = "/shop"
  try {
    const body = (await req.json()) as { lines?: CartLine[]; email?: string; promoCode?: string; returnTo?: string }
    lines = Array.isArray(body.lines) ? body.lines : []
    if (typeof body.email === "string") email = body.email.trim()
    if (typeof body.promoCode === "string") promoCode = body.promoCode.trim()
    // Only accept a same-origin relative path so canceling returns the shopper
    // to the page they left. Reject protocol-relative ("//evil.com") and absolute URLs.
    if (typeof body.returnTo === "string" && /^\/(?!\/)/.test(body.returnTo)) {
      returnTo = body.returnTo
    }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const { items, subtotalCents, shippingCents } = priceCart(lines)
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  const origin = resolveOrigin(req)
  const allowImages = origin.startsWith("https://")
  const stripe = new Stripe(key)

  try {
    // Returning buyers reuse their Stripe Customer (matched by email); a first
    // order gets one created when the payment completes -- see customer_creation below.
    const existingCustomerId = await findCustomerId(stripe, email)

    // Re-check the promo code here, not just in /api/promo: the client's
    // earlier "Apply" is only a preview and can't be trusted. A code that
    // fails now (used up, expired, already used with this email) stops the
    // checkout with the reason, so nobody pays expecting a discount they won't get.
    let promo: Extract<PromoResult, { ok: true }> | null = null
    if (promoCode) {
      const result = await validatePromo(stripe, { code: promoCode, email, subtotalCents, customerId: existingCustomerId })
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status })
      promo = result
    }

    // Sales tax via Stripe Tax, calculated from the shipping address. Gated on an
    // env flag because it errors until Stripe Tax is set up in the Dashboard
    // (Settings → Tax: origin address + nexus-state registrations). Flip
    // STRIPE_TAX_ENABLED=true once that's done — no deploy needed.
    const taxEnabled = process.env.STRIPE_TAX_ENABLED === "true"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Pinned in code (not just the Dashboard's default payment method
      // configuration) so it can't silently drift. Apple Pay / Google Pay
      // still show automatically as wallet options under "card" on eligible
      // devices — this isn't a separate payment_method_types entry.
      payment_method_types: ["card"],
      automatic_tax: { enabled: taxEnabled },
      // Locks the email Stripe's page shows (it can't be edited there), so the
      // once-per-email check above can't be dodged by typing a different one
      // on Stripe's page. Either way the buyer ends up as a Stripe Customer:
      // an existing one is reused (and updated with the name and shipping
      // address entered at checkout); otherwise one is created once the
      // payment completes, not for abandoned checkouts.
      ...(existingCustomerId
        ? { customer: existingCustomerId, customer_update: { name: "auto" as const, shipping: "auto" as const } }
        : { customer_email: email.toLowerCase(), customer_creation: "always" as const }),
      ...(promo ? { discounts: [{ promotion_code: promo.promotionCodeId }] } : {}),
      line_items: items.map(({ sellable, qty }) => ({
        quantity: qty,
        price_data: {
          currency: "usd",
          unit_amount: sellable.priceCents,
          // Price is pre-tax; tax is added on top. The tax category comes from
          // the account default set in Stripe (Settings → Tax) — for a bottled
          // condiment use "General - Tangible Goods", not a food/grocery code
          // (groceries are tax-exempt in many states).
          tax_behavior: "exclusive",
          product_data: {
            name: sellable.name,
            // Read back in the webhook (expanded via line_items.data.price.product)
            // to map each line item back to a slug -- e.g. for Shippo's required
            // order weight, without fragile matching on the display name.
            metadata: { slug: sellable.slug, sku: sellable.sku },
            ...(allowImages ? { images: [`${origin}${sellable.image}`] } : {}),
          },
        },
      })),
      // Domestic US only — Stripe blocks any non-US shipping address.
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shippingCents === 0 ? "Free shipping" : "Standard shipping",
            fixed_amount: { amount: shippingCents, currency: "usd" },
            tax_behavior: "exclusive",
            tax_code: "txcd_92010001",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      metadata: {
        subtotal_cents: String(subtotalCents),
        shipping_cents: String(shippingCents),
        ...(promo ? { promo_code: promo.code } : {}),
      },
      // Order details on the *payment* (what Stripe's Payments list, CSV
      // exports and bookkeeping integrations read) -- Checkout line items alone
      // live only on the session. Description is shown in the Dashboard; the
      // metadata is selectable as columns in exports: "items" is a readable
      // summary and "qty_<SKU>" is one numeric column per product for summing.
      payment_intent_data: {
        description: `Charah order: ${items.map((i) => `${i.qty} x ${i.sellable.name} (${i.sellable.sku})`).join(", ")}`,
        metadata: {
          items: items.map((i) => `${i.sellable.sku} x${i.qty}`).join("; "),
          ...Object.fromEntries(items.map((i) => [`qty_${i.sellable.sku}`, String(i.qty)])),
          // email_key is what "once per email" codes are checked against (see
          // lib/promo.ts); promo_id/promo_code tie the payment to its code.
          email_key: emailKey(email),
          ...(promo ? { promo_id: promo.promotionCodeId, promo_code: promo.code } : {}),
        },
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${returnTo}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error("[checkout] Stripe error:", e)
    return NextResponse.json({ error: "Could not start checkout. Try again." }, { status: 502 })
  }
}
