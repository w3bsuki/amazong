"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { UIProduct } from "@/lib/types/products"

export type HomeDiscoverySort = "newest" | "price-asc" | "price-desc" | "rating"

interface UseHomeDiscoveryFeedOptions {
  initialProducts: UIProduct[]
  limit?: number
}

interface FeedResponse {
  products?: unknown
  hasMore?: unknown
}

function toSafeProducts(value: unknown): UIProduct[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is UIProduct => {
    if (!item || typeof item !== "object") return false
    const product = item as Record<string, unknown>
    return (
      typeof product.id === "string" &&
      typeof product.title === "string" &&
      typeof product.price === "number" &&
      typeof product.image === "string"
    )
  })
}

function buildCacheKey(sort: HomeDiscoverySort, nearby: boolean, city: string | null, limit: number): string {
  const effectiveCity = nearby ? city : null
  return `${sort}|${nearby ? "nearby" : "global"}|${effectiveCity ?? ""}|${limit}`
}

async function fetchDiscoveryPage(options: {
  sort: HomeDiscoverySort
  nearby: boolean
  city: string | null
  page: number
  limit: number
  signal: AbortSignal
}): Promise<{ products: UIProduct[]; hasMore: boolean }> {
  const params = new URLSearchParams({
    type: "newest",
    sort: options.sort,
    page: String(options.page),
    limit: String(options.limit),
  })

  if (options.nearby) {
    params.set("nearby", "true")
    if (options.city) {
      params.set("city", options.city)
    }
  }

  const response = await fetch(`/api/products/newest?${params.toString()}`, {
    method: "GET",
    signal: options.signal,
    credentials: "same-origin",
  })

  if (!response.ok) {
    throw new Error("Failed to load home discovery feed")
  }

  const data = (await response.json()) as FeedResponse
  const products = toSafeProducts(data.products)
  const hasMore = typeof data.hasMore === "boolean" ? data.hasMore : products.length === options.limit

  return { products, hasMore }
}

export function useHomeDiscoveryFeed({ initialProducts, limit = 24 }: UseHomeDiscoveryFeedOptions) {
  const [sort, setSort] = useState<HomeDiscoverySort>("newest")
  const [nearby, setNearby] = useState(false)
  const [city, setCity] = useState<string | null>(null)

  const [products, setProducts] = useState<UIProduct[]>(initialProducts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cacheRef = useRef<Map<string, { products: UIProduct[]; hasMore: boolean }>>(new Map())
  const abortRef = useRef<AbortController | null>(null)
  const initialProductsRef = useRef(initialProducts)

  useEffect(() => {
    initialProductsRef.current = initialProducts
    if (sort === "newest" && !nearby) {
      setProducts(initialProducts)
      setPage(1)
      setHasMore(initialProducts.length === limit)
      setError(null)
    }
  }, [initialProducts, limit, nearby, sort])

  const buildSearchHref = useCallback(
    (options?: { sort?: HomeDiscoverySort; nearby?: boolean; city?: string | null }) => {
      const nextSort = options?.sort ?? sort
      const nextNearby = options?.nearby ?? nearby
      const nextCity = options?.city ?? city

      const params = new URLSearchParams({ sort: nextSort })
      if (nextNearby) {
        params.set("nearby", "true")
        if (nextCity) params.set("city", nextCity)
      }

      return `/search?${params.toString()}`
    },
    [city, nearby, sort]
  )

  const effectiveCity = nearby ? city : null
  const cacheKey = useMemo(() => buildCacheKey(sort, nearby, city, limit), [city, limit, nearby, sort])

  const loadPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const controller = new AbortController()
      abortRef.current?.abort()
      abortRef.current = controller
      setIsLoading(true)
      setError(null)

      try {
        const result = await fetchDiscoveryPage({
          sort,
          nearby,
          city: effectiveCity,
          page: nextPage,
          limit,
          signal: controller.signal,
        })

        if (controller.signal.aborted) return

        if (mode === "replace") {
          setProducts(result.products)
          setPage(nextPage)
          setHasMore(result.hasMore)
          cacheRef.current.set(cacheKey, { products: result.products, hasMore: result.hasMore })
          return
        }

        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id))
          const deduped = result.products.filter((p) => !existingIds.has(p.id))
          return [...prev, ...deduped]
        })
        setPage(nextPage)
        setHasMore(result.hasMore)
      } catch (err: unknown) {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Failed to load home discovery feed"
        setError(message)
      } finally {
        if (abortRef.current === controller) {
          setIsLoading(false)
        }
      }
    },
    [cacheKey, effectiveCity, limit, nearby, sort]
  )

  useEffect(() => {
    if (sort === "newest" && !nearby && initialProductsRef.current.length > 0) {
      setProducts(initialProductsRef.current)
      setPage(1)
      setHasMore(initialProductsRef.current.length === limit)
      setError(null)
      setIsLoading(false)
      return
    }

    const cached = cacheRef.current.get(cacheKey)
    if (cached) {
      setProducts(cached.products)
      setPage(1)
      setHasMore(cached.hasMore)
      setError(null)
      setIsLoading(false)
      return
    }

    loadPage(1, "replace")
    return () => {
      abortRef.current?.abort()
    }
  }, [cacheKey, limit, loadPage, nearby, sort])

  const loadNextPage = useCallback(() => {
    if (isLoading || error) return
    if (!hasMore) return
    void loadPage(page + 1, "append")
  }, [error, hasMore, isLoading, loadPage, page])

  const retry = useCallback(() => {
    cacheRef.current.delete(cacheKey)
    void loadPage(1, "replace")
  }, [cacheKey, loadPage])

  return {
    sort,
    nearby,
    city,
    products,
    isLoading,
    error,
    page,
    hasMore,
    setSort,
    setNearby,
    setCity,
    loadNextPage,
    retry,
    buildSearchHref,
  }
}

