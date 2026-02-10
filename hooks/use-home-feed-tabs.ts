"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { UIProduct } from "@/lib/types/products"

export type HomeFeedTab = "promoted" | "all"
export type HomeFeedSort = "newest" | "price-asc" | "price-desc" | "rating"

interface UseHomeFeedTabsOptions {
  initialNewestProducts: UIProduct[]
  initialPromotedProducts: UIProduct[]
  limit?: number
}

interface FeedResponse {
  products?: UIProduct[]
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

async function fetchFeed(
  tab: HomeFeedTab,
  sort: HomeFeedSort,
  nearby: boolean,
  city: string | null,
  limit: number,
  signal: AbortSignal
): Promise<UIProduct[]> {
  const apiType = tab === "all" ? "newest" : "promoted"
  const params = new URLSearchParams({
    type: apiType,
    sort,
    page: "1",
    limit: String(limit),
  })
  if (nearby) {
    params.set("nearby", "true")
    if (city) {
      params.set("city", city)
    }
  }

  const response = await fetch(`/api/products/newest?${params.toString()}`, {
    method: "GET",
    signal,
    credentials: "same-origin",
  })

  if (!response.ok) {
    throw new Error(`Failed to load ${tab} feed`)
  }

  const data = (await response.json()) as FeedResponse
  return toSafeProducts(data.products)
}

function buildCacheKey(
  tab: HomeFeedTab,
  sort: HomeFeedSort,
  nearby: boolean,
  city: string | null,
  limit: number
): string {
  return `${tab}|${sort}|${nearby ? "nearby" : "global"}|${city ?? ""}|${limit}`
}

export function useHomeFeedTabs({
  initialNewestProducts,
  initialPromotedProducts,
  limit = 12,
}: UseHomeFeedTabsOptions) {
  const [activeTab, setActiveTab] = useState<HomeFeedTab>("promoted")
  const [sort, setSort] = useState<HomeFeedSort>("newest")
  const [nearby, setNearby] = useState(false)
  const [city, setCity] = useState<string | null>(null)
  const [newestProducts, setNewestProducts] = useState<UIProduct[]>(initialNewestProducts)
  const [promotedProducts, setPromotedProducts] = useState<UIProduct[]>(initialPromotedProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const cacheRef = useRef<Map<string, UIProduct[]>>(new Map())
  const abortRef = useRef<AbortController | null>(null)
  const initialPromotedRef = useRef(initialPromotedProducts)

  useEffect(() => {
    initialPromotedRef.current = initialPromotedProducts
    setNewestProducts(initialNewestProducts)
    setPromotedProducts(initialPromotedProducts)
  }, [initialNewestProducts, initialPromotedProducts])

  const currentProducts = useMemo(
    () => (activeTab === "promoted" ? promotedProducts : newestProducts),
    [activeTab, newestProducts, promotedProducts]
  )

  const assignProducts = useCallback((tab: HomeFeedTab, nextProducts: UIProduct[]) => {
    if (tab === "promoted") {
      setPromotedProducts(nextProducts)
      return
    }
    setNewestProducts(nextProducts)
  }, [])

  useEffect(() => {
    const effectiveCity = nearby ? city : null
    const cacheKey = buildCacheKey(activeTab, sort, nearby, effectiveCity, limit)

    if (
      sort === "newest" &&
      activeTab === "promoted" &&
      !nearby &&
      reloadToken === 0 &&
      initialPromotedRef.current.length > 0
    ) {
      assignProducts(activeTab, initialPromotedRef.current)
      setError(null)
      setIsLoading(false)
      return
    }

    const cached = cacheRef.current.get(cacheKey)
    if (cached) {
      assignProducts(activeTab, cached)
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller
    setIsLoading(true)
    setError(null)

    fetchFeed(activeTab, sort, nearby, effectiveCity, limit, controller.signal)
      .then((nextProducts) => {
        if (controller.signal.aborted) return
        cacheRef.current.set(cacheKey, nextProducts)
        assignProducts(activeTab, nextProducts)
        setError(null)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Failed to load home feed"
        setError(message)
      })
      .finally(() => {
        if (abortRef.current === controller) {
          setIsLoading(false)
        }
      })

    return () => {
      controller.abort()
      if (abortRef.current === controller) {
        abortRef.current = null
      }
    }
  }, [activeTab, assignProducts, city, limit, nearby, reloadToken, sort])

  const retry = useCallback(() => {
    const effectiveCity = nearby ? city : null
    const cacheKey = buildCacheKey(activeTab, sort, nearby, effectiveCity, limit)
    cacheRef.current.delete(cacheKey)
    setReloadToken((prev) => prev + 1)
  }, [activeTab, city, limit, nearby, sort])

  const buildSearchHref = useCallback(
    (options?: { tab?: HomeFeedTab; sort?: HomeFeedSort; nearby?: boolean; city?: string | null }) => {
      const nextTab = options?.tab ?? activeTab
      const nextSort = options?.sort ?? sort
      const nextNearby = options?.nearby ?? nearby
      const nextCity = options?.city ?? city
      const params = new URLSearchParams({
        sort: nextSort,
      })
      if (nextTab === "promoted") {
        params.set("promoted", "true")
      }
      if (nextNearby) {
        params.set("nearby", "true")
        if (nextCity) {
          params.set("city", nextCity)
        }
      }
      return `/search?${params.toString()}`
    },
    [activeTab, city, nearby, sort]
  )

  const allProducts = newestProducts

  return {
    activeTab,
    sort,
    nearby,
    city,
    products: currentProducts,
    allProducts,
    newestProducts,
    promotedProducts,
    isLoading,
    error,
    setActiveTab,
    setSort,
    setNearby,
    setCity,
    retry,
    buildSearchHref,
  }
}
