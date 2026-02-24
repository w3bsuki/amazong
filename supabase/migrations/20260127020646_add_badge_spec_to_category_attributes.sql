-- ============================================================================
-- MIGRATION: Add is_badge_spec for category-aware product badges
-- ============================================================================
-- 
-- This enables category-specific badge display on product cards:
-- - Automotive: Show mileage/year instead of condition
-- - Fashion: Show condition + size
-- - Electronics: Show condition + storage
-- - etc.
--
-- Badge specs are displayed in product card overlays/meta rows.
-- Hero specs are displayed in the detailed specs grid.
-- ============================================================================

-- 1. Add the new column
ALTER TABLE public.category_attributes 
ADD COLUMN IF NOT EXISTS is_badge_spec boolean DEFAULT false;

-- 2. Add badge_priority for ordering (primary badge first)
ALTER TABLE public.category_attributes 
ADD COLUMN IF NOT EXISTS badge_priority integer DEFAULT NULL;

-- 3. Add index for efficient badge spec queries
CREATE INDEX IF NOT EXISTS idx_category_attributes_badge 
ON public.category_attributes (category_id, is_badge_spec, badge_priority) 
WHERE is_badge_spec = true;

-- 4. Add comments
COMMENT ON COLUMN public.category_attributes.is_badge_spec IS 
  'If true, this attribute is displayed as a badge on product cards. E.g., mileage for cars, condition for clothing.';

COMMENT ON COLUMN public.category_attributes.badge_priority IS 
  'Order of badge display (1 = primary badge shown first). Lower = higher priority.';;
