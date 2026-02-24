-- Fix 1: Set search_path on increment_view_count function
CREATE OR REPLACE FUNCTION public.increment_view_count(product_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = product_id;
END;
$$;

-- Fix 2: Revoke excessive permissions from category_stats materialized view
-- Only allow SELECT for anon/authenticated (read-only), remove write permissions
REVOKE ALL ON public.category_stats FROM anon, authenticated;
GRANT SELECT ON public.category_stats TO anon, authenticated;;
