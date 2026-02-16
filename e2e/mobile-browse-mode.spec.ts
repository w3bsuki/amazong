import { test, expect } from "./fixtures/base"

test.describe("Mobile Browse Mode", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("search defaults to listings mode on mobile", async ({ page, app }) => {
    await app.goto("/en/search?q=phone")
    await app.waitForHydration()

    const modeSwitch = page.getByTestId("mobile-browse-mode-switch")
    await expect(modeSwitch).toBeVisible()
    await expect(page.getByTestId("browse-mode-listings")).toHaveAttribute("aria-selected", "true")
  })

  test("switching from listings to sellers clears listings-only params", async ({ page, app }) => {
    await app.goto("/en/search?q=phone&minPrice=10&sort=price-asc")
    await app.waitForHydration()

    await page.getByTestId("browse-mode-sellers").click()
    await expect(page).toHaveURL(/mode=sellers/)

    const url = new URL(page.url())
    expect(url.searchParams.get("minPrice")).toBeNull()
    expect(url.searchParams.get("sort")).toBeNull()
    expect(url.searchParams.get("q")).toBe("phone")

    await expect(page.getByTestId("mobile-seller-filter-controls")).toBeVisible()
  })

  test("switching from sellers to listings clears sellers-only params", async ({ page, app }) => {
    await app.goto("/en/search?mode=sellers&q=phone&sellerSort=rating&sellerVerified=true")
    await app.waitForHydration()

    await page.getByTestId("browse-mode-listings").click()
    await expect(page).toHaveURL(/\/en\/search/)

    const url = new URL(page.url())
    expect(url.searchParams.get("mode")).toBeNull()
    expect(url.searchParams.get("sellerSort")).toBeNull()
    expect(url.searchParams.get("sellerVerified")).toBeNull()
    expect(url.searchParams.get("q")).toBe("phone")
  })
})
