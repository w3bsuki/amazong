# Supabase Tasks (execute via Supabase MCP)

Last updated: 2026-01-05

## P0 — Security gate

1) **Run security advisors**
   - `mcp_supabase_get_advisors({ type: "security" })`
   - Expectation: **0 warnings** (or explicitly accepted, documented).

   Status (2026-01-05): **WARN**
   - `auth_leaked_password_protection`: Leaked Password Protection Disabled

2) **Enable leaked password protection (Dashboard)**
   - Supabase Dashboard -> Authentication -> Settings -> enable **Leaked Password Protection**
   - After enabling, re-run security advisors to confirm warning cleared.

   Status (2026-01-05): **DEFERRED (Dashboard-only)**
   - Blocker: requires custom email setup (per project requirements) before enabling.
   - After enabling, run: `mcp_supabase_get_advisors({ type: "security" })` and ensure **0 warnings**.

## P0 — RLS policy performance sanity check

3) **Verify no bare `auth.uid()` policies**
   - Run:
     - `mcp_supabase_execute_sql({ query: \"SELECT schemaname, tablename, policyname, qual, with_check FROM pg_policies WHERE schemaname = 'public' AND ((qual ~ 'auth\\\\.uid\\\\(\\\\)' AND qual !~* 'select\\\\s+auth\\\\.uid\\\\(\\\\)') OR (with_check ~ 'auth\\\\.uid\\\\(\\\\)' AND with_check !~* 'select\\\\s+auth\\\\.uid\\\\(\\\\)'));\" })`
   - Expectation: **0 rows**.

   Status (2026-01-05): **PASS**
   - Result: **0 rows**

## P1 — Performance advisors snapshot (post-launch candidate)

4) **Run performance advisors**
   - `mcp_supabase_get_advisors({ type: "performance" })`
   - If there are many unused indexes, capture list but defer removals until post-launch unless there's a clear write-amplification issue.
   - Optional verification (post-launch): confirm `idx_scan = 0` and no recent usage before dropping anything.

   Status (2026-01-05): **INFO only**
   - Unused index lints reported (capture for post-launch cleanup):
     - `idx_buyer_feedback_order_id` on `public.buyer_feedback`
     - `idx_conversations_order_id` on `public.conversations`
     - `idx_listing_boosts_product_id` on `public.listing_boosts`
     - `idx_notifications_user_id` / `idx_notifications_order_id` / `idx_notifications_product_id` / `idx_notifications_conversation_id` on `public.notifications`
     - `idx_seller_feedback_order_id` on `public.seller_feedback`
     - `idx_cart_items_product_id` / `idx_cart_items_variant_id` on `public.cart_items`
     - `idx_order_items_product_id` / `idx_order_items_variant_id` on `public.order_items`
     - `idx_user_badges_badge_id` on `public.user_badges`
     - `idx_business_verification_verified_by` on `public.business_verification`
