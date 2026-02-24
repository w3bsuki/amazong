-- Create an optimized RPC function to get user conversations with all related data
-- This avoids N+1 queries by joining all needed tables in one call

CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  buyer_id UUID,
  seller_id UUID,
  product_id UUID,
  order_id UUID,
  subject TEXT,
  status TEXT,
  last_message_at TIMESTAMPTZ,
  buyer_unread_count INT,
  seller_unread_count INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  buyer_full_name TEXT,
  buyer_avatar_url TEXT,
  seller_full_name TEXT,
  seller_avatar_url TEXT,
  store_name TEXT,
  store_slug TEXT,
  product_title TEXT,
  product_images TEXT[],
  last_message_id UUID,
  last_message_content TEXT,
  last_message_sender_id UUID,
  last_message_type TEXT,
  last_message_created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.buyer_id,
    c.seller_id,
    c.product_id,
    c.order_id,
    c.subject,
    c.status::TEXT,
    c.last_message_at,
    c.buyer_unread_count,
    c.seller_unread_count,
    c.created_at,
    c.updated_at,
    -- Buyer info from profiles
    bp.full_name AS buyer_full_name,
    bp.avatar_url AS buyer_avatar_url,
    -- Seller profile info
    sp.full_name AS seller_full_name,
    sp.avatar_url AS seller_avatar_url,
    -- Store info from sellers table
    s.store_name,
    s.store_slug,
    -- Product info
    p.title AS product_title,
    p.images AS product_images,
    -- Last message info (subquery for performance)
    lm.id AS last_message_id,
    lm.content AS last_message_content,
    lm.sender_id AS last_message_sender_id,
    lm.message_type::TEXT AS last_message_type,
    lm.created_at AS last_message_created_at
  FROM conversations c
  -- Join buyer profile
  LEFT JOIN profiles bp ON bp.id = c.buyer_id
  -- Join seller profile
  LEFT JOIN profiles sp ON sp.id = c.seller_id
  -- Join sellers table for store name
  LEFT JOIN sellers s ON s.id = c.seller_id
  -- Join products
  LEFT JOIN products p ON p.id = c.product_id
  -- Get last message with lateral join for efficiency
  LEFT JOIN LATERAL (
    SELECT m.id, m.content, m.sender_id, m.message_type, m.created_at
    FROM messages m
    WHERE m.conversation_id = c.id
    ORDER BY m.created_at DESC
    LIMIT 1
  ) lm ON true
  WHERE c.buyer_id = p_user_id OR c.seller_id = p_user_id
  ORDER BY COALESCE(c.last_message_at, c.created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;;
