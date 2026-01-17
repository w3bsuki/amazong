"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  Sparkle as SparkleIcon,
  ShieldCheck,
  Tag,
  Package,
  SquaresFour,
  ArrowRight,
  Truck,
  Fire,
  Heart,
  Plus,
  Star,
} from "@phosphor-icons/react"
import { SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { FilterHub } from "@/components/shared/filters/filter-hub"
import { SortModal } from "@/components/shared/filters/sort-modal"
import { ProductFeed } from "@/components/shared/product/product-feed"
import { MobileHeader } from "@/components/mobile/mobile-header"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import { useCategoryNavigation } from "@/hooks/use-category-navigation"
import { useTranslations } from "next-intl"
import type { User } from "@supabase/supabase-js"

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
// Subcategory Circles (Temu pattern - visual browse when category selected)
// =============================================================================

function SubcategoryCircles({
  subcategories,
  categorySlug,
  locale,
  onSubcategoryClick,
}: {
  subcategories: CategoryTreeNode[]
  categorySlug: string
  locale: string
  onSubcategoryClick?: (category: CategoryTreeNode) => void
}) {
  if (!subcategories || subcategories.length === 0) return null

  const viewAllLabel = locale === "bg" ? "Виж всички" : "View all"

  return (
    <div className="py-3 overflow-x-auto no-scrollbar">
      <div className="flex items-start gap-3 px-(--page-inset)">
        {/* View All - First circle */}
        <Link
          href={`/categories/${categorySlug}`}
          className="flex flex-col items-center gap-1.5 shrink-0 w-16 active:opacity-80 transition-opacity"
        >
          <div className="size-14 rounded-full bg-foreground text-background flex items-center justify-center">
            <SquaresFour size={22} weight="fill" />
          </div>
          <span className="text-2xs text-center text-foreground font-semibold leading-tight line-clamp-2">
            {viewAllLabel}
          </span>
        </Link>

        {/* Subcategory circles */}
        {subcategories.slice(0, 10).map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSubcategoryClick?.(sub)}
            className="flex flex-col items-center gap-1.5 shrink-0 w-16 active:opacity-80 transition-opacity"
          >
            {/* Circle with image/icon */}
            <div className="size-14 rounded-full bg-muted/50 border border-border/30 overflow-hidden flex items-center justify-center">
              {sub.image_url ? (
                <Image
                  src={sub.image_url}
                  alt={getCategoryName(sub, locale)}
                  width={56}
                  height={56}
                  className="size-full object-cover"
                />
              ) : (
                <Package size={20} className="text-muted-foreground/40" />
              )}
            </div>
            {/* Label */}
            <span className="text-2xs text-center text-muted-foreground font-medium leading-tight line-clamp-2">
              {getCategoryName(sub, locale)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
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
  const t = useTranslations("mobile")
  
  if (!products || products.length === 0) return null

  return (
    <section className="pt-3 pb-1">
      {/* Header */}
      <div className="px-(--page-inset) mb-2.5 flex items-center justify-between">
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

      {/* Big horizontal scroll cards (demo style: w-40) */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-(--page-inset)">
          {products.slice(0, 8).map((product) => {
            const hasDiscount = product.listPrice && product.listPrice > product.price
            const discountPercent = hasDiscount
              ? Math.round(((product.listPrice! - product.price) / product.listPrice!) * 100)
              : 0
            const href = product.storeSlug && product.slug
              ? `/${product.storeSlug}/${product.slug}`
              : `/product/${product.id}`

            return (
              <Link
                key={product.id}
                href={href}
                className="shrink-0 w-40 active:opacity-80 transition-opacity"
              >
                {/* Bigger image */}
                <div className="relative aspect-square rounded-(--radius-card) overflow-hidden bg-muted mb-2">
                  {/* AD badge - top left for boosted listings */}
                  {product.isBoosted && (
                    <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-orange-500 text-white text-2xs font-bold rounded flex items-center gap-0.5">
                      <SparkleIcon size={10} weight="fill" />
                      <span>AD</span>
                    </div>
                  )}
                  {/* Discount badge - below AD badge or at top if not boosted */}
                  {hasDiscount && (
                    <div className={cn(
                      "absolute left-1.5 z-10 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-2xs font-bold rounded",
                      product.isBoosted ? "top-8" : "top-1.5"
                    )}>
                      -{discountPercent}%
                    </div>
                  )}
                  {/* Wishlist button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className="absolute top-1.5 right-1.5 z-10 size-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-background transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={16} className="text-foreground" />
                  </button>
                  {/* Free shipping badge - bottom left */}
                  {product.freeShipping && (
                    <div className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-emerald-500 text-white text-2xs font-medium rounded flex items-center gap-0.5">
                      <Truck size={10} weight="fill" />
                      <span>Free</span>
                    </div>
                  )}
                  {/* Product Image */}
                  {product.image && product.image !== "/placeholder.svg" ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package size={36} className="text-muted-foreground/15" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        "text-sm font-bold",
                        hasDiscount ? "text-price-sale" : "text-foreground"
                      )}
                    >
                      €{product.price.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-2xs text-muted-foreground line-through">
                        €{product.listPrice!.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground line-clamp-2 leading-snug">
                    {product.title}
                  </p>
                  {/* Rating */}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star size={11} weight="fill" className="text-rating" />
                      <span className="text-2xs text-muted-foreground">
                        {product.rating.toFixed(1)}{" "}
                        <span className="opacity-60">({product.reviews?.toLocaleString()})</span>
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
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
      <div className="px-(--page-inset) mb-2.5 flex items-center justify-between">
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
        <div className="flex gap-3 px-(--page-inset)">
          {offerProducts.map((product) => {
            const hasDiscount = product.listPrice && product.listPrice > product.price
            const discountPercent = hasDiscount
              ? Math.round(((product.listPrice! - product.price) / product.listPrice!) * 100)
              : 0
            const href = product.storeSlug && product.slug
              ? `/${product.storeSlug}/${product.slug}`
              : `/product/${product.id}`

            return (
              <Link
                key={product.id}
                href={href}
                className="shrink-0 w-40 active:opacity-80 transition-opacity"
              >
                {/* Same big card style as Promoted */}
                <div className="relative aspect-square rounded-(--radius-card) overflow-hidden bg-muted mb-2">
                  {/* Discount badge */}
                  {hasDiscount && (
                    <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-2xs font-bold rounded">
                      -{discountPercent}%
                    </div>
                  )}
                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className="absolute top-1.5 right-1.5 z-10 size-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-background transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={16} className="text-foreground" />
                  </button>
                  {/* Free shipping */}
                  {product.freeShipping && (
                    <div className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-emerald-500 text-white text-2xs font-medium rounded flex items-center gap-0.5">
                      <Truck size={10} weight="fill" />
                      <span>Free</span>
                    </div>
                  )}
                  {/* Product Image */}
                  {product.image && product.image !== "/placeholder.svg" ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package size={36} className="text-muted-foreground/15" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        "text-sm font-bold",
                        hasDiscount ? "text-price-sale" : "text-foreground"
                      )}
                    >
                      €{product.price.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-2xs text-muted-foreground line-through">
                        €{product.listPrice!.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground line-clamp-2 leading-snug">
                    {product.title}
                  </p>
                  {/* Rating */}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star size={11} weight="fill" className="text-rating" />
                      <span className="text-2xs text-muted-foreground">
                        {product.rating.toFixed(1)}{" "}
                        <span className="opacity-60">({product.reviews?.toLocaleString()})</span>
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
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
  onFiltersClick,
  onSortClick,
  productCount,
  categoryName,
}: {
  locale: string
  onFiltersClick: () => void
  onSortClick: () => void
  productCount: number
  categoryName: string
}) {
  return (
    <div className="px-(--page-inset) py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-foreground">{categoryName}</h2>
        <span className="text-xs text-muted-foreground">({productCount})</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onFiltersClick}
          className="flex items-center gap-1.5 h-9 px-3 border border-border/60 rounded-full text-xs font-medium active:bg-muted transition-colors"
        >
          <SlidersHorizontal className="size-3.5" />
          {locale === "bg" ? "Филтри" : "Filters"}
        </button>
        <button
          type="button"
          onClick={onSortClick}
          className="flex items-center gap-1.5 h-9 px-3 border border-border/60 rounded-full text-xs font-medium active:bg-muted transition-colors"
        >
          <ArrowUpDown className="size-3.5" />
          {locale === "bg" ? "Сортирай" : "Sort"}
        </button>
      </div>
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
    <div className="mx-(--page-inset) my-3 flex items-center justify-between py-2.5 px-3 bg-muted/30 rounded-lg border border-border/30">
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
      className="mx-(--page-inset) mb-4 flex items-center justify-between gap-3 rounded-lg bg-foreground text-background p-3.5 active:opacity-90 transition-opacity"
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

  // Hide the main site header on mobile to avoid duplicate headers
  useEffect(() => {
    const siteHeader = document.querySelector("body > div > header")
    if (!(siteHeader instanceof HTMLElement)) return

    const previousDisplay = siteHeader.style.display
    const mql = window.matchMedia("(max-width: 767px)")

    const sync = () => {
      siteHeader.style.display = mql.matches ? "none" : previousDisplay
    }

    sync()
    mql.addEventListener?.("change", sync)

    return () => {
      mql.removeEventListener?.("change", sync)
      siteHeader.style.display = previousDisplay
    }
  }, [])

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Search Overlay */}
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />

      {/* Mobile Header (shared component) */}
      <MobileHeader
        user={user ?? null}
        categories={initialCategories}
        activeCategory={nav.activeTab}
        onCategorySelect={nav.handleTabChange}
        onSearchOpen={() => setSearchOpen(true)}
        locale={locale}
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

        {/* Filter/Sort Bar */}
        <InlineFilterSortBar
          locale={locale}
          onFiltersClick={() => setFilterHubOpen(true)}
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
