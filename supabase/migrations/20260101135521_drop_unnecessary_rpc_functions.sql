-- Drop over-engineered RPC functions that are now replaced by standard Supabase queries
-- The products/newest API now uses:
--   1. Standard .filter('category_ancestors', 'cs', '{uuid}') for hierarchical filtering
--   2. Standard { count: 'exact' } for total count
-- These RPC functions were doing nothing special that Supabase can't do natively.

DROP FUNCTION IF EXISTS public.get_products_in_category(text, integer, integer);
DROP FUNCTION IF EXISTS public.count_products_in_category(text);

-- Add a comment explaining this decision
COMMENT ON COLUMN public.products.category_ancestors IS 
  'UUID array of all ancestor categories for this product. Used with GIN index for efficient hierarchical filtering via @> (contains) operator. Standard Supabase queries can filter this with .filter(''category_ancestors'', ''cs'', ''{uuid}'').';;
