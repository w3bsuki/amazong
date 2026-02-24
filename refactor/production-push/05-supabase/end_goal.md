# 05 — Supabase: End Goal

---

## Client Selection (unchanged, already good)

Same 4 clients with strict selection rules. No changes needed — the architecture is correct.

---

## Typed Query Helpers

### Pattern: Centralized Select Strings + Type-Safe Mappers

```ts
// lib/supabase/selects/products.ts
export const PRODUCT_LIST_SELECT = `
  id, title, slug, price, currency, condition, status,
  images, category_id, seller_id,
  profiles!inner(username, avatar_url, display_name),
  categories!inner(name, slug)
` as const;

export type ProductListRow = /* inferred from Database type + select */;

// lib/data/products/queries.ts
import { PRODUCT_LIST_SELECT, type ProductListRow } from "@/lib/supabase/selects/products";

export async function getProducts(opts: ProductQueryOpts): Promise<ProductListRow[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT)
    .match(visibilityFilter())
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 20);

  if (error) throw error;
  return data; // TypeScript infers correctly — no cast needed
}
```

### Visibility Filter Helper

```ts
// lib/supabase/filters/visibility.ts
export function applyVisibilityFilter(query: SupabaseQuery) {
  return query.eq("status", "active");
  // Post MIG-001: remove the `.or("status.eq.active,status.is.null")` fallback
}
```

**One source of truth** for the visibility filter — used in all 7 files that currently duplicate it.

---

## Migration Fallback Removal (Post MIG-001)

### Delete
- `isMissingBrowseableColumnError()` from both files
- `status.is.null` fallback in all 7 files
- Any `is_browseable` compat code

### Requires
- MIG-001 Step 5 complete
- Human approval for any DB/schema changes
- Verification: all products have `status = 'active'` (no NULLs)

---

## Query Centralization

### Before (scattered)
```
app/api/products/newest/route.ts     → inline .select("...").eq("status", ...)
app/api/products/feed/route.ts       → inline .select("...").eq("status", ...)
app/api/products/search/route.ts     → inline .select("...").or("status.eq.active,...")
lib/data/products/queries.ts         → inline .select("...").or("status.eq.active,...")
```

### After (centralized)
```
lib/supabase/selects/products.ts     → PRODUCT_LIST_SELECT, PRODUCT_DETAIL_SELECT
lib/supabase/selects/categories.ts   → CATEGORY_TREE_SELECT, CATEGORY_LIST_SELECT
lib/supabase/filters/visibility.ts   → applyVisibilityFilter()
lib/data/products/queries.ts         → getProducts(), getProductById() (uses selects/filters)
app/api/products/*/route.ts          → calls lib/data functions (thin wrapper)
```

---

## Best Practices (from Supabase docs + context7)

### RLS Performance (from Supabase docs)
```ts
// Always add explicit filters even with RLS
// RLS acts as implicit WHERE, but explicit filters enable better query plans
const { data } = supabase
  .from('table')
  .select()
  .eq('user_id', userId) // ← 94.7% faster than RLS alone
```

### Auth Flow
```
User signs in → Supabase issues JWT → Client sends token → 
Postgres sets auth.uid() → RLS enforces access
```

Always use `getUser()` (server-verified), never `getSession()` (JWT-only).

---

## Acceptance Criteria

- [ ] Centralized select strings in `lib/supabase/selects/`
- [ ] Visibility filter helper in `lib/supabase/filters/`
- [ ] `as unknown as` casts reduced from 13 → <3 in Supabase code
- [ ] Post-MIG-001: `isMissingBrowseableColumnError` deleted
- [ ] Post-MIG-001: `status.is.null` fallback deleted
- [ ] No inline `.select("...")` strings in API routes (use lib/data helpers)
- [ ] No `select('*')` (maintained via architecture test)
- [ ] `createAdminClient()` usage audited and documented
