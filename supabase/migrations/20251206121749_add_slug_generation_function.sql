-- Create a function to generate URL-friendly slugs from text
CREATE OR REPLACE FUNCTION generate_product_slug(title TEXT, product_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  short_id TEXT;
BEGIN
  -- Get the first 8 characters of UUID for uniqueness
  short_id := LEFT(product_id::TEXT, 8);
  
  -- Generate base slug from title (lowercase, replace spaces with hyphens, remove special chars)
  base_slug := LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRIM(title),
        '[^a-zA-Z0-9\s-]', '', 'g'  -- Remove special characters (keep alphanumeric, spaces, hyphens)
      ),
      '\s+', '-', 'g'  -- Replace spaces with hyphens
    )
  );
  
  -- Truncate if too long (max 60 chars for slug part)
  IF LENGTH(base_slug) > 60 THEN
    base_slug := LEFT(base_slug, 60);
  END IF;
  
  -- Remove trailing hyphens
  base_slug := REGEXP_REPLACE(base_slug, '-+$', '');
  
  -- Combine slug with short ID: title-slug-abcd1234
  RETURN base_slug || '-' || short_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug on insert if not provided
CREATE OR REPLACE FUNCTION auto_generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_product_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS product_slug_trigger ON products;
CREATE TRIGGER product_slug_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_product_slug();;
