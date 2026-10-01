/**
 * The Charah product line. Used by /products, /products/[slug], the home page,
 * and /shop.
 *
 * `priceCents` mirrors the price set in Stripe / your catalog — keep them in
 * sync by hand (2 SKUs, low churn). `slug` is the cart key and URL — don't
 * change it once orders exist.
 */

export type Product = {
  slug: "original" | "chili-oil"
  name: string
  shortName: string
  tagline?: string
  /** Short paragraph for cards and hero blurbs. */
  blurb: string
  /** Longer body copy for the product page, one paragraph per entry. */
  body: string[]
  highlights: string[]
  ingredients: string
  allergens: string
  netWeight: string
  /** Price in USD cents — must match your Stripe catalog. */
  priceCents: number
  /**
   * Rough shipping weight in ounces (jar/bottle + packaging, not just the
   * net contents) — Shippo requires *some* weight on an Order. This is an
   * estimate; correct it once you've actually weighed a packed jar, and
   * you'll set the real per-shipment weight again in Shippo when you buy
   * the label regardless.
   */
  shipWeightOz: number
  image: string
  imageAlt: string
}

export const products: Product[] = [
  {
    slug: "original",
    name: "Char Siu BBQ Sauce",
    shortName: "BBQ Sauce",
    blurb:
      "Our flagship Cantonese BBQ sauce — bold, sweet-savory, and built to bring Hong Kong to your kitchen.",
    body: [
      "Our flagship sauce is our love letter to Hong Kong and New York, the two cities that shaped us. While the world perfected sourdough during lockdown, we were perfecting Charah: the bold, sweet-savory sauce that is as quintessentially Hong Kong as it gets.",
      "Crafted with fresh aromatics, umami sauces and fermented tofu (think miso but Cantonese and funky in the best way).",
    ],
    highlights: [
      "Best with pork. Great with chicken. Versatile with anything.",
      "Small batch made in Brooklyn, NY.",
      "The perfect crowd-pleaser for your next BBQ or house party.",
    ],
    ingredients:
      "Sugar, fermented rose bean curd (water, soybean, edible alcohol, salt, sugar, wheat flour, sugar, rose, red yeast rice, magnesium chloride, spices), garlic, ginger, water, chu hou sauce (soybeans, garlic, sesame, spices), hoisin sauce (soybeans, sugar, wheat flour, garlic, spices), oyster sauce (oyster extract, water, sugar, salt), dark soy sauce (water, soybeans, wheat, salt), spring onion, light soy sauce (water, soybeans, wheat, salt), cilantro, Chinese rose cooking wine (distilled spirits, rose extract), white pepper, five spice.",
    allergens: "Contains soy, wheat, sesame, and shellfish (oyster).",
    netWeight: "12 oz (340 g)",
    priceCents: 1600,
    shipWeightOz: 22,
    image: "/sauce.jpg",
    imageAlt: "Bottle of Charah Char Siu BBQ Sauce",
  },
  {
    slug: "chili-oil",
    name: "Cantonese Chili Oil",
    shortName: "Chili Oil",
    blurb:
      "Premium chilies and a secret blend of fragrant spices — made to kick alongside the char siu sauce and everything else.",
    body: [
      "Our homemade staple perfected for your every day. In true Cantonese fashion, it's not too spicy, more oil than crisp and has an addictive note of aromatics and smokiness.",
      "Made with premium dried chilies and a secret blend of fragrant spices, Charah chili oil is a necessary companion to its sweet-savory cousin, our char siu barbecue sauce. It's also great on everything else!",
    ],
    highlights: [
      "Medium heat with a long-lasting aromatic smokiness.",
      "Made to pair with the Char Siu BBQ Sauce.",
      "Great on noodles, eggs, rice, tacos and dumplings, or anything that needs waking up.",
    ],
    ingredients: "Canola oil, Sichuan chili flakes, shallot, Sichuan peppercorn, garlic, salt, star anise, cinnamon, bay leaves.",
    allergens: "Contains no major allergens.",
    netWeight: "6 oz (173 g)",
    priceCents: 1200,
    shipWeightOz: 14,
    image: "/chili-oil.jpg",
    imageAlt: "Jar of Charah Cantonese Chili Oil",
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
