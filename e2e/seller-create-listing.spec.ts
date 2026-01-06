import { test, expect, type Page } from './fixtures/test'
import { getTestUserCredentials, loginWithPassword } from './fixtures/auth'

async function ensureUserCanSell(page: Page, locale: 'en' | 'bg' = 'en') {
  // If the Sell page redirects to the legacy "Set Up Your Username" gate, follow
  // the prompt and set a username via the profile editor, then return to /sell.
  const usernameGateHeading = page.getByRole('heading', { name: /set up your username/i }).first()
  const isOnUsernameGate = await usernameGateHeading.isVisible({ timeout: 2_000 }).catch(() => false)

  if (!isOnUsernameGate) return

  await page.getByRole('link', { name: /go to settings/i }).click()
  await expect(page).toHaveURL(new RegExp(`/${locale}/account/profile`))

  // Profile page defaults to the "Account" tab; username lives under "Public Profile".
  await page.getByRole('tab', { name: /public profile/i }).first().click()

  // Open the username dialog ("Set" when username is missing).
  await page.getByRole('button', { name: /^set$/i }).click({ timeout: 30_000 })

  const usernameInput = page.getByPlaceholder('your_username')
  await expect(usernameInput).toBeVisible({ timeout: 30_000 })

  const desired = `e2e_${Date.now()}`
  await usernameInput.fill(desired)

  // Wait for the availability check to pass (link preview appears).
  await expect(page.getByText(new RegExp(`treido\\.eu/u/${desired}`))).toBeVisible({ timeout: 30_000 })

  const saveButton = page.getByRole('button', { name: /^save$/i })
  await expect(saveButton).toBeEnabled({ timeout: 30_000 })
  await saveButton.click()

  // Page refreshes on success.
  await page.waitForLoadState('domcontentloaded')
}

test.describe('Seller Create Listing - UX Audit Phase 6', () => {
  test.describe.configure({ timeout: 180_000 })

  test('authenticated user can create and publish a listing (mobile flow) @seller @sell @auth', async ({ page, app }) => {
    const creds = getTestUserCredentials()
    test.skip(!creds, 'Set TEST_USER_EMAIL/TEST_USER_PASSWORD to run authenticated listing creation')

    // Force mobile layout so the stepper publish button is available.
    await page.setViewportSize({ width: 390, height: 844 })

    await app.clearAuthSession()
    await loginWithPassword(page, creds!)

    await app.goto('/en/sell', { timeout: 60_000, retries: 3 })
    await app.waitForHydration()

    await ensureUserCanSell(page, 'en')

    // After ensuring username is set, return to the sell page.
    await app.goto('/en/sell', { timeout: 60_000, retries: 3 })
    await app.waitForHydration()

    // If the user is not onboarded as a seller yet, complete the minimal wizard.
    const onboardingHeading = page.getByRole('heading', { name: /customize your profile/i }).first()
    const needsOnboarding = await onboardingHeading.isVisible({ timeout: 2_000 }).catch(() => false)

    if (needsOnboarding) {
      const displayNameInput = page.getByPlaceholder(/how should buyers call you\?/i).first()
      if (await displayNameInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await displayNameInput.fill('E2E Seller')
      }

      await page.getByRole('button', { name: /continue/i }).click({ timeout: 30_000 })
      await app.waitForHydration()

      // Success step offers "Start Selling".
      const startSelling = page.getByRole('button', { name: /start selling/i }).first()
      if (await startSelling.isVisible({ timeout: 10_000 }).catch(() => false)) {
        await startSelling.click({ timeout: 30_000 })
        await app.waitForHydration()
      }
    }

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

    await expect(page.locator('img[alt="Product image 1"]:visible').first()).toBeVisible({ timeout: 60_000 })

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
