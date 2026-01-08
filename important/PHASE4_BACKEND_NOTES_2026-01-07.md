# Phase 4: Backend caching, data hygiene, and API correctness (2026-01-07)

## What changed
- Stripe webhooks
  - app/api/payments/webhook/route.ts
    - Moved `createAdminClient()` into the handler (avoid module-level client in serverless)
    - Switched `.single()` -> `.maybeSingle()` for payment method existence check
    - Added `.limit(1)` for default-card existence check
  - app/api/checkout/webhook/route.ts
    - Validates `session.metadata.items_json` via zod
    - Removes an extra Stripe call on the retry/idempotency path
    - Projects order insert select to `id` only
  - app/api/subscriptions/webhook/route.ts
    - Clamps listing boost duration days
    - Adds an idempotency guard for “already active boost” rows
    - Verifies Stripe `unit_amount` matches the DB plan price (defense-in-depth)

- Public API input validation
  - app/api/products/search/route.ts: zod-validated `q` + `limit`
  - app/api/products/feed/route.ts: zod-validated `type`/`category`/`city` (length clamped)

- Mutation hygiene
  - app/api/products/create/route.ts: reduced insert select to `id` only

## Supabase performance advisors
- INFO only: unused indexes flagged (no missing indexes).
  - `idx_buyer_feedback_order_id` on `public.buyer_feedback`
  - `idx_conversations_order_id` on `public.conversations`
  - `idx_listing_boosts_product_id` on `public.listing_boosts`
  - `idx_notifications_*` on `public.notifications` (user_id/order_id/product_id/conversation_id)
  - `idx_seller_feedback_order_id` on `public.seller_feedback`
  - `idx_cart_items_product_id`, `idx_cart_items_variant_id` on `public.cart_items`
  - `idx_order_items_product_id`, `idx_order_items_variant_id` on `public.order_items`
  - `idx_user_badges_badge_id` on `public.user_badges`
  - `idx_business_verification_verified_by` on `public.business_verification`

## Verification
- `pnpm -s exec tsc -p tsconfig.json --noEmit` (pass)
- `pnpm -s exec cross-env REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium`
  - 14 passed
  - 1 failed: “404 page shows error state for unknown routes” (pre-existing)

## Risk / Follow-ups
- Stripe subscription price check assumes DB prices are stored in major currency units (Stripe `unit_amount / 100`). If prices are stored as cents already, adjust the comparison.
- Fix the pre-existing E2E smoke 404 test failure.
