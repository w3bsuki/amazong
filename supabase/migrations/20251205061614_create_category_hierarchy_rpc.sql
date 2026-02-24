-- Create RPC function for efficient category hierarchy fetching
-- This replaces N+1 recursive queries with a single recursive CTE
-- 
-- Returns: Full category hierarchy with all nested children up to specified depth
-- Parameters:
--   p_slug: Optional specific category slug to start from (NULL = all root categories)
--   p_depth: Maximum depth to traverse (default 3)

CREATE OR REPLACE FUNCTION get_category_hierarchy(
  p_slug text DEFAULT NULL,
  p_depth int DEFAULT 3
)
RETURNS TABLE (
  id uuid,
  name text,
  name_bg text,
  slug text,
  parent_id uuid,
  depth int,
  path text[],
  image_url text,
  icon text,
  display_order int
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH RECURSIVE category_tree AS (
    -- Base case: root categories (when p_slug is NULL) OR specific category
    SELECT 
      c.id,
      c.name,
      c.name_bg,
      c.slug,
      c.parent_id,
      0 as depth,
      ARRAY[c.slug] as path,
      c.image_url,
      c.icon,
      c.display_order
    FROM categories c
    WHERE CASE 
      WHEN p_slug IS NULL THEN c.parent_id IS NULL
      ELSE c.slug = p_slug
    END
    
    UNION ALL
    
    -- Recursive case: fetch children up to p_depth
    SELECT 
      c.id,
      c.name,
      c.name_bg,
      c.slug,
      c.parent_id,
      ct.depth + 1,
      ct.path || c.slug,
      c.image_url,
      c.icon,
      c.display_order
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
    WHERE ct.depth < p_depth
  )
  SELECT * FROM category_tree 
  ORDER BY path, display_order, name;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_category_hierarchy(text, int) TO anon, authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_category_hierarchy IS 'Efficiently fetches category hierarchy using recursive CTE. Replaces N+1 queries with single query. Use p_slug to start from specific category, p_depth to limit traversal depth.';;
