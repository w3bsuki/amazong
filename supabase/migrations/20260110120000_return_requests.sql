-- Return requests (buyer -> seller)
-- Wires the existing Return Request dialog to real Supabase storage + RLS.

CREATE TABLE IF NOT EXISTS public.return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS return_requests_order_item_id_idx ON public.return_requests(order_item_id);
CREATE INDEX IF NOT EXISTS return_requests_order_id_idx ON public.return_requests(order_id);
CREATE INDEX IF NOT EXISTS return_requests_buyer_id_idx ON public.return_requests(buyer_id);
CREATE INDEX IF NOT EXISTS return_requests_seller_id_idx ON public.return_requests(seller_id);

-- Prevent duplicate requests for the same item by the same buyer.
CREATE UNIQUE INDEX IF NOT EXISTS return_requests_buyer_item_unique_idx
  ON public.return_requests(buyer_id, order_item_id);

-- Buyers: can insert return requests only for their own orders.
DROP POLICY IF EXISTS "return_requests_insert_own" ON public.return_requests;
CREATE POLICY "return_requests_insert_own"
  ON public.return_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    buyer_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.order_items oi
      JOIN public.orders o ON o.id = oi.order_id
      WHERE oi.id = order_item_id
        AND oi.order_id = order_id
        AND oi.seller_id = seller_id
        AND o.user_id = (SELECT auth.uid())
    )
  );

-- Buyers: can view their own requests.
DROP POLICY IF EXISTS "return_requests_select_buyer" ON public.return_requests;
CREATE POLICY "return_requests_select_buyer"
  ON public.return_requests FOR SELECT
  TO authenticated
  USING (buyer_id = (SELECT auth.uid()));

-- Sellers: can view requests for their items.
DROP POLICY IF EXISTS "return_requests_select_seller" ON public.return_requests;
CREATE POLICY "return_requests_select_seller"
  ON public.return_requests FOR SELECT
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
    DROP TRIGGER IF EXISTS handle_return_requests_updated_at ON public.return_requests;
    CREATE TRIGGER handle_return_requests_updated_at
      BEFORE UPDATE ON public.return_requests
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

COMMENT ON TABLE public.return_requests IS 'Buyer-initiated return requests per order item.';
