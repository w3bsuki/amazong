-- =============================================================================
-- MIGRATION: Merge sellers table into profiles (unified profile system)
-- =============================================================================

-- STEP 1: Add seller columns to profiles if not exists
-- =============================================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS banner_url TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS website_url TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'personal';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_seller BOOLEAN DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_name TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS vat_number TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified_business BOOLEAN DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 12.00;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS final_value_fee NUMERIC DEFAULT 12.00;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS insertion_fee NUMERIC DEFAULT 0;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS per_order_fee NUMERIC DEFAULT 0;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_username_change TIMESTAMPTZ;

-- STEP 2: Create username_history table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.username_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    old_username TEXT NOT NULL,
    new_username TEXT NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_username_history_user_id ON public.username_history(user_id);

-- STEP 3: Migrate data from sellers to profiles
-- =============================================================================

UPDATE public.profiles p
SET 
    bio = COALESCE(p.bio, s.description),
    account_type = COALESCE(s.account_type, 'personal'),
    is_seller = true,
    verified = COALESCE(s.verified, false),
    tier = COALESCE(s.tier, 'free'),
    business_name = COALESCE(p.business_name, s.business_name),
    vat_number = COALESCE(p.vat_number, s.vat_number),
    is_verified_business = COALESCE(s.is_verified_business, false),
    commission_rate = COALESCE(s.commission_rate, 12.00),
    final_value_fee = COALESCE(s.final_value_fee, 12.00),
    insertion_fee = COALESCE(s.insertion_fee, 0),
    per_order_fee = COALESCE(s.per_order_fee, 0),
    website_url = COALESCE(p.website_url, s.website_url),
    social_links = COALESCE(p.social_links, jsonb_build_object(
        'facebook', s.facebook_url,
        'instagram', s.instagram_url,
        'tiktok', s.tiktok_url
    ))
FROM public.sellers s
WHERE p.id = s.id;

-- Generate VALID usernames from store_slug or store_name for existing sellers
-- Clean up: lowercase, replace invalid chars with underscore, ensure starts with letter
UPDATE public.profiles p
SET username = 
    CASE 
        -- If store_slug exists and is valid-ish, clean it
        WHEN s.store_slug IS NOT NULL THEN
            'u_' || LOWER(REGEXP_REPLACE(
                REGEXP_REPLACE(s.store_slug, '[^a-zA-Z0-9]', '_', 'g'),
                '_+', '_', 'g'
            ))
        -- Otherwise use store_name
        ELSE
            'u_' || LOWER(REGEXP_REPLACE(
                REGEXP_REPLACE(s.store_name, '[^a-zA-Z0-9]', '_', 'g'),
                '_+', '_', 'g'
            ))
    END
FROM public.sellers s
WHERE p.id = s.id AND (p.username IS NULL OR p.username = '');

-- Remove trailing underscores from generated usernames
UPDATE public.profiles
SET username = RTRIM(username, '_')
WHERE username LIKE '%_';

-- Ensure all usernames are at least 3 chars (pad with numbers if needed)
UPDATE public.profiles
SET username = username || SUBSTRING(id::text, 1, 5)
WHERE username IS NOT NULL AND LENGTH(username) < 3;

-- STEP 4: Update foreign key references from sellers to profiles
-- =============================================================================

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_seller_id_fkey;
ALTER TABLE public.products 
ADD CONSTRAINT products_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_seller_id_fkey;
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.seller_feedback DROP CONSTRAINT IF EXISTS seller_feedback_seller_id_fkey;
ALTER TABLE public.seller_feedback 
ADD CONSTRAINT seller_feedback_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.buyer_feedback DROP CONSTRAINT IF EXISTS buyer_feedback_seller_id_fkey;
ALTER TABLE public.buyer_feedback 
ADD CONSTRAINT buyer_feedback_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.seller_stats DROP CONSTRAINT IF EXISTS seller_stats_seller_id_fkey;
ALTER TABLE public.seller_stats 
ADD CONSTRAINT seller_stats_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_seller_id_fkey;
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.listing_boosts DROP CONSTRAINT IF EXISTS listing_boosts_seller_id_fkey;
ALTER TABLE public.listing_boosts 
ADD CONSTRAINT listing_boosts_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.business_verification DROP CONSTRAINT IF EXISTS business_verification_seller_id_fkey;
ALTER TABLE public.business_verification 
ADD CONSTRAINT business_verification_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.store_followers DROP CONSTRAINT IF EXISTS store_followers_seller_id_fkey;
ALTER TABLE public.store_followers 
ADD CONSTRAINT store_followers_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- STEP 5: Drop the sellers table
-- =============================================================================

DROP TABLE IF EXISTS public.sellers CASCADE;

-- STEP 6: Create username validation function
-- =============================================================================

CREATE OR REPLACE FUNCTION public.validate_username(username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF LENGTH(username) < 3 OR LENGTH(username) > 30 THEN
        RETURN FALSE;
    END IF;
    
    IF username !~ '^[a-z]' THEN
        RETURN FALSE;
    END IF;
    
    IF username !~ '^[a-z][a-z0-9_]*$' THEN
        RETURN FALSE;
    END IF;
    
    IF username ~ '__' THEN
        RETURN FALSE;
    END IF;
    
    IF username ~ '_$' THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- STEP 7: Add unique constraint and index for username
-- =============================================================================

-- Add unique constraint (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_username_key'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_seller ON public.profiles(is_seller) WHERE is_seller = true;
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);

-- STEP 8: Update handle_new_user trigger
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role, username)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url',
        'buyer',
        NULLIF(LOWER(NEW.raw_user_meta_data->>'username'), '')
    );
    
    INSERT INTO public.buyer_stats (user_id) VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO public.user_verification (user_id, email_verified)
    VALUES (NEW.id, NEW.email_confirmed_at IS NOT NULL)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 9: Auto-set is_seller when user creates listing
-- =============================================================================

CREATE OR REPLACE FUNCTION public.auto_set_seller_flag()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET is_seller = true
    WHERE id = NEW.seller_id AND is_seller = false;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_seller_flag_on_product ON public.products;
CREATE TRIGGER set_seller_flag_on_product
    AFTER INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_set_seller_flag();

-- STEP 10: Update RLS policies
-- =============================================================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- STEP 11: RLS for username_history
-- =============================================================================

ALTER TABLE public.username_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own username history" ON public.username_history;
CREATE POLICY "Users can view own username history"
ON public.username_history FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert username history" ON public.username_history;
CREATE POLICY "System can insert username history"
ON public.username_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- STEP 12: Comments
-- =============================================================================

COMMENT ON TABLE public.profiles IS 'User profiles - the single source of truth for all user identity (buyers and sellers)';
COMMENT ON COLUMN public.profiles.username IS 'Unique username for /u/[username] URLs';
COMMENT ON COLUMN public.profiles.is_seller IS 'Auto-set to true when user creates first listing';
COMMENT ON COLUMN public.profiles.account_type IS 'personal or business';
;
