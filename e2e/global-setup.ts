import { chromium, type FullConfig, type Page } from '@playwright/test'
import { setTimeout as delay } from 'node:timers/promises'

type WarmupOptions = {
  attempts?: number
  timeoutMs?: number
}

async function warmUrl(page: Page, url: string, { attempts = 6, timeoutMs = 30_000 }: WarmupOptions = {}) {
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs })
      const status = response?.status() ?? 0

      // Treat 2xx/3xx as "up". In dev, locale routes may redirect.
      if (status >= 200 && status < 400) return

      // 4xx should not usually happen during warmup, but don’t retry forever.
      // 5xx can happen mid-compilation; retry a couple times.
      if (status >= 500 || status === 0) {
        lastError = new Error(`Warmup ${url} failed with ${status || 'no response'}`)
      } else {
        throw new Error(`Warmup ${url} failed with ${status}`)
      }
    } catch (error) {
      lastError = error
    }

    await delay(1000 * attempt)
  }

  throw lastError ?? new Error(`Warmup ${url} failed`)
}

export default async function globalSetup(config: FullConfig) {
  const baseURLFromConfig = config.projects?.[0]?.use?.baseURL
  const baseURL = (baseURLFromConfig as string | undefined) || process.env.BASE_URL || 'http://localhost:3000'

  // Minimal warm routes: compile the pages that many tests hit first.
  const warmPaths = [
    '/en',
    '/en/auth/login',
    '/en/auth/sign-up',
    '/en/auth/forgot-password',
    '/en/search?q=warmup',
    '/en/cart',
    '/en/categories',
    '/en/account',
    '/en/plans',
    '/en/sell',
    '/en/chat',
  ]

  const urls = warmPaths.map((p) => new URL(p, baseURL).toString())

   
  console.log(`[e2e] Warming Next.js routes (${urls.length}) via ${baseURL}`)

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Warm sequentially to avoid overloading the dev compiler.
    for (const url of urls) {
       
      console.log(`[e2e] warm: ${url}`)
      await warmUrl(page, url, { attempts: 8, timeoutMs: 120_000 })
    }
  } finally {
    await browser.close()
  }
}
