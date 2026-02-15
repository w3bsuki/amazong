"use client"

import { useState, useMemo, useCallback } from "react"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { SlidersHorizontal, ArrowUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { SortModal } from "@/components/shared/filters/sort-modal"
import type { CategoryAttribute } from "@/lib/data/categories"
import { getCategoryAttributeKey } from "@/lib/filters/category-attribute"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"

// =============================================================================
// FILTER/SORT BAR — Clean 50/50 Split Design
//
// OLX/Vinted/Depop inspired: Two equal tab-style buttons
// - Left: "Filters" with active count badge → opens FilterHub drawer
// - Right: "Sort" showing current sort → opens sort bottom sheet
//
// Design system compliance (.codex/project/DESIGN.md):
// - 44px default controls, 48px reserved for primary CTA moments
// - Semantic tokens only (text-muted-foreground, bg-muted)
// - Tailwind v4 best practices
// - lucide-react icons (repo standard)
// =============================================================================
export interface FilterSortBarProps {
  /** Current locale for i18n */
  locale: string
  /** Called when "Filters" button is clicked (opens FilterHub) */
  onAllFiltersClick: () => void
  /** Optional externally-controlled applied params (for instant, non-navigating flows) */
  appliedSearchParams?: URLSearchParams | ReadonlyURLSearchParams | undefined
  /** Filterable attributes from category (used for counting active filters) */
  attributes?: CategoryAttribute[]
  /** Sticky position top offset (after header + pills) */
  stickyTop?: number | string
  /** Whether this bar is sticky (default: true). */
  sticky?: boolean
  /** Override base path for sort query params */
  basePath?: string | undefined
  /** Additional CSS classes */
  className?: string
  /** Optional compact location button shown above filter/sort row */
  locationChipLabel?: string | null
  /** Whether location has explicit city/nearby filters applied */
  locationChipActive?: boolean
  /** Called when location chip is clicked */
  onLocationChipClick?: () => void
}

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest"

const ACTION_CHIP_CLASS =
  "inline-flex shrink-0 min-h-(--control-compact) items-center gap-1 rounded-full border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"

const PILL_BASE_CLASS =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border min-h-(--control-compact) px-2.5 text-xs tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const PILL_ACTIVE_CLASS = "border-foreground bg-foreground text-background font-semibold"
const PILL_INACTIVE_CLASS =
  "border-border-subtle bg-surface-subtle text-muted-foreground font-medium"

function getPillClass(active: boolean, className?: string): string {
  return cn(PILL_BASE_CLASS, active ? PILL_ACTIVE_CLASS : PILL_INACTIVE_CLASS, className)
}

export function FilterSortBar({
  locale,
  onAllFiltersClick,
  appliedSearchParams,
  attributes = [],
  stickyTop = 80,
  sticky = true,
  basePath,
  className,
  locationChipLabel,
  locationChipActive = false,
  onLocationChipClick,
}: FilterSortBarProps) {
  const t = useTranslations("SearchFilters")
  const searchParamsFromRouter = useSearchParams()
  const searchParams = appliedSearchParams ?? searchParamsFromRouter

  const [sortOpen, setSortOpen] = useState(false)

  const attributeFilterKeys = useMemo(
    () =>
      attributes.map((attr) => `attr_${getCategoryAttributeKey(attr)}`),
    [attributes]
  )

  const activeFilterCount = useMemo(
    () =>
      getActiveFilterCount(searchParams, {
        includeDeals: true,
        includeVerified: true,
        includeLocation: true,
        attributeKeys: attributeFilterKeys,
      }),
    [searchParams, attributeFilterKeys]
  )

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
          "bg-background px-inset py-1.5",
          sticky && "sticky z-20",
          className
        )}
        style={sticky ? { top: stickyTop } : undefined}
        data-testid="mobile-filter-sort-bar"
      >
        {onLocationChipClick && locationChipLabel && (
          <button
            type="button"
            onClick={onLocationChipClick}
            className={cn(
              getPillClass(locationChipActive, "mb-1.5 max-w-full gap-1.5"),
              !locationChipActive && "hover:bg-hover hover:text-foreground active:bg-active"
            )}
            aria-haspopup="dialog"
            aria-pressed={locationChipActive}
            data-testid="mobile-location-chip"
          >
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">{locationChipLabel}</span>
          </button>
        )}

        {/* 50/50 Tab Bar */}
        <div className="flex items-stretch gap-1.5" role="group" aria-label={t("filters")}>
          {/* Filters Tab */}
          <button
            type="button"
            onClick={onAllFiltersClick}
            className={cn(
              ACTION_CHIP_CLASS,
              "flex-1 min-h-(--control-default) justify-center gap-1.5 px-3",
              hasActiveFilters && "border-foreground"
            )}
            aria-haspopup="dialog"
            aria-pressed={hasActiveFilters}
          >
            <SlidersHorizontal className="size-4 shrink-0" aria-hidden="true" />
            <span>{t("filters")}</span>
            {hasActiveFilters && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 py-0.5 text-2xs font-semibold text-background tabular-nums">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Tab */}
          <button
            type="button"
            onClick={openSort}
            className={cn(
              ACTION_CHIP_CLASS,
              "flex-1 min-h-(--control-default) min-w-0 justify-center gap-1.5 px-3",
              isSorted && "border-foreground"
            )}
            aria-haspopup="dialog"
            aria-expanded={sortOpen}
            aria-pressed={isSorted}
            aria-label={`${t("sortBy")}: ${sortLabels[currentSort]}`}
          >
            <ArrowUpDown className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate min-w-0">
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
