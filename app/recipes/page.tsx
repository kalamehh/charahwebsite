import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { buildMetadata } from "@/lib/seo"
import { recipes, totalMinutes } from "@/content/recipes"

export const metadata = buildMetadata({
  title: "Recipes",
  description: "What to cook with Charah — char siu pork, chicken, tofu, noodles, and more.",
  path: "/recipes",
})

export default function RecipesPage() {
  return (
    <>
      <PageHeader
        eyebrow="From the kitchen"
        title="Recipes"
        intro="Start with the classic, then branch out. Filters and more recipes are on the way."
      />
      <div className="container grid gap-8 py-section sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="group flex flex-col">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-charah-hairline">
              <Image
                src={recipe.image}
                alt={recipe.imageAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-body-sm uppercase tracking-wide text-charah-stone">
              {recipe.draft ? (
                <span className="text-charah-red">Recipe coming soon</span>
              ) : (
                <>
                  <span>{recipe.protein}</span>
                  <span aria-hidden>·</span>
                  <span>{recipe.difficulty}</span>
                  <span aria-hidden>·</span>
                  <span>{totalMinutes(recipe)} min</span>
                </>
              )}
            </div>
            <h2 className="mt-2 font-serif text-h3 text-charah-ink group-hover:text-charah-red">
              {recipe.title}
            </h2>
            <p className="mt-2 text-body text-charah-stone">{recipe.description}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
