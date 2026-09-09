import type { Metadata } from "next"
import { site } from "@/content/site"

/**
 * Per-page metadata helper. Title is templated with " | Charah" by the root
 * layout, so pass the bare page name here.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/opengraph-image.png",
}: {
  title: string
  description: string
  path?: string
  image?: string
}): Metadata {
  const url = `${site.url}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      type: "website",
      images: [{ url: image }],
    },
  }
}
