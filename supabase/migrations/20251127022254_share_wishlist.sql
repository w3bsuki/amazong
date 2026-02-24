-- =====================================================
-- SHARE WISHLIST MIGRATION
-- Date: 2025-11-27
-- Purpose: Add wishlist sharing functionality
-- Phase 5.6 from PRODUCTION.md
-- Note: Adapted for current schema where wishlists table
--       stores items directly (user_id, product_id per row)
-- =====================================================

-- Step 1: Add sharing columns to wishlists table
ALTER TABLE public.wishlists
  ADD COLUMN IF NOT EXISTS share_token VARCHAR(32),
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS name VARCHAR(100) DEFAULT 'My Wishlist',
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 2: Create index for share_token lookups
CREATE INDEX IF NOT EXISTS idx_wishlists_share_token ON public.wishlists(share_token)
WHERE share_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wishlists_public ON public.wishlists(is_public)
WHERE is_public = true;

-- Step 3: Create function to generate unique share token
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS VARCHAR(32)
LANGUAGE plpgsql
AS $$
DECLARE
  v_token VARCHAR(32);
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_token := encode(gen_random_bytes(16), 'hex');
    SELECT EXISTS(SELECT 1 FROM public.wishlists WHERE share_token = v_token) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_token;
END;
$$;

-- Step 4: Create function to enable wishlist sharing (for all user's items)
CREATE OR REPLACE FUNCTION public.enable_wishlist_sharing(p_user_id UUID DEFAULT NULL)
RETURNS TABLE(share_token VARCHAR, share_url TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user UUID := COALESCE(p_user_id, auth.uid());
  v_token VARCHAR(32);
BEGIN
  -- Get existing token or generate new one
  SELECT w.share_token INTO v_token
  FROM public.wishlists w
  WHERE w.user_id = v_user
  AND w.share_token IS NOT NULL
  LIMIT 1;
  
  IF v_token IS NULL THEN
    v_token := public.generate_share_token();
  END IF;
  
  -- Update all wishlist items for this user
  UPDATE public.wishlists
  SET 
    share_token = v_token,
    is_public = true
  WHERE user_id = v_user;
  
  RETURN QUERY SELECT v_token::VARCHAR, ('/wishlist/shared/' || v_token)::TEXT;
END;
$$;

-- Step 5: Create function to disable wishlist sharing
CREATE OR REPLACE FUNCTION public.disable_wishlist_sharing(p_user_id UUID DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user UUID := COALESCE(p_user_id, auth.uid());
BEGIN
  UPDATE public.wishlists
  SET is_public = false
  WHERE user_id = v_user;
END;
$$;

-- Step 6: Create function to get public wishlist by share token
CREATE OR REPLACE FUNCTION public.get_shared_wishlist(p_share_token VARCHAR)
RETURNS TABLE(
  wishlist_name VARCHAR,
  wishlist_description TEXT,
  owner_name TEXT,
  product_id UUID,
  product_title TEXT,
  product_price NUMERIC,
  product_image TEXT,
  added_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.name,
    w.description,
    COALESCE(pr.full_name, 'Anonymous')::TEXT,
    p.id,
    p.title,
    p.price,
    p.images[1],
    w.created_at
  FROM public.wishlists w
  JOIN public.profiles pr ON w.user_id = pr.id
  JOIN public.products p ON w.product_id = p.id
  WHERE w.share_token = p_share_token
  AND w.is_public = true
  ORDER BY w.created_at DESC;
END;
$$;

-- Step 7: Drop and recreate RLS policies for wishlists to include public access
DROP POLICY IF EXISTS "wishlists_select_policy" ON public.wishlists;
DROP POLICY IF EXISTS "wishlists_select_public" ON public.wishlists;

CREATE POLICY "wishlists_select_own_or_public"
  ON public.wishlists FOR SELECT
  USING (is_public = true OR user_id = auth.uid());;
