-- PHASE 2 — Index cleanup
--
-- Drop indexes confirmed unused / low value. Use IF EXISTS for idempotency.

BEGIN;

-- Unused (Supabase Performance Advisor)
DROP INDEX IF EXISTS public.idx_listing_boosts_stripe_session;
DROP INDEX IF EXISTS public.idx_listing_boosts_product_id;
DROP INDEX IF EXISTS public.idx_admin_docs_status;
DROP INDEX IF EXISTS public.idx_admin_tasks_status;
DROP INDEX IF EXISTS public.idx_admin_tasks_priority;
DROP INDEX IF EXISTS public.idx_admin_tasks_assigned_to;
DROP INDEX IF EXISTS public.idx_admin_tasks_created_by;
DROP INDEX IF EXISTS public.idx_admin_notes_pinned;
DROP INDEX IF EXISTS public.idx_admin_notes_author_id;
DROP INDEX IF EXISTS public.idx_conversations_order_id;
DROP INDEX IF EXISTS public.idx_notifications_user_id;
DROP INDEX IF EXISTS public.idx_notifications_order_id;
DROP INDEX IF EXISTS public.idx_notifications_product_id;
DROP INDEX IF EXISTS public.idx_notifications_conversation_id;
DROP INDEX IF EXISTS public.idx_cart_items_product_id;
DROP INDEX IF EXISTS public.idx_cart_items_variant_id;
DROP INDEX IF EXISTS public.idx_order_items_variant_id;
DROP INDEX IF EXISTS public.idx_user_badges_badge_id;
DROP INDEX IF EXISTS public.idx_business_verification_verified_by;
DROP INDEX IF EXISTS public.orders_fulfillment_status_idx;
DROP INDEX IF EXISTS public.return_requests_order_item_id_idx;
DROP INDEX IF EXISTS public.return_requests_buyer_id_idx;
DROP INDEX IF EXISTS public.idx_profiles_last_active;

-- Low-value (products table over-indexed for current row count)
DROP INDEX IF EXISTS public.idx_products_ships_to_europe;
DROP INDEX IF EXISTS public.idx_products_ships_to_uk;
DROP INDEX IF EXISTS public.idx_products_ships_to_usa;
DROP INDEX IF EXISTS public.idx_products_ships_to_worldwide;
DROP INDEX IF EXISTS public.idx_products_condition;
DROP INDEX IF EXISTS public.idx_products_view_count;

COMMIT;

-- Verify (run separately):
--   SELECT count(*) FROM pg_indexes WHERE schemaname = 'public';
-- Expect: count decreases by 29 compared to pre-migration.

