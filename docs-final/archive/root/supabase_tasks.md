# Supabase Tasks (DB + RLS + Performance)

This is a task checklist (not a canonical doc). References: `docs/BACKEND.md`, `docs/ENGINEERING.md`, `docs/PRODUCTION.md`, `codex-xhigh/supabase/FULL-AUDIT.md`, and `supabase/migrations/*`.

## Critical (do before broad launch)

- [ ] Supabase Dashboard: enable leaked password protection (`docs/PRODUCTION.md`) and re-check it’s still enabled.
- [~] Database Webhooks for cache revalidation *(Deferred - categories are static for now. Setup guide in chat 2026-01-21. Revisit when adding admin category management.)*
- [x] RLS coverage: list all `public.*` tables and confirm RLS is enabled + policies exist for any user-facing data. *(Verified 2026-01-21: all 42 public tables have RLS enabled with policies)*
- [ ] Service-role usage: confirm `SUPABASE_SERVICE_ROLE_KEY` is only used server-side (no client bundles, no logs).

## Performance (next sprint)

- [ ] Re-run Supabase Security + Performance Advisors and capture findings (post-2026-01-21 changes).
- [x] Run Supabase Security + Performance Advisors and capture findings *(Done 2026-01-21: see `codex-xhigh/logs/supabase-advisor-2026-01-21.md`)*
- [x] Fix Performance Advisor "RLS initplan" warnings on admin tables *(Fixed 2026-01-21: `fix_admin_tables_rls_and_indexes` migration)*
- [x] Fix duplicate permissive RLS policies on admin tables *(Fixed 2026-01-21: same migration)*
- [x] Drop duplicate indexes on admin tables *(Fixed 2026-01-21: same migration)*
- [x] Add missing FK indexes for admin tables *(Fixed 2026-01-21: same migration)*
- [ ] Verify hot-path indexes exist and match query shapes (examples already present in migrations, confirm via `EXPLAIN`):
  - [ ] `categories(parent_id)`, `categories(slug)`, `categories(display_order)`
  - [ ] `products(category_id)`, `products(seller_id)`, `products(created_at DESC)`, `products(search_vector)` (GIN), `products(tags)` (GIN)
- [ ] If category tree reads become a DB bottleneck: benchmark an RPC-based depth-limited hierarchy query vs current multi-query approach before changing code.
- [ ] Data integrity: enforce discounts at the DB layer (prevents invalid `list_price`):
  - [ ] Add CHECK constraint (consider `NOT VALID` first if prod has dirty rows): `list_price IS NULL OR list_price > price`

## Operations / Hygiene

- [ ] Confirm migrations are applied consistently across environments (staging/prod): `supabase/migrations/*` is SSOT.
- [ ] Regenerate `lib/supabase/database.types.ts` after schema changes (so tables like `boost_prices` are typed) and remove `any` casts in query code (e.g. `app/api/boost/checkout/route.ts`).
- [ ] Review backups / PITR / retention and set appropriate values for expected marketplace volume.
- [ ] Storage: verify buckets + policies (`avatars`, `product-images`) and lifecycle rules (cleanup/orphan prevention).

## Scope audit (post-launch cleanup)

- [ ] Inventory over-engineered DB pieces vs V1 scope and defer deletions until after launch:
  - Promotions: `listing_boosts`, `boost_prices`, boost cron.
  - Badges: `badge_definitions`, `user_badges`.
  - Admin ops: `admin_docs`, `admin_tasks`.
  - Wishlist sharing RPCs: `enable_wishlist_sharing`, `disable_wishlist_sharing`, `get_shared_wishlist`.

---

## Remaining Advisor Notes (INFO level - not blocking)

The following are INFO-level warnings that don't require immediate action:

### Unused Indexes (30+ indexes)
Most are on low-traffic tables (admin_*, return_requests, buyer_feedback, etc.) with <20 rows. Monitor after launch before dropping. Full list in `codex-xhigh/logs/supabase-advisor-2026-01-21.md`.

### Materialized View in API
`category_stats` is intentionally exposed - it's public performance data.
