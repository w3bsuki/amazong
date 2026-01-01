# Supabase + Next.js 16 Best Practices Audit

**Date:** January 2025  
**Auditor:** GitHub Copilot  
**Documentation Sources:**  
- [Supabase PostgREST Best Practices](https://supabase.com/docs/guides/database/postgres/postgrest)
- [Supabase RPC Functions](https://supabase.com/docs/guides/database/functions)
- [Supabase RLS Performance](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Next.js 16 Caching](https://nextjs.org/docs/app/building-your-application/data-fetching/caching-and-revalidating)

---

## Executive Summary

| Area | Verdict |
|------|---------|
| **Client Creation Pattern** | ✅ **CORRECT** - Excellent separation of concerns |
| **RPC vs PostgREST** | 🟡 **OVER-ENGINEERED** - One RPC is unnecessary |
| **Hierarchical Categories** | ⚠️ **GHOST CODE** - `category_ancestors` referenced but doesn't exist |
| **RLS Configuration** | ✅ **CORRECT** - Proper policies, `SECURITY DEFINER` used appropriately |
| **Next.js 16 Caching** | ✅ **CORRECT** - Using `cacheLife`, `cacheTag`, `'use cache'` properly |

---

## 1. Client Creation Pattern Analysis

### ✅ CORRECT - Keep This

**Files:** [lib/supabase/server.ts](../lib/supabase/server.ts)

Your client factory pattern is **excellent** and follows official Supabase SSR docs exactly:

```typescript
// ✅ Auth-dependent (cookies) - for user-specific data
export async function createClient() { ... }

// ✅ Route handlers (request cookies) - for API routes
export function createRouteHandlerClient(request: NextRequest) { ... }

// ✅ Static client (no cookies) - for 'use cache' compatible queries
export function createStaticClient() { ... }

// ✅ Admin client (bypasses RLS) - for server-side admin ops
export function createAdminClient() { ... }
```

**Why this is correct per Supabase docs:**
1. `createServerClient` from `@supabase/ssr` is used for cookie-based auth
2. `createSupabaseClient` (vanilla) is correctly used for `createStaticClient` since cached functions cannot access cookies
3. Service role key is properly isolated in `createAdminClient`
4. Timeout wrapper (`fetchWithTimeout`) prevents hanging requests

**Citation:** [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side-rendering)

---

## 2. RPC vs PostgREST Analysis

### 🔴 OVER-ENGINEERED: `get_products_in_category` and `count_products_in_category`

**File:** [app/api/products/newest/route.ts](../app/api/products/newest/route.ts#L46-L65)

Your code calls these RPC functions:
```typescript
// Lines 46-65
const { data: rpcProducts, error: rpcError } = await (supabase.rpc as any)(
  'get_products_in_category',
  { p_category_slug: category, p_limit: safeLimit, p_offset: offset }
)

const { data: countResult } = await (supabase.rpc as any)(
  'count_products_in_category',
  { p_category_slug: category }
)
```

**PROBLEM:** These RPC functions don't exist in migrations! The comment mentions `category_ancestors` GIN index, but:

1. `category_ancestors` column doesn't exist in `products` table
2. `get_products_in_category` is not defined in any migration
3. `count_products_in_category` is not defined in any migration

**Evidence from [schema.sql](../supabase/schema.sql#L34-L48):**
```sql
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.sellers(id) not null,
  category_id uuid references public.categories(id),  -- ❌ No category_ancestors
  title text not null,
  ...
);
```

### What You SHOULD Do (Per Supabase Docs)

**Option A: PostgREST with Recursive CTE (Recommended)**

Supabase PostgREST supports complex queries. Use the existing `get_category_hierarchy` RPC to get category IDs, then use PostgREST `.in()`:

```typescript
// Step 1: Get all descendant category IDs (already have this RPC!)
const { data: hierarchy } = await supabase.rpc('get_category_hierarchy', {
  p_slug: category,
  p_depth: 4
})
const categoryIds = hierarchy?.map(c => c.id) || []

// Step 2: PostgREST query (no custom RPC needed)
const { data, count } = await supabase
  .from('products')
  .select(`
    id, title, price, ...
    categories(id,slug,name,...)
  `, { count: 'exact' })
  .in('category_id', categoryIds)  // ✅ Uses existing index
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1)
```

**Why this is better per Supabase docs:**
- PostgREST `.select()` with `.in()` uses the existing `category_id` FK index
- No need for custom RPC - reduces database function maintenance
- Automatic type safety from generated types
- Single query for both data + count with `{ count: 'exact' }`

**Citation:** [Supabase PostgREST Filters](https://supabase.com/docs/reference/javascript/using-filters)

---

## 3. Hierarchical Categories Analysis

### ✅ CORRECT: `get_category_hierarchy` RPC

**File:** [migrations/20251205000000_add_category_hierarchy_function.sql](../supabase/migrations/20251205000000_add_category_hierarchy_function.sql)

This IS the Supabase-recommended approach for hierarchical data:

```sql
CREATE OR REPLACE FUNCTION public.get_category_hierarchy(
    p_slug TEXT DEFAULT NULL,
    p_depth INTEGER DEFAULT 3
)
...
WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT c.id, c.name, ..., 0 AS depth, ARRAY[c.slug] AS path
    FROM categories c
    WHERE CASE WHEN p_slug IS NULL THEN c.parent_id IS NULL
               ELSE c.slug = p_slug END
    
    UNION ALL
    
    -- Recursive case: children
    SELECT child.id, child.name, ..., parent.depth + 1, parent.path || child.slug
    FROM categories child
    INNER JOIN category_tree parent ON child.parent_id = parent.id
    WHERE parent.depth < p_depth
)
SELECT * FROM category_tree;
```

**Why this is correct per Supabase docs:**
- Recursive CTE is the official pattern for tree structures
- `SECURITY DEFINER` correctly bypasses RLS for public category data
- `GRANT EXECUTE` properly allows anon/authenticated access

**Citation:** [Postgres Recursive CTE](https://supabase.com/docs/guides/database/postgres/hierarchical-data)

### ⚠️ GHOST CODE: `category_ancestors` GIN Index

The comment in [route.ts#L12](../app/api/products/newest/route.ts#L12) says:
> "Uses the optimized `category_ancestors` GIN index for O(1) lookups"

**This doesn't exist.** The pattern described (storing ancestor IDs in an array column) IS valid, but you haven't implemented it.

**If you WANT this optimization:**

1. Add the column to products:
```sql
ALTER TABLE products ADD COLUMN category_ancestors uuid[] DEFAULT '{}';
CREATE INDEX idx_products_category_ancestors ON products USING GIN (category_ancestors);
```

2. Add a trigger to populate it:
```sql
CREATE OR REPLACE FUNCTION populate_category_ancestors()
RETURNS TRIGGER AS $$
BEGIN
  -- Walk up the category tree and store all ancestor IDs
  WITH RECURSIVE ancestors AS (
    SELECT id, parent_id FROM categories WHERE id = NEW.category_id
    UNION ALL
    SELECT c.id, c.parent_id FROM categories c
    JOIN ancestors a ON c.id = a.parent_id
  )
  SELECT array_agg(id) INTO NEW.category_ancestors FROM ancestors;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

3. Query with containment:
```sql
-- Products where 'fashion' category is anywhere in ancestors
SELECT * FROM products WHERE category_ancestors @> ARRAY['fashion-uuid']::uuid[];
```

**BUT:** This adds complexity. Evaluate if you actually need O(1) vs the current O(N) approach working fine.

---

## 4. RLS Configuration Analysis

### ✅ CORRECT - Keep This

**File:** [schema.sql](../supabase/schema.sql#L104-L145)

Your RLS policies follow best practices:

```sql
-- ✅ Public read for products
create policy "Products are viewable by everyone." 
  on public.products for select using (true);

-- ✅ Owner-restricted write
create policy "Sellers can insert products." 
  on public.products for insert with check (auth.uid() = seller_id);

-- ✅ Admin helper uses SECURITY DEFINER
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;
```

**One Optimization (Per Supabase Docs):**

Wrap `auth.uid()` in a subselect for better planner performance:

```sql
-- BEFORE (your current code)
create policy "Users can view own orders."
  on public.orders for select using (auth.uid() = user_id);

-- AFTER (optimized)
create policy "Users can view own orders."
  on public.orders for select using ((select auth.uid()) = user_id);
```

**Why:** The planner can evaluate `(select auth.uid())` once instead of per-row.

**Citation:** [RLS Performance Guide](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)

---

## 5. Next.js 16 Caching Analysis

### ✅ CORRECT - Keep This

**File:** [lib/data/products.ts](../lib/data/products.ts#L240-L280)

Your caching pattern is **exactly** what Next.js 16 docs recommend:

```typescript
export async function getProductsByCategorySlug(
  categorySlug: string,
  limit = 18,
  zone?: ShippingRegion
): Promise<Product[]> {
  'use cache'                                    // ✅ Cache directive
  cacheTag('products', `category:${categorySlug}`) // ✅ Granular tags
  cacheLife('products')                          // ✅ Named cache profile

  const supabase = createStaticClient()          // ✅ Non-cookie client for caching
  ...
}
```

**Why this is correct per Next.js 16 docs:**
1. `'use cache'` directive enables Server Components caching
2. `cacheTag()` allows granular invalidation (`revalidateTag('products')`)
3. `cacheLife('products')` uses named profile (define in `next.config.ts`)
4. `createStaticClient()` correctly avoids cookies (which break caching)

**✅ Your `next.config.ts` already has proper cache profiles:**
```typescript
// next.config.ts (lines 21-46)
cacheLife: {
  categories: {
    stale: 300,       // 5 minutes - serve stale content this long
    revalidate: 3600, // 1 hour - revalidate in background after this
    expire: 86400,    // 1 day - hard expiry, refetch required
  },
  products: {
    stale: 60,        // 1 minute
    revalidate: 300,  // 5 minutes
    expire: 3600,     // 1 hour
  },
  deals: {
    stale: 30,        // 30 seconds - deals change often
    revalidate: 120,  // 2 minutes
    expire: 600,      // 10 minutes - force refresh
  },
}
```
**Note:** In Next.js 16, `cacheLife` is a top-level config option, not under `experimental`. Your config is correct!

**Citation:** [Next.js 16 cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife)

---

## 6. Specific Code Fixes

### Fix 1: Remove Ghost RPC Calls

**File:** [app/api/products/newest/route.ts](../app/api/products/newest/route.ts)

Replace lines 36-98 with PostgREST approach:

```typescript
if (category) {
  // Get descendant category IDs using existing RPC
  const { data: hierarchy } = await supabase.rpc('get_category_hierarchy', {
    p_slug: category,
    p_depth: 4
  })
  const categoryIds = hierarchy?.map((c: any) => c.id) || []
  
  if (categoryIds.length === 0) {
    return NextResponse.json({ products: [], hasMore: false, totalCount: 0, page })
  }

  // Single PostgREST query with count
  const { data, error, count } = await supabase
    .from('products')
    .select(`
      id, title, price, list_price, rating, review_count, images,
      product_images(image_url,thumbnail_url,display_order,is_primary),
      product_attributes(name,value),
      is_boosted, boost_expires_at, created_at, slug, attributes,
      seller:profiles(username),
      categories(id,slug,name,name_bg,icon,parent:categories(...))
    `, { count: 'exact' })
    .in('category_id', categoryIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + safeLimit - 1)

  productRows = data || []
  totalCount = count || 0
}
```

### Fix 2: Optimize RLS Auth Check

**Migration to add:**

```sql
-- Wrap auth.uid() in subselect for all policies
-- Example for orders:
DROP POLICY IF EXISTS "Users can view own orders." ON public.orders;
CREATE POLICY "Users can view own orders." 
  ON public.orders FOR SELECT 
  USING ((SELECT auth.uid()) = user_id);
```

### Fix 3: Add Missing Type Safety

**File:** [app/api/products/newest/route.ts](../app/api/products/newest/route.ts#L46)

Remove the `as any` type assertions by generating proper types:

```bash
pnpm supabase gen types typescript --project-id <your-project> > lib/supabase/database.types.ts
```

Then the RPC call becomes type-safe:
```typescript
const { data } = await supabase.rpc('get_category_hierarchy', {
  p_slug: category,
  p_depth: 4
})
// data is now properly typed as CategoryHierarchyRow[]
```

---

## Summary: Action Items

| Priority | Action | File(s) |
|----------|--------|---------|
| 🔴 HIGH | Remove ghost `get_products_in_category` RPC calls | `app/api/products/newest/route.ts` |
| 🔴 HIGH | Use PostgREST `.in()` with `get_category_hierarchy` results | `app/api/products/newest/route.ts` |
| 🟡 MEDIUM | Optimize RLS with `(select auth.uid())` | `supabase/schema.sql` |
| 🟢 LOW | Remove misleading `category_ancestors` comments | `app/api/products/newest/route.ts` |
| ✅ KEEP | Client factory pattern | `lib/supabase/server.ts` |
| ✅ KEEP | `get_category_hierarchy` RPC | Migration file |
| ✅ KEEP | Next.js 16 caching pattern | `lib/data/products.ts` |

---

## Appendix: Supabase Hierarchical Data Options

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Recursive CTE RPC** (current) | Standard SQL, no schema changes | N+1 for deep trees | Trees < 1000 nodes |
| **Materialized Path** (`category_ancestors[]`) | O(1) queries with GIN | Write overhead, trigger maintenance | Read-heavy with millions of products |
| **ltree Extension** | Native Postgres tree ops | Learning curve, extension required | Complex tree queries |
| **Closure Table** | Fast for all tree operations | Additional table, complex writes | Full tree traversal |

Your current approach (**Recursive CTE**) is appropriate for your scale. Only implement `category_ancestors` if you have performance issues with > 100k products.
