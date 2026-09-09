/** @type {import('next').NextConfig} */

// Limited-preview mode is on when NEXT_PUBLIC_PREVIEW_LIMITED is set explicitly,
// or automatically for the `flora-preview` branch's Vercel deployment.
const previewLimited =
  process.env.NEXT_PUBLIC_PREVIEW_LIMITED ??
  (process.env.VERCEL_GIT_COMMIT_REF === "flora-preview" ? "1" : "")

const nextConfig = {
  env: {
    NEXT_PUBLIC_PREVIEW_LIMITED: previewLimited,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
