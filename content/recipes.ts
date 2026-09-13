/**
 * Recipes. Just "Classic Char Siu Pork" for now — the rest of the lineup
 * (Weekday Char Siu Pork, Ribs, Chicken, Tofu, Bacon, Burger) is still being
 * written and lives on the `rebuild-phase-1` branch as `draft` placeholders.
 * The `draft?: boolean` field below is kept so they drop back in cleanly.
 */

export type StepGroup = {
  /** Shown as a heading. Required if `alt` is set (it's the method name). */
  group?: string
  items: string[]
  /** One of several alternative methods (e.g. grill vs oven) — see `Recipe.steps`. */
  alt?: boolean
}

export type Recipe = {
  title: string
  slug: string
  description: string
  image: string
  imageAlt: string
  product: ("original" | "chili-oil")[]
  protein: "pork" | "chicken" | "tofu" | "vegetable" | "seafood" | "beef"
  meal: "main" | "side" | "snack" | "breakfast" | "sauce"
  difficulty: "easy" | "medium" | "advanced"
  prepMinutes: number
  cookMinutes: number
  servings: number
  tags: string[]
  intro: string
  ingredients: { group?: string; items: string[] }[]
  /**
   * Method, in one or more groups, numbered continuously (1, 2, 3…) — not
   * restarted per group. Mark alternative methods (e.g. grill vs oven) with
   * `alt: true` on each: consecutive `alt` groups share one step number,
   * suffixed a/b/c…, instead of each taking the next number.
   */
  steps: StepGroup[]
  tips?: string[]
  /** Placeholder — listed but not yet written. */
  draft?: boolean
}

export const recipes: Recipe[] = [
  {
    title: "Classic Char Siu Pork",
    slug: "classic-char-siu-pork",
    description:
      "Sticky, lacquered Cantonese barbecue pork made at home with one bottle of Char Siu BBQ Sauce — no bricks of red bean curd to hunt down.",
    image: "/headline.png",
    imageAlt: "Sliced char siu pork with a glossy red glaze over rice",
    product: ["original"],
    protein: "pork",
    meal: "main",
    difficulty: "medium",
    prepMinutes: 10,
    cookMinutes: 45,
    servings: 4,
    tags: ["cantonese", "oven", "make-ahead", "party"],
    intro:
      "This is the recipe Charah was built for. Pork shoulder marinates in the Char Siu BBQ Sauce overnight, then roast in high heat and lastly baste it until the edges char.",
    ingredients: [
      {
        items: [
          "2.5-3 lb boneless pork shoulder (butt), cut into 2-inch-thick strips",
          "1/3 cup Charah Char Siu BBQ Sauce",
        ],
      },
    ],
    steps: [
      {
        items: [
          "Combine the pork and Char Siu BBQ Sauce in a zip-top bag or container. Marinate 30+ minutes in room temperature or ideally in the fridge overnight.",
        ],
      },
      {
        group: "On the grill",
        alt: true,
        items: ["Let grill come up to 450F and grill until cooked through and charred."],
      },
      {
        group: "In the oven",
        alt: true,
        items: [
          "Heat the oven to 400°F. Set a wire rack over a foil-lined sheet pan and add about some water to the pan (this keeps the drippings from burning).",
          "Arrange the pork on the rack with space between pieces. Roast 20 minutes, flip.",
          "Increase temperature to 450. Roast 10 more minutes until the edges are caramelized and slightly charred.",
        ],
      },
      {
        items: [
          "Rest 10 minutes, then slice against the grain.",
          "Serve on rice, noodles, bao, taco or eat as is.",
        ],
      },
    ],
    tips: [
      "Pork shoulder is the perfect cut for this. If you are at a Chinese butcher, ask specifically for pork shoulder butt (梅頭) or the char siu cut.",
      "For best results, let meat come back to room temperature before roasting.",
      "No wire rack? Roast directly on the foil and remove liquid as it goes.",
      "To go the extra mile, brush 1 additional tbsp of sauce then finish under the broiler for 2-3 minutes. Watch closely as it can go from charred to burnt quickly.",
    ],
  },
]

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug)
}

export function totalMinutes(r: Recipe): number {
  return r.prepMinutes + r.cookMinutes
}
