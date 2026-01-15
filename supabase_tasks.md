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

## Security Advisor Status (2026-01-15)

**0 WARN-level issues remaining** (fixes applied)

Explicitly accepted warnings:
- **materialized_view_in_api** (`category_stats`): Intentional. Public read-only view for category browse UI. Only SELECT granted to anon/authenticated.
- **auth_leaked_password_protection**: Dashboard-only toggle. See `TASK-enable-leaked-password-protection.md` — enable via Supabase Dashboard → Authentication → Settings.

## Performance Advisor Status (2026-01-15)

**0 WARN-level issues remaining** (fixes applied)

INFO-level unused indexes (keep for now, will be used in production):
- Foreign key indexes for joins (cart_items, order_items, notifications, etc.)
- Recently-added feature indexes (view_count, last_active, fulfillment_status)
- Pre-production system with low traffic — indexes not yet exercised

## Triggers Verification (2026-01-15)

- ✅ ONE stock decrement trigger (`trg_order_items_decrement_stock` on `order_items` BEFORE INSERT)
- ✅ NO stock triggers on `orders` table
- ✅ `handle_order_item_status_change()` uses correct buyer lookup via `orders.user_id`
