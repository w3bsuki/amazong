"use client"

import { useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import {
  Sliders,
  SortAscending,
  CaretDown,
  Ruler,
  Palette,
  Tag,
  Car,
  Calendar,
  CurrencyDollar,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { FilterHub } from "@/components/shared/filters/filter-hub"
import { FilterModal, type FilterModalSection } from "@/components/shared/filters/filter-modal"
import { SortModal } from "@/components/shared/filters/sort-modal"
import { useCategoryAttributes } from "@/hooks/use-category-attributes"
import type { CategoryAttribute } from "@/lib/data/categories"
import { getCategoryAttributeKey, getCategoryAttributeLabel } from "@/lib/filters/category-attribute"

// =============================================================================
// CONTEXTUAL FILTER BAR — Simple category-aware quick filters
//
// Shows the first 3 filterable attributes from the database for ANY category.
// No hardcoded mappings - just show whatever exists.
// =============================================================================

interface ContextualFilterBarProps {
  locale: string
  categorySlug: string
  categoryId?: string | undefined
  basePath?: string | undefined
  className?: string | undefined
}

/** Smart icon mapping based on attribute name patterns */
const ATTRIBUTE_ICONS: Record<string, React.ElementType> = {
  size: Ruler,
  color: Palette,
  colour: Palette,
  brand: Tag,
  make: Car,
  model: Car,
  vehicle: Car,
  year: Calendar,
  price: CurrencyDollar,
  condition: Tag,
}

function getAttributeIcon(name: string): React.ElementType {
  const normalized = name.toLowerCase()
  for (const [pattern, icon] of Object.entries(ATTRIBUTE_ICONS)) {
    if (normalized.includes(pattern)) return icon
  }
  return Tag
}

export function ContextualFilterBar({
  locale,
  categorySlug,
  categoryId,
  basePath,
  className,
}: ContextualFilterBarProps) {
  const t = useTranslations("SearchFilters")
  const tHub = useTranslations("FilterHub")
  const searchParams = useSearchParams()

  // Fetch category attributes from API
  const { attributes, isLoading: attributesLoading } = useCategoryAttributes(
    categorySlug || null
  )

  // Modal state
  const [sortOpen, setSortOpen] = useState(false)
  const [hubOpen, setHubOpen] = useState(false)
  const [singleOpen, setSingleOpen] = useState(false)
  const [singleSection, setSingleSection] = useState<FilterModalSection | null>(null)
  const [singleLabel, setSingleLabel] = useState("")
  const [singleAttribute, setSingleAttribute] = useState<CategoryAttribute | undefined>()

  // Simple: Just show first 3 filterable attributes from database
  // No hardcoded priority mapping - show whatever exists
  const attributePills = useMemo(() => {
    return attributes.slice(0, 3).map((attr) => {
      const key = getCategoryAttributeKey(attr)
      const paramKey = `attr_${key}`
      const activeValues = searchParams.getAll(paramKey)
      const displayLabel = getCategoryAttributeLabel(attr, locale)

      return {
        id: attr.id,
        label: activeValues.length > 0 
          ? `${displayLabel}: ${activeValues.length}`
          : displayLabel,
        icon: getAttributeIcon(attr.name),
        isActive: activeValues.length > 0,
        attribute: attr,
      }
    })
  }, [attributes, searchParams, locale])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++
    if (searchParams.get("minRating")) count++
    if (searchParams.get("availability")) count++
    for (const attr of attributes) {
      if (searchParams.getAll(`attr_${getCategoryAttributeKey(attr)}`).length > 0) count++
    }
    return count
  }, [searchParams, attributes])

  const handleAttributeClick = useCallback((attr: CategoryAttribute) => {
    setSingleSection(`attr_${attr.id}` as FilterModalSection)
    setSingleLabel(getCategoryAttributeLabel(attr, locale))
    setSingleAttribute(attr)
    setSingleOpen(true)
  }, [locale])

  // Unified pill styles - matching CategoryNavItem styling
  const pillBase = cn(
    "shrink-0 h-8 px-3 text-xs font-medium rounded-full",
    "flex items-center justify-center gap-1.5",
    "border transition-all duration-150",
    "tap-highlight-transparent active:scale-95"
  )
  const pillInactive = "border-border/50 bg-background text-muted-foreground hover:bg-hover hover:text-foreground"
  const pillActive = "border-foreground bg-foreground text-background"

  return (
    <>
      <div
        className={cn(
          "bg-background/95 backdrop-blur-sm",
          "px-inset py-1.5",
          className
        )}
      >
        {/* Filter + Sort + Attribute filters - single row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
          {/* Filter button with icon */}
          <button
            type="button"
            onClick={() => setHubOpen(true)}
            className={cn(
              pillBase,
              activeFilterCount > 0 ? pillActive : pillInactive
            )}
            aria-haspopup="dialog"
          >
            <Sliders size={14} weight="bold" />
            <span>{tHub("allFilters")}</span>
            {activeFilterCount > 0 && (
              <span className={cn(
                "text-2xs font-bold rounded-full min-w-4 h-4 px-1",
                "flex items-center justify-center",
                "bg-background text-foreground"
              )}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort button */}
          <button
            type="button"
            onClick={() => setSortOpen(true)}
            className={cn(pillBase, pillInactive)}
            aria-haspopup="dialog"
          >
            <SortAscending size={14} weight="bold" />
            <span>{t("sortBy")}</span>
            <CaretDown size={12} weight="bold" className="opacity-50" />
          </button>

          {/* Divider */}
          {attributePills.length > 0 && (
            <div className="h-4 w-px bg-border/40 mx-0.5 shrink-0" aria-hidden="true" />
          )}

          {/* Category-specific attribute pills */}
          {attributePills.map((pill) => {
            const Icon = pill.icon
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleAttributeClick(pill.attribute)}
                className={cn(
                  pillBase,
                  pill.isActive ? pillActive : pillInactive
                )}
                aria-pressed={pill.isActive}
                aria-haspopup="dialog"
              >
                <Icon size={14} weight={pill.isActive ? "fill" : "regular"} />
                <span>{pill.label}</span>
                <CaretDown size={12} weight="bold" className="opacity-50" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Sort Modal */}
      <SortModal
        open={sortOpen}
        onOpenChange={setSortOpen}
        locale={locale}
        basePath={basePath}
      />

      {/* Single Attribute Filter Modal */}
      {singleSection && singleAttribute && (
        <FilterModal
          open={singleOpen}
          onOpenChange={setSingleOpen}
          section={singleSection}
          sectionLabel={singleLabel}
          locale={locale}
          categorySlug={categorySlug}
          {...(categoryId ? { categoryId } : {})}
          attribute={singleAttribute}
          {...(basePath ? { basePath } : {})}
        />
      )}

      {/* Full Filter Hub Drawer */}
      <FilterHub
        open={hubOpen}
        onOpenChange={setHubOpen}
        locale={locale}
        categorySlug={categorySlug}
        {...(categoryId ? { categoryId } : {})}
        attributes={attributes}
        {...(basePath ? { basePath } : {})}
        mode="full"
        initialSection={null}
      />
    </>
  )
}
