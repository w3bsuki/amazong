-- =====================================================
-- FIX: Sync all fee fields when subscription activates
-- Date: 2025-12-13
-- Purpose: Update seller fees from subscription plan on status change
-- =====================================================

-- Step 1: Drop existing trigger
DROP TRIGGER IF EXISTS on_subscription_status_change ON public.subscriptions;

-- Step 2: Create improved function to sync all seller fees from plan
CREATE OR REPLACE FUNCTION public.sync_seller_from_subscription()
RETURNS TRIGGER AS $$
DECLARE
  v_plan RECORD;
BEGIN
  -- When subscription becomes active
  IF NEW.status = 'active' THEN
    -- Get the full plan details
    SELECT * INTO v_plan
    FROM public.subscription_plans
    WHERE tier = NEW.plan_type
      AND is_active = true
    LIMIT 1;
    
    IF v_plan IS NOT NULL THEN
      -- Update ALL seller fields from the plan
      UPDATE public.sellers
      SET 
        tier = NEW.plan_type,
        commission_rate = COALESCE(v_plan.final_value_fee, v_plan.commission_rate, 12.00),
        final_value_fee = COALESCE(v_plan.final_value_fee, v_plan.commission_rate, 12.00),
        insertion_fee = COALESCE(v_plan.insertion_fee, 0),
        per_order_fee = COALESCE(v_plan.per_order_fee, 0)
      WHERE id = NEW.seller_id;
    END IF;
    
  -- When subscription cancelled/expired - downgrade to free
  ELSIF NEW.status IN ('cancelled', 'expired') AND 
        (OLD.status IS NULL OR OLD.status = 'active') THEN
    -- Check if there's another active subscription
    IF NOT EXISTS (
      SELECT 1 FROM public.subscriptions 
      WHERE seller_id = NEW.seller_id 
        AND status = 'active' 
        AND id != NEW.id
    ) THEN
      -- Get the seller's account type for correct free tier
      DECLARE
        v_account_type TEXT;
        v_free_plan RECORD;
      BEGIN
        SELECT account_type INTO v_account_type
        FROM public.sellers
        WHERE id = NEW.seller_id;
        
        -- Get the free tier for this account type
        SELECT * INTO v_free_plan
        FROM public.subscription_plans
        WHERE tier = 'free'
          AND account_type = COALESCE(v_account_type, 'personal')
          AND is_active = true
        LIMIT 1;
        
        -- Downgrade to free tier
        UPDATE public.sellers
        SET 
          tier = 'free',
          commission_rate = COALESCE(v_free_plan.final_value_fee, 12.00),
          final_value_fee = COALESCE(v_free_plan.final_value_fee, 12.00),
          insertion_fee = COALESCE(v_free_plan.insertion_fee, 0.30),
          per_order_fee = COALESCE(v_free_plan.per_order_fee, 0.25)
        WHERE id = NEW.seller_id;
      END;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create new trigger
CREATE TRIGGER on_subscription_status_change
  AFTER INSERT OR UPDATE OF status ON public.subscriptions
  FOR EACH ROW 
  EXECUTE FUNCTION public.sync_seller_from_subscription();

-- Step 4: Add stripe fields to subscriptions if missing
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Step 5: Sync existing active subscriptions to ensure fees are correct
UPDATE public.sellers s
SET 
  commission_rate = sp.final_value_fee,
  final_value_fee = sp.final_value_fee,
  insertion_fee = sp.insertion_fee,
  per_order_fee = sp.per_order_fee
FROM public.subscriptions sub
JOIN public.subscription_plans sp ON sp.tier = sub.plan_type AND sp.is_active = true
WHERE s.id = sub.seller_id
  AND sub.status = 'active';

COMMENT ON FUNCTION public.sync_seller_from_subscription() IS 'Syncs ALL seller fee fields when subscription status changes';;
