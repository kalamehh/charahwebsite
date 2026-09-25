/**
 * Recipes. "Classic Char Siu Pork" is fully written; the rest are placeholders
 * (`draft: true`) — they show in the index with a "Coming soon" label and a
 * stub detail page until the method is written.
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
  /** CSS object-position for the card/hero crop — defaults to "center" if unset. */
  imagePosition?: string
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

const PLACEHOLDER_IMAGE = "/headline.png"

export const recipes: Recipe[] = [
  {
    title: "Classic Char Siu Pork",
    slug: "classic-char-siu-pork",
    description:
      "Sticky, lacquered Cantonese barbecue pork made at home with just one bottle of Char Siu BBQ Sauce.",
    image: "/headline.png",
    imageAlt: "Sliced char siu pork with a glossy red glaze over rice",
    product: ["original"],
    protein: "pork",
    meal: "main",
    difficulty: "medium",
    prepMinutes: 10,
    cookMinutes: 45,
    servings: 6,
    tags: ["cantonese", "oven", "make-ahead", "party"],
    intro:
      "This is the recipe Charah was built for. Pork shoulder marinates in the Char Siu BBQ Sauce, then roast in high heat and lastly baste it until the edges char.",
    ingredients: [
      {
        items: [
          "3 lb boneless pork shoulder (butt), cut into 2-inch-thick strips",
          "1/3 cup Charah Char Siu BBQ Sauce",
        ],
      },
    ],
    steps: [
      {
        items: [
          "Combine the pork and Char Siu BBQ Sauce in a zip-top bag or container. Marinate 30 minutes in room temperature or overnight in the fridge.",
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
      "Same deal as our classic char siu pork but on chicken thighs - faster, cheaper and more foolproof.",
    image: "/char-siu-chicken.jpg",
    imageAlt: "Char siu chicken thighs glazed and charred on the grill",
    imagePosition: "center 82%",
    product: ["original"],
    protein: "chicken",
    meal: "main",
    difficulty: "easy",
    prepMinutes: 5,
    cookMinutes: 20,
    servings: 4,
    tags: ["cantonese", "grill", "oven", "weeknight", "meal-prep"],
    intro:
      "Same deal as our classic char siu pork but on chicken thighs - faster, cheaper and more foolproof. Trust us that this will become a weeknight staple for you.",
    ingredients: [
      {
        items: [
          "2 lbs boneless, skinless chicken thighs",
          "1/4 cup Charah Char Siu BBQ Sauce, plus more for basting",
        ],
      },
    ],
    steps: [
      {
        items: [
          "Combine the chicken and Char Siu BBQ Sauce in a zip-top bag or container. Marinate 30 minutes.",
        ],
      },
      {
        group: "On the grill",
        alt: true,
        items: [
          "Let the grill come up to 450°F.",
          "Grill until sauce looks sticky and clings to the meat. Flip when meat starts to char.",
          "Repeat for the other side.",
          "Baste with extra sauce and grill for one minute each side.",
        ],
      },
      {
        group: "In the oven/ airfryer",
        alt: true,
        items: [
          "Preheat to 400°F.",
          "Roast 15 minutes or until thickest part reaches 165°F.",
          "Increase temperature to 450°F, baste with more sauce and roast for 1-2 minutes each side.",
        ],
      },
      {
        items: ["Serve over rice, on tacos or in noodles."],
      },
    ],
    tips: [
      "You can use bone-in and/or skin-on thighs if you prefer.",
      "Baste with fresh sauce, not the marinade the raw chicken sat in.",
      "For big parties, pre-cut chicken thighs into bite sizes before marinating, and grill a big batch in less than 10 minutes.",
    ],
  },
  {
    title: "Charah Tofu Stir Fry",
    slug: "char-siu-tofu",
    description:
      "Pressed firm tofu, seared until crisp and glazed with char siu — fully plant-based. Pan-fry it fast, or bake/air-fry hands-off.",
    image: "/char-siu-tofu.jpg",
    imageAlt: "Diced char siu tofu with scallions in a skillet",
    imagePosition: "center 65%",
    product: ["original", "chili-oil"],
    protein: "tofu",
    meal: "main",
    difficulty: "easy",
    prepMinutes: 5,
    cookMinutes: 25,
    servings: 4,
    tags: ["vegetarian", "vegan", "cantonese", "weeknight", "skillet", "air-fryer"],
    intro:
      "Plant-based char siu — Charah sauce clings to tofu beautifully. Your every day dinner in less than 30 minutes.",
    ingredients: [
      {
        items: [
          "14 oz firm tofu (1 pack), cut into 1/2-inch cubes",
          "1/4 cup Charah Char Siu BBQ Sauce",
          "6 scallions, cut into 1-inch pieces",
          "1 tbsp cornstarch",
          "1 tsp salt",
          "1 tsp black pepper",
          "1 tbsp neutral oil",
          "1 tbsp Charah chili oil (optional but highly recommended)",
        ],
      },
    ],
    steps: [
      {
        items: [
          "Cut tofu into 1/2 inch cubes and press dry.",
          "Toss tofu cubes with 1 tbsp neutral oil.",
          "Add salt, black pepper and cornstarch. Try to sprinkle or dust in cornstarch so it sticks to the tofu instead of clumping together.",
          "Toss or mix.",
        ],
      },
      {
        items: [
          "Heat oil in a nonstick or well-seasoned skillet over medium-high heat. Add the tofu in a single layer and sear undisturbed 2 minutes per side, until golden and lightly crisp all over, about 8 minutes total. Alternatively, cook at 400°F in an air fryer for 20 minutes, flip mid-way then cook on stovetop for the following steps.",
          "Add the scallions and cook 1-2 minutes until wilted.",
          "Add Charah sauce in the last minute, tossing until the sauce clings and turns glossy. Add 1 tbsp of water if it starts to burn.",
          "Turn off stovetop. Add Charah chili oil if using.",
        ],
      },
      {
        items: ["Serve over rice/noodles, in lettuce cups, or eat as-is."],
      },
    ],
    tips: [
      "Press tofu and dry well before tossing to make extra crispy.",
      "Extra-firm tofu works as well. Soft or silken will fall apart.",
    ],
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
