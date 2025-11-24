-- Add subcategory and tags to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS subcategory text,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Update search vector function to include subcategory and tags
CREATE OR REPLACE FUNCTION public.handle_new_product_search()
RETURNS trigger AS $$
BEGIN
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.subcategory, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(new.tags, ' ')), 'C');
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Re-trigger update for existing products (optional, but good for consistency)
UPDATE public.products SET updated_at = now();
