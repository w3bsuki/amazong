"use client"

// Modular dropdown components
import {
  AccountDropdown,
  NotificationsDropdown,
  LocaleDeliveryDropdown,
  WishlistDropdown,
} from "@/components/dropdowns"

// Navigation components
import { CategorySubheader } from "@/components/navigation/category-subheader"

// Other components
// V2 hamburger menu - cleaner layout, language selector moved to settings section
import { SidebarMenuV2 as SidebarMenu } from "@/components/layout/sidebar/sidebar-menu-v2"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { CartDropdown } from "@/components/layout/header/cart/cart-dropdown"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { DesktopSearch } from "@/components/desktop/desktop-search"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ScanLine } from "lucide-react"
import { Camera } from "@phosphor-icons/react"

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
  /**
   * Header rendering variant.
   * - default: full header (search + menus)
   * - product: product detail UX (back button, no search)
   */
  variant?: "default" | "product"
}

export function SiteHeader({ user, categories, hideSubheader = false, hideOnMobile = false, variant = "default" }: SiteHeaderProps) {
  const [country, setCountry] = useState("Bulgaria")
  const [, setCountryCode] = useState("BG") // Used for shipping zone filtering
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const pathWithoutLocale = (() => {
    const segments = pathname.split("/").filter(Boolean)
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return "/" + segments.join("/")
  })()

  // Product pages get special UX: back button instead of hamburger, no search bar.
  // Avoid heuristics (like segment counts) and rely on the route-group layout passing variant="product".
  const isProductPage = variant === "product"

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
        "sticky top-0 z-50 w-full flex flex-col bg-header-bg md:border-b md:border-header-border",
        hideOnMobile && "hidden",
        // Force hide on category pages to prevent double header (Contextual Header takes over)
        pathWithoutLocale.startsWith("/categories") && "hidden"
      )}
    >
      {/* Mobile Header + Search - Treido native iOS pattern - visible on mobile only */}
      <div className="md:hidden bg-background/90 backdrop-blur-md border-b border-border/50 text-foreground pt-safe">
        {/* Top row - Logo & Actions - h-12 touch-friendly */}
        <div className={cn(
          "h-12 px-(--page-inset) flex items-center gap-0",
          isProductPage && "border-b border-border/50"
        )}>
          {/* Back button on product pages, hamburger menu elsewhere */}
          {isProductPage ? (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-touch w-touch rounded-full text-muted-foreground active:opacity-50"
              aria-label={locale === 'bg' ? 'Назад' : 'Go back'}
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
          ) : (
            <SidebarMenu user={user} categories={categories} triggerClassName="justify-start" />
          )}
          <Link href="/" className={cn(
            "flex items-center shrink-0 h-10 -ml-4",
            isProductPage && "ml-0"
          )}>
            <span className="text-xl font-extrabold tracking-tighter leading-none text-foreground">treido.</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center">
            {user && <NotificationsDropdown user={user} />}
            <MobileWishlistButton />
            <MobileCartDropdown />
          </div>
        </div>

        {/* Search bar row */}
        {!isProductPage && (
          <div className="px-(--page-inset) pb-2 pt-0">
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
              <Search size={18} className="text-muted-foreground shrink-0" />
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
          <div className="flex items-center gap-1">
            <Link href="/" prefetch={true} className="flex items-center shrink-0 outline-none">
              <span className="text-xl font-semibold tracking-tight leading-none text-header-text">treido.</span>
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
                  <NotificationsDropdown user={user} />
                </div>

                <div className="hidden md:block">
                  <Link href="/sell" aria-label={locale === "bg" ? "Създай обява" : "Create listing"} title={locale === "bg" ? "Продай" : "Sell"}>
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative"
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
                      size="icon-lg"
                      className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative"
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

      {/* Category Subheader - Hide on category/product pages (eBay/Target pattern) */}
      {!pathWithoutLocale.startsWith("/categories") && !isProductPage && !hideSubheader && (
        <nav className="hidden sm:block bg-header-nav-bg text-sm border-t border-border/50 relative">
          <div className="container text-foreground">
            {/* Mobile/Tablet: Quick Links with Sidebar Menu */}
            <div className="lg:hidden">
              <div className="w-full flex items-center gap-0.5 overflow-x-auto no-scrollbar">
                <SidebarMenu user={user} categories={categories} />
                <Link href="/todays-deals" prefetch={true} className="text-foreground hover:text-primary hover:bg-muted min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('todaysDeals')}</Link>
                <Link href="/customer-service" className="text-foreground hover:text-primary hover:bg-muted min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('customerService')}</Link>
                <Link href="/registry" className="text-foreground hover:text-primary hover:bg-muted min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('registry')}</Link>
                <Link href="/gift-cards" className="text-foreground hover:text-primary hover:bg-muted min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('giftCards')}</Link>
                <Link href="/sell" className="font-normal text-foreground hover:text-primary hover:bg-muted min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('sell')}</Link>
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
