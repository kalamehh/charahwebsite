"use client"

import dynamic from "next/dynamic"
import type { Stockist } from "@/content/stockists"

// Leaflet touches `window` at import time, so it can only load client-side.
const StockistMapInner = dynamic(
  () => import("./stockist-map-inner").then((m) => m.StockistMapInner),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-charah-hairline" />,
  },
)

export function StockistMap({ stockists }: { stockists: Stockist[] }) {
  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-charah-hairline">
      <StockistMapInner stockists={stockists} />
    </div>
  )
}
