-- Create RPC function to get conversation messages with sender profiles in one query
-- This eliminates the N+1 problem when loading messages

CREATE OR REPLACE FUNCTION public.get_conversation_messages(p_conversation_id UUID)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  content TEXT,
  message_type TEXT,
  attachment_url TEXT,
  is_read BOOLEAN,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  sender_full_name TEXT,
  sender_avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  -- Verify user is participant in conversation
  IF NOT EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = p_conversation_id 
      AND (c.buyer_id = v_user_id OR c.seller_id = v_user_id)
  ) THEN
    RAISE EXCEPTION 'Access denied: not a participant in this conversation';
  END IF;

  RETURN QUERY
  SELECT 
    m.id,
    m.conversation_id,
    m.sender_id,
    m.content,
    m.message_type,
    m.attachment_url,
    m.is_read,
    m.read_at,
    m.created_at,
    m.updated_at,
    p.full_name AS sender_full_name,
    p.avatar_url AS sender_avatar_url
  FROM messages m
  LEFT JOIN profiles p ON p.id = m.sender_id
  WHERE m.conversation_id = p_conversation_id
  ORDER BY m.created_at ASC;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_conversation_messages(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.get_conversation_messages IS 'Gets all messages for a conversation with sender profiles joined. Eliminates N+1 queries.';
