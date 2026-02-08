import { describe, expect, test } from "vitest"

import {
  resolveMobileTrustSignal,
  shouldShowStrongRating,
} from "@/components/shared/product/_lib/mobile-card-rules"

describe("shouldShowStrongRating", () => {
  test("returns true only for strong rating and sufficient reviews", () => {
    expect(shouldShowStrongRating(4.7, 20)).toBe(true)
    expect(shouldShowStrongRating(4.9, 120)).toBe(true)
  })

  test("returns false below thresholds", () => {
    expect(shouldShowStrongRating(4.6, 20)).toBe(false)
    expect(shouldShowStrongRating(4.7, 19)).toBe(false)
    expect(shouldShowStrongRating()).toBe(false)
    expect(shouldShowStrongRating(4.9)).toBe(false)
  })
})

describe("resolveMobileTrustSignal", () => {
  test("prioritizes free shipping over rating", () => {
    expect(
      resolveMobileTrustSignal({
        freeShipping: true,
        rating: 5,
        reviews: 200,
      })
    ).toBe("shipping")
  })

  test("uses rating signal when strong and shipping is absent", () => {
    expect(
      resolveMobileTrustSignal({
        freeShipping: false,
        rating: 4.8,
        reviews: 42,
      })
    ).toBe("rating")
  })

  test("returns null when neither signal qualifies", () => {
    expect(
      resolveMobileTrustSignal({
        freeShipping: false,
        rating: 4.6,
        reviews: 60,
      })
    ).toBeNull()
  })
})
