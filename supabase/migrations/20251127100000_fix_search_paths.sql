-- Security fix: Set explicit search_path on all database functions
-- This addresses the Supabase security advisor warnings about mutable search paths

-- Fix mark_messages_read function
ALTER FUNCTION public.mark_messages_read SET search_path = public;

-- Fix update_conversation_on_message function  
ALTER FUNCTION public.update_conversation_on_message SET search_path = public;

-- Fix get_total_unread_messages function
ALTER FUNCTION public.get_total_unread_messages SET search_path = public;

-- Fix get_or_create_conversation function
ALTER FUNCTION public.get_or_create_conversation SET search_path = public;

-- Fix generate_share_token function
ALTER FUNCTION public.generate_share_token SET search_path = public;

-- Fix enable_wishlist_sharing function
ALTER FUNCTION public.enable_wishlist_sharing SET search_path = public;

-- Fix disable_wishlist_sharing function
ALTER FUNCTION public.disable_wishlist_sharing SET search_path = public;

-- Fix get_shared_wishlist function
ALTER FUNCTION public.get_shared_wishlist SET search_path = public;

-- ============================================
-- RLS Policy Performance Optimizations
-- ============================================

-- Fix messages_insert_participant policy to use subquery for auth.uid()
-- This prevents re-evaluation per row
DROP POLICY IF EXISTS "messages_insert_participant" ON public.messages;
CREATE POLICY "messages_insert_participant" ON public.messages
FOR INSERT TO authenticated
WITH CHECK (
    conversation_id IN (
        SELECT c.id FROM public.conversations c
        WHERE c.buyer_id = (SELECT auth.uid())
           OR c.seller_id = (SELECT auth.uid())
    )
);

-- Fix wishlists_select_own_or_public policy to use subquery
DROP POLICY IF EXISTS "wishlists_select_own_or_public" ON public.wishlists;
CREATE POLICY "wishlists_select_own_or_public" ON public.wishlists
FOR SELECT TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR is_public = true
);

-- ============================================
-- Add missing foreign key indexes for performance
-- ============================================

-- Index for conversations.order_id
CREATE INDEX IF NOT EXISTS idx_conversations_order_id ON public.conversations(order_id);

-- Index for conversations.product_id  
CREATE INDEX IF NOT EXISTS idx_conversations_product_id ON public.conversations(product_id);

-- Index for products.seller_id
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);

-- ============================================
-- Note: To enable leaked password protection
-- ============================================
-- Go to Supabase Dashboard > Authentication > Settings > Password Protection
-- Enable "Prevent sign ups with leaked passwords"
