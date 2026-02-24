
-- ============================================
-- PHASE 19: SMARTPHONE BRAND CATEGORIES → ATTRIBUTES
-- Brand filtering should be via Brand attribute, not categories
-- ============================================

-- Add Brand attribute to Smartphones category
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
VALUES (
  'ca000000-0000-0000-0000-000000000010',
  'd20450a8-53ce-4d20-9919-439a39e73cda', -- Smartphones category
  'Brand',
  'Марка',
  'select',
  true,
  '["Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "Huawei", "Oppo", "Vivo", "Realme", "Motorola", "Sony", "Nokia", "Other"]',
  '["Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "Huawei", "Oppo", "Vivo", "Realme", "Motorola", "Sony", "Nokia", "Друга"]',
  1
) ON CONFLICT DO NOTHING;

-- Add Operating System attribute
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
VALUES (
  'ca000000-0000-0000-0000-000000000011',
  'd20450a8-53ce-4d20-9919-439a39e73cda', -- Smartphones category
  'Operating System',
  'Операционна система',
  'select',
  true,
  '["iOS", "Android", "HarmonyOS"]',
  '["iOS", "Android", "HarmonyOS"]',
  2
) ON CONFLICT DO NOTHING;

-- Add Storage attribute (if not exists)
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
VALUES (
  'ca000000-0000-0000-0000-000000000012',
  'd20450a8-53ce-4d20-9919-439a39e73cda', -- Smartphones category
  'Storage',
  'Памет',
  'select',
  true,
  '["64GB", "128GB", "256GB", "512GB", "1TB"]',
  '["64GB", "128GB", "256GB", "512GB", "1TB"]',
  3
) ON CONFLICT DO NOTHING;

-- Add RAM attribute
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
VALUES (
  'ca000000-0000-0000-0000-000000000013',
  'd20450a8-53ce-4d20-9919-439a39e73cda', -- Smartphones category
  'RAM',
  'RAM памет',
  'select',
  true,
  '["4GB", "6GB", "8GB", "12GB", "16GB", "18GB"]',
  '["4GB", "6GB", "8GB", "12GB", "16GB", "18GB"]',
  4
) ON CONFLICT DO NOTHING;

-- Deprecate brand subcategories (users should filter by brand attribute)
UPDATE categories 
SET name = '[BRAND] iPhone',
    name_bg = '[МАРКА] iPhone',
    display_order = 9020
WHERE slug = 'smartphones-iphone';

UPDATE categories 
SET name = '[BRAND] Samsung',
    name_bg = '[МАРКА] Samsung Galaxy',
    display_order = 9021
WHERE slug = 'smartphones-samsung';

UPDATE categories 
SET name = '[BRAND] Xiaomi',
    name_bg = '[МАРКА] Xiaomi',
    display_order = 9022
WHERE slug = 'smartphones-xiaomi';

UPDATE categories 
SET name = '[BRAND] Google Pixel',
    name_bg = '[МАРКА] Google Pixel',
    display_order = 9023
WHERE slug = 'smartphones-pixel';

UPDATE categories 
SET name = '[BRAND] OnePlus',
    name_bg = '[МАРКА] OnePlus',
    display_order = 9024
WHERE slug = 'smartphones-oneplus';

UPDATE categories 
SET name = '[BRAND] Huawei',
    name_bg = '[МАРКА] Huawei',
    display_order = 9025
WHERE slug = 'smartphones-huawei';

UPDATE categories 
SET name = '[BRAND] Other',
    name_bg = '[МАРКА] Други марки',
    display_order = 9026
WHERE slug = 'smartphones-other';

-- ============================================
-- PHASE 20: TABLET BRAND CATEGORIES → ATTRIBUTES
-- ============================================

-- Add Brand attribute to Tablets category
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
VALUES (
  'ca000000-0000-0000-0000-000000000020',
  '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', -- Tablets category
  'Brand',
  'Марка',
  'select',
  true,
  '["Apple", "Samsung", "Lenovo", "Huawei", "Xiaomi", "Microsoft", "Amazon", "Other"]',
  '["Apple", "Samsung", "Lenovo", "Huawei", "Xiaomi", "Microsoft", "Amazon", "Друга"]',
  1
) ON CONFLICT DO NOTHING;

-- Deprecate tablet brand subcategories
UPDATE categories 
SET name = '[BRAND] iPad',
    name_bg = '[МАРКА] iPad',
    display_order = 9030
WHERE slug = 'tablets-ipad';

UPDATE categories 
SET name = '[BRAND] Samsung Tablets',
    name_bg = '[МАРКА] Samsung таблети',
    display_order = 9031
WHERE slug = 'tablets-samsung';

UPDATE categories 
SET name = '[BRAND] Android Tablets',
    name_bg = '[МАРКА] Android таблети',
    display_order = 9032
WHERE slug = 'tablets-android';

-- Keep these as actual categories (they're product types, not brands):
-- tablets-kids (Kids Tablets)
-- tablets-ereaders (E-Readers)
;
