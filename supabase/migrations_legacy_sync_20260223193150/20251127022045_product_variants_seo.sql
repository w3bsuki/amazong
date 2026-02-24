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
  name VARCHAR(255) NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  color_hex VARCHAR(7),
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  stock INTEGER DEFAULT 0 NOT NULL,
  image_url TEXT,
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT product_variants_stock_non_negative CHECK (stock >= 0)
);

-- Step 3: Create variant_options lookup table for consistent option values
CREATE TABLE IF NOT EXISTS public.variant_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  value VARCHAR(50) NOT NULL,
  display_value VARCHAR(50),
  hex_code VARCHAR(7),
  sort_order INTEGER DEFAULT 0,
  UNIQUE(type, value)
);

-- Step 4: Enable RLS on new tables
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_options ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for product_variants
CREATE POLICY "product_variants_select_all"
  ON public.product_variants FOR SELECT
  USING (true);

CREATE POLICY "product_variants_insert_seller"
  ON public.product_variants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_id 
      AND products.seller_id = (SELECT auth.uid())
    )
  );

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
CREATE POLICY "variant_options_select_all"
  ON public.variant_options FOR SELECT
  USING (true);

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
CREATE INDEX IF NOT EXISTS idx_products_meta ON public.products(meta_title, meta_description);;
