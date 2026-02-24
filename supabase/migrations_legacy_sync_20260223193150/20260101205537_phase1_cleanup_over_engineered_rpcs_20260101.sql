-- =====================================================
-- SUPABASE CLEANUP: Remove Over-Engineered RPC Functions
-- =====================================================
-- 
-- Best Practices Applied:
-- 1. Use native Supabase client methods instead of RPC wrappers
-- 2. Keep triggers and security-critical functions
-- 3. Remove functions that wrap simple queries
-- 4. Drop unused indexes (60+ flagged by advisors)
--
-- What we're removing:
-- - get_seller_stats: Simple join, use direct query
-- - get_seller_listing_info: COUNT + JOIN, use direct query  
-- - get_seller_subscription_status: Simple SELECT, use direct query
-- - get_category_hierarchy: category_ancestors array + .filter() is better
-- - get_category_descendants: same reason
-- - get_unread_notification_count: Simple COUNT, use direct query
--
-- What we're KEEPING:
-- - All trigger functions (data integrity)
-- - Atomic operations (cart_*, increment_*, mark_*)
-- - Complex join RPCs (conversations, messages, wishlist sharing)
-- - Security functions (block/unblock users)
-- - Utility functions used by triggers
-- =====================================================

-- =====================================================
-- STEP 1: DROP OVER-ENGINEERED RPC FUNCTIONS
-- =====================================================

-- These can all be replaced with direct Supabase client queries

-- get_seller_stats: Just a JOIN between profiles, products, order_items
-- Client can do: supabase.from('profiles').select('*, products(count), order_items(count)').eq('id', sellerId)
DROP FUNCTION IF EXISTS public.get_seller_stats(uuid);

-- get_seller_listing_info: COUNT + LEFT JOINs
-- Client can do: supabase.from('products').select('*', { count: 'exact' }).eq('seller_id', id).eq('status', 'active')
--   + supabase.from('subscriptions').select('*, subscription_plans(*)').eq('seller_id', id).eq('status', 'active')
DROP FUNCTION IF EXISTS public.get_seller_listing_info(uuid);

-- get_seller_subscription_status: Simple JOIN
-- Client can do: supabase.from('subscriptions').select('*, subscription_plans(*)').eq('seller_id', id).eq('status', 'active').single()
DROP FUNCTION IF EXISTS public.get_seller_subscription_status(uuid);

-- get_category_hierarchy: Recursive CTE - but we now use category_ancestors array with GIN index
-- Client can do: supabase.from('categories').select('*').filter('parent_id', 'is', null)
--   OR use category_ancestors array on products for filtering
DROP FUNCTION IF EXISTS public.get_category_hierarchy(text, integer);

-- get_category_descendants: Same as above - use category_ancestors array
-- This is only used in categories API route, can be replaced with recursive query in SQL or simple filter
DROP FUNCTION IF EXISTS public.get_category_descendants(text, integer);

-- get_unread_notification_count: Simple COUNT
-- Client can do: supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', id).eq('is_read', false)
DROP FUNCTION IF EXISTS public.get_unread_notification_count();

-- =====================================================
-- STEP 2: DROP UNUSED INDEXES (flagged by Supabase advisors)
-- =====================================================
-- These indexes have NEVER been used and just consume storage/slow writes

-- Reviews table (5 unused indexes)
DROP INDEX IF EXISTS idx_reviews_created_at;
DROP INDEX IF EXISTS idx_reviews_user_id;
DROP INDEX IF EXISTS idx_reviews_rating;
DROP INDEX IF EXISTS idx_reviews_helpful_count;
DROP INDEX IF EXISTS idx_reviews_verified_purchase;
DROP INDEX IF EXISTS idx_reviews_product_rating;

-- Conversations table (2 unused indexes)
DROP INDEX IF EXISTS idx_conversations_order_id;
DROP INDEX IF EXISTS idx_conversations_last_message;

-- Profiles table (4 unused indexes)
DROP INDEX IF EXISTS idx_profiles_is_seller;
DROP INDEX IF EXISTS idx_profiles_account_type;
DROP INDEX IF EXISTS idx_profiles_shipping_region;
DROP INDEX IF EXISTS idx_profiles_default_city;

-- Product variants table (4 unused indexes - 0 rows anyway)
DROP INDEX IF EXISTS idx_product_variants_product_id;
DROP INDEX IF EXISTS idx_product_variants_sku;
DROP INDEX IF EXISTS idx_product_variants_size;
DROP INDEX IF EXISTS idx_product_variants_color;

-- Products table (14 unused indexes)
DROP INDEX IF EXISTS idx_products_meta;
DROP INDEX IF EXISTS idx_products_free_shipping;
DROP INDEX IF EXISTS idx_products_featured;
DROP INDEX IF EXISTS idx_products_ships_to_bulgaria;
DROP INDEX IF EXISTS idx_products_attr_size;
DROP INDEX IF EXISTS idx_products_attr_color;
DROP INDEX IF EXISTS idx_products_attr_condition;
DROP INDEX IF EXISTS idx_products_attr_brand;
DROP INDEX IF EXISTS idx_products_attr_material;
DROP INDEX IF EXISTS idx_products_title_trgm;
DROP INDEX IF EXISTS idx_products_sku;
DROP INDEX IF EXISTS idx_products_barcode;
DROP INDEX IF EXISTS idx_products_seller_city;

-- Order items table (2 unused indexes)
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_order_items_status;

-- Wishlists table (3 unused indexes)
DROP INDEX IF EXISTS idx_wishlists_product_id;
DROP INDEX IF EXISTS idx_wishlists_share_token;
DROP INDEX IF EXISTS idx_wishlists_public;

-- Cart items table (1 unused index)
DROP INDEX IF EXISTS idx_cart_items_product_id;

-- Buyer/Seller feedback tables (4 unused indexes)
DROP INDEX IF EXISTS idx_buyer_feedback_order_id;
DROP INDEX IF EXISTS idx_buyer_feedback_rating;
DROP INDEX IF EXISTS idx_seller_feedback_order_id;
DROP INDEX IF EXISTS idx_seller_feedback_rating;
DROP INDEX IF EXISTS idx_seller_feedback_created_desc;

-- Subscriptions table (1 unused index)
DROP INDEX IF EXISTS idx_subscriptions_stripe_sub;

-- Product attributes table (1 unused index)
DROP INDEX IF EXISTS idx_product_attributes_filterable;

-- User payment methods table (1 unused index)
DROP INDEX IF EXISTS idx_user_payment_methods_stripe;

-- Listing boosts table (1 unused index)
DROP INDEX IF EXISTS idx_listing_boosts_product_id;

-- Badge definitions table (3 unused indexes)
DROP INDEX IF EXISTS idx_badge_definitions_category;
DROP INDEX IF EXISTS idx_badge_definitions_account_type;
DROP INDEX IF EXISTS idx_badge_definitions_active;

-- User badges table (2 unused indexes)
DROP INDEX IF EXISTS idx_user_badges_badge;
DROP INDEX IF EXISTS idx_user_badges_awarded;

-- Business verification table (2 unused indexes)
DROP INDEX IF EXISTS idx_business_verification_verified_by;
DROP INDEX IF EXISTS idx_business_verification_vat;

-- Notifications table (6 unused indexes)
DROP INDEX IF EXISTS idx_notifications_conversation_id;
DROP INDEX IF EXISTS idx_notifications_order_id;
DROP INDEX IF EXISTS idx_notifications_product_id;
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP INDEX IF EXISTS idx_notifications_user_unread;
DROP INDEX IF EXISTS idx_notifications_created_at;
DROP INDEX IF EXISTS idx_notifications_type;

-- User verification table (2 unused indexes)
DROP INDEX IF EXISTS idx_user_verification_user_id;
DROP INDEX IF EXISTS idx_user_verification_trust;

-- Seller/Buyer stats tables (4 unused indexes)
DROP INDEX IF EXISTS idx_seller_stats_rating;
DROP INDEX IF EXISTS idx_seller_stats_sales;
DROP INDEX IF EXISTS idx_buyer_stats_rating;
DROP INDEX IF EXISTS idx_buyer_stats_orders;
;
