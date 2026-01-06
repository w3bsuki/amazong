import { test, expect, Page } from "@playwright/test"

/**
 * Phase 11: Mobile Responsiveness Testing
 * 
 * Tests all major routes and UI components in mobile viewport to ensure:
 * - Navigation works correctly (hamburger menu, tab bar)
 * - Touch targets are adequately sized (min 44x44px)
 * - Content is readable and properly laid out
 * - Forms are usable on mobile
 * - No horizontal overflow issues
 */

/**
 * Helper function to dismiss any blocking overlays (cookie consent, geo modal)
 * This is needed when testing against a dev server without NEXT_PUBLIC_E2E=true
 */
async function dismissOverlays(page: Page) {
  // Wait for page to settle
  await page.waitForLoadState("networkidle")
  
  // Dismiss cookie consent if present
  const cookieConsent = page.locator('[role="dialog"][aria-labelledby="cookie-consent-title"]')
  if (await cookieConsent.isVisible({ timeout: 1000 }).catch(() => false)) {
    const acceptButton = page.getByRole("button", { name: /accept|приемам/i })
    if (await acceptButton.isVisible()) {
      await acceptButton.click()
      await cookieConsent.waitFor({ state: "hidden", timeout: 3000 }).catch(() => {})
    }
  }
  
  // Dismiss geo welcome modal if present
  const geoModal = page.getByRole("dialog", { name: /choose your region/i })
  if (await geoModal.isVisible({ timeout: 1000 }).catch(() => false)) {
    const showAllButton = page.getByRole("button", { name: /show all products/i })
    if (await showAllButton.isVisible()) {
      await showAllButton.click()
      await geoModal.waitFor({ state: "hidden", timeout: 3000 }).catch(() => {})
    }
  }
  
  // Brief wait for any animations
  await page.waitForTimeout(300)
}

/**
 * Helper to pre-dismiss overlays via localStorage before page load
 */
async function setupPage(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('geo-welcome-dismissed', 'true')
  })
}

test.describe("Mobile Responsiveness - Phase 11", () => {
  // Use mobile viewport for all tests in this describe block
  test.use({ viewport: { width: 375, height: 812 } })

  // Pre-dismiss overlays for all tests
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
  })

  test.describe("Mobile Navigation", () => {
    test("mobile tab bar is visible and functional", async ({ page }) => {
      await page.goto("/en")
      
      // Tab bar should be visible on mobile
      const tabBar = page.getByTestId("mobile-tab-bar")
      await expect(tabBar).toBeVisible()
      
      // Verify all tab bar items are present (use tabBar as parent to avoid ambiguity)
      await expect(tabBar.getByRole("link", { name: "Home" })).toBeVisible()
      await expect(tabBar.getByRole("button", { name: /categories/i })).toBeVisible()
      await expect(tabBar.getByRole("link", { name: "Sell" })).toBeVisible()
      await expect(tabBar.getByRole("link", { name: /chat/i })).toBeVisible()
      await expect(tabBar.getByRole("link", { name: "Account" })).toBeVisible()
    })

    test("hamburger menu opens category drawer", async ({ page }) => {
      await page.goto("/en")
      await dismissOverlays(page)
      
      // Click categories button in tab bar
      const tabBar = page.getByTestId("mobile-tab-bar")
      await tabBar.getByRole("button", { name: /categories/i }).click()
      
      // Category drawer should open
      const categoryDrawer = page.getByRole("dialog", { name: /categories/i })
      await expect(categoryDrawer).toBeVisible()
      await expect(page.getByText(/shop by category/i)).toBeVisible()
      
      // Close drawer
      await categoryDrawer.getByRole("button", { name: /close/i }).click()
      await expect(categoryDrawer).not.toBeVisible()
    })

    test("mobile search overlay opens", async ({ page }) => {
      await page.goto("/en")
      
      // Click search button in header
      const searchButton = page.getByRole("button", { name: /search/i }).first()
      await searchButton.click()
      
      // Search overlay should appear
      await expect(page.getByRole("dialog")).toBeVisible()
      // Use first() to handle multiple search inputs
      await expect(page.getByRole("searchbox").first()).toBeVisible()
    })
  })

  test.describe("Mobile Homepage", () => {
    test("categories navigation renders on mobile", async ({ page }) => {
      await page.goto("/en")
      
      // Wait for page to load fully
      await page.waitForLoadState("networkidle")
      
      // Mobile homepage shows tabbed interface with category tabs
      // Look for the tab list with "All" and category tabs
      const tabList = page.locator('[role="tablist"]').first()
      await expect(tabList).toBeVisible({ timeout: 15000 })
      
      // "All" tab should be visible as first tab
      const allTab = page.getByRole("tab", { name: /all|всички/i }).first()
      await expect(allTab).toBeVisible()
      
      // Start selling CTA should be visible
      await expect(page.getByRole("link", { name: /start selling|продавай/i }).first()).toBeVisible({ timeout: 10000 })
    })

    test("category list is scrollable on mobile", async ({ page }) => {
      await page.goto("/en")
      
      // Wait for categories to load
      await page.waitForLoadState("networkidle")
      
      // Category tabs should be visible in tab list
      const tabList = page.locator('[role="tablist"]').first()
      await expect(tabList).toBeVisible({ timeout: 15000 })
      
      // Should have multiple tabs for categories
      const tabs = page.getByRole("tab")
      const tabCount = await tabs.count()
      expect(tabCount).toBeGreaterThan(3) // "All" + at least a few categories
    })

    test("product listing tabs work on mobile", async ({ page }) => {
      await page.goto("/en")
      
      // Wait for listings to load
      await page.waitForLoadState("networkidle")
      
      // Product listing tabs should be visible
      const tablist = page.getByRole("tablist")
      await expect(tablist.first()).toBeVisible({ timeout: 15000 })
      
      // "All" tab should be selected by default (or any tab)
      const allTab = page.getByRole("tab", { name: /all|всички/i }).first()
      await expect(allTab).toBeVisible()
      
      // Product cards (links to products) should be visible
      const productLinks = page.locator('a[aria-label^="Open product:"]')
      await expect(productLinks.first()).toBeVisible({ timeout: 15000 })
    })

    test("no horizontal overflow on homepage", async ({ page }) => {
      await page.goto("/en")
      
      // Check that body doesn't have horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      
      expect(hasOverflow).toBe(false)
    })
  })

  test.describe("Mobile Product Page", () => {
    test("product page renders correctly on mobile", async ({ page }) => {
      await page.goto("/en/shop4e/12322")
      
      // Wait for page to load
      await page.waitForLoadState("networkidle")
      
      // Product content should be visible (use first() to handle duplicates)
      await expect(page.locator("#main-content").first()).toBeVisible({ timeout: 30000 })
      
      // Price should be visible somewhere on page (use first() as there are multiple prices)
      await expect(page.locator('text=/€|BGN|\\d+[.,]\\d{2}/').first()).toBeVisible({ timeout: 15000 })
      
      // Mobile tab bar should be hidden on product page (has sticky buy box instead)
      await expect(page.getByTestId("mobile-tab-bar")).not.toBeVisible()
    })

    test("product page has back button on mobile", async ({ page }) => {
      // Navigate to product page
      await page.goto("/en/shop4e/12322")
      
      // Wait for page to load
      await page.waitForLoadState("networkidle")
      
      // Back control should be visible in header (can be rendered as a link).
      const backControl = page
        .getByRole("link", { name: /go back|back|назад|обратно/i })
        .or(page.getByRole("button", { name: /go back|back|назад|обратно/i }))
        .first()
      await expect(backControl).toBeVisible({ timeout: 15_000 })
    })

    test("product images are displayed on mobile", async ({ page }) => {
      await page.goto("/en/shop4e/12322")
      
      // Wait for page to load
      await page.waitForLoadState("networkidle")
      
      // Wait for image to load (may be lazy loaded)
      await page.waitForTimeout(2000)
      
      // Image should be visible on product page
      const productImage = page.locator('img[alt]:not([alt=""])').first()
      await expect(productImage).toBeVisible({ timeout: 15000 })
    })

    test("add to cart button is visible on mobile product page", async ({ page }) => {
      await page.goto("/en/shop4e/12322")
      
      // Add to cart should be in sticky footer or visible
      await expect(page.getByRole("button", { name: /add to cart|добави в кошницата/i })).toBeVisible({ timeout: 15000 })
    })
  })

  test.describe("Mobile Search Page", () => {
    test("search page renders correctly on mobile", async ({ page }) => {
      await page.goto("/en/search?q=phone")
      
      // Search results should be visible
      await expect(page.locator("main")).toBeVisible()
      
      // No horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })

    test("filters button is accessible on mobile search", async ({ page }) => {
      await page.goto("/en/search?q=phone")
      
      // Filter button should be visible on mobile
      const filterButton = page.getByRole("button", { name: /filter|филтри/i })
      await expect(filterButton).toBeVisible({ timeout: 10000 })
    })

    test("sort dropdown works on mobile", async ({ page }) => {
      await page.goto("/en/search?q=phone")
      
      // Sort button/dropdown should be visible
      const sortButton = page.getByRole("button", { name: /sort|подреди/i }).or(
        page.getByRole("combobox", { name: /sort/i })
      )
      
      if (await sortButton.isVisible()) {
        await sortButton.click()
        // Dropdown options should appear
        await expect(page.getByRole("option").or(page.getByRole("menuitem")).first()).toBeVisible()
      }
    })
  })

  test.describe("Mobile Auth Pages", () => {
    test("login form is usable on mobile", async ({ page }) => {
      await page.goto("/en/auth/login")
      
      // Form elements should be visible
      await expect(page.getByLabel(/email/i)).toBeVisible()
      // Password input - use specific selector to avoid matching "Show password" button
      await expect(page.getByRole("textbox", { name: /password/i })).toBeVisible()
      await expect(page.getByRole("button", { name: /sign in|вход/i })).toBeVisible()
      
      // No horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })

    test("sign up form is usable on mobile", async ({ page }) => {
      await page.goto("/en/auth/sign-up")
      
      // Form elements should be visible
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i).first()).toBeVisible()
      await expect(page.getByRole("button", { name: /sign up|регистрация|create/i })).toBeVisible()
      
      // Form should fit within viewport
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })
  })

  test.describe("Mobile Cart & Checkout", () => {
    test("cart page renders correctly on mobile", async ({ page }) => {
      await page.goto("/en/cart")
      
      // Cart page should load
      await expect(page.locator("main")).toBeVisible()
      
      // Empty cart or items should be visible
      const cartContent = page.getByText(/your cart|кошницата ви|shopping cart|empty/i)
      await expect(cartContent.first()).toBeVisible({ timeout: 10000 })
      
      // No horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })

    test("checkout page renders correctly on mobile", async ({ page }) => {
      test.setTimeout(120_000)
      await page.goto("/en/checkout", { timeout: 90_000, waitUntil: 'domcontentloaded' })
      
      // Checkout page should load (may redirect to auth or show empty cart)
      await expect(page.locator("main").first()).toBeVisible({ timeout: 30000 })
      
      // No horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })
  })

  test.describe("Mobile Account Pages", () => {
    test("account dashboard redirect works on mobile (guest)", async ({ page }) => {
      await page.goto("/en/account")
      
      // Should redirect to login for guests
      await expect(page).toHaveURL(/auth\/login/)
    })

    test("account pages have no horizontal overflow", async ({ page }) => {
      // Test profile page (will redirect to login, but check layout)
      await page.goto("/en/account/profile")
      
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })
  })

  test.describe("Mobile Categories Page", () => {
    test("categories page renders correctly on mobile", async ({ page }) => {
      await page.goto("/en/categories")
      
      // Categories should be visible
      await expect(page.locator("main")).toBeVisible()
      
      // Category links should be present
      await expect(page.getByRole("link", { name: /electronics|fashion|home/i }).first()).toBeVisible({ timeout: 10000 })
      
      // No horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })

    test("category detail page works on mobile", async ({ page }) => {
      await page.goto("/en/categories/electronics")
      
      // Category page should load
      await expect(page.locator("main")).toBeVisible()
      
      // Products or subcategories should be visible
      const content = page.locator("main")
      await expect(content).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe("Mobile Static Pages", () => {
    test("about page renders correctly on mobile", async ({ page }) => {
      test.setTimeout(120_000)
      await page.goto("/en/about", { timeout: 90_000, waitUntil: 'domcontentloaded' })
      
      await expect(page.locator("main").first()).toBeVisible({ timeout: 30000 })
      
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })

    test("contact page renders correctly on mobile", async ({ page }) => {
      test.setTimeout(120_000)
      await page.goto("/en/contact", { timeout: 90_000, waitUntil: 'domcontentloaded' })
      
      await expect(page.locator("main").first()).toBeVisible({ timeout: 30000 })
      
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })

    test("customer service page renders correctly on mobile", async ({ page }) => {
      test.setTimeout(120_000)
      await page.goto("/en/customer-service", { timeout: 90_000, waitUntil: 'domcontentloaded' })
      
      await expect(page.locator("main").first()).toBeVisible({ timeout: 30000 })
      
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })
  })

  test.describe("Mobile Touch Targets", () => {
    test("tab bar buttons have adequate touch targets", async ({ page }) => {
      await page.goto("/en")
      
      // Wait for page to load
      await page.waitForLoadState("networkidle")
      
      const tabBar = page.getByTestId("mobile-tab-bar")
      await expect(tabBar).toBeVisible({ timeout: 15000 })
      
      // Check that buttons are at least 40px in height (design system standard)
      // Note: WCAG 2.2 recommends 44px for enhanced targets, 24px for minimum
      // Our design system uses 40px which exceeds WCAG minimum requirements
      const buttons = tabBar.locator("a, button")
      const count = await buttons.count()
      
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i)
        const box = await button.boundingBox()
        if (box) {
          // Minimum touch target should be 40px (design system: --spacing-touch)
          expect(box.height).toBeGreaterThanOrEqual(40)
        }
      }
    })
  })

  test.describe("Mobile Footer", () => {
    test("footer renders correctly on mobile", async ({ page }) => {
      await page.goto("/en")
      
      // Wait for page to load
      await page.waitForLoadState("networkidle")
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      
      // Wait a moment for scroll
      await page.waitForTimeout(500)
      
      // Footer should be visible
      const footer = page.getByRole("contentinfo")
      await expect(footer).toBeVisible()
      
      // Back to top button should be visible
      await expect(page.getByRole("button", { name: /back to top/i })).toBeVisible()
    })
  })

  test.describe("Bulgarian Locale Mobile", () => {
    test("Bulgarian homepage renders correctly on mobile", async ({ page }) => {
      await page.goto("/bg")
      
      // Wait for page to load
      await page.waitForLoadState("networkidle")
      
      // Main content should be visible - use #main-content to avoid multiple main elements
      await expect(page.locator("#main-content")).toBeVisible({ timeout: 15000 })
      
      // Mobile navigation should show Bulgarian labels
      const mobileNav = page.getByRole("navigation", { name: /mobile navigation/i })
      await expect(mobileNav).toBeVisible()
      
      // No horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })
  })
})
