"use client"

import * as React from "react"
import { useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { CategoryAttribute } from "@/lib/data/categories"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CaretDown,
  SquaresFour,
  Rows,
  Check,
  Package,
  Star,
  Percent,
  Sliders,
  DotsThree,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SortSelect } from "../../../_components/search-controls/sort-select"
import { DesktopFilterModal } from "../../../_components/desktop/desktop-filter-modal"
import { getFilterPillsForCategory } from "../_lib/filter-priority"
import { getCategoryAttributeKey } from "@/lib/filters/category-attribute"

// =============================================================================
// TYPES
// =============================================================================

/** Quick filter toggle IDs - URL query param based */
export type QuickFilterId = "deals" | "nearby" | "top_rated" | "free_shipping"

export interface DesktopFilterToolbarProps {
  locale: string
  /** Current product count to display */
  productCount?: number
  /** Category name for display */
  categoryName?: string
  /** Category slug for filter context */
  categorySlug?: string
  /** Category ID for filter queries */
  categoryId?: string
  /** Category attributes for dynamic filter dropdowns */
  attributes?: CategoryAttribute[]
  /** Optional additional class */
  className?: string
}

// =============================================================================
// QUICK FILTER (GENERIC) CONFIG - Now shown in overflow dropdown
// =============================================================================

const QUICK_FILTERS: Array<{
  id: QuickFilterId
  labelKey: string
  icon: typeof Percent
  paramKey: string
  paramValue: string
}> = [
  { id: "deals", labelKey: "tabs.deals", icon: Percent, paramKey: "tag", paramValue: "deal" },
  { id: "top_rated", labelKey: "tabs.top_rated", icon: Star, paramKey: "minRating", paramValue: "4" },
  { id: "free_shipping", labelKey: "tabs.free_shipping", icon: Package, paramKey: "freeShipping", paramValue: "true" },
]

// =============================================================================
// PILL STYLING (treido-ui token-safe)
// =============================================================================

const pillBase = cn(
  "h-11 px-4 gap-2 rounded-full",
  "text-sm font-medium whitespace-nowrap",
  "flex items-center justify-center",
  "border transition-colors",
  "focus-visible:ring-2 focus-visible:ring-focus-ring"
)
const pillInactive = cn(
  "border-border bg-muted text-muted-foreground",
  "hover:bg-hover hover:text-foreground"
)
const pillActive = cn(
  "border-selected-border bg-selected text-primary"
)

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DesktopFilterToolbar({
  locale,
  productCount,
  categoryName,
  categorySlug,
  categoryId,
  attributes = [],
  className,
}: DesktopFilterToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("TabbedProductFeed")
  const tFilters = useTranslations("SearchFilters")
  const tViewMode = useTranslations("ViewMode")

  // Current view mode from URL or default to grid
  const viewMode = (searchParams.get("view") as "grid" | "list") || "grid"

  // Helper to update URL params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) params.delete(key)
        else params.set(key, value)
      }
      const queryString = params.toString()
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    },
    [router, pathname, searchParams]
  )

  // Check which quick filters are active
  const activeQuickFilters = useMemo(() => {
    const active: QuickFilterId[] = []
    for (const filter of QUICK_FILTERS) {
      if (searchParams.get(filter.paramKey) === filter.paramValue) {
        active.push(filter.id)
      }
    }
    return active
  }, [searchParams])

  // Toggle quick filter
  const toggleQuickFilter = useCallback(
    (filter: typeof QUICK_FILTERS[number]) => {
      const isActive = searchParams.get(filter.paramKey) === filter.paramValue
      updateParams({ [filter.paramKey]: isActive ? null : filter.paramValue })
    },
    [searchParams, updateParams]
  )

  // Get priority filters for this category (up to 4)
  const priorityFilters = useMemo(
    () => getFilterPillsForCategory(categorySlug, attributes),
    [categorySlug, attributes]
  )

  // Build attribute dropdowns - show ALL filterable attributes with options, ordered by priority
  const attributeDropdowns = useMemo(() => {
    if (!attributes.length) return []

    const result: Array<{
      key: string
      label: string
      paramKey: string
      options: Array<{ value: string; label: string }>
    }> = []
    
    const usedKeys = new Set<string>()

    // First: add priority filters that exist in attributes
    for (const filterKey of priorityFilters) {
      if (filterKey === "price" || filterKey === "category") continue

      const attr = attributes.find(
        (a) => getCategoryAttributeKey(a).toLowerCase() === filterKey.toLowerCase()
      )
      if (attr) {
        const attrKey = getCategoryAttributeKey(attr)
        if (usedKeys.has(attrKey)) continue
        
        const options = (locale === "bg" && attr.options_bg?.length ? attr.options_bg : attr.options || [])
          .slice(0, 10)
          .map((opt) => ({ value: opt, label: opt }))

        if (options.length > 0) {
          usedKeys.add(attrKey)
          result.push({
            key: attrKey,
            label: locale === "bg" && attr.name_bg ? attr.name_bg : attr.name,
            paramKey: `attr_${attrKey}`,
            options,
          })
        }
      }
    }
    
    // Then: add remaining filterable attributes with options (up to 6 total pills)
    for (const attr of attributes) {
      if (result.length >= 6) break
      
      const attrKey = getCategoryAttributeKey(attr)
      if (usedKeys.has(attrKey)) continue
      
      const options = (locale === "bg" && attr.options_bg?.length ? attr.options_bg : attr.options || [])
        .slice(0, 10)
        .map((opt) => ({ value: opt, label: opt }))

      if (options.length > 0) {
        usedKeys.add(attrKey)
        result.push({
          key: attrKey,
          label: locale === "bg" && attr.name_bg ? attr.name_bg : attr.name,
          paramKey: `attr_${attrKey}`,
          options,
        })
      }
    }

    return result.slice(0, 6) // Max 6 attribute pills
  }, [attributes, priorityFilters, locale])

  // Count active attribute filters
  const activeAttributeCount = useMemo(() => {
    let count = 0
    for (const key of searchParams.keys()) {
      if (key.startsWith("attr_")) count++
    }
    // Also count price/rating
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++
    if (searchParams.get("minRating")) count++
    return count
  }, [searchParams])

  // Total active filter count for badge
  const totalActiveFilters = activeQuickFilters.length + activeAttributeCount
  const overflowCount =
    activeQuickFilters.length > 0 ? activeQuickFilters.length : QUICK_FILTERS.length

  return (
    <div
      className={cn(
        "flex items-center gap-3 mb-4 pb-3 border-b border-border",
        className
      )}
    >
      {/* LEFT: Sort dropdown */}
      <div className="shrink-0">
        <SortSelect />
      </div>

      {/* Product count */}
      {typeof productCount === "number" && (
        <>
          <div className="h-5 w-px bg-border shrink-0" />
          <p className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
            <span className="font-semibold text-foreground">{productCount.toLocaleString(locale)}</span>
            {" "}{tFilters("results")}
            {categoryName && (
              <>
                {" "}{tFilters("in")}{" "}
                <span className="font-medium text-foreground">{categoryName}</span>
              </>
            )}
          </p>
        </>
      )}

      {/* CENTER: Category-specific attribute filters FIRST (Size, Brand, Color, etc.) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar ml-auto">
        {/* Category attribute dropdowns - shown FIRST for better UX */}
        {attributeDropdowns.map((dropdown) => {
          const selectedValue = searchParams.get(dropdown.paramKey)
          const hasValue = Boolean(selectedValue)

          return (
            <DropdownMenu key={dropdown.key}>
              <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="default"
              className={cn(pillBase, hasValue ? pillActive : pillInactive)}
            >
                  <span className="max-w-20 truncate">
                    {hasValue ? selectedValue : dropdown.label}
                  </span>
                  <CaretDown className="size-3 opacity-50 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-36 max-h-64 overflow-y-auto">
                {dropdown.options.map((opt) => {
                  const isSelected = selectedValue === opt.value
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => {
                        updateParams({
                          [dropdown.paramKey]: isSelected ? null : opt.value,
                        })
                      }}
                      className={cn(isSelected && "bg-accent")}
                    >
                      <span className="flex-1">{opt.label}</span>
                      {isSelected && <Check className="size-4 text-primary" />}
                    </DropdownMenuItem>
                  )
                })}
                {hasValue && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => updateParams({ [dropdown.paramKey]: null })}
                      variant="destructive"
                    >
                      {tFilters("clear")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}

        {/* All Filters button - opens modal for all filters */}
        {attributes.length > 0 && categorySlug && (
          <DesktopFilterModal
            attributes={attributes}
            categorySlug={categorySlug}
            categoryId={categoryId}
            trigger={
              <Button
                variant="ghost"
                size="default"
                className={cn(pillBase, totalActiveFilters > 0 ? pillActive : pillInactive)}
              >
                <Sliders size={14} weight="regular" className="shrink-0" />
                <span>{tFilters("filters")}</span>
                {totalActiveFilters > 0 && (
                  <Badge variant="default" className="h-4 min-w-4 px-1 text-2xs rounded-full">
                    {totalActiveFilters}
                  </Badge>
                )}
              </Button>
            }
          />
        )}

        {/* Generic quick filters in overflow dropdown (Deals, Top Rated, Free Shipping) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="default"
              className={cn(pillBase, activeQuickFilters.length > 0 ? pillActive : pillInactive)}
            >
              <DotsThree size={14} weight="bold" className="shrink-0" />
              <span>{t("tabs.moreFilters", { count: overflowCount })}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            {QUICK_FILTERS.map((filter) => {
              const Icon = filter.icon
              const isActive = activeQuickFilters.includes(filter.id)
              return (
                <DropdownMenuItem
                  key={filter.id}
                  onClick={() => toggleQuickFilter(filter)}
                  className={cn(isActive && "bg-accent")}
                >
                  <Icon size={16} weight={isActive ? "fill" : "regular"} className="shrink-0 mr-2" />
                  <span className="flex-1">{t(filter.labelKey)}</span>
                  {isActive && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* RIGHT: View toggle */}
      <div className="h-5 w-px bg-border shrink-0" />
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => value && updateParams({ view: value })}
        className="h-11 bg-muted p-0 rounded-full shrink-0 border border-border"
      >
        <ToggleGroupItem
          value="grid"
          aria-label={tViewMode("gridView")}
          className="size-11 p-0 rounded-full data-[state=on]:bg-background"
        >
          <SquaresFour size={16} weight={viewMode === "grid" ? "fill" : "regular"} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="list"
          aria-label={tViewMode("listView")}
          className="size-11 p-0 rounded-full data-[state=on]:bg-background"
        >
          <Rows size={16} weight={viewMode === "list" ? "fill" : "regular"} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
