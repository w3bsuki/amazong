"use client"

import { AccountDropdown, CartDropdown, OrdersDropdown, SellingDropdown, LocationDropdown, MessagesDropdown } from "@/components/header-dropdowns"
import { SidebarMenu } from "@/components/sidebar-menu"
import { MegaMenu } from "@/components/mega-menu"
import { CategorySubheader } from "@/components/category-subheader"
import { MobileSearchOverlay } from "@/components/mobile-search-overlay"
import { MobileCartDropdown } from "@/components/mobile-cart-dropdown"
import { DesktopSearch } from "@/components/desktop-search"
import { getCountryName } from "@/lib/geolocation"
import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Plus } from "@phosphor-icons/react"

import { User } from "@supabase/supabase-js"

interface SiteHeaderProps {
  user: User | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [country, setCountry] = useState("Bulgaria")
  const [, setCountryCode] = useState("BG") // Used for shipping zone filtering
  const t = useTranslations('Navigation')
  const locale = useLocale()

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
    <header className="sticky top-0 z-50 w-full flex flex-col border-b border-header-border bg-header-bg">
      {/* Mobile Header - Shows only on mobile */}
      <div className="md:hidden bg-header-bg text-header-text px-2 py-1.5 flex items-center">
        <SidebarMenu user={user} />
        <Link href="/" className="flex items-center shrink-0 min-h-11">
          <span className="text-xl font-bold tracking-tight text-foreground">AMZN</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-0">
          <MobileSearchOverlay />
          {/* Sell/List Button */}
          <Link 
            href="/sell" 
            className="flex items-center justify-center size-11 rounded-lg text-header-text hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent"
            aria-label={t('sell')}
          >
            <Plus size={24} weight="regular" />
          </Link>
          <MobileCartDropdown />
        </div>
      </div>

      {/* Desktop Top Header - Light/White like eBay */}
      <div className="hidden md:block text-header-text">
        <div className="container flex items-center h-14 md:h-16 gap-3">
          {/* Logo - Dark text on light background */}
          <Link href="/" prefetch={true} className="flex items-center shrink-0 hover:opacity-80 outline-none focus:ring-2 focus:ring-brand/30 rounded-sm py-1 min-h-11">
            <span className="text-xl font-bold tracking-tight text-foreground">AMZN</span>
          </Link>

          {/* Deliver to */}
          <LocationDropdown 
            country={country} 
            onCountryChange={(code, name) => {
              setCountryCode(code)
              setCountry(name)
            }}
          />

          {/* Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Account Dropdown - LEFT of search bar */}
          <div className="hidden md:block">
            <AccountDropdown user={user} />
          </div>

          {/* Search Bar - Desktop only - CENTERED, TAKES REMAINING SPACE */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="w-full max-w-2xl">
              <DesktopSearch />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
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

            {/* Cart - With Dropdown on Desktop */}
            <div className="hidden md:block">
              <CartDropdown />
            </div>
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
