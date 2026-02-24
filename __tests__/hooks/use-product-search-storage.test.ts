import { beforeEach, describe, expect, it } from "vitest"

import {
  clearRecentProductsStorage,
  clearRecentSearchesStorage,
  loadRecentProducts,
  loadRecentSearches,
  persistRecentProducts,
  persistRecentSearches,
} from "@/hooks/use-product-search.storage"
import {
  RECENT_PRODUCTS_KEY,
  RECENT_SEARCHES_KEY,
  type RecentSearchedProduct,
} from "@/hooks/use-product-search.shared"

const sampleProduct: RecentSearchedProduct = {
  id: "p1",
  title: "Product",
  price: 99,
  image: "/img.png",
  slug: "product",
  storeSlug: "store",
  searchedAt: 1,
}

describe("use-product-search.storage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("returns empty arrays when no storage exists", () => {
    expect(loadRecentSearches()).toEqual([])
    expect(loadRecentProducts()).toEqual([])
  })

  it("persists and reloads recent searches", () => {
    persistRecentSearches(["one", "two"])
    expect(loadRecentSearches()).toEqual(["one", "two"])
  })

  it("persists and reloads recent products", () => {
    persistRecentProducts([sampleProduct])
    expect(loadRecentProducts()).toEqual([sampleProduct])
  })

  it("clears recent search storage", () => {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(["x"]))
    clearRecentSearchesStorage()
    expect(localStorage.getItem(RECENT_SEARCHES_KEY)).toBeNull()
  })

  it("clears recent products storage", () => {
    localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify([sampleProduct]))
    clearRecentProductsStorage()
    expect(localStorage.getItem(RECENT_PRODUCTS_KEY)).toBeNull()
  })

  it("drops invalid recent searches payloads", () => {
    localStorage.setItem(RECENT_SEARCHES_KEY, "{\"bad\":true}")
    expect(loadRecentSearches()).toEqual([])
    expect(localStorage.getItem(RECENT_SEARCHES_KEY)).toBeNull()
  })

  it("drops invalid recent products payloads", () => {
    localStorage.setItem(RECENT_PRODUCTS_KEY, "[{\"id\":1}]")
    expect(loadRecentProducts()).toEqual([])
    expect(localStorage.getItem(RECENT_PRODUCTS_KEY)).toBeNull()
  })

  it("enforces max sizes when loading data", () => {
    const searches = Array.from({ length: 20 }, (_, i) => `s${i}`)
    const products = Array.from({ length: 20 }, (_, i) => ({
      ...sampleProduct,
      id: `p${i}`,
      slug: `slug-${i}`,
      searchedAt: i,
    }))

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches))
    localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(products))

    expect(loadRecentSearches()).toHaveLength(5)
    expect(loadRecentProducts()).toHaveLength(6)
  })
})
