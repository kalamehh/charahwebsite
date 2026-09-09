import Image from "next/image"
import { PageHeader } from "@/components/page-header"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "About Us",
  description: "Flora and Clara, two Hong Kongers in Brooklyn, and the five-year road to Charah.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Two Hong Kongers, one Brooklyn kitchen"
      />
      <div className="container grid items-start gap-10 py-section md:grid-cols-2 md:gap-16">
        <div className="space-y-5 text-body-lg text-charah-stone">
          <p>
            We are Flora and Clara, the makers of Charah. We share deep roots in Hong Kong, were
            globally raised, and are now proudly rooted in Brooklyn, New York.
          </p>
          <p>
            Caught between our identities as proud Hong Kongers and Americans, Charah is our way of
            honouring the city that shaped and fuelled us.
          </p>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <Image
            src="/about-us.png"
            alt="Flora and Clara, the makers of Charah"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 45vw, 90vw"
          />
        </div>
      </div>
    </>
  )
}
