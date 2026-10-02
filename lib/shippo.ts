/**
 * Minimal Shippo REST client — just enough to push a paid order in as a
 * Shippo "Order" so it's sitting there ready to fulfil the moment you open
 * Shippo. No SDK dependency; Shippo's REST API is simple enough to call
 * directly with fetch.
 *
 * Buying the label itself stays a manual step in the Shippo dashboard (as
 * before) — this just gets the order there automatically instead of you
 * re-entering it by hand.
 */

const SHIPPO_API = "https://api.goshippo.com"

export const SHIPPO_ENABLED = Boolean(process.env.SHIPPO_API_KEY)

/**
 * Where every order ships from. Shippo's dashboard shows your account's
 * default sender address on any order as a display fallback even when the
 * order itself has no from_address -- which looks correct but isn't: rate
 * shopping needs a real from_address actually attached to the order, not
 * just a UI fallback. Confirmed by testing: a manually-created order (which
 * the dashboard forces you to attach a sender to) got rates fine; an
 * API-created order without this didn't, with no address-related error --
 * it just silently came back "Rates unavailable."
 *
 * phone matters too, not just presence of an address -- Shippo's own
 * "is_complete" check on an address only validates that it geocodes, but
 * USPS's live rate quote can still fail without a contact phone on the
 * origin address even though Shippo doesn't flag that as incomplete.
 */
const FROM_ADDRESS: ShippoAddress = {
  name: "Charah Foods",
  company: "Charah Foods",
  street1: "55 Fleet St",
  street2: "Apt 19H",
  city: "Brooklyn",
  state: "NY",
  zip: "11201",
  country: "US",
  phone: "617-615-2462",
  email: "orders@charah-foods.com",
}

export type ShippoAddress = {
  name: string
  company?: string
  street1: string
  street2?: string
  city: string
  state: string
  zip: string
  country: string
  email?: string
  phone?: string
}

export type ShippoLineItem = {
  quantity: number
  title: string
  total_price: string
  currency: string
  sku?: string
}

export type CreateShippoOrderInput = {
  /** Used as Shippo's order_number — the Stripe Checkout Session id. Also
   *  doubles as the idempotency key: if an order with this number already
   *  exists, we skip creating a duplicate (safe against webhook retries). */
  orderNumber: string
  placedAt: string
  toAddress: ShippoAddress
  lineItems: ShippoLineItem[]
  /** Total shipping weight in ounces — Shippo requires this on an order. */
  weightOz: number
  subtotalCents: number
  shippingCents: number
  taxCents: number
  totalCents: number
}

function centsToStr(cents: number): string {
  return (cents / 100).toFixed(2)
}

async function shippoFetch(path: string, init?: RequestInit, meta?: { status?: number }) {
  const key = process.env.SHIPPO_API_KEY
  if (!key) throw new Error("SHIPPO_API_KEY is not set")
  const res = await fetch(`${SHIPPO_API}${path}`, {
    ...init,
    headers: {
      Authorization: `ShippoToken ${key}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })
  if (meta) meta.status = res.status
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Shippo ${path} -> ${res.status}: ${body.slice(0, 500)}`)
  }
  return res.json()
}

// ---- TEMPORARY DIAGNOSTICS (remove once the "Rates Unavailable" issue is resolved) ----
// Logs what Shippo actually persisted for an order created by this code, to
// compare against an identical order created from outside Vercel. Read-only:
// never alters the request, never throws, never logs credentials.

const REDACT_KEYS = new Set([
  "name", "company", "street_no", "street1", "street2", "street3",
  "city", "zip", "phone", "email", "latitude", "longitude", "notes",
])

/** Replaces non-empty values of PII keys with "[REDACTED]" but keeps the key, and keeps ""/null so emptiness stays visible. */
function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => {
        if (REDACT_KEYS.has(k) && typeof v === "string" && v !== "") return [k, "[REDACTED]"]
        if (REDACT_KEYS.has(k) && typeof v === "number") return [k, "[REDACTED]"]
        return [k, redact(v)]
      }),
    )
  }
  return value
}

async function logPersistedOrder(requestBody: string, postStatus: number | undefined, created: unknown) {
  try {
    const orderId = (created as { object_id?: string } | null)?.object_id
    const getMeta: { status?: number } = {}
    let stored: unknown = null
    let getError: string | undefined
    if (orderId) {
      try {
        stored = await shippoFetch(`/orders/${orderId}`, undefined, getMeta)
      } catch (e) {
        getError = e instanceof Error ? e.message.replace(/ShippoToken\s+\S+/g, "ShippoToken [redacted]") : String(e)
      }
    }
    console.log(
      "[shippo-diag] " +
        JSON.stringify({
          timestamp: new Date().toISOString(),
          vercelEnv: process.env.VERCEL_ENV ?? null,
          vercelRegion: process.env.VERCEL_REGION ?? null,
          isVercelProduction: process.env.VERCEL_ENV === "production",
          postStatus: postStatus ?? null,
          getStatus: getMeta.status ?? null,
          getError: getError ?? null,
          orderId: orderId ?? null,
          orderNumber: (created as { order_number?: string } | null)?.order_number ?? null,
          postResponseTopLevelKeys: created && typeof created === "object" ? Object.keys(created) : null,
          postRequestBody: redact(JSON.parse(requestBody)),
          getResponse: redact(stored),
        }),
    )
  } catch (e) {
    console.log("[shippo-diag] diagnostic logging failed:", e instanceof Error ? e.message : String(e))
  }
}
// ---- END TEMPORARY DIAGNOSTICS ----

async function orderExists(orderNumber: string): Promise<boolean> {
  // Shippo's /orders/ list endpoint does NOT actually filter by the
  // order_number query param server-side (confirmed by testing — it just
  // returns everything regardless), so filter client-side instead. Only the
  // most recent page is checked: this is a dedup guard against a Stripe
  // webhook retry moments later, not a general "does this order exist
  // anywhere" lookup, so an order from long ago falling off the first page
  // isn't a concern here.
  const data = await shippoFetch(`/orders/`)
  const results: { order_number?: string }[] = Array.isArray(data?.results) ? data.results : []
  return results.some((o) => o.order_number === orderNumber)
}

/** Creates a Shippo Order for a paid Stripe session. No-ops if one with this order_number already exists. */
export async function createShippoOrder(input: CreateShippoOrderInput) {
  if (!SHIPPO_ENABLED) return null
  if (await orderExists(input.orderNumber)) return null

  const body = JSON.stringify({
    order_number: input.orderNumber,
    order_status: "PAID",
    placed_at: input.placedAt,
    to_address: input.toAddress,
    from_address: FROM_ADDRESS,
    line_items: input.lineItems,
    weight: String(input.weightOz),
    weight_unit: "oz",
    subtotal_price: centsToStr(input.subtotalCents),
    shipping_cost: centsToStr(input.shippingCents),
    shipping_cost_currency: "USD",
    shipping_method: "Standard (3-7 business days)",
    total_tax: centsToStr(input.taxCents),
    total_price: centsToStr(input.totalCents),
    currency: "USD",
  })

  const postMeta: { status?: number } = {}
  const created = await shippoFetch("/orders/", { method: "POST", body }, postMeta)

  await logPersistedOrder(body, postMeta.status, created) // TEMPORARY diagnostic; never throws
  return created
}
