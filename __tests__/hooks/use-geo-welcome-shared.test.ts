import { beforeEach, describe, expect, it } from "vitest"

import {
  COOKIE_NAMES,
  GEO_WELCOME_COMPLETE_EVENT,
  getCookie,
  getCurrentLocaleFromPathname,
  getErrorMessage,
  getLocaleForRegion,
  getLocalStorage,
  getPathWithLocale,
  getRegionCountryCode,
  isShippingRegion,
  isSupportedLocale,
  setCookie,
  setLocalStorage,
  dispatchGeoWelcomeCompleteEvent,
} from "@/hooks/use-geo-welcome.shared"

describe("use-geo-welcome.shared", () => {
  beforeEach(() => {
    localStorage.clear()
    document.cookie = `${COOKIE_NAMES.COUNTRY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    document.cookie = `${COOKIE_NAMES.ZONE}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  })

  it("validates supported locales", () => {
    expect(isSupportedLocale("en")).toBe(true)
    expect(isSupportedLocale("bg")).toBe(true)
    expect(isSupportedLocale("de")).toBe(false)
  })

  it("validates shipping regions", () => {
    expect(isShippingRegion("BG")).toBe(true)
    expect(isShippingRegion("WW")).toBe(true)
    expect(isShippingRegion("CA")).toBe(false)
    expect(isShippingRegion(null)).toBe(false)
  })

  it("formats error messages for different error shapes", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom")
    expect(getErrorMessage("text")).toBe("text")
    expect(getErrorMessage({ message: "from-object" })).toBe("from-object")
    expect(getErrorMessage({ nope: true })).toBe("Unknown error")
  })

  it("extracts locale from pathname with fallback", () => {
    expect(getCurrentLocaleFromPathname("/bg/search")).toBe("bg")
    expect(getCurrentLocaleFromPathname("/unknown/path")).toBe("en")
    expect(getCurrentLocaleFromPathname("/")).toBe("en")
  })

  it("maps region to locale", () => {
    expect(getLocaleForRegion("BG")).toBe("bg")
    expect(getLocaleForRegion("EU")).toBe("en")
  })

  it("maps region to representative country code", () => {
    expect(getRegionCountryCode("UK")).toBe("GB")
    expect(getRegionCountryCode("EU")).toBe("DE")
  })

  it("reads and writes cookies", () => {
    setCookie(COOKIE_NAMES.COUNTRY, "BG")
    expect(getCookie(COOKIE_NAMES.COUNTRY)).toBe("BG")
  })

  it("reads and writes localStorage safely", () => {
    setLocalStorage("geo-key", "value")
    expect(getLocalStorage("geo-key")).toBe("value")
  })

  it("builds locale-aware paths from current location", () => {
    window.history.pushState({}, "", "/en/account/orders?x=1#top")
    expect(getPathWithLocale("bg")).toBe("/bg/account/orders?x=1#top")
  })

  it("prepends locale when URL has no locale segment", () => {
    window.history.pushState({}, "", "/search?q=1")
    expect(getPathWithLocale("bg")).toBe("/bg/search?q=1")
  })

  it("dispatches completion event", () => {
    let received = false
    window.addEventListener(GEO_WELCOME_COMPLETE_EVENT, () => {
      received = true
    }, { once: true })

    dispatchGeoWelcomeCompleteEvent()
    expect(received).toBe(true)
  })
})
