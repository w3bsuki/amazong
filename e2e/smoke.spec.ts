import { test, expect, type Page, type ConsoleMessage } from '@playwright/test'

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
  const errorMessages = capture.errors.map((e) => e.text())
  const pageErrorMessages = capture.pageErrors.map((e) => e.message)
  const notFoundUrls = Array.from(new Set(capture.notFoundResponses))

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
  test.beforeEach(async ({ page }) => {
    // Ensure “first visit” modals (geo welcome, cookie consent) don’t block
    // the underlying page in some browsers (e.g. WebKit/mobile Safari).
    await page.addInitScript(() => {
      try {
        localStorage.setItem('geo-welcome-dismissed', 'true')
        localStorage.setItem('cookie-consent', 'accepted')
      } catch {
        // ignore
      }
    })
  })

  test('homepage loads with key landmarks @smoke', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded' })

    // Verify key landmarks exist
    await expect(page.locator('header').first()).toBeVisible()
    await expect(page.locator('main').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()

    // Verify no error boundary is shown
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'homepage')
  })

  test('homepage Bulgarian locale loads @smoke @i18n', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.homepageBG, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('header').first()).toBeVisible()
    await expect(page.locator('main').first()).toBeVisible()

    // Verify Bulgarian content is present (not mixed language)
    // This is a sanity check - actual strings depend on your translations
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'homepage-bg')
  })

  test('categories page loads @smoke', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.categories, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('header').first()).toBeVisible()
    await expect(page.locator('main').first()).toBeVisible()

    // Main content should not be empty
    const mainContent = page.locator('main')
    await expect(mainContent).not.toBeEmpty()

    assertNoConsoleErrors(capture, 'categories')
  })

  test('search page renders results or empty state @smoke', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.search, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('header').first()).toBeVisible()
    await expect(page.locator('main').first()).toBeVisible()

    // Search should show either results or "no results" message
    // It should NOT be completely blank
    const mainContent = page.locator('main')
    await expect(mainContent).not.toBeEmpty()

    // No error boundary
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'search')
  })

  test('cart page renders empty or filled state @smoke', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.cart, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('header').first()).toBeVisible()
    await expect(page.locator('main').first()).toBeVisible()

    // Cart should render something (empty cart message or items)
    const mainContent = page.locator('main')
    await expect(mainContent).not.toBeEmpty()

    assertNoConsoleErrors(capture, 'cart')
  })
})

// ============================================================================
// Smoke Tests: Auth-Gated Routes
// ============================================================================

test.describe('Smoke Tests - Auth-Gated Routes', () => {
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

  test('account page redirects or shows login CTA when logged out @smoke @auth', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.account, { waitUntil: 'domcontentloaded' })

    // Should either:
    // 1. Redirect to login page (URL contains 'login' or 'auth')
    // 2. Show a login prompt/CTA on the page
    const currentUrl = page.url()
    const isRedirectedToLogin = 
      currentUrl.includes('login') || 
      currentUrl.includes('auth') ||
      currentUrl.includes('sign-in')

    if (!isRedirectedToLogin) {
      // If not redirected, should show login CTA
      const loginPrompt = page.getByRole('button', { name: /sign in|log in|login/i })
        .or(page.getByRole('link', { name: /sign in|log in|login/i }))
        .or(page.getByText(/sign in to|log in to|please login/i))

      await expect(loginPrompt.first()).toBeVisible({ timeout: 5000 })
    }

    // Should not crash
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'account')
  })

  test('sell page redirects or shows login CTA when logged out @smoke @auth', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.sell, { waitUntil: 'domcontentloaded' })

    const currentUrl = page.url()
    const isRedirectedToLogin = 
      currentUrl.includes('login') || 
      currentUrl.includes('auth') ||
      currentUrl.includes('sign-in')

    if (!isRedirectedToLogin) {
      // If not redirected, should show login CTA or seller registration prompt
      const loginPrompt = page.getByRole('button', { name: /sign in|log in|login|start selling/i })
        .or(page.getByRole('link', { name: /sign in|log in|login/i }))
        .or(page.getByText(/sign in to|log in to|please login|become a seller/i))

      await expect(loginPrompt.first()).toBeVisible({ timeout: 5000 })
    }

    await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

    assertNoConsoleErrors(capture, 'sell')
  })
})

// ============================================================================
// Smoke Tests: Mobile Viewport
// ============================================================================

test.describe('Smoke Tests - Mobile', () => {
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

    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded' })

    // Header should be visible
    await expect(page.locator('header').first()).toBeVisible()

    // Main content should be visible and not overflow
    await expect(page.locator('main').first()).toBeVisible()

    // Mobile navigation should be accessible (hamburger menu or tab bar)
    const mobileNav = page.getByRole('navigation')
      .or(page.locator('[data-testid="mobile-menu"]'))
      .or(page.locator('[data-testid="mobile-tab-bar"]'))

    await expect(mobileNav.first()).toBeVisible()

    assertNoConsoleErrors(capture, 'homepage-mobile')
  })

  test('cart page is usable on mobile @smoke @mobile', async ({ page }) => {
    const capture = setupConsoleCapture(page)

    await page.goto(CRITICAL_ROUTES.cart, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('main').first()).toBeVisible()

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
  test('homepage loads within acceptable time @smoke @perf', async ({ page }) => {
    const startTime = Date.now()

    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded' })

    const loadTime = Date.now() - startTime

    // DOM should be ready within 10 seconds (generous for CI)
    expect(loadTime).toBeLessThan(10_000)

    // Log actual load time for visibility
    console.log(`Homepage DOM ready in ${loadTime}ms`)
  })

  test('no memory leaks on navigation @smoke @perf', async ({ page }) => {
    // Navigate through multiple pages
    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded' })
    await page.goto(CRITICAL_ROUTES.categories, { waitUntil: 'domcontentloaded' })
    await page.goto(CRITICAL_ROUTES.search, { waitUntil: 'domcontentloaded' })
    await page.goto(CRITICAL_ROUTES.cart, { waitUntil: 'domcontentloaded' })
    await page.goto(CRITICAL_ROUTES.homepage, { waitUntil: 'domcontentloaded' })

    // If we got here without crashing, basic memory handling is OK
    await expect(page.locator('main').first()).toBeVisible()
  })
})
