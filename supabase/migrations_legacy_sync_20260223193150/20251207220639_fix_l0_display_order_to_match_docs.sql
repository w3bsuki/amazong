
-- Fix L0 category display_order to match SUPABASE_CATEGORIES_FULL.md
-- The document says: Electronics=2, Home=3, Beauty=4, Fashion=5, Sports=6, Kids=7, Gaming=8, Automotive=9, Pets=10, Real Estate=11, Software=12, Collectibles=13, Wholesale=14, Hobbies=15, Jewelry=16, Grocery=17, Tools=18, E-Mobility=19, Services=20, Bulgarian=21

-- First, clean up duplicate tools categories
DELETE FROM categories WHERE slug = 'tools-industrial' AND parent_id IS NULL;

-- Update display_order for L0 categories to match documentation
UPDATE categories SET display_order = 1, icon = '👗', name_bg = 'Мода' WHERE slug = 'fashion' AND parent_id IS NULL;
UPDATE categories SET display_order = 2, icon = '📱', name_bg = 'Електроника' WHERE slug = 'electronics' AND parent_id IS NULL;
UPDATE categories SET display_order = 3, icon = '🏠', name_bg = 'Дом и кухня' WHERE slug = 'home' AND parent_id IS NULL;
UPDATE categories SET display_order = 4, icon = '💄', name_bg = 'Красота' WHERE slug = 'beauty' AND parent_id IS NULL;
UPDATE categories SET display_order = 5, icon = '💊', name_bg = 'Здраве' WHERE slug = 'health-wellness' AND parent_id IS NULL;
UPDATE categories SET display_order = 6, icon = '⚽', name_bg = 'Спорт' WHERE slug = 'sports' AND parent_id IS NULL;
UPDATE categories SET display_order = 7, icon = '👶', name_bg = 'Деца' WHERE slug = 'baby-kids' AND parent_id IS NULL;
UPDATE categories SET display_order = 8, icon = '🎮', name_bg = 'Гейминг' WHERE slug = 'gaming' AND parent_id IS NULL;
UPDATE categories SET display_order = 9, icon = '🚗', name_bg = 'Автомобили' WHERE slug = 'automotive' AND parent_id IS NULL;
UPDATE categories SET display_order = 10, icon = '🐕', name_bg = 'Зоо' WHERE slug = 'pets' AND parent_id IS NULL;
UPDATE categories SET display_order = 11, icon = '🏡', name_bg = 'Имоти' WHERE slug = 'real-estate' AND parent_id IS NULL;
UPDATE categories SET display_order = 12, icon = '💿', name_bg = 'Софтуер' WHERE slug = 'software' AND parent_id IS NULL;
UPDATE categories SET display_order = 13, icon = '🎨', name_bg = 'Колекционерски' WHERE slug = 'collectibles' AND parent_id IS NULL;
UPDATE categories SET display_order = 14, icon = '📦', name_bg = 'На едро' WHERE slug = 'wholesale' AND parent_id IS NULL;
UPDATE categories SET display_order = 15, icon = '🎯', name_bg = 'Хобита' WHERE slug = 'hobbies' AND parent_id IS NULL;
UPDATE categories SET display_order = 16, icon = '💎', name_bg = 'Бижута и часовници' WHERE slug = 'jewelry-watches' AND parent_id IS NULL;
UPDATE categories SET display_order = 17, icon = '🛒', name_bg = 'Храна' WHERE slug = 'grocery' AND parent_id IS NULL;
UPDATE categories SET display_order = 18, icon = '🔧', name_bg = 'Инструменти' WHERE slug = 'tools-home' AND parent_id IS NULL;
UPDATE categories SET display_order = 19, icon = '⚡', name_bg = 'Електромобилност' WHERE slug = 'e-mobility' AND parent_id IS NULL;
UPDATE categories SET display_order = 20, icon = '🛠️', name_bg = 'Услуги и събития' WHERE slug = 'services' AND parent_id IS NULL;
UPDATE categories SET display_order = 21, icon = '🇧🇬', name_bg = 'Българско' WHERE slug = 'bulgarian-traditional' AND parent_id IS NULL;
UPDATE categories SET display_order = 22, icon = '📚', name_bg = 'Книги' WHERE slug = 'books' AND parent_id IS NULL;
UPDATE categories SET display_order = 23, icon = '🎬', name_bg = 'Филми и музика' WHERE slug = 'movies-music' AND parent_id IS NULL;
UPDATE categories SET display_order = 24, icon = '💼', name_bg = 'Работа' WHERE slug = 'jobs' AND parent_id IS NULL;
;
