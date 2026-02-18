"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
import type { DrilldownSegment, DrilldownOption } from "@/components/mobile/category-nav/category-drilldown-rail"
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

  const railCategories = useMemo(
    () => (instant.children.length > 0 ? instant.children : instant.siblings) as ScopeCategory[],
    [instant.children, instant.siblings]
  )

  // ---------------------------------------------------------------------------
  // Drilldown state — compound breadcrumb pill
  // ---------------------------------------------------------------------------
  const [drilldownPath, setDrilldownPath] = useState<DrilldownSegment[]>([])
  const drilldownPathRef = useRef(drilldownPath)

  useEffect(() => {
    drilldownPathRef.current = drilldownPath
  }, [drilldownPath])

  // Reset drilldown when route slug changes (full page navigation)
  useEffect(() => {
    setDrilldownPath([])
  }, [initialProductsSlug])

  // Sync drilldown path on browser back/forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const match = path.match(/\/categories\/([^/?]+)/)
      const urlSlug = match?.[1] ? decodeURIComponent(match[1]) : null

      if (!urlSlug) return

      // Find the slug in the current drilldown path
      const currentPath = drilldownPathRef.current
      const idx = currentPath.findIndex((seg) => seg.slug === urlSlug)

      if (idx >= 0) {
        // User went back to a previous drilldown level — trim to that point
        setDrilldownPath(currentPath.slice(0, idx + 1))
      } else if (urlSlug === initialProductsSlug) {
        // User went all the way back to the root route
        setDrilldownPath([])
      }
      // Otherwise the URL is for a category not in the drilldown path — leave as-is
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [initialProductsSlug])

  const drilldownOptions: DrilldownOption[] = useMemo(
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

  const drilldownAllLabel = tCategories("all")

  const handleDrillDown = useCallback(
    (slug: string, label: string) => {
      setDrilldownPath((prev) => [...prev, { slug, label }])
      void instant.setCategorySlug(slug, { clearAttrFilters: true })
    },
    [instant]
  )

  const handleDrillBack = useCallback(() => {
    const currentPath = drilldownPathRef.current
    const newPath = currentPath.slice(0, -1)
    setDrilldownPath(newPath)

    if (newPath.length > 0) {
      const target = newPath[newPath.length - 1]
      if (target) {
        void instant.setCategorySlug(target.slug, {
          clearAttrFilters: true,
        })
      }
    } else {
      void instant.setCategorySlug(initialProductsSlug, {
        clearAttrFilters: true,
      })
    }
  }, [initialProductsSlug, instant])

  const handleSegmentTap = useCallback(
    (index: number) => {
      const currentPath = drilldownPathRef.current
      const newPath = currentPath.slice(0, index + 1)
      setDrilldownPath(newPath)

      const target = newPath[newPath.length - 1]
      if (target) {
        void instant.setCategorySlug(target.slug, { clearAttrFilters: true })
      } else {
        void instant.setCategorySlug(initialProductsSlug, { clearAttrFilters: true })
      }
    },
    [initialProductsSlug, instant]
  )

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
      drilldownPath={drilldownPath}
      drilldownOptions={drilldownOptions}
      drilldownAllLabel={drilldownAllLabel}
      onDrillDown={handleDrillDown}
      onDrillBack={handleDrillBack}
      onSegmentTap={handleSegmentTap}
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
