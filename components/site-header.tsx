"use client"

import type React from "react"
import { Search, ShoppingCart, MapPin, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useSearchParams } from "next/navigation"
import { AccountDropdown } from "@/components/header-dropdowns"
import { SidebarMenu } from "@/components/sidebar-menu"
import { getCountryName } from "@/lib/geolocation"
import { useEffect, useState, Suspense } from "react"
import { Link, useRouter, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LanguageSwitcher } from "@/components/language-switcher"

function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState("all")
  const t = useTranslations('Navigation')
  const tCat = useTranslations('SearchCategories')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&category=${category}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 flex items-center mx-4 h-10">
      <div className="flex h-full w-full rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amber-400 transition-shadow shadow-sm">
        <div className="h-full bg-slate-100 border-r border-slate-300 flex items-center hover:bg-slate-200 cursor-pointer transition-colors">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-full w-auto min-w-[50px] max-w-[150px] bg-transparent border-none text-xs text-slate-600 rounded-none focus:ring-0 gap-1 px-3 data-[placeholder]:text-slate-600">
              <SelectValue placeholder={tCat('all')} />
            </SelectTrigger>
            <SelectContent className="bg-white text-black border-slate-200">
              <SelectItem value="all">{tCat('all')}</SelectItem>
              <SelectItem value="arts">{tCat('arts')}</SelectItem>
              <SelectItem value="automotive">{tCat('automotive')}</SelectItem>
              <SelectItem value="baby">{tCat('baby')}</SelectItem>
              <SelectItem value="beauty">{tCat('beauty')}</SelectItem>
              <SelectItem value="books">{tCat('books')}</SelectItem>
              <SelectItem value="computers">{tCat('computers')}</SelectItem>
              <SelectItem value="electronics">{tCat('electronics')}</SelectItem>
              <SelectItem value="fashion">{tCat('fashion')}</SelectItem>
              <SelectItem value="home">{tCat('home')}</SelectItem>
              <SelectItem value="toys">{tCat('toys')}</SelectItem>
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
        <Button type="submit" className="h-full w-12 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-none border-none flex items-center justify-center transition-colors">
          <Search className="h-5 w-5" />
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
    <header className="sticky top-0 z-50 w-full flex flex-col shadow-lg shadow-slate-900/10">
      {/* Top Header */}
      <div className="bg-slate-900 text-white">
        <div className="flex items-center h-[60px] px-3 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0 hover:opacity-90 transition-opacity outline-none focus:ring-2 focus:ring-white/20 rounded-md px-1">
            <span className="text-2xl font-semibold tracking-tighter">AMZN</span>
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></div>
          </Link>

          {/* Deliver to */}
          <Button variant="ghost" className="hidden lg:flex flex-col items-start leading-none gap-0 text-slate-300 hover:text-white text-xs ml-2 p-2 px-3 border border-transparent hover:border-white/20 rounded transition-colors duration-200">
            <span className="text-slate-400 font-normal text-[10px]">{t('deliverTo')}</span>
            <div className="flex items-center gap-1 font-medium text-sm text-white mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{country}</span>
            </div>
          </Button>

          {/* Search Bar */}
          <Suspense fallback={<div className="flex-1 max-w-3xl mx-4 h-10 bg-white rounded-[4px]" />}>
            <SearchBar />
          </Suspense>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Account Dropdown */}
            <AccountDropdown user={user} />

            <Link href="/account/orders">
              <Button variant="ghost" className="hidden md:flex flex-col items-start leading-none gap-0 p-2 px-3 border border-transparent hover:border-white/20 rounded transition-colors duration-200">
                <span className="text-[10px] text-slate-200">{t('returns')}</span>
                <span className="text-sm font-medium mt-0.5">{t('orders')}</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" className="flex items-end gap-1 p-2 px-3 border border-transparent hover:border-white/20 rounded relative transition-colors duration-200 group">
                <div className="relative">
                  <ShoppingCart className="h-7 w-7 group-hover:scale-105 transition-transform" />
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full transition-transform">
                    {totalItems}
                  </span>
                </div>
                <span className="text-sm font-medium hidden md:block translate-y-[1px]">{t('cart')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-slate-800 text-sm py-1.5 px-4 overflow-x-auto no-scrollbar border-t border-slate-700">
        <div className="flex items-center gap-5 whitespace-nowrap text-slate-200">
          <SidebarMenu />
          <Link href="/todays-deals" className="hover:text-white hover:underline transition-colors">{t('todaysDeals')}</Link>
          <Link href="/customer-service" className="hover:text-white hover:underline transition-colors">{t('customerService')}</Link>
          <Link href="/registry" className="hover:text-white hover:underline transition-colors">{t('registry')}</Link>
          <Link href="/gift-cards" className="hover:text-white hover:underline transition-colors">{t('giftCards')}</Link>
          <Link href="/sell" className="hover:text-white transition-colors font-medium text-amber-400 hover:underline">{t('sell')}</Link>
        </div>
      </nav>
    </header>
  )
}
