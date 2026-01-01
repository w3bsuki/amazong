"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocale } from "next-intl"
import { safeJsonParse } from "@/lib/safe-json"

/* =============================================================================
   TYPES & INTERFACES
============================================================================= */

export interface SearchProduct {
  id: string
  title: string
  price: number
  images: string[]
  slug: string
  storeSlug?: string | null
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

/** Maximum number of recent searched products to store */
const MAX_RECENT_PRODUCTS = 6

/** LocalStorage key for recent searches */
const RECENT_SEARCHES_KEY = "recentSearches"

/** LocalStorage key for recent searched products */
const RECENT_PRODUCTS_KEY = "recentSearchedProducts"

/** Recent searched product type */
export interface RecentSearchedProduct {
  id: string
  title: string
  price: number
  image: string | null
  slug: string
  storeSlug?: string | null
  searchedAt: number
}

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
  const [recentProducts, setRecentProducts] = useState<RecentSearchedProduct[]>([])

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
        const parsed = safeJsonParse<unknown>(saved)
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES) as string[])
        } else {
          localStorage.removeItem(RECENT_SEARCHES_KEY)
        }
      }
    } catch {
      // Ignore storage access issues
    }

    // Load recent products
    try {
      const savedProducts = localStorage.getItem(RECENT_PRODUCTS_KEY)
      if (savedProducts) {
        const parsed = safeJsonParse<unknown>(savedProducts)
        if (Array.isArray(parsed)) {
          setRecentProducts(parsed.slice(0, MAX_RECENT_PRODUCTS) as RecentSearchedProduct[])
        } else {
          localStorage.removeItem(RECENT_PRODUCTS_KEY)
        }
      }
    } catch {
      // Ignore storage access issues
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
      .then(async (res) => {
        if (!res.ok) return null
        try {
          return await res.json()
        } catch {
          return null
        }
      })
      .then((data) => {
        setProducts((data && Array.isArray((data as { products?: unknown }).products))
          ? ((data as { products: SearchProduct[] }).products)
          : [])
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
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
        } catch {
          // Ignore storage errors
        }
      }
    },
    [recentSearches]
  )

  // Save product to recent products
  const saveProduct = useCallback(
    (product: SearchProduct) => {
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

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(updated))
        } catch {
          // Ignore storage errors
        }
      }
    },
    [recentProducts]
  )

  // Clear all recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(RECENT_SEARCHES_KEY)
      } catch {
        // Ignore storage errors
      }
    }
  }, [])

  // Clear all recent products
  const clearRecentProducts = useCallback(() => {
    setRecentProducts([])
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(RECENT_PRODUCTS_KEY)
      } catch {
        // Ignore storage errors
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
