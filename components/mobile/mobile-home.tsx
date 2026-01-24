"use client"

import { useState, useMemo, useEffect } from "react"
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
import { FilterHub } from "@/components/shared/filters/filter-hub"
import { SortModal } from "@/components/shared/filters/sort-modal"
import { ProductFeed } from "@/components/shared/product/product-feed"
import { SubcategoryCircles } from "@/components/mobile/subcategory-circles"
import { HorizontalProductCard } from "@/components/mobile/horizontal-product-card"
import { ExploreBanner, type ExploreTab } from "@/components/mobile/explore-banner"
import { useHeader } from "@/components/providers/header-context"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { useCategoryNavigation } from "@/hooks/use-category-navigation"
import { useTranslations } from "next-intl"

// =============================================================================
// Types
// =============================================================================

interface MobileHomeProps {
  initialProducts: UIProduct[]
  promotedProducts?: UIProduct[]
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
// Promoted Listings Strip (demo style - w-40 cards)
// =============================================================================

function PromotedListingsStrip({
  products,
}: {
  products: UIProduct[]
}) {
  const t = useTranslations("Home")
  if (!products || products.length === 0) return null

  return (
    <section className="pt-3 pb-1">
      {/* Header */}
      <div className="px-inset mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fire size={18} weight="fill" className="text-fire" />
          <span className="text-sm font-bold text-foreground">
            {t("mobile.promotedListings")}
          </span>
        </div>
        <Link
          href="/todays-deals"
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {t("mobile.seeAll")}
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>

      {/* Big horizontal scroll cards */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-inset">
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
    <div className="mx-inset my-3 flex items-center justify-between py-2.5 px-3 bg-muted/30 rounded-md border border-border/30">
      {badges.map(({ icon: Icon, label }, i) => (
        <div
          key={label}
          className={cn("flex items-center gap-1.5", i > 0 && "border-l border-border/40 pl-3")}
        >
          <Icon size={14} weight="fill" className="text-foreground/70" />
          <span className="text-2xs text-foreground/70 font-medium">{label}</span>
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
  initialCategories,
  locale,
  user,
  activeCategory,
  onCategorySelect,
  onSearchOpen,
}: MobileHomeProps) {
  const t = useTranslations("Home")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterHubOpen, setFilterHubOpen] = useState(false)
  const [sortModalOpen, setSortModalOpen] = useState(false)
  const [exploreTab, setExploreTab] = useState<ExploreTab>("newest")
  
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

  // Get category name for display (only used when NOT on "All" tab)
  const categoryName = useMemo(() => {
    return nav.activeCategoryName || nav.activeTab
  }, [nav.activeCategoryName, nav.activeTab])

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
        {/* Subcategory Circles - Visual browse when category selected (not "All") */}
        {!nav.isAllTab && nav.l1Categories.length > 0 && (
          <SubcategoryCircles
            subcategories={nav.l1Categories}
            categorySlug={nav.activeTab}
            locale={locale}
            onSubcategoryClick={(category) => nav.handleCircleClick(category)}
          />
        )}

        {/* Promoted Listings - Only on "All" tab */}
        {nav.isAllTab && promotedProducts && promotedProducts.length > 0 && (
          <PromotedListingsStrip products={promotedProducts} />
        )}

        {/* For You - Only on "All" tab */}
        {nav.isAllTab && nav.activeFeed.products.length > 0 && (
          <section className="pt-3 pb-1">
            <div className="px-inset mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={18} weight="fill" className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {t("mobile.forYouTitle")}
                </span>
              </div>
              <Link
                href="/todays-deals"
                className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
              >
                {t("mobile.seeAll")}
                <ArrowRight size={12} weight="bold" />
              </Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-3 px-inset">
                {nav.activeFeed.products.slice(0, 8).map((product) => (
                  <HorizontalProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Explore Banner with Segmented Control - Only on "All" tab */}
        {nav.isAllTab && (
          <ExploreBanner
            activeTab={exploreTab}
            onTabChange={setExploreTab}
            onSortClick={() => setSortModalOpen(true)}
            productCount={nav.activeFeed.products.length}
          />
        )}

        {/* Category Header - Only when category is selected (not "All" tab) */}
        {!nav.isAllTab && (
          <div className="px-inset py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">{categoryName}</h2>
              <span className="text-xs text-muted-foreground">({nav.activeFeed.products.length})</span>
            </div>
          </div>
        )}

        {/* Product Feed (reuse existing component) */}
        <ProductFeed
          products={nav.activeFeed.products}
          hasMore={nav.activeFeed.hasMore}
          isLoading={nav.isLoading}
          activeSlug={nav.activeSlug}
          locale={locale}
          isAllTab={nav.isAllTab}
          activeCategoryName={nav.isAllTab ? null : categoryName}
          onLoadMore={nav.loadMoreProducts}
        />

        {/* Trust Badges after first batch */}
        {nav.activeFeed.products.length >= 4 && <TrustBadgesInline />}
      </div>

      {/* Sell CTA */}
      <SellPromoBanner />

      {/* FilterHub Drawer (reuse existing, uses shadcn Drawer) */}
      <FilterHub
        open={filterHubOpen}
        onOpenChange={setFilterHubOpen}
        locale={locale}
        mode="full"
        initialSection={null}
      />

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
