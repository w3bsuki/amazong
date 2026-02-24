import { describe, expect, it } from "vitest"

import {
  MAX_RECENT_PRODUCTS,
  MAX_RECENT_SEARCHES,
  MIN_SEARCH_LENGTH,
  ProductSearchResponseSchema,
  RecentProductsSchema,
  RecentSearchesSchema,
  SEARCH_DEBOUNCE_MS,
  isAbortError,
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
    const parsed = ProductSearchResponseSchema.safeParse({
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
    expect(parsed.success).toBe(true)
  })

  it("defaults products to empty array when missing", () => {
    const parsed = ProductSearchResponseSchema.parse({})
    expect(parsed.products).toEqual([])
  })

  it("rejects malformed product rows", () => {
    const parsed = ProductSearchResponseSchema.safeParse({
      products: [{ id: 1 }],
    })
    expect(parsed.success).toBe(false)
  })

  it("accepts recent search string arrays only", () => {
    expect(RecentSearchesSchema.safeParse(["a", "b"]).success).toBe(true)
    expect(RecentSearchesSchema.safeParse(["a", 1]).success).toBe(false)
  })

  it("accepts valid recent product rows", () => {
    const parsed = RecentProductsSchema.safeParse([
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
    expect(parsed.success).toBe(true)
  })

  it("rejects invalid recent product rows", () => {
    const parsed = RecentProductsSchema.safeParse([
      {
        id: "p1",
        title: "Phone",
        price: "10",
      },
    ])
    expect(parsed.success).toBe(false)
  })
})
