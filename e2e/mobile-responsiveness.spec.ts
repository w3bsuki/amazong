import { test, expect, Page } from "@playwright/test"
import { getTestUserCredentials, loginWithPassword } from "./fixtures/auth"

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

const MOBILE_PRODUCT_PATH = "/en/treido/2022-bmw-330i-xdrive-sedan"

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
      const dock = tabBar.getByTestId("mobile-tab-bar-dock")
      await expect(dock).toBeVisible()
      
      // Verify all tab bar items are present (use tabBar as parent to avoid ambiguity)
      await expect(tabBar.getByRole("link", { name: "Home" })).toBeVisible()
      await expect(tabBar.getByRole("button", { name: /categories/i })).toBeVisible()
      await expect(tabBar.getByRole("link", { name: "Sell" })).toBeVisible()
      await expect(tabBar.getByTestId("mobile-tab-sell")).toBeVisible()
      await expect(tabBar.getByRole("button", { name: /chat/i })).toBeVisible()
      await expect(tabBar.getByTestId("mobile-tab-profile")).toBeVisible()

      const dockBox = await dock.boundingBox()
      const viewport = page.viewportSize()
      expect(dockBox).toBeTruthy()
      expect(viewport).toBeTruthy()
      const dockBottom = (dockBox?.y ?? 0) + (dockBox?.height ?? 0)
      expect(Math.abs(dockBottom - (viewport?.height ?? 0))).toBeLessThanOrEqual(2)
      expect(Math.abs(dockBox?.x ?? 0)).toBeLessThanOrEqual(2)
      expect(Math.abs((dockBox?.width ?? 0) - (viewport?.width ?? 0))).toBeLessThanOrEqual(2)
    })

    test("categories tab opens global category drawer", async ({ page }) => {
      await page.goto("/en")
      await dismissOverlays(page)
      
      // Click categories button in tab bar
      const tabBar = page.getByTestId("mobile-tab-bar")
      await tabBar.getByRole("button", { name: /categories/i }).click()
      
      // Category drawer should open
      const categoryDrawer = page.getByTestId("mobile-category-drawer")
      await expect(categoryDrawer).toBeVisible()
      await expect(categoryDrawer.getByRole("textbox", { name: /search categories/i })).toBeVisible()
      
      // Close drawer
      await categoryDrawer.getByRole("button", { name: /close/i }).click()
      await expect(categoryDrawer).not.toBeVisible()
    })

    test("profile tab opens auth drawer for guests with 44px auth controls", async ({ page }) => {
      await page.goto("/en")
      await dismissOverlays(page)

      const tabBar = page.getByTestId("mobile-tab-bar")
      await tabBar.getByTestId("mobile-tab-profile").click()

      const authDrawer = page.getByTestId("mobile-auth-drawer")
      await expect(authDrawer).toBeVisible()
      await expect(page).not.toHaveURL(/auth\/login/)
      await expect(authDrawer.locator('input[type="email"], input#email').first()).toBeVisible()
      await expect(authDrawer.locator('input[type="password"], input#password').first()).toBeVisible()

      const authTabs = authDrawer.getByRole("tab")
      await expect(authTabs).toHaveCount(2)
      for (let i = 0; i < 2; i += 1) {
        const box = await authTabs.nth(i).boundingBox()
        expect(box).toBeTruthy()
        expect(box!.height).toBeGreaterThanOrEqual(44)
      }

      const signInButton = authDrawer.getByRole("button", { name: /sign in|вход/i }).first()
      const signInButtonBox = await signInButton.boundingBox()
      expect(signInButtonBox).toBeTruthy()
      expect(signInButtonBox!.height).toBeGreaterThanOrEqual(44)
    })

    test("profile tab opens account drawer for authenticated users with buttonized quick links", async ({ page }) => {
      const creds = getTestUserCredentials()
      test.skip(!creds, "Set TEST_USER_EMAIL/TEST_USER_PASSWORD to run authenticated account drawer test")

      await loginWithPassword(page, creds!)
      await page.goto("/en")
      await dismissOverlays(page)

      const tabBar = page.getByTestId("mobile-tab-bar")
      await tabBar.getByTestId("mobile-tab-profile").click()

      const accountDrawer = page.getByTestId("mobile-account-drawer")
      await expect(accountDrawer).toBeVisible()

      const quickLinks = accountDrawer.getByTestId("account-drawer-quick-link")
      await expect(quickLinks.first()).toBeVisible()
      const quickLinkCount = await quickLinks.count()
      expect(quickLinkCount).toBeGreaterThanOrEqual(5)

      const sampleCount = Math.min(5, quickLinkCount)
      for (let index = 0; index < sampleCount; index += 1) {
        const quickLinkBox = await quickLinks.nth(index).boundingBox()
        expect(quickLinkBox).toBeTruthy()
        expect(quickLinkBox!.height).toBeGreaterThanOrEqual(44)
      }

      const firstQuickLinkClasses = await quickLinks.first().getAttribute("class")
      expect(firstQuickLinkClasses ?? "").toContain("focus-visible:ring-focus-ring")
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
      
      const categoriesRow = page.getByTestId("home-category-circles")
      await expect(categoriesRow).toBeVisible({ timeout: 15000 })
      await expect(page.getByTestId("home-section-newest")).toBeVisible({ timeout: 15000 })
    })

    test("category list is scrollable on mobile", async ({ page }) => {
      await page.goto("/en")
      
      // Wait for categories to load
      await page.waitForLoadState("networkidle")
      
      const categoriesRow = page.getByTestId("home-category-circles")
      await expect(categoriesRow).toBeVisible({ timeout: 15000 })
      const categoryButtons = categoriesRow.getByRole("button")
      const tabCount = await categoryButtons.count()
      expect(tabCount).toBeGreaterThan(3)

      const sampleCount = Math.min(5, tabCount)
      for (let index = 0; index < sampleCount; index += 1) {
        const buttonBox = await categoryButtons.nth(index).boundingBox()
        expect(buttonBox).toBeTruthy()
        expect(buttonBox!.height).toBeGreaterThanOrEqual(44)
        expect(buttonBox!.width).toBeGreaterThanOrEqual(44)
      }
    })

    test("home product cards render on mobile", async ({ page }) => {
      await page.goto("/en")
      
      // Wait for listings to load
      await page.waitForLoadState("networkidle")
      
      await expect(page.getByTestId("home-section-newest")).toBeVisible({ timeout: 15000 })
      const productLinks = page.locator('a[aria-label^="Open product:"]')
      await expect(productLinks.first()).toBeVisible({ timeout: 15000 })
    })

    test("sticky category pills switch to tokenized grey inactive style", async ({ page }) => {
      await page.goto("/en")
      await page.waitForLoadState("networkidle")

      await page.evaluate(() => {
        window.scrollTo({ top: 900, behavior: "auto" })
      })

      const stickyPills = page.getByTestId("home-sticky-category-pills")
      await expect(stickyPills).toBeVisible({ timeout: 15000 })

      const inactivePill = page.getByTestId("home-sticky-pill-inactive").first()
      await expect(inactivePill).toBeVisible({ timeout: 15000 })

      const className = (await inactivePill.getAttribute("class")) ?? ""
      expect(className).toContain("bg-surface-subtle")
      expect(className).not.toContain("bg-background")

      const inactivePillBox = await inactivePill.boundingBox()
      expect(inactivePillBox).toBeTruthy()
      expect(inactivePillBox!.height).toBeGreaterThanOrEqual(44)
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
      await page.goto(MOBILE_PRODUCT_PATH)
      
      // Wait for page to load
      await page.waitForLoadState("networkidle")
      
      // Product content should be visible (use first() to handle duplicates)
      await expect(page.locator("#main-content").first()).toBeVisible({ timeout: 30000 })

      // Mobile PDP should show at least one primary action in sticky bottom bar.
      await expect(
        page.getByRole("button", {
          name: /add|chat|contact seller|contact agent|call seller|schedule visit/i,
        }).first()
      ).toBeVisible({ timeout: 15_000 })
      
      // Mobile tab bar should be hidden on product page (has sticky buy box instead)
      await expect(page.getByTestId("mobile-tab-bar")).not.toBeVisible()
    })

    test("product page has back button on mobile", async ({ page }) => {
      // Navigate to product page
      await page.goto(MOBILE_PRODUCT_PATH)
      
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
      await page.goto(MOBILE_PRODUCT_PATH)
      
      // Wait for page to load
      await page.waitForLoadState("networkidle")
      
      // Wait for image to load (may be lazy loaded)
      await page.waitForTimeout(2000)
      
      // Hero gallery image should be present (or explicit no-image fallback).
      const productImage = page.locator('#main-content img').first()
      const noImageFallback = page.getByText(/no image|няма снимка/i).first()
      await expect(productImage.or(noImageFallback)).toBeVisible({ timeout: 15000 })
    })

    test("add to cart button is visible on mobile product page", async ({ page }) => {
      await page.goto(MOBILE_PRODUCT_PATH)

      // Category-adaptive bottom bar should expose at least one commerce/contact action.
      await expect(
        page.getByRole("button", {
          name: /add|chat|contact seller|contact agent|call seller|schedule visit/i,
        }).first()
      ).toBeVisible({ timeout: 15000 })
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
      const filterButton = page.getByTestId("mobile-filter-sort-bar").getByRole("button", { name: /filter|филтри/i })
      await expect(filterButton).toBeVisible({ timeout: 10000 })
    })

    test("sort dropdown works on mobile", async ({ page }) => {
      await page.goto("/en/search?q=phone")
      
      // Sort button/dropdown should be visible
      const sortButton = page.getByTestId("mobile-filter-sort-bar").getByRole("button", { name: /sort|подреди/i }).or(
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
      await expect(page.locator("main").first()).toBeVisible()
      
      // Products or subcategories should be visible
      const content = page.locator("main").first()
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
      
      // Check that high-frequency navigation controls are at least 44px.
      const buttons = tabBar.locator("a, button")
      const count = await buttons.count()
      
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i)
        const box = await button.boundingBox()
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })

  test.describe("Mobile Browse Flow", () => {
    test("quick view opens from product card and closing preserves scroll context", async ({ page }) => {
      await page.goto("/en")
      await dismissOverlays(page)
      await page.waitForLoadState("networkidle")

      await page.evaluate(() => window.scrollTo(0, 520))
      await page.waitForTimeout(250)
      const beforeOpen = await page.evaluate(() => window.scrollY)

      const productHrefInViewport = await page.evaluate(() => {
        const links = [
          ...document.querySelectorAll<HTMLAnchorElement>('a[data-slot="product-card-link"]'),
        ]
        const visibleLink = links.find((link) => {
          const rect = link.getBoundingClientRect()
          return rect.top >= 0 && rect.bottom <= window.innerHeight
        })
        return visibleLink?.getAttribute("href") ?? null
      })

      expect(productHrefInViewport).toBeTruthy()

      const visibleProductCardLink = page
        .locator(`a[data-slot="product-card-link"][href="${productHrefInViewport}"]`)
        .first()
      await expect(visibleProductCardLink).toBeVisible({ timeout: 15_000 })
      await visibleProductCardLink.click()

      const quickViewDrawer = page.locator('[data-slot="drawer-content"]').first()
      await expect(quickViewDrawer).toBeVisible({ timeout: 15_000 })
      await expect(
        quickViewDrawer.getByRole("button", { name: /buy now|купи сега/i }).first()
      ).toBeVisible({ timeout: 15_000 })

      await quickViewDrawer.getByRole("button", { name: /close|затвори/i }).first().click()
      await expect(quickViewDrawer).toBeHidden({ timeout: 15_000 })
      await expect.poll(
        async () => {
          const afterClose = await page.evaluate(() => window.scrollY)
          return Math.abs(afterClose - beforeOpen)
        },
        { timeout: 3_000, intervals: [100, 200, 400] }
      ).toBeLessThan(12)
    })

    test("contextual category search keeps category context in URL", async ({ page }) => {
      await page.goto("/en/categories/fashion")
      await dismissOverlays(page)
      await page.waitForLoadState("networkidle")

      const searchLink = page.locator('a[aria-label*="Search"], a[aria-label*="Търсене"]').first()
      const hasSearchLink = await searchLink.isVisible({ timeout: 15_000 }).catch(() => false)
      test.skip(!hasSearchLink, "Contextual header search link is not available for this route setup")

      const href = await searchLink.getAttribute("href")
      expect(href).toBeTruthy()
      expect(href ?? "").toContain("/search")
      expect(href ?? "").toContain("category=")
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

      // Footer should expose at least one actionable element.
      await expect(footer.locator("a:visible, button:visible").first()).toBeVisible()
    })
  })

  test.describe("Bulgarian Locale Mobile", () => {
    test("Bulgarian homepage renders correctly on mobile", async ({ page }) => {
      await page.goto("/bg")
      
      // Wait for page to load
      await page.waitForLoadState("networkidle")
      
      // Main content should be visible - use #main-content to avoid multiple main elements
      await expect(page.locator("#main-content")).toBeVisible({ timeout: 15000 })
      
      // Mobile tab bar should render with Bulgarian labels.
      const mobileTabBar = page.getByTestId("mobile-tab-bar")
      await expect(mobileTabBar).toBeVisible()
      await expect(mobileTabBar.getByText(/начало/i)).toBeVisible()
      
      // No horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })
      expect(hasOverflow).toBe(false)
    })
  })
})
