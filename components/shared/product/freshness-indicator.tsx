"use client"

import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Clock } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface FreshnessIndicatorProps {
  createdAt: string | null | undefined
  className?: string
  showIcon?: boolean
  /** Variant: "badge" shows highlighted pill for fresh items, "text" shows plain text */
  variant?: "badge" | "text"
}

/**
 * Format a date to a human-readable relative time string
 * Shows "Today", "Yesterday", or relative time like "2 days ago"
 */
function formatFreshness(
  input: string,
  locale: string,
  t: ReturnType<typeof useTranslations<"Freshness">>
): { label: string; isFresh: boolean; isToday: boolean } {
  const d = new Date(input)
  const ms = d.getTime()
  if (!Number.isFinite(ms)) return { label: "", isFresh: false, isToday: false }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const itemDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const diffMs = now.getTime() - ms
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  // Today
  if (itemDate.getTime() === today.getTime()) {
    if (diffHours < 1) {
      return { label: t("justNow"), isFresh: true, isToday: true }
    }
    return { label: t("today"), isFresh: true, isToday: true }
  }

  // Yesterday
  if (itemDate.getTime() === yesterday.getTime()) {
    return { label: t("yesterday"), isFresh: true, isToday: false }
  }

  // Within last week - show relative
  if (diffDays < 7) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" })
    const days = Math.round(diffDays)
    return { label: rtf.format(-days, "day"), isFresh: diffDays < 3, isToday: false }
  }

  // Within last month
  if (diffDays < 30) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" })
    const weeks = Math.round(diffDays / 7)
    return { label: rtf.format(-weeks, "week"), isFresh: false, isToday: false }
  }

  // Older - show date
  const formatted = d.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    ...(d.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  })
  return { label: formatted, isFresh: false, isToday: false }
}

/**
 * FreshnessIndicator - Shows how fresh a listing is
 * Highlights "Today" and "Yesterday" for recently listed items
 */
export function FreshnessIndicator({
  createdAt,
  className,
  showIcon = false,
  variant = "text",
}: FreshnessIndicatorProps) {
  const locale = useLocale()
  const t = useTranslations("Freshness")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!createdAt || !hydrated) return null

  const { label, isFresh, isToday } = formatFreshness(createdAt, locale, t)

  if (!label) return null

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium uppercase tracking-wide",
          isToday && "bg-fresh-bg text-fresh",
          !isToday && isFresh && "bg-recent-bg text-recent",
          !isFresh && "bg-muted text-muted-foreground",
          className
        )}
      >
        {showIcon && <Clock size={10} weight="bold" />}
        {label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-tiny",
        isFresh ? "font-medium text-fresh" : "text-muted-foreground",
        className
      )}
    >
      {showIcon && <Clock size={10} weight={isFresh ? "bold" : "regular"} />}
      {label}
    </span>
  )
}
