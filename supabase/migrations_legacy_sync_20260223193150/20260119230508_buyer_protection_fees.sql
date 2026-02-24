-- Migration: Add buyer protection fee structure for hybrid monetization model
-- This implements the Vinted-style 0% seller + buyer protection model
-- See: PLAN-monetization-strategy.md for full details

-- Step 1: Add buyer protection columns to subscription_plans
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS seller_fee_percent DECIMAL(4,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS buyer_protection_percent DECIMAL(4,2) DEFAULT 4.0,
ADD COLUMN IF NOT EXISTS buyer_protection_fixed DECIMAL(5,2) DEFAULT 0.50,
ADD COLUMN IF NOT EXISTS buyer_protection_cap DECIMAL(5,2) DEFAULT 15.00;

-- Step 2: Add 'plus' and 'pro' tiers to the check constraint
-- First drop the existing constraint, then create a new one with additional tiers
ALTER TABLE public.subscription_plans 
DROP CONSTRAINT IF EXISTS subscription_plans_tier_check;

ALTER TABLE public.subscription_plans
ADD CONSTRAINT subscription_plans_tier_check 
CHECK (tier = ANY (ARRAY['free'::text, 'starter'::text, 'basic'::text, 'plus'::text, 'premium'::text, 'professional'::text, 'pro'::text, 'business'::text, 'enterprise'::text]));

-- Step 3: Clear existing plans and insert new structure
DELETE FROM public.subscription_plans WHERE is_active = true;

-- Personal Plans
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  seller_fee_percent, buyer_protection_percent, buyer_protection_fixed, buyer_protection_cap,
  boosts_included, priority_support, analytics_access, badge_type, 
  description, description_bg, features, is_active, currency, commission_rate
) VALUES
-- Free
('Free', 'free', 'personal', 0.00, 0.00, 30, 
 0.00, 4.00, 0.50, 15.00,
 0, false, 'none', NULL,
 'Start selling for free. 0% seller fees.',
 'Започнете да продавате безплатно. 0% такси за продавачи.',
 '["30 active listings", "0% seller fee", "8 photos per listing", "30-day duration"]'::jsonb,
 true, 'EUR', 0.00),
 
-- Plus
('Plus', 'plus', 'personal', 4.99, 49.90, 150, 
 0.00, 3.50, 0.40, 14.00,
 2, false, 'basic', 'plus',
 'For regular sellers. Lower buyer fees.',
 'За редовни продавачи. По-ниски такси за купувачи.',
 '["150 active listings", "0% seller fee", "Lower buyer protection (3.5%)", "2 boosts/month", "Plus badge"]'::jsonb,
 true, 'EUR', 0.00),

-- Pro
('Pro', 'pro', 'personal', 9.99, 99.90, 500, 
 0.00, 3.00, 0.30, 12.00,
 5, true, 'full', 'pro',
 'For power sellers. Best personal rates.',
 'За активни продавачи. Най-добри лични тарифи.',
 '["500 active listings", "0% seller fee", "Lowest buyer protection (3%)", "5 boosts/month", "Pro badge", "Priority support"]'::jsonb,
 true, 'EUR', 0.00);

-- Business Plans
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  seller_fee_percent, buyer_protection_percent, buyer_protection_fixed, buyer_protection_cap,
  boosts_included, priority_support, analytics_access, badge_type, 
  description, description_bg, features, is_active, currency, commission_rate
) VALUES
-- Business Free
('Business Free', 'free', 'business', 0.00, 0.00, 100, 
 1.50, 3.00, 0.35, 12.00,
 0, false, 'basic', 'business',
 'Free for verified businesses.',
 'Безплатно за верифицирани бизнеси.',
 '["100 active listings", "1.5% seller fee", "3% buyer protection", "Business badge"]'::jsonb,
 true, 'EUR', 1.50),

-- Business Pro
('Business Pro', 'professional', 'business', 49.99, 499.90, 2000, 
 1.00, 2.50, 0.25, 10.00,
 20, true, 'full', 'business_pro',
 'Professional tools for growing businesses.',
 'Професионални инструменти за растящи бизнеси.',
 '["2,000 active listings", "1% seller fee", "2.5% buyer protection", "20 boosts/month", "/dashboard access"]'::jsonb,
 true, 'EUR', 1.00),

-- Business Enterprise
('Business Enterprise', 'enterprise', 'business', 99.99, 999.90, NULL, 
 0.50, 2.00, 0.20, 8.00,
 50, true, 'full', 'enterprise',
 'Best rates for high-volume businesses.',
 'Най-добри тарифи за високообемни бизнеси.',
 '["Unlimited listings", "0.5% seller fee", "2% buyer protection (lowest)", "50 boosts/month", "Dedicated support"]'::jsonb,
 true, 'EUR', 0.50);

-- Add comments to new columns for documentation
COMMENT ON COLUMN public.subscription_plans.seller_fee_percent IS 'Seller commission fee percentage (0% for personal, 0.5-1.5% for business)';
COMMENT ON COLUMN public.subscription_plans.buyer_protection_percent IS 'Buyer protection fee percentage (2-4%)';
COMMENT ON COLUMN public.subscription_plans.buyer_protection_fixed IS 'Fixed buyer protection fee in EUR (0.20-0.50)';
COMMENT ON COLUMN public.subscription_plans.buyer_protection_cap IS 'Maximum buyer protection fee cap in EUR (8-15)';;
