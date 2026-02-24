
-- ============================================
-- MIGRATION: Add Hero Spec columns to category_attributes
-- 
-- Hero specs are the 4 key attributes displayed prominently
-- on product pages (e.g., Make/Model/Year/Mileage for cars)
-- ============================================

-- Add hero spec indicator and priority
ALTER TABLE public.category_attributes
  ADD COLUMN IF NOT EXISTS is_hero_spec BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS hero_priority INTEGER DEFAULT NULL;

-- Index for efficient hero spec queries
CREATE INDEX IF NOT EXISTS idx_category_attributes_hero
  ON public.category_attributes (category_id, is_hero_spec, hero_priority)
  WHERE is_hero_spec = true;

-- Add unit suffix for display (e.g., "km", "m²", "HP")
ALTER TABLE public.category_attributes
  ADD COLUMN IF NOT EXISTS unit_suffix TEXT DEFAULT NULL;

COMMENT ON COLUMN public.category_attributes.is_hero_spec IS 
  'Whether this attribute should be shown as a hero spec on product pages (top 4 key attributes)';

COMMENT ON COLUMN public.category_attributes.hero_priority IS 
  'Display order for hero specs (1-4). Lower = shown first. NULL if not a hero spec.';

COMMENT ON COLUMN public.category_attributes.unit_suffix IS 
  'Unit suffix for display (e.g., "km", "m²", "HP", "L")';
;
