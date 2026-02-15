import { describe, expect, it } from "vitest"

import { getActiveFilterCount } from "@/lib/filters/active-filter-count"

function params(query: string) {
  return new URLSearchParams(query)
}

describe("getActiveFilterCount", () => {
  it("counts baseline price/rating/availability filters", () => {
    const count = getActiveFilterCount(
      params("minPrice=10&minRating=4&availability=inStock")
    )

    expect(count).toBe(3)
  })

  it("counts location as a single filter regardless of city+nearby combination", () => {
    const cityAndNearby = getActiveFilterCount(params("city=Sofia&nearby=true"))
    const nearbyOnly = getActiveFilterCount(params("nearby=true"))

    expect(cityAndNearby).toBe(1)
    expect(nearbyOnly).toBe(1)
  })

  it("counts deals and verified only when explicitly enabled", () => {
    const query = params("deals=true&verified=true")

    expect(getActiveFilterCount(query)).toBe(0)
    expect(getActiveFilterCount(query, { includeDeals: true })).toBe(1)
    expect(
      getActiveFilterCount(query, {
        includeDeals: true,
        includeVerified: true,
      })
    ).toBe(2)
  })

  it("counts attribute filter keys passed via options", () => {
    const query = params(
      "attr_brand=Sony&attr_color=Black&attr_color=Silver&attr_unused=1"
    )

    const count = getActiveFilterCount(query, {
      attributeKeys: ["attr_brand", "attr_color"],
    })

    expect(count).toBe(2)
  })

  it("can disable location counting for contexts that do not expose location controls", () => {
    const count = getActiveFilterCount(params("city=Varna"), {
      includeLocation: false,
    })

    expect(count).toBe(0)
  })
})
