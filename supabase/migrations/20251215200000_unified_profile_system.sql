-- =====================================================
-- UNIFIED PROFILE SYSTEM MIGRATION
-- Date: 2025-12-15
-- Purpose: Implement single-identity profile system
-- - Add username to profiles (required, unique)
-- - Add display_name, bio, banner for public profiles
-- - Add account_type (personal/business) to profiles
-- - Add business fields for business accounts
-- - Add buyer/seller stats and ratings
-- - Track username changes (rate limited)
-- =====================================================

-- Step 1: Add username column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
END $$;

-- Step 2: Add display_name column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
  END IF;
END $$;

-- Step 3: Add bio column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN bio TEXT;
  END IF;
END $$;

-- Step 4: Add banner_url column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'banner_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN banner_url TEXT;
  END IF;
END $$;

-- Step 5: Add account_type column (personal/business)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'account_type'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN account_type TEXT DEFAULT 'personal' 
      CHECK (account_type IN ('personal', 'business'));
  END IF;
END $$;

-- Step 6: Add is_seller flag (becomes true when user lists first item)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'is_seller'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_seller BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Step 7: Add business fields (only used when account_type = 'business')
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'business_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN business_name TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'vat_number'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN vat_number TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'business_address'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN business_address JSONB;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN website_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'social_links'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN social_links JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN location TEXT;
  END IF;
END $$;

-- Step 8: Add stats columns
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'total_sales'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN total_sales INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'total_purchases'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN total_purchases INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'seller_rating'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN seller_rating DECIMAL(3,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'seller_rating_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN seller_rating_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'buyer_rating'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN buyer_rating DECIMAL(3,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'buyer_rating_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN buyer_rating_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_active_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN last_active_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Step 9: Add username change tracking
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_username_change'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN last_username_change TIMESTAMPTZ;
  END IF;
END $$;

-- Step 10: Add verified_business flag
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'verified_business'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN verified_business BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Step 11: Create username_history table for tracking changes
CREATE TABLE IF NOT EXISTS public.username_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  old_username TEXT NOT NULL,
  new_username TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 12: Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_seller ON public.profiles(is_seller);
CREATE INDEX IF NOT EXISTS idx_profiles_seller_rating ON public.profiles(seller_rating DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_total_sales ON public.profiles(total_sales DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles(last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_username_history_user ON public.username_history(user_id);

-- Step 13: Enable RLS on username_history
ALTER TABLE public.username_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for username_history
DROP POLICY IF EXISTS "username_history_select_own" ON public.username_history;
CREATE POLICY "username_history_select_own"
  ON public.username_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "username_history_insert_system" ON public.username_history;
CREATE POLICY "username_history_insert_system"
  ON public.username_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Step 14: Generate usernames for existing users that don't have one
-- Uses email prefix or UUID
UPDATE public.profiles
SET username = LOWER(
  REGEXP_REPLACE(
    COALESCE(
      SPLIT_PART(email, '@', 1),
      SUBSTRING(id::TEXT FROM 1 FOR 8)
    ),
    '[^a-z0-9_]',
    '',
    'g'
  )
)
WHERE username IS NULL;

-- Handle duplicates by appending random suffix
DO $$
DECLARE
  dup RECORD;
  new_username TEXT;
  counter INTEGER := 0;
BEGIN
  FOR dup IN 
    SELECT id, username 
    FROM public.profiles 
    WHERE username IN (
      SELECT username FROM public.profiles GROUP BY username HAVING COUNT(*) > 1
    )
    ORDER BY created_at ASC
  LOOP
    counter := counter + 1;
    IF counter > 1 THEN
      new_username := dup.username || '_' || SUBSTRING(dup.id::TEXT FROM 1 FOR 4);
      UPDATE public.profiles SET username = new_username WHERE id = dup.id;
    END IF;
  END LOOP;
END $$;

-- Step 15: Sync is_seller flag from existing sellers table
UPDATE public.profiles p
SET is_seller = TRUE
WHERE EXISTS (
  SELECT 1 FROM public.sellers s WHERE s.id = p.id
);

-- Step 16: Sync account_type from existing sellers table
UPDATE public.profiles p
SET account_type = COALESCE(s.account_type, 'personal')
FROM public.sellers s
WHERE s.id = p.id AND p.is_seller = TRUE;

-- Step 17: Create function to validate username
CREATE OR REPLACE FUNCTION public.validate_username(username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Must be 3-30 characters
  IF LENGTH(username) < 3 OR LENGTH(username) > 30 THEN
    RETURN FALSE;
  END IF;
  
  -- Must start with letter or number
  IF NOT (username ~ '^[a-z0-9]') THEN
    RETURN FALSE;
  END IF;
  
  -- Can only contain lowercase letters, numbers, underscores
  IF NOT (username ~ '^[a-z0-9_]+$') THEN
    RETURN FALSE;
  END IF;
  
  -- Cannot have consecutive underscores
  IF username ~ '__' THEN
    RETURN FALSE;
  END IF;
  
  -- Cannot end with underscore
  IF username ~ '_$' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 18: Create function to check if username change is allowed
CREATE OR REPLACE FUNCTION public.can_change_username(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  last_change TIMESTAMPTZ;
BEGIN
  SELECT last_username_change INTO last_change
  FROM public.profiles
  WHERE id = user_id;
  
  -- If never changed, allow
  IF last_change IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Allow change every 14 days
  RETURN last_change < NOW() - INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 19: Create buyer_feedback table (sellers rating buyers)
CREATE TABLE IF NOT EXISTS public.buyer_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  -- Buyer qualities
  prompt_payment BOOLEAN DEFAULT TRUE,
  good_communication BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(seller_id, order_id)
);

-- Indexes for buyer_feedback
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_buyer_id ON public.buyer_feedback(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_seller_id ON public.buyer_feedback(seller_id);
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_order_id ON public.buyer_feedback(order_id);

-- Enable RLS on buyer_feedback
ALTER TABLE public.buyer_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for buyer_feedback
DROP POLICY IF EXISTS "buyer_feedback_select_all" ON public.buyer_feedback;
CREATE POLICY "buyer_feedback_select_all"
  ON public.buyer_feedback FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "buyer_feedback_insert_seller" ON public.buyer_feedback;
CREATE POLICY "buyer_feedback_insert_seller"
  ON public.buyer_feedback FOR INSERT
  WITH CHECK (
    auth.uid() = seller_id
    AND (
      order_id IS NULL 
      OR EXISTS (
        SELECT 1 FROM public.order_items oi
        JOIN public.orders o ON o.id = oi.order_id
        WHERE oi.order_id = buyer_feedback.order_id
        AND oi.seller_id = auth.uid()
        AND o.status IN ('delivered', 'completed')
      )
    )
  );

-- Step 20: Create function to update buyer rating
CREATE OR REPLACE FUNCTION public.update_buyer_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET 
    buyer_rating = (
      SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
      FROM public.buyer_feedback
      WHERE buyer_id = NEW.buyer_id
    ),
    buyer_rating_count = (
      SELECT COUNT(*)
      FROM public.buyer_feedback
      WHERE buyer_id = NEW.buyer_id
    )
  WHERE id = NEW.buyer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create trigger for buyer rating updates
DROP TRIGGER IF EXISTS trigger_update_buyer_rating ON public.buyer_feedback;
CREATE TRIGGER trigger_update_buyer_rating
  AFTER INSERT OR UPDATE ON public.buyer_feedback
  FOR EACH ROW EXECUTE FUNCTION public.update_buyer_rating();

-- Step 21: Create view for public profiles (for /members page)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.banner_url,
  p.bio,
  p.account_type,
  p.is_seller,
  p.verified_business,
  p.location,
  p.total_sales,
  p.total_purchases,
  p.seller_rating,
  p.seller_rating_count,
  p.buyer_rating,
  p.buyer_rating_count,
  p.created_at,
  p.last_active_at,
  -- Calculate if user is active (posted/bought in last 30 days)
  CASE 
    WHEN p.last_active_at > NOW() - INTERVAL '30 days' THEN TRUE
    ELSE FALSE
  END as is_active,
  -- Business fields only if business account
  CASE WHEN p.account_type = 'business' THEN p.business_name ELSE NULL END as business_name,
  CASE WHEN p.account_type = 'business' THEN p.website_url ELSE NULL END as website_url,
  CASE WHEN p.account_type = 'business' THEN p.social_links ELSE NULL END as social_links
FROM public.profiles p
WHERE p.username IS NOT NULL;

-- Step 22: Update handle_new_user function to include username from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, username, display_name)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    LOWER(new.raw_user_meta_data->>'username'),
    new.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    username = COALESCE(EXCLUDED.username, public.profiles.username),
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 23: Create function to get profile by username
CREATE OR REPLACE FUNCTION public.get_profile_by_username(p_username TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  account_type TEXT,
  is_seller BOOLEAN,
  verified_business BOOLEAN,
  location TEXT,
  business_name TEXT,
  website_url TEXT,
  social_links JSONB,
  total_sales INTEGER,
  total_purchases INTEGER,
  seller_rating DECIMAL(3,2),
  seller_rating_count INTEGER,
  buyer_rating DECIMAL(3,2),
  buyer_rating_count INTEGER,
  created_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.banner_url,
    p.bio,
    p.account_type,
    p.is_seller,
    p.verified_business,
    p.location,
    CASE WHEN p.account_type = 'business' THEN p.business_name ELSE NULL END,
    CASE WHEN p.account_type = 'business' THEN p.website_url ELSE NULL END,
    CASE WHEN p.account_type = 'business' THEN p.social_links ELSE NULL END,
    p.total_sales,
    p.total_purchases,
    p.seller_rating,
    p.seller_rating_count,
    p.buyer_rating,
    p.buyer_rating_count,
    p.created_at,
    p.last_active_at
  FROM public.profiles p
  WHERE LOWER(p.username) = LOWER(p_username);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- Done!
COMMENT ON TABLE public.profiles IS 'User profiles - single identity for buyers and sellers';
COMMENT ON COLUMN public.profiles.username IS 'Unique username used in URLs (/u/username). Required, changeable every 14 days.';
COMMENT ON COLUMN public.profiles.display_name IS 'Display name shown on profile. Defaults to username if not set.';
COMMENT ON COLUMN public.profiles.account_type IS 'personal or business. Business accounts have additional fields.';
COMMENT ON COLUMN public.profiles.is_seller IS 'True if user has listed at least one item for sale.';
