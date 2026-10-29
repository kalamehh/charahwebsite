import Link from "next/link"
import { home } from "@/content/home"
import { stockists } from "@/content/stockists"
import { StockistMap } from "@/components/stockist-map"

export function StockistsTeaser() {
  const { stockistsTeaser } = home
  const { featured } = stockistsTeaser

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-16">
      <div>
        <p className="text-eyebrow font-semibold uppercase text-charah-red">{stockistsTeaser.eyebrow}</p>
        <h2 className="mt-3 font-serif text-h2 text-charah-ink">{stockistsTeaser.heading}</h2>
        <p className="mt-3 text-body-lg text-charah-stone">{stockistsTeaser.body}</p>
        <p className="mt-3 text-body text-charah-stone">
          Find us at {featured.slice(0, -1).join(", ")} and {featured[featured.length - 1]}.
        </p>
        <Link
          href={stockistsTeaser.cta.href}
          className="mt-5 inline-block text-body-sm font-medium text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
        >
          {stockistsTeaser.cta.label} &rarr;
        </Link>
      </div>
      <StockistMap stockists={stockists} className="h-[320px] md:h-[400px]" lockTouchDrag />
    </div>
  )
}
