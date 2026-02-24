-- Migration: Buyer Protection Fee Structure (Vinted-style hybrid model)
-- Date: 2026-01-20
-- 
-- =============================================================================
-- FEE MODEL: HYBRID BUYER-PROTECTION (FINALIZED)
-- =============================================================================
--
-- PERSONAL ACCOUNTS: 0% seller fee, buyer pays protection
-- BUSINESS ACCOUNTS: Small seller fee (0.5-1.5%), lower buyer protection
--
-- This matches the Vinted model which is proven successful in Europe:
-- - Sellers get 100% of item price (personal) - matches OLX.bg
-- - Buyers pay a transparent "Buyer Protection" fee
-- - Businesses pay small seller fee (they expect B2B costs)
-- - Subscriptions reduce fees for both sides
--
-- =============================================================================
-- WHY THIS MODEL?
-- =============================================================================
--
-- 1. OLX.bg has 0% seller fees - any seller commission = bypass via chat
-- 2. Vinted proves buyers accept protection fees (value is clear)
-- 3. eBay's 13%+ seller fees only work with global reach
-- 4. Minimum viable fee is ~3% to cover Stripe costs
--
-- =============================================================================

-- =============================================================================
-- Step 1: Add buyer protection columns to subscription_plans
-- =============================================================================

ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS seller_fee_percent DECIMAL(4,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS buyer_protection_percent DECIMAL(4,2) DEFAULT 4.0,
ADD COLUMN IF NOT EXISTS buyer_protection_fixed DECIMAL(5,2) DEFAULT 0.50,
ADD COLUMN IF NOT EXISTS buyer_protection_cap DECIMAL(5,2) DEFAULT 15.00;

-- =============================================================================
-- Step 2: Add comments for documentation
-- =============================================================================

COMMENT ON COLUMN public.subscription_plans.seller_fee_percent IS 
  'Seller Fee: % deducted from seller earnings. 0% for personal, 0.5-1.5% for business.';

COMMENT ON COLUMN public.subscription_plans.buyer_protection_percent IS 
  'Buyer Protection: % added to item price for buyer protection service.';

COMMENT ON COLUMN public.subscription_plans.buyer_protection_fixed IS 
  'Buyer Protection Fixed: Fixed EUR amount added to buyer protection fee.';

COMMENT ON COLUMN public.subscription_plans.buyer_protection_cap IS 
  'Buyer Protection Cap: Maximum buyer protection fee in EUR regardless of item price.';

-- =============================================================================
-- Step 3: Clear existing plans and insert new structure
-- =============================================================================

-- Deactivate old plans (keep for historical reference)
UPDATE public.subscription_plans SET is_active = false WHERE is_active = true;

-- =============================================================================
-- PERSONAL PLANS - 0% seller fee, buyer pays protection
-- =============================================================================

INSERT INTO public.subscription_plans (
  name, tier, account_type, 
  price_monthly, price_yearly, currency,
  max_listings, boosts_included,
  seller_fee_percent, buyer_protection_percent, buyer_protection_fixed, buyer_protection_cap,
  final_value_fee, commission_rate, insertion_fee, per_order_fee,
  priority_support, analytics_access, badge_type, 
  description, description_bg, features, is_active
) VALUES

-- ---------------------------------------------------------------------------
-- FREE (Personal) - €0/mo
-- Goal: Let anyone try selling, convert to paid when they grow
-- ---------------------------------------------------------------------------
(
  'Free', 'free', 'personal', 
  0.00, 0.00, 'EUR',
  30,                            -- 30 active listings
  0,                             -- No free boosts
  0.00,                          -- 0% seller fee (personal keeps 100%)
  4.00,                          -- 4% buyer protection
  0.50,                          -- + €0.50 fixed
  15.00,                         -- Capped at €15
  0.00, 0.00, 0.00, 0.00,        -- Legacy fields (unused)
  false, 'none', NULL,
  'Start selling for free. Keep 100% of every sale.',
  'Започнете да продавате безплатно. Запазете 100% от всяка продажба.',
  '[
    "30 active listings",
    "0% seller fee - keep 100%",
    "8 photos per listing",
    "30-day listing duration",
    "Buyer Protection: 4% + €0.50",
    "Community support"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- PLUS (Personal) - €4.99/mo
-- Goal: Regular sellers who want lower buyer fees
-- ---------------------------------------------------------------------------
(
  'Plus', 'plus', 'personal', 
  4.99, 49.90, 'EUR',
  150,                           -- 150 active listings
  2,                             -- 2 free boosts/month
  0.00,                          -- 0% seller fee
  3.50,                          -- 3.5% buyer protection (lower)
  0.40,                          -- + €0.40 fixed (lower)
  14.00,                         -- Capped at €14
  0.00, 0.00, 0.00, 0.00,
  false, 'basic', 'plus',
  'For regular sellers. Lower buyer fees mean faster sales.',
  'За редовни продавачи. По-ниски такси за купувачи означава по-бързи продажби.',
  '[
    "150 active listings",
    "0% seller fee - keep 100%",
    "15 photos per listing",
    "60-day listing duration",
    "Buyer Protection: 3.5% + €0.40 (lower!)",
    "2 free boosts/month",
    "Plus seller badge",
    "Basic analytics"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- PRO (Personal) - €9.99/mo
-- Goal: Power sellers who want best personal rates
-- ---------------------------------------------------------------------------
(
  'Pro', 'pro', 'personal', 
  9.99, 99.90, 'EUR',
  500,                           -- 500 active listings
  5,                             -- 5 free boosts/month
  0.00,                          -- 0% seller fee
  3.00,                          -- 3% buyer protection (lowest personal)
  0.30,                          -- + €0.30 fixed (lowest)
  12.00,                         -- Capped at €12
  0.00, 0.00, 0.00, 0.00,
  true, 'full', 'pro',
  'For power sellers. Best personal rates, maximum visibility.',
  'За активни продавачи. Най-добри лични тарифи, максимална видимост.',
  '[
    "500 active listings",
    "0% seller fee - keep 100%",
    "20 photos per listing",
    "90-day listing duration",
    "Buyer Protection: 3% + €0.30 (best personal!)",
    "5 free boosts/month",
    "Pro seller badge",
    "Full analytics dashboard",
    "Priority support",
    "Slight priority in search"
  ]'::jsonb,
  true
);

-- =============================================================================
-- BUSINESS PLANS - Small seller fee, lower buyer protection
-- =============================================================================

INSERT INTO public.subscription_plans (
  name, tier, account_type, 
  price_monthly, price_yearly, currency,
  max_listings, boosts_included,
  seller_fee_percent, buyer_protection_percent, buyer_protection_fixed, buyer_protection_cap,
  final_value_fee, commission_rate, insertion_fee, per_order_fee,
  priority_support, analytics_access, badge_type, 
  description, description_bg, features, is_active
) VALUES

-- ---------------------------------------------------------------------------
-- BUSINESS FREE - €0/mo
-- Goal: Entry point for verified businesses
-- ---------------------------------------------------------------------------
(
  'Business Free', 'free', 'business', 
  0.00, 0.00, 'EUR',
  100,                           -- 100 active listings
  0,                             -- No free boosts
  1.50,                          -- 1.5% seller fee (businesses expect costs)
  3.00,                          -- 3% buyer protection (lower than personal)
  0.35,                          -- + €0.35 fixed
  12.00,                         -- Capped at €12
  1.50, 1.50, 0.00, 0.00,        -- Legacy fields for backward compat
  false, 'basic', 'business',
  'Free for verified businesses. Lower buyer fees than personal.',
  'Безплатно за верифицирани бизнеси. По-ниски такси за купувачи от личен акаунт.',
  '[
    "100 active listings",
    "1.5% seller fee",
    "Buyer Protection: 3% + €0.35 (lower than personal!)",
    "Verified Business badge",
    "Basic analytics",
    "Invoice support"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- BUSINESS PRO - €49.99/mo
-- Goal: Growing businesses with professional needs
-- ---------------------------------------------------------------------------
(
  'Business Pro', 'professional', 'business', 
  49.99, 499.90, 'EUR',
  2000,                          -- 2,000 active listings
  20,                            -- 20 free boosts/month
  1.00,                          -- 1% seller fee (lower)
  2.50,                          -- 2.5% buyer protection
  0.25,                          -- + €0.25 fixed
  10.00,                         -- Capped at €10
  1.00, 1.00, 0.00, 0.00,
  true, 'full', 'business_pro',
  'Professional tools for growing businesses. Team support included.',
  'Професионални инструменти за растящи бизнеси. Включена поддръжка на екип.',
  '[
    "2,000 active listings",
    "1% seller fee only",
    "Buyer Protection: 2.5% + €0.25",
    "20 free boosts/month",
    "Business Pro badge",
    "/dashboard access",
    "Full analytics & reports",
    "Priority business support",
    "Team accounts (up to 3)",
    "Bulk listing tools"
  ]'::jsonb,
  true
),

-- ---------------------------------------------------------------------------
-- BUSINESS ENTERPRISE - €99.99/mo
-- Goal: High-volume businesses, best rates possible
-- ---------------------------------------------------------------------------
(
  'Business Enterprise', 'enterprise', 'business', 
  99.99, 999.90, 'EUR',
  NULL,                          -- UNLIMITED listings
  50,                            -- 50 free boosts/month
  0.50,                          -- 0.5% seller fee (lowest!)
  2.00,                          -- 2% buyer protection (lowest!)
  0.20,                          -- + €0.20 fixed (lowest!)
  8.00,                          -- Capped at €8 (lowest!)
  0.50, 0.50, 0.00, 0.00,
  true, 'full', 'enterprise',
  'Best rates for high-volume businesses. Unlimited everything.',
  'Най-добри тарифи за високообемни бизнеси. Неограничено всичко.',
  '[
    "UNLIMITED listings",
    "0.5% seller fee (best!)",
    "Buyer Protection: 2% + €0.20 (best!)",
    "Capped at €8 (best!)",
    "50 free boosts/month",
    "Enterprise badge",
    "/dashboard with full access",
    "Unlimited team accounts",
    "Full API access",
    "Dedicated account manager",
    "Custom integrations available"
  ]'::jsonb,
  true
);

-- =============================================================================
-- Step 4: Add columns to sellers table for fee caching
-- =============================================================================

ALTER TABLE public.sellers
ADD COLUMN IF NOT EXISTS current_seller_fee DECIMAL(4,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_buyer_protection_percent DECIMAL(4,2) DEFAULT 4.0,
ADD COLUMN IF NOT EXISTS current_buyer_protection_fixed DECIMAL(5,2) DEFAULT 0.50,
ADD COLUMN IF NOT EXISTS current_buyer_protection_cap DECIMAL(5,2) DEFAULT 15.00;

-- =============================================================================
-- Step 5: Update existing sellers with fees based on their tier
-- =============================================================================

UPDATE public.sellers s
SET 
  current_seller_fee = COALESCE(
    (SELECT seller_fee_percent FROM subscription_plans p 
     WHERE p.tier = COALESCE(s.tier, 'free') 
     AND p.account_type = COALESCE(s.account_type, 'personal') 
     AND p.is_active = true LIMIT 1),
    0.00
  ),
  current_buyer_protection_percent = COALESCE(
    (SELECT buyer_protection_percent FROM subscription_plans p 
     WHERE p.tier = COALESCE(s.tier, 'free') 
     AND p.account_type = COALESCE(s.account_type, 'personal') 
     AND p.is_active = true LIMIT 1),
    4.00
  ),
  current_buyer_protection_fixed = COALESCE(
    (SELECT buyer_protection_fixed FROM subscription_plans p 
     WHERE p.tier = COALESCE(s.tier, 'free') 
     AND p.account_type = COALESCE(s.account_type, 'personal') 
     AND p.is_active = true LIMIT 1),
    0.50
  ),
  current_buyer_protection_cap = COALESCE(
    (SELECT buyer_protection_cap FROM subscription_plans p 
     WHERE p.tier = COALESCE(s.tier, 'free') 
     AND p.account_type = COALESCE(s.account_type, 'personal') 
     AND p.is_active = true LIMIT 1),
    15.00
  );

-- =============================================================================
-- Step 6: Create function to sync seller fees when plan changes
-- =============================================================================

CREATE OR REPLACE FUNCTION sync_seller_fees()
RETURNS TRIGGER AS $$
BEGIN
  -- Update seller's cached fees when their tier changes
  IF NEW.tier IS DISTINCT FROM OLD.tier OR NEW.account_type IS DISTINCT FROM OLD.account_type THEN
    SELECT 
      COALESCE(p.seller_fee_percent, 0),
      COALESCE(p.buyer_protection_percent, 4.0),
      COALESCE(p.buyer_protection_fixed, 0.50),
      COALESCE(p.buyer_protection_cap, 15.00)
    INTO 
      NEW.current_seller_fee,
      NEW.current_buyer_protection_percent,
      NEW.current_buyer_protection_fixed,
      NEW.current_buyer_protection_cap
    FROM subscription_plans p
    WHERE p.tier = COALESCE(NEW.tier, 'free')
      AND p.account_type = COALESCE(NEW.account_type, 'personal')
      AND p.is_active = true
    LIMIT 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_sync_seller_fees ON public.sellers;

-- Create trigger
CREATE TRIGGER trigger_sync_seller_fees
BEFORE UPDATE ON public.sellers
FOR EACH ROW
EXECUTE FUNCTION sync_seller_fees();

-- =============================================================================
-- PRICING SUMMARY (for reference):
-- =============================================================================
-- 
-- PERSONAL ACCOUNTS (seller keeps 100%):
-- | Tier | Monthly | Listings | Seller Fee | Buyer Protection | Cap    |
-- |------|---------|----------|------------|------------------|--------|
-- | Free | €0      | 30       | 0%         | 4% + €0.50       | €15.00 |
-- | Plus | €4.99   | 150      | 0%         | 3.5% + €0.40     | €14.00 |
-- | Pro  | €9.99   | 500      | 0%         | 3% + €0.30       | €12.00 |
--
-- BUSINESS ACCOUNTS (small seller fee, lower buyer fees):
-- | Tier       | Monthly | Listings | Seller Fee | Buyer Protection | Cap    |
-- |------------|---------|----------|------------|------------------|--------|
-- | Free       | €0      | 100      | 1.5%       | 3% + €0.35       | €12.00 |
-- | Pro        | €49.99  | 2,000    | 1%         | 2.5% + €0.25     | €10.00 |
-- | Enterprise | €99.99  | ∞        | 0.5%       | 2% + €0.20       | €8.00  |
--
-- EXAMPLE: €50 item from Personal Free seller
-- - Buyer pays: €50 + (€50 × 4%) + €0.50 = €52.50
-- - Seller gets: €50 (100%!)
-- - Platform takes: €2.50
-- - Stripe costs: ~€1.05 (2% + €0.25)
-- - Net profit: €1.45 (2.9% margin)
--
-- =============================================================================
