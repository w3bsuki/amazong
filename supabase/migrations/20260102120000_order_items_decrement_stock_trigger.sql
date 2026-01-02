-- Ensure stock decrements happen without app-level service role usage.
-- This trigger runs on order_items INSERT and decrements products.stock when tracking is enabled.

BEGIN;

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
