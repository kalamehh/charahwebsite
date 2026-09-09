import { Hero } from "@/components/home/hero"
import { Section } from "@/components/section"
import { StoryTeaser } from "@/components/home/story-teaser"
import { StockistsTeaser } from "@/components/home/stockists-teaser"

export default function Home() {
  return (
    <>
      <Hero />

      <Section tone="ink">
        <StoryTeaser />
      </Section>

      <Section tone="cream">
        <StockistsTeaser />
      </Section>
    </>
  )
}
