"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Tag } from "@phosphor-icons/react"
import { PageShell } from "@/components/shared/page-shell"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { SortModal } from "@/components/shared/filters/sort-modal"
import { ProductFeed } from "@/components/shared/product/product-feed"
import { SubcategoryCircles } from "@/components/mobile/subcategory-circles"
import { ContextualFilterBar } from "@/components/mobile/category-nav/contextual-filter-bar"
import { FeedControlBar, type SortOption, type QuickPillId } from "@/components/mobile/feed-control-bar"
import { CategoryProductRowMobile } from "@/components/shared/product/category-product-row"
import { useHeader } from "@/components/providers/header-context"
import type { UIProduct } from "@/lib/types/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { useCategoryNavigation } from "@/hooks/use-category-navigation"
import { useTranslations } from "next-intl"

// New drawer-based navigation
import {
  CategoryDrawerProvider,
  useCategoryDrawer,
  CategoryCirclesSimple,
} from "@/components/mobile/category-nav"
import { CategoryBrowseDrawer } from "@/components/mobile/drawers/category-browse-drawer"
import { PromotedListingsStrip } from "@/components/shared/promoted-listings-strip"
import { TrustBadgesInline } from "@/components/shared/trust-badges-inline"
import { SellPromoBanner } from "@/components/shared/sell-promo-banner"

// =============================================================================
// Types
// =============================================================================

interface CuratedSections {
  deals: UIProduct[]
  fashion: UIProduct[]
  electronics: UIProduct[]
  automotive: UIProduct[]
}

interface MobileHomeProps {
  initialProducts: UIProduct[]
  promotedProducts?: UIProduct[]
  curatedSections?: CuratedSections
  initialCategories: CategoryTreeNode[]
  locale: string
  user?: { id: string } | null
  /** Active category for header pills - passed to layout via context or searchParams */
  activeCategory?: string
  /** Callback when category pill is selected - passed to layout via context */
  onCategorySelect?: (slug: string) => void
  /** Callback to open search overlay - passed to layout via context */
  onSearchOpen?: () => void
}

// =============================================================================
// Fetch Children Helper (for lazy-loading subcategories)
// =============================================================================

async function fetchCategoryChildren(parentId: string): Promise<CategoryTreeNode[]> {
  try {
    const res = await fetch(`/api/categories/${parentId}/children`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.children ?? []
  } catch {
    return []
  }
}

// =============================================================================
// Main Component
// =============================================================================

export function MobileHome({
  initialProducts,
  promotedProducts,
  curatedSections,
  initialCategories,
  locale,
  user,
  activeCategory,
  onCategorySelect,
  onSearchOpen,
}: MobileHomeProps) {
  const t = useTranslations("Home")
  const [searchOpen, setSearchOpen] = useState(false)
  const [sortModalOpen, setSortModalOpen] = useState(false)
  const [activeSort, setActiveSort] = useState<SortOption>("newest")
  const [activePills, setActivePills] = useState<QuickPillId[]>([])
  
  // Drawer-selected category for filtering
  const [drawerCategory, setDrawerCategory] = useState<CategoryTreeNode | null>(null)

  const activePromotedProducts = useMemo(() => {
    const now = Date.now()
    return (promotedProducts ?? []).filter((p) => {
      if (!p.isBoosted) return false
      if (!p.boostExpiresAt) return false
      const expiresAt = Date.parse(p.boostExpiresAt)
      return Number.isFinite(expiresAt) && expiresAt > now
    })
  }, [promotedProducts])
  
  // Toggle a quick filter pill
  const handlePillToggle = (pill: QuickPillId) => {
    setActivePills(prev => 
      prev.includes(pill) 
        ? prev.filter(p => p !== pill)
        : [...prev, pill]
    )
  }
  
  // Handle drawer category change
  const handleDrawerCategoryChange = useCallback((
    category: CategoryTreeNode | null,
    path: CategoryTreeNode[]
  ) => {
    setDrawerCategory(category)
  }, [])
  
  // Get header context to provide dynamic state to layout's header
  const { setHomepageHeader } = useHeader()

  // Use the navigation hook that handles all product loading
  const nav = useCategoryNavigation({
    initialCategories,
    defaultTab: drawerCategory?.slug ?? null,
    defaultSubTab: null,
    defaultL2: null,
    defaultL3: null,
    tabsNavigateToPages: false,
    l0Style: "pills",
    initialProducts,
    initialProductsSlug: "all",
    locale,
    activeAllFilter: "newest",
  })
  
  // Provide homepage header state to layout via context
  useEffect(() => {
    setHomepageHeader({
      activeCategory: nav.activeTab,
      onCategorySelect: nav.handleTabChange,
      onSearchOpen: () => setSearchOpen(true),
      categories: initialCategories,
    })
    return () => setHomepageHeader(null)
  }, [nav.activeTab, nav.handleTabChange, initialCategories, setHomepageHeader])

  return (
    <CategoryDrawerProvider
      rootCategories={initialCategories}
      onCategoryChange={handleDrawerCategoryChange}
    >
      <PageShell variant="muted" className="pb-24">
        {/* Search Overlay */}
        <MobileSearchOverlay
          hideDefaultTrigger
          externalOpen={searchOpen}
          onOpenChange={setSearchOpen}
        />

        {/* Header is rendered by layout - passes variant="homepage" with category pills */}
        
        {/* L0 Category Circles - Tapping opens drawer for L1+ navigation */}
        <CategoryCirclesSimple
          categories={initialCategories}
          locale={locale}
        />

        {/* Main Content */}
      <div className="pb-4">
        {/* Leaf Category Banner - Shows when at deepest level (no more subcategories) */}
        {!nav.isAllTab && nav.isLeafCategory && nav.activeCategoryName && (
          <div className="mx-inset my-3 rounded-xl bg-selected p-4 border border-selected-border">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-hover">
                <Tag size={20} weight="fill" className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{nav.activeCategoryName}</h3>
                <p className="text-sm text-muted-foreground">{t("mobile.browseCategorySubtitle")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Subcategory Circles - Visual drill-down (Temu-style) */}
        {/* L0 → L1 → L2 → L3 → L4 circles, until leaf category reached */}
        {!nav.isAllTab && !nav.isLeafCategory && nav.circlesToDisplay.length > 0 && (
          <SubcategoryCircles
            subcategories={nav.circlesToDisplay}
            categorySlug={nav.activeSlug}
            locale={locale}
            onSubcategoryClick={nav.handleCircleClick}
          />
        )}

        {/* Contextual Filter Bar - Smart category-aware filters */}
        {/* Shows: Filter/Sort + Category-specific attribute pills (Size, Color, Brand) */}
        {!nav.isAllTab && (
          <ContextualFilterBar
            locale={locale}
            categorySlug={nav.activeSlug}
            categoryId={nav.currentL0?.id}
            className="sticky top-22 z-20"
          />
        )}

        {/* Promoted Listings - Only on "All" tab */}
        {nav.isAllTab && activePromotedProducts.length > 0 && (
          <PromotedListingsStrip products={activePromotedProducts} />
        )}

        {/* CURATED CATEGORY SECTIONS - Only on "All" tab, after promoted */}
        {nav.isAllTab && curatedSections && (
          <>
            {/* Today's Deals */}
            {curatedSections.deals.length > 0 && (
              <CategoryProductRowMobile
                title={t("sections.deals")}
                products={curatedSections.deals}
                variant="deals"
                seeAllHref="/todays-deals"
                seeAllText={t("sections.seeAll")}
              />
            )}

            {/* Fashion */}
            {curatedSections.fashion.length > 0 && (
              <CategoryProductRowMobile
                title={t("sections.fashion")}
                products={curatedSections.fashion}
                variant="fashion"
                seeAllHref="/categories/fashion"
                seeAllText={t("sections.seeAll")}
              />
            )}

            {/* Electronics */}
            {curatedSections.electronics.length > 0 && (
              <CategoryProductRowMobile
                title={t("sections.electronics")}
                products={curatedSections.electronics}
                variant="electronics"
                seeAllHref="/categories/electronics"
                seeAllText={t("sections.seeAll")}
              />
            )}

            {/* Automotive */}
            {curatedSections.automotive.length > 0 && (
              <CategoryProductRowMobile
                title={t("sections.automotive")}
                products={curatedSections.automotive}
                variant="automotive"
                seeAllHref="/categories/automotive"
                seeAllText={t("sections.seeAll")}
              />
            )}
          </>
        )}

        {/* Feed Controls - transition from browse to shop mode */}
        {nav.isAllTab && (
          <FeedControlBar
            activeSort={activeSort}
            onSortChange={setActiveSort}
            activePills={activePills}
            onPillToggle={handlePillToggle}
            onFilterClick={() => setSortModalOpen(true)}
            productCount={nav.activeFeed.products.length}
          />
        )}

        {/* Product Feed (reuse existing component) */}
        <ProductFeed
          products={nav.activeFeed.products}
          hasMore={nav.activeFeed.hasMore}
          isLoading={nav.isLoading}
          activeSlug={nav.activeSlug}
          locale={locale}
          isAllTab={nav.isAllTab}
          activeCategoryName={nav.isAllTab ? null : nav.activeCategoryName}
          onLoadMore={nav.loadMoreProducts}
        />

        {/* Trust Badges after first batch */}
        {nav.activeFeed.products.length >= 4 && <TrustBadgesInline />}
      </div>

      {/* Sell CTA */}
      <SellPromoBanner />

      {/* Sort Modal - for additional sort options beyond the segmented tabs */}
      <SortModal
        open={sortModalOpen}
        onOpenChange={setSortModalOpen}
        locale={locale}
        excludeOptions={nav.isAllTab ? ["newest"] : undefined}
      />
      
      {/* Category Browse Drawer - Native app-style category navigation */}
      <CategoryBrowseDrawer
        locale={locale}
        fetchChildren={fetchCategoryChildren}
        onCategoryChange={(cat) => {
          if (cat) {
            nav.handleTabChange(cat.slug)
          }
        }}
      />
    </PageShell>
    </CategoryDrawerProvider>
  )
}
