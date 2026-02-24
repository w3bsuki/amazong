-- Seller setup progress (shipping + payouts)
-- Minimal state tracked in Supabase (no stubs in app code).

-- Shipping setup is user-editable and is used for onboarding progress.
CREATE TABLE IF NOT EXISTS public.seller_shipping_settings (
  seller_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_configured boolean NOT NULL DEFAULT false,
  configured_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.seller_shipping_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seller_shipping_settings_select_own" ON public.seller_shipping_settings;
CREATE POLICY "seller_shipping_settings_select_own"
  ON public.seller_shipping_settings FOR SELECT
  TO authenticated
  USING (seller_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "seller_shipping_settings_insert_own" ON public.seller_shipping_settings;
CREATE POLICY "seller_shipping_settings_insert_own"
  ON public.seller_shipping_settings FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "seller_shipping_settings_update_own" ON public.seller_shipping_settings;
CREATE POLICY "seller_shipping_settings_update_own"
  ON public.seller_shipping_settings FOR UPDATE
  TO authenticated
  USING (seller_id = (SELECT auth.uid()))
  WITH CHECK (seller_id = (SELECT auth.uid()));

-- Payout setup is managed server-side (Stripe Connect + webhooks), but readable by the seller.
CREATE TABLE IF NOT EXISTS public.seller_payout_status (
  seller_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_connect_account_id text UNIQUE,
  details_submitted boolean NOT NULL DEFAULT false,
  charges_enabled boolean NOT NULL DEFAULT false,
  payouts_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.seller_payout_status ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seller_payout_status_select_own" ON public.seller_payout_status;
CREATE POLICY "seller_payout_status_select_own"
  ON public.seller_payout_status FOR SELECT
  TO authenticated
  USING (seller_id = (SELECT auth.uid()));

-- updated_at trigger (reuse existing handle_updated_at() if present)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    JOIN pg_namespace n ON n.oid = pg_proc.pronamespace
    WHERE pg_proc.proname = 'handle_updated_at'
      AND n.nspname = 'public'
  ) THEN
    DROP TRIGGER IF EXISTS handle_seller_shipping_settings_updated_at ON public.seller_shipping_settings;
    CREATE TRIGGER handle_seller_shipping_settings_updated_at
      BEFORE UPDATE ON public.seller_shipping_settings
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();

    DROP TRIGGER IF EXISTS handle_seller_payout_status_updated_at ON public.seller_payout_status;
    CREATE TRIGGER handle_seller_payout_status_updated_at
      BEFORE UPDATE ON public.seller_payout_status
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

COMMENT ON TABLE public.seller_shipping_settings IS 'Per-seller shipping setup status used for onboarding progress.';
COMMENT ON TABLE public.seller_payout_status IS 'Per-seller Stripe Connect payout setup status (managed server-side; seller-readable).';
;
