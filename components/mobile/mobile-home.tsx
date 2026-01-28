"use client"

import { useState, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { PageShell } from "@/components/shared/page-shell"
import {
  ShieldCheck,
  Tag,
  ArrowRight,
  Truck,
  Fire,
  Plus,
} from "@phosphor-icons/react"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { SortModal } from "@/components/shared/filters/sort-modal"
import { ProductFeed } from "@/components/shared/product/product-feed"
import { SubcategoryCircles } from "@/components/mobile/subcategory-circles"
import { ContextualFilterBar } from "@/components/mobile/category-nav/contextual-filter-bar"
import { HorizontalProductCard } from "@/components/mobile/horizontal-product-card"
import { FeedControlBar, type SortOption, type QuickPillId } from "@/components/mobile/feed-control-bar"
import { CategoryProductRowMobile } from "@/components/shared/product/category-product-row"
import { useHeader } from "@/components/providers/header-context"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { useCategoryNavigation } from "@/hooks/use-category-navigation"
import { useTranslations } from "next-intl"

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
// Promoted Listings Strip - Uses semantic SectionHeader
// =============================================================================

function PromotedListingsStrip({
  products,
}: {
  products: UIProduct[]
}) {
  const t = useTranslations("Home")
  if (!products || products.length === 0) return null

  return (
    <section className="pt-section-top pb-section-bottom">
      {/* Section header - semantic tokens */}
      <header className="px-inset mb-3 flex items-center justify-between min-h-touch-sm">
        <div className="flex items-center gap-2.5">
          <Fire size={18} weight="fill" className="text-fire shrink-0" aria-hidden="true" />
          <h2 className="text-body font-semibold tracking-tight text-foreground">
            {t("mobile.promotedListings")}
          </h2>
        </div>
        <Link
          href="/todays-deals"
          className="flex items-center gap-1 text-compact font-medium text-primary min-h-touch-sm px-1 -mr-1 active:opacity-70 transition-opacity"
        >
          {t("mobile.seeAll")}
          <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </Link>
      </header>

      {/* Horizontal scroll product cards with snap */}
      <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory">
        <div className="flex gap-3 px-inset pb-1">
          {products.slice(0, 8).map((product) => (
            <HorizontalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// Trust Badges (demo style)
// =============================================================================

function TrustBadgesInline() {
  const t = useTranslations("Home")
  const badges = [
    { icon: ShieldCheck, label: t("mobile.trustProtected") },
    { icon: Truck, label: t("mobile.trustFastShip") },
    { icon: Tag, label: t("mobile.trustBestPrices") },
  ]

  return (
    <div className="mx-inset my-3 flex items-center justify-between py-2.5 px-3 bg-surface-subtle rounded-md border border-border">
      {badges.map(({ icon: Icon, label }, i) => (
        <div
          key={label}
          className={cn("flex items-center gap-1.5", i > 0 && "border-l border-border pl-3")}
        >
          <Icon size={14} weight="fill" className="text-muted-foreground" />
          <span className="text-2xs text-muted-foreground font-medium">{label}</span>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Sell Promo Banner (demo style)
// =============================================================================

function SellPromoBanner() {
  const t = useTranslations("Home")
  return (
    <Link
      href="/sell"
      className="mx-inset mb-4 flex items-center justify-between gap-3 rounded-md bg-foreground text-background p-3 active:opacity-90 transition-opacity"
    >
      <div className="space-y-0.5 min-w-0">
        <p className="text-sm font-bold leading-tight">
          {t("mobile.sellBannerTitle")}
        </p>
        <p className="text-xs text-background/70 leading-tight">
          {t("mobile.sellBannerSubtitle")}
        </p>
      </div>
      <div className="size-9 shrink-0 bg-background text-foreground rounded-full flex items-center justify-center">
        <Plus size={18} weight="bold" />
      </div>
    </Link>
  )
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
  
  // Toggle a quick filter pill
  const handlePillToggle = (pill: QuickPillId) => {
    setActivePills(prev => 
      prev.includes(pill) 
        ? prev.filter(p => p !== pill)
        : [...prev, pill]
    )
  }
  
  // Get header context to provide dynamic state to layout's header
  const { setHomepageHeader } = useHeader()

  // Use the navigation hook that handles all product loading
  const nav = useCategoryNavigation({
    initialCategories,
    defaultTab: null,
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
    <PageShell variant="muted" className="pb-24">
      {/* Search Overlay */}
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />

      {/* Header is rendered by layout - passes variant="homepage" with category pills */}

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
                <p className="text-sm text-muted-foreground">Browse all products in this category</p>
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
            className="sticky top-[88px] z-20"
          />
        )}

        {/* Promoted Listings - Only on "All" tab */}
        {nav.isAllTab && promotedProducts && promotedProducts.length > 0 && (
          <PromotedListingsStrip products={promotedProducts} />
        )}

        {/* CURATED CATEGORY SECTIONS - Only on "All" tab, after promoted */}
        {nav.isAllTab && curatedSections && (
          <div className="space-y-section-gap">
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
          </div>
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
    </PageShell>
  )
}
