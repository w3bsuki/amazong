import fs from 'node:fs'
import path from 'node:path'
import type { ConsoleMessage, Page, TestInfo } from '@playwright/test'
import {
  test,
  expect,
  setupConsoleCapture,
  assertNoConsoleErrors,
} from './fixtures/base'

type LaunchBucket = 'p0' | 'p1' | 'p2'
type RouteExpectation =
  | 'public-ok'
  | 'redirect-login'
  | 'sell-guest-safe'
  | 'pdp-or-not-found'

type ManifestRoute = {
  id: string
  title: string
  path: string
  expectation: RouteExpectation
}

type LaunchManifest = {
  version: number
  updatedAt: string
  buckets: Record<LaunchBucket, ManifestRoute[]>
}

const MANIFEST_PATH = path.join(process.cwd(), 'docs', 'launch', 'route-manifest.json')
const ARTIFACT_ROOT = process.env.PW_OUTPUT_ROOT || 'output/playwright'
const BUCKETS: LaunchBucket[] = ['p0', 'p1', 'p2']

const manifest = loadManifest(MANIFEST_PATH)

function isRouteExpectation(value: unknown): value is RouteExpectation {
  return (
    value === 'public-ok' ||
    value === 'redirect-login' ||
    value === 'sell-guest-safe' ||
    value === 'pdp-or-not-found'
  )
}

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Expected an object value in launch route manifest')
  }

  return value as Record<string, unknown>
}

function parseBucket(bucket: LaunchBucket, value: unknown): ManifestRoute[] {
  if (!Array.isArray(value)) {
    throw new Error(`Manifest bucket ${bucket} must be an array`)
  }

  return value.map((entry, index) => {
    const route = asObject(entry)
    const idValue = route.id
    const titleValue = route.title
    const pathValue = route.path
    const expectationValue = route.expectation

    if (typeof idValue !== 'string' || idValue.length === 0) {
      throw new Error(`Manifest bucket ${bucket} route #${index + 1} has invalid id`)
    }

    if (typeof titleValue !== 'string' || titleValue.length === 0) {
      throw new Error(`Manifest bucket ${bucket} route #${index + 1} has invalid title`)
    }

    if (typeof pathValue !== 'string' || !pathValue.startsWith('/')) {
      throw new Error(`Manifest bucket ${bucket} route #${index + 1} has invalid path`)
    }

    if (!isRouteExpectation(expectationValue)) {
      throw new Error(`Manifest bucket ${bucket} route #${index + 1} has invalid expectation`)
    }

    return {
      id: idValue,
      title: titleValue,
      path: pathValue,
      expectation: expectationValue,
    }
  })
}

function loadManifest(manifestPath: string): LaunchManifest {
  const raw = fs.readFileSync(manifestPath, 'utf8')
  const parsed = asObject(JSON.parse(raw) as unknown)
  const buckets = asObject(parsed.buckets)

  return {
    version:
      typeof parsed.version === 'number' && Number.isFinite(parsed.version)
        ? parsed.version
        : 1,
    updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    buckets: {
      p0: parseBucket('p0', buckets.p0),
      p1: parseBucket('p1', buckets.p1),
      p2: parseBucket('p2', buckets.p2),
    },
  }
}

function routeSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '')
  return slug.length > 0 ? slug : 'route'
}

function isLoginUrl(url: string): boolean {
  return /\/auth\/login(?:\?|$)/.test(url)
}

function isAuthPublicRoute(routePath: string): boolean {
  return /\/auth\/(login|sign-up|forgot-password|reset-password)(?:\/|$)/.test(routePath)
}

function decodeProtectedNext(pathname: string): string {
  const pathOnly = pathname.split('?')[0] || pathname
  const withoutLocale = pathOnly.replace(/^\/(en|bg)\b/, '')
  return withoutLocale.length > 0 ? withoutLocale : '/'
}

async function waitForRouteReady(page: Page) {
  await page.waitForLoadState('domcontentloaded')

  await page
    .locator('button[aria-label="Open Next.js Dev Tools"] >> text=/Compiling/i')
    .waitFor({ state: 'hidden', timeout: 60_000 })
    .catch(() => {
      // Overlay may not exist.
    })
}

async function maybeNotFound(page: Page): Promise<boolean> {
  const notFoundSignals = [
    page.getByText(/not found/i).first(),
    page.getByText(/404/).first(),
    page.locator('h1').filter({ hasText: /not found/i }).first(),
  ]

  for (const signal of notFoundSignals) {
    const visible = await signal.isVisible({ timeout: 2_000 }).catch(() => false)
    if (visible) return true
  }

  return false
}

async function assertNoHorizontalOverflow(page: Page, routePath: string) {
  const overflowPx = await page.evaluate(() => {
    const body = document.body
    const doc = document.documentElement
    const maxScrollWidth = Math.max(
      body?.scrollWidth ?? 0,
      body?.offsetWidth ?? 0,
      doc.scrollWidth,
      doc.offsetWidth
    )
    return maxScrollWidth - window.innerWidth
  })

  expect(overflowPx, `Horizontal overflow detected for ${routePath}`).toBeLessThanOrEqual(1)
}

function assertProtectedRedirect(currentUrl: string, routePath: string) {
  expect(isLoginUrl(currentUrl)).toBeTruthy()

  const url = new URL(currentUrl)
  const nextParam = url.searchParams.get('next')
  if (!nextParam) return

  const decodedNext = decodeURIComponent(nextParam)
  const routePathWithoutQuery = routePath.split('?')[0] || routePath
  const routePathWithoutLocale = decodeProtectedNext(routePathWithoutQuery)

  const hasLocalizedNext = decodedNext.includes(routePathWithoutQuery)
  const hasUnlocalizedNext = decodedNext.includes(routePathWithoutLocale)

  expect(hasLocalizedNext || hasUnlocalizedNext).toBeTruthy()
}

function attachConsoleRecorder(page: Page): {
  lines: string[]
  detach: () => void
} {
  const lines: string[] = []

  const consoleHandler = (message: ConsoleMessage) => {
    const location = message.location()
    const locationText =
      location.url && typeof location.lineNumber === 'number'
        ? ` (${location.url}:${location.lineNumber}:${location.columnNumber ?? 0})`
        : ''
    lines.push(`[console.${message.type()}] ${message.text()}${locationText}`)
  }

  const pageErrorHandler = (error: Error) => {
    lines.push(`[pageerror] ${error.message}`)
  }

  page.on('console', consoleHandler)
  page.on('pageerror', pageErrorHandler)

  return {
    lines,
    detach: () => {
      page.off('console', consoleHandler)
      page.off('pageerror', pageErrorHandler)
    },
  }
}

async function writeArtifacts(
  page: Page,
  testInfo: TestInfo,
  bucket: LaunchBucket,
  route: ManifestRoute,
  responseStatus: number | null,
  consoleLines: string[]
) {
  const routeId = routeSlug(route.id)
  const bucketDir = path.join(process.cwd(), ARTIFACT_ROOT, testInfo.project.name, bucket)

  fs.mkdirSync(bucketDir, { recursive: true })

  const screenshotPath = path.join(bucketDir, `${routeId}.png`)
  const consolePath = path.join(bucketDir, `${routeId}.console.log`)

  const header = [
    `project=${testInfo.project.name}`,
    `bucket=${bucket}`,
    `route_id=${route.id}`,
    `route_path=${route.path}`,
    `expectation=${route.expectation}`,
    `manifest_version=${manifest.version}`,
    `manifest_updated_at=${manifest.updatedAt}`,
    `response_status=${responseStatus ?? 'none'}`,
    `final_url=${page.url()}`,
    '',
  ]

  fs.writeFileSync(consolePath, [...header, ...consoleLines].join('\n'), 'utf8')

  await page.screenshot({ path: screenshotPath, fullPage: true })
}

for (const bucket of BUCKETS) {
  const routes = manifest.buckets[bucket]
  const tag = `@launch-${bucket}`

  test.describe(`Launch route audit ${tag}`, () => {
    for (const route of routes) {
      test(`${route.title} (${route.path}) ${tag}`, async ({ page, app }, testInfo) => {
        await app.clearAuthSession()

        const recorder = attachConsoleRecorder(page)
        const strictCapture = setupConsoleCapture(page)
        let responseStatus: number | null = null

        try {
          const response = await app.goto(route.path, { timeout: 60_000, retries: 2 })
          responseStatus = response?.status() ?? null
          await waitForRouteReady(page)

          switch (route.expectation) {
            case 'public-ok': {
              if (!isAuthPublicRoute(route.path)) {
                expect(isLoginUrl(page.url())).toBeFalsy()
              }
              if (responseStatus != null) expect(responseStatus).toBeLessThan(500)
              break
            }

            case 'redirect-login': {
              assertProtectedRedirect(page.url(), route.path)
              break
            }

            case 'sell-guest-safe': {
              if (isLoginUrl(page.url())) {
                assertProtectedRedirect(page.url(), route.path)
                break
              }

              expect(new URL(page.url()).pathname).toContain('/sell')
              const signInAction = page
                .getByRole('link', { name: /sign in|log in|влез|вход/i })
                .or(page.getByRole('button', { name: /sign in|log in|влез|вход/i }))
                .first()
              await expect(signInAction).toBeVisible({ timeout: 15_000 })
              break
            }

            case 'pdp-or-not-found': {
              expect(isLoginUrl(page.url())).toBeFalsy()
              if (responseStatus != null) expect(responseStatus).toBeLessThan(500)

              const hasNotFoundState = await maybeNotFound(page)
              if (hasNotFoundState) break

              const main = page.locator('main, #main-content, [role="main"]').first()
              const isMainVisible = await main.isVisible({ timeout: 15_000 }).catch(() => false)
              expect(isMainVisible).toBeTruthy()
              break
            }
          }

          await assertNoHorizontalOverflow(page, route.path)
          assertNoConsoleErrors(strictCapture, route.path)
        } finally {
          recorder.detach()
          await writeArtifacts(page, testInfo, bucket, route, responseStatus, recorder.lines)
        }
      })
    }
  })
}
