-- =====================================================
-- PERFORMANCE OPTIMIZATION MIGRATION
-- Date: 2025-11-24
-- Purpose: Optimize RLS policies and fix remaining issues
-- =====================================================

-- Fix security_definer view issue
CREATE OR REPLACE VIEW public.seller_stats AS
SELECT 
  s.id as seller_id,
  s.store_name,
  COUNT(DISTINCT p.id) as product_count,
  COUNT(DISTINCT oi.order_id) as order_count,
  COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) as total_revenue,
  COALESCE(AVG(p.rating), 0) as avg_product_rating
FROM public.sellers s
LEFT JOIN public.products p ON p.seller_id = s.id
LEFT JOIN public.order_items oi ON oi.seller_id = s.id
GROUP BY s.id, s.store_name;

-- Optimize RLS policies by wrapping auth.uid() in SELECT
-- This prevents re-evaluation for each row

-- PROFILES POLICIES (Optimized)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- SELLERS POLICIES (Optimized)
DROP POLICY IF EXISTS "sellers_insert_own" ON public.sellers;
CREATE POLICY "sellers_insert_own"
  ON public.sellers FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "sellers_update_own" ON public.sellers;
CREATE POLICY "sellers_update_own"
  ON public.sellers FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "sellers_delete_own_or_admin" ON public.sellers;
CREATE POLICY "sellers_delete_own_or_admin"
  ON public.sellers FOR DELETE
  USING ((SELECT auth.uid()) = id OR public.is_admin());

-- PRODUCTS POLICIES (Optimized)
DROP POLICY IF EXISTS "products_insert_seller" ON public.products;
CREATE POLICY "products_insert_seller"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sellers
      WHERE sellers.id = seller_id AND sellers.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "products_update_own" ON public.products;
CREATE POLICY "products_update_own"
  ON public.products FOR UPDATE
  USING (seller_id = (SELECT auth.uid()))
  WITH CHECK (seller_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "products_delete_own_or_admin" ON public.products;
CREATE POLICY "products_delete_own_or_admin"
  ON public.products FOR DELETE
  USING (seller_id = (SELECT auth.uid()) OR public.is_admin());

-- REVIEWS POLICIES (Optimized)
DROP POLICY IF EXISTS "reviews_insert_authenticated" ON public.reviews;
CREATE POLICY "reviews_insert_authenticated"
  ON public.reviews FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
CREATE POLICY "reviews_update_own"
  ON public.reviews FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "reviews_delete_own_or_admin" ON public.reviews;
CREATE POLICY "reviews_delete_own_or_admin"
  ON public.reviews FOR DELETE
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

-- ORDERS POLICIES (Optimized)
DROP POLICY IF EXISTS "orders_select_own_or_seller" ON public.orders;
CREATE POLICY "orders_select_own_or_seller"
  ON public.orders FOR SELECT
  USING (
    (SELECT auth.uid()) = user_id OR
    EXISTS (
      SELECT 1 FROM public.order_items
      WHERE order_items.order_id = orders.id
      AND order_items.seller_id = (SELECT auth.uid())
    ) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "orders_update_own" ON public.orders;
CREATE POLICY "orders_update_own"
  ON public.orders FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ORDER_ITEMS POLICIES (Optimized)
DROP POLICY IF EXISTS "order_items_select_buyer_or_seller" ON public.order_items;
CREATE POLICY "order_items_select_buyer_or_seller"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (SELECT auth.uid())
    ) OR
    seller_id = (SELECT auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "order_items_insert_with_order" ON public.order_items;
CREATE POLICY "order_items_insert_with_order"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_id
      AND orders.user_id = (SELECT auth.uid())
    )
  );

-- Migration complete
-- RLS policies are now optimized for performance;
