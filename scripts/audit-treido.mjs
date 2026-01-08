/**
 * Comprehensive Desktop Audit Script for treido.eu
 * Tests all main routes, UI/UX, and user flows
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

function addIssue(category, severity, description, route = '') {
  issues.push({ category, severity, description, route });
  log(`🔴 ISSUE [${severity}] ${category}: ${description} (${route})`);
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

async function auditHomepage(page) {
  log('=== AUDITING HOMEPAGE ===');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await delay(2000);
  
  const title = await page.title();
  log(`Page title: ${title}`);
  
  // Check viewport for desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await takeScreenshot(page, '01-homepage-desktop');
  
  // Check for main navigation elements
  const header = await page.$('header');
  if (!header) addIssue('Navigation', 'HIGH', 'Header not found', '/');
  
  // Check hero section
  const heroSection = await page.$('[class*="hero"], [class*="banner"], main > section:first-child');
  if (!heroSection) addIssue('Layout', 'MEDIUM', 'Hero section might be missing', '/');
  
  // Check for tabs on homepage
  const tabs = await page.$$('[role="tab"], [class*="tab"]');
  log(`Found ${tabs.length} tab elements on homepage`);
  
  // Check for product grids
  const productCards = await page.$$('[class*="product"], [class*="card"]');
  log(`Found ${productCards.length} product/card elements`);
  
  // Check console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  
  return { title, tabCount: tabs.length, productCount: productCards.length };
}

async function auditNavigation(page) {
  log('=== AUDITING NAVIGATION ===');
  
  // Find all main nav links
  const navLinks = await page.$$('nav a, header a');
  log(`Found ${navLinks.length} navigation links`);
  
  // Check for mega menu / categories dropdown
  const categoriesBtn = await page.$('[class*="categor"], button:has-text("Categories"), a:has-text("Categories")');
  if (categoriesBtn) {
    log('Found categories button/link');
    try {
      await categoriesBtn.hover();
      await delay(500);
      await takeScreenshot(page, '02-categories-dropdown');
      
      // Check for mega menu
      const megaMenu = await page.$('[class*="mega"], [class*="dropdown"]');
      if (megaMenu) log('Mega menu found');
    } catch (e) {
      log(`Could not hover categories: ${e.message}`);
    }
  }
  
  // Find account/login link
  const accountLink = await page.$('a[href*="account"], a[href*="login"], button:has-text("Sign"), button:has-text("Login")');
  if (accountLink) log('Account/login link found');
  else addIssue('Navigation', 'HIGH', 'Account/login link not visible', '/');
  
  // Find cart
  const cartLink = await page.$('a[href*="cart"], button[class*="cart"], [aria-label*="cart"]');
  if (cartLink) log('Cart link found');
  else addIssue('Navigation', 'HIGH', 'Cart link not visible', '/');
}

async function auditCategories(page) {
  log('=== AUDITING CATEGORIES PAGE ===');
  
  // Try different category URLs
  const categoryUrls = [
    '/en/categories',
    '/en/category',
    '/categories',
    '/bg/categories'
  ];
  
  for (const url of categoryUrls) {
    try {
      const response = await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle', timeout: 10000 });
      if (response && response.status() === 200) {
        log(`Categories page found at: ${url}`);
        await delay(1500);
        await takeScreenshot(page, '03-categories-page');
        
        // Check sidebar alignment
        const sidebar = await page.$('[class*="sidebar"], aside');
        const mainContent = await page.$('main, [class*="content"], [class*="grid"]');
        
        if (sidebar && mainContent) {
          const sidebarBox = await sidebar.boundingBox();
          const mainBox = await mainContent.boundingBox();
          
          if (sidebarBox && mainBox) {
            log(`Sidebar: x=${sidebarBox.x}, width=${sidebarBox.width}`);
            log(`Main: x=${mainBox.x}, width=${mainBox.width}`);
            
            // Check alignment issues
            if (Math.abs(sidebarBox.y - mainBox.y) > 20) {
              addIssue('Layout', 'HIGH', `Sidebar and main content misaligned vertically by ${Math.abs(sidebarBox.y - mainBox.y)}px`, url);
            }
          }
        }
        break;
      }
    } catch (e) {
      log(`${url} - not accessible: ${e.message}`);
    }
  }
}

async function auditProductPage(page) {
  log('=== AUDITING PRODUCT PAGE ===');
  
  // First, find a product link from homepage
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await delay(1500);
  
  // Click on first product
  const productLink = await page.$('a[href*="/product/"], a[href*="/p/"], [class*="product"] a');
  if (productLink) {
    const href = await productLink.getAttribute('href');
    log(`Found product link: ${href}`);
    
    await productLink.click();
    await delay(2000);
    await page.waitForLoadState('networkidle');
    
    await takeScreenshot(page, '04-product-page-desktop');
    
    const currentUrl = page.url();
    log(`Product page URL: ${currentUrl}`);
    
    // Audit product page layout
    // Check for essential elements
    const productImage = await page.$('img[class*="product"], [class*="gallery"] img, [class*="image"]');
    const productTitle = await page.$('h1, [class*="title"]');
    const productPrice = await page.$('[class*="price"]');
    const addToCartBtn = await page.$('button:has-text("Add"), button:has-text("Cart"), button:has-text("Buy")');
    
    if (!productImage) addIssue('Product Page', 'HIGH', 'Product image not found or poorly styled', currentUrl);
    if (!productTitle) addIssue('Product Page', 'HIGH', 'Product title (h1) not found', currentUrl);
    if (!productPrice) addIssue('Product Page', 'HIGH', 'Price not visible', currentUrl);
    if (!addToCartBtn) addIssue('Product Page', 'CRITICAL', 'Add to cart button not found', currentUrl);
    
    // Check layout issues - measure widths
    const mainContainer = await page.$('main, [class*="container"]');
    if (mainContainer) {
      const box = await mainContainer.boundingBox();
      if (box) {
        log(`Main container width: ${box.width}px`);
        if (box.width < 800) {
          addIssue('Product Page', 'HIGH', 'Desktop layout too narrow - appears mobile-like', currentUrl);
        }
      }
    }
    
    // Check for seller info
    const sellerInfo = await page.$('[class*="seller"], [class*="vendor"], [class*="shop"]');
    if (!sellerInfo) addIssue('Product Page', 'MEDIUM', 'Seller information not visible', currentUrl);
    
    // Check for product description
    const description = await page.$('[class*="description"], [class*="details"]');
    if (!description) addIssue('Product Page', 'MEDIUM', 'Product description section not found', currentUrl);
    
    return { url: currentUrl, hasImage: !!productImage, hasPrice: !!productPrice, hasAddToCart: !!addToCartBtn };
  } else {
    addIssue('Homepage', 'CRITICAL', 'No product links found on homepage', '/');
    return null;
  }
}

async function auditLogin(page) {
  log('=== AUDITING LOGIN FLOW ===');
  
  // Navigate to login
  await page.goto(`${BASE_URL}/en/auth/login`, { waitUntil: 'networkidle' });
  await delay(1500);
  
  await takeScreenshot(page, '05-login-page');
  
  // Find login form
  const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email"]');
  const passwordInput = await page.$('input[type="password"]');
  const submitBtn = await page.$('button[type="submit"], button:has-text("Sign"), button:has-text("Log")');
  
  if (!emailInput) addIssue('Auth', 'CRITICAL', 'Email input not found on login page', '/auth/login');
  if (!passwordInput) addIssue('Auth', 'CRITICAL', 'Password input not found on login page', '/auth/login');
  if (!submitBtn) addIssue('Auth', 'CRITICAL', 'Submit button not found on login page', '/auth/login');
  
  if (emailInput && passwordInput && submitBtn) {
    // Attempt login
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);
    await takeScreenshot(page, '06-login-filled');
    
    await submitBtn.click();
    await delay(3000);
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    log(`After login, URL: ${currentUrl}`);
    await takeScreenshot(page, '07-after-login');
    
    // Check if logged in
    const userMenu = await page.$('[class*="user"], [class*="account"], [class*="profile"]');
    const logoutBtn = await page.$('button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")');
    
    if (currentUrl.includes('login') || currentUrl.includes('auth')) {
      addIssue('Auth', 'CRITICAL', 'Login might have failed - still on auth page', currentUrl);
    }
    
    return { success: !currentUrl.includes('login'), url: currentUrl };
  }
  
  return { success: false };
}

async function auditAccountPage(page) {
  log('=== AUDITING ACCOUNT PAGE ===');
  
  // Try to find account page
  const accountUrls = [
    '/en/account',
    '/en/profile',
    '/en/dashboard',
    '/account',
    '/en/account/orders'
  ];
  
  for (const url of accountUrls) {
    try {
      await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle', timeout: 10000 });
      const currentUrl = page.url();
      
      if (!currentUrl.includes('login') && !currentUrl.includes('auth')) {
        log(`Account page accessible at: ${url}`);
        await delay(1500);
        await takeScreenshot(page, '08-account-page');
        
        // Check for order management
        const ordersLink = await page.$('a[href*="order"], button:has-text("Order"), [class*="order"]');
        if (ordersLink) {
          log('Orders section found');
          await ordersLink.click();
          await delay(1500);
          await takeScreenshot(page, '09-orders-page');
        } else {
          addIssue('Account', 'HIGH', 'Orders management link not found in account', url);
        }
        
        // Check for sales/seller dashboard link
        const salesLink = await page.$('a[href*="sales"], a[href*="seller"], button:has-text("Sales"), button:has-text("Sell")');
        if (salesLink) {
          log('Sales/seller section found');
        } else {
          log('No sales/seller section visible (might need seller role)');
        }
        
        // Check for notifications
        const notificationsLink = await page.$('a[href*="notification"], [class*="notification"], button:has-text("Notification")');
        if (!notificationsLink) {
          addIssue('Account', 'HIGH', 'Notifications section not found', url);
        }
        
        // Check for messages/chat
        const messagesLink = await page.$('a[href*="message"], a[href*="chat"], [class*="message"], button:has-text("Message")');
        if (!messagesLink) {
          addIssue('Account', 'HIGH', 'Messages/chat section not found', url);
        }
        
        break;
      }
    } catch (e) {
      log(`${url} error: ${e.message}`);
    }
  }
}

async function auditSellForm(page) {
  log('=== AUDITING SELL FORM ===');
  
  await page.goto(`${BASE_URL}/en/sell`, { waitUntil: 'networkidle' });
  await delay(1500);
  
  const currentUrl = page.url();
  log(`Sell page URL: ${currentUrl}`);
  await takeScreenshot(page, '10-sell-page');
  
  // Check if redirected to login
  if (currentUrl.includes('login') || currentUrl.includes('auth')) {
    log('Sell page requires authentication - redirected to login');
    return { requiresAuth: true };
  }
  
  // Check for sell form elements
  const formElements = {
    title: await page.$('input[name="title"], input[placeholder*="title"], input[placeholder*="name"]'),
    description: await page.$('textarea, [contenteditable], input[name="description"]'),
    price: await page.$('input[name="price"], input[type="number"], input[placeholder*="price"]'),
    category: await page.$('select, [class*="select"], [role="combobox"]'),
    images: await page.$('input[type="file"], [class*="upload"], [class*="dropzone"]'),
    submit: await page.$('button[type="submit"], button:has-text("Publish"), button:has-text("List"), button:has-text("Create")')
  };
  
  for (const [name, element] of Object.entries(formElements)) {
    if (!element) {
      addIssue('Sell Form', 'HIGH', `${name} input not found`, '/sell');
    } else {
      log(`✓ ${name} input found`);
    }
  }
  
  return { requiresAuth: false, hasAllFields: Object.values(formElements).every(e => e !== null) };
}

async function auditCart(page) {
  log('=== AUDITING CART ===');
  
  await page.goto(`${BASE_URL}/en/cart`, { waitUntil: 'networkidle' });
  await delay(1500);
  await takeScreenshot(page, '11-cart-page');
  
  // Check cart elements
  const emptyCartMsg = await page.$('[class*="empty"], :text("empty"), :text("no items")');
  const cartItems = await page.$$('[class*="cart-item"], [class*="line-item"]');
  const checkoutBtn = await page.$('button:has-text("Checkout"), a:has-text("Checkout"), button:has-text("Pay")');
  
  log(`Cart items found: ${cartItems.length}`);
  
  if (!checkoutBtn && cartItems.length > 0) {
    addIssue('Cart', 'CRITICAL', 'Checkout button not found when cart has items', '/cart');
  }
  
  return { itemCount: cartItems.length, hasCheckout: !!checkoutBtn };
}

async function auditCheckout(page) {
  log('=== AUDITING CHECKOUT ===');
  
  // First add a product to cart
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await delay(1000);
  
  // Find and click a product
  const productCard = await page.$('a[href*="/product/"], [class*="product"] a');
  if (productCard) {
    await productCard.click();
    await delay(2000);
    
    // Add to cart
    const addToCartBtn = await page.$('button:has-text("Add"), button:has-text("Cart")');
    if (addToCartBtn) {
      await addToCartBtn.click();
      await delay(1500);
      log('Added product to cart');
      
      // Go to checkout
      await page.goto(`${BASE_URL}/en/checkout`, { waitUntil: 'networkidle' });
      await delay(1500);
      await takeScreenshot(page, '12-checkout-page');
      
      // Check for Stripe elements
      const stripeFrame = await page.$('iframe[name*="stripe"], [class*="stripe"]');
      const paymentForm = await page.$('form, [class*="payment"]');
      
      if (!stripeFrame && !paymentForm) {
        addIssue('Checkout', 'CRITICAL', 'No payment form/Stripe elements found', '/checkout');
      }
      
      // Check for shipping info
      const shippingForm = await page.$('[class*="shipping"], [class*="address"]');
      if (!shippingForm) {
        addIssue('Checkout', 'HIGH', 'Shipping/address form not visible', '/checkout');
      }
    }
  }
}

async function generateReport() {
  log('=== GENERATING REPORT ===');
  
  // Sort issues by severity
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  const report = `# Treido.eu Desktop Audit Report
Generated: ${new Date().toISOString()}

## Summary
- Total Issues Found: ${issues.length}
- Critical: ${issues.filter(i => i.severity === 'CRITICAL').length}
- High: ${issues.filter(i => i.severity === 'HIGH').length}
- Medium: ${issues.filter(i => i.severity === 'MEDIUM').length}
- Low: ${issues.filter(i => i.severity === 'LOW').length}

## Issues by Category

${['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(severity => {
  const categoryIssues = issues.filter(i => i.severity === severity);
  if (categoryIssues.length === 0) return '';
  return `### ${severity} Priority
${categoryIssues.map(i => `- **[${i.category}]** ${i.description}${i.route ? ` \`${i.route}\`` : ''}`).join('\n')}
`;
}).join('\n')}

## Detailed Audit Log
\`\`\`
${auditLog.join('\n')}
\`\`\`

## Recommended Fixes

### Product Page (Desktop)
- [ ] Implement proper two-column layout (gallery left, info right)
- [ ] Add proper spacing and visual hierarchy
- [ ] Ensure add-to-cart button is prominent and accessible

### Categories Page
- [ ] Fix sidebar alignment with main content grid
- [ ] Ensure proper responsive breakpoints

### Order Management
- [ ] Implement buyer order cancellation
- [ ] Implement seller order status updates (received, shipped, delivered)
- [ ] Add order timeline/history view

### Notifications System
- [ ] Create notification center in account
- [ ] Implement real-time notifications for new orders
- [ ] Add notification preferences

### Chat/Messaging
- [ ] Implement buyer-seller messaging
- [ ] Add chat notifications
- [ ] Link chat to orders

### Checkout Flow
- [ ] Verify Stripe integration
- [ ] Add proper error handling
- [ ] Implement order confirmation page
`;

  fs.writeFileSync('./AUDIT-REPORT.md', report);
  log(`Report saved to AUDIT-REPORT.md`);
  
  return report;
}

async function main() {
  // Create screenshots directory
  if (!fs.existsSync('./audit-screenshots')) {
    fs.mkdirSync('./audit-screenshots');
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
  
  try {
    // Run all audits
    await auditHomepage(page);
    await auditNavigation(page);
    await auditCategories(page);
    await auditProductPage(page);
    await auditLogin(page);
    await auditAccountPage(page);
    await auditSellForm(page);
    await auditCart(page);
    await auditCheckout(page);
    
    // Generate report
    const report = await generateReport();
    console.log('\n\n' + report);
    
  } catch (error) {
    log(`FATAL ERROR: ${error.message}`);
    console.error(error);
  } finally {
    await browser.close();
  }
}

main();
