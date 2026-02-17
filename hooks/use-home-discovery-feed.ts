import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { UIProduct } from "@/lib/types/products"

export type HomeDiscoveryScope = "forYou" | "newest" | "promoted" | "nearby" | "deals"

interface HomeInitialPools {
  forYou: UIProduct[]
  newest: UIProduct[]
  promoted: UIProduct[]
  nearby: UIProduct[]
  deals: UIProduct[]
}

interface UseHomeDiscoveryFeedOptions {
  initialPools: HomeInitialPools
  initialCategoryProducts?: Record<string, UIProduct[]>
  initialScope?: HomeDiscoveryScope
  limit?: number
}

interface FeedResponse {
  products?: unknown
  hasMore?: unknown
}

const LIGHT_FILTER_KEYS = ["minPrice", "maxPrice", "minRating", "availability", "city", "nearby"] as const

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

function normalizeFilterParams(input: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams()
  for (const key of LIGHT_FILTER_KEYS) {
    const value = input.get(key)
    if (!value) continue

    if (key === "nearby") {
      if (value === "true") next.set("nearby", "true")
      continue
    }
    if (key === "availability") {
      if (value === "instock") next.set("availability", "instock")
      continue
    }
    next.set(key, value)
  }
  return next
}

function productMatchesSlug(product: UIProduct, slug: string): boolean {
  if (product.categorySlug === slug) return true
  if (product.categoryRootSlug === slug) return true
  if (Array.isArray(product.categoryPath)) {
    return product.categoryPath.some((category) => category.slug === slug)
  }
  return false
}

function buildCacheKey({
  scope,
  activeCategorySlug,
  activeSubcategorySlug,
  activeL2Slug,
  filtersKey,
  city,
  nearby,
  limit,
}: {
  scope: HomeDiscoveryScope
  activeCategorySlug: string | null
  activeSubcategorySlug: string | null
  activeL2Slug: string | null
  filtersKey: string
  city: string | null
  nearby: boolean
  limit: number
}): string {
  return [
    scope,
    activeCategorySlug ?? "",
    activeSubcategorySlug ?? "",
    activeL2Slug ?? "",
    filtersKey,
    city ?? "",
    nearby ? "nearby" : "global",
    String(limit),
  ].join("|")
}

function buildRequestParams({
  scope,
  activeCategorySlug,
  activeSubcategorySlug,
  activeL2Slug,
  filters,
  city,
  nearby,
  page,
  limit,
}: {
  scope: HomeDiscoveryScope
  activeCategorySlug: string | null
  activeSubcategorySlug: string | null
  activeL2Slug: string | null
  filters: URLSearchParams
  city: string | null
  nearby: boolean
  page: number
  limit: number
}): URLSearchParams {
  const params = new URLSearchParams()
  const effectiveScope = activeCategorySlug ? "newest" : scope

  params.set("page", String(page))
  params.set("limit", String(limit))

  if (effectiveScope === "promoted") {
    params.set("type", "promoted")
  } else {
    params.set("type", "newest")
  }

  if (effectiveScope === "deals") {
    params.set("deals", "true")
  }

  const scopedNearby = effectiveScope === "nearby"
  const filteredNearby = filters.get("nearby") === "true"
  const filteredCity = filters.get("city")
  const hasFilteredCity = typeof filteredCity === "string" && filteredCity.length > 0
  const effectiveNearby = scopedNearby || nearby || filteredNearby
  const effectiveCity =
    (hasFilteredCity ? filteredCity : null) ??
    (effectiveNearby ? city : null)

  if (effectiveNearby) {
    params.set("nearby", "true")
    if (effectiveCity) params.set("city", effectiveCity)
  } else if (hasFilteredCity && effectiveCity) {
    params.set("city", effectiveCity)
  }

  const categorySlug = activeL2Slug ?? activeSubcategorySlug ?? activeCategorySlug
  if (categorySlug) {
    params.set("category", categorySlug)
  }

  const minPrice = filters.get("minPrice")
  const maxPrice = filters.get("maxPrice")
  const minRating = filters.get("minRating")
  const availability = filters.get("availability")

  if (minPrice) params.set("minPrice", minPrice)
  if (maxPrice) params.set("maxPrice", maxPrice)
  if (minRating) params.set("minRating", minRating)
  if (availability === "instock") params.set("availability", "instock")

  return params
}

async function fetchDiscoveryPage(options: {
  scope: HomeDiscoveryScope
  activeCategorySlug: string | null
  activeSubcategorySlug: string | null
  activeL2Slug: string | null
  filters: URLSearchParams
  city: string | null
  nearby: boolean
  page: number
  limit: number
  signal: AbortSignal
}): Promise<{ products: UIProduct[]; hasMore: boolean }> {
  const params = buildRequestParams(options)
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

export function useHomeDiscoveryFeed({
  initialPools,
  initialCategoryProducts = {},
  initialScope = "forYou",
  limit = 24,
}: UseHomeDiscoveryFeedOptions) {
  const [scope, setScope] = useState<HomeDiscoveryScope>(initialScope)
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null)
  const [activeSubcategorySlug, setActiveSubcategorySlug] = useState<string | null>(null)
  const [activeL2Slug, setActiveL2Slug] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<URLSearchParams>(new URLSearchParams())
  const [city, setCity] = useState<string | null>(null)
  const [nearby, setNearby] = useState(false)

  const [products, setProducts] = useState<UIProduct[]>(initialPools[initialScope] ?? [])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState((initialPools[initialScope] ?? []).length >= limit)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cacheRef = useRef<Map<string, { products: UIProduct[]; hasMore: boolean }>>(new Map())
  const abortRef = useRef<AbortController | null>(null)

  const filtersKey = useMemo(() => filters.toString(), [filters])
  const filtersActive = filtersKey.length > 0

  const cacheKey = useMemo(
    () =>
      buildCacheKey({
        scope,
        activeCategorySlug,
        activeSubcategorySlug,
        activeL2Slug,
        filtersKey,
        city,
        nearby,
        limit,
      }),
    [scope, activeCategorySlug, activeSubcategorySlug, activeL2Slug, filtersKey, city, nearby, limit]
  )

  const loadPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const controller = new AbortController()
      abortRef.current?.abort()
      abortRef.current = controller

      setIsLoading(true)
      setError(null)

      try {
        const result = await fetchDiscoveryPage({
          scope,
          activeCategorySlug,
          activeSubcategorySlug,
          activeL2Slug,
          filters,
          city,
          nearby,
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

        setProducts((previous) => {
          const seen = new Set(previous.map((product) => product.id))
          const deduped = result.products.filter((product) => !seen.has(product.id))
          return [...previous, ...deduped]
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
    [scope, activeCategorySlug, activeSubcategorySlug, activeL2Slug, filters, city, nearby, limit, cacheKey]
  )

  useEffect(() => {
    const cached = cacheRef.current.get(cacheKey)
    if (cached) {
      setProducts(cached.products)
      setPage(1)
      setHasMore(cached.hasMore)
      setError(null)
      setIsLoading(false)
      return
    }

    const filteredNearby = filters.get("nearby") === "true"
    const filteredCity = filters.get("city")
    const hasFilteredCity = typeof filteredCity === "string" && filteredCity.length > 0
    const effectiveNearby = scope === "nearby" || nearby || filteredNearby
    const effectiveCity =
      (hasFilteredCity ? filteredCity : null) ??
      (effectiveNearby ? city : null)

    if (!filtersActive && !effectiveNearby && !effectiveCity) {
      if (activeCategorySlug && initialCategoryProducts[activeCategorySlug]) {
        const source = initialCategoryProducts[activeCategorySlug] ?? []
        const effectiveSlug = activeL2Slug ?? activeSubcategorySlug
        const display =
          effectiveSlug == null
            ? source
            : source.filter((product) => productMatchesSlug(product, effectiveSlug))

        if (display.length > 0) {
          setProducts(display)
          setPage(1)
          setHasMore(display.length >= limit)
          setError(null)
          setIsLoading(false)
          cacheRef.current.set(cacheKey, { products: display, hasMore: display.length >= limit })
          return
        }
      }

      if (!activeCategorySlug && !activeSubcategorySlug) {
        const source = initialPools[scope] ?? []
        if (source.length > 0) {
          setProducts(source)
          setPage(1)
          setHasMore(source.length >= limit)
          setError(null)
          setIsLoading(false)
          cacheRef.current.set(cacheKey, { products: source, hasMore: source.length >= limit })
          return
        }
      }
    }

    void loadPage(1, "replace")
    return () => {
      abortRef.current?.abort()
    }
  }, [
    scope,
    activeCategorySlug,
    activeSubcategorySlug,
    activeL2Slug,
    cacheKey,
    filtersActive,
    filters,
    city,
    nearby,
    limit,
    initialPools,
    initialCategoryProducts,
    loadPage,
  ])

  const setFilters = useCallback(
    (nextFilters: URLSearchParams) => {
      const normalized = normalizeFilterParams(nextFilters)
      setFiltersState(normalized)

      const nextCity = normalized.get("city")
      if (nextCity) {
        setCity(nextCity)
      } else if (scope !== "nearby") {
        setCity(null)
      }

      if (scope !== "nearby") {
        setNearby(normalized.get("nearby") === "true")
      }
    },
    [scope]
  )

  const clearFilters = useCallback(() => {
    setFiltersState(new URLSearchParams())
    if (scope !== "nearby") {
      setNearby(false)
      setCity(null)
    }
  }, [scope])

  const loadNextPage = useCallback(() => {
    if (isLoading || error || !hasMore) return
    void loadPage(page + 1, "append")
  }, [isLoading, error, hasMore, loadPage, page])

  const retry = useCallback(() => {
    cacheRef.current.delete(cacheKey)
    void loadPage(1, "replace")
  }, [cacheKey, loadPage])

  return {
    scope,
    setScope,
    activeCategorySlug,
    setActiveCategorySlug,
    activeSubcategorySlug,
    setActiveSubcategorySlug,
    activeL2Slug,
    setActiveL2Slug,
    filters,
    filtersKey,
    setFilters,
    clearFilters,
    city,
    setCity,
    nearby,
    setNearby,
    products,
    isLoading,
    error,
    page,
    hasMore,
    loadNextPage,
    retry,
  }
}

