-- Complete Notifications System - Missing Triggers
-- Following best practices: No over-engineering, production-ready
-- Date: December 19, 2025

-- ============================================================================
-- TRIGGER: Notify SELLER when they receive a new order (purchase)
-- This is the missing piece - sellers need to know when someone buys their product
-- ============================================================================
CREATE OR REPLACE FUNCTION public.notify_seller_on_new_purchase()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  product_title TEXT;
  buyer_name TEXT;
BEGIN
  -- Get product title
  SELECT p.title INTO product_title
  FROM products p WHERE p.id = NEW.product_id;
  
  -- Get buyer name from order
  SELECT COALESCE(pr.display_name, pr.full_name, pr.username, 'A buyer')
  INTO buyer_name
  FROM orders o
  JOIN profiles pr ON o.user_id = pr.id
  WHERE o.id = NEW.order_id;
  
  -- Create notification for the seller
  INSERT INTO notifications (user_id, type, title, body, order_id, product_id, data)
  VALUES (
    NEW.seller_id,
    'purchase',
    'New Order! 🎉',
    COALESCE(buyer_name, 'Someone') || ' purchased "' || LEFT(COALESCE(product_title, 'your item'), 50) || '"' || 
    CASE WHEN LENGTH(COALESCE(product_title, '')) > 50 THEN '...' ELSE '' END,
    NEW.order_id,
    NEW.product_id,
    jsonb_build_object(
      'quantity', NEW.quantity,
      'price', NEW.price_at_purchase,
      'product_title', product_title,
      'buyer_name', buyer_name
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new purchases (INSERT on order_items)
DROP TRIGGER IF EXISTS on_new_purchase_notify_seller ON public.order_items;
CREATE TRIGGER on_new_purchase_notify_seller
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_seller_on_new_purchase();

-- ============================================================================
-- TRIGGER: Notify SELLER when someone follows their store
-- ============================================================================
CREATE OR REPLACE FUNCTION public.notify_seller_on_new_follower()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  follower_name TEXT;
  follower_username TEXT;
BEGIN
  -- Get follower info
  SELECT 
    COALESCE(pr.display_name, pr.full_name, pr.username, 'Someone'),
    pr.username
  INTO follower_name, follower_username
  FROM profiles pr WHERE pr.id = NEW.follower_id;
  
  -- Create notification for the seller
  INSERT INTO notifications (user_id, type, title, body, data)
  VALUES (
    NEW.seller_id,
    'system', -- Using 'system' type since 'new_follower' isn't in the enum
    'New Follower! 👤',
    COALESCE(follower_name, 'Someone') || ' started following your store',
    jsonb_build_object(
      'follower_id', NEW.follower_id,
      'follower_name', follower_name,
      'follower_username', follower_username,
      'event_type', 'new_follower'
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new followers
DROP TRIGGER IF EXISTS on_new_follower_notify_seller ON public.store_followers;
CREATE TRIGGER on_new_follower_notify_seller
  AFTER INSERT ON public.store_followers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_seller_on_new_follower();

-- ============================================================================
-- TRIGGER: Notify user when a wishlist item price drops
-- This enhances the existing system - only fires when is_on_sale becomes true
-- or when price decreases
-- ============================================================================
CREATE OR REPLACE FUNCTION public.notify_on_wishlist_price_drop()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger when price actually drops OR is_on_sale turns true
  IF (NEW.price < OLD.price) OR (NEW.is_on_sale = true AND OLD.is_on_sale = false) THEN
    -- Create notifications for all users with this product in wishlist
    INSERT INTO notifications (user_id, type, title, body, product_id, data)
    SELECT 
      w.user_id,
      'promotion',
      'Price Drop! 💸',
      '"' || LEFT(NEW.title, 50) || CASE WHEN LENGTH(NEW.title) > 50 THEN '...' ELSE '' END || 
      '" is now ' || 
      CASE 
        WHEN NEW.is_on_sale AND NEW.sale_percent > 0 THEN NEW.sale_percent || '% off!'
        ELSE 'on sale!'
      END,
      NEW.id,
      jsonb_build_object(
        'old_price', OLD.price,
        'new_price', NEW.price,
        'sale_percent', NEW.sale_percent,
        'is_on_sale', NEW.is_on_sale,
        'product_title', NEW.title
      )
    FROM wishlists w
    WHERE w.product_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for price drops (on products update)
DROP TRIGGER IF EXISTS on_price_drop_notify_wishlist ON public.products;
CREATE TRIGGER on_price_drop_notify_wishlist
  AFTER UPDATE ON public.products
  FOR EACH ROW
  WHEN (OLD.price IS DISTINCT FROM NEW.price OR OLD.is_on_sale IS DISTINCT FROM NEW.is_on_sale)
  EXECUTE FUNCTION public.notify_on_wishlist_price_drop();

-- ============================================================================
-- Add 'new_follower' and 'price_drop' to notification types (optional upgrade)
-- The current design uses 'system' and 'promotion' which is fine and doesn't
-- require schema changes. No over-engineering here.
-- ============================================================================

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.notify_seller_on_new_purchase() TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_seller_on_new_follower() TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_on_wishlist_price_drop() TO authenticated;

-- ============================================================================
-- SUMMARY OF COMPLETE NOTIFICATION TRIGGERS
-- ============================================================================
-- 1. on_message_notify (messages INSERT) - Notify recipient of new message ✅
-- 2. on_order_item_status_change_notify (order_items UPDATE) - Notify buyer of status change ✅
-- 3. on_review_notify_trigger (reviews INSERT) - Notify seller of new review ✅
-- 4. on_seller_feedback_notify_trigger (seller_feedback INSERT) - Notify seller of feedback ✅
-- 5. on_new_purchase_notify_seller (order_items INSERT) - Notify seller of new sale ✅ NEW
-- 6. on_new_follower_notify_seller (store_followers INSERT) - Notify seller of new follower ✅ NEW
-- 7. on_price_drop_notify_wishlist (products UPDATE) - Notify users of wishlist price drops ✅ NEW
