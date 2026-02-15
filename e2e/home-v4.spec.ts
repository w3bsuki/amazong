import { test, expect, assertVisible } from "./fixtures/base"

test.describe("Mobile Home V4", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie-consent", "accepted")
      localStorage.setItem("geo-welcome-dismissed", "true")
    })
  })

  test("renders v4 rails, banner, feed, and filter trigger", async ({ page, app }) => {
    await app.goto("/en")
    await app.waitForHydration()

    await assertVisible(page.getByTestId("home-v4-primary-rail"))
    await assertVisible(page.getByTestId("home-v4-secondary-rail"))
    await assertVisible(page.getByTestId("home-v4-context-banner"))
    await assertVisible(page.getByTestId("home-v4-filter-trigger"))
    await assertVisible(page.getByTestId("home-v4-feed"))

    await expect(page.getByTestId("home-v4-scope-forYou")).toBeVisible()
    await expect(page.getByTestId("home-v4-scope-newest")).toBeVisible()
    await expect(page.getByTestId("home-v4-scope-promoted")).toBeVisible()
    await expect(page.getByTestId("home-v4-scope-nearby")).toBeVisible()
    await expect(page.getByTestId("home-v4-scope-deals")).toBeVisible()
  })

  test("opens more-categories sheet", async ({ page, app }) => {
    await app.goto("/en")
    await app.waitForHydration()

    const trigger = page.getByTestId("home-v4-more-categories-trigger")
    await assertVisible(trigger)
    await trigger.click()

    await assertVisible(page.getByTestId("home-v4-category-picker"))
  })

  test("opens filter drawer from home contextual controls", async ({ page, app }) => {
    await app.goto("/en")
    await app.waitForHydration()

    await page.getByTestId("home-v4-filter-trigger").click()
    await assertVisible(page.getByRole("heading", { name: /all filters/i }))
    await assertVisible(page.getByText(/price/i))
    await assertVisible(page.getByText(/location/i))
    await assertVisible(page.getByText(/availability/i))
  })
})
