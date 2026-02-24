-- Add location preference columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS shipping_region TEXT DEFAULT NULL 
  CHECK (shipping_region IN ('BG', 'UK', 'EU', 'US', 'WW')),
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS region_auto_detected BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS region_updated_at TIMESTAMPTZ DEFAULT NULL;

-- Index for potential region-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_shipping_region 
ON public.profiles(shipping_region) WHERE shipping_region IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN public.profiles.shipping_region IS 'User preferred shipping region: BG, UK, EU, US, WW';
COMMENT ON COLUMN public.profiles.country_code IS 'ISO country code detected or selected by user';
COMMENT ON COLUMN public.profiles.region_auto_detected IS 'True if region was auto-detected, false if manually selected';;
