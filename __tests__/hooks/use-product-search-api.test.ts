import { afterEach, describe, expect, it, vi } from "vitest"

import { fetchSearchProducts } from "@/hooks/use-product-search.api"

describe("use-product-search.api", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns parsed products for valid API payload", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
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
        }),
        { status: 200 }
      )
    )

    const result = await fetchSearchProducts("phone", 8, new AbortController().signal)
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe("p1")
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it("returns empty list when response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 500 }))

    const result = await fetchSearchProducts("phone", 8, new AbortController().signal)
    expect(result).toEqual([])
  })

  it("returns empty list when payload fails schema validation", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ products: [{ id: 1 }] }), { status: 200 })
    )

    const result = await fetchSearchProducts("phone", 8, new AbortController().signal)
    expect(result).toEqual([])
  })

  it("returns empty list when json parsing throws", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error("broken json")
      },
    } as unknown as Response)

    const result = await fetchSearchProducts("phone", 8, new AbortController().signal)
    expect(result).toEqual([])
  })
})
