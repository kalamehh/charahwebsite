/**
 * Limited-preview mode.
 *
 * When on, the site exposes only the finished content pages — About Us,
 * Store Locator, Recipes, Contact — and hides all commerce (shop, product
 * pages, cart, checkout). It's for sharing an in-progress build with
 * stakeholders before the shop is ready.
 *
 * Turned on by `NEXT_PUBLIC_PREVIEW_LIMITED=1`. `next.config.mjs` sets that
 * automatically for the `flora-preview` branch on Vercel, so the main
 * `rebuild-phase-1` branch and production are unaffected.
 */
export const PREVIEW_LIMITED = process.env.NEXT_PUBLIC_PREVIEW_LIMITED === "1"

/** Nav shown in limited-preview mode. */
export const PREVIEW_NAV: { label: string; href: string }[] = [
  { label: "About Us", href: "/about" },
  { label: "Store Locator", href: "/store-locator" },
  { label: "Recipes", href: "/recipes" },
  { label: "Contact", href: "/contact" },
]
