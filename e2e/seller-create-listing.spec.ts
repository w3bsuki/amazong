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

    // ========================================
    // STEP 1: WHAT - Title + 1 Photo
    // ========================================
    await page.getByRole('textbox', { name: /title/i }).fill(uniqueTitle)

    // Upload the required photo
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles('e2e/assets/1x1.png')

    // Wait for upload to complete (image preview appears)
    await expect(page.locator('img[alt="Product image 1"]:visible').first()).toBeVisible({ timeout: 60_000 })

    await page.getByRole('button', { name: /continue|продължи/i }).click()

    // ========================================
    // STEP 2: CATEGORY - Pick a category
    // ========================================
    // Wait for category step to load
    await expect(page.getByRole('heading', { name: /choose a category|изберете категория/i })).toBeVisible({ timeout: 30_000 })

    // Click on a top-level category (Fashion)
    const fashionCategory = page.locator('button', { hasText: /fashion|мода/i }).first()
    await expect(fashionCategory).toBeVisible({ timeout: 30_000 })
    await fashionCategory.click()

    // Navigate through subcategories until we reach a leaf
    // Fashion → Men's → Shirts (example path)
    await page.waitForTimeout(500) // Allow category to expand
    
    // Try to find and click Men's or any subcategory
    const mensCategory = page.locator('button', { hasText: /men|мъже/i }).first()
    if (await mensCategory.isVisible({ timeout: 5000 }).catch(() => false)) {
      await mensCategory.click()
      await page.waitForTimeout(500)
    }

    // Click on a leaf category (e.g., Shirts, T-Shirts, etc.)
    const leafCategory = page.locator('button', { hasText: /shirt|t-shirt|тениск/i }).first()
    if (await leafCategory.isVisible({ timeout: 5000 }).catch(() => false)) {
      await leafCategory.click()
    } else {
      // If we can't find shirts, just click any available leaf category
      const anyLeafButton = page.locator('[data-is-leaf="true"], button:has-text("›"):not(:has-text("..."))').first()
      if (await anyLeafButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await anyLeafButton.click()
      }
    }

    // Wait for auto-advance to step 3 (Details)
    await expect(page.getByRole('heading', { name: /details|детайли/i })).toBeVisible({ timeout: 30_000 })

    // ========================================
    // STEP 3: DETAILS - Fill required attributes
    // ========================================
    // Details step shows category-specific attributes
    // For fashion items: condition, size, color, etc.
    
    // Click Continue to move to pricing (attributes are optional for now)
    await page.getByRole('button', { name: /continue|продължи/i }).click()

    // ========================================
    // STEP 4: PRICING - Set price
    // ========================================
    await expect(page.getByRole('heading', { name: /pricing|цена/i })).toBeVisible({ timeout: 30_000 })
    
    const priceInput = page.locator('input[name="price"], #sell-form-price, input[placeholder*="price"], input[type="number"]').first()
    await expect(priceInput).toBeVisible({ timeout: 10_000 })
    await priceInput.fill('12.34')

    await page.getByRole('button', { name: /continue|продължи/i }).click()

    // ========================================
    // STEP 5: REVIEW - Description + Publish
    // ========================================
    await expect(page.getByRole('heading', { name: /review|преглед/i })).toBeVisible({ timeout: 30_000 })
    
    const description =
      'This is an end to end test listing created by Playwright to validate the seller flow. ' +
      'It contains enough words to satisfy the minimum description requirement for publishing today.'

    const descriptionInput = page.locator('textarea[name="description"], #sell-form-description').first()
    await expect(descriptionInput).toBeVisible({ timeout: 10_000 })
    await descriptionInput.fill(description)

    await page.getByRole('button', { name: /publish listing|публикувай/i }).click()

    await expect(page.getByText(/published!/i)).toBeVisible({ timeout: 90_000 })

    await page.getByRole('link', { name: /view listing|виж обявата/i }).click()

    await expect(page.getByText(uniqueTitle).first()).toBeVisible({ timeout: 60_000 })
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()
  })
})
