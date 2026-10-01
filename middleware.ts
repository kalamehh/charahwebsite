import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// In limited-preview mode (see lib/preview.ts), commerce routes don't exist —
// bounce any direct hit back to the home page.
const BLOCKED = [
  /^\/shop(?:\/|$)/,
  /^\/products(?:\/|$)/,
  /^\/checkout(?:\/|$)/,
  /^\/api\/checkout(?:\/|$)/,
]

export function middleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_PREVIEW_LIMITED !== "1") return NextResponse.next()
  if (BLOCKED.some((re) => re.test(req.nextUrl.pathname))) {
    return NextResponse.redirect(new URL("/", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/shop",
    "/shop/:path*",
    "/products",
    "/products/:path*",
    "/checkout/:path*",
    "/api/checkout",
  ],
}
