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
import { SidebarMenu } from "@/components/layout/sidebar/sidebar-menu"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { CartDropdown } from "@/components/layout/header/cart/cart-dropdown"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/common/wishlist/mobile-wishlist-button"
import { DesktopSearch } from "@/components/desktop/desktop-search"
import { Button } from "@/components/ui/button"
import { MagnifyingGlass, Camera, CaretLeft } from "@phosphor-icons/react"

// Utilities
import { getCountryName } from "@/lib/geolocation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"

import { User } from "@supabase/supabase-js"

interface SiteHeaderProps {
  user: User | null
  hideSubheader?: boolean
}

export function SiteHeader({ user, hideSubheader = false }: SiteHeaderProps) {
  const [country, setCountry] = useState("Bulgaria")
  const [, setCountryCode] = useState("BG") // Used for shipping zone filtering
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  
  // Product pages get special mobile UX: back button instead of hamburger, no search bar
  const isProductPage = pathname.startsWith("/product/") || hideSubheader
  
  const searchPlaceholder = locale === "bg" 
    ? "Търсене..." 
    : "Search essentials..."

  useEffect(() => {
    // Simple cookie parser
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
    }
    const code = getCookie("user-country")
    if (code) {
      setCountryCode(code)
      setCountry(getCountryName(code, locale))
    }
  }, [locale])

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-header-bg">
      {/* Mobile Header + Search - Unified container like Target */}
      <div className="md:hidden bg-header-bg text-header-text">
        {/* Top row - Logo & Actions */}
        <div className={cn(
          "px-1.5 py-1 flex items-center",
          isProductPage && "border-b border-header-border/50"
        )}>
          {/* Back button on product pages, hamburger menu elsewhere */}
          {isProductPage ? (
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center h-touch w-touch -ml-1 rounded-full text-header-text hover:bg-header-hover active:bg-header-active"
              aria-label={locale === 'bg' ? 'Назад' : 'Go back'}
            >
              <CaretLeft size={20} weight="bold" />
            </button>
          ) : (
            <SidebarMenu user={user} triggerClassName="justify-start pl-2 pr-3" />
          )}
          <Link href="/" className={cn(
            "flex items-center shrink-0 min-h-touch px-0",
            isProductPage ? "ml-1" : "ml-0"
          )}>
            <span className="text-xl font-bold tracking-tight text-header-text">AMZN</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-0.5">
            {user && <NotificationsDropdown user={user} />}
            <MobileWishlistButton />
            <MobileCartDropdown />
          </div>
        </div>
        
        {/* Search bar row - integrated into header, hidden on product pages */}
        {!isProductPage && (
        <div className="px-3 pb-1.5">
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className={cn(
              "w-full flex items-center gap-2 h-touch px-3.5 rounded-lg",
              "bg-background",
              "text-muted-foreground text-sm text-left",
              "active:bg-muted",
              "touch-action-manipulation tap-transparent"
            )}
            aria-label={searchPlaceholder}
            aria-haspopup="dialog"
            aria-expanded={isMobileSearchOpen}
          >
            <MagnifyingGlass size={18} weight="regular" className="text-muted-foreground/60 shrink-0" />
            <span className="flex-1 truncate font-normal">{searchPlaceholder}</span>
            <div className="flex items-center gap-2 shrink-0">
              <Camera size={18} weight="regular" className="text-muted-foreground/40" />
            </div>
          </button>
        </div>
        )}
        
        {/* Search Overlay - controlled by header */}
        <MobileSearchOverlay 
          hideDefaultTrigger 
          externalOpen={isMobileSearchOpen} 
          onOpenChange={setIsMobileSearchOpen} 
        />
      </div>

      {/* Desktop Top Header - CSS Grid for stable search bar alignment */}
      <div className="hidden md:block bg-header-bg text-header-text">
        <div className="container grid grid-cols-[auto_1fr_auto] items-center h-14 md:h-16 gap-3">
          {/* Left Section - Logo + Location */}
          <div className="flex items-center gap-1">
            <Link href="/" prefetch={true} className="flex items-center shrink-0 outline-none">
              <span className="text-xl font-bold tracking-tight text-header-text">AMZN</span>
            </Link>
            <div className="hidden lg:block">
              <LocaleDeliveryDropdown
                pathname={pathname || "/"}
                country={country}
                onCountryChange={(code, name) => {
                  setCountryCode(code)
                  setCountry(name)
                }}
              />
            </div>
          </div>

          {/* Search Bar - Fixed grid column, doesn't shift */}
          <div className="flex justify-center px-2 lg:px-4">
            <div className="w-full max-w-(--container-header-content)">
              <DesktopSearch />
            </div>
          </div>

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
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-xl"
                    className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative [&_svg]:size-6"
                  >
                    <Link href="/sell" aria-label={locale === "bg" ? "Създай обява" : "Create listing"} title={locale === "bg" ? "Продай" : "Sell"}>
                      <span className="sr-only">{locale === "bg" ? "Продай" : "Sell"}</span>
                      <Camera weight="regular" className="scale-110" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>

                {/* Account - With Dropdown */}
                <div className="hidden md:block">
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
                    className="text-sm font-medium bg-cta-secondary text-cta-secondary-text hover:bg-cta-secondary-hover px-4 py-2 rounded-md transition-colors shadow-sm"
                  >
                    {t('register')}
                  </Link>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-xl"
                    className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative [&_svg]:size-6"
                  >
                    <Link href="/sell" aria-label={locale === "bg" ? "Създай обява" : "Create listing"} title={locale === "bg" ? "Продай" : "Sell"}>
                      <span className="sr-only">{locale === "bg" ? "Продай" : "Sell"}</span>
                      <Camera weight="regular" className="scale-110" aria-hidden="true" />
                    </Link>
                  </Button>
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
      {!pathname.startsWith("/categories") && !pathname.startsWith("/product") && !hideSubheader && (
        <nav className="hidden sm:block bg-header-bg text-sm border-t border-header-text/15 relative">
          <div className="container text-header-text">
            {/* Mobile/Tablet: Quick Links with Sidebar Menu */}
            <div className="lg:hidden">
              <div className="w-full flex items-center gap-0.5 overflow-x-auto no-scrollbar">
                <SidebarMenu user={user} />
                <Link href="/todays-deals" prefetch={true} className="text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('todaysDeals')}</Link>
                <Link href="/customer-service" className="text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('customerService')}</Link>
                <Link href="/registry" className="text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('registry')}</Link>
                <Link href="/gift-cards" className="text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('giftCards')}</Link>
                <Link href="/sell" className="font-normal text-header-text hover:text-header-text hover:bg-header-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('sell')}</Link>
              </div>
            </div>
            
            {/* Desktop: Categories fill container width */}
            <div className="hidden lg:block">
              <CategorySubheader />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
