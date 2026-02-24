-- =====================================================
-- FIX: Tier Enum Consistency Across Tables
-- Date: 2025-12-13
-- Purpose: Align tier values in sellers, subscriptions, subscription_plans
-- =====================================================

-- Step 1: Update subscriptions table to accept all tier values
ALTER TABLE public.subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('free', 'starter', 'basic', 'premium', 'professional', 'business', 'enterprise'));

-- Step 2: Ensure sellers.tier constraint matches
ALTER TABLE public.sellers 
DROP CONSTRAINT IF EXISTS sellers_tier_check;

ALTER TABLE public.sellers
ADD CONSTRAINT sellers_tier_check 
CHECK (tier IN ('free', 'starter', 'basic', 'premium', 'professional', 'business', 'enterprise'));

-- Step 3: Update any 'basic' tier sellers to 'free' (basic was renamed to free)
UPDATE public.sellers 
SET tier = 'free' 
WHERE tier = 'basic';

-- Step 4: Ensure subscription_plans has all required tiers with correct structure
-- First, update existing free tier if it exists with wrong values
UPDATE public.subscription_plans
SET max_listings = 50
WHERE tier = 'free' AND account_type = 'personal' AND (max_listings IS NULL OR max_listings != 50);

-- Step 5: Add default free tier if missing for personal
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings,
  final_value_fee, commission_rate, insertion_fee, per_order_fee,
  boosts_included, priority_support, analytics_access, features, is_active
)
SELECT 
  'Free', 'free', 'personal', 0.00, 0.00, 50,
  12.00, 12.00, 0.30, 0.25,
  0, false, 'none', 
  '["50 free listings per month", "12% fee when you sell", "0.25 лв per order", "Standard search visibility"]'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscription_plans 
  WHERE tier = 'free' AND account_type = 'personal' AND is_active = true
);

-- Step 6: Add default free tier for business if missing
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings,
  final_value_fee, commission_rate, insertion_fee, per_order_fee,
  boosts_included, priority_support, analytics_access, badge_type, features, is_active
)
SELECT 
  'Business Free', 'free', 'business', 0.00, 0.00, 100,
  10.00, 10.00, 0.25, 0.25,
  0, false, 'basic', 'verified_business',
  '["100 free listings per month", "10% fee when you sell", "Verified Business badge", "Basic analytics"]'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscription_plans 
  WHERE tier = 'free' AND account_type = 'business' AND is_active = true
);

COMMENT ON TABLE public.subscriptions IS 'Seller subscriptions with consistent tier values: free, starter, basic, premium, professional, business, enterprise';;
