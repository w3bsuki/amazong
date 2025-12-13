-- Migration: Complete fee structure overhaul with eBay-style logic
-- Date: 2024-12-14
-- 
-- =============================================================================
-- FEE STRUCTURE EXPLAINED (WHO PAYS WHAT):
-- =============================================================================
--
-- ALL FEES ARE PAID BY THE SELLER (deducted from their earnings)
--
-- 1. SUBSCRIPTION FEE (Monthly/Yearly)
--    - Paid upfront for plan benefits
--    - Higher plans = more free listings + lower fees
--
-- 2. FINAL VALUE FEE (FVF) - % of sale
--    - Only charged when item SELLS
--    - % of (item price + shipping)
--    - Main marketplace revenue source
--
-- 3. INSERTION FEE - Per listing after free allowance
--    - Charged when you CREATE a listing (even if it doesn't sell)
--    - Prevents spam listings
--    - Each plan has X free listings, then you pay per extra
--
-- 4. PER-ORDER FEE - Flat fee per transaction
--    - Covers payment processing (Stripe charges us ~2.9% + $0.30)
--    - eBay charges $0.30, we charge $0.25 (competitive advantage)
--    - Higher tiers = lower/no per-order fee
--
-- =============================================================================
-- EXAMPLE: Seller on Basic plan ($15/mo) sells a $50 item
-- =============================================================================
-- - FVF: 8% × $50 = $4.00
-- - Per-order fee: $0.20
-- - Total fees: $4.20
-- - Seller receives: $50 - $4.20 = $45.80
-- 
-- Compare to eBay ($21.95/mo plan):
-- - FVF: ~12% × $50 = $6.00
-- - Per-order fee: $0.30
-- - Total fees: $6.30
-- - Seller receives: $43.70
--
-- OUR SELLER SAVES: $2.10 per sale + $6.95/mo subscription = BETTER DEAL!
-- =============================================================================

-- =============================================================================
-- Step 1: Add new fee columns to subscription_plans
-- =============================================================================

-- Final Value Fee (percentage of sale)
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS final_value_fee DECIMAL(5, 2);

-- Insertion fee (per listing after free allowance)
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS insertion_fee DECIMAL(5, 2) DEFAULT 0.25;

-- Per-order fee (flat fee per transaction - covers payment processing)
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS per_order_fee DECIMAL(5, 2) DEFAULT 0.25;

-- Copy existing commission_rate values to final_value_fee (backward compat)
UPDATE public.subscription_plans 
SET final_value_fee = commission_rate 
WHERE final_value_fee IS NULL;

-- =============================================================================
-- Step 2: Add fee columns to sellers table
-- =============================================================================

ALTER TABLE public.sellers
ADD COLUMN IF NOT EXISTS final_value_fee DECIMAL(5, 2) DEFAULT 12.00;

ALTER TABLE public.sellers
ADD COLUMN IF NOT EXISTS insertion_fee DECIMAL(5, 2) DEFAULT 0.25;

ALTER TABLE public.sellers
ADD COLUMN IF NOT EXISTS per_order_fee DECIMAL(5, 2) DEFAULT 0.25;

-- =============================================================================
-- Step 3: Clear existing plans and insert new structure
-- =============================================================================

DELETE FROM public.subscription_plans WHERE is_active = true;

-- =============================================================================
-- PERSONAL PLANS - Clean pricing ($0, $4, $15, $50, $200)
-- =============================================================================

INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  final_value_fee, commission_rate, insertion_fee, per_order_fee, boosts_included, 
  priority_support, analytics_access, badge_type, 
  description, description_bg, features, is_active
) VALUES

-- ---------------------------------------------------------------------------
-- FREE TIER ($0/mo)
-- Goal: Let anyone try selling, convert to paid when they grow
-- ---------------------------------------------------------------------------
(
  'Free', 'free', 'personal', 
  0.00, 0.00,                    -- FREE!
  50,                            -- 50 free listings/month
  12.00, 12.00,                  -- 12% FVF (better than eBay's 13.25%)
  0.30,                          -- 0.30 лв per extra listing
  0.25,                          -- 0.25 лв per order (eBay charges $0.30)
  0,                             -- No free boosts
  false, 'none', NULL,
  'Start selling for free. Pay only when you sell.',
  'Започнете да продавате безплатно. Плащате само при продажба.',
  '[
    "50 free listings per month",
    "12% fee when you sell",
    "0.25 лв per order (payment processing)",
    "0.30 лв per extra listing",
    "Standard search visibility",
    "Community support"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- STARTER ($4/mo) - vs eBay Starter $4.95
-- ---------------------------------------------------------------------------
(
  'Starter', 'starter', 'personal', 
  4.00, 40.00,                   -- $4/mo or $40/yr (save $8)
  250,                           -- 250 free listings (matches eBay Basic!)
  10.00, 10.00,                  -- 10% FVF
  0.25,                          -- 0.25 лв per extra listing
  0.25,                          -- 0.25 лв per order
  2,                             -- 2 free boosts/month
  false, 'basic', 'starter_seller',
  'For regular sellers. 5x more listings, lower fees.',
  'За редовни продавачи. 5 пъти повече обяви, по-ниски такси.',
  '[
    "250 free listings per month",
    "10% fee when you sell (save 2%)",
    "0.25 лв per order",
    "0.25 лв per extra listing",
    "2 free boosts every month",
    "Basic analytics",
    "Starter Seller badge"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- BASIC ($15/mo) - vs eBay Basic $21.95
-- ---------------------------------------------------------------------------
(
  'Basic', 'basic', 'personal', 
  15.00, 150.00,                 -- $15/mo or $150/yr (save $30)
  1000,                          -- 1,000 free listings
  8.00, 8.00,                    -- 8% FVF
  0.15,                          -- Lower insertion fee
  0.20,                          -- Lower per-order fee
  5,                             -- 5 free boosts/month
  true, 'basic', 'basic_seller',
  'For growing sellers. Pro features at basic price.',
  'За растящи продавачи. Про функции на основна цена.',
  '[
    "1,000 free listings per month",
    "8% fee when you sell (save 4%)",
    "0.20 лв per order (lower!)",
    "0.15 лв per extra listing",
    "5 free boosts every month",
    "Full analytics dashboard",
    "Basic Seller badge",
    "Priority email support"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- PROFESSIONAL ($50/mo) - vs eBay Premium $59.95
-- ---------------------------------------------------------------------------
(
  'Professional', 'professional', 'personal', 
  50.00, 500.00,                 -- $50/mo or $500/yr (save $100)
  5000,                          -- 5,000 free listings
  6.00, 6.00,                    -- 6% FVF (excellent!)
  0.10,                          -- Minimal insertion fee
  0.15,                          -- Reduced per-order fee
  15,                            -- 15 free boosts/month
  true, 'full', 'pro_seller',
  'For serious sellers. Maximum value, minimum fees.',
  'За сериозни продавачи. Максимална стойност, минимални такси.',
  '[
    "5,000 free listings per month",
    "6% fee when you sell (save 6%)",
    "0.15 лв per order (50% off!)",
    "0.10 лв per extra listing",
    "15 free boosts every month",
    "Advanced analytics & reports",
    "Pro Seller badge",
    "Priority phone & chat support",
    "Bulk listing tools",
    "Featured in category pages"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- ENTERPRISE ($200/mo) - vs eBay Anchor $299.95
-- ---------------------------------------------------------------------------
(
  'Enterprise', 'enterprise', 'personal', 
  200.00, 2000.00,               -- $200/mo or $2000/yr (save $400)
  NULL,                          -- UNLIMITED listings
  4.00, 4.00,                    -- 4% FVF (best rate!)
  0.00,                          -- NO insertion fees!
  0.00,                          -- NO per-order fees! (we absorb it)
  50,                            -- 50 free boosts/month
  true, 'full', 'enterprise_seller',
  'For high-volume sellers. Unlimited everything, lowest fees.',
  'За високообемни продавачи. Неограничено всичко, най-ниски такси.',
  '[
    "UNLIMITED listings",
    "4% fee when you sell (lowest!)",
    "NO per-order fees (we absorb it!)",
    "NO insertion fees ever",
    "50 free boosts every month",
    "Enterprise analytics suite",
    "Enterprise Seller badge",
    "Dedicated account manager",
    "API access",
    "Featured placement",
    "Custom promotional campaigns"
  ]'::jsonb,
  true
);

-- =============================================================================
-- BUSINESS PLANS - For verified businesses
-- =============================================================================

INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  final_value_fee, commission_rate, insertion_fee, per_order_fee, boosts_included, 
  priority_support, analytics_access, badge_type, 
  description, description_bg, features, is_active
) VALUES

-- ---------------------------------------------------------------------------
-- BUSINESS FREE ($0/mo)
-- ---------------------------------------------------------------------------
(
  'Business Free', 'free', 'business', 
  0.00, 0.00,
  100,                           -- 100 free listings (more than personal free)
  10.00, 10.00,                  -- 10% FVF (better than personal)
  0.25,                          -- Insertion fee
  0.25,                          -- Per-order fee
  0,
  false, 'basic', 'verified_business',
  'Free for verified businesses. Better rates than personal.',
  'Безплатно за верифицирани бизнеси. По-добри тарифи от личен акаунт.',
  '[
    "100 free listings per month",
    "10% fee when you sell",
    "0.25 лв per order",
    "Verified Business badge",
    "Basic analytics",
    "Invoice support"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- BUSINESS PRO ($40/mo)
-- ---------------------------------------------------------------------------
(
  'Business Pro', 'professional', 'business', 
  40.00, 400.00,
  3000,                          -- 3,000 free listings
  5.00, 5.00,                    -- 5% FVF
  0.10,                          -- Low insertion fee
  0.15,                          -- Low per-order fee
  15,                            -- 15 free boosts/month
  true, 'full', 'verified_pro',
  'Professional tools for growing businesses.',
  'Професионални инструменти за растящи бизнеси.',
  '[
    "3,000 free listings per month",
    "5% fee when you sell",
    "0.15 лв per order",
    "0.10 лв per extra listing",
    "15 free boosts every month",
    "Verified Pro badge",
    "Full analytics & reports",
    "Priority business support",
    "Bulk tools & API access",
    "Team accounts (up to 3)"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- BUSINESS ENTERPRISE ($150/mo)
-- ---------------------------------------------------------------------------
(
  'Business Enterprise', 'enterprise', 'business', 
  150.00, 1500.00,
  NULL,                          -- UNLIMITED listings
  3.00, 3.00,                    -- 3% FVF (best rate!)
  0.00,                          -- NO insertion fees
  0.00,                          -- NO per-order fees
  100,                           -- 100 free boosts/month
  true, 'full', 'enterprise_partner',
  'For brands and high-volume businesses. Best rates possible.',
  'За марки и високообемни бизнеси. Най-добрите възможни тарифи.',
  '[
    "UNLIMITED listings",
    "3% fee when you sell (best!)",
    "NO per-order fees",
    "NO insertion fees",
    "100 free boosts every month",
    "Enterprise Partner badge",
    "Dedicated account manager",
    "Full API access",
    "Custom integrations",
    "Unlimited team accounts",
    "Priority featuring",
    "Quarterly business reviews"
  ]'::jsonb,
  true
);

-- =============================================================================
-- Step 4: Update existing sellers with fees based on their tier
-- =============================================================================

UPDATE public.sellers s
SET 
  final_value_fee = COALESCE(
    (SELECT final_value_fee FROM subscription_plans p 
     WHERE p.tier = s.tier AND p.account_type = COALESCE(s.account_type, 'personal') 
     AND p.is_active = true LIMIT 1),
    12.00
  ),
  insertion_fee = COALESCE(
    (SELECT insertion_fee FROM subscription_plans p 
     WHERE p.tier = s.tier AND p.account_type = COALESCE(s.account_type, 'personal') 
     AND p.is_active = true LIMIT 1),
    0.25
  ),
  per_order_fee = COALESCE(
    (SELECT per_order_fee FROM subscription_plans p 
     WHERE p.tier = s.tier AND p.account_type = COALESCE(s.account_type, 'personal') 
     AND p.is_active = true LIMIT 1),
    0.25
  );

-- =============================================================================
-- Step 5: Add comments for documentation
-- =============================================================================

COMMENT ON COLUMN public.subscription_plans.final_value_fee IS 
  'Final Value Fee: % of sale taken when item sells. Seller pays this from their earnings.';

COMMENT ON COLUMN public.subscription_plans.insertion_fee IS 
  'Insertion Fee: Amount charged per listing AFTER free monthly allowance. Prevents spam.';

COMMENT ON COLUMN public.subscription_plans.per_order_fee IS 
  'Per-Order Fee: Flat fee per transaction to cover payment processing costs (Stripe/etc).';

-- =============================================================================
-- PRICING COMPARISON vs EBAY (for reference):
-- =============================================================================
-- 
-- | Tier          | Us (Monthly) | eBay (Monthly) | Savings |
-- |---------------|--------------|----------------|---------|
-- | Free          | $0           | $0 (no store)  | -       |
-- | Starter       | $4           | $4.95          | $0.95   |
-- | Basic         | $15          | $21.95         | $6.95   |
-- | Professional  | $50          | $59.95         | $9.95   |
-- | Enterprise    | $200         | $299.95        | $99.95  |
--
-- PLUS: Lower FVF rates, lower per-order fees, FREE boosts included!
-- =============================================================================
