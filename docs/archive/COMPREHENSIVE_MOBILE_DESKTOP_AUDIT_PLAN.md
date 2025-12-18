# 🔍 COMPREHENSIVE MOBILE & DESKTOP UI/UX AUDIT PLAN

**Created:** December 15, 2025  
**Project:** AMZN E-commerce Platform  
**Audit Scope:** Mobile (375-430px) + Desktop (1280px+)  
**Testing Tool:** Playwright MCP Browser Automation  
**Methodology:** Systematic page-by-page audit with automated screenshots

---

## 📋 EXECUTIVE SUMMARY

This document outlines a complete UI/UX audit plan covering all main routes and pages of the AMZN platform. The audit will evaluate:

- **Mobile responsiveness** (iPhone SE 375px, iPhone 14 Pro 390px, iPhone 14 Pro Max 430px)
- **Desktop experience** (1280px, 1440px, 1920px)
- **Loading states** and skeleton screens
- **Button sizing** and touch targets
- **Typography** and readability
- **Accessibility** (WCAG compliance)
- **Performance** (Core Web Vitals)
- **Visual consistency** across breakpoints

---

## 🎯 AUDIT OBJECTIVES

### Primary Goals
1. Identify all UI/UX issues across mobile and desktop viewports
2. Document loading state implementations (or lack thereof)
3. Verify touch target sizes meet accessibility guidelines
4. Check typography scales and readability
5. Ensure visual consistency and brand coherence
6. Test interactive elements (buttons, forms, modals)
7. Validate responsive breakpoint transitions

### Success Criteria
- [ ] All pages render without layout breaks
- [ ] No horizontal overflow on mobile
- [ ] All buttons meet 44px minimum touch target
- [ ] Text is readable (min 14px for body, 12px for captions)
- [ ] Loading states exist for async content
- [ ] Consistent spacing and typography
- [ ] No accessibility violations (Level AA)

---

## 📱 VIEWPORT CONFIGURATIONS

### Mobile Viewports
| Device | Width | Height | DPR | Use Case |
|--------|-------|--------|-----|----------|
| iPhone SE | 375px | 667px | 2 | Smallest mainstream mobile |
| iPhone 14 Pro | 390px | 844px | 3 | Standard iOS device |
| iPhone 14 Pro Max | 430px | 932px | 3 | Large mobile |
| Samsung Galaxy S21 | 360px | 800px | 3 | Android baseline |

### Desktop Viewports
| Screen | Width | Height | Use Case |
|--------|-------|--------|----------|
| Small Laptop | 1280px | 800px | Minimum desktop |
| Standard Desktop | 1440px | 900px | Common desktop |
| Large Desktop | 1920px | 1080px | Full HD |

---

## 🗺️ COMPLETE ROUTE MAP

### Phase 1: Public Pages (Unauthenticated)

#### 1.1 Homepage & Discovery
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/` | Homepage | P0 | 30 min |
| `/categories` | All Categories | P0 | 20 min |
| `/categories/[slug]` | Category Listing | P0 | 25 min |
| `/categories/[slug]/[subcategory]` | Subcategory | P1 | 20 min |
| `/search?q=...` | Search Results | P0 | 25 min |
| `/todays-deals` | Deals Page | P1 | 15 min |
| `/sellers` | Sellers Directory | P2 | 15 min |

#### 1.2 Product Pages
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/[username]` | Seller Store Page | P0 | 25 min |
| `/[username]/[product-slug]` | Product Detail Page | P0 | 45 min |
| `/product/[id]` | Product by ID | P1 | 15 min |

#### 1.3 Authentication Pages
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/auth/login` | Login Page | P0 | 20 min |
| `/auth/sign-up` | Registration Page | P0 | 25 min |
| `/auth/sign-up-success` | Registration Success | P2 | 10 min |
| `/auth/forgot-password` | Forgot Password | P1 | 15 min |
| `/auth/reset-password` | Reset Password | P1 | 15 min |
| `/auth/welcome` | Welcome Page | P2 | 10 min |
| `/auth/error` | Auth Error | P2 | 10 min |

#### 1.4 Static/Info Pages
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/about` | About Us | P2 | 10 min |
| `/contact` | Contact Page | P2 | 15 min |
| `/help` | Help Center | P1 | 20 min |
| `/customer-service` | Customer Service | P1 | 15 min |
| `/terms` | Terms of Service | P3 | 5 min |
| `/privacy` | Privacy Policy | P3 | 5 min |
| `/returns` | Returns Policy | P2 | 10 min |

### Phase 2: Shopping Flow (Critical Path)

#### 2.1 Cart & Checkout
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/cart` | Shopping Cart | P0 | 30 min |
| `/checkout` | Checkout Page | P0 | 45 min |
| `/checkout/success` | Order Confirmation | P0 | 20 min |
| `/wishlist` | Wishlist Page | P1 | 20 min |

### Phase 3: Account Pages (Authenticated)

#### 3.1 Main Account
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/account` | Account Dashboard | P0 | 30 min |
| `/account/profile` | Profile Settings | P1 | 20 min |
| `/account/orders` | Order History | P0 | 25 min |
| `/account/addresses` | Saved Addresses | P1 | 20 min |
| `/account/payments` | Payment Methods | P1 | 20 min |
| `/account/wishlist` | Account Wishlist | P1 | 15 min |
| `/account/security` | Security Settings | P2 | 15 min |
| `/account/billing` | Billing Info | P2 | 15 min |
| `/account/following` | Following Sellers | P2 | 15 min |

#### 3.2 Seller Account
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/account/selling` | Selling Dashboard | P1 | 25 min |
| `/account/sales` | Sales History | P1 | 20 min |
| `/account/plans` | Subscription Plans | P2 | 15 min |

### Phase 4: Seller Portal

#### 4.1 Sell Flow
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/sell` | Start Selling Page | P0 | 25 min |
| `/sell/orders` | Seller Orders | P1 | 20 min |

#### 4.2 Business Dashboard
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/dashboard` | Business Dashboard | P0 | 35 min |
| `/dashboard/products` | Products Manager | P0 | 30 min |
| `/dashboard/orders` | Orders Manager | P0 | 30 min |
| `/dashboard/inventory` | Inventory | P1 | 25 min |
| `/dashboard/analytics` | Analytics | P1 | 25 min |
| `/dashboard/customers` | Customers | P2 | 20 min |
| `/dashboard/discounts` | Discounts | P2 | 20 min |
| `/dashboard/marketing` | Marketing | P2 | 20 min |
| `/dashboard/accounting` | Accounting | P2 | 20 min |
| `/dashboard/settings` | Settings | P2 | 15 min |
| `/dashboard/upgrade` | Upgrade Plan | P2 | 15 min |

### Phase 5: Communication

#### 5.1 Chat/Messaging
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/chat` | Messages Inbox | P1 | 25 min |

### Phase 6: Admin Panel (If Accessible)

#### 6.1 Admin Dashboard
| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/admin` | Admin Dashboard | P1 | 30 min |
| `/admin/products` | Manage Products | P1 | 25 min |
| `/admin/orders` | Manage Orders | P1 | 25 min |
| `/admin/users` | Manage Users | P1 | 25 min |
| `/admin/sellers` | Manage Sellers | P1 | 25 min |

### Phase 7: Miscellaneous

| Route | Page | Priority | Est. Time |
|-------|------|----------|-----------|
| `/gift-cards` | Gift Cards | P3 | 10 min |
| `/registry` | Registry | P3 | 10 min |
| `/members` | Members Page | P3 | 10 min |
| `/plans` | Pricing Plans | P2 | 15 min |

---

## 🔬 AUDIT CHECKLIST PER PAGE

### A. Layout & Responsiveness
- [ ] No horizontal overflow/scroll
- [ ] Content fits within viewport
- [ ] Proper spacing at all breakpoints
- [ ] Images scale appropriately
- [ ] Grid/flex layouts work correctly
- [ ] Fixed/sticky elements don't overlap content
- [ ] Modal/drawer positioning correct

### B. Typography & Readability
- [ ] Minimum font size 14px (body), 12px (captions)
- [ ] Line height adequate (1.4-1.6 for body)
- [ ] Contrast ratio meets WCAG AA (4.5:1)
- [ ] Text doesn't overflow containers
- [ ] Proper text truncation (ellipsis)
- [ ] Consistent font weights
- [ ] Language/i18n correct

### C. Buttons & Interactive Elements
- [ ] Primary buttons: 44px minimum height
- [ ] Secondary buttons: 36-40px height
- [ ] Icon buttons: 32-40px touch target
- [ ] Proper hover/active states
- [ ] Focus states visible
- [ ] Disabled states clear
- [ ] Click/tap feedback present

### D. Loading States
- [ ] Skeleton screens for async content
- [ ] Spinner/progress indicators
- [ ] Button loading states
- [ ] Optimistic updates where applicable
- [ ] Error states with retry
- [ ] Empty states designed

### E. Forms & Inputs
- [ ] Input fields properly sized (44px height mobile)
- [ ] Labels visible and associated
- [ ] Error messages clear
- [ ] Validation feedback immediate
- [ ] Keyboard type appropriate (email, number, etc.)
- [ ] Auto-complete enabled where useful

### F. Navigation
- [ ] Mobile nav menu works
- [ ] Bottom tab bar visible (if applicable)
- [ ] Breadcrumbs display correctly
- [ ] Back navigation works
- [ ] Active states visible
- [ ] Scroll position preserved

### G. Images & Media
- [ ] Images optimized and loading
- [ ] Proper aspect ratios maintained
- [ ] Alt text present
- [ ] Lazy loading implemented
- [ ] Placeholder/blur-up on load

### H. Accessibility
- [ ] Semantic HTML structure
- [ ] ARIA labels on interactive elements
- [ ] Tab order logical
- [ ] Screen reader compatible
- [ ] Color not sole indicator
- [ ] Sufficient color contrast

---

## 🤖 PLAYWRIGHT AUTOMATION SCRIPTS

### Script 1: Mobile Viewport Screenshot Capture
```javascript
// audit-mobile-screenshots.js
const viewports = [
  { name: 'iPhone-SE', width: 375, height: 667 },
  { name: 'iPhone-14-Pro', width: 390, height: 844 },
  { name: 'iPhone-14-Pro-Max', width: 430, height: 932 },
];

const routes = [
  { path: '/', name: 'homepage' },
  { path: '/categories', name: 'categories' },
  { path: '/cart', name: 'cart' },
  { path: '/auth/login', name: 'login' },
  { path: '/auth/sign-up', name: 'signup' },
  { path: '/account', name: 'account' },
  { path: '/sell', name: 'sell' },
  { path: '/checkout', name: 'checkout' },
  { path: '/search?q=test', name: 'search' },
  { path: '/wishlist', name: 'wishlist' },
];

// For each viewport and route, capture screenshot
```

### Script 2: Touch Target Analysis
```javascript
// analyze-touch-targets.js
// Find all interactive elements and measure their sizes
const buttons = await page.$$('button, a, [role="button"]');
for (const btn of buttons) {
  const box = await btn.boundingBox();
  if (box && (box.width < 44 || box.height < 44)) {
    console.log(`Small touch target: ${await btn.textContent()}`);
  }
}
```

### Script 3: Font Size Analysis
```javascript
// analyze-typography.js
// Find elements with font-size below threshold
const smallText = await page.$$eval('*', (elements) =>
  elements
    .filter((el) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.fontSize) < 12;
    })
    .map((el) => ({
      tag: el.tagName,
      text: el.textContent?.substring(0, 50),
      fontSize: window.getComputedStyle(el).fontSize,
    }))
);
```

### Script 4: Loading State Detection
```javascript
// detect-loading-states.js
// Navigate and check for loading indicators
await page.goto(url);
const hasLoadingIndicator = await page.$('.loading, .skeleton, [aria-busy="true"]');
const loadTime = await page.evaluate(() => 
  performance.timing.loadEventEnd - performance.timing.navigationStart
);
```

---

## 📊 SCORING RUBRIC

### Per-Page Scoring (0-100)
| Category | Weight | Scoring Criteria |
|----------|--------|------------------|
| Layout/Responsiveness | 25% | No breaks=25, Minor issues=15, Major breaks=0 |
| Typography | 15% | All readable=15, Some issues=10, Many issues=0 |
| Touch Targets | 20% | All compliant=20, 90%+=15, <90%=5 |
| Loading States | 15% | All present=15, Some=10, None=0 |
| Accessibility | 15% | AA compliant=15, Some issues=10, Major=0 |
| Visual Polish | 10% | Consistent=10, Minor=7, Inconsistent=0 |

### Overall Grade Scale
- **A (90-100)**: Production-ready, excellent UX
- **B (80-89)**: Good, minor improvements needed
- **C (70-79)**: Acceptable, noticeable issues
- **D (60-69)**: Below standard, significant work needed
- **F (<60)**: Unacceptable, major overhaul required

---

## 📅 AUDIT EXECUTION TIMELINE

### Week 1: Critical Path (Days 1-3)
**Day 1 (4 hours)**
- [ ] Homepage (mobile + desktop)
- [ ] Category pages (mobile + desktop)
- [ ] Search results (mobile + desktop)

**Day 2 (4 hours)**
- [ ] Product page (mobile + desktop) - **MOST IMPORTANT**
- [ ] Seller store page (mobile + desktop)
- [ ] Cart page (mobile + desktop)

**Day 3 (4 hours)**
- [ ] Checkout flow (mobile + desktop)
- [ ] Authentication pages (mobile + desktop)

### Week 1: Account & Seller (Days 4-5)
**Day 4 (4 hours)**
- [ ] Account dashboard & subpages
- [ ] Orders history
- [ ] Addresses & payments

**Day 5 (4 hours)**
- [ ] Sell page & flow
- [ ] Business dashboard
- [ ] Dashboard subpages

### Week 2: Remaining & Fixes (Days 6-10)
**Day 6-7**
- [ ] Static pages (help, about, contact, etc.)
- [ ] Chat/messaging
- [ ] Admin panel

**Day 8-10**
- [ ] Compile findings
- [ ] Prioritize fixes
- [ ] Create fix tickets
- [ ] Begin implementing critical fixes

---

## 🔴 KNOWN ISSUES FROM PREVIOUS AUDITS

### From MOBILE_UI_UX_AUDIT.md:
1. ~~Wishlist 404 error~~ ✅ FIXED
2. Test data in production (product names)
3. Language inconsistency (BG/EN mix)
4. Slow initial page loads
5. Bottom navigation tab bar issues

### From MOBILE_PRODUCT_PAGE_FIXES.md:
1. Hardcoded mock data (seller stats, feedback)
2. Currency inconsistency (USD/EUR mix)
3. 18 elements with font-size < 12px
4. 7 icon buttons missing aria-label
5. LCP image missing loading="eager"

---

## 📝 AUDIT OUTPUT DELIVERABLES

### 1. Screenshot Gallery
```
/audit-results/screenshots/
├── mobile/
│   ├── 375px/
│   │   ├── homepage.png
│   │   ├── product-page.png
│   │   └── ...
│   ├── 390px/
│   └── 430px/
└── desktop/
    ├── 1280px/
    ├── 1440px/
    └── 1920px/
```

### 2. Issue Tracker Spreadsheet
| Issue ID | Page | Category | Severity | Description | Screenshot | Fix Estimate |
|----------|------|----------|----------|-------------|------------|--------------|
| MOB-001 | Homepage | Touch Target | P1 | Filter button 32px | link | 15min |
| MOB-002 | Product | Typography | P2 | Price too small | link | 10min |

### 3. Fix Priority Matrix
| Priority | Count | Estimated Hours | Sprint |
|----------|-------|-----------------|--------|
| P0 Critical | ? | ? | Sprint 1 |
| P1 High | ? | ? | Sprint 1-2 |
| P2 Medium | ? | ? | Sprint 2-3 |
| P3 Low | ? | ? | Backlog |

### 4. Final Report
- Executive summary
- Score breakdown by page
- Top 10 issues
- Recommendations
- Before/after comparisons

---

## 🚀 NEXT STEPS

1. **Start dev server** if not running
2. **Execute Phase 1** - Public pages audit using Playwright MCP
3. **Document findings** in structured format
4. **Create GitHub issues** for each finding
5. **Prioritize and fix** critical issues first
6. **Re-audit** fixed pages to verify

---

## 📞 AUDIT COMMANDS REFERENCE

### Start Development Server
```bash
pnpm dev
```

### Run Playwright MCP Commands (via Claude)
- Navigate to URL
- Take screenshot
- Measure element sizes
- Check for horizontal overflow
- Analyze typography
- Test touch targets
- Verify loading states

---

## ✅ AUDIT INITIATION CHECKLIST

- [ ] Development server running on localhost:3000
- [ ] Test user accounts ready (buyer, seller, admin)
- [ ] Sample products exist in database
- [ ] Playwright MCP connected
- [ ] Screenshot folder created
- [ ] Issue tracking template ready

---

*This audit plan will be executed systematically, with findings documented in real-time and fixes prioritized by business impact.*
