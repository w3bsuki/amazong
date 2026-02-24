-- Add new fee columns to subscription_plans
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS final_value_fee DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS insertion_fee DECIMAL(5, 2) DEFAULT 0.25,
ADD COLUMN IF NOT EXISTS per_order_fee DECIMAL(5, 2) DEFAULT 0.25;

-- Copy existing commission_rate values to final_value_fee
UPDATE public.subscription_plans 
SET final_value_fee = commission_rate 
WHERE final_value_fee IS NULL;

-- Add fee columns to sellers table
ALTER TABLE public.sellers
ADD COLUMN IF NOT EXISTS final_value_fee DECIMAL(5, 2) DEFAULT 12.00,
ADD COLUMN IF NOT EXISTS insertion_fee DECIMAL(5, 2) DEFAULT 0.25,
ADD COLUMN IF NOT EXISTS per_order_fee DECIMAL(5, 2) DEFAULT 0.25;

-- Update tier check constraint to allow new tiers
ALTER TABLE public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_tier_check;
ALTER TABLE public.subscription_plans ADD CONSTRAINT subscription_plans_tier_check 
  CHECK (tier = ANY (ARRAY['free'::text, 'starter'::text, 'basic'::text, 'premium'::text, 'professional'::text, 'business'::text, 'enterprise'::text]));

-- Same for sellers
ALTER TABLE public.sellers DROP CONSTRAINT IF EXISTS sellers_tier_check;
ALTER TABLE public.sellers ADD CONSTRAINT sellers_tier_check 
  CHECK (tier = ANY (ARRAY['free'::text, 'starter'::text, 'basic'::text, 'premium'::text, 'professional'::text, 'business'::text, 'enterprise'::text]));

-- Clear existing plans
DELETE FROM public.subscription_plans;

-- Insert new plans with proper fee structure
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  final_value_fee, commission_rate, insertion_fee, per_order_fee, boosts_included, 
  priority_support, analytics_access, badge_type, 
  description, description_bg, features, is_active
) VALUES
-- PERSONAL: FREE ($0/mo)
(
  'Free', 'free', 'personal', 
  0.00, 0.00, 50,
  12.00, 12.00, 0.30, 0.25,
  0, false, 'none', NULL,
  'Start selling for free. Pay only when you sell.',
  'Започнете да продавате безплатно. Плащате само при продажба.',
  '["50 free listings per month", "12% fee when you sell", "0.25 лв per order", "0.30 лв per extra listing", "Standard search visibility", "Community support"]'::jsonb,
  true
),
-- PERSONAL: STARTER ($4/mo)
(
  'Starter', 'starter', 'personal', 
  4.00, 40.00, 250,
  10.00, 10.00, 0.25, 0.25,
  2, false, 'basic', 'starter_seller',
  'For regular sellers. 5x more listings, lower fees.',
  'За редовни продавачи. 5 пъти повече обяви, по-ниски такси.',
  '["250 free listings per month", "10% fee when you sell (save 2%)", "0.25 лв per order", "2 free boosts every month", "Basic analytics", "Starter Seller badge"]'::jsonb,
  true
),
-- PERSONAL: BASIC ($15/mo)
(
  'Basic', 'basic', 'personal', 
  15.00, 150.00, 1000,
  8.00, 8.00, 0.15, 0.20,
  5, true, 'basic', 'basic_seller',
  'For growing sellers. Pro features at basic price.',
  'За растящи продавачи. Про функции на основна цена.',
  '["1,000 free listings per month", "8% fee when you sell (save 4%)", "0.20 лв per order", "5 free boosts every month", "Full analytics dashboard", "Basic Seller badge", "Priority email support"]'::jsonb,
  true
),
-- PERSONAL: PROFESSIONAL ($50/mo)
(
  'Professional', 'professional', 'personal', 
  50.00, 500.00, 5000,
  6.00, 6.00, 0.10, 0.15,
  15, true, 'full', 'pro_seller',
  'For serious sellers. Maximum value, minimum fees.',
  'За сериозни продавачи. Максимална стойност, минимални такси.',
  '["5,000 free listings per month", "6% fee when you sell (save 6%)", "0.15 лв per order", "15 free boosts every month", "Advanced analytics", "Pro Seller badge", "Priority support", "Bulk listing tools"]'::jsonb,
  true
),
-- PERSONAL: ENTERPRISE ($200/mo)
(
  'Enterprise', 'enterprise', 'personal', 
  200.00, 2000.00, NULL,
  4.00, 4.00, 0.00, 0.00,
  50, true, 'full', 'enterprise_seller',
  'For high-volume sellers. Unlimited everything, lowest fees.',
  'За високообемни продавачи. Неограничено всичко, най-ниски такси.',
  '["UNLIMITED listings", "4% fee when you sell (lowest!)", "NO per-order fees", "NO insertion fees", "50 free boosts every month", "Enterprise analytics", "Dedicated account manager", "API access"]'::jsonb,
  true
),
-- BUSINESS: FREE ($0/mo)
(
  'Business Free', 'free', 'business', 
  0.00, 0.00, 100,
  10.00, 10.00, 0.25, 0.25,
  0, false, 'basic', 'verified_business',
  'Free for verified businesses. Better rates than personal.',
  'Безплатно за верифицирани бизнеси. По-добри тарифи от личен акаунт.',
  '["100 free listings per month", "10% fee when you sell", "0.25 лв per order", "Verified Business badge", "Basic analytics", "Invoice support"]'::jsonb,
  true
),
-- BUSINESS: PRO ($40/mo)
(
  'Business Pro', 'professional', 'business', 
  40.00, 400.00, 3000,
  5.00, 5.00, 0.10, 0.15,
  15, true, 'full', 'verified_pro',
  'Professional tools for growing businesses.',
  'Професионални инструменти за растящи бизнеси.',
  '["3,000 free listings per month", "5% fee when you sell", "0.15 лв per order", "15 free boosts every month", "Verified Pro badge", "Full analytics", "Priority support", "API access"]'::jsonb,
  true
),
-- BUSINESS: ENTERPRISE ($150/mo)
(
  'Business Enterprise', 'enterprise', 'business', 
  150.00, 1500.00, NULL,
  3.00, 3.00, 0.00, 0.00,
  100, true, 'full', 'enterprise_partner',
  'For brands and high-volume businesses. Best rates possible.',
  'За марки и високообемни бизнеси. Най-добрите възможни тарифи.',
  '["UNLIMITED listings", "3% fee when you sell (best!)", "NO per-order fees", "NO insertion fees", "100 free boosts every month", "Enterprise Partner badge", "Dedicated account manager", "Full API access"]'::jsonb,
  true
);;
