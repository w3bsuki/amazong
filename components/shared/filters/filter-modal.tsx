"use client"

import { useState, useCallback, useEffect, useMemo, startTransition } from "react"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { usePathname, useRouter, Link } from "@/i18n/routing"
import { X, Star } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useFilterCount } from "@/hooks/use-filter-count"
import { useIsMobile } from "@/hooks/use-mobile"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import type { CategoryAttribute } from "@/lib/data/categories"
import { getCategoryAttributeKey, getCategoryAttributeOptions, shouldForceMultiSelectCategoryAttribute } from "@/lib/filters/category-attribute"
import { usePendingFilters } from "./use-pending-filters"
import { PriceSlider } from "./price-slider"
import { FilterCheckboxItem } from "./filter-checkbox-item"
import { FilterAttributeSectionContent } from "./filter-attribute-section-content"
import { FilterRadioGroup, FilterRadioItem } from "./filter-radio-group"

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
  /** Optional externally-controlled applied params (for instant, non-navigating flows) */
  appliedSearchParams?: URLSearchParams | ReadonlyURLSearchParams | undefined
  /** Optional apply handler to avoid router navigation */
  onApply?: (next: {
    queryString: string
    finalPath: string
    pendingCategorySlug?: string | null
  }) => void
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
  appliedSearchParams,
  onApply,
}: FilterModalProps) {
  const t = useTranslations("SearchFilters")
  const tHub = useTranslations("FilterHub")
  const tCommon = useTranslations("Common")
  const router = useRouter()
  const pathname = usePathname()
  const searchParamsFromRouter = useSearchParams()
  const searchParams = appliedSearchParams ?? searchParamsFromRouter
  const isMobile = useIsMobile()

  const attributeKey = useMemo(
    () => (attribute ? getCategoryAttributeKey(attribute) : null),
    [attribute],
  )
  const attributeParamKey = useMemo(
    () => (attributeKey ? `attr_${attributeKey}` : null),
    [attributeKey],
  )

  const appliedCategorySlug = useMemo(() => {
    if (!categoryParamKey) return null
    return searchParams.get(categoryParamKey)
  }, [categoryParamKey, searchParams])
  const filterAttributes = useMemo(
    () => (attribute ? [attribute] : []),
    [attribute]
  )

  // Pending category slug (for category section)
  const [pendingCategorySlug, setPendingCategorySlug] = useState<string | null>(null)

  const {
    pending,
    setPending,
    getPendingAttrValues,
    setPendingAttrValues,
  } = usePendingFilters({
    open,
    searchParams,
    attributes: filterAttributes,
    includeExtendedFields: false,
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
  }, [open, searchParams, categoryParamKey, section])

  // Attribute helpers
  const shouldForceMultiSelect = useCallback((attr: CategoryAttribute) => {
    return shouldForceMultiSelectCategoryAttribute(attr)
  }, [])

  const getAttrOptions = useCallback(
    (attr: CategoryAttribute) => {
      return getCategoryAttributeOptions(attr, locale)
    },
    [locale]
  )

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
      return attributeKey ? (pending.attributes[attributeKey]?.length ?? 0) > 0 : false
    }
    return false
  }, [section, categoryParamKey, pendingCategorySlug, appliedCategorySlug, pending, attribute, attributeKey])

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
      if (attributeKey) setPendingAttrValues(attributeKey, [])
    }
  }, [section, attribute, attributeKey, setPending, setPendingAttrValues])

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
      if (attributeParamKey && attributeKey) {
        params.delete(attributeParamKey)
        params.delete(`attr_${attribute.name}`)
        const values = pending.attributes[attributeKey] || []
        for (const v of values) {
          if (v) params.append(attributeParamKey, v)
        }
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
    if (onApply) {
      onApply({ queryString, finalPath, pendingCategorySlug })
    } else {
      // Replace instead of push: avoids history spam and reduces the feeling of a full reload.
      startTransition(() => {
        router.replace(queryString ? `${finalPath}?${queryString}` : finalPath)
      })
    }
    onOpenChange(false)
  }, [section, pending, pendingCategorySlug, attribute, attributeKey, attributeParamKey, searchParams, resolvedBasePath, router, onOpenChange, categoryParamKey, onApply])

  const displayCount = open ? liveCount : resultsCount

  const contentPaddingClass = isMobile ? "px-inset py-4" : "p-4"
  const listBleedClass = isMobile ? "-mx-inset" : "-mx-4"
  const rowPadClass = isMobile ? "px-inset" : "px-4"

  const renderAttributeSection = () => {
    if (!attribute) return null

    const attrKey = attributeKey ?? getCategoryAttributeKey(attribute)
    const options = getAttrOptions(attribute) ?? []

    return (
      <FilterAttributeSectionContent
        attribute={attribute}
        attrKey={attrKey}
        options={options}
        selectedValues={getPendingAttrValues(attrKey)}
        onSelectedValuesChange={(values) => setPendingAttrValues(attrKey, values)}
        shouldForceMultiSelect={shouldForceMultiSelect}
        yesLabel={tCommon("yes")}
        checkboxListClassName={listBleedClass}
        checkboxItemsFullBleed={isMobile}
      />
    )
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
        <div className={cn(listBleedClass, "divide-y divide-border")}>
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
                  "w-full flex items-center gap-3 h-11 transition-colors text-left",
                  rowPadClass,
                  isActive
                    ? "bg-selected text-foreground font-medium"
                    : "text-foreground active:bg-active"
                )}
                aria-pressed={isActive}
              >
                <Checkbox
                  checked={isActive}
                  onCheckedChange={() =>
                    setPending((prev) => ({
                      ...prev,
                      minRating: isActive ? null : stars.toString(),
                    }))
                  }
                  className="pointer-events-none shrink-0"
                  aria-hidden="true"
                  tabIndex={-1}
                />
                <div className="flex text-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} weight={i < stars ? "fill" : "regular"} />
                  ))}
                </div>
                <span className="text-sm">{t("andUp")}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Availability Section */}
      {section === "availability" && (
        <div className={listBleedClass}>
          <FilterCheckboxItem
            checked={pending.availability === "instock"}
            onCheckedChange={(checked) =>
              setPending((prev) => ({
                ...prev,
                availability: checked ? "instock" : null,
              }))
            }
            fullBleed={isMobile}
          >
            {t("inStock")}
          </FilterCheckboxItem>
        </div>
      )}

      {/* Category Section */}
      {section === "category" && subcategories.length > 0 && (
        <div className={listBleedClass}>
          <FilterRadioGroup
            value={pendingCategorySlug ?? ""}
            onValueChange={(value) => setPendingCategorySlug(value || null)}
          >
            {showAllCategoriesOption && (
              <FilterRadioItem value="" fullBleed={isMobile}>
                {t("browseAllCategories")}
              </FilterRadioItem>
            )}

            {!showAllCategoriesOption && (
              <div className="flex items-center px-inset border-b border-border">
                <FilterRadioItem
                  value=""
                  className="flex-1 border-b-0"
                >
                  {tHub("allInCategory", { category: categoryName || "" })}
                </FilterRadioItem>
                <Link
                  href="/categories"
                  onClick={() => onOpenChange(false)}
                  className="size-11 flex items-center justify-center rounded-full bg-muted hover:bg-destructive-subtle hover:text-destructive transition-colors shrink-0 ml-2"
                  aria-label={t("browseAllCategories")}
                  title={t("browseAllCategories")}
                >
                  <X size={14} weight="bold" />
                </Link>
              </div>
            )}

            {subcategories.map((subcat) => {
              const subcatName = locale === "bg" && subcat.name_bg ? subcat.name_bg : subcat.name
              return (
                <FilterRadioItem
                  key={subcat.id}
                  value={subcat.slug}
                  fullBleed={isMobile}
                >
                  {subcatName}
                </FilterRadioItem>
              )
            })}
          </FilterRadioGroup>
        </div>
      )}

      {/* Attribute Sections */}
      {section.startsWith("attr_") && attribute ? renderAttributeSection() : null}
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-dialog flex flex-col rounded-t-2xl px-0 pb-0 bg-background">

          <DrawerHeader className="px-inset pt-4 pb-3 border-b border-border">
            <div className="flex items-center justify-between min-h-touch-sm">
              <DrawerTitle className="text-base font-semibold">{sectionLabel}</DrawerTitle>
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
                  className="size-11 flex items-center justify-center rounded-full hover:bg-hover active:bg-active transition-colors"
                  aria-label={tHub("close")}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
            </div>
          </DrawerHeader>

          <DrawerBody className="px-0 bg-background">
            <div className={contentPaddingClass}>{body}</div>
          </DrawerBody>

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-full max-w-sm mx-4 rounded-2xl p-0 gap-0",
          "max-h-dialog-sm flex flex-col"
        )}
        showCloseButton={false}
      >
        <DialogHeader className="px-4 py-4 border-b border-border shrink-0">
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
                  className="size-11 flex items-center justify-center rounded-full hover:bg-hover active:bg-active transition-colors"
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

        <div className="p-4 border-t border-border bg-background shrink-0 pb-safe-max">
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
