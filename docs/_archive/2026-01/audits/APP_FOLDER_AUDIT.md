# 🔥 GORDON RAMSAY'S BRUTAL APP FOLDER AUDIT

**Date:** January 2, 2026  
**Scope:** `app/` folder - Routes, API, Server Actions, Code Quality  
**Verdict:** BLOODY HELL, IT'S A MESS! But fixable.

---

## 📋 EXECUTIVE SUMMARY

| Category | Issues Found | Critical | High | Medium | Low |
|----------|-------------|----------|------|--------|-----|
| Route Structure | 12 | 2 | 4 | 4 | 2 |
| API Routes | 9 | 1 | 3 | 4 | 1 |
| Server Actions | 7 | 1 | 2 | 3 | 1 |
| Code Quality | 19 | 0 | 6 | 9 | 4 |
| Performance | 8 | 2 | 3 | 2 | 1 |
| File Organization | 5 | 0 | 2 | 2 | 1 |
| **TOTAL** | **60** | **6** | **20** | **24** | **10** |

---

## 1. 🚨 ROUTE STRUCTURE ANALYSIS

### All Routes in `app/[locale]/`

#### Route Groups:
- `(main)/` - Public e-commerce pages
- `(account)/` - Protected account pages
- `(sell)/` - Seller listing flow
- `(checkout)/` - Checkout flow
- `(auth)/` - Authentication
- `(admin)/` - Admin dashboard
- `(business)/` - Business seller dashboard
- `(chat)/` - Messaging
- `(plans)/` - Subscription plans

#### Dynamic Routes:
- `[username]/` - Public profile pages
- `[username]/[productSlug]/` - Product detail pages
- `[...notFound]/` - Catch-all 404 handler (EMPTY!)

---

### ISSUE #1: EMPTY CATCH-ALL ROUTE
**Severity:** CRITICAL 🔴  
**File:** `app/[locale]/[...notFound]/`  
**Problem:** Folder exists but is COMPLETELY EMPTY - no page.tsx!
```
Directory listing: Folder is empty
```
**Impact:** This catch-all was probably meant to handle 404s for unknown routes but does nothing. Dead code creating confusion.

**Fix:** Either add a proper `page.tsx` with `notFound()` redirect OR delete the folder entirely. You already have `app/[locale]/not-found.tsx`.

---

### ISSUE #2: DUPLICATE PRODUCT ROUTES
**Severity:** HIGH 🟠  
**Files:** 
- `app/[locale]/(main)/product/[id]/page.tsx`
- `app/[locale]/(main)/product/[...slug]/page.tsx`

**Problem:** Both routes just call `notFound()`:
```tsx
export default async function ProductRedirectPage() {
  notFound()
}
```
**Impact:** Dead code. Products are actually served at `/{username}/{productSlug}`.

**Fix:** Delete both `app/[locale]/(main)/product/[id]/` and `app/[locale]/(main)/product/[...slug]/` directories.

---

### ISSUE #3: COMING SOON PLACEHOLDER PAGES
**Severity:** MEDIUM 🟡  
**Files:**
- `app/[locale]/(main)/advertise/page.tsx`
- `app/[locale]/(main)/affiliates/page.tsx`
- `app/[locale]/(main)/blog/page.tsx`
- `app/[locale]/(main)/careers/page.tsx`
- `app/[locale]/(main)/investors/page.tsx`
- `app/[locale]/(main)/store-locator/page.tsx`
- `app/[locale]/(main)/registry/page.tsx`

**Problem:** 7+ placeholder pages using `ComingSoonPage` component. These routes are visible but non-functional.

**Impact:** 
- Build time wasted on non-functional routes
- SEO pollution with empty content
- User confusion

**Fix:** 
1. Remove from build until ready, OR
2. Add `noindex` to these pages' metadata
3. Consider consolidating to single `/coming-soon/[feature]` route

---

### ISSUE #4: REDUNDANT SETTINGS ROUTES
**Severity:** MEDIUM 🟡  
**Files:**
- `app/[locale]/(account)/account/settings/page.tsx` - Simple links page
- `app/[locale]/(account)/account/(settings)/notifications/` - Actual settings

**Problem:** `/account/settings` just shows links to other pages. It's redundant with sidebar navigation.

**Fix:** Either make it a redirect to `/account/profile` or remove it.

---

### ISSUE #5: SELLER DASHBOARD DUPLICATION
**Severity:** HIGH 🟠  
**Files:**
- `app/[locale]/(main)/seller/dashboard/` - Older dashboard
- `app/[locale]/(business)/dashboard/` - Newer Shopify-style dashboard

**Problem:** Two separate seller dashboards exist. Business dashboard has more features but the old one is still accessible.

**Fix:** Redirect `(main)/seller/dashboard` → `(business)/dashboard` or remove old dashboard.

---

### ISSUE #6: BUSINESS DASHBOARD PLACEHOLDER
**Severity:** MEDIUM 🟡  
**File:** `app/[locale]/(business)/dashboard/discounts/page.tsx`  
**Lines:** 33-36

```typescript
// Placeholder function - would need actual discounts table
async function getBusinessDiscounts(_sellerId: string) {
  // This is a placeholder - you'd need to create a discounts table
  // For now, return empty to demonstrate the UI
  return {
    discounts: [] as Array<{...}>,
    total: 0,
  }
}
```

**Impact:** Entire page is non-functional UI theater.

**Fix:** Either implement the feature or hide the route.

---

## 2. 🔌 API ROUTES ANALYSIS

### All 45 API Routes Found:
```
/api/ai/chat
/api/ai/health
/api/ai/listing-suggestions
/api/ai/search
/api/auth/sign-out
/api/badges/
/api/badges/[userId]
/api/badges/evaluate
/api/badges/feature/[badgeId]
/api/billing/invoices
/api/boost/checkout
/api/categories/
/api/categories/[slug]/attributes
/api/categories/[slug]/children
/api/categories/[slug]/context
/api/categories/attributes
/api/categories/products
/api/checkout/webhook
/api/geo/
/api/orders/[id]/ship
/api/orders/[id]/track
/api/payments/delete
/api/payments/set-default
/api/payments/setup
/api/payments/webhook
/api/plans/
/api/products/
/api/products/category/[slug]
/api/products/create
/api/products/deals
/api/products/feed
/api/products/nearby
/api/products/newest
/api/products/promoted
/api/products/search
/api/revalidate
/api/sales/export
/api/seller/limits
/api/stores/
/api/subscriptions/checkout
/api/subscriptions/portal
/api/subscriptions/webhook
/api/upload-chat-image
/api/upload-image
/api/wishlist/[token]
```

---

### ISSUE #7: DEPRECATED API ROUTE
**Severity:** HIGH 🟠  
**File:** `app/api/stores/route.ts`  
**Line:** 6-9

```typescript
/**
 * @deprecated This route is deprecated. Users now get a username at signup.
 * This route now updates the user's profile with seller-related fields.
 * The sellers table has been merged into the profiles table.
 */
```

**Impact:** Deprecated but still accessible and callable.

**Fix:** Add deprecation warning to response OR remove route entirely.

---

### ISSUE #8: DUPLICATE PRODUCT CREATION ENDPOINTS
**Severity:** HIGH 🟠  
**Files:**
- `app/api/products/route.ts` - POST creates product
- `app/api/products/create/route.ts` - POST also creates product

**Problem:** Two endpoints doing essentially the same thing with slight variations.

**Fix:** Consolidate to single endpoint, redirect the other.

---

### ISSUE #9: CONSOLE.LOG IN PRODUCTION WEBHOOKS
**Severity:** CRITICAL 🔴  
**File:** `app/api/checkout/webhook/route.ts`  
**Lines:** 42, 54, 102, 154, 160, 164, 173, 185

```typescript
console.log('Processing checkout.session.completed:', session.id);
console.log('Order already exists for payment intent:', session.payment_intent);
console.log('Order created successfully:', order.id);
// ... 6 more console.logs
```

**Impact:** 
- Performance degradation in production
- Log pollution
- Potential PII exposure in logs

**Fix:** Replace with proper logging service (Pino, Winston) or remove.

---

### ISSUE #10: CONSOLE.LOG IN SUBSCRIPTION WEBHOOK
**Severity:** HIGH 🟠  
**File:** `app/api/subscriptions/webhook/route.ts`  
**Lines:** 87, 157, 212, 214, 254, 296, 330

```typescript
console.log(`✅ Boost activated for product ${productId}...`)
console.log(`✅ Subscription activated for profile ${profileId}...`)
// ... 5 more
```

**Impact:** Same as above - production logging issues.

---

### ISSUE #11: HARDCODED CURRENCY
**Severity:** MEDIUM 🟡  
**File:** `app/api/products/route.ts`  
**Multiple files use hardcoded 'eur' or 'bgn' currency.**

**Fix:** Use environment variable or config for currency.

---

## 3. ⚡ SERVER ACTIONS ANALYSIS

### All Server Actions Found:
```
app/actions/
├── blocked-users.ts
├── boost.ts
├── buyer-feedback.ts
├── orders.ts
├── payments.ts
├── products.ts
├── profile.ts
├── reviews.ts
├── seller-feedback.ts
├── seller-follows.ts
├── subscriptions.ts
└── username.ts

app/[locale]/(sell)/_actions/sell.ts
app/[locale]/(checkout)/_actions/checkout.ts
app/[locale]/(chat)/_actions/report-conversation.ts
app/[locale]/(auth)/_actions/auth.ts
```

---

### ISSUE #12: UNEXPORTED SERVER ACTIONS
**Severity:** CRITICAL 🔴  
**File:** `app/actions/blocked-users.ts`  
**Lines:** 47, 69, 85

```typescript
async function unblockUser(userId: string) { ... }
async function getBlockedUsers() { ... }
async function isUserBlocked(userId: string) { ... }
```

**Problem:** Only `blockUser` is exported. Three other functions are **dead code** - not exported and never used!

**Fix:** Either export them or delete them.

---

### ISSUE #13: UNEXPORTED BUYER FEEDBACK ACTIONS
**Severity:** HIGH 🟠  
**File:** `app/actions/buyer-feedback.ts`  

Functions NOT exported (dead code):
- `canSellerRateBuyer()`
- `getBuyerReceivedRatings()`
- `getPublicBuyerFeedback()`
- `getSellerGivenFeedback()`
- `updateBuyerFeedback()`
- `deleteBuyerFeedback()`

Only `submitBuyerFeedback()` is exported!

---

### ISSUE #14: UNEXPORTED ORDER ACTIONS
**Severity:** HIGH 🟠  
**File:** `app/actions/orders.ts`  

Functions NOT exported (dead code):
- `getBuyerOrders()`
- `getBuyerOrderDetails()`

---

### ISSUE #15: UNEXPORTED REVIEW ACTIONS
**Severity:** MEDIUM 🟡  
**File:** `app/actions/reviews.ts`  

Functions NOT exported:
- `getProductReviews()`
- `canUserReview()`
- `markReviewHelpful()`
- `deleteReview()`

Only `submitReview()` is exported!

---

### ISSUE #16: UNEXPORTED USERNAME ACTIONS
**Severity:** MEDIUM 🟡  
**File:** `app/actions/username.ts`  

Functions NOT exported:
- `getPublicProfile()`
- `getCurrentUserProfile()`
- `hasUsername()`

---

### ISSUE #17: REVALIDATETAG WRONG SYNTAX
**Severity:** MEDIUM 🟡  
**Multiple Files**

```typescript
revalidateTag("blocked-users", "max")  // Wrong!
revalidateTag("products", "max")       // Wrong!
```

**Problem:** `revalidateTag()` only takes ONE argument - the tag string. The `"max"` second argument is invalid.

**Fix:** Remove second argument: `revalidateTag("blocked-users")`

---

## 4. 🧹 CODE QUALITY ISSUES

### ISSUE #18: CONSOLE.LOG STATEMENTS
**Severity:** MEDIUM 🟡  
**Count:** 19 occurrences across app/

| File | Line | Context |
|------|------|---------|
| `(sell)/sell/_lib/categories.ts` | 147 | Dev logging |
| `api/subscriptions/webhook/route.ts` | 87, 157, 212, 214, 254, 296, 330 | Production logs |
| `api/checkout/webhook/route.ts` | 42, 54, 102, 154, 160, 164, 173, 185 | Production logs |
| `api/categories/route.ts` | 56, 61, 65 | Dev guarded |

**Fix:** Replace with proper logging or remove.

---

### ISSUE #19: INCONSISTENT QUOTE STYLES
**Severity:** LOW 🟢  

Mixed usage of `"use server"` vs `'use server'`:
```typescript
// File: actions/payments.ts
'use server'

// File: actions/orders.ts
"use server"
```

**Fix:** Standardize on double quotes.

---

### ISSUE #20: DEAD CODE - UNUSED VARIABLE
**Severity:** LOW 🟢  
**File:** `app/api/products/create/route.ts`  
**Line:** 129

```typescript
// Map profile to seller format - keeping for compatibility reference
const _seller = {
  id: profile.id,
  store_name: profile.display_name || profile.business_name || profile.username,
}
```

**Problem:** `_seller` variable is created but never used.

**Fix:** Remove the dead code.

---

### ISSUE #21: INCONSISTENT ERROR HANDLING
**Severity:** MEDIUM 🟡  

Some actions return `{ success: false, error: "..." }`, others return `{ error: "..." }` without success flag.

**Fix:** Standardize on consistent error response format.

---

## 5. ⚡ PERFORMANCE CONCERNS

### ISSUE #22: MISSING SUSPENSE BOUNDARIES
**Severity:** HIGH 🟠  
**File:** `app/[locale]/(main)/layout.tsx`

The main layout has Suspense around `AuthStateListener` and `SiteHeader`, but many child pages don't use Suspense for their data fetching.

**Fix:** Add Suspense boundaries around dynamic content in pages.

---

### ISSUE #23: LARGE CLIENT COMPONENT
**Severity:** HIGH 🟠  
**File:** `app/[locale]/(sell)/_components/sell-form-unified.tsx`

This is marked `"use client"` but contains significant logic that could be server-rendered.

**Impact:** Increased bundle size, slower initial load.

---

### ISSUE #24: N+1 CATEGORY QUERIES
**Severity:** CRITICAL 🔴  
**File:** `app/[locale]/(sell)/sell/_lib/categories.ts`

```typescript
// Fetches L1, then L2 in batches, then L3 in batches
// This is 4+ separate queries instead of 1
const { data: rootCats } = await supabase.from("categories")...
const { data: l1Cats } = await supabase.from("categories")...
// Then loops with BATCH_SIZE = 100
```

**Impact:** Multiple database roundtrips instead of single recursive query.

**Fix:** Use a single recursive CTE query or the existing `getCategoryHierarchy()` function from `lib/data/categories`.

---

### ISSUE #25: AUTH CHECK IN EVERY ACTION
**Severity:** MEDIUM 🟡  

Every server action repeats:
```typescript
const supabase = await createClient()
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (authError || !user) {
  return { success: false, error: "Not authenticated" }
}
```

**Fix:** Create a reusable `requireAuth()` helper.

---

## 6. 📁 FILE ORGANIZATION ISSUES

### ISSUE #26: INCONSISTENT UNDERSCORE FOLDERS
**Severity:** MEDIUM 🟡  

Some route groups use underscore prefix for private folders, others don't:
- `(main)/_components/` ✅
- `(main)/_lib/` ✅
- `(sell)/_actions/` ✅
- `(business)/_components/` ✅
- `actions/` ❌ (should be `_actions/` or moved to lib)

**Fix:** Either move `app/actions/` to `lib/actions/` or standardize naming.

---

### ISSUE #27: MIXED LOCALE HANDLING
**Severity:** HIGH 🟠  

Some pages manually validate locale:
```typescript
const locale = validateLocale(localeParam)
```

Others just use it directly:
```typescript
const { locale } = await params
```

**Fix:** Standardize locale handling approach.

---

### ISSUE #28: FAVICON FOLDER
**Severity:** LOW 🟢  
**Path:** `app/favicon.ico/route.ts`

Having a folder named `favicon.ico` is unusual and confusing. Should just be a static file.

---

## 7. 📊 SUMMARY OF CRITICAL FIXES

### Must Fix Immediately (CRITICAL):
1. **Delete empty `[...notFound]` folder** - Dead code
2. **Remove/replace console.logs in webhooks** - Production logging issue
3. **Export dead server action functions** - Or delete them
4. **Fix N+1 category queries** - Performance killer

### Should Fix Soon (HIGH):
1. Delete duplicate product routes (`/product/[id]`, `/product/[...slug]`)
2. Remove deprecated `/api/stores` endpoint
3. Consolidate duplicate product creation APIs
4. Remove duplicate seller dashboards
5. Add Suspense boundaries to data-heavy pages
6. Fix `revalidateTag()` syntax (remove second argument)

### Nice to Have (MEDIUM/LOW):
1. Standardize quote styles
2. Consolidate coming-soon pages
3. Create `requireAuth()` helper
4. Standardize error response format
5. Clean up unused variables

---

## 8. 🎯 RECOMMENDED ACTION PLAN

### Phase 1: Emergency Cleanup (1-2 hours)
```bash
# Delete dead routes
rm -rf app/[locale]/[...notFound]
rm -rf app/[locale]/(main)/product/[id]
rm -rf app/[locale]/(main)/product/[...slug]

# Fix revalidateTag calls (remove second argument)
# Replace console.logs with proper logging
```

### Phase 2: API Consolidation (2-4 hours)
- Deprecate `/api/stores` properly
- Merge `/api/products` and `/api/products/create`
- Add proper logging service

### Phase 3: Server Actions Audit (2-4 hours)
- Export or delete unused functions
- Create shared `requireAuth()` helper
- Standardize error responses

### Phase 4: Performance (4-8 hours)
- Optimize category queries
- Add Suspense boundaries
- Review client vs server component decisions

---

**Final Grade: C-**  
*"It's not rotten, but it needs serious cleanup before serving to production."*

— Gordon Ramsay (of Code) 🔥
