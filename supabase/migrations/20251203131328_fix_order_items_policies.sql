-- ============================================
-- Migration: Fix order_items duplicate policies
-- Merge into single policy for better performance
-- ============================================

-- Drop existing duplicate policies
DROP POLICY IF EXISTS "Sellers can view order items for their products." ON public.order_items;
DROP POLICY IF EXISTS "Users can view own order items." ON public.order_items;

-- Create single optimized policy that handles both cases
CREATE POLICY "Users can view own order items or as seller" 
  ON public.order_items FOR SELECT TO authenticated 
  USING (
    -- User owns the order
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = (SELECT auth.uid())
    )
    OR
    -- User is the seller
    seller_id = (SELECT auth.uid())
  );;
