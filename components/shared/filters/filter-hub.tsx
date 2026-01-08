"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import {
  CaretLeft,
  CaretRight,
  Check,
  Star,
  X,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useFilterCount } from "@/hooks/use-filter-count"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { CategoryAttribute } from "@/lib/data/categories"
import { ColorSwatches } from "./color-swatches"
import { SizeTiles } from "./size-tiles"
import { FilterList } from "./filter-list"
import { PriceSlider } from "./price-slider"

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

// Hidden attributes (too space-consuming as filter sections)
const HIDDEN_ATTRIBUTE_NAMES = [
  "Cruelty Free",
  "Vegan",
  "cruelty_free",
  "vegan",
]

// Force multiselect for these attribute names
const FORCE_MULTISELECT_NAMES = ["brand", "make", "model"]

// Use specialized selectors for these attributes
const COLOR_ATTRIBUTE_NAMES = ["color", "colour", "цвят"]
const SIZE_ATTRIBUTE_NAMES = ["size", "sizes", "размер"]
const SEARCHABLE_ATTRIBUTE_NAMES = ["brand", "brands", "марка", "condition", "състояние"]

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

interface PendingFilters {
  minPrice: string | null
  maxPrice: string | null
  minRating: string | null
  availability: string | null
  deals: string | null
  verified: string | null
  attributes: Record<string, string[]>
}

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
  mode = "full",
  initialSection = null,
}: FilterHubProps) {
  const t = useTranslations("SearchFilters")
  const tHub = useTranslations("FilterHub")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Filter out hidden attributes
  const visibleAttributes = useMemo(
    () => attributes.filter((attr) => !HIDDEN_ATTRIBUTE_NAMES.includes(attr.name)),
    [attributes]
  )

  // Active section for drill-down navigation
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Pending category slug (for L2+ refinement - Phase 3)
  const [pendingCategorySlug, setPendingCategorySlug] = useState<string | null>(null)

  // Pending filter state (changes here, only applied on "Apply")
  const [pending, setPending] = useState<PendingFilters>({
    minPrice: null,
    maxPrice: null,
    minRating: null,
    availability: null,
    deals: null,
    verified: null,
    attributes: {},
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
    setPending({
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      minRating: searchParams.get("minRating"),
      availability: searchParams.get("availability"),
      deals: searchParams.get("deals"),
      verified: searchParams.get("verified"),
      attributes: visibleAttributes.reduce(
        (acc, attr) => {
          const values = searchParams.getAll(`attr_${attr.name}`)
          if (values.length > 0) {
            acc[attr.name] = values
          }
          return acc
        },
        {} as Record<string, string[]>
      ),
    })
  }, [open, searchParams, visibleAttributes, mode, initialSection])

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
      { id: "availability", label: t("availability") }
    )

    const attrSections: AttrFilterSection[] = visibleAttributes.map((attr) => ({
      id: `attr_${attr.id}`,
      label: locale === "bg" && attr.name_bg ? attr.name_bg : attr.name,
      attribute: attr,
    }))

    return [...sections, ...attrSections]
  }, [t, tHub, visibleAttributes, locale, subcategories.length])

  // Check if attribute should allow multi-select
  const shouldForceMultiSelect = useCallback((attr: CategoryAttribute) => {
    const name = attr.name.trim().toLowerCase()
    return FORCE_MULTISELECT_NAMES.includes(name)
  }, [])

  // Get attribute options for current locale
  const getAttrOptions = useCallback(
    (attr: CategoryAttribute) => {
      return locale === "bg" && attr.options_bg ? attr.options_bg : attr.options
    },
    [locale]
  )

  // Pending state helpers
  const getPendingAttrValues = useCallback(
    (attrName: string): string[] => pending.attributes[attrName] || [],
    [pending.attributes]
  )

  const setPendingAttrValues = useCallback((attrName: string, values: string[]) => {
    setPending((prev) => {
      const next = { ...prev.attributes }
      if (values.length === 0) {
        delete next[attrName]
      } else {
        next[attrName] = values
      }
      return { ...prev, attributes: next }
    })
  }, [])

  // Clear all pending filters (including pending category)
  const clearAllPending = useCallback(() => {
    setPendingCategorySlug(null)
    setPending({
      minPrice: null,
      maxPrice: null,
      minRating: null,
      availability: null,
      deals: null,
      verified: null,
      attributes: {},
    })
  }, [])

  // Check if any pending filters or category is set
  const hasPendingFilters = useMemo(() => {
    return (
      pendingCategorySlug !== null ||
      pending.minPrice !== null ||
      pending.maxPrice !== null ||
      pending.minRating !== null ||
      pending.availability !== null ||
      pending.deals !== null ||
      pending.verified !== null ||
      Object.keys(pending.attributes).length > 0
    )
  }, [pendingCategorySlug, pending])

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
    router.push(queryString ? `${finalPath}?${queryString}` : finalPath)
    onOpenChange(false)
  }, [pending, pendingCategorySlug, searchParams, resolvedBasePath, router, onOpenChange])

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
      if ("attribute" in section && section.attribute) {
        const values = getPendingAttrValues(section.attribute.name)
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
      <DrawerContent className="max-h-(--dialog-max-h) flex flex-col rounded-t-3xl px-0 pb-0 lg:hidden">
        {/* Drag handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/25" />
        </div>
        {/* Header */}
        <DrawerHeader
          className={cn(
            "px-(--page-inset) pb-3 border-b border-border/50",
            activeSection || isSingleMode ? "pt-4" : "pt-3"
          )}
        >
          <div className="flex items-center justify-between min-h-touch-sm">
            {/* Single mode: show title + close button */}
            {isSingleMode ? (
              <>
                <DrawerTitle className="text-lg font-bold">
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
                    className="size-8 flex items-center justify-center rounded-full hover:bg-muted active:bg-muted/80 transition-colors"
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
                <span className="text-lg">
                  {currentSectionLabel}
                </span>
              </button>
            ) : (
              /* Full mode: main list view */
              <DrawerTitle className="text-lg font-bold">
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
        <div className="flex-1 overflow-y-auto overscroll-contain bg-background">
          {/* In single mode, always show the section content directly */}
          {/* In full mode, show list view when no section is active */}
          {!activeSection && !isSingleMode ? (
            /* Main List View (full mode only) */
            <div className="divide-y divide-border/30">
              {filterSections.map((section) => {
                const summary = getSelectedSummary(section)
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className="w-full flex items-center justify-between px-(--page-inset) h-12 active:bg-muted/30 transition-colors text-left"
                  >
                    <div className="flex flex-col">
                      <span className="text-base font-normal text-foreground">
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
                      className="text-muted-foreground/60"
                    />
                  </button>
                )
              })}
            </div>
          ) : (
            /* Sub-view for specific filter (full mode drill-down or single mode) */
            <div className="px-(--page-inset) py-4 space-y-2">
              {/* Ratings */}
              {activeSection === "rating" && (
                <div className="-mx-(--page-inset) divide-y divide-border/30">
                  {[4, 3, 2, 1].map((stars) => {
                    const isActive = pending.minRating === stars.toString()
                    return (
                      <button
                        key={stars}
                        type="button"
                        onClick={() =>
                          setPending((prev) => ({
                            ...prev,
                            minRating: isActive ? null : stars.toString(),
                          }))
                        }
                        className={cn(
                          "w-full flex items-center gap-3 px-(--page-inset) h-12 transition-colors text-left",
                          isActive
                            ? "bg-muted/40 text-foreground font-medium"
                            : "text-foreground active:bg-muted/30"
                        )}
                        aria-pressed={isActive}
                      >
                        <div className="flex text-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              weight={i < stars ? "fill" : "regular"}
                            />
                          ))}
                        </div>
                        <span className="text-base font-normal">{t("andUp")}</span>
                        {isActive && (
                          <Check size={16} weight="bold" className="ml-auto" />
                        )}
                      </button>
                    )
                  })}
                </div>
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
                <div className="-mx-(--page-inset)">
                  <button
                    type="button"
                    onClick={() =>
                      setPending((prev) => ({
                        ...prev,
                        availability:
                          prev.availability === "instock" ? null : "instock",
                      }))
                    }
                    className={cn(
                      "w-full flex items-center gap-3 px-(--page-inset) h-12 transition-colors text-left",
                      pending.availability === "instock"
                        ? "bg-muted/40 text-foreground font-medium"
                        : "text-foreground active:bg-muted/30"
                    )}
                    aria-pressed={pending.availability === "instock"}
                  >
                    <div
                      className={cn(
                        "size-5 rounded border flex items-center justify-center transition-colors",
                        pending.availability === "instock"
                          ? "bg-primary border-primary"
                          : "border-input"
                      )}
                    >
                      {pending.availability === "instock" && (
                        <Check
                          size={12}
                          weight="bold"
                          className="text-primary-foreground"
                        />
                      )}
                    </div>
                    <span className="text-base font-normal">{t("inStock")}</span>
                  </button>
                </div>
              )}

              {/* Category Section - L2+ drill-down (Phase 3) */}
              {activeSection === "category" && subcategories.length > 0 && (
                <div className="-mx-(--page-inset) divide-y divide-border/30">
                  {/* "All in Category" option */}
                  <button
                    type="button"
                    onClick={() => setPendingCategorySlug(null)}
                    className={cn(
                      "w-full flex items-center justify-between px-(--page-inset) h-12 transition-colors text-left",
                      pendingCategorySlug === null
                        ? "bg-muted/40 text-foreground font-medium"
                        : "text-foreground active:bg-muted/30"
                    )}
                    aria-pressed={pendingCategorySlug === null}
                  >
                    <span className="text-base font-normal">
                      {tHub("allInCategory", { category: categoryName || "" })}
                    </span>
                    {pendingCategorySlug === null && <Check size={16} weight="bold" />}
                  </button>

                  {/* Subcategory options */}
                  {subcategories.map((subcat) => {
                    const isActive = pendingCategorySlug === subcat.slug
                    const subcatName = locale === "bg" && subcat.name_bg ? subcat.name_bg : subcat.name
                    return (
                      <button
                        key={subcat.id}
                        type="button"
                        onClick={() => setPendingCategorySlug(isActive ? null : subcat.slug)}
                        className={cn(
                          "w-full flex items-center justify-between px-(--page-inset) h-12 transition-colors text-left",
                          isActive
                            ? "bg-muted/40 text-foreground font-medium"
                            : "text-foreground active:bg-muted/30"
                        )}
                        aria-pressed={isActive}
                      >
                        <span className="text-base font-normal">{subcatName}</span>
                        {isActive && <Check size={16} weight="bold" />}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Category Attribute Filters */}
              {(() => {
                const section = filterSections.find(
                  (s) => s.id === activeSection
                ) as AttrFilterSection | undefined
                if (!section?.attribute) return null

                const attr = section.attribute
                const attrNameLower = attr.name.toLowerCase()
                const options = getAttrOptions(attr) ?? []

                // Boolean attribute
                if (attr.attribute_type === "boolean") {
                  const isChecked = getPendingAttrValues(attr.name).includes("true")
                  return (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingAttrValues(attr.name, isChecked ? [] : ["true"])
                      }
                      className={cn(
                        "-mx-(--page-inset) w-[calc(100%+var(--page-inset)*2)] flex items-center gap-3 px-(--page-inset) h-12 transition-colors text-left",
                        isChecked
                          ? "bg-muted/40 text-foreground font-medium"
                          : "text-foreground active:bg-muted/30"
                      )}
                      aria-pressed={isChecked}
                    >
                      <div
                        className={cn(
                          "size-5 rounded border flex items-center justify-center transition-colors",
                          isChecked ? "bg-primary border-primary" : "border-input"
                        )}
                      >
                        {isChecked && (
                          <Check
                            size={12}
                            weight="bold"
                            className="text-primary-foreground"
                          />
                        )}
                      </div>
                      <span className="text-base font-normal">
                        {locale === "bg" ? "Да" : "Yes"}
                      </span>
                    </button>
                  )
                }

                // Color attribute - use color swatches
                if (COLOR_ATTRIBUTE_NAMES.includes(attrNameLower) && options.length > 0) {
                  return (
                    <ColorSwatches
                      options={options}
                      selected={getPendingAttrValues(attr.name)}
                      onSelect={(values) => setPendingAttrValues(attr.name, values)}
                    />
                  )
                }

                // Size attribute - use size tiles (no dropdown per codex)
                if (SIZE_ATTRIBUTE_NAMES.includes(attrNameLower) && options.length > 0) {
                  return (
                    <SizeTiles
                      options={options}
                      selected={getPendingAttrValues(attr.name)}
                      onSelect={(values) => setPendingAttrValues(attr.name, values)}
                    />
                  )
                }

                // Searchable attributes (brand, condition) - use filter list with search
                if (SEARCHABLE_ATTRIBUTE_NAMES.includes(attrNameLower) && options.length > 0) {
                  const allowMulti =
                    attr.attribute_type === "multiselect" ||
                    shouldForceMultiSelect(attr)
                  return (
                    <FilterList
                      options={options}
                      selected={getPendingAttrValues(attr.name)}
                      onSelect={(values) => setPendingAttrValues(attr.name, values)}
                      multiSelect={allowMulti}
                      searchThreshold={8}
                    />
                  )
                }

                // Select/Multiselect attribute - default list rendering
                if (
                  (attr.attribute_type === "select" ||
                    attr.attribute_type === "multiselect") &&
                  options.length > 0
                ) {
                  const allowMulti =
                    attr.attribute_type === "multiselect" ||
                    shouldForceMultiSelect(attr)

                  return (
                    <div className="-mx-(--page-inset) divide-y divide-border/30">
                      {options.map((option, idx) => {
                        const currentValues = getPendingAttrValues(attr.name)
                        const isActive = currentValues.includes(option)

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!allowMulti) {
                                setPendingAttrValues(
                                  attr.name,
                                  isActive ? [] : [option]
                                )
                                return
                              }
                              const newValues = isActive
                                ? currentValues.filter((v) => v !== option)
                                : [...currentValues, option]
                              setPendingAttrValues(attr.name, newValues)
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-(--page-inset) h-12 transition-colors text-left",
                              isActive
                                ? "bg-muted/40 text-foreground font-medium"
                                : "text-foreground active:bg-muted/30"
                            )}
                            aria-pressed={isActive}
                          >
                            <span className="text-base font-normal">{option}</span>
                            {isActive && <Check size={16} weight="bold" />}
                          </button>
                        )
                      })}
                    </div>
                  )
                }

                return null
              })()}
            </div>
          )}
        </div>

        {/* Footer with Apply CTA + Live Count */}
        <div className="px-(--page-inset) py-4 border-t border-border/50 bg-background pb-safe-max">
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
        </div>
      </DrawerContent>
    </Drawer>
  )
}
