-- Add seller country (where they ship FROM)
ALTER TABLE public.sellers 
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'BG';

COMMENT ON COLUMN public.sellers.country_code IS 'ISO 3166-1 alpha-2 country code where seller is located/ships from';

-- Change products shipping from single zone to multiple destinations
-- First, drop the foreign key constraint
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_shipping_zone_fkey;

-- Remove old shipping_zone column  
ALTER TABLE public.products DROP COLUMN IF EXISTS shipping_zone;

-- Add shipping destination flags (where seller ships TO)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS ships_to_bulgaria BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ships_to_europe BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ships_to_usa BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ships_to_worldwide BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pickup_only BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.products.ships_to_bulgaria IS 'Ships to Bulgaria';
COMMENT ON COLUMN public.products.ships_to_europe IS 'Ships to European countries';
COMMENT ON COLUMN public.products.ships_to_usa IS 'Ships to United States';
COMMENT ON COLUMN public.products.ships_to_worldwide IS 'Ships worldwide (all countries)';
COMMENT ON COLUMN public.products.pickup_only IS 'Pickup only, no shipping';

-- Create index for filtering by shipping destination
CREATE INDEX IF NOT EXISTS idx_products_ships_to_bulgaria ON public.products(ships_to_bulgaria) WHERE ships_to_bulgaria = true;
CREATE INDEX IF NOT EXISTS idx_products_ships_to_europe ON public.products(ships_to_europe) WHERE ships_to_europe = true;
CREATE INDEX IF NOT EXISTS idx_products_ships_to_usa ON public.products(ships_to_usa) WHERE ships_to_usa = true;
CREATE INDEX IF NOT EXISTS idx_products_ships_to_worldwide ON public.products(ships_to_worldwide) WHERE ships_to_worldwide = true;;
