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
  tagline: string
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
  image: string
  imageAlt: string
}

export const products: Product[] = [
  {
    slug: "original",
    name: "Char Siu BBQ Sauce",
    shortName: "BBQ Sauce",
    tagline: "The five-year char siu marinade.",
    blurb:
      "Our flagship char siu BBQ marinade — bold, sweet-savoury, and built to bring Hong Kong to your kitchen.",
    body: [
      "Our flagship char siu BBQ marinade is a labour of love — five years in the making. While the world perfected sourdough during lockdown, we were perfecting Charah: the bold, sweet-savoury marinade that brings Hong Kong to your kitchen.",
      "Crafted with traditional soy sauce, fresh aromatics, and a carefully guarded blend of spices — including fermented tofu (think cheese, but soy-based and funky in the best way) — this marinade is our love letter to char siu.",
    ],
    highlights: [
      "Best with pork. Great with chicken. Versatile with anything.",
      "Small-batch made, always.",
      "The perfect crowd-pleaser for your next BBQ.",
    ],
    ingredients:
      "Soy sauce (water, soybeans, wheat, salt), sugar, honey, fermented tofu, garlic, ginger, shaoxing wine, five-spice, salt.",
    allergens: "Contains soy and wheat.",
    netWeight: "8 fl oz (236 ml)",
    priceCents: 1600,
    image: "/sauce.png",
    imageAlt: "Bottle of Charah Char Siu BBQ Sauce",
  },
  {
    slug: "chili-oil",
    name: "Cantonese Chili Oil",
    shortName: "Chili Oil",
    tagline: "Bold, aromatic, and just the right kind of dangerous.",
    blurb:
      "Premium dried chilies, tongue-tingling peppercorns, and a secret blend of fragrant spices — made to kick alongside the char siu sauce.",
    body: [
      "Made with premium dried chilies, tongue-tingling peppercorns, and a secret blend of fragrant spices — it's bold, aromatic, and just the right kind of dangerous.",
      "We created our chili oil to bring a little kick to the deep, savoury notes of our signature Charah marinade. Spoon it over noodles, eggs, dumplings, or anything that needs waking up.",
    ],
    highlights: [
      "Crunchy, aromatic, medium heat.",
      "Made to pair with the Char Siu BBQ Sauce.",
      "Great on noodles, eggs, rice, and dumplings.",
    ],
    ingredients:
      "Canola oil, dried chilies, Sichuan peppercorns, garlic, shallot, sesame, star anise, salt, sugar.",
    allergens: "Contains sesame.",
    netWeight: "6 oz (170 g)",
    priceCents: 1200,
    image: "/chili-oil.png",
    imageAlt: "Jar of Charah Cantonese Chili Oil",
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
