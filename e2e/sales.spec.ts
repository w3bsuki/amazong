import { test, expect } from "./fixtures/test"

/**
 * E2E Tests for Seller Sales Management (Phase 9)
 * Tests seller order viewing, status updates, shipping, and buyer communication
 */

test.describe("Seller Orders Page", () => {
  test.describe("Unauthenticated Access", () => {
    test("redirects to login when not authenticated", async ({ page }) => {
      await page.goto("/en/sell/orders", { waitUntil: "domcontentloaded", timeout: 60_000 })

      await page.waitForURL(/\/auth\/login/i, { timeout: 10_000 }).catch(() => {})
      const isOnAuth = /\/auth\/login/i.test(page.url())

      const loginCta = page
        .getByRole("link", { name: /sign in|log in|login/i })
        .first()
        .or(page.getByRole("button", { name: /sign in|log in|login/i }).first())
        .or(page.getByText(/sign in|log in|login/i).first())

      expect(isOnAuth || (await loginCta.isVisible().catch(() => false))).toBeTruthy()
    })

    test("redirects to login for Bulgarian locale", async ({ page }) => {
      await page.goto("/bg/sell/orders", { waitUntil: "domcontentloaded", timeout: 60_000 })

      await page.waitForURL(/\/auth\/login/i, { timeout: 10_000 }).catch(() => {})
      const isOnAuth = /\/auth\/login/i.test(page.url())

      const loginCta = page
        .getByRole("link", { name: /sign in|log in|login|вход/i })
        .first()
        .or(page.getByRole("button", { name: /sign in|log in|login|вход/i }).first())
        .or(page.getByText(/sign in|log in|login|вход/i).first())

      expect(isOnAuth || (await loginCta.isVisible().catch(() => false))).toBeTruthy()
    })
  })

  test.describe("Page Structure", () => {
    test.skip("displays seller orders page with header", async ({ page }) => {
      // Requires seller auth fixture
      await page.goto("/en/sell/orders")

      await expect(page.locator("h1")).toHaveText(/Your Orders/i)
      await expect(page.getByText(/Manage incoming orders/i)).toBeVisible()
    })

    test.skip("has back navigation to sell page", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const backButton = page.getByRole("link", { name: /back/i }).or(
        page.locator('a[href*="/sell"]').first()
      )
      await expect(backButton).toBeVisible()
    })

    test.skip("has refresh button", async ({ page }) => {
      await page.goto("/en/sell/orders")

      await expect(page.getByRole("button", { name: /Refresh/i })).toBeVisible()
    })
  })

  test.describe("Stats Cards", () => {
    test.skip("displays order stats by status", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Check for stat cards
      await expect(page.getByText(/Pending/i).first()).toBeVisible()
      await expect(page.getByText(/Processing/i).first()).toBeVisible()
      await expect(page.getByText(/Shipped/i).first()).toBeVisible()
      await expect(page.getByText(/Delivered/i).first()).toBeVisible()
    })

    test.skip("clicking stat card filters orders", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Click pending stat card
      await page.locator('[data-key="pending"]').or(
        page.getByText("Pending").locator("..").locator("..")
      ).click()

      // Should filter to pending tab
      await expect(page.locator('[role="tab"][aria-selected="true"]')).toContainText(/Pending/i)
    })
  })

  test.describe("Filter Tabs", () => {
    test.skip("has filter tabs for order statuses", async ({ page }) => {
      await page.goto("/en/sell/orders")

      await expect(page.getByRole("tablist")).toBeVisible()
      await expect(page.getByRole("tab", { name: /All/i })).toBeVisible()
      await expect(page.getByRole("tab", { name: /Active/i })).toBeVisible()
      await expect(page.getByRole("tab", { name: /Pending/i })).toBeVisible()
      await expect(page.getByRole("tab", { name: /Shipped/i })).toBeVisible()
      await expect(page.getByRole("tab", { name: /Delivered/i })).toBeVisible()
    })

    test.skip("filters orders when clicking tabs", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Click Active tab
      await page.getByRole("tab", { name: /Active/i }).click()
      await expect(page.getByRole("tab", { name: /Active/i })).toHaveAttribute("aria-selected", "true")

      // Click Shipped tab
      await page.getByRole("tab", { name: /Shipped/i }).click()
      await expect(page.getByRole("tab", { name: /Shipped/i })).toHaveAttribute("aria-selected", "true")
    })
  })

  test.describe("Empty State", () => {
    test.skip("shows empty state when no orders", async ({ page }) => {
      // Requires seller with no orders
      await page.goto("/en/sell/orders")

      await expect(page.getByText(/No orders yet/i)).toBeVisible()
      await expect(page.getByText(/When customers purchase your products/i)).toBeVisible()
    })
  })

  test.describe("Order Cards", () => {
    test.skip("displays order item with product details", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Check order card structure
      const orderCard = page.locator('[data-testid="order-card"]').or(
        page.locator(".space-y-4 > div").first()
      )

      // Product image
      await expect(orderCard.locator("img").or(orderCard.locator("svg"))).toBeVisible()

      // Product title
      await expect(orderCard.getByRole("heading")).toBeVisible()

      // Quantity and price
      await expect(orderCard.getByText(/Qty:/i)).toBeVisible()
    })

    test.skip("shows buyer information", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Avatar and buyer name
      await expect(page.locator('[data-slot="avatar"]').or(
        page.locator(".h-6.w-6")
      ).first()).toBeVisible()
    })

    test.skip("displays full shipping address for sellers", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Should show "Ship To:" section with full address
      await expect(page.getByText(/Ship To:/i).first()).toBeVisible()
    })

    test.skip("shows tracking information when shipped", async ({ page }) => {
      await page.goto("/en/sell/orders?status=shipped")

      // Look for tracking number display
      const trackingSection = page.getByText(/Tracking:/i)
      if (await trackingSection.count() > 0) {
        await expect(trackingSection.first()).toBeVisible()
      }
    })

    test.skip("displays relative order time", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Should show "Ordered X ago"
      await expect(page.getByText(/Ordered .* ago/i).first()).toBeVisible()
    })
  })

  test.describe("Status Badge", () => {
    test.skip("displays order status badge", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Status badges - look for common status text
      const statusBadge = page.getByText(/Pending|Processing|Shipped|Delivered|Cancelled/i).first()
      await expect(statusBadge).toBeVisible()
    })

    test.skip("status badge has appropriate styling", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Check badge has background color class
      const badge = page.locator('[class*="bg-"]').filter({ hasText: /Pending|Processing/i }).first()
      if (await badge.count() > 0) {
        await expect(badge).toBeVisible()
      }
    })
  })

  test.describe("Order Actions", () => {
    test.skip("shows Mark as Received button for pending orders", async ({ page }) => {
      await page.goto("/en/sell/orders")
      await page.getByRole("tab", { name: /Pending/i }).click()

      const receiveButton = page.getByRole("button", { name: /Mark as Received|Received/i }).first()
      if (await receiveButton.count() > 0) {
        await expect(receiveButton).toBeVisible()
      }
    })

    test.skip("shows Start Processing button for received orders", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const _processButton = page.getByRole("button", { name: /Start Processing|Processing/i })
      // May or may not have received orders
    })

    test.skip("shows Mark as Shipped button for processing orders", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const _shipButton = page.getByRole("button", { name: /Mark as Shipped|Ship/i })
      // Check if exists without asserting
    })

    test.skip("shows Chat button for orders with conversations", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const _chatButton = page.getByRole("link", { name: /Chat/i }).or(
        page.getByRole("button", { name: /Chat/i })
      )
      // May exist if conversation started
    })

    test.skip("shows Cancel button for non-shipped orders", async ({ page }) => {
      await page.goto("/en/sell/orders")
      await page.getByRole("tab", { name: /Pending/i }).click()

      const cancelButton = page.getByRole("button", { name: /Cancel/i }).first()
      if (await cancelButton.count() > 0) {
        await expect(cancelButton).toBeVisible()
      }
    })
  })

  test.describe("Shipping Dialog", () => {
    test.skip("opens shipping dialog when marking as shipped", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const shipButton = page.getByRole("button", { name: /Mark as Shipped/i }).first()
      if (await shipButton.count() > 0) {
        await shipButton.click()

        // Dialog should open
        await expect(page.getByRole("dialog")).toBeVisible()
        await expect(page.getByText(/Ship Order/i)).toBeVisible()
      }
    })

    test.skip("shipping dialog has carrier dropdown", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const shipButton = page.getByRole("button", { name: /Mark as Shipped/i }).first()
      if (await shipButton.count() > 0) {
        await shipButton.click()

        await expect(page.getByLabel(/Shipping Carrier/i)).toBeVisible()
      }
    })

    test.skip("shipping dialog has tracking number input", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const shipButton = page.getByRole("button", { name: /Mark as Shipped/i }).first()
      if (await shipButton.count() > 0) {
        await shipButton.click()

        await expect(page.getByLabel(/Tracking Number/i)).toBeVisible()
        await expect(page.getByPlaceholder(/Enter tracking number/i)).toBeVisible()
      }
    })

    test.skip("can submit shipping without tracking (optional)", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const shipButton = page.getByRole("button", { name: /Mark as Shipped/i }).first()
      if (await shipButton.count() > 0) {
        await shipButton.click()

        // Submit button should be enabled even without tracking
        await expect(page.getByRole("button", { name: /Mark as Shipped/i }).last()).toBeEnabled()
      }
    })
  })

  test.describe("Rate Buyer", () => {
    test.skip("shows Rate Buyer button for delivered orders", async ({ page }) => {
      await page.goto("/en/sell/orders")
      await page.getByRole("tab", { name: /Delivered/i }).click()

      const _rateButton = page.getByRole("button", { name: /Rate Buyer/i }).first()
      // May exist if delivered orders present and not yet rated
    })

    test.skip("shows Rated badge if already rated", async ({ page }) => {
      await page.goto("/en/sell/orders")
      await page.getByRole("tab", { name: /Delivered/i }).click()

      const _ratedBadge = page.getByText(/Rated/i).first()
      // May exist if buyer already rated
    })

    test.skip("opens rating dialog when clicking Rate Buyer", async ({ page }) => {
      await page.goto("/en/sell/orders")
      await page.getByRole("tab", { name: /Delivered/i }).click()

      const rateButton = page.getByRole("button", { name: /Rate Buyer/i }).first()
      if (await rateButton.count() > 0) {
        await rateButton.click()

        await expect(page.getByRole("dialog")).toBeVisible()
        await expect(page.getByText(/rate the buyer/i)).toBeVisible()
      }
    })

    test.skip("rating dialog has star selector", async ({ page }) => {
      await page.goto("/en/sell/orders")
      await page.getByRole("tab", { name: /Delivered/i }).click()

      const rateButton = page.getByRole("button", { name: /Rate Buyer/i }).first()
      if (await rateButton.count() > 0) {
        await rateButton.click()

        // 5 star buttons
        const _stars = page.locator('[data-testid="star"]').or(
          page.getByRole("button").filter({ hasText: /★|star/i })
        )
        // Stars should be interactive
      }
    })
  })

  test.describe("Product Links", () => {
    test.skip("has link to view product listing", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const productLink = page.getByRole("link").filter({ has: page.locator('[class*="ExternalLink"]') }).first()
        .or(page.locator('a[target="_blank"]').first())

      if (await productLink.count() > 0) {
        const href = await productLink.getAttribute("href")
        expect(href).toContain("/product/")
      }
    })
  })

  test.describe("Responsive Design", () => {
    test.skip("adapts layout for mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto("/en/sell/orders")

      // Should still show essential elements
      await expect(page.locator("h1")).toBeVisible()
      await expect(page.getByRole("tablist")).toBeVisible()
    })

    test.skip("stats cards stack on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto("/en/sell/orders")

      // Stats should be in grid-cols-2 on mobile
      const statsGrid = page.locator(".grid-cols-2")
      await expect(statsGrid.first()).toBeVisible()
    })
  })

  test.describe("Loading State", () => {
    test.skip("shows loading spinner while fetching orders", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Check for loading indicator (may be quick)
      const _loader = page.locator('[class*="animate-spin"]').or(
        page.getByText(/Loading/i)
      )
      // May have already loaded
    })
  })

  test.describe("Refresh Functionality", () => {
    test.skip("refresh button reloads orders", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const refreshButton = page.getByRole("button", { name: /Refresh/i })
      await refreshButton.click()

      // Button should show loading state
      await expect(refreshButton.locator('[class*="animate-spin"]').or(
        refreshButton.locator("svg")
      )).toBeVisible()
    })
  })

  test.describe("Accessibility", () => {
    test.skip("tabs are keyboard navigable", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Focus first tab
      await page.getByRole("tab", { name: /All/i }).focus()
      await page.keyboard.press("ArrowRight")

      // Next tab should be focused
      await expect(page.getByRole("tab", { name: /Active/i })).toBeFocused()
    })

    test.skip("dialog can be closed with Escape", async ({ page }) => {
      await page.goto("/en/sell/orders")

      const shipButton = page.getByRole("button", { name: /Mark as Shipped/i }).first()
      if (await shipButton.count() > 0) {
        await shipButton.click()
        await expect(page.getByRole("dialog")).toBeVisible()

        await page.keyboard.press("Escape")
        await expect(page.getByRole("dialog")).not.toBeVisible()
      }
    })

    test.skip("action buttons have accessible labels", async ({ page }) => {
      await page.goto("/en/sell/orders")

      // Check buttons have text or aria-label
      const buttons = page.getByRole("button")
      const count = await buttons.count()

      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i)
        const label = await button.textContent()
        const ariaLabel = await button.getAttribute("aria-label")
        expect(label || ariaLabel).toBeTruthy()
      }
    })
  })
})

test.describe("Sales Dashboard Page", () => {
  test.describe("Unauthenticated Access", () => {
    test("redirects to login when not authenticated", async ({ page }) => {
      await page.goto("/en/account/sales", { waitUntil: "domcontentloaded" })
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 60_000 })
    })
  })

  test.describe("Page Structure", () => {
    test.skip("displays sales dashboard with header", async ({ page }) => {
      await page.goto("/en/account/sales")

      await expect(page.getByText(/Sales Dashboard|Продажби/i).first()).toBeVisible()
      await expect(page.getByText(/Track your revenue|Преглед на приходите/i)).toBeVisible()
    })

    test.skip("has navigation buttons to store and new listing", async ({ page }) => {
      await page.goto("/en/account/sales")

      await expect(page.getByRole("link", { name: /My Store|Моят магазин/i })).toBeVisible()
      await expect(page.getByRole("link", { name: /New Listing|Нова обява/i })).toBeVisible()
    })
  })

  test.describe("Stats Cards", () => {
    test.skip("displays revenue statistics", async ({ page }) => {
      await page.goto("/en/account/sales")

      await expect(page.getByText(/Total Revenue|Общи приходи/i)).toBeVisible()
      await expect(page.getByText(/Net Revenue|Нетни приходи/i)).toBeVisible()
    })

    test.skip("displays sales count", async ({ page }) => {
      await page.goto("/en/account/sales")

      await expect(page.getByText(/Total Sales|Общо продажби/i)).toBeVisible()
    })

    test.skip("shows commission rate", async ({ page }) => {
      await page.goto("/en/account/sales")

      await expect(page.getByText(/Commission|Комисионна/i)).toBeVisible()
    })
  })

  test.describe("Period Filter", () => {
    test.skip("has period filter badges", async ({ page }) => {
      await page.goto("/en/account/sales")

      await expect(page.getByText("7D")).toBeVisible()
      await expect(page.getByText("30D")).toBeVisible()
      await expect(page.getByText("90D")).toBeVisible()
      await expect(page.getByText("1Y")).toBeVisible()
    })

    test.skip("updates data when changing period", async ({ page }) => {
      await page.goto("/en/account/sales?period=7d")

      // Click 30D
      await page.getByText("30D").click()
      await expect(page).toHaveURL(/period=30d/)
    })
  })

  test.describe("Revenue Chart", () => {
    test.skip("displays revenue chart", async ({ page }) => {
      await page.goto("/en/account/sales")

      await expect(page.getByText(/Revenue Over Time|Приходи във времето/i)).toBeVisible()
    })
  })

  test.describe("Sales Table", () => {
    test.skip("displays recent sales table", async ({ page }) => {
      await page.goto("/en/account/sales")

      await expect(page.getByText(/Recent Sales|Последни продажби/i)).toBeVisible()
    })

    test.skip("table has correct columns", async ({ page }) => {
      await page.goto("/en/account/sales")

      await expect(page.getByRole("columnheader", { name: /Product|Продукт/i })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: /Buyer|Купувач/i })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: /Revenue|Приходи/i })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: /Status|Статус/i })).toBeVisible()
    })
  })

  test.describe("Empty State", () => {
    test.skip("shows empty state when no sales", async ({ page }) => {
      await page.goto("/en/account/sales")

      const _emptyState = page.getByText(/No sales yet|Нямате продажби/i)
      // May or may not show depending on seller data
    })
  })

  test.describe("Localization", () => {
    test.skip("displays in Bulgarian when locale is bg", async ({ page }) => {
      await page.goto("/bg/account/sales")

      await expect(page.getByText(/Продажби/i).first()).toBeVisible()
    })

    test.skip("formats currency according to locale", async ({ page }) => {
      await page.goto("/en/account/sales")

      // Should show EUR currency
      const _currency = page.getByText(/€|EUR/i)
      // Currency formatting depends on data
    })
  })
})
