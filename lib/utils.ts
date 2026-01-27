import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Map product condition string to Badge variant
 * Used across product cards, quick views, etc.
 */
export type ConditionBadgeVariant = 
  | "condition-new"
  | "condition-likenew" 
  | "condition-good"
  | "condition-fair"
  | "condition-used"
  | "condition-refurb"
  | "condition"

export function getConditionBadgeVariant(condition: string | null | undefined): ConditionBadgeVariant {
  if (!condition) return "condition"
  const normalized = condition.toLowerCase().replace(/[\s_-]/g, "")
  switch (normalized) {
    case "new":
    case "newwithtags":
      return "condition-new"
    case "likenew":
    case "usedexcellent":
      return "condition-likenew"
    case "good":
    case "usedgood":
      return "condition-good"
    case "fair":
    case "usedfair":
      return "condition-fair"
    case "used":
      return "condition-used"
    case "refurbished":
    case "refurb":
      return "condition-refurb"
    default:
      return "condition"
  }
}

export function safeAvatarSrc(src: string | null | undefined): string | undefined {
  if (!src) return undefined
  // Generated avatars are stored as a pseudo-URL format and must not be fetched by the browser.
  if (src.startsWith("boring-avatar:")) return undefined

  // Allow only known-safe URL schemes for <img src="...">.
  // This prevents "ERR_UNKNOWN_URL_SCHEME" and blocks unsafe schemes like `javascript:`.
  if (src.startsWith("http://")) return src
  if (src.startsWith("https://")) return src
  if (src.startsWith("/")) return src
  if (src.startsWith("data:")) return src
  if (src.startsWith("blob:")) return src

  return undefined
}
