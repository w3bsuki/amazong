"use client"

import { cn } from "@/lib/utils"
import {
  Megaphone,
  Clock,
  Sparkle,
  Storefront,
  TrendUp,
} from "@phosphor-icons/react"

// =============================================================================
// Constants
// =============================================================================

const ALL_TAB_FILTERS = [
  { id: "promoted", label: { en: "Promoted", bg: "Промотирани" }, icon: Megaphone },
  { id: "newest", label: { en: "Newest", bg: "Най-нови" }, icon: Clock },
  { id: "suggested", label: { en: "Suggested", bg: "Предложени" }, icon: Sparkle },
  { id: "top-sellers", label: { en: "Top Sellers", bg: "Топ търговци" }, icon: Storefront },
  { id: "top-listings", label: { en: "Top Listings", bg: "Топ обяви" }, icon: TrendUp },
] as const

// =============================================================================
// Types
// =============================================================================

export interface AllTabFiltersProps {
  activeFilter: string
  locale: string
  onFilterClick: (id: string) => void
}

// =============================================================================
// Component
// =============================================================================

export function AllTabFilters({
  activeFilter,
  locale,
  onFilterClick,
}: AllTabFiltersProps) {
  return (
    <div className="px-(--page-inset)">
      <div className="flex overflow-x-auto no-scrollbar gap-2 snap-x snap-mandatory items-center">
        {ALL_TAB_FILTERS.map((filter) => {
          const Icon = filter.icon
          const isActive = activeFilter === filter.id
          return (
            <button
              key={filter.id}
              onClick={() => onFilterClick(filter.id)}
              className={cn(
                "flex items-center gap-1.5 h-touch-sm px-3 shrink-0 snap-start rounded-full text-xs font-semibold",
                "border transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isActive
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-background text-muted-foreground border-border/60 hover:border-border hover:bg-muted/40 hover:text-foreground"
              )}
              aria-pressed={isActive}
            >
              <Icon
                size={14}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "" : "opacity-70"}
              />
              <span className="whitespace-nowrap">
                {filter.label[locale as "en" | "bg"] || filter.label.en}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
