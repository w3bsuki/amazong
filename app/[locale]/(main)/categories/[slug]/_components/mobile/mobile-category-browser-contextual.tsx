"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryAttribute } from "@/lib/data/categories"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useHeader } from "@/components/providers/header-context"
import { useInstantCategoryBrowse } from "./use-instant-category-browse"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav/category-drawer-context"
import { MobileCategoryBrowserContextualView } from "./mobile-category-browser-contextual-view"
import type { CategoryOptionItem, SectionPathSegment } from "@/components/mobile/category-nav/category-drilldown-rail"
import {
  buildQuickAttributePills,
  buildScopedDrawerCategory,
  toScopedCategoryList,
  type ScopeCategory,
} from "./mobile-category-browser-contextual-utils"

type Category = CategoryTreeNode

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
  const router = useRouter()
  const { setHeaderState } = useHeader()
  const categoryDrawer = useCategoryDrawerOptional()

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

  const fallbackParentHref = routeParentContext?.slug ? `/categories/${routeParentContext.slug}` : null
  const backHref = contextualBackHref || fallbackParentHref || `/categories`

  const effectiveAttributes = instant.attributes.length ? instant.attributes : filterableAttributes
  const currentScopeParent = useMemo<ScopeCategory | null>(() => {
    const parent = instant.parent ?? routeParentContext
    if (!parent) return null
    return {
      id: parent.id,
      slug: parent.slug,
      parent_id: parent.parent_id ?? null,
      name: parent.name ?? parent.slug,
      name_bg: parent.name_bg ?? null,
      icon: parent.icon ?? null,
      image_url: parent.image_url ?? null,
    }
  }, [instant.parent, routeParentContext])

  const railCategories = useMemo(
    () => (instant.children.length > 0 ? instant.children : instant.siblings) as ScopeCategory[],
    [instant.children, instant.siblings]
  )

  // ---------------------------------------------------------------------------
  // Flat option rail — no breadcrumb, just forward choices
  // ---------------------------------------------------------------------------
  const isLeafNode = instant.children.length === 0
  const currentCategoryLabel = instant.activeCategoryName ?? contextualInitialTitle

  // At leaf: show current as active pill among siblings. At non-leaf: show "All" as active.
  const railActiveLabel = isLeafNode
    ? currentCategoryLabel
    : tCategories("all")

  const railOptions: CategoryOptionItem[] = useMemo(
    () =>
      railCategories
        .filter((cat) => cat.slug !== instant.categorySlug)
        .map((cat) => ({
          id: cat.id,
          label: tCategories("shortName", {
            slug: getCategorySlugKey(cat.slug),
            name: getCategoryName(cat, locale),
          }),
          slug: cat.slug,
        })),
    [railCategories, tCategories, locale, instant.categorySlug]
  )

  const handleOptionSelect = useCallback(
    (slug: string) => {
      const option = railOptions.find(o => o.slug === slug)
      if (option) {
        setSectionPath(prev => {
          const isDrillingDeeper = instant.children.length > 0
          if (isDrillingDeeper || prev.length === 0) {
            return [...prev, { slug, label: option.label }]
          }
          // Switching to sibling — replace last entry
          return [...prev.slice(0, -1), { slug, label: option.label }]
        })
      }
      void instant.setCategorySlug(slug, { clearAttrFilters: true })
    },
    [instant, railOptions]
  )

  const handleSectionBack = useCallback(() => {
    if (sectionPath.length === 0) return
    const next = sectionPath.slice(0, -1)
    setSectionPath(next)
    const targetSlug = next[next.length - 1]?.slug ?? initialProductsSlug
    void instant.setCategorySlug(targetSlug, { clearAttrFilters: true })
  }, [instant, initialProductsSlug, sectionPath])

  const scopedDrawerCategory = useMemo(
    () =>
      buildScopedDrawerCategory({
        currentScopeParent,
        railCategories,
        categoryId: instant.categoryId ?? null,
        categorySlug: instant.categorySlug,
        activeCategoryName: instant.activeCategoryName ?? null,
        contextualInitialTitle,
      }),
    [
      contextualInitialTitle,
      currentScopeParent,
      instant.activeCategoryName,
      instant.categoryId,
      instant.categorySlug,
      railCategories,
    ]
  )

  const quickAttributePills = useMemo(
    () =>
      buildQuickAttributePills({
        locale,
        categorySlug: instant.categorySlug,
        attributes: effectiveAttributes,
        appliedSearchParams: new URLSearchParams(instant.appliedSearchParams?.toString() ?? ""),
      }),
    [effectiveAttributes, instant.appliedSearchParams, instant.categorySlug, locale]
  )

  const handleApplyFilters = async (next: { queryString: string; finalPath: string }) => {
    const params = new URLSearchParams(next.queryString)
    await instant.setFilters(params)
  }

  const handleRemoveFilter = async (key: string, key2?: string) => {
    const params = new URLSearchParams(instant.appliedSearchParams?.toString() ?? "")
    params.delete(key)
    if (key2) params.delete(key2)
    await instant.setFilters(params)
  }

  const handleClearAllFilters = async () => {
    await instant.setFilters(new URLSearchParams())
  }

  const handleBack = useCallback(() => {
    router.push(backHref)
  }, [router, backHref])

  const handleScopeMoreClick = useCallback(() => {
    if (!categoryDrawer) return
    if (scopedDrawerCategory) {
      categoryDrawer.openCategory(scopedDrawerCategory)
      return
    }
    categoryDrawer.openRoot()
  }, [categoryDrawer, scopedDrawerCategory])

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

  return (
    <MobileCategoryBrowserContextualView
      locale={locale}
      railActiveLabel={railActiveLabel}
      railOptions={railOptions}
      onOptionSelect={handleOptionSelect}
      sectionPath={sectionPath}
      onSectionBack={handleSectionBack}
      canOpenScopeDrawer={Boolean(categoryDrawer)}
      onScopeMoreClick={handleScopeMoreClick}
      navigationAriaLabel={tCategories("navigationAriaLabel")}
      showMoreLabel={tCategories("showMore")}
      attributes={effectiveAttributes}
      categorySlug={instant.categorySlug}
      categoryId={instant.categoryId ?? null}
      railCategories={railCategories}
      activeCategoryName={instant.activeCategoryName}
      appliedSearchParams={instant.appliedSearchParams}
      quickAttributePills={quickAttributePills}
      onApplyFilters={handleApplyFilters}
      onRemoveFilter={handleRemoveFilter}
      onClearAllFilters={handleClearAllFilters}
      products={instant.feed.products}
      hasMore={instant.feed.hasMore}
      isLoading={instant.isLoading}
      activeSlug={instant.activeSlug}
      onLoadMore={instant.loadMore}
    />
  )
}

export type { MobileCategoryBrowserContextualProps }
