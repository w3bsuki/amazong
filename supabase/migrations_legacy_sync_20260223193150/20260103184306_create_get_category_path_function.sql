-- Function to get category path from leaf to root
-- Returns path in order from root (L0) to leaf (deepest)
CREATE OR REPLACE FUNCTION get_category_path(p_category_id UUID)
RETURNS TABLE(
  id UUID,
  slug TEXT,
  name TEXT,
  name_bg TEXT,
  icon TEXT,
  depth INT
)
LANGUAGE SQL STABLE
AS $$
  WITH RECURSIVE path AS (
    -- Start with the given category
    SELECT 
      c.id, 
      c.slug, 
      c.name, 
      c.name_bg, 
      c.icon, 
      0 as depth, 
      c.parent_id
    FROM categories c
    WHERE c.id = p_category_id
    
    UNION ALL
    
    -- Walk up the parent chain
    SELECT 
      c.id, 
      c.slug, 
      c.name, 
      c.name_bg, 
      c.icon, 
      p.depth + 1, 
      c.parent_id
    FROM categories c
    JOIN path p ON c.id = p.parent_id
    WHERE p.depth < 5  -- Safety limit (max 5 levels)
  )
  SELECT 
    path.id, 
    path.slug, 
    path.name, 
    path.name_bg, 
    path.icon, 
    path.depth
  FROM path
  ORDER BY depth DESC;  -- Root first, leaf last
$$;

COMMENT ON FUNCTION get_category_path IS 
'Returns the full category path from root to leaf for a given category ID. 
Used for breadcrumbs without needing 4-level nested joins.';

-- Index to speed up parent lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent_id 
ON categories (parent_id) 
WHERE parent_id IS NOT NULL;;
