import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { UIProduct } from "@/lib/types/products"
import { useHomeDiscoveryFeed } from "@/hooks/use-home-discovery-feed"

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

describe("hooks/use-home-discovery-feed", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch)
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("uses initial products by default without fetching", async () => {
    const initialProducts = [createProduct("n0")]

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialProducts, limit: 24 })
    )

    await waitFor(() => {
      expect(result.current.sort).toBe("newest")
      expect(result.current.nearby).toBe(false)
      expect(result.current.city).toBeNull()
      expect(result.current.products[0]?.id).toBe("n0")
    })

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("fetches page 1 when sort changes", async () => {
    mockFetch.mockImplementation((url: string) => {
      const href = String(url)
      if (href.includes("type=newest") && href.includes("sort=price-asc") && href.includes("page=1")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("p1")], hasMore: false }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [] }),
      })
    })

    const initialProducts = [createProduct("n0")]

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialProducts, limit: 24 })
    )

    act(() => {
      result.current.setSort("price-asc")
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(calledUrls.some((href) => href.includes("type=newest") && href.includes("sort=price-asc"))).toBe(true)
      expect(result.current.products[0]?.id).toBe("p1")
    })
  })

  it("includes nearby and city in discovery requests", async () => {
    mockFetch.mockImplementation((url: string) => {
      const href = String(url)
      if (href.includes("type=newest") && href.includes("nearby=true") && href.includes("city=sofia")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("nearby")], hasMore: false }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [] }),
      })
    })

    const initialProducts = [createProduct("n0")]

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialProducts, limit: 24 })
    )

    act(() => {
      result.current.setCity("sofia")
      result.current.setNearby(true)
    })

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map((call) => String(call[0] ?? ""))
      expect(calledUrls.some((href) => href.includes("nearby=true") && href.includes("city=sofia"))).toBe(true)
      expect(result.current.products[0]?.id).toBe("nearby")
    })
  })

  it("paginates and appends new products", async () => {
    mockFetch.mockImplementation((url: string) => {
      const href = String(url)
      if (href.includes("type=newest") && href.includes("sort=price-desc") && href.includes("page=1")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("p1")], hasMore: true }),
        })
      }
      if (href.includes("type=newest") && href.includes("sort=price-desc") && href.includes("page=2")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [createProduct("p2")], hasMore: false }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [] }),
      })
    })

    const initialProducts = [createProduct("n0")]

    const { result } = renderHook(() =>
      useHomeDiscoveryFeed({ initialProducts, limit: 24 })
    )

    act(() => {
      result.current.setSort("price-desc")
    })

    await waitFor(() => {
      expect(result.current.products.map((p) => p.id)).toEqual(["p1"])
      expect(result.current.hasMore).toBe(true)
    })

    act(() => {
      result.current.loadNextPage()
    })

    await waitFor(() => {
      expect(result.current.products.map((p) => p.id)).toEqual(["p1", "p2"])
      expect(result.current.hasMore).toBe(false)
    })
  })
})

