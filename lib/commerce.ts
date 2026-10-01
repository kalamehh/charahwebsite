/**
 * Cart + shipping rules, shared by the cart UI and the checkout API route.
 * Prices here are the source of truth for what the server charges — the client
 * cart only sends { slug, qty }.
 */

import { products } from "@/content/products"

export type Sellable = {
  slug: string
  name: string
  priceCents: number
  image: string
  href?: string
  shipWeightOz: number
}

const sellables: Sellable[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  priceCents: p.priceCents,
  image: p.image,
  href: `/products/${p.slug}`,
  shipWeightOz: p.shipWeightOz,
}))

export function getSellable(slug: string): Sellable | undefined {
  return sellables.find((s) => s.slug === slug)
}

export type CartLine = { slug: string; qty: number }

/** Shipping — flat rate under the threshold, free at or above it. */
export const SHIPPING = {
  flatCents: 599,
  freeThresholdCents: 4000,
  note: "$5.99 flat shipping — free on orders over $40.",
  timing:
    "We ship every weekend via USPS, which then takes 2–5 business days depending on your delivery address (contiguous US only). Once we ship, you'll receive a tracking number by email.",
}

/**
 * Postal-code-adjacent "state" values USPS/Stripe treat as domestic but that
 * we don't ship to (see lib/resend.ts + the Stripe webhook) -- pay-by-weight
 * Priority Mail is meaningfully more expensive to these zones than the flat
 * $5.99 covers, on top of longer transit time. Stripe Checkout can only
 * restrict shipping by *country*, not state, so an order from one of these
 * can still get placed and paid; the webhook catches it after the fact.
 */
export const EXCLUDED_SHIPPING_STATES = ["HI", "AK", "PR", "GU", "VI", "AS", "MP"]

export function computeShippingCents(subtotalCents: number): number {
  return subtotalCents >= SHIPPING.freeThresholdCents ? 0 : SHIPPING.flatCents
}

/** Resolve a client cart into priced lines + totals, ignoring unknown slugs. */
export function priceCart(lines: CartLine[]) {
  const items = lines
    .map((l) => {
      const s = getSellable(l.slug)
      const qty = Math.max(1, Math.min(99, Math.floor(l.qty)))
      return s ? { sellable: s, qty } : null
    })
    .filter((x): x is { sellable: Sellable; qty: number } => x !== null)

  const subtotalCents = items.reduce((sum, i) => sum + i.sellable.priceCents * i.qty, 0)
  const shippingCents = computeShippingCents(subtotalCents)

  return { items, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents }
}

export function formatUsd(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
}
