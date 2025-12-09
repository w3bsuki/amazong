# 🚀 AMZN Production Audit Report

**Date:** December 2024  
**Platform:** Bulgarian E-commerce Marketplace  
**Default Language:** Bulgarian (BG)  
**Currency:** BGN (лв.)

---

## 📋 Executive Summary

This comprehensive audit identifies **critical blockers**, **major issues**, and **improvements** needed before production launch. The audit covers desktop (1920x1080) and mobile (390x844) viewports, all major user flows, and data integrity.

### 🔴 Critical Blockers: 12
### 🟠 Major Issues: 8
### 🟡 Minor Issues: 11
### ✅ Working Well: 15

---

## 🔴 PHASE 1: CRITICAL BLOCKERS (Launch Blockers)

These must be fixed before any production deployment.

### 1.1 `/sell` Page - Infinite Loading State
**Severity:** 🔴 CRITICAL  
**File:** `app/[locale]/(main)/sell/page.tsx`  
**Issue:** Page stuck on "Loading..." indefinitely  
**Root Cause:** Supabase auth timeout fallback not triggering properly  
**Impact:** Sellers cannot create listings - core business functionality broken

**Fix Required:**
- Fix auth state detection with proper fallback
- Remove 2s timeout dependency
- Show proper "Sign in required" state for unauthenticated users

---

### 1.2 `/todays-deals` Page - Hardcoded Mock Data
**Severity:** 🔴 CRITICAL  
**File:** `app/[locale]/(main)/todays-deals/page.tsx` (Line ~50-150)  
**Issue:** Contains hardcoded `deals` array with mock products:
- "Amazon Fire TV Stick" ($34.99)
- "Echo Dot (5th Gen)" ($49.99)
- "Samsung 55" 4K TV" ($547.99)

**Impact:** 
- Shows USD prices instead of BGN
- Amazon branded products on competitor platform
- Not connected to Supabase deals

**Fix Required:**
- Remove entire hardcoded `deals` array
- Connect to `getGlobalDeals()` from Supabase
- Use `deals-wrapper.tsx` pattern (already exists)

---

### 1.3 Promotional Cards → Empty Search Pages
**Severity:** 🔴 CRITICAL  
**Location:** Homepage promotional cards section  
**Issue:** All promotional cards lead to empty search results (0 products):
- "Save $200 on Apple devices" → `/search?category=electronics&brand=apple` → Empty
- "До 50% избрани играчки" → `/todays-deals?category=toys` → Empty
- "До 40% електроника" → `/search?category=electronics` → Empty
- "До 30% мода" → `/search?category=fashion` → Empty

**Impact:** Broken user trust, bounce rate increase

**Fix Required:**
- Either: Connect promotional cards to actual category pages with products
- Or: Hide promotional cards when categories are empty
- Or: Replace with CTA "Post a listing in this category"

---

### 1.4 Product Pages - Empty Main Content
**Severity:** 🔴 CRITICAL  
**URL Example:** `/product/shop4e/kotka`  
**Issue:** Product detail pages render empty main content area  
**Symptoms:** Only header/footer render, main product info missing

**Fix Required:**
- Debug product page data fetching
- Verify Supabase product queries return data
- Check dynamic route parameter handling

---

### 1.5 `/categories` Page - Shows Hidden/Duplicate Categories
**Severity:** 🔴 CRITICAL  
**File:** `app/[locale]/(main)/categories/page.tsx`  
**Issue:** Displays categories with `[СКРИТО]` (hidden) and `[ДУБЛИКАТ]` (duplicate) prefixes that should be filtered out

**Examples Found:**
- "[СКРИТО] Компютри"
- "[ДУБЛИКАТ] Софтуер"

**Fix Required:**
- Filter categories by `is_visible = true` and `is_duplicate = false`
- Remove prefix text from display names

---

### 1.6 `/account` Page - Completely Blank
**Severity:** 🔴 CRITICAL  
**URL:** `/account`  
**Issue:** Page renders completely blank (only notifications region visible)

**Fix Required:**
- Implement account dashboard
- Show user profile, orders, settings
- Handle unauthenticated state properly

---

### 1.7 `/wishlist` - Returns 404
**Severity:** 🔴 CRITICAL  
**URL:** `/wishlist`  
**Issue:** Page not found error

**Fix Required:**
- Create wishlist page
- Or: Remove all wishlist links from navigation

---

### 1.8 `/account/orders` - Empty Content
**Severity:** 🔴 CRITICAL  
**URL:** `/account/orders`  
**Issue:** Page renders but shows no content

**Fix Required:**
- Implement order history display
- Show "No orders yet" empty state
- Connect to Supabase orders table

---

### 1.9 `/cart` Page - English Text
**Severity:** 🔴 CRITICAL  
**File:** Cart page component  
**Issue:** Shows hardcoded English text:
- "Your Amazon Cart is empty" (should be Bulgarian + AMZN brand)
- "Continue Shopping" (should be Bulgarian)

**Fix Required:**
- Use i18n translation keys
- Replace "Amazon" with "AMZN"
- Translate all strings to Bulgarian

---

### 1.10 Mobile Locale Detection - Shows English
**Severity:** 🔴 CRITICAL  
**Issue:** Mobile viewport defaults to `/en` locale instead of `/bg`  
**Symptoms:** 
- All text in English
- Prices in € instead of лв.

**Fix Required:**
- Fix locale detection for mobile devices
- Ensure Bulgarian is default for Bulgarian users
- Check i18n middleware configuration

---

### 1.11 Currency Display - Mixed €/лв./$
**Severity:** 🔴 CRITICAL  
**Issue:** Inconsistent currency display across pages:
- Homepage (BG): лв. ✅
- Homepage (EN): € ❌ (should be BGN)
- Promotional cards: $ ❌
- Deals page: $ ❌

**Fix Required:**
- Standardize to BGN (лв.) for Bulgarian market
- Remove all USD/EUR references
- Update promotional card copy

---

### 1.12 Category Hierarchy Menu - Shows "Зареждане..." Forever
**Severity:** 🔴 CRITICAL  
**Location:** Header category mega menu  
**Issue:** Category menu shows "Зареждане..." (Loading...) and never resolves

**Fix Required:**
- Fix category data fetching
- Add proper error handling
- Show fallback content on failure

---

### 1.13 Homepage Section Renaming & Supabase Query Fixes
**Severity:** 🔴 CRITICAL  
**Location:** Homepage main sections  
**Files:** 
- `app/[locale]/(main)/page.tsx`
- `components/sections/trending-section.tsx`
- `components/sections/featured-section.tsx`
- `lib/data/products.ts`
- `messages/bg.json` / `messages/en.json`

**Current State vs Required:**

| Current Name (BG) | Required Name (BG) | Data Source |
|-------------------|-------------------|-------------|
| "Открийте популярни продукти" | **"Промотирани обяви"** | Products with `is_promoted = true` from billing/paid plans |
| "Препоръчани продукти" | **"Най-нови обяви"** | Products sorted by `created_at DESC` (newest first) |
| "Оферти на деня" | Keep as is ✅ | Products with `sale_price < price` |

**Supabase Query Fixes Required:**

1. **Promoted Listings Section ("Промотирани обяви")**
   ```typescript
   // lib/data/products.ts - Add new function
   export async function getPromotedProducts(limit = 12) {
     const { data } = await supabase
       .from('products')
       .select('*')
       .eq('is_promoted', true)
       .eq('status', 'active')
       .order('promotion_priority', { ascending: false })
       .limit(limit)
     return data
   }
   ```

2. **Newest Listings Section ("Най-нови обяви")**
   ```typescript
   // lib/data/products.ts - Update getNewestProducts
   export async function getNewestProducts(limit = 12) {
     const { data } = await supabase
       .from('products')
       .select('*')
       .eq('status', 'active')
       .order('created_at', { ascending: false })
       .limit(limit)
     return data
   }
   ```

3. **Empty Section Handling**
   - If no promoted products exist, show CTA: "Промотирай своята обява" (Promote your listing)
   - Link to billing/plans page for sellers

**i18n Translation Keys to Update:**
```json
// messages/bg.json
{
  "home": {
    "promotedListings": "Промотирани обяви",
    "promotedListingsSubtitle": "Топ обяви от продавачи",
    "newestListings": "Най-нови обяви", 
    "newestListingsSubtitle": "Току-що добавени",
    "emptyPromoted": "Няма промотирани обяви",
    "promoteYourListing": "Промотирай своята обява"
  }
}
```

**Database Schema Requirements:**
- Ensure `products` table has:
  - `is_promoted` (boolean, default false)
  - `promotion_priority` (integer, for ordering)
  - `promotion_expires_at` (timestamp, for time-limited promotions)
  - `created_at` (timestamp, for newest sorting)

---

## 🟠 PHASE 2: MAJOR ISSUES (Must Fix Before Launch)

### 2.1 Section Naming - UI Component Updates
**Location:** Homepage  
**Issue:** Section titles don't match business requirements:
- Current: "Открийте популярни продукти" 
- Should be: "Промотирани обяви" (Promoted Listings)
- Current: "Препоръчани продукти"
- Should be: "Най-нови обяви" (Newest Listings)

**Files to Update:**
- `components/sections/trending-section.tsx` - Update heading text
- `components/sections/featured-section.tsx` - Update heading text
- `app/[locale]/(main)/page.tsx` - Update any hardcoded titles

---

### 2.2 Category Cards - External Unsplash Images
**File:** `app/[locale]/(main)/page.tsx`  
**Issue:** Category card images use external Unsplash URLs instead of standardized category icons

**Fix Required:**
- Use same icon set as category circles
- Host images locally or in Supabase storage

---

### 2.3 Hero Carousel Alignment
**Issue:** User reported hero section alignment issues  
**Required:** Review and fix hero carousel positioning


---

### 2.4 Missing Billing/Plans Integration for Promoted Listings
**Severity:** 🟠 MAJOR  
**Issue:** No promoted listings payment system exists  
**Impact:** Cannot monetize platform, "Промотирани обяви" section has no paid products

**Full Implementation Required:**

1. **Seller Plans/Tiers:**
   ```
   - Free: 5 listings/month, no promotion
   - Basic (19.99 лв./month): 20 listings, 1 promoted slot
   - Pro (49.99 лв./month): Unlimited listings, 5 promoted slots
   - Business (99.99 лв./month): Unlimited everything, priority support
   ```

2. **Database Schema Additions:**
   ```sql
   -- seller_subscriptions table
   CREATE TABLE seller_subscriptions (
     id UUID PRIMARY KEY,
     seller_id UUID REFERENCES sellers(id),
     plan_type TEXT, -- 'free', 'basic', 'pro', 'business'
     started_at TIMESTAMP,
     expires_at TIMESTAMP,
     promoted_slots_used INTEGER DEFAULT 0,
     promoted_slots_total INTEGER DEFAULT 0
   );
   
   -- Add to products table
   ALTER TABLE products ADD COLUMN is_promoted BOOLEAN DEFAULT FALSE;
   ALTER TABLE products ADD COLUMN promotion_priority INTEGER DEFAULT 0;
   ALTER TABLE products ADD COLUMN promotion_expires_at TIMESTAMP;
   ```

3. **Payment Integration:**
   - Stripe for international cards
   - ePay.bg for Bulgarian cards (local preference)
   - Invoice generation for business accounts

4. **UI Components Needed:**
   - `/account/billing` - Subscription management page
   - `/account/billing/plans` - Plan selection/upgrade
   - "Promote this listing" button on seller's product cards
   - Promotion badge on promoted products

---

### 2.5 Console Errors/Warnings
**Issue:** Development console shows errors that should be cleaned up

---

### 2.6 Test Data in Production Database
**Products Found:**
- "Kotka" (55.00 лв.)
- "Прасе за Коледа" (55,550,000.00 лв.) - ridiculous price
- "12312312313" - test product name
- "123123123" - test product name
- "PET CBD" - may need verification

**Fix Required:**
- Clean test products from database
- Add data validation rules

---

### 2.7 Mock Review Counts
**Issue:** Products show fake review counts (145000, 112000, 89000)  
**Impact:** Misleading users about product popularity

**Fix Required:**
- Connect to real reviews table
- Show actual review counts

---

### 2.8 Footer Social Links - Placeholder #
**Issue:** All social media links point to "#"

**Fix Required:**
- Add real social media URLs
- Or: Hide social links until configured


---

## 🟡 PHASE 3: MINOR ISSUES (Can Be Post-Launch)

### 3.1 "Back to top" Button Text
**Issue:** Redundant icon + text, consider icon-only

### 3.2 Mobile Navigation Icons
**Issue:** Some icons may be too small for touch targets

### 3.3 Product Card Truncation
**Issue:** Long product names get truncated inconsistently

### 3.4 Category Circle Count
**Issue:** 23 categories shown - may need pagination

### 3.5 "Доставка пн, 8.12" Date Format
**Issue:** Static delivery date should be dynamic

### 3.6 Price Formatting
**Issue:** "55 550 000,00 лв." - needs thousands separator consistency

### 3.7 Empty Rating Stars
**Issue:** Products with 0 reviews show empty stars

### 3.8 "tech-haven" Seller Name
**Issue:** Test seller name appearing in production data

### 3.9 Skip Links Not Visible
**Issue:** Accessibility skip links should be visible on focus

### 3.10 Footer Column Responsiveness
**Issue:** Mobile footer columns may need optimization

### 3.11 Image Alt Text
**Issue:** Some images have generic alt text

---

## ✅ PHASE 4: WORKING WELL

1. ✅ Homepage overall structure and layout
2. ✅ Category circles with proper images
3. ✅ Product card design and pricing display
4. ✅ Hero carousel functionality
5. ✅ Navigation structure (desktop)
6. ✅ Footer structure and links
7. ✅ Authentication pages (`/auth/login`, `/auth/sign-up`)
8. ✅ "Trending Products" section data (from Supabase)
9. ✅ "Deals of the Day" section data (from Supabase)
10. ✅ "Recommended Products" section data (from Supabase)
11. ✅ Mobile header layout
12. ✅ Product discount badges
13. ✅ Price comparison (sale vs original)
14. ✅ Delivery date display format
15. ✅ Tab navigation (Нови/Промоции/Топ продажби)

---

## 🔧 PHASE 5: CODE CLEANUP (Tech Debt)

### 5.1 Files to Review for Mock Data
```
app/[locale]/(main)/todays-deals/page.tsx  # CONFIRMED mock data
components/sections/deals-section.tsx      # Check for mocks
app/[locale]/(main)/page.tsx               # Check hero cards
```

### 5.2 Console Logs to Remove
- Run: `grep -r "console.log" --include="*.tsx" --include="*.ts" app/ components/ lib/`

### 5.3 TODO Comments to Address
- Run: `grep -r "TODO\|FIXME\|HACK" --include="*.tsx" --include="*.ts" app/ components/ lib/`

### 5.4 Unused Imports
- Run ESLint with unused-imports rule

### 5.5 Deprecated Dependencies
- Review package.json for updates

---

## 📊 IMPLEMENTATION PRIORITY MATRIX

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P0 | `/sell` loading fix | Medium | Critical |
| P0 | `/todays-deals` mock removal | Low | Critical |
| P0 | Promotional cards empty pages | Medium | Critical |
| P0 | Product pages empty | High | Critical |
| P0 | Category filtering | Low | Critical |
| P0 | Locale detection | Medium | Critical |
| P0 | Currency standardization | Low | Critical |
| **P0** | **Section renaming + Supabase queries** | **Medium** | **Critical** |
| P1 | Account pages | High | Major |
| P1 | Wishlist page | Medium | Major |
| P1 | Cart localization | Low | Major |
| P1 | Billing/Plans for promoted listings | High | Major |
| P2 | Category images | Medium | Minor |
| P2 | Social links | Low | Minor |
| P2 | Code cleanup | Medium | Minor |

---

## 📝 RECOMMENDED ACTION PLAN

### Week 1: Critical Fixes
1. Fix `/sell` page auth state
2. Remove `/todays-deals` mock data
3. Fix product page data fetching
4. Filter hidden categories
5. Fix locale detection
6. Standardize currency to BGN
7. **Rename homepage sections:**
   - "Открийте популярни продукти" → "Промотирани обяви"
   - "Препоръчани продукти" → "Най-нови обяви"
8. **Update Supabase queries:**
   - Add `getPromotedProducts()` for promoted listings
   - Fix `getNewestProducts()` to sort by `created_at DESC`
   - Add empty state CTAs for sections with no products

### Week 2: Major Features
1. Implement `/account` dashboard
2. Create `/wishlist` page
3. Localize cart page
4. Fix promotional card destinations
5. **Implement billing/plans system for promoted listings**
6. Add `is_promoted`, `promotion_priority` columns to products table

### Week 3: Polish & Cleanup
1. Remove console logs
2. Address TODOs
3. Update category images
4. Add real social links
5. Clean test data

### Week 4: Testing & Launch Prep
1. Full regression testing
2. Performance optimization
3. SEO verification
4. Analytics setup
5. Production deployment

---

## 🎯 SUCCESS CRITERIA

Before launch, verify:
- [ ] All pages load without errors
- [ ] All prices show in BGN (лв.)
- [ ] No mock/test data visible
- [ ] Bulgarian is default language
- [ ] Sellers can create listings
- [ ] Users can view products
- [ ] Categories filter correctly
- [ ] Account pages functional
- [ ] Mobile experience polished
- [ ] No console errors in production
- [ ] **"Промотирани обяви" section shows promoted products from billing**
- [ ] **"Най-нови обяви" section shows newest products sorted by created_at**
- [ ] **Empty sections show appropriate CTAs (e.g., "Промотирай своята обява")**

---

*Generated by Playwright automated audit - December 2024*

