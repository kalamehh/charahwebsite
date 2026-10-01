/**
 * Order emails via Resend's HTTP API (no SDK dependency needed for this few
 * calls). Gated on RESEND_API_KEY, same pattern as Stripe elsewhere in this
 * app — missing key logs a warning and no-ops rather than throwing, so the
 * webhook that calls these doesn't fail just because email isn't wired up
 * yet.
 *
 * Copy in the templates below is a placeholder — swap it for the real thing
 * (shipping ETAs etc.) whenever you send it over. The data plumbing (order
 * number, line items, totals) is the part that matters right now.
 */

import { formatUsd, SHIPPING } from "@/lib/commerce"
import { site } from "@/content/site"

export const RESEND_ENABLED = Boolean(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL || `Charah <orders@charah-foods.com>`

/**
 * Where every internal order-flow email goes — new order, shipped, delivered.
 * All of it: one inbox, not scattered across hello@/wholesale@. Override with
 * ORDER_NOTIFICATION_EMAIL if that inbox isn't set up yet or ever needs to move.
 */
export const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || "orders@charah-foods.com"

export type OrderItem = { name: string; qty: number; priceCents: number }

export type OrderSummary = {
  orderNumber: string
  items: OrderItem[]
  subtotalCents: number
  shippingCents: number
  taxCents: number
  totalCents: number
}

async function send(params: {
  to: string
  bcc?: string
  subject: string
  html: string
  /** Stripe session id (or a derivative) — makes retried webhook calls safe to re-send. */
  idempotencyKey?: string
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn(`[resend] RESEND_API_KEY not set — skipping "${params.subject}" to ${params.to}`)
    return
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(params.idempotencyKey ? { "Idempotency-Key": params.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: FROM,
      to: params.to,
      ...(params.bcc ? { bcc: params.bcc } : {}),
      subject: params.subject,
      html: params.html,
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Resend send failed (${res.status}): ${body.slice(0, 500)}`)
  }
}

function itemsRows(items: OrderItem[]): string {
  return items
    .map(
      (i) => `<tr>
        <td style="padding:6px 0;">${i.name} × ${i.qty}</td>
        <td style="padding:6px 0;text-align:right;">${formatUsd(i.priceCents)}</td>
      </tr>`,
    )
    .join("")
}

function totalsRows(o: OrderSummary): string {
  const rows: [string, number][] = [
    ["Subtotal", o.subtotalCents],
    ["Shipping", o.shippingCents],
    ["Tax", o.taxCents],
  ]
  return (
    rows
      .map(
        ([label, cents]) => `<tr>
          <td style="padding:2px 0;color:#6B6259;">${label}</td>
          <td style="padding:2px 0;text-align:right;color:#6B6259;">${cents === 0 && label === "Shipping" ? "Free" : formatUsd(cents)}</td>
        </tr>`,
      )
      .join("") +
    `<tr><td style="padding:8px 0 0;font-weight:600;">Total</td><td style="padding:8px 0 0;text-align:right;font-weight:600;">${formatUsd(o.totalCents)}</td></tr>`
  )
}

function wrap(bodyHtml: string): string {
  return `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;color:#0E0B0A;">
    <img
      src="${site.url}/email-logo.png"
      width="140"
      height="53"
      alt="Charah"
      style="display:block;width:140px;height:53px;margin:0 0 20px;border:0;"
    />
    ${bodyHtml}
    <p style="margin-top:32px;padding-top:16px;border-top:1px solid #E7DED2;font-size:13px;color:#6B6259;">
      Questions? Email <a href="mailto:${site.email}" style="color:#F43711;">${site.email}</a>.
    </p>
  </div>`
}

/**
 * PLACEHOLDER COPY — swap for the real thing when it's ready.
 *
 * BCCs ORDER_NOTIFICATION_EMAIL by default instead of sending the customer
 * and internal copies as two separate emails — one send instead of two,
 * which matters on Resend's free tier (a low monthly send cap). Pass
 * `notifyInternal: false` for the rare case you want to send this without
 * also alerting the team (there shouldn't be one, normally).
 */
export async function sendOrderConfirmation(to: string, order: OrderSummary, opts: { notifyInternal?: boolean } = {}) {
  const html = wrap(`
    <h1 style="font-size:20px;margin:0 0 8px;">Thanks for your order!</h1>
    <p style="color:#6B6259;line-height:1.6;margin:0 0 4px;">We've got it and we're on it.</p>
    <p style="color:#6B6259;line-height:1.6;margin:0;">Order # <strong>${order.orderNumber.slice(-8)}</strong></p>
    <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;">
      ${itemsRows(order.items)}
      <tr><td colspan="2" style="border-top:1px solid #E7DED2;padding-top:8px;"></td></tr>
      ${totalsRows(order)}
    </table>
    <p style="margin-top:20px;color:#6B6259;line-height:1.6;font-size:14px;">${SHIPPING.timing}</p>
  `)
  await send({
    to,
    bcc: opts.notifyInternal === false ? undefined : ORDER_NOTIFICATION_EMAIL,
    subject: "Your Charah order is confirmed",
    html,
    idempotencyKey: `order-confirm-${order.orderNumber}`,
  })
}

/**
 * PLACEHOLDER COPY — swap for the real thing when it's ready.
 *
 * Fallback only — sendOrderConfirmation's BCC covers the normal case. Use
 * this on its own when there's a paid order but somehow no customer email to
 * send the confirmation to, so it doesn't go completely unnoticed.
 */
export async function sendInternalOrderNotification(
  to: string,
  order: OrderSummary & { customerEmail?: string; shippingAddress?: string },
) {
  const html = wrap(`
    <h1 style="font-size:18px;margin:0 0 8px;">New order — ${formatUsd(order.totalCents)}</h1>
    <p style="color:#6B6259;font-size:14px;">From: ${order.customerEmail ?? "(no email on file)"}</p>
    ${order.shippingAddress ? `<p style="color:#6B6259;font-size:14px;">Ship to: ${order.shippingAddress}</p>` : ""}
    <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">
      ${itemsRows(order.items)}
      ${totalsRows(order)}
    </table>
    <p style="margin-top:16px;font-size:13px;color:#6B6259;">Order ID: ${order.orderNumber}</p>
  `)
  await send({ to, subject: `New order: ${formatUsd(order.totalCents)}`, html, idempotencyKey: `order-internal-${order.orderNumber}` })
}

/**
 * PLACEHOLDER COPY — swap for the real thing when it's ready.
 * BCCs ORDER_NOTIFICATION_EMAIL — one send covers both the customer and the team.
 */
export async function sendShippedNotification(
  to: string,
  params: { orderNumber: string; trackingNumber: string; trackingUrl?: string; carrier?: string },
) {
  const html = wrap(`
    <h1 style="font-size:20px;margin:0 0 8px;">Your order is on its way!</h1>
    <p style="color:#6B6259;line-height:1.6;">
      ${params.carrier ?? "USPS"} tracking number: <strong>${params.trackingNumber}</strong>
    </p>
    ${
      params.trackingUrl
        ? `<p><a href="${params.trackingUrl}" style="color:#F43711;font-weight:600;">Track your package →</a></p>`
        : ""
    }
    <p style="margin-top:16px;font-size:13px;color:#6B6259;">Order ${params.orderNumber.slice(-8)}</p>
  `)
  await send({
    to,
    bcc: ORDER_NOTIFICATION_EMAIL,
    subject: "Your Charah order has shipped",
    html,
    idempotencyKey: `order-shipped-${params.orderNumber}-${params.trackingNumber}`,
  })
}

/**
 * PLACEHOLDER COPY — swap for the real thing when it's ready.
 *
 * Sent instead of sendOrderConfirmation when the shipping address is in a
 * state/territory we don't ship to (see EXCLUDED_SHIPPING_STATES in
 * lib/commerce.ts) -- Stripe Checkout can only block by country, so this is
 * caught after payment, in the webhook. No refund is issued automatically;
 * this just lets the customer know one is coming.
 */
export async function sendUnshippableRegionNotice(to: string, order: OrderSummary) {
  const html = wrap(`
    <h1 style="font-size:20px;margin:0 0 8px;">We can't ship your order</h1>
    <p style="color:#6B6259;line-height:1.6;">
      We're sorry -- we currently only ship within the contiguous US, and your order
      <strong>${order.orderNumber.slice(-8)}</strong> is addressed outside that area. You have not been
      charged; if a charge appears, it will be refunded shortly.
    </p>
    <p style="margin-top:16px;color:#6B6259;line-height:1.6;font-size:14px;">
      Questions in the meantime? Just reply to this email.
    </p>
  `)
  await send({
    to,
    subject: "We can't ship your Charah order",
    html,
    idempotencyKey: `order-unshippable-${order.orderNumber}`,
  })
}

/**
 * PLACEHOLDER COPY — swap for the real thing when it's ready.
 *
 * Founder-facing alert for the same case as sendUnshippableRegionNotice --
 * paid, but addressed to a region we don't ship to. Refunding is left as a
 * manual step (a financial action, deliberately not automated here); this
 * links straight to the payment in the Stripe Dashboard so it's a couple of
 * clicks.
 */
export async function sendUnshippableRegionAlert(
  to: string,
  order: OrderSummary & { customerEmail?: string; shippingAddress?: string; stripeDashboardUrl: string },
) {
  const html = wrap(`
    <h1 style="font-size:18px;margin:0 0 8px;">Action needed — order outside our shipping area</h1>
    <p style="color:#6B6259;font-size:14px;">
      Order <strong>${order.orderNumber.slice(-8)}</strong> from ${order.customerEmail ?? "(no email on file)"} was
      paid, but is addressed to a region we don't ship to (AK, HI, or a US territory). The customer's been emailed
      that no charge will stand; refund it manually in Stripe.
    </p>
    ${order.shippingAddress ? `<p style="color:#6B6259;font-size:14px;">Ship to: ${order.shippingAddress}</p>` : ""}
    <p style="margin-top:12px;"><a href="${order.stripeDashboardUrl}" style="color:#F43711;font-weight:600;">Open payment in Stripe →</a></p>
    <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">
      ${itemsRows(order.items)}
      ${totalsRows(order)}
    </table>
    <p style="margin-top:16px;font-size:13px;color:#6B6259;">Order ID: ${order.orderNumber}</p>
  `)
  await send({
    to,
    subject: `Action needed: refund order outside shipping area`,
    html,
    idempotencyKey: `order-unshippable-alert-${order.orderNumber}`,
  })
}

/**
 * PLACEHOLDER COPY — swap for the real thing when it's ready.
 * BCCs ORDER_NOTIFICATION_EMAIL — one send covers both the customer and the team.
 */
export async function sendDeliveredNotification(to: string, params: { orderNumber: string }) {
  const html = wrap(`
    <h1 style="font-size:20px;margin:0 0 8px;">Delivered!</h1>
    <p style="color:#6B6259;line-height:1.6;">Your Charah order landed. Hope it hits the spot — tag us <a href="https://instagram.com/eat.charah" style="color:#F43711;">@eat.charah</a>.</p>
  `)
  await send({
    to,
    bcc: ORDER_NOTIFICATION_EMAIL,
    subject: "Your Charah order was delivered",
    html,
    idempotencyKey: `order-delivered-${params.orderNumber}`,
  })
}
