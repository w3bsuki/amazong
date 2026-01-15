import { test, expect } from './fixtures/test'
import { getTestUserCredentials, loginWithPassword } from './fixtures/auth'

type BoostMockOptions = {
  locale: 'en' | 'bg'
}

async function openBoostDialogOrSkip({ page, app }: { page: any; app: any }, locale: 'en' | 'bg') {
  await app.clearAuthSession()

  const creds = getTestUserCredentials()
  test.skip(!creds, 'Set TEST_USER_EMAIL/TEST_USER_PASSWORD to run authenticated boost flow checks')

  await loginWithPassword(page, creds!)

  await app.goto(`/${locale}/account/selling`, { timeout: 60_000, retries: 3 })

  // If seller profile isn't set up (no username), the app redirects to /sell.
  if (page.url().includes(`/${locale}/sell`)) {
    test.skip(true, 'Test user must have a seller username/profile to access /account/selling')
  }

  // Find a boost trigger (icon-only button on mobile cards or outline button on desktop).
  const trigger = page.locator('button:has(svg)')
    .filter({ has: page.locator('svg') })

  // Prefer a visible button with the translated trigger text.
  const textTrigger = page.getByRole('button', { name: locale === 'bg' ? 'Промотирай' : 'Boost' }).first()

  if (await textTrigger.isVisible().catch(() => false)) {
    await textTrigger.click()
    return
  }

  // Fallback: click the first lightning-icon ghost button (best-effort).
  const lightningButtons = page.locator('button').filter({ has: page.locator('svg') })
  const count = await lightningButtons.count()
  test.skip(count === 0, 'No boost triggers found on selling page (need at least one unboosted product)')

  await lightningButtons.first().click()
}

async function mockBoostCheckout(page: any, { locale }: BoostMockOptions) {
  const requests: Array<{ locale?: string; durationDays?: string; productId?: string }> = []

  await page.route('**/api/boost/checkout', async (route: any) => {
    const req = route.request()
    const postData = (req.postDataJSON?.() ?? {}) as any

    requests.push({
      locale: postData.locale,
      durationDays: postData.durationDays,
      productId: postData.productId,
    })

    const durationKey =
      postData.durationDays === '1'
        ? 'duration24h'
        : postData.durationDays === '7'
          ? 'duration7d'
          : 'duration30d'

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: null,
        durationKey,
      }),
    })
  })

  return requests
}

test.describe('Boost flow (DEC-003) - localized pricing + checkout payload', () => {
  test.describe.configure({ timeout: 120_000 })

  test('shows EUR + BGN approx and includes locale in checkout request (en) @boost @auth', async ({ page, app }) => {
    const requests = await mockBoostCheckout(page, { locale: 'en' })

    await openBoostDialogOrSkip({ page, app }, 'en')

    // Assert all three options render EUR and BGN approximation.
    await expect(page.getByText('€0.99')).toBeVisible()
    await expect(page.getByText('€4.99')).toBeVisible()
    await expect(page.getByText('€14.99')).toBeVisible()

    await expect(page.getByText('≈1.94 лв')).toBeVisible()
    await expect(page.getByText('≈9.76 лв')).toBeVisible()
    await expect(page.getByText('≈29.32 лв')).toBeVisible()

    // Select each duration and trigger checkout (mocked).
    await page.getByText('€0.99').click()
    await page.getByRole('button', { name: /boost now/i }).click()

    await page.getByText('€4.99').click()
    await page.getByRole('button', { name: /boost now/i }).click()

    await page.getByText('€14.99').click()
    await page.getByRole('button', { name: /boost now/i }).click()

    expect(requests.length).toBeGreaterThanOrEqual(3)

    for (const req of requests.slice(-3)) {
      expect(req.locale).toBe('en')
      expect(req.durationDays).toMatch(/^(1|7|30)$/)
      expect(req.productId).toBeTruthy()
    }
  })

  test('shows EUR + BGN approx and includes locale in checkout request (bg) @boost @auth', async ({ page, app }) => {
    const requests = await mockBoostCheckout(page, { locale: 'bg' })

    await openBoostDialogOrSkip({ page, app }, 'bg')

    await expect(page.getByText('€0.99')).toBeVisible()
    await expect(page.getByText('€4.99')).toBeVisible()
    await expect(page.getByText('€14.99')).toBeVisible()

    await expect(page.getByText('≈1.94 лв')).toBeVisible()
    await expect(page.getByText('≈9.76 лв')).toBeVisible()
    await expect(page.getByText('≈29.32 лв')).toBeVisible()

    await page.getByText('€0.99').click()
    await page.getByRole('button', { name: /промотирай сега/i }).click()

    await page.getByText('€4.99').click()
    await page.getByRole('button', { name: /промотирай сега/i }).click()

    await page.getByText('€14.99').click()
    await page.getByRole('button', { name: /промотирай сега/i }).click()

    expect(requests.length).toBeGreaterThanOrEqual(3)

    for (const req of requests.slice(-3)) {
      expect(req.locale).toBe('bg')
      expect(req.durationDays).toMatch(/^(1|7|30)$/)
      expect(req.productId).toBeTruthy()
    }
  })
})
