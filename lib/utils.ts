import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge doesn't know about our custom fontSize scale (tailwind.config.ts),
// so by default it lumps e.g. "text-h3" in with "text-color" utilities and silently
// drops whichever one loses the conflict -- e.g. cn("text-h3 text-charah-ink") was
// dropping text-h3, rendering nav links etc. at the browser-default 16px instead of
// the intended type-scale size. Registering the scale here fixes that everywhere.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display-xl',
        'text-display-lg',
        'text-display-md',
        'text-h1',
        'text-h2',
        'text-h3',
        'text-h4',
        'text-body-lg',
        'text-body',
        'text-body-sm',
        'text-eyebrow',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
