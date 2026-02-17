"use client"

import * as React from "react"
import { useRef, useEffect, useCallback, useId } from "react"
import { ArrowRight, Clock, Search as MagnifyingGlass, Package, Bot as Robot, TrendingUp as TrendUp, X } from "lucide-react";

import { SearchAiChat } from "@/components/shared/search/ai/search-ai-chat"
import { FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useProductSearch } from "@/hooks/use-product-search"
import { buildSearchHref, type SearchLaunchContext } from "@/components/shared/search/overlay/search-context"

interface MobileSearchOverlayProps {
  className?: string
  /** If true, hides the default trigger button (use when providing external trigger) */
  hideDefaultTrigger?: boolean
  /** External control for open state */
  externalOpen?: boolean
  /** Callback when overlay should close (for external control) */
  onOpenChange?: (open: boolean) => void
  /** Optional category context preserved when launching search results */
  searchContext?: SearchLaunchContext
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
export function MobileSearchOverlay({
  className,
  hideDefaultTrigger = false,
  externalOpen,
  onOpenChange,
  searchContext,
}: MobileSearchOverlayProps) {
  // Generate unique IDs for accessibility
  const searchInputId = useId()
  const overlayTitleId = useId()
  const overlayDescId = useId()

  // State - use external control if provided
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [aiMode, setAiMode] = React.useState(false)
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen

  const setIsOpen = React.useCallback((open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setInternalOpen(open)
    }
  }, [onOpenChange])

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const router = useRouter()
  const tNav = useTranslations("Navigation")
  const tSearch = useTranslations("SearchOverlay")
  const isAiModeAvailable =
    process.env.NEXT_PUBLIC_AI_ASSISTANT_ENABLED === "1" ||
    process.env.NEXT_PUBLIC_AI_ASSISTANT_ENABLED === "true"

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

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    clearQuery()
    triggerRef.current?.focus()
  }, [clearQuery, setIsOpen])

  // Focus input when opened
  useEffect(() => {
    if (!isOpen) return undefined

    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, FOCUS_DELAY_MS)

    return () => clearTimeout(timer)
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return undefined

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
  }, [handleClose, isOpen])

  const handleSearch = useCallback(
    (value: string) => {
      const trimmedValue = value.trim()
      if (!trimmedValue) return

      saveSearch(trimmedValue)
      handleClose()
      router.push(
        buildSearchHref({
          query: trimmedValue,
          ...(searchContext ? { context: searchContext } : {}),
        })
      )
    },
    [saveSearch, handleClose, router, searchContext]
  )

  // Build SEO-friendly product URL
  const buildProductUrl = useCallback((product: { slug?: string; storeSlug?: string | null; id: string }) => {
    if (!product.storeSlug) return "#"
    return `/${product.storeSlug}/${product.slug || product.id}`
  }, [])

  const handleProductSelect = useCallback(
    (product: { slug?: string; storeSlug?: string | null; id: string }) => {
      if (!product) return
      handleClose()
      router.push(buildProductUrl(product))
    },
    [handleClose, router, buildProductUrl]
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
      {/* Search Trigger Button - hidden when using external trigger */}
      {!hideDefaultTrigger && (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          className={cn(
            "flex items-center justify-center",
            "size-(--control-default) p-0",
            "rounded-lg text-header-text",
            "hover:bg-header-hover active:bg-header-active",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "transition-colors duration-150",
            "md:hidden touch-manipulation",
            className
          )}
          aria-label={tSearch("search")}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <MagnifyingGlass size={24} aria-hidden="true" />
        </button>
      )}

      {/* Full-Screen Search Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={overlayTitleId}
          aria-describedby={overlayDescId}
          className={cn(
            "fixed inset-0 z-60",
            "flex flex-col",
            "bg-background"
          )}
        >
          {/* Visually hidden title for screen readers */}
          <h2 id={overlayTitleId} className="sr-only">
            {tSearch("search")}
          </h2>
          <p id={overlayDescId} className="sr-only">
            {tSearch("searchDescription")}
          </p>

          {/* Search Header - Close above, full-width search below */}
          <header className="shrink-0 bg-background border-b border-border px-inset pt-2 pb-2">
            <div className="flex items-center justify-between">
              {isAiModeAvailable ? (
                <div className="flex items-center gap-2">
                  <Robot size={16} className={aiMode ? "text-primary" : "text-muted-foreground"} />
                  <span className={cn("text-sm font-medium", aiMode ? "text-foreground" : "text-muted-foreground")}>
                    {tSearch("aiMode")}
                  </span>
                  <Switch
                    checked={aiMode}
                    onCheckedChange={setAiMode}
                    aria-label={tSearch("aiMode")}
                  />
                </div>
              ) : (
                <div />
              )}
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="h-(--control-default) px-3 text-link font-medium hover:bg-transparent hover:text-link-hover"
              >
                {tSearch("close")}
              </Button>
            </div>

            {/* Search Input - hidden in AI mode */}
            {(!isAiModeAvailable || !aiMode) && (
              <form
                onSubmit={handleSubmit}
                className="relative"
                role="search"
                aria-label={tSearch("search")}
              >
                <MagnifyingGlass
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <FieldLabel htmlFor={searchInputId} className="sr-only">
                  {tSearch("searchFieldLabel")}
                </FieldLabel>
                <Input
                  ref={inputRef}
                  id={searchInputId}
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder={tNav("searchPlaceholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-(--control-default) w-full rounded-full border border-border bg-background pl-9 pr-10 text-base focus-visible:ring-0"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label={tSearch("searchFieldLabel")}
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className="absolute right-2 top-1/2 -translate-y-1/2 size-touch-xs rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-hover active:bg-active hover:text-foreground"
                    aria-label={tSearch("clear")}
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                )}
              </form>
            )}
          </header>

          {/* Search Content */}
          <main className="flex-1 overflow-y-auto overscroll-contain" role="region" aria-label={tSearch("search")}>
            {/* AI Chat Mode */}
            {isAiModeAvailable && aiMode ? (
              <SearchAiChat onClose={handleClose} className="h-full" />
            ) : (
            <>
            {/* Loading State */}
            {isSearching && (
              <div role="status" aria-live="polite" className="px-4 py-8 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-5 border-2 border-border border-t-primary rounded-full animate-spin" aria-hidden="true" />
                  <span>{tSearch("searching")}</span>
                </div>
              </div>
            )}

            {/* Product Results */}
            {!isSearching && products.length > 0 && (
              <section aria-labelledby="products-heading" className="border-b border-border">
                <div className="flex items-center justify-between px-inset py-2 bg-muted">
                  <h3 id="products-heading" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Package size={14} aria-hidden="true" />
                    {tSearch("products")}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSearch(query)}
                    className="text-xs text-link font-medium flex items-center gap-1 hover:text-link-hover"
                  >
                    {tSearch("viewAll")}
                    <ArrowRight size={12} aria-hidden="true" />
                  </button>
                </div>

                <ul className="divide-y divide-border" role="listbox" aria-label={tSearch("products")}>
                  {products.map((product) => (
                    <li key={product.id} role="option" aria-selected="false">
                      <button
                        type="button"
                        onClick={() => handleProductSelect(product)}
                        className="w-full flex items-center gap-2 p-2 hover:bg-hover active:bg-active text-left touch-manipulation transition-colors"
                      >
                        <div className="size-12 bg-muted rounded-lg overflow-hidden shrink-0 ring-1 ring-border">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                              <Package size={24} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2">{product.title}</p>
                          <p className="text-sm font-bold text-price-sale mt-0.5">{formatPrice(product.price)}</p>
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* No Results */}
            {!isSearching && query.length >= minSearchLength && products.length === 0 && (
              <div role="status" aria-live="polite" className="px-inset py-10 text-center">
                <Package size={48} className="text-muted-foreground mx-auto mb-3" aria-hidden="true" />
                <p className="text-base font-medium text-foreground">
                  {tSearch("noResultsFor", { query })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{tSearch("tryDifferent")}</p>
              </div>
            )}

            {/* Default State - Recent & Trending Searches */}
            {!query && (
              <>
                {/* Recent Searches Section */}
                {recentSearches.length > 0 && (
                  <section aria-labelledby="recent-searches-heading" className="border-b border-border">
                    <div className="flex items-center justify-between px-inset py-2 bg-muted">
                      <h3 id="recent-searches-heading" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <Clock size={14} aria-hidden="true" />
                        {tSearch("recentSearches")}
                      </h3>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-xs text-muted-foreground font-medium hover:text-foreground"
                      >
                        {tSearch("clear")}
                      </button>
                    </div>
                    <ul className="divide-y divide-border" role="list" aria-label={tSearch("recentSearches")}>
                      {recentSearches.map((search, index) => (
                        <li key={`recent-${index}`}>
                          <button
                            type="button"
                            onClick={() => handleSearch(search)}
                            className="w-full flex items-center gap-2 px-inset py-3 hover:bg-hover active:bg-active text-left touch-manipulation transition-colors"
                          >
                            <Clock size={18} className="text-muted-foreground shrink-0" aria-hidden="true" />
                            <span className="flex-1 text-base text-foreground">{search}</span>
                            <ArrowRight size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Trending Searches Section */}
                <section aria-labelledby="trending-searches-heading" className="border-b border-border">
                  <div className="flex items-center gap-2 px-inset py-2 bg-muted">
                    <h3 id="trending-searches-heading" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <TrendUp size={14} aria-hidden="true" />
                      {tSearch("trending")}
                    </h3>
                  </div>
                  <ol className="divide-y divide-border" role="list" aria-label={tSearch("trending")}>
                    {trendingSearches.map((search, index) => (
                      <li key={`trending-${index}`}>
                        <button
                          type="button"
                          onClick={() => handleSearch(search)}
                          className="w-full flex items-center gap-2 px-inset py-3 hover:bg-hover active:bg-active text-left touch-manipulation transition-colors"
                        >
                          <span className="size-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-primary-foreground bg-primary" aria-hidden="true">
                            {index + 1}
                          </span>
                          <span className="flex-1 text-base text-foreground">{search}</span>
                          <ArrowRight size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              </>
            )}
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
