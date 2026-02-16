import { describe, expect, it } from "vitest"
import type { UIProduct } from "@/lib/types/products"
import { buildForYouPool } from "@/lib/home-pools"

function createProduct(id: string): UIProduct {
  return {
    id,
    title: `Product ${id}`,
    price: 100,
    image: "/placeholder.svg",
    rating: 4.5,
    reviews: 12,
  }
}

describe("buildForYouPool", () => {
  it("prioritizes up to 8 promoted products, then fills from newest with dedupe", () => {
    const promoted = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"].map(createProduct)
    const newest = ["p2", "n1", "n2", "n3", "n4", "n5"].map(createProduct)

    const result = buildForYouPool(promoted, newest, 12)

    expect(result.map((item) => item.id)).toEqual([
      "p1",
      "p2",
      "p3",
      "p4",
      "p5",
      "p6",
      "p7",
      "p8",
      "n1",
      "n2",
      "n3",
      "n4",
    ])
  })

  it("caps by limit and never returns duplicate ids", () => {
    const promoted = ["a", "a", "b"].map(createProduct)
    const newest = ["b", "c", "d", "e"].map(createProduct)

    const result = buildForYouPool(promoted, newest, 3)

    expect(result.map((item) => item.id)).toEqual(["a", "b", "c"])
  })
})
