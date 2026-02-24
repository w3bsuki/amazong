
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 2A: L1 CATEGORIES
-- Adding comprehensive L1 categories following Zillow/Realtor.com/imot.bg patterns
-- ============================================================================

-- First, get the Real Estate root ID
DO $$
DECLARE
    v_real_estate_id UUID := 'ae77bc52-4b8f-4126-b2af-0cf760248996';
BEGIN
    -- Note: We already have these L1 categories:
    -- Residential Sales (2b174600-a166-48dd-9404-d824555f3612)
    -- Residential Rentals (87565762-319d-4cfa-85cd-cabb157f75ef)
    -- Commercial (aced61f5-67c0-4cd0-8c91-c10b653bc1b9)
    -- Land (9df696ac-5885-4a79-af93-41fb1b977c4b)
    -- Vacation Rentals (0e8c1882-8d46-4e23-8add-97e450fd702b)
    
    -- We need to add the missing L1 categories
    NULL;
END $$;

-- Add missing L1 categories
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, icon, display_order)
SELECT * FROM (VALUES
    -- New Construction & Developments
    (gen_random_uuid(), 'New Construction', 'Ново строителство', 'new-construction', 
     'ae77bc52-4b8f-4126-b2af-0cf760248996'::uuid,
     'Newly built properties and off-plan developments', 
     'Новопостроени имоти и проекти в строеж',
     'construction', 6),
    
    -- Luxury & Premium Properties
    (gen_random_uuid(), 'Luxury Properties', 'Луксозни имоти', 'luxury-properties',
     'ae77bc52-4b8f-4126-b2af-0cf760248996'::uuid,
     'Premium, high-end real estate', 
     'Премиум имоти от висок клас',
     'crown', 7),
    
    -- Investment Properties
    (gen_random_uuid(), 'Investment Properties', 'Инвестиционни имоти', 'investment-properties',
     'ae77bc52-4b8f-4126-b2af-0cf760248996'::uuid,
     'Income-generating and investment opportunities', 
     'Имоти за инвестиции и доходоносни обекти',
     'trending-up', 8),
    
    -- Parking & Storage
    (gen_random_uuid(), 'Parking & Storage', 'Паркоместа и складове', 'parking-storage',
     'ae77bc52-4b8f-4126-b2af-0cf760248996'::uuid,
     'Garages, parking spaces, and storage units', 
     'Гаражи, паркоместа и складови помещения',
     'car', 9),
    
    -- Commercial Rentals (separate from Commercial Sales)
    (gen_random_uuid(), 'Commercial Rentals', 'Търговски под наем', 'commercial-rentals',
     'ae77bc52-4b8f-4126-b2af-0cf760248996'::uuid,
     'Commercial properties for rent', 
     'Търговски имоти под наем',
     'building', 10),
    
    -- Rural & Agricultural
    (gen_random_uuid(), 'Rural & Agricultural', 'Селски и земеделски', 'rural-agricultural',
     'ae77bc52-4b8f-4126-b2af-0cf760248996'::uuid,
     'Farms, agricultural land, rural properties', 
     'Ферми, земеделска земя, селски имоти',
     'wheat', 11),
    
    -- Foreclosures & Auctions
    (gen_random_uuid(), 'Foreclosures & Auctions', 'Публични продажби', 'foreclosures-auctions',
     'ae77bc52-4b8f-4126-b2af-0cf760248996'::uuid,
     'Bank-owned, foreclosed, and auction properties', 
     'Банкови имоти, възбрани и търгове',
     'gavel', 12)
) AS new_cats(id, name, name_bg, slug, parent_id, description, description_bg, icon, display_order)
WHERE NOT EXISTS (
    SELECT 1 FROM categories c WHERE c.slug = new_cats.slug
);

-- Update display_order for existing L1 categories
UPDATE categories SET display_order = 1 WHERE slug = 'residential-sales';
UPDATE categories SET display_order = 2 WHERE slug = 'residential-rentals';
UPDATE categories SET display_order = 3 WHERE slug = 'commercial';
UPDATE categories SET display_order = 4 WHERE slug = 'land';
UPDATE categories SET display_order = 5 WHERE slug = 'vacation-rentals';
;
