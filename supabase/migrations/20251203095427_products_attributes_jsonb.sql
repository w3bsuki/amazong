
-- Migration: Add JSONB attributes column to products
-- This enables fast filtering using PostgREST .contains() operator

-- 1. Add the column (if not exists)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}';

-- 2. GIN index for containment queries (e.g., WHERE attributes @> '{"size": "M"}')
CREATE INDEX IF NOT EXISTS idx_products_attributes 
  ON public.products USING GIN (attributes);

-- 3. Expression indexes for common fashion filters
CREATE INDEX IF NOT EXISTS idx_products_attr_size 
  ON public.products ((attributes->>'size')) 
  WHERE attributes->>'size' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_color 
  ON public.products ((attributes->>'color')) 
  WHERE attributes->>'color' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_condition 
  ON public.products ((attributes->>'condition')) 
  WHERE attributes->>'condition' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_brand 
  ON public.products ((attributes->>'brand')) 
  WHERE attributes->>'brand' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_material 
  ON public.products ((attributes->>'material')) 
  WHERE attributes->>'material' IS NOT NULL;

-- 4. Add display_order to categories for mega-menu sorting
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_categories_display_order 
  ON public.categories (display_order);

-- 5. Add helpful comments
COMMENT ON COLUMN public.products.attributes IS 
  'JSONB attributes for fast filtering. Example: {"size": "M", "color": "Black", "condition": "New with tags", "brand": "Zara"}';

COMMENT ON COLUMN public.categories.display_order IS 
  'Sort order for mega-menu display. Lower numbers appear first.';
;
