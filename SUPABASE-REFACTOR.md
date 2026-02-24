# Supabase Full Backend Refactor — Codex Task

> **DELETE THIS FILE** when all phases are complete and verified.

Read `AGENTS.md` first. Then read `docs/database.md` and `docs/STACK.md` § Supabase.

---

## What This Is

A full Supabase backend refactor in 10 phases. You previously wrote 7 migration files
(`supabase/migrations/20260224*.sql`) that were **never applied** to the remote DB.
This task applies them (with modifications from your own review), plus 3 additional phases
that make this a true full refactor — not just cleanup.

---

## CRITICAL Constraints

1. **DO NOT use `supabase db push`** — it will fail (1,025 remote vs 86+ local migration drift).
2. Use your **Supabase MCP** tools:
   - `execute_sql` for DML, read queries, and DDL you want to test first
   - `apply_migration` to record each phase in the migration ledger
3. **VERIFY after every phase** before moving to the next. If verification fails, **STOP and report**.
4. **DO NOT touch:** auth logic, RLS policies, payment-related code, webhook handlers.
5. Use `todo list` tracking for all 10 phases.

---

## Current DB State (audited 2026-02-23)

| Metric | Value | Problem |
|--------|-------|---------|
| Tables | 44 | 11 have 0 rows |
| Indexes | 177 | products: 21 indexes on 233 rows; 23 flagged unused |
| RPC functions | 101 | 13 anon-callable (several dangerous) |
| Triggers | 65 | 11 tables missing `updated_at`; duplicate triggers on seller_feedback, user_addresses, orders |
| Cron jobs | 2 | Both expire boosts (duplicate) |
| RLS policies | 109 | Clean — 4 per table, no consolidation needed |
| Categories | 13,139 | 233 products. 208 on non-leaf nodes. 13,009 with zero inventory |
| category_attributes | 7,116 | Most linked to dead categories |
| product_attributes | 73 | Fine |
| Views | deal_products, subscription_overview | Missing `security_invoker` |
| Migration ledger | 1,025 remote vs 86 local | `db push` broken |
| Security advisor | 1 warning | Leaked password protection |
| Performance advisor | 23 unused indexes | |

### Empty Tables (0 rows)

blocked_users, buyer_feedback, notification_preferences, product_variants,
return_requests, seller_feedback, seller_shipping_settings, user_badges,
user_payment_methods, username_history, variant_options

### Duplicate Triggers Found

- `seller_feedback` AFTER INSERT: `update_seller_stats_on_feedback` AND `on_seller_feedback_created` — both update seller stats
- `user_addresses` BEFORE UPDATE: `on_address_updated` AND `set_updated_at` — both call `handle_updated_at()`
- `orders` AFTER UPDATE: `update_seller_sales_on_order` AND `on_order_completed` — both update seller stats

### Key Trigger: `enforce_products_category_is_leaf`

This BEFORE INSERT trigger on `products` blocks non-leaf category assignments.
It does NOT fire on UPDATE, so the Phase 5 leaf remap UPDATE will work.
After Phase 5, this trigger ensures all NEW products go to leaves. Keep it.

---

## Phase 1: Security Hardening

**Source:** `supabase/migrations/20260224010000_security_hardening.sql`

Apply as-is via `execute_sql`:
- Revoke anon EXECUTE from dangerous RPCs (expire_subscriptions, create_subscription_expiry_notifications, init_subscription_boosts, reset_monthly_boosts)
- Revoke from trigger functions (enforce_products_category_is_leaf, handle_category_attribute_key_normalization, handle_product_attributes_sync, sync_product_attributes_jsonb)
- Restrict `increment_view_count` to authenticated only
- Unschedule duplicate cron job `expire-listing-boosts`

**Verify:**
```sql
-- No dangerous anon-callable functions remain
SELECT p.proname
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
LEFT JOIN aclexplode(p.proacl) ace ON true
LEFT JOIN pg_roles a ON ace.grantee = a.oid
WHERE n.nspname = 'public' AND a.rolname = 'anon'
AND p.proname IN ('expire_subscriptions','increment_view_count','init_subscription_boosts','reset_monthly_boosts');
-- Expect: 0 rows

-- Cron jobs
SELECT schedule, jobname FROM cron.job ORDER BY jobname;
-- Expect: 1 job only (cleanup_expired_boosts)
```

---

## Phase 2: Data Integrity — Triggers

**Source:** `supabase/migrations/20260224030000_data_integrity_fixes.sql`

Apply the 11 `updated_at` triggers as-is.

**ADDITIONAL — Remove duplicate triggers:**
```sql
-- user_addresses: drop duplicate (keep set_updated_at, drop on_address_updated)
DROP TRIGGER IF EXISTS on_address_updated ON public.user_addresses;

-- seller_feedback: drop duplicate stats trigger (keep on_seller_feedback_created, drop update_seller_stats_on_feedback)
DROP TRIGGER IF EXISTS update_seller_stats_on_feedback ON public.seller_feedback;

-- orders: check if both are needed — query function bodies first:
SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname IN ('update_seller_sales_stats', 'update_seller_stats_on_order');
-- If they do the same thing, drop one. If they update different columns, keep both.
```

**Verify:**
```sql
-- All tables with updated_at column have a trigger
SELECT c.relname AS table_name
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
JOIN pg_attribute a ON a.attrelid = c.oid AND a.attname = 'updated_at'
WHERE n.nspname = 'public' AND c.relkind = 'r'
AND NOT EXISTS (
  SELECT 1 FROM pg_trigger t WHERE t.tgrelid = c.oid AND NOT t.tgisinternal
  AND (SELECT proname FROM pg_proc WHERE oid = t.tgfoid) = 'handle_updated_at'
);
-- Expect: 0 rows (no tables missing the trigger)

-- No duplicate triggers on user_addresses or seller_feedback
SELECT tgname, tgrelid::regclass FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND NOT t.tgisinternal
AND c.relname IN ('user_addresses', 'seller_feedback')
ORDER BY c.relname, tgname;
```

---

## Phase 3: View Security

Apply from Phase 3 migration:
```sql
ALTER VIEW IF EXISTS public.deal_products SET (security_invoker = on);
ALTER VIEW IF EXISTS public.subscription_overview SET (security_invoker = on);
```

**Verify:**
```sql
SELECT relname, reloptions FROM pg_class
WHERE relname IN ('deal_products', 'subscription_overview');
-- Expect: both show security_invoker=on
```

---

## Phase 4: Categories — `is_browseable` Column

**Source:** `supabase/migrations/20260224040000_category_browseable_layer.sql`

Apply as-is:
- Add `is_browseable boolean NOT NULL DEFAULT false`
- Populate via recursive CTE (ancestors of categories with active products + all L0)
- Create filtered index `idx_categories_browseable`
- Create `refresh_browseable_categories()` function (service_role only)

**Verify:**
```sql
SELECT is_browseable, count(*) FROM public.categories GROUP BY is_browseable;
-- Expect: browseable ~100-200, not-browseable ~13,000
```

---

## Phase 5: Product Leaf Mapping — DRY RUN FIRST

**Source:** `supabase/migrations/20260224050000_fix_product_leaf_mapping.sql`

### Step 5a: Create the function only
```sql
CREATE OR REPLACE FUNCTION public.find_best_leaf(p_category_id uuid)
RETURNS uuid LANGUAGE plpgsql STABLE SET search_path = '' AS $$
DECLARE
  current_id uuid := p_category_id;
  child_id uuid;
  depth int := 0;
BEGIN
  LOOP
    -- Safety: prevent infinite loops (max 10 levels)
    depth := depth + 1;
    IF depth > 10 THEN RETURN current_id; END IF;

    SELECT c.id INTO child_id
    FROM public.categories c
    WHERE c.parent_id = current_id
      AND c.is_browseable = true  -- only follow browseable paths
    ORDER BY c.display_order ASC
    LIMIT 1;

    IF child_id IS NULL THEN RETURN current_id; END IF;
    current_id := child_id;
  END LOOP;
END;
$$;
```

Note the modifications from the original:
- Added `depth` guard (max 10 levels, prevents infinite loops)
- Added `is_browseable = true` filter (only follows active paths)

### Step 5b: DRY RUN — inspect mappings before applying
```sql
SELECT p.id, p.title, p.category_id AS old_cat,
       c_old.name AS old_cat_name, c_old.parent_id IS NULL AS is_root,
       public.find_best_leaf(p.category_id) AS new_cat,
       c_new.name AS new_cat_name
FROM public.products p
JOIN public.categories c_old ON c_old.id = p.category_id
JOIN public.categories c_new ON c_new.id = public.find_best_leaf(p.category_id)
WHERE EXISTS (SELECT 1 FROM public.categories child WHERE child.parent_id = p.category_id)
ORDER BY c_old.name, p.title;
```

**REVIEW the output.** If any mapping looks wrong (product going to irrelevant category), STOP and report — do not blindly remap.

### Step 5c: If dry run looks good, apply
```sql
UPDATE public.products p
SET category_id = public.find_best_leaf(p.category_id)
WHERE p.category_id IS NOT NULL
AND EXISTS (SELECT 1 FROM public.categories child WHERE child.parent_id = p.category_id);

-- Rebuild ancestors
UPDATE public.products p
SET category_ancestors = public.get_category_ancestor_ids(p.category_id)
WHERE p.category_id IS NOT NULL;

-- Refresh browseable flags
SELECT public.refresh_browseable_categories();
```

### Step 5d: Drop helper
```sql
DROP FUNCTION IF EXISTS public.find_best_leaf(uuid);
```

**Verify:**
```sql
-- No products on non-leaf categories
SELECT count(*) FROM public.products p
WHERE p.category_id IS NOT NULL
AND EXISTS (SELECT 1 FROM public.categories child WHERE child.parent_id = p.category_id);
-- Expect: 0
```

---

## Phase 6: App Code Changes

### In `lib/data/categories/hierarchy.ts`:

**`getCategoryHierarchy()`** — add `.eq('is_browseable', true)` to all three queries:
- The root categories query (`.is('parent_id', null)`)
- The L1 children query
- The L2 children query

**DO NOT filter `getCategoryTreeDepth3()`** — the sell flow needs the full tree so sellers can pick any category.

### In `app/api/categories/[slug]/children/route.ts`:

Add `.eq('is_browseable', true)` to the children query if not already filtered.

### Run gates:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Phase 7: Attribute Soft-Deactivate

**Source:** `supabase/migrations/20260224070000_attribute_cleanup.sql`

Apply the `is_active` column + UPDATE marking inactive attributes.

**DO NOT apply section 7c** (the manual ledger INSERT) — we handle ledger separately.

**Verify:**
```sql
SELECT is_active, count(*) FROM public.category_attributes GROUP BY is_active;
-- Expect: active << 7,116 (most should be inactive)
```

---

## Phase 8: Dead RPC Function Audit

Query which RPC functions are NOT called from app code:

```sql
SELECT proname FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND proname NOT IN (SELECT DISTINCT (SELECT proname FROM pg_proc WHERE oid = tgfoid)
                    FROM pg_trigger WHERE NOT tgisinternal)
ORDER BY proname;
```

Then `grep` the codebase for each function name. Functions not referenced in any `.ts`/`.tsx` file
AND not used by cron AND not used by triggers are candidates for removal.

**Known suspects** (verify before dropping):
- `auto_generate_store_slug` — may be unused if store slug generation moved to app code
- `calculate_seller_rating` — check if still called via RPC or only via trigger
- `refresh_category_stats` — check if the `category_stats` view makes this redundant
- `generate_share_token` — may be internal-only helper
- `protect_sensitive_columns` — check what triggers use it

**For each dead function:**
```sql
DROP FUNCTION IF EXISTS public.<function_name>(<args>);
```

**DO NOT drop:** Any function used by a trigger, cron job, or called from app code (`.rpc('...')`).

**Verify:** Count public functions before and after. Report which were dropped and why.

---

## Phase 9: Duplicate Function/Trigger Consolidation

**Known duplicates to resolve:**

### seller_feedback triggers (4 AFTER INSERT triggers — too many):
1. `update_seller_stats_on_feedback → update_seller_stats_from_feedback`
2. `on_seller_feedback_created → update_seller_stats_on_feedback`
3. `update_seller_rating_trigger → update_seller_rating`
4. `on_seller_feedback_notify_trigger → on_seller_feedback_notify`

Triggers 1 and 2 likely do the same thing. Query their function bodies:
```sql
SELECT proname, pg_get_functiondef(oid) FROM pg_proc
WHERE proname IN ('update_seller_stats_from_feedback', 'update_seller_stats_on_feedback');
```
If they overlap, drop 1 trigger and 1 function.

### orders triggers (2 AFTER UPDATE doing similar work):
```sql
SELECT proname, pg_get_functiondef(oid) FROM pg_proc
WHERE proname IN ('update_seller_sales_stats', 'update_seller_stats_on_order');
```
If they overlap, consolidate.

### products BEFORE INSERT (6 triggers — heavyweight):
These all fire on every product insert:
1. `check_listing_limit_trigger`
2. `auto_set_fashion_gender_trigger`
3. `on_product_created → handle_new_product_search`
4. `aaa_enforce_products_category_is_leaf_trigger`
5. `trg_update_product_category_ancestors`
6. `product_slug_trigger`

Not necessarily duplicates, but audit whether `auto_set_fashion_gender` is still needed
(does it set a column that's actually used?). Query:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'products' AND column_name LIKE '%gender%';
```

**Verify:** Trigger count should decrease. No existing functionality broken.

---

## Phase 10: Index Cleanup (LAST)

**Source:** `supabase/migrations/20260224020000_drop_unused_indexes.sql`

**DO NOT apply as-is.** Follow this process:

### Step 10a: Get actual scan stats
```sql
SELECT indexrelname, idx_scan, idx_tup_read, idx_tup_fetch,
       pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE schemaname = 'public' AND idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Step 10b: Cross-reference with the migration file drop list
Only drop indexes that appear in BOTH:
1. The migration file (`20260224020000_drop_unused_indexes.sql`)
2. The 0-scan query above

### Step 10c: Additionally verify against app code
For any index you're about to drop, `grep` the codebase for the column(s) it covers.
If app code filters/orders on that column, KEEP the index even if it has 0 scans
(it may be important for future traffic).

### Step 10d: Drop in small batches (NOT inside a transaction)
```sql
DROP INDEX CONCURRENTLY IF EXISTS public.<index_name>;
```

**Verify:**
```sql
SELECT count(*) FROM pg_indexes WHERE schemaname = 'public';
-- Report before/after count
```

---

## Migration Ledger Registration

After ALL 10 phases succeed, register in the ledger:
```sql
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES
  ('20260224010000', 'security_hardening'),
  ('20260224020000', 'drop_unused_indexes'),
  ('20260224030000', 'data_integrity_fixes'),
  ('20260224040000', 'category_browseable_layer'),
  ('20260224050000', 'fix_product_leaf_mapping'),
  ('20260224060000', 'app_code_browseable_filter'),
  ('20260224070000', 'attribute_cleanup')
ON CONFLICT (version) DO NOTHING;
```

Phases 8–10 don't need separate migration files — they are operational cleanup.

---

## Final Verification

After all phases complete:

1. **Security advisor:** `get_advisors` — report all findings
2. **Performance advisor:** `get_advisors` — report all findings
3. **Final stats:**
```sql
SELECT
  (SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE') AS tables,
  (SELECT count(*) FROM pg_indexes WHERE schemaname='public') AS indexes,
  (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace=n.oid WHERE n.nspname='public') AS functions,
  (SELECT count(*) FROM pg_trigger t JOIN pg_class c ON t.tgrelid=c.oid JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='public' AND NOT t.tgisinternal) AS triggers,
  (SELECT count(*) FROM cron.job) AS cron_jobs,
  (SELECT count(*) FROM public.categories WHERE is_browseable = true) AS browseable_categories,
  (SELECT count(*) FROM public.category_attributes WHERE is_active = true) AS active_attributes
```
4. **Generate types:** `generate_typescript_types` and save to project
5. **Run all gates:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```
6. **Report:** Before/after table with all metrics.
7. **Delete this file** (`SUPABASE-REFACTOR.md`)

---

## Before/After Template

| Metric | Before | After |
|--------|--------|-------|
| Tables | 44 | |
| Indexes | 177 | |
| Functions | 101 | |
| Triggers | 65 | |
| Cron jobs | 2 | |
| RLS policies | 109 | |
| Browseable categories | 13,139 (all) | |
| Active category_attributes | 7,116 (all) | |
| Products on non-leaf | 208 | |
| Anon-callable functions | 13 | |
| Duplicate triggers | 3+ pairs | |

---

*Created: 2026-02-24. Delete after completion.*
