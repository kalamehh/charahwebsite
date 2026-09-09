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
}

const sellables: Sellable[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  priceCents: p.priceCents,
  image: p.image,
  href: `/products/${p.slug}`,
}))

export function getSellable(slug: string): Sellable | undefined {
  return sellables.find((s) => s.slug === slug)
}

export type CartLine = { slug: string; qty: number }

/** Shipping — flat rate under the threshold, free at or above it. */
export const SHIPPING = {
  flatCents: 499,
  freeThresholdCents: 5000,
  note: "$4.99 flat shipping — free on orders over $50.",
  timing:
    "We ship every weekend via USPS, which takes 2–5 business days depending on your delivery address. Once we ship, you'll receive a tracking number by email. We ship within the US only.",
}

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
