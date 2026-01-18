"use client"

import { useState, useMemo } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  ShieldCheck,
  Tag,
  ArrowRight,
  Truck,
  Fire,
  Plus,
} from "@phosphor-icons/react"
import { ArrowUpDown } from "lucide-react"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { FilterHub } from "@/components/shared/filters/filter-hub"
import { SortModal } from "@/components/shared/filters/sort-modal"
import { ProductFeed } from "@/components/shared/product/product-feed"
import { SiteHeader } from "@/components/layout/header/site-header-unified"
import { SubcategoryCircles } from "@/components/mobile/subcategory-circles"
import { HorizontalProductCard } from "@/components/mobile/horizontal-product-card"
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
}

// =============================================================================
// Promoted Listings Strip (demo style - w-40 cards)
// =============================================================================

function PromotedListingsStrip({
  products,
  locale,
}: {
  products: UIProduct[]
  locale: string
}) {
  if (!products || products.length === 0) return null

  return (
    <section className="pt-3 pb-1">
      {/* Header */}
      <div className="px-inset mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fire size={18} weight="fill" className="text-orange-500" />
          <span className="text-sm font-bold text-foreground">
            {locale === "bg" ? "Промотирани обяви" : "Promoted Listings"}
          </span>
        </div>
        <Link
          href="/todays-deals"
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
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
// Offers For You (Recommendations - same style as Promoted but Tag icon)
// For new users: shows newest listings. For returning users: personalized.
// =============================================================================

function OffersForYou({
  products,
  locale,
}: {
  products: UIProduct[]
  locale: string
}) {
  if (!products || products.length === 0) return null

  // Take items 4-12 from initial products (after promoted) for "offers"
  // This simulates personalized recommendations based on browsing
  const offerProducts = products.slice(0, 8)
  
  if (offerProducts.length === 0) return null

  return (
    <section className="py-3">
      {/* Header */}
      <div className="px-inset mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={18} weight="fill" className="text-primary" />
          <span className="text-sm font-bold text-foreground">
            {locale === "bg" ? "Оферти за теб" : "Offers for You"}
          </span>
        </div>
        <Link
          href="/deals"
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>

      {/* Horizontal scroll - same cards as Promoted */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-inset">
          {offerProducts.map((product) => (
            <HorizontalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// Inline Filter/Sort Bar (demo style)
// =============================================================================

function InlineFilterSortBar({
  locale,
  onSortClick,
  productCount,
  categoryName,
}: {
  locale: string
  onSortClick: () => void
  productCount: number
  categoryName: string
}) {
  return (
    <div className="px-inset py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-foreground">{categoryName}</h2>
        <span className="text-xs text-muted-foreground">({productCount})</span>
      </div>
      <button
        type="button"
        onClick={onSortClick}
        className="flex items-center gap-1.5 h-9 px-3 border border-border/60 rounded-full text-xs font-medium active:bg-muted transition-colors"
      >
        <ArrowUpDown className="size-3.5" />
        {locale === "bg" ? "Сортирай" : "Sort"}
      </button>
    </div>
  )
}

// =============================================================================
// Trust Badges (demo style)
// =============================================================================

function TrustBadgesInline({ locale }: { locale: string }) {
  const badges = [
    { icon: ShieldCheck, label: locale === "bg" ? "Защитени" : "Protected" },
    { icon: Truck, label: locale === "bg" ? "Бърза доставка" : "Fast Ship" },
    { icon: Tag, label: locale === "bg" ? "Топ цени" : "Best Prices" },
  ]

  return (
    <div className="mx-inset my-3 flex items-center justify-between py-2.5 px-3 bg-muted/30 rounded-lg border border-border/30">
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

function SellPromoBanner({ locale }: { locale: string }) {
  return (
    <Link
      href="/sell"
      className="mx-inset mb-4 flex items-center justify-between gap-3 rounded-lg bg-foreground text-background p-3.5 active:opacity-90 transition-opacity"
    >
      <div className="space-y-0.5 min-w-0">
        <p className="text-sm font-bold leading-tight">
          {locale === "bg" ? "Имаш нещо за продан?" : "Have something to sell?"}
        </p>
        <p className="text-xs text-background/70 leading-tight">
          {locale === "bg"
            ? "Безплатно публикуване • Достигни хиляди"
            : "Free to list • Reach thousands"}
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
}: MobileHomeProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterHubOpen, setFilterHubOpen] = useState(false)
  const [sortModalOpen, setSortModalOpen] = useState(false)

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

  // Get category name for display
  const categoryName = useMemo(() => {
    if (nav.isAllTab) {
      return locale === "bg" ? "Предложени за теб" : "Suggested for you"
    }
    return nav.activeCategoryName || nav.activeTab
  }, [nav.isAllTab, nav.activeCategoryName, nav.activeTab, locale])

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Search Overlay */}
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />

      {/* Homepage Header - inline search + category pills */}
      <SiteHeader
        variant="homepage"
        user={user as any}
        categories={initialCategories}
        activeCategory={nav.activeTab}
        onCategorySelect={nav.handleTabChange}
        onSearchOpen={() => setSearchOpen(true)}
      />

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
          <PromotedListingsStrip products={promotedProducts} locale={locale} />
        )}

        {/* Offers For You - personalized recommendations (on "All" tab) */}
        {nav.isAllTab && initialProducts.length > 0 && (
          <OffersForYou products={initialProducts} locale={locale} />
        )}

        {/* Sort Bar */}
        <InlineFilterSortBar
          locale={locale}
          onSortClick={() => setSortModalOpen(true)}
          productCount={nav.activeFeed.products.length}
          categoryName={categoryName}
        />

        {/* Product Feed (reuse existing component) */}
        <ProductFeed
          products={nav.activeFeed.products}
          hasMore={nav.activeFeed.hasMore}
          isLoading={nav.isLoading}
          activeSlug={nav.activeSlug}
          locale={locale}
          isAllTab={nav.isAllTab}
          activeCategoryName={categoryName}
          onLoadMore={nav.loadMoreProducts}
        />

        {/* Trust Badges after first batch */}
        {nav.activeFeed.products.length >= 4 && <TrustBadgesInline locale={locale} />}
      </div>

      {/* Sell CTA */}
      <SellPromoBanner locale={locale} />

      {/* FilterHub Drawer (reuse existing, uses shadcn Drawer) */}
      <FilterHub
        open={filterHubOpen}
        onOpenChange={setFilterHubOpen}
        locale={locale}
        mode="full"
        initialSection={null}
      />

      {/* Sort Modal */}
      <SortModal open={sortModalOpen} onOpenChange={setSortModalOpen} locale={locale} />
    </div>
  )
}
