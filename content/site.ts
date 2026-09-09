/**
 * Site-wide configuration: nav, contact, social.
 * Edit here to change the header and footer.
 */

export const site = {
  name: "Charah",
  tagline: "Born in Hong Kong. Made in Brooklyn.",
  email: "hello@charah-foods.com",
  url: "https://charah-foods.com",
}

/** Primary nav — used in the header and mirrored in the footer. */
export const nav: { label: string; href: string }[] = [
  { label: "About Us", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Store Locator", href: "/store-locator" },
  { label: "Recipes", href: "/recipes" },
]

export const social: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://instagram.com/eat.charah" },
  { label: "TikTok", href: "https://tiktok.com/@eat.charah" },
]

export const footerGroups: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Char Siu BBQ Sauce", href: "/products/original" },
      { label: "Cantonese Chili Oil", href: "/products/chili-oil" },
      { label: "All products", href: "/shop" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Recipes", href: "/recipes" },
      { label: "Store Locator", href: "/store-locator" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
    ],
  },
]
