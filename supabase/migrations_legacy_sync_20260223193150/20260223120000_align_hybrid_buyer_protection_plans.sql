-- HUMAN REVIEW REQUIRED: This migration changes subscription plan data
-- Align active plans with docs/business/plans-pricing.md and docs/business/monetization.md (2026-02-23)
-- NOTE: paid-tier prices are placeholders pending market validation (PLAN-001).

-- 0) Compatibility guard:
-- Some older environments used enum-based tier columns. Cast to TEXT so
-- free/plus/pro/enterprise values are always accepted.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'subscription_plans'
      AND column_name = 'tier'
      AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE public.subscription_plans
      ALTER COLUMN tier TYPE text USING tier::text;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'subscriptions'
      AND column_name = 'plan_type'
      AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE public.subscriptions
      ALTER COLUMN plan_type TYPE text USING plan_type::text;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'tier'
      AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE public.profiles
      ALTER COLUMN tier TYPE text USING tier::text;
  END IF;
END
$$;

-- 1) Deactivate all currently active plans (preserve historical/FK references)
UPDATE public.subscription_plans
SET is_active = false
WHERE is_active = true;

-- 2) Insert the decided 6-tier hybrid buyer-protection model
INSERT INTO public.subscription_plans (
  name,
  tier,
  account_type,
  price_monthly,
  price_yearly,
  currency,
  max_listings,
  seller_fee_percent,
  buyer_protection_percent,
  buyer_protection_fixed,
  buyer_protection_cap,
  boosts_included,
  analytics_access,
  priority_support,
  badge_type,
  commission_rate,
  final_value_fee,
  insertion_fee,
  per_order_fee,
  description,
  description_bg,
  features,
  is_active
)
VALUES
  (
    'Personal Free',
    'free',
    'personal',
    0.00,
    0.00,
    'EUR',
    30,
    0.00,
    4.00,
    0.50,
    15.00,
    0,
    'none',
    false,
    NULL,
    0.00,
    0.00,
    0.00,
    0.00,
    'Personal Free: Start selling with 0% seller fee and buyer protection on every order.',
    'Личен Безплатен: Започни да продаваш с 0% такса за продавача и защита на купувача за всяка поръчка.',
    '[
      "30 active listings",
      "0% seller fee (keep 100% of item price)",
      "Buyer protection: 4% + €0.50 (cap €15)",
      "Transparent checkout fee breakdown",
      "Great for casual sellers"
    ]'::jsonb,
    true
  ),
  (
    'Personal Plus',
    'plus',
    'personal',
    3.99,
    47.88,
    'EUR',
    150,
    0.00,
    3.50,
    0.40,
    14.00,
    2,
    'basic',
    false,
    NULL,
    0.00,
    0.00,
    0.00,
    0.00,
    'Personal Plus: More listings, boost credits, and lower buyer fees to help items convert faster.',
    'Личен Плюс: Повече обяви, буст кредити и по-ниски такси за купувача за по-бързи продажби.',
    '[
      "150 active listings",
      "0% seller fee",
      "Buyer protection: 3.5% + €0.40 (cap €14)",
      "2 monthly boost credits (24h)",
      "Basic analytics access",
      "Lower buyer fees make your listings cheaper to buy"
    ]'::jsonb,
    true
  ),
  (
    'Personal Pro',
    'pro',
    'personal',
    7.99,
    95.88,
    'EUR',
    500,
    0.00,
    3.00,
    0.30,
    12.00,
    5,
    'full',
    true,
    'pro_seller',
    0.00,
    0.00,
    0.00,
    0.00,
    'Personal Pro: Power-selling tier with stronger buyer-fee advantage and priority support.',
    'Личен Про: Ниво за активни продавачи с по-голямо намаление на таксата за купувача и приоритетна поддръжка.',
    '[
      "500 active listings",
      "0% seller fee",
      "Buyer protection: 3% + €0.30 (cap €12)",
      "5 monthly boost credits (24h)",
      "Full analytics and insights",
      "Priority support",
      "Pro Seller badge"
    ]'::jsonb,
    true
  ),
  (
    'Business Free',
    'free',
    'business',
    0.00,
    0.00,
    'EUR',
    100,
    1.50,
    3.00,
    0.35,
    12.00,
    0,
    'none',
    false,
    NULL,
    1.50,
    1.50,
    0.00,
    0.00,
    'Business Free: Start as a business seller with lower buyer fees than Personal Free.',
    'Бизнес Безплатен: Стартирай като бизнес продавач с по-ниски такси за купувача спрямо Личен Безплатен.',
    '[
      "100 active listings",
      "1.5% seller fee",
      "Buyer protection: 3% + €0.35 (cap €12)",
      "Business-ready starting tier",
      "Lower buyer fees vs personal free"
    ]'::jsonb,
    true
  ),
  (
    'Business Pro',
    -- Keep business tier key as "professional" for backward compatibility
    -- with existing code paths and active subscriptions.
    'professional',
    'business',
    14.99,
    179.88,
    'EUR',
    2000,
    1.00,
    2.50,
    0.25,
    10.00,
    20,
    'full',
    true,
    'business',
    1.00,
    1.00,
    0.00,
    0.00,
    'Business Pro: Scale with dashboard tooling, more credits, and lower buyer fees.',
    'Бизнес Про: Расти с dashboard инструменти, повече кредити и по-ниски такси за купувача.',
    '[
      "2,000 active listings",
      "1% seller fee",
      "Buyer protection: 2.5% + €0.25 (cap €10)",
      "20 monthly boost credits (24h)",
      "Full analytics",
      "Priority support",
      "Business badge",
      "/dashboard access and team support"
    ]'::jsonb,
    true
  ),
  (
    'Business Enterprise',
    'enterprise',
    'business',
    29.99,
    359.88,
    'EUR',
    NULL,
    0.50,
    2.00,
    0.20,
    8.00,
    50,
    'full',
    true,
    'verified_business',
    0.50,
    0.50,
    0.00,
    0.00,
    'Business Enterprise: Unlimited listings, strongest fee advantage, and highest support level.',
    'Бизнес Enterprise: Неограничени обяви, най-силно ценово предимство и най-високо ниво поддръжка.',
    '[
      "Unlimited active listings",
      "0.5% seller fee",
      "Buyer protection: 2% + €0.20 (cap €8)",
      "50 monthly boost credits (24h)",
      "Full analytics",
      "Priority support",
      "Verified Business badge",
      "Best pricing for high-volume businesses"
    ]'::jsonb,
    true
  );
