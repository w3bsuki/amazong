
-- Phase 1: Cleanup duplicate categories in Sports

-- 1. Mark duplicate Electric Bikes (keep bike-electric, deprecate e-bikes)
UPDATE categories 
SET name = '[DUPLICATE] E-Bikes', name_bg = '[ДУБЛИКАТ] Електрически велосипеди'
WHERE id = 'bc2ead07-9405-428f-8f76-9a89266c6f46';

-- 2. Mark duplicate Yoga & Pilates (keep fit-yoga, deprecate yoga-pilates)
UPDATE categories 
SET name = '[DUPLICATE] Yoga & Pilates', name_bg = '[ДУБЛИКАТ] Йога и пилатес'
WHERE id = '72020741-6371-45df-8b0f-86836e007db0';

-- 3. Mark duplicate Bike Parts (keep bike-components, deprecate bike-parts)
UPDATE categories 
SET name = '[DUPLICATE] Bike Parts', name_bg = '[ДУБЛИКАТ] Части за велосипеди'
WHERE id = '861a7c77-3bd0-459c-b13d-a3ca83090e2c';

-- 4. Fix inconsistent slug for Bike Accessories (align with others)
UPDATE categories 
SET slug = 'cycling-accessories'
WHERE id = 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4';

-- 5. Fix inconsistent slug for Bike Clothing
UPDATE categories 
SET slug = 'cycling-clothing'
WHERE id = 'c0976ffb-341d-4dca-9b62-5a89647e6c50';

-- 6. Fix inconsistent slug for Bike Components
UPDATE categories 
SET slug = 'cycling-components'
WHERE id = '5a3e308c-122e-43fd-b6e5-fd68a86b648c';
;
