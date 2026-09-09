import { NextResponse } from "next/server"
import Stripe from "stripe"
import { priceCart, type CartLine } from "@/lib/commerce"
import { site } from "@/content/site"

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
  let returnTo = "/shop"
  try {
    const body = (await req.json()) as { lines?: CartLine[]; returnTo?: string }
    lines = Array.isArray(body.lines) ? body.lines : []
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

  const origin = resolveOrigin(req)
  const allowImages = origin.startsWith("https://")
  const stripe = new Stripe(key)

  try {
    // Sales tax via Stripe Tax, calculated from the shipping address. Gated on an
    // env flag because it errors until Stripe Tax is set up in the Dashboard
    // (Settings → Tax: origin address + nexus-state registrations). Flip
    // STRIPE_TAX_ENABLED=true once that's done — no deploy needed.
    const taxEnabled = process.env.STRIPE_TAX_ENABLED === "true"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      automatic_tax: { enabled: taxEnabled },
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
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      metadata: {
        subtotal_cents: String(subtotalCents),
        shipping_cents: String(shippingCents),
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
