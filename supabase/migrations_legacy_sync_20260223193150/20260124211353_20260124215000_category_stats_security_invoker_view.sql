-- Fix Supabase security advisor: security_definer_view
--
-- Postgres views run with definer privileges by default. Supabase security linter
-- flags this for views exposed via Data APIs.
--
-- Goal:
-- - Keep the materialized view private (no direct anon/auth access)
-- - Expose a safe, invoker view under the legacy name `public.category_stats`
--   used by the app.
--
-- Approach:
-- - SECURITY DEFINER function reads from the private materialized view
-- - SECURITY INVOKER view selects from that function

CREATE OR REPLACE FUNCTION public.get_category_stats()
RETURNS TABLE (
  category_id uuid,
  slug text,
  depth integer,
  subtree_product_count integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    category_id,
    slug,
    depth,
    subtree_product_count
  FROM public.category_stats_mv;
$$;

REVOKE ALL ON FUNCTION public.get_category_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_category_stats() TO anon, authenticated;

DROP VIEW IF EXISTS public.category_stats;
CREATE VIEW public.category_stats
WITH (security_invoker = true)
AS
SELECT * FROM public.get_category_stats();

COMMENT ON VIEW public.category_stats IS
  'Public read surface for category subtree product counts. Backed by category_stats_mv (materialized view).';

REVOKE ALL ON TABLE public.category_stats_mv FROM anon, authenticated;
GRANT SELECT ON TABLE public.category_stats TO anon, authenticated;
;
