import { PageHeader } from "@/components/page-header"
import { buildMetadata } from "@/lib/seo"
import { RecipeGrid } from "@/components/recipe-grid"

export const metadata = buildMetadata({
  title: "Recipes",
  description: "What to cook with Charah — char siu pork, chicken, tofu, noodles, and more.",
  path: "/recipes",
})

export default function RecipesPage() {
  return (
    <>
      <PageHeader eyebrow="From the kitchen" title="Recipes" />
      <RecipeGrid />
    </>
  )
}
