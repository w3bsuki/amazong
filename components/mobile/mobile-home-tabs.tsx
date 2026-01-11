"use client"

import { useEffect, useLayoutEffect, useState, useCallback } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import type { UIProduct } from "@/lib/data/products"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { CaretRight } from "@phosphor-icons/react"

// Import extracted components
import { useCategoryNavigation } from "@/hooks/use-category-navigation"
import { useInstantCategoryBrowse } from "@/hooks/use-instant-category-browse"
import {
  CategoryTabs,
  CategoryQuickPills,
  CategoryCircles,
  CategoryL3Pills,
  AllTabFilters,
  QuickFilterRow,
  // Phase 2: Contextual navigation components (Vinted-style)
  ContextualCategoryHeader,
  SubcategoryPills,
  InlineFilterBar,
  // Phase 3: Treido-mock Smart Anchor Navigation
  SmartAnchorNav,
} from "./category-nav"
import { ContextualDoubleDeckerNav } from "./category-nav/contextual-double-decker-nav"
import { ProductFeed } from "@/components/shared/product/product-feed"
import { FilterHub } from "@/components/shared/filters/filter-hub"
import { FilterChips } from "@/components/shared/filters/filter-chips"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

interface MobileHomeTabsProps {
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
  filterableAttributes?: Array<{
    id: string
    category_id: string | null
    name: string
    name_bg: string | null
    attribute_type: "select" | "multiselect" | "boolean" | "number" | "text"
    options: string[] | null
    options_bg: string[] | null
    placeholder?: string | null
    placeholder_bg?: string | null
    is_filterable: boolean | null
    is_required: boolean | null
    sort_order: number | null
    validation_rules?: unknown | null
  }>

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

export function MobileHomeTabs({
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
}: MobileHomeTabsProps) {
  const intlLocale = useLocale()
  const locale = localeProp || intlLocale
  const router = useRouter()
  const [headerHeight, setHeaderHeight] = useState(0)

  // Filter state for "All" tab
  const [activeAllFilter, setActiveAllFilter] = useState<string>("newest")

  // Contextual mode state
  const [filterHubOpen, setFilterHubOpen] = useState(false)

  // Use the extracted navigation hook
  const nav = useCategoryNavigation({
    initialCategories,
    defaultTab,
    defaultSubTab,
    defaultL2,
    defaultL3,
    tabsNavigateToPages,
    l0Style,
    initialProducts,
    initialProductsSlug,
    locale,
    activeAllFilter,
  })

  // Measure header height for sticky positioning (before paint to avoid overlap/jank)
  useLayoutEffect(() => {
    // Be precise: multiple components may render <header> tags.
    // The site header marks itself as hydrated, so prefer that.
    const header =
      document.querySelector('header[data-hydrated="true"]') ||
      document.querySelector("header")

    const update = () => {
      if (!(header instanceof HTMLElement)) {
        setHeaderHeight(0)
        return
      }

      // The site header is typically `position: sticky` and already occupies space
      // in normal document flow. Applying its height as a sticky `top` offset would
      // make our own sticky bars become "stuck" immediately and visually slide down.
      const headerPosition = getComputedStyle(header).position
      setHeaderHeight(
        headerPosition === "fixed" || headerPosition === "sticky"
          ? header.offsetHeight
          : 0
      )
    }

    update()

    // Header height can change after hydration (auth, country, subheader, etc.).
    // ResizeObserver keeps sticky offsets stable.
    const ro =
      header && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => update())
        : null

    if (ro && header) ro.observe(header)

    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
      ro?.disconnect()
    }
  }, [])

  // Handle All tab filter click
  const handleAllFilterClick = useCallback(
    (id: string) => {
      setActiveAllFilter(id)
      nav.setTabData((prev) => ({
        ...prev,
        all: { products: [], page: 0, hasMore: true },
      }))
    },
    [nav]
  )

  const contextualInitialTitle = contextualCategoryName || ""

  // ==========================================================================
  // Contextual Mode Rendering (Vinted-style)
  // ==========================================================================

  // Hide main site header on mobile when contextual mode is active
  useEffect(() => {
    if (!contextualMode) return

    // Find the main site header (it's the first header in body, before main)
    const siteHeader = document.querySelector('body > div > header')
    if (!(siteHeader instanceof HTMLElement)) return

    // Hide on mobile AND desktop (since we are matching mobile-only design)
    siteHeader.style.display = 'none'

    return () => {
      siteHeader.style.display = ''
    }
  }, [contextualMode])

  if (contextualMode) {
    const backHref = contextualBackHref || `/categories`

    const instant = useInstantCategoryBrowse({
      enabled: true,
      locale,
      initialSlug: initialProductsSlug,
      initialTitle: contextualInitialTitle,
      initialCategoryId: categoryId,
      initialParent: parentCategory
        ? {
          id: parentCategory.id,
          slug: parentCategory.slug,
          parent_id: parentCategory.parent_id,
          name: parentCategory.name ?? parentCategory.slug,
          name_bg: parentCategory.name_bg ?? null,
        }
        : null,
      initialChildren: (contextualSubcategories as any) ?? [],
      initialAttributes: filterableAttributes as any,
      initialProducts,
    })

    const handleBack = async () => {
      // Use instant client-side navigation (no page reload)
      if (instant.parent?.slug) {
        await instant.setCategorySlug(instant.parent.slug, { clearAttrFilters: true })
        return
      }
      // Only use router.push for going back to /categories index (no parent)
      router.push(backHref)
    }

    // Use instant client-side navigation for circle clicks
    const handleCircleClick = async (cat: any) => {
      if (cat?.slug) {
        await instant.setCategorySlug(cat.slug, { clearAttrFilters: true })
      }
    }

    const handleApplyFilters = async (next: { queryString: string; finalPath: string }) => {
      // finalPath is ignored in instant mode; URL sync is handled by the hook.
      const params = new URLSearchParams(next.queryString)
      await instant.setFilters(params)
    }

    return (
      <div className="w-full min-h-screen bg-background">
        {/*
          Treido pattern: One sticky “control stack” (header + nav + filters).
          Avoid multiple nested sticky bars with brittle `top` offsets.
        */}
        <div className="sticky top-0 z-50 bg-background">
          {/* 1) Contextual Category Header (48px) */}
          <ContextualCategoryHeader
            title={instant.categoryTitle || contextualInitialTitle}
            backHref={backHref}
            onBack={handleBack}
            locale={locale}
            showSearch={true}
            sticky={true}
            className="z-50"
          />

        </div>

        {/* 2) Subcategory Circles (Contextual Mode) - Scrolls away */}
        {/* Uses Link navigation for SEO + proper loading.tsx states */}
        {contextualSubcategories.length > 0 && (
          <div className="bg-background border-b border-border/50">
            <CategoryCircles
              circles={(instant.children as any) ?? contextualSubcategories}
              activeL1={null}
              activeL2={null}
              activeL2Category={null}
              activeCategoryName={instant.categoryTitle || contextualInitialTitle}
              showL2Circles={false}
              isDrilledDown={false}
              l3Categories={[]}
              selectedPill={null}
              isL3Loading={false}
              locale={locale}
              circlesNavigateToPages={false}
              activeTab="categories"
              hideBackButton={true}
              className=""
              onCircleClick={handleCircleClick}
              onBack={() => { }}
              onPillClick={() => { }}
              onAllPillClick={() => { }}
            />
          </div>
        )}

        {/* 3) Inline Filter Bar (scrolls away like Treido reference) */}
        <InlineFilterBar
          locale={locale}
          onAllFiltersClick={() => setFilterHubOpen(true)}
          attributes={(instant.attributes as any) ?? filterableAttributes}
          appliedSearchParams={instant.appliedSearchParams}
          onApply={handleApplyFilters}
          stickyTop={48}
          sticky={true}
          className="z-30"
        />

        {/* 4. Product Feed */}
        <ProductFeed
          products={instant.feed.products}
          hasMore={instant.feed.hasMore}
          isLoading={instant.isLoading}
          activeSlug={instant.activeSlug}
          locale={locale}
          isAllTab={false}
          activeCategoryName={instant.activeCategoryName}
          onLoadMore={instant.loadMore}
        />

        {/* FilterHub Drawer (fallback for complex filters) */}
        <FilterHub
          open={filterHubOpen}
          onOpenChange={setFilterHubOpen}
          locale={locale}
          {...(instant.categorySlug !== "all" ? { categorySlug: instant.categorySlug } : {})}
          {...(instant.categoryId ? { categoryId: instant.categoryId } : {})}
          attributes={(instant.attributes as any) ?? filterableAttributes}
          appliedSearchParams={instant.appliedSearchParams}
          onApply={handleApplyFilters}
          mode="full"
          initialSection={null}
        />
      </div>
    )
  }

  // ==========================================================================
  // Traditional Mode Rendering (Tabs + Circles)
  // ==========================================================================

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 1. Sticky Tabs Header (L0) - Two variants: tabs or pills */}
      {showL0Tabs && l0Style === "tabs" && (
        <CategoryTabs
          categories={initialCategories}
          activeTab={nav.activeTab}
          locale={locale}
          headerHeight={headerHeight}
          tabsNavigateToPages={tabsNavigateToPages}
          onTabChange={nav.handleTabChange}
        />
      )}

      {showL0Tabs && l0Style === "pills" && (
        <CategoryQuickPills
          categories={initialCategories}
          activeTab={nav.activeTab}
          locale={locale}
          headerHeight={headerHeight}
          tabsNavigateToPages={tabsNavigateToPages}
          onTabChange={nav.handleTabChange}
        />
      )}

      {/* 2. Seller Banner (All tab only) */}
      {showBanner && nav.isAllTab && (
        <div className="mt-2">
          <StartSellingBanner locale={locale} variant="full-bleed" />
        </div>
      )}

      {/* Optional Page Title (for category pages) */}
      {pageTitle && (
        <div className="bg-background px-(--page-inset) py-3 border-b border-border/40">
          <h1 className="text-lg font-bold">{pageTitle}</h1>
        </div>
      )}

      {/* 3. Subcategory Circles (L1 or L2) OR "All" Tab Quick Filters */}
      {/* Treido pattern: In drilled-down state, circles hide and morphed back pill + L3 pills appear */}
      <div
        className={cn(
          "bg-background",
          !nav.isDrilledDown && "pt-2 pb-1"
        )}
      >
        {nav.isAllTab ? (
          <AllTabFilters
            activeFilter={activeAllFilter}
            locale={locale}
            onFilterClick={handleAllFilterClick}
          />
        ) : (
          <CategoryCircles
            circles={nav.circlesToDisplay}
            activeL1={nav.activeL1}
            activeL2={nav.activeL2}
            activeL2Category={nav.currentL2 ?? null}
            activeCategoryName={nav.activeCategoryName}
            showL2Circles={nav.showL2Circles}
            isDrilledDown={nav.isDrilledDown}
            l3Categories={nav.l3Categories}
            selectedPill={nav.selectedPill}
            isL3Loading={nav.isL3Loading}
            locale={locale}
            circlesNavigateToPages={circlesNavigateToPages}
            activeTab={nav.activeTab}
            onCircleClick={nav.handleCircleClick}
            onBack={nav.handleBack}
            onPillClick={nav.handlePillClick}
            onAllPillClick={() => nav.setSelectedPill(null)}
          />
        )}
      </div>

      {/* 4. Deep Navigation Pills (L3) - REMOVED: Now integrated into CategoryCircles via Treido pattern */}

      {/* Quick Filter Pills (enabled per-page) */}
      {showQuickFilters && (
        <QuickFilterRow
          locale={locale}
          {...(nav.activeSlug !== "all" ? { categorySlug: nav.activeSlug } : {})}
          {...(() => {
            if (nav.selectedPill) {
              const id = nav.l3Categories.find((c) => c.slug === nav.selectedPill)?.id
              return id ? { categoryId: id } : {}
            }
            if (nav.activeL2 && nav.currentL2) return { categoryId: nav.currentL2.id }
            if (nav.activeL1 && nav.currentL1) return { categoryId: nav.currentL1.id }
            if (nav.activeTab !== "all" && nav.currentL0) return { categoryId: nav.currentL0.id }
            return {}
          })()}
          attributes={filterableAttributes}
          subcategories={nav.circlesToDisplay.map((c) => ({
            id: c.id,
            name: c.name,
            name_bg: c.name_bg,
            slug: c.slug,
          }))}
          {...(nav.activeCategoryName ? { categoryName: nav.activeCategoryName } : {})}
        />
      )}

      {/* "View all" link - homepage-only helper to jump into /categories/[slug]. */}




      {/* 5. Active Filter Chips (Tiny Badges) */}
      <div className="bg-background px-4 pb-2">
        <FilterChips />
      </div>

      {/* 6. Product Feed */}
      <ProductFeed
        products={nav.activeFeed.products}
        hasMore={nav.activeFeed.hasMore}
        isLoading={nav.isLoading}
        activeSlug={nav.activeSlug}
        locale={locale}
        isAllTab={nav.isAllTab}
        activeCategoryName={nav.activeCategoryName}
        onLoadMore={nav.loadMoreProducts}
      />
    </div>
  )
}
