-- Create brands table for product-brand relationships
-- Brand logos can be sourced from SVGL (svgl.app) or Simple Icons

CREATE TABLE IF NOT EXISTS public.brands (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    logo_url text, -- SVG URL from SVGL or custom uploaded
    logo_dark_url text, -- Optional dark mode variant
    description text,
    website_url text,
    country text, -- Brand origin country
    is_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Add brand_id to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL;

-- Create index for brand lookups
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Allow public read access to brands
CREATE POLICY "Brands are viewable by everyone" 
ON public.brands FOR SELECT 
USING (true);

-- Only admins can manage brands (for now allow authenticated users)
CREATE POLICY "Authenticated users can manage brands" 
ON public.brands FOR ALL 
USING (auth.role() = 'authenticated');

-- Add comment
COMMENT ON TABLE public.brands IS 'Brand information with logos from SVGL or custom uploads';
COMMENT ON COLUMN public.brands.logo_url IS 'SVG logo URL - use SVGL (svgl.app) or Simple Icons for brand logos';
COMMENT ON COLUMN public.brands.logo_dark_url IS 'Optional dark mode logo variant';;
