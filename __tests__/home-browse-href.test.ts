import { describe, expect, it } from "vitest"
import { buildHomeBrowseHref } from "@/lib/home-browse-href"
import type { HomeDiscoveryScope } from "@/lib/home-discovery/params"

function buildHref(options?: {
  scope?: HomeDiscoveryScope
  activeCategorySlug?: string | null
  activeSubcategorySlug?: string | null
  activeL2Slug?: string | null
  filters?: URLSearchParams
  city?: string | null
  nearby?: boolean
}) {
  return buildHomeBrowseHref({
    scope: options?.scope ?? "forYou",
    activeCategorySlug: options?.activeCategorySlug ?? null,
    activeSubcategorySlug: options?.activeSubcategorySlug ?? null,
    activeL2Slug: options?.activeL2Slug ?? null,
    filters: options?.filters ?? new URLSearchParams(),
    city: options?.city ?? null,
    nearby: options?.nearby ?? false,
  })
}

describe("buildHomeBrowseHref", () => {
  it("builds newest search href for default for-you scope", () => {
    const href = buildHref()
    const url = new URL(`https://example.com${href}`)

    expect(url.pathname).toBe("/search")
    expect(url.searchParams.get("sort")).toBe("newest")
    expect(url.searchParams.has("category")).toBe(false)
    expect(url.searchParams.has("promoted")).toBe(false)
    expect(url.searchParams.has("deals")).toBe(false)
  })

  it("forces newest scope when category context is active", () => {
    const href = buildHref({
      scope: "deals",
      activeCategorySlug: "fashion",
    })
    const url = new URL(`https://example.com${href}`)

    expect(url.searchParams.get("category")).toBe("fashion")
    expect(url.searchParams.get("sort")).toBe("newest")
    expect(url.searchParams.has("deals")).toBe(false)
  })

  it("includes nearby context with hydrated city", () => {
    const href = buildHref({
      scope: "nearby",
      city: "Sofia",
    })
    const url = new URL(`https://example.com${href}`)

    expect(url.searchParams.get("nearby")).toBe("true")
    expect(url.searchParams.get("city")).toBe("Sofia")
  })

  it("carries lightweight home filters into browse href", () => {
    const filters = new URLSearchParams()
    filters.set("minPrice", "10")
    filters.set("maxPrice", "50")
    filters.set("minRating", "4")
    filters.set("availability", "instock")
    filters.set("city", "Plovdiv")

    const href = buildHref({
      scope: "newest",
      filters,
    })
    const url = new URL(`https://example.com${href}`)

    expect(url.searchParams.get("minPrice")).toBe("10")
    expect(url.searchParams.get("maxPrice")).toBe("50")
    expect(url.searchParams.get("minRating")).toBe("4")
    expect(url.searchParams.get("availability")).toBe("instock")
    expect(url.searchParams.get("city")).toBe("Plovdiv")
  })

  it("prefers deepest category slug and filter city when nearby is set", () => {
    const filters = new URLSearchParams()
    filters.set("nearby", "true")
    filters.set("city", "Varna")

    const href = buildHref({
      scope: "forYou",
      activeCategorySlug: "tech",
      activeSubcategorySlug: "audio",
      activeL2Slug: "headphones",
      filters,
      city: "Sofia",
      nearby: false,
    })
    const url = new URL(`https://example.com${href}`)

    expect(url.searchParams.get("category")).toBe("headphones")
    expect(url.searchParams.get("nearby")).toBe("true")
    expect(url.searchParams.get("city")).toBe("Varna")
  })
})
