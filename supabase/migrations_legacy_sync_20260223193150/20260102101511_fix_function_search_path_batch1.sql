
-- Fix search_path for cart functions and others - batch 1

-- Drop and recreate cleanup_sold_wishlist_items with proper return type
DROP FUNCTION IF EXISTS cleanup_sold_wishlist_items();

CREATE FUNCTION cleanup_sold_wishlist_items()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM wishlists w
  WHERE EXISTS (
    SELECT 1 FROM products p 
    WHERE p.id = w.product_id 
    AND (p.stock <= 0 OR p.status = 'archived')
  );
END;
$$;

-- Fix cart_add_item
ALTER FUNCTION cart_add_item(uuid, uuid, integer) SET search_path = public;

-- Fix cart_clear  
ALTER FUNCTION cart_clear() SET search_path = public;

-- Fix cart_set_quantity
ALTER FUNCTION cart_set_quantity(uuid, integer, uuid) SET search_path = public;

-- Fix expire_listing_boosts
ALTER FUNCTION expire_listing_boosts() SET search_path = public;

-- Fix get_category_ancestor_ids
ALTER FUNCTION get_category_ancestor_ids(uuid) SET search_path = public;

-- Fix get_user_conversation_ids
ALTER FUNCTION get_user_conversation_ids(uuid) SET search_path = public;

-- Fix handle_new_product_search
ALTER FUNCTION handle_new_product_search() SET search_path = public;

-- Fix increment_helpful_count
ALTER FUNCTION increment_helpful_count(uuid) SET search_path = public;

-- Fix init_business_verification
ALTER FUNCTION init_business_verification() SET search_path = public;

-- Fix init_seller_stats
ALTER FUNCTION init_seller_stats() SET search_path = public;

-- Fix init_user_verification
ALTER FUNCTION init_user_verification() SET search_path = public;

-- Fix is_admin
ALTER FUNCTION is_admin() SET search_path = public;
;
