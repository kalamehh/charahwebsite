import { PageHeader } from "@/components/page-header"
import { ComingSoon } from "@/components/coming-soon"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Charah handles your information.",
  path: "/legal/privacy",
})

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" />
      <ComingSoon note="The privacy policy will be published here before online shipping launches." />
    </>
  )
}
