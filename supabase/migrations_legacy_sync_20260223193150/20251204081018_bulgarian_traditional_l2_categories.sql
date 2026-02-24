
-- =====================================================
-- BULGARIAN TRADITIONAL L2 CATEGORIES MIGRATION
-- =====================================================

-- L1 Parent IDs:
-- traditional-foods: c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48
-- rose-products: 55667eea-a74b-4e3c-b68f-bb1b9f178998
-- traditional-crafts: 976a10a1-23e3-443a-9a10-d59a547db04c
-- folk-costumes: 1514ccad-a7f2-4cf5-95c3-1068d13955c1
-- bulgarian-wine: 3cdcb922-4c90-46ed-8a51-1be2c4f12d8e
-- souvenirs: d245c796-4c20-444c-b5c5-f6389adbe891

-- =====================================================
-- 1. TRADITIONAL FOODS L2 (6 categories)
-- =====================================================
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Honey & Bee Products', 'Мед и пчелни продукти', 'bg-honey-bee', 'c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', '🍯', 1),
('Dairy Products', 'Млечни продукти', 'bg-dairy', 'c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', '🧀', 2),
('Meat Products', 'Месни продукти', 'bg-meat', 'c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', '🥓', 3),
('Preserved Foods', 'Консерви и туршии', 'bg-preserved', 'c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', '🥫', 4),
('Spices & Herbs', 'Подправки и билки', 'bg-spices', 'c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', '🌿', 5),
('Traditional Sweets', 'Традиционни сладкиши', 'bg-sweets', 'c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', '🍬', 6);

-- =====================================================
-- 2. ROSE PRODUCTS L2 (4 categories)
-- =====================================================
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Rose Oil & Essence', 'Розово масло и есенция', 'bg-rose-oil', '55667eea-a74b-4e3c-b68f-bb1b9f178998', '💧', 1),
('Rose Cosmetics', 'Розова козметика', 'bg-rose-cosmetics', '55667eea-a74b-4e3c-b68f-bb1b9f178998', '🧴', 2),
('Rose Edibles', 'Ядливи розови продукти', 'bg-rose-edibles', '55667eea-a74b-4e3c-b68f-bb1b9f178998', '🍯', 3),
('Rose Gift Sets', 'Розови подаръчни комплекти', 'bg-rose-gifts', '55667eea-a74b-4e3c-b68f-bb1b9f178998', '🎁', 4);

-- =====================================================
-- 3. TRADITIONAL CRAFTS L2 (6 categories)
-- =====================================================
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Pottery & Ceramics', 'Грънчарство и керамика', 'bg-pottery', '976a10a1-23e3-443a-9a10-d59a547db04c', '🏺', 1),
('Woodworking', 'Дърворезба', 'bg-woodwork', '976a10a1-23e3-443a-9a10-d59a547db04c', '🪵', 2),
('Textiles & Embroidery', 'Текстил и бродерия', 'bg-textiles', '976a10a1-23e3-443a-9a10-d59a547db04c', '🧵', 3),
('Metalwork', 'Ковачество и метал', 'bg-metalwork', '976a10a1-23e3-443a-9a10-d59a547db04c', '⚒️', 4),
('Icons & Religious Art', 'Икони и религиозно изкуство', 'bg-icons', '976a10a1-23e3-443a-9a10-d59a547db04c', '✝️', 5),
('Folk Musical Instruments', 'Народни музикални инструменти', 'bg-folk-instruments', '976a10a1-23e3-443a-9a10-d59a547db04c', '🎵', 6);

-- =====================================================
-- 4. FOLK COSTUMES L2 (5 categories)
-- =====================================================
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Women''s Folk Costumes', 'Дамски народни носии', 'bg-folk-women', '1514ccad-a7f2-4cf5-95c3-1068d13955c1', '👩', 1),
('Men''s Folk Costumes', 'Мъжки народни носии', 'bg-folk-men', '1514ccad-a7f2-4cf5-95c3-1068d13955c1', '👨', 2),
('Children''s Folk Costumes', 'Детски народни носии', 'bg-folk-kids', '1514ccad-a7f2-4cf5-95c3-1068d13955c1', '👧', 3),
('Costume Accessories', 'Аксесоари за носии', 'bg-folk-accessories', '1514ccad-a7f2-4cf5-95c3-1068d13955c1', '💍', 4),
('Regional Costumes', 'Регионални носии', 'bg-folk-regional', '1514ccad-a7f2-4cf5-95c3-1068d13955c1', '🗺️', 5);

-- =====================================================
-- 5. BULGARIAN WINE L2 (5 categories)
-- =====================================================
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Red Wine', 'Червено вино', 'bg-red-wine', '3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', '🍷', 1),
('White Wine', 'Бяло вино', 'bg-white-wine', '3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', '🥂', 2),
('Rosé Wine', 'Розе', 'bg-rose-wine', '3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', '🌸', 3),
('Rakia (Brandy)', 'Ракия', 'bg-rakia', '3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', '🥃', 4),
('Wine Accessories', 'Аксесоари за вино', 'bg-wine-accessories', '3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', '🍾', 5);

-- =====================================================
-- 6. SOUVENIRS L2 (5 categories)
-- =====================================================
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Martenitsi', 'Мартеници', 'bg-martenitsi', 'd245c796-4c20-444c-b5c5-f6389adbe891', '❤️', 1),
('Magnets & Keychains', 'Магнити и ключодържатели', 'bg-magnets', 'd245c796-4c20-444c-b5c5-f6389adbe891', '🧲', 2),
('Postcards & Books', 'Картички и книги', 'bg-postcards', 'd245c796-4c20-444c-b5c5-f6389adbe891', '📬', 3),
('Mini Crafts & Figurines', 'Мини занаяти и фигурки', 'bg-mini-crafts', 'd245c796-4c20-444c-b5c5-f6389adbe891', '🎎', 4),
('Bulgarian Symbols', 'Български символи', 'bg-symbols', 'd245c796-4c20-444c-b5c5-f6389adbe891', '🇧🇬', 5);
;
