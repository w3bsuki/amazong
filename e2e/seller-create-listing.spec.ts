import { test, expect } from './fixtures/test'
import { getTestUserCredentials, loginWithPassword } from './fixtures/auth'

test.describe('Seller Create Listing - UX Audit Phase 6', () => {
  test.describe.configure({ timeout: 180_000 })

  test('authenticated user can create and publish a listing (mobile flow) @seller @sell @auth', async ({ page, app }) => {
    const creds = getTestUserCredentials()
    test.skip(!creds, 'Set TEST_USER_EMAIL/TEST_USER_PASSWORD to run authenticated listing creation')

    // Force mobile layout so the stepper publish button is available.
    await page.setViewportSize({ width: 390, height: 844 })

    await app.clearAuthSession()
    await loginWithPassword(page, creds!)

    await app.gotoWithRetries('/en/sell', { timeout: 60_000, retries: 3 })
    await app.waitForDevCompilingOverlayToHide(60_000)

    const uniqueTitle = `E2E Listing ${Date.now()}`

    // Step 1: Basics
    await page.locator('#sell-form-title').fill(uniqueTitle)

    // Category: open drawer and pick the first search result.
    await page.getByRole('button', { name: /category:|категория:/i }).first().click()

    const categorySearch = page.getByPlaceholder(/search category|търси категория/i)
    await categorySearch.fill('a')

    const firstCategoryResult = page.locator('button', { hasText: '›' }).first()
    await expect(firstCategoryResult).toBeVisible({ timeout: 30_000 })
    await firstCategoryResult.click()

    await page.getByRole('button', { name: /continue|продължи/i }).click()

    // Step 2: Photos
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles('e2e/assets/1x1.png')

    await expect(page.getByAltText(/product image 1/i)).toBeVisible({ timeout: 60_000 })

    await page.getByRole('button', { name: /continue|продължи/i }).click()

    // Step 3: Pricing & shipping
    await page.locator('#sell-form-price').fill('12.34')

    await page.getByRole('button', { name: /continue|продължи/i }).click()

    // Step 4: Review & publish
    const description =
      'This is an end to end test listing created by Playwright to validate the seller flow. ' +
      'It contains enough words to satisfy the minimum description requirement for publishing today.'

    await page.locator('#sell-form-description').fill(description)

    await page.getByRole('button', { name: /publish listing|публикувай/i }).click()

    await expect(page.getByText(/published!/i)).toBeVisible({ timeout: 90_000 })

    await page.getByRole('link', { name: /view listing|виж обявата/i }).click()

    await expect(page.getByText(uniqueTitle).first()).toBeVisible({ timeout: 60_000 })
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()
  })
})
