"use client"

import { useLocale } from "next-intl"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryAttribute } from "@/lib/data/categories"
import { MobileCategoryBrowserContextual } from "./mobile-category-browser-contextual"
import { MobileCategoryBrowserTraditional } from "./mobile-category-browser-traditional"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

interface MobileCategoryBrowserProps {
  initialProducts: UIProduct[]
  /** Which category slug the initialProducts are for. Defaults to "all" for homepage. */
  initialProductsSlug?: string
  /** Show the homepage-only "View all" link strip (defaults to true). */
  showViewAllLink?: boolean
  /** Categories with children from server (L0→L1→L2 pre-loaded, L3 lazy) */
  initialCategories?: Category[]
  defaultTab?: string | null
  defaultSubTab?: string | null
  defaultL2?: string | null
  defaultL3?: string | null
  showBanner?: boolean
  pageTitle?: string | null
  /** Hide the L0 sticky tab header (useful when a parent layout already provides tabs). */
  showL0Tabs?: boolean
  /** L0 navigation style: "tabs" (default underline tabs) or "pills" (compact quick pills) */
  l0Style?: "tabs" | "pills"
  /** Show the eBay-style quick filter row (All filters / Sort / priority pills). */
  showQuickFilters?: boolean
  /** Show inline filter/sort bar (demo-style 50/50 split). Cleaner than quickFilters. */
  showInlineFilters?: boolean
  /** Show deep L3 pills row (defaults to true). Category pages may disable this to reduce stacked controls. */
  showL3Pills?: boolean
  /**
   * When true, clicking L0 tabs navigates to a category page URL
   * (e.g. `/categories/{slug}`) instead of updating query params.
   */
  tabsNavigateToPages?: boolean
  /**
   * When true, clicking L1/L2 circles navigates to a category page URL
   * (e.g. `/categories/{slug}`) instead of drilling down within tabs.
   */
  circlesNavigateToPages?: boolean
  /** Locale from server - avoids useLocale() hydration issues */
  locale?: string
  /** Filterable attributes for the current category (for filter drawer) */
  filterableAttributes?: CategoryAttribute[]

  // ==========================================================================
  // Phase 2: Contextual Mode (Vinted-style category browsing)
  // ==========================================================================

  /**
   * When true, use contextual header + subcategory pills + inline filter bar
   * instead of the traditional tabs + circles layout.
   *
   * Automatically enabled for `/categories/[slug]` routes.
   * Saves ~60px of nav chrome height for more products above fold.
   */
  contextualMode?: boolean
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
   * Subcategories to display as horizontal pills in contextual mode.
   * Replaces circles for compact navigation.
   */
  contextualSubcategories?: Category[]
  /**
   * Current category ID for filter context.
   */
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

// =============================================================================
// Main Component
// =============================================================================

export function MobileCategoryBrowser({
  initialProducts,
  initialProductsSlug = "all",
  showViewAllLink = true,
  initialCategories = [],
  defaultTab = null,
  defaultSubTab = null,
  defaultL2 = null,
  defaultL3 = null,
  showBanner = true,
  pageTitle = null,
  showL0Tabs = true,
  l0Style = "tabs",
  showQuickFilters = false,
  showInlineFilters = false,
  showL3Pills = true,
  tabsNavigateToPages = false,
  circlesNavigateToPages = false,
  locale: localeProp,
  filterableAttributes = [],
  // Phase 2: Contextual mode props
  contextualMode = false,
  contextualCategoryName,
  contextualBackHref,
  contextualSubcategories = [],
  categoryId,
  parentCategory,
}: MobileCategoryBrowserProps) {
  const intlLocale = useLocale()
  const locale = localeProp || intlLocale

  if (contextualMode) {
    return (
      <MobileCategoryBrowserContextual
        locale={locale}
        initialProducts={initialProducts}
        initialProductsSlug={initialProductsSlug}
        contextualCategoryName={contextualCategoryName ?? ""}
        {...(contextualBackHref ? { contextualBackHref } : {})}
        contextualSubcategories={contextualSubcategories}
        filterableAttributes={filterableAttributes}
        {...(categoryId ? { categoryId } : {})}
        parentCategory={parentCategory ?? null}
      />
    )
  }

  return (
    <MobileCategoryBrowserTraditional
      locale={locale}
      initialProducts={initialProducts}
      initialProductsSlug={initialProductsSlug}
      showViewAllLink={showViewAllLink}
      initialCategories={initialCategories}
      defaultTab={defaultTab}
      defaultSubTab={defaultSubTab}
      defaultL2={defaultL2}
      defaultL3={defaultL3}
      showBanner={showBanner}
      pageTitle={pageTitle}
      showL0Tabs={showL0Tabs}
      l0Style={l0Style}
      showQuickFilters={showQuickFilters}
      showInlineFilters={showInlineFilters}
      tabsNavigateToPages={tabsNavigateToPages}
      circlesNavigateToPages={circlesNavigateToPages}
      filterableAttributes={filterableAttributes}
    />
  )
}
