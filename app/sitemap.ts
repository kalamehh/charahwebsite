import type { MetadataRoute } from "next"
import { site } from "@/content/site"
import { recipes } from "@/content/recipes"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/recipes", "/store-locator", "/about", "/contact", "/legal/privacy", "/legal/terms"]

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }))

  const recipeEntries: MetadataRoute.Sitemap = recipes.map((r) => ({
    url: `${site.url}/recipes/${r.slug}`,
    lastModified: new Date(),
  }))

  return [...staticEntries, ...recipeEntries]
}
