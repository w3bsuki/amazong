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

COMMENT ON TABLE public.blocked_users IS 'Tracks users who have blocked other users from messaging them';;
