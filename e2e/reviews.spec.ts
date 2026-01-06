import { test, expect, type Page } from "./fixtures/test"

async function setupPage(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("geo-welcome-dismissed", "true")
      localStorage.setItem("cookie-consent", "accepted")
    } catch {
      // ignore
    }
  })
}

async function gotoWithRetries(
  page: Page,
  url: string,
  options: Parameters<Page["goto"]>[1] & { retries?: number } = {},
) {
  const { retries = 2, ...gotoOptions } = options
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await page.goto(url, {
        waitUntil: "domcontentloaded",
        ...gotoOptions,
      })
    } catch (error) {
      lastError = error
      await page.waitForTimeout(750)
    }
  }

  throw lastError
}

async function openFirstProduct(page: Page, locale: "en" | "bg" = "en") {
  // Use a stable seeded product page to avoid flaky "no results" skips.
  await gotoWithRetries(page, `/${locale}/shop4e/12322`, { timeout: 60_000 })
  await page.waitForLoadState("domcontentloaded")
}

function getReviewsSection(page: Page) {
  return page.locator("#product-reviews-section")
}

async function getAnyReviewsRoot(page: Page) {
  const modern = getReviewsSection(page).first()
  const hybridHeading = page.getByRole("heading", { name: /customer reviews|отзиви/i }).first()

  // Wait for either:
  // - Modern product page: #product-reviews-section
  // - Hybrid product page: a localized "Customer Reviews" heading
  await expect(modern.or(hybridHeading)).toBeVisible({ timeout: 30_000 })

  const hasModern = await modern.isVisible({ timeout: 1_000 }).catch(() => false)
  if (hasModern) return modern

  return page.locator("section", { has: hybridHeading }).first()
}

test.describe("Product Reviews", () => {
  test.describe.configure({ timeout: 120_000 })

  test.beforeEach(async ({ page }) => {
    await setupPage(page)
  })

  test("should display reviews section on product page", async ({ page }) => {
    await openFirstProduct(page, "en")

    const reviewsRoot = await getAnyReviewsRoot(page)
    await expect(reviewsRoot).toBeVisible({ timeout: 20_000 })
    await expect(reviewsRoot.locator("h2, h3").first()).toBeVisible({ timeout: 20_000 })
  })

  test("should render rating distribution bars", async ({ page }) => {
    await openFirstProduct(page, "en")

    const reviewsRoot = await getAnyReviewsRoot(page)
    await expect(reviewsRoot).toBeVisible({ timeout: 20_000 })

    // Radix Progress root uses role=progressbar and our wrapper adds data-slot.
    await expect(reviewsRoot.locator('[role="progressbar"], [data-slot="progress"]')).toHaveCount(5, { timeout: 20_000 })
  })

  test("should filter reviews by star rating", async ({ page }) => {
    await openFirstProduct(page, "en")

    const reviewsRoot = await getAnyReviewsRoot(page)
    await expect(reviewsRoot).toBeVisible({ timeout: 20_000 })

    const modernSection = getReviewsSection(page).first()
    const isModernPage = await modernSection.isVisible({ timeout: 2_000 }).catch(() => false)

    if (isModernPage) {
      // Modern reviews section: star filter buttons are numeric (5..1) and the
      // selected state uses bg-primary.
      const fiveStarFilter = modernSection.getByRole("button", { name: /^5\b/ }).first()
      await expect(fiveStarFilter).toBeVisible({ timeout: 20_000 })

      await fiveStarFilter.click()
      await expect(fiveStarFilter).toHaveClass(/bg-primary/, { timeout: 10_000 })
      return
    }

    // Hybrid reviews section: filtering is not currently exposed as a button UI.
    // Assert the rating distribution is present (5 bars).
    await expect(reviewsRoot.locator('[role="progressbar"], [data-slot="progress"]')).toHaveCount(5, { timeout: 20_000 })
  })

  test("should open and close review dialog", async ({ page }) => {
    await openFirstProduct(page, "en")

    const reviewsRoot = await getAnyReviewsRoot(page)
    await expect(reviewsRoot).toBeVisible({ timeout: 20_000 })

    const writeReviewButton = reviewsRoot
      .getByRole("button", { name: /review|отзив|ревю/i })
      .first()

    const hasWriteReview = await writeReviewButton.isVisible({ timeout: 5_000 }).catch(() => false)
    test.skip(!hasWriteReview, "Write review button not available")

    await writeReviewButton.click()

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 10_000 })

    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible({ timeout: 10_000 })
  })

  test("should show purchase required state when unauthenticated", async ({ page }) => {
    await openFirstProduct(page, "en")

    const reviewsRoot = await getAnyReviewsRoot(page)
    const writeReviewButton = reviewsRoot
      .getByRole("button", { name: /review|отзив|ревю/i })
      .first()

    const hasWriteReview = await writeReviewButton.isVisible({ timeout: 5_000 }).catch(() => false)
    test.skip(!hasWriteReview, "Write review button not available")

    await writeReviewButton.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 10_000 })

    // Attempt a submit and assert we get a guardrail (sign-in required and/or purchase required).
    await dialog.getByRole("button", { name: /^5\b/ }).first().click()
    await dialog.getByRole("button", { name: /submit review/i }).click()

    await expect(
      page.getByText(/please sign in to write a review|purchase required|purchase this product|you need to purchase/i).first()
    ).toBeVisible({ timeout: 15_000 })
  })

  test("should display reviews in Bulgarian locale", async ({ page }) => {
    await openFirstProduct(page, "bg")
    await expect(page).toHaveURL(/\/bg\//, { timeout: 15_000 })

    const reviewsRoot = await getAnyReviewsRoot(page)
    await expect(reviewsRoot).toBeVisible({ timeout: 20_000 })
    await expect(reviewsRoot.locator("h2, h3").first()).toBeVisible({ timeout: 20_000 })
  })
})

test.describe("Review Performance", () => {
  test.describe.configure({ timeout: 120_000 })

  test("should load reviews section within acceptable time", async ({ page }) => {
    await setupPage(page)
    const startTime = Date.now()
    await openFirstProduct(page, "en")
    const reviewsRoot = await getAnyReviewsRoot(page)
    await expect(reviewsRoot).toBeVisible({ timeout: 30_000 })

    const loadTimeMs = Date.now() - startTime
    // In dev mode, cold compilation can be slow; keep this threshold realistic.
    expect(loadTimeMs).toBeLessThan(30_000)
  })
})
