-- ============================================================================
-- BLOCKED USERS HELPER FUNCTIONS
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

GRANT EXECUTE ON FUNCTION public.get_blocked_users() TO authenticated;;
