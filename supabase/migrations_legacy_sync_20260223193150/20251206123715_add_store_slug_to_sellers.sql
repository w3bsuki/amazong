-- Add store_slug column to sellers
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS store_slug TEXT;

-- Create unique index on store_slug (each seller must have unique slug)
CREATE UNIQUE INDEX IF NOT EXISTS sellers_store_slug_unique ON sellers(store_slug) WHERE store_slug IS NOT NULL;

-- Function to generate store slug from store_name
CREATE OR REPLACE FUNCTION generate_store_slug(store_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
BEGIN
  -- First transliterate any Cyrillic characters to Latin
  base_slug := transliterate_bulgarian(store_name);
  
  -- Convert to lowercase
  base_slug := lower(base_slug);
  
  -- Replace spaces and special characters with hyphens
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
  -- Truncate to reasonable length (30 chars max for store slug)
  IF length(base_slug) > 30 THEN
    base_slug := substring(base_slug from 1 for 30);
    -- Don't cut in middle of word
    IF position('-' in reverse(base_slug)) > 0 THEN
      base_slug := substring(base_slug from 1 for length(base_slug) - position('-' in reverse(base_slug)));
    END IF;
  END IF;
  
  -- If empty, use 'store'
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'store';
  END IF;
  
  RETURN base_slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger function to auto-generate store_slug
CREATE OR REPLACE FUNCTION auto_generate_store_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Only generate if store_name is provided and slug is empty/null
  IF NEW.store_name IS NOT NULL AND (NEW.store_slug IS NULL OR NEW.store_slug = '') THEN
    base_slug := generate_store_slug(NEW.store_name);
    final_slug := base_slug;
    
    -- Check for uniqueness and append number if needed
    WHILE EXISTS(SELECT 1 FROM sellers WHERE store_slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.store_slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new sellers
DROP TRIGGER IF EXISTS seller_store_slug_trigger ON sellers;
CREATE TRIGGER seller_store_slug_trigger
  BEFORE INSERT OR UPDATE ON sellers
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_store_slug();

-- Generate store_slug for all existing sellers
UPDATE sellers 
SET store_slug = generate_store_slug(store_name)
WHERE store_name IS NOT NULL AND (store_slug IS NULL OR store_slug = '');

-- Handle duplicates by adding suffix
DO $$
DECLARE
  r RECORD;
  counter INTEGER;
  new_slug TEXT;
BEGIN
  FOR r IN 
    SELECT id, store_slug, ROW_NUMBER() OVER (PARTITION BY store_slug ORDER BY created_at) as rn
    FROM sellers
    WHERE store_slug IS NOT NULL
  LOOP
    IF r.rn > 1 THEN
      counter := r.rn - 1;
      new_slug := r.store_slug || '-' || counter;
      UPDATE sellers SET store_slug = new_slug WHERE id = r.id;
    END IF;
  END LOOP;
END $$;;
