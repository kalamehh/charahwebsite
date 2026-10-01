import type React from "react"
import type { Metadata } from "next"
import { Inter, Anton, Playfair_Display } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart/cart-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://charah-foods.com"),
  title: {
    default: "Charah | Char Siu BBQ Sauce & Chili Oil",
    template: "%s | Charah",
  },
  description:
    "Born in Hong Kong. Made in Brooklyn. Charah is a five-years-in-the-making char siu BBQ marinade and a small-batch chili oil.",
  openGraph: {
    title: "Charah | Char Siu BBQ Sauce & Chili Oil",
    description: "Born in Hong Kong. Made in Brooklyn. Ready for the American table.",
    url: "https://charah-foods.com",
    siteName: "Charah",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${anton.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-charah-cream">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  )
}
