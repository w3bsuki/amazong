-- =====================================================
-- SELLER TIERS, SUBSCRIPTIONS & BOOSTED LISTINGS
-- Date: 2025-12-01
-- Purpose: Add seller account tiers, subscriptions, and listing boost system
-- =====================================================

-- Step 1: Create enum for seller tiers
DO $$ BEGIN
  CREATE TYPE seller_tier AS ENUM ('basic', 'premium', 'business');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create enum for subscription status
DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 3: Add tier column to sellers table
ALTER TABLE public.sellers
  ADD COLUMN IF NOT EXISTS tier seller_tier DEFAULT 'basic',
  ADD COLUMN IF NOT EXISTS is_verified_business BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS business_name TEXT,
  ADD COLUMN IF NOT EXISTS business_registration_number TEXT,
  ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(4, 2) DEFAULT 10.00; -- Default 10% commission

-- Step 4: Add boosting columns to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_boosted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'normal' CHECK (listing_type IN ('normal', 'boosted'));

-- Step 5: Ensure tags column exists (TEXT array for tag badges)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Step 6: Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  plan_type seller_tier NOT NULL,
  status subscription_status DEFAULT 'pending',
  price_paid DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BGN',
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')) NOT NULL,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  payment_method TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 7: Create listing_boosts table to track boost purchases
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

-- Step 8: Create subscription_plans table (reference/config)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tier seller_tier NOT NULL,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BGN',
  max_listings INTEGER, -- NULL = unlimited
  commission_rate DECIMAL(4, 2) NOT NULL,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 9: Insert default subscription plans
INSERT INTO public.subscription_plans (name, tier, price_monthly, price_yearly, max_listings, commission_rate, features)
VALUES 
  ('Basic', 'basic', 0.00, 0.00, 10, 10.00, '["10 active listings", "Standard visibility", "10% commission"]'::jsonb),
  ('Premium', 'premium', 9.99, 99.00, NULL, 7.00, '["Unlimited listings", "7% commission", "Premium Seller badge", "Priority support", "Analytics access", "Boosted listings available"]'::jsonb),
  ('Business', 'business', 29.99, 299.00, NULL, 5.00, '["Everything in Premium", "5% commission", "Verified Business badge", "Featured in Top Brands", "Bulk listing tools", "API access", "Dedicated account manager"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Step 10: Create boost_prices table
CREATE TABLE IF NOT EXISTS public.boost_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BGN',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default boost prices
INSERT INTO public.boost_prices (duration_days, price)
VALUES 
  (7, 2.99),
  (14, 4.99),
  (30, 8.99)
ON CONFLICT DO NOTHING;

-- Step 11: Create function to auto-expire boosts
CREATE OR REPLACE FUNCTION public.check_boost_expiry()
RETURNS void AS $$
BEGIN
  -- Update products where boost has expired
  UPDATE public.products
  SET 
    is_boosted = false,
    listing_type = 'normal'
  WHERE is_boosted = true 
    AND boost_expires_at IS NOT NULL 
    AND boost_expires_at < NOW();
    
  -- Deactivate expired boosts
  UPDATE public.listing_boosts
  SET is_active = false
  WHERE is_active = true 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Step 12: Create function to update seller tier based on active subscription
CREATE OR REPLACE FUNCTION public.update_seller_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE public.sellers
    SET 
      tier = NEW.plan_type,
      commission_rate = (SELECT commission_rate FROM subscription_plans WHERE tier = NEW.plan_type LIMIT 1)
    WHERE id = NEW.seller_id;
  ELSIF NEW.status IN ('cancelled', 'expired') THEN
    -- Check if there's another active subscription
    IF NOT EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE seller_id = NEW.seller_id 
        AND status = 'active' 
        AND id != NEW.id
    ) THEN
      UPDATE public.sellers
      SET 
        tier = 'basic',
        commission_rate = 10.00
      WHERE id = NEW.seller_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription status changes
DROP TRIGGER IF EXISTS on_subscription_status_change ON public.subscriptions;
CREATE TRIGGER on_subscription_status_change
  AFTER INSERT OR UPDATE OF status ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_seller_tier();

-- Step 13: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_is_boosted ON public.products(is_boosted) WHERE is_boosted = true;
CREATE INDEX IF NOT EXISTS idx_products_boost_expires ON public.products(boost_expires_at) WHERE boost_expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_listing_type ON public.products(listing_type);
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_subscriptions_seller ON public.subscriptions(seller_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires ON public.subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sellers_tier ON public.sellers(tier);

-- Step 14: Enable RLS on new tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boost_prices ENABLE ROW LEVEL SECURITY;

-- Step 15: RLS Policies

-- Subscription plans are public read
CREATE POLICY "Anyone can view subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

-- Boost prices are public read
CREATE POLICY "Anyone can view boost prices"
  ON public.boost_prices FOR SELECT
  USING (is_active = true);

-- Sellers can view their own subscriptions
CREATE POLICY "Sellers can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = seller_id);

-- Sellers can view their own boosts
CREATE POLICY "Sellers can view own boosts"
  ON public.listing_boosts FOR SELECT
  USING (auth.uid() = seller_id);

-- Step 16: Create view for featured products (recommended section)
CREATE OR REPLACE VIEW public.featured_products AS
SELECT p.*, s.store_name, s.tier as seller_tier
FROM public.products p
JOIN public.sellers s ON p.seller_id = s.id
WHERE (
  p.is_boosted = true 
  OR p.is_featured = true
  OR s.tier IN ('premium', 'business')
)
AND p.rating >= 4.0
AND p.stock > 0
ORDER BY 
  p.is_boosted DESC,
  p.is_featured DESC,
  s.tier DESC,
  p.rating DESC,
  p.review_count DESC;

-- Step 17: Create view for deals (discounted products)
CREATE OR REPLACE VIEW public.deal_products AS
SELECT p.*, s.store_name
FROM public.products p
JOIN public.sellers s ON p.seller_id = s.id
WHERE (
  p.list_price IS NOT NULL 
  AND p.list_price > p.price
)
OR 'sale' = ANY(p.tags)
ORDER BY 
  CASE WHEN p.list_price IS NOT NULL AND p.list_price > p.price 
       THEN (p.list_price - p.price) / p.list_price 
       ELSE 0 
  END DESC,
  p.created_at DESC;

-- Step 18: Add helpful comment
COMMENT ON TABLE public.subscriptions IS 'Seller subscription records for Premium/Business tiers';
COMMENT ON TABLE public.listing_boosts IS 'Individual product boost purchases';
COMMENT ON TABLE public.subscription_plans IS 'Available subscription plans and their features';
COMMENT ON COLUMN public.products.tags IS 'Product tags: new, sale, limited, bestseller, trending, etc. Display as badges.';
COMMENT ON COLUMN public.products.is_boosted IS 'Whether the product is currently boosted for higher visibility';
COMMENT ON COLUMN public.sellers.tier IS 'Seller account tier: basic (free), premium (paid), business (verified)';
