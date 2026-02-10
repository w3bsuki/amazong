import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { UIProduct } from "@/lib/types/products"
import { useHomeFeedTabs } from "@/hooks/use-home-feed-tabs"

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

describe("hooks/use-home-feed-tabs", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch)
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("defaults to promoted tab with newest sort", () => {
    const { result } = renderHook(() =>
      useHomeFeedTabs({
        initialNewestProducts: [createProduct("n0")],
        initialPromotedProducts: [createProduct("p0")],
      })
    )

    expect(result.current.activeTab).toBe("promoted")
    expect(result.current.sort).toBe("newest")
    expect(result.current.nearby).toBe(false)
    expect(result.current.city).toBeNull()
    expect(result.current.products[0]?.id).toBe("p0")
  })

  it("fetches all feed when switching tab", async () => {
    mockFetch.mockImplementation((url: string) => {
      const href = String(url)
      if (href.includes("type=newest") && href.includes("sort=newest")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("n1")] }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [] }),
      })
    })

    const { result } = renderHook(() =>
      useHomeFeedTabs({
        initialNewestProducts: [createProduct("n0")],
        initialPromotedProducts: [createProduct("p0")],
      })
    )

    act(() => {
      result.current.setActiveTab("all")
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(calledUrls.some((url) => url.includes("type=newest") && url.includes("sort=newest"))).toBe(true)
      expect(result.current.products[0]?.id).toBe("n1")
    })
  })

  it("fetches selected sort for current tab", async () => {
    mockFetch.mockImplementation((url: string) => {
      const href = String(url)
      if (href.includes("type=promoted") && href.includes("sort=price-asc")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("p-price")] }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [] }),
      })
    })

    const { result } = renderHook(() =>
      useHomeFeedTabs({
        initialNewestProducts: [createProduct("n0")],
        initialPromotedProducts: [createProduct("p0")],
      })
    )

    act(() => {
      result.current.setSort("price-asc")
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(calledUrls.some((url) => url.includes("type=promoted") && url.includes("sort=price-asc"))).toBe(true)
      expect(result.current.products[0]?.id).toBe("p-price")
    })
  })

  it("uses cache for already loaded tab/sort combination", async () => {
    mockFetch.mockImplementation((url: string) => {
      const href = String(url)
      if (href.includes("type=promoted") && href.includes("sort=price-desc")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("p-cached")] }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [createProduct("fallback")] }),
      })
    })

    const { result } = renderHook(() =>
      useHomeFeedTabs({
        initialNewestProducts: [createProduct("n0")],
        initialPromotedProducts: [createProduct("p0")],
      })
    )

    act(() => {
      result.current.setSort("price-desc")
    })

    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("p-cached")
    })

    const fetchCallsAfterFirstLoad = mockFetch.mock.calls.length

    act(() => {
      result.current.setSort("newest")
    })

    await waitFor(() => {
      expect(result.current.sort).toBe("newest")
      expect(result.current.products[0]?.id).toBe("p0")
    })

    act(() => {
      result.current.setSort("price-desc")
    })

    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("p-cached")
    })

    expect(mockFetch.mock.calls.length).toBe(fetchCallsAfterFirstLoad)
  })

  it("includes nearby and city when nearby is enabled", async () => {
    mockFetch.mockImplementation((url: string) => {
      const href = String(url)
      if (href.includes("nearby=true") && href.includes("city=sofia")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("p-nearby")] }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [] }),
      })
    })

    const { result } = renderHook(() =>
      useHomeFeedTabs({
        initialNewestProducts: [createProduct("n0")],
        initialPromotedProducts: [createProduct("p0")],
      })
    )

    act(() => {
      result.current.setCity("sofia")
      result.current.setNearby(true)
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(calledUrls.some((url) => url.includes("nearby=true") && url.includes("city=sofia"))).toBe(
        true
      )
      expect(result.current.products[0]?.id).toBe("p-nearby")
    })
  })

  it("uses distinct cache entries for same tab/sort with different nearby city", async () => {
    mockFetch.mockImplementation((url: string) => {
      const href = String(url)
      if (href.includes("sort=price-desc") && href.includes("nearby=true") && href.includes("city=sofia")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("p-sofia")] }),
        })
      }
      if (href.includes("sort=price-desc") && href.includes("nearby=true") && href.includes("city=varna")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("p-varna")] }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [] }),
      })
    })

    const { result } = renderHook(() =>
      useHomeFeedTabs({
        initialNewestProducts: [createProduct("n0")],
        initialPromotedProducts: [createProduct("p0")],
      })
    )

    act(() => {
      result.current.setSort("price-desc")
      result.current.setCity("sofia")
      result.current.setNearby(true)
    })

    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("p-sofia")
    })
    const callsAfterSofia = mockFetch.mock.calls.length

    act(() => {
      result.current.setCity("varna")
    })

    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("p-varna")
    })
    const callsAfterVarna = mockFetch.mock.calls.length
    expect(callsAfterVarna).toBeGreaterThan(callsAfterSofia)

    act(() => {
      result.current.setCity("sofia")
    })

    await waitFor(() => {
      expect(result.current.products[0]?.id).toBe("p-sofia")
    })
    expect(mockFetch.mock.calls.length).toBe(callsAfterVarna)
  })

  it("builds search href with promoted/sort/nearby state", () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ products: [] }),
    })

    const { result } = renderHook(() =>
      useHomeFeedTabs({
        initialNewestProducts: [createProduct("n0")],
        initialPromotedProducts: [createProduct("p0")],
      })
    )

    act(() => {
      result.current.setSort("price-asc")
      result.current.setCity("sofia")
      result.current.setNearby(true)
    })

    const promotedHref = result.current.buildSearchHref()
    expect(promotedHref).toContain("promoted=true")
    expect(promotedHref).toContain("sort=price-asc")
    expect(promotedHref).toContain("nearby=true")
    expect(promotedHref).toContain("city=sofia")

    act(() => {
      result.current.setActiveTab("all")
      result.current.setNearby(false)
    })

    const allHref = result.current.buildSearchHref()
    expect(allHref).toContain("sort=price-asc")
    expect(allHref).not.toContain("promoted=true")
    expect(allHref).not.toContain("nearby=true")
    expect(allHref).not.toContain("city=sofia")
  })

  it("supports promoted-empty to all switch flow", async () => {
    mockFetch.mockImplementation((url: string) => {
      const href = String(url)
      if (href.includes("type=promoted") && href.includes("sort=rating")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [] }),
        })
      }
      if (href.includes("type=newest") && href.includes("sort=newest")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("n-fallback")] }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [] }),
      })
    })

    const { result } = renderHook(() =>
      useHomeFeedTabs({
        initialNewestProducts: [createProduct("n0")],
        initialPromotedProducts: [createProduct("p0")],
      })
    )

    act(() => {
      result.current.setSort("rating")
    })

    await waitFor(() => {
      expect(result.current.products).toHaveLength(0)
    })

    act(() => {
      result.current.setActiveTab("all")
      result.current.setSort("newest")
    })

    await waitFor(() => {
      expect(result.current.activeTab).toBe("all")
      expect(result.current.products[0]?.id).toBe("n-fallback")
    })
  })
})
