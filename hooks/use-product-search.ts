"use client"

import { useState, useEffect, useCallback } from "react"
import * as nextIntl from "next-intl"
import { safeJsonParse } from "@/lib/safe-json"
import { z } from "zod"
import { normalizeSearchQuery } from "@/lib/filters/search-query"

/* =============================================================================
   TYPES & INTERFACES
============================================================================= */

export interface SearchProduct {
  id: string
  title: string
  price: number
  images: string[]
  slug: string
  storeSlug: string | null
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
interface RecentSearchedProduct {
  id: string
  title: string
  price: number
  image: string | null
  slug: string
  storeSlug: string | null
  searchedAt: number
}

type SaveSearchProductInput = Omit<SearchProduct, "storeSlug"> & {
  storeSlug?: string | null
}

const SearchProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  images: z.array(z.string()),
  slug: z.string(),
  storeSlug: z.string().nullable().optional().default(null),
})

const ProductSearchResponseSchema = z.object({
  products: z.array(SearchProductSchema).default([]),
})

const RecentSearchesSchema = z.array(z.string())

const RecentSearchedProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  image: z.string().nullable(),
  slug: z.string(),
  storeSlug: z.string().nullable().optional().default(null),
  searchedAt: z.number(),
})

const RecentProductsSchema = z.array(RecentSearchedProductSchema)

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError"
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
    if (typeof window === "undefined") return

    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (saved) {
        const parsed = safeJsonParse<unknown>(saved)
        const validated = RecentSearchesSchema.safeParse(parsed)
        if (validated.success) {
          setRecentSearches(validated.data.slice(0, MAX_RECENT_SEARCHES))
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
        const validated = RecentProductsSchema.safeParse(parsed)
        if (validated.success) {
          setRecentProducts(validated.data.slice(0, MAX_RECENT_PRODUCTS))
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
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(normalizedQuery)}&limit=${maxResults}`,
          { signal: controller.signal }
        )

        if (!res.ok) {
          if (isActive && !controller.signal.aborted) {
            setProducts([])
          }
          return
        }

        let data: unknown = null
        try {
          data = await res.json()
        } catch {
          data = null
        }

        if (!isActive || controller.signal.aborted) return

        const validated = ProductSearchResponseSchema.safeParse(data)
        setProducts(validated.success ? validated.data.products : [])
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

