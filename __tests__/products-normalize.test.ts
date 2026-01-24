import { beforeAll, describe, expect, test, vi } from "vitest"

// `lib/data/products.ts` is a server-only module; for these pure helpers we can safely
// mock Next.js' guard in unit tests.
vi.mock("server-only", () => ({}))

let normalizeProductRow: typeof import("@/lib/data/products").normalizeProductRow
let toUI: typeof import("@/lib/data/products").toUI

beforeAll(async () => {
  const mod = await import("@/lib/data/products")
  normalizeProductRow = mod.normalizeProductRow
  toUI = mod.toUI
})

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
