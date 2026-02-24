-- =====================================================
-- FIX: Auto-initialize seller_stats and business_verification on store creation
-- Date: 2025-12-13
-- Purpose: Ensure all related tables are populated when seller is created
-- =====================================================

-- Step 1: Create trigger function to initialize seller_stats
CREATE OR REPLACE FUNCTION public.init_seller_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert initial seller_stats record
  INSERT INTO public.seller_stats (
    seller_id,
    total_listings,
    active_listings,
    total_sales,
    total_revenue,
    average_rating,
    total_reviews,
    five_star_reviews,
    positive_feedback_pct,
    item_described_pct,
    shipping_speed_pct,
    communication_pct,
    follower_count,
    response_rate_pct,
    shipped_on_time_pct,
    repeat_customer_pct
  ) VALUES (
    NEW.id,
    0, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 0, 100, 100, 0
  )
  ON CONFLICT (seller_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create trigger function to initialize business_verification
CREATE OR REPLACE FUNCTION public.init_business_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create business_verification for business accounts
  IF NEW.account_type = 'business' THEN
    INSERT INTO public.business_verification (
      seller_id,
      legal_name,
      vat_number,
      vat_verified,
      registration_verified,
      bank_verified,
      verification_level,
      verification_notes
    ) VALUES (
      NEW.id,
      NEW.business_name,
      NEW.vat_number,
      false,
      false,
      false,
      0,
      'Pending verification'
    )
    ON CONFLICT (seller_id) DO UPDATE SET
      legal_name = COALESCE(EXCLUDED.legal_name, business_verification.legal_name),
      vat_number = COALESCE(EXCLUDED.vat_number, business_verification.vat_number),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create trigger function to initialize user_verification
CREATE OR REPLACE FUNCTION public.init_user_verification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_verification (
    user_id,
    email_verified,
    phone_verified,
    id_verified,
    address_verified,
    trust_score
  ) VALUES (
    NEW.id,
    true, -- Email is verified through Supabase auth
    false,
    false,
    false,
    10 -- Base trust score
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create triggers on sellers table
DROP TRIGGER IF EXISTS init_seller_stats_trigger ON public.sellers;
CREATE TRIGGER init_seller_stats_trigger
  AFTER INSERT ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.init_seller_stats();

DROP TRIGGER IF EXISTS init_business_verification_trigger ON public.sellers;
CREATE TRIGGER init_business_verification_trigger
  AFTER INSERT OR UPDATE OF account_type ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.init_business_verification();

-- Step 5: Create trigger on profiles table for user_verification
DROP TRIGGER IF EXISTS init_user_verification_trigger ON public.profiles;
CREATE TRIGGER init_user_verification_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.init_user_verification();

-- Step 6: Backfill missing seller_stats for existing sellers
INSERT INTO public.seller_stats (seller_id, total_listings, active_listings, total_sales)
SELECT s.id, 0, 0, 0
FROM public.sellers s
WHERE NOT EXISTS (
  SELECT 1 FROM public.seller_stats ss WHERE ss.seller_id = s.id
)
ON CONFLICT (seller_id) DO NOTHING;

-- Step 7: Backfill missing business_verification for existing business sellers
INSERT INTO public.business_verification (seller_id, legal_name, vat_number, verification_level)
SELECT s.id, s.business_name, s.vat_number, 0
FROM public.sellers s
WHERE s.account_type = 'business'
  AND NOT EXISTS (
    SELECT 1 FROM public.business_verification bv WHERE bv.seller_id = s.id
  )
ON CONFLICT (seller_id) DO NOTHING;

-- Step 8: Backfill missing user_verification for existing profiles
INSERT INTO public.user_verification (user_id, email_verified, trust_score)
SELECT p.id, true, 10
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_verification uv WHERE uv.user_id = p.id
)
ON CONFLICT (user_id) DO NOTHING;

COMMENT ON FUNCTION public.init_seller_stats() IS 'Automatically initializes seller_stats when a new seller is created';
COMMENT ON FUNCTION public.init_business_verification() IS 'Automatically initializes business_verification for business account sellers';
COMMENT ON FUNCTION public.init_user_verification() IS 'Automatically initializes user_verification when a new profile is created';;
