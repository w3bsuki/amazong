import { test, expect, assertNoErrorBoundary, assertVisible } from "./fixtures/base"

function pickSearchTerm(title: string | null | undefined): string {
  if (!title) return "test"

  const words = title
    .split(/\s+/)
    .map((w) => w.replaceAll(/[^a-z0-9_-]/gi, ""))
    .filter((w) => w.length >= 3)

  return words[0] ?? "test"
}

async function pickAnyProductFromApi(request: import("@playwright/test").APIRequestContext) {
  const response = await request.get("/api/products/newest")
  expect(response.status()).toBe(200)

  const data = await response.json()
  const products: unknown[] = Array.isArray(data?.products) ? data.products : []

  const first = products.find((p: any) => p?.storeSlug && (p?.slug || p?.id)) as any | undefined
  test.skip(!first, "No products returned from /api/products/newest")

  return first
}

async function clickAnyProductCard(page: import("@playwright/test").Page) {
  const grid = page.locator("#product-grid:visible").first()
  await assertVisible(grid)

  const productLink = grid.locator('a[data-slot="product-card-link"], a[aria-label]').first()
  const hasLink = await productLink.isVisible({ timeout: 10_000 }).catch(() => false)
  test.skip(!hasLink, "No product cards visible in #product-grid")

  await productLink.scrollIntoViewIfNeeded()

  const urlBefore = page.url()
  const scrollYBefore = await page.evaluate(() => window.scrollY)
  await productLink.click()

  return { urlBefore, scrollYBefore }
}

test.describe("Product quick view overlay (no route change)", () => {
  test.describe.configure({ timeout: 60_000 })

  test("search → opens dialog on desktop; close preserves scroll", async ({ page, app, request }) => {
    await page.setViewportSize({ width: 1280, height: 720 })

    const first = await pickAnyProductFromApi(request)
    const term = pickSearchTerm(first?.title)

    await app.goto(`/en/search?q=${encodeURIComponent(term)}`)
    await app.waitForHydration()

    await assertNoErrorBoundary(page)

    const { urlBefore, scrollYBefore } = await clickAnyProductCard(page)

    await assertVisible(page.locator('[data-slot="dialog-content"]').first())
    expect(page.url()).toBe(urlBefore)

    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="dialog-content"]').first()).toBeHidden({ timeout: 10_000 })

    const scrollYAfter = await page.evaluate(() => window.scrollY)
    expect(Math.abs(scrollYAfter - scrollYBefore)).toBeLessThan(200)

    await assertNoErrorBoundary(page)
    app.assertNoConsoleErrors()
  })

  test("search → opens drawer on mobile; close preserves scroll", async ({ page, app, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    const first = await pickAnyProductFromApi(request)
    const term = pickSearchTerm(first?.title)

    await app.goto(`/en/search?q=${encodeURIComponent(term)}`)
    await app.waitForHydration()

    await assertNoErrorBoundary(page)

    const { urlBefore, scrollYBefore } = await clickAnyProductCard(page)

    await assertVisible(page.locator('[data-slot="drawer-content"]').first())
    expect(page.url()).toBe(urlBefore)

    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="drawer-content"]').first()).toBeHidden({ timeout: 10_000 })

    const scrollYAfter = await page.evaluate(() => window.scrollY)
    expect(Math.abs(scrollYAfter - scrollYBefore)).toBeLessThan(200)

    await assertNoErrorBoundary(page)
    app.assertNoConsoleErrors()
  })

  test("categories → opens dialog; URL stays on category", async ({ page, app, request }) => {
    await page.setViewportSize({ width: 1280, height: 720 })

    const first = await pickAnyProductFromApi(request)

    const categorySlug =
      typeof first?.categorySlug === "string"
        ? first.categorySlug
        : typeof first?.categoryRootSlug === "string"
          ? first.categoryRootSlug
          : null

    test.skip(!categorySlug, "No category slug returned from /api/products/newest")

    await app.goto(`/en/categories/${categorySlug}`)
    await app.waitForHydration()

    await assertNoErrorBoundary(page)

    const { urlBefore } = await clickAnyProductCard(page)

    await assertVisible(page.locator('[data-slot="dialog-content"]').first())
    expect(page.url()).toBe(urlBefore)

    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="dialog-content"]').first()).toBeHidden({ timeout: 10_000 })

    await assertNoErrorBoundary(page)
    app.assertNoConsoleErrors()
  })
})
