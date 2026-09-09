import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { buildMetadata } from "@/lib/seo"
import { getProduct, products } from "@/content/products"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { SHIPPING } from "@/lib/commerce"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return buildMetadata({
    title: product.name,
    description: product.blurb,
    path: `/products/${product.slug}`,
  })
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const price = (product.priceCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })

  return (
    <article className="container grid gap-10 py-section md:grid-cols-2 md:gap-16">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white md:sticky md:top-24 md:self-start">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          priority
          className="object-contain p-10 mix-blend-multiply"
          sizes="(min-width: 768px) 45vw, 90vw"
        />
      </div>

      <div>
        <p className="text-eyebrow font-semibold uppercase text-charah-red">{product.tagline}</p>
        <h1 className="mt-2 font-serif text-h1 text-charah-ink">{product.name}</h1>
        <p className="mt-2 text-body-lg text-charah-stone">
          {price} · {product.netWeight}
        </p>

        <div className="mt-6 space-y-4 text-body text-charah-stone">
          {product.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <ul className="mt-6 space-y-2 text-body text-charah-ink">
          {product.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span aria-hidden className="text-charah-red">
                &bull;
              </span>
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border border-charah-hairline bg-white p-5">
          <AddToCartButton slug={product.slug} label={`Add to cart — ${price}`} />
          <p className="mt-3 text-body-sm text-charah-stone">
            {SHIPPING.note}{" "}
            <Link href="/store-locator" className="font-medium text-charah-red underline underline-offset-4">
              Or find Charah in a shop
            </Link>
            .
          </p>
        </div>

        <dl className="mt-8 space-y-3 border-t border-charah-hairline pt-6 text-body-sm">
          <div>
            <dt className="font-semibold text-charah-ink">Ingredients</dt>
            <dd className="text-charah-stone">{product.ingredients}</dd>
          </div>
          <div>
            <dt className="font-semibold text-charah-ink">Allergens</dt>
            <dd className="text-charah-stone">{product.allergens}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
