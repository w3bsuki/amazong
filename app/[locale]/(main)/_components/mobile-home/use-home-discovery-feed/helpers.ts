import { resolveDiscoveryFilterState, type HomeDiscoveryScope } from "@/lib/home-browse-href"
import type { UIProduct } from "@/lib/types/products"

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

export function productMatchesSlug(product: UIProduct, slug: string): boolean {
  if (product.categorySlug === slug) return true
  if (product.categoryRootSlug === slug) return true
  if (Array.isArray(product.categoryPath)) {
    return product.categoryPath.some((category) => category.slug === slug)
  }
  return false
}

export function buildCacheKey({
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

  const locationState = resolveDiscoveryFilterState({
    filters,
    city,
    nearby,
    effectiveScope,
  })

  if (locationState.effectiveNearby) {
    params.set("nearby", "true")
    if (locationState.effectiveCity) params.set("city", locationState.effectiveCity)
  } else if (locationState.hasFilteredCity && locationState.effectiveCity) {
    params.set("city", locationState.effectiveCity)
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

export async function fetchDiscoveryPage(options: {
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

