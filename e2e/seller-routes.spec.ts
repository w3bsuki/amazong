import { test, expect } from './fixtures/test'
import { getTestUserCredentials, loginWithPassword } from './fixtures/auth'

test.describe('Seller Routes - UX Audit Phase 6', () => {
  test.describe.configure({ timeout: 120_000 })

  test('sell entry is locale-safe and does not crash @seller @sell', async ({ page, app }) => {
    await app.clearAuthSession()

    const creds = getTestUserCredentials()
    test.skip(!creds, 'Set TEST_USER_EMAIL/TEST_USER_PASSWORD to run authenticated seller route checks')

    // Authenticate
    await loginWithPassword(page, creds!)

    // Sell should load (or at least show onboarding/username setup) without error boundary
    await app.goto('/en/sell', { timeout: 60_000, retries: 3 })

    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    // If the legacy username-setup state shows, verify the settings link is locale-prefixed.
    const usernameSetupHeading = page
      .getByRole('heading', { name: /set up your username|настройте потребителско име/i })
      .first()

    if (await usernameSetupHeading.isVisible().catch(() => false)) {
      await expect(page.locator('a[href="/en/account/profile"]')).toBeVisible()
      await expect(page.locator('a[href="/account/profile"]')).toHaveCount(0)
    }

    // If AI sell header shows, verify back navigation keeps locale.
    const createListingHeading = page.getByRole('heading', { name: /create listing|създай обява/i }).first()

    if (await createListingHeading.isVisible().catch(() => false)) {
      // The back button is a link inside the sticky header.
      await expect(page.locator('header a[href="/en"]').first()).toBeVisible()
      await expect(page.locator('header a[href="/"]').first()).toHaveCount(0)
    }
  })

  test('seller dashboard loads without crashing (post-login) @seller @dashboard', async ({ page, app }) => {
    await app.clearAuthSession()

    const creds = getTestUserCredentials()
    test.skip(!creds, 'Set TEST_USER_EMAIL/TEST_USER_PASSWORD to run authenticated seller route checks')
    await loginWithPassword(page, creds!)

    await app.goto('/en/dashboard', { timeout: 60_000, retries: 3 })

    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    // Basic sanity: page should render some main content.
    await expect(page.locator('#main-content').or(page.locator('main')).first()).toBeVisible()
  })

  test('public seller profile and product page render (seed user) @seller @profile', async ({ page, app }) => {
    // Public profile should render (or 404 gracefully) without crashing.
    await app.goto('/en/shop4e', { timeout: 60_000, retries: 3 })
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    // Product page should also render (or 404 gracefully) without crashing.
    await app.goto('/en/shop4e/12322', { timeout: 60_000, retries: 3 })
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()
  })
})
