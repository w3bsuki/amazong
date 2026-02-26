"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ChevronLeft, SlidersHorizontal } from "lucide-react"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryAttribute } from "@/lib/data/categories"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useHeader } from "@/components/providers/header-context"
import { useInstantCategoryBrowse } from "./use-instant-category-browse"
import { getCategoryName, getCategorySlugKey } from "@/lib/data/categories/display"
import type { SmartRailAction, SmartRailPill } from "@/components/mobile/chrome/smart-rail"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"
import { getCategoryAttributeKey } from "@/lib/filters/category-attribute"
import { MobileCategoryBrowserContextualView } from "./mobile-category-browser-contextual-view"
import {
  toScopedCategoryList,
  type ScopeCategory,
} from "./mobile-category-browser-contextual-utils"

type Category = CategoryTreeNode

interface SectionPathSegment {
  slug: string
  label: string
}

interface MobileCategoryBrowserContextualProps {
  locale: string
  initialProducts: UIProduct[]
  initialProductsSlug: string
  contextualCategoryName?: string
  contextualBackHref?: string
  contextualSubcategories: Category[]
  contextualSiblingCategories?: Category[]
  filterableAttributes: CategoryAttribute[]
  categoryId?: string
  parentCategory?: {
    id: string
    slug: string
    parent_id: string | null
    name?: string
    name_bg?: string | null
  } | null
}

export function MobileCategoryBrowserContextual({
  locale,
  initialProducts,
  initialProductsSlug,
  contextualCategoryName,
  contextualBackHref,
  contextualSubcategories,
  contextualSiblingCategories = [],
  filterableAttributes,
  categoryId,
  parentCategory,
}: MobileCategoryBrowserContextualProps) {
  const tCategories = useTranslations("Categories")
  const tCommon = useTranslations("Common")
  const tSearchFilters = useTranslations("SearchFilters")
  const router = useRouter()
  const { setHeaderState } = useHeader()

  const contextualInitialTitle = contextualCategoryName || ""
  const initialChildrenForHook = useMemo(
    () => toScopedCategoryList(contextualSubcategories),
    [contextualSubcategories]
  )
  const initialSiblingsForHook = useMemo(
    () => toScopedCategoryList(contextualSiblingCategories),
    [contextualSiblingCategories]
  )

  const routeParentContext = useMemo<ScopeCategory | null>(
    () =>
      parentCategory
        ? {
            id: parentCategory.id,
            slug: parentCategory.slug,
            parent_id: parentCategory.parent_id,
            name: parentCategory.name ?? parentCategory.slug,
            name_bg: parentCategory.name_bg ?? null,
          }
        : null,
    [parentCategory]
  )

  const instant = useInstantCategoryBrowse({
    enabled: true,
    locale,
    initialSlug: initialProductsSlug,
    initialTitle: contextualInitialTitle,
    initialCategoryId: categoryId,
    initialParent: routeParentContext,
    initialChildren: initialChildrenForHook,
    initialSiblings: initialSiblingsForHook,
    initialAttributes: filterableAttributes,
    initialProducts,
  })

  // Section path tracks L2+ depth from route category — shown as compound pill in rail
  const [sectionPath, setSectionPath] = useState<SectionPathSegment[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  const fallbackParentHref = routeParentContext?.slug ? `/categories/${routeParentContext.slug}` : null
  const backHref = contextualBackHref || fallbackParentHref || `/categories`

  const effectiveAttributes = instant.attributes.length ? instant.attributes : filterableAttributes

  const railCategories = useMemo(
    () => (instant.children.length > 0 ? instant.children : instant.siblings) as ScopeCategory[],
    [instant.children, instant.siblings]
  )

  const railLabelBySlug = useMemo(() => {
    const map = new Map<string, string>()
    for (const cat of railCategories) {
      map.set(
        cat.slug,
        tCategories("shortName", {
          slug: getCategorySlugKey(cat.slug),
          name: getCategoryName(cat, locale),
        })
      )
    }
    return map
  }, [railCategories, tCategories, locale])

  const handleOptionSelect = useCallback(
    (slug: string) => {
      const optionLabel = railLabelBySlug.get(slug)
      if (optionLabel) {
        setSectionPath(prev => {
          const isDrillingDeeper = instant.children.length > 0
          if (isDrillingDeeper || prev.length === 0) {
            return [...prev, { slug, label: optionLabel }]
          }
          // Switching to sibling — replace last entry
          return [...prev.slice(0, -1), { slug, label: optionLabel }]
        })
      }
      void instant.setCategorySlug(slug, { clearAttrFilters: true })
    },
    [instant, railLabelBySlug]
  )

  const handleSectionBack = useCallback(() => {
    if (sectionPath.length === 0) return
    const next = sectionPath.slice(0, -1)
    setSectionPath(next)
    const targetSlug = next[next.length - 1]?.slug ?? initialProductsSlug
    void instant.setCategorySlug(targetSlug, { clearAttrFilters: true })
  }, [instant, initialProductsSlug, sectionPath])

  const handleApplyFilters = async (next: { queryString: string; finalPath: string }) => {
    const params = new URLSearchParams(next.queryString)
    await instant.setFilters(params)
  }

  const handleBack = useCallback(() => {
    router.push(backHref)
  }, [router, backHref])

  // Header: locked at route-level "Parent › Category" — stable section anchor
  const parentDisplayName = routeParentContext
    ? getCategoryName(routeParentContext, locale)
    : null
  const headerTitle = parentDisplayName
    ? `${parentDisplayName} › ${contextualInitialTitle}`
    : contextualInitialTitle

  useEffect(() => {
    setHeaderState({
      type: "contextual",
      value: {
        title: headerTitle,
        backHref,
        onBack: handleBack,
        activeSlug: instant.activeSlug,
      },
    })
  }, [
    backHref,
    handleBack,
    headerTitle,
    instant.activeSlug,
    setHeaderState,
  ])

  useEffect(() => {
    return () => setHeaderState(null)
  }, [setHeaderState])

  const railPills = useMemo<SmartRailPill[]>(() => {
    const isLeafNode = instant.children.length === 0
    const pills: SmartRailPill[] = []

    if (!isLeafNode) {
      pills.push({
        id: "all",
        label: tCategories("all"),
        active: true,
        testId: "mobile-category-pill-all",
      })

      for (const cat of railCategories) {
        const label = railLabelBySlug.get(cat.slug)
        if (!label) continue
        pills.push({
          id: cat.id,
          label,
          onSelect: () => handleOptionSelect(cat.slug),
          testId: `mobile-category-pill-${cat.slug}`,
        })
      }

      return pills
    }

    const activeCategory = railCategories.find((cat) => cat.slug === instant.categorySlug) ?? null
    if (activeCategory) {
      pills.push({
        id: activeCategory.id,
        label: railLabelBySlug.get(activeCategory.slug) ?? activeCategory.slug,
        active: true,
        testId: `mobile-category-pill-${activeCategory.slug}`,
      })
    }

    for (const cat of railCategories) {
      if (cat.slug === instant.categorySlug) continue
      const label = railLabelBySlug.get(cat.slug)
      if (!label) continue
      pills.push({
        id: cat.id,
        label,
        onSelect: () => handleOptionSelect(cat.slug),
        testId: `mobile-category-pill-${cat.slug}`,
      })
    }

    return pills
  }, [
    handleOptionSelect,
    instant.categorySlug,
    instant.children.length,
    railCategories,
    railLabelBySlug,
    tCategories,
  ])

  const railLeadingAction = useMemo<SmartRailAction | undefined>(() => {
    if (sectionPath.length === 0) return
    return {
      label: tCommon("back"),
      icon: <ChevronLeft size={18} aria-hidden="true" />,
      onSelect: handleSectionBack,
      ariaLabel: tCommon("back"),
      variant: "icon",
      testId: "mobile-category-rail-back",
    }
  }, [handleSectionBack, sectionPath.length, tCommon])

  const attributeKeys = useMemo(
    () => effectiveAttributes.map((attribute) => `attr_${getCategoryAttributeKey(attribute)}`),
    [effectiveAttributes]
  )

  const activeFilterCount = useMemo(
    () =>
      getActiveFilterCount(instant.appliedSearchParams, {
        includeDeals: true,
        includeVerified: true,
        includeLocation: true,
        attributeKeys,
      }),
    [instant.appliedSearchParams, attributeKeys]
  )

  const hasActiveFilters = activeFilterCount > 0

  const railTrailingAction = useMemo<SmartRailAction>(() => {
    return {
      label: tSearchFilters("filters"),
      icon: <SlidersHorizontal size={18} aria-hidden="true" />,
      onSelect: () => setFilterOpen(true),
      ariaLabel: tSearchFilters("filters"),
      active: hasActiveFilters,
      ...(activeFilterCount > 0 ? { badgeCount: activeFilterCount } : {}),
      testId: "mobile-category-filter-trigger",
      variant: "icon",
    }
  }, [activeFilterCount, hasActiveFilters, tSearchFilters])

  return (
    <MobileCategoryBrowserContextualView
      locale={locale}
      railPills={railPills}
      {...(railLeadingAction ? { railLeadingAction } : {})}
      railTrailingAction={railTrailingAction}
      filterOpen={filterOpen}
      onFilterOpenChange={setFilterOpen}
      navigationAriaLabel={tCategories("navigationAriaLabel")}
      attributes={effectiveAttributes}
      categorySlug={instant.categorySlug}
      categoryId={instant.categoryId ?? null}
      railCategories={railCategories}
      activeCategoryName={instant.activeCategoryName}
      appliedSearchParams={instant.appliedSearchParams}
      onApplyFilters={handleApplyFilters}
      products={instant.feed.products}
      hasMore={instant.feed.hasMore}
      isLoading={instant.isLoading}
      activeSlug={instant.activeSlug}
      onLoadMore={instant.loadMore}
    />
  )
}

export type { MobileCategoryBrowserContextualProps }
