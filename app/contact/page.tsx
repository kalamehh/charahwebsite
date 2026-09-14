import { Instagram } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { buildMetadata } from "@/lib/seo"
import { site, social } from "@/content/site"

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Charah about the sauce, stockists, wholesale, or press.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        intro="Questions about the sauce, wholesale orders, or press — we'd love to hear from you."
      />
      <div className="container py-section">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-h4 text-charah-ink">Email</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 inline-block text-body-lg text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
            >
              {site.email}
            </a>
          </div>
          <div>
            <h2 className="font-serif text-h4 text-charah-ink">Follow along</h2>
            {/* Icon-only, matched to the platform — swap the icon if a non-Instagram
                entry is ever added to content/site.ts's `social`. */}
            <div className="mt-2 flex gap-3">
              {social.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-charah-hairline text-charah-red transition-colors hover:border-charah-red hover:bg-charah-red hover:text-charah-cream"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
