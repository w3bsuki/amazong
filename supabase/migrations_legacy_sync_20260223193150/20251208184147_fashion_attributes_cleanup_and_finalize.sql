
-- ============================================
-- FASHION ATTRIBUTES FINALIZATION
-- ============================================
-- Philosophy: Minimal friction, maximum utility
-- L0: Universal attributes (Condition, Color, Brand)
-- L2: Category-specific attributes (Size for clothing, Shoe Size for shoes, etc.)

-- STEP 1: Remove redundant/unnecessary attributes from L0 Fashion
DELETE FROM category_attributes 
WHERE category_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0'
AND name IN ('Gender', 'Clothing Size', 'Shoe Size EU', 'Material', 'Style', 'Pattern', 'Season', 'Occasion', 'Closure Type');

-- STEP 2: Update remaining L0 attributes to proper order
UPDATE category_attributes 
SET sort_order = 1, is_required = true 
WHERE id = 'b64520f0-e039-427a-b753-2f3cfe3b41c6'; -- Condition

UPDATE category_attributes 
SET sort_order = 2, is_required = false 
WHERE id = 'b32eaf90-e69a-4129-bd4b-57344284c8ae'; -- Color

UPDATE category_attributes 
SET sort_order = 3, is_required = false 
WHERE id = '522b8cd2-483e-45c2-a2e6-de8f3938fc73'; -- Brand

-- STEP 3: Remove existing clothing attributes that need to be recreated properly
DELETE FROM category_attributes 
WHERE category_id = 'b1000000-0000-0000-0001-000000000001'
AND name IN ('Clothing Size', 'Fit', 'Length');

-- STEP 4: Add SIZE attribute to ALL Clothing L2 categories
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES 
-- Men's Clothing
('b1000000-0000-0000-0001-000000000001', 'Size', 'Размер', 'select', true, true, 
 '["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "One Size"]'::jsonb,
 '["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "Универсален"]'::jsonb, 1),

-- Women's Clothing
('b1000000-0000-0000-0002-000000000001', 'Size', 'Размер', 'select', true, true, 
 '["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "One Size"]'::jsonb,
 '["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "Универсален"]'::jsonb, 1),

-- Kids Clothing (age-based)
('b1000000-0000-0000-0003-000000000001', 'Size', 'Размер', 'select', true, true, 
 '["0-3 months", "3-6 months", "6-12 months", "1-2 years", "2-3 years", "3-4 years", "4-5 years", "5-6 years", "6-7 years", "7-8 years", "8-9 years", "9-10 years", "10-11 years", "11-12 years", "12-13 years", "13-14 years"]'::jsonb,
 '["0-3 месеца", "3-6 месеца", "6-12 месеца", "1-2 години", "2-3 години", "3-4 години", "4-5 години", "5-6 години", "6-7 години", "7-8 години", "8-9 години", "9-10 години", "10-11 години", "11-12 години", "12-13 години", "13-14 години"]'::jsonb, 1),

-- Unisex Clothing
('b1000000-0000-0000-0004-000000000001', 'Size', 'Размер', 'select', true, true, 
 '["XS", "S", "M", "L", "XL", "XXL", "3XL", "One Size"]'::jsonb,
 '["XS", "S", "M", "L", "XL", "XXL", "3XL", "Универсален"]'::jsonb, 1);

-- STEP 5: Add SHOE SIZE to ALL Shoes L2 categories
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES 
-- Men's Shoes (EU 39-48)
('b1000000-0000-0000-0001-000000000002', 'Shoe Size EU', 'Размер обувки EU', 'select', true, true, 
 '["39", "40", "41", "42", "43", "44", "45", "46", "47", "48"]'::jsonb,
 '["39", "40", "41", "42", "43", "44", "45", "46", "47", "48"]'::jsonb, 1),

-- Women's Shoes (EU 35-42)
('b1000000-0000-0000-0002-000000000002', 'Shoe Size EU', 'Размер обувки EU', 'select', true, true, 
 '["35", "36", "37", "38", "39", "40", "41", "42"]'::jsonb,
 '["35", "36", "37", "38", "39", "40", "41", "42"]'::jsonb, 1),

-- Kids Shoes (EU 20-38)
('b1000000-0000-0000-0003-000000000002', 'Shoe Size EU', 'Размер обувки EU', 'select', true, true, 
 '["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38"]'::jsonb,
 '["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38"]'::jsonb, 1),

-- Unisex Shoes (EU 35-48)
('b1000000-0000-0000-0004-000000000002', 'Shoe Size EU', 'Размер обувки EU', 'select', true, true, 
 '["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"]'::jsonb,
 '["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"]'::jsonb, 1);

-- STEP 6: Add METAL TYPE to Jewelry categories
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES 
('b1000000-0000-0000-0001-000000000004', 'Metal Type', 'Вид метал', 'select', false, true, 
 '["Gold", "Silver", "Rose Gold", "Platinum", "Stainless Steel", "Brass", "Titanium", "Other"]'::jsonb,
 '["Злато", "Сребро", "Розово злато", "Платина", "Неръждаема стомана", "Месинг", "Титан", "Друго"]'::jsonb, 1),

('b1000000-0000-0000-0002-000000000004', 'Metal Type', 'Вид метал', 'select', false, true, 
 '["Gold", "Silver", "Rose Gold", "Platinum", "Stainless Steel", "Brass", "Titanium", "Other"]'::jsonb,
 '["Злато", "Сребро", "Розово злато", "Платина", "Неръждаема стомана", "Месинг", "Титан", "Друго"]'::jsonb, 1);

-- STEP 7: Add WATCH TYPE to Watch categories
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES 
('cbd93c6a-bba6-4cf4-b052-47e022044de1', 'Movement Type', 'Тип механизъм', 'select', false, true, 
 '["Quartz", "Automatic", "Mechanical", "Solar", "Smart"]'::jsonb,
 '["Кварцов", "Автоматичен", "Механичен", "Соларен", "Смарт"]'::jsonb, 1),

('bfbd52f0-b5c4-405a-a1d1-fd8e62cd67d2', 'Movement Type', 'Тип механизъм', 'select', false, true, 
 '["Quartz", "Automatic", "Mechanical", "Solar", "Smart"]'::jsonb,
 '["Кварцов", "Автоматичен", "Механичен", "Соларен", "Смарт"]'::jsonb, 1),

('a568041c-06ee-4a73-b626-d4dc367f1eec', 'Movement Type', 'Тип механизъм', 'select', false, true, 
 '["Quartz", "Digital", "Smart"]'::jsonb,
 '["Кварцов", "Дигитален", "Смарт"]'::jsonb, 1),

('c2859b36-540a-407e-b34b-81c54f2ffde4', 'Movement Type', 'Тип механизъм', 'select', false, true, 
 '["Quartz", "Automatic", "Mechanical", "Solar", "Smart"]'::jsonb,
 '["Кварцов", "Автоматичен", "Механичен", "Соларен", "Смарт"]'::jsonb, 1);

-- STEP 8: Clean up duplicate/outdated womens-dresses attributes (keep only essentials)
DELETE FROM category_attributes 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'womens-dresses')
AND name NOT IN ('Size', 'Length');

-- Update womens-dresses to have clean attributes
UPDATE category_attributes 
SET is_required = true, sort_order = 1
WHERE category_id = (SELECT id FROM categories WHERE slug = 'womens-dresses')
AND name = 'Size';

-- Add Length if not exists for dresses
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
    (SELECT id FROM categories WHERE slug = 'womens-dresses'),
    'Length', 'Дължина', 'select', false, true,
    '["Mini", "Midi", "Maxi", "Knee-length"]'::jsonb,
    '["Мини", "Миди", "Макси", "До коляното"]'::jsonb, 2
WHERE NOT EXISTS (
    SELECT 1 FROM category_attributes 
    WHERE category_id = (SELECT id FROM categories WHERE slug = 'womens-dresses')
    AND name = 'Length'
);
;
