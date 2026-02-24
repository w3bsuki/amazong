-- Add seller_city column to products table for item location
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_city TEXT;

-- Add default_city to profiles table for seller's default location
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_city TEXT;

-- Create index for city-based filtering and queries
CREATE INDEX IF NOT EXISTS idx_products_seller_city 
ON public.products(seller_city) 
WHERE seller_city IS NOT NULL;

-- Create index for profiles default_city
CREATE INDEX IF NOT EXISTS idx_profiles_default_city 
ON public.profiles(default_city) 
WHERE default_city IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.products.seller_city IS 'City where the item is located/ships from (e.g., Sofia, Varna, Plovdiv)';
COMMENT ON COLUMN public.profiles.default_city IS 'Seller default city for new listings, auto-filled in sell form';;
