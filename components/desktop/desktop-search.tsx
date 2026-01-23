"use client"

import * as React from "react"
import { useRef, useCallback, useEffect, useId } from "react"
import Image from "next/image"
import { MagnifyingGlass, Clock, TrendUp, Package, X, ArrowRight, Eye, Sparkle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldLabel } from "@/components/shared/field"
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { useProductSearch } from "@/hooks/use-product-search"

export function DesktopSearch() {
  const router = useRouter()
  const locale = useLocale()
  const tNav = useTranslations("Navigation")
  const tSearch = useTranslations("SearchOverlay")
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const searchInputId = useId()

  const buildSearchHref = useCallback((q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return "/search"
    return `/search?q=${encodeURIComponent(trimmed)}`
  }, [])
  
  const [isOpen, setIsOpen] = React.useState(false)
  const [popoverWidth, setPopoverWidth] = React.useState(0)
  
  const { products: recentlyViewed, clearProducts: clearRecentlyViewed } = useRecentlyViewed()
  
  // Use shared search hook
  const {
    query,
    setQuery,
    products,
    isSearching,
    recentProducts,
    trendingSearches,
    formatPrice,
    saveSearch,
    saveProduct,
    clearRecentProducts,
    minSearchLength,
  } = useProductSearch(6)

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    // Navigate via next-intl router so we always land on /[locale]/search.
    // This also avoids relying on middleware redirects in dev/E2E.
    const raw = new FormData(e.currentTarget).get("q")
    const q = (typeof raw === "string" ? raw : (inputRef.current?.value ?? query)).trim()
    if (!q) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    saveSearch(q)
    setIsOpen(false)
    router.push(buildSearchHref(q))
  }, [buildSearchHref, query, router, saveSearch])

  const handleSelectSearch = useCallback((search: string) => {
    setQuery(search)
    saveSearch(search)
    setIsOpen(false)
    router.push(buildSearchHref(search))
  }, [setQuery, saveSearch, router, buildSearchHref])

  // Build SEO-friendly product URL
  const buildProductUrl = useCallback((product: { slug?: string; storeSlug?: string | null; id: string }) => {
    if (!product.storeSlug) return "#"
    return `/${product.storeSlug}/${product.slug || product.id}`
  }, [])

  const handleSelectProduct = useCallback((product: { id: string; slug?: string; storeSlug?: string | null; title: string; price: number; images: string[] }) => {
    if (product) {
      // Ensure slug has a fallback for saveProduct which expects required slug
      saveProduct({ ...product, slug: product.slug || product.id })
    }
    setIsOpen(false)
    setQuery("")
    router.push(buildProductUrl(product))
  }, [setQuery, router, saveProduct, buildProductUrl])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }, [])

  const handleClearInput = useCallback(() => {
    setQuery("")
    inputRef.current?.focus()
  }, [setQuery])

  // Measure form width for popover to match search bar width
  useEffect(() => {
    const measureWidth = () => {
      if (formRef.current) {
        setPopoverWidth(formRef.current.offsetWidth)
      }
    }
    measureWidth()
    window.addEventListener("resize", measureWidth)
    return () => window.removeEventListener("resize", measureWidth)
  }, [])



  return (
    <div className="w-full" data-desktop-search>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <form 
            ref={formRef}
            onSubmit={handleSearch}
            action={`/${locale}/search`}
            method="get"
            className="relative flex h-11 w-full items-center rounded-full bg-search-bg border border-search-border transition-colors focus-within:border-search-focus-border focus-within:ring-search-focus-ring/30 focus-within:ring-2 focus-within:bg-background"
          >
            <MagnifyingGlass
              size={18}
              weight="regular"
              className="absolute left-4 text-search-placeholder pointer-events-none"
            />

              <FieldLabel htmlFor={searchInputId} className="sr-only">
                {tNav("search")}
              </FieldLabel>
              <Input
                id={searchInputId}
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              name="q"
                placeholder={tNav("searchPlaceholder")}
              className="h-full w-full rounded-full border-0 bg-transparent pl-11 pr-24 text-sm text-search-text placeholder:text-search-placeholder focus-visible:border-0 focus-visible:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onClick={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
                aria-label={tNav("search")}
            />

            {query && (
                <button
                type="button"
                onClick={handleClearInput}
                  aria-label={tNav("clearSearch")}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} weight="regular" />
              </button>
            )}

            <Button
              type="submit"
              variant="black"
              size="icon-sm"
              aria-label={tNav("search")}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none"
            >
              <MagnifyingGlass size={16} weight="bold" />
            </Button>
          </form>
        </PopoverAnchor>

        <PopoverContent
          className="p-0 border border-border rounded-lg overflow-hidden"
          style={{ width: popoverWidth > 0 ? popoverWidth : undefined }}
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-(--spacing-scroll-xl) overflow-y-auto">
            {/* Live Product Results */}
            {products.length > 0 && (
              <div className="border-b border-border">
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <Package size={14} weight="regular" />
                    {tSearch("products")}
                  </span>
                  <Link 
                    href={buildSearchHref(query)}
                    className="text-xs text-brand flex items-center gap-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {tSearch("viewAll")}
                    <ArrowRight size={12} weight="regular" />
                  </Link>
                </div>
                <div className="p-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
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
                      <ArrowRight size={16} weight="regular" className="text-muted-foreground opacity-0 group-hover:opacity-100" />
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
                    {tSearch("recentlyViewed")}
                  </span>
                  <button
                    onClick={clearRecentlyViewed}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {tSearch("clear")}
                  </button>
                </div>
                <div className="p-2">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    {recentlyViewed.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        href={buildProductUrl(product)}
                        onClick={() => setIsOpen(false)}
                        className="shrink-0 w-24 group"
                      >
                        <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden ring-1 ring-border">
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
                        <p className="mt-1.5 text-xs text-foreground line-clamp-2 group-hover:text-brand group-hover:underline">
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

            {/* Recent Searched Products */}
            {recentProducts.length > 0 && !query && (
              <div className="border-b border-border">
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <Clock size={14} weight="regular" />
                    {tSearch("recentSearches")}
                  </span>
                  <button
                    onClick={clearRecentProducts}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {tSearch("clear")}
                  </button>
                </div>
                <div className="p-2">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    {recentProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={buildProductUrl(product)}
                        onClick={() => setIsOpen(false)}
                        className="shrink-0 w-24 group"
                      >
                        <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden ring-1 ring-border">
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
                        <p className="mt-1.5 text-xs text-foreground line-clamp-2 group-hover:text-brand group-hover:underline">
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

            {/* Trending Searches */}
            {!query && (
              <div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50">
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <TrendUp size={14} weight="regular" />
                    {tSearch("trending")}
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
                      <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </div>
                      <span className="text-sm text-foreground group-hover:text-brand flex-1">
                        {search}
                      </span>
                      <ArrowRight size={14} weight="regular" className="text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSearching && query && (
              <div className="px-4 py-8 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-4 border-2 border-brand/30 border-t-brand rounded-full" />
                  {tSearch("searching")}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isSearching && query && query.length >= minSearchLength && products.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Package size={40} weight="regular" className="text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {tSearch("noResultsFor", { query })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {tSearch("tryDifferent")}
                </p>
              </div>
            )}
          </div>

          {/* Keyboard Hint */}
          <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {tSearch("press")} {" "}
              <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs font-mono">
                Enter
              </kbd>{" "}
              {tSearch("toSearch")}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs font-mono">
                Esc
              </kbd>{" "}
              {tSearch("toClose")}
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
