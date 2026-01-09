"use client"

import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Sliders, CaretDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { FilterModal, type FilterModalSection } from "@/components/shared/filters/filter-modal"
import type { CategoryAttribute } from "@/lib/data/categories"

// =============================================================================
// INLINE FILTER BAR
//
// Dense filter row with modal triggers:
// - "All filters" button opens full FilterHub drawer
// - Inline triggers open a bottom-sheet modal (FilterModal)
// - ~40px height (compact, single row)
// =============================================================================

export interface FilterDropdownConfig {
  /** Unique key for the filter (e.g., "attr_123") */
  key: string
  /** Display label (localized) */
  label: string
  /** URL param key for this filter */
  paramKey: string
}

export interface InlineFilterBarProps {
  /** Current locale for i18n */
  locale: string
  /** Called when "All filters" button is clicked */
  onAllFiltersClick: () => void
  /** Filter triggers to display */
  filters?: FilterDropdownConfig[]
  /** Filterable attributes from category (auto-converted to triggers) */
  attributes?: CategoryAttribute[]
  /** Sticky position top offset (after header + pills) */
  stickyTop?: number
  /** Additional CSS classes */
  className?: string
}

function attributesToFilters(attributes: CategoryAttribute[], locale: string): FilterDropdownConfig[] {
  return attributes
    .filter((attr) => attr.is_filterable && attr.options && attr.options.length > 0)
    .slice(0, 3)
    .map((attr) => ({
      key: `attr_${attr.id}`,
      label: locale === "bg" && attr.name_bg ? attr.name_bg : attr.name,
      paramKey: `attr_${attr.name}`,
    }))
}

export function InlineFilterBar({
  locale,
  onAllFiltersClick,
  filters: filtersProp,
  attributes = [],
  stickyTop = 80,
  className,
}: InlineFilterBarProps) {
  const t = useTranslations("SearchFilters")
  const searchParams = useSearchParams()

  const [singleOpen, setSingleOpen] = useState(false)
  const [singleSection, setSingleSection] = useState<FilterModalSection | null>(null)
  const [singleLabel, setSingleLabel] = useState<string>("")
  const [singleAttribute, setSingleAttribute] = useState<CategoryAttribute | undefined>(undefined)

  const filters = useMemo(() => {
    if (filtersProp && filtersProp.length > 0) return filtersProp
    return attributesToFilters(attributes, locale)
  }, [filtersProp, attributes, locale])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++
    if (searchParams.get("minRating")) count++
    if (searchParams.get("availability")) count++
    for (const filter of filters) {
      if (searchParams.getAll(filter.paramKey).length > 0) count++
    }
    return count
  }, [searchParams, filters])

  const handleFilterTrigger = useCallback(
    (filter: FilterDropdownConfig) => {
      setSingleSection(filter.key as FilterModalSection)
      setSingleLabel(filter.label)

      const attrId = filter.key.startsWith("attr_") ? filter.key.replace("attr_", "") : null
      setSingleAttribute(attrId ? attributes.find((a) => a.id === attrId) : undefined)
      setSingleOpen(true)
    },
    [attributes]
  )

  return (
    <div
      className={cn("sticky z-20 bg-background border-b border-border/30", className)}
      style={{ top: stickyTop }}
    >
      <div className="flex items-center h-10 px-(--page-inset) gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={onAllFiltersClick}
          className={cn(
            "flex items-center gap-1.5 h-8 px-2.5 shrink-0",
            "rounded-full border border-border",
            "text-sm font-medium text-foreground",
            "hover:bg-muted/50 active:bg-muted/70",
            "transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          )}
          aria-haspopup="dialog"
        >
          <Sliders size={16} weight="bold" className="shrink-0" />
          <span>{t("filters")}</span>
          {activeFilterCount > 0 && (
            <span
              className={cn(
                "bg-foreground text-background",
                "text-2xs font-bold rounded-full",
                "min-w-4 h-4 px-1",
                "flex items-center justify-center"
              )}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="w-px h-5 bg-border/60 shrink-0" aria-hidden="true" />

        {filters.map((filter) => {
          const isActive = searchParams.getAll(filter.paramKey).length > 0

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => handleFilterTrigger(filter)}
              className={cn(
                "flex items-center gap-1 h-8 px-2.5 shrink-0",
                "rounded-full border text-sm font-medium",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/50"
              )}
              aria-haspopup="dialog"
            >
              <span className="whitespace-nowrap">{filter.label}</span>
              <CaretDown size={14} weight="bold" className="shrink-0" />
            </button>
          )
        })}
      </div>

      {singleSection &&
        (singleAttribute ? (
          <FilterModal
            open={singleOpen}
            onOpenChange={(open) => {
              setSingleOpen(open)
              if (!open) {
                setSingleSection(null)
                setSingleLabel("")
                setSingleAttribute(undefined)
              }
            }}
            section={singleSection}
            sectionLabel={singleLabel}
            locale={locale}
            attribute={singleAttribute!}
          />
        ) : (
          <FilterModal
            open={singleOpen}
            onOpenChange={(open) => {
              setSingleOpen(open)
              if (!open) {
                setSingleSection(null)
                setSingleLabel("")
                setSingleAttribute(undefined)
              }
            }}
            section={singleSection}
            sectionLabel={singleLabel}
            locale={locale}
          />
        ))}
    </div>
  )
}
