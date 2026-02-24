
-- Drop unused indexes identified by Supabase advisor
-- These indexes have never been used and add write overhead

DROP INDEX IF EXISTS idx_cart_items_variant_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;
DROP INDEX IF EXISTS idx_order_items_variant_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_user_badges_badge_id;
DROP INDEX IF EXISTS idx_business_verification_verified_by;
DROP INDEX IF EXISTS idx_buyer_feedback_order_id;
DROP INDEX IF EXISTS idx_conversations_order_id;
DROP INDEX IF EXISTS idx_listing_boosts_product_id;
DROP INDEX IF EXISTS idx_notifications_conversation_id;
DROP INDEX IF EXISTS idx_notifications_order_id;
DROP INDEX IF EXISTS idx_notifications_product_id;
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP INDEX IF EXISTS idx_seller_feedback_order_id;
DROP INDEX IF EXISTS idx_wishlists_product_id;
;
