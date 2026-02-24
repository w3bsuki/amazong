import { z } from "zod"

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

const SearchProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  images: z.array(z.string()),
  slug: z.string(),
  storeSlug: z.string().nullable().optional().default(null),
})

export const ProductSearchResponseSchema = z.object({
  products: z.array(SearchProductSchema).default([]),
})

export const RecentSearchesSchema = z.array(z.string())

const RecentSearchedProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  image: z.string().nullable(),
  slug: z.string(),
  storeSlug: z.string().nullable().optional().default(null),
  searchedAt: z.number(),
})

export const RecentProductsSchema = z.array(RecentSearchedProductSchema)

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError"
}
