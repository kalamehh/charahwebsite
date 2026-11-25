import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { RecipeGrid } from "@/components/recipe-grid"
import { buildMetadata } from "@/lib/seo"

/**
 * Where Charah's own printed QR code points (https://www.charah-foods.com/qr).
 * It shows the recipes under its own address so that scans can be counted: in
 * Vercel Web Analytics, visitors to /qr are people who came from the code.
 *
 * Keep it that way -- don't link to it from the site or add it to the sitemap,
 * and don't remove or rename it: the address is printed on physical material.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: "Recipes",
    description: "What to cook with Charah — char siu pork, chicken, tofu, noodles, and more.",
    // Canonical is the real recipes page, so search engines don't treat this as a duplicate.
    path: "/recipes",
  }),
  robots: { index: false, follow: true },
}

export default function QrLandingPage() {
  return (
    <>
      <PageHeader eyebrow="From the kitchen" title="Recipes" />
      <RecipeGrid />
    </>
  )
}
