"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import {
  ArrowRight,
  Bot as Robot,
  Clock,
  Package,
  Search as MagnifyingGlass,
  TrendingUp as TrendUp,
  X,
} from "lucide-react"

import { getMobileQuickPillClass } from "@/components/mobile/chrome/mobile-control-recipes"
import { DrawerBody, DrawerFooter } from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useProductSearch } from "@/hooks/use-product-search"
import { buildSearchHref, type SearchLaunchContext } from "@/components/shared/search/search-context"
import { getProductUrl } from "@/lib/url-utils"

const SearchAiChat = dynamic(
  () => import("@/components/shared/search/search-ai-chat").then((mod) => mod.SearchAiChat),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse bg-muted" />,
  }
)

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
  const searchInputId = React.useId()

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
  const inputRef = React.useRef<HTMLInputElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

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

  const handleOpen = React.useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const closeDrawer = React.useCallback((options?: { focusTrigger?: boolean }) => {
    setIsOpen(false)
    clearQuery()
    setAiMode(false)

    if (options?.focusTrigger ?? true) {
      triggerRef.current?.focus()
    }
  }, [clearQuery, setIsOpen])

  const handleDrawerOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) {
        setIsOpen(true)
        return
      }

      closeDrawer({ focusTrigger: true })
    },
    [closeDrawer, setIsOpen],
  )

  // Focus input when opened
  React.useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, FOCUS_DELAY_MS)

    return () => clearTimeout(timer)
  }, [isOpen])

  const handleSearch = React.useCallback(
    (value: string) => {
      const trimmedValue = value.trim()
      if (!trimmedValue) return

      saveSearch(trimmedValue)
      closeDrawer({ focusTrigger: false })
      router.push(
        buildSearchHref({
          query: trimmedValue,
          ...(searchContext ? { context: searchContext } : {}),
        })
      )
    },
    [saveSearch, closeDrawer, router, searchContext]
  )

  const handleProductSelect = React.useCallback(
    (product: { slug?: string; storeSlug?: string | null; id: string }) => {
      if (!product) return
      closeDrawer({ focusTrigger: false })
      router.push(getProductUrl(product))
    },
    [closeDrawer, router]
  )

  const handleClearInput = React.useCallback(() => {
    setQuery("")
    inputRef.current?.focus()
  }, [setQuery])

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      handleSearch(query)
    },
    [handleSearch, query]
  )

  const quickChipClass = getMobileQuickPillClass(false, "min-h-(--control-default)")
  const trimmedQuery = query.trim()

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

      <DrawerShell
        open={isOpen}
        onOpenChange={handleDrawerOpenChange}
        title={tSearch("search")}
        closeLabel={tSearch("close")}
        contentAriaLabel={tSearch("searchDescription")}
        titleClassName="sr-only"
        headerClassName="border-b border-border-subtle px-inset py-2"
        headerExtra={
          <div className="space-y-2">
            {isAiModeAvailable ? (
              <div className="flex items-center gap-2" data-vaul-no-drag>
                <Robot size={16} className={aiMode ? "text-primary" : "text-muted-foreground"} aria-hidden="true" />
                <span
                  className={cn(
                    "text-sm font-medium",
                    aiMode ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {tSearch("aiMode")}
                </span>
                <Switch checked={aiMode} onCheckedChange={setAiMode} aria-label={tSearch("aiMode")} />
              </div>
            ) : null}

            {/* Search Input - hidden in AI mode */}
            {(!isAiModeAvailable || !aiMode) && (
              <form onSubmit={handleSubmit} className="relative" role="search" aria-label={tSearch("search")}>
                <MagnifyingGlass
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground"
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
                  data-vaul-no-drag
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className="absolute right-2 top-1/2 flex size-(--control-compact) -translate-y-1/2 items-center justify-center rounded-full bg-muted text-foreground transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active"
                    aria-label={tSearch("clear")}
                    data-vaul-no-drag
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                )}
              </form>
            )}
          </div>
        }
        drawerProps={{ snapPoints: [1] }}
      >
        {isAiModeAvailable && aiMode ? (
          <DrawerBody className="px-0 py-0">
            <SearchAiChat onClose={() => closeDrawer({ focusTrigger: true })} className="h-full" />
          </DrawerBody>
        ) : (
          <>
            <DrawerBody className="px-0 py-0" aria-label={tSearch("search")}>
              {/* Loading State */}
              {isSearching && (
                <div role="status" aria-live="polite" className="px-inset py-8 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className="size-5 animate-spin rounded-full border-2 border-border border-t-primary"
                      aria-hidden="true"
                    />
                    <span>{tSearch("searching")}</span>
                  </div>
                </div>
              )}

              {/* Product Results */}
              {!isSearching && products.length > 0 && (
                <section aria-labelledby="products-heading" className="border-b border-border-subtle">
                  <div className="flex items-center gap-2 px-inset py-2">
                    <h3
                      id="products-heading"
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      <Package size={14} aria-hidden="true" />
                      {tSearch("products")}
                    </h3>
                  </div>

                  <ul className="divide-y divide-border-subtle" role="listbox" aria-label={tSearch("products")}>
                    {products.map((product) => (
                      <li key={product.id} role="option" aria-selected="false">
                        <button
                          type="button"
                          onClick={() => handleProductSelect(product)}
                          className="flex w-full items-center gap-2 px-inset py-3 text-left transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active"
                          data-vaul-no-drag
                        >
                          <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                width={56}
                                height={56}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                                <Package size={24} className="text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-medium text-foreground">{product.title}</p>
                            <p className="mt-0.5 text-sm font-bold text-price-sale">{formatPrice(product.price)}</p>
                          </div>
                          <ArrowRight size={16} className="shrink-0 text-foreground" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* No Results */}
              {!isSearching && query.length >= minSearchLength && products.length === 0 && (
                <div role="status" aria-live="polite" className="px-inset py-10 text-center">
                  <Package size={48} className="mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
                  <p className="text-base font-medium text-foreground">{tSearch("noResultsFor", { query })}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{tSearch("tryDifferent")}</p>
                </div>
              )}

              {/* Default State - Recent & Trending Searches */}
              {!query && (
                <div className="space-y-5 px-inset py-4">
                  {recentSearches.length > 0 && (
                    <section aria-labelledby="recent-searches-heading">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3
                          id="recent-searches-heading"
                          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          <Clock size={14} aria-hidden="true" />
                          {tSearch("recentSearches")}
                        </h3>
                        <button
                          type="button"
                          onClick={clearRecentSearches}
                          className="text-xs font-medium text-muted-foreground transition-colors duration-fast ease-smooth hover:text-foreground"
                          data-vaul-no-drag
                        >
                          {tSearch("clear")}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search) => (
                          <button
                            key={search}
                            type="button"
                            onClick={() => handleSearch(search)}
                            className={cn(quickChipClass, "max-w-full")}
                            data-vaul-no-drag
                          >
                            <span className="truncate">{search}</span>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  {trendingSearches.length > 0 && (
                    <section aria-labelledby="trending-searches-heading">
                      <h3
                        id="trending-searches-heading"
                        className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        <TrendUp size={14} aria-hidden="true" />
                        {tSearch("trending")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((search) => (
                          <button
                            key={search}
                            type="button"
                            onClick={() => handleSearch(search)}
                            className={cn(quickChipClass, "max-w-full")}
                            data-vaul-no-drag
                          >
                            <span className="truncate">{search}</span>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </DrawerBody>

            {trimmedQuery && (
              <DrawerFooter className="border-t border-border-subtle px-inset py-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleSearch(trimmedQuery)}
                  className="h-(--control-default) w-full justify-between rounded-full bg-surface-subtle px-4 text-sm font-semibold text-foreground hover:bg-hover active:bg-active"
                  data-vaul-no-drag
                >
                  <span className="truncate">
                    {tSearch("viewAllResultsFor", { query: trimmedQuery })}
                  </span>
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </Button>
              </DrawerFooter>
            )}
          </>
        )}
      </DrawerShell>
    </>
  )
}
