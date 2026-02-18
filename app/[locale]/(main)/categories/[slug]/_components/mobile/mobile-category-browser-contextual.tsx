"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryAttribute } from "@/lib/data/categories"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useHeader } from "@/components/providers/header-context"
import { useInstantCategoryBrowse } from "@/hooks/use-instant-category-browse"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav"
import { MobileCategoryBrowserContextualView } from "./mobile-category-browser-contextual-view"
import {
  buildCategoryScopeItems,
  buildQuickAttributePills,
  buildScopedDrawerCategory,
  stripAttributeFilters,
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

  const fallbackParentHref = routeParentContext?.slug ? `/categories/${routeParentContext.slug}` : null
  const backHref = contextualBackHref || fallbackParentHref || `/categories`
  const categoryNavigationRef = useRef({
    parentSlug: instant.parent?.slug ?? null,
    fallbackParentHref,
    backHref,
    setCategorySlug: instant.setCategorySlug,
  })

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
  const currentScopeParentName = currentScopeParent
    ? tCategories("shortName", {
        slug: getCategorySlugKey(currentScopeParent.slug),
        name: getCategoryName(currentScopeParent, locale),
      })
    : null

  const railBaseParams = useMemo(
    () => stripAttributeFilters(new URLSearchParams(instant.appliedSearchParams?.toString() ?? "")),
    [instant.appliedSearchParams]
  )

  const railCategories = useMemo(
    () => (instant.children.length > 0 ? instant.children : instant.siblings) as ScopeCategory[],
    [instant.children, instant.siblings]
  )

  const scopeLabel = currentScopeParentName ?? instant.activeCategoryName ?? contextualInitialTitle
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

  const categoryScopeItems = buildCategoryScopeItems({
    locale,
    railCategories,
    currentScopeParent,
    currentCategorySlug: instant.categorySlug,
    scopeLabel,
    railBaseParams,
    tCategories,
    onSelectCategory: (slug) => {
      void instant.setCategorySlug(slug, { clearAttrFilters: true })
    },
  })

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

  useEffect(() => {
    categoryNavigationRef.current = {
      parentSlug: instant.parent?.slug ?? null,
      fallbackParentHref,
      backHref,
      setCategorySlug: instant.setCategorySlug,
    }
  }, [backHref, fallbackParentHref, instant.parent?.slug, instant.setCategorySlug])

  const handleBack = useCallback(async () => {
    const navigation = categoryNavigationRef.current
    if (navigation.parentSlug) {
      await navigation.setCategorySlug(navigation.parentSlug, { clearAttrFilters: true })
      return
    }
    if (navigation.fallbackParentHref) {
      router.push(navigation.fallbackParentHref)
      return
    }
    router.push(navigation.backHref)
  }, [router])

  const handleScopeMoreClick = useCallback(() => {
    if (!categoryDrawer) return
    if (scopedDrawerCategory) {
      categoryDrawer.openCategory(scopedDrawerCategory)
      return
    }
    categoryDrawer.openRoot()
  }, [categoryDrawer, scopedDrawerCategory])

  useEffect(() => {
    setHeaderState({
      type: "contextual",
      value: {
        title: instant.categoryTitle || contextualInitialTitle,
        backHref,
        onBack: handleBack,
        activeSlug: instant.activeSlug,
      },
    })
  }, [
    backHref,
    contextualInitialTitle,
    handleBack,
    instant.activeSlug,
    instant.categoryTitle,
    setHeaderState,
  ])

  useEffect(() => {
    return () => setHeaderState(null)
  }, [setHeaderState])

  return (
    <MobileCategoryBrowserContextualView
      locale={locale}
      categoryScopeItems={categoryScopeItems}
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
