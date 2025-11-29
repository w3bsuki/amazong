"use client"

import { AccountDropdown, CartDropdown, ReturnsOrdersDropdown, LocationDropdown, MessagesDropdown } from "@/components/header-dropdowns"
import { SidebarMenu } from "@/components/sidebar-menu"
import { MegaMenu } from "@/components/mega-menu"
import { MobileSearchV2 } from "@/components/mobile-search-v2"
import { MobileCartDropdown } from "@/components/mobile-cart-dropdown"
import { DesktopSearch } from "@/components/desktop-search"
import { getCountryName } from "@/lib/geolocation"
import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/language-switcher"

import { User } from "@supabase/supabase-js"

interface SiteHeaderProps {
  user: User | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [country, setCountry] = useState("USA")
  const t = useTranslations('Navigation')

  useEffect(() => {
    // Simple cookie parser
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
    }
    const countryCode = getCookie("user-country")
    if (countryCode) {
      setCountry(getCountryName(countryCode))
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col border-b border-header-border bg-header-bg">
      {/* Mobile Header - Shows only on mobile */}
      <div className="md:hidden bg-header-bg text-header-text px-2 py-2 flex items-center">
        <SidebarMenu user={user} />
        <Link href="/" className="flex items-center gap-0.5 shrink-0">
          <span className="text-lg font-bold tracking-tight">AMZN</span>
          <div className="size-1.5 bg-brand rounded-full"></div>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-0.5">
          <MobileSearchV2 />
          <MobileCartDropdown />
        </div>
      </div>

      {/* Desktop Top Header */}
      <div className="hidden md:block text-header-text">
        <div className="flex items-center h-14 md:h-16 px-2 md:px-4 gap-1 md:gap-3">
          {/* Mobile: Hamburger Menu */}
          <div className="md:hidden shrink-0">
            <SidebarMenu user={user} />
          </div>

          {/* Logo - Prefetch homepage on hover */}
          <Link href="/" prefetch={true} className="flex items-center gap-0.5 md:gap-1.5 shrink-0 hover:opacity-90 outline-none focus:ring-2 focus:ring-header-text/20 rounded-md px-1.5 md:px-2 py-1 min-h-11">
            <span className="text-lg md:text-2xl font-bold tracking-tight">AMZN</span>
            <div className="size-1.5 md:size-2 bg-brand rounded-full mt-0.5 md:mt-1"></div>
          </Link>

          {/* Deliver to - LEFT side before search */}
          <LocationDropdown country={country} />

          {/* Language Switcher - LEFT of search bar */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Search Bar - Desktop only - TAKES ALL AVAILABLE SPACE */}
          <div className="hidden md:flex flex-1">
            <DesktopSearch />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-1 shrink-0 ml-auto md:ml-0">
            {/* Account Dropdown - Hidden on mobile */}
            <div className="hidden md:block">
              <AccountDropdown user={user} />
            </div>

            {/* Returns & Orders - With Dropdown - Hidden on mobile */}
            <div className="hidden lg:block">
              <ReturnsOrdersDropdown user={user} />
            </div>

            {/* Messages - With Dropdown - Hidden on mobile */}
            <div className="hidden md:block">
              <MessagesDropdown user={user} />
            </div>

            {/* Mobile Search - Next to cart on mobile */}
            <div className="md:hidden">
              <MobileSearchV2 />
            </div>

            {/* Cart - With Dropdown on Desktop */}
            <div className="hidden md:block">
              <CartDropdown />
            </div>
            
            {/* Cart - With Sheet Dropdown on Mobile */}
            <div className="md:hidden">
              <MobileCartDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Hidden on mobile (use tab bar), visible on tablet+ */}
      <nav className="hidden sm:block bg-header-bg-secondary text-sm py-1.5 px-4 border-t border-header-border relative">
        <div className="flex items-center gap-1 whitespace-nowrap text-header-text-muted">
          {/* Mobile/Tablet: Sidebar Menu (Sheet) */}
          <div className="md:hidden">
            <SidebarMenu user={user} />
          </div>
          
          {/* Desktop: Mega Menu (Hover) */}
          <div className="hidden md:block">
            <MegaMenu />
          </div>
          
          <Link href="/todays-deals" prefetch={true} className="hover:text-brand hover:underline min-h-10 px-3 flex items-center rounded-md">{t('todaysDeals')}</Link>
          <Link href="/customer-service" className="hover:text-brand hover:underline min-h-10 px-3 flex items-center rounded-md">{t('customerService')}</Link>
          <Link href="/registry" className="hover:text-brand hover:underline min-h-10 px-3 flex items-center rounded-md">{t('registry')}</Link>
          <Link href="/gift-cards" className="hover:text-brand hover:underline min-h-10 px-3 flex items-center rounded-md">{t('giftCards')}</Link>
          <Link href="/sell" className="font-medium text-brand hover:text-brand-light hover:underline min-h-10 px-3 flex items-center rounded-md">{t('sell')}</Link>
        </div>
      </nav>
    </header>
  )
}
