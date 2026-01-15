"use client"

import { cn } from "@/lib/utils"

// =============================================================================
// TYPES
// =============================================================================

type ConditionType = "new" | "new_with_tags" | "new_without_tags" | "like_new" | "very_good" | "good" | "fair" | "used" | "refurbished"

interface ConditionBadgeProps {
  condition: ConditionType | string
  /** Compact (text only) or pill (with background) */
  variant?: "compact" | "pill"
  className?: string
}

// =============================================================================
// STYLING MAP - Vinted/Depop-inspired condition colors
// =============================================================================

const CONDITION_STYLES: Record<string, { bg: string; text: string; label: string; labelBg: string }> = {
  // New conditions (green tones)
  new: {
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "New",
    labelBg: "Ново",
  },
  new_with_tags: {
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "New with tags",
    labelBg: "Ново с етикет",
  },
  new_without_tags: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "New w/o tags",
    labelBg: "Ново без етикет",
  },
  // Like new / very good (blue tones)
  like_new: {
    bg: "bg-blue-100 dark:bg-blue-950/50",
    text: "text-blue-700 dark:text-blue-400",
    label: "Like new",
    labelBg: "Като ново",
  },
  very_good: {
    bg: "bg-sky-100 dark:bg-sky-950/50",
    text: "text-sky-700 dark:text-sky-400",
    label: "Very good",
    labelBg: "Много добро",
  },
  // Good (amber tones)
  good: {
    bg: "bg-amber-100 dark:bg-amber-950/50",
    text: "text-amber-700 dark:text-amber-400",
    label: "Good",
    labelBg: "Добро",
  },
  // Fair / used (orange tones)
  fair: {
    bg: "bg-orange-100 dark:bg-orange-950/50",
    text: "text-orange-700 dark:text-orange-400",
    label: "Fair",
    labelBg: "Задоволително",
  },
  used: {
    bg: "bg-stone-100 dark:bg-stone-800/50",
    text: "text-stone-600 dark:text-stone-400",
    label: "Used",
    labelBg: "Употребявано",
  },
  // Refurbished (purple)
  refurbished: {
    bg: "bg-violet-100 dark:bg-violet-950/50",
    text: "text-violet-700 dark:text-violet-400",
    label: "Refurbished",
    labelBg: "Рефърбиш",
  },
}

// =============================================================================
// HELPERS
// =============================================================================

function normalizeCondition(condition: string): string {
  const normalized = condition.toLowerCase().trim().replace(/\s+/g, "_")
  // Map common variations
  if (normalized.includes("new") && normalized.includes("tag")) {
    return normalized.includes("without") ? "new_without_tags" : "new_with_tags"
  }
  if (normalized === "likenew" || normalized === "like-new") return "like_new"
  if (normalized === "verygood" || normalized === "very-good") return "very_good"
  if (normalized === "refurb") return "refurbished"
  return normalized
}

// =============================================================================
// COMPONENT
// =============================================================================

function ConditionBadge({
  condition,
  variant = "compact",
  className,
}: ConditionBadgeProps) {
  const normalizedCondition = normalizeCondition(condition)
  const style = CONDITION_STYLES[normalizedCondition] ?? CONDITION_STYLES.used!

  if (variant === "pill") {
    return (
      <span
        className={cn(
          "inline-flex items-center px-1.5 py-0.5 rounded-full text-2xs font-medium",
          style.bg,
          style.text,
          className
        )}
      >
        {style.label}
      </span>
    )
  }

  // Compact variant - text only with subtle border
  return (
    <span
      className={cn(
        "text-2xs font-medium border px-1 py-px rounded-sm",
        style.text,
        "border-current/30",
        className
      )}
    >
      {style.label}
    </span>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ConditionBadge, CONDITION_STYLES, normalizeCondition, type ConditionBadgeProps, type ConditionType }
