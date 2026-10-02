import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createShippoOrder, SHIPPO_ENABLED } from "@/lib/shippo"
import {
  ORDER_NOTIFICATION_EMAIL,
  RESEND_ENABLED,
  sendInternalOrderNotification,
  sendOrderConfirmation,
  sendUnshippableRegionAlert,
  sendUnshippableRegionNotice,
} from "@/lib/resend"
import { EXCLUDED_SHIPPING_STATES, getSellable } from "@/lib/commerce"

export const runtime = "nodejs"

/**
 * The one place that actually knows an order was paid. The success page
 * (app/checkout/success) is shopper-facing UX; this webhook is the
 * authoritative, server-to-server signal the business acts on:
 *   - pushes the order into Shippo, ready to fulfil
 *   - emails the customer a confirmation
 *   - emails the team that an order came in
 *
 * Register this URL (https://<domain>/api/webhooks/stripe) in the Stripe
 * Dashboard -> Developers -> Webhooks, listening for checkout.session.completed,
 * then put its signing secret in STRIPE_WEBHOOK_SECRET.
 *
 * Idempotent by design: Shippo order creation is keyed on the Stripe session
 * id (skips if one already exists) and both emails carry an Idempotency-Key
 * derived from the session id, so a Stripe retry after a transient failure
 * here can't create a duplicate Shippo order or double-send an email.
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!key || !webhookSecret) {
    console.error("[webhook/stripe] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not set")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  const stripe = new Stripe(key)
  const signature = req.headers.get("stripe-signature")
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    if (!signature) throw new Error("Missing stripe-signature header")
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error("[webhook/stripe] signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true })
  }

  const sessionId = (event.data.object as Stripe.Checkout.Session).id

  try {
    // Re-fetch rather than trust the webhook payload's embedded object --
    // it doesn't reliably carry every field (e.g. total_details) unless expanded.
    // line_items.data.price.product is expanded too, to read back the slug
    // metadata set at checkout (see app/api/checkout/route.ts) for Shippo's weight.
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "total_details.breakdown"],
    })

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true })
    }

    const customerEmail = session.customer_details?.email ?? undefined
    const shippingAddress = session.collected_information?.shipping_details ?? null

    const subtotalCents = session.amount_subtotal ?? 0
    // amount_total on both shipping_cost and line items is tax-inclusive;
    // amount_subtotal is pre-tax. Use the pre-tax figures consistently here
    // (matching subtotalCents above) and let taxCents carry all the tax --
    // items' and shipping's -- as one combined figure, same as the cart UI.
    const shippingCents = session.shipping_cost?.amount_subtotal ?? 0
    const taxCents = session.total_details?.amount_tax ?? 0
    const totalCents = session.amount_total ?? 0

    const items = (session.line_items?.data ?? []).map((li) => {
      const product = li.price?.product
      const slug = typeof product === "object" && product && "metadata" in product ? product.metadata.slug : undefined
      return {
        name: li.description ?? "Item",
        qty: li.quantity ?? 1,
        // Pre-tax, to match subtotalCents (session.amount_subtotal) below --
        // li.amount_total is tax-inclusive and would double-count tax between
        // the line rows and the separate tax row in the email/Shippo order.
        priceCents: li.amount_subtotal ?? 0,
        sellable: slug ? getSellable(slug) : undefined,
      }
    })

    const shipState = shippingAddress?.address?.state
    if (shipState && EXCLUDED_SHIPPING_STATES.includes(shipState)) {
      // Stripe Checkout only restricts shipping by country, not state, so an
      // order to AK/HI/a territory can still get placed and paid here. Skip
      // Shippo + the normal confirmation entirely; alert the team to refund
      // manually rather than doing that automatically.
      const orderSummary = { orderNumber: session.id, items, subtotalCents, shippingCents, taxCents, totalCents }
      if (RESEND_ENABLED) {
        if (customerEmail) {
          await sendUnshippableRegionNotice(customerEmail, orderSummary)
        }
        const addr = shippingAddress.address
        const addressLine = [addr?.line1, addr?.line2, addr?.city, addr?.state, addr?.postal_code]
          .filter(Boolean)
          .join(", ")
        await sendUnshippableRegionAlert(ORDER_NOTIFICATION_EMAIL, {
          ...orderSummary,
          customerEmail,
          shippingAddress: addressLine,
          stripeDashboardUrl: `https://dashboard.stripe.com/${session.livemode ? "" : "test/"}checkout/sessions/${session.id}`,
        })
      }
      return NextResponse.json({ received: true })
    }

    if (SHIPPO_ENABLED && shippingAddress?.address) {
      const addr = shippingAddress.address
      // Shippo requires *some* weight on an order — sum each line's estimated
      // shipping weight (content/products.ts, correct it there if it's off).
      // Unmatched lines (shouldn't happen -- metadata is set at checkout) fall
      // back to 16oz each rather than failing the whole order.
      const weightOz = items.reduce((sum, i) => sum + (i.sellable?.shipWeightOz ?? 16) * i.qty, 0)
      await createShippoOrder({
        stripeSessionId: session.id,
        placedAt: new Date((session.created ?? Date.now() / 1000) * 1000).toISOString(),
        toAddress: {
          name: shippingAddress.name || customerEmail || "Charah customer",
          street1: addr.line1 ?? "",
          street2: addr.line2 ?? undefined,
          city: addr.city ?? "",
          state: addr.state ?? "",
          zip: addr.postal_code ?? "",
          country: addr.country ?? "US",
          email: customerEmail,
        },
        lineItems: items.map((i) => ({
          quantity: i.qty,
          title: i.name,
          total_price: (i.priceCents / 100).toFixed(2),
          currency: "usd",
        })),
        weightOz,
        subtotalCents,
        shippingCents,
        taxCents,
        totalCents,
      })
    }

    const orderSummary = { orderNumber: session.id, items, subtotalCents, shippingCents, taxCents, totalCents }

    if (RESEND_ENABLED) {
      if (customerEmail) {
        // One send, BCC'd to the team -- not two separate emails (Resend's
        // free tier caps monthly sends, no need to spend two on one order).
        await sendOrderConfirmation(customerEmail, orderSummary)
      } else {
        // No email on file somehow -- still let the team know a paid order came in.
        const addr = shippingAddress?.address
        const addressLine = addr
          ? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code].filter(Boolean).join(", ")
          : undefined
        await sendInternalOrderNotification(ORDER_NOTIFICATION_EMAIL, { ...orderSummary, shippingAddress: addressLine })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("[webhook/stripe] processing error for session", sessionId, ":", err)
    // Non-200 so Stripe retries with backoff -- safe to retry, see idempotency note above.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
