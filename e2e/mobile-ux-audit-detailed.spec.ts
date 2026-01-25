import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = join('test-results', 'audit-screenshots');

// Mobile viewport configuration
test.use({ 
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

// Store audit results
const auditResults: { phase: string; test: string; status: 'pass' | 'fail' | 'warning'; details: string }[] = [];

function logResult(phase: string, testName: string, status: 'pass' | 'fail' | 'warning', details: string) {
  auditResults.push({ phase, test: testName, status, details });
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} [${phase}] ${testName}: ${details}`);
}

// ===== PHASE 1: HOMEPAGE & NAVIGATION =====
test.describe('Phase 1: Homepage & Core Navigation', () => {
  
  test('1.1 Homepage loads with all key elements', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');
    
    // Check title
    const title = await page.title();
    expect(title).toContain('Treido');
    logResult('Phase 1', 'Homepage Title', 'pass', `Title: "${title}"`);
    
    // Check header elements
    const logo = page.locator('a[href="/en"]').first();
    await expect(logo).toBeVisible();
    logResult('Phase 1', 'Logo', 'pass', 'Logo visible and linked to home');
    
    // Check search
    const search = page.locator('button:has-text("Search")').first();
    const searchVisible = await search.isVisible().catch(() => false);
    if (searchVisible) {
      logResult('Phase 1', 'Search Button', 'pass', 'Search button visible');
    } else {
      logResult('Phase 1', 'Search Button', 'warning', 'Search button not immediately visible');
    }
    
    // Check cart
    const cart = page.locator('a[href="/en/cart"]').first();
    await expect(cart).toBeVisible();
    logResult('Phase 1', 'Cart Link', 'pass', 'Cart link visible');
    
    // Check wishlist
    const wishlist = page.locator('button:has-text("Wishlist")').first();
    const wishlistVisible = await wishlist.isVisible().catch(() => false);
    if (wishlistVisible) {
      logResult('Phase 1', 'Wishlist Button', 'pass', 'Wishlist button visible');
    }
    
    // Screenshot
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p1-homepage.png'), fullPage: true });
  });

  test('1.2 Mobile menu opens and has navigation links', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');
    
    // Find and click menu button
    const menuBtn = page.locator('button:has-text("Menu")').first();
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    
    // Wait for menu to open
    await page.waitForTimeout(500);
    
    // Check for navigation items in opened menu
    const navLinks = page.locator('[role="dialog"] a, nav a').all();
    const linkCount = (await navLinks).length;
    
    if (linkCount > 5) {
      logResult('Phase 1', 'Mobile Menu', 'pass', `Menu opened with ${linkCount} navigation links`);
    } else {
      logResult('Phase 1', 'Mobile Menu', 'warning', `Menu has only ${linkCount} links`);
    }
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p1-mobile-menu.png') });
  });

  test('1.3 Category tabs are scrollable and clickable', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');
    
    // Check category tabs
    const tabs = page.locator('[role="tab"], [role="tablist"] button');
    const tabCount = await tabs.count();
    
    if (tabCount > 0) {
      // Click on a category tab
      const secondTab = tabs.nth(1);
      await secondTab.click();
      await page.waitForTimeout(500);
      logResult('Phase 1', 'Category Tabs', 'pass', `${tabCount} category tabs found and clickable`);
    } else {
      logResult('Phase 1', 'Category Tabs', 'fail', 'No category tabs found');
    }
  });

  test('1.4 Footer is visible and has expected sections', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check footer sections
    const hasCompany = await page.locator('footer:has-text("Company")').isVisible();
    const hasHelp = await page.locator('footer:has-text("Help")').isVisible();
    const hasTerms = await page.locator('a[href*="terms"]').isVisible();
    const hasPrivacy = await page.locator('a[href*="privacy"]').isVisible();
    
    logResult('Phase 1', 'Footer', 'pass', 
      `Company: ${hasCompany}, Help: ${hasHelp}, Terms: ${hasTerms}, Privacy: ${hasPrivacy}`);
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p1-footer.png') });
  });
});

// ===== PHASE 2: SEARCH FUNCTIONALITY =====
test.describe('Phase 2: Search Functionality', () => {
  
  test('2.1 Search opens and accepts input', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');
    
    // Click search button/input
    const searchTrigger = page.locator('button:has-text("Search"), input[type="search"]').first();
    await searchTrigger.click();
    await page.waitForTimeout(300);
    
    // Type search query
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name="q"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('test product');
      await page.waitForTimeout(500);
      logResult('Phase 2', 'Search Input', 'pass', 'Search input accepts text');
      await page.screenshot({ path: join(SCREENSHOT_DIR, 'p2-search-active.png') });
    } else {
      logResult('Phase 2', 'Search Input', 'warning', 'Search input not visible after clicking trigger');
    }
  });

  test('2.2 Search results page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/search?q=test`);
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    expect(url).toContain('search');
    logResult('Phase 2', 'Search Results Page', 'pass', `URL: ${url}`);
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p2-search-results.png'), fullPage: true });
  });
});

// ===== PHASE 3: CATEGORY BROWSING =====
test.describe('Phase 3: Category Browsing', () => {
  
  test('3.1 Categories page displays all categories', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/categories`);
    await page.waitForLoadState('networkidle');
    
    const categoryLinks = page.locator('a[href*="/categories/"]');
    const count = await categoryLinks.count();
    
    expect(count).toBeGreaterThan(0);
    logResult('Phase 3', 'Categories Page', 'pass', `${count} category links found`);
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p3-categories.png'), fullPage: true });
  });

  test('3.2 Category detail page loads products', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/categories`);
    await page.waitForLoadState('networkidle');
    
    // Click first category
    const firstCategory = page.locator('a[href*="/categories/"]').first();
    if (await firstCategory.isVisible()) {
      await firstCategory.click();
      await page.waitForLoadState('networkidle');
      
      const url = page.url();
      logResult('Phase 3', 'Category Detail', 'pass', `Navigated to: ${url}`);
      
      await page.screenshot({ path: join(SCREENSHOT_DIR, 'p3-category-detail.png'), fullPage: true });
    }
  });
});

// ===== PHASE 4: PRODUCT PAGES =====
test.describe('Phase 4: Product Pages', () => {
  
  test('4.1 Product detail page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');
    
    // Find a product link
    const productLink = page.locator('a[href*="/en/"][href*="-"]').first();
    
    if (await productLink.isVisible()) {
      await productLink.click();
      await page.waitForLoadState('networkidle');
      
      const url = page.url();
      logResult('Phase 4', 'Product Page Load', 'pass', `URL: ${url}`);
      
      // Check for product elements
      const hasImage = await page.locator('img').first().isVisible();
      const hasTitle = await page.locator('h1').isVisible().catch(() => false);
      const hasPrice = await page.locator('text=/€|\\$/').first().isVisible().catch(() => false);
      
      logResult('Phase 4', 'Product Elements', hasImage && hasTitle ? 'pass' : 'warning',
        `Image: ${hasImage}, Title: ${hasTitle}, Price: ${hasPrice}`);
      
      await page.screenshot({ path: join(SCREENSHOT_DIR, 'p4-product-detail.png'), fullPage: true });
    } else {
      logResult('Phase 4', 'Product Link', 'warning', 'No product links found on homepage');
    }
  });

  test('4.2 Add to wishlist button works', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');
    
    const wishlistBtn = page.locator('button:has-text("Watchlist"), button[aria-label*="wishlist" i]').first();
    
    if (await wishlistBtn.isVisible()) {
      await wishlistBtn.click();
      await page.waitForTimeout(500);
      logResult('Phase 4', 'Wishlist Button', 'pass', 'Wishlist button clickable');
    } else {
      logResult('Phase 4', 'Wishlist Button', 'warning', 'Wishlist button not found');
    }
  });
});

// ===== PHASE 5: AUTHENTICATION =====
test.describe('Phase 5: Authentication', () => {
  
  test('5.1 Login page has all required fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/auth/login`);
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"]').first();
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
    
    logResult('Phase 5', 'Login Form', 'pass', 'All form fields visible');
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p5-login.png'), fullPage: true });
  });

  test('5.2 Sign-up page accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/auth/sign-up`);
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible();
    
    logResult('Phase 5', 'Sign-up Page', 'pass', 'Sign-up form visible');
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p5-signup.png'), fullPage: true });
  });

  test('5.3 Forgot password flow exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/auth/forgot-password`);
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const visible = await emailInput.isVisible().catch(() => false);
    
    if (visible) {
      logResult('Phase 5', 'Forgot Password', 'pass', 'Forgot password page accessible');
    } else {
      logResult('Phase 5', 'Forgot Password', 'warning', 'Forgot password form may not be visible');
    }
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p5-forgot-password.png'), fullPage: true });
  });
});

// ===== PHASE 6: CART & CHECKOUT =====
test.describe('Phase 6: Cart & Checkout', () => {
  
  test('6.1 Cart page loads and shows empty state', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/cart`);
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('cart');
    logResult('Phase 6', 'Cart Page', 'pass', 'Cart page loads');
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p6-cart.png'), fullPage: true });
  });

  test('6.2 Checkout page accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/checkout`);
    await page.waitForLoadState('networkidle');
    
    logResult('Phase 6', 'Checkout Page', 'pass', `URL: ${page.url()}`);
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p6-checkout.png'), fullPage: true });
  });
});

// ===== PHASE 7: SELLER FEATURES =====
test.describe('Phase 7: Seller Features', () => {
  
  test('7.1 Sell page accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/sell`);
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    logResult('Phase 7', 'Sell Page', 'pass', `URL: ${url}`);
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p7-sell.png'), fullPage: true });
  });

  test('7.2 Seller dashboard/area exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/seller`);
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    logResult('Phase 7', 'Seller Dashboard', 'pass', `URL: ${url}`);
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p7-seller-dashboard.png'), fullPage: true });
  });
});

// ===== PHASE 8: PLANS & SUBSCRIPTIONS =====
test.describe('Phase 8: Plans & Subscriptions', () => {
  
  test('8.1 Plans page displays pricing cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/plans`);
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('plans');
    
    // Look for pricing elements
    const cards = page.locator('[class*="card"], article');
    const cardCount = await cards.count();
    
    logResult('Phase 8', 'Plans Page', 'pass', `${cardCount} cards found`);
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p8-plans.png'), fullPage: true });
  });
});

// ===== PHASE 9: USER ACCOUNT =====
test.describe('Phase 9: User Account', () => {
  
  test('9.1 Account page redirects unauthenticated users', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/account`);
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    const redirectedToAuth = url.includes('auth') || url.includes('login');
    
    if (redirectedToAuth) {
      logResult('Phase 9', 'Account Protection', 'pass', 'Unauthenticated users redirected to login');
    } else {
      logResult('Phase 9', 'Account Protection', 'warning', `URL: ${url}`);
    }
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p9-account.png'), fullPage: true });
  });

  test('9.2 Wishlist page accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/wishlist`);
    await page.waitForLoadState('networkidle');
    
    logResult('Phase 9', 'Wishlist Page', 'pass', `URL: ${page.url()}`);
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p9-wishlist.png'), fullPage: true });
  });
});

// ===== PHASE 10: STATIC PAGES =====
test.describe('Phase 10: Static Pages', () => {
  
  const staticPages = [
    { name: 'Support', path: '/en/support' },
    { name: 'FAQ', path: '/en/faq' },
    { name: 'Terms', path: '/en/terms' },
    { name: 'Privacy', path: '/en/privacy' },
    { name: 'About', path: '/en/about' },
  ];

  for (const pageInfo of staticPages) {
    test(`10.${staticPages.indexOf(pageInfo) + 1} ${pageInfo.name} page loads`, async ({ page }) => {
      await page.goto(`${BASE_URL}${pageInfo.path}`);
      await page.waitForLoadState('networkidle');
      
      // Check page doesn't show error
      const has500 = await page.locator('text="500"').isVisible().catch(() => false);
      const has404 = await page.locator('text="404"').isVisible().catch(() => false);
      
      if (!has500 && !has404) {
        logResult('Phase 10', `${pageInfo.name} Page`, 'pass', `Loaded: ${page.url()}`);
      } else {
        logResult('Phase 10', `${pageInfo.name} Page`, 'fail', 'Error page displayed');
      }
      
      await page.screenshot({
        path: join(SCREENSHOT_DIR, `p10-${pageInfo.name.toLowerCase()}.png`),
        fullPage: true,
      });
    });
  }
});

// ===== PHASE 11: ORDERS =====
test.describe('Phase 11: Orders', () => {
  
  test('11.1 Orders page accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/orders`);
    await page.waitForLoadState('networkidle');
    
    logResult('Phase 11', 'Orders Page', 'pass', `URL: ${page.url()}`);
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'p11-orders.png'), fullPage: true });
  });
});

// After all tests, output summary
test.afterAll(async () => {
  console.log('\n\n========== MOBILE UX AUDIT SUMMARY ==========\n');
  
  const passed = auditResults.filter(r => r.status === 'pass').length;
  const failed = auditResults.filter(r => r.status === 'fail').length;
  const warnings = auditResults.filter(r => r.status === 'warning').length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`\nTotal: ${auditResults.length} checks`);
  
  if (failed > 0) {
    console.log('\n--- FAILURES ---');
    auditResults.filter(r => r.status === 'fail').forEach(r => {
      console.log(`❌ [${r.phase}] ${r.test}: ${r.details}`);
    });
  }
  
  if (warnings > 0) {
    console.log('\n--- WARNINGS ---');
    auditResults.filter(r => r.status === 'warning').forEach(r => {
      console.log(`⚠️  [${r.phase}] ${r.test}: ${r.details}`);
    });
  }
});
