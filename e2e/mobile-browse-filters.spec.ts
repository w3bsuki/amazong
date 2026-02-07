import { test, expect } from "./fixtures/base"

test.describe("Mobile Browse Filters", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie-consent", "accepted")
      localStorage.setItem("geo-welcome-dismissed", "true")
    })
  })

  test("categories tab opens unified category drawer on search", async ({ page, app }) => {
    await app.goto("/en/search?q=phone")
    await app.waitForHydration()

    const tabBar = page.getByTestId("mobile-tab-bar")
    await expect(tabBar).toBeVisible()
    await tabBar.getByRole("button", { name: /categories/i }).click()

    const categoryDrawer = page.getByTestId("mobile-category-drawer")
    await expect(categoryDrawer).toBeVisible()
    await expect(categoryDrawer.getByRole("textbox", { name: /search categories/i })).toBeVisible()
  })

  test("search page shows sticky mobile filter controls and location chip", async ({ page, app }) => {
    await app.goto("/en/search?q=phone")
    await app.waitForHydration()

    const filterBar = page.getByTestId("mobile-filter-sort-bar")
    await expect(filterBar).toBeVisible()

    const locationChip = page.getByTestId("mobile-location-chip")
    await expect(locationChip).toBeVisible()
    await locationChip.click()

    const filterDialog = page.getByRole("dialog", { name: /refine your search|location/i })
    await expect(filterDialog).toBeVisible()
    await expect(filterDialog.getByRole("radio", { name: /any location/i })).toBeVisible()
  })

  test("location filter applies city and creates active filter chip", async ({ page, app }) => {
    await app.goto("/en/search?q=phone")
    await app.waitForHydration()

    await page.getByTestId("mobile-location-chip").click()

    const filterDialog = page.getByRole("dialog", { name: /refine your search|location/i })
    const cityOption = filterDialog.getByRole("radio", { name: /sofia|софия/i })
    await expect(cityOption).toBeVisible()
    await cityOption.click()

    const applyButton = filterDialog.getByRole("button", { name: /show .* results|покажи .* резултат/i })
    await applyButton.click()

    await expect(page).toHaveURL(/city=/)
    await expect(page.getByTestId("mobile-location-chip")).toContainText(/sofia|софия/i)
  })
})
