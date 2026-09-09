"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { CartLine } from "@/lib/commerce"

const STORAGE_KEY = "charah.cart.v1"

type CartContextValue = {
  lines: CartLine[]
  count: number
  add: (slug: string, qty?: number) => void
  setQty: (slug: string, qty: number) => void
  remove: (slug: string) => void
  clear: () => void
  open: boolean
  setOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((l) => l && typeof l.slug === "string" && Number.isFinite(l.qty))
      .map((l) => ({ slug: l.slug as string, qty: Math.max(1, Math.floor(l.qty)) }))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLines(readStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* private mode / storage disabled — cart just won't persist */
    }
  }, [lines, hydrated])

  const add = useCallback((slug: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug)
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
      }
      return [...prev, { slug, qty: Math.max(1, qty) }]
    })
    setOpen(true)
  }, [])

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, Math.floor(qty)) } : l)),
    )
  }, [])

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines])

  const value = useMemo(
    () => ({ lines, count, add, setQty, remove, clear, open, setOpen }),
    [lines, count, add, setQty, remove, clear, open],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within <CartProvider>")
  return ctx
}
