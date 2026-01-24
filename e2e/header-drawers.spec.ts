import { test, expect, assertVisible } from "./fixtures/base"

test.describe("Header Drawers - Scroll Stability", () => {
  test.describe.configure({ timeout: 30_000 })

  test("opening/closing cart + wishlist does not jump scroll", async ({ page, app }) => {
    // Force mobile header to render in the chromium project (smoke runs desktop viewport by default).
    await page.setViewportSize({ width: 390, height: 844 })

    await app.goto("/en")
    await app.waitForHydration()

    const appHeader = page.locator('header[data-slot="app-header"]').first()
    await assertVisible(appHeader)

    await page.evaluate(() => {
      window.scrollTo(0, Math.max(0, document.body.scrollHeight - window.innerHeight - 200))
    })

    // Allow the browser a moment to settle layout after scrolling.
    await page.waitForTimeout(200)

    const before = await page.evaluate(() => window.scrollY)

    // -----------------------------------------------------------------------
    // Cart drawer
    // -----------------------------------------------------------------------
    const cartTrigger = appHeader.locator('button[aria-label="Cart"]').first()
    await cartTrigger.waitFor({ state: "visible", timeout: 10_000 })
    await cartTrigger.click()

    const cartDrawer = page.locator('[data-slot="drawer-content"]').filter({ hasText: "Shopping Cart" }).first()
    await assertVisible(cartDrawer)

    await cartDrawer.getByRole("button", { name: "Close" }).click()

    await page.waitForTimeout(200)
    const afterCart = await page.evaluate(() => window.scrollY)
    expect(Math.abs(afterCart - before)).toBeLessThan(5)

    // -----------------------------------------------------------------------
    // Wishlist drawer
    // -----------------------------------------------------------------------
    const wishlistTrigger = appHeader.locator('button[aria-label="Wishlist"]').first()
    await wishlistTrigger.waitFor({ state: "visible", timeout: 10_000 })
    await wishlistTrigger.click()

    const wishlistDrawer = page.locator('[data-slot="drawer-content"]').filter({ hasText: "My Wishlist" }).first()
    await assertVisible(wishlistDrawer)

    await wishlistDrawer.getByRole("button", { name: "Close" }).click()

    await page.waitForTimeout(200)
    const afterWishlist = await page.evaluate(() => window.scrollY)
    expect(Math.abs(afterWishlist - before)).toBeLessThan(5)

    await assertVisible(appHeader)
    app.assertNoConsoleErrors()
  })
})
