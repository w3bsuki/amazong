-- =====================================================
-- UPDATE sync_seller_from_subscription TO SYNC ALL FEES
-- Ensures tier, commission_rate, and final_value_fee are all synced
-- =====================================================

CREATE OR REPLACE FUNCTION public.sync_seller_from_subscription()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    tier = NEW.plan_type,
    commission_rate = COALESCE(
      (SELECT commission_rate FROM public.subscription_plans 
       WHERE tier = NEW.plan_type 
       AND account_type = (SELECT account_type FROM public.profiles WHERE id = NEW.seller_id)
       LIMIT 1),
      12.00
    ),
    final_value_fee = COALESCE(
      (SELECT final_value_fee FROM public.subscription_plans 
       WHERE tier = NEW.plan_type 
       AND account_type = (SELECT account_type FROM public.profiles WHERE id = NEW.seller_id)
       LIMIT 1),
      12.00
    ),
    updated_at = NOW() 
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;;
