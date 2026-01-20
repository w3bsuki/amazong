# Supabase Tasks (Production)

This file exists because `docs/PRODUCTION.md` references it.

Primary plan:
- `docs/launch/PLAN-SUPABASE.md`

## Critical migrations status

All critical migrations applied (with different timestamps):
- ✅ `20260110182418_fix_double_stock_decrement` 
- ✅ `20260110182427_fix_handle_order_item_status_change`
- ✅ `20260110182439_ensure_avatars_bucket_and_policies`

Additional fixes applied 2026-01-15:
- ✅ `fix_security_advisor_warnings` - Fixed `increment_view_count` search_path
- ✅ `fix_performance_advisor_warnings` - Fixed RLS initplan on `listing_boosts`, merged return_requests policies

Additional fixes applied 2026-01-20:
- ✅ `20260120_fix_normalize_attribute_key_search_path` - Fixed `normalize_attribute_key` search_path

## Security Advisor Status (2026-01-20)

**0 actionable WARN-level issues** (2 explicitly accepted)

Fixed 2026-01-20:
- ✅ `function_search_path_mutable` (`normalize_attribute_key`) — Fixed via migration

Explicitly accepted warnings:
- **materialized_view_in_api** (`category_stats`): Intentional. Public read-only view for category browse UI. Only SELECT granted to anon/authenticated. No PII exposed.
- **auth_leaked_password_protection**: Dashboard-only toggle. See `TASK-enable-leaked-password-protection.md` — enable via Supabase Dashboard → Authentication → Settings.

## Performance Advisor Status (2026-01-20)

**0 WARN-level issues** (28 INFO-level unused indexes)

INFO-level deferred:
- 3 RLS initplan warnings on admin tables (`admin_docs`, `admin_tasks`, `admin_notes`) — low impact, admin-only
- Unused FK indexes — will be used as traffic grows

INFO-level unused indexes (keep for now, will be used in production):
- Foreign key indexes for joins (cart_items, order_items, notifications, etc.)
- Recently-added feature indexes (view_count, last_active, fulfillment_status)
- Pre-production system with low traffic — indexes not yet exercised

## Storage Buckets Status (2026-01-20)

- ✅ `avatars` bucket — public read, authenticated write
- ✅ `product-images` bucket — public read, authenticated write (189 objects)
- ✅ All required RLS policies in place

## Function Drift Status (2026-01-20)

- ✅ `validate_username` — Single canonical definition with `SET search_path TO 'public'`
- ✅ `normalize_attribute_key` — Fixed search_path 2026-01-20

## Buyer Protection Columns (P3-MON-01)

Added via `20260119230508_buyer_protection_fees`:
- ✅ `buyer_protection_percent` (default 4.0)
- ✅ `buyer_protection_fixed` (default 0.50)
- ✅ `buyer_protection_cap` (default 15.00)
- ✅ `seller_fee_percent` (default 0)

## Triggers Verification (2026-01-15)

- ✅ ONE stock decrement trigger (`trg_order_items_decrement_stock` on `order_items` BEFORE INSERT)
- ✅ NO stock triggers on `orders` table
- ✅ `handle_order_item_status_change()` uses correct buyer lookup via `orders.user_id`

## Remaining Manual Actions

1. **Enable leaked password protection** (Dashboard only)
   - Path: Supabase Dashboard → Authentication → Settings → Password Security
   - Reference: `TASK-enable-leaked-password-protection.md`
