"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { X, Check, Star } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useFilterCount } from "@/hooks/use-filter-count"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import type { CategoryAttribute } from "@/lib/data/categories"
import { ColorSwatches } from "./color-swatches"
import { SizeTiles } from "./size-tiles"
import { FilterList } from "./filter-list"
import { PriceSlider } from "./price-slider"

// =============================================================================
// FILTER MODAL — Single-section modal for quick filter pills (eBay pattern)
//
// Per UI_UX_CODEX.md & TODO1.md Phase 2:
// - Uses Drawer (bottom-sheet) on mobile, Dialog on desktop
// - Opens to a single filter section (Price, Brand, Color, etc.)
// - Rounded-2xl with inset margins, clear close button
// - Same pending/applied state model as FilterHub
// - Live result count on Apply CTA
// =============================================================================

// Attribute detection helpers
const COLOR_ATTRIBUTE_NAMES = ["color", "colour", "цвят"]
const SIZE_ATTRIBUTE_NAMES = ["size", "sizes", "размер"]
const SEARCHABLE_ATTRIBUTE_NAMES = ["brand", "brands", "марка", "condition", "състояние"]
const FORCE_MULTISELECT_NAMES = ["brand", "make", "model"]

export type FilterModalSection =
  | "price"
  | "rating"
  | "availability"
  | "category"
  | `attr_${string}` // dynamic attribute sections

export interface FilterModalSubcategory {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Which section to display */
  section: FilterModalSection
  /** Label for the section header */
  sectionLabel: string
  locale: string
  resultsCount?: number
  categorySlug?: string
  categoryId?: string
  searchQuery?: string
  /** Attribute definition (for attr_* sections) */
  attribute?: CategoryAttribute
  /** Subcategories for category section */
  subcategories?: FilterModalSubcategory[]
  categoryName?: string
  basePath?: string
  /** When set, category selection writes to this query param key (e.g. "category" for /search) */
  categoryParamKey?: string
  /** When true, show an "All categories" option (used for /search) */
  showAllCategoriesOption?: boolean
}

interface PendingFilters {
  minPrice: string | null
  maxPrice: string | null
  minRating: string | null
  availability: string | null
  attributes: Record<string, string[]>
}

export function FilterModal({
  open,
  onOpenChange,
  section,
  sectionLabel,
  locale,
  resultsCount = 0,
  categorySlug,
  categoryId,
  searchQuery,
  attribute,
  subcategories = [],
  categoryName,
  basePath,
  categoryParamKey,
  showAllCategoriesOption = false,
}: FilterModalProps) {
  const t = useTranslations("SearchFilters")
  const tHub = useTranslations("FilterHub")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()

  const appliedCategorySlug = useMemo(() => {
    if (!categoryParamKey) return null
    return searchParams.get(categoryParamKey)
  }, [categoryParamKey, searchParams])

  // Pending category slug (for category section)
  const [pendingCategorySlug, setPendingCategorySlug] = useState<string | null>(null)

  // Pending filter state
  const [pending, setPending] = useState<PendingFilters>({
    minPrice: null,
    maxPrice: null,
    minRating: null,
    availability: null,
    attributes: {},
  })

  // Effective category for count
  const effectiveCategoryId = useMemo(() => {
    // For /search category filtering: pendingCategorySlug=null means "All categories" (no category constraint)
    if (categoryParamKey && pendingCategorySlug === null) {
      return null
    }
    if (pendingCategorySlug) {
      const subcat = subcategories.find((s) => s.slug === pendingCategorySlug)
      return subcat?.id ?? categoryId ?? null
    }
    return categoryId ?? null
  }, [categoryParamKey, pendingCategorySlug, subcategories, categoryId])

  // Build count params
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

  // Live count
  const { count: liveCount, isLoading: isCountLoading } = useFilterCount(
    open ? countParams : { categoryId: null, filters: {} }
  )

  const resolvedBasePath = basePath ?? pathname

  // Initialize pending from URL when modal opens
  useEffect(() => {
    if (!open) return

    if (section === "category" && categoryParamKey) {
      setPendingCategorySlug(searchParams.get(categoryParamKey))
    } else {
      setPendingCategorySlug(null)
    }
    setPending({
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      minRating: searchParams.get("minRating"),
      availability: searchParams.get("availability"),
      attributes: attribute
        ? {
            [attribute.name]: searchParams.getAll(`attr_${attribute.name}`),
          }
        : {},
    })
  }, [open, searchParams, attribute, categoryParamKey, section])

  // Attribute helpers
  const shouldForceMultiSelect = useCallback((attr: CategoryAttribute) => {
    return FORCE_MULTISELECT_NAMES.includes(attr.name.trim().toLowerCase())
  }, [])

  const getAttrOptions = useCallback(
    (attr: CategoryAttribute) => {
      return locale === "bg" && attr.options_bg ? attr.options_bg : attr.options
    },
    [locale]
  )

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

  // Check if any pending changes
  const hasPendingFilters = useMemo(() => {
    if (section === "category") {
      if (categoryParamKey) return pendingCategorySlug !== appliedCategorySlug
      return pendingCategorySlug !== null
    }
    if (section === "price") return pending.minPrice !== null || pending.maxPrice !== null
    if (section === "rating") return pending.minRating !== null
    if (section === "availability") return pending.availability !== null
    if (section.startsWith("attr_") && attribute) {
      return (pending.attributes[attribute.name]?.length ?? 0) > 0
    }
    return false
  }, [section, categoryParamKey, pendingCategorySlug, appliedCategorySlug, pending, attribute])

  // Clear this section's pending
  const clearSection = useCallback(() => {
    if (section === "category") {
      setPendingCategorySlug(null)
    } else if (section === "price") {
      setPending((prev) => ({ ...prev, minPrice: null, maxPrice: null }))
    } else if (section === "rating") {
      setPending((prev) => ({ ...prev, minRating: null }))
    } else if (section === "availability") {
      setPending((prev) => ({ ...prev, availability: null }))
    } else if (section.startsWith("attr_") && attribute) {
      setPendingAttrValues(attribute.name, [])
    }
  }, [section, attribute, setPendingAttrValues])

  // Apply filters
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Only update params relevant to this section
    if (section === "price") {
      params.delete("minPrice")
      params.delete("maxPrice")
      if (pending.minPrice) params.set("minPrice", pending.minPrice)
      if (pending.maxPrice) params.set("maxPrice", pending.maxPrice)
    } else if (section === "rating") {
      params.delete("minRating")
      if (pending.minRating) params.set("minRating", pending.minRating)
    } else if (section === "availability") {
      params.delete("availability")
      if (pending.availability) params.set("availability", pending.availability)
    } else if (section.startsWith("attr_") && attribute) {
      params.delete(`attr_${attribute.name}`)
      const values = pending.attributes[attribute.name] || []
      for (const v of values) {
        if (v) params.append(`attr_${attribute.name}`, v)
      }
    }

    // Reset page
    params.delete("page")

    // Handle category navigation
    let finalPath = resolvedBasePath
    if (section === "category") {
      if (categoryParamKey) {
        if (pendingCategorySlug) {
          params.set(categoryParamKey, pendingCategorySlug)
        } else {
          params.delete(categoryParamKey)
        }
      } else if (pendingCategorySlug) {
        finalPath = `/categories/${pendingCategorySlug}`
      }
    }

    const queryString = params.toString()
    router.push(queryString ? `${finalPath}?${queryString}` : finalPath)
    onOpenChange(false)
  }, [section, pending, pendingCategorySlug, attribute, searchParams, resolvedBasePath, router, onOpenChange, categoryParamKey])

  const displayCount = open ? liveCount : resultsCount

  const contentPaddingClass = isMobile ? "px-(--page-inset) py-4" : "p-4"
  const listBleedClass = isMobile ? "-mx-(--page-inset)" : "-mx-4"
  const rowPadClass = isMobile ? "px-(--page-inset)" : "px-4"

  const renderAttributeSection = () => {
    if (!attribute) return null

    const attrNameLower = attribute.name.toLowerCase()
    const options = getAttrOptions(attribute) ?? []

    // Boolean attribute
    if (attribute.attribute_type === "boolean") {
      const isChecked = getPendingAttrValues(attribute.name).includes("true")
      return (
        <button
          type="button"
          onClick={() => setPendingAttrValues(attribute.name, isChecked ? [] : ["true"])}
          className={cn(
            "w-full flex items-center gap-3 px-3 h-12 rounded-lg transition-colors",
            isChecked ? "bg-secondary text-primary font-medium" : "active:bg-muted"
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
              <Check size={12} weight="bold" className="text-primary-foreground" />
            )}
          </div>
          <span className="text-sm font-medium">{locale === "bg" ? "Да" : "Yes"}</span>
        </button>
      )
    }

    // Color attribute
    if (COLOR_ATTRIBUTE_NAMES.includes(attrNameLower) && options.length > 0) {
      return (
        <ColorSwatches
          options={options}
          selected={getPendingAttrValues(attribute.name)}
          onSelect={(values) => setPendingAttrValues(attribute.name, values)}
        />
      )
    }

    // Size attribute
    if (SIZE_ATTRIBUTE_NAMES.includes(attrNameLower) && options.length > 0) {
      return (
        <SizeTiles
          options={options}
          selected={getPendingAttrValues(attribute.name)}
          onSelect={(values) => setPendingAttrValues(attribute.name, values)}
        />
      )
    }

    // Searchable attributes (brand, condition)
    if (SEARCHABLE_ATTRIBUTE_NAMES.includes(attrNameLower) && options.length > 0) {
      const allowMulti =
        attribute.attribute_type === "multiselect" || shouldForceMultiSelect(attribute)
      return (
        <FilterList
          options={options}
          selected={getPendingAttrValues(attribute.name)}
          onSelect={(values) => setPendingAttrValues(attribute.name, values)}
          multiSelect={allowMulti}
          searchThreshold={8}
        />
      )
    }

    // Default select/multiselect list
    if (
      (attribute.attribute_type === "select" || attribute.attribute_type === "multiselect") &&
      options.length > 0
    ) {
      const allowMulti =
        attribute.attribute_type === "multiselect" || shouldForceMultiSelect(attribute)

      return (
        <div className={cn(listBleedClass, "divide-y divide-border/30")}>
          {options.map((option, idx) => {
            const currentValues = getPendingAttrValues(attribute.name)
            const isActive = currentValues.includes(option)

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!allowMulti) {
                    setPendingAttrValues(attribute.name, isActive ? [] : [option])
                    return
                  }
                  const newValues = isActive
                    ? currentValues.filter((v) => v !== option)
                    : [...currentValues, option]
                  setPendingAttrValues(attribute.name, newValues)
                }}
                className={cn(
                  "w-full flex items-center justify-between h-12 transition-colors text-left",
                  rowPadClass,
                  isActive
                    ? "bg-muted/40 text-foreground font-medium"
                    : "text-foreground active:bg-muted/30"
                )}
                aria-pressed={isActive}
              >
                <span className="text-base font-normal">{option}</span>
                {isActive && <Check size={18} weight="bold" />}
              </button>
            )
          })}
        </div>
      )
    }

    return null
  }

  const body = (
    <>
      {/* Price Section */}
      {section === "price" && (
        <PriceSlider
          value={{ min: pending.minPrice, max: pending.maxPrice }}
          onChange={({ min, max }) =>
            setPending((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
          }
        />
      )}

      {/* Rating Section */}
      {section === "rating" && (
        <div className={cn(listBleedClass, "divide-y divide-border/30")}> 
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
                  "w-full flex items-center gap-3 h-12 transition-colors text-left",
                  rowPadClass,
                  isActive
                    ? "bg-muted/40 text-foreground font-medium"
                    : "text-foreground active:bg-muted/30"
                )}
                aria-pressed={isActive}
              >
                <div className="flex text-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} weight={i < stars ? "fill" : "regular"} />
                  ))}
                </div>
                <span className="text-base font-normal">{t("andUp")}</span>
                {isActive && <Check size={18} weight="bold" className="ml-auto" />}
              </button>
            )
          })}
        </div>
      )}

      {/* Availability Section */}
      {section === "availability" && (
        <div className={cn(listBleedClass, "divide-y divide-border/30")}> 
          <button
            type="button"
            onClick={() =>
              setPending((prev) => ({
                ...prev,
                availability: prev.availability === "instock" ? null : "instock",
              }))
            }
            className={cn(
              "w-full flex items-center gap-3 h-12 transition-colors text-left",
              rowPadClass,
              pending.availability === "instock"
                ? "bg-muted/40 text-foreground font-medium"
                : "text-foreground active:bg-muted/30"
            )}
            aria-pressed={pending.availability === "instock"}
          >
            <div
              className={cn(
                "size-5 rounded border flex items-center justify-center transition-colors",
                pending.availability === "instock" ? "bg-primary border-primary" : "border-input"
              )}
            >
              {pending.availability === "instock" && (
                <Check size={12} weight="bold" className="text-primary-foreground" />
              )}
            </div>
            <span className="text-base font-normal">{t("inStock")}</span>
          </button>
        </div>
      )}

      {/* Category Section */}
      {section === "category" && subcategories.length > 0 && (
        <div className={cn(listBleedClass, "divide-y divide-border/30")}> 
          {showAllCategoriesOption && (
            <button
              type="button"
              onClick={() => setPendingCategorySlug(null)}
              className={cn(
                "w-full flex items-center justify-between h-12 transition-colors text-left",
                rowPadClass,
                pendingCategorySlug === null
                  ? "bg-muted/40 text-foreground font-medium"
                  : "text-foreground active:bg-muted/30"
              )}
              aria-pressed={pendingCategorySlug === null}
            >
              <span className="text-base font-normal">{t("browseAllCategories")}</span>
              {pendingCategorySlug === null && <Check size={18} weight="bold" />}
            </button>
          )}

          {!showAllCategoriesOption && (
            <button
              type="button"
              onClick={() => setPendingCategorySlug(null)}
              className={cn(
                "w-full flex items-center justify-between h-12 transition-colors text-left",
                rowPadClass,
                pendingCategorySlug === null
                  ? "bg-muted/40 text-foreground font-medium"
                  : "text-foreground active:bg-muted/30"
              )}
              aria-pressed={pendingCategorySlug === null}
            >
              <span className="text-base font-normal">
                {tHub("allInCategory", { category: categoryName || "" })}
              </span>
              {pendingCategorySlug === null && <Check size={18} weight="bold" />}
            </button>
          )}

          {subcategories.map((subcat) => {
            const isActive = pendingCategorySlug === subcat.slug
            const subcatName = locale === "bg" && subcat.name_bg ? subcat.name_bg : subcat.name
            return (
              <button
                key={subcat.id}
                type="button"
                onClick={() => setPendingCategorySlug(isActive ? null : subcat.slug)}
                className={cn(
                  "w-full flex items-center justify-between h-12 transition-colors text-left",
                  rowPadClass,
                  isActive
                    ? "bg-muted/40 text-foreground font-medium"
                    : "text-foreground active:bg-muted/30"
                )}
                aria-pressed={isActive}
              >
                <span className="text-base font-normal">{subcatName}</span>
                {isActive && <Check size={18} weight="bold" />}
              </button>
            )
          })}
        </div>
      )}

      {/* Attribute Sections */}
      {section.startsWith("attr_") && attribute ? renderAttributeSection() : null}
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-(--dialog-max-h) flex flex-col rounded-t-3xl px-0 pb-0">
          <div className="flex justify-center pt-2">
            <div className="h-1.5 w-12 rounded-full bg-muted-foreground/25" />
          </div>

          <DrawerHeader className="px-(--page-inset) pt-4 pb-3 border-b border-border/30">
            <div className="flex items-center justify-between min-h-touch-sm">
              <DrawerTitle className="text-xl font-semibold">{sectionLabel}</DrawerTitle>
              <div className="flex items-center gap-2">
                {hasPendingFilters && (
                  <button
                    type="button"
                    onClick={clearSection}
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
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto overscroll-contain bg-background">
            <div className={contentPaddingClass}>{body}</div>
          </div>

          <div className="px-(--page-inset) py-4 border-t border-border/30 bg-background flex-shrink-0 pb-safe-max">
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-full max-w-sm mx-4 rounded-2xl p-0 gap-0",
          "max-h-(--dialog-max-h-sm) flex flex-col"
        )}
        showCloseButton={false}
      >
        <DialogHeader className="px-4 py-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{sectionLabel}</DialogTitle>
            <div className="flex items-center gap-2">
              {hasPendingFilters && (
                <button
                  type="button"
                  onClick={clearSection}
                  className="text-sm font-medium text-primary active:opacity-70 transition-opacity"
                >
                  {tHub("clearAll")}
                </button>
              )}
              <DialogClose asChild>
                <button
                  type="button"
                  className="size-8 flex items-center justify-center rounded-full hover:bg-muted active:bg-muted/80 transition-colors"
                  aria-label={tHub("close")}
                >
                  <X size={18} weight="bold" />
                </button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className={contentPaddingClass}>{body}</div>
        </div>

        <div className="p-4 border-t border-border/50 bg-background flex-shrink-0 pb-safe-max">
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
      </DialogContent>
    </Dialog>
  )
}
