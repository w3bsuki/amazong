# Domain 6 — lib/ + hooks/ + app/actions/ + app/api/

> **lib/ 79f/12.3K · hooks/ 14f/2.2K · app/actions/ 27f/5K · app/api/ 49f/6.8K**
> **Combined: 169 files · 26,310 LOC**
> **Read `refactor/shared-rules.md` first.**

---

## Scope

The backend/infrastructure layer: data fetching, utilities, server actions, API routes, hooks.

## lib/ (79 files · 12,336 LOC)

### Oversized files:
- `lib/auth/business.ts` (1,154L) — **the single largest non-generated source file**
  - ⚠️ Auth internals — audit for split opportunities but **do not change auth logic**
  - Can types, helpers, and main logic be separated?
- `lib/data/categories.ts` (759L) — data layer
- `lib/data/products.ts` (614L) — data layer
- `lib/supabase/database.types.ts` (3,113L) — SKIP, auto-generated

### Sub-areas to audit:
```bash
# List lib/ subdirectories with counts
Get-ChildItem -Directory -LiteralPath lib | ForEach-Object { ... }
```
- `lib/data/` — all data fetching functions. Are there dead fetchers? Duplicates?
- `lib/auth/` — ⚠️ audit only for `business.ts` split, don't touch auth logic
- `lib/supabase/` — client factories. Skip `database.types.ts`.
- `lib/utils/`, `lib/types/`, etc. — scattered small files, merge candidates?

### Cache audit (Phase F continuation):
- Which `lib/data/` fetchers have `"use cache"`? Which should but don't?
- Are cached fetchers using `createStaticClient()` correctly?
- Missing `revalidateTag()` calls for cached data that gets mutated?

## hooks/ (14 files · 2,200 LOC)

- `use-home-discovery-feed.ts` (406L) — oversized
- Are all 14 hooks actually used by 2+ route groups? (That's the rule for hooks/)
- Dead hook scan:
  ```bash
  # For each hook, count importers
  for file in hooks/*.ts; do echo "$(grep -rn "$file" app/ components/ --include="*.ts" --include="*.tsx" -l | wc -l) $file"; done
  ```

## app/actions/ (27 files · 4,995 LOC)

### requireAuth() migration:
These still use raw `getUser()`:
- `blocked-users.ts` (85L)
- `boosts.ts` (294L)
- `onboarding.ts` (178L)
- `payments.ts` (160L) — ⚠️ payment-adjacent, migrate auth only
- `profile.ts` (467L) — oversized, migrate + split
- `reviews.ts` (283L)
- `seller-feedback.ts` (262L)
- `seller-follows.ts` (69L)
- `subscriptions.ts` (474L) — oversized, migrate + split

### Oversized action files:
- `profile.ts` (467L) → split reads vs mutations
- `subscriptions.ts` (474L) → split reads vs mutations
- `buyer-feedback.ts` (414L) → audit for split

### Barrel files:
- `orders.ts` (6L), `products.ts` (6L), `username.ts` (4L) — barrel re-exports
- Are these barrels still needed? Or can consumers import directly?

## app/api/ (49 files · 6,824 LOC)

### Route handler audit:
- `app/api/admin/docs/seed/templates.ts` (1,494L) — data file, SKIP
- Webhook handlers: audit for `constructEvent()` + idempotency
  - ⚠️ Don't modify webhook logic — audit and document only
- Dead API routes: any routes that nothing calls?
- Oversized route handlers?

## Refactor Targets

### Execute:
- Split `lib/data/categories.ts` (759L) and `lib/data/products.ts` (614L)
- Split `app/actions/profile.ts` (467L) and `subscriptions.ts` (474L)
- Migrate 8 action files from `getUser()` → `requireAuth()`
- Merge tiny lib/ files into their consumers
- Delete dead hooks (if any used by <2 route groups → move to the one consumer's local hooks)
- Remove unnecessary barrel files

### Audit only (document, don't modify):
- `lib/auth/business.ts` (1,154L) — document split plan for human approval
- Webhook handlers — document `constructEvent()` + idempotency status
- `app/actions/payments.ts` — migrate auth pattern only, don't touch Stripe logic

## DON'T TOUCH
- `lib/auth/` logic (except documenting `business.ts` split opportunity)
- `lib/supabase/server.ts`, `client.ts` (factories)
- `lib/supabase/database.types.ts` (generated)
- Webhook signature verification
- Stripe payment/Connect logic

## Verification
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```
