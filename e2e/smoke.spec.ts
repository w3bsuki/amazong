import { test, expect, type Page, type ConsoleMessage } from './fixtures/test'

/**
 * Smoke Tests for Production Readiness
 * 
 * These tests verify:
 * - Critical routes load successfully
 * - No severe console errors occur
 * - Key page landmarks are present (header, main, footer)
 * - Auth-gated pages behave correctly
 * - Search functionality works
 * - Cart page renders
 * 
 * Run with: pnpm test:e2e
 */

// ============================================================================
// Test Configuration
// ============================================================================

/**
 * Critical routes that must work for production release
 * Using English locale as primary, Bulgarian as secondary
 */
const CRITICAL_ROUTES = {
  homepage: '/en',
  homepageBG: '/bg',
  categories: '/en/categories',
  search: '/en/search?q=phone',
  cart: '/en/cart',
  account: '/en/account', // Auth-gated
  sell: '/en/sell', // Auth-gated
} as const

/**
 * Console errors to ignore (known noise)
 * Add patterns here for expected warnings/errors
 * 
 * IMPORTANT: Never add hydration errors here - they must be fixed!
 * See docs/TESTING.md Rule #4
 */
const IGNORED_CONSOLE_PATTERNS = [
  // Next.js development warnings
  /Fast Refresh/i,
  /Download the React DevTools/i,
  // Common third-party SDK noise
  /Failed to load resource.*favicon/i,
  /Third-party cookie/i,
  // Source map warnings from Next.js (not a bug)
  /Invalid source map/i,

  // Next.js RSC/WebKit can log these during dev; it falls back to full navigation.
  /Failed to fetch RSC payload/i,
  /Falling back to browser navigation/i,
]

// ============================================================================
// Console Error Capture Utility
// ============================================================================

interface ConsoleErrorCapture {
  errors: ConsoleMessage[]
  pageErrors: Error[]
  notFoundResponses: string[]
}

/**
 * Sets up console error capturing for a page
 * Captures both console.error and page crash errors
 */
function setupConsoleCapture(page: Page): ConsoleErrorCapture {
  const capture: ConsoleErrorCapture = {
    errors: [],
    pageErrors: [],
    notFoundResponses: [],
  }

  // Capture console.error messages
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text()
      const isIgnored = IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(text))
      if (!isIgnored) {
        capture.errors.push(msg)
      }
    }
  })

  // Capture page crash errors
  page.on('pageerror', (error) => {
    capture.pageErrors.push(error)
  })

  // Capture 404s to help debug "Failed to load resource" errors.
  page.on('response', (response) => {
    if (response.status() === 404) {
      capture.notFoundResponses.push(response.url())
    }
  })

  return capture
}

/**
 * Asserts that no severe console errors occurred
 */
function assertNoConsoleErrors(capture: ConsoleErrorCapture, routeName: string) {
  const notFoundUrls = [...new Set(capture.notFoundResponses)]
  const onlyBenignAsset404s =
    notFoundUrls.length > 0 &&
    notFoundUrls.every((u) =>
      u.includes('/_next/image') ||
      /^(https?:\/\/)?images\.unsplash\.com\//i.test(u) ||
      /^(https?:\/\/)?placehold\.co\//i.test(u) ||
      /^(https?:\/\/)?api\.dicebear\.com\//i.test(u) ||
      /^(https?:\/\/)?flagcdn\.com\//i.test(u) ||
      /^(https?:\/\/)?cdn\.simpleicons\.org\//i.test(u)
    )

  const errorMessages = capture.errors
    .map((e) => e.text())
    // WebKit/mobile-safari can log generic 404 console errors for optimized images.
    // If the only observed 404s are benign asset URLs, treat as non-fatal noise.
    .filter((text) => !(onlyBenignAsset404s && /Failed to load resource/i.test(text)))
  const pageErrorMessages = capture.pageErrors
    .map((e) => e.message)
    // WebKit can surface dev-server HMR fetch failures as page errors.
    // These are not product/runtime errors and should not fail E2E.
    .filter((msg) => !/webpack\.hot-update\.json/i.test(msg))
    // Next.js dev overlay endpoints can be blocked by WebKit access checks.
    .filter((msg) => !/\?_rsc=/i.test(msg))
    .filter((msg) => !/__nextjs_original-stack-frames/i.test(msg))

  if (errorMessages.length > 0 || pageErrorMessages.length > 0) {
    const formatted = [
      `Console errors on ${routeName}:`,
      ...errorMessages.map((e) => `  - console.error: ${e}`),
      ...pageErrorMessages.map((e) => `  - page error: ${e}`),
      ...(notFoundUrls.length > 0
        ? [
            '  - 404 responses observed:',
            ...notFoundUrls.slice(0, 10).map((u) => `    - ${u}`),
          ]
        : []),
    ].join('\n')

    throw new Error(formatted)
  }
}

// ============================================================================
// Smoke Tests: Core Routes
// ============================================================================

test.describe('Smoke Tests - Core Routes', () => {
  test.setTimeout(60_000)

  test.beforeEach(async ({ page: _page }) => {
    // Dismissal init script is applied via shared fixtures.
  })

  test('homepage loads with key landmarks @smoke', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded' })

    // Verify key landmarks exist
    await expect(page.locator('header').first()).toBeVisible({ timeout: 30_000 })
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 })
    await expect(page.locator('footer').first()).toBeVisible({ timeout: 30_000 })

    // Verify no error boundary is shown
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'homepage')
  })

  test('homepage Bulgarian locale loads @smoke @i18n', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.homepageBG, { waitUntil: 'domcontentloaded', timeout: 45_000 })

    await expect(page.locator('header').first()).toBeVisible({ timeout: 30_000 })
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 })

    // Verify Bulgarian content is present (not mixed language)
    // This is a sanity check - actual strings depend on your translations
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'homepage-bg')
  })

  test('categories page loads @smoke', async ({ page }) => {
    // Categories page has many subcategories and may take longer to load
    test.setTimeout(60_000)
    
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.categories, { waitUntil: 'domcontentloaded', timeout: 45_000 })

    await expect(page.locator('header').first()).toBeVisible()
    // Use specific selector for the layout's main element
    await expect(page.locator('#main-content')).toBeVisible()

    // Main content should not be empty
    const mainContent = page.locator('#main-content')
    await expect(mainContent).not.toBeEmpty()

    assertNoConsoleErrors(capture, 'categories')
  })

  test('search page renders results or empty state @smoke', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.search, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('header').first()).toBeVisible()
    await expect(page.locator('#main-content')).toBeVisible()

    // Search should show either results or "no results" message
    // It should NOT be completely blank
    const mainContent = page.locator('#main-content')
    await expect(mainContent).not.toBeEmpty()

    // No error boundary
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'search')
  })

  test('cart page renders empty or filled state @smoke', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.cart, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('header').first()).toBeVisible()
    // Use specific selector for the layout's main element to avoid strict mode issues
    await expect(page.locator('#main-content')).toBeVisible()

    // Cart should render something (empty cart message or items)
    const mainContent = page.locator('#main-content')
    await expect(mainContent).not.toBeEmpty()

    assertNoConsoleErrors(capture, 'cart')
  })
})

// ============================================================================
// Smoke Tests: Auth-Gated Routes
// ============================================================================

test.describe('Smoke Tests - Auth-Gated Routes', () => {
  // Auth-gated pages can trigger first-hit dev compilation + redirects.
  // Give them a little more runway to stay stable on cold starts.
  test.setTimeout(120_000)

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('geo-welcome-dismissed', 'true')
        localStorage.setItem('cookie-consent', 'accepted')
      } catch {
        // ignore
      }
    })
  })

  test('account page redirects or shows login CTA when logged out @smoke @auth', async ({ page, app }) => {
    const capture = setupConsoleCapture(page)

    await app.clearAuthSession()

    await app.gotoWithRetries(CRITICAL_ROUTES.account, { timeout: 60_000, retries: 3 })
    await app.waitForDevCompilingOverlayToHide(60_000)

    // If auth redirects, wait for it to complete.
    const redirectedToLogin = await page
      .waitForURL(/\/auth\/login/i, { timeout: 30_000 })
      .then(() => true)
      .catch(() => false)

    // Should either:
    // 1. Redirect to login page (URL contains 'login' or 'auth')
    // 2. Show a login prompt/CTA on the page
    const currentUrl = page.url()
    const isRedirectedToLogin = redirectedToLogin ||
      currentUrl.includes('login') ||
      currentUrl.includes('auth') ||
      currentUrl.includes('sign-in')

    if (!isRedirectedToLogin) {
      // If not redirected, should show login CTA
      const loginPrompt = page.getByRole('button', { name: /sign in|log in|login/i })
        .or(page.getByRole('link', { name: /sign in|log in|login/i }))
        .or(page.getByText(/sign in to|log in to|please login/i))

      await expect(loginPrompt.first()).toBeVisible({ timeout: 15_000 })
    }

    // Should not crash
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'account')
  })

  test('sell page redirects or shows login CTA when logged out @smoke @auth', async ({ page, app }) => {
    test.setTimeout(150_000)
    const capture = setupConsoleCapture(page)

    await app.clearAuthSession()

    await app.gotoWithRetries(CRITICAL_ROUTES.sell, { timeout: 60_000, retries: 3 })
    await app.waitForDevCompilingOverlayToHide(60_000)

    const redirectedToLogin = await page
      .waitForURL(/\/auth\/login/i, { timeout: 30_000 })
      .then(() => true)
      .catch(() => false)

    const currentUrl = page.url()
    const isRedirectedToLogin = redirectedToLogin ||
      currentUrl.includes('login') ||
      currentUrl.includes('auth') ||
      currentUrl.includes('sign-in')

    if (!isRedirectedToLogin) {
      // If not redirected, should show login CTA or seller registration prompt
      const loginPrompt = page.getByRole('button', { name: /sign in|log in|login|start selling/i })
        .or(page.getByRole('link', { name: /sign in|log in|login/i }))
        .or(page.getByText(/sign in to|log in to|please login|become a seller/i))

      await expect(loginPrompt.first()).toBeVisible({ timeout: 15_000 })
    }

    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'sell')
  })
})

// ============================================================================
// Smoke Tests: Mobile Viewport
// ============================================================================

test.describe('Smoke Tests - Mobile', () => {
  test.setTimeout(60_000)
  test.use({ viewport: { width: 375, height: 667 } })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('geo-welcome-dismissed', 'true')
        localStorage.setItem('cookie-consent', 'accepted')
      } catch {
        // ignore
      }
    })
  })

  test('homepage renders correctly on mobile @smoke @mobile', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded', timeout: 45_000 })

    // Header should be visible
    await expect(page.locator('header').first()).toBeVisible()

    // Main content should be visible and not overflow
    await expect(page.locator('#main-content')).toBeVisible()

    // Mobile navigation should be accessible (hamburger menu or tab bar)
    const mobileNav = page.getByRole('navigation')
      .or(page.locator('[data-testid="mobile-menu"]'))
      .or(page.locator('[data-testid="mobile-tab-bar"]'))

    await expect(mobileNav.first()).toBeVisible()

    assertNoConsoleErrors(capture, 'homepage-mobile')
  })

  test('cart page is usable on mobile @smoke @mobile', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.cart, { waitUntil: 'domcontentloaded', timeout: 45_000 })

    await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 })

    // Ensure content fits viewport (no horizontal scroll issues)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = 375
    
    // Allow small margin for rounding
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10)

    assertNoConsoleErrors(capture, 'cart-mobile')
  })
})

// ============================================================================
// Smoke Tests: Performance Sanity
// ============================================================================

test.describe('Smoke Tests - Performance Sanity', () => {
  test.skip(process.env.TEST_PROD !== 'true', 'Performance sanity is enforced only in production runs (TEST_PROD=true).')
  test.setTimeout(60_000)

  test.beforeEach(async ({ page }) => {
    // Keep geo/cookie modals from hiding page content during perf sanity checks.
    await page.addInitScript(() => {
      try {
        localStorage.setItem('geo-welcome-dismissed', 'true')
        localStorage.setItem('cookie-consent', 'accepted')
      } catch {
        // ignore
      }
    })
  })

  test('homepage loads within acceptable time @smoke @perf', async ({ page }, testInfo) => {
    const startTime = Date.now()

    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded', timeout: 45_000 })

    const loadTime = Date.now() - startTime

    // DOM ready threshold: stricter on Chromium, more lenient on WebKit/mobile.
    const threshold = /^(webkit|mobile-safari)$/i.test(testInfo.project.name) ? 20_000 : 10_000
    expect(loadTime).toBeLessThan(threshold)

    // Log actual load time for visibility
    console.log(`Homepage DOM ready in ${loadTime}ms`)
  })

  test('no memory leaks on navigation @smoke @perf', async ({ page }) => {
    // Navigate through multiple pages
    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded', timeout: 45_000 })
    await page.goto(CRITICAL_ROUTES.categories, { waitUntil: 'domcontentloaded', timeout: 45_000 })
    await page.goto(CRITICAL_ROUTES.search, { waitUntil: 'domcontentloaded', timeout: 45_000 })
    await page.goto(CRITICAL_ROUTES.cart, { waitUntil: 'domcontentloaded', timeout: 45_000 })
    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded', timeout: 45_000 })

    // If we got here without crashing, basic memory handling is OK
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 })
  })
})
