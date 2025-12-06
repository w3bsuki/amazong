/**
 * useCategoriesCache Hook
 * 
 * Shared caching logic for category data fetching.
 * Prevents duplicate API calls and provides consistent category data
 * across mega-menu and category-subheader components.
 */

"use client"

import { useState, useEffect, useCallback } from "react"

export interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon?: string | null
  image_url?: string | null
  children?: Category[]
}

// Global cache state (outside React to persist across component instances)
let categoriesCache: Category[] | null = null
let categoriesFetching = false
let categoriesCallbacks: Array<(cats: Category[]) => void> = []
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes TTL

interface UseCategoriesCacheOptions {
  /** Fetch depth for children (1 = L0->L1, 2 = L0->L1->L2) */
  depth?: number
  /** Force fresh fetch ignoring cache */
  forceFresh?: boolean
  /** Minimum categories expected (triggers refetch if below) */
  minCategories?: number
}

interface UseCategoriesCacheReturn {
  categories: Category[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook for fetching and caching categories
 * 
 * @example
 * // Basic usage (depth 1)
 * const { categories, isLoading } = useCategoriesCache()
 * 
 * @example
 * // With depth 2 for mega menus
 * const { categories, isLoading } = useCategoriesCache({ depth: 2 })
 */
export function useCategoriesCache(
  options: UseCategoriesCacheOptions = {}
): UseCategoriesCacheReturn {
  const { depth = 1, forceFresh = false, minCategories = 20 } = options
  
  const [categories, setCategories] = useState<Category[]>(categoriesCache || [])
  const [isLoading, setIsLoading] = useState(!categoriesCache)
  const [error, setError] = useState<Error | null>(null)

  const fetchCategories = useCallback(async () => {
    const now = Date.now()
    const cacheExpired = now - cacheTimestamp > CACHE_TTL
    
    // Check if cache is valid
    if (!forceFresh && !cacheExpired && categoriesCache && categoriesCache.length >= minCategories) {
      setCategories(categoriesCache)
      setIsLoading(false)
      return
    }

    // If already fetching, queue callback
    if (categoriesFetching) {
      categoriesCallbacks.push((cats) => {
        setCategories(cats)
        setIsLoading(false)
      })
      return
    }

    categoriesFetching = true
    setIsLoading(true)
    setError(null)

    try {
      const url = depth > 1 
        ? `/api/categories?children=true&depth=${depth}`
        : "/api/categories?children=true"
      
      const response = await fetch(url, { cache: 'no-store' })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`)
      }
      
      const data = await response.json()
      const cats = data.categories || []
      
      // Update cache
      categoriesCache = cats
      cacheTimestamp = Date.now()
      
      setCategories(cats)
      
      // Notify waiting callbacks
      categoriesCallbacks.forEach(cb => cb(cats))
      categoriesCallbacks = []
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error")
      setError(error)
      console.error("[useCategoriesCache] Failed to fetch categories:", error)
    } finally {
      categoriesFetching = false
      setIsLoading(false)
    }
  }, [depth, forceFresh, minCategories])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const refetch = useCallback(() => {
    // Clear cache to force refetch
    categoriesCache = null
    cacheTimestamp = 0
    fetchCategories()
  }, [fetchCategories])

  return { categories, isLoading, error, refetch }
}

/**
 * Utility to get localized category name
 */
export function getCategoryName(category: Category, locale: string): string {
  if (locale === 'bg' && category.name_bg) {
    return category.name_bg
  }
  return category.name
}

/**
 * Clear the categories cache
 * Useful for testing or after data mutations
 */
export function clearCategoriesCache(): void {
  categoriesCache = null
  cacheTimestamp = 0
}
