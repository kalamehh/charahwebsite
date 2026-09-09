"use client"

import { useCart } from "@/components/cart/cart-provider"
import { cn } from "@/lib/utils"

export function AddToCartButton({
  slug,
  label = "Add to cart",
  className,
}: {
  slug: string
  label?: string
  className?: string
}) {
  const { add } = useCart()
  return (
    <button
      type="button"
      onClick={() => add(slug)}
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-charah-red px-5 py-3 text-body-sm font-semibold text-charah-cream transition-colors hover:bg-charah-red-dark",
        className,
      )}
    >
      {label}
    </button>
  )
}
