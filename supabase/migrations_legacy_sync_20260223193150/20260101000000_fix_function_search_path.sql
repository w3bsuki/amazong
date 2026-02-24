-- =====================================================
-- Fix function search_path security warnings
-- =====================================================
-- Security Advisory: Function Search Path Mutable
-- https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable
-- 
-- Functions must have search_path set to '' to prevent potential SQL injection
-- via search_path manipulation. When search_path is empty, you must use
-- fully qualified table names (schema.table).
-- 
-- NOTE: This migration was applied as fix_function_search_path_v2
-- =====================================================

-- Fix: update_product_category_ancestors (trigger function)
CREATE OR REPLACE FUNCTION public.update_product_category_ancestors()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
BEGIN
  NEW.category_ancestors := COALESCE(
    public.get_category_ancestor_ids(NEW.category_id),
    ARRAY[NEW.category_id]::uuid[]
  );
  RETURN NEW;
END;
$function$;

-- Fix: get_category_ancestor_ids (uses recursive CTE)
CREATE OR REPLACE FUNCTION public.get_category_ancestor_ids(p_category_id uuid)
RETURNS uuid[]
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $function$
  WITH RECURSIVE ancestors AS (
    SELECT id, parent_id, ARRAY[id] as path
    FROM public.categories
    WHERE id = p_category_id
    
    UNION ALL
    
    SELECT c.id, c.parent_id, a.path || c.id
    FROM public.categories c
    JOIN ancestors a ON c.id = a.parent_id
    WHERE a.parent_id IS NOT NULL
  )
  SELECT path FROM ancestors WHERE parent_id IS NULL
  LIMIT 1;
$function$;

-- Fix: get_products_in_category (uses category slug)
CREATE OR REPLACE FUNCTION public.get_products_in_category(p_category_slug text, p_limit integer DEFAULT 12, p_offset integer DEFAULT 0)
RETURNS TABLE(id uuid, title text, price numeric, list_price numeric, rating numeric, review_count integer, images text[], is_boosted boolean, boost_expires_at timestamp with time zone, created_at timestamp with time zone, slug text, attributes jsonb, category_id uuid, seller_id uuid)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
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
  FROM public.products p
  WHERE p.category_ancestors @> ARRAY[(
    SELECT c.id FROM public.categories c WHERE c.slug = p_category_slug LIMIT 1
  )]::uuid[]
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$function$;

-- Fix: count_products_in_category (uses category slug)
CREATE OR REPLACE FUNCTION public.count_products_in_category(p_category_slug text)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT COUNT(*)
  FROM public.products p
  WHERE p.category_ancestors @> ARRAY[(
    SELECT c.id FROM public.categories c WHERE c.slug = p_category_slug LIMIT 1
  )]::uuid[];
$function$;
DO $$
BEGIN
  RAISE NOTICE 'Migration complete: Fixed search_path for 4 functions';
END;
$$;
