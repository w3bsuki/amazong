export type HomeDiscoveryScope = "forYou" | "newest" | "promoted" | "nearby" | "deals"

const HOME_FILTER_KEYS = [
  "minPrice",
  "maxPrice",
  "minRating",
  "availability",
  "city",
  "nearby",
] as const

export function normalizeHomeDiscoveryFilters(input: URLSearchParams): URLSearchParams {
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

export interface HomeDiscoveryFilterState {
  effectiveNearby: boolean
  effectiveCity: string | null
  hasFilteredCity: boolean
}

export function resolveDiscoveryFilterState(options: {
  filters: URLSearchParams
  city: string | null
  nearby: boolean
  effectiveScope: HomeDiscoveryScope
}): HomeDiscoveryFilterState {
  const { filters, city, nearby, effectiveScope } = options
  const filteredNearby = filters.get("nearby") === "true"
  const filteredCity = filters.get("city")
  const hasFilteredCity = typeof filteredCity === "string" && filteredCity.length > 0
  const scopedNearby = effectiveScope === "nearby"
  const effectiveNearby = scopedNearby || nearby || filteredNearby
  const effectiveCity = (hasFilteredCity ? filteredCity : null) ?? (effectiveNearby ? city : null)
  return { effectiveNearby, effectiveCity, hasFilteredCity }
}
