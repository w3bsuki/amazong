# 05 — Supabase: Current State

---

## Client Selection (4 clients)

| Client | Location | Cookies | RLS | Use Case |
|--------|----------|---------|-----|----------|
| `createClient()` | `lib/supabase/server.ts` | Yes (next/headers) | Respects | User-specific Server Components/Actions |
| `createStaticClient()` | `lib/supabase/server.ts` | None | Anon-only | Cached queries (`"use cache"`) |
| `createAdminClient()` | `lib/supabase/server.ts` | None | Bypasses | Service-role after trust verification |
| `createBrowserClient()` | `lib/supabase/client.ts` | Auto | Respects | Client Components (singleton) |

Additional: `createRouteHandlerClient(req)` for route handlers with pending cookies.

---

## Typing Issues

### `as unknown as` casts in Supabase code: 13 occurrences

| File | Casts | Root Cause |
|------|-------|------------|
| `sell-persistence.ts` | 3 | `.select()` returns generic that doesn't match app type |
| `search-products.ts` (2 files) | 3 | Same — Supabase generic ≠ app Product type |
| `product-page.ts` | 1 | Product detail query |
| `product-reviews.ts` | 1 | Review query |
| `categories.ts` (sell) | 1 | Category hierarchy |
| `products/count/route.ts` | 1 | Count query type mismatch |
| `products/newest/route.ts` | 1 | Newest products query |
| `badges/feature/route.ts` | 2 | Badge evaluation |

**Root cause:** Supabase's `.select("col1, col2")` returns a generic type based on `Database` schema, but app code expects narrower/transformed types. Developers bridge the gap with `as unknown as`.

---

## Query Patterns

### Repeated Visibility Filter
`status.eq.active,status.is.null` appears in **7 files**:
- `lib/data/products/queries.ts`
- `search/_lib/search-products.ts`
- `search/_lib/search-sellers.ts`
- `products/newest/route.ts`
- `products/feed/route.ts`
- `products/search/route.ts`
- `products/count/route.ts`

This is a migration-era fallback — `status.is.null` catches products without a status column value.

### Migration Fallbacks
`isMissingBrowseableColumnError` — duplicated in 2 files:
- `lib/data/categories/hierarchy.ts` (defined at L20-26)
- `app/api/categories/[slug]/children/route.ts` (defined at L35-41)

Both check error code `42703` + `"is_browseable"` — a compat shim for pre-migration databases.

### Select Patterns
No `select('*')` in hot paths (enforced by architecture tests).
Select strings are scattered — same column sets repeated across files.

---

## Data Layer Organization

```
lib/data/
├── categories.ts            ← Category queries
├── categories/              ← Category hierarchy, helpers
├── category-attributes.ts   ← Attribute queries
├── plans.ts                 ← Subscription plan queries
├── product-page.ts          ← Single product detail
├── product-reviews.ts       ← Review queries
├── products.ts              ← Product list queries
├── products/                ← Product sub-queries
├── profile-page.ts          ← Profile queries
└── search-products.ts       ← Search queries
```

Additional query logic lives in:
- `app/api/**/route.ts` — inline queries in API routes
- `app/[locale]/**/_lib/*.ts` — route-private query helpers
- `lib/supabase/messages.*.ts` — messaging queries

---

## Pain Points

1. **Type unsafety:** 13 `as unknown as` casts just for Supabase results
2. **Duplicated queries:** Visibility filter in 7 files, `isMissingBrowseableColumnError` in 2
3. **Migration fallbacks** should be removed post-MIG-001 completion
4. **Scattered selects:** Same column projections repeated without centralization
5. **No typed query helpers:** Every caller does `.select().eq().order()` inline
6. **Admin client usage** needs audit (acceptable but sensitive)
