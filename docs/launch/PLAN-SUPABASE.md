# Supabase Production Hardening Plan (AI-Executable)

## Goal

Make the production Supabase instance **correct, secure, and predictable**:
- No trigger/policy landmines
- Storage buckets match app usage
- Security/performance advisors are green (or explicitly accepted)

## Preconditions

- You have Supabase dashboard access and/or MCP tools for DB queries.
- You know which Supabase project is production vs staging.
- You will apply DDL only via migrations (never ad-hoc edits).

## 1) Migrations: verify and apply (hard gate)

### 1.1 Verify remote has the critical fixes

Confirm these migrations are applied in the target DB:
- `20260110153000_fix_double_stock_decrement.sql`
- `20260110153100_fix_handle_order_item_status_change.sql`
- `20260110153300_ensure_avatars_bucket_and_policies.sql`

**Acceptance:** remote `supabase_migrations.schema_migrations` contains these versions.

### 1.2 Apply missing migrations

Apply via your standard migration workflow (Supabase CLI or MCP-driven SQL).
After applying, re-run the verification in 1.1.

## 2) Storage buckets: must match app behavior

### 2.1 Required buckets

- `product-images` (public read; uploads via `app/api/upload-image/route.ts`)
- `avatars` (public read; per-user folder write policies)

If `avatars` is missing, apply:
- `supabase/migrations/20260110153300_ensure_avatars_bucket_and_policies.sql`

### 2.2 Validate with app behavior

- Upload avatar from onboarding/profile flows and confirm URL is readable.
- Upload product image and confirm URL is readable.

## 3) RLS verification (table-by-table)

For each table below, verify:
- RLS enabled, and policies cover SELECT/INSERT/UPDATE/DELETE as intended.
- Policies use `(select auth.uid())` when applicable (perf).
- Service role is only used for internal/webhook/admin operations.

High-priority tables:
- `profiles`
- `products`, `product_variants`
- `orders`, `order_items`, `return_requests`
- `conversations`, `messages`
- `reviews`, `seller_feedback`, `seller_stats`
- `subscriptions`, `subscription_plans`, `listing_boosts`
- `user_payment_methods`, `user_addresses`

**Acceptance:** user-facing writes are not possible without auth and ownership constraints.

## 4) Triggers & functions correctness

### 4.1 Checkout/stock decrement

Verify only ONE stock decrement mechanism runs on `order_items` insert (variant-aware).
Target state:
- BEFORE INSERT: `trg_order_items_decrement_stock` exists
- AFTER INSERT: legacy `update_product_stock_on_order` does **not** exist

### 4.2 Order status → chat system messages

Verify `handle_order_item_status_change()` uses the correct buyer id lookup (no tautologies).

### 4.3 search_path warnings

Run Supabase Security Advisor and address any “mutable search_path” warnings by setting:
- `SECURITY DEFINER`
- `SET search_path TO 'public'` (or `public, pg_temp`) in functions

## 5) Supabase advisors (hard gate)

### 5.1 Security advisor

Goal: **0 warnings**, or document explicit acceptance with rationale.
Include the “leaked password protection” decision (dashboard setting) — see `TASK-enable-leaked-password-protection.md`.

### 5.2 Performance advisor

Do not blindly apply index DDL.
For each recommendation:
- confirm query patterns in app
- confirm expected cardinality/selectivity
- decide keep/drop with a short note in `supabase_tasks.md`

## 6) Backups + environment hygiene

- Ensure automated backups are enabled for production.
- Confirm staging and production do not share auth settings, redirect URLs, or Stripe keys.

