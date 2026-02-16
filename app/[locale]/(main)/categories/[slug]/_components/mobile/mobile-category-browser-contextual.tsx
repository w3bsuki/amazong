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
import {
  getCategoryAttributeKey,
  getCategoryAttributeLabel,
  getCategoryAttributeOptions,
} from "@/lib/filters/category-attribute"
import { CategoryPillRail, useCategoryDrawerOptional } from "@/components/mobile/category-nav"
import { ProductFeed } from "./product-feed"
import { PageShell } from "../../../../../_components/page-shell"
import {
  MobileFilterControls,
  type QuickAttributePill,
} from "../../../../_components/filters/mobile-filter-controls"
import { getFilterPillsForCategory } from "../../_lib/filter-priority"

type Category = CategoryTreeNode
const MOBILE_FEED_FRAME_CLASS = "mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe"
const MAX_QUICK_ATTRIBUTE_PILLS = 5

function stripAttributeFilters(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params.toString())
  for (const key of next.keys()) {
    if (key.startsWith("attr_")) next.delete(key)
  }
  return next
}

function buildCategoryHref(categorySlug: string, params: URLSearchParams): string {
  const query = params.toString()
  return query ? `/categories/${categorySlug}?${query}` : `/categories/${categorySlug}`
}

function buildQuickAttributePills(options: {
  locale: string
  categorySlug: string
  attributes: CategoryAttribute[]
  appliedSearchParams: URLSearchParams
}): QuickAttributePill[] {
  const { locale, categorySlug, attributes, appliedSearchParams } = options
  if (attributes.length === 0) return []

  const withOptions = attributes.filter((attr) => {
    const attrOptions = getCategoryAttributeOptions(attr, locale)
    return (
      attr.is_filterable &&
      (attr.attribute_type === "select" || attr.attribute_type === "multiselect") &&
      Array.isArray(attrOptions) &&
      attrOptions.length > 0
    )
  })
  if (withOptions.length === 0) return []

  const priorityKeys = getFilterPillsForCategory(categorySlug, withOptions).filter(
    (key) => key !== "price" && key !== "category"
  )

  const ordered: CategoryAttribute[] = []
  const used = new Set<string>()

  for (const priorityKey of priorityKeys) {
    const match = withOptions.find((attr) => getCategoryAttributeKey(attr) === priorityKey)
    if (!match) continue
    used.add(match.id)
    ordered.push(match)
  }

  for (const attr of withOptions) {
    if (used.has(attr.id)) continue
    ordered.push(attr)
  }

  return ordered.slice(0, MAX_QUICK_ATTRIBUTE_PILLS).map((attr) => {
    const attrKey = getCategoryAttributeKey(attr)
    const selectedCount = appliedSearchParams.getAll(`attr_${attrKey}`).filter(Boolean).length
    return {
      sectionId: `attr_${attr.id}`,
      label: getCategoryAttributeLabel(attr, locale),
      active: selectedCount > 0,
      ...(selectedCount > 0 ? { selectedCount } : {}),
    }
  })
}

interface MobileCategoryBrowserContextualProps {
  locale: string
  initialProducts: UIProduct[]
  /** Which category slug the initialProducts are for. Defaults to "all" for homepage. */
  initialProductsSlug: string
  /**
   * Current category name for contextual header (localized).
   * Required when contextualMode is true.
   */
  contextualCategoryName?: string
  /**
   * Back navigation href for contextual header.
   * Defaults to parent category or /categories.
   */
  contextualBackHref?: string
  /**
   * Child categories to display in the scope rail.
   */
  contextualSubcategories: Category[]
  /**
   * Sibling categories used when the current category has no children.
   */
  contextualSiblingCategories?: Category[]
  /** Filterable attributes for the current category (for filter drawer) */
  filterableAttributes: CategoryAttribute[]
  /** Current category ID for filter context. */
  categoryId?: string
  /**
   * Parent category of the current category.
   * Used to determine if we're on L0 (null), L1 (parent is L0), or deeper.
   */
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
  const { setContextualHeader } = useHeader()
  const categoryDrawer = useCategoryDrawerOptional()

  const contextualInitialTitle = contextualCategoryName || ""

  // Convert CategoryTreeNode[] to CategoryLite[] for the hook
  const initialChildrenForHook = contextualSubcategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    name_bg: cat.name_bg,
    slug: cat.slug,
    parent_id: cat.parent_id ?? null,
    icon: cat.icon ?? null,
    image_url: cat.image_url ?? null,
  }))

  const initialSiblingsForHook = contextualSiblingCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    name_bg: cat.name_bg,
    slug: cat.slug,
    parent_id: cat.parent_id ?? null,
    icon: cat.icon ?? null,
    image_url: cat.image_url ?? null,
  }))

  // Route-level parent is stable while instant browsing updates transient context.
  const routeParentContext = useMemo(
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
  const currentScopeParent = instant.parent ?? routeParentContext
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
    () => (instant.children.length > 0 ? instant.children : instant.siblings),
    [instant.children, instant.siblings]
  )

  const scopeLabel = currentScopeParentName ?? instant.activeCategoryName ?? contextualInitialTitle
  const scopedDrawerCategory = useMemo<CategoryTreeNode | null>(() => {
    const childNodes: CategoryTreeNode[] = railCategories.map((child) => ({
      id: child.id,
      slug: child.slug,
      name: child.name,
      name_bg: child.name_bg ?? null,
      parent_id: child.parent_id ?? null,
      ...(child.icon ? { icon: child.icon } : {}),
      ...(child.image_url ? { image_url: child.image_url } : {}),
      children: [],
    }))

    if (currentScopeParent) {
      return {
        id: currentScopeParent.id,
        slug: currentScopeParent.slug,
        name: currentScopeParent.name,
        name_bg: currentScopeParent.name_bg ?? null,
        parent_id: currentScopeParent.parent_id ?? null,
        children: childNodes,
      }
    }

    if (!instant.categoryId || instant.categorySlug === "all") {
      return null
    }

    return {
      id: instant.categoryId,
      slug: instant.categorySlug,
      name: instant.activeCategoryName || contextualInitialTitle || instant.categorySlug,
      name_bg: null,
      parent_id: null,
      children: childNodes,
    }
  }, [
    contextualInitialTitle,
    currentScopeParent,
    instant.activeCategoryName,
    instant.categoryId,
    instant.categorySlug,
    railCategories,
  ])

  const categoryScopeItems = (() => {
    const items: {
      id: string
      label: string
      href: string
      active: boolean
      onSelect: () => void
    }[] = []
    const scopeSlug = currentScopeParent?.slug ?? instant.categorySlug
    const allLabel = tCategories("allIn", { category: scopeLabel })

    items.push({
      id: `scope-${scopeSlug}`,
      label: allLabel,
      href: buildCategoryHref(scopeSlug, railBaseParams),
      active: instant.categorySlug === scopeSlug,
      onSelect: () => {
        void instant.setCategorySlug(scopeSlug, { clearAttrFilters: true })
      },
    })

    for (const cat of railCategories) {
      const label = tCategories("shortName", {
        slug: getCategorySlugKey(cat.slug),
        name: getCategoryName(cat, locale),
      })
      items.push({
        id: cat.id,
        label,
        href: buildCategoryHref(cat.slug, railBaseParams),
        active: instant.categorySlug === cat.slug,
        onSelect: () => {
          void instant.setCategorySlug(cat.slug, { clearAttrFilters: true })
        },
      })
    }

    return items
  })()

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
    // finalPath is ignored in instant mode; URL sync is handled by the hook.
    const params = new URLSearchParams(next.queryString)
    await instant.setFilters(params)
  }

  // Remove a single filter (for FilterChips in instant mode)
  const handleRemoveFilter = async (key: string, key2?: string) => {
    const params = new URLSearchParams(instant.appliedSearchParams?.toString() ?? "")
    params.delete(key)
    if (key2) params.delete(key2)
    await instant.setFilters(params)
  }

  // Clear all filters
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

  // Provide contextual header state to layout via context
  useEffect(() => {
    setContextualHeader({
      title: instant.categoryTitle || contextualInitialTitle,
      backHref,
      onBack: handleBack,
      activeSlug: instant.activeSlug,
    })
  }, [
    backHref,
    contextualInitialTitle,
    handleBack,
    instant.activeSlug,
    instant.categoryTitle,
    setContextualHeader,
  ])

  useEffect(() => {
    return () => setContextualHeader(null)
  }, [setContextualHeader])

  return (
    <PageShell variant="muted" className="w-full">
      {/* Header is rendered by layout with variant="contextual" */}
      <div className={MOBILE_FEED_FRAME_CLASS}>
        <CategoryPillRail
          items={categoryScopeItems}
          ariaLabel={tCategories("navigationAriaLabel")}
          stickyTop="var(--offset-mobile-primary-rail)"
          sticky={true}
          moreLabel={tCategories("showMore")}
          {...(categoryDrawer ? { onMoreClick: handleScopeMoreClick } : {})}
          testId="mobile-category-scope-rail"
        />

        <MobileFilterControls
          locale={locale}
          attributes={effectiveAttributes}
          {...(instant.categorySlug !== "all" ? { categorySlug: instant.categorySlug } : {})}
          {...(instant.categoryId ? { categoryId: instant.categoryId } : {})}
          subcategories={railCategories.map((child) => ({
            id: child.id,
            name: child.name,
            name_bg: child.name_bg,
            slug: child.slug,
          }))}
          {...(instant.activeCategoryName ? { categoryName: instant.activeCategoryName } : {})}
          basePath={`/categories/${instant.categorySlug}`}
          appliedSearchParams={instant.appliedSearchParams}
          quickAttributePills={quickAttributePills}
          onApply={handleApplyFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
          stickyTop="calc(var(--offset-mobile-primary-rail) + var(--control-compact) + var(--spacing-mobile-rail-gap))"
          sticky={true}
          className="z-20"
        />

        {/* Product Feed */}
        <ProductFeed
          products={instant.feed.products}
          hasMore={instant.feed.hasMore}
          isLoading={instant.isLoading}
          activeSlug={instant.activeSlug}
          locale={locale}
          isAllTab={false}
          activeCategoryName={instant.activeCategoryName}
          onLoadMore={instant.loadMore}
          showLoadingOverlay={true}
        />
      </div>
    </PageShell>
  )
}

export type { MobileCategoryBrowserContextualProps }
