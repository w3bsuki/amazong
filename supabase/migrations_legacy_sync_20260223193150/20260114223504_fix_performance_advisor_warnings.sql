-- Fix 1: listing_boosts RLS - wrap auth.uid() in subquery for insert and update policies
DROP POLICY IF EXISTS "Sellers can insert own boosts" ON public.listing_boosts;
CREATE POLICY "Sellers can insert own boosts" ON public.listing_boosts
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Sellers can update own boosts" ON public.listing_boosts;
CREATE POLICY "Sellers can update own boosts" ON public.listing_boosts
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = seller_id)
  WITH CHECK ((SELECT auth.uid()) = seller_id);

-- Fix 2: Merge multiple permissive SELECT policies on return_requests into one
DROP POLICY IF EXISTS "return_requests_select_buyer" ON public.return_requests;
DROP POLICY IF EXISTS "return_requests_select_seller" ON public.return_requests;

CREATE POLICY "return_requests_select_own" ON public.return_requests
  FOR SELECT TO authenticated
  USING (
    buyer_id = (SELECT auth.uid()) 
    OR seller_id = (SELECT auth.uid())
  );;
