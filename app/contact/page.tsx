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
            <ul className="mt-1 space-y-1">
              {social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-lg text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 text-body-sm text-charah-stone">A contact form lands here in Phase 2.</p>
      </div>
    </>
  )
}
