
-- Fix search_path for remaining functions - batch 2

-- Fix on_listing_boost_created
ALTER FUNCTION on_listing_boost_created() SET search_path = public;

-- Fix on_review_notify
ALTER FUNCTION on_review_notify() SET search_path = public;

-- Fix on_seller_feedback_notify
ALTER FUNCTION on_seller_feedback_notify() SET search_path = public;

-- Fix order_items_decrement_stock
ALTER FUNCTION order_items_decrement_stock() SET search_path = public;

-- Fix protect_sensitive_columns
ALTER FUNCTION protect_sensitive_columns() SET search_path = public;

-- Fix queue_badge_evaluation
ALTER FUNCTION queue_badge_evaluation() SET search_path = public;

-- Fix update_follower_count
ALTER FUNCTION update_follower_count() SET search_path = public;

-- Fix update_product_category_ancestors
ALTER FUNCTION update_product_category_ancestors() SET search_path = public;

-- Fix update_product_rating
ALTER FUNCTION update_product_rating() SET search_path = public;

-- Fix update_product_stock
ALTER FUNCTION update_product_stock() SET search_path = public;

-- Fix update_seller_five_star_count
ALTER FUNCTION update_seller_five_star_count() SET search_path = public;

-- Fix update_seller_listing_counts
ALTER FUNCTION update_seller_listing_counts() SET search_path = public;

-- Fix update_seller_rating
ALTER FUNCTION update_seller_rating() SET search_path = public;

-- Fix update_seller_sales_stats
ALTER FUNCTION update_seller_sales_stats() SET search_path = public;

-- Fix update_seller_stats_from_feedback
ALTER FUNCTION update_seller_stats_from_feedback() SET search_path = public;
;
