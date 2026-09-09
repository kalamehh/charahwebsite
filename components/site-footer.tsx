import Image from "next/image"
import Link from "next/link"
import { footerGroups, site, social } from "@/content/site"
import { PREVIEW_LIMITED } from "@/lib/preview"

export function SiteFooter() {
  const year = new Date().getFullYear()
  // Hide the "Shop" column in limited-preview mode — its links go to hidden pages.
  const groups = PREVIEW_LIMITED
    ? footerGroups.filter((g) => g.title !== "Shop")
    : footerGroups

  return (
    <footer className="section-ink">
      <div className={`container grid gap-10 py-14 ${PREVIEW_LIMITED ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={32} height={32} className="scale-110" />
            <Image src="/charah-text.png" alt={site.name} width={78} height={20} className="object-contain" />
          </div>
          <p className="max-w-xs text-body-sm leading-relaxed text-charah-cream/70">
            {site.tagline} A five-years-in-the-making char siu marinade and a small-batch chili oil.
          </p>
          <p className="text-body-sm text-charah-cream/50">
            &copy; {year} {site.name}. All rights reserved.
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="font-serif text-h4 text-charah-cream">{group.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-charah-cream/70 transition-colors hover:text-charah-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-5 text-body-sm text-charah-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Wholesale &amp; press:{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-charah-cream">
              {site.email}
            </a>
          </p>
          <div className="flex gap-5">
            {social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-charah-cream"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
