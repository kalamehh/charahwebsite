import Image from "next/image"
import Link from "next/link"
import { home } from "@/content/home"
import { PREVIEW_LIMITED } from "@/lib/preview"

export function Hero() {
  const { hero } = home
  // The shop isn't shown in limited-preview mode — point the primary CTA
  // at the store locator instead.
  const ctaPrimary = PREVIEW_LIMITED
    ? { label: "Find a store", href: "/store-locator" }
    : hero.ctaPrimary

  return (
    <section className="relative isolate flex min-h-[88svh] items-stretch overflow-hidden bg-charah-brownstone mb-[-1px] sm:h-[90vh] sm:min-h-[600px]">
      <Image
        src="/saucestock.jpg"
        alt="Charah Char Siu BBQ Sauce and Chili Oil jars on a Brooklyn stoop"
        fill
        priority
        sizes="100vw"
        className="origin-top scale-[1.16] object-cover object-center sm:origin-center sm:translate-y-[1%] sm:scale-[1.22]"
      />

      {/* Scrim — backs the text, which sits over the bottle tops on sm+ */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-charah-ink/70 via-charah-ink/35 to-transparent sm:h-[62%]"
      />

      <div className="container relative z-10 flex flex-col justify-start py-12 sm:py-0 sm:pt-16 md:pt-20">
        <p className="text-eyebrow font-semibold uppercase tracking-[0.18em] text-charah-cream [text-shadow:0_1px_10px_rgba(14,11,10,0.8)]">
          {hero.logoLine}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-display-xl uppercase text-charah-cream [text-shadow:0_2px_18px_rgba(14,11,10,0.5)]">
          {hero.headline}
        </h1>
        <p className="mt-3 max-w-xl text-body-lg text-charah-cream [text-shadow:0_1px_10px_rgba(14,11,10,0.65)]">
          {hero.sub}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={ctaPrimary.href}
            className="rounded-lg bg-charah-red px-5 py-3 text-body-sm font-semibold text-charah-cream transition-colors hover:bg-charah-red-dark"
          >
            {ctaPrimary.label}
          </Link>
          <Link
            href={hero.ctaSecondary.href}
            className="rounded-lg border border-charah-cream/80 bg-charah-ink/20 px-5 py-3 text-body-sm font-semibold text-charah-cream backdrop-blur-[2px] transition-colors hover:bg-charah-cream/15"
          >
            {hero.ctaSecondary.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
