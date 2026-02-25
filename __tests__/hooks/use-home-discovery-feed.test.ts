import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { UIProduct } from "@/lib/types/products"
// eslint-disable-next-line no-restricted-imports -- test intentionally imports route-private hook
import { useHomeDiscoveryFeed } from "@/app/[locale]/(main)/_components/mobile-home/use-home-discovery-feed"

const mockFetch = vi.fn()

function createProduct(id: string): UIProduct {
  return {
    id,
    title: `Product ${id}`,
    price: 100,
    image: "/placeholder.svg",
    rating: 4.5,
    reviews: 8,
  }
}

function createEmptyPools() {
  return {
    forYou: [] as UIProduct[],
    newest: [] as UIProduct[],
    promoted: [] as UIProduct[],
    nearby: [] as UIProduct[],
    deals: [] as UIProduct[],
  }
}

describe("hooks/use-home-discovery-feed", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch)
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ products: [], hasMore: false }),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("uses initial pool products before network fetch", async () => {
    const initial = createProduct("for-you-1")
    const pools = createEmptyPools()
    pools.forYou = [initial]

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialPools: pools, initialScope: "forYou", limit: 24 })
    )

    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("for-you-1")
      expect(result.current.scope).toBe("forYou")
    })

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("maps promoted scope to type=promoted and preserves category context", async () => {
    mockFetch.mockImplementation((input: string) => {
      const url = String(input)
      if (url.includes("type=promoted") && url.includes("category=tech")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("promoted-1")], hasMore: false }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], hasMore: false }),
      })
    })

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialPools: createEmptyPools(), initialScope: "forYou", limit: 24 })
    )

    act(() => {
      result.current.setActiveCategorySlug("tech")
      result.current.setScope("promoted")
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(
        calledUrls.some((href) => href.includes("type=promoted") && href.includes("category=tech"))
      ).toBe(true)
      expect(result.current.products[0]?.id).toBe("promoted-1")
    })
  })

  it("maps deals scope to deals=true", async () => {
    mockFetch.mockImplementation((input: string) => {
      const url = String(input)
      if (url.includes("deals=true")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("deal-1")], hasMore: false }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], hasMore: false }),
      })
    })

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialPools: createEmptyPools(), initialScope: "forYou", limit: 24 })
    )

    act(() => {
      result.current.setScope("deals")
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(calledUrls.some((href) => href.includes("deals=true"))).toBe(true)
      expect(result.current.products[0]?.id).toBe("deal-1")
    })
  })

  it("applies category and subcategory context to request params", async () => {
    mockFetch.mockImplementation((input: string) => {
      const url = String(input)
      if (url.includes("category=fashion-mens")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("subcat-1")], hasMore: false }),
        })
      }
      if (url.includes("category=fashion")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("cat-1")], hasMore: false }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], hasMore: false }),
      })
    })

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialPools: createEmptyPools(), initialScope: "forYou", limit: 24 })
    )

    act(() => {
      result.current.setActiveCategorySlug("fashion")
    })

    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("cat-1")
    })

    act(() => {
      result.current.setActiveSubcategorySlug("fashion-mens")
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(calledUrls.some((href) => href.includes("category=fashion-mens"))).toBe(true)
      expect(result.current.products[0]?.id).toBe("subcat-1")
    })
  })

  it("applies light filter params and nearby city in requests", async () => {
    mockFetch.mockImplementation((input: string) => {
      const url = String(input)
      if (
        url.includes("minPrice=50") &&
        url.includes("maxPrice=400") &&
        url.includes("minRating=4") &&
        url.includes("availability=instock") &&
        url.includes("nearby=true") &&
        url.includes("city=sofia")
      ) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("filtered-1")], hasMore: false }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], hasMore: false }),
      })
    })

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialPools: createEmptyPools(), initialScope: "forYou", limit: 24 })
    )

    act(() => {
      result.current.setFilters(
        new URLSearchParams([
          ["minPrice", "50"],
          ["maxPrice", "400"],
          ["minRating", "4"],
          ["availability", "instock"],
          ["nearby", "true"],
          ["city", "sofia"],
        ])
      )
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(
        calledUrls.some((href) =>
          href.includes("minPrice=50") &&
          href.includes("maxPrice=400") &&
          href.includes("minRating=4") &&
          href.includes("availability=instock") &&
          href.includes("nearby=true") &&
          href.includes("city=sofia")
        )
      ).toBe(true)
      expect(result.current.products[0]?.id).toBe("filtered-1")
    })
  })

  it("keeps nearby scope active when category is selected", async () => {
    mockFetch.mockImplementation((input: string) => {
      const url = String(input)
      if (
        url.includes("type=newest") &&
        url.includes("nearby=true") &&
        url.includes("city=sofia") &&
        url.includes("category=tech")
      ) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("nearby-category-1")], hasMore: false }),
        })
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], hasMore: false }),
      })
    })

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialPools: createEmptyPools(), initialScope: "forYou", limit: 24 })
    )

    act(() => {
      result.current.setCity("sofia")
      result.current.setActiveCategorySlug("tech")
      result.current.setScope("nearby")
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(
        calledUrls.some((href) =>
          href.includes("type=newest") &&
          href.includes("nearby=true") &&
          href.includes("city=sofia") &&
          href.includes("category=tech")
        )
      ).toBe(true)
      expect(result.current.products[0]?.id).toBe("nearby-category-1")
    })
  })

  it("does not apply persisted city when nearby scope/filter is inactive", async () => {
    mockFetch.mockImplementation((input: string) => {
      const url = String(input)
      if (!url.includes("city=") && url.includes("type=newest")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("global-1")], hasMore: false }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [createProduct("city-filtered")], hasMore: false }),
      })
    })

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialPools: createEmptyPools(), initialScope: "forYou", limit: 24 })
    )

    act(() => {
      result.current.setCity("sofia")
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(calledUrls.some((href) => href.includes("city=sofia"))).toBe(false)
      expect(result.current.products[0]?.id).toBe("global-1")
    })
  })

  it("reuses cached scope results when switching back", async () => {
    let promotedRequests = 0
    mockFetch.mockImplementation((input: string) => {
      const url = String(input)
      if (url.includes("type=promoted")) {
        promotedRequests += 1
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("promoted-cache")], hasMore: false }),
        })
      }
      if (url.includes("type=newest")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("newest-cache")], hasMore: false }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], hasMore: false }),
      })
    })

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialPools: createEmptyPools(), initialScope: "forYou", limit: 24 })
    )

    act(() => {
      result.current.setScope("promoted")
    })
    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("promoted-cache")
    })

    act(() => {
      result.current.setScope("newest")
    })
    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("newest-cache")
    })

    act(() => {
      result.current.setScope("promoted")
    })
    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("promoted-cache")
    })

    expect(promotedRequests).toBe(1)
  })

  it("isolates cache entries by filter state and restores cached baseline", async () => {
    let promotedBaselineRequests = 0
    let promotedFilteredRequests = 0

    mockFetch.mockImplementation((input: string) => {
      const url = String(input)

      if (url.includes("type=promoted") && url.includes("minPrice=100")) {
        promotedFilteredRequests += 1
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("promoted-filtered")], hasMore: false }),
        })
      }

      if (url.includes("type=promoted")) {
        promotedBaselineRequests += 1
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("promoted-baseline")], hasMore: false }),
        })
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], hasMore: false }),
      })
    })

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialPools: createEmptyPools(), initialScope: "forYou", limit: 24 })
    )

    act(() => {
      result.current.setScope("promoted")
    })
    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("promoted-baseline")
    })
    const baselineRequestsAfterFirstLoad = promotedBaselineRequests

    act(() => {
      result.current.setFilters(new URLSearchParams([["minPrice", "100"]]))
    })
    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("promoted-filtered")
    })
    const filteredRequestsAfterFilterApply = promotedFilteredRequests

    act(() => {
      result.current.setFilters(new URLSearchParams())
    })
    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("promoted-baseline")
    })

    expect(promotedFilteredRequests).toBe(filteredRequestsAfterFilterApply)
    expect(promotedFilteredRequests).toBeGreaterThanOrEqual(1)
    expect(promotedBaselineRequests).toBe(baselineRequestsAfterFirstLoad)
  })
})

