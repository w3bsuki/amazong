export type HomeDiscoveryScope = "forYou" | "newest" | "promoted" | "nearby" | "deals"

const HOME_FILTER_KEYS = [
  "minPrice",
  "maxPrice",
  "minRating",
  "availability",
  "city",
  "nearby",
] as const

function normalizeHomeDiscoveryFilters(input: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams()
  for (const key of HOME_FILTER_KEYS) {
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

function getEffectiveCategorySlug(
  activeCategorySlug: string | null,
  activeSubcategorySlug: string | null,
  activeL2Slug: string | null,
): string | null {
  return activeL2Slug ?? activeSubcategorySlug ?? activeCategorySlug
}

function getEffectiveDiscoveryScope(
  scope: HomeDiscoveryScope,
  activeCategorySlug: string | null,
  activeSubcategorySlug: string | null,
  activeL2Slug: string | null,
): HomeDiscoveryScope {
  return activeCategorySlug || activeSubcategorySlug || activeL2Slug ? "newest" : scope
}

function resolveDiscoveryFilterState(options: {
  filters: URLSearchParams
  city: string | null
  nearby: boolean
  effectiveScope: HomeDiscoveryScope
}): { effectiveNearby: boolean; effectiveCity: string | null; hasFilteredCity: boolean } {
  const { filters, city, nearby, effectiveScope } = options
  const filteredNearby = filters.get("nearby") === "true"
  const filteredCity = filters.get("city")
  const hasFilteredCity = typeof filteredCity === "string" && filteredCity.length > 0
  const scopedNearby = effectiveScope === "nearby"
  const effectiveNearby = scopedNearby || nearby || filteredNearby
  const effectiveCity = (hasFilteredCity ? filteredCity : null) ?? (effectiveNearby ? city : null)
  return { effectiveNearby, effectiveCity, hasFilteredCity }
}

function applyDiscoveryFilters(
  params: URLSearchParams,
  filters: URLSearchParams,
  discoveryState: { effectiveNearby: boolean; effectiveCity: string | null; hasFilteredCity: boolean },
) {
  const minPrice = filters.get("minPrice")
  const maxPrice = filters.get("maxPrice")
  const minRating = filters.get("minRating")
  const availability = filters.get("availability")
  if (minPrice) params.set("minPrice", minPrice)
  if (maxPrice) params.set("maxPrice", maxPrice)
  if (minRating) params.set("minRating", minRating)
  if (availability === "instock") params.set("availability", "instock")

  if (discoveryState.effectiveNearby) {
    params.set("nearby", "true")
    if (discoveryState.effectiveCity) {
      params.set("city", discoveryState.effectiveCity)
    }
  } else if (discoveryState.hasFilteredCity && discoveryState.effectiveCity) {
    params.set("city", discoveryState.effectiveCity)
  }
}

interface BuildHomeBrowseHrefOptions {
  scope: HomeDiscoveryScope
  activeCategorySlug: string | null
  activeSubcategorySlug: string | null
  activeL2Slug: string | null
  filters: URLSearchParams
  city: string | null
  nearby: boolean
}

export function buildHomeBrowseHref({
  scope,
  activeCategorySlug,
  activeSubcategorySlug,
  activeL2Slug,
  filters,
  city,
  nearby,
}: BuildHomeBrowseHrefOptions): string {
  const normalizedFilters = normalizeHomeDiscoveryFilters(filters)
  const effectiveCategorySlug = getEffectiveCategorySlug(
    activeCategorySlug,
    activeSubcategorySlug,
    activeL2Slug,
  )
  const effectiveScope = getEffectiveDiscoveryScope(
    scope,
    activeCategorySlug,
    activeSubcategorySlug,
    activeL2Slug,
  )

  const params = new URLSearchParams()
  if (effectiveCategorySlug) {
    params.set("category", effectiveCategorySlug)
  }

  params.set("sort", "newest")

  if (effectiveScope === "promoted") {
    params.set("promoted", "true")
  }

  if (effectiveScope === "deals") {
    params.set("deals", "true")
  }

  const discoveryState = resolveDiscoveryFilterState({
    filters: normalizedFilters,
    city,
    nearby,
    effectiveScope,
  })
  applyDiscoveryFilters(params, normalizedFilters, discoveryState)

  return `/search?${params.toString()}`
}
