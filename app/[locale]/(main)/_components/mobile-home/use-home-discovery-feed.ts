import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  normalizeHomeDiscoveryFilters,
  resolveDiscoveryFilterState,
  type HomeDiscoveryScope,
} from "@/lib/home-browse-href"
import type { UIProduct } from "@/lib/types/products"
import { buildCacheKey, fetchDiscoveryPage, productMatchesSlug } from "./use-home-discovery-feed-helpers"
import type { HomePoolMap, UseHomeDiscoveryFeedOptions } from "./use-home-discovery-feed-types"

export type { HomeDiscoveryScope }

export function useHomeDiscoveryFeed({
  initialPools,
  initialCategoryProducts = {},
  initialScope = "forYou",
  limit = 24,
}: UseHomeDiscoveryFeedOptions) {
  const resolvedInitialPools = useMemo<HomePoolMap>(
    () => ({
      forYou: initialPools.forYou ?? [],
      newest: initialPools.newest ?? [],
      promoted: initialPools.promoted ?? [],
      nearby: initialPools.nearby ?? [],
      deals: initialPools.deals ?? [],
    }),
    [initialPools]
  )

  const [scope, setScope] = useState<HomeDiscoveryScope>(initialScope)
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null)
  const [activeSubcategorySlug, setActiveSubcategorySlug] = useState<string | null>(null)
  const [activeL2Slug, setActiveL2Slug] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<URLSearchParams>(new URLSearchParams())
  const [city, setCity] = useState<string | null>(null)
  const [nearby, setNearby] = useState(false)

  const [products, setProducts] = useState<UIProduct[]>(resolvedInitialPools[initialScope] ?? [])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState((resolvedInitialPools[initialScope] ?? []).length >= limit)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cacheRef = useRef<Map<string, { products: UIProduct[]; hasMore: boolean }>>(new Map())
  const abortRef = useRef<AbortController | null>(null)
  const pageRef = useRef(page)
  const hasMoreRef = useRef(hasMore)
  const isLoadingRef = useRef(isLoading)
  const errorRef = useRef(error)
  const loadPageRef = useRef<((nextPage: number, mode: "replace" | "append") => Promise<void>) | null>(null)
  const appendInFlightRef = useRef(false)

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
    pageRef.current = page
  }, [page])

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  useEffect(() => {
    errorRef.current = error
  }, [error])

  useEffect(() => {
    loadPageRef.current = loadPage
  }, [loadPage])

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

    const locationState = resolveDiscoveryFilterState({
      filters,
      city,
      nearby,
      effectiveScope: scope,
    })

    if (!filtersActive && !locationState.effectiveNearby && !locationState.effectiveCity) {
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
        const source = resolvedInitialPools[scope] ?? []
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
    resolvedInitialPools,
    initialCategoryProducts,
    loadPage,
  ])

  const setFilters = useCallback(
    (nextFilters: URLSearchParams) => {
      const normalized = normalizeHomeDiscoveryFilters(nextFilters)
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
    if (appendInFlightRef.current) return
    if (isLoadingRef.current || errorRef.current || !hasMoreRef.current) return

    const handler = loadPageRef.current
    if (!handler) return

    appendInFlightRef.current = true
    isLoadingRef.current = true

    void handler(pageRef.current + 1, "append").finally(() => {
      appendInFlightRef.current = false
    })
  }, [])

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

