-- Add tags column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Drop old search trigger and function
DROP TRIGGER IF EXISTS on_product_created ON public.products;
DROP FUNCTION IF EXISTS public.handle_new_product_search();

-- Create multi-language full text search function (English + Cyrillic support)
CREATE OR REPLACE FUNCTION public.handle_new_product_search()
RETURNS trigger AS $$
BEGIN
  -- Use simple config which works better with multi-language including Cyrillic
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(new.tags, ' '), '')), 'C');
  return new;
END;
$$ LANGUAGE plpgsql;

-- Re-create trigger
CREATE TRIGGER on_product_created
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_product_search();

-- Update existing products to have search_vector
UPDATE public.products SET search_vector = 
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(array_to_string(tags, ' '), '')), 'C');

-- Create GIN index on search_vector for performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON public.products USING GIN (search_vector);

-- Add index on tags for better filtering
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING GIN (tags);

-- Comment
COMMENT ON COLUMN public.products.tags IS 'Product tags for categorization and search (e.g., ["BMW", "car parts", "steering wheel"])';;
