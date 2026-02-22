import { describe, expect, it } from "vitest"
import { normalizeHomeDiscoveryFilters, resolveDiscoveryFilterState } from "@/lib/home-browse-href"

describe("normalizeHomeDiscoveryFilters", () => {
  it("keeps only supported lightweight filters", () => {
    const input = new URLSearchParams()
    input.set("minPrice", "10")
    input.set("maxPrice", "50")
    input.set("minRating", "4")
    input.set("availability", "instock")
    input.set("city", "Plovdiv")
    input.set("nearby", "true")
    input.set("unknown", "nope")

    const next = normalizeHomeDiscoveryFilters(input)

    expect(next.get("minPrice")).toBe("10")
    expect(next.get("maxPrice")).toBe("50")
    expect(next.get("minRating")).toBe("4")
    expect(next.get("availability")).toBe("instock")
    expect(next.get("city")).toBe("Plovdiv")
    expect(next.get("nearby")).toBe("true")
    expect(next.has("unknown")).toBe(false)
  })

  it("drops invalid values", () => {
    const input = new URLSearchParams()
    input.set("availability", "all")
    input.set("nearby", "false")

    const next = normalizeHomeDiscoveryFilters(input)

    expect(next.has("availability")).toBe(false)
    expect(next.has("nearby")).toBe(false)
  })
})

describe("resolveDiscoveryFilterState", () => {
  it("resolves defaults when no filters are applied", () => {
    const state = resolveDiscoveryFilterState({
      filters: new URLSearchParams(),
      city: null,
      nearby: false,
      effectiveScope: "forYou",
    })

    expect(state).toEqual({
      effectiveNearby: false,
      effectiveCity: null,
      hasFilteredCity: false,
    })
  })

  it("prefers filtered city and nearby filter", () => {
    const filters = new URLSearchParams()
    filters.set("nearby", "true")
    filters.set("city", "Varna")

    const state = resolveDiscoveryFilterState({
      filters,
      city: "Sofia",
      nearby: false,
      effectiveScope: "forYou",
    })

    expect(state.effectiveNearby).toBe(true)
    expect(state.effectiveCity).toBe("Varna")
    expect(state.hasFilteredCity).toBe(true)
  })

  it("hydrates city when nearby scope is active", () => {
    const state = resolveDiscoveryFilterState({
      filters: new URLSearchParams(),
      city: "Sofia",
      nearby: false,
      effectiveScope: "nearby",
    })

    expect(state.effectiveNearby).toBe(true)
    expect(state.effectiveCity).toBe("Sofia")
  })
})
