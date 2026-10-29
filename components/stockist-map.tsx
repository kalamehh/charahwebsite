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

export function StockistMap({
  stockists,
  className = "h-[420px]",
  lockTouchDrag = false,
}: {
  stockists: Stockist[]
  className?: string
  /** On touch screens, one finger scrolls the page instead of panning the map (pinch still zooms). For maps inside a long page. */
  lockTouchDrag?: boolean
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-charah-hairline ${className}`}>
      <StockistMapInner stockists={stockists} lockTouchDrag={lockTouchDrag} />
    </div>
  )
}
