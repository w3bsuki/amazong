-- DEC-003: Listing Boosts RLS and stripe_checkout_session_id
-- =====================================================

-- Add stripe_checkout_session_id for idempotent webhook handling
ALTER TABLE public.listing_boosts
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text UNIQUE;

COMMENT ON COLUMN public.listing_boosts.stripe_checkout_session_id IS 
  'Stripe Checkout Session ID for idempotent boost activation via webhook';

-- Add currency column with default EUR
ALTER TABLE public.listing_boosts
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'EUR';

COMMENT ON COLUMN public.listing_boosts.currency IS 
  'Payment currency (default EUR per DEC-003)';

-- Create index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_listing_boosts_stripe_session
  ON public.listing_boosts (stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

-- RLS policies for listing_boosts
-- Sellers can insert their own boosts (webhook inserts via admin client)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'listing_boosts' AND policyname = 'Sellers can insert own boosts'
  ) THEN
    CREATE POLICY "Sellers can insert own boosts"
      ON public.listing_boosts FOR INSERT
      WITH CHECK (auth.uid() = seller_id);
  END IF;
END $$;

-- Allow update of own boosts (for extending/modifying)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'listing_boosts' AND policyname = 'Sellers can update own boosts'
  ) THEN
    CREATE POLICY "Sellers can update own boosts"
      ON public.listing_boosts FOR UPDATE
      USING (auth.uid() = seller_id)
      WITH CHECK (auth.uid() = seller_id);
  END IF;
END $$;
;
