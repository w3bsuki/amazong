
-- ============================================
-- FIX SUBHEADER NAMES AND ORDER
-- Short, clean names that fit the navbar
-- ============================================

-- Fix category names to be shorter/cleaner
UPDATE categories SET name = 'Home & Kitchen', name_bg = 'Дом и кухня' WHERE slug = 'home' AND parent_id IS NULL;
UPDATE categories SET name = 'Beauty', name_bg = 'Красота' WHERE slug = 'beauty' AND parent_id IS NULL;
UPDATE categories SET name = 'Health', name_bg = 'Здраве' WHERE slug = 'health-wellness' AND parent_id IS NULL;
UPDATE categories SET name = 'Sports', name_bg = 'Спорт' WHERE slug = 'sports' AND parent_id IS NULL;
UPDATE categories SET name = 'Kids', name_bg = 'Деца' WHERE slug = 'baby-kids' AND parent_id IS NULL;
UPDATE categories SET name = 'Pets', name_bg = 'Зоо' WHERE slug = 'pets' AND parent_id IS NULL;
UPDATE categories SET name = 'Real Estate', name_bg = 'Имоти' WHERE slug = 'real-estate' AND parent_id IS NULL;
UPDATE categories SET name = 'Software', name_bg = 'Софтуер' WHERE slug = 'software' AND parent_id IS NULL;

-- Reorder for subheader (first 10 = visible as requested)
UPDATE categories SET display_order = 1 WHERE slug = 'fashion' AND parent_id IS NULL;        -- Мода
UPDATE categories SET display_order = 2 WHERE slug = 'electronics' AND parent_id IS NULL;    -- Електроника
UPDATE categories SET display_order = 3 WHERE slug = 'home' AND parent_id IS NULL;           -- Дом и кухня
UPDATE categories SET display_order = 4 WHERE slug = 'beauty' AND parent_id IS NULL;         -- Красота
UPDATE categories SET display_order = 5 WHERE slug = 'health-wellness' AND parent_id IS NULL;-- Здраве
UPDATE categories SET display_order = 6 WHERE slug = 'sports' AND parent_id IS NULL;         -- Спорт
UPDATE categories SET display_order = 7 WHERE slug = 'baby-kids' AND parent_id IS NULL;      -- Деца
UPDATE categories SET display_order = 8 WHERE slug = 'pets' AND parent_id IS NULL;           -- Зоо
UPDATE categories SET display_order = 9 WHERE slug = 'real-estate' AND parent_id IS NULL;    -- Имоти
UPDATE categories SET display_order = 10 WHERE slug = 'software' AND parent_id IS NULL;      -- Софтуер

-- Rest go to "More" section
UPDATE categories SET display_order = 11 WHERE slug = 'automotive' AND parent_id IS NULL;
UPDATE categories SET display_order = 12 WHERE slug = 'gaming' AND parent_id IS NULL;
UPDATE categories SET display_order = 13 WHERE slug = 'grocery' AND parent_id IS NULL;
UPDATE categories SET display_order = 14 WHERE slug = 'jewelry-watches' AND parent_id IS NULL;
UPDATE categories SET display_order = 15 WHERE slug = 'tools-home' AND parent_id IS NULL;
UPDATE categories SET display_order = 16 WHERE slug = 'hobbies' AND parent_id IS NULL;
UPDATE categories SET display_order = 17 WHERE slug = 'collectibles' AND parent_id IS NULL;
UPDATE categories SET display_order = 18 WHERE slug = 'e-mobility' AND parent_id IS NULL;
UPDATE categories SET display_order = 19 WHERE slug = 'services' AND parent_id IS NULL;
UPDATE categories SET display_order = 20 WHERE slug = 'wholesale' AND parent_id IS NULL;
UPDATE categories SET display_order = 21 WHERE slug = 'bulgarian-traditional' AND parent_id IS NULL;
UPDATE categories SET display_order = 22 WHERE slug = 'cbd-wellness' AND parent_id IS NULL;
;
