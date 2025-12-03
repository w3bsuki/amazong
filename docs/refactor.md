# Category Documentation Refactor Plan

**Created:** December 2025  
**Updated:** December 3, 2025  
**Status:** ✅ DECISIONS FINALIZED - Ready to Execute  
**Priority:** High  

---

## Executive Summary

Our category documentation (`automotive.md`, `electronics.md`, `fashion.md`, `home.md`) is well-structured but has schema mismatches with our existing Supabase database. This document outlines a plan to align all docs with Supabase best practices and our current database schema.

**⚠️ KEY DECISIONS MADE (December 3, 2025):**
1. **Shipping:** KEEP existing booleans (Option A) ✅
2. **Category IDs:** Use UUID with slug-based parent lookups ✅  
3. **JSONB + EAV:** Use BOTH - JSONB for filtering, EAV for forms ✅
4. **Migration:** Single migration file for all changes ✅

---

## Current State Analysis

### ✅ What's Working Well

| Item | Status |
|------|--------|
| **IMPLEMENTATION.md** | Production ready, follows KISS philosophy |
| **Category structure** | Well-organized hierarchies |
| **Attribute schemas** | Comprehensive Zod schemas |
| **Template consistency** | All category docs follow `_templates/category-template.md` |
| **JSONB approach** | Confirmed as best practice by Supabase docs |
| **GIN indexes** | Correct for containment queries |

### ⚠️ Schema Mismatches to Fix

| Issue | Current Database | Docs Propose | Resolution |
|-------|------------------|--------------|------------|
| **Category IDs** | `UUID` (auto-generated) | `TEXT` (explicit) | Remove explicit IDs from SQL, let UUID generate |
| **Shipping columns** | Boolean flags (`ships_to_bulgaria`, `ships_to_europe`, etc.) | `ships_to TEXT[]` + `shipping_costs JSONB` | Keep existing booleans OR migrate to arrays (decide) |
| **Product attributes** | Missing `attributes JSONB` column | `attributes JSONB` | Add column via migration |
| **Category columns** | Missing `full_slug`, `level`, `display_order`, SEO fields | Proposed in docs | Add via migration OR remove from docs (KISS) |

---

## Decision Points

### 1. Shipping Approach 🚢 - ✅ DECIDED: Option A

**Option A: Keep Booleans (CHOSEN - KISS)** ✅
```sql
-- Already exists in products table:
ships_to_bulgaria BOOLEAN DEFAULT true
ships_to_europe BOOLEAN DEFAULT false
ships_to_usa BOOLEAN DEFAULT false
ships_to_worldwide BOOLEAN DEFAULT false
pickup_only BOOLEAN DEFAULT false
```
- ✅ Already works with 214 products
- ✅ Simple filtering: `.eq('ships_to_europe', true)`
- ✅ No migration needed for shipping
- ❌ Less flexible (fixed regions) - acceptable tradeoff

**Option B: Migrate to Arrays** ❌ REJECTED
- Would require data migration for 214 products
- Complexity not justified for Bulgaria-focused marketplace

---

### 2. Category Extra Columns 📂 - ✅ DECIDED: Minimal Addition

**CHOSEN: Add only `display_order`** ✅
- `display_order INTEGER` - For mega-menu sorting (ADDED via migration)

**NOT ADDING:**
- `full_slug` - Compute at runtime from parent chain
- `level` - Compute from depth in TypeScript
- SEO columns - Use next-intl translations instead

**Reasoning:** KISS principle. Categories table already has 374 rows working fine.

---

## Refactor Tasks - ✅ EXECUTION PLAN

### Phase 1: Fix SQL Seed Data (All Category Docs) - REQUIRED

Update these files to use **slug-based parent lookups** (NOT explicit TEXT IDs):

1. [x] `docs/automotive.md` - Has explicit IDs, needs update
2. [x] `docs/electronics.md` - Has explicit IDs, needs update  
3. [x] `docs/fashion.md` - Has explicit IDs, needs update
4. [x] `docs/home.md` - Has explicit IDs, needs update
5. [ ] All other category docs - Same pattern

**Before (Wrong - explicit TEXT IDs):**
```sql
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon) VALUES
('vehicles', 'Vehicles', 'Превозни средства', 'vehicles', 'automotive', '🚗'),
```

**After (Correct - UUID with slug lookups):**
```sql
-- Step 1: Insert parent category first (UUID auto-generated)
INSERT INTO categories (name, name_bg, slug, icon, display_order)
VALUES ('Automotive', 'Автомобили', 'automotive', '🚗', 1)
ON CONFLICT (slug) DO NOTHING;

-- Step 2: Insert children referencing parent by slug subquery
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Vehicles', 'Превозни средства', 'vehicles', 
       (SELECT id FROM categories WHERE slug = 'automotive'), '🚘', 1
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'vehicles');
```

### Phase 2: IMPLEMENTATION.md - ✅ COMPLETED

- [x] Updated shipping section to match existing booleans
- [x] Added note about existing `category_attributes` and `product_attributes` tables
- [x] Clarified JSONB + EAV hybrid approach
- [x] Migration file name updated with correct timestamp

### Phase 3: Single Database Migration - READY TO EXECUTE

Migration file: `supabase/migrations/20251203_product_attributes_and_display_order.sql`

**What it adds:**
- `products.attributes JSONB DEFAULT '{}'`
- `categories.display_order INTEGER DEFAULT 0`
- GIN index on attributes
- Expression indexes for make, year, brand, condition

**Run command:**
```bash
supabase db push
```

---

## Updated Category Doc Structure

Each category doc should have:

```markdown
# [Category] Categories

## Overview
- Total categories: X
- Subcategory depth: Y levels

## Category Hierarchy
[Markdown tree or table]

## Attribute Schemas (Zod)
[TypeScript interfaces]

## SQL Seed Data
[Use slug-based parent lookups, NOT explicit IDs]

## next-intl Translations
[JSON for messages/en.json and messages/bg.json]

## PostgREST Filter Examples
[How to query with .contains(), .cs., etc.]
```

---

## Best Practices Confirmed

From Supabase documentation research:

### JSONB Best Practices ✅
1. **Use JSONB not JSON** - Binary format, faster processing
2. **Use GIN indexes** for containment queries (`@>` / `.contains()`)
3. **Use expression indexes** for frequently filtered keys (`(attributes->>'make')`)
4. **Use `->` for JSONB, `->>` for text** extraction
5. **Keep JSONB simple** - Don't nest deeply, flat is better

### PostgREST Filtering ✅
1. **Use `.contains()`** for JSONB: `.contains('attributes', { make: 'BMW' })`
2. **Use `.cs.`** for arrays: `.or('ships_to.cs.{EU},ships_to.cs.{WORLDWIDE}')`
3. **Avoid RPC** when PostgREST operators work

### Index Types ✅
1. **GIN** - JSONB containment, array operations
2. **B-tree** - Scalar comparisons (price, date, year)
3. **BRIN** - Monotonically increasing columns (created_at)
4. **Partial indexes** - Conditional queries (WHERE status = 'active')

### Security ✅
1. **RLS on all tables** - Already enabled ✓
2. **Auth checks in Server Actions** - Fast-fail pattern
3. **Zod validation** - Before database operations
4. **pg_jsonschema available** - For DB-level validation (optional)

---

## Files to Update

| File | Changes Needed |
|------|----------------|
| `docs/IMPLEMENTATION.md` | Update shipping section to match existing booleans |
| `docs/automotive.md` | Fix SQL to use slug-based parent lookups |
| `docs/electronics.md` | Fix SQL to use slug-based parent lookups |
| `docs/fashion.md` | Fix SQL to use slug-based parent lookups |
| `docs/home.md` | Fix SQL to use slug-based parent lookups |
| `docs/guide.md` | Add note about EAV + JSONB hybrid approach |

---

## Migration Checklist

### Before Running Migration
- [ ] Backup database (or use branch if available)
- [ ] Test migration on dev branch first
- [ ] Verify 214 existing products won't break

### Migration Steps
- [ ] Run `supabase/migrations/YYYYMMDD_product_attributes_and_display_order.sql`
- [ ] Verify indexes created: `\di` in psql
- [ ] Test JSONB queries work

### After Migration
- [ ] Update product form to save to `attributes` JSONB
- [ ] Add sync trigger/logic for EAV ↔ JSONB
- [ ] Update product queries to use `.contains()`

---

## Time Estimate

| Task | Time |
|------|------|
| Fix SQL in 4 category docs | 1 hour |
| Update IMPLEMENTATION.md | 30 min |
| Create and test migration | 1 hour |
| Update product form | 1 hour |
| Test filtering | 1 hour |
| **Total** | **4-5 hours** |

---

## Success Criteria

1. ✅ All SQL seed data works with UUID primary keys
2. ✅ `products.attributes` JSONB column exists with GIN index
3. ✅ PostgREST filtering works: `.contains('attributes', { make: 'BMW' })`
4. ✅ Existing boolean shipping columns still work
5. ✅ Documentation matches actual schema
6. ✅ No over-engineering - KISS principle maintained

---

## Security Advisory Note

From Supabase advisor: **Leaked Password Protection is Disabled**

Recommendation: Enable HaveIBeenPwned check in Auth settings to prevent users from using compromised passwords.

Dashboard: Settings → Auth → Security → Enable "Check passwords against HaveIBeenPwned"

---

**Document Status:** 📋 Planning  
**Last Updated:** December 2025
