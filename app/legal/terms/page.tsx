import { PageHeader } from "@/components/page-header"
import { ComingSoon } from "@/components/coming-soon"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms that apply when you use the Charah website.",
  path: "/legal/terms",
})

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Service" />
      <ComingSoon note="Terms of service will be published here before online shipping launches." />
    </>
  )
}
