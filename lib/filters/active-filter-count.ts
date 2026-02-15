interface SearchParamsLike {
  get(name: string): string | null
  getAll(name: string): string[]
}

interface ActiveFilterCountOptions {
  includeDeals?: boolean
  includeVerified?: boolean
  includeLocation?: boolean
  attributeKeys?: readonly string[]
}

export function getActiveFilterCount(
  searchParams: SearchParamsLike,
  options?: ActiveFilterCountOptions
): number {
  let count = 0

  if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++
  if (searchParams.get("minRating")) count++
  if (searchParams.get("availability")) count++

  if (options?.includeDeals && searchParams.get("deals") === "true") count++
  if (options?.includeVerified && searchParams.get("verified") === "true") count++

  if ((options?.includeLocation ?? true) && (searchParams.get("city") || searchParams.get("nearby") === "true")) {
    count++
  }

  const attributeKeys = options?.attributeKeys ?? []
  for (const key of attributeKeys) {
    if (searchParams.getAll(key).length > 0) count++
  }

  return count
}
