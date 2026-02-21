# Domain 1 — (account) Route Group

> **92 files · 16,782 LOC** — the single largest route group.
> **Read `refactor/shared-rules.md` first.**

---

## Scope

Everything under `app/[locale]/(account)/`. Includes: orders (12f/2.9K), _components (15f/3.1K), selling (7f/1.9K), profile (4f/1.8K), wishlist (7f/1.7K), plans (6f/1.2K), sales (10f/1.3K), billing (4f/1K), addresses (4f/620), security (3f/498), payments (3f/495), following (3f/357), settings (2f/68).

## Audit Checklist

For every file in this domain:

1. **Dead code scan:**
   ```bash
   # Check every _components/ and _lib/ export for zero external usage
   grep -rn "from.*account.*_components" app/ components/ --include="*.ts" --include="*.tsx"
   ```

2. **Tiny file scan (<50L):** List all. For each, can it merge into parent/sibling?
   - `settings/` (2 files, 68 LOC total) → can these inline into parent page?
   - Types files, constants files, barrel files — merge candidates

3. **Oversized file scan (>300L):**
   - `_components/` has 15 files / 3.1K LOC — likely some are big
   - `orders/` has 12f/2.9K — `order-detail-content.tsx` was 706L
   - `selling/selling-products-list.tsx` was 776L
   - `profile/profile-content.tsx` was 752L, `public-profile-editor.tsx` was 659L
   - `billing/billing-content.tsx` was 729L
   - `wishlist/` — 7 files for a simple list page?
   - `sales/` — 10 files for what should be a filtered view of orders?

4. **"use client" audit:** Which files have it? How many actually need it (state/effects/handlers)?

5. **Cross-domain duplication:** Does this domain duplicate anything in (business), (admin), or components/shared/?
   - Account orders vs business orders — shared primitives exist, but are they actually used?
   - Account stats vs business stats
   - Account sidebar, header

## Refactor Targets (execute after audit)

### Oversized splits (776L, 752L, 729L, 706L, 659L files)
- Split by extracting types, sub-sections, and helper functions
- Target: each file <300L

### Merge opportunities
- `sales/` (10 files) — is this just filtered orders? Can it share more with `orders/`?
- `settings/` (68 LOC across 2 files) — consider inlining
- Tiny type/constant files → merge into consumers

### "use client" removal
- Check every file — server components by default. Only keep "use client" for genuine interactivity.

### Action cleanup
- Check `_actions/` (if exists) and any `app/actions/` files serving this domain
- `getUser()` → `requireAuth()` migration for any remaining holdouts

## DON'T TOUCH
- Auth logic in profile security settings (password change, etc.)
- Payment/billing Stripe integration logic (audit only, flag issues)
- The shared primitives in `components/shared/` that serve this domain

## Verification
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```
