import Image from "next/image"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Our Story",
  description: "Clara and Flora, two close friends from Hong Kong, and the five-year road to Charah.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <>
      <div className="container pt-10 md:pt-14">
        <h1 className="text-eyebrow font-semibold uppercase text-charah-red">Our Story</h1>
      </div>
      <div className="container grid items-start gap-10 py-section md:grid-cols-2 md:gap-16">
        <div className="space-y-5 text-body-lg text-charah-stone">
          <p>
            We are Clara and Flora. We are close friends who grew up in Hong Kong, lived
            internationally, and are now based in Brooklyn, New York.
          </p>
          <p>
            For close to two decades in the US, we craved eating char siu (叉燒). Char siu is an
            iconic Hong Kong dish: juicy, thick-cut slices of meat (typically pork) glistening
            beneath a caramelized, charred coat, striking the perfect balance between sweet and
            savory, with a hint of rose wine fragrance and a depth no other barbecue reaches.
          </p>
          <p>Then the pandemic hit. When some people tested sourdough recipes, we decided to make char siu.</p>
          <p>
            Char siu is famously hard to cook (IYKYK). We tried store-bought sauces and recipes we
            found online, but nothing gave us consistent results. So we decided to take matters
            into our own hands.
          </p>
          <p>
            Our shared desire to eat authentic Hong Kong-style char siu set us on a five-year quest
            to perfect the recipe, squeezed in over nights and weekends around our careers in law
            and tech. After many tastings, countless iterations, and validating it with our closest
            friends (and often harshest critics!), we finally landed on a flavor that tastes just
            like home.
          </p>
          <p>
            That&rsquo;s when it hit us. If we couldn&rsquo;t find it on the shelves, we&rsquo;d
            have to put it there ourselves — so more people could make authentic char siu at home
            in a few simple steps, and take the flavor even further as a marinade, a glaze, a
            stir-fry sauce, or even a dip.
          </p>
          <p>
            We created Charah to put Cantonese flavors on the map, starting with our char siu BBQ
            sauce and chili oil.
          </p>
          <p>All our products are made in small batches, right here in Brooklyn.</p>
          <p>
            Born in Hong Kong. Made in Brooklyn. We are just getting started and excited to bring
            you on our journey!
          </p>
          <div className="pt-2">
            <p className="font-serif text-h4 text-charah-ink">Clara &amp; Flora</p>
            <p className="text-body-sm text-charah-stone">Your Makers at Charah</p>
          </div>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl md:sticky md:top-24">
          <Image
            src="/about-us.jpg"
            alt="Flora and Clara on a Brooklyn rooftop with a bowl of char siu pork and bottles of Charah sauce"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 45vw, 90vw"
          />
        </div>
      </div>
    </>
  )
}
