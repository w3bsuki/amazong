"use client"

import type React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useSearchParams } from "next/navigation"
import { AccountDropdown, CartDropdown, ReturnsOrdersDropdown, LocationDropdown, SearchCategoryDropdown } from "@/components/header-dropdowns"
import { SidebarMenu } from "@/components/sidebar-menu"
import { MobileSearchV2 } from "@/components/mobile-search-v2"
import { getCountryName } from "@/lib/geolocation"
import { useEffect, useState, Suspense } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/language-switcher"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState("all")
  const [categories, setCategories] = useState<Category[]>([])
  const t = useTranslations('Navigation')

  useEffect(() => {
    // Fetch categories from API
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories)
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) {
      params.set('q', query)
    }
    if (category !== 'all') {
      params.set('category', category)
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 flex items-center mx-4 h-11">
      <div className="flex h-full w-full rounded-sm overflow-hidden bg-white border border-border focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-colors">
        <SearchCategoryDropdown
          categories={categories}
          selectedCategory={category}
          onCategoryChange={setCategory}
        />
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          className="h-full border-0 rounded-none focus-visible:ring-0 text-foreground px-4 text-sm placeholder:text-muted-foreground"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" aria-label={t('searchPlaceholder')} className="h-full w-12 bg-interactive hover:bg-interactive-hover text-white rounded-none border-none flex items-center justify-center transition-colors">
          <Search className="size-5" />
        </Button>
      </div>
    </form>
  )
}

import { User } from "@supabase/supabase-js"

interface SiteHeaderProps {
  user: User | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const { totalItems } = useCart()
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
      {/* Top Header */}
      <div className="text-header-text">
        <div className="flex items-center h-14 md:h-16 px-2 md:px-4 gap-1 md:gap-3">
          {/* Mobile: Hamburger Menu */}
          <div className="md:hidden shrink-0">
            <SidebarMenu />
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 md:gap-1.5 shrink-0 hover:opacity-90 transition-opacity outline-none focus:ring-2 focus:ring-header-text/20 rounded-md px-1.5 md:px-2 py-1 min-h-11">
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
          <div className="hidden md:block flex-1">
            <Suspense fallback={<div className="w-full h-11 bg-white rounded-md" />}>
              <SearchBar />
            </Suspense>
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

            {/* Messages - Hidden on mobile */}
            <div className="hidden md:block">
              <Link href="/account/messages">
                <Button variant="ghost" className="h-12 flex flex-col items-start leading-none gap-0 p-2 px-3 border border-transparent hover:border-header-text/20 rounded-sm text-header-text hover:text-brand group">
                  <span className="text-[10px] text-header-text-muted group-hover:text-brand">{t('messages')}</span>
                  <span className="text-sm font-bold mt-0.5">{t('messagesLabel')}</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Search - Next to cart on mobile */}
            <div className="md:hidden">
              <MobileSearchV2 />
            </div>

            {/* Cart - With Dropdown on Desktop */}
            <div className="hidden md:block">
              <CartDropdown />
            </div>
            
            {/* Cart - Simple link on Mobile */}
            <Link href="/cart" aria-label={`${t('cart')} - ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`} className="md:hidden">
              <Button variant="ghost" className="flex items-center min-h-11 min-w-11 p-2 border border-transparent hover:border-header-text/20 rounded-md relative hover:bg-header-text/5 group">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-header-text" aria-hidden="true">
                    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                  </svg>
                  <span className="absolute -top-1 -right-1.5 bg-brand-deal text-white text-[10px] font-bold min-w-5 h-5 flex items-center justify-center rounded-full px-1" aria-hidden="true">
                    {totalItems}
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Hidden on mobile (use tab bar), visible on tablet+ */}
      <nav className="hidden sm:block bg-header-bg-secondary text-sm py-1.5 px-4 border-t border-header-border relative">
        <div className="flex items-center gap-1 whitespace-nowrap text-header-text-muted">
          <SidebarMenu />
          
          <Link href="/todays-deals" className="hover:text-brand hover:underline transition-colors min-h-10 px-3 flex items-center rounded-md">{t('todaysDeals')}</Link>
          <Link href="/customer-service" className="hover:text-brand hover:underline transition-colors min-h-10 px-3 flex items-center rounded-md">{t('customerService')}</Link>
          <Link href="/registry" className="hover:text-brand hover:underline transition-colors min-h-10 px-3 flex items-center rounded-md">{t('registry')}</Link>
          <Link href="/gift-cards" className="hover:text-brand hover:underline transition-colors min-h-10 px-3 flex items-center rounded-md">{t('giftCards')}</Link>
          <Link href="/sell" className="transition-colors font-medium text-brand hover:text-brand-light hover:underline min-h-10 px-3 flex items-center rounded-md">{t('sell')}</Link>
        </div>
      </nav>
    </header>
  )
}
