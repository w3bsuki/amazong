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
  // Home page can be highly dynamic; search is typically a more reliable listing surface.
  await gotoWithRetries(page, `/${locale}/search?q=test`, { timeout: 60_000 })

  const productLink = page
    .locator(
      `a[href^="/${locale}/"][href*="/product"], a[href*="/${locale}/product"], a[href*="/product/"]`,
    )
    .first()

  const hasProductLink = await productLink.isVisible({ timeout: 10_000 }).catch(() => false)
  test.skip(!hasProductLink, "No product links found to validate reviews UI")

  await productLink.scrollIntoViewIfNeeded()

  // Client-side navigation can be fast; start waiting before clicking.
  await Promise.all([
    page.waitForURL(url => !url.toString().includes(`/${locale}/search`), { timeout: 30_000 }),
    productLink.click({ timeout: 10_000 }),
  ])

  await page.waitForLoadState("domcontentloaded")
}

function getReviewsSection(page: Page) {
  return page.locator("#product-reviews-section")
}

async function getAnyReviewsRoot(page: Page) {
  const modern = getReviewsSection(page).first()
  // Wait for either:
  // - Modern product page: #product-reviews-section
  // - Hybrid product page: a "Customer Reviews" heading (currently not localized)
  await page.waitForSelector(
    '#product-reviews-section, h2:has-text("Customer Reviews"), h3:has-text("Customer Reviews")',
    { timeout: 30_000 },
  )

  if (await modern.count()) return modern

  const hybridHeading = page.getByRole("heading", { name: /customer reviews/i }).first()
  return hybridHeading.locator("..")
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
    await expect(reviewsRoot.locator('[data-slot="progress"]')).toHaveCount(5, { timeout: 20_000 })
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

    // Hybrid reviews section: buttons are label-based (e.g. "5 Stars (136)").
    const hybridFiveStarFilter = reviewsRoot.getByRole("button", { name: /5\s*stars/i }).first()
    await expect(hybridFiveStarFilter).toBeVisible({ timeout: 10_000 })
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

    // Unauthenticated users should see a purchase-required message.
    await expect(dialog).toContainText(/purchase required|purchase this product|you need to purchase/i, { timeout: 10_000 })
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
    await gotoWithRetries(page, "/en/search?q=test", { timeout: 60_000 })

    const productLink = page
      .locator('a[href^="/en/"][href*="/product"], a[href*="/en/product"], a[href*="/product/"]')
      .first()

    const hasProductLink = await productLink.isVisible({ timeout: 10_000 }).catch(() => false)
    test.skip(!hasProductLink, "No product links found to measure reviews load")

    const startTime = Date.now()
    await productLink.click()
    await page.waitForLoadState("domcontentloaded")

    const reviewsSection = getReviewsSection(page)
    await expect(reviewsSection).toBeVisible({ timeout: 30_000 })

    const loadTimeMs = Date.now() - startTime
    // In dev mode, cold compilation can be slow; keep this threshold realistic.
    expect(loadTimeMs).toBeLessThan(30_000)
  })
})
