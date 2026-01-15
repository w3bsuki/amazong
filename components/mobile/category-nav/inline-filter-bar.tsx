"use client"

import { useState, useMemo } from "react"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { Sliders, ArrowsDownUp } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { SortModal } from "@/components/shared/filters/sort-modal"
import type { CategoryAttribute } from "@/lib/data/categories"

// =============================================================================
// INLINE FILTER BAR — Clean 50/50 Split Design
//
// OLX/Vinted/Depop inspired: Two equal buttons
// - Left: "Filters" with active count badge → opens FilterHub drawer
// - Right: "Sort" showing current sort → opens sort bottom sheet
//
// Per DESIGN.md and UI_UX_CODEX:
// - h-10 touch targets (40px)
// - Semantic tokens only
// - Tailwind v4 best practices
// =============================================================================

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

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++
    if (searchParams.get("minRating")) count++
    if (searchParams.get("availability")) count++
    if (searchParams.get("deals") === "true") count++
    if (searchParams.get("verified") === "true") count++
    // Count attribute filters
    for (const attr of attributes) {
      if (searchParams.getAll(`attr_${attr.name}`).length > 0) count++
    }
    return count
  }, [searchParams, attributes])

  // Get current sort value and label
  const currentSort = searchParams.get("sort") || "featured"
  const isSorted = currentSort !== "featured"

  const sortLabels: Record<string, string> = {
    featured: t("featured"),
    "price-asc": t("priceLowHigh"),
    "price-desc": t("priceHighLow"),
    rating: t("avgReview"),
    newest: t("newestArrivals"),
  }

  const hasActiveFilters = activeFilterCount > 0

  return (
    <>
      <div
        className={cn(sticky && "sticky z-20", "bg-background border-b border-border", className)}
        style={sticky ? { top: stickyTop } : undefined}
      >
        {/* 50/50 Tab Bar - OLX style */}
        <div className="flex items-center h-11">
          {/* Filters Tab */}
          <button
            type="button"
            onClick={onAllFiltersClick}
            className={cn(
              "flex-1 h-full",
              "inline-flex items-center justify-center gap-2",
              "text-sm font-medium",
              "tap-highlight-transparent active:bg-muted/50",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              "border-r border-border",
              hasActiveFilters ? "text-foreground" : "text-muted-foreground"
            )}
            aria-haspopup="dialog"
          >
            <Sliders size={18} weight="bold" className="shrink-0" />
            <span>{t("filters")}</span>
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs font-semibold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Tab */}
          <button
            type="button"
            onClick={() => setSortOpen(true)}
            className={cn(
              "flex-1 h-full",
              "inline-flex items-center justify-center gap-2",
              "text-sm font-medium",
              "tap-highlight-transparent active:bg-muted/50",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isSorted ? "text-foreground" : "text-muted-foreground"
            )}
            aria-haspopup="dialog"
            aria-label={t("sortBy")}
          >
            <ArrowsDownUp size={18} weight="bold" className="shrink-0" />
            <span className="whitespace-nowrap">
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
