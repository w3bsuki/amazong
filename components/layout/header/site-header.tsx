"use client"

// Modular dropdown components
import {
  AccountDropdown,
  MessagesDropdown,
  NotificationsDropdown,
  LocaleDeliveryDropdown,
  WishlistDropdown,
} from "@/components/dropdowns"

// Navigation components
import { CategorySubheader } from "@/components/navigation/category-subheader"

// Other components
// V2 hamburger menu - cleaner layout, language selector moved to settings section
import { SidebarMenuV2 as SidebarMenu, type UserListingStats } from "@/components/layout/sidebar/sidebar-menu-v2"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { CartDropdown } from "@/components/layout/header/cart/cart-dropdown"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { DesktopSearch } from "@/components/desktop/desktop-search"
import { Button } from "@/components/ui/button"
import { MagnifyingGlass, CaretLeft, Camera } from "@phosphor-icons/react"

// Utilities
import { getCountryName } from "@/lib/geolocation"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"

import { User } from "@supabase/supabase-js"
import type { CategoryTreeNode } from "@/lib/category-tree"

interface SiteHeaderProps {
  user: User | null
  categories: CategoryTreeNode[]
  hideSubheader?: boolean
  /** Hide entire header on mobile (< lg breakpoint) */
  hideOnMobile?: boolean
  /** Hide entire header on desktop (>= md breakpoint) */
  hideOnDesktop?: boolean
  /**
   * Header rendering variant.
   * - default: full header (search + menus)
   * - product: product detail UX (back button, no search)
   * - landing: homepage style - no bottom border, integrates with content
   */
  variant?: "default" | "product" | "landing"
  /** User listing stats for hamburger menu footer (active + boosted listings) */
  userStats?: UserListingStats
}

export function SiteHeader({ user, categories, hideSubheader = false, hideOnMobile = false, hideOnDesktop = false, variant = "default", userStats }: SiteHeaderProps) {
  const [country, setCountry] = useState("Bulgaria")
  const [, setCountryCode] = useState("BG") // Used for shipping zone filtering
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const pathname = usePathname()
  const isSubheaderEnabled = false
  const router = useRouter()

  const pathWithoutLocale = (() => {
    const segments = pathname.split("/").filter(Boolean)
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return "/" + segments.join("/")
  })()

  // Keep the desktop category subheader visible on the categories INDEX (/categories),
  // but hide it on category browsing/detail routes (/categories/...) and product pages.
  const isCategoryDetailRoute = pathWithoutLocale.startsWith("/categories/")

  // Product pages get special UX: back button instead of hamburger, no search bar.
  // Avoid heuristics (like segment counts) and rely on the route-group layout passing variant="product".
  const isProductPage = variant === "product"
  // Landing page: homepage gets seamless header (no bottom border)
  // Detect via pathname - "/" is homepage
  const isLandingPage = variant === "landing" || pathWithoutLocale === "/"
  
  // Homepage uses IntegratedDesktopLayout which has its own header (SlimTopBar).
  // Hide main header on desktop when on homepage to avoid double headers.
  const hideDesktopOnHomepage = isLandingPage

  const searchPlaceholder = locale === "bg"
    ? "Търсене..."
    : "Search essentials..."

  useEffect(() => {
    // Mark the header as hydrated so E2E can safely interact with client handlers
    // without racing Next.js partial hydration boundaries.
    headerRef.current?.setAttribute('data-hydrated', 'true')
  }, [])

  useEffect(() => {
    // Simple cookie parser
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
      return undefined
    }
    const code = getCookie("user-country")
    if (code) {
      setCountryCode(code)
      setCountry(getCountryName(code, locale))
    }
  }, [locale])

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full flex flex-col bg-header-bg",
        // Landing page: no border, seamless with content
        // Default/Product: border on desktop
        !isLandingPage && "md:border-b md:border-header-border",
        hideOnMobile && "hidden",
        // Homepage uses IntegratedDesktopLayout with its own header
        (hideOnDesktop || hideDesktopOnHomepage) && "md:hidden",
      )}
    >
      {/* Mobile Header + Search - Treido native iOS pattern - visible on mobile only */}
      <div className="md:hidden bg-background/90 backdrop-blur-md border-b border-border/50 text-foreground pt-safe">
        {/* Top row - Logo & Actions */}
        <div className={cn(
          "h-12 px-1 flex items-center",
          isProductPage && "border-b border-border/50"
        )}>
          {/* Back button on product pages, hamburger menu elsewhere - -ml-2 pulls icon to 4px edge */}
          {isProductPage ? (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-10 -ml-2 rounded-full text-muted-foreground active:opacity-50 touch-action-manipulation tap-transparent"
              aria-label={locale === 'bg' ? 'Назад' : 'Go back'}
            >
              <CaretLeft size={24} weight="bold" />
            </button>
          ) : (
            <SidebarMenu user={user} categories={categories} triggerClassName="-ml-2" {...(userStats && { userStats })} />
          )}
          <Link href="/" className="flex items-center shrink-0 -ml-1">
            <span className="text-lg font-extrabold tracking-tighter leading-none text-foreground">treido.</span>
          </Link>
          <div className="flex-1" />
          {/* Mobile: wishlist + notifications + cart - -mr-1 gives badge room, negative margins tighten gap */}
          <div className="flex items-center shrink-0 -mr-1">
            {user && <NotificationsDropdown user={user} />}
            <div className="-mr-1">
              <MobileWishlistButton />
            </div>
            <div className="-ml-1">
              <MobileCartDropdown />
            </div>
          </div>
        </div>

        {/* Search bar row */}
        {!isProductPage && (
          <div className="px-1 pb-1.5">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className={cn(
                "w-full flex items-center gap-2 h-10 px-3 rounded-md",
                "bg-muted/50 border border-border/40",
                "text-muted-foreground text-sm text-left",
                "active:bg-muted/80",
                "touch-action-manipulation tap-transparent"
              )}
              aria-label={searchPlaceholder}
              aria-haspopup="dialog"
              aria-expanded={isMobileSearchOpen}
            >
              <MagnifyingGlass size={18} weight="regular" className="text-muted-foreground shrink-0" />
              <span className="flex-1 truncate font-normal">{searchPlaceholder}</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Overlay - rendered at root level for proper full-screen coverage */}
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={isMobileSearchOpen}
        onOpenChange={setIsMobileSearchOpen}
      />

      {/* Desktop Top Header - visible on md+ screens */}
      <div className="hidden md:block bg-header-bg text-header-text">
        <div className="container grid grid-cols-[auto_1fr_auto] items-center h-14 md:h-16 gap-3">
          {/* Left Section - Logo + Location */}
          <div className="flex items-center gap-2">
            <Link href="/" prefetch={true} className="flex items-center shrink-0 outline-none" aria-label={locale === "bg" ? "Начало" : "Home"}>
              <span className="text-2xl font-bold tracking-tight leading-none text-header-text">treido.</span>
            </Link>
            <div className="hidden lg:block">
              <AccountDropdown user={user} variant="full" />
            </div>
          </div>

          {/* Search Bar - Hidden on product pages */}
          {!isProductPage && (
            <div className="flex justify-center px-2 lg:px-4">
              <div className="w-full max-w-(--container-header-content)">
                <DesktopSearch />
              </div>
            </div>
          )}

          {/* Right Actions - Conditional based on auth state */}
          <div className="flex items-center justify-end gap-0.5">
            {user ? (
              <>
                <div className="hidden md:block">
                  <WishlistDropdown />
                </div>

                <div className="hidden md:block">
                  <MessagesDropdown user={user} />
                </div>

                <div className="hidden md:block">
                  <NotificationsDropdown user={user} />
                </div>

                <div className="hidden md:block">
                  <Link href="/sell" aria-label={locale === "bg" ? "Създай обява" : "Create listing"} title={locale === "bg" ? "Продай" : "Sell"}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 [&_svg]:size-6 border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative"
                    >
                      <span className="sr-only">{locale === "bg" ? "Продай" : "Sell"}</span>
                      <Camera weight="regular" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>

                {/* Account - With Dropdown */}
                <div className="hidden md:block lg:hidden">
                  <AccountDropdown user={user} />
                </div>

                {/* Cart - With Dropdown */}
                <div className="hidden md:block">
                  <CartDropdown />
                </div>
              </>
            ) : (
              <>
                {/* Unauthenticated: Show Sign In / Register buttons + Cart */}
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-header-text hover:bg-header-hover px-3 py-2 rounded-md transition-colors"
                  >
                    {t('signIn')}
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="text-sm font-medium bg-cta-secondary text-cta-secondary-text hover:bg-cta-secondary-hover px-4 py-2 rounded-md transition-colors"
                  >
                    {t('register')}
                  </Link>
                  <Link href="/sell" aria-label={locale === "bg" ? "Създай обява" : "Create listing"} title={locale === "bg" ? "Продай" : "Sell"}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 [&_svg]:size-6 border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative"
                    >
                      <span className="sr-only">{locale === "bg" ? "Продай" : "Sell"}</span>
                      <Camera weight="regular" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>

                {/* Cart - Always visible even when logged out */}
                <div className="hidden md:block">
                  <CartDropdown />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Subheader - Hide on category detail/product pages (eBay/Target pattern) */}
      {isSubheaderEnabled && !isCategoryDetailRoute && !isProductPage && !hideSubheader && (
        <nav className="hidden sm:block bg-header-nav-bg text-sm border-t border-border/50 relative">
          <div className="container text-header-text">
            {/* Mobile/Tablet: Quick Links with Sidebar Menu */}
            <div className="lg:hidden">
              <div className="w-full flex items-center gap-0.5 overflow-x-auto no-scrollbar">
                <SidebarMenu user={user} categories={categories} {...(userStats && { userStats })} />
                <Link href="/todays-deals" prefetch={true} className="text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('todaysDeals')}</Link>
                <Link href="/customer-service" className="text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('customerService')}</Link>
                <Link href="/registry" className="text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('registry')}</Link>
                <Link href="/gift-cards" className="text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('giftCards')}</Link>
                <Link href="/sell" className="font-normal text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('sell')}</Link>
              </div>
            </div>

            {/* Desktop: Categories fill container width */}
            <div className="hidden lg:block">
              <CategorySubheader categories={categories} />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
