-- ============================================
-- Migration: Fix RLS Security and Performance Issues
-- Date: 2024-12-03
-- Fixes:
--   1. Drop backup table without RLS
--   2. Add missing indexes
--   3. Optimize all RLS policies with TO clause and SELECT wrapper
-- ============================================

-- ============================================
-- 1. DROP BACKUP TABLE (security issue)
-- ============================================
DROP TABLE IF EXISTS public.product_category_backup;

-- ============================================
-- 2. ADD MISSING INDEXES
-- ============================================

-- Category filtering (heavily used)
CREATE INDEX IF NOT EXISTS idx_products_category_id 
  ON public.products(category_id);

-- Full-text search GIN index
CREATE INDEX IF NOT EXISTS idx_products_search_vector 
  ON public.products USING GIN(search_vector);

-- Trigram index for fuzzy search
CREATE INDEX IF NOT EXISTS idx_products_title_trgm 
  ON public.products USING GIN(title gin_trgm_ops);

-- BRIN indexes for timestamp columns (10x smaller than B-tree)
CREATE INDEX IF NOT EXISTS idx_products_created_at 
  ON public.products USING BRIN(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_created_at 
  ON public.orders USING BRIN(created_at);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at 
  ON public.reviews USING BRIN(created_at);

-- ============================================
-- 3. OPTIMIZE RLS POLICIES
-- ============================================

-- PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = id);

-- SELLERS
DROP POLICY IF EXISTS "Sellers are viewable by everyone." ON public.sellers;
CREATE POLICY "Sellers are viewable by everyone." 
  ON public.sellers FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Users can create their own seller profile." ON public.sellers;
CREATE POLICY "Users can create their own seller profile." 
  ON public.sellers FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Sellers can update their own profile." ON public.sellers;
CREATE POLICY "Sellers can update their own profile." 
  ON public.sellers FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = id);

-- CATEGORIES
DROP POLICY IF EXISTS "Categories are viewable by everyone." ON public.categories;
CREATE POLICY "Categories are viewable by everyone." 
  ON public.categories FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Admins can insert categories." ON public.categories;
CREATE POLICY "Admins can insert categories." 
  ON public.categories FOR INSERT TO authenticated 
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can update categories." ON public.categories;
CREATE POLICY "Admins can update categories." 
  ON public.categories FOR UPDATE TO authenticated 
  USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can delete categories." ON public.categories;
CREATE POLICY "Admins can delete categories." 
  ON public.categories FOR DELETE TO authenticated 
  USING ((SELECT public.is_admin()));

-- PRODUCTS
DROP POLICY IF EXISTS "Products are viewable by everyone." ON public.products;
CREATE POLICY "Products are viewable by everyone." 
  ON public.products FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Sellers can insert products." ON public.products;
CREATE POLICY "Sellers can insert products." 
  ON public.products FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Sellers can update own products." ON public.products;
CREATE POLICY "Sellers can update own products." 
  ON public.products FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Sellers can delete own products." ON public.products;
CREATE POLICY "Sellers can delete own products." 
  ON public.products FOR DELETE TO authenticated 
  USING ((SELECT auth.uid()) = seller_id);

-- REVIEWS
DROP POLICY IF EXISTS "Reviews are viewable by everyone." ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone." 
  ON public.reviews FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Users can insert reviews." ON public.reviews;
CREATE POLICY "Users can insert reviews." 
  ON public.reviews FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own reviews." ON public.reviews;
CREATE POLICY "Users can update own reviews." 
  ON public.reviews FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own reviews." ON public.reviews;
CREATE POLICY "Users can delete own reviews." 
  ON public.reviews FOR DELETE TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

-- ORDERS
DROP POLICY IF EXISTS "Users can view own orders." ON public.orders;
CREATE POLICY "Users can view own orders." 
  ON public.orders FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own orders." ON public.orders;
CREATE POLICY "Users can insert own orders." 
  ON public.orders FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ORDER ITEMS
DROP POLICY IF EXISTS "Users can view own order items." ON public.order_items;
CREATE POLICY "Users can view own order items." 
  ON public.order_items FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Sellers can view order items for their products." ON public.order_items;
CREATE POLICY "Sellers can view order items for their products." 
  ON public.order_items FOR SELECT TO authenticated 
  USING (seller_id = (SELECT auth.uid()));;
