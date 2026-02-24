-- DEC-003: Listing boosts (monetization v1)
-- Add idempotency key for Stripe webhooks and persist charge currency.

ALTER TABLE public.listing_boosts
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text;

ALTER TABLE public.listing_boosts
  ADD COLUMN IF NOT EXISTS currency text;

UPDATE public.listing_boosts
  SET currency = 'EUR'
  WHERE currency IS NULL;

ALTER TABLE public.listing_boosts
  ALTER COLUMN currency SET DEFAULT 'EUR';

ALTER TABLE public.listing_boosts
  ALTER COLUMN currency SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_listing_boosts_stripe_checkout_session_id
  ON public.listing_boosts (stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

COMMENT ON COLUMN public.listing_boosts.stripe_checkout_session_id IS 'Stripe Checkout Session id used for webhook idempotency.';
COMMENT ON COLUMN public.listing_boosts.currency IS 'ISO currency code for the amount paid (primary: EUR).';
