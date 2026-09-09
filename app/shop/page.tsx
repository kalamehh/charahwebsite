import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { buildMetadata } from "@/lib/seo"
import { products } from "@/content/products"
import { SHIPPING, formatUsd } from "@/lib/commerce"
import { site } from "@/content/site"

export const metadata = buildMetadata({
  title: "Shop",
  description: "Buy Charah's Char Siu BBQ Sauce and Cantonese Chili Oil online, shipped from Brooklyn.",
  path: "/shop",
})

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Charah, shipped from Brooklyn"
        intro={SHIPPING.note}
      />

      <div className="container py-section">
        <div className="grid gap-8 sm:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex flex-col rounded-2xl border border-charah-hairline bg-white p-6"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  className="object-contain mix-blend-multiply"
                  sizes="(min-width: 640px) 45vw, 80vw"
                />
              </div>
              <h2 className="mt-4 font-serif text-h3 text-charah-ink">{product.name}</h2>
              <p className="mt-1 flex-1 text-body text-charah-stone">{product.blurb}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-body-lg font-medium text-charah-ink">
                  {formatUsd(product.priceCents)}
                </span>
                <Link
                  href={`/products/${product.slug}`}
                  className="text-body-sm font-medium text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
                >
                  Details
                </Link>
              </div>

              <AddToCartButton slug={product.slug} className="mt-4 w-full" />
            </div>
          ))}
        </div>

        <p className="mt-8 text-body-sm text-charah-stone">
          Secure checkout powered by Stripe. {SHIPPING.note}
        </p>

        <div className="mt-12 rounded-2xl border border-charah-hairline bg-white p-8">
          <h2 className="font-serif text-h3 text-charah-ink">Shipping</h2>
          <p className="mt-2 max-w-xl text-body text-charah-stone">{SHIPPING.timing}</p>
        </div>

        <div className="mt-8 rounded-2xl bg-charah-ink p-8 text-charah-cream">
          <h2 className="font-serif text-h3">Questions about an order?</h2>
          <p className="mt-2 max-w-md text-body text-charah-cream/70">
            Email us at{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>
            . Prefer to buy in person?
          </p>
          <Link
            href="/store-locator"
            className="mt-4 inline-block text-body-sm font-medium text-charah-cream underline underline-offset-4"
          >
            Find a stockist &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
