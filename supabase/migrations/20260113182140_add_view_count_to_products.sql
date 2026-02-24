-- Add view_count column to products table for social proof
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Add index for sorting by popularity
CREATE INDEX IF NOT EXISTS idx_products_view_count ON products(view_count DESC);;
