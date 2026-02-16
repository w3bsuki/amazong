import { test, expect, assertVisible } from "./fixtures/base"
import type { Page } from "@playwright/test"

async function readContextTitle(page: Page): Promise<string> {
  const contextBannerTitle = page.getByTestId("home-v4-context-title")
  if ((await contextBannerTitle.count()) > 0 && await contextBannerTitle.first().isVisible()) {
    return (await contextBannerTitle.first().innerText()).trim()
  }

  return ""
}

const SUBCATEGORY_SELECTOR =
  'button[aria-pressed]:not([data-testid="home-v4-filter-trigger"]):not([data-testid="home-v4-browse-options-trigger"])'

async function selectContextWithBrowseOptions(page: Page): Promise<boolean> {
  const primaryRail = page.getByTestId("home-v4-primary-rail")
  const secondaryRail = page.getByTestId("home-v4-secondary-rail")
  const primaryTabs = primaryRail.getByRole("tab")
  const tabCount = await primaryTabs.count()

  for (let tabIndex = 1; tabIndex < tabCount; tabIndex += 1) {
    await primaryTabs.nth(tabIndex).click()
    const subcategoryButtons = secondaryRail.locator(SUBCATEGORY_SELECTOR)
    const subcategoryCount = await subcategoryButtons.count()
    if (subcategoryCount <= 1) continue

    for (let subcategoryIndex = 1; subcategoryIndex < subcategoryCount; subcategoryIndex += 1) {
      await subcategoryButtons.nth(subcategoryIndex).click()

      const browseTrigger = page.getByTestId("home-v4-browse-options-trigger")
      if ((await browseTrigger.count()) === 0) continue

      await browseTrigger.first().scrollIntoViewIfNeeded()
      return true
    }
  }

  return false
}

test.describe("Mobile Home", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie-consent", "accepted")
      localStorage.setItem("geo-welcome-dismissed", "true")
    })
  })

  test("renders rails, banner, feed, and filter trigger", async ({ page, app }) => {
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

  test("subcategory with deeper taxonomy shows browse-options trigger and keeps banner", async ({ page, app }) => {
    await app.goto("/en")
    await app.waitForHydration()

    const hasBrowseContext = await selectContextWithBrowseOptions(page)
    test.skip(!hasBrowseContext, "No home subcategory exposes deeper browse options.")

    const browseOptionsTrigger = page.getByTestId("home-v4-browse-options-trigger").first()
    await assertVisible(browseOptionsTrigger)
    await assertVisible(page.getByTestId("home-v4-context-banner"))
    await expect(page.getByTestId("home-v4-l2-banner")).toHaveCount(0)
  })

  test("browse-options drawer updates deep path and supports all-in reset", async ({ page, app }) => {
    await app.goto("/en")
    await app.waitForHydration()

    const hasBrowseContext = await selectContextWithBrowseOptions(page)
    test.skip(!hasBrowseContext, "No home subcategory exposes deeper browse options.")

    const browseOptionsTrigger = page.getByTestId("home-v4-browse-options-trigger").first()
    await assertVisible(browseOptionsTrigger)

    const beforeTitle = await readContextTitle(page)
    expect(beforeTitle.split(" / ").length).toBe(2)

    await browseOptionsTrigger.click()

    const browseOptionsSheet = page.getByTestId("home-v4-browse-options-sheet")
    await assertVisible(browseOptionsSheet)
    await assertVisible(page.getByTestId("home-v4-browse-options-all"))

    const l2Option = page.locator('[data-testid^="home-v4-browse-option-"]').first()
    await assertVisible(l2Option)
    await l2Option.click()

    await expect.poll(async () => {
      const title = await readContextTitle(page)
      return title.split(" / ").length
    }).toBe(3)

    await browseOptionsTrigger.click()
    await assertVisible(browseOptionsSheet)
    await page.getByTestId("home-v4-browse-options-all").click()

    await expect.poll(async () => {
      const title = await readContextTitle(page)
      return title.split(" / ").length
    }).toBe(2)
  })

  test("secondary rail sticks below primary rail after scroll", async ({ page, app }) => {
    await app.goto("/en")
    await app.waitForHydration()

    const primaryRail = page.getByTestId("home-v4-primary-rail")
    const secondaryRail = page.getByTestId("home-v4-secondary-rail")
    await assertVisible(primaryRail)
    await assertVisible(secondaryRail)

    await page.evaluate(() => window.scrollTo(0, 520))
    await page.waitForTimeout(150)

    const primaryBox = await primaryRail.boundingBox()
    const railBox = await secondaryRail.boundingBox()
    expect(primaryBox).toBeTruthy()
    expect(railBox).toBeTruthy()

    if (!primaryBox || !railBox) return

    expect(railBox.y).toBeLessThan(220)
    expect(railBox.y).toBeGreaterThanOrEqual(primaryBox.y + primaryBox.height - 2)
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

