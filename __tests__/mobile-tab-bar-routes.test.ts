import { describe, expect, test } from "vitest"

import {
  getMobileTabBarRouteState,
  isMobileTabPathActive,
} from "@/lib/navigation/mobile-tab-bar"

describe("mobile tab bar route state", () => {
  test("keeps tab bar visible on browse routes", () => {
    const homeState = getMobileTabBarRouteState("/en")
    const searchState = getMobileTabBarRouteState("/bg/search")
    const categoryState = getMobileTabBarRouteState("/en/categories/phones")

    expect(homeState.normalizedPathname).toBe("/")
    expect(homeState.shouldHideTabBar).toBe(false)

    expect(searchState.normalizedPathname).toBe("/search")
    expect(searchState.shouldHideTabBar).toBe(false)

    expect(categoryState.normalizedPathname).toBe("/categories/phones")
    expect(categoryState.shouldHideTabBar).toBe(false)
  })

  test("hides tab bar on contextual routes with dedicated bottom actions", () => {
    const productState = getMobileTabBarRouteState("/en/treido/iphone-17")
    const cartState = getMobileTabBarRouteState("/en/cart")
    const assistantState = getMobileTabBarRouteState("/en/assistant")

    expect(productState.isProductPage).toBe(true)
    expect(productState.shouldHideTabBar).toBe(true)

    expect(cartState.isCartPage).toBe(true)
    expect(cartState.shouldHideTabBar).toBe(true)

    expect(assistantState.isAssistantPage).toBe(true)
    expect(assistantState.shouldHideTabBar).toBe(true)
  })

  test("does not classify known two-segment app routes as product pages", () => {
    const state = getMobileTabBarRouteState("/en/search/results")

    expect(state.pathSegments).toEqual(["search", "results"])
    expect(state.isProductPage).toBe(false)
    expect(state.shouldHideTabBar).toBe(false)
  })

  test("normalizes locale prefixes including language-region format", () => {
    const state = getMobileTabBarRouteState("/en-US/sell")

    expect(state.pathSegments).toEqual(["sell"])
    expect(state.normalizedPathname).toBe("/sell")
  })

  test("matches active tab paths against normalized route", () => {
    expect(isMobileTabPathActive("/", "/")).toBe(true)
    expect(isMobileTabPathActive("/search", "/")).toBe(false)
    expect(isMobileTabPathActive("/categories/tech", "/categories")).toBe(true)
    expect(isMobileTabPathActive("/account", "/chat")).toBe(false)
  })
})

