"use client"

import { useState, useEffect, useCallback } from "react"

interface CategoryCounts {
  [slug: string]: number
}

interface UseCategoryCountsResult {
  counts: CategoryCounts
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// Cache key for localStorage
const CACHE_KEY = "category-counts"
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface CacheEntry {
  counts: CategoryCounts
  timestamp: number
}

function getFromCache(): CategoryCounts | null {
  if (typeof window === "undefined") return null
  
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const entry: CacheEntry = JSON.parse(cached)
    const age = Date.now() - entry.timestamp
    
    // Return cached data if still fresh
    if (age < CACHE_TTL_MS) {
      return entry.counts
    }
    
    // Cache expired, but return stale data while we refetch
    return entry.counts
  } catch {
    return null
  }
}

function saveToCache(counts: CategoryCounts): void {
  if (typeof window === "undefined") return
  
  try {
    const entry: CacheEntry = {
      counts,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // localStorage might be full or disabled
  }
}

/**
 * Hook to fetch and cache category listing counts.
 * Uses localStorage for client-side caching to avoid repeated fetches.
 */
export function useCategoryCounts(): UseCategoryCountsResult {
  const [counts, setCounts] = useState<CategoryCounts>(() => getFromCache() || {})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchCounts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch("/api/categories/counts")
      if (!res.ok) {
        throw new Error(`Failed to fetch counts: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (data.counts && typeof data.counts === "object") {
        setCounts(data.counts)
        saveToCache(data.counts)
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
      console.error("[useCategoryCounts] Error:", message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Only fetch on client-side and only once
    if (typeof window === "undefined" || hasFetched) return
    
    setHasFetched(true)
    
    // Check if cache is stale (but we already loaded stale data)
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const entry: CacheEntry = JSON.parse(cached)
        const age = Date.now() - entry.timestamp
        
        // If cache is fresh, don't refetch
        if (age < CACHE_TTL_MS) {
          return
        }
      } catch {
        // Parse error, fetch fresh data
      }
    }
    
    // Fetch fresh data (either no cache or stale cache)
    fetchCounts()
  }, [fetchCounts, hasFetched])

  return { counts, isLoading, error, refetch: fetchCounts }
}
