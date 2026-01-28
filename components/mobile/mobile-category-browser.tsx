"use client"

import { useEffect, useLayoutEffect, useState, useCallback } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryAttribute } from "@/lib/data/categories"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { CaretRight } from "@phosphor-icons/react"

// Import extracted components
import { useCategoryNavigation } from "@/hooks/use-category-navigation"
import { useInstantCategoryBrowse } from "@/hooks/use-instant-category-browse"
import { useHeader } from "@/components/providers/header-context"
import {
  CategoryTabs,
  CategoryQuickPills,
  CategoryCircles,
  CategoryL3Pills,
  AllTabFilters,
  QuickFilterRow,
  // Phase 2: Contextual navigation components (Vinted-style)
  SubcategoryPills,
  InlineFilterBar,
  // Phase 3: Treido-mock Smart Anchor Navigation
  SmartAnchorNav,
} from "./category-nav"
import { ContextualDoubleDeckerNav } from "./category-nav/contextual-double-decker-nav"
import { ProductFeed } from "@/components/shared/product/product-feed"
import { FilterHub } from "@/components/shared/filters/filter-hub"
import { FilterChips } from "@/components/shared/filters/filter-chips"
import { PageShell } from "@/components/shared/page-shell"

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
  const router = useRouter()
  const [headerHeight, setHeaderHeight] = useState(0)

  // Filter state for "All" tab
  const [activeAllFilter, setActiveAllFilter] = useState<string>("newest")

  // Filter Hub state (shared by contextual + inline filter modes)
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
  // Contextual Mode Hook (must be called unconditionally per React rules)
  // ==========================================================================
  // Convert CategoryTreeNode[] to CategoryLite[] for the hook
  const initialChildrenForHook = contextualSubcategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    name_bg: cat.name_bg,
    slug: cat.slug,
    parent_id: cat.parent_id ?? null,
    icon: cat.icon ?? null,
    image_url: cat.image_url ?? null,
  }))

  const instant = useInstantCategoryBrowse({
    enabled: contextualMode,
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
    initialChildren: initialChildrenForHook,
    initialAttributes: filterableAttributes,
    initialProducts,
  })

  // ==========================================================================
  // Contextual Mode Rendering (Vinted-style)
  // ==========================================================================

  // Header is now rendered by the layout with variant="contextual"
  // No more DOM manipulation to hide parent header - layout handles variant detection
  
  // Get header context to provide dynamic state
  const { setContextualHeader } = useHeader()

  if (contextualMode) {
    const backHref = contextualBackHref || `/categories`

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
    const handleCircleClick = async (cat: CategoryTreeNode) => {
      if (cat?.slug) {
        await instant.setCategorySlug(cat.slug, { clearAttrFilters: true })
      }
    }

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
    
    // Provide contextual header state to layout via context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setContextualHeader({
        title: instant.categoryTitle || contextualInitialTitle,
        backHref,
        onBack: handleBack,
        subcategories: instant.children.length ? instant.children : contextualSubcategories,
        onSubcategoryClick: handleCircleClick,
      })
      return () => setContextualHeader(null)
    }, [instant.categoryTitle, contextualInitialTitle, backHref, instant.children, contextualSubcategories, setContextualHeader])

    return (
      <PageShell variant="muted" className="w-full">
        {/* Header is rendered by layout with variant="contextual" */}
        {/* Layout's header will show title, back button, and subcategory circles from context */}

        {/* 3) Inline Filter Bar (50/50 split: Filters | Sort) */}
        <InlineFilterBar
          locale={locale}
          onAllFiltersClick={() => setFilterHubOpen(true)}
          attributes={instant.attributes.length ? instant.attributes : filterableAttributes}
          appliedSearchParams={instant.appliedSearchParams}
          stickyTop={48}
          sticky={true}
          className="z-30"
        />

        {/* 4) Active Filter Chips (removable pills) */}
        <div className="bg-background px-inset py-1">
          <FilterChips
            appliedSearchParams={instant.appliedSearchParams}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        </div>

        {/* 5. Product Feed */}
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

        {/* FilterHub Drawer (fallback for complex filters) */}
          <FilterHub
            open={filterHubOpen}
            onOpenChange={setFilterHubOpen}
            locale={locale}
            {...(instant.categorySlug !== "all" ? { categorySlug: instant.categorySlug } : {})}
            {...(instant.categoryId ? { categoryId: instant.categoryId } : {})}
            attributes={instant.attributes.length ? instant.attributes : filterableAttributes}
            appliedSearchParams={instant.appliedSearchParams}
            onApply={handleApplyFilters}
            mode="full"
            initialSection={null}
          />
      </PageShell>
    )
  }

  // ==========================================================================
  // Traditional Mode Rendering (Tabs + Circles)
  // ==========================================================================

  return (
    <PageShell variant="muted" className="w-full">
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
        <div className="bg-background px-inset py-3 border-b border-border/40">
          <h1 className="text-lg font-bold">{pageTitle}</h1>
        </div>
      )}

      {/* 3. Subcategory Circles (L1 or L2) OR "All" Tab Quick Filters */}
      {/* Treido pattern: In drilled-down state, circles hide and morphed back pill + L3 pills appear */}
      <div
        className={cn(
          "bg-background",
          !nav.isDrilledDown && "py-1"
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

      {/* Inline Filter Bar (demo-style 50/50 split: Filters | Sort) */}
      {showInlineFilters && (
        <InlineFilterBar
          locale={locale}
          onAllFiltersClick={() => setFilterHubOpen(true)}
          attributes={filterableAttributes}
          sticky={false}
        />
      )}

      {/* 5. Active Filter Chips (Tiny Badges) */}
      <div className="bg-background px-inset pb-1">
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

      {/* FilterHub Drawer (for inline filter mode) */}
      {showInlineFilters && (
        <FilterHub
          open={filterHubOpen}
          onOpenChange={setFilterHubOpen}
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
          mode="full"
          initialSection={null}
        />
      )}
    </PageShell>
  )
}
