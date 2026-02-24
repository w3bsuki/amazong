-- Phase 12 Audit: Fix Security & Performance Issues
-- Date: December 19, 2025

-- =============================================================================
-- FIX 1: Function search_path security
-- =============================================================================

-- Fix auto_verify_business_on_subscription
CREATE OR REPLACE FUNCTION public.auto_verify_business_on_subscription()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND NEW.plan_type IN ('professional', 'enterprise') THEN
    UPDATE public.profiles
    SET is_verified_business = TRUE, updated_at = NOW()
    WHERE id = NEW.seller_id AND account_type = 'business';
    
    UPDATE public.business_verification
    SET verification_level = GREATEST(verification_level, 3), updated_at = NOW()
    WHERE seller_id = NEW.seller_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix sync_seller_from_subscription
CREATE OR REPLACE FUNCTION public.sync_seller_from_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile tier and commission based on subscription
  IF NEW.status = 'active' THEN
    UPDATE public.profiles
    SET 
      tier = NEW.plan_type,
      is_seller = TRUE,
      commission_rate = COALESCE(
        (SELECT commission_rate FROM public.subscription_plans WHERE tier = NEW.plan_type LIMIT 1),
        12.00
      ),
      updated_at = NOW()
    WHERE id = NEW.seller_id;
  ELSIF NEW.status IN ('cancelled', 'expired') THEN
    UPDATE public.profiles
    SET 
      tier = 'free',
      commission_rate = 12.00,
      updated_at = NOW()
    WHERE id = NEW.seller_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix validate_username  
CREATE OR REPLACE FUNCTION public.validate_username(username text)
RETURNS boolean AS $$
BEGIN
  -- Check length
  IF length(username) < 3 OR length(username) > 30 THEN
    RETURN false;
  END IF;
  
  -- Check format: lowercase letters, numbers, underscores only
  IF username !~ '^[a-z0-9_]+$' THEN
    RETURN false;
  END IF;
  
  -- Must start with letter or number
  IF username !~ '^[a-z0-9]' THEN
    RETURN false;
  END IF;
  
  -- Cannot end with underscore
  IF username ~ '_$' THEN
    RETURN false;
  END IF;
  
  -- No consecutive underscores
  IF username ~ '__' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

-- =============================================================================
-- FIX 2: Remove duplicate indexes
-- =============================================================================

-- blocked_users: keep idx_blocked_users_blocker_id, drop idx_blocked_users_blocker
DROP INDEX IF EXISTS public.idx_blocked_users_blocker;

-- buyer_feedback: keep idx_buyer_feedback_buyer_id, drop idx_buyer_feedback_buyer
DROP INDEX IF EXISTS public.idx_buyer_feedback_buyer;

-- buyer_feedback: keep idx_buyer_feedback_seller_id, drop idx_buyer_feedback_seller
DROP INDEX IF EXISTS public.idx_buyer_feedback_seller;

-- user_verification: keep idx_user_verification_user_id, drop idx_user_verification_user
DROP INDEX IF EXISTS public.idx_user_verification_user;

-- =============================================================================
-- FIX 3: Add missing index for foreign key
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_buyer_feedback_order_id ON public.buyer_feedback(order_id);

-- =============================================================================
-- FIX 4: Consolidate duplicate permissive policies
-- =============================================================================

-- buyer_stats: drop duplicate policy
DROP POLICY IF EXISTS "buyer_stats_all" ON public.buyer_stats;

-- seller_stats: drop duplicate policy  
DROP POLICY IF EXISTS "seller_stats_all" ON public.seller_stats;

-- business_verification: drop duplicate policy
DROP POLICY IF EXISTS "business_verification_all" ON public.business_verification;

-- store_followers: consolidate SELECT policies
DROP POLICY IF EXISTS "Anyone can view follows for seller stats" ON public.store_followers;

-- user_verification: drop duplicate policy
DROP POLICY IF EXISTS "user_verification_all" ON public.user_verification;

-- =============================================================================
-- FIX 5: Optimize RLS policies with (select auth.uid()) pattern
-- =============================================================================

-- conversations: Fix conversations_insert_for_orders
DROP POLICY IF EXISTS "conversations_insert_for_orders" ON public.conversations;
CREATE POLICY "conversations_insert_for_orders" ON public.conversations
  FOR INSERT
  WITH CHECK (
    buyer_id = (SELECT auth.uid())
    OR seller_id = (SELECT auth.uid())
  );

-- messages: Fix messages_insert_system
DROP POLICY IF EXISTS "messages_insert_system" ON public.messages;
CREATE POLICY "messages_insert_system" ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.buyer_id = (SELECT auth.uid()) OR c.seller_id = (SELECT auth.uid()))
    )
  );

-- seller_feedback: Fix seller_feedback_insert_buyer
DROP POLICY IF EXISTS "seller_feedback_insert_buyer" ON public.seller_feedback;
CREATE POLICY "seller_feedback_insert_buyer" ON public.seller_feedback
  FOR INSERT
  WITH CHECK (buyer_id = (SELECT auth.uid()));

-- blocked_users: Fix "Users can create blocks"
DROP POLICY IF EXISTS "Users can create blocks" ON public.blocked_users;
CREATE POLICY "Users can create blocks" ON public.blocked_users
  FOR INSERT
  WITH CHECK (blocker_id = (SELECT auth.uid()));

-- store_followers: Fix "Users can follow sellers"
DROP POLICY IF EXISTS "Users can follow sellers" ON public.store_followers;
CREATE POLICY "Users can follow sellers" ON public.store_followers
  FOR INSERT
  WITH CHECK (follower_id = (SELECT auth.uid()));

-- username_history: Fix "System can insert username history"
DROP POLICY IF EXISTS "System can insert username history" ON public.username_history;
CREATE POLICY "System can insert username history" ON public.username_history
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));;
