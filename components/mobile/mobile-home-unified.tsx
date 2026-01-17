"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  MagnifyingGlass,
  Sparkle as SparkleIcon,
  ShieldCheck,
  Tag,
  Package,
  Sparkle,
  House,
  SquaresFour,
  Baby,
  PawPrint,
  Armchair,
  Car,
  Barbell,
  Cpu,
  TShirt,
  Flower,
  ArrowRight,
  Truck,
  Fire,
} from "@phosphor-icons/react"
import { SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { SidebarMenuV2 as SidebarMenu } from "@/components/layout/sidebar/sidebar-menu-v2"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { NotificationsDropdown } from "@/components/dropdowns"
import { FilterHub } from "@/components/shared/filters/filter-hub"
import { SortModal } from "@/components/shared/filters/sort-modal"
import { ProductFeed } from "@/components/shared/product/product-feed"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryShortName } from "@/lib/category-display"
import { useCategoryNavigation } from "@/hooks/use-category-navigation"
import Image from "next/image"

// =============================================================================
// Types
// =============================================================================

interface MobileHomeUnifiedProps {
  initialProducts: UIProduct[]
  /** Promoted/boosted listings for the featured section */
  promotedProducts?: UIProduct[]
  initialCategories: CategoryTreeNode[]
  locale: string
  user?: { id: string } | null
}

// =============================================================================
// Category Icon Component
// =============================================================================

function CategoryIcon({ slug, active, size = 14 }: { slug: string; active: boolean; size?: number }) {
  const weight = active ? "fill" : "regular"
  const className = active ? "text-background" : "text-muted-foreground"

  // Map common category slugs to icons
  const slugLower = slug.toLowerCase()
  if (slugLower.includes("electron") || slugLower.includes("tech")) {
    return <Cpu size={size} weight={weight} className={className} />
  }
  if (slugLower.includes("fashion") || slugLower.includes("cloth") || slugLower.includes("мода")) {
    return <TShirt size={size} weight={weight} className={className} />
  }
  if (slugLower.includes("home") || slugLower.includes("дом") || slugLower.includes("garden")) {
    return <House size={size} weight={weight} className={className} />
  }
  if (slugLower.includes("beauty") || slugLower.includes("красота")) {
    return <Flower size={size} weight={weight} className={className} />
  }
  if (slugLower.includes("sport") || slugLower.includes("fitness")) {
    return <Barbell size={size} weight={weight} className={className} />
  }
  if (slugLower.includes("kid") || slugLower.includes("baby") || slugLower.includes("деца")) {
    return <Baby size={size} weight={weight} className={className} />
  }
  if (slugLower.includes("pet") || slugLower.includes("животн")) {
    return <PawPrint size={size} weight={weight} className={className} />
  }
  if (slugLower.includes("furniture") || slugLower.includes("мебел")) {
    return <Armchair size={size} weight={weight} className={className} />
  }
  if (slugLower.includes("auto") || slugLower.includes("car") || slugLower.includes("авто")) {
    return <Car size={size} weight={weight} className={className} />
  }
  if (slug === "all") {
    return <Sparkle size={size} weight={weight} className={className} />
  }
  return <SquaresFour size={size} weight={weight} className={className} />
}

// =============================================================================
// Unified Header Component
// =============================================================================

function UnifiedMobileHeader({
  categories,
  activeCategory,
  onCategorySelect,
  onSearchOpen,
  locale,
  user,
}: {
  categories: CategoryTreeNode[]
  activeCategory: string
  onCategorySelect: (slug: string) => void
  onSearchOpen: () => void
  locale: string
  user?: { id: string } | null
}) {
  const pillsRef = useRef<HTMLDivElement>(null)
  const searchPlaceholder = locale === "bg" ? "Търсене..." : "Search..."

  // Scroll active pill into view
  useEffect(() => {
    const container = pillsRef.current
    if (!container) return

    const activeEl = container.querySelector(`[data-slug="${activeCategory}"]`) as HTMLElement
    if (activeEl) {
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()

      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      }
    }
  }, [activeCategory])

  const allLabel = locale === "bg" ? "Всички" : "All"

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 pt-safe">
      {/* Row 1: Hamburger + Logo + Actions */}
      <div className="h-11 px-3 flex items-center gap-1">
        {/* Hamburger Menu */}
        <SidebarMenu user={user as any} categories={categories} />

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <span className="text-lg font-extrabold tracking-tighter leading-none text-foreground">
            treido.
          </span>
        </Link>

        <div className="flex-1" />

        {/* Action Icons: Wishlist + Notifications + Cart */}
        <div className="flex items-center -mr-1.5">
          <MobileWishlistButton />
          {user && <NotificationsDropdown user={user as any} />}
          <MobileCartDropdown />
        </div>
      </div>

      {/* Row 2: Search Bar */}
      <div className="px-(--page-inset) pb-1.5">
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(
            "w-full flex items-center gap-2 h-10 px-3 rounded-md",
            "bg-muted/50 border border-border/40",
            "text-muted-foreground text-sm text-left",
            "active:bg-muted/80 transition-colors",
            "touch-action-manipulation tap-transparent"
          )}
          aria-label={searchPlaceholder}
          aria-haspopup="dialog"
        >
          <MagnifyingGlass size={18} weight="regular" className="text-muted-foreground shrink-0" />
          <span className="flex-1 truncate font-normal">{searchPlaceholder}</span>
        </button>
      </div>

      {/* Row 3: Category Pills - flows directly from search */}
      <div ref={pillsRef} className="overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2 px-(--page-inset)">
          {/* "All" Pill */}
          <button
            type="button"
            data-slug="all"
            onClick={() => onCategorySelect("all")}
            className={cn(
              "shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium transition-all active:scale-95",
              activeCategory === "all"
                ? "bg-foreground text-background"
                : "bg-muted/50 text-muted-foreground active:bg-muted"
            )}
          >
            <CategoryIcon slug="all" active={activeCategory === "all"} />
            <span>{allLabel}</span>
          </button>

          {/* Category Pills */}
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug
            const label = getCategoryShortName(cat, locale)

            return (
              <button
                key={cat.id}
                type="button"
                data-slug={cat.slug}
                onClick={() => onCategorySelect(cat.slug)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium transition-all active:scale-95",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-muted/50 text-muted-foreground active:bg-muted"
                )}
              >
                <CategoryIcon slug={cat.slug} active={isActive} />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}

// =============================================================================
// Promoted Listings Strip (Real Boosted Products from Supabase)
// =============================================================================

function PromotedListingsStrip({ 
  products, 
  locale 
}: { 
  products: UIProduct[]
  locale: string 
}) {
  // If no promoted products, don't render the section
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="pt-3 pb-2">
      <div className="px-(--page-inset) mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-foreground">
            <Fire size={16} weight="fill" className="text-orange-500" />
            <span className="text-sm font-bold">
              {locale === "bg" ? "Промотирани" : "Promoted"}
            </span>
          </div>
        </div>
        <Link
          href="/todays-deals"
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-2 px-(--page-inset)">
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
                className="shrink-0 w-24 active:opacity-80 transition-opacity"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-1.5">
                  {/* Promoted badge */}
                  {product.isBoosted && (
                    <div className="absolute top-1 left-1 z-10 px-1 py-0.5 bg-orange-500 text-white text-3xs font-bold rounded flex items-center gap-0.5">
                      <SparkleIcon size={8} weight="fill" />
                      <span>AD</span>
                    </div>
                  )}
                  {/* Discount badge (if applicable) */}
                  {hasDiscount && !product.isBoosted && (
                    <div className="absolute top-1 left-1 z-10 px-1 py-0.5 bg-destructive text-destructive-foreground text-3xs font-bold rounded">
                      -{discountPercent}%
                    </div>
                  )}
                  {/* Product Image */}
                  {product.image && product.image !== '/placeholder.svg' ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package size={24} className="text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <div className={cn(
                  "text-xs font-semibold truncate",
                  hasDiscount ? "text-price-sale" : "text-foreground"
                )}>
                  €{product.price.toFixed(2)}
                </div>
                {hasDiscount && (
                  <div className="text-3xs text-muted-foreground line-through">
                    €{product.listPrice!.toFixed(2)}
                  </div>
                )}
                <p className="text-3xs text-muted-foreground truncate mt-0.5">
                  {product.title}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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
    <div className="px-(--page-inset) pt-3 pb-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-foreground">{categoryName}</h2>
        <span className="text-xs text-muted-foreground">({productCount})</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onFiltersClick}
          className="flex items-center gap-1 h-7 px-2 border border-border/60 rounded-full text-2xs font-medium active:bg-muted"
        >
          <SlidersHorizontal className="size-3" />
          {locale === "bg" ? "Филтри" : "Filters"}
        </button>
        <button
          type="button"
          onClick={onSortClick}
          className="flex items-center gap-1 h-7 px-2 border border-border/60 rounded-full text-2xs font-medium active:bg-muted"
        >
          <ArrowUpDown className="size-3" />
          {locale === "bg" ? "Сортирай" : "Sort"}
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Trust Badges
// =============================================================================

function TrustBadgesInline({ locale }: { locale: string }) {
  const badges = [
    { icon: ShieldCheck, label: locale === "bg" ? "Защитени" : "Protected" },
    { icon: Truck, label: locale === "bg" ? "Бърза доставка" : "Fast Shipping" },
    { icon: Tag, label: locale === "bg" ? "Топ цени" : "Best Prices" },
  ]

  return (
    <div className="mx-(--page-inset) my-4 flex items-center justify-between py-3 px-3 bg-muted/30 rounded-lg border border-border/30">
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
// Main Component
// =============================================================================

export function MobileHomeUnified({
  initialProducts,
  promotedProducts,
  initialCategories,
  locale,
  user,
}: MobileHomeUnifiedProps) {
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

  // Hide the main site header on mobile to avoid duplicate headers.
  // This component renders its own unified header with search + category pills.
  useEffect(() => {
    const siteHeader = document.querySelector('body > div > header')
    if (!(siteHeader instanceof HTMLElement)) return

    const previousDisplay = siteHeader.style.display
    const mql = window.matchMedia('(max-width: 767px)')

    const sync = () => {
      siteHeader.style.display = mql.matches ? 'none' : previousDisplay
    }

    sync()
    mql.addEventListener?.('change', sync)

    return () => {
      mql.removeEventListener?.('change', sync)
      siteHeader.style.display = previousDisplay
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Header: Hamburger + Logo + Search + Category Pills */}
      <UnifiedMobileHeader
        categories={initialCategories}
        activeCategory={nav.activeTab}
        onCategorySelect={nav.handleTabChange}
        onSearchOpen={() => setSearchOpen(true)}
        locale={locale}
        user={user ?? null}
      />

      {/* Search Overlay */}
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />

      {/* Promoted Listings - Only on "All" tab, uses real boosted products from Supabase */}
      {nav.isAllTab && promotedProducts && promotedProducts.length > 0 && (
        <PromotedListingsStrip products={promotedProducts} locale={locale} />
      )}

      {/* Filter/Sort Bar */}
      <InlineFilterSortBar
        locale={locale}
        onFiltersClick={() => setFilterHubOpen(true)}
        onSortClick={() => setSortModalOpen(true)}
        productCount={nav.activeFeed.products.length}
        categoryName={categoryName}
      />

      {/* Product Feed */}
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

      {/* FilterHub Drawer */}
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
