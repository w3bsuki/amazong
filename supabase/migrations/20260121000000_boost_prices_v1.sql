-- Boost prices (v1)
-- Normalize boost_prices config to EUR and align durations/pricing with app checkout.

ALTER TABLE public.boost_prices
  ALTER COLUMN currency SET DEFAULT 'EUR';

-- Deactivate existing prices (keep history).
UPDATE public.boost_prices
  SET is_active = false
  WHERE is_active = true;

-- Insert v1 active prices (EUR).
INSERT INTO public.boost_prices (duration_days, price, currency, is_active)
VALUES
  (1, 0.99, 'EUR', true),
  (7, 4.99, 'EUR', true),
  (30, 14.99, 'EUR', true);

-- Guardrail: only one active price per duration.
CREATE UNIQUE INDEX IF NOT EXISTS idx_boost_prices_duration_days_active
  ON public.boost_prices (duration_days)
  WHERE is_active = true;

