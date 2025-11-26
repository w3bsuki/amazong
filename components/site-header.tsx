"use client"

import type React from "react"
import { Search, ShoppingCart, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useSearchParams } from "next/navigation"
import { AccountDropdown } from "@/components/header-dropdowns"
import { SidebarMenu } from "@/components/sidebar-menu"
import { MobileSearchV2 } from "@/components/mobile-search-v2"
import { getCountryName } from "@/lib/geolocation"
import { useEffect, useState, Suspense } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const tCat = useTranslations('SearchCategories')
  const locale = useLocale()

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

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

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
      <div className="flex h-full w-full rounded overflow-hidden bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
        <div className="h-full bg-slate-50 border-r border-slate-200 flex items-center hover:bg-slate-100 cursor-pointer transition-colors">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-full w-auto min-w-[50px] max-w-[150px] bg-transparent border-none text-xs text-slate-600 rounded-none focus:ring-0 gap-1 px-3 data-[placeholder]:text-slate-600">
              <SelectValue placeholder={tCat('all')} />
            </SelectTrigger>
            <SelectContent className="bg-white text-black border-slate-200 max-h-[400px] rounded">
              <SelectItem value="all">{tCat('all')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {getCategoryName(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          className="h-full border-0 rounded-none focus-visible:ring-0 text-slate-900 px-4 text-sm placeholder:text-slate-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" aria-label={t('searchPlaceholder')} className="h-full w-12 bg-amber-400 hover:bg-amber-500 text-zinc-900 rounded-none border-none flex items-center justify-center transition-colors">
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
    <header className="sticky top-0 z-50 w-full flex flex-col border-b border-zinc-700">
      {/* Top Header */}
      <div className="bg-zinc-900 text-white">
        <div className="flex items-center h-14 md:h-16 px-3 md:px-4 gap-2 md:gap-3">
          {/* Mobile: Hamburger Menu */}
          <div className="md:hidden shrink-0">
            <SidebarMenu />
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 md:gap-1.5 shrink-0 hover:opacity-90 transition-opacity outline-none focus:ring-2 focus:ring-white/20 rounded-lg md:px-2 py-1">
            <span className="text-lg md:text-2xl font-bold tracking-tight">AMZN</span>
            <div className="size-1 md:size-2 bg-amber-400 rounded-full mt-0.5 md:mt-1"></div>
          </Link>

          {/* Deliver to - Hidden on mobile */}
          <Button variant="ghost" className="hidden lg:flex flex-col items-start leading-none gap-0 text-slate-300 hover:text-white text-xs ml-2 p-2 px-3 border border-transparent hover:border-white/20 rounded-lg transition-all duration-200 hover:bg-white/5 shrink-0">
            <span className="text-slate-400 font-normal text-[10px]">{t('deliverTo')}</span>
            <div className="flex items-center gap-1 font-medium text-sm text-white mt-0.5">
              <MapPin className="size-3.5" />
              <span>{country}</span>
            </div>
          </Button>

          {/* Search Bar - Desktop only - TAKES ALL AVAILABLE SPACE */}
          <div className="hidden md:block flex-1">
            <Suspense fallback={<div className="w-full h-11 bg-white rounded-lg" />}>
              <SearchBar />
            </Suspense>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-1 shrink-0 ml-auto md:ml-0">
            {/* Language Switcher - Hidden on mobile */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Account Dropdown - Hidden on mobile */}
            <div className="hidden md:block">
              <AccountDropdown user={user} />
            </div>

            {/* Orders - Hidden on mobile */}
            <Link href="/account/orders">
              <Button variant="ghost" className="hidden lg:flex flex-col items-start leading-none gap-0 p-2 px-3 border border-transparent hover:border-white/20 rounded-lg transition-all duration-200 hover:bg-white/5">
                <span className="text-[10px] text-slate-300">{t('returns')}</span>
                <span className="text-sm font-medium mt-0.5">{t('orders')}</span>
              </Button>
            </Link>

            {/* Mobile Search - Next to cart on mobile */}
            <div className="md:hidden">
              <MobileSearchV2 />
            </div>

            {/* Cart - Always visible */}
            <Link href="/cart" aria-label={`${t('cart')} - ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}>
              <Button variant="ghost" className="flex items-center p-2 md:px-3 border border-transparent hover:border-white/20 rounded-lg relative transition-all duration-200 hover:bg-white/5 group md:items-end md:gap-1">
                <div className="relative">
                  <ShoppingCart className="size-6 text-white" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1.5 bg-orange-500 text-white text-xs font-bold size-4 flex items-center justify-center rounded-full" aria-hidden="true">
                    {totalItems}
                  </span>
                </div>
                <span className="text-sm font-medium hidden md:block translate-y-px">{t('cart')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Hidden on mobile (use tab bar), visible on tablet+ */}
      <nav className="hidden sm:block bg-zinc-800 text-sm py-2 px-4 border-t border-zinc-700 relative">
        <div className="flex items-center gap-6 whitespace-nowrap text-slate-200">
          <SidebarMenu />
          
          <Link href="/todays-deals" className="hover:text-white hover:underline transition-colors py-1.5 px-1">{t('todaysDeals')}</Link>
          <Link href="/customer-service" className="hover:text-white hover:underline transition-colors py-1.5 px-1">{t('customerService')}</Link>
          <Link href="/registry" className="hover:text-white hover:underline transition-colors py-1.5 px-1">{t('registry')}</Link>
          <Link href="/gift-cards" className="hover:text-white hover:underline transition-colors py-1.5 px-1">{t('giftCards')}</Link>
          <Link href="/sell" className="transition-colors font-medium text-blue-400 hover:text-blue-300 hover:underline py-1.5 px-1">{t('sell')}</Link>
        </div>
      </nav>
    </header>
  )
}
