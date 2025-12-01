# 🚀 AMZN Production Push - Comprehensive Audit & Action Plan

**Date:** December 1, 2025  
**Status:** Pre-Production Audit  
**Priority:** HIGH

---

## 📋 Executive Summary

This document provides a comprehensive audit of the AMZN e-commerce platform before production deployment. It identifies UI/UX issues, missing functionality, and provides actionable solutions with implementation priorities.

---

## 🔍 AUDIT FINDINGS

### 1. Header & Navigation Issues

#### 1.1 Location Dropdown (Доставка до)
**Current State:** Shows hardcoded 5 countries (Bulgaria, US, Germany, UK, France)  
**Issue:** No "View more" option, no dynamic loading from Supabase  

**Required Changes:**
- [ ] Add `shipping_countries` table to Supabase schema
- [ ] Show 2-3 popular countries initially
- [ ] Add "View more" button to expand full list
- [ ] Connect to user's shipping preferences in profile
- [ ] When seller creates listing, require shipping country selection

**Implementation:**
```sql
-- New table for shipping zones
CREATE TABLE shipping_zones (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  name_bg text,
  region text CHECK (region IN ('bulgaria', 'europe', 'usa', 'worldwide')),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);
```

#### 1.2 Account & Lists Dropdown
**Current State:** Two-column layout with many irrelevant Amazon-specific items  
**Issues Identified:**
- Left column "Твоите списъци" only has 2 items (Create list, Find list)
- Right column "Твоят акаунт" has irrelevant items:
  - ❌ "Видео покупки и наеми" (not applicable)
  - ❌ "Kindle Unlimited" (not applicable)
  - ❌ "Съдържание и устройства" (not applicable)
  - ❌ "Абонирай се и спести артикули" (not implemented)
  - ❌ "Музикална библиотека" (not applicable)
  - ✅ "Членства и абонаменти" (keep - can be used for future plans)

**Required Changes:**
- [ ] Remove non-applicable menu items from `header-dropdowns.tsx`
- [ ] Restructure left column for platform-specific features:
  - Wishlist / Favorites
  - Recently Viewed
  - Saved Searches
  - Create List
- [ ] Restructure right column:
  - Account
  - Orders  
  - Messages
  - My Store (for sellers)
  - Memberships & Subscriptions (future)
  - Settings

#### 1.3 Header Button Text - "Твоите" vs "Моите"
**Current State:** Uses "Твоите" (Your - formal/addressing user)  
**Issue:** Should be "Моите" (My - first person, user's perspective)  

**Required Changes:**
- [ ] Update `messages/bg.json`:
  - `"yourOrders": "Твоите"` → `"yourOrders": "Моите"`
  - `"messages": "Твоите"` → `"messages": "Моите"`
  - `"startSelling": "Твоите"` → `"startSelling": "Моите"`

#### 1.4 Header Icon Consistency
**Current State:** 
- Orders dropdown: No icon ❌
- Sales dropdown: No icon ❌  
- Messages dropdown: Has ChatCircle icon ✅
- Cart: Has ShoppingCart icon ✅

**Required Changes:**
- [ ] Add `Package` icon to Orders dropdown trigger
- [ ] Add `Storefront` icon to Sales dropdown trigger
- [ ] Ensure all dropdown triggers have consistent icon styling

---

### 2. Product Cards & Ratings

#### 2.1 Missing Ratings on Product Cards
**Current State:** Products with 0 reviews don't show rating stars  
**Issue:** In `trending-products-section.tsx` and `tabbed-product-section.tsx`:
```tsx
{reviews > 0 && (
  <div className="flex items-center gap-1.5 mb-1.5">
    // Only shows if reviews > 0
  </div>
)}
```

**Required Changes:**
- [ ] Always show rating stars, even for 0 reviews
- [ ] Show "0 оценки" / "0 ratings" text
- [ ] Display empty star icons for visual consistency

**Fixed Code:**
```tsx
{/* Rating - Always show */}
<div className="flex items-center gap-1.5 mb-1.5">
  <div className="flex text-rating">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={11}
        weight={i < Math.floor(rating) ? "fill" : "regular"}
        className={i < Math.floor(rating) ? "" : "text-rating-empty"}
      />
    ))}
  </div>
  <span className="text-[10px] text-muted-foreground">{reviews}</span>
</div>
```

---

### 3. Product Sections & Containers

#### 3.1 "Препоръчани продукти" (Recommended Products)
**Current State:** 
- Has sparkle icons in title (✨)
- Has subtitle text (other sections don't)
- Fetches: `is_boosted.eq.true,is_featured.eq.true` OR `rating >= 4.0`

**Issues:**
- The sparkle icons look out of place compared to other sections
- Subtitle creates visual inconsistency
- Fetching logic is actually correct (boosted + high-rated products)

**Required Changes:**
- [ ] Remove sparkle icons from `FeaturedProductsSection` title
- [ ] Keep subtitle but make it optional/conditional
- [ ] Add "Промотирано" badge on boosted products (already exists ✅)

#### 3.2 Newest Listings Container
**Current Behavior:** Newest products go to "Нови" tab in TrendingProductsSection  
**User Request:** Consider separate container for newest listings

**Decision:** Keep current behavior - the "Нови" tab in "Открийте популярни продукти" already handles this perfectly. The tabbed UI/UX is clean and consistent.

#### 3.3 "Оферти на деня" (Deals of the Day)
**Current State:** Correctly fetches products where `list_price > price` ✅  
**Issue:** All tabs (All, Tech, Home, Fashion) show the same deals - no category filtering

**Required Changes:**
- [ ] Add category_id to deals filtering
- [ ] Filter deals by category in each tab
```tsx
// In page.tsx
const techDeals = deals.filter(d => d.category_id === 'electronics')
const homeDeals = deals.filter(d => d.category_id === 'home')
// etc.
```

---

### 4. Product Page Issues

#### 4.1 Reviews Section Placement
**Current Order:**
1. Product details
2. Related Products (Свързани продукти)
3. Reviews Section

**Issue:** Customer reviews should be ABOVE related products (like Amazon)

**Required Changes:**
- [ ] In `app/[locale]/(main)/product/[id]/page.tsx`:
  - Move `<ReviewsSection>` before Related Products section
  - Keep separator between sections

#### 4.2 Related Products Card Size
**Current State:** Using standard grid with `ProductCard` component  
**Issue:** Cards are too large for related products section

**Required Changes:**
- [ ] Use `variant="compact"` or create smaller card variant for related products
- [ ] Show 4-6 products in a horizontal scroll on mobile
- [ ] Show 4 products in grid on desktop

**Implementation:**
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
  {relatedProducts.map((p, idx) => (
    <ProductCard
      key={p.id}
      {...p}
      variant="compact"
      index={idx}
    />
  ))}
</div>
```

#### 4.3 Rating Click Scroll to Reviews
**Current State:** Rating display shows "{count} оценки" but clicking does nothing  
**Issue:** Should scroll to reviews section

**Required Changes:**
- [ ] Add `id="reviews"` to ReviewsSection
- [ ] Make rating text clickable with smooth scroll:
```tsx
<button 
  onClick={() => {
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
  }}
  className="text-link hover:text-link-hover hover:underline cursor-pointer text-sm font-medium"
>
  {t('ratings', { count: product.reviews_count })}
</button>
```

---

### 5. Seller/Listing Features

#### 5.1 Shipping Country Selection
**Current State:** No shipping destination selection when creating a listing  
**Required:** Sellers should specify where they ship to

**Required Changes:**
- [ ] Add `shipping_zones` column to products table (array of zone IDs or JSON)
- [ ] Add multi-select for shipping destinations in product form
- [ ] Filter products by user's delivery location on homepage

**Schema Update:**
```sql
ALTER TABLE products 
ADD COLUMN shipping_zones text[] DEFAULT ARRAY['bulgaria'];
```

**UI Component:**
```tsx
<div className="space-y-2">
  <Label>Shipping Destinations</Label>
  <div className="flex flex-wrap gap-2">
    {['Bulgaria', 'Europe', 'USA', 'Worldwide'].map(zone => (
      <Checkbox key={zone} label={zone} />
    ))}
  </div>
</div>
```

#### 5.2 Discount Toggle for Sellers
**Current State:** No way for sellers to discount their products from /account/selling  
**Issue:** Sellers must be able to set list_price for discounts

**Required Changes:**
- [ ] Add "Edit Product" modal/page with discount section
- [ ] Add toggle for "On Sale" with original price input
- [ ] When enabled, set `list_price` to original price, keep `price` as sale price

**Implementation in seller dashboard:**
```tsx
// Discount section in edit product form
<div className="space-y-3">
  <div className="flex items-center justify-between">
    <Label>On Sale</Label>
    <Switch checked={isOnSale} onCheckedChange={setIsOnSale} />
  </div>
  {isOnSale && (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Original Price</Label>
        <Input type="number" value={listPrice} onChange={...} />
      </div>
      <div>
        <Label>Sale Price</Label>
        <Input type="number" value={price} onChange={...} />
      </div>
    </div>
  )}
</div>
```

---

### 6. Recommendations Logic

#### 6.1 Current Implementation Review
**How it works now:**

1. **Trending Section (Открийте популярни продукти):**
   - "Нови" tab: `ORDER BY created_at DESC` ✅
   - "Промоции" tab: `WHERE list_price > price` ✅
   - "Топ продажби" tab: `ORDER BY review_count DESC` ✅

2. **Препоръчани продукти (Featured/Recommended):**
   - Primary: `is_boosted = true OR is_featured = true`
   - Fallback: `rating >= 4.0 ORDER BY rating DESC`
   - This is actual logic, not mockup ✅

**Improvement Needed:**
- [ ] Add personalized recommendations based on:
  - User's recently viewed products
  - Purchase history
  - Category preferences
  - Collaborative filtering (future)

**Implementation:**
```typescript
// Get user's recently viewed categories
const recentCategories = await getUserRecentCategories(userId)

// Fetch recommended products from those categories
const { data: recommended } = await supabase
  .from('products')
  .select('*')
  .in('category_id', recentCategories)
  .neq('id', viewedProductIds) // Exclude already seen
  .gte('rating', 3.5)
  .order('rating', { ascending: false })
  .limit(12)
```

---

## 📊 PRIORITY MATRIX

### 🔴 Critical (Must fix before launch) - ✅ COMPLETED
| Issue | Component | Status |
|-------|-----------|--------|
| Rating always show (even 0) | Product cards | ✅ Fixed |
| Rating click → scroll to reviews | Product page | ✅ Fixed |
| Reviews above Related Products | Product page | ✅ Fixed |
| Remove irrelevant Account menu items | Header dropdowns | ✅ Fixed |
| Fix "Твоите" → "Моите" | Messages/translations | ✅ Fixed |
| Add icons to Orders/Sales dropdowns | Header dropdowns | ✅ Fixed |
| Remove sparkle icons from Featured | Homepage | ✅ Fixed |
| Smaller Related Products cards | Product page | ✅ Fixed |

### 🟡 High Priority (Fix in first week)
| Issue | Component | Effort |
|-------|-----------|--------|
| Shipping zones selection in listings | Product form | 2-3 hours |
| Discount toggle for sellers | Seller dashboard | 2-3 hours |
| Filter deals by category | Deals section | 1 hour |

### 🟢 Medium Priority (Fix in first month)
| Issue | Component | Effort |
|-------|-----------|--------|
| Dynamic location dropdown from Supabase | Header | 2 hours |
| "View more" countries expansion | Location dropdown | 1 hour |
| Personalized recommendations | Homepage | 4-6 hours |
| Edit product page for sellers | Seller dashboard | 4-6 hours |

---

## 🛠️ IMPLEMENTATION PLAN

### Phase 1: Critical Fixes (Day 1)
```bash
# Files to modify:
- components/trending-products-section.tsx  # Always show ratings
- components/tabbed-product-section.tsx     # Always show ratings
- components/featured-products-section.tsx  # Remove sparkles
- app/[locale]/(main)/product/[id]/page.tsx # Reviews placement, scroll
- components/header-dropdowns.tsx           # Icons, menu cleanup
- messages/bg.json                          # Твоите → Моите
- messages/en.json                          # Check consistency
```

### Phase 2: Seller Features (Days 2-3)
```bash
# Database:
- Add shipping_zones column to products
- Create shipping_zones lookup table

# Files:
- components/product-form.tsx               # Add shipping, discount
- app/[locale]/(account)/account/selling/   # Edit product modal
```

### Phase 3: Enhanced Features (Week 1)
```bash
# Location dropdown improvements
- components/header-dropdowns.tsx           # Dynamic countries
- lib/shipping-zones.ts                     # Zone management

# Recommendations
- lib/recommendations.ts                    # Personalization logic
- app/[locale]/(main)/page.tsx             # Connect recommendations
```

---

## ✅ VERIFICATION CHECKLIST

### Header
- [ ] Location dropdown shows 2-3 countries with "View more"
- [ ] Account dropdown shows only relevant items
- [ ] All dropdown buttons have icons
- [ ] "Моите" used instead of "Твоите"
- [ ] All links navigate correctly

### Homepage Containers
- [ ] All product cards show rating stars (even 0)
- [ ] "Нови" tab shows newest products by date
- [ ] "Промоции" tab shows products with list_price > price
- [ ] "Топ продажби" shows by review_count
- [ ] "Оферти на деня" filters by category in tabs
- [ ] "Препоръчани продукти" shows boosted/high-rated products
- [ ] No sparkle icons on section titles

### Product Page
- [ ] Reviews section is ABOVE related products
- [ ] Related products use compact cards
- [ ] Rating click scrolls to reviews section
- [ ] All buttons functional

### Seller Features
- [ ] Shipping destination selection on listing creation
- [ ] Discount toggle in product edit
- [ ] Products can be marked as featured/boosted (admin or payment)

---

## 🔐 Pre-Production Security Checklist

- [ ] All RLS policies active and tested
- [ ] No exposed API keys in client code
- [ ] CORS properly configured
- [ ] Rate limiting on API routes
- [ ] Input validation on all forms
- [ ] XSS prevention in user-generated content
- [ ] SQL injection prevention (using Supabase client)
- [ ] HTTPS enforced

---

## 📝 Notes

1. The platform is functionally sound - main issues are UX polish and seller features
2. Supabase schema has `list_price` column ready for discounts
3. Product cards support boosted/featured badges already
4. The recommendation system has proper fallback logic
5. Most issues are quick fixes (< 1 hour each)

---

**Next Steps:**
1. Review this document with team
2. Create GitHub issues for each action item
3. Start with Critical priority items
4. Test each fix in staging before production
5. Deploy in phases with monitoring

---

*Generated by Production Audit - December 1, 2025*
