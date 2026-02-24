-- Drop existing function and trigger to recreate with transliteration support
DROP TRIGGER IF EXISTS product_slug_trigger ON products;
DROP FUNCTION IF EXISTS auto_generate_product_slug();
DROP FUNCTION IF EXISTS generate_product_slug(TEXT, UUID);

-- Create a function to transliterate Bulgarian Cyrillic to Latin characters
CREATE OR REPLACE FUNCTION transliterate_bulgarian(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  result := input_text;
  
  -- Bulgarian Cyrillic to Latin transliteration (standard BGN/PCGN romanization)
  -- Uppercase
  result := replace(result, 'А', 'A');
  result := replace(result, 'Б', 'B');
  result := replace(result, 'В', 'V');
  result := replace(result, 'Г', 'G');
  result := replace(result, 'Д', 'D');
  result := replace(result, 'Е', 'E');
  result := replace(result, 'Ж', 'Zh');
  result := replace(result, 'З', 'Z');
  result := replace(result, 'И', 'I');
  result := replace(result, 'Й', 'Y');
  result := replace(result, 'К', 'K');
  result := replace(result, 'Л', 'L');
  result := replace(result, 'М', 'M');
  result := replace(result, 'Н', 'N');
  result := replace(result, 'О', 'O');
  result := replace(result, 'П', 'P');
  result := replace(result, 'Р', 'R');
  result := replace(result, 'С', 'S');
  result := replace(result, 'Т', 'T');
  result := replace(result, 'У', 'U');
  result := replace(result, 'Ф', 'F');
  result := replace(result, 'Х', 'H');
  result := replace(result, 'Ц', 'Ts');
  result := replace(result, 'Ч', 'Ch');
  result := replace(result, 'Ш', 'Sh');
  result := replace(result, 'Щ', 'Sht');
  result := replace(result, 'Ъ', 'A');
  result := replace(result, 'Ь', 'Y');
  result := replace(result, 'Ю', 'Yu');
  result := replace(result, 'Я', 'Ya');
  
  -- Lowercase
  result := replace(result, 'а', 'a');
  result := replace(result, 'б', 'b');
  result := replace(result, 'в', 'v');
  result := replace(result, 'г', 'g');
  result := replace(result, 'д', 'd');
  result := replace(result, 'е', 'e');
  result := replace(result, 'ж', 'zh');
  result := replace(result, 'з', 'z');
  result := replace(result, 'и', 'i');
  result := replace(result, 'й', 'y');
  result := replace(result, 'к', 'k');
  result := replace(result, 'л', 'l');
  result := replace(result, 'м', 'm');
  result := replace(result, 'н', 'n');
  result := replace(result, 'о', 'o');
  result := replace(result, 'п', 'p');
  result := replace(result, 'р', 'r');
  result := replace(result, 'с', 's');
  result := replace(result, 'т', 't');
  result := replace(result, 'у', 'u');
  result := replace(result, 'ф', 'f');
  result := replace(result, 'х', 'h');
  result := replace(result, 'ц', 'ts');
  result := replace(result, 'ч', 'ch');
  result := replace(result, 'ш', 'sh');
  result := replace(result, 'щ', 'sht');
  result := replace(result, 'ъ', 'a');
  result := replace(result, 'ь', 'y');
  result := replace(result, 'ю', 'yu');
  result := replace(result, 'я', 'ya');
  
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create improved slug generation function with transliteration
CREATE OR REPLACE FUNCTION generate_product_slug(title TEXT, product_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  slug_exists BOOLEAN;
  short_id TEXT;
BEGIN
  -- Get first 8 characters of UUID for uniqueness suffix
  short_id := substring(product_id::text from 1 for 8);
  
  -- First transliterate any Cyrillic characters to Latin
  base_slug := transliterate_bulgarian(title);
  
  -- Convert to lowercase
  base_slug := lower(base_slug);
  
  -- Replace spaces and special characters with hyphens
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
  -- Truncate to reasonable length (50 chars max for the title part)
  IF length(base_slug) > 50 THEN
    base_slug := substring(base_slug from 1 for 50);
    -- Don't cut in middle of word - trim to last hyphen
    IF position('-' in reverse(base_slug)) > 0 THEN
      base_slug := substring(base_slug from 1 for length(base_slug) - position('-' in reverse(base_slug)));
    END IF;
  END IF;
  
  -- If base_slug is empty after processing, use 'product'
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'product';
  END IF;
  
  -- Check if slug already exists (for a different product)
  SELECT EXISTS(
    SELECT 1 FROM products 
    WHERE slug = base_slug 
    AND id != product_id
  ) INTO slug_exists;
  
  -- If slug exists, append the short ID
  IF slug_exists THEN
    final_slug := base_slug || '-' || short_id;
  ELSE
    final_slug := base_slug;
  END IF;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger function
CREATE OR REPLACE FUNCTION auto_generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate slug if title is provided and slug is empty/null
  IF NEW.title IS NOT NULL AND (NEW.slug IS NULL OR NEW.slug = '') THEN
    NEW.slug := generate_product_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER product_slug_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_product_slug();;
