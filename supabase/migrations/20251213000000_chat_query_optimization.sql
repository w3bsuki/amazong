-- =====================================================
-- PRODUCTION OPTIMIZATION: Chat System Queries
-- Date: 2025-12-13
-- Purpose: Replace N+1 queries with efficient single-query functions
-- =====================================================

-- Function to get all conversations with full details for a user
-- Replaces 4 queries per conversation with 1 query total
CREATE OR REPLACE FUNCTION public.get_user_conversations(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  buyer_id UUID,
  seller_id UUID,
  product_id UUID,
  order_id UUID,
  subject VARCHAR(255),
  status VARCHAR(20),
  last_message_at TIMESTAMPTZ,
  buyer_unread_count INTEGER,
  seller_unread_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  -- Buyer profile
  buyer_full_name TEXT,
  buyer_avatar_url TEXT,
  -- Seller profile  
  seller_full_name TEXT,
  seller_avatar_url TEXT,
  -- Store info
  store_name TEXT,
  store_slug TEXT,
  -- Product info
  product_title TEXT,
  product_images TEXT[],
  -- Last message
  last_message_id UUID,
  last_message_content TEXT,
  last_message_sender_id UUID,
  last_message_type VARCHAR(20),
  last_message_created_at TIMESTAMPTZ
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT 
    c.id,
    c.buyer_id,
    c.seller_id,
    c.product_id,
    c.order_id,
    c.subject,
    c.status,
    c.last_message_at,
    c.buyer_unread_count,
    c.seller_unread_count,
    c.created_at,
    c.updated_at,
    -- Buyer profile
    bp.full_name AS buyer_full_name,
    bp.avatar_url AS buyer_avatar_url,
    -- Seller profile
    sp.full_name AS seller_full_name,
    sp.avatar_url AS seller_avatar_url,
    -- Store info
    s.store_name,
    s.store_slug,
    -- Product info
    p.title AS product_title,
    p.images AS product_images,
    -- Last message (using lateral join for efficiency)
    lm.id AS last_message_id,
    lm.content AS last_message_content,
    lm.sender_id AS last_message_sender_id,
    lm.message_type AS last_message_type,
    lm.created_at AS last_message_created_at
  FROM conversations c
  LEFT JOIN profiles bp ON c.buyer_id = bp.id
  LEFT JOIN profiles sp ON c.seller_id = sp.id
  LEFT JOIN sellers s ON c.seller_id = s.id
  LEFT JOIN products p ON c.product_id = p.id
  LEFT JOIN LATERAL (
    SELECT m.id, m.content, m.sender_id, m.message_type, m.created_at
    FROM messages m 
    WHERE m.conversation_id = c.id 
    ORDER BY m.created_at DESC 
    LIMIT 1
  ) lm ON true
  WHERE c.buyer_id = p_user_id OR c.seller_id = p_user_id
  ORDER BY c.last_message_at DESC NULLS LAST;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_conversations(UUID) TO authenticated;

-- Function to get conversation IDs for a user (for realtime filtering)
CREATE OR REPLACE FUNCTION public.get_user_conversation_ids(p_user_id UUID)
RETURNS TABLE (conversation_id UUID)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT c.id
  FROM conversations c
  WHERE c.buyer_id = p_user_id OR c.seller_id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_conversation_ids(UUID) TO authenticated;
