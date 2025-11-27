-- =====================================================
-- SHARE WISHLIST FEATURE
-- Date: 2025-11-27
-- Purpose: Enable sharing wishlists via unique links
-- Phase 5.6 from PRODUCTION.md
-- =====================================================

-- Step 1: Add sharing fields to wishlists table (if not exists, assume wishlist table exists)
-- First check if the table exists and add columns
DO $$ 
BEGIN
  -- Add share_token column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wishlists' 
    AND column_name = 'share_token'
  ) THEN
    ALTER TABLE public.wishlists ADD COLUMN share_token VARCHAR(32) UNIQUE;
  END IF;

  -- Add is_public column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wishlists' 
    AND column_name = 'is_public'
  ) THEN
    ALTER TABLE public.wishlists ADD COLUMN is_public BOOLEAN DEFAULT false;
  END IF;

  -- Add name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wishlists' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE public.wishlists ADD COLUMN name VARCHAR(100) DEFAULT 'My Wishlist';
  END IF;

  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wishlists' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE public.wishlists ADD COLUMN description TEXT;
  END IF;
END $$;

-- Step 2: Create index for share_token lookups
CREATE INDEX IF NOT EXISTS idx_wishlists_share_token ON public.wishlists(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wishlists_is_public ON public.wishlists(is_public) WHERE is_public = true;

-- Step 3: Create function to generate share token
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS VARCHAR(32) AS $$
DECLARE
  new_token VARCHAR(32);
  token_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 32-character token
    new_token := encode(gen_random_bytes(16), 'hex');
    
    -- Check if token already exists
    SELECT EXISTS(
      SELECT 1 FROM public.wishlists WHERE share_token = new_token
    ) INTO token_exists;
    
    EXIT WHEN NOT token_exists;
  END LOOP;
  
  RETURN new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 4: Create function to enable wishlist sharing
CREATE OR REPLACE FUNCTION public.enable_wishlist_sharing(p_user_id UUID DEFAULT NULL)
RETURNS TABLE(share_token VARCHAR(32), share_url TEXT) AS $$
DECLARE
  actual_user_id UUID;
  new_token VARCHAR(32);
BEGIN
  actual_user_id := COALESCE(p_user_id, (SELECT auth.uid()));
  
  -- Check if user owns the wishlist
  IF actual_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Generate new token
  new_token := public.generate_share_token();

  -- Update wishlist with share token and set as public
  UPDATE public.wishlists
  SET 
    share_token = new_token,
    is_public = true
  WHERE user_id = actual_user_id;

  -- Return the token and share URL
  RETURN QUERY SELECT 
    new_token AS share_token,
    '/wishlist/shared/' || new_token AS share_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 5: Create function to disable wishlist sharing
CREATE OR REPLACE FUNCTION public.disable_wishlist_sharing(p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  actual_user_id UUID;
BEGIN
  actual_user_id := COALESCE(p_user_id, (SELECT auth.uid()));
  
  IF actual_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Remove share token and set as private
  UPDATE public.wishlists
  SET 
    share_token = NULL,
    is_public = false
  WHERE user_id = actual_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 6: Create function to get shared wishlist
CREATE OR REPLACE FUNCTION public.get_shared_wishlist(p_share_token VARCHAR(32))
RETURNS TABLE(
  user_id UUID,
  name VARCHAR(100),
  description TEXT,
  product_id UUID,
  product_title TEXT,
  product_price DECIMAL(10, 2),
  product_image TEXT,
  added_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.user_id,
    w.name,
    w.description,
    w.product_id,
    p.title AS product_title,
    p.price AS product_price,
    p.images[1] AS product_image,
    w.created_at AS added_at
  FROM public.wishlists w
  LEFT JOIN public.products p ON p.id = w.product_id
  WHERE 
    w.share_token = p_share_token
    AND w.is_public = true
  ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 7: Update RLS policy to allow viewing public wishlists
DROP POLICY IF EXISTS "wishlists_select_own_or_public" ON public.wishlists;

CREATE POLICY "wishlists_select_own_or_public"
  ON public.wishlists FOR SELECT
  USING (
    user_id = (SELECT auth.uid()) OR 
    (is_public = true AND share_token IS NOT NULL)
  );

-- Step 8: Add comments for documentation
COMMENT ON COLUMN public.wishlists.share_token IS 'Unique token for sharing wishlist publicly';
COMMENT ON COLUMN public.wishlists.is_public IS 'Whether the wishlist is publicly accessible via share link';
COMMENT ON COLUMN public.wishlists.name IS 'Custom name for the wishlist';
COMMENT ON COLUMN public.wishlists.description IS 'Optional description for shared wishlists';
COMMENT ON FUNCTION public.enable_wishlist_sharing IS 'Generate a share token and make wishlist public';
COMMENT ON FUNCTION public.disable_wishlist_sharing IS 'Remove share token and make wishlist private';
COMMENT ON FUNCTION public.get_shared_wishlist IS 'Get wishlist items for a shared wishlist by token';

-- Migration complete
