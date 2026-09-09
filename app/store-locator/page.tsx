import { PageHeader } from "@/components/page-header"
import { StockistMap } from "@/components/stockist-map"
import { buildMetadata } from "@/lib/seo"
import { getProduct } from "@/content/products"
import { googleMapsUrl, stockists, stockistsByRegion } from "@/content/stockists"

export const metadata = buildMetadata({
  title: "Store Locator",
  description: "Independent grocers and butcher shops that carry Charah, with online shipping on the way.",
  path: "/store-locator",
})

export default function WhereToBuyPage() {
  const regions = stockistsByRegion()

  return (
    <>
      <PageHeader
        eyebrow="Where to buy"
        title="Find Charah near you"
        intro="We're in a handful of independent shops around New York, with more stockists and online shipping on the way."
      />
      <div className="container py-section">
        <StockistMap stockists={stockists} />

        <div className="mt-12 space-y-12">
          {regions.map((region) => (
            <div key={region.region}>
              <h2 className="font-serif text-h3 text-charah-ink">{region.region}</h2>
              <ul className="mt-4 divide-y divide-charah-hairline border-y border-charah-hairline">
                {region.items.map((s) => (
                  <li key={s.name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                    <div>
                      <p className="text-body-lg font-medium text-charah-ink">
                        <a
                          href={googleMapsUrl(s)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 hover:text-charah-red"
                        >
                          {s.name}
                        </a>
                      </p>
                      <p className="text-body-sm text-charah-stone">
                        {s.address}, {s.city}, {s.state} {s.zip}
                      </p>
                    </div>
                    <p className="text-body-sm text-charah-stone">
                      {s.carries.map((c) => getProduct(c)?.shortName).filter(Boolean).join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 text-body-sm text-charah-stone">
          Own a shop and want to carry Charah? Email{" "}
          <a href="mailto:hello@charah-foods.com" className="font-medium text-charah-red underline underline-offset-4">
            hello@charah-foods.com
          </a>
          .
        </p>
      </div>
    </>
  )
}
