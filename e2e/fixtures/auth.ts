import type { Page } from './test'

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

export async function loginWithPassword(page: Page, creds: TestUserCredentials) {
  await page.goto('/en/auth/login', { waitUntil: 'domcontentloaded' })

  const loginForm = page.locator('form').first()
  const emailInput = loginForm.locator('input[type="email"], input#email').first()
  const passwordInput = loginForm.locator('input[type="password"], input#password').first()

  await emailInput.fill(creds.email)
  await passwordInput.fill(creds.password)

  await loginForm.getByRole('button', { name: /sign in/i }).click()

  // Login usually redirects away from /auth/login.
  // Keep it tolerant across locales.
  await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 30_000 })
}
