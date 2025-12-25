import { test as base, expect, type ConsoleMessage, type Locator, type Page, type Response } from '@playwright/test'

type GotoWithRetriesOptions = Parameters<Page['goto']>[1] & { retries?: number }

type AppFixture = {
  app: {
    clearAuthSession: () => Promise<void>
    gotoWithRetries: (url: string, options?: GotoWithRetriesOptions) => Promise<Response | null>
    waitForDevCompilingOverlayToHide: (timeoutMs?: number) => Promise<void>
  }
}

export function setupPage(page: Page) {
  return page.addInitScript(() => {
    try {
      localStorage.setItem('geo-welcome-dismissed', 'true')
      localStorage.setItem('cookie-consent', 'accepted')
    } catch {
      // ignore
    }
  })
}

export async function gotoWithRetries(page: Page, url: string, options: GotoWithRetriesOptions = {}) {
  const { retries = 2, ...gotoOptions } = options
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        ...gotoOptions,
      })

      // In dev mode, Next can intermittently throw during compilation and return 500.
      // Retry a couple times to avoid flaky navigation-only assertions.
      if (!response || response.ok()) return response

      lastError = new Error(`Navigation to ${url} returned ${response.status()}`)
    } catch (error) {
      lastError = error
    }

    await page.waitForTimeout(750 * (attempt + 1))
  }

  throw lastError
}

export async function clearAuthSession(page: Page) {
  // Supabase SSR sessions are primarily persisted via cookies.
  // Clear cookies so server-protected routes behave as logged-out.
  await page.context().clearCookies()

  // Clear any client-side session remnants on next navigation.
  await page.addInitScript(() => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-')) localStorage.removeItem(key)
      })

      try {
        sessionStorage.clear()
      } catch {
        // ignore
      }
    } catch {
      // ignore
    }
  })
}

export async function waitForDevCompilingOverlayToHide(page: Page, timeoutMs = 60_000) {
  // In Next.js dev mode, a temporary "Compiling" overlay can block interactions.
  // Best-effort: the selector can vary by Next version.
  await page
    .locator('button[aria-label="Open Next.js Dev Tools"] >> text=/Compiling/i')
    .waitFor({ state: 'hidden', timeout: timeoutMs })
    .catch(() => {
      // ignore
    })
}

export const test = base.extend<AppFixture>({
  page: async ({ page }, runFixture) => {
    await setupPage(page)
    await runFixture(page)
  },

  app: async ({ page }, runFixture) => {
    await runFixture({
      clearAuthSession: () => clearAuthSession(page),
      gotoWithRetries: (url, options) => gotoWithRetries(page, url, options),
      waitForDevCompilingOverlayToHide: (timeoutMs) => waitForDevCompilingOverlayToHide(page, timeoutMs),
    })
  },
})

export { expect }
export type { ConsoleMessage, Locator, Page }
