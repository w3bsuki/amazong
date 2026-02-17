import { test, expect } from './fixtures/authenticated'
import type { ConsoleMessage, Page } from '@playwright/test'

const ACCOUNT_ROUTES = [
  '/en/account',
  '/en/account/profile',
  '/en/account/orders',
  '/en/account/sales',
  '/en/account/wishlist',
  '/en/account/following',
  '/en/account/addresses',
  '/en/account/payments',
  '/en/account/security',
  '/en/account/settings',
  '/en/account/notifications',
  '/en/account/billing',
] as const

const IGNORED_CONSOLE_PATTERNS = [
  /Fast Refresh/i,
  /Download the React DevTools/i,
  /Third-party cookie/i,
  /Invalid source map/i,
  /Failed to fetch RSC payload/i,
  /Falling back to browser navigation/i,
  // Dev-only noise; should not mask real product/runtime errors.
  /was preloaded using link preload but not used/i,
]

type Capture = {
  errors: ConsoleMessage[]
  pageErrors: Error[]
}

function setupConsoleCapture(page: Page): Capture {
  const capture: Capture = { errors: [], pageErrors: [] }

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    const isIgnored = IGNORED_CONSOLE_PATTERNS.some((p) => p.test(text))
    if (!isIgnored) capture.errors.push(msg)
  })

  page.on('pageerror', (error) => {
    // WebKit/dev overlay quirks are already excluded via running chromium in this suite.
    capture.pageErrors.push(error)
  })

  return capture
}

function assertNoSevereErrors(capture: Capture, route: string) {
  const errorMessages = capture.errors.map((e) => e.text())
  const pageErrorMessages = capture.pageErrors.map((e) => e.message)

  if (errorMessages.length === 0 && pageErrorMessages.length === 0) return

  const formatted = [
    `Errors detected on ${route}:`,
    ...errorMessages.map((e) => `  - console.error: ${e}`),
    ...pageErrorMessages.map((e) => `  - page error: ${e}`),
  ].join('\n')

  throw new Error(formatted)
}

test.describe('UX Audit Phase 5 - Account Pages (authenticated)', () => {
  test.describe.configure({ timeout: 120_000 })

  for (const route of ACCOUNT_ROUTES) {
    test(`authenticated account route renders cleanly: ${route} @phase5`, async ({ page, app }) => {
      const capture = setupConsoleCapture(page)

      await app.goto(route, { timeout: 60_000, retries: 2 })
      await app.waitForHydration()

      // Should not show global error boundary.
      await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

      // Basic sanity: page should render main content.
      const main = page.locator('#main-content').or(page.locator('main')).first()
      await expect(main).toBeVisible({ timeout: 30_000 })
      await expect(main).not.toBeEmpty()

      // Targeted regression checks.
      if (route.endsWith('/notifications') || route.endsWith('/billing')) {
        // These pages previously got stuck on a Loading... state.
        const loadingText = main.getByText(/loading\.\.\.|зареждане\.\.\./i).first()
        const isLoadingVisible = await loadingText.isVisible().catch(() => false)
        if (isLoadingVisible) {
          await expect(loadingText).not.toBeVisible({ timeout: 15_000 })
        }
      }

      assertNoSevereErrors(capture, route)
    })
  }
})
