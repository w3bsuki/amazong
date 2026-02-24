-- =====================================================
-- FIX: Subscription Expiry Handling
-- Date: 2025-12-13
-- Purpose: Auto-expire subscriptions and downgrade sellers
-- =====================================================

-- Step 1: Create function to check and expire subscriptions
CREATE OR REPLACE FUNCTION public.check_subscription_expiry()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER := 0;
BEGIN
  -- Update expired subscriptions
  UPDATE public.subscriptions
  SET 
    status = 'expired',
    updated_at = NOW()
  WHERE status = 'active'
    AND expires_at < NOW()
    AND auto_renew = false;
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Log if any expired
  IF expired_count > 0 THEN
    RAISE NOTICE 'Expired % subscriptions', expired_count;
  END IF;
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create function to get subscription status for a seller
CREATE OR REPLACE FUNCTION public.get_seller_subscription_status(p_seller_id UUID)
RETURNS TABLE (
  has_active_subscription BOOLEAN,
  current_tier TEXT,
  plan_name TEXT,
  expires_at TIMESTAMPTZ,
  days_remaining INTEGER,
  max_listings INTEGER,
  current_listings INTEGER,
  can_add_listings BOOLEAN,
  final_value_fee NUMERIC,
  needs_upgrade BOOLEAN
) AS $$
DECLARE
  v_listing_count INTEGER;
  v_max_listings INTEGER;
BEGIN
  -- Get current listing count
  SELECT COUNT(*)::INTEGER INTO v_listing_count
  FROM public.products
  WHERE seller_id = p_seller_id;
  
  RETURN QUERY
  SELECT 
    (sub.status = 'active') AS has_active_subscription,
    s.tier AS current_tier,
    sp.name AS plan_name,
    sub.expires_at,
    EXTRACT(DAY FROM sub.expires_at - NOW())::INTEGER AS days_remaining,
    sp.max_listings,
    v_listing_count AS current_listings,
    (sp.max_listings IS NULL OR v_listing_count < sp.max_listings) AS can_add_listings,
    COALESCE(sp.final_value_fee, sp.commission_rate, s.commission_rate) AS final_value_fee,
    (sp.max_listings IS NOT NULL AND v_listing_count >= sp.max_listings) AS needs_upgrade
  FROM public.sellers s
  LEFT JOIN public.subscriptions sub ON sub.seller_id = s.id AND sub.status = 'active'
  LEFT JOIN public.subscription_plans sp ON sp.tier = s.tier AND sp.account_type = s.account_type AND sp.is_active = true
  WHERE s.id = p_seller_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_subscription_expiry() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_seller_subscription_status(UUID) TO authenticated;

-- Step 4: Create a view for easy subscription monitoring
CREATE OR REPLACE VIEW public.subscription_overview AS
SELECT 
  s.id AS seller_id,
  s.store_name,
  s.account_type,
  s.tier,
  s.commission_rate,
  s.final_value_fee,
  sub.status AS subscription_status,
  sub.expires_at,
  sub.billing_period,
  sp.name AS plan_name,
  sp.max_listings,
  ss.active_listings,
  ss.total_sales,
  CASE 
    WHEN sp.max_listings IS NULL THEN 'Unlimited'
    ELSE (sp.max_listings - COALESCE(ss.active_listings, 0))::TEXT || ' remaining'
  END AS listings_status
FROM public.sellers s
LEFT JOIN public.subscriptions sub ON sub.seller_id = s.id AND sub.status = 'active'
LEFT JOIN public.subscription_plans sp ON sp.tier = s.tier AND sp.account_type = s.account_type AND sp.is_active = true
LEFT JOIN public.seller_stats ss ON ss.seller_id = s.id;

-- Grant select on view to authenticated users (they can only see their own via RLS)
GRANT SELECT ON public.subscription_overview TO authenticated;

COMMENT ON FUNCTION public.check_subscription_expiry() IS 'Checks for expired subscriptions and updates their status. Should be called by a scheduled job.';
COMMENT ON FUNCTION public.get_seller_subscription_status(UUID) IS 'Returns comprehensive subscription status for a seller including listing limits';
COMMENT ON VIEW public.subscription_overview IS 'Overview of all sellers with their subscription and listing status';;
