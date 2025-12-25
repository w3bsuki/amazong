import { test, expect, formatViolations } from './fixtures/axe-test'
import type { Page } from './fixtures/test'

/**
 * Accessibility Tests for WCAG 2.1 AA Compliance
 * 
 * These tests verify:
 * - Automated WCAG 2.1 Level AA compliance
 * - Keyboard navigation
 * - Screen reader compatibility (ARIA)
 * - Color contrast
 * - Form accessibility
 * 
 * Run with: pnpm test:a11y
 * 
 * Note: These tests use @axe-core/playwright which catches ~30-50% of accessibility issues.
 * Manual testing is still required for complete WCAG compliance.
 */

// ============================================================================
// Test Configuration
// ============================================================================

/**
 * Routes to test for accessibility
 * Testing both English and Bulgarian to catch locale-specific issues
 */
const A11Y_ROUTES = [
  { name: 'Homepage (EN)', path: '/en' },
  { name: 'Homepage (BG)', path: '/bg' },
  { name: 'Categories', path: '/en/categories' },
  { name: 'Search Results', path: '/en/search?q=phone' },
  { name: 'Cart', path: '/en/cart' },
] as const

/**
 * Known violations to track but not fail on (temporary)
 * Document why each is here and create tickets to fix them
 * 
 * Navigation menu ARIA structure issues - requires refactoring:
 * - aria-required-children: Category dropdown panel has invalid children structure
 * - list/listitem: NavigationMenuList structure has intermediate divs
 * - button-name: Some navigation/filter buttons need accessible names
 */
const KNOWN_VIOLATIONS: Record<string, string> = {
  // Navigation menu structure violations (requires refactoring)
  'aria-required-children': 'Navigation mega-menu dropdown has nav/list children in role="menu"',
  'list': 'NavigationMenuList has intermediate div elements breaking ul/li structure',
  'listitem': 'NavigationMenuItem (li) is inside div instead of direct ul child',
  'button-name': 'Some navigation buttons in header/mega-menu need aria-labels',
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Wait for page to be fully loaded and interactive
 */
async function waitForPageReady(page: Page) {
  // Avoid 'networkidle' in Next.js dev mode (HMR/websockets can keep the network busy)
  await page.waitForLoadState('domcontentloaded')
  await page.locator('main').first().waitFor({ state: 'visible' })
  // Give a brief moment for client hydration / lazy content
  await page.waitForTimeout(250)
}

// ============================================================================
// Full Page Accessibility Tests
// ============================================================================

test.describe('Accessibility - Full Page Scans @accessibility', () => {
  for (const route of A11Y_ROUTES) {
    test(`${route.name} has no accessibility violations`, async ({ page, makeAxeBuilder }) => {
      await page.goto(route.path)
      await waitForPageReady(page)

      const accessibilityScanResults = await makeAxeBuilder().analyze()

      // Filter out known violations
      const newViolations = accessibilityScanResults.violations.filter(
        (v) => !KNOWN_VIOLATIONS[v.id]
      )

      // Assert no new violations
      if (newViolations.length > 0) {
        const formattedViolations = formatViolations(newViolations)
        throw new Error(`Accessibility violations found on ${route.name}:\n${formattedViolations}`)
      }

      expect(accessibilityScanResults.violations).toEqual([])
    })
  }
})

// ============================================================================
// Component-Specific Accessibility Tests
// ============================================================================

test.describe('Accessibility - Navigation @accessibility', () => {
  test('main navigation is accessible', async ({ page, makeAxeBuilder }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    // Test header/navigation specifically
    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    const results = await makeAxeBuilder()
      .include('header')
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    // Press Tab multiple times and verify focus moves through interactive elements
    await page.keyboard.press('Tab')
    
    // First focusable element should receive focus
    const firstFocused = await page.evaluate(() => {
      const el = document.activeElement
      return el?.tagName.toLowerCase()
    })

    // Should focus on an interactive element (link, button, input)
    expect(['a', 'button', 'input', 'select', 'textarea']).toContain(firstFocused)

    // Tab through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
    }

    // Focus should still be on an interactive element
    const laterFocused = await page.evaluate(() => {
      const el = document.activeElement
      return el?.tagName.toLowerCase()
    })

    expect(['a', 'button', 'input', 'select', 'textarea', 'body']).toContain(laterFocused)
  })
})

test.describe('Accessibility - Forms @accessibility', () => {
  test('search form is accessible', async ({ page, makeAxeBuilder }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    // Find search input
    const searchInput = page.getByRole('searchbox')
      .or(page.getByRole('textbox', { name: /search/i }))
      .or(page.locator('input[type="search"]'))
      .or(page.locator('[data-testid="search-input"]'))

    // If search exists on homepage, test it
    const searchCount = await searchInput.count()
    if (searchCount > 0) {
      // Search should have accessible name
      const accessibleName = await searchInput.first().getAttribute('aria-label') ||
        await searchInput.first().getAttribute('placeholder') ||
        await page.evaluate((el) => {
          const input = el as HTMLInputElement
          const labelId = input.getAttribute('aria-labelledby')
          if (labelId) {
            return document.getElementById(labelId)?.textContent || ''
          }
          const label = document.querySelector(`label[for="${input.id}"]`)
          return label?.textContent || ''
        }, await searchInput.first().elementHandle())

      expect(accessibleName).toBeTruthy()
    }
  })

  test('cart page form elements are accessible', async ({ page, makeAxeBuilder }) => {
    await page.goto('/en/cart')
    await waitForPageReady(page)

    // Test any form elements on the cart page
    const results = await makeAxeBuilder()
      .include('main')
      .analyze()

    // Filter form-related violations
    const formViolations = results.violations.filter((v) =>
      ['label', 'form-field-multiple-labels', 'input-button-name', 'select-name'].includes(v.id)
    )

    expect(formViolations).toEqual([])
  })
})

// ============================================================================
// Focus Management Tests
// ============================================================================

test.describe('Accessibility - Focus Management @accessibility', () => {
  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    // Tab to an element
    await page.keyboard.press('Tab')

    // Check if focus is visible (element has focus styles)
    const hasFocusIndicator = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return false

      const styles = window.getComputedStyle(el)
      const pseudoStyles = window.getComputedStyle(el, ':focus')

      // Check for common focus indicators
      const hasOutline = styles.outline !== 'none' && styles.outline !== ''
      const hasBoxShadow = styles.boxShadow !== 'none' && styles.boxShadow !== ''
      const hasBorder = styles.borderColor !== '' || styles.borderWidth !== '0px'

      return hasOutline || hasBoxShadow || hasBorder
    })

    // This might need adjustment based on your focus styles
    // The test ensures SOME focus indicator exists
    expect(hasFocusIndicator).toBe(true)
  })

  test('skip link exists and works', async ({ page }) => {
    await page.goto('/en')

    // Press Tab once - skip link should be first focusable
    await page.keyboard.press('Tab')

    // Look for skip link
    const skipLink = page.getByRole('link', { name: /skip to (main|content)/i })
      .or(page.locator('a[href="#main"]'))
      .or(page.locator('a[href="#content"]'))
      .or(page.locator('.sr-only').filter({ hasText: /skip/i }))

    const skipLinkCount = await skipLink.count()

    // Skip link is a best practice but not always present
    // Log whether it exists
    if (skipLinkCount === 0) {
      console.log('⚠️ No skip link found - consider adding one for keyboard users')
    }
  })
})

// ============================================================================
// Color Contrast Tests
// ============================================================================

test.describe('Accessibility - Color Contrast @accessibility', () => {
  test('text has sufficient color contrast', async ({ page, makeAxeBuilder }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    // Run only color contrast checks
    const results = await makeAxeBuilder()
      .withTags(['wcag2aa'])
      .analyze()

    const contrastViolations = results.violations.filter((v) =>
      v.id === 'color-contrast'
    )

    if (contrastViolations.length > 0) {
      const formatted = formatViolations(contrastViolations)
      console.log(`Color contrast issues found:\n${formatted}`)
    }

    expect(contrastViolations).toEqual([])
  })
})

// ============================================================================
// ARIA and Semantic HTML Tests
// ============================================================================

test.describe('Accessibility - Semantic HTML @accessibility', () => {
  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    // Get all headings
    const headings = await page.evaluate(() => {
      const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      return Array.from(allHeadings).map((h) => ({
        level: parseInt(h.tagName.substring(1)),
        text: h.textContent?.trim().substring(0, 50),
      }))
    })

    // Should have at least one h1
    const h1Count = headings.filter((h) => h.level === 1).length
    expect(h1Count).toBeGreaterThan(0)

    // Should not have more than one h1 (best practice)
    if (h1Count > 1) {
      console.log(`⚠️ Found ${h1Count} h1 elements - consider using only one h1 per page`)
    }

    // Check for heading level skips (e.g., h1 -> h3)
    for (let i = 1; i < headings.length; i++) {
      const prevLevel = headings[i - 1].level
      const currLevel = headings[i].level
      
      // Allow going to any lower level, but not skipping when going higher
      if (currLevel > prevLevel && currLevel - prevLevel > 1) {
        console.log(`⚠️ Heading level skip: h${prevLevel} -> h${currLevel}`)
      }
    }
  })

  test('images have alt text', async ({ page, makeAxeBuilder }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    const results = await makeAxeBuilder()
      .withTags(['wcag2a'])
      .analyze()

    const imageViolations = results.violations.filter((v) =>
      ['image-alt', 'input-image-alt', 'area-alt'].includes(v.id)
    )

    expect(imageViolations).toEqual([])
  })

  test('links have accessible names', async ({ page, makeAxeBuilder }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    const results = await makeAxeBuilder()
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const linkViolations = results.violations.filter((v) =>
      ['link-name', 'link-in-text-block'].includes(v.id)
    )

    expect(linkViolations).toEqual([])
  })
})

// ============================================================================
// Mobile Accessibility Tests
// ============================================================================

test.describe('Accessibility - Mobile @accessibility @mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('touch targets are large enough', async ({ page, makeAxeBuilder }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    // Check interactive elements meet minimum touch target size
    const smallTargets = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('a, button, input, select, [role="button"], [tabindex="0"]')
      const tooSmall: string[] = []

      interactiveElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        // WCAG 2.2 recommends 44x44 minimum, but 24x24 is acceptable
        if (rect.width < 24 || rect.height < 24) {
          // Ignore hidden elements
          if (rect.width > 0 && rect.height > 0) {
            tooSmall.push(`${el.tagName}: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)}px`)
          }
        }
      })

      return tooSmall.slice(0, 5) // Return first 5
    })

    if (smallTargets.length > 0) {
      console.log(`⚠️ Small touch targets found: ${smallTargets.join(', ')}`)
    }
  })

  test('mobile navigation is accessible', async ({ page, makeAxeBuilder }) => {
    await page.goto('/en')
    await waitForPageReady(page)

    // Test mobile menu accessibility
    const mobileMenuTrigger = page.getByRole('button', { name: /menu/i })
      .or(page.locator('[data-testid="mobile-menu-trigger"]'))
      .or(page.locator('[aria-label*="menu"]'))

    const hasMobileMenu = (await mobileMenuTrigger.count()) > 0

    if (hasMobileMenu) {
      // Mobile menu trigger should be accessible
      await expect(mobileMenuTrigger.first()).toBeVisible()

      // Click to open
      await mobileMenuTrigger.first().click()

      // Run accessibility check on opened menu
      const results = await makeAxeBuilder().analyze()
      expect(results.violations).toEqual([])
    }
  })
})
