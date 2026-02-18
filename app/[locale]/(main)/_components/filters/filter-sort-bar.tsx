"use client"

import { useState, useMemo, useCallback } from "react"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { SlidersHorizontal, ArrowUpDown, MapPin, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { MOBILE_ACTION_CHIP_CLASS } from "@/components/mobile/chrome/mobile-control-recipes"
import { SortModal } from "./shared/sort-modal"
import type { CategoryAttribute } from "@/lib/data/categories"
import { getCategoryAttributeKey } from "@/lib/filters/category-attribute"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"

export interface FilterSortBarQuickPill {
  sectionId: `attr_${string}`
  label: string
  active: boolean
  selectedCount?: number
}

// =============================================================================
// FILTER/SORT BAR — Horizontal Scroll Rail
//
// Single row of action chips: Filters | Sort | Location | [Attr1 ▾] | [Attr2 ▾]
// All chips use MOBILE_ACTION_CHIP_CLASS for uniform visual weight.
// Horizontally scrollable — no vertical stacking.
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
  /** Optional compact location button */
  locationChipLabel?: string | null
  /** Whether location has explicit city/nearby filters applied */
  locationChipActive?: boolean
  /** Called when location chip is clicked */
  onLocationChipClick?: () => void
  /** Quick attribute pills to render inline in the rail */
  quickAttributePills?: FilterSortBarQuickPill[]
  /** Called when an attribute chip is clicked */
  onAttributeChipClick?: (sectionId: `attr_${string}`) => void
}

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest"

export function FilterSortBar({
  locale,
  onAllFiltersClick,
  appliedSearchParams,
  attributes = [],
  stickyTop = "var(--offset-mobile-primary-rail)",
  sticky = true,
  basePath,
  className,
  locationChipLabel,
  locationChipActive = false,
  onLocationChipClick,
  quickAttributePills = [],
  onAttributeChipClick,
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
        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
          role="group"
          aria-label={t("filters")}
        >
          {/* Filters chip */}
          <button
            type="button"
            onClick={onAllFiltersClick}
            className={cn(
              MOBILE_ACTION_CHIP_CLASS,
              hasActiveFilters && "border-foreground"
            )}
            aria-haspopup="dialog"
            aria-pressed={hasActiveFilters}
          >
            <SlidersHorizontal className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{t("filters")}</span>
            {hasActiveFilters && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 py-0.5 text-2xs font-semibold text-background tabular-nums">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort chip */}
          <button
            type="button"
            onClick={openSort}
            className={cn(
              MOBILE_ACTION_CHIP_CLASS,
              isSorted && "border-foreground"
            )}
            aria-haspopup="dialog"
            aria-expanded={sortOpen}
            aria-pressed={isSorted}
            aria-label={`${t("sortBy")}: ${sortLabels[currentSort]}`}
          >
            <ArrowUpDown className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">
              {isSorted ? sortLabels[currentSort] : t("sortBy")}
            </span>
          </button>

          {/* Location chip */}
          {onLocationChipClick && locationChipLabel && (
            <button
              type="button"
              onClick={onLocationChipClick}
              className={cn(
                MOBILE_ACTION_CHIP_CLASS,
                locationChipActive && "border-foreground"
              )}
              aria-haspopup="dialog"
              aria-pressed={locationChipActive}
              data-testid="mobile-location-chip"
            >
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap max-w-28 truncate">{locationChipLabel}</span>
            </button>
          )}

          {/* Inline attribute chips */}
          {quickAttributePills.length > 0 && onAttributeChipClick && (
            <>
              {quickAttributePills.map((pill) => (
                <button
                  key={pill.sectionId}
                  type="button"
                  onClick={() => onAttributeChipClick(pill.sectionId)}
                  className={cn(
                    MOBILE_ACTION_CHIP_CLASS,
                    pill.active && "border-foreground"
                  )}
                  aria-haspopup="dialog"
                  aria-pressed={pill.active}
                >
                  <span className="whitespace-nowrap">{pill.label}</span>
                  {pill.active && pill.selectedCount && pill.selectedCount > 1 ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-foreground px-1.5 py-0.5 text-2xs font-semibold text-background tabular-nums">
                      {pill.selectedCount}
                    </span>
                  ) : (
                    <ChevronDown className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                </button>
              ))}
            </>
          )}
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
