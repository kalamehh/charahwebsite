import { NextResponse } from "next/server"
import Stripe from "stripe"
import { priceCart, type CartLine } from "@/lib/commerce"
import { validatePromo } from "@/lib/promo"

export const runtime = "nodejs"

/**
 * "Apply" on the checkout step: checks a promo code for this cart and email
 * and returns the discount to display. Display only -- /api/checkout
 * re-validates before payment starts, so nothing here grants a discount.
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return NextResponse.json({ error: "Promo codes aren't available right now." }, { status: 500 })

  let body: { code?: string; email?: string; lines?: CartLine[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const { items, subtotalCents } = priceCart(Array.isArray(body.lines) ? body.lines : [])
  if (items.length === 0) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 })

  try {
    const result = await validatePromo(new Stripe(key), {
      code: typeof body.code === "string" ? body.code : "",
      email: typeof body.email === "string" ? body.email.trim() : "",
      subtotalCents,
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status })
    return NextResponse.json({
      code: result.code,
      discountCents: result.discountCents,
      label: result.label,
    })
  } catch (e) {
    console.error("[promo] Stripe error:", e)
    return NextResponse.json({ error: "Couldn't check that code. Try again." }, { status: 502 })
  }
}
