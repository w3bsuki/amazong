-- Phase 2: Security and Performance Fixes
-- Migration: 20251217000000_phase2_security_performance.sql
-- 
-- This migration addresses issues identified by Supabase advisors:
-- 1. SECURITY: Function search_path vulnerability (handle_new_user, auto_set_seller_flag)
-- 2. SECURITY: deal_products view SECURITY DEFINER concern (recreate with security_invoker)
-- 3. PERFORMANCE: RLS policies re-evaluating auth.uid() per row (wrap in SELECT)
-- 4. PERFORMANCE: Duplicate permissive policies (remove redundant ones)
-- 5. PERFORMANCE: Missing foreign key indexes

-- =============================================================================
-- PART 1: Fix Security Definer Functions (add search_path)
-- =============================================================================

-- Fix handle_new_user function - add search_path security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role, username)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url',
        'buyer',
        NULLIF(LOWER(NEW.raw_user_meta_data->>'username'), '')
    );
    
    INSERT INTO public.buyer_stats (user_id) VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO public.user_verification (user_id, email_verified)
    VALUES (NEW.id, NEW.email_confirmed_at IS NOT NULL)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$function$;

-- Fix auto_set_seller_flag function - add search_path security
CREATE OR REPLACE FUNCTION public.auto_set_seller_flag()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    UPDATE public.profiles
    SET is_seller = true
    WHERE id = NEW.seller_id AND is_seller = false;
    
    RETURN NEW;
END;
$function$;

-- =============================================================================
-- PART 2: Fix deal_products view (use security_invoker instead of definer)
-- =============================================================================

-- Recreate view with security_invoker for Postgres 15+
DROP VIEW IF EXISTS deal_products;
CREATE VIEW deal_products
WITH (security_invoker = true)
AS
SELECT 
    id,
    seller_id,
    category_id,
    title,
    description,
    price,
    list_price,
    stock,
    images,
    rating,
    review_count,
    is_prime,
    search_vector,
    created_at,
    updated_at,
    tags,
    meta_title,
    meta_description,
    slug,
    brand_id,
    is_boosted,
    boost_expires_at,
    is_featured,
    listing_type,
    ships_to_bulgaria,
    ships_to_europe,
    ships_to_usa,
    ships_to_worldwide,
    pickup_only,
    attributes,
    ships_to_uk,
    sku,
    barcode,
    status,
    cost_price,
    weight,
    weight_unit,
    condition,
    track_inventory,
    is_on_sale,
    sale_percent,
    sale_end_date,
    free_shipping,
    is_limited_stock,
    stock_quantity,
    featured_until,
    shipping_days,
    CASE
        WHEN is_on_sale AND sale_percent > 0 THEN sale_percent
        WHEN list_price IS NOT NULL AND list_price > price THEN round((list_price - price) / list_price * 100::numeric)::integer
        ELSE 0
    END AS effective_discount
FROM products p
WHERE (is_on_sale = true AND sale_percent > 0) 
   OR (list_price IS NOT NULL AND list_price > price)
ORDER BY (
    CASE
        WHEN is_on_sale AND sale_percent > 0 THEN sale_percent
        WHEN list_price IS NOT NULL AND list_price > price THEN round((list_price - price) / list_price * 100::numeric)::integer
        ELSE 0
    END
) DESC;

COMMENT ON VIEW deal_products IS 'Products currently on sale or with effective discounts. Uses security_invoker for RLS compliance.';

-- =============================================================================
-- PART 3: Remove Duplicate Permissive Policies
-- =============================================================================

-- profiles: Remove duplicate SELECT policies (keep the properly named one)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
-- Keep "Public profiles are viewable by everyone" (without period)

-- profiles: Remove duplicate UPDATE policies (keep the one with SELECT wrapper)
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
-- Keep "Users can update own profile." which may have better syntax

-- store_followers: These two SELECT policies serve different purposes, keep both
-- "Anyone can view follows for seller stats" - public stats
-- "Users can view their own follows" - user's own data

-- =============================================================================
-- PART 4: Fix RLS Policies - Wrap auth.uid() in SELECT for Performance
-- =============================================================================

-- blocked_users policies
DROP POLICY IF EXISTS "Users can delete their own blocks" ON blocked_users;
CREATE POLICY "Users can delete their own blocks" ON blocked_users
  FOR DELETE TO authenticated
  USING (blocker_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view their own blocks" ON blocked_users;
CREATE POLICY "Users can view their own blocks" ON blocked_users
  FOR SELECT TO authenticated
  USING (blocker_id = (SELECT auth.uid()));

-- business_verification policies
DROP POLICY IF EXISTS "business_verification_select" ON business_verification;
CREATE POLICY "business_verification_select" ON business_verification
  FOR SELECT TO authenticated
  USING (
    (seller_id = (SELECT auth.uid())) 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
    )
  );

-- notifications policies
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- seller_feedback policies
DROP POLICY IF EXISTS "seller_feedback_update_buyer" ON seller_feedback;
CREATE POLICY "seller_feedback_update_buyer" ON seller_feedback
  FOR UPDATE TO authenticated
  USING (buyer_id = (SELECT auth.uid()));

-- store_followers policies
DROP POLICY IF EXISTS "Users can unfollow" ON store_followers;
CREATE POLICY "Users can unfollow" ON store_followers
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = follower_id);

DROP POLICY IF EXISTS "Users can view their own follows" ON store_followers;
CREATE POLICY "Users can view their own follows" ON store_followers
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = follower_id);

-- user_verification policies
DROP POLICY IF EXISTS "user_verification_select_own" ON user_verification;
CREATE POLICY "user_verification_select_own" ON user_verification
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- username_history policies
DROP POLICY IF EXISTS "Users can view own username history" ON username_history;
CREATE POLICY "Users can view own username history" ON username_history
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- =============================================================================
-- PART 5: Add Missing Foreign Key Indexes
-- =============================================================================

-- seller_feedback.order_id -> orders
CREATE INDEX IF NOT EXISTS idx_seller_feedback_order_id 
  ON seller_feedback USING btree (order_id);

-- user_badges.awarded_by -> profiles
CREATE INDEX IF NOT EXISTS idx_user_badges_awarded_by 
  ON user_badges USING btree (awarded_by);

-- business_verification.verified_by -> profiles
CREATE INDEX IF NOT EXISTS idx_business_verification_verified_by 
  ON business_verification USING btree (verified_by);

-- notifications.conversation_id -> conversations
CREATE INDEX IF NOT EXISTS idx_notifications_conversation_id 
  ON notifications USING btree (conversation_id);

-- notifications.order_id -> orders
CREATE INDEX IF NOT EXISTS idx_notifications_order_id 
  ON notifications USING btree (order_id);

-- notifications.product_id -> products
CREATE INDEX IF NOT EXISTS idx_notifications_product_id 
  ON notifications USING btree (product_id);

-- =============================================================================
-- PART 6: Add RLS Column Indexes for Common Queries
-- =============================================================================

-- Add indexes on user_id columns commonly used in RLS policies (if not already indexed)
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker_id 
  ON blocked_users USING btree (blocker_id);

CREATE INDEX IF NOT EXISTS idx_user_verification_user_id 
  ON user_verification USING btree (user_id);

CREATE INDEX IF NOT EXISTS idx_username_history_user_id 
  ON username_history USING btree (user_id);

-- =============================================================================
-- VERIFICATION COMMENT
-- =============================================================================

COMMENT ON SCHEMA public IS 'Phase 2 Security/Performance Migration Applied: 20251217000000';;
