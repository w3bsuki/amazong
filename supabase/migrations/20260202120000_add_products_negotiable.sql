-- Migration: Add is_negotiable column to products
-- Description: Enables sellers to mark listings as having negotiable pricing
-- Part of Mobile PDP Visual Upgrade

-- Add the is_negotiable column with default false
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_negotiable BOOLEAN DEFAULT false;

-- Add a comment for documentation
COMMENT ON COLUMN products.is_negotiable IS 'Whether the seller accepts price negotiation for this product';

-- Create index for filtering negotiable products (optional, for future use)
CREATE INDEX IF NOT EXISTS idx_products_negotiable 
ON products (is_negotiable) 
WHERE is_negotiable = true;
