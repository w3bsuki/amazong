"use client"

// =============================================================================
// UNIFIED SITE HEADER
//
// Single source of truth for all header variants across the app.
// Auto-detects route via usePathname() and renders appropriate variant.
//
// Variants:
// - default:    Standard pages (hamburger + logo + search below + actions)
// - homepage:   Homepage (inline search + category pills on mobile)
// - product:    Product pages (back + seller + share on mobile)
// - contextual: Category browsing (back + title + subcategory circles)
// - minimal:    Auth/checkout (just logo)
// =============================================================================

import {
  AccountDropdown,
  MessagesDropdown,
  NotificationsDropdown,
  WishlistDropdown,
} from "@/components/dropdowns"
import { SidebarMenuV2 as SidebarMenu, type UserListingStats } from "@/components/layout/sidebar/sidebar-menu-v2"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { CartDropdown } from "@/components/layout/header/cart/cart-dropdown"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { DesktopSearch } from "@/components/desktop/desktop-search"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CategoryNavItem } from "@/components/mobile/category-nav"
import { getCategoryIcon } from "@/lib/category-icons"
import { getCategoryShortName } from "@/lib/category-display"
import { MagnifyingGlass, CaretLeft, Camera, ArrowLeft, ShareNetwork } from "@phosphor-icons/react"
import { cn, safeAvatarSrc } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Link, useRouter, usePathname } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import type { User } from "@supabase/supabase-js"
import type { CategoryTreeNode } from "@/lib/category-tree"

// =============================================================================
// Types
// =============================================================================

export type HeaderVariant = "default" | "homepage" | "product" | "contextual" | "minimal"

export interface SiteHeaderProps {
  /** Header rendering variant */
  variant?: HeaderVariant
  /** Authenticated user */
  user: User | null
  /** Categories for navigation */
  categories?: CategoryTreeNode[]
  /** User listing stats for hamburger menu footer */
  userStats?: UserListingStats
  
  // Homepage variant props
  /** Active category slug for homepage pills */
  activeCategory?: string
  /** Callback when category pill is selected */
  onCategorySelect?: (slug: string) => void
  /** Callback to open search overlay */
  onSearchOpen?: () => void
  
  // Product variant props
  /** Product title for product header */
  productTitle?: string | null
  /** Seller name for product header */
  sellerName?: string | null
  /** Seller username for profile link */
  sellerUsername?: string | null
  /** Seller avatar URL */
  sellerAvatarUrl?: string | null
  
  // Contextual variant props
  /** Title for contextual header (category name) */
  contextualTitle?: string
  /** Back href for contextual header */
  contextualBackHref?: string
  /** Back handler for instant navigation */
  onContextualBack?: () => void
  /** Subcategories for contextual circles */
  contextualSubcategories?: CategoryTreeNode[]
  /** Callback when subcategory circle is clicked */
  onSubcategoryClick?: (cat: CategoryTreeNode) => void
  
  // Legacy props (for gradual migration)
  hideSubheader?: boolean
  hideOnMobile?: boolean
  hideOnDesktop?: boolean
}

// =============================================================================
// Route Detection Helper
// =============================================================================

type RouteConfig = {
  variant: HeaderVariant
  /** Skip mobile rendering - page will render its own header with context */
  skipMobile?: boolean
}

function detectRouteConfig(pathname: string, explicitVariant?: HeaderVariant): RouteConfig {
  // If explicit variant is provided, use it
  if (explicitVariant) {
    return { variant: explicitVariant }
  }
  
  // Strip locale prefix (e.g., /en, /bg)
  const pathWithoutLocale = pathname.replace(/^\/(en|bg)/, "") || "/"
  
  // Homepage: / or empty
  // Skip mobile because MobileHome renders its own header with interactive category pills
  if (pathWithoutLocale === "/" || pathWithoutLocale === "") {
    return { variant: "homepage", skipMobile: true }
  }
  
  // Categories: /categories or /categories/* 
  // Skip mobile because MobileCategoryBrowser renders its own contextual header with category context
  if (pathWithoutLocale.startsWith("/categories")) {
    return { variant: "contextual", skipMobile: true }
  }
  
  // Product pages: /{username}/{productSlug} (2+ segments, not a known route)
  // Known routes start with: /search, /cart, /checkout, /account, /sell, /plans, /auth
  const segments = pathWithoutLocale.split("/").filter(Boolean)
  const knownRoutes = ["search", "cart", "checkout", "account", "sell", "plans", "auth", "categories", "api"]
  if (segments.length >= 2 && segments[0] && !knownRoutes.includes(segments[0])) {
    return { variant: "product" }
  }
  
  // Default for everything else
  return { variant: "default" }
}

// =============================================================================
// Main Component
// =============================================================================

export function SiteHeader({
  variant: explicitVariant,
  user,
  categories = [],
  userStats,
  // Homepage props
  activeCategory = "all",
  onCategorySelect,
  onSearchOpen,
  // Product props
  productTitle,
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
  // Contextual props
  contextualTitle,
  contextualBackHref = "/categories",
  onContextualBack,
  contextualSubcategories = [],
  onSubcategoryClick,
  // Legacy
  hideSubheader = false,
  hideOnMobile = false,
  hideOnDesktop = false,
}: SiteHeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const pillsRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("Navigation")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  
  // Auto-detect route config from pathname
  const routeConfig = detectRouteConfig(pathname, explicitVariant)
  const variant = routeConfig.variant
  const skipMobileHeader = routeConfig.skipMobile ?? false

  const searchPlaceholder = locale === "bg" ? "Търсене..." : "Search..."
  const allLabel = locale === "bg" ? "Всички" : "All"

  // Mark header as hydrated for E2E tests
  useEffect(() => {
    headerRef.current?.setAttribute("data-hydrated", "true")
  }, [])

  // Scroll active pill into view (homepage variant)
  useEffect(() => {
    if (variant !== "homepage") return
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
  }, [variant, activeCategory])

  // Handle search open
  const handleSearchOpen = () => {
    if (onSearchOpen) {
      onSearchOpen()
    } else {
      setIsMobileSearchOpen(true)
    }
  }

  // Handle share (product variant)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: window.location.href })
      } catch {
        // User cancelled
      }
    }
  }

  // ==========================================================================
  // MOBILE HEADER VARIANTS
  // ==========================================================================

  const renderMobileHeader = () => {
    switch (variant) {
      case "homepage":
        return <MobileHomepageHeader />
      case "product":
        return <MobileProductHeader />
      case "contextual":
        return <MobileContextualHeader />
      case "minimal":
        return <MobileMinimalHeader />
      default:
        return <MobileDefaultHeader />
    }
  }

  // Mobile Default: Hamburger + Logo + (space) + Actions, Search row below
  function MobileDefaultHeader() {
    return (
      <div className="md:hidden bg-background/90 backdrop-blur-md border-b border-border/50 text-foreground pt-safe">
        <div className="h-12 px-1 flex items-center">
          <SidebarMenu user={user} categories={categories} triggerClassName="-ml-2" {...(userStats && { userStats })} />
          <Link href="/" className="flex items-center shrink-0 -ml-1">
            <span className="text-lg font-extrabold tracking-tighter leading-none text-foreground">treido.</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center shrink-0 -mr-1">
            {user && <NotificationsDropdown user={user} />}
            <div className="-mr-1"><MobileWishlistButton /></div>
            <div className="-ml-1"><MobileCartDropdown /></div>
          </div>
        </div>
        <div className="px-1 pb-1.5">
          <button
            onClick={handleSearchOpen}
            className={cn(
              "w-full flex items-center gap-2 h-10 px-3 rounded-md",
              "bg-muted/50 border border-border/40",
              "text-muted-foreground text-sm text-left",
              "active:bg-muted/80 touch-action-manipulation tap-transparent"
            )}
            aria-label={searchPlaceholder}
            aria-haspopup="dialog"
          >
            <MagnifyingGlass size={18} weight="regular" className="text-muted-foreground shrink-0" />
            <span className="flex-1 truncate font-normal">{searchPlaceholder}</span>
          </button>
        </div>
      </div>
    )
  }

  // Mobile Homepage: Hamburger + Logo + Inline Search + Actions, Category Pills below
  function MobileHomepageHeader() {
    return (
      <div className="md:hidden bg-background/95 backdrop-blur-md pt-safe">
        <div className="h-12 px-1 flex items-center">
          <SidebarMenu user={user} categories={categories} triggerClassName="-ml-2" {...(userStats && { userStats })} />
          <Link href="/" className="shrink-0 -ml-1">
            <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
          </Link>
          <button
            type="button"
            onClick={handleSearchOpen}
            className={cn(
              "flex-1 min-w-0 flex items-center gap-1.5 h-9 ml-2 px-3 rounded-full",
              "bg-muted/50 border border-border/30",
              "text-muted-foreground text-sm text-left",
              "active:bg-muted/70 transition-colors"
            )}
            aria-label={searchPlaceholder}
            aria-haspopup="dialog"
          >
            <MagnifyingGlass size={16} weight="regular" className="text-muted-foreground shrink-0" />
            <span className="flex-1 truncate font-normal text-xs">{searchPlaceholder}</span>
          </button>
          <div className="flex items-center shrink-0 -mr-1">
            <div className="-mr-1"><MobileWishlistButton /></div>
            <div className="-ml-1"><MobileCartDropdown /></div>
          </div>
        </div>
        {/* Category Pills */}
        <div ref={pillsRef} className="overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 px-1">
            <CategoryNavItem
              onClick={() => onCategorySelect?.("all")}
              isActive={activeCategory === "all"}
              variant="pill"
              data-slug="all"
            >
              {getCategoryIcon("all", { size: 14 })}
              <span>{allLabel}</span>
            </CategoryNavItem>
            {categories.map((cat) => (
              <CategoryNavItem
                key={cat.id}
                onClick={() => onCategorySelect?.(cat.slug)}
                isActive={activeCategory === cat.slug}
                variant="pill"
                data-slug={cat.slug}
              >
                {getCategoryIcon(cat.slug, { size: 14 })}
                <span>{getCategoryShortName(cat, locale)}</span>
              </CategoryNavItem>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Mobile Product: Back + Seller Avatar + Title + Share
  function MobileProductHeader() {
    const sellerInitials = (sellerName || sellerUsername || "?").slice(0, 2).toUpperCase()
    const profileHref = sellerUsername ? `/${sellerUsername}` : "#"
    const tProduct = useTranslations("Product")

    return (
      <div className="md:hidden bg-background/90 backdrop-blur-md border-b border-border/50 pt-safe">
        <div className="h-12 flex items-center gap-2 px-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            aria-label={tProduct("back")}
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <Link href={profileHref} className="shrink-0">
              <Avatar className="size-7 border border-border">
                <AvatarImage src={safeAvatarSrc(sellerAvatarUrl)} alt={sellerName || tProduct("seller")} />
                <AvatarFallback className="text-2xs font-medium bg-muted">{sellerInitials}</AvatarFallback>
              </Avatar>
            </Link>
            {productTitle && (
              <span className="text-sm font-medium text-foreground truncate">{productTitle}</span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            aria-label={tProduct("share")}
            onClick={handleShare}
          >
            <ShareNetwork className="size-5" />
          </Button>
        </div>
      </div>
    )
  }

  // Mobile Contextual: Back + Title + Search + Actions, Subcategory circles below
  function MobileContextualHeader() {
    return (
      <div className="md:hidden bg-background pt-safe">
        <div className="flex items-center justify-between px-3 h-12 border-b border-border/50">
          <div className="flex items-center">
            {onContextualBack ? (
              <button
                type="button"
                onClick={onContextualBack}
                className="w-9 h-9 flex items-center justify-center rounded-full -ml-1 tap-highlight-transparent active:bg-muted transition-colors"
                aria-label={locale === "bg" ? "Назад" : "Back"}
              >
                <ArrowLeft className="size-6" weight="bold" />
              </button>
            ) : (
              <Link
                href={contextualBackHref}
                className="w-9 h-9 flex items-center justify-center rounded-full -ml-1 tap-highlight-transparent active:bg-muted transition-colors"
                aria-label={locale === "bg" ? "Назад" : "Back"}
              >
                <ArrowLeft className="size-6" weight="bold" />
              </Link>
            )}
            <h1 className="text-base font-bold text-foreground ml-1 truncate max-w-48">
              {contextualTitle}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="w-9 h-9 flex items-center justify-center rounded-full tap-highlight-transparent active:bg-muted transition-colors"
              aria-label={locale === "bg" ? "Търсене" : "Search"}
            >
              <MagnifyingGlass className="size-6" weight="regular" />
            </Link>
            <MobileWishlistButton />
            <MobileCartDropdown />
          </div>
        </div>
        {/* Subcategory circles */}
        {contextualSubcategories.length > 0 && (
          <div className="bg-background border-b border-border/50">
            <div className="px-4 py-3">
              <div className="flex items-start gap-3 overflow-x-auto no-scrollbar">
                {contextualSubcategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSubcategoryClick?.(cat)}
                    className="flex flex-col items-center gap-1.5 shrink-0 w-[4.5rem] active:opacity-80 transition-opacity"
                  >
                    <div className="size-14 rounded-full bg-muted/50 border border-border/30 overflow-hidden flex items-center justify-center">
                      {getCategoryIcon(cat.slug, { size: 24, className: "text-muted-foreground" })}
                    </div>
                    <span className="text-2xs text-center text-muted-foreground font-medium leading-tight line-clamp-2">
                      {getCategoryShortName(cat, locale)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Mobile Minimal: Just logo
  function MobileMinimalHeader() {
    return (
      <div className="md:hidden bg-background border-b border-border/50 pt-safe">
        <div className="h-12 px-4 flex items-center justify-center">
          <Link href="/">
            <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
          </Link>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // DESKTOP HEADER VARIANTS
  // ==========================================================================

  const renderDesktopHeader = () => {
    // Product pages hide desktop header entirely (use page layout)
    if (variant === "product") return null
    // Minimal shows simplified desktop header
    if (variant === "minimal") return <DesktopMinimalHeader />
    // Homepage and default use similar desktop layout
    return <DesktopStandardHeader />
  }

  // Desktop Standard/Homepage: Logo + Search + Actions
  function DesktopStandardHeader() {
    return (
      <div className="hidden md:block bg-header-bg text-header-text">
        <div className="container h-16 flex items-center justify-between gap-4">
          {/* Left: Logo + Account */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center shrink-0">
              <span className="text-xl font-bold tracking-tight text-header-text">treido.</span>
            </Link>
            <div className="hidden lg:block">
              <AccountDropdown user={user} variant="full" />
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl">
            <DesktopSearch />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-0.5">
            {user ? (
              <>
                <WishlistDropdown />
                <MessagesDropdown user={user} />
                <NotificationsDropdown user={user} />
                <Link href="/sell" aria-label={locale === "bg" ? "Създай обява" : "Create listing"}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 [&_svg]:size-6 border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover"
                  >
                    <Camera weight="regular" />
                  </Button>
                </Link>
                <div className="hidden md:block lg:hidden">
                  <AccountDropdown user={user} />
                </div>
                <CartDropdown />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-header-text hover:bg-header-hover px-3 py-2 rounded-md transition-colors"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="text-sm font-medium bg-cta-secondary text-cta-secondary-text hover:bg-cta-secondary-hover px-4 py-2 rounded-md transition-colors"
                >
                  {t("register")}
                </Link>
                <Link href="/sell" aria-label={locale === "bg" ? "Създай обява" : "Create listing"}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 [&_svg]:size-6 border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover"
                  >
                    <Camera weight="regular" />
                  </Button>
                </Link>
                <CartDropdown />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Desktop Minimal: Just logo centered
  function DesktopMinimalHeader() {
    return (
      <div className="hidden md:block bg-header-bg border-b border-header-border">
        <div className="container h-16 flex items-center justify-center">
          <Link href="/">
            <span className="text-xl font-bold tracking-tight text-header-text">treido.</span>
          </Link>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  // Hide conditions
  const shouldHide = hideOnMobile && hideOnDesktop

  if (shouldHide) return null

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full flex flex-col",
          variant !== "homepage" && variant !== "contextual" && "bg-header-bg",
          (hideOnMobile || skipMobileHeader) && "hidden md:flex md:flex-col",
          hideOnDesktop && "md:hidden"
        )}
      >
        {!skipMobileHeader && renderMobileHeader()}
        {renderDesktopHeader()}
      </header>

      {/* Search Overlay - for variants that use internal search state */}
      {(variant === "default" || !onSearchOpen) && (
        <MobileSearchOverlay
          hideDefaultTrigger
          externalOpen={isMobileSearchOpen}
          onOpenChange={setIsMobileSearchOpen}
        />
      )}
    </>
  )
}
