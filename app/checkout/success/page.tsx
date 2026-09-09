import Link from "next/link"
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

export default function CheckoutSuccessPage() {
  return (
    <>
      <ClearCart />
      <PageHeader
        eyebrow="Thank you"
        title="Order confirmed"
        intro="Your payment went through and we've got your order. A receipt is on its way to your email."
      />
      <div className="container py-section">
        <p className="max-w-xl text-body text-charah-stone">
          {SHIPPING.timing} Questions about your order? Email{" "}
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
