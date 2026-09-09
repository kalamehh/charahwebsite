import Link from "next/link"
import { site } from "@/content/site"

export function ComingSoon({
  note,
  backHref = "/",
  backLabel = "Back to home",
}: {
  note?: string
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className="container py-section">
      <div className="max-w-xl">
        <p className="text-eyebrow font-semibold uppercase text-charah-red">In progress</p>
        <h2 className="mt-3 font-serif text-h2 text-charah-ink">This page is being built</h2>
        <p className="mt-4 text-body-lg text-charah-stone">
          {note ??
            "We're rebuilding the Charah site one section at a time. Check back soon — or say hello in the meantime."}
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-body-sm font-medium">
          <Link href={backHref} className="text-charah-red underline underline-offset-4 hover:text-charah-red-dark">
            {backLabel}
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="text-charah-red underline underline-offset-4 hover:text-charah-red-dark"
          >
            {site.email}
          </a>
        </div>
      </div>
    </div>
  )
}
