"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { CategoryAttribute } from "@/lib/data/categories"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import {
  CaretDown,
  SquaresFour,
  TrendUp,
  TrendDown,
  ChartLineUp,
  Eye,
  Star,
  Percent,
  Rows,
  X,
  Check,
  MapPin,
  Package,
  Timer,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"

// =============================================================================
// TYPES
// =============================================================================

export type FeedTab =
  | "all"
  | "newest"
  | "promoted"
  | "nearby"
  | "deals"
  | "top_rated"
  | "best_sellers"
  | "most_viewed"
  | "price_low"
  | "price_high"
  | "free_shipping"
  | "ending_soon"

export interface FilterState {
  priceMin: string
  priceMax: string
  condition: string | null
  /** Dynamic attribute filters: attributeName -> selected value */
  attributes: Record<string, string | null>
}

// Re-export the CategoryAttribute type for consumers
export type { CategoryAttribute }

export interface FeedToolbarProps {
  locale: string
  productCount: number
  activeTab: FeedTab
  onTabChange: (tab: FeedTab) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  categorySlug: string | null
  /** User's city for nearby filtering */
  userCity?: string | null
  /** Callback when user wants to change city */
  onCityChange?: (city: string) => void
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
  categoryAttributes: CategoryAttribute[]
  isLoadingAttributes: boolean
}

// =============================================================================
// FEED TOOLBAR - Clean shadcn-style filter navigation
// =============================================================================

export function FeedToolbar({
  locale,
  productCount,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  categorySlug,
  userCity,
  onCityChange,
  filters,
  onFiltersChange,
  categoryAttributes,
  isLoadingAttributes,
}: FeedToolbarProps) {
  const t = useTranslations("TabbedProductFeed")
  const tViewMode = useTranslations("ViewMode")

  // Clean tab definitions - NO promoted (shown above in dedicated section)
  const allTabs: Array<{ id: FeedTab; label: string; icon: typeof TrendUp }> = [
    { id: "newest", label: t("tabs.newest"), icon: TrendUp },
    { id: "nearby", label: t("tabs.nearby"), icon: MapPin },
    { id: "deals", label: t("tabs.deals"), icon: Percent },
    { id: "best_sellers", label: t("tabs.best_sellers"), icon: ChartLineUp },
    { id: "top_rated", label: t("tabs.top_rated"), icon: Star },
    { id: "free_shipping", label: t("tabs.free_shipping"), icon: Package },
  ]

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
      const aPriority = priorityMap[a.name.toLowerCase()] ?? (a.sort_order ?? 999)
      const bPriority = priorityMap[b.name.toLowerCase()] ?? (b.sort_order ?? 999)
      return aPriority - bPriority
    })

    // Take first 5 attributes for filter pills
    return sorted.slice(0, 5).map((attr) => ({
      id: attr.name.toLowerCase().replace(/\s+/g, "_"),
      label: locale === "bg" && attr.name_bg ? attr.name_bg : attr.name,
      name: attr.name,
      options: (locale === "bg" && attr.options_bg && attr.options_bg.length > 0
        ? attr.options_bg
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
    <div className="flex flex-col gap-3 mb-4">
      {/* TOP ROW: Clean filter tabs */}
      <div className="flex items-center gap-3">
        {/* Product count */}
        <span className="text-sm font-medium text-foreground whitespace-nowrap shrink-0">
          {productCount.toLocaleString(locale)}{" "}
          <span className="text-muted-foreground font-normal">
            {t("sectionAriaLabel").toLocaleLowerCase(locale)}
          </span>
        </span>

        {/* Separator */}
        <div className="h-5 w-px bg-border shrink-0" />

        {/* Clean shadcn-style tabs */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          {allTabs.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "h-8 px-3 gap-1.5 shrink-0 rounded-full",
                  isActive && "shadow-sm"
                )}
              >
                <TabIcon size={14} weight={isActive ? "fill" : "regular"} />
                <span className="text-sm">{tab.label}</span>
              </Button>
            )
          })}
        </div>

        {/* City selector - shown when nearby tab is active */}
        {activeTab === "nearby" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={userCity ? "default" : "outline"}
                size="sm"
                className="h-8 gap-1.5 shrink-0 rounded-full"
              >
                <MapPin size={14} weight={userCity ? "fill" : "regular"} />
                <span>
                  {userCity 
                    ? BULGARIAN_CITIES.find(c => c.value === userCity)?.[locale === "bg" ? "labelBg" : "label"] ?? userCity
                    : locale === "bg" ? "Избери град" : "Select city"
                  }
                </span>
                <CaretDown size={12} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48 max-h-80 overflow-y-auto">
              {BULGARIAN_CITIES.filter(c => c.value !== "other").map((city) => {
                const isSelected = userCity === city.value
                return (
                  <DropdownMenuItem
                    key={city.value}
                    onClick={() => onCityChange?.(city.value)}
                    className={cn("cursor-pointer flex items-center gap-2", isSelected && "bg-muted font-medium")}
                  >
                    <span className="w-4 flex items-center justify-center">
                      {isSelected && <Check size={14} weight="bold" />}
                    </span>
                    {locale === "bg" ? city.labelBg : city.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* View Toggle */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && onViewModeChange(value as "grid" | "list")}
          variant="outline"
          className="h-8 bg-muted/50 p-0.5 rounded-full shrink-0"
        >
          <ToggleGroupItem
            value="grid"
            aria-label={tViewMode("gridView")}
            className="size-7 p-0 rounded-full data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            <SquaresFour size={14} weight={viewMode === "grid" ? "fill" : "regular"} />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="list"
            aria-label={tViewMode("listView")}
            className="size-7 p-0 rounded-full data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            <Rows size={14} weight={viewMode === "list" ? "fill" : "regular"} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* BOTTOM ROW: Category filter pills (only when category is selected) */}
      {(categoryFilters.length > 0 || isLoadingAttributes) && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categoryFilters.map((filter) => (
            <DropdownMenu
              key={filter.id}
              open={activeDropdown === filter.id}
              onOpenChange={(open) => setActiveDropdown(open ? filter.id : null)}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 px-3 gap-1.5 rounded-full shrink-0",
                    filters.attributes[filter.id] && "border-primary bg-primary/5"
                  )}
                >
                  {filter.label}
                  <CaretDown size={12} weight="bold" className="text-muted-foreground" />
                </Button>
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
            <Button
              key={af.id}
              variant="default"
              size="sm"
              onClick={() => {
                const newAttributes = { ...filters.attributes }
                delete newAttributes[af.id]
                onFiltersChange({ ...filters, attributes: newAttributes })
              }}
              className="h-8 px-3 gap-1.5 rounded-full shrink-0"
            >
              {af.displayLabel}
              <X size={12} weight="bold" />
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
