import { test, expect, type Page, type ConsoleMessage } from './fixtures/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DATE_YYYYMMDD = new Date().toISOString().slice(0, 10).replaceAll('-', '')
const EVIDENCE_DIR =
  process.env.UX_EVIDENCE_DIR || `cleanup/ux-audit-${DATE_YYYYMMDD}-phase2`

type EvidenceRunLog = {
  startedAtIso: string
  baseURL: string | undefined
  evidenceDir: string
  steps: Array<{ url: string; assertions: string[] }>
  evidenceFiles: string[]
  consoleErrors: Array<{ url: string; text: string }>
  pageErrors: Array<{ url: string; message: string }>
  notFoundResponses: string[]
}

const IGNORED_CONSOLE_PATTERNS = [
  /Fast Refresh/i,
  /Download the React DevTools/i,
  /Third-party cookie/i,
  /Invalid source map/i,
  /Failed to fetch RSC payload/i,
  /Falling back to browser navigation/i,
  /webpack\.hot-update\.json/i,
  /__nextjs_original-stack-frames/i,
]

function ensureEvidenceDir() {
  mkdirSync(EVIDENCE_DIR, { recursive: true })
}

async function snap(page: Page, name: string, evidenceFiles: string[]) {
  ensureEvidenceDir()
  const filename = `${name}.png`
  const path = join(EVIDENCE_DIR, filename)
  await page.screenshot({ path, fullPage: true })
  evidenceFiles.push(path.replaceAll('\\', '/'))
}

function setupConsoleCapture(page: Page) {
  const capture = {
    consoleErrors: [] as Array<{ url: string; msg: ConsoleMessage }>,
    pageErrors: [] as Array<{ url: string; error: Error }>,
    notFoundResponses: [] as string[],
  }

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    const isIgnored = IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(text))
    if (isIgnored) return
    capture.consoleErrors.push({ url: page.url(), msg })
  })

  page.on('pageerror', (error) => {
    const msg = error?.message || String(error)
    const isIgnored = IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(msg))
    if (isIgnored) return
    capture.pageErrors.push({ url: page.url(), error })
  })

  page.on('response', (response) => {
    if (response.status() === 404) {
      capture.notFoundResponses.push(response.url())
    }
  })

  return capture
}

test.describe('UX Audit - Phase 2 (Search & Categories)', () => {
  test.setTimeout(90_000)

  test('P2 /en/search + /en/categories + /en/todays-deals', async ({ page, app }) => {
    const runLog: EvidenceRunLog = {
      startedAtIso: new Date().toISOString(),
      baseURL: process.env.BASE_URL,
      evidenceDir: EVIDENCE_DIR,
      steps: [],
      evidenceFiles: [],
      consoleErrors: [],
      pageErrors: [],
      notFoundResponses: [],
    }

    const capture = setupConsoleCapture(page)

    // ---------------------------------------------------------------------
    // Step 1: Search page loads
    // ---------------------------------------------------------------------
    await test.step('Open /en/search', async () => {
      await app.gotoWithRetries('/en/search', { waitUntil: 'domcontentloaded' })
      await app.waitForDevCompilingOverlayToHide(60_000)

      await expect(page.locator('header').first()).toBeVisible({ timeout: 30_000 })
      await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 })
      await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

      runLog.steps.push({
        url: page.url(),
        assertions: ['header visible', '#main-content visible', 'no global error text'],
      })

      await snap(page, 'p2-en-01-search-load', runLog.evidenceFiles)
    })

    // ---------------------------------------------------------------------
    // Step 2: Search bar functionality (header search -> navigates with q=)
    // ---------------------------------------------------------------------
    await test.step('Use header search box -> URL q param', async () => {
      await app.waitForDevCompilingOverlayToHide(60_000)
      const searchBox = page.getByPlaceholder(/Search products, brands, and more\.{3}/i)
      await expect(searchBox).toBeVisible({ timeout: 30_000 })

      await searchBox.fill('phone')
      // The submit handler uses React state; give it a brief moment to reflect the filled value.
      await page.waitForTimeout(250)

      const searchForm = searchBox.locator('xpath=ancestor::form[1]')
      await searchForm.locator('button[type="submit"]').click()

      // Client-side navigation may not trigger a full "load" event; wait on the URL state itself.
      await page.waitForFunction(() => {
        try {
          return new URL(window.location.href).searchParams.get('q') === 'phone'
        } catch {
          return false
        }
      }, undefined, { timeout: 45_000 })
      await app.waitForDevCompilingOverlayToHide(60_000)

      // Radix popovers can temporarily mark page content as hidden/inert; ensure it's closed.
      await page.keyboard.press('Escape').catch(() => {})

      await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 })

      runLog.steps.push({
        url: page.url(),
        assertions: ['search submit navigates to /en/search?q=phone', '#main-content visible'],
      })

      await snap(page, 'p2-en-02-search-q-phone', runLog.evidenceFiles)
    })

    // ---------------------------------------------------------------------
    // Step 3: Filters panel (desktop sidebar) and sort dropdown
    // ---------------------------------------------------------------------
    await test.step('Filters panel + sort control present', async () => {
      await expect(page.locator('aside').first()).toBeVisible({ timeout: 30_000 })

      const sort = page.getByLabel(/sort/i)
      await expect(sort).toBeVisible({ timeout: 30_000 })

      // Open the sort menu (no need to change value for audit)
      await sort.click()
      await expect(page.getByRole('option').first()).toBeVisible({ timeout: 30_000 })

      runLog.steps.push({
        url: page.url(),
        assertions: ['desktop filters sidebar visible', 'sort dropdown visible + opens'],
      })

      await snap(page, 'p2-en-03-search-filters-sort-open', runLog.evidenceFiles)

      // Close menu to avoid overlay affecting next steps.
      await page.keyboard.press('Escape')
    })

    // ---------------------------------------------------------------------
    // Step 4: Pagination controls (best-effort; depends on product count)
    // ---------------------------------------------------------------------
    await test.step('Pagination controls (if multiple pages)', async () => {
      // If pagination is present, verify next/prev links exist.
      const paginationNav = page.locator('nav[aria-label="pagination"], nav:has(a:has-text("Next")), nav:has(a:has-text("Previous"))').first()
      const hasPagination = await paginationNav.isVisible().catch(() => false)

      if (hasPagination) {
        await expect(paginationNav).toBeVisible({ timeout: 30_000 })
        runLog.steps.push({
          url: page.url(),
          assertions: ['pagination nav visible'],
        })
        await snap(page, 'p2-en-04-search-pagination-visible', runLog.evidenceFiles)
      } else {
        runLog.steps.push({
          url: page.url(),
          assertions: ['pagination not rendered (likely <=1 page of results in current dataset)'],
        })
        await snap(page, 'p2-en-04-search-pagination-not-rendered', runLog.evidenceFiles)
      }
    })

    // ---------------------------------------------------------------------
    // Step 5: Categories index and navigation into a category
    // ---------------------------------------------------------------------
    await test.step('Categories index loads and navigates into first category', async () => {
      await app.gotoWithRetries('/en/categories', { waitUntil: 'domcontentloaded' })
      await app.waitForDevCompilingOverlayToHide(60_000)

      await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 })
      await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

      runLog.steps.push({
        url: page.url(),
        assertions: ['#main-content visible', 'no global error text'],
      })

      await snap(page, 'p2-en-05-categories-index', runLog.evidenceFiles)

      // Click first category link if present.
      const firstCategoryLink = page.locator('a[href^="/en/categories/"]').first()
      const hasCategoryLink = await firstCategoryLink.isVisible().catch(() => false)

      if (hasCategoryLink) {
        const href = await firstCategoryLink.getAttribute('href')
        await firstCategoryLink.click()
        await page.waitForURL((url) => url.pathname.startsWith('/en/categories/') && url.pathname !== '/en/categories', {
          timeout: 45_000,
        })
        await app.waitForDevCompilingOverlayToHide(60_000)

        await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 })

        runLog.steps.push({
          url: page.url(),
          assertions: [`navigated into category via ${href || 'first category link'}`],
        })

        await snap(page, 'p2-en-06-category-page', runLog.evidenceFiles)

        // Category page should have sort control too
        await expect(page.getByLabel(/sort/i)).toBeVisible({ timeout: 30_000 })
        await snap(page, 'p2-en-07-category-sort-visible', runLog.evidenceFiles)
      } else {
        runLog.steps.push({
          url: page.url(),
          assertions: ['no category links found on /en/categories (unexpected)'],
        })
        await snap(page, 'p2-en-06-categories-no-links', runLog.evidenceFiles)
      }
    })

    // ---------------------------------------------------------------------
    // Step 6: Today’s Deals page loads
    // ---------------------------------------------------------------------
    await test.step('Todays Deals loads', async () => {
      await app.gotoWithRetries('/en/todays-deals', { waitUntil: 'domcontentloaded' })
      await app.waitForDevCompilingOverlayToHide(60_000)

      await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 })
      await expect(page.getByText(/something went wrong/i)).not.toBeVisible()

      runLog.steps.push({
        url: page.url(),
        assertions: ['#main-content visible', 'no global error text'],
      })

      await snap(page, 'p2-en-08-todays-deals', runLog.evidenceFiles)
    })

    // ---------------------------------------------------------------------
    // Persist console + run log artifacts
    // ---------------------------------------------------------------------
    runLog.consoleErrors = capture.consoleErrors.map((e) => ({ url: e.url, text: e.msg.text() }))
    runLog.pageErrors = capture.pageErrors.map((e) => ({ url: e.url, message: e.error.message }))
    runLog.notFoundResponses = [...new Set(capture.notFoundResponses)]

    ensureEvidenceDir()
    writeFileSync(join(EVIDENCE_DIR, 'p2-runlog.json'), JSON.stringify(runLog, null, 2), 'utf8')

    // Fail test if we saw real console/page errors (audit requirement).
    if (runLog.consoleErrors.length > 0 || runLog.pageErrors.length > 0) {
      const formatted = [
        'Console/page errors detected during Phase 2 audit:',
        ...runLog.consoleErrors.map((e) => `  - console.error @ ${e.url}: ${e.text}`),
        ...runLog.pageErrors.map((e) => `  - pageerror @ ${e.url}: ${e.message}`),
        ...(runLog.notFoundResponses.length > 0
          ? ['  - 404 responses observed:', ...runLog.notFoundResponses.slice(0, 25).map((u) => `    - ${u}`)]
          : []),
      ].join('\n')

      throw new Error(formatted)
    }
  })
})
