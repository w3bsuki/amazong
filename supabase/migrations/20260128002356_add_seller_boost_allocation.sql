-- Add monthly boost tracking to profiles
-- Tracks how many boosts a seller has used this month vs their allocation

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS boosts_remaining INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS boosts_allocated INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS boosts_reset_at TIMESTAMPTZ;

-- Comment for clarity
COMMENT ON COLUMN public.profiles.boosts_remaining IS 'Number of free boosts remaining this period (from subscription)';
COMMENT ON COLUMN public.profiles.boosts_allocated IS 'Total boosts allocated per period (from subscription plan)';
COMMENT ON COLUMN public.profiles.boosts_reset_at IS 'When the boost allocation next resets (usually 1st of next month)';

-- Function to reset boosts monthly (can be called by cron or webhook)
CREATE OR REPLACE FUNCTION public.reset_monthly_boosts()
RETURNS void AS $$
BEGIN
  -- Reset boosts for users where reset date has passed
  UPDATE public.profiles p
  SET 
    boosts_remaining = COALESCE(
      (SELECT sp.boosts_included 
       FROM subscriptions s 
       JOIN subscription_plans sp ON s.plan_type = sp.tier AND sp.account_type = p.account_type
       WHERE s.seller_id = p.id 
         AND s.status = 'active'
       ORDER BY s.created_at DESC 
       LIMIT 1),
      0
    ),
    boosts_reset_at = date_trunc('month', NOW() + interval '1 month')
  WHERE boosts_reset_at IS NULL OR boosts_reset_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to initialize boosts when subscription is activated
CREATE OR REPLACE FUNCTION public.init_subscription_boosts()
RETURNS TRIGGER AS $$
DECLARE
  plan_boosts INTEGER;
BEGIN
  -- Only run when subscription becomes active
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    -- Get boosts included in this plan
    SELECT boosts_included INTO plan_boosts
    FROM subscription_plans
    WHERE tier = NEW.plan_type
    LIMIT 1;
    
    -- Update profile with boost allocation
    UPDATE profiles
    SET 
      boosts_remaining = COALESCE(plan_boosts, 0),
      boosts_allocated = COALESCE(plan_boosts, 0),
      boosts_reset_at = date_trunc('month', NOW() + interval '1 month')
    WHERE id = NEW.seller_id;
  END IF;
  
  -- When subscription expires or is cancelled, reset boosts to 0
  IF NEW.status IN ('expired', 'cancelled') AND OLD.status = 'active' THEN
    UPDATE profiles
    SET 
      boosts_remaining = 0,
      boosts_allocated = 0,
      boosts_reset_at = NULL
    WHERE id = NEW.seller_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription status changes to init boosts
DROP TRIGGER IF EXISTS on_subscription_init_boosts ON public.subscriptions;
CREATE TRIGGER on_subscription_init_boosts
  AFTER INSERT OR UPDATE OF status ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.init_subscription_boosts();

-- Also add subscription notification type to notifications table check constraint
-- First check existing constraint
DO $$
BEGIN
  -- Try to add new check constraint with subscription type
  ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
  ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
    CHECK (type = ANY (ARRAY['purchase'::text, 'order_status'::text, 'message'::text, 'review'::text, 'system'::text, 'promotion'::text, 'subscription'::text]));
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Constraint update skipped: %', SQLERRM;
END $$;;
