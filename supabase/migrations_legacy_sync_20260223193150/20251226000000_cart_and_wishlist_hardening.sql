-- =====================================================
-- CART + WISHLIST HARDENING
-- Date: 2025-12-26
-- Purpose:
--  - Enforce wishlist de-dupe at DB level
--  - Auto-clean sold/out-of-stock wishlist items after ~1 day
--  - Add server-backed cart_items with RLS and RPC helpers
-- =====================================================

-- ------------------------------
-- Wishlist: de-dupe + uniqueness
-- ------------------------------

-- Remove duplicates (keep oldest row per (user_id, product_id))
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'wishlists'
  ) THEN
    DELETE FROM public.wishlists w
    USING public.wishlists w2
    WHERE w.user_id = w2.user_id
      AND w.product_id = w2.product_id
      AND w.created_at > w2.created_at;
  END IF;
END $$;

-- Enforce unique (user_id, product_id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'wishlists'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = 'wishlists'
        AND indexname = 'idx_wishlists_user_product_unique'
    ) THEN
      CREATE UNIQUE INDEX idx_wishlists_user_product_unique
        ON public.wishlists(user_id, product_id);
    END IF;
  END IF;
END $$;

-- ----------------------------------------
-- Wishlist: cleanup sold/out-of-stock items
-- ----------------------------------------

-- Deletes wishlist rows where the product is sold/out_of_stock and the product
-- has been in that state for longer than 1 day (approximated via products.updated_at).
CREATE OR REPLACE FUNCTION public.cleanup_sold_wishlist_items()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  DELETE FROM public.wishlists w
  USING public.products p
  WHERE w.user_id = (SELECT auth.uid())
    AND w.product_id = p.id
    AND (
      COALESCE(p.stock, 0) <= 0
      OR p.status IN ('out_of_stock', 'archived', 'sold')
    )
    AND p.updated_at < (timezone('utc'::text, now()) - interval '1 day');

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.cleanup_sold_wishlist_items() TO authenticated;

COMMENT ON FUNCTION public.cleanup_sold_wishlist_items IS
  'Remove sold/out-of-stock wishlist items for current user after ~1 day (uses products.updated_at as sold timestamp proxy).';

-- ------------------------------
-- Cart: server-backed cart_items
-- ------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'cart_items'
  ) THEN
    CREATE TABLE public.cart_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
      quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
      created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
      updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
    );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_user_product_unique
  ON public.cart_items(user_id, product_id);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cart_items_select_own" ON public.cart_items;
CREATE POLICY "cart_items_select_own"
  ON public.cart_items FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "cart_items_insert_own" ON public.cart_items;
CREATE POLICY "cart_items_insert_own"
  ON public.cart_items FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "cart_items_update_own" ON public.cart_items;
CREATE POLICY "cart_items_update_own"
  ON public.cart_items FOR UPDATE
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "cart_items_delete_own" ON public.cart_items;
CREATE POLICY "cart_items_delete_own"
  ON public.cart_items FOR DELETE
  USING (user_id = (SELECT auth.uid()));

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
    DROP TRIGGER IF EXISTS handle_cart_items_updated_at ON public.cart_items;
    CREATE TRIGGER handle_cart_items_updated_at
      BEFORE UPDATE ON public.cart_items
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- Atomic add/increment
CREATE OR REPLACE FUNCTION public.cart_add_item(p_product_id uuid, p_quantity integer DEFAULT 1)
RETURNS void AS $$
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be > 0';
  END IF;

  INSERT INTO public.cart_items (user_id, product_id, quantity)
  VALUES ((SELECT auth.uid()), p_product_id, p_quantity)
  ON CONFLICT (user_id, product_id)
  DO UPDATE SET
    quantity = public.cart_items.quantity + EXCLUDED.quantity,
    updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Set quantity (0 deletes)
CREATE OR REPLACE FUNCTION public.cart_set_quantity(p_product_id uuid, p_quantity integer)
RETURNS void AS $$
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  IF p_quantity IS NULL THEN
    RAISE EXCEPTION 'Quantity must not be null';
  END IF;

  IF p_quantity <= 0 THEN
    DELETE FROM public.cart_items
    WHERE user_id = (SELECT auth.uid())
      AND product_id = p_product_id;
    RETURN;
  END IF;

  UPDATE public.cart_items
  SET quantity = p_quantity,
      updated_at = timezone('utc'::text, now())
  WHERE user_id = (SELECT auth.uid())
    AND product_id = p_product_id;

  -- If missing row, insert
  IF NOT FOUND THEN
    INSERT INTO public.cart_items (user_id, product_id, quantity)
    VALUES ((SELECT auth.uid()), p_product_id, p_quantity);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Clear cart
CREATE OR REPLACE FUNCTION public.cart_clear()
RETURNS void AS $$
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  DELETE FROM public.cart_items
  WHERE user_id = (SELECT auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.cart_add_item(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cart_set_quantity(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cart_clear() TO authenticated;

COMMENT ON TABLE public.cart_items IS 'Per-user cart items (server-backed).';
COMMENT ON FUNCTION public.cart_add_item IS 'Atomically add/increment a cart item for the current user.';
COMMENT ON FUNCTION public.cart_set_quantity IS 'Set cart item quantity for current user (0 deletes).';
COMMENT ON FUNCTION public.cart_clear IS 'Clear cart for current user.';
