# Phase 3 — Agent 1: Caching

> **Scope:** Add `"use cache"` + `cacheLife()` + `cacheTag()` to read-heavy data fetchers.
> **Read `refactor/shared-rules.md` first.**

---

## Context

Next.js 16 supports `"use cache"` directive for server-side data caching. The project already defines cache profiles in `next.config.ts`. Most data fetchers currently re-fetch on every request — read-heavy public data should be cached.

## How to Work

### Step 1: Find all data-fetching functions

```bash
grep -rn "\.from(" lib/data/ app/actions/ --include="*.ts" --include="*.tsx"
grep -rn "supabase\." lib/data/ --include="*.ts"
```

Also look in:
- `lib/data/` — primary data layer
- `app/[locale]/**/page.tsx` — inline queries in pages
- `app/actions/` — server actions (read operations)

### Step 2: Classify each fetcher

| Type | Cache? | Profile |
|------|--------|---------|
| Public product listings | Yes | `"products"` (1 min stale, 5 min revalidate) |
| Category tree/list | Yes | `"categories"` (5 min stale, 1 hour revalidate) |
| Public seller profiles | Yes | `"user"` (5 min stale) |
| Deals/promotions | Yes | `"deals"` (30 sec stale) |
| User-specific data (cart, orders, settings) | **No** — per-user, changes frequently | — |
| Write operations (create, update, delete) | **No** — mutations | — |
| Auth-gated reads (my orders, my listings) | **No** — per-user | — |

### Step 3: Add caching to eligible fetchers

```ts
import { cacheLife, cacheTag } from "next/cache"

async function getProducts(filters: Filters) {
  "use cache"
  cacheLife("products")
  cacheTag("products", `products-${filters.category}`)
  // ... existing query
}
```

**Important:** Cached functions must use `createStaticClient()` not `createClient()`. If the function currently uses `createClient()`, switch it to `createStaticClient()` when adding cache. `createStaticClient()` is the Supabase client for cached/static reads — it doesn't depend on per-request cookies.

### Step 4: Verify cache invalidation

For every cached fetcher, check: is there a corresponding write operation that should invalidate this cache? Look for:
```bash
grep -rn "revalidateTag" app/ lib/ --include="*.ts" --include="*.tsx"
```

If a product is updated but `revalidateTag("products")` isn't called in the update action — flag it. Don't add revalidation yourself if you're unsure of the trigger flow.

## Special Notes

- **DON'T cache** anything in `lib/auth/`, payment flows, or webhook handlers.
- **DON'T cache** user-specific data — anything that reads from `auth.getUser()` shouldn't be cached with `"use cache"`.
- If a function mixes public data + user data, consider splitting it: cached public fetcher + uncached user-specific part.
- Read the existing cache profiles in `next.config.ts` before creating new ones. Use existing profiles when they fit.

## Verification

See root `AGENTS.md` § Verify.

## Output

- Functions with `"use cache"` added (list + which cache profile)
- `createClient()` → `createStaticClient()` conversions (list)
- Missing cache invalidation points flagged
- Functions intentionally left uncached (brief reason)
