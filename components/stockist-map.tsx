"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { STOCKIST_AREAS, type Stockist } from "@/content/stockists"

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
  areaButtons = false,
}: {
  stockists: Stockist[]
  className?: string
  /** On touch screens, one finger scrolls the page instead of panning the map (pinch still zooms). For maps inside a long page. */
  lockTouchDrag?: boolean
  /** Show a button per area above the map that moves it there. The map opens on the first area (New York City). */
  areaButtons?: boolean
}) {
  const areas = STOCKIST_AREAS.filter((a) => stockists.some((s) => s.area === a && !s.mapHidden))
  const [focus, setFocus] = useState<string>(areas[0])

  return (
    <div>
      {areaButtons && areas.length > 1 ? (
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Move the map to">
          {areas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setFocus(area)}
              aria-pressed={focus === area}
              className={`rounded-full border px-4 py-1.5 text-body-sm font-medium transition-colors ${
                focus === area
                  ? "border-charah-ink bg-charah-ink text-charah-cream"
                  : "border-charah-hairline bg-white text-charah-ink hover:border-charah-ink"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      ) : null}
      <div className={`overflow-hidden rounded-2xl border border-charah-hairline ${className}`}>
        <StockistMapInner
          stockists={stockists}
          lockTouchDrag={lockTouchDrag}
          focusArea={areaButtons ? focus : undefined}
        />
      </div>
    </div>
  )
}
