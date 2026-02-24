-- =====================================================
-- CRITICAL FIX: Listing Limit Enforcement
-- Date: 2025-12-13
-- Purpose: Enforce max_listings based on subscription plan
-- =====================================================

-- Step 1: Create function to check listing limits BEFORE insert
CREATE OR REPLACE FUNCTION public.check_listing_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  max_allowed INTEGER;
  seller_tier TEXT;
  seller_account_type TEXT;
BEGIN
  -- Get current listing count for this seller
  SELECT COUNT(*) INTO current_count
  FROM public.products
  WHERE seller_id = NEW.seller_id;
  
  -- Get seller's tier and account_type
  SELECT tier, account_type INTO seller_tier, seller_account_type
  FROM public.sellers
  WHERE id = NEW.seller_id;
  
  -- Default to 'free' tier if not set
  IF seller_tier IS NULL THEN
    seller_tier := 'free';
  END IF;
  
  -- Default to 'personal' account type if not set
  IF seller_account_type IS NULL THEN
    seller_account_type := 'personal';
  END IF;
  
  -- Get max listings from subscription plan
  SELECT max_listings INTO max_allowed
  FROM public.subscription_plans
  WHERE tier = seller_tier 
    AND account_type = seller_account_type
    AND is_active = true
  LIMIT 1;
  
  -- If no plan found, try without account_type filter (fallback)
  IF max_allowed IS NULL THEN
    SELECT max_listings INTO max_allowed
    FROM public.subscription_plans
    WHERE tier = seller_tier
      AND is_active = true
    LIMIT 1;
  END IF;
  
  -- Default to 50 if still no plan found (free tier default)
  IF max_allowed IS NULL THEN
    max_allowed := 50;
  END IF;
  
  -- Check limit (NULL max_allowed means unlimited)
  IF max_allowed IS NOT NULL AND current_count >= max_allowed THEN
    RAISE EXCEPTION 'LISTING_LIMIT_REACHED: You have reached your listing limit (% of %). Please upgrade your plan to add more listings.', 
      current_count, max_allowed
      USING ERRCODE = 'P0001';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger
DROP TRIGGER IF EXISTS check_listing_limit_trigger ON public.products;
CREATE TRIGGER check_listing_limit_trigger
  BEFORE INSERT ON public.products
  FOR EACH ROW 
  EXECUTE FUNCTION public.check_listing_limit();

-- Step 3: Create helper function to get remaining listings
CREATE OR REPLACE FUNCTION public.get_seller_listing_info(p_seller_id UUID)
RETURNS TABLE (
  current_count INTEGER,
  max_allowed INTEGER,
  remaining INTEGER,
  is_unlimited BOOLEAN
) AS $$
DECLARE
  v_current INTEGER;
  v_max INTEGER;
  v_tier TEXT;
  v_account_type TEXT;
BEGIN
  -- Get current count
  SELECT COUNT(*)::INTEGER INTO v_current
  FROM public.products
  WHERE seller_id = p_seller_id;
  
  -- Get seller info
  SELECT tier, account_type INTO v_tier, v_account_type
  FROM public.sellers
  WHERE id = p_seller_id;
  
  -- Get max from plan
  SELECT sp.max_listings INTO v_max
  FROM public.subscription_plans sp
  WHERE sp.tier = COALESCE(v_tier, 'free')
    AND sp.account_type = COALESCE(v_account_type, 'personal')
    AND sp.is_active = true
  LIMIT 1;
  
  -- Return results
  RETURN QUERY SELECT 
    v_current,
    COALESCE(v_max, 50)::INTEGER,
    CASE WHEN v_max IS NULL THEN 999999 ELSE GREATEST(v_max - v_current, 0) END::INTEGER,
    (v_max IS NULL)::BOOLEAN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_seller_listing_info(UUID) TO authenticated;

COMMENT ON FUNCTION public.check_listing_limit() IS 'Enforces listing limits based on seller subscription plan. Raises exception if limit exceeded.';
COMMENT ON FUNCTION public.get_seller_listing_info(UUID) IS 'Returns listing count info for a seller including current count, max allowed, and remaining slots.';;
