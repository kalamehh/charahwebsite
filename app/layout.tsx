import type React from "react"
import type { Metadata } from "next"
import { Inter, Anton } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
export const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" })

export const metadata: Metadata = {
  title: "chara | Authentic Asian BBQ Sauce",
  description:
    "Authentically Hong Kong. Reimagined in Brooklyn. Ready for the American Table.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${anton.variable}`}>{children}</body>
    </html>
  )
}
