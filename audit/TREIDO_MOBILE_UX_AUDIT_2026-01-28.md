# TREIDO.EU Mobile UX Audit
**Date**: January 28, 2026  
**Auditor**: Claude (GitHub Copilot)  
**Test Device**: Playwright Mobile Emulation (Chrome)  
**Viewport**: Mobile (~375px width)  
**Test Account**: radevalentin@gmail.com  

---

## Executive Summary

**PRODUCTION READINESS: ⚠️ NOT READY**

The site has significant critical issues that would block any user from completing a purchase. The Cart and Checkout pages are completely non-functional.

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 3 |
| 🟠 HIGH | 4 |
| 🟡 MEDIUM | 5 |
| ⚪ LOW | 3 |

---

## 🔴 CRITICAL ISSUES (Blocking)

### 1. Cart Page Completely Broken
**URL**: `/en/cart`  
**Expected**: Shopping cart with items, quantities, checkout button  
**Actual**: Infinite loading spinner, page never renders  
**Console Error**: `Minified React error #419`  
**Impact**: **Users cannot view cart or proceed to checkout**  
**Reproduction**: Navigate to /en/cart while logged in

### 2. Checkout Page Completely Broken  
**URL**: `/en/checkout`  
**Expected**: Checkout form with shipping, payment, order summary  
**Actual**: Infinite loading spinner, page never renders  
**Console Error**: React error #419 likely (same as cart)  
**Impact**: **Users cannot complete any purchase**  
**Reproduction**: Navigate to /en/checkout

### 3. Login Redirect Double-Locale Bug
**URL**: `/en/auth/login` → redirects to `/en/en/account`  
**Expected**: Redirect to `/en/account` after successful login  
**Actual**: Redirects to `/en/en/account` (double locale prefix)  
**Error Shown**: "Profile not found" 404 page  
**Impact**: **Every user who logs in sees an error page**  
**Reproduction**:  
1. Go to /en/auth/login
2. Enter valid credentials
3. Submit form
4. Observe redirect to /en/en/account (broken)

---

## 🟠 HIGH SEVERITY ISSUES

### 4. Console JavaScript Errors on Homepage
**URL**: `/en`  
**Errors**:
- `TypeError: Cannot read properties of null`
- `Minified React error #419`  
**Impact**: Indicates runtime hydration/SSR issues that could cause random failures  
**Note**: These errors appear on initial page load

### 5. Chat Data Inconsistency
**Location**: Chat modal vs Chat page  
**Observed**: Chat popup modal shows 3 conversations with messages  
**But**: `/en/chat` page shows "No conversations yet - Messages from sellers will appear here"  
**Impact**: Confusing UX, user sees conflicting information  
**Possible Cause**: Different data sources or caching issue

### 6. Notifications Page Empty
**URL**: `/en/account/notifications`  
**Expected**: List of notifications (badge shows "2")  
**Actual**: Page is completely empty - no notification content rendered  
**Impact**: Users with notifications cannot see them

### 7. Plans Page "No Plans Available" with Active Subscription
**URL**: `/en/account/plans`  
**Observed**: User has active "business" plan (billing date: Jan 28, 2027)  
**But**: Page displays "No plans available" message  
**Impact**: Confusing UX - user cannot see/change plans  

---

## 🟡 MEDIUM SEVERITY ISSUES

### 8. Sell Form Photo Limit: Only 1 Photo
**URL**: `/en/sell`  
**Observed**: "Add up to 1 photos" limit  
**Expected**: Marketplace listings typically need 3-10+ photos  
**Impact**: Severely limits listing quality and seller capability  
**Notes**: Placeholder/test image visible, unclear if this is config or bug

### 9. Cart Modal Shows Suspicious Data
**Location**: Cart slide-over panel (from header cart icon)  
**Observed**:
- 891 items in cart
- ~€448,337.34 subtotal
- Items showing quantity: 99 each
**Impact**: Test data appears to be visible in production, or data leak

### 10. Search Filter Drawer Overlap/Z-Index
**URL**: `/en/search`  
**Observation**: "Sort and filter" button opens drawer, but close affordance unclear  
**Note**: Minor - needs visual polish

### 11. Account Pages Missing Mobile Footer Navigation
**URLs**: `/en/account/*` pages  
**Observed**: Account dashboard pages use different shell with sidebar nav  
**Missing**: Standard mobile bottom navigation bar  
**Impact**: Inconsistent navigation pattern between store and account

### 12. Category Subcategory Truncation
**URL**: Homepage category bars  
**Observed**: Text like "Huawei P50 Seri…" truncated  
**Impact**: User cannot see full category name

---

## ⚪ LOW SEVERITY ISSUES

### 13. Test/Debug Listings Visible
**Observed listings in production**:
- "123123" 
- "1231233"
- "Never Gonna Give You Up"
- "E2E Listing 1767711856893"
- "Айсифон" (seems like test)
**Impact**: Unprofessional appearance, should be hidden from production

### 14. HUGE Price Listings
**Observed**: Item "Nargele" listed at €123,123.00  
**Also**: "1231233" showing -100% discount (€123.00 from €123,123.00)  
**Impact**: Test data cluttering the marketplace

### 15. Mixed Cyrillic/Latin Product Names
**Observed**: Bulgarian names like "Айсифон", "Заглавие", "Котка" mixed with English  
**Note**: Not necessarily a bug if targeting Bulgarian market, but inconsistent

---

## ✅ WORKING FEATURES

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage | ✅ Works | Loads with JS errors but functional |
| Product Listings Grid | ✅ Works | Sections load: Promoted, Today's, Fashion, Electronics, Auto |
| Product Detail Page | ✅ Works | Specs, description, reviews, delivery info, add to cart |
| Login Form | ⚠️ Partial | Form works, redirect broken |
| Account Dashboard | ✅ Works | Shows revenue, orders, listings stats |
| Sell Form | ⚠️ Partial | Works but 1-photo limit |
| Cart Modal/Popup | ✅ Works | Shows items, though data suspicious |
| Chat Modal/Popup | ✅ Works | Shows conversations |
| Search Page | ✅ Works | Filters, results display |
| Orders Page | ✅ Works | Tabs, order list, details |
| Wishlist Page | ✅ Works | Items, share, add to cart actions |
| Addresses Page | ✅ Works | List, add, edit |
| Payments Page | ✅ Works | Stripe integration, add card |
| Settings Page | ✅ Works | Navigation hub |
| Menu Drawer | ✅ Works | Full nav menu on mobile |
| Mobile Bottom Nav | ✅ Works | Home, Categories, Sell, Chat, Account |

---

## UI/UX Observations

### Good
- Clean, modern design language
- Product cards well-designed with promo badges, prices, ratings
- Mobile navigation is intuitive (bottom bar + hamburger menu)
- Category horizontal scroll works well
- Wishlist has "Share" and "Add All to Cart" - nice features

### Needs Work
- Account section navigation inconsistent with store
- Loading states need timeout/error handling (Cart/Checkout stuck forever)
- No offline/error boundaries catching React crashes

---

## Immediate Action Items

### P0 - Fix Today
1. **Fix Cart page** - React hydration error preventing render
2. **Fix Checkout page** - Same issue
3. **Fix login redirect** - Remove double locale `/en/en/account`

### P1 - Fix This Week
4. Investigate Chat data source inconsistency
5. Fix Notifications page empty state
6. Fix Plans page "No plans available" display
7. Increase photo upload limit on Sell form

### P2 - Fix Before Launch
8. Clean up test data/listings from production
9. Fix console JS errors on homepage
10. Add error boundaries for graceful degradation

---

## Test Environment Details

- **Browser**: Chromium (Playwright)
- **URL**: https://www.treido.eu
- **Locale**: English (/en)
- **Login**: radevalentin@gmail.com / 12345678
- **Session**: Authenticated user with business plan

---

## Appendix: Console Errors Log

```
Homepage:
- TypeError: Cannot read properties of null (reading...en:2:320285)
- Minified React error #419

Cart Page:
- Minified React error #419
- Page stuck on loading spinner
```

---

**Audit completed**: January 28, 2026, ~15:30 UTC

---

## 🔄 LOCALHOST VERIFICATION UPDATE

**Date**: January 28, 2026 ~18:00 UTC  
**Environment**: localhost:3000 (dev server)  
**Method**: Playwright MCP browser automation

### Critical Issues - Updated Status

| # | Issue | Original | Localhost Status | Notes |
|---|-------|----------|------------------|-------|
| 1 | Cart Page Broken | 🔴 CRITICAL | 🔴 **STILL BROKEN** | Empty page - only dev tools button visible |
| 2 | Checkout Page Broken | 🔴 CRITICAL | ⚠️ PARTIAL | Header shows, main content stuck on loading |
| 3 | Login Redirect Bug | 🔴 CRITICAL | ✅ **FIXED** | Now redirects to `/en` homepage correctly |

### High Issues - Updated Status

| # | Issue | Original | Localhost Status | Notes |
|---|-------|----------|------------------|-------|
| 4 | Console JS Errors | 🟠 HIGH | 🟠 REMAINS | `[useCategoryCounts] Error: Failed to fetch` |
| 5 | Chat Data Inconsistency | 🟠 HIGH | ⚠️ WORSE | Chat page now nearly empty |
| 6 | Notifications Empty | 🟠 HIGH | ✅ **FIXED** | Shows 2 notifications + preferences panel |
| 7 | Plans "No plans" | 🟠 HIGH | ⚠️ PARTIAL | Shows business plan BUT still shows "No plans available" text |

### Additional Issues Found

| Issue | Severity | Details |
|-------|----------|---------|
| Sell Page Hydration | 🟡 MEDIUM | `<button>` nested in `<button>` HTML error |
| Chart Dimension Warnings | ⚪ LOW | `width(-1) and height(-1)` on account dashboard |
| Sell Page 500 (Desktop) | ✅ **FIXED** | Form now loads (was Turbopack error) |

### Summary of Changes

**✅ Fixed (3 issues):**
1. Login redirect double-locale bug
2. Notifications page empty state  
3. Sell page 500 error (from desktop audit)

**🔴 Still Critical (2 issues):**
1. Cart page - no content renders
2. Checkout page - stuck on loading spinner

**⚠️ Degraded (1 issue):**
1. Chat page - now nearly empty instead of "No conversations" message

### Recommended Priority

```
P0 - Must Fix Before Any Testing:
├── Cart page rendering (blocks all purchases)
└── Checkout page rendering (blocks all purchases)

P1 - Fix This Week:
├── Plans page UX ("No plans" text with active plan)  
├── Chat page empty state
└── Console fetch errors

P2 - Polish:
├── Sell form 1-photo limit
├── Hydration HTML nesting errors
└── Chart dimension warnings
```

---

**Verification completed**: January 28, 2026, ~18:00 UTC
