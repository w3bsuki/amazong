# 🔥 SUPABASE FOLDER AUDIT

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 2 |
| 🟠 HIGH | 7 |
| 🟡 MEDIUM | 11 |
| 🟢 LOW | 5 |
| ✅ EXCELLENT | 7 |

---

## 🔴 CRITICAL ISSUES

### 1. `schema.sql` IS MASSIVELY OUT OF DATE

**File:** `supabase/schema.sql`

**Problem:** The base `schema.sql` references `profiles.id` directly as seller identity, while migrations create a **separate `sellers` table**. The schema was cleaned up in later migrations, but the base `schema.sql` is LYING to anyone who reads it!

**Issues:**
- `products.seller_id` FK mismatch between schema and migrations
- Missing category hierarchy columns (`l0_slug`, `l1_slug`, `l2_slug`, `category_ancestors`)
- `schema.sql` is essentially USELESS documentation now

**Fix:**
```bash
# Regenerate schema.sql from production:
pg_dump --schema-only > schema.sql
# OR delete schema.sql entirely and rely on migrations as source of truth
```

---

### 2. NO DOWN MIGRATIONS

**Affected:** All 45+ migration files  
**Severity:** CRITICAL

NOT A SINGLE ROLLBACK/DOWN MIGRATION! If anything goes wrong, you're MANUALLY fixing production!

**Fix:** Create `*.down.sql` files for at least the critical migrations:
```
supabase/migrations/down/20240101000000_initial_schema.down.sql
```

---

## 🟠 HIGH SEVERITY ISSUES

### 3. TIMESTAMP COLLISION - Inconsistent Naming

| File | Issue |
|------|-------|
| `20251124_audit_and_secure.sql` | Non-standard format! |
| `20251127_add_search_history.sql` | Non-standard format! |

Every other migration uses `YYYYMMDDHHMMSS`, but these use `YYYYMMDD_` format. Migration order could be AMBIGUOUS!

**Fix:**
```bash
# Rename:
20251124_audit_and_secure.sql → 20251124000100_audit_and_secure.sql
20251127_add_search_history.sql → 20251127100000_add_search_history.sql
```

---

### 4. DUPLICATE ADD_SUBCATEGORY

**Files:** `20240101000001_*.sql` vs `20240101000003_*.sql`

BOTH migrations add `subcategory` column! One adds it with tags, then the other adds it AGAIN (thankfully with `IF NOT EXISTS`).

---

### 5. ORPHANED BADGE TRIGGERS

**File:** Badge trigger migration

Says "Run this migration after the badge tables have been created" but badge tables are created in LATER migrations! The timestamp suggests April 2024, but dependencies come from December 2025! TIME TRAVEL DETECTED!

---

### 6. REPEATED POLICY DROPS/RECREATES

**Files:** Multiple migrations

SAME policies recreated in multiple migrations! `profiles_select_all`, `products_select_all`, etc. appear in BOTH files. Which one wins? THE LAST ONE, but what a mess!

**Fix:** Create a single `_final_rls_policies.sql` migration that defines the canonical state.

---

### 7. MISSING ORDER UPDATE POLICY

**File:** `schema.sql` Lines 74-76

Users can INSERT orders but NO UPDATE policy exists in base schema! How do customers cancel orders? Fixed in later migration but `schema.sql` is misleading.

---

### 8. ADMIN BYPASS NOT CONSISTENT

**Description:** Some tables allow admin bypass (`is_admin()`), others don't. Inconsistent access patterns!

---

### 9. PROTECT_SENSITIVE_COLUMNS BYPASS

**File:** Migration with `protect_sensitive_columns`

Trigger protects `role` and `email` changes, but an ADMIN should be able to change roles! The trigger doesn't check for admin status.

**Fix:**
```sql
CREATE OR REPLACE FUNCTION public.protect_sensitive_columns()
RETURNS trigger AS $$
BEGIN
  -- Skip protection for admins
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'profiles' AND new.role IS DISTINCT FROM old.role THEN
    RAISE EXCEPTION 'You cannot change your own role.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
```

---

## 🟡 MEDIUM SEVERITY ISSUES

### 10. UUID GENERATION INCONSISTENCY

- `schema.sql` uses `uuid_generate_v4()` (requires uuid-ossp)
- Initial migration uses `gen_random_uuid()` (built-in)

**Fix:** Pick ONE and stick with it!

---

### 11. DUPLICATE INDEX CREATES

**File:** `conversations` migration

`idx_conversations_order_id`, `idx_conversations_product_id`, `idx_products_seller_id` created here, but ALSO created elsewhere. Thankfully uses `IF NOT EXISTS`.

---

### 12. MASSIVE INDEX PURGE

**File:** Cleanup migration

Dropped ~60 "unused" indexes. Good cleanup, but some might be needed for future queries. The comments explain WHY, which is EXCELLENT documentation!

---

### 13. DEAD SEED FILES

**Files:** Multiple seed files

Same categories seeded in BOTH files with slightly different image URLs. Pick one!

---

### 14. TEMP TABLE LEAK RISK

**File:** Product category migration

Uses `CREATE TEMP TABLE product_category_backup` which is fine, but no explicit cleanup if migration fails mid-way.

---

### 15. NO CONFIG FILE

**Missing:** `supabase/config.toml`

No local development configuration. Using remote-only?

**Fix:**
```toml
[db]
port = 54322
shadow_port = 54320
major_version = 15

[auth]
site_url = "http://localhost:3000"
```

---

### 16. ENUMS NOT IN TYPES

Custom enums like `seller_tier` and `subscription_status` exist in DB but types use `string` instead. Consider regenerating types.

---

## ✅ WHAT'S ACTUALLY BRILLIANT

1. **Comprehensive RLS Coverage** - Every table protected, excellent policy naming
2. **Security Fix Migrations** - Multiple passes fixing `search_path`, `security_invoker`
3. **Atomic Cart Operations** - `add_to_cart`, `remove_from_cart` are properly transactional
4. **Category Ancestors Pattern** - Using `category_ancestors` UUID[] with GIN index for hierarchical queries instead of recursive CTEs is SMART
5. **Variant-Aware Stock Management** - Final migration handles both product-level and variant-level stock decrement
6. **Generated Types** - `types.ts` exists and is comprehensive (2371 lines)
7. **`security_invoker` Views** - `deal_products` and similar views use `security_invoker = true`

---

## 📊 Migration Statistics

| Category | Count |
|----------|-------|
| Total Migrations | 45+ |
| RLS Policy Updates | 8+ |
| Index Modifications | 5+ |
| Security Fixes | 3+ |
| Schema Changes | 25+ |

---

## 🎯 TOP 5 PRIORITY FIXES

### 1. REGENERATE `schema.sql` (CRITICAL)
The base `schema.sql` is so out of date it's actively misleading developers. Either:
- Delete it entirely
- Regenerate from production with `pg_dump --schema-only`

### 2. CREATE DOWN MIGRATIONS (CRITICAL)
45 migrations with ZERO rollback capability. Create `*.down.sql` files for at least the critical migrations.

### 3. FIX MIGRATION TIMESTAMPS (HIGH)
```
20251124_audit_and_secure.sql → 20251124000100_audit_and_secure.sql
20251127_add_search_history.sql → 20251127100000_add_search_history.sql
```

### 4. CONSOLIDATE DUPLICATE POLICIES (HIGH)
Multiple migrations drop and recreate the same policies. Create a single migration that defines the canonical state.

### 5. ADD `supabase/config.toml` (MEDIUM)
For local development parity.

---

## Final Verdict

**Grade: B+**

The FOUNDATION is there. The security work is ACTUALLY IMPRESSIVE. But the DOCUMENTATION is a DISASTER, the migration history is a TANGLED MESS of time-traveling dependencies, and your `schema.sql` file is telling LIES.

Would be an A if you cleaned up the documentation and added rollback migrations.
