-- =====================================================
-- PRODUCT VARIANTS & SEO MIGRATION
-- Date: 2025-11-27
-- Purpose: Add product variants (size, color) and SEO fields
-- Phase 5.2 from PRODUCTION.md
-- =====================================================

-- Step 1: Add SEO fields to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70),
  ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),
  ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Step 2: Create product_variants table for size/color variations
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  sku VARCHAR(100) UNIQUE,
  name VARCHAR(255) NOT NULL, -- e.g., "Large / Red"
  size VARCHAR(50), -- e.g., "S", "M", "L", "XL", "42", "10.5"
  color VARCHAR(50), -- e.g., "Red", "Blue", "Black"
  color_hex VARCHAR(7), -- e.g., "#FF0000" for color swatch display
  price_adjustment DECIMAL(10, 2) DEFAULT 0, -- +/- from base price
  stock INTEGER DEFAULT 0 NOT NULL,
  image_url TEXT, -- Variant-specific image
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT product_variants_stock_non_negative CHECK (stock >= 0)
);

-- Step 3: Create variant_options lookup table for consistent option values
CREATE TABLE IF NOT EXISTS public.variant_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'size' or 'color'
  value VARCHAR(50) NOT NULL,
  display_value VARCHAR(50), -- Localized or formatted display name
  hex_code VARCHAR(7), -- For colors
  sort_order INTEGER DEFAULT 0,
  UNIQUE(type, value)
);

-- Step 4: Enable RLS on new tables
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_options ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for product_variants

-- Everyone can view variants
CREATE POLICY "product_variants_select_all"
  ON public.product_variants FOR SELECT
  USING (true);

-- Sellers can insert variants for their products
CREATE POLICY "product_variants_insert_seller"
  ON public.product_variants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_id 
      AND products.seller_id = (SELECT auth.uid())
    )
  );

-- Sellers can update their product variants
CREATE POLICY "product_variants_update_seller"
  ON public.product_variants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_id 
      AND products.seller_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_id 
      AND products.seller_id = (SELECT auth.uid())
    )
  );

-- Sellers can delete their product variants
CREATE POLICY "product_variants_delete_seller"
  ON public.product_variants FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_id 
      AND products.seller_id = (SELECT auth.uid())
    )
  );

-- Step 6: Create RLS policies for variant_options

-- Everyone can view variant options
CREATE POLICY "variant_options_select_all"
  ON public.variant_options FOR SELECT
  USING (true);

-- Only admins can manage variant options
CREATE POLICY "variant_options_insert_admin"
  ON public.variant_options FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "variant_options_update_admin"
  ON public.variant_options FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "variant_options_delete_admin"
  ON public.variant_options FOR DELETE
  USING (public.is_admin());

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_size ON public.product_variants(size);
CREATE INDEX IF NOT EXISTS idx_product_variants_color ON public.product_variants(color);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_meta ON public.products(meta_title, meta_description);

-- Step 8: Add updated_at trigger for product_variants
DROP TRIGGER IF EXISTS handle_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER handle_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Step 9: Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_product_slug()
RETURNS trigger AS $$
BEGIN
  -- Only generate slug if not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(
      REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )) || '-' || SUBSTR(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS generate_product_slug_trigger ON public.products;
CREATE TRIGGER generate_product_slug_trigger
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_product_slug();

-- Step 10: Function to get total stock including variants
CREATE OR REPLACE FUNCTION public.get_product_total_stock(p_product_id UUID)
RETURNS INTEGER AS $$
DECLARE
  base_stock INTEGER;
  variant_stock INTEGER;
BEGIN
  -- Get base product stock
  SELECT stock INTO base_stock FROM public.products WHERE id = p_product_id;
  
  -- Get total variant stock
  SELECT COALESCE(SUM(stock), 0) INTO variant_stock 
  FROM public.product_variants 
  WHERE product_id = p_product_id;
  
  -- If product has variants, return variant stock, otherwise base stock
  IF variant_stock > 0 THEN
    RETURN variant_stock;
  ELSE
    RETURN COALESCE(base_stock, 0);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 11: Insert common variant options
INSERT INTO public.variant_options (type, value, display_value, sort_order) VALUES
  -- Clothing Sizes
  ('size', 'XS', 'Extra Small', 1),
  ('size', 'S', 'Small', 2),
  ('size', 'M', 'Medium', 3),
  ('size', 'L', 'Large', 4),
  ('size', 'XL', 'Extra Large', 5),
  ('size', 'XXL', '2X Large', 6),
  ('size', 'XXXL', '3X Large', 7),
  -- Shoe Sizes (US)
  ('size', '6', 'US 6', 10),
  ('size', '7', 'US 7', 11),
  ('size', '8', 'US 8', 12),
  ('size', '9', 'US 9', 13),
  ('size', '10', 'US 10', 14),
  ('size', '11', 'US 11', 15),
  ('size', '12', 'US 12', 16),
  ('size', '13', 'US 13', 17)
ON CONFLICT (type, value) DO NOTHING;

INSERT INTO public.variant_options (type, value, display_value, hex_code, sort_order) VALUES
  -- Common Colors
  ('color', 'Black', 'Black', '#000000', 1),
  ('color', 'White', 'White', '#FFFFFF', 2),
  ('color', 'Gray', 'Gray', '#808080', 3),
  ('color', 'Navy', 'Navy Blue', '#000080', 4),
  ('color', 'Blue', 'Blue', '#0066CC', 5),
  ('color', 'Red', 'Red', '#CC0000', 6),
  ('color', 'Green', 'Green', '#006600', 7),
  ('color', 'Yellow', 'Yellow', '#FFCC00', 8),
  ('color', 'Orange', 'Orange', '#FF6600', 9),
  ('color', 'Purple', 'Purple', '#660099', 10),
  ('color', 'Pink', 'Pink', '#FF66B2', 11),
  ('color', 'Brown', 'Brown', '#663300', 12),
  ('color', 'Beige', 'Beige', '#F5DEB3', 13)
ON CONFLICT (type, value) DO NOTHING;

-- Step 12: Add comments for documentation
COMMENT ON TABLE public.product_variants IS 'Product variants for size, color, and other options';
COMMENT ON TABLE public.variant_options IS 'Lookup table for consistent variant option values';
COMMENT ON COLUMN public.products.meta_title IS 'SEO meta title (max 70 chars)';
COMMENT ON COLUMN public.products.meta_description IS 'SEO meta description (max 160 chars)';
COMMENT ON COLUMN public.products.slug IS 'URL-friendly product slug';

-- Grant permissions
GRANT SELECT ON public.product_variants TO anon;
GRANT ALL ON public.product_variants TO authenticated;
GRANT SELECT ON public.variant_options TO anon;
GRANT ALL ON public.variant_options TO authenticated;

-- Migration complete
