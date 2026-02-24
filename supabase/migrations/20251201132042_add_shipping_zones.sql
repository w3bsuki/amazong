-- Shipping zones lookup table
CREATE TABLE IF NOT EXISTS shipping_zones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  name_bg text,
  region text CHECK (region IN ('bulgaria', 'europe', 'worldwide')),
  countries text[] DEFAULT '{}', -- ISO country codes in this zone
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Shipping zones are viewable by everyone"
  ON shipping_zones FOR SELECT
  USING (is_active = true);

-- Insert default shipping zones
INSERT INTO shipping_zones (code, name, name_bg, region, countries, sort_order) VALUES
  ('BG', 'Bulgaria Only', 'Само България', 'bulgaria', ARRAY['BG'], 1),
  ('EU', 'Europe', 'Европа', 'europe', ARRAY['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH', 'NO'], 2),
  ('WW', 'Worldwide', 'Целият свят', 'worldwide', ARRAY[]::text[], 3)
ON CONFLICT (code) DO NOTHING;

-- Add shipping_zone to products table (default to Bulgaria)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS shipping_zone text DEFAULT 'BG' 
  REFERENCES shipping_zones(code);

-- Add index for filtering
CREATE INDEX IF NOT EXISTS idx_products_shipping_zone ON products(shipping_zone);

-- Comment for documentation
COMMENT ON TABLE shipping_zones IS 'Shipping zone definitions for product delivery regions';
COMMENT ON COLUMN products.shipping_zone IS 'Shipping zone code - BG (Bulgaria), EU (Europe), WW (Worldwide)';;
