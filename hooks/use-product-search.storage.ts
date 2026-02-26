import { safeJsonParse } from "@/lib/safe-json"

import {
  MAX_RECENT_PRODUCTS,
  MAX_RECENT_SEARCHES,
  RECENT_PRODUCTS_KEY,
  RECENT_SEARCHES_KEY,
  parseRecentProducts,
  parseRecentSearches,
  type RecentSearchedProduct,
} from "./use-product-search.shared"

function isBrowser() {
  return typeof window !== "undefined"
}

export function loadRecentSearches(): string[] {
  if (!isBrowser()) return []

  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (!saved) return []

    const parsed = safeJsonParse<unknown>(saved)
    const searches = parseRecentSearches(parsed)
    if (!searches) {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
      return []
    }

    return searches.slice(0, MAX_RECENT_SEARCHES)
  } catch {
    return []
  }
}

export function loadRecentProducts(): RecentSearchedProduct[] {
  if (!isBrowser()) return []

  try {
    const savedProducts = localStorage.getItem(RECENT_PRODUCTS_KEY)
    if (!savedProducts) return []

    const parsed = safeJsonParse<unknown>(savedProducts)
    const products = parseRecentProducts(parsed)
    if (!products) {
      localStorage.removeItem(RECENT_PRODUCTS_KEY)
      return []
    }

    return products.slice(0, MAX_RECENT_PRODUCTS)
  } catch {
    return []
  }
}

export function persistRecentSearches(searches: string[]) {
  if (!isBrowser()) return
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches))
  } catch {
    // Ignore storage errors
  }
}

export function persistRecentProducts(products: RecentSearchedProduct[]) {
  if (!isBrowser()) return
  try {
    localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(products))
  } catch {
    // Ignore storage errors
  }
}

export function clearRecentSearchesStorage() {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // Ignore storage errors
  }
}

export function clearRecentProductsStorage() {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(RECENT_PRODUCTS_KEY)
  } catch {
    // Ignore storage errors
  }
}
