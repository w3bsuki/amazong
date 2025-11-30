"use client"

import * as React from "react"
import { useState, useEffect, useRef, useCallback, useId } from "react"
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

/* =============================================================================
   TYPES & INTERFACES
============================================================================= */

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  slug: string
}

interface MobileSearchOverlayProps {
  /** Additional CSS classes for the trigger button */
  className?: string
}

/* =============================================================================
   CONSTANTS
============================================================================= */

/** Debounce delay in milliseconds for search input */
const SEARCH_DEBOUNCE_MS = 300

/** Minimum characters before triggering search */
const MIN_SEARCH_LENGTH = 2

/** Maximum number of recent searches to store */
const MAX_RECENT_SEARCHES = 5

/** Maximum number of product results to display */
const MAX_PRODUCT_RESULTS = 8

/** LocalStorage key for recent searches */
const RECENT_SEARCHES_KEY = "recentSearches"

/** Focus delay in milliseconds after overlay opens */
const FOCUS_DELAY_MS = 100

/* =============================================================================
   HOOKS
============================================================================= */

/**
 * Custom hook for debouncing values
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
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

/* =============================================================================
   COMPONENT
============================================================================= */

/**
 * Mobile Search Overlay Component
 * 
 * A full-screen search overlay optimized for mobile devices with:
 * - Live product search with debouncing
 * - Recent searches with localStorage persistence
 * - Trending searches
 * - Full WCAG 2.1 AA accessibility compliance
 * - Proper focus management and keyboard navigation
 */
export function MobileSearchOverlay({ className }: MobileSearchOverlayProps) {
  // Generate unique IDs for accessibility
  const searchInputId = useId()
  const overlayTitleId = useId()
  const overlayDescId = useId()

  // State
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search query
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS)

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const router = useRouter()
  const locale = useLocale()

  // Localized strings (fallback if translations not available)
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

  // Trending searches (localized)
  const trendingSearches = React.useMemo(
    () => [
      locale === "bg" ? "Черен петък оферти" : "Black Friday deals",
      "iPhone 15",
      locale === "bg" ? "Коледни подаръци" : "Christmas gifts",
      "PlayStation 5",
      "AirPods",
    ],
    [locale]
  )

  /* ---------------------------------------------------------------------------
     EFFECTS
  --------------------------------------------------------------------------- */

  // Fetch products when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < MIN_SEARCH_LENGTH) {
      setProducts([])
      return
    }

    const controller = new AbortController()

    setIsSearching(true)
    fetch(
      `/api/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=${MAX_PRODUCT_RESULTS}`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to search products:", err)
          setProducts([])
        }
      })
      .finally(() => {
        setIsSearching(false)
      })

    return () => controller.abort()
  }, [debouncedQuery])

  // Focus input when opened with proper delay for animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, FOCUS_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Lock body scroll when open (prevent background scrolling)
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

  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES))
        }
      }
    } catch (e) {
      console.error("Failed to parse recent searches:", e)
    }
  }, [])

  /* ---------------------------------------------------------------------------
     HANDLERS
  --------------------------------------------------------------------------- */

  const formatPrice = useCallback(
    (price: number) => {
      return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
        style: "currency",
        currency: locale === "bg" ? "BGN" : "USD",
      }).format(price)
    },
    [locale]
  )

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setSearchQuery("")
    setProducts([])
    // Return focus to trigger button for accessibility
    triggerRef.current?.focus()
  }, [])

  const saveRecentSearch = useCallback(
    (value: string) => {
      const updated = [
        value,
        ...recentSearches.filter((s) => s.toLowerCase() !== value.toLowerCase()),
      ].slice(0, MAX_RECENT_SEARCHES)
      setRecentSearches(updated)

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
        } catch (e) {
          console.error("Failed to save recent searches:", e)
        }
      }
    },
    [recentSearches]
  )

  const handleSearch = useCallback(
    (value: string) => {
      const trimmedValue = value.trim()
      if (!trimmedValue) return

      saveRecentSearch(trimmedValue)
      handleClose()
      router.push(`/search?q=${encodeURIComponent(trimmedValue)}`)
    },
    [saveRecentSearch, handleClose, router]
  )

  const handleProductSelect = useCallback(
    (slugOrId: string) => {
      if (!slugOrId) return
      handleClose()
      router.push(`/product/${slugOrId}`)
    },
    [handleClose, router]
  )

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(RECENT_SEARCHES_KEY)
      } catch (e) {
        console.error("Failed to clear recent searches:", e)
      }
    }
  }, [])

  const handleClearInput = useCallback(() => {
    setSearchQuery("")
    setProducts([])
    inputRef.current?.focus()
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      handleSearch(searchQuery)
    },
    [handleSearch, searchQuery]
  )

  /* ---------------------------------------------------------------------------
     RENDER
  --------------------------------------------------------------------------- */

  return (
    <>
      {/* Search Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          // Base styles
          "flex items-center justify-center",
          // Size - WCAG 2.1 AA minimum touch target (44x44)
          "size-11 p-0",
          // Visual
          "rounded-lg text-header-text",
          // Interactive states
          "hover:bg-header-hover active:bg-header-active",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Animation
          "transition-colors duration-150",
          // Mobile optimization
          "md:hidden touch-action-manipulation",
          // Custom classes
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
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={overlayTitleId}
          aria-describedby={overlayDescId}
          className={cn(
            // Positioning
            "fixed inset-0 z-100",
            // Layout
            "flex flex-col",
            // Visual
            "bg-background",
            // Animation
            "animate-in fade-in slide-in-from-top-2 duration-200",
            // Mobile only
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

          {/* Search Header - Clean minimal design */}
          <header
            data-slot="search-header"
            className="shrink-0 bg-background border-b border-border"
          >
            {/* Close Button Row */}
            <div className="flex justify-end px-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className={cn(
                  "size-10 rounded-full",
                  "text-muted-foreground",
                  "hover:bg-muted hover:text-foreground",
                  "active:bg-muted/80",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
                aria-label={strings.close}
              >
                <X size={22} weight="regular" aria-hidden="true" />
              </Button>
            </div>

            {/* Search Input - Full width */}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "h-12 w-full",
                    "pl-11 pr-11",
                    "text-base",
                    "bg-muted border-0 rounded-full",
                    "placeholder:text-muted-foreground",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                  )}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label={strings.searchProducts}
                  aria-describedby={
                    isSearching
                      ? "search-status"
                      : products.length > 0
                      ? "search-results-count"
                      : undefined
                  }
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className={cn(
                      "absolute right-3.5 top-1/2 -translate-y-1/2",
                      "size-6 rounded-full",
                      "flex items-center justify-center",
                      "bg-muted-foreground/20 text-muted-foreground",
                      "hover:bg-muted-foreground/30 hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "transition-colors"
                    )}
                    aria-label={strings.clear}
                  >
                    <X size={14} weight="bold" aria-hidden="true" />
                  </button>
                )}
              </div>
            </form>
          </header>

          {/* Search Content - Scrollable region */}
          <main
            data-slot="search-content"
            className="flex-1 overflow-y-auto overscroll-contain"
            role="region"
            aria-label={strings.search}
          >
            {/* Loading State */}
            {isSearching && (
              <div
                id="search-status"
                role="status"
                aria-live="polite"
                className="px-4 py-8 text-center"
              >
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div
                    className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  <span>{strings.searching}</span>
                </div>
              </div>
            )}

            {/* Live Product Search Results */}
            {!isSearching && products.length > 0 && (
              <section
                aria-labelledby="products-heading"
                className="border-b border-border"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-muted">
                  <h3
                    id="products-heading"
                    className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    <Package size={14} weight="regular" aria-hidden="true" />
                    {strings.products}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSearch(searchQuery)}
                    className={cn(
                      "text-xs text-primary font-medium",
                      "flex items-center gap-1",
                      "hover:text-primary/80",
                      "focus-visible:outline-none focus-visible:underline"
                    )}
                  >
                    {strings.viewAll}
                    <ArrowRight size={12} weight="regular" aria-hidden="true" />
                  </button>
                </div>

                {/* Screen reader announcement for results count */}
                <div id="search-results-count" className="sr-only" aria-live="polite">
                  {products.length} {strings.products.toLowerCase()}
                </div>

                <ul
                  className="divide-y divide-border"
                  role="listbox"
                  aria-label={strings.products}
                >
                  {products.map((product) => (
                    <li key={product.id} role="option" aria-selected="false">
                      <button
                        type="button"
                        onClick={() => handleProductSelect(product.slug || product.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3",
                          "hover:bg-muted active:bg-muted/80",
                          "focus-visible:outline-none focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                          "text-left touch-action-manipulation",
                          "transition-colors"
                        )}
                      >
                        {/* Product Image */}
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
                            <div
                              className="w-full h-full flex items-center justify-center"
                              aria-hidden="true"
                            >
                              <Package
                                size={24}
                                weight="regular"
                                className="text-muted-foreground"
                              />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {product.title}
                          </p>
                          <p className="text-sm font-bold text-price-sale mt-0.5">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        {/* Arrow indicator */}
                        <ArrowRight
                          size={16}
                          weight="regular"
                          className="text-muted-foreground shrink-0"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* No Results */}
            {!isSearching &&
              searchQuery.length >= MIN_SEARCH_LENGTH &&
              products.length === 0 && (
                <div
                  role="status"
                  aria-live="polite"
                  className="px-4 py-12 text-center"
                >
                  <Package
                    size={48}
                    weight="regular"
                    className="text-muted-foreground/50 mx-auto mb-3"
                    aria-hidden="true"
                  />
                  <p className="text-base font-medium text-foreground">
                    {strings.noResults} &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {strings.tryDifferent}
                  </p>
                </div>
              )}

            {/* Default State - Recent & Trending Searches */}
            {!searchQuery && (
              <>
                {/* Recent Searches Section */}
                {recentSearches.length > 0 && (
                  <section
                    aria-labelledby="recent-searches-heading"
                    className="border-b border-border"
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-muted">
                      <h3
                        id="recent-searches-heading"
                        className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                      >
                        <Clock size={14} weight="regular" aria-hidden="true" />
                        {strings.recentSearches}
                      </h3>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className={cn(
                          "text-xs text-muted-foreground font-medium",
                          "hover:text-foreground",
                          "focus-visible:outline-none focus-visible:underline"
                        )}
                      >
                        {strings.clear}
                      </button>
                    </div>
                    <ul
                      className="divide-y divide-border"
                      role="list"
                      aria-label={strings.recentSearches}
                    >
                      {recentSearches.map((search, index) => (
                        <li key={`recent-${index}`}>
                          <button
                            type="button"
                            onClick={() => handleSearch(search)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3.5",
                              "hover:bg-muted active:bg-muted/80",
                              "focus-visible:outline-none focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                              "text-left touch-action-manipulation",
                              "transition-colors"
                            )}
                          >
                            <Clock
                              size={18}
                              weight="regular"
                              className="text-muted-foreground shrink-0"
                              aria-hidden="true"
                            />
                            <span className="flex-1 text-base text-foreground">
                              {search}
                            </span>
                            <ArrowRight
                              size={16}
                              weight="regular"
                              className="text-muted-foreground shrink-0"
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Trending Searches Section */}
                <section
                  aria-labelledby="trending-searches-heading"
                  className="border-b border-border"
                >
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted">
                    <h3
                      id="trending-searches-heading"
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      <TrendUp size={14} weight="regular" aria-hidden="true" />
                      {strings.trending}
                    </h3>
                  </div>
                  <ol
                    className="divide-y divide-border"
                    role="list"
                    aria-label={strings.trending}
                  >
                    {trendingSearches.map((search, index) => (
                      <li key={`trending-${index}`}>
                        <button
                          type="button"
                          onClick={() => handleSearch(search)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3.5",
                            "hover:bg-muted active:bg-muted/80",
                            "focus-visible:outline-none focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                            "text-left touch-action-manipulation",
                            "transition-colors"
                          )}
                        >
                          {/* Ranking Badge */}
                          <span
                            className={cn(
                              "size-6 rounded-full shrink-0",
                              "flex items-center justify-center",
                              "text-[11px] font-bold text-white",
                              "bg-linear-to-br from-deal to-brand"
                            )}
                            aria-hidden="true"
                          >
                            {index + 1}
                          </span>
                          <span className="flex-1 text-base text-foreground">
                            {search}
                          </span>
                          <ArrowRight
                            size={16}
                            weight="regular"
                            className="text-muted-foreground shrink-0"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              </>
            )}
          </main>

          {/* Bottom Safe Area for notched devices */}
          <div
            className="shrink-0 h-safe-bottom bg-background"
            aria-hidden="true"
          />
        </div>
      )}
    </>
  )
}
