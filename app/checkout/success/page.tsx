import Link from "next/link"
import Stripe from "stripe"
import { PageHeader } from "@/components/page-header"
import { ClearCart } from "@/components/cart/clear-cart"
import { buildMetadata } from "@/lib/seo"
import { site } from "@/content/site"
import { SHIPPING } from "@/lib/commerce"

export const metadata = buildMetadata({
  title: "Order confirmed",
  description: "Thanks for your order.",
  path: "/checkout/success",
})

/**
 * The redirect here only means Stripe sent the shopper back — it is not proof
 * the payment went through (this URL is guessable/bookmarkable). Retrieve the
 * session server-side and only show "confirmed" if Stripe itself says it was
 * paid. The webhook (checkout.session.completed) is still the authoritative
 * signal the *business* acts on — this check is just so we don't tell a
 * shopper "you're all set" when they aren't.
 */
async function getVerifiedSession(sessionId: string | undefined) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!sessionId || !key) return null
  try {
    const stripe = new Stripe(key)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session.payment_status === "paid" ? session : null
  } catch {
    return null
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const session = await getVerifiedSession(session_id)

  if (!session) {
    return (
      <>
        <PageHeader
          eyebrow="Order status"
          title="We couldn't confirm that order"
          intro="This link may have expired, or the payment didn't go through. Your cart is still saved if you'd like to try again."
        />
        <div className="container py-section">
          <div className="flex flex-wrap gap-4 text-body-sm font-medium">
            <Link href="/shop" className="text-charah-red underline underline-offset-4 hover:text-charah-red-dark">
              Back to shop
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
            >
              Email us
            </a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ClearCart />
      <PageHeader
        eyebrow="Thank you"
        title="Order confirmed"
        intro="Your payment went through and we've got your order. A receipt is on its way to your email."
      />
      <div className="container py-section">
        <p className="max-w-xl text-body text-charah-stone">{SHIPPING.timing}</p>
        <p className="mt-2 max-w-xl text-body text-charah-stone">
          Questions about your order? Email{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-charah-red underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-body-sm font-medium">
          <Link href="/recipes" className="text-charah-red underline underline-offset-4 hover:text-charah-red-dark">
            Browse recipes
          </Link>
          <Link href="/shop" className="text-charah-red underline underline-offset-4 hover:text-charah-red-dark">
            Back to shop
          </Link>
        </div>
      </div>
    </>
  )
}
