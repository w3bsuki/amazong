# 🚀 Category System Implementation Guide

**Created:** December 3, 2025  
**Status:** 🔴 Not Implemented  
**Priority:** Critical  

---

## 📋 Executive Summary

This guide provides step-by-step instructions to implement the new attribute-first category system described in the `/docs/*.md` category files.

### Current State vs Target State

| Aspect | Current State | Target State |
|--------|--------------|--------------|
| Categories table | 5 columns, UUID | Extended with translations, hierarchy, SEO |
| Translations | None | JSONB `translations` column (i18n-compatible) |
| Product attributes | None | JSONB `attributes` column |
| Vehicle makes/models | None | Dedicated tables |
| Category levels | Implicit via `parent_id` | Explicit `level` + `path` columns |
| Shipping regions | None | `ships_to` array column with region filtering |

---

## 🚚 SHIPPING REGIONS SYSTEM

### Overview

Users can filter products by **where they ship to**. This is separate from locale (UI language).

### Shipping Region Codes

| Code | Name | Description |
|------|------|-------------|
| `BG` | Bulgaria | Domestic shipping |
| `EU` | Europe | EU countries |
| `US` | United States | US shipping |
| `UK` | United Kingdom | UK shipping (post-Brexit) |
| `WORLDWIDE` | Worldwide | Ships anywhere |

### User Flow

```
1. User visits site from USA (detected via IP or selection)
2. System sets `userRegion = 'US'`
3. Product queries include: WHERE 'US' = ANY(ships_to) OR 'WORLDWIDE' = ANY(ships_to)
4. User sees only products that ship to them
```

### Seller Flow

```
1. Seller creates listing at /sell
2. Seller selects "Ships to:" checkbox group:
   ☑ Bulgaria (internal)
   ☑ Europe
   ☐ USA
   ☐ UK
   ☑ Worldwide
3. If "Worldwide" selected, product ships everywhere
4. Seller can set different shipping costs per region
```

### Database Design

```sql
-- On products table
ships_to TEXT[] DEFAULT '{"BG"}',  -- Array of region codes
shipping_costs JSONB DEFAULT '{}', -- {"BG": 5.99, "EU": 15.99, "US": 29.99}

-- Example product:
-- ships_to: ["BG", "EU", "US"]
-- shipping_costs: {"BG": 5.99, "EU": 15.99, "US": 29.99}
```

### Query Examples

```sql
-- Products that ship to US
SELECT * FROM products 
WHERE 'US' = ANY(ships_to) OR 'WORLDWIDE' = ANY(ships_to);

-- Products that ship to Bulgaria with free shipping
SELECT * FROM products 
WHERE 'BG' = ANY(ships_to) 
AND (shipping_costs->>'BG')::decimal = 0;

-- Get shipping cost for user's region
SELECT 
  title,
  price,
  COALESCE(
    shipping_costs->>'US',
    shipping_costs->>'WORLDWIDE',
    '0'
  )::decimal as shipping_cost
FROM products
WHERE 'US' = ANY(ships_to) OR 'WORLDWIDE' = ANY(ships_to);
```

---

## ⚠️ CRITICAL DESIGN DECISION: Translations

### ❌ What the docs currently propose (BAD):
```sql
name TEXT NOT NULL,
name_bg TEXT NOT NULL,
description TEXT,
description_bg TEXT,
```

### ❓ Why this is problematic:
1. **Doesn't scale** - Adding German requires schema changes (`name_de`, `description_de`)
2. **Inconsistent with i18n** - Your app uses `[locale]` routing and `messages/*.json` files
3. **Confusing semantics** - Is `name` English? Default? What if user is in `bg` locale?

### ✅ Recommended approach (JSONB translations):
```sql
name JSONB NOT NULL DEFAULT '{}',
-- Example: {"en": "Cars", "bg": "Коли", "de": "Autos"}

description JSONB DEFAULT '{}',
-- Example: {"en": "All types of cars", "bg": "Всички видове коли"}
```

### 🎯 Benefits:
- **Scales infinitely** - Add any language without schema changes
- **Consistent with i18n** - Query by `locale` from your app context
- **Type-safe** - Define TypeScript types that match

### 📝 Query examples:
```sql
-- Get category name in user's locale with English fallback
SELECT 
  name->>'bg' AS localized_name,  -- Try Bulgarian
  COALESCE(name->>'bg', name->>'en') AS display_name  -- Fallback to English
FROM categories WHERE slug = 'cars';
```

```typescript
// Frontend helper
function getCategoryName(category: Category, locale: string): string {
  return category.name[locale] || category.name['en'] || Object.values(category.name)[0];
}
```

---

## 🗃️ Phase 1: Database Schema Migration

### Migration 1A: Extend Categories Table

Create file: `supabase/migrations/20251203000001_extend_categories.sql`

```sql
-- =====================================================
-- EXTEND CATEGORIES TABLE
-- Date: 2025-12-03
-- Purpose: Add translations, hierarchy, SEO, and metadata
-- =====================================================

-- Step 1: Add new columns to categories
ALTER TABLE public.categories
  -- Translations (JSONB for i18n compatibility)
  ADD COLUMN IF NOT EXISTS name_translations JSONB DEFAULT '{"en": ""}',
  ADD COLUMN IF NOT EXISTS description_translations JSONB DEFAULT '{}',
  
  -- Hierarchy & Navigation
  ADD COLUMN IF NOT EXISTS full_path TEXT,  -- e.g., "automotive/vehicles/cars"
  ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS icon TEXT,  -- emoji or icon name
  
  -- Status & Counts
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS product_count INTEGER DEFAULT 0,
  
  -- SEO (JSONB for i18n)
  ADD COLUMN IF NOT EXISTS seo_title JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS seo_description JSONB DEFAULT '{}',
  
  -- Timestamps
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Migrate existing 'name' to 'name_translations'
UPDATE public.categories
SET name_translations = jsonb_build_object('en', name)
WHERE name_translations = '{"en": ""}'::jsonb OR name_translations IS NULL;

-- Step 3: Create function to compute full_path
CREATE OR REPLACE FUNCTION public.compute_category_path(category_id UUID)
RETURNS TEXT AS $$
DECLARE
  result TEXT := '';
  current_id UUID := category_id;
  current_slug TEXT;
  current_parent UUID;
BEGIN
  LOOP
    SELECT slug, parent_id INTO current_slug, current_parent
    FROM public.categories WHERE id = current_id;
    
    IF current_slug IS NULL THEN
      EXIT;
    END IF;
    
    IF result = '' THEN
      result := current_slug;
    ELSE
      result := current_slug || '/' || result;
    END IF;
    
    IF current_parent IS NULL THEN
      EXIT;
    END IF;
    
    current_id := current_parent;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 4: Create function to compute level
CREATE OR REPLACE FUNCTION public.compute_category_level(category_id UUID)
RETURNS INTEGER AS $$
DECLARE
  lvl INTEGER := 0;
  current_id UUID := category_id;
BEGIN
  LOOP
    SELECT parent_id INTO current_id
    FROM public.categories WHERE id = current_id;
    
    IF current_id IS NULL THEN
      EXIT;
    END IF;
    
    lvl := lvl + 1;
  END LOOP;
  
  RETURN lvl;
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 5: Update existing categories with computed values
UPDATE public.categories
SET 
  full_path = public.compute_category_path(id),
  level = public.compute_category_level(id);

-- Step 6: Create trigger to auto-update path and level
CREATE OR REPLACE FUNCTION public.update_category_hierarchy()
RETURNS TRIGGER AS $$
BEGIN
  NEW.full_path := public.compute_category_path(NEW.id);
  NEW.level := public.compute_category_level(NEW.id);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_category_hierarchy ON public.categories;
CREATE TRIGGER trigger_update_category_hierarchy
  BEFORE INSERT OR UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_category_hierarchy();

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_full_path ON public.categories(full_path);
CREATE INDEX IF NOT EXISTS idx_categories_level ON public.categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_parent_order ON public.categories(parent_id, display_order);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_name_translations ON public.categories USING GIN(name_translations);

-- Step 8: Create helper function to get localized name
CREATE OR REPLACE FUNCTION public.get_category_name(
  cat public.categories,
  locale TEXT DEFAULT 'en'
)
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    cat.name_translations->>locale,
    cat.name_translations->>'en',
    cat.name
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON COLUMN public.categories.name_translations IS 'Localized names: {"en": "Cars", "bg": "Коли"}';
COMMENT ON COLUMN public.categories.full_path IS 'Full path for URL: automotive/vehicles/cars';
COMMENT ON COLUMN public.categories.level IS 'Hierarchy level: 0=root, 1=L1, 2=L2';
```

### Migration 1B: Add Product Attributes

Create file: `supabase/migrations/20251203000002_product_attributes.sql`

```sql
-- =====================================================
-- ADD PRODUCT ATTRIBUTES (JSONB)
-- Date: 2025-12-03
-- Purpose: Enable flexible product attributes for filtering
-- =====================================================

-- Step 1: Add attributes column to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}';

-- Step 2: Create GIN index for fast JSONB queries
CREATE INDEX IF NOT EXISTS idx_products_attributes 
  ON public.products USING GIN(attributes);

-- Step 3: Create partial indexes for common attribute queries
-- These will be category-specific, add as needed:

-- For vehicles: make, model, year
CREATE INDEX IF NOT EXISTS idx_products_attr_make 
  ON public.products((attributes->>'make')) 
  WHERE attributes->>'make' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_year 
  ON public.products(((attributes->>'year')::int)) 
  WHERE attributes->>'year' IS NOT NULL;

-- For electronics: brand, storage, ram
CREATE INDEX IF NOT EXISTS idx_products_attr_brand 
  ON public.products((attributes->>'brand')) 
  WHERE attributes->>'brand' IS NOT NULL;

-- Step 4: Create function to search products by attributes
CREATE OR REPLACE FUNCTION public.search_products_by_attributes(
  p_category_path TEXT,
  p_attributes JSONB DEFAULT '{}',
  p_price_min DECIMAL DEFAULT NULL,
  p_price_max DECIMAL DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price DECIMAL,
  images TEXT[],
  attributes JSONB,
  rating DECIMAL,
  seller_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.images,
    p.attributes,
    p.rating,
    p.seller_id
  FROM public.products p
  JOIN public.categories c ON p.category_id = c.id
  WHERE 
    -- Category filter (exact or prefix match)
    (c.full_path = p_category_path OR c.full_path LIKE p_category_path || '/%')
    -- Attributes filter (all provided attributes must match)
    AND (p_attributes = '{}'::jsonb OR p.attributes @> p_attributes)
    -- Price filters
    AND (p_price_min IS NULL OR p.price >= p_price_min)
    AND (p_price_max IS NULL OR p.price <= p_price_max)
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 5: Example queries for documentation:
COMMENT ON FUNCTION public.search_products_by_attributes IS '
Example usage:

-- Find all BMWs in vehicles category
SELECT * FROM search_products_by_attributes(
  ''automotive/vehicles'',
  ''{"make": "BMW"}''::jsonb
);

-- Find diesel cars from 2020+
SELECT * FROM search_products_by_attributes(
  ''automotive/vehicles/cars'',
  ''{"fuel_type": "diesel"}''::jsonb
) WHERE (attributes->>''year'')::int >= 2020;

-- Find Samsung phones with 128GB storage
SELECT * FROM search_products_by_attributes(
  ''electronics/phones-tablets/smartphones'',
  ''{"brand": "Samsung", "storage": "128GB"}''::jsonb
);
';
```

### Migration 1C: Shipping Regions

Create file: `supabase/migrations/20251203000003_shipping_regions.sql`

```sql
-- =====================================================
-- SHIPPING REGIONS SYSTEM
-- Date: 2025-12-03
-- Purpose: Enable region-based product filtering
-- =====================================================

-- Step 1: Create shipping_regions lookup table
CREATE TABLE IF NOT EXISTS public.shipping_regions (
  code TEXT PRIMARY KEY,  -- 'BG', 'EU', 'US', 'UK', 'WORLDWIDE'
  name TEXT NOT NULL,
  name_translations JSONB DEFAULT '{}',
  description TEXT,
  countries TEXT[],  -- For EU: ['DE', 'FR', 'IT', ...], For BG: ['BG']
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Step 2: Seed shipping regions
INSERT INTO public.shipping_regions (code, name, name_translations, description, countries, display_order) VALUES
('BG', 'Bulgaria', '{"en": "Bulgaria", "bg": "България"}', 'Domestic shipping within Bulgaria', ARRAY['BG'], 1),
('EU', 'Europe', '{"en": "Europe", "bg": "Европа"}', 'European Union countries', ARRAY['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'], 2),
('UK', 'United Kingdom', '{"en": "United Kingdom", "bg": "Великобритания"}', 'UK shipping', ARRAY['GB'], 3),
('US', 'United States', '{"en": "United States", "bg": "САЩ"}', 'USA shipping', ARRAY['US'], 4),
('WORLDWIDE', 'Worldwide', '{"en": "Worldwide", "bg": "По целия свят"}', 'Ships anywhere', NULL, 99)
ON CONFLICT (code) DO UPDATE SET
  name_translations = EXCLUDED.name_translations,
  countries = EXCLUDED.countries;

-- Step 3: Add shipping columns to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS ships_to TEXT[] DEFAULT '{"BG"}',
  ADD COLUMN IF NOT EXISTS shipping_costs JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS seller_country TEXT DEFAULT 'BG';

-- Step 4: Create GIN index for ships_to array queries
CREATE INDEX IF NOT EXISTS idx_products_ships_to ON public.products USING GIN(ships_to);

-- Step 5: Create index for seller_country
CREATE INDEX IF NOT EXISTS idx_products_seller_country ON public.products(seller_country);

-- Step 6: Enable RLS on shipping_regions
ALTER TABLE public.shipping_regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shipping_regions_select_public" ON public.shipping_regions
  FOR SELECT USING (true);

CREATE POLICY "shipping_regions_admin_all" ON public.shipping_regions
  FOR ALL USING (public.is_admin());

-- Step 7: Create function to check if product ships to region
CREATE OR REPLACE FUNCTION public.product_ships_to_region(
  p_ships_to TEXT[],
  p_target_region TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if ships worldwide or directly to target region
  RETURN 'WORLDWIDE' = ANY(p_ships_to) OR p_target_region = ANY(p_ships_to);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 8: Create function to get shipping cost for region
CREATE OR REPLACE FUNCTION public.get_shipping_cost(
  p_shipping_costs JSONB,
  p_target_region TEXT
)
RETURNS DECIMAL AS $$
BEGIN
  RETURN COALESCE(
    (p_shipping_costs->>p_target_region)::decimal,
    (p_shipping_costs->>'WORLDWIDE')::decimal,
    0
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 9: Create comprehensive product search with shipping filter
CREATE OR REPLACE FUNCTION public.search_products_with_shipping(
  p_category_path TEXT DEFAULT NULL,
  p_ship_to_region TEXT DEFAULT NULL,
  p_attributes JSONB DEFAULT '{}',
  p_price_min DECIMAL DEFAULT NULL,
  p_price_max DECIMAL DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'newest',
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price DECIMAL,
  images TEXT[],
  attributes JSONB,
  rating DECIMAL,
  seller_id UUID,
  ships_to TEXT[],
  shipping_cost DECIMAL,
  seller_country TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.images,
    p.attributes,
    p.rating,
    p.seller_id,
    p.ships_to,
    public.get_shipping_cost(p.shipping_costs, p_ship_to_region) as shipping_cost,
    p.seller_country
  FROM public.products p
  LEFT JOIN public.categories c ON p.category_id = c.id
  WHERE 
    -- Category filter (optional)
    (p_category_path IS NULL OR c.full_path = p_category_path OR c.full_path LIKE p_category_path || '/%')
    -- Shipping region filter (optional but recommended)
    AND (p_ship_to_region IS NULL OR public.product_ships_to_region(p.ships_to, p_ship_to_region))
    -- Attributes filter
    AND (p_attributes = '{}'::jsonb OR p.attributes @> p_attributes)
    -- Price filters
    AND (p_price_min IS NULL OR p.price >= p_price_min)
    AND (p_price_max IS NULL OR p.price <= p_price_max)
  ORDER BY 
    CASE WHEN p_sort_by = 'newest' THEN p.created_at END DESC,
    CASE WHEN p_sort_by = 'price_low' THEN p.price END ASC,
    CASE WHEN p_sort_by = 'price_high' THEN p.price END DESC,
    CASE WHEN p_sort_by = 'rating' THEN p.rating END DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 10: Grant permissions
GRANT SELECT ON public.shipping_regions TO anon;
GRANT SELECT ON public.shipping_regions TO authenticated;

COMMENT ON COLUMN public.products.ships_to IS 'Array of region codes: ["BG", "EU", "US", "WORLDWIDE"]';
COMMENT ON COLUMN public.products.shipping_costs IS 'Shipping costs by region: {"BG": 5.99, "EU": 15.99}';
COMMENT ON COLUMN public.products.seller_country IS 'Country code where seller is located';
```

### Migration 1D: Vehicle Makes & Models Tables

Create file: `supabase/migrations/20251203000004_vehicle_makes_models.sql`

```sql
-- =====================================================
-- VEHICLE MAKES & MODELS TABLES
-- Date: 2025-12-03
-- Purpose: Structured vehicle data for automotive category
-- =====================================================

-- Step 1: Create vehicle_makes table
CREATE TABLE IF NOT EXISTS public.vehicle_makes (
  id TEXT PRIMARY KEY,  -- e.g., 'bmw', 'mercedes'
  name TEXT NOT NULL UNIQUE,
  name_translations JSONB DEFAULT '{}',  -- {"en": "BMW", "bg": "БМВ"}
  logo_url TEXT,
  country TEXT,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create vehicle_models table
CREATE TABLE IF NOT EXISTS public.vehicle_models (
  id TEXT PRIMARY KEY,  -- e.g., 'bmw-3-series'
  make_id TEXT REFERENCES public.vehicle_makes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  name_translations JSONB DEFAULT '{}',
  body_types TEXT[],  -- ['sedan', 'wagon', 'coupe']
  year_start INTEGER,
  year_end INTEGER,  -- NULL means still in production
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(make_id, name)
);

-- Step 3: Enable RLS
ALTER TABLE public.vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_models ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS Policies (public read, admin write)
CREATE POLICY "vehicle_makes_select_public" ON public.vehicle_makes
  FOR SELECT USING (true);

CREATE POLICY "vehicle_makes_admin_all" ON public.vehicle_makes
  FOR ALL USING (public.is_admin());

CREATE POLICY "vehicle_models_select_public" ON public.vehicle_models
  FOR SELECT USING (true);

CREATE POLICY "vehicle_models_admin_all" ON public.vehicle_models
  FOR ALL USING (public.is_admin());

-- Step 5: Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_makes_popular ON public.vehicle_makes(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_vehicle_makes_country ON public.vehicle_makes(country);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_make ON public.vehicle_models(make_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_years ON public.vehicle_models(year_start, year_end);

-- Step 6: Grant permissions
GRANT SELECT ON public.vehicle_makes TO anon;
GRANT SELECT ON public.vehicle_models TO anon;
GRANT ALL ON public.vehicle_makes TO authenticated;
GRANT ALL ON public.vehicle_models TO authenticated;

-- Step 7: Helper function to get models by make
CREATE OR REPLACE FUNCTION public.get_models_by_make(
  p_make_id TEXT,
  p_year INTEGER DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  body_types TEXT[],
  year_start INTEGER,
  year_end INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.body_types,
    m.year_start,
    m.year_end
  FROM public.vehicle_models m
  WHERE m.make_id = p_make_id
    AND m.is_active = true
    AND (p_year IS NULL OR (
      m.year_start <= p_year AND 
      (m.year_end IS NULL OR m.year_end >= p_year)
    ))
  ORDER BY m.display_order, m.name;
END;
$$ LANGUAGE plpgsql STABLE;
```

---

## 🌱 Phase 2: Seed Data

### Seed 2A: Automotive Categories

Create file: `supabase/migrations/20251203000010_seed_automotive.sql`

```sql
-- =====================================================
-- SEED: AUTOMOTIVE CATEGORIES
-- Date: 2025-12-03
-- =====================================================

-- First, delete existing automotive subcategories to avoid conflicts
DELETE FROM public.categories 
WHERE full_path LIKE 'automotive/%' OR slug = 'automotive';

-- Insert root category
INSERT INTO public.categories (name, slug, name_translations, icon, display_order, is_active)
VALUES (
  'Automotive',
  'automotive',
  '{"en": "Automotive", "bg": "Автомобили"}',
  '🚗',
  1,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name_translations = EXCLUDED.name_translations,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;

-- Get the automotive ID for parent references
DO $$
DECLARE
  v_automotive_id UUID;
  v_vehicles_id UUID;
  v_parts_id UUID;
  v_accessories_id UUID;
  v_services_id UUID;
BEGIN
  SELECT id INTO v_automotive_id FROM public.categories WHERE slug = 'automotive';

  -- L1: Vehicles
  INSERT INTO public.categories (name, slug, parent_id, name_translations, icon, display_order)
  VALUES ('Vehicles', 'vehicles', v_automotive_id, '{"en": "Vehicles", "bg": "Превозни средства"}', '🚘', 1)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name_translations = EXCLUDED.name_translations
  RETURNING id INTO v_vehicles_id;

  -- L1: Parts
  INSERT INTO public.categories (name, slug, parent_id, name_translations, icon, display_order)
  VALUES ('Parts & Components', 'parts', v_automotive_id, '{"en": "Parts & Components", "bg": "Части и компоненти"}', '🔧', 2)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name_translations = EXCLUDED.name_translations
  RETURNING id INTO v_parts_id;

  -- L1: Accessories
  INSERT INTO public.categories (name, slug, parent_id, name_translations, icon, display_order)
  VALUES ('Accessories', 'accessories', v_automotive_id, '{"en": "Accessories", "bg": "Аксесоари"}', '🎨', 3)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name_translations = EXCLUDED.name_translations
  RETURNING id INTO v_accessories_id;

  -- L1: Services
  INSERT INTO public.categories (name, slug, parent_id, name_translations, icon, display_order)
  VALUES ('Services', 'auto-services', v_automotive_id, '{"en": "Services", "bg": "Услуги"}', '🛠️', 4)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name_translations = EXCLUDED.name_translations
  RETURNING id INTO v_services_id;

  -- L2: Vehicles subcategories
  INSERT INTO public.categories (name, slug, parent_id, name_translations, icon, display_order) VALUES
    ('Cars', 'cars', v_vehicles_id, '{"en": "Cars", "bg": "Коли"}', '🚗', 1),
    ('SUVs & Crossovers', 'suvs-crossovers', v_vehicles_id, '{"en": "SUVs & Crossovers", "bg": "Джипове и кросоувъри"}', '🚙', 2),
    ('Motorcycles', 'motorcycles', v_vehicles_id, '{"en": "Motorcycles", "bg": "Мотоциклети"}', '🏍️', 3),
    ('Trucks & Pickups', 'trucks-pickups', v_vehicles_id, '{"en": "Trucks & Pickups", "bg": "Камиони и пикапи"}', '🛻', 4),
    ('Vans & Buses', 'vans-buses', v_vehicles_id, '{"en": "Vans & Buses", "bg": "Бусове и автобуси"}', '🚐', 5),
    ('Campers & Caravans', 'campers-caravans', v_vehicles_id, '{"en": "Campers & Caravans", "bg": "Кемпери и каравани"}', '🏕️', 6),
    ('Boats & Watercraft', 'boats-watercraft', v_vehicles_id, '{"en": "Boats & Watercraft", "bg": "Лодки и джетове"}', '🚤', 7),
    ('ATVs & Quads', 'atvs-quads', v_vehicles_id, '{"en": "ATVs & Quads", "bg": "АТВ и бъгита"}', '🏎️', 8),
    ('Agricultural & Construction', 'agricultural-construction', v_vehicles_id, '{"en": "Agricultural & Construction", "bg": "Земеделска и строителна техника"}', '🚜', 9),
    ('Trailers', 'trailers', v_vehicles_id, '{"en": "Trailers", "bg": "Ремаркета"}', '🛒', 10)
  ON CONFLICT (slug) DO UPDATE SET 
    parent_id = EXCLUDED.parent_id,
    name_translations = EXCLUDED.name_translations,
    display_order = EXCLUDED.display_order;

  -- L2: Parts subcategories
  INSERT INTO public.categories (name, slug, parent_id, name_translations, icon, display_order) VALUES
    ('Engine & Drivetrain', 'engine-drivetrain', v_parts_id, '{"en": "Engine & Drivetrain", "bg": "Двигател и задвижване"}', '🔩', 1),
    ('Brakes & Suspension', 'brakes-suspension', v_parts_id, '{"en": "Brakes & Suspension", "bg": "Спирачки и окачване"}', '🛞', 2),
    ('Body & Exterior', 'body-exterior', v_parts_id, '{"en": "Body & Exterior", "bg": "Каросерия и екстериор"}', '🚪', 3),
    ('Interior', 'interior-parts', v_parts_id, '{"en": "Interior", "bg": "Интериор"}', '🪑', 4),
    ('Electrical & Lighting', 'electrical-lighting', v_parts_id, '{"en": "Electrical & Lighting", "bg": "Електрика и осветление"}', '💡', 5),
    ('Wheels & Tires', 'wheels-tires', v_parts_id, '{"en": "Wheels & Tires", "bg": "Джанти и гуми"}', '🛞', 6),
    ('Exhaust & Emissions', 'exhaust-emissions', v_parts_id, '{"en": "Exhaust & Emissions", "bg": "Ауспуси и емисии"}', '💨', 7),
    ('Cooling & Heating', 'cooling-heating', v_parts_id, '{"en": "Cooling & Heating", "bg": "Охлаждане и отопление"}', '❄️', 8),
    ('Transmission & Clutch', 'transmission-clutch', v_parts_id, '{"en": "Transmission & Clutch", "bg": "Скоростна кутия и съединител"}', '⚙️', 9),
    ('Filters & Maintenance', 'filters-maintenance', v_parts_id, '{"en": "Filters & Maintenance", "bg": "Филтри и поддръжка"}', '🔧', 10)
  ON CONFLICT (slug) DO UPDATE SET 
    parent_id = EXCLUDED.parent_id,
    name_translations = EXCLUDED.name_translations,
    display_order = EXCLUDED.display_order;

  -- L2: Accessories subcategories
  INSERT INTO public.categories (name, slug, parent_id, name_translations, icon, display_order) VALUES
    ('Electronics & Audio', 'electronics-audio', v_accessories_id, '{"en": "Electronics & Audio", "bg": "Електроника и аудио"}', '📱', 1),
    ('Interior Accessories', 'interior-accessories', v_accessories_id, '{"en": "Interior Accessories", "bg": "Интериорни аксесоари"}', '🛋️', 2),
    ('Exterior Accessories', 'exterior-accessories', v_accessories_id, '{"en": "Exterior Accessories", "bg": "Екстериорни аксесоари"}', '🎨', 3),
    ('Performance & Tuning', 'performance-tuning', v_accessories_id, '{"en": "Performance & Tuning", "bg": "Тунинг и перформанс"}', '🏎️', 4),
    ('Car Care & Detailing', 'car-care', v_accessories_id, '{"en": "Car Care & Detailing", "bg": "Грижа за автомобила"}', '🧴', 5),
    ('Cargo & Storage', 'cargo-storage', v_accessories_id, '{"en": "Cargo & Storage", "bg": "Багаж и съхранение"}', '📦', 6),
    ('Safety & Security', 'safety-security', v_accessories_id, '{"en": "Safety & Security", "bg": "Безопасност и сигурност"}', '🛡️', 7),
    ('Tools & Equipment', 'tools-equipment', v_accessories_id, '{"en": "Tools & Equipment", "bg": "Инструменти и оборудване"}', '🔧', 8)
  ON CONFLICT (slug) DO UPDATE SET 
    parent_id = EXCLUDED.parent_id,
    name_translations = EXCLUDED.name_translations,
    display_order = EXCLUDED.display_order;

  -- L2: Services subcategories
  INSERT INTO public.categories (name, slug, parent_id, name_translations, icon, display_order) VALUES
    ('Repair & Maintenance', 'repair-maintenance', v_services_id, '{"en": "Repair & Maintenance", "bg": "Ремонт и поддръжка"}', '🔧', 1),
    ('Detailing & Appearance', 'detailing-appearance', v_services_id, '{"en": "Detailing & Appearance", "bg": "Детайлинг и визия"}', '✨', 2),
    ('Tuning & Performance', 'tuning-performance', v_services_id, '{"en": "Tuning & Performance", "bg": "Тунинг и перформанс"}', '🏁', 3),
    ('Transport & Logistics', 'transport-logistics', v_services_id, '{"en": "Transport & Logistics", "bg": "Транспорт и логистика"}', '🚚', 4)
  ON CONFLICT (slug) DO UPDATE SET 
    parent_id = EXCLUDED.parent_id,
    name_translations = EXCLUDED.name_translations,
    display_order = EXCLUDED.display_order;

END $$;
```

### Seed 2B: Vehicle Makes

Create file: `supabase/migrations/20251203000011_seed_vehicle_makes.sql`

```sql
-- =====================================================
-- SEED: VEHICLE MAKES
-- Date: 2025-12-03
-- =====================================================

INSERT INTO public.vehicle_makes (id, name, name_translations, country, is_popular, display_order) VALUES
-- German (Most Popular in Bulgaria)
('bmw', 'BMW', '{"en": "BMW", "bg": "БМВ"}', 'Germany', true, 1),
('mercedes', 'Mercedes-Benz', '{"en": "Mercedes-Benz", "bg": "Мерцедес"}', 'Germany', true, 2),
('audi', 'Audi', '{"en": "Audi", "bg": "Ауди"}', 'Germany', true, 3),
('volkswagen', 'Volkswagen', '{"en": "Volkswagen", "bg": "Фолксваген"}', 'Germany', true, 4),
('opel', 'Opel', '{"en": "Opel", "bg": "Опел"}', 'Germany', true, 5),
('porsche', 'Porsche', '{"en": "Porsche", "bg": "Порше"}', 'Germany', false, 6),

-- Japanese
('toyota', 'Toyota', '{"en": "Toyota", "bg": "Тойота"}', 'Japan', true, 10),
('honda', 'Honda', '{"en": "Honda", "bg": "Хонда"}', 'Japan', true, 11),
('nissan', 'Nissan', '{"en": "Nissan", "bg": "Нисан"}', 'Japan', true, 12),
('mazda', 'Mazda', '{"en": "Mazda", "bg": "Мазда"}', 'Japan', true, 13),
('mitsubishi', 'Mitsubishi', '{"en": "Mitsubishi", "bg": "Мицубиши"}', 'Japan', true, 14),
('suzuki', 'Suzuki', '{"en": "Suzuki", "bg": "Сузуки"}', 'Japan', false, 15),
('subaru', 'Subaru', '{"en": "Subaru", "bg": "Субару"}', 'Japan', false, 16),
('lexus', 'Lexus', '{"en": "Lexus", "bg": "Лексус"}', 'Japan', false, 17),

-- Korean
('hyundai', 'Hyundai', '{"en": "Hyundai", "bg": "Хюндай"}', 'South Korea', true, 20),
('kia', 'Kia', '{"en": "Kia", "bg": "Киа"}', 'South Korea', true, 21),

-- French
('renault', 'Renault', '{"en": "Renault", "bg": "Рено"}', 'France', true, 30),
('peugeot', 'Peugeot', '{"en": "Peugeot", "bg": "Пежо"}', 'France', true, 31),
('citroen', 'Citroën', '{"en": "Citroën", "bg": "Ситроен"}', 'France', true, 32),

-- Italian
('fiat', 'Fiat', '{"en": "Fiat", "bg": "Фиат"}', 'Italy', true, 40),
('alfa-romeo', 'Alfa Romeo', '{"en": "Alfa Romeo", "bg": "Алфа Ромео"}', 'Italy', false, 41),

-- Czech & Romanian
('skoda', 'Škoda', '{"en": "Škoda", "bg": "Шкода"}', 'Czech Republic', true, 50),
('dacia', 'Dacia', '{"en": "Dacia", "bg": "Дачия"}', 'Romania', true, 51),

-- American
('ford', 'Ford', '{"en": "Ford", "bg": "Форд"}', 'USA', true, 60),
('chevrolet', 'Chevrolet', '{"en": "Chevrolet", "bg": "Шевролет"}', 'USA', false, 61),
('jeep', 'Jeep', '{"en": "Jeep", "bg": "Джип"}', 'USA', false, 62),
('tesla', 'Tesla', '{"en": "Tesla", "bg": "Тесла"}', 'USA', false, 64),

-- British
('land-rover', 'Land Rover', '{"en": "Land Rover", "bg": "Ланд Ровър"}', 'UK', false, 70),
('jaguar', 'Jaguar', '{"en": "Jaguar", "bg": "Ягуар"}', 'UK', false, 71),
('mini', 'Mini', '{"en": "Mini", "bg": "Мини"}', 'UK', false, 72),

-- Swedish
('volvo', 'Volvo', '{"en": "Volvo", "bg": "Волво"}', 'Sweden', false, 80),

-- Other
('seat', 'SEAT', '{"en": "SEAT", "bg": "Сеат"}', 'Spain', false, 100),
('other', 'Other', '{"en": "Other", "bg": "Друга"}', NULL, false, 999)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_translations = EXCLUDED.name_translations,
  country = EXCLUDED.country,
  is_popular = EXCLUDED.is_popular,
  display_order = EXCLUDED.display_order;

-- Motorcycle Makes
INSERT INTO public.vehicle_makes (id, name, name_translations, country, is_popular, display_order) VALUES
('honda-moto', 'Honda Motorcycles', '{"en": "Honda", "bg": "Хонда"}', 'Japan', true, 200),
('yamaha', 'Yamaha', '{"en": "Yamaha", "bg": "Ямаха"}', 'Japan', true, 201),
('kawasaki', 'Kawasaki', '{"en": "Kawasaki", "bg": "Кавазаки"}', 'Japan', true, 202),
('suzuki-moto', 'Suzuki Motorcycles', '{"en": "Suzuki", "bg": "Сузуки"}', 'Japan', true, 203),
('bmw-motorrad', 'BMW Motorrad', '{"en": "BMW Motorrad", "bg": "БМВ Моторрад"}', 'Germany', true, 204),
('ducati', 'Ducati', '{"en": "Ducati", "bg": "Дукати"}', 'Italy', false, 205),
('harley-davidson', 'Harley-Davidson', '{"en": "Harley-Davidson", "bg": "Харли-Дейвидсън"}', 'USA', false, 206),
('ktm', 'KTM', '{"en": "KTM", "bg": "КТМ"}', 'Austria', false, 207),
('triumph', 'Triumph', '{"en": "Triumph", "bg": "Трайъмф"}', 'UK', false, 208),
('aprilia', 'Aprilia', '{"en": "Aprilia", "bg": "Априлия"}', 'Italy', false, 209)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_translations = EXCLUDED.name_translations,
  country = EXCLUDED.country,
  is_popular = EXCLUDED.is_popular,
  display_order = EXCLUDED.display_order;
```

---

## 🔌 Phase 3: TypeScript Types

### Create file: `lib/types/categories.ts`

```typescript
// =====================================================
// CATEGORY SYSTEM TYPES
// =====================================================

export interface CategoryTranslations {
  en: string;
  bg?: string;
  [locale: string]: string | undefined;
}

export interface Category {
  id: string;
  name: string;  // Legacy field, use name_translations
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  
  // New fields
  name_translations: CategoryTranslations;
  description_translations: CategoryTranslations;
  full_path: string;
  level: number;
  display_order: number;
  icon: string | null;
  is_active: boolean;
  product_count: number;
  
  // SEO
  seo_title: CategoryTranslations;
  seo_description: CategoryTranslations;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

// Helper to get localized name
export function getCategoryName(
  category: Category, 
  locale: string = 'en'
): string {
  return (
    category.name_translations?.[locale] ||
    category.name_translations?.en ||
    category.name
  );
}

// Helper to get localized description
export function getCategoryDescription(
  category: Category,
  locale: string = 'en'
): string {
  return (
    category.description_translations?.[locale] ||
    category.description_translations?.en ||
    ''
  );
}
```

### Create file: `lib/types/shipping.ts`

```typescript
// =====================================================
// SHIPPING REGIONS TYPES
// =====================================================

export type ShippingRegionCode = 'BG' | 'EU' | 'US' | 'UK' | 'WORLDWIDE';

export interface ShippingRegion {
  code: ShippingRegionCode;
  name: string;
  name_translations: {
    en: string;
    bg?: string;
    [locale: string]: string | undefined;
  };
  description: string | null;
  countries: string[] | null;  // ISO country codes, null for WORLDWIDE
  display_order: number;
  is_active: boolean;
}

export interface ShippingCosts {
  BG?: number;
  EU?: number;
  US?: number;
  UK?: number;
  WORLDWIDE?: number;
  [region: string]: number | undefined;
}

export interface ProductShipping {
  ships_to: ShippingRegionCode[];
  shipping_costs: ShippingCosts;
  seller_country: string;
}

// Helper to check if product ships to a region
export function productShipsTo(
  shipsTo: ShippingRegionCode[],
  targetRegion: ShippingRegionCode
): boolean {
  return shipsTo.includes('WORLDWIDE') || shipsTo.includes(targetRegion);
}

// Helper to get shipping cost for a region
export function getShippingCost(
  shippingCosts: ShippingCosts,
  targetRegion: ShippingRegionCode
): number {
  return shippingCosts[targetRegion] ?? shippingCosts['WORLDWIDE'] ?? 0;
}

// Helper to get localized region name
export function getRegionName(
  region: ShippingRegion,
  locale: string = 'en'
): string {
  return region.name_translations?.[locale] || region.name_translations?.en || region.name;
}

// All shipping region options for forms
export const SHIPPING_REGIONS: { code: ShippingRegionCode; label: string; labelBg: string }[] = [
  { code: 'BG', label: 'Bulgaria (Domestic)', labelBg: 'България (вътрешен)' },
  { code: 'EU', label: 'Europe', labelBg: 'Европа' },
  { code: 'UK', label: 'United Kingdom', labelBg: 'Великобритания' },
  { code: 'US', label: 'United States', labelBg: 'САЩ' },
  { code: 'WORLDWIDE', label: 'Worldwide', labelBg: 'По целия свят' },
];
```

### Create file: `lib/types/products.ts` (extend existing)

```typescript
// =====================================================
// PRODUCT ATTRIBUTES TYPES
// =====================================================

// Base product attributes (common to all products)
export interface BaseProductAttributes {
  brand?: string;
  condition?: 'new' | 'used' | 'refurbished' | 'for_parts';
  warranty?: string;
}

// Vehicle-specific attributes
export interface VehicleAttributes extends BaseProductAttributes {
  // Identification
  make: string;
  model: string;
  variant?: string;
  year: number;
  vin?: string;
  
  // Specifications
  body_type: string;
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'plug_in_hybrid' | 'lpg' | 'cng';
  transmission: 'manual' | 'automatic' | 'semi_automatic' | 'cvt' | 'dct';
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4x4';
  engine_size?: string;
  horsepower?: number;
  
  // Condition
  mileage: number;
  mileage_unit: 'km' | 'mi';
  first_registration?: string;
  service_history?: boolean;
  accident_free?: boolean;
  owners_count?: number;
  
  // Appearance
  exterior_color: string;
  interior_color?: string;
  interior_material?: string;
  
  // Dimensions
  doors?: number;
  seats?: number;
  
  // Features
  comfort_features?: string[];
  safety_features?: string[];
  multimedia_features?: string[];
  
  // Documents
  registration_status?: 'registered' | 'deregistered' | 'export';
  country_of_origin?: string;
  
  // Seller
  seller_type: 'private' | 'dealer';
}

// Part-specific attributes
export interface PartAttributes extends BaseProductAttributes {
  part_number: string;
  oem_number?: string;
  
  // Compatibility
  compatible_makes: string[];
  compatible_models: string[];
  compatible_years?: { from: number; to: number };
  position?: 'front' | 'rear' | 'left' | 'right' | 'all';
  
  // Stock
  quantity_available: number;
  shipping_available: boolean;
}

// Electronics-specific attributes
export interface ElectronicsAttributes extends BaseProductAttributes {
  model_number?: string;
  storage?: string;
  ram?: string;
  screen_size?: string;
  resolution?: string;
  processor?: string;
  battery_capacity?: string;
  color?: string;
  connectivity?: string[];
}

// Union type for all attribute types
export type ProductAttributes = 
  | VehicleAttributes 
  | PartAttributes 
  | ElectronicsAttributes 
  | BaseProductAttributes;

// Extended product type
export interface ProductWithAttributes {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  description: string | null;
  price: number;
  list_price: number | null;
  stock: number;
  images: string[];
  rating: number;
  review_count: number;
  is_prime: boolean;
  slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  
  // New JSONB attributes
  attributes: ProductAttributes;
  
  created_at: string;
  updated_at: string;
}
```

### Create file: `lib/types/vehicles.ts`

```typescript
// =====================================================
// VEHICLE MAKES & MODELS TYPES
// =====================================================

export interface VehicleMake {
  id: string;
  name: string;
  name_translations: {
    en: string;
    bg?: string;
    [locale: string]: string | undefined;
  };
  logo_url: string | null;
  country: string | null;
  is_popular: boolean;
  display_order: number;
  is_active: boolean;
}

export interface VehicleModel {
  id: string;
  make_id: string;
  name: string;
  name_translations: {
    en: string;
    bg?: string;
    [locale: string]: string | undefined;
  };
  body_types: string[];
  year_start: number | null;
  year_end: number | null;
  is_popular: boolean;
  display_order: number;
  is_active: boolean;
}

// Helper to get localized make name
export function getMakeName(make: VehicleMake, locale: string = 'en'): string {
  return make.name_translations?.[locale] || make.name_translations?.en || make.name;
}

// Helper to get localized model name
export function getModelName(model: VehicleModel, locale: string = 'en'): string {
  return model.name_translations?.[locale] || model.name_translations?.en || model.name;
}
```

---

## 🛠️ Phase 4: API Endpoints

### Create file: `app/api/categories/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const parentPath = searchParams.get('parent') || null;
  const includeChildren = searchParams.get('children') === 'true';
  
  const supabase = await createClient();
  
  let query = supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (parentPath) {
    // Get categories under a specific path
    query = query.or(`full_path.eq.${parentPath},full_path.like.${parentPath}/%`);
  }
  
  const { data: categories, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // If includeChildren, build tree structure
  if (includeChildren) {
    const tree = buildCategoryTree(categories, locale);
    return NextResponse.json(tree);
  }
  
  // Add localized names to response
  const localizedCategories = categories.map(cat => ({
    ...cat,
    display_name: cat.name_translations?.[locale] || cat.name_translations?.['en'] || cat.name,
  }));
  
  return NextResponse.json(localizedCategories);
}

function buildCategoryTree(categories: any[], locale: string, parentId: string | null = null): any[] {
  return categories
    .filter(cat => cat.parent_id === parentId)
    .map(cat => ({
      ...cat,
      display_name: cat.name_translations?.[locale] || cat.name_translations?.['en'] || cat.name,
      children: buildCategoryTree(categories, locale, cat.id),
    }));
}
```

### Create file: `app/api/vehicle-makes/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const popularOnly = searchParams.get('popular') === 'true';
  
  const supabase = await createClient();
  
  let query = supabase
    .from('vehicle_makes')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (popularOnly) {
    query = query.eq('is_popular', true);
  }
  
  const { data: makes, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Add localized names
  const localizedMakes = makes.map(make => ({
    ...make,
    display_name: make.name_translations?.[locale] || make.name_translations?.['en'] || make.name,
  }));
  
  return NextResponse.json(localizedMakes);
}
```

### Create file: `app/api/vehicle-makes/[makeId]/models/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { makeId: string } }
) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;
  
  const supabase = await createClient();
  
  let query = supabase
    .from('vehicle_models')
    .select('*')
    .eq('make_id', params.makeId)
    .eq('is_active', true)
    .order('display_order');
  
  if (year) {
    query = query
      .lte('year_start', year)
      .or(`year_end.is.null,year_end.gte.${year}`);
  }
  
  const { data: models, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Add localized names
  const localizedModels = models.map(model => ({
    ...model,
    display_name: model.name_translations?.[locale] || model.name_translations?.['en'] || model.name,
  }));
  
  return NextResponse.json(localizedModels);
}
```

### Create file: `app/api/shipping-regions/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  
  const supabase = await createClient();
  
  const { data: regions, error } = await supabase
    .from('shipping_regions')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Add localized names
  const localizedRegions = regions.map(region => ({
    ...region,
    display_name: region.name_translations?.[locale] || region.name_translations?.['en'] || region.name,
  }));
  
  return NextResponse.json(localizedRegions);
}
```

### Create file: `app/api/products/search/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Parse query params
  const category = searchParams.get('category') || null;
  const shipTo = searchParams.get('ship_to') || null;  // User's region
  const attributes = searchParams.get('attributes');
  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  const sortBy = searchParams.get('sort') || 'newest';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  const supabase = await createClient();
  
  // Use the search function
  const { data: products, error } = await supabase.rpc('search_products_with_shipping', {
    p_category_path: category,
    p_ship_to_region: shipTo,
    p_attributes: attributes ? JSON.parse(attributes) : {},
    p_price_min: priceMin ? parseFloat(priceMin) : null,
    p_price_max: priceMax ? parseFloat(priceMax) : null,
    p_sort_by: sortBy,
    p_limit: limit,
    p_offset: offset,
  });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    products,
    pagination: {
      limit,
      offset,
      hasMore: products.length === limit,
    },
  });
}
```

### Create file: `lib/hooks/useUserRegion.ts`

```typescript
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { ShippingRegionCode } from '@/lib/types/shipping';

interface UserRegionContextType {
  region: ShippingRegionCode;
  setRegion: (region: ShippingRegionCode) => void;
  isDetected: boolean;
}

const UserRegionContext = createContext<UserRegionContextType | null>(null);

// Detect user's region from various sources
async function detectUserRegion(): Promise<ShippingRegionCode> {
  // 1. Check localStorage for user preference
  const saved = localStorage.getItem('userShippingRegion');
  if (saved) return saved as ShippingRegionCode;
  
  // 2. Try to detect from IP (using a free geo API)
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const country = data.country_code;
    
    // Map country to shipping region
    if (country === 'BG') return 'BG';
    if (country === 'US') return 'US';
    if (country === 'GB') return 'UK';
    
    // Check if EU country
    const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
    if (euCountries.includes(country)) return 'EU';
    
    // Default to worldwide for other countries
    return 'WORLDWIDE';
  } catch {
    // Default to BG if detection fails (primary market)
    return 'BG';
  }
}

export function UserRegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<ShippingRegionCode>('BG');
  const [isDetected, setIsDetected] = useState(false);
  
  useEffect(() => {
    detectUserRegion().then((detected) => {
      setRegionState(detected);
      setIsDetected(true);
    });
  }, []);
  
  const setRegion = (newRegion: ShippingRegionCode) => {
    setRegionState(newRegion);
    localStorage.setItem('userShippingRegion', newRegion);
  };
  
  return (
    <UserRegionContext.Provider value={{ region, setRegion, isDetected }}>
      {children}
    </UserRegionContext.Provider>
  );
}

export function useUserRegion() {
  const context = useContext(UserRegionContext);
  if (!context) {
    throw new Error('useUserRegion must be used within UserRegionProvider');
  }
  return context;
}
```

### Create file: `components/shipping-region-selector.tsx`

```tsx
'use client';

import { useUserRegion } from '@/lib/hooks/useUserRegion';
import { SHIPPING_REGIONS, ShippingRegionCode } from '@/lib/types/shipping';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';

export function ShippingRegionSelector() {
  const { region, setRegion } = useUserRegion();
  const locale = useLocale();
  
  return (
    <Select value={region} onValueChange={(v) => setRegion(v as ShippingRegionCode)}>
      <SelectTrigger className="w-[180px]">
        <MapPin className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select region" />
      </SelectTrigger>
      <SelectContent>
        {SHIPPING_REGIONS.map((r) => (
          <SelectItem key={r.code} value={r.code}>
            {locale === 'bg' ? r.labelBg : r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Update file: `components/product-form.tsx` (add shipping selection)

```tsx
// Add to your product form
import { SHIPPING_REGIONS } from '@/lib/types/shipping';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

// In your form state:
const [shipsTo, setShipsTo] = useState<string[]>(['BG']);
const [shippingCosts, setShippingCosts] = useState<Record<string, string>>({});

// In your form JSX:
<div className="space-y-4">
  <Label>Ships to:</Label>
  <div className="grid grid-cols-2 gap-2">
    {SHIPPING_REGIONS.map((region) => (
      <div key={region.code} className="flex items-center space-x-2">
        <Checkbox
          id={`ship-${region.code}`}
          checked={shipsTo.includes(region.code)}
          onCheckedChange={(checked) => {
            if (checked) {
              setShipsTo([...shipsTo, region.code]);
            } else {
              setShipsTo(shipsTo.filter(r => r !== region.code));
            }
          }}
        />
        <Label htmlFor={`ship-${region.code}`}>{region.label}</Label>
        
        {shipsTo.includes(region.code) && region.code !== 'WORLDWIDE' && (
          <Input
            type="number"
            placeholder="Shipping cost"
            className="w-24"
            value={shippingCosts[region.code] || ''}
            onChange={(e) => setShippingCosts({
              ...shippingCosts,
              [region.code]: e.target.value
            })}
          />
        )}
      </div>
    ))}
  </div>
</div>

// When submitting:
const productData = {
  // ...other fields
  ships_to: shipsTo,
  shipping_costs: Object.fromEntries(
    Object.entries(shippingCosts).map(([k, v]) => [k, parseFloat(v) || 0])
  ),
  seller_country: 'BG', // From user profile
};
```

---

## 📋 Phase 5: Execution Checklist

### Pre-Flight Checks

- [ ] Backup current database
- [ ] Review all migration files
- [ ] Test migrations on local/staging first

### Execute Migrations

```bash
# 1. Push migrations to Supabase
supabase db push

# Or run individual migrations:
supabase migration up 20251203000001_extend_categories
supabase migration up 20251203000002_product_attributes
supabase migration up 20251203000003_shipping_regions
supabase migration up 20251203000004_vehicle_makes_models
supabase migration up 20251203000010_seed_automotive
supabase migration up 20251203000011_seed_vehicle_makes
```

### Post-Migration Verification

```sql
-- Verify categories have translations
SELECT slug, name_translations, full_path, level 
FROM categories 
WHERE full_path LIKE 'automotive%'
ORDER BY level, display_order;

-- Verify vehicle makes
SELECT id, name, name_translations, is_popular 
FROM vehicle_makes 
WHERE is_active = true
ORDER BY display_order;

-- Verify products have attributes and shipping columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('attributes', 'ships_to', 'shipping_costs', 'seller_country');

-- Verify shipping regions are seeded
SELECT * FROM shipping_regions ORDER BY display_order;

-- Test shipping query
SELECT * FROM search_products_with_shipping(
  NULL,      -- all categories
  'US',      -- ships to US
  '{}'::jsonb,
  NULL, NULL,
  'newest',
  10, 0
);
```

### Frontend Integration

- [ ] Update category selectors to use `name_translations`
- [ ] Add locale parameter to API calls
- [ ] Add `UserRegionProvider` to layout
- [ ] Add `ShippingRegionSelector` to header
- [ ] Update product search to include `ship_to` parameter
- [ ] Update product form with shipping region checkboxes
- [ ] Update product forms to save `attributes` JSONB
- [ ] Build filter components for attribute-based search

---

## 🚨 Known Issues & Decisions

### Issue 1: Legacy `name` Column
**Decision:** Keep `name` column for backward compatibility. New code should use `name_translations`.

### Issue 2: Slug Uniqueness
**Decision:** Slugs must be globally unique, not just within parent. This simplifies URLs.

### Issue 3: Product Count Updates
**Decision:** `product_count` will be updated via a scheduled function or trigger (not implemented yet).

### Issue 4: SEO Fields Localization
**Decision:** Use JSONB for SEO fields to support multi-language SEO.

---

## 📊 Estimated Timeline

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| Phase 1: Schema Migrations | 2-4 hours | None |
| Phase 2: Seed Data | 1-2 hours | Phase 1 |
| Phase 3: TypeScript Types | 1 hour | None (parallel) |
| Phase 4: API Endpoints | 2-4 hours | Phase 1, 2 |
| Phase 5: Frontend Components | 4-8 hours | Phase 3, 4 |

**Total: 10-19 hours** for basic implementation

---

## 🔮 Future Enhancements

1. **Attribute Validation** - Schema validation for category-specific attributes
2. **Search Indexes** - Full-text search on attributes
3. **Category Images** - S3/Supabase Storage integration
4. **Product Count Triggers** - Auto-update `product_count` on insert/delete
5. **Attribute Templates** - Pre-defined attribute sets per category
6. **Multi-Currency** - Price in multiple currencies in attributes

---

**Document Status:** Ready for Implementation  
**Last Updated:** December 3, 2025
