-- ============================================
-- ADD CATEGORY HIERARCHY RPC FUNCTION
-- Date: December 5, 2025
-- 
-- This function recursively retrieves categories
-- with their children up to a specified depth.
-- ============================================

CREATE OR REPLACE FUNCTION public.get_category_hierarchy(
    p_slug TEXT DEFAULT NULL,
    p_depth INTEGER DEFAULT 3
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    name_bg TEXT,
    slug TEXT,
    parent_id UUID,
    depth INTEGER,
    path TEXT[],
    image_url TEXT,
    icon TEXT,
    display_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE category_tree AS (
        -- Base case: root categories (or specific category if slug provided)
        SELECT 
            c.id,
            c.name,
            c.name_bg,
            c.slug,
            c.parent_id,
            0 AS depth,
            ARRAY[c.slug] AS path,
            c.image_url,
            c.icon,
            c.display_order
        FROM categories c
        WHERE 
            CASE 
                WHEN p_slug IS NULL THEN c.parent_id IS NULL
                ELSE c.slug = p_slug
            END
        
        UNION ALL
        
        -- Recursive case: children of previous level
        SELECT 
            child.id,
            child.name,
            child.name_bg,
            child.slug,
            child.parent_id,
            parent.depth + 1,
            parent.path || child.slug,
            child.image_url,
            child.icon,
            child.display_order
        FROM categories child
        INNER JOIN category_tree parent ON child.parent_id = parent.id
        WHERE parent.depth < p_depth
    )
    SELECT 
        ct.id,
        ct.name,
        ct.name_bg,
        ct.slug,
        ct.parent_id,
        ct.depth,
        ct.path,
        ct.image_url,
        ct.icon,
        ct.display_order
    FROM category_tree ct
    ORDER BY ct.depth, ct.display_order NULLS LAST, ct.name;
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.get_category_hierarchy(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_category_hierarchy(TEXT, INTEGER) TO anon;
