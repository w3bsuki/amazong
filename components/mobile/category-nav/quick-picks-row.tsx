"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Fire, Star, TrendUp } from "@phosphor-icons/react"

// =============================================================================
// Types
// =============================================================================

export interface QuickPick {
  id: string
  label: string
  icon: React.ReactNode
  /** Query params to add when selected */
  params?: Record<string, string>
}

export interface QuickPicksRowProps {
  /** Locale for translations */
  locale: string
  /** Currently selected pick ID */
  selectedId?: string | null
  /** Called when a pick is tapped */
  onSelect: (pick: QuickPick) => void
  /** Additional class name */
  className?: string
}

// =============================================================================
// Default Picks
// =============================================================================

function getDefaultPicks(locale: string): QuickPick[] {
  const isEn = locale === "en"
  return [
    {
      id: "trending",
      label: isEn ? "Trending" : "Популярни",
      icon: <TrendUp size={16} weight="bold" />,
      params: { sort: "trending" },
    },
    {
      id: "deals",
      label: isEn ? "Deals" : "Намаления",
      icon: <Fire size={16} weight="fill" className="text-destructive" />,
      params: { deals: "true" },
    },
    {
      id: "top-rated",
      label: isEn ? "Top Rated" : "Най-добри",
      icon: <Star size={16} weight="fill" className="text-warning" />,
      params: { sort: "rating" },
    },
  ]
}

// =============================================================================
// Component
// =============================================================================

export function QuickPicksRow({
  locale,
  selectedId,
  onSelect,
  className,
}: QuickPicksRowProps) {
  const picks = getDefaultPicks(locale)

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto no-scrollbar", className)}>
      {picks.map((pick) => {
        const isSelected = selectedId === pick.id

        return (
          <button
            key={pick.id}
            type="button"
            onClick={() => onSelect(pick)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "text-xs font-medium",
              "border transition-all duration-150",
              "active:scale-95",
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:bg-accent"
            )}
            aria-pressed={isSelected}
          >
            {pick.icon}
            <span>{pick.label}</span>
          </button>
        )
      })}
    </div>
  )
}
