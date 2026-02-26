export interface SearchProduct {
  id: string
  title: string
  price: number
  images: string[]
  slug: string
  storeSlug: string | null
}

export interface RecentSearchedProduct {
  id: string
  title: string
  price: number
  image: string | null
  slug: string
  storeSlug: string | null
  searchedAt: number
}

export type SaveSearchProductInput = Omit<SearchProduct, "storeSlug"> & {
  storeSlug?: string | null
}

export const SEARCH_DEBOUNCE_MS = 300
export const MIN_SEARCH_LENGTH = 2
export const MAX_RECENT_SEARCHES = 5
export const MAX_RECENT_PRODUCTS = 6
export const RECENT_SEARCHES_KEY = "recentSearches"
export const RECENT_PRODUCTS_KEY = "recentSearchedProducts"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function parseString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

function parseNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function parseStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const items = value.filter((item): item is string => typeof item === "string")
  return items.length === value.length ? items : null
}

function parseSearchProduct(value: unknown): SearchProduct | null {
  if (!isRecord(value)) return null

  const id = parseString(value.id)
  const title = parseString(value.title)
  const price = parseNumber(value.price)
  const images = parseStringArray(value.images) ?? []
  const slug = parseString(value.slug)
  const storeSlugValue = value.storeSlug
  const storeSlug = storeSlugValue === null ? null : parseString(storeSlugValue)

  if (!id || !title || price === null || !slug) return null

  return {
    id,
    title,
    price,
    images,
    slug,
    storeSlug: storeSlug ?? null,
  }
}

export function parseProductSearchResponse(value: unknown): SearchProduct[] {
  if (!isRecord(value)) return []
  const products = Array.isArray(value.products) ? value.products : []
  return products.map(parseSearchProduct).filter((item): item is SearchProduct => Boolean(item))
}

function parseRecentSearchedProduct(value: unknown): RecentSearchedProduct | null {
  if (!isRecord(value)) return null

  const id = parseString(value.id)
  const title = parseString(value.title)
  const price = parseNumber(value.price)
  const imageValue = value.image
  const image = imageValue === null ? null : parseString(imageValue)
  const slug = parseString(value.slug)
  const storeSlugValue = value.storeSlug
  const storeSlug = storeSlugValue === null ? null : parseString(storeSlugValue)
  const searchedAt = parseNumber(value.searchedAt)

  if (!id || !title || price === null || !slug || searchedAt === null) return null

  return {
    id,
    title,
    price,
    image: image ?? null,
    slug,
    storeSlug: storeSlug ?? null,
    searchedAt,
  }
}

export function parseRecentSearches(value: unknown): string[] | null {
  return parseStringArray(value)
}

export function parseRecentProducts(value: unknown): RecentSearchedProduct[] | null {
  if (!Array.isArray(value)) return null
  const parsed = value.map(parseRecentSearchedProduct)
  if (parsed.some((item) => !item)) return null
  return parsed.filter((item): item is RecentSearchedProduct => Boolean(item))
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError"
}
