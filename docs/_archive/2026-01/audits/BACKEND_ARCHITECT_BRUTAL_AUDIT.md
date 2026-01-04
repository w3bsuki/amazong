# Backend Architect Brutal Audit 🔥

> **Date:** January 3, 2026  
> **Auditor:** Backend Architect Agent (Next.js + Supabase + Stripe)  
> **Documentation Reference:** Context7 Next.js App Router + Supabase SSR Best Practices  
> **Scope:** Backend/Frontend alignment, over-engineering, API design, security, architecture

---

## Executive Summary: The Good, Bad, and Ugly

**Overall Grade: B-** (Functional but needs architectural discipline)

### 🟢 What's Actually Good
- Supabase client separation (`createClient`, `createStaticClient`, `createAdminClient`) is correct
- Server actions exist for mutations (correct pattern)
- RLS policies are comprehensive with `SELECT auth.uid()` optimization applied
- Cookie handling follows Supabase SSR best practices with `getAll`/`setAll`
- Migration cleanup in `20260101170000_cleanup_over_engineered_rpcs.sql` shows self-awareness

### 🔴 Critical Issues
1. **Duplicate Mutation Paths** - Same operation available via both API Route AND Server Action
2. **Client-Side Supabase Calls** - Direct DB access from React components bypassing server
3. **RPC Function Sprawl** - Unnecessary RPCs that should be direct queries
4. **Inconsistent Error Handling** - No unified error contract
5. **Schema/Action Duplication** - Same Zod schemas defined multiple times

### 🟡 Over-Engineering Sins
1. Product creation in 3 places (server action, API route, route action)
2. Cart managed via both localStorage AND Supabase RPC
3. Listing limits checked in 3 different ways
4. Auth patterns scattered across middleware, actions, and components

---

## Part 1: Backend/Frontend Alignment Failures

### 🚨 Issue #1: Duplicate Product Creation Endpoints

**Files:**
- [app/actions/products.ts](../app/actions/products.ts#L46) - `createProduct` server action
- [app/api/products/create/route.ts](../app/api/products/create/route.ts#L1) - POST route handler
- [app/[locale]/(sell)/_actions/sell.ts](../app/[locale]/(sell)/_actions/sell.ts#L24) - `createListing` action

**The Problem:**
```
Frontend → API Route POST /api/products/create  
Frontend → Server Action createProduct()
Frontend → Server Action createListing()

All three do THE SAME THING with DIFFERENT validation schemas.
```

**Evidence of Divergence:**

| Location | Schema Used | Listing Limit Check | Cache Invalidation |
|----------|-------------|---------------------|-------------------|
| `products.ts` | `productSchema` (local) | Via `subscription_plans.max_listings` | `revalidateTag("products")` |
| `create/route.ts` | `productSchema` (local, different) | Via `subscription_plans.max_listings` | None |
| `sell.ts` | `sellFormSchemaV4` (imported) | Via `subscriptions` table join | None |

**Context7 Best Practice:**
> "Server Actions are the recommended pattern for mutations in Next.js App Router. Route Handlers should only be used for webhooks, external API consumption, or legacy integration."

**Verdict:** OVER-ENGINEERED. Pick ONE mutation path and stick to it.

---

### 🚨 Issue #2: Client-Side Direct Database Access

**Files with `createClient` from `@/lib/supabase/client`:**
- [components/providers/cart-context.tsx](../components/providers/cart-context.tsx#L85)
- [components/providers/wishlist-context.tsx](../components/providers/wishlist-context.tsx#L93)
- [components/providers/message-context.tsx](../components/providers/message-context.tsx#L144)
- [components/dropdowns/notifications-dropdown.tsx](../components/dropdowns/notifications-dropdown.tsx#L146)
- [components/providers/onboarding-provider.tsx](../components/providers/onboarding-provider.tsx#L60)

**The Pattern (Cart Example):**
```typescript
// cart-context.tsx line 85-110
const loadServerCart = useCallback(async (activeUserId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("cart_items")
    .select(`...`)
    .eq("user_id", activeUserId)
  // ...
})
```

**Why This Is Bad:**
1. **RLS Bypass Risk** - Client queries trust the client to pass correct `user_id`
2. **Query Logic Duplication** - Same queries written in actions AND client
3. **No Server-Side Validation** - Mutations happen without server verification
4. **Bundle Size** - Supabase client shipped to browser unnecessarily

**Context7 Supabase Best Practice:**
> "Always add explicit filters to Supabase client queries (e.g., `.eq('user_id', userId)`) even with RLS, as this allows PostgreSQL to generate a more optimized query plan."

**BUT ALSO:**
> "Server Actions should handle mutations. Client-side Supabase is for realtime subscriptions and optimistic updates only."

**Verdict:** ARCHITECTURAL VIOLATION. Client should call server actions, not DB directly.

---

### 🚨 Issue #3: Cart System Dual-State Nightmare

**The Architecture:**
```
┌─────────────────────────────────────────────────────────────┐
│                      Cart System                             │
├─────────────────────────────────────────────────────────────┤
│  Guest User:                                                 │
│    localStorage → React State                               │
│                                                              │
│  Logged-in User:                                            │
│    localStorage → Sync to Supabase RPC → React State        │
│    PLUS                                                      │
│    Supabase cart_items → React State                        │
│                                                              │
│  On Login:                                                   │
│    localStorage → syncLocalCartToServer() → cart_add_item RPC│
│    THEN                                                      │
│    loadServerCart() → React State                           │
│    THEN                                                      │
│    localStorage.removeItem("cart")                          │
└─────────────────────────────────────────────────────────────┘
```

**Code Evidence:**
```typescript
// cart-context.tsx lines 158-188
const syncLocalCartToServer = useCallback(async (activeUserId: string) => {
  const savedCart = localStorage.getItem("cart")
  // ...
  for (const item of localItems) {
    const { error } = await supabase.rpc("cart_add_item", { ... })
  }
  localStorage.removeItem("cart")
})
```

**Problems:**
1. **Race Condition** - What if user adds item while sync is happening?
2. **Two Sources of Truth** - localStorage and Supabase can diverge
3. **No Offline Support** - If RPC fails, local cart is cleared anyway
4. **Unnecessary Complexity** - Server actions could handle all this

**Better Pattern:**
```typescript
// Server action handles everything
export async function syncCart(localItems: CartItem[]) {
  'use server'
  const supabase = await createClient()
  const { user } = await supabase.auth.getUser()
  if (!user) return { items: localItems, source: 'local' }
  
  // Atomic merge on server
  await supabase.from('cart_items').upsert(...)
  const { data } = await supabase.from('cart_items').select(...)
  return { items: data, source: 'server' }
}
```

---

## Part 2: Over-Engineering Hall of Shame

### 🎭 Shame #1: The Great Listing Limit Check

**Three Different Implementations:**

**Version 1 - `products.ts`:**
```typescript
const [productCountResult, planResult] = await Promise.all([
  supabaseUser.from("products").select("*", { count: "exact", head: true })...
  supabaseUser.from("subscription_plans").select("max_listings").eq("tier", profile.tier)
])
const maxListings = planResult.data?.max_listings ?? 5
```

**Version 2 - `create/route.ts`:**
```typescript
const [productCountResult, planResult] = await Promise.all([
  supabaseUser.from("products").select("*", { count: "exact", head: true })...
  supabaseUser.from("subscription_plans").select("max_listings").eq("tier", profile.tier)
])
const maxListings = planResult.data?.max_listings ?? 5
```

**Version 3 - `sell.ts`:**
```typescript
const [{ count: currentListings }, { data: subscription }] = await Promise.all([
  supabase.from("products").select("*", { count: "exact", head: true })...
  supabase.from("subscriptions").select("plan_type, subscription_plans!inner(max_listings)")
])
const subPlan = subscription?.subscription_plans as unknown
const maxListings = subPlan?.max_listings ?? 10  // NOTE: Different default!
```

**Notice:**
- Default is `5` in two places, `10` in another
- One checks `profile.tier`, others check `subscriptions` table
- Copy-paste with divergent evolution

**Solution:**
```typescript
// lib/auth/listing-limits.ts
export async function checkListingLimit(supabase: SupabaseClient, userId: string) {
  // Single source of truth
}
```

---

### 🎭 Shame #2: Zod Schema Sprawl

**Schema Definitions Found:**
1. `app/actions/products.ts` - `productSchema`
2. `app/api/products/create/route.ts` - `productSchema` (different!)
3. `lib/sell/schema-v4.ts` - `sellFormSchemaV4` (referenced)
4. `lib/validations/auth.ts` - auth schemas

**The `productSchema` in actions vs route:**

| Field | `actions/products.ts` | `api/products/create/route.ts` |
|-------|----------------------|-------------------------------|
| `title` | `min(1)` | `min(5)` |
| `images` | `z.array(z.string())` | `z.array(imageSchema)` with URL validation |
| `categoryId` | `z.string().optional()` | `uuidOrEmpty` custom transformer |
| `listPrice` | Not present | Complex union with transforms |

**Solution:**
```
lib/
  schemas/
    product.ts      ← Single source of truth
    auth.ts
    checkout.ts
```

---

### 🎭 Shame #3: The createRouteHandlerClient Dance

**Current Pattern:**
```typescript
// app/api/products/create/route.ts
const { supabase: supabaseUser, applyCookies } = createRouteHandlerClient(request)
// ... do stuff ...
return applyCookies(NextResponse.json({ error }, { status: 401 }))
```

**Why This Exists:**
From `lib/supabase/server.ts`:
```typescript
/**
 * Route Handler client (app/api/*) that reads cookies from the incoming request.
 *
 * IMPORTANT: In Cache Components mode, `next/headers`'s `cookies()` can reject during prerender.
 * Route handlers should not rely on it; use request cookies instead.
 */
```

**The Problem:**
This is a workaround for using Route Handlers when Server Actions would avoid the issue entirely.

**Context7 Next.js Best Practice:**
> "Server Actions eliminate the need for separate API endpoints. Use Route Handlers only for webhooks and external integrations."

---

## Part 3: API Contract Chaos

### Inconsistent Response Shapes

**Server Actions Return:**
```typescript
// products.ts
return { success: false, error: "message" }
return { success: true, data: { id: product.id } }

// orders.ts  
return { success: boolean; error?: string }

// sell.ts
return { success: true, id, sellerUsername, product: { id, slug } }
return { success: false, error, message?, issues?, upgradeRequired? }
```

**Route Handlers Return:**
```typescript
// api/products/create/route.ts
return NextResponse.json({ error: "Unauthorized - no user" }, { status: 401 })
return NextResponse.json({ product, remaining, maxListings })

// api/products/search/route.ts
return NextResponse.json({ products: [] })
return NextResponse.json({ error: message }, { status: 500 })
```

**No Unified Contract:**
- Sometimes `{ success, error }`, sometimes `{ error }` with status code
- No consistent pagination shape
- No versioning strategy
- `upgradeRequired` is business logic leaking into transport layer

**Solution: Unified Response Type:**
```typescript
// lib/api/response.ts
type ApiResponse<T> = 
  | { ok: true; data: T; meta?: { page?: number; total?: number } }
  | { ok: false; error: { code: string; message: string; details?: unknown } }
```

---

## Part 4: RLS & Security Review

### ✅ What's Right

**From `20251217000000_phase2_security_performance.sql`:**
```sql
-- Fix: Wrap auth.uid() in SELECT for performance
CREATE POLICY "Users can delete their own blocks" ON blocked_users
  FOR DELETE TO authenticated
  USING (blocker_id = (SELECT auth.uid()));
```

This follows Context7 Supabase best practice:
> "Wrap function calls with SELECT statements within RLS policies to allow the Postgres optimizer to cache results per-statement."

**Security Definer Functions Have search_path:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public  -- ✅ Correct!
```

### ⚠️ Concerns

**1. Admin Client Used in Module Scope:**
```typescript
// app/api/checkout/webhook/route.ts line 9
const supabase = createAdminClient()  // Module-level, not per-request!
```

This is fine for webhooks (they're stateless) but could cause issues if extended.

**2. Missing Rate Limiting:**
- No rate limiting on `/api/products/search`
- No rate limiting on auth endpoints
- Stripe webhooks have signature verification but no replay protection beyond idempotency

**3. getUser() Not Consistently Used:**

Context7 Supabase states:
> "Use `getUser()` for security. It validates the Auth token by contacting the Supabase Auth server."

Some places use `getSession()` which only decodes the JWT locally without verification.

---

## Part 5: RPC Functions Audit

### Remaining RPCs (After Cleanup)

| Function | Location Called | Purpose | Verdict |
|----------|-----------------|---------|---------|
| `get_shared_wishlist` | `wishlist/[token]/route.ts` | Public wishlist sharing | ✅ Keep (atomic read) |
| `increment_helpful_count` | `reviews.ts` | Atomic counter | ✅ Keep |
| `block_user` | `blocked-users.ts` | Security operation | ✅ Keep |
| `unblock_user` | `blocked-users.ts` | Security operation | ✅ Keep |
| `get_blocked_users` | `blocked-users.ts` | Security check | ⚠️ Could be direct query |
| `is_blocked_bidirectional` | `blocked-users.ts` | Security check | ✅ Keep (complex logic) |
| `cart_add_item` | `cart-context.tsx` | Cart merge | ⚠️ Should be server action |

**The `cart_add_item` Problem:**
Called from client-side React context, not server action. Should be:
```typescript
// Instead of: supabase.rpc("cart_add_item", ...)
// Use server action: await addToCart(productId, quantity)
```

---

## Part 6: Migration History Red Flags

### Over-Complexity Signals

```
20251201000000_seller_tiers_subscriptions.sql      ← Subscriptions v1
20251213000000_subscription_plans_enhanced.sql     ← Subscriptions v2 (3 days later)
20251214000001_complete_fee_structure.sql          ← More subscription changes
20251217000000_phase2_security_performance.sql     ← Security fixes
20251218000000_security_performance_audit_fixes.sql ← More security fixes (1 day later)
20251219000000_phase12_security_performance_audit.sql ← Even more
```

**Pattern:** Features added hastily, then immediate fix-up migrations.

**The Good:** `20260101170000_cleanup_over_engineered_rpcs.sql` shows self-awareness:
```sql
-- Best Practices Applied:
-- 1. Use native Supabase client methods instead of RPC wrappers
-- 2. Keep triggers and security-critical functions
-- 3. Remove functions that wrap simple queries
```

---

## Part 7: Refactoring Plan

### Priority 1: Consolidate Mutation Paths (Critical)

**Goal:** One way to mutate each entity

| Entity | Current Paths | Target Path |
|--------|--------------|-------------|
| Product Create | 3 (action + route + route-action) | 1 server action |
| Product Update | 2 (action + route) | 1 server action |
| Cart Operations | 2 (RPC + localStorage) | 1 server action |
| Auth | 2 (action + component) | 1 server action |

**Steps:**
1. Deprecate `app/api/products/create/route.ts` (keep for 30 days with warning header)
2. Merge `createProduct` and `createListing` into single `createListing` action
3. Move `sellFormSchemaV4` to shared location
4. Update all call sites to use unified action

**Estimated Effort:** 4-6 hours

---

### Priority 2: Remove Client-Side Database Calls (High)

**Goal:** All mutations go through server actions

**Files to Refactor:**
1. `cart-context.tsx` → Use server actions for add/remove/sync
2. `wishlist-context.tsx` → Use server actions for toggle/sync
3. `notifications-dropdown.tsx` → Use server action for mark-read
4. `message-context.tsx` → Keep realtime subscription, move mutations to actions

**Pattern:**
```typescript
// Before (client-side)
const supabase = createClient()
await supabase.from('cart_items').insert(...)

// After (server action)
const addToCart = async (productId: string, qty: number) => {
  'use server'
  const supabase = await createClient()
  const { user } = await supabase.auth.getUser()
  // Validated server-side mutation
}
```

**Estimated Effort:** 8-12 hours

---

### Priority 3: Unify Schemas (Medium)

**Goal:** Single schema per entity

**Structure:**
```
lib/
  schemas/
    product.ts       ← Merged from 3 locations
    auth.ts          ← Already exists
    checkout.ts      ← New
    index.ts         ← Barrel export
```

**Steps:**
1. Create `lib/schemas/product.ts` with unified schema
2. Add `createProductSchema` and `updateProductSchema` variants
3. Update all import sites
4. Delete duplicates

**Estimated Effort:** 2-3 hours

---

### Priority 4: Standardize Response Contract (Medium)

**Goal:** Consistent API response shape

**Implementation:**
```typescript
// lib/api/response.ts
export type ActionResult<T = void> = 
  | { ok: true; data: T }
  | { ok: false; error: ActionError }

export interface ActionError {
  code: string        // "LISTING_LIMIT_REACHED"
  message: string     // User-friendly message
  details?: unknown   // Validation errors, etc.
}

// Usage
export async function createProduct(input: ProductInput): Promise<ActionResult<{ id: string }>> {
  // ...
  return { ok: true, data: { id } }
  return { ok: false, error: { code: 'LIMIT_REACHED', message: '...' } }
}
```

**Estimated Effort:** 4-6 hours (including migration of existing actions)

---

### Priority 5: Cart Architecture Simplification (High)

**Goal:** Single source of truth for cart state

**New Architecture:**
```
┌─────────────────────────────────────────────────────────────┐
│                     Simplified Cart                          │
├─────────────────────────────────────────────────────────────┤
│  React State (items: CartItem[])                            │
│       ↑                                                      │
│       │ Server Action Response                              │
│       │                                                      │
│  Server Actions:                                            │
│    - getCart() → items from DB or localStorage cookie       │
│    - addToCart(productId, qty) → returns updated items      │
│    - removeFromCart(productId) → returns updated items      │
│    - syncCart(localItems) → merge and return server items   │
│                                                              │
│  On mount: getCart()                                        │
│  On login: syncCart(localItems)                             │
│  On mutation: optimistic update + server action             │
└─────────────────────────────────────────────────────────────┘
```

**Estimated Effort:** 6-8 hours

---

### Priority 6: Deprecate Unnecessary Route Handlers (Low)

**Route Handlers to Keep:**
- `/api/checkout/webhook` - Stripe webhook (external caller)
- `/api/auth/callback` - OAuth callback (external caller)
- `/api/subscriptions/webhook` - Stripe subscription webhook

**Route Handlers to Deprecate:**
- `/api/products/create` - Use server action
- `/api/stores` - Already deprecated, delete
- `/api/products/*` (search, feed, deals, etc.) - Consider RSC data fetching

**Steps:**
1. Add `X-Deprecated: true` header to deprecated routes
2. Log usage metrics for 2 weeks
3. Migrate remaining clients
4. Delete routes

**Estimated Effort:** 2-4 hours per route

---

## Part 8: Quick Wins (< 1 hour each)

### QW1: Fix Listing Limit Default Inconsistency
```typescript
// Change sell.ts line 77 from:
const maxListings = subPlan?.max_listings ?? 10
// To:
const maxListings = subPlan?.max_listings ?? 5  // Match other files
```

### QW2: Remove Dead `_seller` Variable
```typescript
// api/products/create/route.ts line 139-142
// This is assigned but never used:
const _seller = {
  id: profile.id,
  store_name: profile.display_name || profile.business_name || profile.username,
}
// DELETE IT
```

### QW3: Add Missing Cache Revalidation
```typescript
// api/products/create/route.ts - Add after successful insert:
revalidateTag("products")
revalidateTag(`seller-products-${user.id}`)
```

### QW4: Consistent getUser() Usage
Search for `getSession()` and replace with `getUser()` for security-critical paths.

---

## Appendix A: File Ownership Map

```
Backend Architect Owns:
├── app/actions/           ← Server mutations
├── app/api/               ← Webhooks only
├── lib/supabase/          ← Client configuration
├── lib/api/               ← Response helpers
├── lib/schemas/           ← Validation schemas (NEW)
├── supabase/migrations/   ← Database schema
└── middleware.entry.ts    ← Auth session handling

Frontend UI Owns:
├── components/            ← Should NOT import createClient directly
├── app/[locale]/          ← Page components
└── hooks/                 ← Client-side state

Shared:
├── lib/types/             ← TypeScript types
└── lib/utils.ts           ← Pure functions
```

---

## Appendix B: Migration Checklist

- [ ] Create `lib/schemas/product.ts` with unified schema
- [ ] Create `lib/api/response.ts` with `ActionResult<T>` type
- [ ] Refactor `app/actions/products.ts` to use new response type
- [ ] Deprecate `app/api/products/create/route.ts`
- [ ] Merge `createProduct` and `createListing` actions
- [ ] Create `lib/auth/listing-limits.ts` helper
- [ ] Refactor `cart-context.tsx` to use server actions
- [ ] Refactor `wishlist-context.tsx` to use server actions
- [ ] Add rate limiting to public API routes
- [ ] Document API contract in OpenAPI spec

---

## Conclusion

This codebase shows signs of rapid development with multiple contributors making similar decisions independently. The result is functional but over-engineered, with duplicated logic, inconsistent patterns, and architectural violations.

**The core issue:** Treating Route Handlers and Server Actions as interchangeable when they serve different purposes.

**The fix:** Establish clear boundaries:
- **Server Actions** = All authenticated mutations
- **Route Handlers** = Webhooks and external integrations only
- **Client Supabase** = Realtime subscriptions only

Follow this plan, and the backend becomes maintainable, consistent, and aligned with both Next.js and Supabase best practices.

---

*Audit completed by Backend Architect Agent | January 3, 2026*  
*Documentation sources: Context7 /websites/nextjs_app, /websites/supabase_com-docs*
