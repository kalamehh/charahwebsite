import type { StepGroup } from "@/content/recipes"

export type StepBlock =
  | { kind: "step"; label: string; heading?: string; text: string }
  | { kind: "step-list"; label: string; heading?: string; items: string[] }

/**
 * Flattens a recipe's step groups into a numbered rendering plan.
 *
 * Numbering is continuous (1, 2, 3…) across groups — it doesn't restart per
 * group. Consecutive groups marked `alt` (alternative methods, e.g. grill vs
 * oven) share one step number, suffixed a/b/c…, so they read as a fork in
 * the recipe rather than as separate sequential steps.
 */
export function layoutSteps(groups: StepGroup[]): StepBlock[] {
  const blocks: StepBlock[] = []
  let n = 0
  let letter = 0
  let inAltRun = false

  for (const g of groups) {
    if (g.alt) {
      if (!inAltRun) {
        n += 1
        letter = 0
        inAltRun = true
      }
      letter += 1
      const label = `${n}${String.fromCharCode(96 + letter)}` // 2a, 2b, …
      blocks.push(
        g.items.length <= 1
          ? { kind: "step", label, heading: g.group, text: g.items[0] ?? "" }
          : { kind: "step-list", label, heading: g.group, items: g.items },
      )
    } else {
      inAltRun = false
      for (const item of g.items) {
        n += 1
        blocks.push({ kind: "step", label: `${n}`, text: item })
      }
    }
  }

  return blocks
}
