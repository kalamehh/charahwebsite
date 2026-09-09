import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { buildMetadata } from "@/lib/seo"
import { products } from "@/content/products"

export const metadata = buildMetadata({
  title: "Sauces",
  description: "Char Siu BBQ Sauce and Cantonese Chili Oil — small-batch, made in Brooklyn.",
  path: "/products",
})

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Signature sauces"
        title="Two jars, endless dinners"
        intro="Start with the Original char siu marinade. Add the Chili Oil when you want a little danger."
      />
      <div className="container grid gap-10 py-section md:grid-cols-2 md:gap-14">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                className="object-contain p-8 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(min-width: 768px) 45vw, 90vw"
              />
            </div>
            <h2 className="mt-6 font-serif text-h3 text-charah-ink">{product.name}</h2>
            <p className="mt-1 text-body-sm uppercase tracking-wide text-charah-red">{product.tagline}</p>
            <p className="mt-3 max-w-md text-body text-charah-stone">{product.blurb}</p>
            <span className="mt-4 text-body-sm font-medium text-charah-red underline underline-offset-4 group-hover:text-charah-red-dark">
              Learn more
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
