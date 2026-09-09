"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { nav, site } from "@/content/site"
import { PREVIEW_LIMITED, PREVIEW_NAV } from "@/lib/preview"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { CartSheet } from "@/components/cart/cart-sheet"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const navItems = PREVIEW_LIMITED ? PREVIEW_NAV : nav

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-charah-hairline bg-charah-cream/85 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
          <Image src="/logo.png" alt="" width={38} height={38} className="scale-110" priority />
          <Image
            src="/charah-text.png"
            alt={site.name}
            width={88}
            height={22}
            className="object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-body-sm font-medium tracking-wide text-charah-stone transition-colors hover:text-charah-red",
                isActive(item.href) && "text-charah-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {!PREVIEW_LIMITED && <CartSheet />}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-charah-ink md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-charah-cream">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-10 flex flex-col gap-1">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-3 font-serif text-h3 text-charah-ink transition-colors hover:text-charah-red",
                        isActive(item.href) && "text-charah-red",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                {!PREVIEW_LIMITED && (
                  <SheetClose asChild>
                    <Link
                      href="/contact"
                      className="rounded-md px-3 py-3 font-serif text-h3 text-charah-ink transition-colors hover:text-charah-red"
                    >
                      Contact
                    </Link>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
