-- Drop and recreate with proper type casting
DROP FUNCTION IF EXISTS get_user_conversations(UUID);

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
    c.subject::TEXT,
    c.status::TEXT,
    c.last_message_at,
    c.buyer_unread_count,
    c.seller_unread_count,
    c.created_at,
    c.updated_at,
    -- Buyer info from profiles - cast to TEXT
    bp.full_name::TEXT AS buyer_full_name,
    bp.avatar_url::TEXT AS buyer_avatar_url,
    -- Seller profile info - cast to TEXT
    sp.full_name::TEXT AS seller_full_name,
    sp.avatar_url::TEXT AS seller_avatar_url,
    -- Store info from sellers table - cast to TEXT
    s.store_name::TEXT,
    s.store_slug::TEXT,
    -- Product info - cast to TEXT
    p.title::TEXT AS product_title,
    p.images AS product_images,
    -- Last message info
    lm.id AS last_message_id,
    lm.content::TEXT AS last_message_content,
    lm.sender_id AS last_message_sender_id,
    lm.message_type::TEXT AS last_message_type,
    lm.created_at AS last_message_created_at
  FROM conversations c
  LEFT JOIN profiles bp ON bp.id = c.buyer_id
  LEFT JOIN profiles sp ON sp.id = c.seller_id
  LEFT JOIN sellers s ON s.id = c.seller_id
  LEFT JOIN products p ON p.id = c.product_id
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
