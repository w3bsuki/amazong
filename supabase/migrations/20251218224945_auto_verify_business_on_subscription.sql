-- =====================================================
-- AUTO-VERIFY BUSINESS ON PREMIUM SUBSCRIPTION
-- When a business account gets a professional or enterprise tier subscription,
-- automatically set is_verified_business = true
-- =====================================================

-- Function to auto-verify business accounts on premium subscription
CREATE OR REPLACE FUNCTION public.auto_verify_business_on_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger on subscription activation with premium tiers
  IF NEW.status = 'active' AND NEW.plan_type IN ('professional', 'enterprise') THEN
    -- Update profile: set verified business flag for business accounts
    UPDATE public.profiles
    SET 
      is_verified_business = TRUE,
      updated_at = NOW()
    WHERE id = NEW.seller_id 
      AND account_type = 'business';
    
    -- Update business_verification record if exists
    UPDATE public.business_verification
    SET
      verification_level = GREATEST(verification_level, 3),
      updated_at = NOW()
    WHERE seller_id = NEW.seller_id;
  END IF;
  
  -- If subscription is cancelled/expired, don't auto-remove verified status
  -- (admin can manually remove if needed)
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on subscriptions table (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'auto_verify_business_trigger'
  ) THEN
    CREATE TRIGGER auto_verify_business_trigger
      AFTER INSERT OR UPDATE ON public.subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION public.auto_verify_business_on_subscription();
  END IF;
END $$;

-- Grant execute to authenticated users (for trigger context)
GRANT EXECUTE ON FUNCTION public.auto_verify_business_on_subscription() TO authenticated;
GRANT EXECUTE ON FUNCTION public.auto_verify_business_on_subscription() TO service_role;;
