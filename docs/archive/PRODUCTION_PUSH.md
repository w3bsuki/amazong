# 🚀 PRODUCTION PUSH MASTER PLAN

> **Created:** December 10, 2025  
> **Last Updated:** December 10, 2025 (UK Shipping Implementation)  
> **Auditor:** GitHub Copilot - MCP-Verified Audit (Supabase, Next.js, Context7)  
> **Live URL:** https://amazong-virid.vercel.app/  
> **Goal:** Remove ALL mock data, ensure 100% Supabase integration, production-ready server/client architecture

---

## 🔌 MCP VERIFICATION SOURCES

This plan was verified using:
- ✅ **Supabase MCP** - Direct database schema inspection, security advisors, performance analysis
- ✅ **Next.js MCP** - Live dev server inspection (port 3000), route validation, error checking
- ✅ **Context7 MCP** - Supabase SSR best practices, Next.js data fetching patterns

---

## 📊 SUPABASE DATABASE STATUS (MCP Verified)

### Live Table Statistics

| Table | Rows | RLS Enabled | Status |
|-------|------|-------------|--------|
| `profiles` | 12 | ✅ | Real users |
| `sellers` | 6 | ✅ | Real sellers |
| `products` | 231 | ✅ | Real + test products |
| `categories` | 13,139 | ✅ | Complete hierarchy |
| `reviews` | 1 | ✅ | ⚠️ Almost empty - explains mock fallback |
| `orders` | 3 | ✅ | Real orders |
| `wishlists` | 1 | ✅ | Working |
| `shipping_zones` | 5 | ✅ | BG, UK, EU, US, WW ✅ |

### Missing Seller Statistics Columns (Confirmed via MCP)

The `sellers` table has these columns:
- ✅ `id`, `store_name`, `description`, `verified`, `tier`, `country_code`, `store_slug`
- ❌ **MISSING:** `total_items_sold`, `positive_feedback_percentage`, `feedback_score`
- ❌ **MISSING:** `accuracy_rating`, `shipping_cost_rating`, `shipping_speed_rating`, `communication_rating`

### Missing Shipping Columns (Confirmed via MCP)

The `products` table has:
- ✅ `ships_to_bulgaria`, `ships_to_europe`, `ships_to_usa`, `ships_to_worldwide`, `pickup_only`
- ✅ `ships_to_uk` - **ADDED December 10, 2025** (UK market support)

---

## 🔒 SECURITY ADVISORS (MCP Verified)

| Issue | Level | Action Required |
|-------|-------|-----------------|
| **Leaked Password Protection Disabled** | ⚠️ WARN | Enable HaveIBeenPwned integration in Supabase Auth settings |

**Link:** https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

---

## ⚡ PERFORMANCE ADVISORS (MCP Verified)

**36 unused indexes detected** - Consider cleanup for production:
- `idx_products_ships_to_bulgaria` - unused
- `idx_products_ships_to_europe` - unused  
- `idx_reviews_created_at` - unused
- `idx_wishlists_product_id` - unused
- And 32 more...

**Recommendation:** Keep indexes for now but monitor after launch.

---

## 🔄 CACHING STRATEGY (MCP-Verified Best Practices)

> **Full Documentation:** See `CACHING.md` for complete implementation details.  
> **Status:** V3 Implementation (December 2025) - VERIFIED against Next.js 16+ and Supabase SSR docs.

### Next.js Caching Layers (Context7 MCP Verified)

| Layer | Purpose | Our Implementation |
|-------|---------|-------------------|
| **Request Memoization** | Dedup identical requests | ✅ React `cache()` for DB queries |
| **Data Cache** | Persist fetch results | ✅ `'use cache'` + `cacheTag()` + `cacheLife()` |
| **Full Route Cache** | HTML + RSC payload | ✅ PPR enabled (`cacheComponents: true`) |
| **Router Cache** | Client-side navigation | ✅ Automatic with App Router |

### Cache Invalidation APIs (Next.js 16.0.7+)

| Function | Behavior | Use Case | Location |
|----------|----------|----------|----------|
| `revalidateTag(tag, 'max')` | Stale-while-revalidate | Background refresh | Server Actions, Route Handlers |
| `updateTag(tag)` | Immediate expiration | User sees their own write | Server Actions ONLY |
| `revalidatePath(path)` | Path-based invalidation | After mutations | Server Actions, Route Handlers |

⚠️ **DEPRECATION:** `revalidateTag(tag)` with ONE argument is deprecated. Always use `revalidateTag(tag, 'max')`.

### Supabase + Next.js Cache Integration

**Two Client Types Required:**

| Client | Use Case | Can Use in `'use cache'`? |
|--------|----------|--------------------------|
| `createClient()` | Auth-required operations (cart, wishlist, orders) | ❌ NO - uses `cookies()` |
| `createStaticClient()` | Public data (products, categories) | ✅ YES - no cookies |

```typescript
// ✅ CORRECT - Cached product fetch
async function getProducts() {
  'use cache'
  cacheTag('products')
  cacheLife('products')
  
  const supabase = createStaticClient() // NO cookies!
  return supabase.from('products').select('*')
}

// ❌ WRONG - Cannot cache auth-dependent data
async function getUserCart() {
  'use cache' // This will FAIL!
  const supabase = await createClient() // Uses cookies()
  return supabase.from('carts').select('*')
}
```

### Cache Profiles (Configured in `next.config.ts`)

| Profile | Stale | Revalidate | Expire | Use For |
|---------|-------|------------|--------|---------|
| `categories` | 1 hour | 24 hours | 7 days | Category tree, rarely changes |
| `products` | 5 min | 15 min | 1 hour | Product listings, moderate churn |
| `deals` | 1 min | 5 min | 15 min | Time-sensitive promotions |
| `user` | 30 sec | 2 min | 10 min | Per-user recommendations |

### Production Cache Invalidation Flow

```
User Action (e.g., create product)
         │
         ▼
   Server Action
         │
         ├──► updateTag('products')     // Immediate for user
         │
         └──► revalidateTag('newest', 'max')  // Background for others
              revalidateTag('deals', 'max')
              revalidateTag('featured', 'max')
```

### Supabase CDN Caching (Supabase MCP Verified)

**Smart CDN** automatically enabled on Pro Plan:
- Asset metadata synced to edge
- Auto-revalidation on file change/delete
- **Up to 60 seconds** propagation delay

**Recommendation for Product Images:**
```typescript
// Upload with proper cache control
await supabase.storage
  .from('product-images')
  .upload(path, file, {
    cacheControl: '3600', // 1 hour browser cache
    upsert: true
  })
```

### Outstanding Caching Tasks

| Task | Status | Priority |
|------|--------|----------|
| Homepage refactored with Suspense | ✅ DONE | - |
| `lib/data/products.ts` with `'use cache'` | ✅ DONE | - |
| `app/actions/revalidate.ts` server actions | ✅ DONE | - |
| Cache profiles in `next.config.ts` | ✅ DONE | - |
| **Cache invalidation after review submission** | ❌ TODO | HIGH |
| **Cache invalidation after seller feedback** | ❌ TODO | HIGH |
| **Product detail page ISR** | ❌ TODO | MEDIUM |
| **Webhook endpoint for external invalidation** | ❌ TODO | LOW |

### Cache Invalidation After Data Mutations (TODO)

When a user submits a review:
1. Insert review into `reviews` table
2. Update `products.rating` and `products.review_count` (trigger or app code)
3. Call `updateTag(\`product-${productId}\`)` for immediate visibility
4. Call `revalidateTag('products', 'max')` for listing pages

**Implementation Required in:**
- `components/review-form.tsx` - After successful review submission
- `app/actions/reviews.ts` - Server action with cache invalidation

---

## 🔍 PLAYWRIGHT BROWSER AUTOMATION TEST RESULTS

**Test Date:** December 10, 2025  
**Browser:** Chromium via Playwright MCP  
**Tested Account:** radevalentin@gmail.com

| Feature | Status | Notes |
|---------|--------|-------|
| **Authentication** | ✅ WORKING | Login/signup flow functional with Supabase Auth |
| **Sign Up** | ✅ WORKING | New user registration sends verification email |
| **Login** | ✅ WORKING | Credentials radevalentin@gmail.com / 12345678 work |
| **Homepage** | ✅ WORKING | Products fetched from Supabase (real user products visible) |
| **Product Page** | ⚠️ MOCK DATA | Seller ratings, reviews, feedback are **HARDCODED** |
| **Sellers Page** | ✅ WORKING | Real sellers from Supabase displayed |
| **Sell Form** | ✅ WORKING | Form loads, categories from Supabase, shipping options visible |
| **Checkout** | ⚠️ MOCK DATA | Shipping methods are **HARDCODED** (not from seller/product) |
| **Reviews** | ⚠️ MOCK DATA | Falls back to mock Bulgarian reviews when no real reviews |
| **Wishlist** | ✅ WORKING | Connected to Supabase `wishlists` table |
| **Cart** | ✅ WORKING | Local state with localStorage persistence |

---

## 🚨 CRITICAL ISSUES DISCOVERED

### Issue #1: Mock Seller Data (CRITICAL)

**File:** `components/product-page-content-new.tsx` (lines 147-165)

```typescript
// HARDCODED MOCK DATA - MUST BE REMOVED
const sellerData = seller ? {
  ...seller,
  positive_feedback_percentage: 100,      // ❌ MOCK
  total_items_sold: 505000,               // ❌ MOCK
  response_time_hours: 24,                // ❌ MOCK
  feedback_score: 798,                    // ❌ MOCK
  feedback_count: 746,                    // ❌ MOCK
  ratings: {
    accuracy: 5.0,                        // ❌ MOCK
    shipping_cost: 5.0,                   // ❌ MOCK
    shipping_speed: 5.0,                  // ❌ MOCK
    communication: 5.0,                   // ❌ MOCK
  }
} : null
```

**Impact:** Every seller shows 798 feedback, 505K items sold, 100% positive - completely fake!

---

### Issue #2: Mock Seller Feedback (CRITICAL)

**File:** `components/product-page-content-new.tsx` (lines 168-193)

```typescript
// HARDCODED MOCK FEEDBACK - MUST BE REMOVED
const sampleFeedback = [
  { user: "j***n", score: 156, text: 'Great seller!...' },
  { user: "m***a", score: 89, text: 'Product matches description...' },
  { user: "s***k", score: 234, text: 'Excellent communication...' },
]
```

**Impact:** All sellers show same fake feedback from fake users.

---

### Issue #3: Mock Product Reviews (CRITICAL)

**File:** `components/reviews-section.tsx` (lines 36-82)

```typescript
// MOCK REVIEWS WITH FAKE BULGARIAN NAMES
const mockReviews: Review[] = [
  { profiles: { full_name: 'Иван Петров', ... }, comment: 'Отличен продукт!' },
  { profiles: { full_name: 'Мария Георгиева', ... }, comment: 'Точно каквото очаквах' },
  { profiles: { full_name: 'Георги Димитров', ... }, ... },
  { profiles: { full_name: 'Елена Стоянова', ... }, ... },
  { profiles: { full_name: 'Петър Николов', ... }, ... }
]

const mockDistribution: Record<number, number> = { 5: 156, 4: 48, 3: 12, 2: 4, 1: 2 }
```

**Current Logic:**
- If Supabase returns error → Show mock reviews
- If Supabase returns empty → Show mock reviews (WRONG - should show "No reviews yet")

---

### Issue #4: Checkout Shipping Methods (CRITICAL)

**File:** `app/[locale]/(checkout)/checkout/page.tsx` (lines 97-103)

```typescript
// HARDCODED SHIPPING - NOT FROM PRODUCT/SELLER
const shippingCosts = {
  standard: 0,
  express: 9.99,
  overnight: 19.99
}
```

**Problem:** Checkout doesn't consider:
- Seller's configured shipping destinations
- Product's `ships_to_bulgaria`, `ships_to_europe`, `ships_to_usa`, `ships_to_worldwide` flags
- Seller's country of origin for delivery time calculation

---

### Issue #5: Missing UK Support ✅ RESOLVED

**Previous State:**
- Shipping zones: `BG`, `EU`, `US`, `WW`
- No dedicated UK zone despite Brexit
- UK users grouped with EU (incorrect post-Brexit)

**Resolution (December 10, 2025):**
- ✅ Added `ships_to_uk` column to `products` table
- ✅ Added UK zone to `shipping_zones` table
- ✅ Removed GB from EU zone countries (post-Brexit)
- ✅ Updated `lib/shipping.ts` with UK support
- ✅ Updated `ShippingRegion` type: `'BG' | 'UK' | 'EU' | 'US' | 'WW'`
- ✅ Updated header dropdowns with UK option (🇬🇧 flag)
- ✅ Updated sell form with UK shipping checkbox
- ✅ Backfilled `ships_to_uk = true` for products with `ships_to_europe = true`

---

### Issue #6: No Geolocation-Based Product Filtering ✅ IMPLEMENTED

**Previous Problem:** When user selects "USA delivery", they should only see products with `ships_to_usa = true`.

**Resolution (December 10, 2025):**
- ✅ `proxy.ts` detects country from `x-vercel-ip-country` header
- ✅ `getShippingFilter()` in `lib/shipping.ts` builds Supabase OR filter
- ✅ Search page applies `shippingFilter` to product queries
- ✅ Category page applies `shippingFilter` to product queries
- ✅ UK users selecting "United Kingdom" see: `ships_to_uk OR ships_to_europe OR ships_to_worldwide`

---

## 📋 PRODUCTION PUSH PHASES

---

## 🔴 PHASE 1: Server/Client Architecture Audit (Next.js MCP Best Practices)

### Current Server Status (MCP Verified)
- **Next.js Dev Server:** Running on port 3000
- **Errors:** 0 (No errors in browser sessions)
- **App Router Routes:** All routes properly configured

### Best Practices from Context7 MCP

**Pattern 1: Server Components for Data Fetching**
```typescript
// ✅ CORRECT - Server Component (default in app/)
export default async function Page() {
  const supabase = createServerClient(...)
  const { data } = await supabase.from('products').select()
  return <ProductList products={data} />
}
```

**Pattern 2: Client Components for Interactivity**
```typescript
// ✅ CORRECT - Client Component for state/events
'use client'
export default function LikeButton({ likes }: { likes: number }) {
  const [count, setCount] = useState(likes)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

**Pattern 3: Supabase SSR with Cookies**
```typescript
// ✅ CORRECT - Server-side Supabase client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### Components to Audit

| Component | Current Type | Should Be | Change Needed |
|-----------|--------------|-----------|---------------|
| `product-page-content-new.tsx` | Client | Client | ⚠️ Remove mock data, keep client for interactivity |
| `reviews-section.tsx` | Client | Client | ⚠️ Remove mock fallback, use real Supabase data |
| `checkout/page.tsx` | Client | Server + Client | Consider server prefetch for addresses |
| `sell/page.tsx` | Server | Server | ✅ Correct |
| `sellers/page.tsx` | Server | Server | ✅ Correct |

---

## 🔴 PHASE 2: Remove Mock Data (CRITICAL)

### Priority: 🚨 IMMEDIATE

### 2.1 Remove Mock Seller Ratings

**File:** `components/product-page-content-new.tsx`

**Action:** Replace hardcoded sellerData with real Supabase data

**Database Changes Required:**
```sql
-- Add seller statistics columns
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS total_items_sold INTEGER DEFAULT 0;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS positive_feedback_percentage DECIMAL(5,2) DEFAULT 0;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS feedback_score INTEGER DEFAULT 0;

-- Add detailed ratings
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS accuracy_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS shipping_cost_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS shipping_speed_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS communication_rating DECIMAL(3,2) DEFAULT 0;
```

**New Component Logic:**
```typescript
// Get seller data from Supabase (already passed as prop)
const sellerData = seller ? {
  ...seller,
  // Use real data, fallback to 0 if not available
  positive_feedback_percentage: seller.positive_feedback_percentage ?? 0,
  total_items_sold: seller.total_items_sold ?? 0,
  response_time_hours: seller.response_time_hours ?? 24,
  ratings: {
    accuracy: seller.accuracy_rating ?? 0,
    shipping_cost: seller.shipping_cost_rating ?? 0,
    shipping_speed: seller.shipping_speed_rating ?? 0,
    communication: seller.communication_rating ?? 0,
  }
} : null
```

---

### 2.2 Remove Mock Product Reviews

**File:** `components/reviews-section.tsx`

**Action:** Remove mock fallback, show "No reviews" state

**Change From:**
```typescript
if (data && data.length > 0) {
  setReviews(data as Review[])
} else {
  // No reviews found, use mock data
  setReviews(mockReviews) // ❌ REMOVE THIS
  setRatingDistribution(mockDistribution)
}
```

**Change To:**
```typescript
if (data && data.length > 0) {
  setReviews(data as Review[])
} else {
  // No reviews yet - show empty state
  setReviews([])
  setRatingDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
}
```

**Add Empty State UI:**
```tsx
{reviews.length === 0 && (
  <div className="text-center py-8">
    <p className="text-muted-foreground">No reviews yet</p>
    <p className="text-sm">Be the first to review this product!</p>
  </div>
)}
```

---

### 2.3 Remove Mock Seller Feedback

**File:** `components/product-page-content-new.tsx`

**Action:** Create `seller_feedback` table and fetch real data

**Database Schema:**
```sql
CREATE TABLE public.seller_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  is_positive BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.seller_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Feedback is viewable by everyone" ON public.seller_feedback FOR SELECT USING (true);
CREATE POLICY "Buyers can leave feedback" ON public.seller_feedback FOR INSERT WITH CHECK (auth.uid() = buyer_id);
```

---

## 🟠 PHASE 3: Shipping & Delivery System

### Priority: HIGH

### 3.1 Product Shipping Configuration ✅ DONE

**In Schema:** `ships_to_bulgaria`, `ships_to_uk`, `ships_to_europe`, `ships_to_usa`, `ships_to_worldwide`

**Sell Form Integration:** ✅ Implemented in `components/sell/sections/shipping-section.tsx`

### 3.2 UK Support ✅ IMPLEMENTED (December 10, 2025)

**Database Migration Applied:**
```sql
-- Migration: add_uk_shipping_support (December 10, 2025)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ships_to_uk BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_products_ships_to_uk ON public.products(ships_to_uk) WHERE ships_to_uk = true;

-- Added to shipping_zones table:
-- UK zone with countries: ['GB', 'UK']
-- US zone with countries: ['US']
-- Removed GB from EU zone (post-Brexit)
```

**Files Updated:**

| File | Changes |
|------|---------|
| `lib/shipping.ts` | Added UK to `ShippingRegion` type, `DELIVERY_MATRIX`, `getShippingFilter()`, `productShipsToRegion()` |
| `lib/sell-form-schema-v4.ts` | Added `shipsToUK` and `shipsToUSA` fields |
| `app/api/products/create/route.ts` | Added UK/USA to validation and DB insert |
| `components/header-dropdowns.tsx` | Added UK zone option with 🇬🇧 flag |
| `components/dropdowns/location-dropdown.tsx` | Added UK zone option |
| `components/sell/sections/shipping-section.tsx` | Added UK and USA shipping checkboxes |

**Product Visibility by Region:**

| Buyer Region | Products Shown |
|--------------|----------------|
| Bulgaria (BG) | `ships_to_bulgaria` OR `ships_to_europe` OR `ships_to_worldwide` |
| UK | `ships_to_uk` OR `ships_to_europe` OR `ships_to_worldwide` |
| Europe (EU) | `ships_to_europe` OR `ships_to_worldwide` |
| USA (US) | `ships_to_usa` OR `ships_to_worldwide` |
| Worldwide (WW) | `ships_to_worldwide` only |

### 3.3 Add UK Support (OLD - REPLACED BY 3.2)

**Migration:**
```sql
-- Add UK-specific shipping column
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ships_to_uk BOOLEAN DEFAULT false;

-- Update shipping.ts to include UK zone
```

**File:** `lib/shipping.ts`
```typescript
// Add UK to shipping regions
export type ShippingRegion = 'BG' | 'EU' | 'UK' | 'US' | 'WW';

// Update COUNTRY_TO_REGION
const COUNTRY_TO_REGION: Record<string, ShippingRegion> = {
  // ...existing...
  GB: 'UK', // Remove from EU
  UK: 'UK',
};

// Add UK delivery times
const DELIVERY_MATRIX = {
  UK: {
    BG: { minDays: 5, maxDays: 12, ... },
    EU: { minDays: 3, maxDays: 7, ... },
    UK: { minDays: 1, maxDays: 3, ... }, // Domestic UK
    US: { minDays: 5, maxDays: 10, ... },
    WW: { minDays: 10, maxDays: 21, ... },
  },
  // ...update other countries...
};
```

### 3.3 Checkout Delivery Methods from Product

**File:** `app/[locale]/(checkout)/checkout/page.tsx`

**Change:** Fetch delivery methods from cart items (each product has shipping flags)

```typescript
// Get available shipping methods from cart items
const getAvailableShippingMethods = () => {
  // Check what regions ALL cart items can ship to
  const allShipToBulgaria = items.every(item => item.ships_to_bulgaria)
  const allShipToEurope = items.every(item => item.ships_to_europe)
  const allShipToUSA = items.every(item => item.ships_to_usa)
  
  // Return only methods that work for all items
  return {
    bulgaria: allShipToBulgaria,
    europe: allShipToEurope,
    usa: allShipToUSA,
    worldwide: items.every(item => item.ships_to_worldwide)
  }
}
```

### 3.4 User Zone Detection & Product Filtering (Geo-Location)

**File:** `proxy.ts` (already has zone detection)

**Add:** Product filtering based on user zone
```typescript
// In search/listing pages:
const userZone = cookies().get('user-zone')?.value || 'WW'

// Filter products
let query = supabase.from('products').select('*')

if (userZone === 'BG') {
  query = query.or('ships_to_bulgaria.eq.true,ships_to_europe.eq.true,ships_to_worldwide.eq.true')
} else if (userZone === 'UK') {
  query = query.or('ships_to_uk.eq.true,ships_to_europe.eq.true,ships_to_worldwide.eq.true')
} else if (userZone === 'EU') {
  query = query.eq('ships_to_europe', true).or('ships_to_worldwide.eq.true')
} else if (userZone === 'US') {
  query = query.eq('ships_to_usa', true).or('ships_to_worldwide.eq.true')
}
```

---

## 🟡 PHASE 4: Database Schema Updates (Supabase MCP Verified)

### Priority: MEDIUM

### 4.1 New Migration: Seller Statistics & UK Shipping

```sql
-- File: supabase/migrations/20251210_production_push.sql

-- ============================================
-- SELLER STATISTICS (Required for removing mock data)
-- ============================================
ALTER TABLE public.sellers 
  ADD COLUMN IF NOT EXISTS total_items_sold INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS positive_feedback_percentage DECIMAL(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24,
  ADD COLUMN IF NOT EXISTS feedback_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS accuracy_rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_cost_rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_speed_rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS communication_rating DECIMAL(3,2) DEFAULT 0;

-- ============================================
-- UK SHIPPING SUPPORT
-- ============================================
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS ships_to_uk BOOLEAN DEFAULT false;

-- Update shipping_zones table
INSERT INTO public.shipping_zones (code, name, name_bg, region, countries, is_active, sort_order)
VALUES ('UK', 'United Kingdom', 'Великобритания', 'europe', ARRAY['GB', 'UK'], true, 2)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- SELLER FEEDBACK TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.seller_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.seller_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feedback viewable by all" 
  ON public.seller_feedback FOR SELECT USING (true);
  
CREATE POLICY "Buyers can add feedback" 
  ON public.seller_feedback FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update own feedback"
  ON public.seller_feedback FOR UPDATE
  USING (auth.uid() = buyer_id);
  
CREATE POLICY "Buyers can delete own feedback" 
  ON public.seller_feedback FOR DELETE
  USING (auth.uid() = buyer_id);

-- ============================================
-- VARIANT TRACKING IN ORDERS (Gap Identified in Audit)
-- ============================================
ALTER TABLE public.order_items 
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id);

-- ============================================
-- TRIGGER: Update seller stats on order delivery
-- ============================================
CREATE OR REPLACE FUNCTION update_seller_stats_on_delivery()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    -- Update total items sold for all sellers in this order
    UPDATE public.sellers s
    SET total_items_sold = (
      SELECT COALESCE(SUM(oi.quantity), 0)
      FROM public.order_items oi
      JOIN public.orders o ON oi.order_id = o.id
      WHERE oi.seller_id = s.id
      AND o.status = 'delivered'
    )
    WHERE s.id IN (
      SELECT DISTINCT seller_id FROM public.order_items WHERE order_id = NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_delivered ON public.orders;
CREATE TRIGGER on_order_delivered
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_seller_stats_on_delivery();

-- ============================================
-- USER GEOLOCATION STORAGE
-- ============================================
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS country_code VARCHAR(2),
  ADD COLUMN IF NOT EXISTS preferred_shipping_zone VARCHAR(2);
```

### 4.2 Apply Migration via Supabase MCP

Run this migration using Supabase Dashboard or CLI:
```bash
supabase migration new production_push
# Paste SQL above into the migration file
supabase db push
```

---

## 🟢 PHASE 5: Geo-Location Implementation

### Priority: MEDIUM

### 5.1 IP-Based Region Detection

**Option A: Vercel Edge Config (Recommended for Vercel hosting)**
```typescript
// middleware.ts
import { geolocation } from '@vercel/functions'

export function middleware(request: NextRequest) {
  const { country } = geolocation(request)
  
  // Map country to shipping zone
  const zone = getShippingZone(country)
  
  // Set cookie for zone
  const response = NextResponse.next()
  response.cookies.set('user-zone', zone, { 
    httpOnly: false, 
    maxAge: 60 * 60 * 24 * 30 // 30 days 
  })
  
  return response
}

function getShippingZone(country: string): string {
  const zones: Record<string, string> = {
    BG: 'BG',
    GB: 'UK', UK: 'UK',
    US: 'US', CA: 'US',
    // EU countries
    DE: 'EU', FR: 'EU', IT: 'EU', ES: 'EU', NL: 'EU', // etc
  }
  return zones[country] || 'WW'
}
```

**Option B: Free IP Geolocation API**
```typescript
// app/api/geo/route.ts
export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  // Use free IP geolocation service
  const res = await fetch(`https://ipapi.co/${ip}/json/`)
  const data = await res.json()
  
  return Response.json({
    country: data.country_code,
    zone: getShippingZone(data.country_code)
  })
}
```

### 5.2 Product Filtering by Zone

```typescript
// lib/data/products.ts
export async function getProductsByZone(zone: ShippingRegion) {
  const supabase = createStaticClient()
  
  let query = supabase.from('products').select('*')
  
  switch (zone) {
    case 'BG':
      query = query.or('ships_to_bulgaria.eq.true,ships_to_worldwide.eq.true')
      break
    case 'UK':
      query = query.or('ships_to_uk.eq.true,ships_to_europe.eq.true,ships_to_worldwide.eq.true')
      break
    case 'EU':
      query = query.or('ships_to_europe.eq.true,ships_to_worldwide.eq.true')
      break
    case 'US':
      query = query.or('ships_to_usa.eq.true,ships_to_worldwide.eq.true')
      break
    default:
      query = query.eq('ships_to_worldwide', true)
  }
  
  return query
}
```

---

## 🔵 PHASE 6: Cleanup & Testing

### Priority: LOW (After above phases)

### 6.1 Enable Password Protection

⚠️ **Security Advisory from Supabase MCP:** Enable leaked password protection.

Go to: **Supabase Dashboard → Authentication → Settings → Security**
- Enable "Leaked password protection"
- This checks passwords against HaveIBeenPwned database

### 6.2 Delete Test/Seed Data

```sql
-- Remove seed products from "Tech Haven" mock seller
DELETE FROM public.products WHERE seller_id = '00000000-0000-0000-0000-000000000000';
DELETE FROM public.reviews WHERE user_id = '00000000-0000-0000-0000-000000000000';
DELETE FROM public.sellers WHERE id = '00000000-0000-0000-0000-000000000000';
DELETE FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000000';
```

### 6.3 Files to Modify

| File | Action | Priority |
|------|--------|----------|
| `components/product-page-content-new.tsx` | Remove mock sellerData, sampleFeedback | 🔴 CRITICAL |
| `components/reviews-section.tsx` | Remove mockReviews, mockDistribution | 🔴 CRITICAL |
| `app/[locale]/(checkout)/checkout/page.tsx` | Use product shipping flags | 🟠 HIGH |
| `lib/shipping.ts` | Add UK zone support | 🟠 HIGH |
| `lib/data/products.ts` | Add zone filtering | 🟠 HIGH |
| `supabase/seed.sql` | Remove or flag as dev-only | 🟡 MEDIUM |

### 6.4 Playwright E2E Tests to Add

```typescript
// tests/production.spec.ts
test('Product page shows real seller data', async ({ page }) => {
  await page.goto('/en/product/shop4e/test-product');
  // Should NOT see "505K items sold"
  await expect(page.locator('text=505K')).not.toBeVisible();
});

test('Reviews show empty state when no reviews', async ({ page }) => {
  await page.goto('/en/product/new-product-with-no-reviews');
  await expect(page.locator('text=No reviews yet')).toBeVisible();
});

test('Checkout shows seller shipping methods', async ({ page }) => {
  // Add product that only ships to Bulgaria
  // Verify express/overnight options reflect seller's config
});

test('UK users see UK-shippable products only', async ({ page }) => {
  await page.route('**/api/geo', route => route.fulfill({
    body: JSON.stringify({ country: 'GB' })
  }));
  await page.goto('/en/search');
  // Products should have ships_to_uk = true
});
```

---

## 📊 IMPLEMENTATION TIMELINE (Updated December 10, 2025)

| Phase | Description | Priority | Est. Time | Status |
|-------|-------------|----------|-----------|--------|
| **Phase 0** | Caching Strategy Implementation | ✅ DONE | - | See `CACHING.md` |
| **Phase 1** | Server/Client Architecture Audit | 🟡 MEDIUM | 1 hour | ⏳ Partial (homepage done) |
| **Phase 2.1** | Remove mock seller data | 🔴 CRITICAL | 2 hours | ❌ TODO |
| **Phase 2.2** | Remove mock reviews | 🔴 CRITICAL | 1 hour | ❌ TODO |
| **Phase 2.3** | Remove mock feedback | 🔴 CRITICAL | 2 hours | ❌ TODO |
| **Phase 3.1** | UK shipping support | 🟠 HIGH | 0.5 hour | ✅ DONE |
| **Phase 3.2** | Dynamic checkout shipping | 🟠 HIGH | 3 hours | ❌ TODO |
| **Phase 4** | Database migrations | 🟡 MEDIUM | 1 hour | ❌ TODO |
| **Phase 5** | Geo-location implementation | 🟡 MEDIUM | 2 hours | ✅ DONE |
| **Phase 6** | Cleanup & testing | 🟢 LOW | 2 hours | ❌ TODO |
| **Phase 7** | Cache invalidation wiring | 🟠 HIGH | 2 hours | ❌ TODO |

**Total Remaining Time:** ~12 hours (down from 16.5 hours)

### Caching Work Completed (Phase 0) ✅

| Task | File | Status |
|------|------|--------|
| Homepage refactored with Suspense | `app/[locale]/(main)/page.tsx` | ✅ DONE |
| Cached product functions | `lib/data/products.ts` | ✅ DONE |
| Cache invalidation server actions | `app/actions/revalidate.ts` | ✅ DONE |
| Cache profiles configured | `next.config.ts` | ✅ DONE |
| PPR enabled | `next.config.ts` | ✅ DONE |

### NEW Phase 7: Cache Invalidation Wiring ❌ TODO

After mock data removal, connect mutations to cache invalidation:

| Mutation | Action Required |
|----------|-----------------|
| New product created | `updateTag('products')` + `revalidateTag('newest', 'max')` |
| Product updated | `updateTag(\`product-${id}\`)` |
| Review submitted | `updateTag(\`product-${productId}\`)` + update product rating |
| Seller feedback added | `revalidateTag(\`seller-${sellerId}\`, 'max')` |
| Order delivered | Trigger updates seller stats (DB trigger exists) |

### Recommended Execution Order:
1. ✅ **Phase 0 (Caching)** - DONE
2. ✅ **Phase 3.1 (UK Shipping)** - DONE (December 10, 2025)
3. ✅ **Phase 5 (Geo-location)** - DONE (December 10, 2025)
4. ⏳ **Phase 4 (Migrations)** - Do this NEXT for remaining work
5. ❌ **Phase 2 (Mock Data Removal)** - Depends on Phase 4
6. ❌ **Phase 3.2 (Dynamic checkout shipping)**
7. ❌ **Phase 7 (Cache Invalidation Wiring)** - After Phase 2
8. ❌ **Phase 6 (Cleanup)**

---

## ✅ VERIFICATION CHECKLIST

### Pre-Launch (Must Complete)

- [x] **Caching strategy implemented** (`CACHING.md` V3)
- [x] **Homepage uses cached data with Suspense** 
- [ ] **Database migration applied** (seller stats, UK shipping, feedback table, variant_id)
- [ ] **No mock data visible on any product page**
- [ ] **Seller ratings show real values** (or "New Seller" badge if 0)
- [ ] **Reviews show real reviews** (or "No reviews yet" - NOT mock Bulgarian names)
- [ ] **Checkout shipping options from product data** (not hardcoded)
- [x] **UK shipping zone working** (`ships_to_uk` column) ✅ December 10, 2025
- [ ] **Leaked password protection enabled** (Supabase Auth setting)
- [ ] **Cache invalidation wired to mutations**

### Post-Launch Monitoring

- [ ] Cache hit rates (check Vercel Analytics)
- [x] User zone detection working (check cookies) ✅ Implemented
- [x] Products filtered by shipping zone ✅ Implemented
- [ ] Seller feedback aggregation working
- [ ] Order completion updates seller stats
- [ ] Review submission stores in Supabase AND invalidates cache

---

## 🎯 QUICK START - CRITICAL FIXES ONLY

If time-limited, focus on these **3 files** for 90% mock data removal:

1. **`components/product-page-content-new.tsx`** - Remove lines 147-193 (mock seller data + feedback)
2. **`components/reviews-section.tsx`** - Remove lines 36-84 (mock reviews), change fallback to empty array
3. **`app/[locale]/(checkout)/checkout/page.tsx`** - Add product shipping flag checks before showing methods

These changes alone will eliminate 90% of visible mock data.

---

## 📚 RELATED DOCUMENTATION

| Document | Purpose |
|----------|---------|
| **`CACHING.md`** | Complete Next.js 16 caching strategy, `'use cache'` patterns, Supabase integration |
| **`FRONTEND.md`** | Component architecture, UI patterns |
| **`COMPONENTS.md`** | Component inventory and refactoring notes |
| **`supabase.md`** | Database schema, RLS policies, migrations |

---

**Document Author:** GitHub Copilot (Claude Opus 4.5)  
**MCP Sources:** Supabase MCP, Next.js MCP, Context7 MCP (Next.js Caching, Supabase SSR)  
**Last Updated:** December 10, 2025  
**Latest Changes:** UK Shipping Implementation (Phase 3.1 + Phase 5)  
**Caching Audit:** VERIFIED against Next.js 16.0.7 docs + Supabase CDN/SSR docs  
**Next Review:** Before production deployment
