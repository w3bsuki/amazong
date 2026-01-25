-- Create boost_prices config table (missing in current Supabase DB)
--
-- Used by app/api/boost/checkout to fetch pricing (with fallback to hardcoded defaults).
-- This migration is written to be safe if the table/rows already exist.

CREATE TABLE IF NOT EXISTS public.boost_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  duration_days INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.boost_prices ENABLE ROW LEVEL SECURITY;

-- Only allow reads of active prices.
DROP POLICY IF EXISTS "Anyone can view boost prices" ON public.boost_prices;
CREATE POLICY "Anyone can view boost prices"
  ON public.boost_prices FOR SELECT
  USING (is_active = true);

-- Prevent accidental DML access from anon/authenticated.
REVOKE ALL ON TABLE public.boost_prices FROM PUBLIC, anon, authenticated;

-- Allow public reads (GET /api/boost/checkout uses the anon key).
GRANT SELECT ON TABLE public.boost_prices TO anon, authenticated;

-- Seed v1 EUR pricing (aligned with DEFAULT_BOOST_PRICING) if not already present.
INSERT INTO public.boost_prices (duration_days, price, currency, is_active)
SELECT 1, 0.99, 'EUR', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.boost_prices WHERE duration_days = 1 AND is_active = true
);

INSERT INTO public.boost_prices (duration_days, price, currency, is_active)
SELECT 7, 4.99, 'EUR', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.boost_prices WHERE duration_days = 7 AND is_active = true
);

INSERT INTO public.boost_prices (duration_days, price, currency, is_active)
SELECT 30, 14.99, 'EUR', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.boost_prices WHERE duration_days = 30 AND is_active = true
);

-- Guardrail: only one active price per duration.
CREATE UNIQUE INDEX IF NOT EXISTS idx_boost_prices_duration_days_active
  ON public.boost_prices (duration_days)
  WHERE is_active = true;

