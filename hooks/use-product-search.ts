"use client"

import { useState, useEffect, useCallback } from "react"
import * as nextIntl from "next-intl"
import { normalizeSearchQuery } from "@/lib/filters/search-query"
import { fetchSearchProducts } from "./use-product-search.api"
import {
  clearRecentProductsStorage,
  clearRecentSearchesStorage,
  loadRecentProducts,
  loadRecentSearches,
  persistRecentProducts,
  persistRecentSearches,
} from "./use-product-search.storage"
import {
  MAX_RECENT_PRODUCTS,
  MAX_RECENT_SEARCHES,
  MIN_SEARCH_LENGTH,
  SEARCH_DEBOUNCE_MS,
  isAbortError,
  type RecentSearchedProduct,
  type SaveSearchProductInput,
  type SearchProduct,
} from "./use-product-search.shared"

export type { SearchProduct } from "./use-product-search.shared"

/* =============================================================================
   HOOKS
============================================================================= */

/**
 * Custom hook for debouncing values
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

/**
 * Shared hook for product search functionality
 * Used by both DesktopSearch and MobileSearchOverlay
 */
export function useProductSearch(maxResults: number = 8) {
  const locale = nextIntl.useLocale()
  const useTranslations = (
    nextIntl as { useTranslations?: (namespace: string) => (key: string) => string }
  ).useTranslations
  const tSearch = useTranslations?.("SearchOverlay")
  
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<SearchProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [recentProducts, setRecentProducts] = useState<RecentSearchedProduct[]>([])

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)

  // Trending searches (localized)
  const trendingSearches = [
    ...new Set([
      tSearch?.("aiSuggestionOne") ?? (locale === "bg" ? "Черен петък оферти" : "Black Friday deals"),
      tSearch?.("aiSuggestionTwo") ?? "iPhone 15 Pro",
      tSearch?.("aiSuggestionThree") ?? (locale === "bg" ? "Коледни подаръци" : "Christmas gifts"),
      "iPhone 15 Pro",
      "PlayStation 5",
    ]),
  ]

  // Format price based on locale
  const formatPrice = useCallback(
    (price: number) => {
      return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
        style: "currency",
        currency: "EUR",
      }).format(price)
    },
    [locale]
  )

  // Load recent searches from localStorage on mount
  useEffect(() => {
    setRecentSearches(loadRecentSearches())
    setRecentProducts(loadRecentProducts())
  }, [])

  // Fetch products when debounced query changes
  useEffect(() => {
    const normalizedQuery = normalizeSearchQuery(debouncedQuery)

    if (!normalizedQuery || normalizedQuery.length < MIN_SEARCH_LENGTH) {
      setProducts([])
      setIsSearching(false)
      return
    }

    const controller = new AbortController()
    let isActive = true

    const runSearch = async () => {
      setIsSearching(true)

      try {
        const results = await fetchSearchProducts(normalizedQuery, maxResults, controller.signal)
        if (!isActive || controller.signal.aborted) return
        setProducts(results)
      } catch (error: unknown) {
        if (!isActive || controller.signal.aborted || isAbortError(error)) return

        setProducts([])
      } finally {
        if (isActive && !controller.signal.aborted) {
          setIsSearching(false)
        }
      }
    }

    void runSearch()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [debouncedQuery, maxResults])

  // Save search to recent searches
  const saveSearch = useCallback(
    (search: string) => {
      const trimmedSearch = search.trim()
      if (!trimmedSearch) return

      const updated = [
        trimmedSearch,
        ...recentSearches.filter(
          (s) => s.toLowerCase() !== trimmedSearch.toLowerCase()
        ),
      ].slice(0, MAX_RECENT_SEARCHES)

      setRecentSearches(updated)
      persistRecentSearches(updated)
    },
    [recentSearches]
  )

  // Save product to recent products
  const saveProduct = useCallback(
    (product: SaveSearchProductInput) => {
      const recentProduct: RecentSearchedProduct = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || null,
        slug: product.slug,
        storeSlug: product.storeSlug ?? null,
        searchedAt: Date.now(),
      }

      const updated = [
        recentProduct,
        ...recentProducts.filter((p) => p.id !== product.id),
      ].slice(0, MAX_RECENT_PRODUCTS)

      setRecentProducts(updated)
      persistRecentProducts(updated)
    },
    [recentProducts]
  )

  // Clear all recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    clearRecentSearchesStorage()
  }, [])

  // Clear all recent products
  const clearRecentProducts = useCallback(() => {
    setRecentProducts([])
    clearRecentProductsStorage()
  }, [])

  // Clear query and products
  const clearQuery = useCallback(() => {
    setQuery("")
    setProducts([])
  }, [])

  return {
    // State
    query,
    setQuery,
    products,
    isSearching,
    recentSearches,
    recentProducts,
    trendingSearches,
    
    // Utilities
    formatPrice,
    
    // Actions
    saveSearch,
    saveProduct,
    clearRecentSearches,
    clearRecentProducts,
    clearQuery,
    
    // Constants
    minSearchLength: MIN_SEARCH_LENGTH,
  }
}

