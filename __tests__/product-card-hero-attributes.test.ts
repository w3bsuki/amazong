import { describe, expect, it } from "vitest"
import {
  buildHeroBadgeText,
  getHeroAttributeConfig,
  shouldShowHeroBadge,
} from "@/lib/product-card-hero-attributes"

describe("product-card-hero-attributes", () => {
  describe("getHeroAttributeConfig", () => {
    it("returns config for vehicles category", () => {
      const config = getHeroAttributeConfig("vehicles")
      expect(config).not.toBeNull()
      expect(config?.categoryRootSlug).toBe("vehicles")
      expect(config?.attributeKeys).toContain("make")
    })

    it("returns config for fashion category", () => {
      const config = getHeroAttributeConfig("fashion")
      expect(config).not.toBeNull()
      expect(config?.categoryRootSlug).toBe("fashion")
      expect(config?.attributeKeys).toContain("brand")
      expect(config?.attributeKeys).toContain("size")
    })

    it("returns config for electronics category", () => {
      const config = getHeroAttributeConfig("electronics")
      expect(config).not.toBeNull()
      expect(config?.attributeKeys).toContain("storage")
    })

    it("returns null for unknown category", () => {
      const config = getHeroAttributeConfig("unknown-category-xyz")
      expect(config).toBeNull()
    })

    it("returns null for null/undefined", () => {
      expect(getHeroAttributeConfig(null)).toBeNull()
      expect(getHeroAttributeConfig()).toBeNull()
    })
  })

  describe("buildHeroBadgeText", () => {
    it("builds vehicle badge from make + model", () => {
      const text = buildHeroBadgeText(
        "vehicles",
        { make: "BMW", model: "320d" },
        null,
        "en"
      )
      expect(text).toBe("BMW 320d")
    })

    it("builds fashion badge from brand + size", () => {
      const text = buildHeroBadgeText(
        "fashion",
        { brand: "Nike", size: "L" },
        null,
        "en"
      )
      expect(text).toBe("Nike · L")
    })

    it("builds electronics badge from brand + storage", () => {
      const text = buildHeroBadgeText(
        "electronics",
        { brand: "iPhone", storage: "128GB" },
        null,
        "en"
      )
      expect(text).toBe("iPhone · 128GB")
    })

    it("falls back to category name when no attributes", () => {
      const text = buildHeroBadgeText(
        "vehicles",
        {},
        [{ slug: "vehicles", name: "Vehicles", nameBg: "Превозни средства" }],
        "en"
      )
      expect(text).toBe("Vehicles")
    })

    it("prefers L1 category over L0 for fallback", () => {
      const text = buildHeroBadgeText(
        "vehicles",
        {},
        [
          { slug: "vehicles", name: "Vehicles", nameBg: "Превозни средства" },
          { slug: "cars", name: "Cars", nameBg: "Коли" },
        ],
        "en"
      )
      expect(text).toBe("Cars")
    })

    it("uses Bulgarian name when locale is bg", () => {
      const text = buildHeroBadgeText(
        "vehicles",
        {},
        [{ slug: "vehicles", name: "Vehicles", nameBg: "Коли" }],
        "bg"
      )
      expect(text).toBe("Коли")
    })

    it("truncates long text with ellipsis", () => {
      const text = buildHeroBadgeText(
        "vehicles",
        { make: "Mercedes-Benz", model: "S-Class AMG Long" },
        null,
        "en"
      )
      // Should be truncated to maxLength (18) - 1 + "…"
      expect(text).toBeDefined()
      expect(text!.length).toBeLessThanOrEqual(18)
      expect(text!.endsWith("…")).toBe(true)
    })

    it("returns null when no data available", () => {
      const text = buildHeroBadgeText(null, null, null, "en")
      expect(text).toBeNull()
    })
  })

  describe("shouldShowHeroBadge", () => {
    it("returns true when badge text can be built", () => {
      expect(
        shouldShowHeroBadge(
          "vehicles",
          { make: "BMW" },
          null
        )
      ).toBe(true)
    })

    it("returns true with category fallback", () => {
      expect(
        shouldShowHeroBadge(
          null,
          null,
          [{ slug: "test", name: "Test Category", nameBg: null }]
        )
      ).toBe(true)
    })

    it("returns false when no data available", () => {
      expect(shouldShowHeroBadge(null, null, null)).toBe(false)
      expect(shouldShowHeroBadge(null, null, [])).toBe(false)
    })
  })
})
