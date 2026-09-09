import Link from "next/link"
import { home } from "@/content/home"
import { stockists } from "@/content/stockists"

export function StockistsTeaser() {
  const { stockistsTeaser } = home

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-16">
      <div>
        <p className="text-eyebrow font-semibold uppercase text-charah-red">{stockistsTeaser.eyebrow}</p>
        <h2 className="mt-3 font-serif text-h2 text-charah-ink">{stockistsTeaser.heading}</h2>
        <p className="mt-3 text-body-lg text-charah-stone">{stockistsTeaser.body}</p>
        <Link
          href={stockistsTeaser.cta.href}
          className="mt-5 inline-block text-body-sm font-medium text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
        >
          {stockistsTeaser.cta.label} &rarr;
        </Link>
      </div>
      <ul className="divide-y divide-charah-hairline border-y border-charah-hairline">
        {stockists.map((s) => (
          <li key={s.name} className="flex items-baseline justify-between gap-4 py-3.5">
            <span className="text-body font-medium text-charah-ink">{s.name}</span>
            <span className="text-body-sm text-charah-stone">{s.region}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
