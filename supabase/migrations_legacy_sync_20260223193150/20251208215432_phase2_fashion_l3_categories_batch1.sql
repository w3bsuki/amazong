-- Phase 2.1.1: Fashion L3 Categories - Batch 1: Bags, Watches, Accessories
-- Target: Add L3 children to Fashion L2 categories that need them

-- =====================================================
-- BAGS L3 CATEGORIES
-- =====================================================

-- Men's Bags (men-bags)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Messenger Bags', 'Duffel Bags', 'Crossbody Bags', 'Briefcases', 'Travel Bags', 'Toiletry Bags', 'Gym Bags', 'Belt Bags']),
  unnest(ARRAY['men-messenger-bags', 'men-duffel-bags', 'men-crossbody-bags', 'men-briefcases', 'men-travel-bags', 'men-toiletry-bags', 'men-gym-bags', 'men-belt-bags']),
  (SELECT id FROM categories WHERE slug = 'men-bags'),
  unnest(ARRAY['Чанти за рамо', 'Пътни чанти', 'Кросбоди чанти', 'Бизнес чанти', 'Пътни чанти', 'Несесери', 'Спортни чанти', 'Чанти за колан']),
  '👜'
ON CONFLICT (slug) DO NOTHING;

-- Women's Bags (women-bags)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tote Bags', 'Crossbody Bags', 'Shoulder Bags', 'Clutches', 'Evening Bags', 'Hobo Bags', 'Bucket Bags', 'Belt Bags', 'Beach Bags', 'Backpacks']),
  unnest(ARRAY['women-tote-bags', 'women-crossbody-bags', 'women-shoulder-bags', 'women-clutches', 'women-evening-bags', 'women-hobo-bags', 'women-bucket-bags', 'women-belt-bags', 'women-beach-bags', 'women-backpacks']),
  (SELECT id FROM categories WHERE slug = 'women-bags'),
  unnest(ARRAY['Тотал чанти', 'Кросбоди чанти', 'Чанти за рамо', 'Клъчове', 'Вечерни чанти', 'Хобо чанти', 'Кофа чанти', 'Чанти за колан', 'Плажни чанти', 'Раници']),
  '👜'
ON CONFLICT (slug) DO NOTHING;

-- Kids Bags (kids-bags)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['School Backpacks', 'Lunch Bags', 'Crossbody Bags', 'Drawstring Bags', 'Travel Bags', 'Sports Bags']),
  unnest(ARRAY['kids-school-backpacks', 'kids-lunch-bags', 'kids-crossbody-bags', 'kids-drawstring-bags', 'kids-travel-bags', 'kids-sports-bags']),
  (SELECT id FROM categories WHERE slug = 'kids-bags'),
  unnest(ARRAY['Ученически раници', 'Чанти за обяд', 'Кросбоди чанти', 'Торбички с връзки', 'Пътни чанти', 'Спортни чанти']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Unisex Bags (unisex-bags)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Laptop Bags', 'Weekender Bags', 'Camera Bags', 'Hiking Backpacks', 'Gym Bags', 'Messenger Bags', 'Sling Bags', 'Fanny Packs']),
  unnest(ARRAY['unisex-laptop-bags', 'unisex-weekender-bags', 'unisex-camera-bags', 'unisex-hiking-backpacks', 'unisex-gym-bags', 'unisex-messenger-bags', 'unisex-sling-bags', 'unisex-fanny-packs']),
  (SELECT id FROM categories WHERE slug = 'unisex-bags'),
  unnest(ARRAY['Чанти за лаптоп', 'Уикенд чанти', 'Чанти за фотоапарат', 'Туристически раници', 'Спортни чанти', 'Чанти за рамо', 'Слинг чанти', 'Чанти за кръст']),
  '👜'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- WATCHES L3 CATEGORIES
-- =====================================================

-- Women's Watches (women-watches)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dress Watches', 'Fashion Watches', 'Sport Watches', 'Luxury Watches', 'Ceramic Watches', 'Diamond Watches', 'Gold Watches', 'Silver Watches']),
  unnest(ARRAY['women-dress-watches', 'women-fashion-watches', 'women-sport-watches', 'women-luxury-watches', 'women-ceramic-watches', 'women-diamond-watches', 'women-gold-watches', 'women-silver-watches']),
  (SELECT id FROM categories WHERE slug = 'women-watches'),
  unnest(ARRAY['Елегантни часовници', 'Модни часовници', 'Спортни часовници', 'Луксозни часовници', 'Керамични часовници', 'Диамантени часовници', 'Златни часовници', 'Сребърни часовници']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Men's Watches (men-watches)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dress Watches', 'Sport Watches', 'Dive Watches', 'Chronograph Watches', 'Automatic Watches', 'Luxury Watches', 'Pilot Watches', 'Field Watches']),
  unnest(ARRAY['men-dress-watches', 'men-sport-watches', 'men-dive-watches', 'men-chronograph-watches', 'men-automatic-watches', 'men-luxury-watches', 'men-pilot-watches', 'men-field-watches']),
  (SELECT id FROM categories WHERE slug = 'men-watches'),
  unnest(ARRAY['Елегантни часовници', 'Спортни часовници', 'Водолазни часовници', 'Хронографи', 'Автоматични часовници', 'Луксозни часовници', 'Пилотски часовници', 'Полеви часовници']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Kids Watches (kids-watches)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Digital Watches', 'Analog Watches', 'Character Watches', 'Sport Watches', 'Educational Watches', 'Waterproof Watches']),
  unnest(ARRAY['kids-digital-watches', 'kids-analog-watches', 'kids-character-watches', 'kids-sport-watches', 'kids-educational-watches', 'kids-waterproof-watches']),
  (SELECT id FROM categories WHERE slug = 'kids-watches'),
  unnest(ARRAY['Дигитални часовници', 'Аналогови часовници', 'Часовници с герои', 'Спортни часовници', 'Образователни часовници', 'Водоустойчиви часовници']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Unisex Watches (unisex-watches)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Minimalist Watches', 'Digital Watches', 'Hybrid Smartwatches', 'Fitness Watches', 'Casual Watches', 'Vintage Style Watches']),
  unnest(ARRAY['unisex-minimalist-watches', 'unisex-digital-watches', 'unisex-hybrid-smartwatches', 'unisex-fitness-watches', 'unisex-casual-watches', 'unisex-vintage-style-watches']),
  (SELECT id FROM categories WHERE slug = 'unisex-watches'),
  unnest(ARRAY['Минималистични часовници', 'Дигитални часовници', 'Хибридни смарт часовници', 'Фитнес часовници', 'Ежедневни часовници', 'Винтидж стил часовници']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Watches by Brand (watches-by-brand)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Rolex', 'Omega', 'Tag Heuer', 'Tissot', 'Seiko', 'Casio', 'Citizen', 'Fossil', 'Michael Kors', 'Daniel Wellington', 'Longines', 'Breitling']),
  unnest(ARRAY['watches-brand-rolex', 'watches-brand-omega', 'watches-brand-tag-heuer', 'watches-brand-tissot', 'watches-brand-seiko', 'watches-brand-casio', 'watches-brand-citizen', 'watches-brand-fossil', 'watches-brand-michael-kors', 'watches-brand-daniel-wellington', 'watches-brand-longines', 'watches-brand-breitling']),
  (SELECT id FROM categories WHERE slug = 'watches-by-brand'),
  unnest(ARRAY['Rolex', 'Omega', 'Tag Heuer', 'Tissot', 'Seiko', 'Casio', 'Citizen', 'Fossil', 'Michael Kors', 'Daniel Wellington', 'Longines', 'Breitling']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Smart Watches (watches-smart)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Apple Watch', 'Samsung Galaxy Watch', 'Garmin Watches', 'Fitbit Watches', 'Amazfit Watches', 'Huawei Watches']),
  unnest(ARRAY['smartwatch-apple', 'smartwatch-samsung', 'smartwatch-garmin', 'smartwatch-fitbit', 'smartwatch-amazfit', 'smartwatch-huawei']),
  (SELECT id FROM categories WHERE slug = 'watches-smart'),
  unnest(ARRAY['Apple Watch', 'Samsung Galaxy Watch', 'Garmin часовници', 'Fitbit часовници', 'Amazfit часовници', 'Huawei часовници']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Casual Watches (watches-casual)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Leather Strap Watches', 'Metal Bracelet Watches', 'NATO Strap Watches', 'Silicone Strap Watches', 'Canvas Strap Watches']),
  unnest(ARRAY['casual-leather-watches', 'casual-metal-watches', 'casual-nato-watches', 'casual-silicone-watches', 'casual-canvas-watches']),
  (SELECT id FROM categories WHERE slug = 'watches-casual'),
  unnest(ARRAY['Часовници с кожена каишка', 'Часовници с метална гривна', 'Часовници с NATO каишка', 'Часовници със силиконова каишка', 'Часовници с платнена каишка']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Vintage Watches (watches-vintage)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['1950s-1960s', '1970s', '1980s', '1990s', 'Art Deco', 'Military Vintage']),
  unnest(ARRAY['vintage-watches-50s-60s', 'vintage-watches-70s', 'vintage-watches-80s', 'vintage-watches-90s', 'vintage-watches-art-deco', 'vintage-watches-military']),
  (SELECT id FROM categories WHERE slug = 'watches-vintage'),
  unnest(ARRAY['1950-1960-те', '1970-те', '1980-те', '1990-те', 'Арт Деко', 'Военни винтидж']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Watch Straps & Bands (watches-straps)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Leather Straps', 'Metal Bracelets', 'NATO Straps', 'Silicone Bands', 'Mesh Straps', 'Rubber Straps', 'Ceramic Bands']),
  unnest(ARRAY['watch-straps-leather', 'watch-straps-metal', 'watch-straps-nato', 'watch-straps-silicone', 'watch-straps-mesh', 'watch-straps-rubber', 'watch-straps-ceramic']),
  (SELECT id FROM categories WHERE slug = 'watches-straps'),
  unnest(ARRAY['Кожени каишки', 'Метални гривни', 'NATO каишки', 'Силиконови каишки', 'Мрежести каишки', 'Гумени каишки', 'Керамични каишки']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Watch Accessories (watches-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Watch Boxes', 'Watch Winders', 'Watch Tools', 'Watch Rolls', 'Watch Stands', 'Watch Cleaning Kits']),
  unnest(ARRAY['watch-acc-boxes', 'watch-acc-winders', 'watch-acc-tools', 'watch-acc-rolls', 'watch-acc-stands', 'watch-acc-cleaning']),
  (SELECT id FROM categories WHERE slug = 'watches-accessories'),
  unnest(ARRAY['Кутии за часовници', 'Навивачки', 'Инструменти за часовници', 'Ролки за часовници', 'Стойки за часовници', 'Комплекти за почистване']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;;
