-- ============================================
-- MIGRATION: Product Attributes + Display Order
-- Author: Auto-generated from IMPLEMENTATION.md
-- Date: December 3, 2025
-- 
-- WHAT THIS DOES:
-- 1. Adds JSONB `attributes` column to products for fast filtering
-- 2. Adds `display_order` to categories for mega-menu sorting
-- 3. Creates optimized indexes for PostgREST queries
--
-- PREREQUISITE: Shipping columns already exist (ships_to_bulgaria, etc.)
-- ============================================

-- 1. Add flexible attributes JSONB to products
-- This is the denormalized storage for fast PostgREST filtering
-- Source of truth remains in product_attributes table (EAV)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}';

-- 2. GIN index for JSONB containment queries (@>)
-- This enables PostgREST: .contains('attributes', { make: 'BMW' })
CREATE INDEX IF NOT EXISTS idx_products_attributes 
  ON public.products USING GIN (attributes);

-- 3. Expression indexes for common attribute filters
-- These enable fast scalar lookups like: attributes->>'make' = 'BMW'

-- Make/Brand filter (automotive, electronics, fashion)
CREATE INDEX IF NOT EXISTS idx_products_attr_make 
  ON public.products ((attributes->>'make')) 
  WHERE attributes->>'make' IS NOT NULL;

-- Year filter (automotive)
CREATE INDEX IF NOT EXISTS idx_products_attr_year 
  ON public.products (((attributes->>'year')::int)) 
  WHERE attributes->>'year' IS NOT NULL;

-- Brand filter (all categories)
CREATE INDEX IF NOT EXISTS idx_products_attr_brand 
  ON public.products ((attributes->>'brand')) 
  WHERE attributes->>'brand' IS NOT NULL;

-- Condition filter (used/new/refurbished)
CREATE INDEX IF NOT EXISTS idx_products_attr_condition 
  ON public.products ((attributes->>'condition')) 
  WHERE attributes->>'condition' IS NOT NULL;

-- Model filter (automotive, electronics)
CREATE INDEX IF NOT EXISTS idx_products_attr_model 
  ON public.products ((attributes->>'model')) 
  WHERE attributes->>'model' IS NOT NULL;

-- 4. Add display_order to categories for mega-menu sorting
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_categories_display_order 
  ON public.categories (display_order);

-- 5. Add helpful comments
COMMENT ON COLUMN public.products.attributes IS 
  'Denormalized JSONB attributes for fast filtering. Example: {"make": "BMW", "model": "3 Series", "year": 2020}. Source of truth: product_attributes table (EAV).';

COMMENT ON COLUMN public.categories.display_order IS 
  'Sort order for mega-menu display. Lower numbers appear first.';

-- ============================================
-- QUERY EXAMPLES (for reference, not executed)
-- ============================================
-- 
-- PostgREST containment query:
--   SELECT * FROM products WHERE attributes @> '{"make": "BMW"}';
--   supabase.from('products').contains('attributes', { make: 'BMW' })
--
-- PostgREST scalar extraction:
--   SELECT * FROM products WHERE attributes->>'year' >= '2020';
--   supabase.from('products').gte('attributes->>year', '2020')
--
-- Combined with shipping:
--   SELECT * FROM products 
--   WHERE attributes @> '{"make": "BMW"}' 
--   AND (ships_to_europe = true OR ships_to_worldwide = true);
--
-- ============================================
