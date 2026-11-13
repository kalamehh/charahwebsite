import { PageHeader } from "@/components/page-header"
import { StockistMap } from "@/components/stockist-map"
import { buildMetadata } from "@/lib/seo"
import { getProduct } from "@/content/products"
import { googleMapsUrl, stockists, stockistsByArea } from "@/content/stockists"

export const metadata = buildMetadata({
  title: "Store Locator",
  description: "Independent grocers and butcher shops that carry Charah.",
  path: "/store-locator",
})

export default function WhereToBuyPage() {
  const areas = stockistsByArea()

  return (
    <>
      <PageHeader
        eyebrow="Where to buy"
        title="Find Charah near you"
      />
      <div className="container py-section">
        <StockistMap stockists={stockists} areaButtons />

        <div className="mt-12 space-y-14">
          {areas.map((area) => (
            <section key={area.area} aria-labelledby={`area-${area.area}`}>
              <h2 id={`area-${area.area}`} className="font-serif text-h3 text-charah-ink">
                {area.area}
              </h2>
              <div className="mt-4 space-y-8">
                {area.groups.map((group) => (
                  <div key={group.label ?? area.area}>
                    {group.label ? (
                      <h3 className="text-eyebrow font-semibold uppercase text-charah-red">{group.label}</h3>
                    ) : null}
                    <ul
                      className={`divide-y divide-charah-hairline border-y border-charah-hairline ${group.label ? "mt-3" : ""}`}
                    >
                      {group.items.map((s) => (
                        <li
                          key={`${s.name}-${s.address}`}
                          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                        >
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
                              {/* The neighbourhood leads the address line. Skipped where it's just the town
                                  name again (Centerbrook, Cold Spring), so it's never said twice. */}
                              {s.region.toLowerCase() !== s.city.toLowerCase() ? (
                                <>
                                  <span className="font-medium text-charah-ink">{s.region}</span> ·{" "}
                                </>
                              ) : null}
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
            </section>
          ))}
        </div>

        <p className="mt-12 text-body-sm text-charah-stone">
          Own a shop and want to carry Charah? Email{" "}
          <a
            href="mailto:wholesale@charah-foods.com"
            className="font-medium text-charah-red underline underline-offset-4"
          >
            wholesale@charah-foods.com
          </a>
          .
        </p>
      </div>
    </>
  )
}
