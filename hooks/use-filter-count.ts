"use client"

import { useState, useEffect, useRef, useCallback } from "react"

/**
 * useFilterCount — Client hook for live product count with debounce.
 * 
 * Per UI_UX_CODEX.md:
 * - Debounce 250-300ms
 * - Updates on every pending change
 * - Fallback to last known count if > 2s
 */

interface FilterCountParams {
  categoryId?: string | null
  query?: string | null
  filters?: {
    minPrice?: number | null
    maxPrice?: number | null
    minRating?: number | null
    availability?: "instock" | null
    deals?: boolean | null
    verified?: boolean | null
    attributes?: Record<string, string | string[]>
  }
}

interface UseFilterCountResult {
  count: number
  isLoading: boolean
  error: string | null
}

const DEBOUNCE_MS = 280
const TIMEOUT_MS = 2000

export function useFilterCount(params: FilterCountParams): UseFilterCountResult {
  const [count, setCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastCountRef = useRef<number>(0)

  const fetchCount = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    // Set timeout fallback
    const fallbackTimeout = setTimeout(() => {
      if (!signal.aborted) {
        // Stop the request; we already decided to fall back.
        abortControllerRef.current?.abort()

        // Fallback to last known count
        setCount(lastCountRef.current)
        setIsLoading(false)
      }
    }, TIMEOUT_MS)

    try {
      const response = await fetch("/api/products/count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal,
      })

      clearTimeout(fallbackTimeout)

      if (signal.aborted) return

      if (!response.ok) {
        throw new Error("Failed to fetch count")
      }

      const data = await response.json()
      const newCount = data.count ?? 0

      lastCountRef.current = newCount
      setCount(newCount)
      setIsLoading(false)
    } catch (err) {
      clearTimeout(fallbackTimeout)
      
      if (signal.aborted) return

      // On error, keep last known count
      setCount(lastCountRef.current)
      setError(err instanceof Error ? err.message : "Unknown error")
      setIsLoading(false)
    }
  }, [params])

  useEffect(() => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }

    // Debounce the fetch
    const controller = new AbortController()
    abortControllerRef.current = controller

    timeoutIdRef.current = setTimeout(() => {
      fetchCount(controller.signal)
    }, DEBOUNCE_MS)

    return () => {
      controller.abort()
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [
    params.categoryId,
    params.query,
    params.filters?.minPrice,
    params.filters?.maxPrice,
    params.filters?.minRating,
    params.filters?.availability,
    params.filters?.deals,
    params.filters?.verified,
    // Stringify attributes for stable dependency
    JSON.stringify(params.filters?.attributes),
  ])

  return { count, isLoading, error }
}
