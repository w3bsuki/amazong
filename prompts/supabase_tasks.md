# Supabase Tasks - Best Practices Implementation

**Generated:** December 31, 2025  
**Based on:**
- [supabase_audit.md](supabase_audit.md)
- [SUPABASE_NEXTJS16_AUDIT.md](SUPABASE_NEXTJS16_AUDIT.md)
- Supabase MCP Advisors (live scan)
- Context7 Documentation (latest @supabase/ssr patterns)

---

## Summary: What's Already CORRECT ✅

| Area | Status | Notes |
|------|--------|-------|
| `@supabase/ssr` v0.8.0 | ✅ | Latest SSR package, NOT deprecated auth-helpers |
| Client separation | ✅ | `createClient()`, `createStaticClient()`, `createAdminClient()` properly separated |
| Cookie handling | ✅ | Using `getAll()`/`setAll()` pattern (NOT deprecated get/set/remove) |
| Middleware auth | ✅ | Calls `getUser()` to validate JWT, not `getSession()` |
| PKCE flow | ✅ | Enabled by default via `@supabase/ssr` |
| RLS enabled | ✅ | All public tables have RLS enabled |
| Timeout wrapper | ✅ | `fetchWithTimeout` prevents hanging requests |

---

## 🚨 CRITICAL SECURITY FIXES (Do First)

### Task 1: Fix Function Search Path Vulnerabilities

**Priority:** 🔴 CRITICAL  
**Source:** Supabase MCP Security Advisors  
**Effort:** 15 minutes

The following functions have mutable `search_path` which is a security vulnerability:

```
⚠️ public.update_product_category_ancestors
⚠️ public.get_category_ancestor_ids
⚠️ public.get_products_in_category
⚠️ public.count_products_in_category
```

**Fix:** Add `SET search_path = ''` to each function:

```sql
-- Migration: fix_function_search_paths.sql
CREATE OR REPLACE FUNCTION public.get_products_in_category(...)
RETURNS ... 
SET search_path = ''  -- ADD THIS LINE
AS $$
...
$$;
```

**Reference:** https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

---

### Task 2: Enable Leaked Password Protection

**Priority:** 🔴 CRITICAL  
**Source:** Supabase MCP Security Advisors  
**Effort:** 5 minutes (dashboard setting)

**Current Status:** Disabled  
**Action:** Enable in Supabase Dashboard → Authentication → Settings → Password Settings → "Enable leaked password protection"

This checks passwords against HaveIBeenPwned.org to prevent compromised credentials.

**Reference:** https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

---

## ⚠️ OVER-ENGINEERED - Simplify These

### Task 3: Replace Ghost RPC Functions with PostgREST

**Priority:** 🟡 MEDIUM  
**Source:** SUPABASE_NEXTJS16_AUDIT.md  
**Effort:** 30 minutes

**Problem:** `get_products_in_category` and `count_products_in_category` RPCs are referenced but either don't exist or are unnecessary.

**Current Code (app/api/products/newest/route.ts):**
```typescript
// ❌ These RPCs duplicate what PostgREST can do
const { data } = await supabase.rpc('get_products_in_category', {...})
const { data: count } = await supabase.rpc('count_products_in_category', {...})
```

**Better Pattern (per Supabase docs):**
```typescript
// ✅ Use existing get_category_hierarchy RPC + PostgREST
const { data: hierarchy } = await supabase.rpc('get_category_hierarchy', {
  p_slug: category,
  p_depth: 4
})
const categoryIds = hierarchy?.map(c => c.id) || []

// Single query with count
const { data, count } = await supabase
  .from('products')
  .select(`
    id, title, price, images, rating, review_count,
    seller:profiles!products_seller_id_fkey(username, display_name),
    category:categories(id, slug, name)
  `, { count: 'exact' })
  .in('category_id', categoryIds)
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1)
```

**Why this is better:**
- PostgREST `.in()` uses existing `category_id` FK index
- No custom RPC maintenance
- Automatic TypeScript types from database.types
- Single query for data + count

---

### Task 4: Implement category_ancestors Column (Optional Optimization)

**Priority:** 🟢 LOW (only if performance is an issue)  
**Source:** SUPABASE_NEXTJS16_AUDIT.md  
**Effort:** 1 hour

The code comments mention a `category_ancestors` GIN index that doesn't exist. If category queries become slow with 13k+ categories:

**Step 1: Add column**
```sql
ALTER TABLE products ADD COLUMN category_ancestors uuid[] DEFAULT '{}';
CREATE INDEX idx_products_category_ancestors ON products USING GIN (category_ancestors);
```

**Step 2: Add trigger**
```sql
CREATE OR REPLACE FUNCTION populate_category_ancestors()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
  WITH RECURSIVE ancestors AS (
    SELECT id, parent_id FROM public.categories WHERE id = NEW.category_id
    UNION ALL
    SELECT c.id, c.parent_id FROM public.categories c
    JOIN ancestors a ON c.id = a.parent_id
  )
  SELECT array_agg(id) INTO NEW.category_ancestors FROM ancestors;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_populate_category_ancestors
BEFORE INSERT OR UPDATE OF category_id ON products
FOR EACH ROW EXECUTE FUNCTION populate_category_ancestors();
```

**Only implement if:** Query performance degrades with scale

---

## 📋 BEST PRACTICES CHECKLIST

### Client Usage Patterns

- [x] ✅ Server Components use `createClient()` (with cookies)
- [x] ✅ Client Components use `createBrowserClient()` (singleton)
- [x] ✅ Route Handlers use `createRouteHandlerClient(request)`
- [x] ✅ Cached functions use `createStaticClient()` (no cookies)
- [x] ✅ Admin operations use `createAdminClient()` (service role)

### Authentication Patterns

- [x] ✅ Middleware calls `getUser()` NOT `getSession()`
- [x] ✅ Cookie handling uses `getAll()`/`setAll()` pattern
- [x] ✅ No code between `createServerClient` and `getUser()` in middleware
- [x] ✅ Protected routes redirect to `/auth/login` with `next` param
- [ ] ⚠️ Enable leaked password protection (Task 2)

### Database Security

- [x] ✅ All public tables have RLS enabled
- [x] ✅ `SECURITY DEFINER` used appropriately for hierarchy functions
- [ ] ⚠️ Fix function search_path vulnerabilities (Task 1)

### Query Patterns

- [x] ✅ Using `.select('col1,col2,relation(col3)')` for joins (not SELECT *)
- [x] ✅ Using `.single()` when expecting one row
- [x] ✅ Using `{ count: 'exact' }` for pagination counts
- [x] ✅ Using `.range()` for pagination
- [x] ✅ Proper error handling with `{ data, error }` destructuring

### Next.js 16 Caching Integration

- [x] ✅ `createStaticClient()` exists for cache-compatible queries
- [x] ✅ No `cookies()` calls in cached functions
- [x] ✅ Route handlers use request cookies, not `next/headers`

---

## DO NOT DO (Anti-Patterns to Avoid)

### ❌ Never use deprecated auth-helpers

```typescript
// ❌ WRONG - BREAKS APPLICATION
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// ✅ CORRECT
import { createServerClient } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
```

### ❌ Never use deprecated cookie methods

```typescript
// ❌ WRONG - BREAKS APPLICATION
cookies: {
  get(name) { return cookieStore.get(name) },
  set(name, value) { cookieStore.set(name, value) },
  remove(name) { cookieStore.remove(name) }
}

// ✅ CORRECT
cookies: {
  getAll() { return cookieStore.getAll() },
  setAll(cookiesToSet) { 
    cookiesToSet.forEach(({ name, value, options }) =>
      cookieStore.set(name, value, options)
    )
  }
}
```

### ❌ Never trust getSession() on server

```typescript
// ❌ WRONG - Can be spoofed
const { data: { session } } = await supabase.auth.getSession()
if (session) { /* allow access */ }

// ✅ CORRECT - Validates JWT
const { data: { user } } = await supabase.auth.getUser()
if (user) { /* allow access */ }
```

### ❌ Never use RPC when PostgREST suffices

```typescript
// ❌ OVER-ENGINEERED
await supabase.rpc('get_user_products', { user_id })

// ✅ SIMPLER
await supabase
  .from('products')
  .select('*')
  .eq('seller_id', user_id)
```

### ❌ Never bypass RLS without service role

```typescript
// ❌ WRONG - Uses anon key but expects admin access
const client = createStaticClient()
await client.from('admin_table').select() // Will fail

// ✅ CORRECT - Use admin client
const admin = createAdminClient()
await admin.from('admin_table').select() // Bypasses RLS
```

---

## Performance Monitoring

### Recommended Queries to Monitor

```sql
-- Find slow queries (run in Supabase SQL Editor)
SELECT 
  calls,
  mean_time,
  query
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Key Indexes Already in Place

- `products.category_id` (FK index) ✅
- `products.seller_id` (FK index) ✅
- `products.search_vector` (GIN index for FTS) ✅
- `categories.slug` (unique) ✅
- `categories.parent_id` (FK index) ✅

---

## Implementation Order

1. **Today:** Task 1 (security fix - 15 min) + Task 2 (dashboard setting - 5 min)
2. **This Week:** Task 3 (simplify RPCs - 30 min)
3. **If Needed:** Task 4 (category_ancestors optimization - 1 hr)

---

## References

- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [PostgREST Filters](https://supabase.com/docs/reference/javascript/using-filters)
- [RLS Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Database Linter](https://supabase.com/docs/guides/database/database-linter)
