-- ============================================
-- UK SHIPPING SUPPORT - Multi-Region Marketplace
-- Created: December 10, 2025
-- Purpose: Add UK as separate shipping zone (post-Brexit)
-- ============================================

-- 1. Add ships_to_uk column to products table
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS ships_to_uk BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.products.ships_to_uk IS 'Ships to United Kingdom (separate from EU post-Brexit)';

-- 2. Create index for UK shipping filter performance
CREATE INDEX IF NOT EXISTS idx_products_ships_to_uk ON public.products(ships_to_uk) WHERE ships_to_uk = true;

-- 3. Add UK shipping zone to shipping_zones table
INSERT INTO public.shipping_zones (code, name, name_bg, region, countries, is_active, sort_order)
VALUES ('UK', 'United Kingdom', 'Великобритания', 'europe', ARRAY['GB', 'UK'], true, 2)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  name_bg = EXCLUDED.name_bg,
  countries = EXCLUDED.countries,
  is_active = true;

-- 4. Add USA shipping zone (was missing!)
INSERT INTO public.shipping_zones (code, name, name_bg, region, countries, is_active, sort_order)
VALUES ('US', 'United States', 'САЩ', 'worldwide', ARRAY['US'], true, 4)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  name_bg = EXCLUDED.name_bg,
  is_active = true;

-- 5. Remove GB from EU zone countries (post-Brexit correction)
UPDATE public.shipping_zones 
SET countries = array_remove(array_remove(countries, 'GB'), 'UK')
WHERE code = 'EU';

-- 6. Backfill: Products that ship to Europe likely ship to UK too
-- This ensures existing products remain visible to UK buyers
UPDATE public.products
SET ships_to_uk = true
WHERE ships_to_europe = true AND ships_to_uk = false;

-- 7. Also set ships_to_uk for worldwide products
UPDATE public.products
SET ships_to_uk = true
WHERE ships_to_worldwide = true AND ships_to_uk = false;;
