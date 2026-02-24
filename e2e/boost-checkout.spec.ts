import { test, expect } from './fixtures/test'
import { getTestUserCredentials, loginWithPassword } from './fixtures/auth'
import type { AppFixture } from './fixtures/base'
import type { Page, Route } from '@playwright/test'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key]
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined
}

async function openBoostDialogOrSkip(
  { page, app }: { page: Page; app: AppFixture },
  locale: 'en' | 'bg'
) {
  await app.clearAuthSession()

  const creds = getTestUserCredentials()
  test.skip(!creds, 'Set TEST_USER_EMAIL/TEST_USER_PASSWORD to run authenticated boost flow checks')

  await loginWithPassword(page, creds!)

  await app.goto(`/${locale}/account/selling`, { timeout: 60_000, retries: 3 })

  // If seller profile isn't set up (no username), the app redirects to /sell.
  if (page.url().includes(`/${locale}/sell`)) {
    test.skip(true, 'Test user must have a seller username/profile to access /account/selling')
  }

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

async function mockBoostCheckout(page: Page) {
  const requests: Array<{ locale?: string; durationDays?: string; productId?: string }> = []

  await page.route('**/api/boost/checkout', async (route: Route) => {
    const req = route.request()
    const postData: unknown = req.postDataJSON?.()
    const parsed = isRecord(postData) ? postData : {}

    const locale = getString(parsed, 'locale')
    const durationDays = getString(parsed, 'durationDays')
    const productId = getString(parsed, 'productId')

    requests.push({
      locale,
      durationDays,
      productId,
    })

    const durationKey =
      durationDays === '1'
        ? 'duration24h'
        : durationDays === '7'
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
    const requests = await mockBoostCheckout(page)

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
    const requests = await mockBoostCheckout(page)

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
