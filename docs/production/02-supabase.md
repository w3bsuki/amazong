# Phase 2: Supabase Audit

> **Priority:** 🔴 Critical  
> **Estimated Time:** 4-8 hours  
> **Goal:** Secure data, optimize queries, verify auth flows  
> **Tools:** Supabase Dashboard + SQL Editor, `supabase db push` (if using CLI)  
> **Last Updated:** 2026-01-01

---

## ✅ Current Implementation Status

### What's Already Correct (Best Practices Followed):

1. **✅ Using `@supabase/ssr` v0.8.0** - Latest SSR package (NOT deprecated `auth-helpers`)
2. **✅ Proper cookie handling** with `getAll()` and `setAll()` pattern
3. **✅ Server client uses `cookies()` from `next/headers`**
4. **✅ Browser client uses singleton pattern** via `createBrowserClient`
5. **✅ Middleware calls `supabase.auth.getUser()`** to validate JWT (security!)
6. **✅ PKCE flow** enabled by default via `@supabase/ssr`
7. **✅ Auth callback route** at `/auth/callback/route.ts` with `exchangeCodeForSession`
8. **✅ Separate clients** for different contexts (server, browser, admin, static)
9. **✅ Route protection** in middleware for `/account/*`, `/sell/orders/*`, `/chat/*`

### Files Verified:
- ✅ `lib/supabase/server.ts` - `createClient()`, `createRouteHandlerClient()`, `createStaticClient()`, `createAdminClient()`
- ✅ `lib/supabase/client.ts` - Browser client with singleton; fails fast if env vars missing
- ✅ `lib/supabase/middleware.ts` - Session refresh via `updateSession()`
- ✅ `proxy.ts` - i18n + geo + session middleware chain

### Phase 1 Security Alignment (Implemented ✅)

- ✅ User-facing API routes no longer use the service-role client after authenticating a user (RLS is enforced end-to-end).
- ✅ Public read routes use anon/static clients (no accidental privilege escalation).
- ✅ Removed mock browser client fallback so missing env vars fail loudly.
- ✅ Applied DB cleanup migration to remove over-engineered RPC wrappers; followed by restoring FK-covering indexes after advisors flagged gaps.
- ✅ Regenerated and synced `lib/supabase/database.types.ts` to match live DB.

---

## 📋 Security Advisors (Current Status)

### ⚠️ 1 Security Warning:

| Issue | Severity | Table/Function | Fix Required |
|-------|----------|----------------|--------------|
| `auth_leaked_password_protection` | WARN | Auth Config | Enable in Dashboard |

**Verification notes (via Dashboard + SQL):**
- ✅ `public.set_notification_preferences_updated_at()` now has `search_path=public` pinned.
- Leaked password protection is still disabled in Auth settings.

### 🔄 Performance Advisors:

| Issue | Severity | Details |
|-------|----------|---------|
| **Unused Indexes** | INFO | 60+ unused indexes across tables (evaluate for removal post-launch) |

**Verification notes (via Dashboard + SQL):**
- ✅ `notification_preferences` policies updated to `(select auth.uid())` pattern
- ✅ `cart_items(product_id)` index added
- ✅ Duplicate `wishlists` unique index removed
- ✅ `storage.objects` policy "Users can delete own images" updated to use `(select auth.uid())` pattern

✅ Applied in migration: `supabase/migrations/20251227001000_optimize_storage_delete_policy.sql`

---

## 🔧 Required Fixes

### 1. Fix Function Search Path (SECURITY)

```sql
-- Migration: fix_function_search_path.sql
ALTER FUNCTION public.set_notification_preferences_updated_at()
SET search_path = public;
```

✅ Applied in migration: `supabase/migrations/20251227000000_phase2_advisors_fixes_20251227.sql`

### 2. Enable Leaked Password Protection (SECURITY)

**Dashboard:** Authentication → Settings → Enable "Leaked Password Protection"

Or via SQL:
```sql
-- This requires dashboard access - not available via SQL
-- Go to: https://supabase.com/dashboard/project/[PROJECT_REF]/auth/policies
```

### 3. Fix RLS Policy Performance (PERFORMANCE)

```sql
-- Migration: optimize_notification_preferences_rls.sql

-- Drop and recreate policies with (select auth.uid()) wrapper
DROP POLICY IF EXISTS "Users can view own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON notification_preferences;

CREATE POLICY "Users can view own notification preferences"
ON notification_preferences FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own notification preferences"
ON notification_preferences FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own notification preferences"
ON notification_preferences FOR UPDATE
TO authenticated
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);
```

✅ Applied in migration: `supabase/migrations/20251227000000_phase2_advisors_fixes_20251227.sql`

### 4. Add Missing Foreign Key Index (PERFORMANCE)

Note: there is already a unique index on `(user_id, product_id)`, but it does **not** cover FK operations/queries that need an index starting with `product_id`. The advisor warning is therefore valid.

```sql
-- Migration: add_cart_items_product_index.sql
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id 
ON cart_items(product_id);
```

✅ Applied in migration: `supabase/migrations/20251227000000_phase2_advisors_fixes_20251227.sql`

### 5. Remove Duplicate Index (PERFORMANCE)

```sql
-- Migration: remove_duplicate_wishlist_index.sql
-- Keep the unique constraint, drop the redundant index
DROP INDEX IF EXISTS idx_wishlists_user_product_unique;
-- The unique constraint `wishlists_user_id_product_id_key` already provides the index
```

✅ Applied in migration: `supabase/migrations/20251227000000_phase2_advisors_fixes_20251227.sql`

---

## 🏗️ Supabase SSR Architecture (Best Practices)

### Client Types (Already Implemented Correctly ✅)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Client Types                        │
├─────────────────────────────────────────────────────────────────┤
│  createClient()         │ Server Components, Server Actions     │
│  (lib/supabase/server)  │ Uses cookies() for auth               │
├─────────────────────────────────────────────────────────────────┤
│  createClient()         │ Client Components                     │
│  (lib/supabase/client)  │ Browser singleton, no cookies needed  │
├─────────────────────────────────────────────────────────────────┤
│  createRouteHandlerClient() │ API Routes (app/api/*)            │
│  (lib/supabase/server)      │ Request cookies, pending writes   │
├─────────────────────────────────────────────────────────────────┤
│  createStaticClient()   │ Cached/static data fetching           │
│  (lib/supabase/server)  │ No cookies, safe for 'use cache'     │
├─────────────────────────────────────────────────────────────────┤
│  createAdminClient()    │ Server-only, bypasses RLS             │
│  (lib/supabase/server)  │ Uses SERVICE_ROLE_KEY                 │
└─────────────────────────────────────────────────────────────────┘
```

### Middleware Flow (proxy.ts)

```
Request → i18n Routing → Geo Detection → updateSession() → Response
                                              │
                                              ├─ Creates Supabase client
                                              ├─ Calls getUser() (validates JWT!)
                                              ├─ Refreshes expired tokens
                                              ├─ Sets cookies on response
                                              └─ Redirects if unauthorized
```

### Critical Security Rule

```typescript
// ⚠️ NEVER trust getSession() on the server
// ✅ ALWAYS use getUser() to validate the JWT

// In middleware (already correct in lib/supabase/middleware.ts):
const { data: { user } } = await supabase.auth.getUser()

// This sends a request to Supabase Auth server to validate the token
// getSession() only reads from cookies without validation!
```

---

## 📝 RLS Policy Audit Checklist

### Pattern: All Policies Must Use `(select auth.uid())`

```sql
-- ✅ GOOD: Optimized (evaluates once per query)
USING ((select auth.uid()) = user_id)

-- ❌ BAD: Unoptimized (evaluates per row)  
USING (auth.uid() = user_id)
```

### Tables to Audit:

- [ ] `profiles` - User profiles
- [ ] `products` - Product listings
- [ ] `orders` - User orders
- [ ] `order_items` - Order line items
- [ ] `wishlists` - User wishlists
- [ ] `cart_items` - Shopping cart
- [ ] `reviews` - Product reviews
- [ ] `conversations` - Chat conversations
- [ ] `messages` - Chat messages
- [ ] `notifications` - User notifications
- [x] `notification_preferences` - **NEEDS FIX** (see above)

### SQL to Find Unoptimized Policies:

```sql
SELECT 
  schemaname, 
  tablename, 
  policyname,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND (
  (qual ~ 'auth\.uid\(\)' AND qual !~* 'select\s+auth\.uid\(\)')
  OR
  (with_check ~ 'auth\.uid\(\)' AND with_check !~* 'select\s+auth\.uid\(\)')
);
```

**Verification notes (via Dashboard + SQL):**
- ✅ `public` schema: 0 policies with bare `auth.uid()` (63 policies use the SELECT wrapper form)
- ✅ `storage.objects`: "Users can delete own images" no longer uses bare `auth.uid()`

---

## 🔐 Authentication Best Practices

### Email Templates (Bulgarian)

- [ ] Verify "Confirm signup" template is in Bulgarian
- [ ] Verify "Reset password" template is in Bulgarian  
- [ ] Verify "Magic link" template is in Bulgarian
- [ ] Update `{{ .SiteURL }}` references to use correct domain

### Auth Configuration Checklist:

- [ ] **Enable Leaked Password Protection** (currently DISABLED!)
- [ ] Set minimum password length (8+ recommended)
- [ ] Enable email confirmation for new signups
- [ ] Configure rate limiting for auth endpoints
- [ ] Review OAuth providers (if any)

### Session Management:

- [ ] Session lifetime configured appropriately
- [ ] Refresh token rotation enabled
- [ ] Secure cookie settings (`SameSite=Lax`, `Secure=true` in production)

---

## 💾 Caching Strategy

### For Auth-Dependent Data (User-Specific):

```typescript
// ✅ Use createClient() - reads from cookies
import { createClient } from '@/lib/supabase/server'

export default async function UserDashboard() {
  const supabase = await createClient()
  const { data } = await supabase.from('orders').select('*')
  // RLS ensures only user's orders are returned
}
```

### For Public/Static Data:

```typescript
// ✅ Use createStaticClient() - no cookies, cacheable
import { createStaticClient } from '@/lib/supabase/server'

// Can use Next.js caching
export const revalidate = 3600 // 1 hour

export default async function ProductPage() {
  const supabase = createStaticClient()
  const { data } = await supabase.from('products').select('*').eq('status', 'active')
}
```

### With `unstable_cache`:

```typescript
import { unstable_cache } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'

const getCachedCategories = unstable_cache(
  async () => {
    const supabase = createStaticClient()
    return supabase.from('categories').select('*').order('name')
  },
  ['categories'],
  { revalidate: 3600, tags: ['categories'] }
)
```

---

## 🗄️ Storage Security

### Bucket Configuration:

| Bucket | Public? | Use Case | RLS Required |
|--------|---------|----------|--------------|
| `avatars` | Yes | User profile photos | Upload by owner only |
| `products` | Yes | Product images | Upload by seller only |
| `documents` | No | Private user documents | Full RLS |

### Storage RLS Pattern:

```sql
-- Allow users to upload to their own folder
CREATE POLICY "Users upload own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Allow public read for avatars
CREATE POLICY "Avatars publicly readable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

---

## 🔎 How to Verify (Dashboard + SQL)

- **Security/Performance advisors:** Supabase Dashboard → Database → Advisors.
- **RLS policy performance:** use the `pg_policies` query in this doc to confirm there are no bare `auth.uid()` usages.
- **Migrations applied:** Supabase Dashboard → Database → Migrations (or `supabase db push` if you use the CLI).

---

## 🛠️ MCP Commands Reference (AI-Agent Workflow)

If you’re using an AI agent with Supabase MCP enabled, these calls let the agent pull advisor status and project metadata directly:

```bash
mcp_supabase_get_advisors({ type: "security" })
mcp_supabase_get_advisors({ type: "performance" })
mcp_supabase_list_tables({ schemas: ["public"] })
mcp_supabase_generate_typescript_types()
mcp_supabase_get_project_url()
mcp_supabase_get_publishable_keys()
```

---

## ✅ Phase 2 Completion Checklist

### Security (Required Before Launch)
- [x] Fix `set_notification_preferences_updated_at` search_path
- [ ] Enable Leaked Password Protection in Dashboard
- [x] Audit all RLS policies for `(select auth.uid())` pattern (verified via `pg_policies` scan)
- [x] Verify storage bucket policies (verified; delete policy optimized)

### Performance (Recommended)
- [x] Add index on `cart_items.product_id`
- [x] Remove duplicate `wishlists` index
- [x] Fix `notification_preferences` RLS policies
- [ ] Review unused indexes (post-launch cleanup)

### Auth Flows (E2E Test)
- [ ] Email signup + confirmation
- [ ] Email login
- [ ] Password reset
- [ ] OAuth (if configured)
- [ ] Session refresh across tabs
- [ ] Sign out (all sessions)

### Client Implementation (Already ✅)
- [x] `@supabase/ssr` package used
- [x] `getAll()`/`setAll()` cookie pattern
- [x] Middleware calls `getUser()` 
- [x] Separate clients for server/browser/admin
- [x] Auth callback with `exchangeCodeForSession`

---

## 📊 Current Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Security advisors | 0 | 1 | 🔴 Needs dashboard action |
| Performance advisors | 0 critical | 0 warns, 60+ info | 🟡 Review needed |
| SSR implementation | Best practices | Correct | ✅ |
| RLS coverage | 100% | 100% (0 bare `auth.uid()` in policies) | ✅ |

---

## 🔗 Resources

- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [RLS Performance](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)
- [Password Security](https://supabase.com/docs/guides/auth/password-security)
- [@supabase/ssr Package](https://www.npmjs.com/package/@supabase/ssr)
- [Database Linter Docs](https://supabase.com/docs/guides/database/database-linter)

---

## 🏁 Next Steps

1. **Immediate:** Apply security fixes (search_path, leaked password protection)
2. **This Week:** Audit and fix all RLS policies
3. **Before Launch:** Run full E2E auth flow tests
4. **Post-Launch:** Review and clean up unused indexes

→ Proceed to [Phase 3: Tailwind CSS](./03-tailwind.md)
