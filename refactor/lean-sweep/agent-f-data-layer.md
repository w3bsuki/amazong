# Phase F — Data Layer & Caching

> **Scope:** Add caching to read-heavy fetchers. Move client data to server. Fix Supabase client usage.
> **Read `refactor/shared-rules.md` first.**
> **Read `ARCHITECTURE.md` §2 (Supabase Clients) and §4 (Caching Patterns).**

---

## Step 1: Add `"use cache"` to read-heavy fetchers

### Find all data fetchers:
```bash
grep -rn "\.from(" lib/data/ --include="*.ts"
grep -rn "supabase\." lib/data/ --include="*.ts" -l
```

### Classify each:

| Function | Cache? | Profile | Why |
|----------|--------|---------|-----|
| `getCategories()` | Yes | `"categories"` | Public, rarely changes |
| `getProducts()` | Yes | `"products"` | Public listings |
| `getPlans()` | Yes | `"categories"` (long) | Plans rarely change |
| `getProfile()` | **No** | — | User-specific |
| `getProductPage()` | Yes | `"products"` | Public product data |
| `getProductReviews()` | Yes | `"products"` | Public reviews |

### Apply pattern:
```ts
import { cacheLife, cacheTag } from "next/cache"
import { createStaticClient } from "@/lib/supabase/server"

async function getCategories() {
  "use cache"
  cacheLife("categories")
  cacheTag("categories")
  const supabase = createStaticClient()
  // ... existing query
}
```

**Critical:** When adding `"use cache"`, switch from `createClient()` → `createStaticClient()`.
`createStaticClient()` doesn't read cookies — required for cache safety.

### Verify invalidation exists:
```bash
grep -rn "revalidateTag" app/ lib/ --include="*.ts" --include="*.tsx"
```

If a cached fetcher's data gets written somewhere (product update, review submit) but no `revalidateTag` call exists → flag it (don't add revalidation yourself without understanding the full flow).

## Step 2: Move client-side data fetching to server

### Find client-side fetch patterns:
```bash
grep -rn "useEffect" app/ components/ --include="*.tsx" -l | xargs grep -l "fetch\|supabase" 2>/dev/null
grep -rn "createBrowserClient" components/ --include="*.tsx" -l
```

For each result, ask:
- Is this data available at render time? → Move to parent Server Component, pass as props
- Is it triggered by user interaction (search, pagination, load more)? → KEEP client-side
- Is it real-time (messages, notifications)? → KEEP client-side

### "Thin page" conversions

These pages render a client component that does all data fetching:

| Page | Client component | Server opportunity |
|------|-----------------|-------------------|
| `(main)/cart/page.tsx` | CartPageClient (349 L) | Cart items can be prefetched server-side |
| `(main)/wishlist/page.tsx` | WishlistPageClient | Wishlist items server-side |
| 5 × onboarding pages | Various *Client components | User data server-side |

For cart and wishlist: if the client component reads from localStorage/context (client state), server prefetch may not help. Read the component to determine.

For onboarding: the 5 separate pages could potentially be consolidated into fewer pages with server-side data loading.

## Step 3: Verify Supabase client correctness

```bash
# Server components using browser client (WRONG):
grep -rn "createBrowserClient" app/ --include="*.tsx" -l | while read f; do grep -L '"use client"' "$f" 2>/dev/null; done

# Route handlers not using route handler client:
grep -rn "createClient()" app/api/ --include="*.ts"

# Server actions using browser client (WRONG):
grep -rn "createBrowserClient" app/actions/ --include="*.ts"
```

Fix any mismatches per the mapping in `ARCHITECTURE.md` §2.

## DON'T TOUCH
- `lib/auth/` queries
- Stripe webhook handler queries
- `lib/supabase/server.ts` or `lib/supabase/client.ts` (the factories themselves)
- `lib/supabase/database.types.ts` (auto-generated)

## Verification

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

## Output

Log in `refactor/lean-sweep/extractions.md`:
- Functions with `"use cache"` added (list + cache profile)
- `createClient()` → `createStaticClient()` conversions (list)
- Client→server data migrations (list)
- Supabase client mismatches fixed (list)
- Missing cache invalidation points flagged
