
-- Add L3 categories for Electronics > Phones & Tablets
-- Get parent IDs first
-- smartphones parent: need to find it

-- L3 for Smartphones
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'iPhone', 'iPhone', 'smartphones-iphone', id, 1 FROM categories WHERE slug = 'smartphones'
UNION ALL
SELECT 'Samsung Galaxy', 'Samsung Galaxy', 'smartphones-samsung', id, 2 FROM categories WHERE slug = 'smartphones'
UNION ALL
SELECT 'Google Pixel', 'Google Pixel', 'smartphones-pixel', id, 3 FROM categories WHERE slug = 'smartphones'
UNION ALL
SELECT 'Xiaomi', 'Xiaomi', 'smartphones-xiaomi', id, 4 FROM categories WHERE slug = 'smartphones'
UNION ALL
SELECT 'OnePlus', 'OnePlus', 'smartphones-oneplus', id, 5 FROM categories WHERE slug = 'smartphones'
UNION ALL
SELECT 'Huawei', 'Huawei', 'smartphones-huawei', id, 6 FROM categories WHERE slug = 'smartphones'
UNION ALL
SELECT 'Other Brands', 'Други марки', 'smartphones-other', id, 7 FROM categories WHERE slug = 'smartphones';

-- L3 for Tablets  
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'iPad', 'iPad', 'tablets-ipad', id, 1 FROM categories WHERE slug = 'tablets'
UNION ALL
SELECT 'Samsung Tablets', 'Samsung таблети', 'tablets-samsung', id, 2 FROM categories WHERE slug = 'tablets'
UNION ALL
SELECT 'Android Tablets', 'Android таблети', 'tablets-android', id, 3 FROM categories WHERE slug = 'tablets'
UNION ALL
SELECT 'Kids Tablets', 'Детски таблети', 'tablets-kids', id, 4 FROM categories WHERE slug = 'tablets'
UNION ALL
SELECT 'E-Readers', 'Електронни четци', 'tablets-ereaders', id, 5 FROM categories WHERE slug = 'tablets';

-- L3 for Smartwatches
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Apple Watch', 'Apple Watch', 'smartwatches-apple', id, 1 FROM categories WHERE slug = 'smartwatches'
UNION ALL
SELECT 'Samsung Galaxy Watch', 'Samsung Galaxy Watch', 'smartwatches-samsung', id, 2 FROM categories WHERE slug = 'smartwatches'
UNION ALL
SELECT 'Garmin', 'Garmin', 'smartwatches-garmin', id, 3 FROM categories WHERE slug = 'smartwatches'
UNION ALL
SELECT 'Fitbit', 'Fitbit', 'smartwatches-fitbit', id, 4 FROM categories WHERE slug = 'smartwatches'
UNION ALL
SELECT 'Xiaomi/Amazfit', 'Xiaomi/Amazfit', 'smartwatches-xiaomi', id, 5 FROM categories WHERE slug = 'smartwatches';
;
