"use client"

import { useState, useCallback, useEffect, useMemo, startTransition } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { ChevronLeft as CaretLeft } from "lucide-react"

import { useTranslations } from "next-intl"
import { useFilterCount } from "@/hooks/use-filter-count"
import { Button } from "@/components/ui/button"
import { DrawerBody, DrawerFooter } from "@/components/ui/drawer"
import { IconButton } from "@/components/ui/icon-button"
import { DrawerShell } from "@/components/shared/drawer-shell"
import {
  shouldForceMultiSelectCategoryAttribute,
} from "@/lib/filters/category-attribute"
import type { CategoryAttribute } from "@/lib/data/categories"
import { usePendingFilters } from "./shared/state/use-pending-filters"
import { FilterHubListView } from "./filter-hub/filter-hub-list-view"
import { FilterHubSectionContent } from "./filter-hub/filter-hub-section-content"
import {
  buildFilterApplyResult,
  buildFilterSections,
  getSectionSelectedSummary,
} from "./filter-hub/filter-hub-utils"
import {
  isHiddenFilterAttribute,
} from "./shared/config/filter-attribute-config"
import type {
  FilterHubMode,
  FilterHubProps,
  FilterHubSection,
  FilterHubSubcategory,
  FilterSection,
} from "./filter-hub/types"

export type { FilterHubSubcategory, FilterHubMode, FilterHubSection }

export function FilterHub({
  open,
  onOpenChange,
  locale,
  resultsCount = 0,
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

  const visibleAttributes = useMemo(
    () => attributes.filter((attr) => !isHiddenFilterAttribute(attr.name)),
    [attributes]
  )

  const [activeSection, setActiveSection] = useState<string | null>(null)
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

  const effectiveCategoryId = useMemo(() => {
    if (pendingCategorySlug) {
      const subcat = subcategories.find((item) => item.slug === pendingCategorySlug)
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

  const { count: liveCount, isLoading: isCountLoading } = useFilterCount(
    open ? countParams : { categoryId: null, filters: {} }
  )

  const resolvedBasePath = basePath ?? pathname

  useEffect(() => {
    if (!open) return
    setActiveSection(mode === "single" && initialSection ? initialSection : null)
    setPendingCategorySlug(null)
  }, [open, mode, initialSection])

  const translateSearch = useCallback(
    (key: string, values?: Record<string, string | number>) => t(key as never, values as never),
    [t]
  )
  const translateHub = useCallback(
    (key: string, values?: Record<string, string | number>) => tHub(key as never, values as never),
    [tHub]
  )

  const filterSections = useMemo(
    () =>
      buildFilterSections({
        locale,
        t: translateSearch,
        tHub: translateHub,
        visibleAttributes,
        subcategories,
      }),
    [locale, translateSearch, translateHub, visibleAttributes, subcategories]
  )

  const shouldForceMultiSelect = useCallback((attr: CategoryAttribute) => {
    return shouldForceMultiSelectCategoryAttribute(attr)
  }, [])

  const clearAllPending = useCallback(() => {
    setPendingCategorySlug(null)
    clearPendingFilters()
  }, [clearPendingFilters])

  const hasPendingFilters = useMemo(() => {
    return pendingCategorySlug !== null || hasPendingFilterValues
  }, [pendingCategorySlug, hasPendingFilterValues])

  const applyFilters = useCallback(() => {
    const { queryString, finalPath } = buildFilterApplyResult({
      searchParams: new URLSearchParams(searchParams.toString()),
      pending,
      resolvedBasePath,
      pendingCategorySlug,
    })

    if (onApply) {
      onApply({ queryString, finalPath, pendingCategorySlug })
    } else {
      startTransition(() => {
        router.replace(queryString ? `${finalPath}?${queryString}` : finalPath)
      })
    }

    onOpenChange(false)
  }, [searchParams, pending, resolvedBasePath, pendingCategorySlug, onApply, router, onOpenChange])

  const getSelectedSummary = useCallback(
    (section: FilterSection) =>
      getSectionSelectedSummary({
        section,
        pending,
        pendingCategorySlug,
        subcategories,
        locale,
        t: translateSearch,
        tHub: translateHub,
        getPendingAttrValues,
      }),
    [
      pending,
      pendingCategorySlug,
      subcategories,
      locale,
      translateSearch,
      translateHub,
      getPendingAttrValues,
    ]
  )

  const displayCount = open ? liveCount : resultsCount
  const isSingleMode = mode === "single" && initialSection

  const currentSectionLabel = useMemo(() => {
    if (!activeSection) return null
    return filterSections.find((item) => item.id === activeSection)?.label ?? null
  }, [activeSection, filterSections])

  const headerTitle = activeSection ? currentSectionLabel ?? tHub("refineSearch") : tHub("refineSearch")
  const showClearAll = hasPendingFilters && (!activeSection || Boolean(isSingleMode))

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title={headerTitle}
      titleClassName="text-base font-semibold tracking-tight"
      closeLabel={tHub("close")}
      contentAriaLabel={tHub("refineSearch")}
      headerClassName={`px-inset pb-3 ${activeSection || isSingleMode ? "pt-4" : "pt-3"}`}
      contentClassName="px-0 pb-0 lg:hidden"
      headerLeading={
        activeSection && !isSingleMode ? (
          <IconButton
            type="button"
            data-vaul-no-drag
            aria-label={tHub("back")}
            variant="ghost"
            size="icon-default"
            className="-ml-1 text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
            onClick={() => setActiveSection(null)}
          >
            <CaretLeft size={20} />
          </IconButton>
        ) : null
      }
      headerTrailing={
        showClearAll ? (
          <button
            type="button"
            data-vaul-no-drag
            onClick={clearAllPending}
            className="text-sm font-medium text-primary transition-opacity active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {tHub("clearAll")}
          </button>
        ) : null
      }
      closeButtonClassName="text-muted-foreground hover:text-foreground hover:bg-hover active:bg-active motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)"
      closeIconSize={18}
    >
        <DrawerBody className="px-0">
          {!activeSection && !isSingleMode ? (
            <FilterHubListView
              filterSections={filterSections}
              onSelectSection={setActiveSection}
              getSelectedSummary={getSelectedSummary}
            />
          ) : (
            <FilterHubSectionContent
              activeSection={activeSection}
              locale={locale}
              pending={pending}
              setPending={setPending}
              pendingCategorySlug={pendingCategorySlug}
              onChangePendingCategorySlug={setPendingCategorySlug}
              filterSections={filterSections}
              {...(categoryName ? { categoryName } : {})}
              subcategories={subcategories as FilterHubSubcategory[]}
              shouldForceMultiSelect={shouldForceMultiSelect}
              getPendingAttrValues={getPendingAttrValues}
              setPendingAttrValues={setPendingAttrValues}
              tSearchFilters={translateSearch}
              tCommon={(key, values) => tCommon(key as never, values as never)}
              onCloseHub={() => onOpenChange(false)}
            />
          )}
        </DrawerBody>

        <DrawerFooter className="px-inset">
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
    </DrawerShell>
  )
}
