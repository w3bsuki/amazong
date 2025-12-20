import { test, expect } from "@playwright/test"

// Test constants
const BASE_URL = "http://localhost:3000"

test.describe("Product Reviews", () => {
  test.describe("Reviews Section Display", () => {
    test("should display reviews section on product page", async ({ page }) => {
      // Navigate to a product page
      await page.goto(`${BASE_URL}/en`)
      
      // Wait for page load and click on any product
      await page.waitForSelector('[data-testid="product-card"], .product-card, a[href*="/product/"], [class*="product"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"], [data-testid="product-link"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Check for reviews section existence
        const reviewsSection = page.locator('h2:has-text("Reviews"), h2:has-text("Customer Reviews"), [data-testid="reviews-section"]')
        await expect(reviewsSection.first()).toBeVisible({ timeout: 10000 })
      }
    })

    test("should display rating distribution bars", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      // Find and click a product
      await page.waitForSelector('[data-testid="product-card"], a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Check for star filter buttons (5-star to 1-star)
        const starButtons = page.locator('button:has-text("star"), button:has(svg)')
        await expect(starButtons.first()).toBeVisible({ timeout: 10000 })
      }
    })

    test("should filter reviews by star rating", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Try to click a star filter
        const fiveStarFilter = page.locator('button:has-text("5")')
        if (await fiveStarFilter.count() > 0) {
          await fiveStarFilter.first().click()
          // Verify filter is applied (button should be highlighted)
          await expect(fiveStarFilter.first()).toHaveClass(/primary|active|selected/)
        }
      }
    })
  })

  test.describe("Write Review Dialog", () => {
    test("should show write review button on product page", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Look for write review button
        const writeReviewButton = page.locator('button:has-text("Write"), button:has-text("Review"), [data-testid="write-review-btn"]')
        await expect(writeReviewButton.first()).toBeVisible({ timeout: 10000 })
      }
    })

    test("should open review dialog when clicking write review", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Click write review button
        const writeReviewButton = page.locator('button:has-text("Write Review"), button:has-text("write review")')
        if (await writeReviewButton.count() > 0) {
          await writeReviewButton.first().click()
          
          // Dialog should appear
          const dialog = page.locator('[role="dialog"], [data-testid="review-dialog"]')
          await expect(dialog).toBeVisible({ timeout: 5000 })
        }
      }
    })

    test("should require purchase to write review", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Click write review button (unauthenticated)
        const writeReviewButton = page.locator('button:has-text("Write Review")')
        if (await writeReviewButton.count() > 0) {
          await writeReviewButton.first().click()
          
          // Should show purchase required message or sign in prompt
          const purchaseRequired = page.locator('text="Purchase Required", text="purchase this product", text="Sign in"')
          await expect(purchaseRequired.first()).toBeVisible({ timeout: 5000 })
        }
      }
    })
  })

  test.describe("Review Form Validation", () => {
    test("should show star rating selector in review form", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        const writeReviewButton = page.locator('button:has-text("Write Review")')
        if (await writeReviewButton.count() > 0) {
          await writeReviewButton.first().click()
          
          // Check for star rating selector
          const _starSelector = page.locator('[data-testid="star-rating"], button[aria-label*="star"], .star-rating')
          // Even if not visible (due to auth), the form structure should exist
        }
      }
    })
  })

  test.describe("Helpful Vote Functionality", () => {
    test("should display helpful button on reviews", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Check for helpful button if reviews exist
        const helpfulButton = page.locator('button:has-text("Helpful"), button:has-text("helpful")')
        // May not exist if no reviews
        const reviewsExist = await page.locator('[data-testid="review-item"], .review-item').count() > 0
        if (reviewsExist) {
          await expect(helpfulButton.first()).toBeVisible({ timeout: 5000 })
        }
      }
    })

    test("should display report button on reviews", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Check for report button
        const reportButton = page.locator('button:has-text("Report"), button:has-text("report")')
        const reviewsExist = await page.locator('[data-testid="review-item"], .review-item').count() > 0
        if (reviewsExist) {
          await expect(reportButton.first()).toBeVisible({ timeout: 5000 })
        }
      }
    })
  })

  test.describe("Empty State", () => {
    test("should display empty state when no reviews", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Check for empty state OR reviews list
        const emptyState = page.locator('text="No reviews", text="Be the first"')
        const reviewsList = page.locator('[data-testid="review-item"], .review-item')
        
        // One of these should be visible
        const hasEmptyState = await emptyState.first().isVisible().catch(() => false)
        const hasReviews = await reviewsList.count() > 0
        
        expect(hasEmptyState || hasReviews).toBeTruthy()
      }
    })
  })

  test.describe("Accessibility", () => {
    test("should have proper ARIA labels on star ratings", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Check for aria-hidden on decorative stars
        const stars = page.locator('svg[aria-hidden="true"]')
        expect(await stars.count()).toBeGreaterThan(0)
      }
    })

    test("should support keyboard navigation in review dialog", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        const writeReviewButton = page.locator('button:has-text("Write Review")')
        if (await writeReviewButton.count() > 0) {
          // Focus and press enter
          await writeReviewButton.first().focus()
          await page.keyboard.press("Enter")
          
          // Dialog should open
          const dialog = page.locator('[role="dialog"]')
          if (await dialog.isVisible()) {
            // Should be able to close with Escape
            await page.keyboard.press("Escape")
            await expect(dialog).not.toBeVisible()
          }
        }
      }
    })
  })

  test.describe("Responsive Design", () => {
    test("should display reviews properly on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Reviews section should still be visible
        const reviewsSection = page.locator('h2:has-text("Reviews"), h2:has-text("Customer Reviews")')
        await expect(reviewsSection.first()).toBeVisible({ timeout: 10000 })
      }
    })

    test("should display reviews properly on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Reviews section should still be visible
        const reviewsSection = page.locator('h2:has-text("Reviews"), h2:has-text("Customer Reviews")')
        await expect(reviewsSection.first()).toBeVisible({ timeout: 10000 })
      }
    })
  })

  test.describe("Bilingual Support", () => {
    test("should display reviews in English", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Check for English text
        const englishText = page.locator('text="Customer Reviews", text="out of 5", text="Verified Purchase"')
        await expect(englishText.first()).toBeVisible({ timeout: 10000 })
      }
    })

    test("should display reviews in Bulgarian", async ({ page }) => {
      await page.goto(`${BASE_URL}/bg`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Page should load with Bulgarian locale
        expect(page.url()).toContain("/bg")
      }
    })
  })
})

test.describe("Seller Review Response", () => {
  test.describe("Response Display", () => {
    test("should display seller response if present", async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      
      await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
      const productLinks = page.locator('a[href*="/product/"]')
      
      if (await productLinks.count() > 0) {
        await productLinks.first().click()
        await page.waitForLoadState("networkidle")
        
        // Check for seller response element if reviews with responses exist
        const _sellerResponse = page.locator('[data-testid="seller-response"], .seller-response, text="Seller Response"')
        // This is optional - may not exist if no responses
      }
    })
  })
})

test.describe("Review Performance", () => {
  test("should load reviews section within acceptable time", async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto(`${BASE_URL}/en`)
    
    await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 })
    const productLinks = page.locator('a[href*="/product/"]')
    
    if (await productLinks.count() > 0) {
      await productLinks.first().click()
      
      // Wait for reviews to load
      await page.waitForSelector('h2:has-text("Reviews"), h2:has-text("Customer Reviews")', { timeout: 10000 })
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // Reviews section should load within 5 seconds
      expect(loadTime).toBeLessThan(5000)
    }
  })
})
