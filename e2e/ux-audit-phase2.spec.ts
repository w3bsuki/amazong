import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const EVIDENCE_DIR = path.resolve(process.cwd(), 'cleanup', 'ux-audit-20251228-phase2')

type RunStep = {
  url: string
  note: string
  assertions: string[]
  evidence?: string
}

test.describe('UX Audit Phase 2 (Search & Categories)', () => {
  test('audit /en search + categories', async ({ page, baseURL }) => {
    test.setTimeout(180_000)
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true })

    const consoleErrors: Array<{ type: string; text: string; location?: unknown }> = []
    const pageErrors: Array<{ message: string }> = []
    const runSteps: RunStep[] = []
    const evidenceFiles: string[] = []
    const issues: Array<{ id: string; url: string; note: string; evidence: string }> = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push({ type: msg.type(), text: msg.text(), location: msg.location() })
      }
    })
    page.on('pageerror', (err) => {
      pageErrors.push({ message: String(err?.message || err) })
    })

    const snap = async (name: string) => {
      const filename = name.endsWith('.png') ? name : `${name}.png`
      const outPath = path.join(EVIDENCE_DIR, filename)
      await page.screenshot({ path: outPath, fullPage: true })
      evidenceFiles.push(filename)
      return filename
    }

    const recordIssue = async (id: string, note: string, evidenceBaseName: string) => {
      const evidence = await snap(evidenceBaseName)
      issues.push({ id, url: page.url(), note, evidence })
      return evidence
    }

    const goto = async (url: string, note: string) => {
      const absolute = baseURL ? new URL(url, baseURL).toString() : url
      const response = await page.goto(absolute, { waitUntil: 'domcontentloaded' })
      // Dev server compile can be slow; prefer explicit UI readiness waits over networkidle.
      expect(response, `No response for navigation to ${absolute}`).not.toBeNull()
      if (response) {
        expect(response.status(), `Non-2xx navigation status for ${absolute}`).toBeLessThan(400)
      }
      runSteps.push({ url, note, assertions: [`Navigation ok (<400)`] })
    }

    // ---------------------------------------------------------------------
    // 0) Confirm dev server is up
    // ---------------------------------------------------------------------
    await goto('/en', 'Confirm dev server is reachable')
    await expect(page).toHaveURL(/\/en(\/)?$/)
    const p2_01 = await snap('p2-en-01-home')
    runSteps[runSteps.length - 1]!.evidence = p2_01
    runSteps[runSteps.length - 1]!.assertions.push('URL is /en')

    // ---------------------------------------------------------------------
    // 1) /en/search loads
    // ---------------------------------------------------------------------
    await goto('/en/search', 'Search page loads')
    await expect(page).toHaveURL(/\/en\/search/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const p2_02 = await snap('p2-en-02-search-load')
    runSteps[runSteps.length - 1]!.evidence = p2_02
    runSteps[runSteps.length - 1]!.assertions.push('H1 visible')

    // ---------------------------------------------------------------------
    // 2) Search bar functionality (header)
    // ---------------------------------------------------------------------
    const searchInput = page.getByPlaceholder('Search products, brands, and more...')
    await expect(searchInput).toBeVisible()
    await searchInput.fill('phone')
    await searchInput.press('Enter')
    // Stabilize: the header search pushes to /search (then locale router may normalize).
    // Wait for the route transition, then assert query param.
    await page.waitForURL(/\/en\/search/, { timeout: 15_000 })
    const currentUrl = page.url()
    const qParam = (() => {
      try {
        return new URL(currentUrl).searchParams.get('q')
      } catch {
        return null
      }
    })()

    const hasQuery = qParam === 'phone'
    runSteps.push({
      url: currentUrl,
      note: 'Header search submits and sets query param',
      assertions: [hasQuery ? 'URL includes q=phone' : `BUG: expected q=phone, got q=${qParam ?? 'null'}`],
    })
    if (!hasQuery) {
      await recordIssue('P2-SEARCH-QUERY', 'Header search submit navigates to /search but does not preserve the query param', 'p2-en-03-search-submit-bug')
    }
    const p2_03 = await snap('p2-en-03-search-submit')
    runSteps[runSteps.length - 1]!.evidence = p2_03

    // ---------------------------------------------------------------------
    // 3) Filters panel/button (desktop sidebar)
    // ---------------------------------------------------------------------
    const departmentHeading = page.getByRole('heading', { name: 'Department' })
    await expect(departmentHeading).toBeVisible()
    runSteps.push({
      url: page.url(),
      note: 'Filters sidebar is present on desktop',
      assertions: ['"Department" heading visible'],
    })
    const p2_04 = await snap('p2-en-04-filters-sidebar')
    runSteps[runSteps.length - 1]!.evidence = p2_04

    // ---------------------------------------------------------------------
    // 4) Sort dropdown
    // ---------------------------------------------------------------------
    const sortTrigger = page.getByLabel('Sort by')
    await expect(sortTrigger).toBeVisible()
    await sortTrigger.click()
    await page.getByRole('option', { name: 'Price: Low to High' }).click()
    await page.waitForURL(/\/en\/search\?.*sort=price-asc/, { timeout: 15_000 }) // stabilize
    const sortedUrl = page.url()
    const hasSort = (() => {
      try {
        return new URL(sortedUrl).searchParams.get('sort') === 'price-asc'
      } catch {
        return false
      }
    })()
    runSteps.push({
      url: sortedUrl,
      note: 'Sort changes update URL',
      assertions: [hasSort ? 'URL includes sort=price-asc' : 'BUG: sort selection did not set sort=price-asc'],
    })
    if (!hasSort) {
      await recordIssue('P2-SORT-URL', 'Sort dropdown selection did not update the URL query param', 'p2-en-05-sort-bug')
    }
    const p2_05 = await snap('p2-en-05-sort-price-asc')
    runSteps[runSteps.length - 1]!.evidence = p2_05

    // ---------------------------------------------------------------------
    // 5) Product grid display (or empty state)
    // ---------------------------------------------------------------------
    // ProductCard renders a full-card overlay link with an aria-label.
    // Use that for a stable, semantic locator.
    const productCards = page.getByLabel(/^Open product:/)
    const emptyState = page.getByRole('heading', { name: 'No products found' })

    // Prefer deterministic assertion: either cards render or empty state renders.
    const hasCards = await productCards.first().isVisible().catch(() => false)
    const hasEmpty = await emptyState.isVisible().catch(() => false)
    expect(hasCards || hasEmpty, 'Expected product grid items or empty-state').toBeTruthy()

    runSteps.push({
      url: page.url(),
      note: 'Results render as grid or empty state',
      assertions: [hasCards ? 'At least 1 product card visible' : 'Empty state visible'],
    })
    const p2_06 = await snap('p2-en-06-grid-or-empty')
    runSteps[runSteps.length - 1]!.evidence = p2_06

    // ---------------------------------------------------------------------
    // 6) Pagination controls (best-effort)
    // ---------------------------------------------------------------------
    const nextLink = page.getByRole('link', { name: 'Next' })
    const hasPagination = await nextLink.isVisible().catch(() => false)
    runSteps.push({
      url: page.url(),
      note: 'Pagination controls (best-effort; depends on total results)',
      assertions: [hasPagination ? 'Pagination visible' : 'Pagination not rendered (<=1 page or no results)'],
    })
    const p2_07 = await snap('p2-en-07-pagination')
    runSteps[runSteps.length - 1]!.evidence = p2_07

    // ---------------------------------------------------------------------
    // 7) URL query params work (minRating)
    // ---------------------------------------------------------------------
    // Keep this deterministic: navigate directly with a known query param and confirm it renders.
    await goto('/en/search?q=phone&minRating=4', 'URL query params work (minRating)')
    await expect(page).toHaveURL(/\/en\/search\?.*minRating=4/)
    runSteps[runSteps.length - 1]!.assertions.push('URL includes minRating=4')
    const p2_08 = await snap('p2-en-08-url-query-params')
    runSteps[runSteps.length - 1]!.evidence = p2_08

    // ---------------------------------------------------------------------
    // 8) Category navigation (/en/categories)
    // ---------------------------------------------------------------------
    await goto('/en/categories', 'Categories index loads')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const p2_09 = await snap('p2-en-09-categories-index')
    runSteps[runSteps.length - 1]!.evidence = p2_09
    runSteps[runSteps.length - 1]!.assertions.push('H1 visible')

    // Click first category card
    const firstCategoryLink = page.locator('a[href*="/en/categories/"]').first()
    await expect(firstCategoryLink).toBeVisible()
    await firstCategoryLink.click()
    await page.waitForURL(/\/en\/categories\//)
    runSteps.push({
      url: page.url(),
      note: 'Category page loads via category navigation',
      assertions: ['URL matches /en/categories/*'],
    })
    const p2_10 = await snap('p2-en-10-category-page')
    runSteps[runSteps.length - 1]!.evidence = p2_10

    // ---------------------------------------------------------------------
    // 9) Deals page (/en/todays-deals)
    // ---------------------------------------------------------------------
    await goto('/en/todays-deals', 'Deals page loads')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const p2_11 = await snap('p2-en-11-todays-deals')
    runSteps[runSteps.length - 1]!.evidence = p2_11
    runSteps[runSteps.length - 1]!.assertions.push('H1 visible')

    // ---------------------------------------------------------------------
    // Write evidence logs
    // ---------------------------------------------------------------------
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'p2-runlog.json'),
      JSON.stringify({ baseURL, steps: runSteps, issues }, null, 2),
      'utf8'
    )
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'p2-console-errors.json'),
      JSON.stringify({ consoleErrors, pageErrors }, null, 2),
      'utf8'
    )
    evidenceFiles.push('p2-runlog.json', 'p2-console-errors.json')

    // If we see runtime errors, fail the audit test so we notice and log it in docs.
    expect(
      pageErrors.length,
      `Page errors detected. See ${path.join(EVIDENCE_DIR, 'p2-console-errors.json')}`
    ).toBe(0)

    // Fail the audit if we detected functional issues.
    expect(issues, `UX audit issues detected. See ${path.join(EVIDENCE_DIR, 'p2-runlog.json')}`).toHaveLength(0)
  })
})
