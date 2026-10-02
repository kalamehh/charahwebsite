import { NextResponse } from "next/server"
import { createShippoOrder } from "@/lib/shippo"

// TEMPORARY diagnostic -- delete after use. Runs the real createShippoOrder
// from inside Vercel so we can tell whether requests originating from
// Vercel's infrastructure are what breaks rate-shopping in Shippo.
export const runtime = "nodejs"

const DEBUG_KEY = "28471c899a5f62215c939b667177361b"

export async function POST(req: Request) {
  if (req.headers.get("x-debug-key") !== DEBUG_KEY) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  const res = await createShippoOrder({
    orderNumber: `vercel-origin-test-${Date.now()}`,
    placedAt: new Date(1790895702 * 1000).toISOString(),
    toAddress: {
      name: "Clara Chung",
      street1: "820 Classon Ave",
      street2: "4F",
      city: "Brooklyn",
      state: "NY",
      zip: "11238",
      country: "US",
      email: "clarachung903@gmail.com",
    },
    lineItems: [{ quantity: 1, title: "Cantonese Chili Oil", total_price: "12.00", currency: "usd" }],
    weightOz: 14,
    subtotalCents: 1200,
    shippingCents: 599,
    taxCents: 0,
    totalCents: 1799,
  })

  return NextResponse.json({ created: res?.order_number ?? null, object_id: res?.object_id ?? null })
}
