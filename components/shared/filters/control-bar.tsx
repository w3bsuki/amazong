"use client"

import { useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowsDownUp, Sliders } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { SortModal } from "./sort-modal"
import { FilterHub } from "./filter-hub"
import type { CategoryAttribute } from "@/lib/data/categories"

// =============================================================================
// CONTROL BAR — Sticky Sort + Filter/Refine bar for PLP & Search
//
// Per UI_UX_CODEX.md:
// - Two touch targets: Sort and Filter/Refine
// - Sticky below the header, shadow only when scrolled
// - Sort opens a small bottom menu
// - Filter/Refine opens the main Filter Hub modal
// =============================================================================

interface ControlBarProps {
  /** Locale for i18n */
  locale: string
  /** Total results count for display */
  resultsCount?: number
  /** Category slug for filter context */
  categorySlug?: string | undefined
  /** Category ID for count queries */
  categoryId?: string | undefined
  /** Search query text (for /search page live count) */
  searchQuery?: string | undefined
  /** Filterable attributes for the current category */
  attributes?: CategoryAttribute[]
  /** Override base path for filter query params */
  basePath?: string | undefined
  /** Additional CSS classes */
  className?: string
}

export function ControlBar({
  locale,
  resultsCount = 0,
  categorySlug,
  categoryId,
  searchQuery,
  attributes = [],
  basePath,
  className,
}: ControlBarProps) {
  const t = useTranslations("SearchFilters")
  const searchParams = useSearchParams()

  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  // Get current sort value
  const currentSort = searchParams.get("sort") || "featured"
  const isSorted = currentSort !== "featured"

  // Count active filters (URL-based)
  const activeFilterCount = countActiveFilters(searchParams, attributes)

  // Sort display label
  const sortLabels: Record<string, string> = {
    featured: t("featured"),
    "price-asc": t("priceLowHigh"),
    "price-desc": t("priceHighLow"),
    rating: t("avgReview"),
    newest: t("newestArrivals"),
  }

  return (
    <>
      {/* Sticky Control Bar */}
      <div
        className={cn(
          "sticky z-30 bg-background border-b border-border/40",
          "px-(--page-inset) py-1.5",
          // Shadow appears when scrolled (via JS or CSS scroll-shadow)
          "transition-shadow",
          className
        )}
        style={{ top: "var(--header-height, 0px)" }}
      >
        <div className="flex items-center gap-2">
          {/* Sort Button */}
          <button
            type="button"
            onClick={() => setSortOpen(true)}
            className={cn(
              "flex-1 h-9 rounded-lg px-3 gap-2",
              "flex items-center justify-center",
              "text-xs font-medium",
              "bg-muted/50 hover:bg-muted/70 active:bg-muted/80",
              "border border-border/40",
              "transition-colors",
              isSorted && "bg-primary/10 text-primary border-primary/30"
            )}
            aria-label={t("sortBy")}
            aria-haspopup="dialog"
          >
            <ArrowsDownUp
              size={14}
              weight="regular"
              className={cn(
                "shrink-0",
                isSorted ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className="truncate">
              {isSorted ? sortLabels[currentSort] : t("sortBy")}
            </span>
          </button>

          {/* Filter/Refine Button */}
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={cn(
              "flex-1 h-9 rounded-lg px-3 gap-2",
              "flex items-center justify-center",
              "text-xs font-medium",
              "bg-muted/50 hover:bg-muted/70 active:bg-muted/80",
              "border border-border/40",
              "transition-colors",
              activeFilterCount > 0 && "bg-primary/10 text-primary border-primary/30"
            )}
            aria-label={t("filters")}
            aria-haspopup="dialog"
          >
            <Sliders
              size={14}
              weight="regular"
              className={cn(
                "shrink-0",
                activeFilterCount > 0 ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span>{t("filters")}</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-2xs font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Results Count (desktop only) */}
          <span className="hidden sm:flex text-xs text-muted-foreground whitespace-nowrap items-center">
            <span className="font-semibold text-foreground">{resultsCount.toLocaleString()}</span>
            <span className="ml-1">{t("results")}</span>
          </span>
        </div>
      </div>

      {/* Sort Modal (bottom sheet) */}
      <SortModal
        open={sortOpen}
        onOpenChange={setSortOpen}
        locale={locale}
        basePath={basePath}
      />

      {/* Filter Hub Modal */}
      <FilterHub
        open={filterOpen}
        onOpenChange={setFilterOpen}
        locale={locale}
        resultsCount={resultsCount}
        categorySlug={categorySlug}
        categoryId={categoryId}
        searchQuery={searchQuery}
        attributes={attributes}
        basePath={basePath}
      />
    </>
  )
}

// =============================================================================
// Helpers
// =============================================================================

function countActiveFilters(
  searchParams: URLSearchParams,
  attributes: CategoryAttribute[]
): number {
  let count = 0

  // Base filters
  if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++
  if (searchParams.get("minRating")) count++
  if (searchParams.get("availability")) count++
  if (searchParams.get("deals") === "true") count++
  if (searchParams.get("verified") === "true") count++

  // Attribute filters
  for (const attr of attributes) {
    if (searchParams.getAll(`attr_${attr.name}`).length > 0) {
      count++
    }
  }

  return count
}
