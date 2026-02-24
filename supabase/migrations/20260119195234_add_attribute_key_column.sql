
-- ============================================
-- MIGRATION: Add attribute_key column for consistent matching
-- 
-- The `name` column is human-readable ("Mileage (km)"),
-- but `attribute_key` is the snake_case key used in products.attributes JSONB
-- ============================================

-- Add the attribute_key column
ALTER TABLE public.category_attributes
  ADD COLUMN IF NOT EXISTS attribute_key TEXT;

-- Create a helper function to normalize names to keys
CREATE OR REPLACE FUNCTION normalize_attribute_key(name TEXT) 
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(name, '\s+', '_', 'g'),  -- spaces to underscore
        '[()]', '', 'g'                           -- remove parentheses
      ),
      '[^a-z0-9_]', '', 'g'                       -- remove special chars
    )
  );
END;
$$;

-- Populate attribute_key from name for existing records
UPDATE public.category_attributes
SET attribute_key = normalize_attribute_key(name)
WHERE attribute_key IS NULL;

-- Make it non-null going forward
ALTER TABLE public.category_attributes
  ALTER COLUMN attribute_key SET DEFAULT '';

-- Add index for lookups
CREATE INDEX IF NOT EXISTS idx_category_attributes_key
  ON public.category_attributes (category_id, attribute_key);

COMMENT ON COLUMN public.category_attributes.attribute_key IS 
  'Normalized snake_case key matching the key in products.attributes JSONB. Auto-generated from name.';
;
