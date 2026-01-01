import type { Page } from './test'
import { expect } from '@playwright/test'

export type TestUserCredentials = {
  email: string
  password: string
}

function env(name: string) {
  const value = process.env[name]
  return value && value.trim().length > 0 ? value.trim() : undefined
}

export function getTestUserCredentials(): TestUserCredentials | null {
  const email = env('TEST_USER_EMAIL') ?? env('E2E_USER_EMAIL')
  const password = env('TEST_USER_PASSWORD') ?? env('E2E_USER_PASSWORD')

  if (!email || !password) return null
  return { email, password }
}

const baseURL = process.env.BASE_URL || 'http://localhost:3000'

export async function loginWithPassword(page: Page, creds: TestUserCredentials) {
  console.log(`[E2E Auth] Starting login for ${creds.email}`)
  await page.goto(`${baseURL}/en/auth/login`, { waitUntil: 'domcontentloaded' })

  // Wait for form to be fully loaded and hydrated
  await page.waitForSelector('form', { state: 'visible' })
  // In dev mode, Next can briefly render a compiling overlay that blocks input.
  await page
    .locator('button[aria-label="Open Next.js Dev Tools"] >> text=/Compiling/i')
    .waitFor({ state: 'hidden', timeout: 60_000 })
    .catch(() => {
      // ignore
    })
  await page.waitForTimeout(500)

  const emailInput = page.locator('#email')
  const passwordInput = page.locator('#password')

  // These are controlled React inputs; typing is more reliable than fill if
  // hydration is still completing.
  await emailInput.click()
  await emailInput.fill('')
  await emailInput.type(creds.email, { delay: 10 })
  await passwordInput.click()
  await passwordInput.fill('')
  await passwordInput.type(creds.password, { delay: 10 })

  const submitButton = page.getByRole('button', { name: /sign in/i })

  try {
    await expect(submitButton).toBeEnabled({ timeout: 60_000 })
  } catch {
    const isDisabled = await submitButton.isDisabled()
    console.log(`[E2E Auth] Submit button disabled: ${isDisabled}`)
    await page.screenshot({ path: 'test-results/login-debug.png' })
    console.log('[E2E Auth] Screenshot saved to test-results/login-debug.png')
    throw new Error('Login form never became submittable')
  }

  await submitButton.click()

  try {
    await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 60_000 })
    console.log(`[E2E Auth] Login successful, redirected to ${page.url()}`)
  } catch {
    const errorEl = page.locator('.text-destructive')
    if (await errorEl.count() > 0) {
      const errorText = await errorEl.first().textContent()
      console.log(`[E2E Auth] Login error: ${errorText}`)
    }
    throw new Error(`Login failed - page still at ${page.url()}`)
  }
}
