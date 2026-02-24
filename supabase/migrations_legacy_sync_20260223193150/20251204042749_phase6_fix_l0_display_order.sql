
-- ============================================
-- PHASE 21: FIX L0 DISPLAY ORDER
-- Clean sequential ordering for all L0 categories
-- ============================================

-- Main shopping categories first
UPDATE categories SET display_order = 1 WHERE slug = 'fashion';           -- Мода
UPDATE categories SET display_order = 2 WHERE slug = 'electronics';       -- Електроника
UPDATE categories SET display_order = 3 WHERE slug = 'home';              -- Дом, градина и кухня
UPDATE categories SET display_order = 4 WHERE slug = 'beauty-health';     -- Красота и здраве
UPDATE categories SET display_order = 5 WHERE slug = 'sports';            -- Спорт и туризъм
UPDATE categories SET display_order = 6 WHERE slug = 'baby-kids';         -- Бебета, деца и играчки
UPDATE categories SET display_order = 7 WHERE slug = 'automotive';        -- Автомобили
UPDATE categories SET display_order = 8 WHERE slug = 'gaming';            -- Гейминг
UPDATE categories SET display_order = 9 WHERE slug = 'pets';              -- Зоо
UPDATE categories SET display_order = 10 WHERE slug = 'grocery';          -- Храна
UPDATE categories SET display_order = 11 WHERE slug = 'jewelry-watches';  -- Бижута и часовници
UPDATE categories SET display_order = 12 WHERE slug = 'hobbies';          -- Хоби и колекции
UPDATE categories SET display_order = 13 WHERE slug = 'tools-home';       -- Инструменти

-- Secondary/specialty categories
UPDATE categories SET display_order = 14 WHERE slug = 'services';         -- Услуги и събития
UPDATE categories SET display_order = 15 WHERE slug = 'real-estate';      -- Имоти
UPDATE categories SET display_order = 16 WHERE slug = 'bulgarian-traditional'; -- Българско

-- CBD at the end (specialty category, may need age verification)
UPDATE categories SET display_order = 17 WHERE slug = 'cbd-wellness';     -- CBD
;
