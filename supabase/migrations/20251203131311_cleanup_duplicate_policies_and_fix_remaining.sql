-- ============================================
-- Migration: Cleanup duplicate policies and fix remaining performance issues
-- ============================================

-- ============================================
-- 1. REMOVE DUPLICATE/OLD POLICIES
-- ============================================

-- Profiles (remove old policies, keep optimized ones)
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Sellers
DROP POLICY IF EXISTS "sellers_select_all" ON public.sellers;
DROP POLICY IF EXISTS "sellers_insert_own" ON public.sellers;
DROP POLICY IF EXISTS "sellers_update_own" ON public.sellers;

-- Categories
DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
DROP POLICY IF EXISTS "categories_insert_admin_only" ON public.categories;
DROP POLICY IF EXISTS "categories_update_admin_only" ON public.categories;
DROP POLICY IF EXISTS "categories_delete_admin_only" ON public.categories;

-- Products
DROP POLICY IF EXISTS "products_select_all" ON public.products;
DROP POLICY IF EXISTS "products_insert_seller" ON public.products;
DROP POLICY IF EXISTS "products_update_own" ON public.products;
DROP POLICY IF EXISTS "products_delete_own_or_admin" ON public.products;

-- Reviews
DROP POLICY IF EXISTS "reviews_select_all" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_authenticated" ON public.reviews;
DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete_own_or_admin" ON public.reviews;

-- Orders (remove duplicates)
DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
DROP POLICY IF EXISTS "orders_select_as_seller" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;

-- Order Items (remove duplicates)
DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
DROP POLICY IF EXISTS "order_items_select_seller" ON public.order_items;

-- Wishlists
DROP POLICY IF EXISTS "wishlists_select_own_or_public" ON public.wishlists;

-- Brands (remove duplicates)
DROP POLICY IF EXISTS "Authenticated users can manage brands" ON public.brands;

-- Product Attributes (remove duplicates)
DROP POLICY IF EXISTS "Sellers can manage their product attributes" ON public.product_attributes;

-- Messages
DROP POLICY IF EXISTS "messages_insert_participant" ON public.messages;

-- ============================================
-- 2. ADD MISSING INDEXES FOR FOREIGN KEYS
-- ============================================

CREATE INDEX IF NOT EXISTS idx_listing_boosts_product_id 
  ON public.listing_boosts(product_id);

CREATE INDEX IF NOT EXISTS idx_listing_boosts_seller_id 
  ON public.listing_boosts(seller_id);

CREATE INDEX IF NOT EXISTS idx_product_attributes_attribute_id 
  ON public.product_attributes(attribute_id);

-- ============================================
-- 3. FIX REMAINING RLS POLICIES WITH SELECT WRAPPER
-- ============================================

-- User Addresses
DROP POLICY IF EXISTS "Users can view own addresses" ON public.user_addresses;
CREATE POLICY "Users can view own addresses" 
  ON public.user_addresses FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own addresses" ON public.user_addresses;
CREATE POLICY "Users can create own addresses" 
  ON public.user_addresses FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own addresses" ON public.user_addresses;
CREATE POLICY "Users can update own addresses" 
  ON public.user_addresses FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own addresses" ON public.user_addresses;
CREATE POLICY "Users can delete own addresses" 
  ON public.user_addresses FOR DELETE TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

-- User Payment Methods
DROP POLICY IF EXISTS "Users can view own payment methods" ON public.user_payment_methods;
CREATE POLICY "Users can view own payment methods" 
  ON public.user_payment_methods FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own payment methods" ON public.user_payment_methods;
CREATE POLICY "Users can create own payment methods" 
  ON public.user_payment_methods FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own payment methods" ON public.user_payment_methods;
CREATE POLICY "Users can update own payment methods" 
  ON public.user_payment_methods FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own payment methods" ON public.user_payment_methods;
CREATE POLICY "Users can delete own payment methods" 
  ON public.user_payment_methods FOR DELETE TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

-- Subscriptions
DROP POLICY IF EXISTS "Sellers can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Sellers can view own subscriptions" 
  ON public.subscriptions FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Sellers can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Sellers can insert own subscriptions" 
  ON public.subscriptions FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Sellers can update own subscriptions" ON public.subscriptions;
CREATE POLICY "Sellers can update own subscriptions" 
  ON public.subscriptions FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = seller_id);

-- Listing Boosts
DROP POLICY IF EXISTS "Sellers can view own boosts" ON public.listing_boosts;
CREATE POLICY "Sellers can view own boosts" 
  ON public.listing_boosts FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = seller_id);

-- Product Attributes
DROP POLICY IF EXISTS "Product attributes are viewable by everyone" ON public.product_attributes;
CREATE POLICY "Product attributes are viewable by everyone" 
  ON public.product_attributes FOR SELECT TO authenticated, anon 
  USING (true);

-- Brands
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON public.brands;
CREATE POLICY "Brands are viewable by everyone" 
  ON public.brands FOR SELECT TO authenticated, anon 
  USING (true);

-- Wishlists
DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlists;
CREATE POLICY "Users can view their own wishlist" 
  ON public.wishlists FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = user_id OR is_public = true);;
