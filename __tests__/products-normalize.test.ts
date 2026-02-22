import { describe, expect, test } from "vitest"
import { normalizeProductRow, toUI } from "@/lib/data/products/normalize"

describe("normalizeProductRow", () => {
  test("preserves free_shipping so UI mapping stays consistent", () => {
    const normalized = normalizeProductRow({
      id: "p1",
      title: "Test product",
      price: 10,
      free_shipping: true,
    })

    expect(toUI(normalized).freeShipping).toBe(true)
  })

  test("defaults freeShipping to false when free_shipping is missing", () => {
    const normalized = normalizeProductRow({
      id: "p2",
      title: "Another product",
      price: 10,
    })

    expect(toUI(normalized).freeShipping).toBe(false)
  })
})
