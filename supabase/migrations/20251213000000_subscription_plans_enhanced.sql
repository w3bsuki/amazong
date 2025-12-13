-- Migration: Add account_type and boosts_included to subscription_plans
-- Purpose: Support Personal/Business account types and monthly boost allocations

-- Step 1: Add new columns to subscription_plans
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'business')),
ADD COLUMN IF NOT EXISTS boosts_included INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS priority_support BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS analytics_access TEXT DEFAULT 'none' CHECK (analytics_access IN ('none', 'basic', 'full')),
ADD COLUMN IF NOT EXISTS badge_type TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS description_bg TEXT;

-- Step 2: Add account_type to sellers table if not exists
ALTER TABLE public.sellers
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'business'));

-- Step 3: Update existing plans with account types and boost allocations
-- Clear existing plans and insert fresh ones with full data
DELETE FROM public.subscription_plans WHERE is_active = true;

-- Personal Plans
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  commission_rate, boosts_included, priority_support, analytics_access,
  badge_type, description, description_bg, features, is_active
) VALUES
-- Personal Basic (Free)
(
  'Starter', 'basic', 'personal', 0.00, 0.00, 10, 10.00, 0, false, 'none',
  NULL,
  'Perfect for casual sellers',
  'Идеален за случайни продавачи',
  '["10 active listings", "10% commission", "Standard search visibility", "Community support"]'::jsonb,
  true
),
-- Personal Premium
(
  'Premium', 'premium', 'personal', 14.99, 149.00, 50, 7.00, 3, true, 'basic',
  'premium_seller',
  'For serious sellers who want to grow',
  'За сериозни продавачи, които искат да растат',
  '["50 active listings", "7% commission", "3 free boosts/month", "Premium Seller badge", "Priority support", "Basic analytics"]'::jsonb,
  true
),
-- Business Basic (Free tier for businesses)
(
  'Business Starter', 'basic', 'business', 0.00, 0.00, 25, 8.00, 0, false, 'basic',
  'verified_business',
  'Get started as a registered business',
  'Започнете като регистриран бизнес',
  '["25 active listings", "8% commission", "Verified Business badge", "Basic analytics", "Invoice support"]'::jsonb,
  true
),
-- Business Premium
(
  'Business Pro', 'premium', 'business', 29.99, 299.00, NULL, 5.00, 5, true, 'full',
  'verified_pro',
  'Professional selling tools for growing businesses',
  'Професионални инструменти за растящи бизнеси',
  '["Unlimited listings", "5% commission", "5 free boosts/month", "Verified Pro badge", "Priority support", "Full analytics", "Bulk listing tools"]'::jsonb,
  true
),
-- Business Enterprise
(
  'Enterprise', 'business', 'business', 99.99, 999.00, NULL, 3.00, 15, true, 'full',
  'enterprise_partner',
  'For high-volume sellers and brands',
  'За високообемни продавачи и марки',
  '["Unlimited everything", "3% commission", "15 free boosts/month", "Enterprise Partner badge", "Dedicated account manager", "API access", "Custom integrations", "Featured placement"]'::jsonb,
  true
);

-- Step 4: Create function to allocate monthly boosts
CREATE OR REPLACE FUNCTION allocate_monthly_boosts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  seller_record RECORD;
  plan_record RECORD;
BEGIN
  -- Loop through active subscriptions
  FOR seller_record IN 
    SELECT s.id, s.tier, sub.plan_type
    FROM sellers s
    LEFT JOIN subscriptions sub ON sub.seller_id = s.id AND sub.status = 'active'
    WHERE s.tier != 'basic' OR sub.id IS NOT NULL
  LOOP
    -- Get the plan details
    SELECT boosts_included INTO plan_record
    FROM subscription_plans
    WHERE tier = COALESCE(seller_record.plan_type, seller_record.tier)
    AND is_active = true
    LIMIT 1;
    
    -- Create boost allocation record (if you have such a table)
    -- For now, this is a placeholder for future monthly boost allocation logic
    IF plan_record.boosts_included > 0 THEN
      RAISE NOTICE 'Allocate % boosts to seller %', plan_record.boosts_included, seller_record.id;
    END IF;
  END LOOP;
END;
$$;

-- Step 5: Add RLS policy for subscription_plans (public read)
DROP POLICY IF EXISTS "subscription_plans_select" ON public.subscription_plans;
CREATE POLICY "subscription_plans_select"
  ON public.subscription_plans FOR SELECT
  TO public
  USING (is_active = true);

-- Comments
COMMENT ON COLUMN public.subscription_plans.account_type IS 'Personal or Business account type';
COMMENT ON COLUMN public.subscription_plans.boosts_included IS 'Number of free listing boosts included per month';
COMMENT ON COLUMN public.subscription_plans.priority_support IS 'Whether priority support is included';
COMMENT ON COLUMN public.subscription_plans.analytics_access IS 'Level of analytics access: none, basic, full';
COMMENT ON COLUMN public.subscription_plans.badge_type IS 'Type of seller badge awarded with this plan';
COMMENT ON COLUMN public.sellers.account_type IS 'Personal or Business account type';
