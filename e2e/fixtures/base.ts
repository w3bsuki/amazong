import {
  test as base,
  expect,
  type ConsoleMessage,
  type Locator,
  type Page,
  type Response,
} from '@playwright/test'

// ============================================================================
// Types
// ============================================================================

type GotoWithRetriesOptions = Parameters<Page['goto']>[1] & { retries?: number }

export type ConsoleCapture = {
  errors: ConsoleMessage[]
  pageErrors: Error[]
  notFoundResponses: string[]
}

type StrictFixtures = {
  /** Strict page with console error capture enabled by default */
  strictPage: Page

  /** Console capture for the current page */
  consoleCapture: ConsoleCapture

  /** App utilities for common operations */
  app: {
    goto: (url: string, options?: GotoWithRetriesOptions) => Promise<Response | null>
    clearAuthSession: () => Promise<void>
    waitForHydration: () => Promise<void>
    assertNoConsoleErrors: () => void
  }
}

// ============================================================================
// Console Error Configuration
// ============================================================================

/**
 * STRICT: Only ignore patterns that are genuinely not bugs.
 * If you're tempted to add something here, FIX THE BUG INSTEAD.
 */
const IGNORED_CONSOLE_PATTERNS = [
  // Next.js dev server noise (not bugs)
  /Fast Refresh/i,
  /Download the React DevTools/i,
  // Browser/extension noise (not our code)
  /Third-party cookie/i,
  // Source maps (dev tooling)
  /Invalid source map/i,
  // Next.js RSC fallback (expected behavior)
  /Failed to fetch RSC payload/i,
  /Falling back to browser navigation/i,
] as const

// ============================================================================
// Utilities
// ============================================================================

export function setupPage(page: Page): Promise<void> {
  return page.addInitScript(() => {
    try {
      localStorage.setItem('geo-welcome-dismissed', 'true')
      localStorage.setItem('cookie-consent', 'accepted')
    } catch {
      // Storage may be unavailable in some contexts
    }
  })
}

export async function clearAuthSession(page: Page): Promise<void> {
  await page.context().clearCookies()

  await page.addInitScript(() => {
    try {
      // Clear Supabase auth tokens
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-')) localStorage.removeItem(key)
      })
      sessionStorage.clear()
    } catch {
      // Ignore storage errors
    }
  })
}

export async function gotoWithRetries(
  page: Page,
  url: string,
  options: GotoWithRetriesOptions = {}
): Promise<Response | null> {
  const { retries = 2, ...gotoOptions } = options
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000, // 30s max - if it takes longer, something is broken
        ...gotoOptions,
      })

      // STRICT: 4xx/5xx responses are failures.
      // Note: 3xx redirects are expected for auth-gated routes.
      if (response) {
        const status = response.status()
        if (status >= 400 && status !== 404) {
          throw new Error(`Navigation to ${url} failed with status ${status}`)
        }
      }

      return response
    } catch (error) {
      lastError = error

      // Don't retry on 4xx errors - those are real failures
      if (error instanceof Error && /failed with status 4\d\d/.test(error.message)) {
        throw error
      }
    }

    await page.waitForTimeout(500 * (attempt + 1))
  }

  throw lastError ?? new Error(`Navigation to ${url} failed after ${retries + 1} attempts`)
}

export function setupConsoleCapture(page: Page): ConsoleCapture {
  const capture: ConsoleCapture = {
    errors: [],
    pageErrors: [],
    notFoundResponses: [],
  }

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return

    const text = msg.text()
    const isIgnored = IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(text))

    if (!isIgnored) {
      capture.errors.push(msg)
    }
  })

  page.on('pageerror', (error) => {
    capture.pageErrors.push(error)
  })

  page.on('response', (response) => {
    if (response.status() === 404) {
      capture.notFoundResponses.push(response.url())
    }
  })

  return capture
}

export function assertNoConsoleErrors(capture: ConsoleCapture, context?: string): void {
  const consoleErrors = capture.errors.map((e) => e.text())
  const pageErrors = capture.pageErrors.map((e) => e.message)

  if (consoleErrors.length === 0 && pageErrors.length === 0) return

  const lines = [
    context ? `Console errors detected (${context}):` : 'Console errors detected:',
    '',
    ...consoleErrors.map((e) => `  ❌ console.error: ${e}`),
    ...pageErrors.map((e) => `  💥 page error: ${e}`),
  ]

  // FAIL THE TEST - don't soft-fail
  throw new Error(lines.join('\n'))
}

export async function waitForHydration(page: Page, timeoutMs = 30_000): Promise<void> {
  // Wait for Next.js to finish any dev compilation overlay
  await page
    .locator('button[aria-label="Open Next.js Dev Tools"] >> text=/Compiling/i')
    .waitFor({ state: 'hidden', timeout: timeoutMs })
    .catch(() => {
      // Overlay may not exist
    })

  // Wait for main content to be interactive
  const main = page.locator('main, #main-content, [role="main"]').first()
  await main.waitFor({ state: 'visible', timeout: timeoutMs })

  // Some pages render the SiteHeader as a separate client boundary under Suspense.
  // Interacting with header controls (search, menus) before it hydrates can lead to
  // default form submissions and Radix aria-hidden mutations before hydration.
  await page
    .locator('header[data-hydrated="true"]').first()
    .waitFor({ state: 'visible', timeout: Math.min(timeoutMs, 10_000) })
    .catch(() => {
      // Not all pages use SiteHeader (e.g., auth layouts). Don't fail hydration for those.
    })
}

// ============================================================================
// Extended Test Fixture
// ============================================================================

export const test = base.extend<StrictFixtures>({
  // Auto-setup page with dismissed modals
  page: async ({ page }, use) => {
    await setupPage(page)
    await use(page)
  },

  // Strict page with console capture
  strictPage: async ({ page }, use) => {
    await setupPage(page)
    await use(page)
  },

  // Console capture fixture
  consoleCapture: async ({ page }, use) => {
    const capture = setupConsoleCapture(page)
    await use(capture)
  },

  // App utilities
  app: async ({ page }, use) => {
    const capture = setupConsoleCapture(page)

    await use({
      goto: (url, options) => gotoWithRetries(page, url, options),
      clearAuthSession: () => clearAuthSession(page),
      waitForHydration: () => waitForHydration(page),
      assertNoConsoleErrors: () => assertNoConsoleErrors(capture, page.url()),
    })
  },
})

// ============================================================================
// Custom Assertions
// ============================================================================

/**
 * Assert element is visible with strict timeout
 * FAILS if element is not found - no soft fallbacks
 */
export async function assertVisible(locator: Locator, timeout = 10_000): Promise<void> {
  await expect(locator).toBeVisible({ timeout })
}

/**
 * Assert element is NOT visible
 */
export async function assertNotVisible(locator: Locator, timeout = 5_000): Promise<void> {
  await expect(locator).not.toBeVisible({ timeout })
}

/**
 * Assert page has no error boundary
 */
export async function assertNoErrorBoundary(page: Page): Promise<void> {
  const errorBoundary = page.getByText(/something went wrong/i)
  await expect(errorBoundary).not.toBeVisible({ timeout: 5_000 })
}

/**
 * Assert navigation succeeded and we're at expected URL
 */
export async function assertNavigatedTo(page: Page, urlPattern: RegExp, timeout = 15_000): Promise<void> {
  await page.waitForURL(urlPattern, { timeout })
  expect(page.url()).toMatch(urlPattern)
}

// ============================================================================
// Re-exports
// ============================================================================

export { expect }
export type { ConsoleMessage, Locator, Page }
