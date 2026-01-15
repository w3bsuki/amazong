"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Fire, Gift, Truck, Sparkle, Tag, Clock } from "@phosphor-icons/react"

export type QuickFilterId = 
  | "urgent"
  | "free" 
  | "free_shipping"
  | "new_only"
  | "on_sale"
  | "today"

interface QuickFilter {
  id: QuickFilterId
  icon: typeof Fire
  labelKey: string
}

const QUICK_FILTERS: QuickFilter[] = [
  { id: "on_sale", icon: Tag, labelKey: "onSale" },
  { id: "new_only", icon: Sparkle, labelKey: "newOnly" },
  { id: "free_shipping", icon: Truck, labelKey: "freeShipping" },
  { id: "today", icon: Clock, labelKey: "today" },
  { id: "free", icon: Gift, labelKey: "free" },
  { id: "urgent", icon: Fire, labelKey: "urgent" },
]

interface QuickFilterChipsProps {
  /** Currently active filter IDs */
  activeFilters: QuickFilterId[]
  /** Called when a filter is toggled */
  onToggle: (filterId: QuickFilterId) => void
  /** Additional class names */
  className?: string
}

/**
 * QuickFilterChips - OLX/Bazar-style horizontal filter chip strip
 * 
 * Features:
 * - One-tap toggle filters for common use cases
 * - Horizontal scrollable on mobile
 * - Syncs with URL params
 */
export function QuickFilterChips({
  activeFilters,
  onToggle,
  className,
}: QuickFilterChipsProps) {
  const t = useTranslations("QuickFilters")

  return (
    <div className={cn("flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1", className)}>
      {QUICK_FILTERS.map((filter) => {
        const isActive = activeFilters.includes(filter.id)
        const Icon = filter.icon
        
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onToggle(filter.id)}
            className={cn(
              "inline-flex items-center gap-1.5 shrink-0",
              "h-touch-sm px-3 rounded-full",
              "text-sm font-medium whitespace-nowrap",
              "transition-colors touch-action-manipulation",
              isActive
                ? "bg-foreground text-background border border-foreground"
                : "bg-background text-muted-foreground border border-border/60 hover:bg-muted/40 hover:text-foreground hover:border-foreground/20"
            )}
            aria-pressed={isActive}
          >
            <Icon size={14} weight={isActive ? "fill" : "regular"} />
            <span>{t(filter.labelKey)}</span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Hook to manage quick filter state with URL sync
 */
export function useQuickFilters() {
  const [activeFilters, setActiveFilters] = React.useState<QuickFilterId[]>([])

  const toggleFilter = React.useCallback((filterId: QuickFilterId) => {
    setActiveFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId)
      }
      return [...prev, filterId]
    })
  }, [])

  const clearFilters = React.useCallback(() => {
    setActiveFilters([])
  }, [])

  // Convert filters to API params
  const toApiParams = React.useCallback(() => {
    const params: Record<string, string> = {}
    
    for (const filter of activeFilters) {
      switch (filter) {
        case "urgent":
          params.urgent = "true"
          break
        case "free":
          params.maxPrice = "0"
          break
        case "free_shipping":
          params.freeShipping = "true"
          break
        case "new_only":
          params.condition = "new"
          break
        case "on_sale":
          params.onSale = "true"
          break
        case "today":
          params.since = "today"
          break
      }
    }
    
    return params
  }, [activeFilters])

  return {
    activeFilters,
    toggleFilter,
    clearFilters,
    toApiParams,
    hasActiveFilters: activeFilters.length > 0,
  }
}
