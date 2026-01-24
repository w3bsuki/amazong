import { test, expect, assertNoErrorBoundary } from './fixtures/base'

test.describe('Drawer: header stays visible', () => {
  test('opening a drawer after scrolling does not hide the app header', async ({
    page,
    app,
  }) => {
    const projectName = test.info().project.name
    test.skip(!projectName.startsWith('mobile'), 'Mobile-only regression test')

    await app.goto('/en')
    await app.waitForHydration()

    const appHeader = page.locator('header[data-slot="app-header"]').first()
    await expect(appHeader).toBeInViewport()

    await page.evaluate(() => window.scrollTo(0, 700))
    await expect(appHeader).toBeInViewport()

    // Sidebar menu renders a non-interactive SSR placeholder until hydrated.
    // Ensure the real <button> exists before clicking (WebKit can be faster than effects).
    const menuTrigger = page.locator('button[data-testid="mobile-menu-trigger"]').first()
    await expect(menuTrigger).toBeVisible()

    await menuTrigger.click()
    await expect(page.locator('[data-slot="drawer-content"]').first()).toBeVisible()

    await expect(appHeader).toBeInViewport()
    await assertNoErrorBoundary(page)
    app.assertNoConsoleErrors()
  })
})
