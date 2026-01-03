# Vercel Usage Optimization Plan

## Executive Summary

**Current Vercel Usage Crisis:**
| Metric | Current | Limit | Overage |
|--------|---------|-------|---------|
| ISR Writes | 571K | 200K | **286%** |
| Fast Origin Transfer | 18.69 GB | 10 GB | **187%** |
| Edge Requests | 1.6M | 1M | **160%** |
| Function Invocations | 923K | 1M | **92%** |

**Root Causes Identified:**
1. ❌ **4-level nested category joins** in every product query → Data bloat
2. ❌ **Incorrect `revalidateTag()` syntax** with invalid second argument
3. ❌ **Missing `generateStaticParams`** on dynamic routes → ISR explosion
4. ❌ **Over-fetching** unnecessary fields in API responses
5. ❌ **No field projection** - selecting all columns when only a few are needed

---

## Completed Fixes ✅

### 1. Fixed `revalidateTag()` Syntax Errors
**Files Fixed:**
- [app/actions/blocked-users.ts](../app/actions/blocked-users.ts)
- [app/[locale]/(chat)/_actions/report-conversation.ts](../app/[locale]/(chat)/_actions/report-conversation.ts)
- [app/api/revalidate/route.ts](../app/api/revalidate/route.ts)

**Issue:** `revalidateTag("tag", "max")` - second argument is invalid
**Fix:** `revalidateTag("tag")` - takes ONE argument only

### 2. Added `generateStaticParams` to Dynamic Routes
**Files Fixed:**
- [app/[locale]/[username]/page.tsx](../app/[locale]/[username]/page.tsx)
- [app/[locale]/[username]/[productSlug]/page.tsx](../app/[locale]/[username]/[productSlug]/page.tsx)

**Issue:** Missing static params caused ISR writes for every unique visitor
**Fix:** Added placeholder-based `generateStaticParams` with runtime validation

---

## Pending Optimizations 🔧

### Phase 1: Critical - Data Transfer Reduction (Est. -70% transfer)

#### 1.1 Flatten Category Joins (HIGHEST PRIORITY)

**Current Problem:**
```typescript
// lib/data/products.ts - 4 LEVELS OF NESTED JOINS!
categories!inner(
  id,slug,name,name_bg,icon,
  parent:categories(
    id,slug,name,name_bg,icon,
    parent:categories(
      id,slug,name,name_bg,icon,
      parent:categories(id,slug,name,name_bg,icon)
    )
  )
)
```

**Impact:** With 13,139 categories in DB, this creates MASSIVE response payloads.

**Solution - Use `category_ancestors` Array:**

The `products` table already has `category_ancestors UUID[]` column! Use it:

```typescript
// BEFORE: 4 nested joins (bloated)
categories!inner(id,slug,name,name_bg,icon,parent:categories(...))

// AFTER: Use denormalized category_ancestors + single category join
categories(id,slug,name,name_bg,icon)
```

Then fetch ancestor categories in a separate cached query when needed for breadcrumbs:

```typescript
// lib/data/categories.ts - Add new cached function
export async function getCategoryAncestors(categoryId: string) {
  'use cache'
  cacheTag('categories', `category-ancestors-${categoryId}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) return []
  
  // Use recursive CTE or ltree for efficient ancestor lookup
  const { data } = await supabase
    .rpc('get_category_path', { category_id: categoryId })
  
  return data ?? []
}
```

**Files to Modify:**
- [lib/data/products.ts](../lib/data/products.ts)
- [lib/data/categories.ts](../lib/data/categories.ts)
- [app/api/products/feed/route.ts](../app/api/products/feed/route.ts)

**Estimated Impact:** -60% data transfer (18.69GB → ~7.5GB)

---

#### 1.2 Implement Field Projection

**Current Problem:**
```typescript
// Selecting ALL product_images when only primary needed
product_images(image_url,thumbnail_url,display_order,is_primary)
```

**Solution:**
```typescript
// Only fetch primary image for list views
product_images!inner(image_url,is_primary).eq(is_primary, true)
```

Or use the `images[]` array column directly which is already denormalized.

---

#### 1.3 Remove Redundant Seller Profile Joins

**Current Problem:**
Every product query joins full seller profile:
```typescript
seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business)
```

**Solution:**
For list views, only fetch essential seller data:
```typescript
// Minimal seller for product cards
seller:profiles(id,username,avatar_url)
```

Full seller info should only be fetched on detail pages.

---

### Phase 2: ISR Write Reduction (Est. -80% ISR)

#### 2.1 Implement Smarter Cache Keys

**Problem:** Generic cache tags cause excessive invalidation:
```typescript
cacheTag('products', type)  // Too broad!
```

**Solution:** More granular cache tags:
```typescript
// For category-specific queries
cacheTag(`products:${type}:cat:${categorySlug || 'all'}:zone:${zone || 'all'}`)

// For individual products
cacheTag(`product:${productId}`)
```

---

#### 2.2 Add `stale-while-revalidate` Pattern

**Current:** Hard revalidation on every cache miss
**Solution:** Use proper `cacheLife` profiles from `next.config.ts`:

```typescript
// next.config.ts - Already defined:
cacheLife: {
  categories: { stale: 3600, revalidate: 60, expire: 3600 },
  products: { stale: 300, revalidate: 60, expire: 300 },
  deals: { stale: 120, revalidate: 30, expire: 120 },
  user: { stale: 60, revalidate: 30, expire: 60 },
}
```

Ensure all cached functions use appropriate profiles.

---

### Phase 3: Edge Request Reduction (Est. -40% requests)

#### 3.1 Optimize Middleware

**File:** [proxy.ts](../proxy.ts)

**Problem:** Middleware runs on EVERY request including static assets.

**Solution:** Add matcher to exclude static files:
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/health).*)',
  ],
}
```

---

#### 3.2 Reduce Cookie Operations

**Problem:** Session cookie reads on every request.

**Solution:** Only read cookies for protected routes:
```typescript
// Skip cookie parsing for public pages
const isPublicPage = pathname.startsWith('/products') || pathname === '/'
if (!isPublicPage) {
  // Only then check session
}
```

---

### Phase 4: Database Optimization (Supabase)

#### 4.1 RLS Policy Optimization

Based on Supabase docs, wrap `auth.uid()` in subqueries:

```sql
-- BEFORE (slow - evaluates auth.uid() per row)
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (user_id = auth.uid());

-- AFTER (fast - evaluates auth.uid() once)
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (user_id = (SELECT auth.uid()));
```

**Tables to Update:**
- `products` (public read, owner write)
- `orders` (owner read)
- `profiles` (public read, owner write)
- `wishlists` (owner only)
- `cart_items` (owner only)

---

#### 4.2 Add Missing Indexes

```sql
-- Index for category ancestor lookups
CREATE INDEX idx_products_category_ancestors 
ON products USING GIN (category_ancestors);

-- Index for seller product queries
CREATE INDEX idx_products_seller_created 
ON products (seller_id, created_at DESC)
WHERE status = 'active';

-- Index for boosted products
CREATE INDEX idx_products_boosted 
ON products (is_boosted, boost_expires_at)
WHERE is_boosted = true;
```

---

#### 4.3 Create Database Functions for Common Queries

```sql
-- Efficient category path lookup
CREATE OR REPLACE FUNCTION get_category_path(category_id UUID)
RETURNS TABLE(id UUID, slug TEXT, name TEXT, name_bg TEXT, icon TEXT, depth INT)
LANGUAGE SQL STABLE
AS $$
  WITH RECURSIVE path AS (
    SELECT c.id, c.slug, c.name, c.name_bg, c.icon, 0 as depth, c.parent_id
    FROM categories c
    WHERE c.id = category_id
    
    UNION ALL
    
    SELECT c.id, c.slug, c.name, c.name_bg, c.icon, p.depth + 1, c.parent_id
    FROM categories c
    JOIN path p ON c.id = p.parent_id
    WHERE p.depth < 5  -- Safety limit
  )
  SELECT id, slug, name, name_bg, icon, depth
  FROM path
  ORDER BY depth DESC;
$$;
```

---

## Implementation Priority

| Priority | Task | Impact | Effort | Files |
|----------|------|--------|--------|-------|
| 🔴 P0 | Flatten category joins | -60% transfer | Medium | products.ts, categories.ts |
| 🔴 P0 | Add middleware matcher | -30% edge reqs | Low | proxy.ts |
| 🟠 P1 | Field projection in lists | -10% transfer | Low | products.ts |
| 🟠 P1 | Granular cache tags | -50% ISR | Medium | All data files |
| 🟡 P2 | RLS optimization | -20% DB time | Medium | Supabase migrations |
| 🟡 P2 | Add DB indexes | -30% query time | Low | Supabase migrations |
| 🟢 P3 | Category path function | -10% transfer | Low | Supabase + categories.ts |

---

## Next.js 16 Cache Components Best Practices

### ✅ Correct Usage Patterns

```typescript
// 1. 'use cache' directive at function start
async function getData() {
  'use cache'
  cacheTag('my-tag')     // Tag for invalidation
  cacheLife('products')  // Use profile from next.config.ts
  
  // ... data fetching
}

// 2. revalidateTag() takes ONE argument
revalidateTag('products')  // ✅ Correct
revalidateTag('products', 'max')  // ❌ Wrong!

// 3. Use Suspense for runtime data
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>

// 4. generateStaticParams with placeholder pattern
export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
    username: '__placeholder__'  // Placeholder for build
  }))
}
```

### ❌ Anti-Patterns to Avoid

1. **Don't use cookies/headers in cached functions** - They make output dynamic
2. **Don't mix `dynamicParams` with `cacheComponents`** - Incompatible
3. **Don't over-invalidate** - Use granular tags
4. **Don't fetch nested relations when flat ones exist** - Use denormalized columns

---

## Monitoring & Validation

After implementing fixes:

1. **Vercel Dashboard** - Monitor usage metrics daily
2. **Supabase Dashboard** - Check query performance
3. **Build Output** - Verify static vs dynamic pages
4. **Response Sizes** - Use Network tab to verify reduction

---

## Estimated Results After Full Implementation

| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| ISR Writes | 571K | ~100K | **-82%** |
| Fast Origin Transfer | 18.69 GB | ~5 GB | **-73%** |
| Edge Requests | 1.6M | ~900K | **-44%** |
| Function Invocations | 923K | ~600K | **-35%** |

---

## References

- [Next.js 16 Cache Components Docs](https://nextjs.org/docs/app/getting-started/cache-components)
- [Supabase RLS Performance Guide](https://supabase.com/docs/guides/database/postgres/row-level-security#rls-performance-recommendations)
- [Vercel Usage Limits](https://vercel.com/docs/limits/overview)
