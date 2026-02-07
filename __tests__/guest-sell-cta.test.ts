import { describe, expect, it } from "vitest"

import {
  GUEST_SELL_CTA_COOLDOWN_MS,
  isGuestSellCtaRouteEligible,
  isInGuestSellCtaCooldown,
  parseDismissedAt,
  stripLocalePrefix,
} from "@/lib/guest-sell-cta"

describe("lib/guest-sell-cta", () => {
  describe("stripLocalePrefix", () => {
    it("removes locale prefixes", () => {
      expect(stripLocalePrefix("/en/search")).toBe("/search")
      expect(stripLocalePrefix("/bg/categories/fashion")).toBe("/categories/fashion")
      expect(stripLocalePrefix("/en")).toBe("/")
    })

    it("keeps non-localized paths unchanged", () => {
      expect(stripLocalePrefix("/search")).toBe("/search")
      expect(stripLocalePrefix("/")).toBe("/")
    })
  })

  describe("isGuestSellCtaRouteEligible", () => {
    it("allows discovery routes", () => {
      expect(isGuestSellCtaRouteEligible("/")).toBe(true)
      expect(isGuestSellCtaRouteEligible("/search")).toBe(true)
      expect(isGuestSellCtaRouteEligible("/categories/electronics")).toBe(true)
      expect(isGuestSellCtaRouteEligible("/en/categories/fashion")).toBe(true)
    })

    it("rejects non-discovery routes", () => {
      expect(isGuestSellCtaRouteEligible("/auth/login")).toBe(false)
      expect(isGuestSellCtaRouteEligible("/sell")).toBe(false)
      expect(isGuestSellCtaRouteEligible("/account")).toBe(false)
      expect(isGuestSellCtaRouteEligible("/chat")).toBe(false)
    })
  })

  describe("parseDismissedAt", () => {
    it("parses valid values", () => {
      expect(parseDismissedAt("1730000000000")).toBe(1730000000000)
    })

    it("returns null for invalid values", () => {
      expect(parseDismissedAt(null)).toBeNull()
      expect(parseDismissedAt("")).toBeNull()
      expect(parseDismissedAt("abc")).toBeNull()
      expect(parseDismissedAt("-1")).toBeNull()
    })
  })

  describe("isInGuestSellCtaCooldown", () => {
    it("returns true while inside the cooldown window", () => {
      const now = 1730000000000
      const dismissedAt = now - (GUEST_SELL_CTA_COOLDOWN_MS - 1)
      expect(isInGuestSellCtaCooldown(dismissedAt, now)).toBe(true)
    })

    it("returns false once cooldown has elapsed", () => {
      const now = 1730000000000
      const dismissedAt = now - GUEST_SELL_CTA_COOLDOWN_MS
      expect(isInGuestSellCtaCooldown(dismissedAt, now)).toBe(false)
      expect(isInGuestSellCtaCooldown(null, now)).toBe(false)
    })
  })
})
