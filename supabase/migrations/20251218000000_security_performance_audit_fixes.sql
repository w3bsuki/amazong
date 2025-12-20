-- ============================================================
-- SECURITY & PERFORMANCE AUDIT FIXES
-- Date: December 18, 2025
-- Purpose: Address Supabase Advisor findings
-- ============================================================

-- ============================================================
-- 1. FIX: function_search_path_mutable for validate_username
-- Issue: Function search_path is mutable, could be exploited
-- Fix: Set search_path to empty string for security
-- ============================================================

-- Drop and recreate with secure search_path
CREATE OR REPLACE FUNCTION public.validate_username(username TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Username must be 3-30 characters
  IF length(username) < 3 OR length(username) > 30 THEN
    RETURN FALSE;
  END IF;
  
  -- Must start with a letter
  IF NOT username ~ '^[a-zA-Z]' THEN
    RETURN FALSE;
  END IF;
  
  -- Only alphanumeric and underscores allowed
  IF NOT username ~ '^[a-zA-Z][a-zA-Z0-9_]*$' THEN
    RETURN FALSE;
  END IF;
  
  -- No consecutive underscores
  IF username ~ '__' THEN
    RETURN FALSE;
  END IF;
  
  -- Cannot end with underscore
  IF username ~ '_$' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- ============================================================
-- 2. FIX: auth_rls_initplan - conversations_insert_for_orders
-- Issue: auth.uid() re-evaluated per row, causing performance issues
-- Fix: Wrap auth functions in (SELECT ...)
-- ============================================================

DROP POLICY IF EXISTS "conversations_insert_for_orders" ON public.conversations;

CREATE POLICY "conversations_insert_for_orders" ON public.conversations
FOR INSERT
WITH CHECK (
  buyer_id = (SELECT auth.uid())
  OR seller_id = (SELECT auth.uid())
);

-- ============================================================
-- 3. FIX: auth_rls_initplan - messages_insert_system
-- ============================================================

DROP POLICY IF EXISTS "messages_insert_system" ON public.messages;

CREATE POLICY "messages_insert_system" ON public.messages
FOR INSERT
WITH CHECK (
  sender_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.buyer_id = (SELECT auth.uid()) OR c.seller_id = (SELECT auth.uid()))
  )
);

-- ============================================================
-- 4. FIX: auth_rls_initplan - seller_feedback_insert_buyer
-- ============================================================

DROP POLICY IF EXISTS "seller_feedback_insert_buyer" ON public.seller_feedback;

CREATE POLICY "seller_feedback_insert_buyer" ON public.seller_feedback
FOR INSERT
WITH CHECK (
  buyer_id = (SELECT auth.uid())
);

-- ============================================================
-- 5. FIX: auth_rls_initplan - blocked_users "Users can create blocks"
-- ============================================================

DROP POLICY IF EXISTS "Users can create blocks" ON public.blocked_users;

CREATE POLICY "Users can create blocks" ON public.blocked_users
FOR INSERT
WITH CHECK (
  blocker_id = (SELECT auth.uid())
);

-- ============================================================
-- 6. FIX: auth_rls_initplan - store_followers "Users can follow sellers"
-- ============================================================

DROP POLICY IF EXISTS "Users can follow sellers" ON public.store_followers;

CREATE POLICY "Users can follow sellers" ON public.store_followers
FOR INSERT
WITH CHECK (
  follower_id = (SELECT auth.uid())
);

-- ============================================================
-- 7. FIX: auth_rls_initplan - username_history "System can insert..."
-- ============================================================

DROP POLICY IF EXISTS "System can insert username history" ON public.username_history;

-- This should be a trigger, not RLS-based insertion
-- The trigger already handles this, so we make the policy restrictive
CREATE POLICY "System can insert username history" ON public.username_history
FOR INSERT
WITH CHECK (
  user_id = (SELECT auth.uid())
);

-- ============================================================
-- 8. FIX: multiple_permissive_policies - business_verification
-- Consolidate overlapping SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "business_verification_all" ON public.business_verification;
DROP POLICY IF EXISTS "business_verification_select" ON public.business_verification;

-- Single unified select policy
CREATE POLICY "business_verification_select_unified" ON public.business_verification
FOR SELECT
USING (
  seller_id = (SELECT auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = (SELECT auth.uid())
    AND p.role = 'admin'
  )
);

-- ============================================================
-- 9. FIX: multiple_permissive_policies - buyer_stats
-- Consolidate overlapping SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "buyer_stats_all" ON public.buyer_stats;
DROP POLICY IF EXISTS "buyer_stats_select_all" ON public.buyer_stats;

-- Public read access for buyer stats (for seller profiles, badge display)
CREATE POLICY "buyer_stats_select_unified" ON public.buyer_stats
FOR SELECT
USING (true);

-- ============================================================
-- 10. FIX: multiple_permissive_policies - seller_stats
-- Consolidate overlapping SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "seller_stats_all" ON public.seller_stats;
DROP POLICY IF EXISTS "seller_stats_select_all" ON public.seller_stats;

-- Public read access for seller stats (for seller profiles, badge display)
CREATE POLICY "seller_stats_select_unified" ON public.seller_stats
FOR SELECT
USING (true);

-- ============================================================
-- 11. FIX: multiple_permissive_policies - store_followers
-- Consolidate overlapping SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "Anyone can view follows for seller stats" ON public.store_followers;
DROP POLICY IF EXISTS "Users can view their own follows" ON public.store_followers;

-- Anyone can see follow counts, users can see their specific follows
CREATE POLICY "store_followers_select_unified" ON public.store_followers
FOR SELECT
USING (true);

-- ============================================================
-- 12. FIX: multiple_permissive_policies - user_verification
-- Consolidate overlapping SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "user_verification_all" ON public.user_verification;
DROP POLICY IF EXISTS "user_verification_select_own" ON public.user_verification;

-- Users can only see their own verification status
CREATE POLICY "user_verification_select_unified" ON public.user_verification
FOR SELECT
USING (
  user_id = (SELECT auth.uid())
);

-- ============================================================
-- 13. FIX: duplicate_index - blocked_users
-- ============================================================

DROP INDEX IF EXISTS idx_blocked_users_blocker_id;
-- Keep idx_blocked_users_blocker

-- ============================================================
-- 14. FIX: duplicate_index - buyer_feedback
-- ============================================================

DROP INDEX IF EXISTS idx_buyer_feedback_buyer_id;
DROP INDEX IF EXISTS idx_buyer_feedback_seller_id;
-- Keep idx_buyer_feedback_buyer and idx_buyer_feedback_seller

-- ============================================================
-- 15. FIX: duplicate_index - user_verification
-- ============================================================

DROP INDEX IF EXISTS idx_user_verification_user_id;
-- Keep idx_user_verification_user

-- ============================================================
-- 16. ADD: Missing index on buyer_feedback.order_id (foreign key)
-- Issue: unindexed_foreign_keys warning
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_buyer_feedback_order_id ON public.buyer_feedback(order_id);

-- ============================================================
-- SUMMARY OF FIXES:
-- - 1 security function fixed (search_path)
-- - 6 RLS policies optimized (auth_rls_initplan)
-- - 5 duplicate policies consolidated
-- - 3 duplicate indexes removed
-- - 1 missing FK index added
-- ============================================================
