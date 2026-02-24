
-- =============================================================================
-- PROPER HIERARCHICAL CATEGORY FILTERING FOR PRODUCTS
-- =============================================================================

-- Step 1: Add the category_ancestors column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_ancestors uuid[] DEFAULT '{}';

-- Step 2: Create a function to compute ancestors for a category
CREATE OR REPLACE FUNCTION public.get_category_ancestor_ids(p_category_id uuid)
RETURNS uuid[]
LANGUAGE sql
STABLE
AS $function$
  WITH RECURSIVE ancestors AS (
    SELECT id, parent_id, ARRAY[id] as path
    FROM categories
    WHERE id = p_category_id
    
    UNION ALL
    
    SELECT c.id, c.parent_id, a.path || c.id
    FROM categories c
    JOIN ancestors a ON c.id = a.parent_id
    WHERE a.parent_id IS NOT NULL
  )
  SELECT path FROM ancestors WHERE parent_id IS NULL
  LIMIT 1;
$function$;

-- Step 3: Create trigger function to auto-update category_ancestors
CREATE OR REPLACE FUNCTION public.update_product_category_ancestors()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.category_ancestors := COALESCE(
    get_category_ancestor_ids(NEW.category_id),
    ARRAY[NEW.category_id]::uuid[]
  );
  RETURN NEW;
END;
$function$;

-- Step 4: Create the trigger
DROP TRIGGER IF EXISTS trg_update_product_category_ancestors ON products;
CREATE TRIGGER trg_update_product_category_ancestors
  BEFORE INSERT OR UPDATE OF category_id ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_category_ancestors();

-- Step 5: Backfill existing products
UPDATE products p
SET category_ancestors = COALESCE(
  get_category_ancestor_ids(p.category_id),
  ARRAY[p.category_id]::uuid[]
)
WHERE category_ancestors = '{}' OR category_ancestors IS NULL;

-- Step 6: Create GIN index for fast containment queries
CREATE INDEX IF NOT EXISTS idx_products_category_ancestors 
ON products USING GIN (category_ancestors);

-- Step 7: Create the optimized product query function (with correct types)
CREATE OR REPLACE FUNCTION public.get_products_in_category(
  p_category_slug text,
  p_limit integer DEFAULT 12,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  price numeric,
  list_price numeric,
  rating numeric,
  review_count integer,
  images text[],
  is_boosted boolean,
  boost_expires_at timestamptz,
  created_at timestamptz,
  slug text,
  attributes jsonb,
  category_id uuid,
  seller_id uuid
)
LANGUAGE sql
STABLE
AS $function$
  SELECT 
    p.id,
    p.title,
    p.price,
    p.list_price,
    p.rating,
    p.review_count,
    p.images,
    p.is_boosted,
    p.boost_expires_at,
    p.created_at,
    p.slug,
    p.attributes,
    p.category_id,
    p.seller_id
  FROM products p
  WHERE p.category_ancestors @> ARRAY[(
    SELECT c.id FROM categories c WHERE c.slug = p_category_slug LIMIT 1
  )]::uuid[]
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$function$;

-- Step 8: Create count function for pagination
CREATE OR REPLACE FUNCTION public.count_products_in_category(p_category_slug text)
RETURNS bigint
LANGUAGE sql
STABLE
AS $function$
  SELECT COUNT(*)
  FROM products p
  WHERE p.category_ancestors @> ARRAY[(
    SELECT c.id FROM categories c WHERE c.slug = p_category_slug LIMIT 1
  )]::uuid[];
$function$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_category_ancestor_ids(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_product_category_ancestors() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_products_in_category(text, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.count_products_in_category(text) TO anon, authenticated;
;
