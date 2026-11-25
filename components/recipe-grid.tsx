import Image from "next/image"
import Link from "next/link"
import { recipes, totalMinutes } from "@/content/recipes"

/** The list of published recipes, shared by /recipes and /qr (the printed-QR landing page). */
export function RecipeGrid() {
  return (
    <div className="container grid gap-8 py-section sm:grid-cols-2 lg:grid-cols-3">
      {recipes
        .filter((recipe) => !recipe.draft)
        .map((recipe) => (
        <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="group flex flex-col">
          <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-charah-hairline">
            <Image
              src={recipe.image}
              alt={recipe.imageAlt}
              fill
              style={recipe.imagePosition ? { objectPosition: recipe.imagePosition } : undefined}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-body-sm uppercase tracking-wide text-charah-stone">
            <span>{recipe.protein}</span>
            <span aria-hidden>·</span>
            <span>{recipe.difficulty}</span>
            <span aria-hidden>·</span>
            <span>{totalMinutes(recipe)} min</span>
          </div>
          <h2 className="mt-2 font-serif text-h3 text-charah-ink group-hover:text-charah-red">
            {recipe.title}
          </h2>
          <p className="mt-2 text-body text-charah-stone">{recipe.description}</p>
        </Link>
      ))}
    </div>
  )
}
