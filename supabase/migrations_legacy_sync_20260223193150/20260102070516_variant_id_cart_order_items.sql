-- =====================================================
-- VARIANTS: cart_items + order_items support
-- Date: 2026-01-02
-- Purpose:
--  - Allow cart/order items to reference a chosen product variant
--  - Make cart RPCs variant-aware
--  - Decrement variant stock when variant_id is present
-- =====================================================

BEGIN;

-- ------------------------------
-- cart_items: add variant_id
-- ------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'cart_items'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'cart_items'
        AND column_name = 'variant_id'
    ) THEN
      ALTER TABLE public.cart_items
        ADD COLUMN variant_id uuid NULL;
    END IF;

    -- FK to product_variants (nullable; deleting a variant should drop cart rows)
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'cart_items'
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name = 'cart_items_variant_id_fkey'
    ) THEN
      ALTER TABLE public.cart_items
        ADD CONSTRAINT cart_items_variant_id_fkey
        FOREIGN KEY (variant_id)
        REFERENCES public.product_variants(id)
        ON DELETE CASCADE;
    END IF;

    -- Replace the old unique index (user_id, product_id) with two constraints:
    -- - One row for non-variant items (variant_id IS NULL)
    -- - One row per chosen variant (variant_id IS NOT NULL)
    IF EXISTS (
      SELECT 1
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = 'cart_items'
        AND indexname = 'idx_cart_items_user_product_unique'
    ) THEN
      DROP INDEX public.idx_cart_items_user_product_unique;
    END IF;

    CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_user_product_no_variant_unique
      ON public.cart_items(user_id, product_id)
      WHERE variant_id IS NULL;

    CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_user_product_variant_unique
      ON public.cart_items(user_id, product_id, variant_id)
      WHERE variant_id IS NOT NULL;

    CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id
      ON public.cart_items(variant_id);
  END IF;
END $$;

-- ------------------------------
-- cart RPCs: variant-aware
-- ------------------------------

-- Remove legacy overloads (if present) in a safe, idempotent way.
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

-- Atomic add/increment (variant-aware)
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

  -- If variant_id provided, ensure it belongs to the product.
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

  -- Non-variant product row (variant_id NULL) uses partial unique index inference.
  INSERT INTO public.cart_items (user_id, product_id, variant_id, quantity)
  VALUES ((SELECT auth.uid()), p_product_id, NULL, p_quantity)
  ON CONFLICT (user_id, product_id) WHERE variant_id IS NULL
  DO UPDATE SET
    quantity = public.cart_items.quantity + EXCLUDED.quantity,
    updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Set quantity (0 deletes) (variant-aware)
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

  -- If variant_id provided, ensure it belongs to the product.
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

  -- If missing row, insert
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

-- ------------------------------
-- order_items: add variant_id
-- ------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'order_items'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'order_items'
        AND column_name = 'variant_id'
    ) THEN
      ALTER TABLE public.order_items
        ADD COLUMN variant_id uuid NULL;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'order_items'
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name = 'order_items_variant_id_fkey'
    ) THEN
      ALTER TABLE public.order_items
        ADD CONSTRAINT order_items_variant_id_fkey
        FOREIGN KEY (variant_id)
        REFERENCES public.product_variants(id)
        ON DELETE SET NULL;
    END IF;

    CREATE INDEX IF NOT EXISTS idx_order_items_variant_id
      ON public.order_items(variant_id);
  END IF;
END $$;

-- ------------------------------
-- Stock decrement trigger: variant-aware
-- ------------------------------

-- SECURITY: Use a fixed search_path to avoid SECURITY DEFINER attacks.
CREATE OR REPLACE FUNCTION public.order_items_decrement_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  current_track_inventory boolean;
  has_stock_quantity boolean;
BEGIN
  -- If the product doesn't exist, fail fast.
  SELECT track_inventory
  INTO current_track_inventory
  FROM public.products
  WHERE id = NEW.product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product % not found', NEW.product_id;
  END IF;

  -- If inventory tracking is disabled for this product, do nothing.
  IF current_track_inventory IS FALSE THEN
    RETURN NEW;
  END IF;

  IF NEW.quantity IS NULL OR NEW.quantity <= 0 THEN
    RAISE EXCEPTION 'Invalid quantity: %', NEW.quantity;
  END IF;

  -- Variant-aware decrement.
  IF NEW.variant_id IS NOT NULL THEN
    UPDATE public.product_variants
    SET stock = stock - NEW.quantity
    WHERE id = NEW.variant_id
      AND product_id = NEW.product_id
      AND stock >= NEW.quantity;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient stock for variant %', NEW.variant_id;
    END IF;

    RETURN NEW;
  END IF;

  -- Legacy product stock decrement.
  -- Determine if products.stock_quantity exists (some environments may not have it).
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'stock_quantity'
  )
  INTO has_stock_quantity;

  -- Decrement stock atomically; reject oversells.
  IF has_stock_quantity THEN
    EXECUTE '
      UPDATE public.products
      SET
        stock = stock - $1,
        stock_quantity = stock_quantity - $1
      WHERE id = $2
        AND stock >= $1
        AND (stock_quantity IS NULL OR stock_quantity >= $1)
    '
    USING NEW.quantity, NEW.product_id;
  ELSE
    UPDATE public.products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id
      AND stock >= NEW.quantity;
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', NEW.product_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_items_decrement_stock ON public.order_items;
CREATE TRIGGER trg_order_items_decrement_stock
BEFORE INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.order_items_decrement_stock();

COMMIT;
;
