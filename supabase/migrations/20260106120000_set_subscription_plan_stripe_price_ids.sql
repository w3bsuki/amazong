-- Migration: Set Stripe Price IDs for subscription_plans
-- Purpose: Configure subscription checkout to use pre-created Stripe Prices (price_...)

ALTER TABLE public.subscription_plans
  ADD COLUMN IF NOT EXISTS stripe_price_monthly_id text,
  ADD COLUMN IF NOT EXISTS stripe_price_yearly_id text;

-- PERSONAL: Starter (4/mo, 40/yr)
UPDATE public.subscription_plans
SET
  stripe_price_monthly_id = 'price_1Se2FRH2GXdb753wrugGPL8L',
  stripe_price_yearly_id = 'price_1Se2G3H2GXdb753w6a77MbRz'
WHERE is_active = true AND tier = 'starter' AND account_type = 'personal';

-- PERSONAL: Basic (15/mo, 150/yr)
UPDATE public.subscription_plans
SET
  stripe_price_monthly_id = 'price_1Se2IcH2GXdb753wVI7wGRB3',
  stripe_price_yearly_id = 'price_1Se2IxH2GXdb753w2TPSbyV5'
WHERE is_active = true AND tier = 'basic' AND account_type = 'personal';

-- PERSONAL: Professional (50/mo, 500/yr)
UPDATE public.subscription_plans
SET
  stripe_price_monthly_id = 'price_1Se2GcH2GXdb753wnT6ihe88',
  stripe_price_yearly_id = 'price_1Se2H1H2GXdb753wqCsaJqmX'
WHERE is_active = true AND tier = 'professional' AND account_type = 'personal';

-- PERSONAL: Enterprise (200/mo, 2000/yr)
UPDATE public.subscription_plans
SET
  stripe_price_monthly_id = 'price_1Se2JXH2GXdb753w0QtSKwnT',
  stripe_price_yearly_id = 'price_1Se2JlH2GXdb753wpfz95Jji'
WHERE is_active = true AND tier = 'enterprise' AND account_type = 'personal';

-- BUSINESS: Pro (40/mo, 400/yr) maps to tier=professional, account_type=business
UPDATE public.subscription_plans
SET
  stripe_price_monthly_id = 'price_1Se29aH2GXdb753wykAfNqLS',
  stripe_price_yearly_id = 'price_1Se29aH2GXdb753wDIYDHW5O'
WHERE is_active = true AND tier = 'professional' AND account_type = 'business';

-- BUSINESS: Enterprise (150/mo, 1500/yr) maps to tier=enterprise, account_type=business
UPDATE public.subscription_plans
SET
  stripe_price_monthly_id = 'price_1Se2AnH2GXdb753wcy0C0Xql',
  stripe_price_yearly_id = 'price_1Se2AnH2GXdb753wwCu2FHr1'
WHERE is_active = true AND tier = 'enterprise' AND account_type = 'business';
