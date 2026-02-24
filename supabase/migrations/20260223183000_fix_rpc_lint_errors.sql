-- Fix remote db lint/runtime issues for RPCs:
-- 1) public.enable_wishlist_sharing: ambiguous share_token reference
-- 2) public.cart_add_item: ON CONFLICT target mismatch for variant rows

BEGIN;

CREATE OR REPLACE FUNCTION public.enable_wishlist_sharing(p_user_id uuid DEFAULT NULL)
RETURNS TABLE(share_token varchar(32), share_url text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actual_user_id uuid;
  v_share_token varchar(32);
BEGIN
  actual_user_id := auth.uid();

  IF auth.role() = 'service_role' AND p_user_id IS NOT NULL THEN
    actual_user_id := p_user_id;
  ELSIF public.is_admin() AND p_user_id IS NOT NULL THEN
    actual_user_id := p_user_id;
  END IF;

  IF actual_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Preserve existing token when present (stable share URLs).
  SELECT w.share_token
  INTO v_share_token
  FROM public.wishlists AS w
  WHERE w.user_id = actual_user_id
    AND w.share_token IS NOT NULL
  LIMIT 1;

  IF v_share_token IS NULL THEN
    v_share_token := public.generate_share_token();
  END IF;

  UPDATE public.wishlists AS w
  SET
    share_token = v_share_token,
    is_public = true
  WHERE w.user_id = actual_user_id;

  RETURN QUERY
  SELECT
    v_share_token AS share_token,
    '/wishlist/shared/' || v_share_token AS share_url;
END;
$$;

REVOKE ALL ON FUNCTION public.enable_wishlist_sharing(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enable_wishlist_sharing(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.enable_wishlist_sharing(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enable_wishlist_sharing(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.cart_add_item(
  p_product_id uuid,
  p_variant_id uuid DEFAULT NULL,
  p_quantity integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be > 0';
  END IF;

  -- If variant_id provided, ensure it belongs to the product.
  IF p_variant_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.product_variants AS pv
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

  -- Non-variant product row (variant_id NULL) uses partial unique index inference.
  INSERT INTO public.cart_items (user_id, product_id, variant_id, quantity)
  VALUES ((SELECT auth.uid()), p_product_id, NULL, p_quantity)
  ON CONFLICT (user_id, product_id) WHERE variant_id IS NULL
  DO UPDATE SET
    quantity = public.cart_items.quantity + EXCLUDED.quantity,
    updated_at = timezone('utc'::text, now());
END;
$$;

REVOKE ALL ON FUNCTION public.cart_add_item(uuid, uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cart_add_item(uuid, uuid, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.cart_add_item(uuid, uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cart_add_item(uuid, uuid, integer) TO service_role;

COMMIT;
