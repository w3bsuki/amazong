"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface CategoryCounts {
  [slug: string]: number
}

interface UseCategoryCountsResult {
  counts: CategoryCounts
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// Cache key for localStorage - v3 invalidates stale empty payloads from older cache logic.
const CACHE_KEY = "category-counts-v3"
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

// Retry configuration
const MAX_RETRIES = 2
const RETRY_DELAY_MS = 1000

interface CacheEntry {
  counts: CategoryCounts
  timestamp: number
}

function isCountsMapUsable(counts: CategoryCounts): boolean {
  return Object.keys(counts).length > 0
}

function getFromCache(): CategoryCounts | null {
  if (typeof window === "undefined") return null
  
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const entry: CacheEntry = JSON.parse(cached)
    if (!isCountsMapUsable(entry.counts)) {
      return null
    }

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
 * Fails gracefully without console errors - uses cached data as fallback.
 */
export function useCategoryCounts(): UseCategoryCountsResult {
  const [counts, setCounts] = useState<CategoryCounts>(() => getFromCache() || {})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)

  const fetchCounts = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch(
        "/api/categories/counts",
        signal ? { signal } : undefined
      )
      
      // Check if aborted before processing response
      if (signal?.aborted) return
      
      if (!res.ok) {
        // Don't retry on client errors (4xx), only server errors (5xx)
        if (res.status >= 400 && res.status < 500) {
          setError(`Client error: ${res.status}`)
          return
        }
        throw new Error(`Server error: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (data.counts && typeof data.counts === "object") {
        const nextCounts = data.counts as CategoryCounts
        if (!isCountsMapUsable(nextCounts)) {
          throw new Error("Empty counts payload")
        }
        setCounts(nextCounts)
        saveToCache(nextCounts)
        retryCountRef.current = 0 // Reset retry count on success
      }
    } catch (e) {
      // Silently ignore aborted requests
      if (e instanceof Error && e.name === "AbortError") {
        return
      }
      
      const message = e instanceof Error ? e.message : "Unknown error"
      
      // Retry logic for transient failures
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++
        // Schedule retry with exponential backoff
        setTimeout(() => {
          if (!signal?.aborted) {
            fetchCounts(signal)
          }
        }, RETRY_DELAY_MS * retryCountRef.current)
        return
      }
      
      // After all retries exhausted, set error state but don't log to console
      // The hook has cached data as fallback, so this is a graceful degradation
      setError(message)
      
      // Only log in development for debugging, not in production
      if (process.env.NODE_ENV === "development") {
        // Use console.debug instead of console.error - less noisy
        console.debug("[useCategoryCounts] Failed after retries, using cached data:", message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Public refetch function (creates new abort controller)
  const refetch = useCallback(() => {
    // Cancel any in-flight request
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    retryCountRef.current = 0
    fetchCounts(abortControllerRef.current.signal)
  }, [fetchCounts])

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
        
        // If cache is fresh and has usable data, don't refetch.
        if (age < CACHE_TTL_MS && isCountsMapUsable(entry.counts)) {
          return
        }
      } catch {
        // Parse error, fetch fresh data
      }
    }
    
    // Create abort controller for this fetch
    abortControllerRef.current = new AbortController()
    
    // Fetch fresh data (either no cache or stale cache)
    fetchCounts(abortControllerRef.current.signal)
    
    // Cleanup: abort any in-flight request on unmount
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [fetchCounts, hasFetched])

  return { counts, isLoading, error, refetch }
}
