"use client"

// Modular dropdown components
import {
  AccountDropdown,
  CartDropdown,
  OrdersDropdown,
  SellingDropdown,
  LocationDropdown,
  MessagesDropdown,
} from "@/components/dropdowns"

// Navigation components
import { MegaMenu } from "@/components/navigation/mega-menu"
import { CategorySubheader } from "@/components/navigation/category-subheader"

// Other components
import { SidebarMenu } from "@/components/sidebar-menu"
import { MobileSearchOverlay } from "@/components/mobile-search-overlay"
import { MobileCartDropdown } from "@/components/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/mobile-wishlist-button"
import { DesktopSearch } from "@/components/desktop-search"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MagnifyingGlass, Camera } from "@phosphor-icons/react"

// Utilities
import { getCountryName } from "@/lib/geolocation"
import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"

import { User } from "@supabase/supabase-js"

interface SiteHeaderProps {
  user: User | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [country, setCountry] = useState("Bulgaria")
  const [, setCountryCode] = useState("BG") // Used for shipping zone filtering
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const t = useTranslations('Navigation')
  const locale = useLocale()
  
  const searchPlaceholder = locale === "bg" 
    ? "Какво търсиш днес?" 
    : "What are you looking for?"

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
    <header className="sticky top-0 z-50 w-full flex flex-col bg-background">
      {/* Mobile Header + Search - Unified container like Target */}
      <div className="md:hidden bg-background text-header-text">
        {/* Top row - Logo & Actions */}
        <div className="px-2 py-1 flex items-center">
          <SidebarMenu user={user} />
          <Link href="/" className="flex items-center shrink-0 -ml-2">
            <span className="text-lg font-bold tracking-tight text-foreground">AMZN</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center -mr-1">
            <MobileSearchOverlay />
            <MobileWishlistButton />
            <MobileCartDropdown />
          </div>
        </div>
        
        {/* Search bar row - integrated into header */}
        <div className="px-3 pb-2">
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="w-full flex items-center gap-2 h-10 px-3 rounded-full bg-muted border border-border text-muted-foreground text-sm text-left active:bg-muted/80 transition-colors duration-150"
            aria-label={searchPlaceholder}
            aria-haspopup="dialog"
            aria-expanded={isMobileSearchOpen}
          >
            <MagnifyingGlass size={18} weight="regular" className="text-muted-foreground shrink-0" />
            <span className="flex-1 truncate">{searchPlaceholder}</span>
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-px h-5 bg-border" />
              <Camera size={18} weight="regular" className="text-muted-foreground ml-1" />
            </div>
          </button>
        </div>
        
        {/* Search Overlay - controlled by header */}
        <MobileSearchOverlay 
          hideDefaultTrigger 
          externalOpen={isMobileSearchOpen} 
          onOpenChange={setIsMobileSearchOpen} 
        />
      </div>

      {/* Desktop Top Header - Light/White like eBay */}
      <div className="hidden md:block text-header-text">
        <div className="container flex items-center h-14 md:h-16 gap-3">
          {/* Left Section - Logo + Location + Language */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Logo - Dark text on light background */}
            <Link href="/" prefetch={true} className="flex items-center shrink-0 hover:opacity-80 outline-none focus:ring-2 focus:ring-brand/30 rounded-sm py-1 min-h-11">
              <span className="text-xl font-bold tracking-tight text-foreground">AMZN</span>
            </Link>

            {/* Deliver to - Compact */}
            <div className="hidden lg:block shrink-0">
              <LocationDropdown 
                country={country} 
                onCountryChange={(code, name) => {
                  setCountryCode(code)
                  setCountry(name)
                }}
              />
            </div>

            {/* Language Switcher - Compact */}
            <div className="hidden lg:block shrink-0">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Search Bar - Desktop only - FILLS AVAILABLE SPACE */}
          <div className="hidden md:flex flex-1 min-w-0">
            <DesktopSearch />
          </div>

          {/* Right Actions - Conditional based on auth state */}
          <div className="flex items-center gap-0.5 shrink-0">
            {user ? (
              <>
                {/* Authenticated: Show all icon dropdowns */}
                {/* Orders - With Dropdown */}
                <div className="hidden lg:block">
                  <OrdersDropdown user={user} />
                </div>

                {/* Selling - With Dropdown */}
                <div className="hidden lg:block">
                  <SellingDropdown user={user} />
                </div>

                {/* Messages - With Dropdown */}
                <div className="hidden md:block">
                  <MessagesDropdown user={user} />
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
                    className="text-sm font-medium text-header-text hover:text-brand transition-colors px-3 py-2 rounded-md hover:bg-header-hover"
                  >
                    {t('signIn')}
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="text-sm font-medium bg-brand text-white hover:bg-brand-dark transition-colors px-4 py-2 rounded-md"
                  >
                    {t('register')}
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

      {/* Category Subheader - eBay style with mega menus */}
      <nav className="hidden sm:block bg-subheader-bg text-sm border-t border-header-border relative">
        <div className="container flex items-center text-subheader-text">
          {/* Mobile/Tablet: Sidebar Menu (Sheet) */}
          <div className="md:hidden shrink-0">
            <SidebarMenu user={user} />
          </div>
          
          {/* Desktop: All Categories Mega Menu (Hover) */}
          <div className="hidden md:block shrink-0">
            <MegaMenu />
          </div>

          {/* Separator */}
          <div className="hidden md:block w-px h-5 bg-border/60 mx-1 shrink-0" />
          
          {/* Category Links with Mega Menus - flex-1 to take remaining space */}
          <div className="hidden lg:flex flex-1 min-w-0">
            <CategorySubheader />
          </div>

          {/* Quick Links - Show on smaller screens */}
          <div className="lg:hidden flex items-center gap-0.5 min-w-0 flex-1">
            <Link href="/todays-deals" prefetch={true} className="text-foreground hover:text-brand hover:bg-subheader-hover min-h-10 px-3 flex items-center rounded-sm transition-colors shrink-0">{t('todaysDeals')}</Link>
            <Link href="/customer-service" className="text-foreground hover:text-brand hover:bg-subheader-hover min-h-10 px-3 flex items-center rounded-sm transition-colors shrink-0">{t('customerService')}</Link>
            <Link href="/registry" className="text-foreground hover:text-brand hover:bg-subheader-hover min-h-10 px-3 flex items-center rounded-sm transition-colors shrink-0">{t('registry')}</Link>
            <Link href="/gift-cards" className="text-foreground hover:text-brand hover:bg-subheader-hover min-h-10 px-3 flex items-center rounded-sm transition-colors shrink-0">{t('giftCards')}</Link>
            <Link href="/sell" className="font-normal text-brand hover:text-brand-dark hover:bg-subheader-hover min-h-10 px-3 flex items-center rounded-sm shrink-0">{t('sell')}</Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
