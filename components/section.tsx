import type React from "react"
import { cn } from "@/lib/utils"

type Tone = "cream" | "surface" | "ink"

const toneClass: Record<Tone, string> = {
  cream: "bg-charah-cream text-charah-ink",
  surface: "bg-white text-charah-ink",
  ink: "section-ink",
}

export function Section({
  tone = "cream",
  className,
  containerClassName,
  children,
  id,
}: {
  tone?: Tone
  className?: string
  containerClassName?: string
  children: React.ReactNode
  id?: string
}) {
  return (
    <section id={id} className={cn("py-section", toneClass[tone], className)}>
      <div className={cn("container", containerClassName)}>{children}</div>
    </section>
  )
}
