/**
 * Comprehensive Desktop Audit Script v2 for treido.eu
 * More robust selectors and deeper testing
 */

import { chromium } from '@playwright/test';
import fs from 'fs';

const BASE_URL = 'https://treido.eu';
const TEST_USER = {
  email: 'radevalentin@gmail.com',
  password: '12345678'
};

const issues = [];
const auditLog = [];

function log(msg) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
  auditLog.push(`[${timestamp}] ${msg}`);
}

function addIssue(category, severity, description, route = '', details = '') {
  issues.push({ category, severity, description, route, details });
  log(`🔴 ISSUE [${severity}] ${category}: ${description} (${route})`);
  if (details) log(`   Details: ${details}`);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, name) {
  const path = `./audit-screenshots/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  log(`📸 Screenshot: ${path}`);
  return path;
}

async function closeOverlays(page) {
  // Close any open dialogs/overlays
  try {
    const closeButtons = await page.$$('button[aria-label*="close"], button[aria-label*="Close"], [data-state="open"] button, .close-button');
    for (const btn of closeButtons) {
      try {
        await btn.click({ timeout: 500 });
        await delay(300);
      } catch {}
    }
  } catch {}
  
  // Press Escape key to close any modal
  await page.keyboard.press('Escape');
  await delay(300);
  await page.keyboard.press('Escape');
  await delay(300);
}

async function auditHomepage(page) {
  log('=== AUDITING HOMEPAGE ===');
  await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await delay(3000);
  
  // Close any overlays
  await closeOverlays(page);
  await delay(500);
  
  const title = await page.title();
  log(`Page title: ${title}`);
  
  await takeScreenshot(page, '01-homepage-desktop');
  
  // Get full page HTML structure for analysis
  const mainStructure = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return 'No main element';
    const sections = main.querySelectorAll('section, [class*="section"]');
    return Array.from(sections).map((s, i) => `Section ${i}: ${s.className.substring(0, 100)}`).join('\n');
  });
  log(`Page structure:\n${mainStructure}`);
  
  // Check header elements
  const headerAnalysis = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return { exists: false };
    return {
      exists: true,
      height: header.offsetHeight,
      hasLogo: !!header.querySelector('img, svg, [class*="logo"]'),
      hasNav: !!header.querySelector('nav'),
      hasSearch: !!header.querySelector('input, [class*="search"]'),
      hasCart: !!header.querySelector('[class*="cart"], [aria-label*="cart"]'),
      hasAccount: !!header.querySelector('[class*="account"], [class*="profile"], [class*="user"]')
    };
  });
  log(`Header analysis: ${JSON.stringify(headerAnalysis)}`);
  
  if (!headerAnalysis.exists) addIssue('Layout', 'CRITICAL', 'No header element found', '/');
  if (!headerAnalysis.hasLogo) addIssue('Branding', 'HIGH', 'Logo not found in header', '/');
  if (!headerAnalysis.hasSearch) addIssue('UX', 'HIGH', 'Search not visible in header', '/');
  
  // Count actual product cards
  const productAnalysis = await page.evaluate(() => {
    // More comprehensive selectors
    const selectors = [
      '[data-testid*="product"]',
      '[class*="product-card"]',
      '[class*="ProductCard"]',
      'a[href*="/product/"]',
      'a[href*="/p/"]',
      '[class*="grid"] > div > a',
      '.product',
      '[class*="listing"]'
    ];
    
    let products = [];
    for (const sel of selectors) {
      const found = document.querySelectorAll(sel);
      if (found.length > 0) {
        products = Array.from(found);
        return { count: found.length, selector: sel, firstHref: found[0]?.getAttribute('href') || found[0]?.querySelector('a')?.href };
      }
    }
    
    // Fallback - find links with /product/ or /p/
    const allLinks = document.querySelectorAll('a');
    const productLinks = Array.from(allLinks).filter(a => 
      a.href.includes('/product/') || a.href.includes('/p/') || a.href.includes('/listing/')
    );
    if (productLinks.length > 0) {
      return { count: productLinks.length, selector: 'href filter', firstHref: productLinks[0].href };
    }
    
    return { count: 0, selector: 'none found' };
  });
  log(`Product cards: ${JSON.stringify(productAnalysis)}`);
  
  if (productAnalysis.count === 0) {
    addIssue('Homepage', 'CRITICAL', 'No product cards found on homepage', '/', 'Users cannot see or click on products');
  }
  
  // Check homepage tabs (for Featured, New, Popular etc)
  const tabsAnalysis = await page.evaluate(() => {
    const tabLists = document.querySelectorAll('[role="tablist"]');
    const tabs = document.querySelectorAll('[role="tab"]');
    return {
      tabListCount: tabLists.length,
      tabCount: tabs.length,
      tabLabels: Array.from(tabs).slice(0, 5).map(t => t.textContent?.trim().substring(0, 30))
    };
  });
  log(`Tabs: ${JSON.stringify(tabsAnalysis)}`);
  
  // Test tab interactions
  if (tabsAnalysis.tabCount > 0) {
    const tabs = await page.$$('[role="tab"]');
    for (let i = 0; i < Math.min(3, tabs.length); i++) {
      try {
        await tabs[i].click();
        await delay(1000);
        const tabName = await tabs[i].textContent();
        await takeScreenshot(page, `01b-homepage-tab-${i}-${tabName?.trim().substring(0, 10) || i}`);
        log(`Clicked tab ${i}: ${tabName?.trim()}`);
      } catch (e) {
        log(`Could not click tab ${i}: ${e.message}`);
      }
    }
  }
  
  return { productAnalysis, tabsAnalysis };
}

async function auditCategories(page) {
  log('=== AUDITING CATEGORIES PAGE ===');
  
  await page.goto(`${BASE_URL}/en/categories`, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await delay(2000);
  await closeOverlays(page);
  
  await takeScreenshot(page, '02-categories-page');
  
  // Analyze layout
  const layoutAnalysis = await page.evaluate(() => {
    const sidebar = document.querySelector('aside, [class*="sidebar"], [class*="Sidebar"]');
    const main = document.querySelector('main, [class*="content"], [class*="Content"]');
    const grid = document.querySelector('[class*="grid"], [class*="Grid"]');
    
    let result = {
      hasSidebar: !!sidebar,
      hasMain: !!main,
      hasGrid: !!grid
    };
    
    if (sidebar) {
      const rect = sidebar.getBoundingClientRect();
      result.sidebarWidth = rect.width;
      result.sidebarLeft = rect.left;
      result.sidebarTop = rect.top;
    }
    
    if (grid) {
      const rect = grid.getBoundingClientRect();
      result.gridLeft = rect.left;
      result.gridTop = rect.top;
      result.gridWidth = rect.width;
      
      // Check if sidebar and grid tops align
      if (sidebar) {
        const sidebarRect = sidebar.getBoundingClientRect();
        result.topAlignmentGap = Math.abs(sidebarRect.top - rect.top);
      }
    }
    
    // Count category cards
    const categoryCards = document.querySelectorAll('[class*="category"], [class*="Category"]');
    result.categoryCardCount = categoryCards.length;
    
    return result;
  });
  
  log(`Categories layout: ${JSON.stringify(layoutAnalysis)}`);
  
  if (layoutAnalysis.topAlignmentGap > 20) {
    addIssue('Layout', 'HIGH', `Sidebar and grid misaligned by ${layoutAnalysis.topAlignmentGap}px`, '/categories', 'Desktop layout issue');
  }
  
  // Click on a category
  const categoryLinks = await page.$$('a[href*="/category/"], a[href*="/categories/"]');
  if (categoryLinks.length > 0) {
    const firstCategoryHref = await categoryLinks[0].getAttribute('href');
    log(`Found ${categoryLinks.length} category links. First: ${firstCategoryHref}`);
    await categoryLinks[0].click();
    await delay(2000);
    await takeScreenshot(page, '02b-category-detail');
    
    const currentUrl = page.url();
    log(`Category detail URL: ${currentUrl}`);
    
    // Check product listing on category page
    const productCount = await page.evaluate(() => {
      const products = document.querySelectorAll('a[href*="/product/"], [class*="product"]');
      return products.length;
    });
    log(`Products in category: ${productCount}`);
    
    if (productCount === 0) {
      addIssue('Categories', 'HIGH', 'No products shown in category listing', currentUrl);
    }
  }
  
  return layoutAnalysis;
}

async function auditProductPage(page) {
  log('=== AUDITING PRODUCT PAGE ===');
  
  // First find a product URL
  await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle' });
  await delay(2000);
  await closeOverlays(page);
  
  // Find product link
  const productUrl = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    for (const link of links) {
      if (link.href.includes('/product/') || link.href.includes('/p/')) {
        return link.href;
      }
    }
    return null;
  });
  
  if (!productUrl) {
    // Try categories page
    await page.goto(`${BASE_URL}/en/categories`, { waitUntil: 'networkidle' });
    await delay(2000);
    await closeOverlays(page);
    
    const productUrlFromCat = await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      for (const link of links) {
        if (link.href.includes('/product/') || link.href.includes('/p/')) {
          return link.href;
        }
      }
      return null;
    });
    
    if (!productUrlFromCat) {
      addIssue('Navigation', 'CRITICAL', 'Cannot find any product links in homepage or categories', '/');
      return null;
    }
    
    await page.goto(productUrlFromCat, { waitUntil: 'networkidle' });
  } else {
    await page.goto(productUrl, { waitUntil: 'networkidle' });
  }
  
  await delay(2000);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await takeScreenshot(page, '03-product-page-desktop');
  
  const currentUrl = page.url();
  log(`Product page: ${currentUrl}`);
  
  // Comprehensive product page analysis
  const productPageAnalysis = await page.evaluate(() => {
    const result = {
      hasTitle: false,
      titleText: '',
      hasPrice: false,
      priceText: '',
      hasImages: false,
      imageCount: 0,
      hasAddToCart: false,
      addToCartText: '',
      hasDescription: false,
      hasSellerInfo: false,
      hasVariants: false,
      hasQuantity: false,
      hasBreadcrumb: false,
      layout: {}
    };
    
    // Title
    const h1 = document.querySelector('h1');
    if (h1) {
      result.hasTitle = true;
      result.titleText = h1.textContent?.trim().substring(0, 50);
    }
    
    // Price
    const priceEl = document.querySelector('[class*="price"], [class*="Price"]');
    if (priceEl) {
      result.hasPrice = true;
      result.priceText = priceEl.textContent?.trim();
    }
    
    // Images
    const images = document.querySelectorAll('img[class*="product"], [class*="gallery"] img, [class*="image"] img');
    result.hasImages = images.length > 0;
    result.imageCount = images.length;
    
    // Add to cart button
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const text = btn.textContent?.toLowerCase() || '';
      if (text.includes('add') || text.includes('cart') || text.includes('buy') || text.includes('купи') || text.includes('кошница')) {
        result.hasAddToCart = true;
        result.addToCartText = btn.textContent?.trim().substring(0, 30);
        break;
      }
    }
    
    // Description
    const desc = document.querySelector('[class*="description"], [class*="Description"]');
    result.hasDescription = !!desc;
    
    // Seller info
    const seller = document.querySelector('[class*="seller"], [class*="Seller"], [class*="vendor"], [class*="shop"]');
    result.hasSellerInfo = !!seller;
    
    // Variants (size, color, etc)
    const variants = document.querySelectorAll('[class*="variant"], [class*="option"], select');
    result.hasVariants = variants.length > 0;
    
    // Quantity selector
    const quantity = document.querySelector('[class*="quantity"], input[type="number"]');
    result.hasQuantity = !!quantity;
    
    // Breadcrumb
    const breadcrumb = document.querySelector('[class*="breadcrumb"], nav[aria-label*="breadcrumb"]');
    result.hasBreadcrumb = !!breadcrumb;
    
    // Layout analysis
    const main = document.querySelector('main');
    if (main) {
      result.layout.mainWidth = main.offsetWidth;
      result.layout.mainHeight = main.offsetHeight;
    }
    
    // Check for two-column layout
    const flexContainers = document.querySelectorAll('[class*="flex"], [class*="grid"]');
    result.layout.hasFlexOrGrid = flexContainers.length > 0;
    
    return result;
  });
  
  log(`Product page analysis: ${JSON.stringify(productPageAnalysis, null, 2)}`);
  
  // Report issues
  if (!productPageAnalysis.hasTitle) addIssue('Product Page', 'HIGH', 'Product title (h1) missing', currentUrl);
  if (!productPageAnalysis.hasPrice) addIssue('Product Page', 'CRITICAL', 'Price not visible', currentUrl);
  if (!productPageAnalysis.hasImages) addIssue('Product Page', 'HIGH', 'Product images not found', currentUrl);
  if (!productPageAnalysis.hasAddToCart) addIssue('Product Page', 'CRITICAL', 'Add to cart button not found', currentUrl);
  if (!productPageAnalysis.hasDescription) addIssue('Product Page', 'MEDIUM', 'Product description section missing', currentUrl);
  if (!productPageAnalysis.hasSellerInfo) addIssue('Product Page', 'MEDIUM', 'Seller information not displayed', currentUrl);
  if (!productPageAnalysis.hasBreadcrumb) addIssue('Product Page', 'LOW', 'Breadcrumb navigation missing', currentUrl);
  
  // Test add to cart if available
  if (productPageAnalysis.hasAddToCart) {
    const addBtn = await page.$('button:has-text("Add"), button:has-text("Cart"), button:has-text("Buy"), button:has-text("Купи"), button:has-text("кошница")');
    if (addBtn) {
      await addBtn.click();
      await delay(2000);
      await takeScreenshot(page, '03b-after-add-to-cart');
      
      // Check if cart updated
      const cartBadge = await page.$('[class*="badge"], [class*="count"]');
      if (cartBadge) {
        const count = await cartBadge.textContent();
        log(`Cart badge after add: ${count}`);
      }
    }
  }
  
  return productPageAnalysis;
}

async function auditLogin(page) {
  log('=== AUDITING LOGIN FLOW ===');
  
  await page.goto(`${BASE_URL}/en/auth/login`, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await delay(1500);
  await closeOverlays(page);
  
  await takeScreenshot(page, '04-login-page');
  
  const loginFormAnalysis = await page.evaluate(() => {
    return {
      hasEmailInput: !!document.querySelector('input[type="email"], input[name="email"]'),
      hasPasswordInput: !!document.querySelector('input[type="password"]'),
      hasSubmitButton: !!document.querySelector('button[type="submit"]'),
      hasRegisterLink: !!document.querySelector('a[href*="register"], a[href*="signup"]'),
      hasForgotPassword: !!document.querySelector('a[href*="forgot"], a[href*="reset"]'),
      hasSocialLogin: !!document.querySelector('[class*="google"], [class*="facebook"], [class*="social"]')
    };
  });
  
  log(`Login form: ${JSON.stringify(loginFormAnalysis)}`);
  
  if (!loginFormAnalysis.hasEmailInput) addIssue('Auth', 'CRITICAL', 'Email input missing', '/auth/login');
  if (!loginFormAnalysis.hasPasswordInput) addIssue('Auth', 'CRITICAL', 'Password input missing', '/auth/login');
  if (!loginFormAnalysis.hasSubmitButton) addIssue('Auth', 'CRITICAL', 'Submit button missing', '/auth/login');
  
  // Attempt login
  const emailInput = await page.$('input[type="email"], input[name="email"]');
  const passwordInput = await page.$('input[type="password"]');
  const submitBtn = await page.$('button[type="submit"]');
  
  if (emailInput && passwordInput && submitBtn) {
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);
    await takeScreenshot(page, '04b-login-filled');
    
    await submitBtn.click();
    await delay(4000);
    
    const currentUrl = page.url();
    log(`After login URL: ${currentUrl}`);
    await takeScreenshot(page, '04c-after-login');
    
    // Check for error messages
    const errorMsg = await page.$('[class*="error"], [class*="Error"], [role="alert"]');
    if (errorMsg) {
      const text = await errorMsg.textContent();
      log(`Login error: ${text}`);
      addIssue('Auth', 'CRITICAL', `Login failed: ${text}`, '/auth/login');
    }
    
    return { 
      success: !currentUrl.includes('login') && !currentUrl.includes('auth'), 
      redirectedTo: currentUrl 
    };
  }
  
  return { success: false };
}

async function auditAccountArea(page) {
  log('=== AUDITING ACCOUNT AREA ===');
  
  // Ensure logged in first
  await page.goto(`${BASE_URL}/en/account`, { waitUntil: 'networkidle' });
  await delay(2000);
  await closeOverlays(page);
  
  const currentUrl = page.url();
  if (currentUrl.includes('login') || currentUrl.includes('auth')) {
    log('Not logged in, attempting login...');
    await auditLogin(page);
    await page.goto(`${BASE_URL}/en/account`, { waitUntil: 'networkidle' });
    await delay(2000);
  }
  
  await takeScreenshot(page, '05-account-page');
  
  // Analyze account page structure
  const accountAnalysis = await page.evaluate(() => {
    const result = {
      hasNavigation: false,
      navigationItems: [],
      hasOrdersLink: false,
      hasSalesLink: false,
      hasMessagesLink: false,
      hasNotificationsLink: false,
      hasSettingsLink: false,
      hasProfileLink: false
    };
    
    // Find account nav
    const nav = document.querySelector('nav, aside, [class*="sidebar"], [class*="menu"]');
    if (nav) {
      result.hasNavigation = true;
      const links = nav.querySelectorAll('a');
      result.navigationItems = Array.from(links).map(l => ({
        text: l.textContent?.trim().substring(0, 30),
        href: l.getAttribute('href')
      })).filter(l => l.href);
    }
    
    // Check for specific sections
    const allLinks = document.querySelectorAll('a');
    for (const link of allLinks) {
      const href = link.getAttribute('href') || '';
      const text = link.textContent?.toLowerCase() || '';
      
      if (href.includes('order') || text.includes('order') || text.includes('поръчки')) {
        result.hasOrdersLink = true;
      }
      if (href.includes('sales') || href.includes('seller') || text.includes('sales') || text.includes('продажби')) {
        result.hasSalesLink = true;
      }
      if (href.includes('message') || href.includes('chat') || text.includes('message') || text.includes('съобщения')) {
        result.hasMessagesLink = true;
      }
      if (href.includes('notification') || text.includes('notification') || text.includes('известия')) {
        result.hasNotificationsLink = true;
      }
      if (href.includes('setting') || text.includes('setting') || text.includes('настройки')) {
        result.hasSettingsLink = true;
      }
    }
    
    return result;
  });
  
  log(`Account analysis: ${JSON.stringify(accountAnalysis, null, 2)}`);
  
  if (!accountAnalysis.hasOrdersLink) addIssue('Account', 'CRITICAL', 'Orders management link not found', '/account');
  if (!accountAnalysis.hasMessagesLink) addIssue('Account', 'HIGH', 'Messages/Chat link not found', '/account');
  if (!accountAnalysis.hasNotificationsLink) addIssue('Account', 'HIGH', 'Notifications link not found', '/account');
  
  // Navigate to orders page
  const ordersLink = await page.$('a[href*="order"]');
  if (ordersLink) {
    await ordersLink.click();
    await delay(2000);
    await takeScreenshot(page, '05b-orders-page');
    
    // Analyze orders page
    const ordersAnalysis = await page.evaluate(() => {
      return {
        hasOrderList: !!document.querySelector('[class*="order"], table, [class*="list"]'),
        hasOrderCards: document.querySelectorAll('[class*="order-card"], [class*="order-item"]').length,
        hasEmptyState: !!document.querySelector('[class*="empty"]'),
        hasFilters: !!document.querySelector('select, [class*="filter"]'),
        hasPagination: !!document.querySelector('[class*="pagination"]')
      };
    });
    log(`Orders page: ${JSON.stringify(ordersAnalysis)}`);
  }
  
  // Check sales/seller section
  if (accountAnalysis.hasSalesLink) {
    const salesLink = await page.$('a[href*="sales"], a[href*="seller"]');
    if (salesLink) {
      await salesLink.click();
      await delay(2000);
      await takeScreenshot(page, '05c-sales-page');
      
      const salesAnalysis = await page.evaluate(() => {
        return {
          hasSalesList: !!document.querySelector('[class*="sale"], [class*="order"], table'),
          hasStatusFilters: !!document.querySelector('[class*="status"], [class*="filter"]'),
          hasActions: !!document.querySelector('button[class*="action"], [class*="dropdown"]')
        };
      });
      log(`Sales page: ${JSON.stringify(salesAnalysis)}`);
    }
  }
  
  return accountAnalysis;
}

async function auditSellForm(page) {
  log('=== AUDITING SELL FORM ===');
  
  await page.goto(`${BASE_URL}/en/sell`, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await delay(2000);
  await closeOverlays(page);
  
  const currentUrl = page.url();
  log(`Sell page URL: ${currentUrl}`);
  
  if (currentUrl.includes('login') || currentUrl.includes('auth')) {
    log('Sell page requires auth');
    await auditLogin(page);
    await page.goto(`${BASE_URL}/en/sell`, { waitUntil: 'networkidle' });
    await delay(2000);
  }
  
  await takeScreenshot(page, '06-sell-form');
  
  // Analyze sell form
  const sellFormAnalysis = await page.evaluate(() => {
    return {
      hasTitleInput: !!document.querySelector('input[name="title"], input[placeholder*="title"], input[placeholder*="name"]'),
      hasDescriptionInput: !!document.querySelector('textarea, [contenteditable]'),
      hasPriceInput: !!document.querySelector('input[name="price"], input[type="number"]'),
      hasCategorySelect: !!document.querySelector('select, [role="combobox"], [class*="select"]'),
      hasImageUpload: !!document.querySelector('input[type="file"], [class*="upload"], [class*="dropzone"]'),
      hasConditionSelect: !!document.querySelector('[name="condition"], [class*="condition"]'),
      hasLocationInput: !!document.querySelector('[name="location"], [class*="location"]'),
      hasSubmitButton: !!document.querySelector('button[type="submit"]'),
      formFields: Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
        type: el.type || el.tagName.toLowerCase(),
        name: el.name,
        placeholder: el.placeholder
      }))
    };
  });
  
  log(`Sell form analysis: ${JSON.stringify(sellFormAnalysis, null, 2)}`);
  
  if (!sellFormAnalysis.hasTitleInput) addIssue('Sell Form', 'CRITICAL', 'Title input missing', '/sell');
  if (!sellFormAnalysis.hasPriceInput) addIssue('Sell Form', 'CRITICAL', 'Price input missing', '/sell');
  if (!sellFormAnalysis.hasImageUpload) addIssue('Sell Form', 'CRITICAL', 'Image upload missing', '/sell');
  if (!sellFormAnalysis.hasCategorySelect) addIssue('Sell Form', 'HIGH', 'Category selector missing', '/sell');
  if (!sellFormAnalysis.hasSubmitButton) addIssue('Sell Form', 'CRITICAL', 'Submit button missing', '/sell');
  
  return sellFormAnalysis;
}

async function auditCartAndCheckout(page) {
  log('=== AUDITING CART AND CHECKOUT ===');
  
  // First add a product to cart
  await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle' });
  await delay(2000);
  await closeOverlays(page);
  
  // Find and click on a product
  const productLink = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    for (const link of links) {
      if (link.href.includes('/product/')) return link.href;
    }
    return null;
  });
  
  if (productLink) {
    await page.goto(productLink, { waitUntil: 'networkidle' });
    await delay(1500);
    
    // Try to add to cart
    const addBtn = await page.$('button:has-text("Add"), button:has-text("Cart"), button:has-text("Buy")');
    if (addBtn) {
      await addBtn.click();
      await delay(2000);
      log('Clicked add to cart');
    }
  }
  
  // Go to cart
  await page.goto(`${BASE_URL}/en/cart`, { waitUntil: 'networkidle' });
  await delay(2000);
  await takeScreenshot(page, '07-cart-page');
  
  const cartAnalysis = await page.evaluate(() => {
    return {
      hasItems: document.querySelectorAll('[class*="item"], [class*="product"]').length > 0,
      itemCount: document.querySelectorAll('[class*="cart-item"], [class*="line-item"]').length,
      hasTotal: !!document.querySelector('[class*="total"]'),
      hasCheckoutButton: !!document.querySelector('button:has-text("Checkout"), a[href*="checkout"]'),
      hasQuantityControls: !!document.querySelector('[class*="quantity"], button[class*="increment"]'),
      hasRemoveButtons: !!document.querySelector('button[class*="remove"], button[class*="delete"]')
    };
  });
  
  log(`Cart analysis: ${JSON.stringify(cartAnalysis)}`);
  
  if (cartAnalysis.hasItems && !cartAnalysis.hasCheckoutButton) {
    addIssue('Cart', 'CRITICAL', 'Checkout button not visible when cart has items', '/cart');
  }
  
  // Try checkout
  if (cartAnalysis.hasCheckoutButton || cartAnalysis.hasItems) {
    const checkoutBtn = await page.$('button:has-text("Checkout"), a[href*="checkout"]');
    if (checkoutBtn) {
      await checkoutBtn.click();
      await delay(3000);
    } else {
      await page.goto(`${BASE_URL}/en/checkout`, { waitUntil: 'networkidle' });
      await delay(2000);
    }
    
    await takeScreenshot(page, '08-checkout-page');
    
    const checkoutAnalysis = await page.evaluate(() => {
      return {
        hasStripeElements: !!document.querySelector('iframe[name*="stripe"], [class*="stripe"]'),
        hasPaymentForm: !!document.querySelector('form, [class*="payment"]'),
        hasShippingForm: !!document.querySelector('[class*="shipping"], [class*="address"]'),
        hasOrderSummary: !!document.querySelector('[class*="summary"], [class*="total"]'),
        hasPayButton: !!document.querySelector('button:has-text("Pay"), button:has-text("Order"), button[type="submit"]')
      };
    });
    
    log(`Checkout analysis: ${JSON.stringify(checkoutAnalysis)}`);
    
    if (!checkoutAnalysis.hasStripeElements && !checkoutAnalysis.hasPaymentForm) {
      addIssue('Checkout', 'CRITICAL', 'No payment form or Stripe elements found', '/checkout');
    }
    if (!checkoutAnalysis.hasShippingForm) {
      addIssue('Checkout', 'HIGH', 'Shipping/address form not visible', '/checkout');
    }
  }
  
  return { cartAnalysis };
}

async function auditOrderManagement(page) {
  log('=== AUDITING ORDER MANAGEMENT WORKFLOW ===');
  
  // This tests the full order lifecycle
  // For now, we'll document what's needed
  
  const orderManagementChecks = {
    buyerFeatures: {
      canViewOrders: false,
      canCancelOrder: false,
      canTrackOrder: false,
      canContactSeller: false,
      canLeaveReview: false,
      receivesOrderNotifications: false
    },
    sellerFeatures: {
      canViewSales: false,
      canMarkReceived: false,
      canMarkShipped: false,
      canMarkDelivered: false,
      canContactBuyer: false,
      receivesOrderNotifications: false,
      canRefund: false
    },
    messaging: {
      hasInAppChat: false,
      chatLinkedToOrder: false,
      hasNotificationBadge: false
    }
  };
  
  // Check orders page as buyer
  await page.goto(`${BASE_URL}/en/account/orders`, { waitUntil: 'networkidle' });
  await delay(2000);
  await takeScreenshot(page, '09-buyer-orders');
  
  const buyerOrdersAnalysis = await page.evaluate(() => {
    return {
      hasOrderList: !!document.querySelector('[class*="order"]'),
      hasCancelButton: !!document.querySelector('button:has-text("Cancel"), [class*="cancel"]'),
      hasTrackingInfo: !!document.querySelector('[class*="tracking"], [class*="status"]'),
      hasContactSeller: !!document.querySelector('button:has-text("Contact"), button:has-text("Message"), a[href*="message"]'),
      hasReviewOption: !!document.querySelector('button:has-text("Review"), a[href*="review"]')
    };
  });
  log(`Buyer orders: ${JSON.stringify(buyerOrdersAnalysis)}`);
  
  if (!buyerOrdersAnalysis.hasCancelButton) {
    addIssue('Order Management', 'HIGH', 'Buyer cannot cancel orders', '/account/orders');
  }
  if (!buyerOrdersAnalysis.hasContactSeller) {
    addIssue('Order Management', 'HIGH', 'Buyer cannot contact seller from order', '/account/orders');
  }
  
  // Check sales page as seller
  await page.goto(`${BASE_URL}/en/account/sales`, { waitUntil: 'networkidle' });
  await delay(2000);
  await takeScreenshot(page, '10-seller-sales');
  
  const sellerSalesAnalysis = await page.evaluate(() => {
    return {
      hasSalesList: !!document.querySelector('[class*="sale"], [class*="order"]'),
      hasStatusDropdown: !!document.querySelector('select[class*="status"], [class*="dropdown"]'),
      hasMarkShippedButton: !!document.querySelector('button:has-text("Ship"), button:has-text("Mark")'),
      hasContactBuyer: !!document.querySelector('button:has-text("Contact"), button:has-text("Message")'),
      hasRefundOption: !!document.querySelector('button:has-text("Refund")')
    };
  });
  log(`Seller sales: ${JSON.stringify(sellerSalesAnalysis)}`);
  
  if (!sellerSalesAnalysis.hasStatusDropdown && !sellerSalesAnalysis.hasMarkShippedButton) {
    addIssue('Order Management', 'CRITICAL', 'Seller cannot update order status (received/shipped/delivered)', '/account/sales');
  }
  if (!sellerSalesAnalysis.hasContactBuyer) {
    addIssue('Order Management', 'HIGH', 'Seller cannot contact buyer from sale', '/account/sales');
  }
  
  // Check for notifications
  await page.goto(`${BASE_URL}/en/account`, { waitUntil: 'networkidle' });
  await delay(1500);
  
  const notificationAnalysis = await page.evaluate(() => {
    return {
      hasNotificationIcon: !!document.querySelector('[class*="notification"], [class*="bell"]'),
      hasNotificationBadge: !!document.querySelector('[class*="badge"]'),
      hasNotificationPage: !!document.querySelector('a[href*="notification"]')
    };
  });
  log(`Notifications: ${JSON.stringify(notificationAnalysis)}`);
  
  if (!notificationAnalysis.hasNotificationIcon && !notificationAnalysis.hasNotificationPage) {
    addIssue('Notifications', 'CRITICAL', 'No notification system visible', '/account');
  }
  
  // Check for messaging/chat
  await page.goto(`${BASE_URL}/en/account/messages`, { waitUntil: 'networkidle' });
  await delay(1500);
  
  const currentUrl = page.url();
  if (currentUrl.includes('messages') && !currentUrl.includes('404')) {
    await takeScreenshot(page, '11-messages-page');
    log('Messages page exists');
  } else {
    addIssue('Messaging', 'CRITICAL', 'No messaging/chat system found', '/account/messages');
    log('Messages page not found or 404');
  }
  
  return { buyerOrdersAnalysis, sellerSalesAnalysis, notificationAnalysis };
}

async function generateReport() {
  log('=== GENERATING COMPREHENSIVE REPORT ===');
  
  // Sort issues by severity
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
  const highCount = issues.filter(i => i.severity === 'HIGH').length;
  const mediumCount = issues.filter(i => i.severity === 'MEDIUM').length;
  const lowCount = issues.filter(i => i.severity === 'LOW').length;
  
  const report = `# Treido.eu Comprehensive Desktop Audit Report

Generated: ${new Date().toISOString()}
Auditor: Automated Playwright Script v2

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Total Issues** | ${issues.length} |
| 🔴 Critical | ${criticalCount} |
| 🟠 High | ${highCount} |
| 🟡 Medium | ${mediumCount} |
| 🟢 Low | ${lowCount} |

### Overall Assessment
${criticalCount > 0 ? '**⚠️ CRITICAL ISSUES FOUND** - The site has blocking issues that prevent core user flows.' : ''}
${criticalCount === 0 && highCount > 0 ? '**⚠️ HIGH PRIORITY ISSUES** - The site has significant UX problems that need immediate attention.' : ''}
${criticalCount === 0 && highCount === 0 ? '**✅ ACCEPTABLE** - No critical issues found.' : ''}

---

## Issues by Priority

${['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(severity => {
  const categoryIssues = issues.filter(i => i.severity === severity);
  if (categoryIssues.length === 0) return '';
  
  const emoji = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : severity === 'MEDIUM' ? '🟡' : '🟢';
  
  return `### ${emoji} ${severity} Priority (${categoryIssues.length})

| # | Category | Issue | Route |
|---|----------|-------|-------|
${categoryIssues.map((i, idx) => `| ${idx + 1} | ${i.category} | ${i.description} | \`${i.route || 'N/A'}\` |`).join('\n')}
`;
}).filter(Boolean).join('\n')}

---

## Issues by Category

${Array.from(new Set(issues.map(i => i.category))).map(cat => {
  const catIssues = issues.filter(i => i.category === cat);
  return `### ${cat}
${catIssues.map(i => `- [${i.severity}] ${i.description} \`${i.route}\``).join('\n')}
`;
}).join('\n')}

---

## Refactor Plan

### Phase 1: Critical Fixes (Must Fix Before Launch)

${issues.filter(i => i.severity === 'CRITICAL').map((i, idx) => `
#### ${idx + 1}. ${i.category}: ${i.description}
- **Route:** \`${i.route}\`
- **Impact:** Blocks core user flow
- **Fix:** [TO BE DOCUMENTED]
`).join('\n') || 'No critical issues found.'}

### Phase 2: High Priority (Fix Within 1 Week)

${issues.filter(i => i.severity === 'HIGH').map((i, idx) => `
#### ${idx + 1}. ${i.category}: ${i.description}
- **Route:** \`${i.route}\`
- **Fix:** [TO BE DOCUMENTED]
`).join('\n') || 'No high priority issues found.'}

### Phase 3: Medium Priority (Fix Within 2 Weeks)

${issues.filter(i => i.severity === 'MEDIUM').map((i, idx) => `
- [ ] ${i.category}: ${i.description} (\`${i.route}\`)
`).join('\n') || 'No medium priority issues found.'}

### Phase 4: Low Priority (Nice to Have)

${issues.filter(i => i.severity === 'LOW').map((i, idx) => `
- [ ] ${i.category}: ${i.description} (\`${i.route}\`)
`).join('\n') || 'No low priority issues found.'}

---

## Feature Implementation Checklist

### Order Management System

#### Buyer Features
- [ ] View order history with status
- [ ] Cancel pending orders
- [ ] Track shipped orders
- [ ] Contact seller from order
- [ ] Leave review after delivery
- [ ] Receive notifications for status changes

#### Seller Features
- [ ] View incoming sales/orders
- [ ] Mark order as "Received" (payment confirmed)
- [ ] Mark order as "Shipped" (with tracking)
- [ ] Mark order as "Delivered"
- [ ] Contact buyer from order
- [ ] Process refunds
- [ ] Receive notifications for new orders

### Notification System
- [ ] In-app notification center
- [ ] Notification bell icon with unread count
- [ ] Email notifications (optional)
- [ ] Real-time updates

### Messaging/Chat System
- [ ] Buyer-seller direct messaging
- [ ] Message threads linked to orders
- [ ] Unread message indicators
- [ ] Message notifications

---

## Desktop UI/UX Specific Issues

### Product Page
- [ ] Implement proper two-column layout (gallery left, details right)
- [ ] Add image gallery with zoom
- [ ] Ensure add-to-cart is prominent
- [ ] Add seller info card
- [ ] Add breadcrumb navigation
- [ ] Add related products section

### Categories Page
- [ ] Fix sidebar/content alignment
- [ ] Add proper filters
- [ ] Implement sorting options
- [ ] Add pagination or infinite scroll

### Homepage
- [ ] Ensure product grid is clickable
- [ ] Fix tab functionality
- [ ] Add hero/banner section
- [ ] Ensure search is functional

---

## Screenshots Reference

| # | Screenshot | Description |
|---|------------|-------------|
| 1 | 01-homepage-desktop.png | Homepage at 1920x1080 |
| 2 | 02-categories-page.png | Categories listing |
| 3 | 03-product-page-desktop.png | Product detail page |
| 4 | 04-login-page.png | Login form |
| 5 | 05-account-page.png | Account dashboard |
| 6 | 06-sell-form.png | Product listing form |
| 7 | 07-cart-page.png | Shopping cart |
| 8 | 08-checkout-page.png | Checkout flow |
| 9 | 09-buyer-orders.png | Buyer order management |
| 10 | 10-seller-sales.png | Seller sales management |
| 11 | 11-messages-page.png | Messaging system |

---

## Audit Log

\`\`\`
${auditLog.join('\n')}
\`\`\`

---

## Next Steps

1. Review screenshots in \`./audit-screenshots/\`
2. Prioritize critical issues
3. Create GitHub issues for each fix
4. Assign team members
5. Re-audit after fixes

`;

  fs.writeFileSync('./DESKTOP-AUDIT-REPORT.md', report);
  log(`Report saved to DESKTOP-AUDIT-REPORT.md`);
  
  return report;
}

async function main() {
  // Create screenshots directory
  if (!fs.existsSync('./audit-screenshots')) {
    fs.mkdirSync('./audit-screenshots', { recursive: true });
  }
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--window-size=1920,1080']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      log(`Console Error: ${msg.text()}`);
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    log(`Page Error: ${error.message}`);
    addIssue('JavaScript', 'HIGH', `Runtime error: ${error.message.substring(0, 100)}`);
  });
  
  try {
    // Run all audits
    log('Starting comprehensive desktop audit of treido.eu');
    
    await auditHomepage(page);
    await auditCategories(page);
    await auditProductPage(page);
    await auditLogin(page);
    await auditAccountArea(page);
    await auditSellForm(page);
    await auditCartAndCheckout(page);
    await auditOrderManagement(page);
    
    // Generate report
    const report = await generateReport();
    
    console.log('\n\n========================================');
    console.log('AUDIT COMPLETE');
    console.log('========================================\n');
    console.log(report);
    
  } catch (error) {
    log(`FATAL ERROR: ${error.message}`);
    console.error(error);
    await generateReport(); // Still generate report with collected issues
  } finally {
    await browser.close();
  }
}

main();
