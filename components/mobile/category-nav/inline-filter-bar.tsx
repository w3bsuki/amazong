"use client"

import { useState, useMemo, useCallback } from "react"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { SortModal } from "@/components/shared/filters/sort-modal"
import type { CategoryAttribute } from "@/lib/data/categories"
import { getCategoryAttributeKey } from "@/lib/filters/category-attribute"

// =============================================================================
// INLINE FILTER BAR — Clean 50/50 Split Design
//
// OLX/Vinted/Depop inspired: Two equal tab-style buttons
// - Left: "Filters" with active count badge → opens FilterHub drawer
// - Right: "Sort" showing current sort → opens sort bottom sheet
//
// Design system compliance (.codex/project/DESIGN.md):
// - h-11 touch targets (44px Treido standard)
// - Semantic tokens only (text-muted-foreground, bg-muted)
// - Tailwind v4 best practices
// - lucide-react icons (repo standard)
// =============================================================================

/** Shared styles for filter/sort tab buttons */
const tabButtonStyles = cn(
  // Layout
  "flex-1 h-touch",
  "inline-flex items-center justify-center gap-2",
  // Typography
  "text-sm font-semibold",
  // Colors - visible, not faded
  "text-foreground",
  // Border styling
  "border border-border",
  // Interaction
  "tap-highlight-transparent",
  "transition-colors duration-150",
  "active:bg-muted",
  // Focus (shadcn pattern)
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-0"
)

export interface InlineFilterBarProps {
  /** Current locale for i18n */
  locale: string
  /** Called when "Filters" button is clicked (opens FilterHub) */
  onAllFiltersClick: () => void
  /** Optional externally-controlled applied params (for instant, non-navigating flows) */
  appliedSearchParams?: URLSearchParams | ReadonlyURLSearchParams | undefined
  /** Filterable attributes from category (used for counting active filters) */
  attributes?: CategoryAttribute[]
  /** Sticky position top offset (after header + pills) */
  stickyTop?: number
  /** Whether this bar is sticky (default: true). */
  sticky?: boolean
  /** Override base path for sort query params */
  basePath?: string | undefined
  /** Additional CSS classes */
  className?: string
}

/** Sort option keys */
const SORT_OPTIONS = ["featured", "price-asc", "price-desc", "rating", "newest"] as const
type SortOption = (typeof SORT_OPTIONS)[number]

export function InlineFilterBar({
  locale,
  onAllFiltersClick,
  appliedSearchParams,
  attributes = [],
  stickyTop = 80,
  sticky = true,
  basePath,
  className,
}: InlineFilterBarProps) {
  const t = useTranslations("SearchFilters")
  const searchParamsFromRouter = useSearchParams()
  const searchParams = appliedSearchParams ?? searchParamsFromRouter

  const [sortOpen, setSortOpen] = useState(false)

  // Count active filters (memoized for perf)
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++
    if (searchParams.get("minRating")) count++
    if (searchParams.get("availability")) count++
    if (searchParams.get("deals") === "true") count++
    if (searchParams.get("verified") === "true") count++
    // Count attribute filters
    for (const attr of attributes) {
      if (searchParams.getAll(`attr_${getCategoryAttributeKey(attr)}`).length > 0) count++
    }
    return count
  }, [searchParams, attributes])

  // Current sort value
  const currentSort = (searchParams.get("sort") || "featured") as SortOption
  const isSorted = currentSort !== "featured"

  // Sort labels (memoized to avoid recreating on each render)
  const sortLabels = useMemo<Record<SortOption, string>>(
    () => ({
      featured: t("featured"),
      "price-asc": t("priceLowHigh"),
      "price-desc": t("priceHighLow"),
      rating: t("avgReview"),
      newest: t("newestArrivals"),
    }),
    [t]
  )

  const openSort = useCallback(() => setSortOpen(true), [])

  const hasActiveFilters = activeFilterCount > 0

  return (
    <>
      <div
        className={cn(
          "bg-background px-inset py-2",
          sticky && "sticky z-20",
          className
        )}
        style={sticky ? { top: stickyTop } : undefined}
      >
        {/* 50/50 Tab Bar */}
        <div className="flex items-stretch gap-2" role="group" aria-label={t("filters")}>
          {/* Filters Tab */}
          <button
            type="button"
            onClick={onAllFiltersClick}
            className={cn(
              tabButtonStyles,
              "rounded-xl",
              hasActiveFilters && "bg-selected border-selected-border"
            )}
            aria-haspopup="dialog"
            aria-expanded={false}
          >
            <SlidersHorizontal className="size-4 shrink-0" aria-hidden="true" />
            <span>{t("filters")}</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center size-5 rounded-full bg-foreground text-background text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Tab */}
          <button
            type="button"
            onClick={openSort}
            className={cn(
              tabButtonStyles,
              "rounded-xl",
              isSorted && "bg-selected border-selected-border"
            )}
            aria-haspopup="dialog"
            aria-expanded={sortOpen}
            aria-label={`${t("sortBy")}: ${sortLabels[currentSort]}`}
          >
            <ArrowUpDown className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {isSorted ? sortLabels[currentSort] : t("sortBy")}
            </span>
          </button>
        </div>
      </div>

      {/* Sort Bottom Sheet */}
      <SortModal
        open={sortOpen}
        onOpenChange={setSortOpen}
        locale={locale}
        basePath={basePath}
      />
    </>
  )
}
