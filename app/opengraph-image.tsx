import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { home } from "@/content/home"

export const alt = "Charah — Char Siu BBQ Sauce & Chili Oil"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const headline = home.hero.headline.toUpperCase()

/**
 * Google Fonts serves a plain TTF (not woff2) to non-browser user agents —
 * that's what ImageResponse needs. `text` subsets the font to just the
 * glyphs used — satori falls back to whichever font loads first for *any*
 * text node without a matching fontFamily, so every distinct string of text
 * in the image needs its own (correctly subsetted) font, explicitly assigned.
 */
async function loadGoogleFont(family: string, text: string) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`)
  ).text()
  const match = css.match(/src: url\(([^)]+)\)/)
  if (!match) throw new Error(`${family} font source not found in Google Fonts CSS`)
  const res = await fetch(match[1])
  return res.arrayBuffer()
}

export default async function OpengraphImage() {
  // logoLine renders with textTransform: uppercase, so the font needs its
  // uppercase glyphs, not the mixed-case glyphs of the original string.
  const bodyText = `${home.hero.logoLine.toUpperCase()}${home.hero.sub}`
  const [heroImage, antonFont, interFont] = await Promise.all([
    readFile(path.join(process.cwd(), "public", "saucestock.jpg")),
    loadGoogleFont("Anton", headline),
    loadGoogleFont("Inter", bodyText),
  ])
  const heroImageSrc = `data:image/jpeg;base64,${heroImage.toString("base64")}`

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#5E4E40" }}>
        <img
          src={heroImageSrc}
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
        />
        {/* Scrim — same top-down fade as the site's hero, so text stays legible over the photo. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(to bottom, rgba(14,11,10,0.82) 0%, rgba(14,11,10,0.5) 45%, rgba(14,11,10,0.05) 75%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "72px 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#FBF6EF",
              opacity: 0.9,
              fontFamily: "Inter",
            }}
          >
            {home.hero.logoLine}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 96,
              lineHeight: 1.02,
              color: "#FBF6EF",
              fontFamily: "Anton",
              textTransform: "uppercase",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 36,
              color: "rgba(251,246,239,0.8)",
              fontFamily: "Inter",
            }}
          >
            {home.hero.sub}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: antonFont, style: "normal", weight: 400 },
        { name: "Inter", data: interFont, style: "normal", weight: 500 },
      ],
    },
  )
}
