# Amazong Development Guide
## A Comprehensive Guide to Professional Next.js 16 + Supabase Development

> **For Human Developers & AI Agents**
> This guide teaches you how to write production-quality code, avoid "AI slop," and work like professional developers.

---

## Table of Contents

1. [Understanding Your Architecture](#1-understanding-your-architecture)
2. [Monolith vs Microservices: What You Actually Have](#2-monolith-vs-microservices)
3. [Next.js 16 Best Practices](#3-nextjs-16-best-practices)
4. [Supabase Security & Performance](#4-supabase-security--performance)
5. [Codebase Organization](#5-codebase-organization)
6. [Agent Skills System](#6-agent-skills-system)
7. [The Anti-Slop Manifesto](#7-the-anti-slop-manifesto)
8. [Development Workflow](#8-development-workflow)
9. [Quick Reference](#9-quick-reference)

---

## 1. Understanding Your Architecture

### What You're Building

```
┌─────────────────────────────────────────────────────────────┐
│                    AMAZONG MARKETPLACE                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend        │  Next.js 16 (App Router) + React 19      │
│  Styling         │  Tailwind CSS v4 + shadcn/ui (Radix)     │
│  i18n            │  next-intl (en.json + bg.json)           │
│  Backend         │  Supabase (Postgres + Auth + Storage)    │
│  Payments        │  Stripe                                   │
│  Mobile          │  Capacitor (Android + iOS)               │
│  Testing         │  Vitest (unit) + Playwright (E2E)        │
└─────────────────────────────────────────────────────────────┘
```

### This is a Monolithic Application

Your app is **NOT** microservices. It's a **modular monolith** — and that's perfectly fine for your scale.

---

## 2. Monolith vs Microservices

### What Are Microservices?

Microservices = Many small, independent services that communicate over networks.

```
MICROSERVICES ARCHITECTURE (NOT YOUR APP):
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Users   │    │ Products │    │ Payments │
│ Service  │────│ Service  │────│ Service  │
│ (Node)   │    │ (Python) │    │ (Go)     │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     └───────────────┴───────────────┘
              ▼
     ┌──────────────────┐
     │   API Gateway    │
     └──────────────────┘
```

**When Microservices Make Sense:**
- 50+ developers on different teams
- Different parts need different scaling (e.g., video processing)
- Different parts need different languages/tech stacks
- You have dedicated DevOps teams

### What You Have: Modular Monolith

```
YOUR ARCHITECTURE:
┌─────────────────────────────────────────────────────────┐
│                   Next.js 16 App                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  app/[locale]/(buyer)   │ Buyer routes            │  │
│  │  app/[locale]/(seller)  │ Seller routes           │  │
│  │  app/[locale]/(admin)   │ Admin routes            │  │
│  ├───────────────────────────────────────────────────┤  │
│  │  lib/supabase           │ Database client         │  │
│  │  lib/stripe             │ Payment integration     │  │
│  │  lib/utils              │ Pure utilities          │  │
│  ├───────────────────────────────────────────────────┤  │
│  │  components/ui          │ Design system           │  │
│  │  components/common      │ Shared composites       │  │
│  │  hooks/                 │ Reusable hooks          │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                     Supabase                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Postgres │  │   Auth   │  │ Storage  │             │
│  │   + RLS  │  │          │  │          │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

**Why This is Right for You:**
- Single deployable unit (Vercel)
- Simpler debugging and testing
- No network overhead between "services"
- One database = transactional integrity
- Appropriate for your team size

### The Key Insight

> **You don't need microservices. You need modular code.**

Modularity means:
- Clear boundaries between features
- Files/folders that own their domain
- No spaghetti imports across route groups
- Easy to test in isolation

---

## 3. Next.js 16 Best Practices

### Cache Components (Your Secret Weapon)

Next.js 16 introduces **Cache Components** with the `'use cache'` directive. This is configured in your `next.config.ts`:

```typescript
// next.config.ts
const config = {
  experimental: {
    cacheComponents: true,
  },
  cacheLife: {
    seconds: { stale: 60, revalidate: 1, expire: 60 },
    hours: { stale: 3600, revalidate: 60, expire: 3600 },
    days: { stale: 86400, revalidate: 3600, expire: 86400 },
    max: { stale: 2592000, revalidate: 86400, expire: 2592000 },
  },
}
```

### Four Caching Mechanisms

| Mechanism | What it Caches | Where | Purpose |
|-----------|---------------|-------|---------|
| **Request Memoization** | Return values of functions | Server | Dedupe same request in render tree |
| **Data Cache** | Fetch responses | Server | Persist data across requests |
| **Full Route Cache** | HTML + RSC Payload | Server | Reduce rendering cost |
| **Router Cache** | RSC Payload | Client | Reduce server requests on navigation |

### Using `'use cache'` Correctly

```typescript
// ✅ CORRECT: Cacheable server function
async function getProducts(categoryId: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`products-${categoryId}`)
  
  const supabase = createStaticClient() // NO cookies!
  const { data } = await supabase
    .from('products')
    .select('id, name, price, image_url') // Selective fields
    .eq('category_id', categoryId)
    .eq('status', 'active')
  
  return data
}
```

```typescript
// ❌ WRONG: Using cookies/headers inside cached function
async function getProducts() {
  'use cache' // This won't cache properly!
  cacheLife('hours')
  
  const supabase = createClient() // Uses cookies - DYNAMIC!
  // ...
}
```

### Cache Life Profiles

```typescript
// Short-lived: Prices, inventory (could change frequently)
cacheLife('seconds')  // stale: 60s, revalidate: 1s

// Medium: Product listings, search results
cacheLife('hours')    // stale: 1h, revalidate: 60s

// Long: Category structure, static content
cacheLife('days')     // stale: 24h, revalidate: 1h

// Very long: Rarely changing reference data
cacheLife('max')      // stale: 30d, revalidate: 24h
```

### Cache Invalidation

```typescript
// Invalidate specific cache tags
import { revalidateTag } from 'next/cache'

// In a Server Action after product update:
export async function updateProduct(id: string, data: ProductData) {
  'use server'
  
  // Update in database...
  await supabase.from('products').update(data).eq('id', id)
  
  // Invalidate the cache
  revalidateTag(`product-${id}`, 'max')
  revalidateTag(`products-${data.category_id}`, 'max')
}
```

### The Golden Rules of Next.js 16 Caching

1. **Always pair `'use cache'` with `cacheLife()`**
2. **Use `cacheTag()` for granular invalidation**
3. **Never use `cookies()`/`headers()` inside cached functions**
4. **Use `createStaticClient()` for cached reads**
5. **Add `generateStaticParams()` for known dynamic routes**

---

## 4. Supabase Security & Performance

### Client Selection Rules

```typescript
// lib/supabase/server.ts

// 1. Server Components / Server Actions (user-specific data)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// 2. Cached/public reads (NO cookies - safe for 'use cache')
import { createStaticClient } from '@/lib/supabase/server'
const supabase = createStaticClient()

// 3. Route Handlers
import { createRouteHandlerClient } from '@/lib/supabase/server'
const supabase = createRouteHandlerClient()

// 4. Admin operations (bypass RLS - SERVER ONLY!)
import { createAdminClient } from '@/lib/supabase/server'
const supabase = createAdminClient() // DANGEROUS - use sparingly
```

### Row Level Security (RLS) Best Practices

RLS policies are like adding a `WHERE` clause to every query automatically.

```sql
-- ✅ GOOD: Use (select auth.uid()) for performance
create policy "Users can view own orders"
on orders for select
to authenticated
using ((select auth.uid()) = user_id);

-- ❌ BAD: auth.uid() without select (evaluates per row)
create policy "Users can view own orders"
on orders for select
to authenticated
using (auth.uid() = user_id);
```

### RLS Policy Patterns

```sql
-- PUBLIC READ (anyone can see)
create policy "Public products visible to all"
on products for select
to anon, authenticated
using (status = 'active');

-- OWNER READ (only owner sees)
create policy "Users view own cart"
on cart_items for select
to authenticated
using ((select auth.uid()) = user_id);

-- OWNER WRITE (only owner modifies)
create policy "Users update own profile"
on profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- ROLE-BASED (seller can manage their products)
create policy "Sellers manage own products"
on products for all
to authenticated
using (
  exists (
    select 1 from seller_profiles
    where seller_profiles.user_id = (select auth.uid())
    and seller_profiles.id = products.seller_id
  )
);
```

### Performance Anti-Patterns

```typescript
// ❌ BAD: select('*') fetches all columns
const { data } = await supabase
  .from('products')
  .select('*')

// ✅ GOOD: Only select what you need
const { data } = await supabase
  .from('products')
  .select('id, name, price, image_url')

// ❌ BAD: Deep nested joins
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    user:users(*),
    items:order_items(
      *,
      product:products(
        *,
        category:categories(
          *,
          parent:categories(*)
        )
      )
    )
  `)

// ✅ GOOD: Flat queries + dedicated RPCs for complex data
const { data } = await supabase
  .from('orders')
  .select('id, status, total, created_at, user_id')
  .eq('user_id', userId)

// Then call RPC for breadcrumbs if needed
const { data: breadcrumbs } = await supabase
  .rpc('get_category_breadcrumbs', { category_id: categoryId })
```

### Security Checklist

- [ ] RLS enabled on ALL public tables
- [ ] Use `getUser()` not `getSession()` in middleware
- [ ] Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- [ ] Run `mcp_supabase_get_advisors({ type: "security" })` regularly
- [ ] Test RLS policies with different user roles

---

## 5. Codebase Organization

### Boundary Rules (Enforced by ESLint)

```
app/[locale]/(group)/**/_components/**  ← Route-owned (PRIVATE)
app/[locale]/(group)/**/_actions/**     ← Route-owned (PRIVATE)
app/[locale]/(group)/**/_lib/**         ← Route-owned (PRIVATE)

components/ui/**       ← Primitives only (shadcn-style)
components/common/**   ← Shared composites
components/layout/**   ← Shells (headers/nav/sidebars)
components/providers/**← React contexts

hooks/**               ← Reusable hooks
lib/**                 ← Pure utilities (NO app imports!)
```

### Import Rules

```typescript
// ✅ ALLOWED
import { Button } from '@/components/ui/button'      // UI primitives anywhere
import { formatPrice } from '@/lib/utils/format'     // Utils anywhere
import { useCart } from '@/hooks/use-cart'           // Hooks in components

// ❌ FORBIDDEN
import { ProductCard } from '@/app/[locale]/(buyer)/products/_components/product-card'
// Private route components should NOT be imported elsewhere!

// ❌ FORBIDDEN
import { supabase } from '@/lib/supabase/server'
// in lib/** - lib should NOT import from app-specific code
```

### File Naming Convention

```
kebab-case.tsx          ← Components, hooks, utils
SCREAMING-CASE.md       ← Documentation
snake_case.sql          ← SQL migrations
```

---

## 6. Agent Skills System

### Available Skills

You have three specialized skills triggered by prefixes:

| Prefix | Skill | Purpose |
|--------|-------|---------|
| `TREIDO:` | treido-dev | Daily development tasks |
| `SUPABASE:` | supabase-audit | Database RLS/perf audit |
| `TAILWIND:` | tailwind-audit | UI token/theme audit |

### TREIDO: Development Workflow

```
1. Read TODO.md
2. Pick ONE item
3. Size check:
   - Tiny: 1 file, <50 lines
   - Small: 1-3 files, <200 lines total
   - Medium: 3-5 files (NEEDS splitting plan)
   - Too Big: Reject, ask for breakdown

4. Make changes
5. Run gates:
   - pnpm -s exec tsc -p tsconfig.json --noEmit
   - REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

6. Done
```

### SUPABASE: Audit Commands

```typescript
// Check for security issues
mcp_supabase_get_advisors({ type: "security" })

// Check for performance issues
mcp_supabase_get_advisors({ type: "performance" })

// List all tables
mcp_supabase_list_tables({ schemas: ["public"] })

// Execute read-only query
mcp_supabase_execute_sql({ query: "SELECT ..." })

// Apply DDL migration
mcp_supabase_apply_migration({ name: "add_index_xyz", query: "CREATE INDEX..." })
```

### TAILWIND: Audit Targets

Anti-patterns to flag:
- Gradients (❌ `bg-gradient-to-r`)
- Arbitrary values (❌ `h-[42px]`, `text-[13px]`)
- Hardcoded colors (❌ `text-blue-500` instead of semantic tokens)

---

## 7. The Anti-Slop Manifesto

### What is "AI Slop"?

AI slop = Code that:
- Compiles but doesn't make sense
- Over-engineers simple problems
- Ignores existing patterns in the codebase
- Creates new abstractions unnecessarily
- Is verbose when concise code exists
- Doesn't match the project's style

### Rules to Avoid AI Slop

#### 1. Read Before Writing
```
❌ "I'll create a new utility function for..."
✅ "Let me check if this utility already exists..."
```

#### 2. Match Existing Patterns
```typescript
// If codebase uses this pattern:
const { data, error } = await supabase.from('products').select('...')
if (error) throw error
return data

// DON'T introduce:
try {
  const response = await supabase.from('products').select('...')
  if (response.error) {
    console.error('Database error:', response.error)
    return { success: false, error: response.error }
  }
  return { success: true, data: response.data }
} catch (e) {
  console.error('Unexpected error:', e)
  return { success: false, error: e }
}
```

#### 3. Small Changes Only
```
MAX 1-3 files per change
MAX 200 lines total
If bigger → split into multiple PRs
```

#### 4. No New Abstractions Without Permission
```
❌ "I'll create a custom hook wrapper for..."
❌ "Let me add a new provider for..."
❌ "I'll refactor this into a factory pattern..."

✅ Use what exists
✅ Modify existing code
✅ Ask before creating new patterns
```

#### 5. Preserve Behavior and Styling
```
Refactors must:
- Pass existing tests
- Look identical in browser
- Not change public APIs
```

#### 6. Delete > Reorganize
```
❌ Moving files to "better" folder structures
✅ Deleting dead code
```

### Code Quality Checklist

Before every commit:
- [ ] Does this match existing patterns?
- [ ] Is this the simplest solution?
- [ ] Did I check for existing utilities?
- [ ] Am I adding unnecessary abstractions?
- [ ] Would a senior developer approve this?
- [ ] Did I test in browser?

---

## 8. Development Workflow

### Daily Flow

```
Morning:
1. Read TODO.md
2. Check for errors: pnpm -s exec tsc -p tsconfig.json --noEmit
3. Pick ONE task

During work:
1. Make small changes
2. Test in browser
3. Run typecheck
4. Commit frequently

Before PR:
1. Run full gates
2. Check for errors
3. Self-review diff
```

### Gates (Run Before Every PR)

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke (with existing server)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# Unit tests (if touching data/utils)
pnpm test:unit
```

### VS Code Tasks Available

| Task | Purpose |
|------|---------|
| `Typecheck (tsc --noEmit)` | Type validation |
| `E2E Smoke (reuse existing server)` | Quick E2E sanity |
| `Unit Tests (pnpm test:unit)` | Unit test suite |
| `Dev Server (pnpm dev)` | Start development |
| `Scan Tailwind palette/gradients` | Design audit |

### Git Workflow

```bash
# Feature branch naming
feature/add-cart-button
fix/product-price-display
refactor/simplify-checkout

# Commit message format
feat: add add-to-cart button on product page
fix: correct price display for discounted items
refactor: simplify checkout flow state management
```

---

## 9. Quick Reference

### Supabase Client Cheat Sheet

| Use Case | Client | Cookies? |
|----------|--------|----------|
| Server Component (user data) | `createClient()` | ✅ |
| Cached public data | `createStaticClient()` | ❌ |
| Route Handler | `createRouteHandlerClient()` | ✅ |
| Admin/bypass RLS | `createAdminClient()` | ❌ |

### Caching Cheat Sheet

| Scenario | Cache Life | Tags |
|----------|------------|------|
| Product list | `'hours'` | `products-{category}` |
| Single product | `'days'` | `product-{id}` |
| Category tree | `'days'` | `categories` |
| User cart | ❌ No cache | N/A |
| Checkout | ❌ No cache | N/A |

### File Location Cheat Sheet

| What | Where |
|------|-------|
| Page route | `app/[locale]/(group)/[route]/page.tsx` |
| Private component | `app/[locale]/(group)/[route]/_components/` |
| Server action | `app/[locale]/(group)/[route]/_actions/` |
| Shared UI primitive | `components/ui/` |
| Shared composite | `components/common/` |
| Reusable hook | `hooks/` |
| Pure utility | `lib/utils/` |
| Supabase client | `lib/supabase/` |

### Common Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| `select('*')` | `select('id, name, price')` |
| `auth.uid() = user_id` | `(select auth.uid()) = user_id` |
| Deep nested joins | Flat queries + RPCs |
| Gradients | Flat colors |
| `h-[42px]` | `h-10` or `h-11` |
| New provider per feature | Use existing providers |
| "Refactor everything" | Small, targeted changes |

---

## Summary

### Key Takeaways

1. **You have a modular monolith** — this is correct for your scale
2. **Use Next.js 16 caching** — `'use cache'` + `cacheLife()` + `cacheTag()`
3. **Supabase security first** — RLS on everything, `(select auth.uid())` pattern
4. **Small changes only** — 1-3 files, max 200 lines
5. **Match existing patterns** — don't invent new abstractions
6. **Run gates always** — typecheck + E2E smoke before every PR

### When to Ask for Help

- Task requires more than 5 files
- Need to change architectural patterns
- Touching auth/payments/security
- Unsure about existing patterns
- Performance optimization needed

---

> *"The best code is no code. The second best is simple code."*
