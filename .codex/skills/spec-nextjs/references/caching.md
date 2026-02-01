# Caching (Treido: Next.js 16 Cache Components)

Treido uses Next.js 16 Cache Components. Caching is powerful, but easy to misuse in ways that:
- break auth isolation
- cause stale data
- increase load (misses / revalidation storms)
- violate rails (cookies/headers inside cached work)

## Treido Caching Rules (SSOT)

Source of truth:
- `.codex/project/ARCHITECTURE.md`

Required rules:
- Use `"use cache"` only for cacheable server work.
- Always pair with `cacheLife("<profile>")`.
- Always use granular `cacheTag("<tag>")` (avoid broad tags).
- Never call `cookies()` / `headers()` inside cached functions.
- Invalidate with `revalidateTag(tag, profile)` (two args).

Cache profiles (current):
- `categories`
- `products`
- `deals`
- `user`

## What To Audit

### 1) Cached function anatomy

Smells:
- `"use cache"` without `cacheLife`
- `cacheLife` without at least one `cacheTag`
- a cached function that reads auth context (cookies/headers/session)
- caching data that is per-user or per-session

Fix patterns:
- Split into:
  - cached public read (no cookies/headers)
  - non-cached personalized read
- Tighten tags:
  - prefer `product:<id>` over `products`
  - prefer `category:<slug>` over `categories`

### 2) Tag/profile mismatch

Smells:
- invalidating `revalidateTag("products")` but cached function tags `product:<id>`
- using different profiles across the same tag (stale or over-invalidation)

Fix patterns:
- Choose a single canonical tag format per domain object.
- Co-locate tag generation in a helper to keep it consistent.

### 3) Request context hazards

Smells (high severity):
- `cookies()`/`headers()` directly inside cached function
- `createClient()` (session-bound Supabase client) inside cached function

Fix patterns:
- Use `createStaticClient()` for cached public reads (per `.codex/project/ARCHITECTURE.md`)
- If you must vary by locale or region, ensure it is part of cache key strategy and still avoids cookies/headers.

### 4) Over-caching / Under-caching

Over-caching smells:
- caching rapidly changing inventory/price data without a clear invalidation path
- caching data that depends on soft-deletes or user permissions

Under-caching smells:
- repeated identical public reads in hot Server Components (categories, static lists)
- missing `generateStaticParams` on hot segments leading to runtime work

Fix patterns:
- cache stable public lists with short, deliberate lifetimes
- ensure revalidate logic exists at mutation boundaries (server actions/webhooks)

## Grep Targets (High Signal)

- `"use cache"`
- `cacheLife(` / `cacheTag(`
- `revalidateTag(` / `revalidatePath(`
- `cookies(` / `headers(`
- `unstable_noStore` / `noStore` (if used)
- route segment configs: `export const revalidate`, `export const dynamic`

## Severity Guidance

- Critical:
  - cached function reads cookies/headers/auth
  - user data cached without per-user isolation
- High:
  - missing `cacheLife` or missing tags on cached work
  - invalidation mismatches (tag format drift)
- Medium/Low:
  - under-caching stable public reads
  - overly broad tags causing expensive invalidations

