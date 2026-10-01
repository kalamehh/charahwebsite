import type { MetadataRoute } from "next"
import { site } from "@/content/site"
import { products } from "@/content/products"
import { recipes } from "@/content/recipes"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/products",
    "/recipes",
    "/store-locator",
    "/shop",
    "/about",
    "/contact",
    "/legal/privacy",
    "/legal/terms",
  ]

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }))

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${site.url}/products/${p.slug}`,
    lastModified: new Date(),
  }))

  const recipeEntries: MetadataRoute.Sitemap = recipes.map((r) => ({
    url: `${site.url}/recipes/${r.slug}`,
    lastModified: new Date(),
  }))

  return [...staticEntries, ...productEntries, ...recipeEntries]
}
