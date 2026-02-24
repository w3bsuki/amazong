
-- Function to get all descendant category IDs for a given parent slug
-- Used by product queries to fetch products from a category and all its children
CREATE OR REPLACE FUNCTION public.get_category_descendants(p_slug text, p_depth integer DEFAULT 5)
RETURNS uuid[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH RECURSIVE category_tree AS (
    -- Base case: start with the requested category
    SELECT c.id, 0 as depth
    FROM categories c
    WHERE c.slug = p_slug
    
    UNION ALL
    
    -- Recursive case: fetch all children up to p_depth
    SELECT c.id, ct.depth + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
    WHERE ct.depth < p_depth
  )
  SELECT ARRAY_AGG(id) FROM category_tree;
$function$;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_category_descendants(text, integer) TO anon, authenticated;
;
