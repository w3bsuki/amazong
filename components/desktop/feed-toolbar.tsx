"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CaretDown,
  SquaresFour,
  TrendUp,
  ChartLineUp,
  Eye,
  Star,
  Percent,
  Fire,
  Rows,
  X,
  Check,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// =============================================================================
// TYPES
// =============================================================================

export type FeedTab =
  | "all"
  | "newest"
  | "promoted"
  | "deals"
  | "top_rated"
  | "best_sellers"
  | "most_viewed"
  | "price_low"

export interface FilterState {
  priceMin: string
  priceMax: string
  condition: string | null
  /** Dynamic attribute filters: attributeName -> selected value */
  attributes: Record<string, string | null>
}

export interface CategoryAttribute {
  id: string
  name: string
  nameBg: string | null
  type: string
  options: string[] | null
  optionsBg: string[] | null
  sortOrder: number | null
}

export interface FeedToolbarProps {
  locale: string
  productCount: number
  activeTab: FeedTab
  onTabChange: (tab: FeedTab) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  categorySlug: string | null
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
  categoryAttributes: CategoryAttribute[]
  isLoadingAttributes: boolean
}

// =============================================================================
// FEED TOOLBAR - Inline search row that lives with content
// =============================================================================

export function FeedToolbar({
  locale,
  productCount,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  categorySlug,
  filters,
  onFiltersChange,
  categoryAttributes,
  isLoadingAttributes,
}: FeedToolbarProps) {
  const tabs: { id: FeedTab; label: string; icon: typeof TrendUp }[] = [
    { id: "newest", label: locale === "bg" ? "Най-нови" : "Newest", icon: TrendUp },
    { id: "best_sellers", label: locale === "bg" ? "Топ продажби" : "Best Sellers", icon: ChartLineUp },
    { id: "most_viewed", label: locale === "bg" ? "Най-гледани" : "Most Viewed", icon: Eye },
    { id: "top_rated", label: locale === "bg" ? "Най-високо оценени" : "Top Rated", icon: Star },
    { id: "deals", label: locale === "bg" ? "Намаления" : "Deals", icon: Percent },
    { id: "promoted", label: locale === "bg" ? "Промотирани" : "Promoted", icon: Fire },
  ]

  const activeTabData = tabs.find((t) => t.id === activeTab) ?? tabs[0]!
  const ActiveIcon = activeTabData.icon

  // Build contextual filter pills from category attributes (max 5 for UI cleanliness)
  const categoryFilters = useMemo(() => {
    if (!categorySlug || categoryAttributes.length === 0) return []

    // Skip Gender when already in a gendered category (e.g., men-clothing, women-shoes)
    const isGenderedCategory = /^(men|women|kids|boys|girls)-/.test(categorySlug) ||
      categorySlug.includes("-mens") || categorySlug.includes("-womens")
    
    // Filter out Gender if redundant, then sort by priority
    const filtered = categoryAttributes.filter(attr => {
      if (attr.name.toLowerCase() === "gender" && isGenderedCategory) return false
      return true
    })

    // Priority order: Condition first, then Size, Color, then by sortOrder
    const priorityMap: Record<string, number> = {
      "condition": 0,
      "size": 1,
      "color": 2,
    }
    const sorted = [...filtered].sort((a, b) => {
      const aPriority = priorityMap[a.name.toLowerCase()] ?? (a.sortOrder ?? 999)
      const bPriority = priorityMap[b.name.toLowerCase()] ?? (b.sortOrder ?? 999)
      return aPriority - bPriority
    })

    // Take first 5 attributes for filter pills
    return sorted.slice(0, 5).map((attr) => ({
      id: attr.name.toLowerCase().replace(/\s+/g, "_"),
      label: locale === "bg" && attr.nameBg ? attr.nameBg : attr.name,
      name: attr.name,
      options: (locale === "bg" && attr.optionsBg && attr.optionsBg.length > 0
        ? attr.optionsBg
        : attr.options || []
      ).slice(0, 8).map((opt) => ({
        value: opt.toLowerCase().replace(/\s+/g, "_"),
        label: opt,
      })),
    }))
  }, [categorySlug, categoryAttributes, locale])

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Get active attribute filters for badge display
  const activeAttributeFilters = useMemo(() => {
    const active: { id: string; label: string; value: string; displayLabel: string }[] = []
    for (const filter of categoryFilters) {
      const selectedValue = filters.attributes[filter.id]
      if (selectedValue) {
        const opt = filter.options.find((o) => o.value === selectedValue)
        if (opt) {
          active.push({
            id: filter.id,
            label: filter.label,
            value: selectedValue,
            displayLabel: opt.label,
          })
        }
      }
    }
    return active
  }, [categoryFilters, filters.attributes])

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* LEFT: Product count + Category filter pills */}
      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar">
        <span className="text-sm font-medium text-foreground whitespace-nowrap shrink-0">
          {productCount.toLocaleString()}{" "}
          <span className="text-muted-foreground font-normal">
            {locale === "bg" ? "обяви" : "listings"}
          </span>
        </span>

        {/* Category filter pills - loading skeleton */}
        {isLoadingAttributes && categorySlug && (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full shrink-0" />
            ))}
          </>
        )}

        {/* Category filter pills - only show when category selected */}
        {!isLoadingAttributes && categoryFilters.map((filter) => (
          <DropdownMenu 
            key={filter.id} 
            open={activeDropdown === filter.id} 
            onOpenChange={(open) => setActiveDropdown(open ? filter.id : null)}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 h-9 text-sm rounded-full border whitespace-nowrap shrink-0",
                  "bg-background border-border hover:bg-muted/50 transition-colors",
                  filters.attributes[filter.id] && "border-foreground/20 bg-foreground/5",
                )}
              >
                {filter.label}
                <CaretDown size={12} weight="bold" className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-36">
              {filter.options.map((opt) => {
                const isSelected = filters.attributes[filter.id] === opt.value
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => {
                      const newAttributes = { ...filters.attributes }
                      if (newAttributes[filter.id] === opt.value) {
                        delete newAttributes[filter.id]
                      } else {
                        newAttributes[filter.id] = opt.value
                      }
                      onFiltersChange({ ...filters, attributes: newAttributes })
                    }}
                    className={cn("cursor-pointer", isSelected && "bg-muted font-medium")}
                  >
                    <span className="w-4 flex items-center justify-center mr-1">
                      {isSelected && <Check size={14} weight="bold" />}
                    </span>
                    {opt.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        {/* Active filter badges */}
        {activeAttributeFilters.map((af) => (
          <button
            key={af.id}
            type="button"
            onClick={() => {
              const newAttributes = { ...filters.attributes }
              delete newAttributes[af.id]
              onFiltersChange({ ...filters, attributes: newAttributes })
            }}
            className="inline-flex items-center gap-1.5 px-3 h-9 text-sm rounded-full bg-foreground text-background font-medium whitespace-nowrap shrink-0"
          >
            {af.displayLabel}
            <X size={14} weight="bold" className="text-background/70" />
          </button>
        ))}
      </div>

      {/* RIGHT: Sort + View Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 h-9",
                "text-sm font-medium whitespace-nowrap",
                "bg-muted/40 text-foreground border border-border/50",
                "hover:bg-muted/60 hover:border-border transition-all duration-150",
              )}
            >
              <ActiveIcon size={14} weight="fill" />
              <span>{activeTabData.label}</span>
              <CaretDown size={12} weight="bold" className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "cursor-pointer flex items-center gap-2",
                    isActive && "bg-muted font-medium"
                  )}
                >
                  <span className="w-4 flex items-center justify-center">
                    {isActive && <Check size={14} weight="bold" />}
                  </span>
                  <Icon size={14} weight={isActive ? "fill" : "regular"} />
                  {tab.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Toggle */}
        <div className="relative flex items-center rounded-lg border border-border/50 bg-muted/30 p-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "size-8 rounded-md transition-all duration-150",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent"
            )}
            aria-label="Grid view"
          >
            <SquaresFour size={16} weight={viewMode === "grid" ? "fill" : "regular"} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "size-8 rounded-md transition-all duration-150",
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent"
            )}
            aria-label="List view"
          >
            <Rows size={16} weight={viewMode === "list" ? "fill" : "regular"} />
          </Button>
        </div>
      </div>
    </div>
  )
}
