-- Ensure cart RPCs exist (variant-aware)
DO $$
BEGIN
  IF to_regprocedure('public.cart_add_item(uuid, integer)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.cart_add_item(uuid, integer) FROM authenticated';
    EXECUTE 'DROP FUNCTION public.cart_add_item(uuid, integer)';
  END IF;

  IF to_regprocedure('public.cart_set_quantity(uuid, integer)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.cart_set_quantity(uuid, integer) FROM authenticated';
    EXECUTE 'DROP FUNCTION public.cart_set_quantity(uuid, integer)';
  END IF;
END $$;

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
    ON CONFLICT (user_id, product_id, variant_id)
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

CREATE OR REPLACE FUNCTION public.cart_set_quantity(
  p_product_id uuid,
  p_quantity integer,
  p_variant_id uuid DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  IF p_quantity IS NULL THEN
    RAISE EXCEPTION 'Quantity must not be null';
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
  END IF;

  IF p_quantity <= 0 THEN
    DELETE FROM public.cart_items
    WHERE user_id = (SELECT auth.uid())
      AND product_id = p_product_id
      AND (
        (p_variant_id IS NULL AND variant_id IS NULL)
        OR (p_variant_id IS NOT NULL AND variant_id = p_variant_id)
      );
    RETURN;
  END IF;

  UPDATE public.cart_items
  SET quantity = p_quantity,
      updated_at = timezone('utc'::text, now())
  WHERE user_id = (SELECT auth.uid())
    AND product_id = p_product_id
    AND (
      (p_variant_id IS NULL AND variant_id IS NULL)
      OR (p_variant_id IS NOT NULL AND variant_id = p_variant_id)
    );

  IF NOT FOUND THEN
    INSERT INTO public.cart_items (user_id, product_id, variant_id, quantity)
    VALUES ((SELECT auth.uid()), p_product_id, p_variant_id, p_quantity);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.cart_add_item(uuid, uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cart_set_quantity(uuid, integer, uuid) TO authenticated;

COMMENT ON FUNCTION public.cart_add_item(uuid, uuid, integer) IS 'Atomically add/increment a cart item for the current user (variant-aware).';
COMMENT ON FUNCTION public.cart_set_quantity(uuid, integer, uuid) IS 'Set cart item quantity for current user (0 deletes) (variant-aware).';
;
