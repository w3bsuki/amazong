import { beforeEach, describe, expect, it } from "vitest"

import {
  asNumber,
  asString,
  asStringArray,
  normalizeCartImageUrl,
  normalizePrice,
  normalizeQuantity,
  normalizeSellerSlugs,
  parseStoredCartItems,
  readCartFromStorage,
  sanitizeCartItems,
  toRecord,
} from "@/components/providers/cart-helpers"
import type { CartItem } from "@/components/providers/cart-types"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

function cartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: "p1",
    title: "Item",
    price: 10,
    image: "https://images.unsplash.com/photo-1",
    quantity: 1,
    ...overrides,
  }
}

describe("cart-helpers", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("converts object-like values to records", () => {
    expect(toRecord({ a: 1 })).toEqual({ a: 1 })
    expect(toRecord(null)).toBeNull()
    expect(toRecord("text")).toBeNull()
  })

  it("extracts strings safely", () => {
    expect(asString("ok")).toBe("ok")
    expect(asString(123)).toBeNull()
  })

  it("parses numbers and numeric strings", () => {
    expect(asNumber(42)).toBe(42)
    expect(asNumber("42.5")).toBe(42.5)
    expect(asNumber("NaN")).toBeNull()
  })

  it("accepts only string arrays", () => {
    expect(asStringArray(["a", "b"])).toEqual(["a", "b"])
    expect(asStringArray(["a", 2])).toBeNull()
    expect(asStringArray("a")).toBeNull()
  })

  it("normalizes quantities with floor and bounds", () => {
    expect(normalizeQuantity(2.9)).toBe(2)
    expect(normalizeQuantity("3")).toBe(3)
    expect(normalizeQuantity(0)).toBeNull()
    expect(normalizeQuantity(-1)).toBeNull()
    expect(normalizeQuantity(400)).toBe(99)
  })

  it("normalizes prices and rejects negative values", () => {
    expect(normalizePrice(19.99)).toBe(19.99)
    expect(normalizePrice("4.5")).toBe(4.5)
    expect(normalizePrice(-1)).toBeNull()
  })

  it("normalizes seller slug fields", () => {
    expect(normalizeSellerSlugs({ username: "u1", storeSlug: null })).toEqual({
      username: "u1",
      storeSlug: "u1",
    })
    expect(normalizeSellerSlugs({ storeSlug: "shop-1" })).toEqual({
      username: "shop-1",
      storeSlug: "shop-1",
    })
  })

  it("keeps local image paths unchanged", () => {
    expect(normalizeCartImageUrl("/img/item.png")).toBe("/img/item.png")
  })

  it("allows trusted remote image hosts", () => {
    expect(normalizeCartImageUrl("https://images.unsplash.com/photo")).toContain("images.unsplash.com")
    expect(normalizeCartImageUrl("https://abc.supabase.co/storage/v1/object/public/x.png")).toContain(
      ".supabase.co"
    )
  })

  it("falls back to placeholder for disallowed or invalid hosts", () => {
    expect(normalizeCartImageUrl("https://evil.example.com/image.png")).toBe(PLACEHOLDER_IMAGE_PATH)
    expect(normalizeCartImageUrl("https://:bad-url")).toBe(PLACEHOLDER_IMAGE_PATH)
  })

  it("sanitizes cart rows and drops invalid ones", () => {
    const result = sanitizeCartItems([
      cartItem(),
      cartItem({ id: "", title: "invalid id" }),
      cartItem({ id: "p3", price: -2 }),
      cartItem({ id: "p4", quantity: 0 }),
    ])

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe("p1")
  })

  it("reads empty storage state", () => {
    const result = readCartFromStorage()
    expect(result.items).toEqual([])
    expect(result.hadRawValue).toBe(false)
    expect(result.wasCorrupt).toBe(false)
  })

  it("marks corrupt storage payloads", () => {
    localStorage.setItem("cart", "{\"not\":\"array\"}")
    const result = readCartFromStorage()
    expect(result.hadRawValue).toBe(true)
    expect(result.wasCorrupt).toBe(true)
    expect(result.items).toEqual([])
  })

  it("marks sanitized rows when invalid entries are removed", () => {
    localStorage.setItem(
      "cart",
      JSON.stringify([cartItem(), { id: "bad", price: -1, quantity: 1, image: "", title: "bad" }])
    )
    const result = readCartFromStorage()
    expect(result.hadRawValue).toBe(true)
    expect(result.wasCorrupt).toBe(false)
    expect(result.wasSanitized).toBe(true)
    expect(result.items).toHaveLength(1)
  })

  it("parses stored cart strings into sanitized rows", () => {
    const rows = parseStoredCartItems(
      JSON.stringify([cartItem({ id: "x1" }), cartItem({ id: "x2", quantity: 3 })])
    )
    expect(rows.map((r) => r.id)).toEqual(["x1", "x2"])
  })

  it("returns empty cart for invalid serialized payload", () => {
    expect(parseStoredCartItems("not-json")).toEqual([])
  })
})
