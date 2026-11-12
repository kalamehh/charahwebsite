import { PageHeader } from "@/components/page-header"
import { CheckoutStep } from "@/components/cart/checkout-step"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Review your Charah order before payment.",
  path: "/checkout",
})

export default function CheckoutPage() {
  return (
    <>
      <PageHeader eyebrow="Checkout" title="Review your order" />
      <CheckoutStep />
    </>
  )
}
