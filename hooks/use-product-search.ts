"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocale } from "next-intl"

/* =============================================================================
   TYPES & INTERFACES
============================================================================= */

export interface SearchProduct {
  id: string
  title: string
  price: number
  images: string[]
  slug: string
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

/** LocalStorage key for recent searches */
const RECENT_SEARCHES_KEY = "recentSearches"

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
  const locale = useLocale()
  
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<SearchProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)

  // Trending searches (localized)
  const trendingSearches = [
    locale === "bg" ? "Черен петък оферти" : "Black Friday deals",
    "iPhone 15 Pro",
    locale === "bg" ? "Коледни подаръци" : "Christmas gifts",
    "PlayStation 5",
    "AirPods Pro",
  ]

  // Format price based on locale
  const formatPrice = useCallback(
    (price: number) => {
      return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
        style: "currency",
        currency: locale === "bg" ? "BGN" : "USD",
      }).format(price)
    },
    [locale]
  )

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

  // Fetch products when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < MIN_SEARCH_LENGTH) {
      setProducts([])
      return
    }

    const controller = new AbortController()

    setIsSearching(true)
    fetch(
      `/api/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=${maxResults}`,
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

  // Clear all recent searches
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
    trendingSearches,
    
    // Utilities
    formatPrice,
    
    // Actions
    saveSearch,
    clearRecentSearches,
    clearQuery,
    
    // Constants
    minSearchLength: MIN_SEARCH_LENGTH,
  }
}
