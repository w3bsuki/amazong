# Treido.eu Desktop Audit & Full Refactor Plan

**Generated:** January 8, 2026
**Auditor:** AI Agent (Playwright + Code Analysis)
**Scope:** Desktop version (≥1024px) - All main routes and features

---

## Executive Summary

| Severity | Count | Impact |
|----------|-------|--------|
| 🔴 CRITICAL | 5 | Blocks core user flows |
| 🟠 HIGH | 12 | Significant UX degradation |
| 🟡 MEDIUM | 8 | Polish & usability issues |
| 🟢 LOW | 5 | Minor improvements |

### Overall Assessment
**⚠️ REQUIRES IMMEDIATE ATTENTION** - Several critical bugs prevent normal user flows. The double-locale bug (`/en/en/`) breaks navigation throughout the account area. Order management exists but lacks seller status update controls.

---

## Part 1: Critical Bugs (Must Fix Immediately)

### 1.1 🔴 Double Locale Prefix Bug
**Route:** `/account/*` pages
**Files:** 
- `app/[locale]/(account)/account/_components/account-recent-activity.tsx`
- Potentially other account components

**Problem:** Links generate `/en/en/account/orders` instead of `/en/account/orders`

**Root Cause:** The `withLocale()` helper adds locale prefix, but `Link` from `@/i18n/routing` already handles this automatically.

```tsx
// WRONG:
const withLocale = (path: string) => `/${locale}${path}`
<Link href={withLocale("/account/orders")}>  // Results in /en/en/account/orders

// CORRECT:
<Link href="/account/orders">  // i18n Link handles locale
```

**Fix:** Remove `withLocale()` usage when using the i18n `Link` component. Use it only for programmatic navigation with plain anchors.

**Impacted Components:**
- `account-recent-activity.tsx` - 6+ instances
- `account-sidebar.tsx` - Check for similar patterns
- `account-stats-cards.tsx` - Check for similar patterns

---

### 1.2 🔴 Homepage Product Links Not Working
**Route:** `/` (Homepage)
**Component:** `TabbedProductFeed` → `ProductCard`

**Problem:** Automated tests couldn't find clickable product links on homepage. Product cards exist (51 found) but clicking doesn't navigate.

**Investigation:**
- ProductCard generates `productUrl = username ? \`/\${username}/\${slug || id}\` : "#"`
- If `username` is null/undefined, URL becomes `"#"` - not clickable!
- Server-side fetch may not be providing `storeSlug` properly

**Fix Options:**
1. Ensure API always returns `storeSlug` for products
2. Fallback to `/product/${id}` when username unavailable
3. Debug the `/api/products/feed` endpoint

---

### 1.3 🔴 Tabs Not Visible/Clickable on Desktop
**Route:** `/` (Homepage)
**Component:** `TabbedProductFeed`

**Problem:** Tabs exist in DOM (34 found) but click actions timeout with "element is not visible"

**Possible Causes:**
- Tabs may have `hidden` class on certain viewports
- CSS `opacity: 0` or `visibility: hidden`
- Overlapping element blocking interaction
- Mobile-only tabs rendered on desktop

**Investigation Needed:**
- Check if desktop tabs use different markup than mobile
- Verify CSS media queries for tab visibility

---

### 1.4 🔴 Header Cart/Account Icons Not Detected
**Route:** All pages (Header)
**Component:** Header component

**Problem:** Audit detected header exists with logo, nav, search, but cart and account icons returned false.

**From Audit:**
```json
{
  "exists": true,
  "height": 105,
  "hasLogo": true,
  "hasNav": true,
  "hasSearch": true,
  "hasCart": false,    // ❌
  "hasAccount": false  // ❌
}
```

**Possible Issues:**
- Icons may use unconventional class names
- Icons may be hidden on certain auth states
- Icons may be inside a dropdown not directly in header

---

### 1.5 🔴 Dialog Overlay Blocking Interactions
**Route:** `/` and potentially others

**Problem:** A dialog overlay (`bg-overlay-dark`) is intercepting pointer events, preventing hover and click actions.

**From Audit Logs:**
```
<div data-state="open" aria-hidden="true" data-aria-hidden="true" 
     data-slot="dialog-overlay" 
     class="fixed inset-0 z-50 bg-overlay-dark">
</div> intercepts pointer events
```

**Root Cause:** A modal/dialog is being opened (possibly promo, cookie consent, or announcement) and not being closed properly, or staying open on page load.

**Fix:** Find the component rendering this overlay and ensure:
- It closes on page navigation
- It doesn't auto-open on every visit
- Add proper `onClick` dismiss on overlay

---

## Part 2: High Priority Issues

### 2.1 🟠 Categories Page - No Sidebar Detected
**Route:** `/categories`

**From Audit:**
```json
{
  "hasSidebar": false,
  "hasMain": true,
  "hasGrid": true,
  "gridLeft": 236,
  "categoryCardCount": 24
}
```

**Issue:** Layout analysis shows grid starts at x=236 (suggesting space for sidebar) but no sidebar element found.

**Fix:** Either:
1. Add proper `aside` or `sidebar` class to the sidebar element
2. Or verify the categories layout is intentional (full-width grid)

---

### 2.2 🟠 Product Page Desktop Layout
**Route:** `/[username]/[slug]`
**Component:** `ProductPageLayout`

**Current State:** Uses `hidden lg:block` for desktop, which means layout exists but needs verification of:
- Two-column layout (gallery left, buy box right)
- Proper spacing and visual hierarchy
- Sticky buy box behavior
- Image gallery with zoom

**Audit couldn't reach product page** due to link issues. Manual verification needed.

---

### 2.3 🟠 Seller Cannot Update Order Status
**Route:** `/account/sales`
**Component:** `SalesTable`

**Problem:** The sales table shows orders but has no controls for seller to:
- Mark order as "Received" (payment confirmed)
- Mark order as "Shipped" (add tracking)
- Mark order as "Delivered"

**Current:** Only "View" button exists.

**Fix:** Add action dropdown with status update options:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm">
      Actions
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => updateStatus(sale.id, 'processing')}>
      Mark Received
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => openShippingDialog(sale.id)}>
      Add Tracking
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => updateStatus(sale.id, 'delivered')}>
      Mark Delivered
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Backend:** Needs server action to update `order_items.status`

---

### 2.4 🟠 Buyer Cannot Cancel Order
**Route:** `/account/orders/[id]`
**Component:** `OrderDetailContent`

**Problem:** Return request exists (for delivered items) but no cancel option for pending/paid orders.

**Fix:** Add cancel button for orders in `pending` or `paid` status:
```tsx
{(orderStatus === 'pending' || orderStatus === 'paid') && (
  <Button variant="destructive" onClick={handleCancelOrder}>
    Cancel Order
  </Button>
)}
```

---

### 2.5 🟠 Multiple 404 Errors on Page Load
**Route:** `/account/*`

**From Audit:**
```
Console Error: Failed to load resource: the server responded with a status of 404 ()
```
Multiple 404 errors detected - likely missing images, fonts, or API routes.

**Fix:** Audit network requests to identify missing resources.

---

### 2.6 🟠 Orders Page Shows No Order List
**Route:** `/account/orders`

**From Audit:**
```json
{
  "hasOrderList": false,
  "hasOrderCards": 0,
  "hasEmptyState": false,
  "hasFilters": false,
  "hasPagination": false
}
```

**Issue:** The orders page may not be rendering properly, or selectors are wrong.

---

### 2.7 🟠 Missing Register Link on Login Page
**Route:** `/auth/login`

**From Audit:**
```json
{
  "hasRegisterLink": false,
  "hasForgotPassword": true,
  "hasSocialLogin": false
}
```

**Fix:** Add prominent "Create Account" link/button.

---

### 2.8 🟠 Notifications System Not Visible
**Route:** `/account`

**Status:** Link exists (`/account/notifications`) but no notification bell icon with badge in header.

**Fix:** Add notification bell icon to header with unread count badge.

---

### 2.9 🟠 Chat/Messages Link Exists but Page Status Unknown
**Route:** `/chat`

**Status:** Link found (`/en/en/chat` - with double locale bug). Need to verify page functionality.

---

### 2.10-2.12 🟠 Additional High Priority
- **2.10:** Product cards on category pages work (40 found) but homepage doesn't
- **2.11:** Sell form is complete but missing condition selector
- **2.12:** Sell form missing location input

---

## Part 3: Medium Priority Issues

### 3.1 🟡 Hero Section Not Detected
**Route:** `/`

**Problem:** No clear hero/banner section found with standard selectors.

**Current:** Homepage has `MarketplaceHero` component but may not use standard classes.

---

### 3.2 🟡 Tab Labels Duplicated
**Route:** `/`

**From Audit:**
```json
{
  "tabLabels": [
    "AllAll",
    "FashionFashion",
    "ElectronicsElectronics"
  ]
}
```

**Issue:** Tab labels appear twice in text content - possibly icon + text duplicated.

---

### 3.3 🟡 Product Card Missing Breadcrumb
**Route:** Product page

**Expected:** `Home > Category > Subcategory > Product`

---

### 3.4 🟡 Product Card Missing Seller Info Badge
**Route:** Product page

**Expected:** Seller name, rating, verified badge visible without scrolling.

---

### 3.5 🟡 Cart Page Checkout Button Selector Issue
**Route:** `/cart`

**Problem:** Audit script error - `:has-text()` is Playwright-specific, not valid DOM selector.

---

### 3.6 🟡 No Filters on Category Pages
**Route:** `/categories/[slug]`

**Expected:** Price range, condition, brand filters on sidebar.

---

### 3.7 🟡 No Sorting on Category Pages
**Route:** `/categories/[slug]`

**Expected:** Sort by price, newest, rating dropdown.

---

### 3.8 🟡 Product Description Section
**Route:** Product page

**Status:** Conditional rendering exists but may not be visible.

---

## Part 4: Low Priority (Nice to Have)

### 4.1 🟢 Social Login Options
- Google, Facebook sign-in buttons

### 4.2 🟢 Related Products Section
- "You may also like" on product page

### 4.3 🟢 Recently Viewed Section
- Already has tracker, may need UI section

### 4.4 🟢 Product Page Image Zoom
- On hover magnification

### 4.5 🟢 Order Status Email Notifications
- Automated emails on status changes

---

## Part 5: Feature Implementation Checklist

### Order Management System

#### Buyer Features
- [x] View order history with status
- [ ] Cancel pending orders ⚠️ **NEEDS IMPLEMENTATION**
- [x] Track shipped orders (tracking link works)
- [x] Contact seller from order (Message button exists)
- [x] Leave review after delivery (Feedback prompt exists)
- [ ] Receive notifications for status changes ⚠️ **NEEDS VERIFICATION**

#### Seller Features
- [x] View incoming sales/orders
- [ ] Mark order as "Received" ⚠️ **NEEDS IMPLEMENTATION**
- [ ] Mark order as "Shipped" (add tracking) ⚠️ **NEEDS IMPLEMENTATION**
- [ ] Mark order as "Delivered" ⚠️ **NEEDS IMPLEMENTATION**
- [x] Contact buyer from order (via Messages)
- [ ] Process refunds ⚠️ **NEEDS IMPLEMENTATION**
- [ ] Receive notifications for new orders ⚠️ **NEEDS VERIFICATION**

### Notification System
- [x] Notification settings page exists
- [ ] In-header notification bell with badge ⚠️ **NEEDS IMPLEMENTATION**
- [ ] Real-time notification updates ⚠️ **NEEDS VERIFICATION**

### Messaging/Chat System
- [x] Chat route exists
- [ ] Buyer-seller direct messaging ⚠️ **NEEDS VERIFICATION**
- [ ] Message threads linked to orders ⚠️ **NEEDS VERIFICATION**
- [ ] Unread message indicators ⚠️ **NEEDS VERIFICATION**

---

## Part 6: Refactor Implementation Plan

### Phase 1: Critical Bug Fixes (Day 1-2)

| # | Task | Files | Est. Time |
|---|------|-------|-----------|
| 1 | Fix double-locale bug | `account-recent-activity.tsx`, other account components | 2h |
| 2 | Fix homepage product links | `ProductCard`, API endpoint | 2h |
| 3 | Fix/remove blocking dialog overlay | Find overlay source | 1h |
| 4 | Verify header cart/account icons | Header components | 1h |
| 5 | Debug tab visibility on desktop | `TabbedProductFeed` | 2h |

### Phase 2: Order Management (Day 3-5)

| # | Task | Files | Est. Time |
|---|------|-------|-----------|
| 1 | Add seller order status controls | `sales-table.tsx`, new actions | 4h |
| 2 | Add buyer cancel order | `order-detail-content.tsx`, new action | 2h |
| 3 | Add shipping tracking dialog | New component | 3h |
| 4 | Test full order lifecycle | E2E test | 2h |

### Phase 3: Notifications & Chat (Day 6-7)

| # | Task | Files | Est. Time |
|---|------|-------|-----------|
| 1 | Add notification bell to header | Header, new component | 3h |
| 2 | Verify chat functionality | Chat components | 2h |
| 3 | Link notifications to realtime | Supabase realtime | 4h |

### Phase 4: UI Polish (Day 8-10)

| # | Task | Files | Est. Time |
|---|------|-------|-----------|
| 1 | Product page desktop layout audit | `product-page-layout.tsx` | 4h |
| 2 | Categories sidebar alignment | Categories layout | 2h |
| 3 | Add filters to category pages | New filter component | 4h |
| 4 | Fix duplicate tab labels | Tab component | 1h |
| 5 | Add breadcrumb to product page | New component | 2h |

---

## Part 7: Files to Modify (Prioritized)

### Immediate (Phase 1)
1. `app/[locale]/(account)/account/_components/account-recent-activity.tsx`
2. `components/sections/tabbed-product-feed.tsx`
3. `components/shared/product/product-card.tsx`
4. Dialog overlay source (TBD)

### Order Management (Phase 2)
5. `app/[locale]/(account)/account/sales/_components/sales-table.tsx`
6. `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx`
7. `app/actions/` - new order status actions
8. `lib/order-status.ts` - status transition logic

### Notifications (Phase 3)
9. `components/layout/header/` - notification bell
10. `components/dropdowns/notifications-dropdown.tsx`
11. `lib/supabase/realtime.ts` - notification subscriptions

---

## Part 8: Testing Requirements

### E2E Tests to Add/Update
1. `e2e/order-lifecycle.spec.ts` - Full buyer→seller flow
2. `e2e/seller-order-management.spec.ts` - Status updates
3. `e2e/notifications.spec.ts` - Notification delivery
4. `e2e/homepage-desktop.spec.ts` - Product card clicks

### Manual Testing Checklist
- [ ] Homepage tabs work on desktop
- [ ] Product cards navigate to product page
- [ ] Login/logout flow works
- [ ] Add to cart from product page
- [ ] Complete checkout with Stripe test card
- [ ] View order as buyer
- [ ] Update order status as seller
- [ ] Cancel order as buyer
- [ ] Receive/view notifications
- [ ] Send message to seller

---

## Appendix A: Audit Screenshots

| File | Description |
|------|-------------|
| `01-homepage-desktop.png` | Homepage at 1920x1080 |
| `02-categories-page.png` | Categories grid layout |
| `02b-category-detail.png` | Category with products |
| `04-login-page.png` | Login form |
| `04b-login-filled.png` | Login with credentials |
| `04c-after-login.png` | Redirected after login |
| `05-account-page.png` | Account dashboard |
| `05b-orders-page.png` | Orders list (empty?) |
| `06-sell-form.png` | Product listing form |
| `07-cart-page.png` | Shopping cart |

---

## Appendix B: API Endpoints to Verify

1. `/api/products/feed` - Product listing data
2. `/api/orders/[id]/status` - Order status updates (may not exist)
3. `/api/notifications` - Notification fetching
4. `/api/messages` - Chat messages

---

## Appendix C: Database Tables Involved

- `orders` - Order header
- `order_items` - Line items with status
- `profiles` - User/seller info
- `products` - Product listings
- `notifications` - User notifications
- `messages` - Chat messages

---

*End of Audit Report*
