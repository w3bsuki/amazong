-- Drop old unique constraint (was global uniqueness)
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_slug_key;

-- Create new unique index: slug must be unique PER SELLER only
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_seller_unique ON products(seller_id, slug) WHERE slug IS NOT NULL;;
