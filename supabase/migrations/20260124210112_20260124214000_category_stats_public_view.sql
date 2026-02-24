-- Restrict materialized view exposure via Data APIs
--
-- Supabase linter warns when a materialized view is directly selectable by anon/auth.
-- Keep the materialized view for performance, but expose a plain view for reads.

-- 1) Rename the materialized view (internal)
ALTER MATERIALIZED VIEW IF EXISTS public.category_stats RENAME TO category_stats_mv;

-- 2) Expose a read-only view with the legacy name used by the app
DROP VIEW IF EXISTS public.category_stats;
CREATE VIEW public.category_stats AS
SELECT
  category_id,
  slug,
  depth,
  subtree_product_count
FROM public.category_stats_mv;

COMMENT ON VIEW public.category_stats IS
  'Public read surface for category subtree product counts. Backed by category_stats_mv (materialized view).';

-- 3) Update refresh function to target the materialized view
CREATE OR REPLACE FUNCTION public.refresh_category_stats()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.category_stats_mv;
$$;

-- 4) Grants: revoke direct matview access; allow view access
REVOKE ALL ON TABLE public.category_stats_mv FROM anon, authenticated;
GRANT SELECT ON TABLE public.category_stats TO anon, authenticated;
;
