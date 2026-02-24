-- Enforce products.category_id to be a leaf category (no children)
--
-- Observation (2026-01-24): Most active products are assigned to non-leaf
-- categories, which makes browsing/filters less precise.
--
-- This trigger blocks assigning products to a category that has children.
-- Existing rows are unaffected unless category_id is changed.

CREATE OR REPLACE FUNCTION public.enforce_products_category_is_leaf()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.category_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.category_id = OLD.category_id THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.categories c
    WHERE c.parent_id = NEW.category_id
    LIMIT 1
  ) THEN
    RAISE EXCEPTION 'Category must be a leaf category'
      USING
        ERRCODE = '23514',
        DETAIL = 'Selected category has subcategories. Choose a more specific category.';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS aaa_enforce_products_category_is_leaf_trigger ON public.products;
CREATE TRIGGER aaa_enforce_products_category_is_leaf_trigger
BEFORE INSERT OR UPDATE OF category_id ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.enforce_products_category_is_leaf();
;
