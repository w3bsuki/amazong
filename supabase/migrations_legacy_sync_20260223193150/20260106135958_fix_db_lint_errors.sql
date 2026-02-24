-- =====================================================
-- Fix Supabase CLI `db lint --linked` errors
-- Date: 2026-01-06
-- Fixes:
--  - public.generate_share_token(): qualify gen_random_bytes + ensure pgcrypto exists
--  - public.cart_add_item(): ON CONFLICT matches partial unique index
-- =====================================================

-- Ensure extensions schema exists (Supabase convention).
CREATE SCHEMA IF NOT EXISTS extensions;

-- Ensure pgcrypto exists (gen_random_bytes) and is located in extensions schema.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
    EXECUTE 'CREATE EXTENSION pgcrypto WITH SCHEMA extensions';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
    WHERE e.extname = 'pgcrypto'
      AND n.nspname <> 'extensions'
  ) THEN
    EXECUTE 'ALTER EXTENSION pgcrypto SET SCHEMA extensions';
  END IF;
END
$$;

-- Fix: qualify extensions.gen_random_bytes so a fixed search_path remains safe.
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS varchar(32) AS $$
DECLARE
  new_token varchar(32);
  token_exists boolean;
BEGIN
  LOOP
    new_token := encode(extensions.gen_random_bytes(16), 'hex');

    SELECT EXISTS(
      SELECT 1 FROM public.wishlists WHERE share_token = new_token
    ) INTO token_exists;

    EXIT WHEN NOT token_exists;
  END LOOP;

  RETURN new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Fix: make conflict target match the partial unique index on (user_id, product_id, variant_id) WHERE variant_id IS NOT NULL.
CREATE OR REPLACE FUNCTION public.cart_add_item(
  p_product_id uuid,
  p_variant_id uuid DEFAULT NULL,
  p_quantity integer DEFAULT 1
)
RETURNS void AS $$
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be > 0';
  END IF;

  IF p_variant_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.product_variants pv
      WHERE pv.id = p_variant_id
        AND pv.product_id = p_product_id
    ) THEN
      RAISE EXCEPTION 'Variant % does not belong to product %', p_variant_id, p_product_id;
    END IF;

    INSERT INTO public.cart_items (user_id, product_id, variant_id, quantity)
    VALUES ((SELECT auth.uid()), p_product_id, p_variant_id, p_quantity)
    ON CONFLICT (user_id, product_id, variant_id) WHERE variant_id IS NOT NULL
    DO UPDATE SET
      quantity = public.cart_items.quantity + EXCLUDED.quantity,
      updated_at = timezone('utc'::text, now());

    RETURN;
  END IF;

  INSERT INTO public.cart_items (user_id, product_id, variant_id, quantity)
  VALUES ((SELECT auth.uid()), p_product_id, NULL, p_quantity)
  ON CONFLICT (user_id, product_id) WHERE variant_id IS NULL
  DO UPDATE SET
    quantity = public.cart_items.quantity + EXCLUDED.quantity,
    updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.cart_add_item(uuid, uuid, integer) TO authenticated;;
