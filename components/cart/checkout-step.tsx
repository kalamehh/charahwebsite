"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, AlertCircle } from "lucide-react"
import { useCart } from "@/components/cart/cart-provider"
import { formatUsd, getSellable, priceCart, SHIPPING } from "@/lib/commerce"

type Applied = { code: string; discountCents: number; label: string; email: string }

const inputClass =
  "h-11 w-full rounded-lg border border-charah-hairline bg-white px-3 text-body text-charah-ink placeholder:text-charah-stone/70 focus:border-charah-red focus:outline-none focus:ring-2 focus:ring-charah-red/20"

/**
 * The step between the cart and Stripe's payment page: review the order, give
 * an email, optionally apply a promo code. "Continue to payment" starts Stripe
 * Checkout with that email locked in and the code attached -- the server
 * re-checks the code first (app/api/checkout), so what's shown here is a preview.
 */
export function CheckoutStep() {
  const { lines, hydrated, setOpen } = useCart()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [applied, setApplied] = useState<Applied | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { items, subtotalCents, shippingCents } = priceCart(lines)
  // A discount only counts while it was checked for this exact email -- change
  // the email and it has to be applied again, since "once per email" codes
  // depend on who is asking.
  const discount = applied && applied.email === email.trim() ? applied : null
  const discountCents = discount?.discountCents ?? 0
  const totalCents = subtotalCents - discountCents + shippingCents

  async function applyCode(): Promise<boolean> {
    setPromoError(null)
    if (!code.trim()) return false
    if (!email.trim()) {
      setPromoError("Enter your email first, then apply the code.")
      return false
    }
    setApplying(true)
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email: email.trim(), lines }),
      })
      const data = (await res.json()) as {
        code?: string
        discountCents?: number
        label?: string
        error?: string
      }
      if (!res.ok || data.code === undefined || data.discountCents === undefined) {
        setApplied(null)
        setPromoError(data.error || "Couldn't check that code. Try again.")
        return false
      }
      setApplied({ code: data.code, discountCents: data.discountCents, label: data.label ?? "", email: email.trim() })
      return true
    } catch {
      setPromoError("Couldn't check that code. Try again.")
      return false
    } finally {
      setApplying(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.trim()) {
      setError("Enter your email to continue.")
      return
    }
    setSubmitting(true)
    // A code typed but never applied (or applied for a different email) gets
    // checked now, so the total shown always matches what Stripe will charge.
    if (code.trim() && !discount) {
      const ok = await applyCode()
      if (!ok) {
        setSubmitting(false)
        return
      }
    }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          email: email.trim(),
          promoCode: code.trim(),
          returnTo: "/checkout",
        }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed")
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  if (!hydrated) {
    return <div className="container py-section" aria-busy="true" />
  }

  if (items.length === 0) {
    return (
      <div className="container py-section">
        <p className="text-body text-charah-stone">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-body-sm font-medium text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
        >
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-section">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <section aria-labelledby="order-heading" className="rounded-2xl border border-charah-hairline bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h2 id="order-heading" className="font-serif text-h3 text-charah-ink">
              Your order
            </h2>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-body-sm font-medium text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
            >
              Edit cart
            </button>
          </div>

          <ul className="mt-4 divide-y divide-charah-hairline">
            {items.map(({ sellable, qty }) => {
              const s = getSellable(sellable.slug)
              if (!s) return null
              return (
                <li key={s.slug} className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-charah-cream">
                    <Image src={s.image} alt="" fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body font-medium text-charah-ink">{s.name}</p>
                    <p className="text-body-sm text-charah-stone">Qty {qty}</p>
                  </div>
                  <span className="text-body font-medium text-charah-ink">{formatUsd(s.priceCents * qty)}</span>
                </li>
              )
            })}
          </ul>

          <dl className="mt-2 space-y-1.5 border-t border-charah-hairline pt-4 text-body-sm">
            <div className="flex justify-between">
              <dt className="text-charah-stone">Subtotal</dt>
              <dd className="text-charah-ink">{formatUsd(subtotalCents)}</dd>
            </div>
            {discount ? (
              <div className="flex justify-between text-green-700">
                <dt>
                  {discount.code}, {discount.label}
                </dt>
                <dd>−{formatUsd(discountCents)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-charah-stone">Shipping</dt>
              <dd className="text-charah-ink">{shippingCents === 0 ? "Free" : formatUsd(shippingCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charah-stone">Tax</dt>
              <dd className="text-charah-stone">Calculated at payment</dd>
            </div>
            <div className="flex justify-between border-t border-charah-hairline pt-3 text-body font-medium text-charah-ink">
              <dt>Total before tax</dt>
              <dd>{formatUsd(totalCents)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-body-sm text-charah-stone">{SHIPPING.note}</p>
        </section>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-2xl border border-charah-hairline bg-white p-6"
          aria-labelledby="details-heading"
        >
          <h2 id="details-heading" className="font-serif text-h3 text-charah-ink">
            Your details
          </h2>

          <label htmlFor="checkout-email" className="mt-4 block text-body-sm font-medium text-charah-ink">
            Email
          </label>
          <input
            id="checkout-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} mt-1.5`}
            required
          />
          <p className="mt-1.5 text-body-sm text-charah-stone">For receipt and order tracking.</p>

          <label htmlFor="checkout-promo" className="mt-5 block text-body-sm font-medium text-charah-ink">
            Promo code <span className="font-normal text-charah-stone">(optional)</span>
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id="checkout-promo"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setApplied(null)
                setPromoError(null)
              }}
              className={inputClass}
              aria-describedby="promo-status"
            />
            <button
              type="button"
              onClick={() => void applyCode()}
              disabled={applying || !code.trim()}
              className="h-11 flex-shrink-0 rounded-lg border border-charah-hairline bg-white px-5 text-body-sm font-semibold text-charah-ink transition-colors hover:border-charah-ink disabled:opacity-50"
            >
              {applying ? "Checking…" : "Apply"}
            </button>
          </div>
          <p id="promo-status" aria-live="polite" className="mt-1.5 min-h-5 text-body-sm">
            {discount ? (
              <span className="flex items-center gap-1.5 text-green-700">
                <Check className="h-4 w-4" aria-hidden="true" />
                {discount.code} applied, {discount.label}
              </span>
            ) : promoError ? (
              <span className="flex items-center gap-1.5 text-charah-red">
                <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {promoError}
              </span>
            ) : null}
          </p>

          {error ? (
            <p role="alert" className="mt-3 text-body-sm text-charah-red">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-lg bg-charah-red px-5 py-3 text-body-sm font-semibold text-charah-cream transition-colors hover:bg-charah-red-dark disabled:opacity-60"
          >
            {submitting ? "Taking you to payment…" : "Continue to payment"}
          </button>
          <p className="mt-2 text-center text-body-sm text-charah-stone">
            Next: shipping address and card, on Stripe.
          </p>
        </form>
      </div>
    </div>
  )
}
