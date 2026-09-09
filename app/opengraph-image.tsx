import { ImageResponse } from "next/og"

export const alt = "Charah — Char Siu BBQ Sauce & Chili Oil"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0E0B0A",
          color: "#FBF6EF",
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: 8, textTransform: "uppercase", color: "#F43711" }}>
          Charah
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 88, lineHeight: 1.05, fontWeight: 700 }}>
            Char siu, bottled.
          </div>
          <div style={{ fontSize: 40, color: "rgba(251,246,239,0.75)" }}>
            Born in Hong Kong. Made in Brooklyn.
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
