-- Add Stripe-related columns to subscriptions table
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Add Stripe customer ID to sellers table
ALTER TABLE public.sellers
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add Stripe price IDs to subscription_plans
ALTER TABLE public.subscription_plans
  ADD COLUMN IF NOT EXISTS stripe_price_monthly_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_yearly_id TEXT;

-- Create indexes for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_sellers_stripe_customer ON public.sellers(stripe_customer_id);

-- Add RLS policy to allow sellers to insert their own subscriptions
CREATE POLICY "Sellers can insert own subscriptions" ON public.subscriptions 
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Add RLS policy to allow sellers to update their own subscriptions
CREATE POLICY "Sellers can update own subscriptions" ON public.subscriptions 
  FOR UPDATE USING (auth.uid() = seller_id);;
