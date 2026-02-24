# Supabase Refactor — Domain Task Breakdown

> Granular tasks per domain, ready for TASKS.md.
> Each task is self-contained with acceptance criteria and approval gates.
> Codex executes top-to-bottom within a domain.

---

## Domain 1: Schema Truth + Governance

*Foundation work. Must complete before touching the database.*

### DB-GOV-001: Live schema inventory snapshot
- **Touch:** Add `scripts/db/live-inventory.sql` + `scripts/db/live-inventory.md`
- **Acceptance:** Snapshot documents live counts (44 tables, 3 views, 1 matview, 92 functions, 149 indexes, 109 policies), trigger/function orphan list, and advisor output
- **Human approval:** No

### DB-GOV-002: Fix stale schema references in docs
- **Touch:** `docs/database.md`, `docs/generated/db-schema.md`
- **Acceptance:** Remove `sellers` table reference, correct all counts, add `category_stats_mv` materialized view note, verify all 44 tables listed match live DB
- **Human approval:** No

### DB-GOV-003: Schema drift detection gate
- **Touch:** Add `scripts/check-db-drift.mjs`, wire into `package.json` scripts
- **Acceptance:** Script compares live table/view/function counts against a committed manifest and fails CI if they drift. Runs with `pnpm -s db:drift-check`
- **Human approval:** No

### DB-GOV-004: Migration governance docs
- **Touch:** Add `supabase/migrations/README.md` and `supabase/migrations_legacy_sync_20260223193150/README.md`
- **Acceptance:** Clear "active path only" rule documented, archive rationale explained, restore procedure documented, legacy sync folder marked as do-not-modify
- **Human approval:** No

---

## Domain 2: FK Index Backfill

*Fast perf win. Low risk, high value.*

### DB-IDX-001: Add missing FK indexes — Pack A (8 indexes)
- **Touch:** One migration in `supabase/migrations/`
- **Tables:** `admin_notes.author_id`, `admin_tasks.assigned_to`, `admin_tasks.created_by`, `business_verification.verified_by`, `cart_items.product_id`, `cart_items.variant_id`, `conversations.order_id`, `listing_boosts.product_id`
- **Acceptance:** All 8 indexes created with `idx_<table>_<column>` naming, migration is idempotent (`CREATE INDEX IF NOT EXISTS`), `CREATE INDEX CONCURRENTLY` for large tables
- **Human approval:** Yes (DB migration)

### DB-IDX-002: Add missing FK indexes — Pack B (7 indexes)
- **Touch:** One migration in `supabase/migrations/`
- **Tables:** `notifications.conversation_id`, `notifications.order_id`, `notifications.product_id`, `notifications.user_id`, `order_items.variant_id`, `return_requests.order_item_id`, `user_badges.badge_id`
- **Acceptance:** All 7 indexes created idempotently
- **Human approval:** Yes (DB migration)

### DB-IDX-003: Performance advisor zero-warning verification
- **Touch:** Note in `docs/database.md`
- **Acceptance:** Supabase Performance Advisor reports 0 `unindexed_foreign_keys` lints after both packs applied
- **Human approval:** No

---

## Domain 3: RLS Hardening

*Security + correctness. Medium risk — test with SQL harness first.*

### DB-RLS-001: Standardize admin policies to `is_admin()`
- **Touch:** Migration updating 4 policies: `admin_docs_admin_only`, `admin_notes_admin_only`, `admin_tasks_admin_only`, `business_verification_select`
- **Acceptance:** Inline `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')` removed, all use `(SELECT is_admin())`, admin table write policies scoped `TO authenticated` (not `TO public`)
- **Human approval:** Yes (RLS migration)

### DB-RLS-002: Tighten write-role scope to `authenticated`
- **Touch:** Migration for write policies on: `blocked_users`, `conversations`, `messages`, `notification_preferences`, `store_followers`, `seller_feedback`, `variant_options`, `product_images`
- **Acceptance:** No user write policy remains `TO public` unless explicitly justified (service_role INSERT on `notifications` is the one justified exception)
- **Human approval:** Yes (RLS migration)

### DB-RLS-003: Add `WITH CHECK` on UPDATE policies
- **Touch:** Migration for 13 UPDATE policies missing `WITH CHECK`: `categories`, `conversations`, `messages`, `notifications`, `product_images`, `products`, `profiles`, `reviews`, `seller_feedback`, `subscriptions`, `user_addresses`, `user_payment_methods`, `variant_options`
- **Acceptance:** Every UPDATE policy has symmetric `USING` + `WITH CHECK`. Users cannot update rows to violate ownership invariant
- **Human approval:** Yes (RLS migration)

### DB-RLS-004: RLS regression test harness
- **Touch:** Add `scripts/db/rls-test-harness.sql` + doc in `docs/testing.md`
- **Acceptance:** SQL harness tests anon/authenticated/service-role access for key tables: `orders`, `order_items`, `conversations`, `messages`, `notifications`, `admin_*`, `profiles`, `products`. Documents expected pass/fail matrix
- **Human approval:** No

---

## Domain 4: Trigger/Function Lifecycle Cleanup

*Highest risk domain. Dense trigger chains on hot tables.*

### DB-TRG-001: Consolidate products listing-stat triggers
- **Touch:** Migration for `on_product_change` + `update_seller_listing_counts_insert/update/delete` triggers, functions `update_seller_stats_on_listing` + `update_seller_listing_counts`
- **Problem:** Two separate seller-stats pipelines fire on product INSERT with conflicting active criteria (`stock > 0` vs `status = 'active'`)
- **Acceptance:** Only ONE canonical listing-stats path remains, active-listing definition unified, `seller_stats` values match reality
- **Human approval:** Yes (trigger migration)

### DB-TRG-002: Harden `handle_new_order_item` security
- **Touch:** Migration for `handle_new_order_item` function
- **Problem:** Runs `SECURITY DEFINER` with `row_security = off` — overly permissive
- **Acceptance:** Function behavior preserved but `row_security = off` removed if not strictly necessary, or explicitly justified with security review comment. Function is idempotent (no double system messages)
- **Human approval:** Yes (security-sensitive migration)

### DB-TRG-003: Remove orphan trigger functions
- **Touch:** Migration to drop or reattach orphaned trigger functions: `create_seller_stats`, `create_user_verification`, `handle_new_user`, `init_business_verification`, `init_seller_stats`, `update_product_stock`
- **Acceptance:** Zero unattached trigger functions in `public` schema. Any functions that still have live triggers are NOT dropped
- **Human approval:** Yes (function drops)

### DB-TRG-004: Trigger chain observability report
- **Touch:** Add `scripts/db/trigger-chain-report.sql`
- **Acceptance:** Report lists per-table trigger counts, fanout depth for `products` and `order_items`, top write amplification risks. Committed as living reference
- **Human approval:** No

---

## Domain 5: RPC Surface Cleanup

### DB-RPC-001: Resolve missing `admin_paid_revenue_total`
- **Touch:** Either add migration creating the RPC OR remove the call in `lib/auth/admin.ts` line ~161
- **Problem:** Code calls `.rpc("admin_paid_revenue_total" as never)` — the `as never` typecast confirms it's missing from generated types. Falls back to $0 on every admin load
- **Acceptance:** No silent fallback triggered on normal admin page load
- **Human approval:** Yes if adding RPC; No if code-only removal

### DB-RPC-002: RPC grant audit and lockdown
- **Touch:** Migration managing `GRANT/REVOKE EXECUTE` for public schema functions
- **Acceptance:** `anon` can only execute explicitly public RPCs (`get_badge_specs`, `get_category_stats`, `get_hero_specs`, `get_shared_wishlist`, `get_category_path`). `authenticated` limited to app-used RPC set. Trigger functions are `REVOKE ALL ON FUNCTION ... FROM public`
- **Human approval:** Yes (grant/revoke migration)

### DB-RPC-003: Deprecate unused RPCs
- **Touch:** Migration + deprecation doc
- **Candidates:** RPCs defined but never called from app code (cross-reference `AUDIT.md § RPC Inventory`)
- **Acceptance:** Unused RPCs either marked deprecated (comment + revoked grants) or dropped. One release window before hard drop
- **Human approval:** Yes (function drops)

### DB-RPC-004: RPC callsite inventory + CI lock
- **Touch:** Add `scripts/db/rpc-inventory.mjs` and wire into CI
- **Acceptance:** Script extracts all `.rpc()` calls from codebase, generates `docs/generated/rpc-callsites.md`, fails if new RPC call appears without inventory update
- **Human approval:** No

---

## Domain 6: Code Decomposition

*No schema changes. Pure TypeScript refactoring.*

### CODE-SPLIT-001: Split `lib/auth/business.ts` (1,234 lines)
- **Touch:** Split into `lib/business/` directory:
  - `guards.ts` — `requireBusinessSeller()`, subscription checks
  - `subscriptions.ts` — subscription queries, tier logic
  - `stats.ts` — seller stats, performance scoring
  - `products.ts` — business product queries
  - `orders.ts` — business order queries
  - `customers.ts` — customer data
  - `transformers.ts` — data transformation helpers
- **Acceptance:** All current public exports preserved via barrel file, all existing imports work, all gates pass (`typecheck + lint + styles:gate + test:unit`)
- **Human approval:** No

### CODE-SPLIT-002: Split AI edge function (724 lines)
- **Touch:** Split `supabase/functions/ai-shopping-assistant/index.ts` into:
  - `index.ts` — entry point + CORS
  - `providers.ts` — AI provider config
  - `query.ts` — Supabase query builder
  - `response.ts` — response formatting
- **Acceptance:** Edge function behavior unchanged, no single file >300 lines
- **Human approval:** No

### CODE-SPLIT-003: Split messages module (439 lines)
- **Touch:** Split `lib/supabase/messages.ts` into:
  - `queries.ts` — conversation/message fetching
  - `mutations.ts` — mark read, send message
  - `transformers.ts` — profile/message type transforms
- **Acceptance:** All existing callers unchanged, message flows work, types preserved
- **Human approval:** No

---

## Domain 7: Migration Rebaseline

*Highest blast radius. Execute last.*

### DB-MIG-001: Migration classification manifest
- **Touch:** Add `docs/database-migration-inventory.md`
- **Acceptance:** Each migration classified as: `schema`, `seed`, `incident-restore`, `legacy-sync`, `doc-only`. With owner and keep/drop recommendation
- **Human approval:** No

### DB-MIG-002: Category restore compaction plan
- **Touch:** Plan doc for the ~400 `restore/batch/category` migrations
- **Acceptance:** Single replacement strategy defined (seed snapshot + checksum), no behavior loss documented, rollback plan included
- **Human approval:** Yes

### DB-MIG-003: Create baseline migration from live schema
- **Touch:** New baseline migration in `supabase/migrations/`
- **Acceptance:** Fresh DB from baseline + post-baseline migrations matches production schema checksum. `supabase db reset` works from baseline
- **Human approval:** Yes

### DB-MIG-004: Branch parity rehearsal
- **Touch:** Run on Supabase dev branch + write runbook
- **Acceptance:** Dev branch rebuilt from baseline path passes schema parity checks. Runbook committed to `docs/`
- **Human approval:** Yes

---

## Domain 8: Docs/Types/CI Sync

### SYNC-001: Remove stale `sellers` references
- **Touch:** `docs/database.md`, `docs/generated/db-schema.md`
- **Acceptance:** No mention of `public.sellers` table anywhere in docs. Table/count references match live DB
- **Human approval:** No

### SYNC-002: Regenerate and verify DB types
- **Touch:** `lib/supabase/database.types.ts`
- **Acceptance:** Generated types reflect live schema, no `sellers` table type, build passes, all type imports resolve
- **Human approval:** No

### SYNC-003: Add recurring DB health checklist
- **Touch:** `TASKS.md`
- **Acceptance:** Recurring monthly task: run Security Advisor + Performance Advisor + drift snapshot, with clear ownership
- **Human approval:** No

---

## Execution Timeline

| Phase | Domains | Est. Effort | Prerequisite |
|-------|---------|-------------|--------------|
| **Phase 1: Foundation** | 1 (Governance) | 1 session | None |
| **Phase 2: Fast Wins** | 2 (Indexes) + 8 (Sync) | 1 session | Phase 1 |
| **Phase 3: Hardening** | 3 (RLS) + 5 (RPC) | 2 sessions | Phase 2 |
| **Phase 4: Deep Cleanup** | 4 (Triggers) | 1-2 sessions | Phase 3 |
| **Phase 5: Code** | 6 (Code Split) | 1 session | Any time |
| **Phase 6: Rebaseline** | 7 (Migrations) | 2+ sessions | All above |

Total estimated: **8-10 Codex sessions** across 4-6 calendar days.

---

*Last updated: 2026-02-24*
