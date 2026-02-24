# Supabase Refactor — Session Prompt

> Paste this into a NEW Copilot chat. Prerequisites: **Supabase MCP** connected.
> This prompt contains LIVE production data pulled via Supabase MCP on 2026-02-24.

---

## Your Role

You are the Treido project orchestrator. You have Supabase MCP to query/modify the live DB and full codebase access. Your job: plan + execute a massive Supabase cleanup.

**Read first:** `AGENTS.md`, `docs/database.md`, `docs/STACK.md`.

---

## Live Database Audit (already collected)

### Table Sizes & Row Counts (production)

| Table | Size | Rows | Notes |
|-------|------|------|-------|
| categories | 9,408 kB | 13,139 | **MASSIVE** — 24 L0, 291 L1, 3,073 L2, 9,104 L3, 647 L4 |
| category_attributes | 7,936 kB | 7,116 | **6,117 inactive** vs 999 active — 86% dead weight |
| products | 1,344 kB | 233 | Reasonable |
| admin_docs | 280 kB | 75 | |
| profiles | 104 kB | 31 | |
| All other tables | <112 kB each | <60 each | Sparse — pre-launch |

### Migration File Counts
- **1,032 files** in `supabase/migrations/`
- **1,107 files** in `supabase/migrations_legacy_sync_20260223193150/` (backup)
- ~89 files: `restore_massive_l3_categories_batch{1-89}.sql`
- ~30 files: `restore_category_attributes_batch{1-30}.sql`
- Dozens of `fix_*_hierarchy.sql` patching earlier breakage

### Category Tree (13,139 total)
| Level | Count |
|-------|-------|
| L0 (top-level) | 24 |
| L1 | 291 |
| L2 | 3,073 |
| L3 | 9,104 |
| L4 | 647 |

- **0 orphaned categories** (parent_id references are clean)
- **0 duplicate name+parent_id pairs**
- Tree integrity is good — the problem is volume, not corruption

### Index Health (149 total)
- **31 unused indexes** (0 scans since stats reset)
- **8 duplicate index sets** — redundant indexes covering same columns:

| Table | Duplicate Pair | Keep | Drop |
|-------|---------------|------|------|
| blocked_users | `blocked_users_blocker_id_blocked_id_key` (UNIQUE) + `idx_blocked_users_pair` | UNIQUE | idx |
| brands | `brands_slug_key` (UNIQUE) + `idx_brands_slug` | UNIQUE | idx |
| business_verification | `business_verification_seller_id_key` (UNIQUE) + `idx_business_verification_seller` | UNIQUE | idx |
| buyer_feedback | `buyer_feedback_seller_id_buyer_id_order_id_key` + `buyer_feedback_unique_per_order` (both UNIQUE, same cols) | `_unique_per_order` (NULLS NOT DISTINCT) | other |
| categories | `categories_slug_key` (UNIQUE) + `idx_categories_slug` | UNIQUE | idx |
| orders | `orders_stripe_payment_intent_id_key` (UNIQUE partial) + `idx_orders_stripe_payment_intent` | UNIQUE | idx |
| profiles | `profiles_username_key` (UNIQUE) + `idx_profiles_username` | UNIQUE | idx |
| user_badges | `user_badges_user_id_badge_id_key` (UNIQUE) + `idx_user_badges_active` (partial WHERE) | Both (different scopes) | None |

**7 easily droppable duplicates**, 1 keep-both (user_badges).

### Unindexed Foreign Keys (16 total — performance advisor findings)
| Table | Missing Index On |
|-------|-----------------|
| admin_notes | author_id |
| admin_tasks | assigned_to, created_by |
| business_verification | verified_by |
| cart_items | product_id, variant_id |
| conversations | order_id |
| listing_boosts | product_id |
| notifications | conversation_id, order_id, product_id, user_id |
| order_items | variant_id |
| return_requests | order_item_id |
| user_badges | badge_id |

### Functions (92 total)
- **73 SECURITY DEFINER** / 19 SECURITY INVOKER
- **ALL have search_path set** — no missing search_path issues (previous migrations fixed this)
- Most use `search_path=public`, some use `search_path=""` (correct for pg_temp isolation)
- Function security: CLEAN

### RLS Policies (113 total across 44 tables)
- Max per table: 4 policies (12 tables have 4 each)
- Min: 1 policy (14 tables have 1)
- Distribution is reasonable — no bloated tables with 10+ policies

### Security Advisor
- **1 WARNING:** `auth_leaked_password_protection` disabled (Pro plan required — known, tracked as LAUNCH-004)
- **0 CRITICAL findings**

### Performance Advisor
- **16 INFO:** Unindexed foreign keys (listed above)
- **0 WARN/CRITICAL**

---

## Confirmed Workstreams

Based on real data, here's what needs doing (in priority order):

### WS-1: Dead Category Attributes Cleanup (MEDIUM risk)
- **Problem:** 6,117 of 7,116 category_attributes have `is_active = false` — 86% dead weight, 7.9 MB wasted
- **Action:** Verify no code references inactive attrs, then DELETE them
- **Verify first:** `mcp_supabase_execute_sql` → check if any product_attributes reference inactive category_attributes
- **Then:** `DELETE FROM category_attributes WHERE is_active = false`
- **Code check:** grep codebase for `is_active` references in category_attributes queries

### WS-2: Duplicate Index Cleanup (LOW risk)
- **Problem:** 7 redundant indexes (UNIQUE constraint already covers the btree use case)
- **Action:** Drop these 7 indexes:
  ```sql
  DROP INDEX IF EXISTS idx_blocked_users_pair;
  DROP INDEX IF EXISTS idx_brands_slug;
  DROP INDEX IF EXISTS idx_business_verification_seller;
  DROP INDEX IF EXISTS idx_categories_slug;
  DROP INDEX IF EXISTS idx_orders_stripe_payment_intent;
  DROP INDEX IF EXISTS idx_profiles_username;
  DROP INDEX IF EXISTS buyer_feedback_seller_id_buyer_id_order_id_key;
  ```
- **Verification:** Re-run `mcp_supabase_get_advisors` type=performance after

### WS-3: Missing Foreign Key Indexes (LOW risk)
- **Problem:** 16 unindexed foreign keys causing potential slow JOINs/DELETEs
- **Action:** Create indexes for the 16 FKs listed above
- **Priority:** cart_items.product_id, notifications.user_id, order_items.variant_id (hot paths)

### WS-4: Migration Squash (HIGH risk — HUMAN APPROVAL REQUIRED)
- **Problem:** 1,032 migration files. Unmanageable.
- **Approach:** 
  1. Dump current production schema: `mcp_supabase_execute_sql` to get full DDL
  2. Create single `00000000000000_baseline.sql` with complete schema
  3. Mark all existing migrations as applied in `supabase_migrations` table
  4. Delete old migration files from repo
- **DO NOT EXECUTE** — plan only, get human sign-off

### WS-5: Legacy Backup Cleanup (LOW risk — needs human confirmation)
- **Problem:** `supabase/migrations_legacy_sync_20260223193150/` has 1,107 files — it's a pre-sync backup
- **Action:** Delete the entire directory (it's a backup, not used by Supabase CLI)
- **Ask human first** — confirm they don't need this backup

### WS-6: Schema.sql Sync (LOW risk)
- **Problem:** `supabase/schema.sql` is the original 6-table schema from project inception — completely stale
- **Action:** Generate current schema from production and replace the file
- **How:** `mcp_supabase_execute_sql` with pg_dump equivalent queries, or Supabase CLI

### WS-7: Type Regeneration (LOW risk)
- **Action:** Regenerate `lib/supabase/database.types.ts` from current linked project
- **How:** Run `pnpm -s supabase gen types --linked --lang typescript --schema public > lib/supabase/database.types.ts`
- **Then:** `pnpm -s typecheck` to verify nothing breaks

### WS-8: Unused Index Audit (LOW risk)
- **Problem:** 31 indexes with 0 scans
- **Action:** Use `mcp_supabase_execute_sql` to get the full list, determine which are truly unnecessary vs. just not hit yet (pre-launch)
- **Be conservative:** Only drop indexes on tables with actual traffic patterns

---

## NOT Needed (confirmed clean)

| Area | Status | Why |
|------|--------|-----|
| Category tree integrity | CLEAN | 0 orphans, 0 duplicates |
| Function search_path | CLEAN | All 92 functions have search_path set |
| RLS policy count | CLEAN | 113 policies across 44 tables — reasonable |
| Security advisor | CLEAN | Only 1 known warning (leaked password = Pro plan) |

---

## Execution Order

```
1. WS-1: Dead attributes cleanup (biggest bang — reclaims ~6.8 MB, simplifies queries)
2. WS-2: Duplicate index drop (7 indexes, safe, immediate)
3. WS-3: Missing FK indexes (16 indexes to add)
4. WS-7: Type regeneration (quick, validates schema)
5. WS-6: Schema.sql sync (documentation)
6. WS-8: Unused index audit (investigation)
7. WS-5: Legacy folder delete (ask human first)
8. WS-4: Migration squash (plan only — human approves before execution)
```

---

## How to Execute

For each workstream:
1. **Verify** — run the diagnostic SQL via `mcp_supabase_execute_sql` to confirm the problem
2. **Execute** — apply the fix via `mcp_supabase_apply_migration` for DDL changes
3. **Validate** — re-run `mcp_supabase_get_advisors` + diagnostic queries
4. **Document** — update `docs/database.md` if stats changed
5. **Code changes** — use codebase tools to update any affected code
6. **Gates** — `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

For WS-4 (migration squash) and WS-5 (legacy folder), create plan docs in `docs/supabase-refactor/` and add tasks to `TASKS.md` — do NOT execute without human approval.

---

## Important Constraints

- **NEVER** modify RLS policies, auth logic, or payment tables without human approval
- **NEVER** drop tables or columns without explicit confirmation
- **ALWAYS** re-run advisors after DDL changes
- The app has 5 Supabase client types — see `docs/STACK.md` § Supabase Client Selection
- All gates must pass after code changes

---

## Context Files

```
AGENTS.md                      → Project identity, conventions, rules
docs/database.md               → Schema overview (update this as you go)
docs/STACK.md                  → Supabase client selection, caching patterns
lib/supabase/server.ts         → 4 server-side clients
lib/supabase/client.ts         → Browser client
lib/supabase/database.types.ts → Generated types (regenerate in WS-7)
supabase/schema.sql            → STALE — replace in WS-6
```

---

*Generated: 2026-02-24 — data from live Supabase MCP queries*
