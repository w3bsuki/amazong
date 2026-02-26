import { describe, expect, it } from "vitest"

import {
  MAX_RECENT_PRODUCTS,
  MAX_RECENT_SEARCHES,
  MIN_SEARCH_LENGTH,
  SEARCH_DEBOUNCE_MS,
  isAbortError,
  parseProductSearchResponse,
  parseRecentProducts,
  parseRecentSearches,
} from "@/hooks/use-product-search.shared"

describe("use-product-search.shared", () => {
  it("keeps search constants stable", () => {
    expect(SEARCH_DEBOUNCE_MS).toBe(300)
    expect(MIN_SEARCH_LENGTH).toBe(2)
    expect(MAX_RECENT_SEARCHES).toBe(5)
    expect(MAX_RECENT_PRODUCTS).toBe(6)
  })

  it("detects abort errors only", () => {
    const abort = new Error("aborted")
    abort.name = "AbortError"
    expect(isAbortError(abort)).toBe(true)
    expect(isAbortError(new Error("x"))).toBe(false)
    expect(isAbortError("AbortError")).toBe(false)
  })

  it("parses valid product search responses", () => {
    const products = parseProductSearchResponse({
      products: [
        {
          id: "p1",
          title: "Phone",
          price: 10,
          images: ["/img.png"],
          slug: "phone",
          storeSlug: "store",
        },
      ],
    })
    expect(products).toHaveLength(1)
  })

  it("defaults products to empty array when missing", () => {
    expect(parseProductSearchResponse({})).toEqual([])
  })

  it("rejects malformed product rows", () => {
    expect(parseProductSearchResponse({ products: [{ id: 1 }] })).toEqual([])
  })

  it("accepts recent search string arrays only", () => {
    expect(parseRecentSearches(["a", "b"])).toEqual(["a", "b"])
    expect(parseRecentSearches(["a", 1])).toBeNull()
  })

  it("accepts valid recent product rows", () => {
    const products = parseRecentProducts([
      {
        id: "p1",
        title: "Phone",
        price: 10,
        image: null,
        slug: "phone",
        storeSlug: null,
        searchedAt: Date.now(),
      },
    ])
    expect(products).not.toBeNull()
    expect(products).toHaveLength(1)
  })

  it("rejects invalid recent product rows", () => {
    const products = parseRecentProducts([
      {
        id: "p1",
        title: "Phone",
        price: "10",
      },
    ])
    expect(products).toBeNull()
  })
})
