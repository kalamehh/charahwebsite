import Image from "next/image"
import Link from "next/link"
import { home } from "@/content/home"

export function StoryTeaser() {
  const { storyTeaser } = home

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div>
        <p className="text-eyebrow font-semibold uppercase text-charah-red">{storyTeaser.eyebrow}</p>
        <h2 className="mt-3 font-serif text-h2 text-charah-cream">{storyTeaser.heading}</h2>
        <p className="mt-4 text-body-lg text-charah-cream/75">{storyTeaser.body}</p>
        <Link
          href={storyTeaser.cta.href}
          className="mt-5 inline-block text-body-sm font-medium text-charah-cream underline underline-offset-4"
        >
          {storyTeaser.cta.label} &rarr;
        </Link>
      </div>
      <div className="relative h-[360px] overflow-hidden rounded-2xl md:h-[440px]">
        <Image
          src="/about-us.png"
          alt="Flora and Clara, the makers of Charah"
          fill
          className="object-cover object-top"
          sizes="(min-width: 768px) 45vw, 90vw"
        />
      </div>
    </div>
  )
}
