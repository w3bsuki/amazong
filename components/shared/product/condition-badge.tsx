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
  // New conditions (semantic green)
  new: {
    bg: "bg-condition-new-bg",
    text: "text-condition-new",
    label: "New",
    labelBg: "Ново",
  },
  new_with_tags: {
    bg: "bg-condition-new-bg",
    text: "text-condition-new",
    label: "New with tags",
    labelBg: "Ново с етикет",
  },
  new_without_tags: {
    bg: "bg-condition-new-bg/70",
    text: "text-condition-new",
    label: "New w/o tags",
    labelBg: "Ново без етикет",
  },
  // Like new / very good (semantic blue)
  like_new: {
    bg: "bg-condition-likenew-bg",
    text: "text-condition-likenew",
    label: "Like new",
    labelBg: "Като ново",
  },
  very_good: {
    bg: "bg-condition-likenew-bg/70",
    text: "text-condition-likenew",
    label: "Very good",
    labelBg: "Много добро",
  },
  // Good (semantic amber)
  good: {
    bg: "bg-condition-good-bg",
    text: "text-condition-good",
    label: "Good",
    labelBg: "Добро",
  },
  // Fair / used (semantic orange/neutral)
  fair: {
    bg: "bg-condition-fair-bg",
    text: "text-condition-fair",
    label: "Fair",
    labelBg: "Задоволително",
  },
  used: {
    bg: "bg-condition-used-bg",
    text: "text-condition-used",
    label: "Used",
    labelBg: "Употребявано",
  },
  // Refurbished (semantic purple)
  refurbished: {
    bg: "bg-condition-refurb-bg",
    text: "text-condition-refurb",
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
