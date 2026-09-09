import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { buildMetadata } from "@/lib/seo"
import { getRecipe, recipes, totalMinutes } from "@/content/recipes"

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe = getRecipe(slug)
  if (!recipe) return {}
  return buildMetadata({
    title: recipe.title,
    description: recipe.description,
    path: `/recipes/${recipe.slug}`,
    image: recipe.image,
  })
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe = getRecipe(slug)
  if (!recipe) notFound()

  return (
    <article className="container max-w-3xl py-section">
      <Link
        href="/recipes"
        className="text-body-sm font-medium text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
      >
        &larr; All recipes
      </Link>

      <h1 className="mt-4 font-serif text-h1 text-charah-ink">{recipe.title}</h1>
      <p className="mt-3 text-body-lg text-charah-stone">{recipe.intro}</p>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-y border-charah-hairline py-4 text-body-sm">
        <div>
          <dt className="uppercase tracking-wide text-charah-stone">Prep</dt>
          <dd className="font-medium text-charah-ink">{recipe.prepMinutes} min</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide text-charah-stone">Cook</dt>
          <dd className="font-medium text-charah-ink">{recipe.cookMinutes} min</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide text-charah-stone">Total</dt>
          <dd className="font-medium text-charah-ink">{totalMinutes(recipe)} min</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide text-charah-stone">Serves</dt>
          <dd className="font-medium text-charah-ink">{recipe.servings}</dd>
        </div>
      </dl>

      <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-2xl bg-charah-hairline">
        <Image src={recipe.image} alt={recipe.imageAlt} fill priority className="object-cover" sizes="(min-width: 768px) 720px, 90vw" />
      </div>

      {recipe.draft ? (
        <div className="mt-10 rounded-2xl border border-charah-hairline bg-white p-6 text-center">
          <p className="font-serif text-h4 text-charah-ink">Full recipe coming soon</p>
          <p className="mt-2 text-body text-charah-stone">
            We&rsquo;re still testing this one. Check back soon, or start with the{" "}
            <Link
              href="/recipes/classic-char-siu-pork"
              className="font-medium text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
            >
              Classic Char Siu Pork
            </Link>
            .
          </p>
        </div>
      ) : (
      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.6fr]">
        <section>
          <h2 className="font-serif text-h3 text-charah-ink">Ingredients</h2>
          {recipe.ingredients.map((group, i) => (
            <div key={i} className="mt-3">
              {group.group ? (
                <p className="text-body-sm font-semibold uppercase tracking-wide text-charah-stone">
                  {group.group}
                </p>
              ) : null}
              <ul className="mt-2 space-y-2 text-body text-charah-ink">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="text-charah-red">
                      &bull;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-serif text-h3 text-charah-ink">Method</h2>
          <ol className="mt-3 space-y-4 text-body text-charah-ink">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-display text-h4 leading-none text-charah-red">{i + 1}</span>
                <span className="text-charah-stone">{step}</span>
              </li>
            ))}
          </ol>

          {recipe.tips?.length ? (
            <div className="mt-8 rounded-2xl border border-charah-hairline bg-white p-5">
              <h3 className="font-serif text-h4 text-charah-ink">Tips</h3>
              <ul className="mt-2 space-y-2 text-body-sm text-charah-stone">
                {recipe.tips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span aria-hidden className="text-charah-red">
                      &bull;
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>
      )}
    </article>
  )
}
