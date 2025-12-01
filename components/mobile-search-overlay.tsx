"use client"

import * as React from "react"
import { useRef, useEffect, useCallback, useId } from "react"
import {
  MagnifyingGlass,
  X,
  Clock,
  TrendUp,
  Package,
  ArrowRight,
} from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/routing"
import { useLocale } from "next-intl"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useProductSearch } from "@/hooks/use-product-search"

interface MobileSearchOverlayProps {
  className?: string
}

/** Focus delay in milliseconds after overlay opens */
const FOCUS_DELAY_MS = 100

/**
 * Mobile Search Overlay Component
 * 
 * A full-screen search overlay optimized for mobile devices with:
 * - Live product search with debouncing
 * - Recent searches with localStorage persistence
 * - Trending searches
 * - Full WCAG 2.1 AA accessibility compliance
 */
export function MobileSearchOverlay({ className }: MobileSearchOverlayProps) {
  // Generate unique IDs for accessibility
  const searchInputId = useId()
  const overlayTitleId = useId()
  const overlayDescId = useId()

  // State
  const [isOpen, setIsOpen] = React.useState(false)

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const router = useRouter()
  const locale = useLocale()
  
  // Use shared search hook
  const {
    query,
    setQuery,
    products,
    isSearching,
    recentSearches,
    trendingSearches,
    formatPrice,
    saveSearch,
    clearRecentSearches,
    clearQuery,
    minSearchLength,
  } = useProductSearch(8)

  // Localized strings
  const strings = {
    search: locale === "bg" ? "Търсене" : "Search",
    searchProducts: locale === "bg" ? "Търсене в продукти..." : "Search products...",
    close: locale === "bg" ? "Затвори" : "Close",
    clear: locale === "bg" ? "Изчисти" : "Clear",
    searching: locale === "bg" ? "Търсене..." : "Searching...",
    products: locale === "bg" ? "Продукти" : "Products",
    viewAll: locale === "bg" ? "Виж всички" : "View all",
    noResults: locale === "bg" ? "Няма резултати за" : "No results for",
    tryDifferent: locale === "bg" ? "Опитай с други ключови думи" : "Try different keywords",
    recentSearches: locale === "bg" ? "Скорошни търсения" : "Recent Searches",
    trending: locale === "bg" ? "Популярни търсения" : "Trending",
  }

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, FOCUS_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"

      return () => {
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        document.body.style.overflow = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // Handle Escape key to close overlay
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        handleClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    clearQuery()
    triggerRef.current?.focus()
  }, [clearQuery])

  const handleSearch = useCallback(
    (value: string) => {
      const trimmedValue = value.trim()
      if (!trimmedValue) return

      saveSearch(trimmedValue)
      handleClose()
      router.push(`/search?q=${encodeURIComponent(trimmedValue)}`)
    },
    [saveSearch, handleClose, router]
  )

  const handleProductSelect = useCallback(
    (slugOrId: string) => {
      if (!slugOrId) return
      handleClose()
      router.push(`/product/${slugOrId}`)
    },
    [handleClose, router]
  )

  const handleClearInput = useCallback(() => {
    setQuery("")
    inputRef.current?.focus()
  }, [setQuery])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      handleSearch(query)
    },
    [handleSearch, query]
  )

  return (
    <>
      {/* Search Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex items-center justify-center",
          "size-11 p-0",
          "rounded-lg text-header-text",
          "hover:bg-header-hover active:bg-header-active",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "transition-colors duration-150",
          "md:hidden touch-action-manipulation",
          className
        )}
        aria-label={strings.search}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <MagnifyingGlass size={24} weight="regular" aria-hidden="true" />
      </button>

      {/* Full-Screen Search Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={overlayTitleId}
          aria-describedby={overlayDescId}
          className={cn(
            "fixed inset-0 z-100",
            "flex flex-col",
            "bg-background",
            "animate-in fade-in slide-in-from-top-2 duration-200",
            "md:hidden"
          )}
        >
          {/* Visually hidden title for screen readers */}
          <h2 id={overlayTitleId} className="sr-only">
            {strings.search}
          </h2>
          <p id={overlayDescId} className="sr-only">
            {strings.searchProducts}
          </p>

          {/* Search Header */}
          <header className="shrink-0 bg-background border-b border-border">
            {/* Close Button Row */}
            <div className="flex justify-end px-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="size-10 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={strings.close}
              >
                <X size={22} weight="regular" aria-hidden="true" />
              </Button>
            </div>

            {/* Search Input */}
            <form
              onSubmit={handleSubmit}
              className="px-3 pb-3"
              role="search"
              aria-label={strings.search}
            >
              <div className="relative">
                <MagnifyingGlass
                  size={20}
                  weight="regular"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  ref={inputRef}
                  id={searchInputId}
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder={strings.searchProducts}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 w-full pl-11 pr-11 text-base bg-muted border-0 rounded-full"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label={strings.searchProducts}
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 size-6 rounded-full flex items-center justify-center bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30 hover:text-foreground transition-colors"
                    aria-label={strings.clear}
                  >
                    <X size={14} weight="bold" aria-hidden="true" />
                  </button>
                )}
              </div>
            </form>
          </header>

          {/* Search Content */}
          <main className="flex-1 overflow-y-auto overscroll-contain" role="region" aria-label={strings.search}>
            {/* Loading State */}
            {isSearching && (
              <div role="status" aria-live="polite" className="px-4 py-8 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" aria-hidden="true" />
                  <span>{strings.searching}</span>
                </div>
              </div>
            )}

            {/* Product Results */}
            {!isSearching && products.length > 0 && (
              <section aria-labelledby="products-heading" className="border-b border-border">
                <div className="flex items-center justify-between px-4 py-3 bg-muted">
                  <h3 id="products-heading" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Package size={14} weight="regular" aria-hidden="true" />
                    {strings.products}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSearch(query)}
                    className="text-xs text-primary font-medium flex items-center gap-1 hover:text-primary/80"
                  >
                    {strings.viewAll}
                    <ArrowRight size={12} weight="regular" aria-hidden="true" />
                  </button>
                </div>

                <ul className="divide-y divide-border" role="listbox" aria-label={strings.products}>
                  {products.map((product) => (
                    <li key={product.id} role="option" aria-selected="false">
                      <button
                        type="button"
                        onClick={() => handleProductSelect(product.slug || product.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted active:bg-muted/80 text-left touch-action-manipulation transition-colors"
                      >
                        <div className="size-14 bg-muted rounded-lg overflow-hidden shrink-0 ring-1 ring-border">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt=""
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                              <Package size={24} weight="regular" className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2">{product.title}</p>
                          <p className="text-sm font-bold text-price-sale mt-0.5">{formatPrice(product.price)}</p>
                        </div>
                        <ArrowRight size={16} weight="regular" className="text-muted-foreground shrink-0" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* No Results */}
            {!isSearching && query.length >= minSearchLength && products.length === 0 && (
              <div role="status" aria-live="polite" className="px-4 py-12 text-center">
                <Package size={48} weight="regular" className="text-muted-foreground/50 mx-auto mb-3" aria-hidden="true" />
                <p className="text-base font-medium text-foreground">
                  {strings.noResults} &ldquo;{query}&rdquo;
                </p>
                <p className="text-sm text-muted-foreground mt-1">{strings.tryDifferent}</p>
              </div>
            )}

            {/* Default State - Recent & Trending Searches */}
            {!query && (
              <>
                {/* Recent Searches Section */}
                {recentSearches.length > 0 && (
                  <section aria-labelledby="recent-searches-heading" className="border-b border-border">
                    <div className="flex items-center justify-between px-4 py-3 bg-muted">
                      <h3 id="recent-searches-heading" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <Clock size={14} weight="regular" aria-hidden="true" />
                        {strings.recentSearches}
                      </h3>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-xs text-muted-foreground font-medium hover:text-foreground"
                      >
                        {strings.clear}
                      </button>
                    </div>
                    <ul className="divide-y divide-border" role="list" aria-label={strings.recentSearches}>
                      {recentSearches.map((search, index) => (
                        <li key={`recent-${index}`}>
                          <button
                            type="button"
                            onClick={() => handleSearch(search)}
                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted active:bg-muted/80 text-left touch-action-manipulation transition-colors"
                          >
                            <Clock size={18} weight="regular" className="text-muted-foreground shrink-0" aria-hidden="true" />
                            <span className="flex-1 text-base text-foreground">{search}</span>
                            <ArrowRight size={16} weight="regular" className="text-muted-foreground shrink-0" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Trending Searches Section */}
                <section aria-labelledby="trending-searches-heading" className="border-b border-border">
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted">
                    <h3 id="trending-searches-heading" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <TrendUp size={14} weight="regular" aria-hidden="true" />
                      {strings.trending}
                    </h3>
                  </div>
                  <ol className="divide-y divide-border" role="list" aria-label={strings.trending}>
                    {trendingSearches.map((search, index) => (
                      <li key={`trending-${index}`}>
                        <button
                          type="button"
                          onClick={() => handleSearch(search)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted active:bg-muted/80 text-left touch-action-manipulation transition-colors"
                        >
                          <span className="size-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white bg-linear-to-br from-deal to-brand" aria-hidden="true">
                            {index + 1}
                          </span>
                          <span className="flex-1 text-base text-foreground">{search}</span>
                          <ArrowRight size={16} weight="regular" className="text-muted-foreground shrink-0" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              </>
            )}
          </main>

          {/* Bottom Safe Area for notched devices */}
          <div className="shrink-0 h-safe-bottom bg-background" aria-hidden="true" />
        </div>
      )}
    </>
  )
}
