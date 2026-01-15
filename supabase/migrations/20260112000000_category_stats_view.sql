-- Migration: category_stats materialized view
-- Purpose: Provide fast category product counts for browse UX (DEC-002)
-- 
-- Design rationale:
-- - products.category_ancestors[] includes leaf → enables subtree counts via ANY()
-- - Materialized view for performance (refresh periodically, not per-request)
-- - Only counts active products (status = 'active')
-- - Used by browse UI to filter empty categories (L0-L3)
-- - Depth computed via recursive CTE (categories table has no depth column)
--
-- IMPORTANT: refresh_category_stats() uses CONCURRENTLY which cannot run inside
-- explicit transactions. Call from cron/jobs without BEGIN/COMMIT wrapping.

-- Drop existing if re-running migration
DROP MATERIALIZED VIEW IF EXISTS category_stats;

-- Create materialized view with subtree product counts
-- Uses recursive CTE to compute depth since categories table lacks depth column
CREATE MATERIALIZED VIEW category_stats AS
WITH RECURSIVE category_depth AS (
  -- Base: root categories (parent_id IS NULL) are depth 0
  SELECT id, slug, 0 AS depth
  FROM categories
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive: children are parent_depth + 1
  SELECT c.id, c.slug, cd.depth + 1
  FROM categories c
  INNER JOIN category_depth cd ON c.parent_id = cd.id
)
SELECT 
  cd.id AS category_id,
  cd.slug,
  cd.depth,
  COUNT(p.id)::INTEGER AS subtree_product_count
FROM category_depth cd
LEFT JOIN products p ON cd.id = ANY(p.category_ancestors) 
  AND p.status = 'active'
GROUP BY cd.id, cd.slug, cd.depth;

-- Index for fast lookups by category_id
CREATE UNIQUE INDEX idx_category_stats_category_id ON category_stats(category_id);

-- Index for filtering by count (for populated categories)
CREATE INDEX idx_category_stats_populated ON category_stats(subtree_product_count) 
  WHERE subtree_product_count > 0;

-- Index for depth-based queries (L0-L3 browse)
CREATE INDEX idx_category_stats_depth_count ON category_stats(depth, subtree_product_count DESC);

-- Grant read access to anon and authenticated roles
GRANT SELECT ON category_stats TO anon, authenticated;

-- Helper function to refresh stats (call via cron or after bulk imports)
CREATE OR REPLACE FUNCTION refresh_category_stats()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY category_stats;
$$;

-- Comment for documentation
COMMENT ON MATERIALIZED VIEW category_stats IS 
  'Subtree product counts per category. Refresh via refresh_category_stats() after bulk product changes.';
