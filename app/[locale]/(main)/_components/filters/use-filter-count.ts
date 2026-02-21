import { useState, useEffect, useRef, useCallback, useMemo } from "react"

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
    city?: string | null
    nearby?: boolean | null
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

  const categoryId = params.categoryId
  const query = params.query
  const minPrice = params.filters?.minPrice
  const maxPrice = params.filters?.maxPrice
  const minRating = params.filters?.minRating
  const availability = params.filters?.availability
  const deals = params.filters?.deals
  const verified = params.filters?.verified
  const city = params.filters?.city
  const nearby = params.filters?.nearby
  const attributes = params.filters?.attributes
  const hasFilters = params.filters !== undefined

  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastCountRef = useRef<number>(0)
  const attributesKey = useMemo(
    () => JSON.stringify(attributes ?? {}),
    [attributes],
  )

  const fetchCount = useCallback(async (signal: AbortSignal, requestParams: FilterCountParams) => {
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
        body: JSON.stringify(requestParams),
        signal,
      })

      clearTimeout(fallbackTimeout)

      if (signal.aborted) return

      if (!response.ok) {
        throw new Error("Failed to fetch count")
      }

      const data = (await response.json()) as { count?: number }
      const newCount = typeof data.count === "number" ? data.count : 0

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
  }, [])

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
    const requestParams: FilterCountParams = {}

    if (categoryId !== undefined) {
      requestParams.categoryId = categoryId
    }

    if (query !== undefined) {
      requestParams.query = query
    }

    if (hasFilters) {
      const filterParams: NonNullable<FilterCountParams["filters"]> = {}

      if (minPrice !== undefined) {
        filterParams.minPrice = minPrice
      }
      if (maxPrice !== undefined) {
        filterParams.maxPrice = maxPrice
      }
      if (minRating !== undefined) {
        filterParams.minRating = minRating
      }
      if (availability !== undefined) {
        filterParams.availability = availability
      }
      if (deals !== undefined) {
        filterParams.deals = deals
      }
      if (verified !== undefined) {
        filterParams.verified = verified
      }
      if (city !== undefined) {
        filterParams.city = city
      }
      if (nearby !== undefined) {
        filterParams.nearby = nearby
      }
      if (attributes !== undefined) {
        filterParams.attributes = attributes
      }

      requestParams.filters = filterParams
    }

    timeoutIdRef.current = setTimeout(() => {
      fetchCount(controller.signal, requestParams)
    }, DEBOUNCE_MS)

    return () => {
      controller.abort()
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [
    fetchCount,
    categoryId,
    query,
    minPrice,
    maxPrice,
    minRating,
    availability,
    deals,
    verified,
    city,
    nearby,
    attributes,
    hasFilters,
    attributesKey,
  ])

  return { count, isLoading, error }
}
