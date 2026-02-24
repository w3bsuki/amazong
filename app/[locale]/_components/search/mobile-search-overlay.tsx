"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { getMobileQuickPillClass } from "@/components/mobile/chrome/mobile-control-recipes"
import { DrawerBody } from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useProductSearch } from "@/hooks/use-product-search"
import { buildSearchHref, type SearchLaunchContext } from "@/components/shared/search/search-context"
import { getProductUrl } from "@/lib/url-utils"
import { MobileSearchOverlayTrigger } from "./mobile-search-overlay-trigger"
import { MobileSearchOverlayHeaderExtra } from "./mobile-search-overlay-header-extra"
import {
  MobileSearchOverlayResults,
  type SearchOverlayProduct,
} from "./mobile-search-overlay-results"

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
  const searchLabel = tSearch("search")

  return (
    <>
      <MobileSearchOverlayTrigger
        hideDefaultTrigger={hideDefaultTrigger}
        triggerRef={triggerRef}
        isOpen={isOpen}
        className={className}
        onOpen={handleOpen}
        searchLabel={searchLabel}
      />

      <DrawerShell
        open={isOpen}
        onOpenChange={handleDrawerOpenChange}
        title={searchLabel}
        closeLabel={tSearch("close")}
        contentAriaLabel={tSearch("searchDescription")}
        titleClassName="sr-only"
        headerClassName="border-b border-border-subtle px-inset py-2"
        headerExtra={
          <MobileSearchOverlayHeaderExtra
            isAiModeAvailable={isAiModeAvailable}
            aiMode={aiMode}
            onAiModeChange={setAiMode}
            searchInputId={searchInputId}
            inputRef={inputRef}
            onSubmit={handleSubmit}
            query={query}
            onQueryChange={setQuery}
            onClearInput={handleClearInput}
            aiModeLabel={tSearch("aiMode")}
            searchLabel={searchLabel}
            searchFieldLabel={tSearch("searchFieldLabel")}
            placeholder={tNav("searchPlaceholder")}
            clearLabel={tSearch("clear")}
          />
        }
        drawerProps={{ snapPoints: [1] }}
      >
        {isAiModeAvailable && aiMode ? (
          <DrawerBody className="px-0 py-0">
            <SearchAiChat onClose={() => closeDrawer({ focusTrigger: true })} className="h-full" />
          </DrawerBody>
        ) : (
          <MobileSearchOverlayResults
            isSearching={isSearching}
            products={products as SearchOverlayProduct[]}
            formatPrice={formatPrice}
            onProductSelect={handleProductSelect}
            query={query}
            minSearchLength={minSearchLength}
            noResultsLabel={tSearch("noResultsFor", { query })}
            noResultsHelp={tSearch("tryDifferent")}
            productsLabel={tSearch("products")}
            searchingLabel={tSearch("searching")}
            recentSearches={recentSearches}
            trendingSearches={trendingSearches}
            quickChipClass={quickChipClass}
            onSearch={handleSearch}
            onClearRecentSearches={clearRecentSearches}
            recentSearchesLabel={tSearch("recentSearches")}
            trendingLabel={tSearch("trending")}
            clearLabel={tSearch("clear")}
            trimmedQuery={trimmedQuery}
            viewAllResultsLabel={tSearch("viewAllResultsFor", { query: trimmedQuery })}
            onViewAllResults={() => handleSearch(trimmedQuery)}
            drawerAriaLabel={searchLabel}
          />
        )}
      </DrawerShell>
    </>
  )
}
