import type React from "react"
import { cn } from "@/lib/utils"

export function PageHeader({
  eyebrow,
  title,
  intro,
  className,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <header className={cn("border-b border-charah-hairline bg-white", className)}>
      <div className="container py-14 md:py-20">
        {eyebrow ? (
          <p className="mb-3 text-eyebrow font-semibold uppercase text-charah-red">{eyebrow}</p>
        ) : null}
        <h1 className="font-serif text-h1 text-charah-ink">{title}</h1>
        {intro ? (
          <p className="mt-4 max-w-2xl text-body-lg text-charah-stone">{intro}</p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </header>
  )
}
