"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "@/components/cart/cart-provider"
import { getSellable, priceCart, formatUsd, SHIPPING } from "@/lib/commerce"

export function CartSheet() {
  const { lines, count, setQty, remove, open, setOpen } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { subtotalCents, shippingCents } = priceCart(lines)

  async function checkout() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          returnTo: window.location.pathname + window.location.search,
        }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed")
      window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-charah-ink"
        aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      >
        <ShoppingBag className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-charah-red px-1 text-[0.65rem] font-semibold text-charah-cream">
            {count}
          </span>
        ) : null}
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-charah-cream sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="font-serif text-h3 text-charah-ink">Your cart</SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-8 w-8 text-charah-stone" />
            <p className="text-body text-charah-stone">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-charah-hairline overflow-y-auto py-2">
              {lines.map((line) => {
                const s = getSellable(line.slug)
                if (!s) return null
                return (
                  <li key={line.slug} className="flex gap-3 py-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                      <Image
                        src={s.image}
                        alt=""
                        fill
                        className="object-contain p-1 mix-blend-multiply"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="text-body font-medium text-charah-ink">{s.name}</p>
                        <button
                          type="button"
                          onClick={() => remove(line.slug)}
                          className="text-charah-stone hover:text-charah-red"
                          aria-label={`Remove ${s.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-body-sm text-charah-stone">{formatUsd(s.priceCents)}</p>
                      <div className="mt-auto flex items-center gap-3">
                        <div className="flex items-center rounded-md border border-charah-hairline">
                          <button
                            type="button"
                            onClick={() => setQty(line.slug, line.qty - 1)}
                            className="flex h-8 w-8 items-center justify-center text-charah-ink hover:text-charah-red"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-body-sm tabular-nums">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(line.slug, line.qty + 1)}
                            className="flex h-8 w-8 items-center justify-center text-charah-ink hover:text-charah-red"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-body-sm font-medium text-charah-ink">
                          {formatUsd(s.priceCents * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="border-t border-charah-hairline pt-4">
              <div className="flex justify-between text-body">
                <span className="text-charah-stone">Subtotal</span>
                <span className="font-medium text-charah-ink">{formatUsd(subtotalCents)}</span>
              </div>
              <div className="mt-1 flex justify-between text-body-sm">
                <span className="text-charah-stone">Shipping</span>
                <span className="text-charah-stone">
                  {shippingCents === 0 ? "Free" : formatUsd(shippingCents)}
                </span>
              </div>
              <p className="mt-2 text-body-sm text-charah-stone">{SHIPPING.note}</p>

              {error ? <p className="mt-3 text-body-sm text-charah-red">{error}</p> : null}

              <button
                type="button"
                onClick={checkout}
                disabled={submitting}
                className="mt-4 w-full rounded-lg bg-charah-red px-5 py-3 text-body-sm font-semibold text-charah-cream transition-colors hover:bg-charah-red-dark disabled:opacity-60"
              >
                {submitting ? "Taking you to checkout…" : "Checkout"}
              </button>
              <p className="mt-2 text-center text-body-sm text-charah-stone">
                Secure checkout powered by Stripe.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
