-- ============================================
-- PRODUCTION-READY SUBSCRIPTION PLANS
-- ============================================
-- Philosophy: 
--   - FREE to list (within limits)
--   - Pay ONLY when you sell (% deducted from earnings)
--   - No confusing insertion fees or per-order fees
--   - Clear upgrade path when you need more
-- ============================================

-- First, clear existing plans (no active subscriptions yet)
DELETE FROM subscription_plans;

-- ============================================
-- PERSONAL ACCOUNT PLANS (3 tiers)
-- ============================================

-- 1. FREE - For casual sellers (your mom selling a t-shirt)
INSERT INTO subscription_plans (
  id, name, tier, account_type,
  price_monthly, price_yearly, currency,
  max_listings, final_value_fee, insertion_fee, per_order_fee,
  commission_rate, boosts_included, priority_support, analytics_access,
  badge_type, description, description_bg,
  features, is_active
) VALUES (
  gen_random_uuid(),
  'Free',
  'free',
  'personal',
  0, 0, 'BGN',
  50,           -- 50 listings per month
  12.00,        -- 12% when sold (includes payment processing)
  0,            -- NO insertion fee
  0,            -- NO per-order fee (baked into 12%)
  12.00,        -- Legacy compatibility
  0,            -- No free boosts
  false,
  'none',
  NULL,
  'Start selling for free. Pay only when you sell.',
  'Започни да продаваш безплатно. Плащаш само при продажба.',
  '["50 безплатни обяви на месец", "12% комисион при продажба", "Стандартна видимост в търсачката", "Защита на купувача", "Чат с купувачи"]',
  true
);

-- 2. PLUS - For regular sellers who want more
INSERT INTO subscription_plans (
  id, name, tier, account_type,
  price_monthly, price_yearly, currency,
  max_listings, final_value_fee, insertion_fee, per_order_fee,
  commission_rate, boosts_included, priority_support, analytics_access,
  badge_type, description, description_bg,
  features, is_active
) VALUES (
  gen_random_uuid(),
  'Plus',
  'starter',
  'personal',
  9.99, 99.00, 'BGN',
  500,          -- 500 listings per month
  9.00,         -- 9% when sold
  0,            -- NO insertion fee
  0,            -- NO per-order fee
  9.00,
  5,            -- 5 free boosts/month
  false,
  'basic',
  'plus_seller',
  'For regular sellers. 10x more listings, lower fees.',
  'За редовни продавачи. 10x повече обяви, по-ниски такси.',
  '["500 обяви на месец", "9% комисион при продажба (спестяваш 3%)", "5 безплатни промоции месечно", "Plus Seller значка", "Базова аналитика", "Приоритетно показване"]',
  true
);

-- 3. PRO - For power sellers
INSERT INTO subscription_plans (
  id, name, tier, account_type,
  price_monthly, price_yearly, currency,
  max_listings, final_value_fee, insertion_fee, per_order_fee,
  commission_rate, boosts_included, priority_support, analytics_access,
  badge_type, description, description_bg,
  features, is_active
) VALUES (
  gen_random_uuid(),
  'Pro',
  'professional',
  'personal',
  29.99, 299.00, 'BGN',
  NULL,         -- UNLIMITED listings
  6.00,         -- 6% when sold
  0,            -- NO insertion fee
  0,            -- NO per-order fee
  6.00,
  15,           -- 15 free boosts/month
  true,
  'full',
  'pro_seller',
  'For power sellers. Unlimited listings, lowest personal fees.',
  'За професионални продавачи. Неограничени обяви, най-ниски такси.',
  '["НЕОГРАНИЧЕНИ обяви", "6% комисион при продажба (спестяваш 6%)", "15 безплатни промоции месечно", "Pro Seller значка", "Пълна аналитика", "Приоритетна поддръжка", "Ранен достъп до нови функции"]',
  true
);

-- ============================================
-- BUSINESS ACCOUNT PLANS (3 tiers)
-- ============================================

-- 1. BUSINESS FREE - For small businesses starting out
INSERT INTO subscription_plans (
  id, name, tier, account_type,
  price_monthly, price_yearly, currency,
  max_listings, final_value_fee, insertion_fee, per_order_fee,
  commission_rate, boosts_included, priority_support, analytics_access,
  badge_type, description, description_bg,
  features, is_active
) VALUES (
  gen_random_uuid(),
  'Business Free',
  'free',
  'business',
  0, 0, 'BGN',
  100,          -- 100 listings per month (more than personal)
  10.00,        -- 10% when sold (lower than personal free)
  0,            -- NO insertion fee
  0,            -- NO per-order fee
  10.00,
  0,            -- No free boosts
  false,
  'basic',
  'verified_business',
  'Free for registered businesses. Better rates than personal.',
  'Безплатно за регистрирани фирми. По-добри условия от личен акаунт.',
  '["100 безплатни обяви на месец", "10% комисион при продажба", "Verified Business значка", "Базова аналитика", "Фактури за бизнеса", "Защита на купувача"]',
  true
);

-- 2. BUSINESS GROWTH - For growing businesses
INSERT INTO subscription_plans (
  id, name, tier, account_type,
  price_monthly, price_yearly, currency,
  max_listings, final_value_fee, insertion_fee, per_order_fee,
  commission_rate, boosts_included, priority_support, analytics_access,
  badge_type, description, description_bg,
  features, is_active
) VALUES (
  gen_random_uuid(),
  'Business Growth',
  'professional',
  'business',
  49.99, 499.00, 'BGN',
  2000,         -- 2000 listings per month
  5.00,         -- 5% when sold
  0,            -- NO insertion fee
  0,            -- NO per-order fee
  5.00,
  20,           -- 20 free boosts/month
  true,
  'full',
  'business_pro',
  'For growing businesses. Professional tools and support.',
  'За растящи бизнеси. Професионални инструменти и поддръжка.',
  '["2,000 обяви на месец", "5% комисион при продажба (спестяваш 5%)", "20 безплатни промоции месечно", "Business Pro значка", "Пълна аналитика с експорт", "Приоритетна поддръжка", "Bulk listing инструменти"]',
  true
);

-- 3. BUSINESS ENTERPRISE - For large businesses
INSERT INTO subscription_plans (
  id, name, tier, account_type,
  price_monthly, price_yearly, currency,
  max_listings, final_value_fee, insertion_fee, per_order_fee,
  commission_rate, boosts_included, priority_support, analytics_access,
  badge_type, description, description_bg,
  features, is_active
) VALUES (
  gen_random_uuid(),
  'Business Enterprise',
  'enterprise',
  'business',
  99.99, 999.00, 'BGN',
  NULL,         -- UNLIMITED listings
  3.00,         -- 3% when sold (BEST rate)
  0,            -- NO insertion fee
  0,            -- NO per-order fee
  3.00,
  50,           -- 50 free boosts/month
  true,
  'full',
  'enterprise_partner',
  'For large businesses. Best rates, unlimited everything.',
  'За големи бизнеси. Най-добри условия, неограничено всичко.',
  '["НЕОГРАНИЧЕНИ обяви", "3% комисион при продажба (НАЙ-НИСЪК)", "50 безплатни промоции месечно", "Enterprise Partner значка", "Пълна аналитика с API достъп", "Личен акаунт мениджър", "API интеграция", "Персонализирана витрина"]',
  true
);

-- ============================================
-- VERIFY THE NEW STRUCTURE
-- ============================================
-- Personal: Free (50, 12%) → Plus (500, 9%) → Pro (∞, 6%)
-- Business: Free (100, 10%) → Growth (2000, 5%) → Enterprise (∞, 3%);
