"use client"

import * as React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { MagnifyingGlass, Clock, TrendUp, Package, X, ArrowRight, Eye, Sparkle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

interface SearchProduct {
  id: string
  title: string
  price: number
  images: string[]
  slug: string
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function DesktopSearch() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("Navigation")
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [products, setProducts] = useState<SearchProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [popoverWidth, setPopoverWidth] = useState<number>(500)
  
  const debouncedQuery = useDebounce(query, 300)
  const { products: recentlyViewed, clearProducts: clearRecentlyViewed } = useRecentlyViewed()

  const trendingSearches = [
    locale === "bg" ? "Черен петък оферти" : "Black Friday deals",
    "iPhone 15 Pro",
    locale === "bg" ? "Коледни подаръци" : "Christmas gifts",
    "PlayStation 5",
    "AirPods Pro",
  ]

  // Fetch products when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setProducts([])
      return
    }

    setIsSearching(true)
    fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
      })
      .catch((err) => {
        console.error("Failed to search products:", err)
        setProducts([])
      })
      .finally(() => {
        setIsSearching(false)
      })
  }, [debouncedQuery])

  // Measure form width for popover
  useEffect(() => {
    const updateWidth = () => {
      if (formRef.current) {
        setPopoverWidth(formRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches")
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved).slice(0, 5))
        } catch (e) {
          console.error("Failed to parse recent searches:", e)
        }
      }
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: locale === "bg" ? "BGN" : "USD",
    }).format(price)
  }

  const saveSearch = useCallback((search: string) => {
    const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, 5)
    setRecentSearches(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(updated))
    }
  }, [recentSearches])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    saveSearch(query)
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleSelectSearch = (search: string) => {
    setQuery(search)
    saveSearch(search)
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(search)}`)
  }

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false)
    setQuery("")
    router.push(`/product/${slug}`)
  }

  const handleClearRecent = () => {
    setRecentSearches([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("recentSearches")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard navigation
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="flex-1 flex items-center mx-4 h-11">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <form 
            ref={formRef}
            onSubmit={handleSearch}
            className="flex h-full w-full rounded-md overflow-visible bg-white border border-border focus-within:ring-2 focus-within:ring-brand focus-within:border-brand shadow-sm hover:shadow-md"
          >
            {/* Search Input */}
            <div className="relative flex-1 flex items-center">
              <MagnifyingGlass size={16} weight="regular" className="absolute left-3 text-muted-foreground pointer-events-none" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={
                  locale === "bg"
                    ? "Търси продукти, марки и още..."
                    : "Search products, brands, and more..."
                }
                className="h-full border-0 rounded-none focus-visible:ring-0 text-foreground pl-10 pr-10 text-sm placeholder:text-muted-foreground bg-transparent"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("")
                    inputRef.current?.focus()
                  }}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} weight="regular" />
                </button>
              )}
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              aria-label={t("searchPlaceholder")}
              className="h-full w-12 bg-brand hover:bg-brand/90 text-white rounded-none rounded-r-md border-none flex items-center justify-center"
            >
              <MagnifyingGlass size={20} weight="regular" />
            </Button>
          </form>
        </PopoverAnchor>

        <PopoverContent
          className="p-0 shadow-xl border-border rounded-lg overflow-hidden"
          style={{ width: popoverWidth }}
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-[500px] overflow-y-auto">
            {/* Live Product Results */}
            {products.length > 0 && (
              <div className="border-b border-border">
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <Package size={14} weight="regular" />
                    {locale === "bg" ? "Продукти" : "Products"}
                  </span>
                  <Link 
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="text-xs text-brand hover:text-brand/80 flex items-center gap-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {locale === "bg" ? "Виж всички" : "View all"}
                    <ArrowRight size={12} weight="regular" />
                  </Link>
                </div>
                <div className="p-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-muted rounded-lg text-left group"
                    >
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0 ring-1 ring-border">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} weight="regular" className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground group-hover:text-brand">
                          {product.title}
                        </p>
                        <p className="text-sm font-bold text-price-sale">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <ArrowRight size={16} weight="regular" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Viewed Products */}
            {recentlyViewed.length > 0 && !query && (
              <div className="border-b border-border">
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <Eye size={14} weight="regular" />
                    {locale === "bg" ? "Наскоро разгледани" : "Recently Viewed"}
                  </span>
                  <button
                    onClick={clearRecentlyViewed}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {locale === "bg" ? "Изчисти" : "Clear"}
                  </button>
                </div>
                <div className="p-2">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    {recentlyViewed.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="shrink-0 w-24 group"
                      >
                        <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden ring-1 ring-border group-hover:ring-brand">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} weight="regular" className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs text-foreground line-clamp-2 group-hover:text-brand">
                          {product.title}
                        </p>
                        <p className="text-xs font-semibold text-price-sale">
                          {formatPrice(product.price)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div className="border-b border-border">
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <Clock size={14} weight="regular" />
                    {locale === "bg" ? "Скорошни търсения" : "Recent Searches"}
                  </span>
                  <button
                    onClick={handleClearRecent}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {locale === "bg" ? "Изчисти" : "Clear"}
                  </button>
                </div>
                <div className="p-1">
                  {recentSearches.map((search, i) => (
                    <button
                      key={`recent-${i}`}
                      onClick={() => handleSelectSearch(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-md text-left group"
                    >
                      <Clock size={16} weight="regular" className="text-muted-foreground" />
                      <span className="text-sm text-foreground group-hover:text-brand flex-1">
                        {search}
                      </span>
                      <ArrowRight size={14} weight="regular" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {!query && (
              <div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50">
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <TrendUp size={14} weight="regular" />
                    {locale === "bg" ? "Популярни търсения" : "Trending Now"}
                  </span>
                  <Sparkle size={12} weight="fill" className="text-deal" />
                </div>
                <div className="p-1">
                  {trendingSearches.map((search, i) => (
                    <button
                      key={`trending-${i}`}
                      onClick={() => handleSelectSearch(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-md text-left group"
                    >
                      <div className="w-5 h-5 rounded-full bg-linear-to-br from-deal to-primary flex items-center justify-center text-[10px] font-bold text-white">
                        {i + 1}
                      </div>
                      <span className="text-sm text-foreground group-hover:text-brand flex-1">
                        {search}
                      </span>
                      <ArrowRight size={14} weight="regular" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSearching && query && (
              <div className="px-4 py-8 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                  {locale === "bg" ? "Търсене..." : "Searching..."}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isSearching && query && query.length >= 2 && products.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Package size={40} weight="regular" className="text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {locale === "bg"
                    ? `Няма резултати за "${query}"`
                    : `No results for "${query}"`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {locale === "bg"
                    ? "Опитай с различни ключови думи"
                    : "Try different keywords"}
                </p>
              </div>
            )}
          </div>

          {/* Keyboard Hint */}
          <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {locale === "bg" ? "Натисни" : "Press"}{" "}
              <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px] font-mono">
                Enter
              </kbd>{" "}
              {locale === "bg" ? "за търсене" : "to search"}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px] font-mono">
                Esc
              </kbd>{" "}
              {locale === "bg" ? "за затваряне" : "to close"}
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
