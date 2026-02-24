-- Add tier and subscription columns to sellers
ALTER TABLE public.sellers
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'basic' CHECK (tier IN ('basic', 'premium', 'business')),
  ADD COLUMN IF NOT EXISTS is_verified_business BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS business_name TEXT,
  ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(4, 2) DEFAULT 10.00;

-- Add boosting columns to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_boosted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'normal' CHECK (listing_type IN ('normal', 'boosted'));

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'business')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  price_paid DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BGN',
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')) NOT NULL,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription_plans table (config)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'premium', 'business')),
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BGN',
  max_listings INTEGER,
  commission_rate DECIMAL(4, 2) NOT NULL,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create listing_boosts table
CREATE TABLE IF NOT EXISTS public.listing_boosts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  price_paid DECIMAL(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 7,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, tier, price_monthly, price_yearly, max_listings, commission_rate, features)
VALUES 
  ('Basic', 'basic', 0.00, 0.00, 10, 10.00, '["10 active listings", "Standard visibility", "10% commission"]'::jsonb),
  ('Premium', 'premium', 9.99, 99.00, NULL, 7.00, '["Unlimited listings", "7% commission", "Premium badge", "Analytics", "Boost available"]'::jsonb),
  ('Business', 'business', 29.99, 299.00, NULL, 5.00, '["Everything in Premium", "5% commission", "Verified badge", "API access", "Priority support"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can view own boosts" ON public.listing_boosts FOR SELECT USING (auth.uid() = seller_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_is_boosted ON public.products(is_boosted) WHERE is_boosted = true;
CREATE INDEX IF NOT EXISTS idx_subscriptions_seller ON public.subscriptions(seller_id);
CREATE INDEX IF NOT EXISTS idx_sellers_tier ON public.sellers(tier);;
