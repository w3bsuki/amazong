-- Phase 4: User Blocking System for Chat
-- Allows users to block other users from messaging them

-- ============================================================================
-- BLOCKED USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT, -- Optional reason for blocking
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Prevent duplicate blocks
  UNIQUE(blocker_id, blocked_id),
  -- Prevent self-blocking
  CHECK (blocker_id != blocked_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON public.blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON public.blocked_users(blocked_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_pair ON public.blocked_users(blocker_id, blocked_id);

-- Enable RLS
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own blocks"
  ON public.blocked_users FOR SELECT
  USING (blocker_id = auth.uid());

CREATE POLICY "Users can create blocks"
  ON public.blocked_users FOR INSERT
  WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can delete their own blocks"
  ON public.blocked_users FOR DELETE
  USING (blocker_id = auth.uid());

COMMENT ON TABLE public.blocked_users IS 'Tracks users who have blocked other users from messaging them';

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if user A has blocked user B
CREATE OR REPLACE FUNCTION public.is_user_blocked(p_blocker_id UUID, p_blocked_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM blocked_users
    WHERE blocker_id = p_blocker_id
      AND blocked_id = p_blocked_id
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_user_blocked(UUID, UUID) TO authenticated;

-- Check if either user has blocked the other (bidirectional check)
CREATE OR REPLACE FUNCTION public.is_blocked_bidirectional(p_user_a UUID, p_user_b UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM blocked_users
    WHERE (blocker_id = p_user_a AND blocked_id = p_user_b)
       OR (blocker_id = p_user_b AND blocked_id = p_user_a)
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_blocked_bidirectional(UUID, UUID) TO authenticated;

-- Block a user
CREATE OR REPLACE FUNCTION public.block_user(p_user_to_block UUID, p_reason TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Can't block yourself
  IF auth.uid() = p_user_to_block THEN
    RETURN false;
  END IF;

  INSERT INTO blocked_users (blocker_id, blocked_id, reason)
  VALUES (auth.uid(), p_user_to_block, p_reason)
  ON CONFLICT (blocker_id, blocked_id) DO NOTHING;
  
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.block_user(UUID, TEXT) TO authenticated;

-- Unblock a user
CREATE OR REPLACE FUNCTION public.unblock_user(p_user_to_unblock UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM blocked_users
  WHERE blocker_id = auth.uid()
    AND blocked_id = p_user_to_unblock;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.unblock_user(UUID) TO authenticated;

-- Get list of blocked users with their profiles
CREATE OR REPLACE FUNCTION public.get_blocked_users()
RETURNS TABLE (
  blocked_id UUID,
  blocked_at TIMESTAMPTZ,
  reason TEXT,
  full_name TEXT,
  avatar_url TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    bu.blocked_id,
    bu.created_at as blocked_at,
    bu.reason,
    p.full_name,
    p.avatar_url
  FROM blocked_users bu
  LEFT JOIN profiles p ON p.id = bu.blocked_id
  WHERE bu.blocker_id = auth.uid()
  ORDER BY bu.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_blocked_users() TO authenticated;

-- ============================================================================
-- UPDATE MESSAGE POLICIES TO RESPECT BLOCKS
-- ============================================================================

-- Update the get_or_create_conversation function to check for blocks
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  p_seller_id UUID,
  p_product_id UUID DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_subject TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation_id UUID;
  v_buyer_id UUID;
BEGIN
  v_buyer_id := auth.uid();
  
  -- Check if blocked (either direction)
  IF public.is_blocked_bidirectional(v_buyer_id, p_seller_id) THEN
    RAISE EXCEPTION 'Cannot start conversation - user is blocked';
  END IF;
  
  -- Check for existing conversation
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE buyer_id = v_buyer_id
    AND seller_id = p_seller_id
    AND (
      (p_product_id IS NOT NULL AND product_id = p_product_id)
      OR (p_order_id IS NOT NULL AND order_id = p_order_id)
      OR (p_product_id IS NULL AND p_order_id IS NULL)
    )
  LIMIT 1;
  
  -- Create new if not found
  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (buyer_id, seller_id, product_id, order_id, subject)
    VALUES (v_buyer_id, p_seller_id, p_product_id, p_order_id, p_subject)
    RETURNING id INTO v_conversation_id;
  END IF;
  
  RETURN v_conversation_id;
END;
$$;

-- Update messages insert trigger to check for blocks
CREATE OR REPLACE FUNCTION public.check_message_allowed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conv RECORD;
  other_party_id UUID;
BEGIN
  -- Get conversation
  SELECT * INTO conv FROM conversations WHERE id = NEW.conversation_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;
  
  -- Determine other party
  IF NEW.sender_id = conv.buyer_id THEN
    other_party_id := conv.seller_id;
  ELSIF NEW.sender_id = conv.seller_id THEN
    other_party_id := conv.buyer_id;
  ELSE
    RAISE EXCEPTION 'Sender not part of conversation';
  END IF;
  
  -- Check if blocked (either direction)
  IF public.is_blocked_bidirectional(NEW.sender_id, other_party_id) THEN
    RAISE EXCEPTION 'Cannot send message - user is blocked';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for message block check
DROP TRIGGER IF EXISTS check_message_block ON public.messages;
CREATE TRIGGER check_message_block
  BEFORE INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.check_message_allowed();
