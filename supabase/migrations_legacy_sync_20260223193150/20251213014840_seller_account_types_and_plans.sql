-- =====================================================
-- SELLER ACCOUNT TYPES & ENHANCED SUBSCRIPTION PLANS
-- Date: 2025-12-13
-- Purpose: Add Personal/Business account types and enhanced plan structure
-- =====================================================

-- Step 1: Add account type and social links to sellers table
ALTER TABLE public.sellers 
  ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'business'));

ALTER TABLE public.sellers 
  ADD COLUMN IF NOT EXISTS website_url TEXT;

ALTER TABLE public.sellers 
  ADD COLUMN IF NOT EXISTS facebook_url TEXT;

ALTER TABLE public.sellers 
  ADD COLUMN IF NOT EXISTS instagram_url TEXT;

ALTER TABLE public.sellers 
  ADD COLUMN IF NOT EXISTS tiktok_url TEXT;

ALTER TABLE public.sellers 
  ADD COLUMN IF NOT EXISTS vat_number TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.sellers.account_type IS 'Account type: personal (individual seller) or business (registered business)';
COMMENT ON COLUMN public.sellers.website_url IS 'Business website URL';
COMMENT ON COLUMN public.sellers.facebook_url IS 'Facebook page URL';
COMMENT ON COLUMN public.sellers.instagram_url IS 'Instagram profile URL';
COMMENT ON COLUMN public.sellers.tiktok_url IS 'TikTok profile URL';
COMMENT ON COLUMN public.sellers.vat_number IS 'VAT/EIK registration number for businesses';

-- Step 2: Enhance subscription_plans table
ALTER TABLE public.subscription_plans 
  ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'business'));

ALTER TABLE public.subscription_plans 
  ADD COLUMN IF NOT EXISTS boosts_included INTEGER DEFAULT 0;

ALTER TABLE public.subscription_plans 
  ADD COLUMN IF NOT EXISTS priority_support BOOLEAN DEFAULT false;

ALTER TABLE public.subscription_plans 
  ADD COLUMN IF NOT EXISTS analytics_access TEXT DEFAULT 'basic' CHECK (analytics_access IN ('none', 'basic', 'full', 'export'));

ALTER TABLE public.subscription_plans 
  ADD COLUMN IF NOT EXISTS badge_type TEXT;

ALTER TABLE public.subscription_plans 
  ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.subscription_plans 
  ADD COLUMN IF NOT EXISTS description_bg TEXT;

COMMENT ON COLUMN public.subscription_plans.account_type IS 'Which account type this plan applies to';
COMMENT ON COLUMN public.subscription_plans.boosts_included IS 'Number of free listing boosts per month';
COMMENT ON COLUMN public.subscription_plans.badge_type IS 'Badge displayed on seller profile: pro_seller, verified_business, etc.';

-- Step 3: Clear and insert new plans
DELETE FROM public.subscription_plans;

-- Personal Free Plan
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  commission_rate, boosts_included, priority_support, analytics_access, 
  badge_type, description, description_bg, features
) VALUES (
  'Personal Free', 'basic', 'personal', 0.00, 0.00, 10, 
  10.00, 0, false, 'basic', 
  NULL, 
  'Perfect for occasional sellers clearing out their closet',
  'Идеален за случайни продавачи, които изчистват гардероба си',
  '["10 active listings", "10% commission on sales", "Basic analytics", "Standard visibility", "Community support"]'::jsonb
);

-- Personal Pro Plan  
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  commission_rate, boosts_included, priority_support, analytics_access, 
  badge_type, description, description_bg, features
) VALUES (
  'Personal Pro', 'premium', 'personal', 14.99, 149.00, 50, 
  7.00, 3, true, 'full', 
  'pro_seller',
  'For serious sellers who want to grow their sales',
  'За сериозни продавачи, които искат да развият продажбите си',
  '["50 active listings", "7% commission on sales", "3 free boosts/month", "⭐ Pro Seller badge", "Full analytics dashboard", "Priority email support", "Featured in search results"]'::jsonb
);

-- Business Free Plan
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  commission_rate, boosts_included, priority_support, analytics_access, 
  badge_type, description, description_bg, features
) VALUES (
  'Business Free', 'basic', 'business', 0.00, 0.00, 15, 
  10.00, 0, false, 'basic', 
  'business',
  'Get started selling as a registered business',
  'Започнете да продавате като регистриран бизнес',
  '["15 active listings", "10% commission on sales", "🏢 Business badge", "Basic analytics", "Community support"]'::jsonb
);

-- Business Pro Plan
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  commission_rate, boosts_included, priority_support, analytics_access, 
  badge_type, description, description_bg, features
) VALUES (
  'Business Pro', 'premium', 'business', 39.99, 399.00, NULL, 
  5.00, 10, true, 'export', 
  'verified_business',
  'Full-featured plan for professional businesses',
  'Пълнофункционален план за професионален бизнес',
  '["Unlimited listings", "5% commission on sales", "10 free boosts/month", "✅ Verified Business badge", "Full analytics with CSV export", "Dedicated account manager", "Bulk upload tools", "API access", "Featured in Top Stores"]'::jsonb
);;
