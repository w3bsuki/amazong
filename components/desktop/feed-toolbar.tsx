"use client"

import * as React from "react"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { CategoryAttribute } from "@/lib/data/categories"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ArrowUpDown as ArrowsDownUp, ChevronDown as CaretDown, Check, Rows3 as Rows, LayoutGrid as SquaresFour } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QuickFilterPills } from "./quick-filter-pills"
import { CategoryAttributeDropdowns, type CategoryFilterDef } from "./category-attribute-dropdowns"
import { pillBase, pillInactive } from "./feed-toolbar-pill"

// =============================================================================
// TYPES
// =============================================================================

export type FeedTab =
  | "newest"
  | "popular"
  | "price_low"
  | "price_high"

export type QuickFilter = "deals" | "nearby" | "top_rated" | "free_shipping"

export interface FilterState {
  priceMin: string
  priceMax: string
  condition: string | null
  /** Dynamic attribute filters: attributeName -> selected value */
  attributes: Record<string, string | null>
  /** Active quick filters */
  quickFilters: QuickFilter[]
}

// Re-export the CategoryAttribute type for consumers
export type { CategoryAttribute }

export interface FeedToolbarProps {
  locale: string
  productCount: number
  /** Show the count label to the left of the tabs (desktop home shows a dedicated category header). */
  showCount?: boolean
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
// CONSTANTS
// =============================================================================

const MAX_INLINE_ATTRS = 2

const SORT_OPTIONS: Array<{ id: FeedTab; labelKey: string }> = [
  { id: "newest", labelKey: "tabs.newest" },
  { id: "popular", labelKey: "tabs.best_sellers" },
  { id: "price_low", labelKey: "tabs.price_low" },
  { id: "price_high", labelKey: "tabs.price_high" },
]

// =============================================================================
// FEED TOOLBAR - Single row unified filter bar
// =============================================================================

export function FeedToolbar({
  locale,
  productCount,
  showCount = true,
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
}: FeedToolbarProps) {
  const t = useTranslations("TabbedProductFeed")
  const tViewMode = useTranslations("ViewMode")

  // Build contextual filter pills from category attributes (max 4 for single row)
  const categoryFilters = useMemo<CategoryFilterDef[]>(() => {
    if (!categorySlug || categoryAttributes.length === 0) return []

    // Skip Gender when already in a gendered category
    const isGenderedCategory = /^(men|women|kids|boys|girls)-/.test(categorySlug) ||
      categorySlug.includes("-mens") || categorySlug.includes("-womens")
    
    const filtered = categoryAttributes.filter(
      (attr) => attr.name.toLowerCase() !== "gender" || !isGenderedCategory
    )

    // Priority order: Condition first, then Size, Color, then by sortOrder
    const priorityMap: Record<string, number> = {
      "condition": 0,
      "size": 1,
      "color": 2,
      "brand": 3,
    }
    const sorted = [...filtered].sort((a, b) => {
      const aPriority = priorityMap[a.name.toLowerCase()] ?? (a.sort_order ?? 999)
      const bPriority = priorityMap[b.name.toLowerCase()] ?? (b.sort_order ?? 999)
      return aPriority - bPriority
    })

    // Return all sorted attributes for inline + overflow handling
    return sorted.map((attr) => ({
      id: attr.name.toLowerCase().replaceAll(/\s+/g, "_"),
      label: locale === "bg" && attr.name_bg ? attr.name_bg : attr.name,
      name: attr.name,
      options: (locale === "bg" && attr.options_bg && attr.options_bg.length > 0
        ? attr.options_bg
        : attr.options || []
      ).slice(0, 10).map((opt) => ({
        value: opt.toLowerCase().replaceAll(/\s+/g, "_"),
        label: opt,
      })),
    }))
  }, [categorySlug, categoryAttributes, locale])

  // Split category filters into inline (visible) and overflow ("+N more" dropdown)
  const inlineFilters = categoryFilters.slice(0, MAX_INLINE_ATTRS)
  const overflowFilters = categoryFilters.slice(MAX_INLINE_ATTRS)

  // Toggle quick filter
  const toggleQuickFilter = (id: QuickFilter) => {
    const current = filters.quickFilters || []
    const newFilters = current.includes(id)
      ? current.filter(f => f !== id)
      : [...current, id]
    onFiltersChange({ ...filters, quickFilters: newFilters })
  }

  const activeQuickFilters = filters.quickFilters || []

  // Get current sort label
  const currentSortLabel = SORT_OPTIONS.find(s => s.id === activeTab)?.labelKey ?? "tabs.newest"

  return (
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
      {/* LEFT: Sort dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={cn(pillBase, pillInactive)}>
            <ArrowsDownUp size={16} className="shrink-0" />
            <span>{t(currentSortLabel)}</span>
            <CaretDown className="size-4 opacity-60 shrink-0" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-44">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = activeTab === opt.id
            return (
              <DropdownMenuItem
                key={opt.id}
                onSelect={() => onTabChange(opt.id)}
                className={cn(isSelected && "bg-accent")}
              >
                <span className="flex-1">{t(opt.labelKey)}</span>
                {isSelected && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Product count */}
      {showCount && (
        <>
          <div className="h-6 w-px bg-border shrink-0" />
          <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
            <span className="font-semibold text-foreground">{productCount.toLocaleString(locale)}</span>
            {" "}{t("sectionAriaLabel").toLowerCase()}
          </span>
        </>
      )}

      {/* Category-specific filter dropdowns OR generic quick pills */}
      {categorySlug && categoryFilters.length > 0 ? (
        // Category selected: show category-specific filters (Size, Brand, Color, etc.)
        <CategoryAttributeDropdowns
          locale={locale}
          filters={filters}
          onFiltersChange={onFiltersChange}
          inlineFilters={inlineFilters}
          overflowFilters={overflowFilters}
        />
      ) : (
        // No category: show generic quick filter pills (Deals, Nearby, Top Rated)
        <QuickFilterPills
          locale={locale}
          activeQuickFilters={activeQuickFilters}
          onToggleQuickFilter={toggleQuickFilter}
          userCity={userCity ?? null}
          {...(onCityChange ? { onCityChange } : {})}
        />
      )}

      {/* View Toggle */}
      <div className="h-6 w-px bg-border shrink-0" />
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => value && onViewModeChange(value as "grid" | "list")}
        className="h-(--control-compact) bg-surface-subtle p-0.5 rounded-lg shrink-0 border border-border"
      >
        <ToggleGroupItem
          value="grid"
          aria-label={tViewMode("gridView")}
          className="size-8 p-0 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          <SquaresFour size={18} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="list"
          aria-label={tViewMode("listView")}
          className="size-8 p-0 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          <Rows size={18} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
