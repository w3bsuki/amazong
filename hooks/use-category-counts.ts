"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { logger } from "@/lib/logger"

interface CategoryCounts {
  [slug: string]: number
}

interface UseCategoryCountsResult {
  counts: CategoryCounts
  isLoading: boolean
  error: string | null
  refetch: () => void
}

interface UseCategoryCountsOptions {
  enabled?: boolean
}

// Cache key for localStorage - v4 invalidates older partial payloads.
const CACHE_KEY = "category-counts-v4"
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

// Retry configuration
const MAX_RETRIES = 2
const RETRY_DELAY_MS = 1000

interface CacheEntry {
  counts: CategoryCounts
  timestamp: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function toCategoryCounts(value: unknown): CategoryCounts | null {
  if (!isRecord(value)) return null

  const counts: CategoryCounts = {}
  for (const [slug, count] of Object.entries(value)) {
    if (typeof count === "number" && Number.isFinite(count)) {
      counts[slug] = count
    }
  }

  return Object.keys(counts).length > 0 ? counts : null
}

function parseCacheEntry(value: string): CacheEntry | null {
  const parsed: unknown = JSON.parse(value)
  if (!isRecord(parsed)) return null
  if (typeof parsed.timestamp !== "number" || !Number.isFinite(parsed.timestamp)) {
    return null
  }

  const counts = toCategoryCounts(parsed.counts)
  if (!counts) return null

  return {
    counts,
    timestamp: parsed.timestamp,
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError"
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === "string") return error
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message
  }

  return "Unknown error"
}

function isCountsMapUsable(counts: CategoryCounts): boolean {
  return Object.keys(counts).length > 0
}

function getFromCache(): CategoryCounts | null {
  if (typeof window === "undefined") return null
  
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const entry = parseCacheEntry(cached)
    if (!entry) {
      return null
    }
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
export function useCategoryCounts(options?: UseCategoryCountsOptions): UseCategoryCountsResult {
  const enabled = options?.enabled ?? true
  const [counts, setCounts] = useState<CategoryCounts>(() => getFromCache() || {})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasFetchedRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)
  const mountedRef = useRef(true)

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current !== null) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  const fetchCounts = useCallback(async (signal?: AbortSignal, requestId?: number) => {
    const isRequestActive = () => {
      const isCurrentRequest = requestId === undefined || requestIdRef.current === requestId
      return mountedRef.current && !signal?.aborted && isCurrentRequest
    }

    if (isRequestActive()) {
      setIsLoading(true)
      setError(null)
    }
    
    try {
      const res = await fetch(
        "/api/categories/counts",
        signal ? { signal } : undefined
      )
      
      // Check if aborted before processing response
      if (!isRequestActive()) return
      
      if (!res.ok) {
        // Don't retry on client errors (4xx), only server errors (5xx)
        if (res.status >= 400 && res.status < 500) {
          if (isRequestActive()) {
            setError(`Client error: ${res.status}`)
          }
          return
        }
        throw new Error(`Server error: ${res.status}`)
      }
      
      let payload: unknown = null
      try {
        payload = await res.json()
      } catch {
        throw new Error("Invalid response payload")
      }

      if (!isRequestActive()) return

      const countsValue = isRecord(payload) ? payload.counts : null
      const nextCounts = toCategoryCounts(countsValue)
      if (!nextCounts || !isCountsMapUsable(nextCounts)) {
        throw new Error("Empty counts payload")
      }
      setCounts(nextCounts)
      saveToCache(nextCounts)
      retryCountRef.current = 0 // Reset retry count on success
    } catch (e) {
      // Silently ignore aborted requests
      if (isAbortError(e) || !isRequestActive()) {
        return
      }
      
      const message = getErrorMessage(e)
      
      // Retry logic for transient failures
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++
        clearRetryTimeout()
        // Schedule retry with exponential backoff
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null
          if (mountedRef.current && !signal?.aborted) {
            void fetchCounts(signal, requestId)
          }
        }, RETRY_DELAY_MS * retryCountRef.current)
        return
      }
      
      // After all retries exhausted, set error state but don't log noisy errors
      // The hook has cached data as fallback, so this is a graceful degradation
      setError(message)
      
      // Only log in development for debugging, not in production
      if (process.env.NODE_ENV === "development") {
        logger.debug("[useCategoryCounts] Failed after retries, using cached data", { error: message })
      }
    } finally {
      if (isRequestActive()) {
        setIsLoading(false)
      }
    }
  }, [clearRetryTimeout])

  useEffect(() => {
    return () => {
      mountedRef.current = false
      requestIdRef.current += 1
      clearRetryTimeout()
      abortControllerRef.current?.abort()
    }
  }, [clearRetryTimeout])

  // Public refetch function (creates new abort controller)
  const refetch = useCallback(() => {
    if (!enabled) return
    // Cancel any in-flight request
    abortControllerRef.current?.abort()
    clearRetryTimeout()
    abortControllerRef.current = new AbortController()
    requestIdRef.current += 1
    const requestId = requestIdRef.current
    retryCountRef.current = 0
    void fetchCounts(abortControllerRef.current.signal, requestId)
  }, [enabled, fetchCounts, clearRetryTimeout])

  useEffect(() => {
    if (!enabled) {
      abortControllerRef.current?.abort()
      clearRetryTimeout()
      requestIdRef.current += 1
      setIsLoading(false)
      setError(null)
      return
    }

    // Only fetch on client-side and only once.
    if (typeof window === "undefined" || hasFetchedRef.current) return

    hasFetchedRef.current = true
    
    // Check if cache is stale (but we already loaded stale data)
    let cached: string | null = null
    try {
      cached = localStorage.getItem(CACHE_KEY)
    } catch {
      cached = null
    }
    if (cached) {
      try {
        const entry = parseCacheEntry(cached)
        if (!entry) {
          throw new Error("Invalid cache payload")
        }
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
    requestIdRef.current += 1
    const requestId = requestIdRef.current
    
    // Fetch fresh data (either no cache or stale cache)
    void fetchCounts(abortControllerRef.current.signal, requestId)
    
    // Cleanup: abort any in-flight request on unmount
    return () => {
      abortControllerRef.current?.abort()
      clearRetryTimeout()
      requestIdRef.current += 1
    }
  }, [enabled, fetchCounts, clearRetryTimeout])

  return { counts, isLoading, error, refetch }
}

