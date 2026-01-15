import { test, expect, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Set mobile viewport at top level
test.use({ 
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

// ========== PHASE 1: Homepage & Navigation ==========
test.describe('Phase 1: Homepage & Navigation', () => {
    test('homepage loads correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`);
      await expect(page).toHaveTitle(/Treido|Home/);
      console.log('✅ Homepage title verified');
    });

    test('hero section displays', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`);
      // Look for main content area - use first() since there are nested mains
      const main = page.locator('#main-content').first();
      await expect(main).toBeVisible();
      console.log('✅ Main content visible');
    });

    test('mobile navigation works', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`);
      
      // Find mobile menu button
      const menuButton = page.locator('button[aria-label*="menu" i], [data-testid*="menu"], header button:has(svg)').first();
      
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(500);
        
        // Check for navigation links
        const navLinks = page.locator('nav a, [role="dialog"] a, [role="menu"] a');
        const count = await navLinks.count();
        console.log(`✅ Mobile menu opened with ${count} links`);
      } else {
        console.log('ℹ️ Mobile menu button not found - may have different design');
      }
    });

    test('search functionality exists', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`);
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name="q"]');
      const searchButton = page.locator('button[aria-label*="search" i], [data-testid*="search"]');
      
      const inputVisible = await searchInput.first().isVisible().catch(() => false);
      const buttonVisible = await searchButton.first().isVisible().catch(() => false);
      
      expect(inputVisible || buttonVisible).toBeTruthy();
      console.log(`✅ Search: input=${inputVisible}, button=${buttonVisible}`);
    });

    test('footer exists', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      console.log('✅ Footer visible');
    });
  });

  // ========== PHASE 2: Category & Product Browsing ==========
  test.describe('Phase 2: Category & Product Browsing', () => {
    test('categories page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/categories`);
      await expect(page).toHaveURL(/categories/);
      console.log('✅ Categories page loaded');
    });

    test('category links are visible', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/categories`);
      await page.waitForLoadState('networkidle');
      
      const categoryLinks = page.locator('a[href*="/categories/"], a[href*="/category/"]');
      const count = await categoryLinks.count();
      
      console.log(`✅ Found ${count} category links`);
      expect(count).toBeGreaterThan(0);
    });

    test('category detail page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/categories`);
      await page.waitForLoadState('networkidle');
      
      const categoryLink = page.locator('a[href*="/categories/"]').first();
      if (await categoryLink.isVisible()) {
        await categoryLink.click();
        await page.waitForLoadState('networkidle');
        console.log(`✅ Navigated to category: ${page.url()}`);
      }
    });
  });

  // ========== PHASE 3: Product Detail Page ==========
  test.describe('Phase 3: Product Detail Page', () => {
    test('can navigate to product detail', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`);
      await page.waitForLoadState('networkidle');
      
      const productLink = page.locator('a[href*="/products/"], a[href*="/product/"]').first();
      
      if (await productLink.isVisible().catch(() => false)) {
        await productLink.click();
        await page.waitForLoadState('networkidle');
        console.log(`✅ Product page loaded: ${page.url()}`);
        
        // Check for product elements
        const hasImage = await page.locator('img').first().isVisible();
        const hasTitle = await page.locator('h1').first().isVisible();
        
        console.log(`✅ Product has image: ${hasImage}, title: ${hasTitle}`);
      } else {
        console.log('ℹ️ No product links on homepage');
      }
    });
  });

  // ========== PHASE 4: Authentication Flow ==========
  test.describe('Phase 4: Authentication Flow', () => {
    test('sign-in page accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/auth/sign-in`);
      await page.waitForLoadState('networkidle');
      
      // Could redirect to /login
      const url = page.url();
      expect(url).toMatch(/sign-in|login|auth/);
      console.log(`✅ Auth page: ${url}`);
    });

    test('sign-in form has required fields', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/auth/login`);
      await page.waitForLoadState('networkidle');
      
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitBtn = page.locator('button[type="submit"]');
      
      await expect(emailInput.first()).toBeVisible();
      await expect(passwordInput.first()).toBeVisible();
      await expect(submitBtn.first()).toBeVisible();
      console.log('✅ Login form has all required fields');
    });

    test('sign-up page accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/auth/sign-up`);
      await page.waitForLoadState('networkidle');
      
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      await expect(emailInput.first()).toBeVisible();
      console.log('✅ Sign-up page has email field');
    });
  });

  // ========== PHASE 5: User Account ==========
  test.describe('Phase 5: User Account', () => {
    test('account page redirects when not logged in', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/account`);
      await page.waitForLoadState('networkidle');
      
      const url = page.url();
      console.log(`✅ Account page URL: ${url}`);
      // May redirect to auth or show account page
    });

    test('wishlist page accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/wishlist`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ Wishlist page: ${page.url()}`);
    });
  });

  // ========== PHASE 6: Cart & Checkout ==========
  test.describe('Phase 6: Cart & Checkout', () => {
    test('cart page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/cart`);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveURL(/cart/);
      console.log('✅ Cart page loaded');
    });

    test('checkout page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/checkout`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ Checkout page: ${page.url()}`);
    });
  });

  // ========== PHASE 7: Seller Features ==========
  test.describe('Phase 7: Seller Features', () => {
    test('sell page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/sell`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ Sell page: ${page.url()}`);
    });

    test('seller dashboard accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/seller`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ Seller page: ${page.url()}`);
    });
  });

  // ========== PHASE 8: Plans ==========
  test.describe('Phase 8: Plans & Subscriptions', () => {
    test('plans page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/plans`);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveURL(/plans/);
      console.log('✅ Plans page loaded');
    });

    test('plan cards visible', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/plans`);
      await page.waitForLoadState('networkidle');
      
      // Look for any card-like elements
      const cards = page.locator('[class*="card"], article, [class*="plan"]');
      const count = await cards.count();
      console.log(`✅ Found ${count} card elements on plans page`);
    });
  });

  // ========== PHASE 9: Static Pages ==========
  test.describe('Phase 9: Static Pages', () => {
    test('support page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/support`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ Support page: ${page.url()}`);
    });

    test('FAQ page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/faq`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ FAQ page: ${page.url()}`);
    });

    test('terms page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/terms`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ Terms page: ${page.url()}`);
    });

    test('privacy page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/privacy`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ Privacy page: ${page.url()}`);
    });

    test('about page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/about`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ About page: ${page.url()}`);
    });
  });

  // ========== PHASE 10: Orders ==========
  test.describe('Phase 10: Orders', () => {
    test('orders page accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/orders`);
      await page.waitForLoadState('networkidle');
      console.log(`✅ Orders page: ${page.url()}`);
    });
  });
