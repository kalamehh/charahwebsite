"use client"

import { useEffect } from "react"
import { useCart } from "@/components/cart/cart-provider"

/**
 * Renders nothing — clears the cart once the order succeeds.
 *
 * Waits for `hydrated`: on a fresh page load (the normal case here, since
 * Stripe redirects back via a full navigation) CartProvider mounts at the
 * same time as this component and only learns the real cart contents from
 * localStorage in its own effect, which — as a descendant-before-ancestor
 * effect order — fires *after* this one. Clearing immediately on mount was
 * racing that read and getting silently overwritten by the stale cart a
 * moment later. Depending on `hydrated` re-runs this effect once the real
 * state has loaded, so the clear actually sticks.
 */
export function ClearCart() {
  const { clear, hydrated } = useCart()
  useEffect(() => {
    if (hydrated) clear()
  }, [hydrated, clear])
  return null
}
