"use client"

import { useEffect } from "react"
import { useCart } from "@/components/cart/cart-provider"

/** Renders nothing — clears the cart once when the order succeeds. */
export function ClearCart() {
  const { clear } = useCart()
  useEffect(() => {
    clear()
  }, [clear])
  return null
}
