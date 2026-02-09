"use client"

import { useState, useCallback, useEffect, useMemo, startTransition } from "react"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import {
  CaretLeft,
  CaretRight,
  X,
  SquaresFour,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useFilterCount } from "@/hooks/use-filter-count"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { CategoryAttribute } from "@/lib/data/categories"
import {
  getCategoryAttributeKey,
  getCategoryAttributeLabel,
  getCategoryAttributeOptions,
  shouldForceMultiSelectCategoryAttribute,
} from "@/lib/filters/category-attribute"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { usePendingFilters } from "./state/use-pending-filters"
import { FilterAttributeSectionContent } from "./sections/filter-attribute-section-content"
import { PriceSlider } from "./controls/price-slider"
import { FilterRatingSection } from "./sections/filter-rating-section"
import { FilterAvailabilitySection } from "./sections/filter-availability-section"
import { FilterCategorySection } from "./sections/filter-category-section"
import { FilterCheckboxItem } from "./controls/filter-checkbox-item"
import { FilterRadioGroup, FilterRadioItem } from "./controls/filter-radio-group"
import {
  isHiddenFilterAttribute,
} from "./config/filter-attribute-config"

// =============================================================================
// FILTER HUB — Main filtering modal with pending/applied state
//
// Per UI_UX_CODEX.md:
// - Bottom sheet, height: up to 90dvh
// - Rounded top corners: rounded-t-3xl
// - Drill-down navigation (Apple Settings style)
// - pending selections change inside the hub
// - applied selections are what the grid uses
// - Only Apply updates the grid and URL
// - Live result count on sticky CTA
// - L2+ category refinement lives inside the hub (Phase 3)
// =============================================================================

/** Subcategory for L2+ drill-down in Filter Hub */
export interface FilterHubSubcategory {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon?: string | null
}

/** Mode: "full" = normal list view, "single" = one section only (for quick pills) */
export type FilterHubMode = "full" | "single"

/** Section identifiers for initialSection prop */
export type FilterHubSection =
  | "category"
  | "rating"
  | "price"
  | "location"
  | "availability"
  | `attr_${string}`

interface FilterHubProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
  resultsCount?: number
  categorySlug?: string | undefined
  categoryId?: string | undefined
  /** Search query text (for /search page) */
  searchQuery?: string | undefined
  attributes?: CategoryAttribute[]
  basePath?: string | undefined
  /** Subcategories for L2+ drill-down (passed from parent) */
  subcategories?: FilterHubSubcategory[]
  /** Current category name for display */
  categoryName?: string
  /** Optional externally-controlled applied params (for instant, non-navigating flows) */
  appliedSearchParams?: URLSearchParams | ReadonlyURLSearchParams | undefined
  /** Optional apply handler to avoid router navigation */
  onApply?: (next: {
    queryString: string
    finalPath: string
    pendingCategorySlug?: string | null
  }) => void
  /**
   * Mode: "full" (default) shows list view + drill-down
   * "single" shows only the initialSection with compact header
   */
  mode?: FilterHubMode
  /**
   * When mode="single", which section to display
   * (e.g., "price", "rating", "category", "attr_brand")
   */
  initialSection?: FilterHubSection | null
}

// =============================================================================
// Types
// =============================================================================

type BaseFilterSection = {
  id: string
  label: string
  attribute?: undefined
}

type AttrFilterSection = {
  id: string
  label: string
  attribute: CategoryAttribute
}

type FilterSection = BaseFilterSection | AttrFilterSection

// =============================================================================
// Component
// =============================================================================

export function FilterHub({
  open,
  onOpenChange,
  locale,
  resultsCount = 0,
  categorySlug,
  categoryId,
  searchQuery,
  attributes = [],
  basePath,
  subcategories = [],
  categoryName,
  appliedSearchParams,
  onApply,
  mode = "full",
  initialSection = null,
}: FilterHubProps) {
  const t = useTranslations("SearchFilters")
  const tHub = useTranslations("FilterHub")
  const tCommon = useTranslations("Common")
  const router = useRouter()
  const pathname = usePathname()
  const searchParamsFromRouter = useSearchParams()
  const searchParams = appliedSearchParams ?? searchParamsFromRouter

  // Filter out hidden attributes
  const visibleAttributes = useMemo(
    () => attributes.filter((attr) => !isHiddenFilterAttribute(attr.name)),
    [attributes]
  )

  // Active section for drill-down navigation
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Pending category slug (for L2+ refinement - Phase 3)
  const [pendingCategorySlug, setPendingCategorySlug] = useState<string | null>(null)

  const {
    pending,
    setPending,
    getPendingAttrValues,
    setPendingAttrValues,
    clearPendingFilters,
    hasPendingFilterValues,
  } = usePendingFilters({
    open,
    searchParams,
    attributes: visibleAttributes,
    includeExtendedFields: true,
  })

  // Build count params for live count hook
  // Use pending category if selected, otherwise current category
  const effectiveCategoryId = useMemo(() => {
    if (pendingCategorySlug) {
      const subcat = subcategories.find((s) => s.slug === pendingCategorySlug)
      return subcat?.id ?? categoryId ?? null
    }
    return categoryId ?? null
  }, [pendingCategorySlug, subcategories, categoryId])

  const countParams = useMemo(
    () => ({
      categoryId: effectiveCategoryId,
      query: searchQuery ?? null,
      filters: {
        minPrice: pending.minPrice ? Number(pending.minPrice) : null,
        maxPrice: pending.maxPrice ? Number(pending.maxPrice) : null,
        minRating: pending.minRating ? Number(pending.minRating) : null,
        availability: pending.availability as "instock" | null,
        attributes: pending.attributes,
      },
    }),
    [effectiveCategoryId, searchQuery, pending]
  )

  // Live count via debounced hook (only active when modal is open)
  const { count: liveCount, isLoading: isCountLoading } = useFilterCount(
    open ? countParams : { categoryId: null, filters: {} }
  )

  // Resolve base path
  const resolvedBasePath = basePath ?? pathname

  // Initialize pending state from URL when modal opens
  useEffect(() => {
    if (!open) return

    // In single mode, start directly at the initialSection
    // In full mode, start at the list view (null)
    setActiveSection(mode === "single" && initialSection ? initialSection : null)
    setPendingCategorySlug(null) // Reset pending category
  }, [open, mode, initialSection])

  // Build filter sections
  const filterSections: FilterSection[] = useMemo(() => {
    const sections: BaseFilterSection[] = []

    // Add category section if subcategories exist (Phase 3: L2+ in Filter Hub)
    if (subcategories.length > 0) {
      sections.push({ id: "category", label: tHub("category") })
    }

    // Base filter sections
    sections.push(
      { id: "rating", label: t("customerReviews") },
      { id: "price", label: t("price") },
      { id: "location", label: t("location") },
      { id: "availability", label: t("availability") }
    )

    const attrSections: AttrFilterSection[] = visibleAttributes.map((attr) => ({
      id: `attr_${attr.id}`,
      label: getCategoryAttributeLabel(attr, locale),
      attribute: attr,
    }))

    return [...sections, ...attrSections]
  }, [t, tHub, visibleAttributes, locale, subcategories.length])

  // Check if attribute should allow multi-select
  const shouldForceMultiSelect = useCallback((attr: CategoryAttribute) => {
    return shouldForceMultiSelectCategoryAttribute(attr)
  }, [])

  // Get attribute options for current locale
  const getAttrOptions = useCallback(
    (attr: CategoryAttribute) => {
      return getCategoryAttributeOptions(attr, locale)
    },
    [locale]
  )

  // Pending state helpers
  // Clear all pending filters (including pending category)
  const clearAllPending = useCallback(() => {
    setPendingCategorySlug(null)
    clearPendingFilters()
  }, [clearPendingFilters])

  // Check if any pending filters or category is set
  const hasPendingFilters = useMemo(() => {
    return pendingCategorySlug !== null || hasPendingFilterValues
  }, [pendingCategorySlug, hasPendingFilterValues])

  // Apply pending filters to URL
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Remove all filter params
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("minRating")
    params.delete("availability")
    params.delete("deals")
    params.delete("verified")
    params.delete("city")
    params.delete("nearby")
    params.delete("page")

    // Remove all attr_* params
    for (const key of Array.from(params.keys())) {
      if (key.startsWith("attr_")) {
        params.delete(key)
      }
    }

    // Apply pending base filters
    if (pending.minPrice) params.set("minPrice", pending.minPrice)
    if (pending.maxPrice) params.set("maxPrice", pending.maxPrice)
    if (pending.minRating) params.set("minRating", pending.minRating)
    if (pending.availability) params.set("availability", pending.availability)
    if (pending.deals) params.set("deals", pending.deals)
    if (pending.verified) params.set("verified", pending.verified)
    if (pending.city) params.set("city", pending.city)
    if (pending.nearby) params.set("nearby", pending.nearby)

    // Apply pending attribute filters
    for (const [attrName, values] of Object.entries(pending.attributes)) {
      for (const v of values) {
        if (v) params.append(`attr_${attrName}`, v)
      }
    }

    // Determine final path - navigate to subcategory if pending category selected
    let finalPath = resolvedBasePath
    if (pendingCategorySlug) {
      finalPath = `/categories/${pendingCategorySlug}`
    }

    const queryString = params.toString()
    if (onApply) {
      onApply({ queryString, finalPath, pendingCategorySlug })
    } else {
      // Replace instead of push: avoids history spam and reduces the feeling of a full reload.
      startTransition(() => {
        router.replace(queryString ? `${finalPath}?${queryString}` : finalPath)
      })
    }
    onOpenChange(false)
  }, [pending, pendingCategorySlug, searchParams, resolvedBasePath, router, onOpenChange, onApply])

  // Get selected summary for a section (for main list view)
  const getSelectedSummary = useCallback(
    (section: FilterSection): string | null => {
      // Category section - show selected subcategory name
      if (section.id === "category") {
        if (!pendingCategorySlug) return null
        const subcat = subcategories.find((s) => s.slug === pendingCategorySlug)
        if (!subcat) return null
        return locale === "bg" && subcat.name_bg ? subcat.name_bg : subcat.name
      }
      if (section.id === "rating") {
        return pending.minRating ? `${pending.minRating}+ ${t("stars")}` : null
      }
      if (section.id === "price") {
        if (pending.minPrice && pending.maxPrice) {
          return `$${pending.minPrice} - $${pending.maxPrice}`
        }
        if (pending.minPrice) return `$${pending.minPrice}+`
        if (pending.maxPrice) return `${t("under")} $${pending.maxPrice}`
        return null
      }
      if (section.id === "availability") {
        return pending.availability === "instock" ? t("inStock") : null
      }
      if (section.id === "location") {
        const parts: string[] = []
        if (pending.city) {
          const cityData = BULGARIAN_CITIES.find((c) => c.value === pending.city)
          if (cityData) {
            parts.push(locale === "bg" ? cityData.labelBg : cityData.label)
          }
        }
        if (pending.nearby === "true") {
          parts.push(t("nearMe"))
        }
        return parts.length > 0 ? parts.join(", ") : null
      }
      if ("attribute" in section && section.attribute) {
        const values = getPendingAttrValues(getCategoryAttributeKey(section.attribute))
        if (values.length === 0) return null
        if (values.length === 1) return values[0] ?? null
        return `${values.length} ${tHub("selected")}`
      }
      return null
    },
    [pending, pendingCategorySlug, subcategories, locale, t, tHub, getPendingAttrValues]
  )

  // Display count - use live count when modal is open
  const displayCount = open ? liveCount : resultsCount

  // In single mode, we're always "in" a section
  const isSingleMode = mode === "single" && initialSection

  // Get current section label for single mode header
  const currentSectionLabel = useMemo(() => {
    if (!activeSection) return null
    return filterSections.find((s) => s.id === activeSection)?.label ?? null
  }, [activeSection, filterSections])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        aria-label={tHub("refineSearch")}
        className="max-h-dialog flex flex-col rounded-t-2xl px-0 pb-0 bg-background lg:hidden"
      >
        {/* Header */}
        <DrawerHeader
          className={cn(
            "px-inset pb-3 border-b border-border",
            activeSection || isSingleMode ? "pt-4" : "pt-3"
          )}
        >
          <div className="flex items-center justify-between min-h-touch-sm">
            {/* Single mode: show title + close button */}
            {isSingleMode ? (
              <>
                <DrawerTitle className="text-base font-semibold">
                  {currentSectionLabel}
                </DrawerTitle>
                <div className="flex items-center gap-2">
                  {hasPendingFilters && (
                    <button
                      type="button"
                      onClick={clearAllPending}
                      className="text-sm font-medium text-primary active:opacity-70 transition-opacity"
                    >
                      {tHub("clearAll")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="size-11 flex items-center justify-center rounded-full hover:bg-hover active:bg-active transition-colors"
                    aria-label={tHub("close")}
                  >
                    <X size={18} weight="bold" />
                  </button>
                </div>
              </>
            ) : activeSection ? (
              /* Full mode: sub-section with back button */
              <button
                type="button"
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 text-foreground font-semibold active:opacity-70 transition-opacity"
              >
                <CaretLeft size={20} weight="bold" />
                <span className="text-base">
                  {currentSectionLabel}
                </span>
              </button>
            ) : (
              /* Full mode: main list view */
              <DrawerTitle className="text-base font-semibold">
                {tHub("refineSearch")}
              </DrawerTitle>
            )}

            {/* Clear all button (full mode, list view only) */}
            {!isSingleMode && hasPendingFilters && !activeSection && (
              <button
                type="button"
                onClick={clearAllPending}
                className="text-sm font-medium text-primary active:opacity-70 transition-opacity"
              >
                {tHub("clearAll")}
              </button>
            )}
          </div>
        </DrawerHeader>

        {/* Filter Content */}
        <DrawerBody className="px-0 bg-background">
          {/* In single mode, always show the section content directly */}
          {/* In full mode, show list view when no section is active */}
          {!activeSection && !isSingleMode ? (
            /* Main List View (full mode only) */
            <div className="divide-y divide-border">
              {filterSections.map((section) => {
                const summary = getSelectedSummary(section)
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className="w-full flex items-center justify-between px-inset h-11 active:bg-active transition-colors text-left"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">
                        {section.label}
                      </span>
                      {summary && (
                        <span className="text-xs text-muted-foreground truncate">
                          {summary}
                        </span>
                      )}
                    </div>
                    <CaretRight
                      size={16}
                      weight="bold"
                      className="text-muted-foreground"
                    />
                  </button>
                )
              })}
            </div>
          ) : (
            /* Sub-view for specific filter (full mode drill-down or single mode) */
            <div className="px-inset py-4 space-y-2">
              {/* Ratings */}
              {activeSection === "rating" && (
                <FilterRatingSection
                  minRating={pending.minRating}
                  onChange={(minRating) => setPending((prev) => ({ ...prev, minRating }))}
                />
              )}

              {/* Price */}
              {activeSection === "price" && (
                <PriceSlider
                  value={{ min: pending.minPrice, max: pending.maxPrice }}
                  onChange={({ min, max }) =>
                    setPending((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
                  }
                />
              )}

              {/* Availability */}
              {activeSection === "availability" && (
                <FilterAvailabilitySection
                  availability={pending.availability}
                  onChange={(availability) => setPending((prev) => ({ ...prev, availability }))}
                />
              )}

              {/* Location */}
              {activeSection === "location" && (
                <div className="space-y-4">
                  {/* City selector */}
                  <div className="-mx-inset">
                    <FilterRadioGroup
                      value={pending.city ?? ""}
                      onValueChange={(value) => setPending((prev) => ({ ...prev, city: value || null }))}
                    >
                      {/* Any location option */}
                      <FilterRadioItem value="" fullBleed>
                        {t("anyLocation")}
                      </FilterRadioItem>
                      
                      {/* City options */}
                      {BULGARIAN_CITIES.filter(c => c.value !== "other").slice(0, 15).map((city) => (
                        <FilterRadioItem
                          key={city.value}
                          value={city.value}
                          fullBleed
                        >
                          {locale === "bg" ? city.labelBg : city.label}
                        </FilterRadioItem>
                      ))}
                    </FilterRadioGroup>
                  </div>
                  
                  {/* Nearby toggle */}
                  <div className="-mx-inset">
                    <FilterCheckboxItem
                      checked={pending.nearby === "true"}
                      onCheckedChange={(checked) => setPending((prev) => ({ 
                        ...prev, 
                        nearby: checked ? "true" : null 
                      }))}
                      fullBleed
                    >
                      {t("nearMe")}
                    </FilterCheckboxItem>
                  </div>
                </div>
              )}

              {/* Category Section - L2+ drill-down (Phase 3) */}
              {activeSection === "category" && subcategories.length > 0 && (
                <FilterCategorySection
                  locale={locale}
                  categoryName={categoryName ?? ""}
                  pendingCategorySlug={pendingCategorySlug}
                  onChangePendingCategorySlug={setPendingCategorySlug}
                  subcategories={subcategories}
                  onCloseHub={() => onOpenChange(false)}
                />
              )}

              {/* Category Attribute Filters */}
              {(() => {
                const section = filterSections.find(
                  (s) => s.id === activeSection
                ) as AttrFilterSection | undefined
                if (!section?.attribute) return null

                const attr = section.attribute
                const attrKey = getCategoryAttributeKey(attr)
                const options = getAttrOptions(attr) ?? []

                return (
                  <FilterAttributeSectionContent
                    attribute={attr}
                    attrKey={attrKey}
                    options={options}
                    selectedValues={getPendingAttrValues(attrKey)}
                    onSelectedValuesChange={(values) => setPendingAttrValues(attrKey, values)}
                    shouldForceMultiSelect={shouldForceMultiSelect}
                    yesLabel={tCommon("yes")}
                    checkboxListClassName="-mx-inset"
                    checkboxItemsFullBleed
                    booleanFullBleed
                  />
                )
              })()}
            </div>
          )}
        </DrawerBody>

        {/* Footer with Apply CTA + Live Count */}
        <DrawerFooter className="px-inset border-t border-border bg-background">
          <Button
            className="w-full h-11 rounded-full text-sm font-bold"
            onClick={applyFilters}
            disabled={displayCount === 0 && hasPendingFilters}
          >
            {isCountLoading ? (
              <span className="animate-pulse">{tHub("showResults", { count: "..." })}</span>
            ) : displayCount === 0 && hasPendingFilters ? (
              tHub("noResults")
            ) : (
              tHub("showResults", { count: displayCount.toLocaleString() })
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
