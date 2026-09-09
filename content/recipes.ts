/**
 * Recipes. "Classic Char Siu Pork" is fully written; the rest are placeholders
 * (`draft: true`) — they show in the index with a "Coming soon" label and a
 * stub detail page until the method is written.
 */

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
  steps: string[]
  tips?: string[]
  /** Placeholder — listed but not yet written. */
  draft?: boolean
}

const PLACEHOLDER_IMAGE = "/headline.png"

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
    difficulty: "easy",
    prepMinutes: 10,
    cookMinutes: 35,
    servings: 4,
    tags: ["cantonese", "oven", "make-ahead", "party"],
    intro:
      "This is the recipe Charah was built for. Pork shoulder marinates in the Char Siu BBQ Sauce overnight, then roasts hot while you baste it with a honey-and-marinade glaze until the edges char. Slice it for rice plates, noodles, bao, or fried rice.",
    ingredients: [
      {
        items: [
          "2 lb boneless pork shoulder, cut into 2-inch-thick strips",
          "1/2 cup Char Siu BBQ Sauce",
          "2 tbsp honey",
          "1 tbsp hot water",
          "Steamed rice and sliced scallions, to serve",
        ],
      },
    ],
    steps: [
      "Combine the pork and Char Siu BBQ Sauce in a zip-top bag or container. Marinate in the fridge at least 4 hours, ideally overnight.",
      "Heat the oven to 425°F. Set a wire rack over a foil-lined sheet pan and add about 1 cup water to the pan (this keeps the drippings from burning).",
      "Whisk the honey with the hot water and 1 tbsp of the marinade to make the glaze.",
      "Arrange the pork on the rack with space between pieces. Roast 20 minutes.",
      "Brush generously with glaze, flip, and brush again. Roast 10 more minutes, then glaze and roast a final 5 until the edges are caramelised and slightly charred.",
      "Rest 10 minutes, then slice against the grain. Serve over rice with scallions.",
    ],
    tips: [
      "No wire rack? Roast directly on the foil and flip halfway.",
      "For extra char, finish under the broiler for 1–2 minutes — watch it closely.",
      "Leftovers freeze well; slice first, then reheat gently in a covered pan.",
    ],
  },
  {
    title: "Weekday Char Siu Pork",
    slug: "weekday-char-siu-pork",
    description:
      "The classic, sped up — pork tenderloin, a 20-minute marinade, and a hot pan. Dinner in about half an hour.",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Char siu pork",
    product: ["original"],
    protein: "pork",
    meal: "main",
    difficulty: "easy",
    prepMinutes: 10,
    cookMinutes: 20,
    servings: 4,
    tags: ["cantonese", "quick", "weeknight"],
    intro:
      "A faster take on the classic — thin pork cutlets or tenderloin, a short marinade, and a hot pan or broiler instead of a long roast.",
    ingredients: [],
    steps: [],
    draft: true,
  },
  {
    title: "Char Siu Pork Ribs",
    slug: "char-siu-pork-ribs",
    description:
      "Baby back ribs slow-roasted in the marinade, then lacquered with honey glaze until sticky and blistered.",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Char siu pork ribs",
    product: ["original"],
    protein: "pork",
    meal: "main",
    difficulty: "medium",
    prepMinutes: 15,
    cookMinutes: 120,
    servings: 4,
    tags: ["cantonese", "oven", "low-and-slow", "party"],
    intro:
      "Low-and-slow ribs marinated in char siu, finished with a honey glaze under the broiler.",
    ingredients: [],
    steps: [],
    draft: true,
  },
  {
    title: "Char Siu Chicken",
    slug: "char-siu-chicken",
    description:
      "Bone-in thighs marinated in char siu and roasted until the skin turns deep mahogany. Great over rice or in noodles.",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Char siu chicken thighs",
    product: ["original"],
    protein: "chicken",
    meal: "main",
    difficulty: "easy",
    prepMinutes: 10,
    cookMinutes: 35,
    servings: 4,
    tags: ["cantonese", "oven", "weeknight", "meal-prep"],
    intro: "Char siu marinade on chicken thighs — same lacquered finish, faster than pork.",
    ingredients: [],
    steps: [],
    draft: true,
  },
  {
    title: "Char Siu Tofu",
    slug: "char-siu-tofu",
    description:
      "Pressed firm tofu takes the marinade beautifully — bake or air-fry until the edges caramelise. Fully plant-based.",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Char siu glazed tofu",
    product: ["original"],
    protein: "tofu",
    meal: "main",
    difficulty: "easy",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 3,
    tags: ["vegetarian", "vegan", "cantonese", "weeknight", "air-fryer"],
    intro: "A plant-based char siu — pressed tofu, the marinade, and a hot oven or air fryer.",
    ingredients: [],
    steps: [],
    draft: true,
  },
  {
    title: "Charah Bacon",
    slug: "charah-bacon",
    description:
      "Thick-cut bacon brushed with char siu marinade and baked low until candied at the edges. Dangerous at brunch.",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Char siu candied bacon",
    product: ["original"],
    protein: "pork",
    meal: "breakfast",
    difficulty: "easy",
    prepMinutes: 5,
    cookMinutes: 20,
    servings: 4,
    tags: ["breakfast", "brunch", "quick", "3-ingredient"],
    intro: "Char siu marinade turns thick-cut bacon into candied, sticky, sweet-savoury strips.",
    ingredients: [],
    steps: [],
    draft: true,
  },
  {
    title: "Charah Burger",
    slug: "charah-burger",
    description:
      "Char siu marinade in the patty and brushed on the grill, plus a swipe of chili oil mayo. A Hong Kong diner burger.",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Char siu beef burger with chili oil mayo",
    product: ["original", "chili-oil"],
    protein: "beef",
    meal: "main",
    difficulty: "easy",
    prepMinutes: 15,
    cookMinutes: 12,
    servings: 4,
    tags: ["grill", "weeknight", "cookout"],
    intro:
      "Char siu marinade worked into the beef and brushed on as it grills, finished with chili oil mayo.",
    ingredients: [],
    steps: [],
    draft: true,
  },
]

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug)
}

export function totalMinutes(r: Recipe): number {
  return r.prepMinutes + r.cookMinutes
}
