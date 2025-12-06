"use client"

import { useLocale } from "next-intl"
import { Input } from "@/components/ui/input"
import { Package, Clock, TrendUp, X } from "@phosphor-icons/react"
import Image from "next/image"
import { useState } from "react"

interface SearchProduct {
  id: string
  title: string
  price: number
  images: string[]
  slug: string
}

interface SearchDropdownProps {
  query: string
  setQuery: (value: string) => void
  onSearch: (e: React.FormEvent) => void
  recentSearches: string[]
  onClearRecent: () => void
  onSelectSearch: (search: string) => void
  products: SearchProduct[]
  isSearching: boolean
}

export function SearchDropdown({
  query,
  setQuery,
  onSearch,
  recentSearches,
  onClearRecent,
  onSelectSearch,
  products,
  isSearching,
}: SearchDropdownProps) {
  const locale = useLocale()
  const [isFocused, setIsFocused] = useState(false)

  const trendingSearches = [
    locale === "bg" ? "Черен петък оферти" : "Black Friday deals",
    "iPhone 15",
    locale === "bg" ? "Коледни подаръци" : "Christmas gifts",
    "PlayStation 5",
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: locale === "bg" ? "BGN" : "USD",
    }).format(price)
  }

  const showDropdown = isFocused && (recentSearches.length > 0 || products.length > 0 || query.length === 0)

  return (
    <div className="relative flex-1">
      <form onSubmit={onSearch} className="relative">
        <Input
          type="text"
          placeholder={locale === "bg" ? "Търси продукти, марки и още..." : "Search products, brands, and more..."}
          className="h-full border-0 rounded-none focus-visible:ring-0 text-foreground px-4 text-sm placeholder:text-muted-foreground pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-b-md overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {products.length > 0 && (
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase">
                <Package className="size-3.5" />
                {locale === "bg" ? "Продукти" : "Products"}
              </div>
              {products.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    window.location.href = `/${locale}/product/${product.slug}`
                  }}
                  className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md text-left"
                >
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="object-cover rounded-md bg-muted"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                      <Package className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{product.title}</p>
                    <p className="text-sm text-price-sale font-semibold">{formatPrice(product.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && !query && (
            <div className="p-2 border-b border-border">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                  <Clock className="size-3.5" />
                  {locale === "bg" ? "Скорошни" : "Recent"}
                </span>
                <button onClick={onClearRecent} className="text-xs text-link hover:text-link-hover">
                  {locale === "bg" ? "Изчисти" : "Clear"}
                </button>
              </div>
              {recentSearches.map((search, i) => (
                <button
                  key={`recent-${i}`}
                  onClick={() => onSelectSearch(search)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md text-left"
                >
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{search}</span>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase">
                <TrendUp size={14} weight="regular" />
                {locale === "bg" ? "Популярни" : "Trending"}
              </div>
              {trendingSearches.map((search, i) => (
                <button
                  key={`trending-${i}`}
                  onClick={() => onSelectSearch(search)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md text-left"
                >
                  <TrendUp size={16} weight="fill" className="text-deal" />
                  <span className="text-sm text-foreground">{search}</span>
                </button>
              ))}
            </div>
          )}

          {isSearching && query && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {locale === "bg" ? "Търсене..." : "Searching..."}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
