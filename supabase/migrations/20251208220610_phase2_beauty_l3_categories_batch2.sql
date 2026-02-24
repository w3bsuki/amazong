-- Phase 2.3: Beauty L3 Categories - Batch 2: Makeup, Fragrance, Men's Grooming
-- Target: Add L3 children to remaining Beauty L2 categories

-- =====================================================
-- MAKEUP L3 CATEGORIES
-- =====================================================

-- Makeup Brushes (makeup-brushes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Foundation Brushes', 'Powder Brushes', 'Contour Brushes', 'Eye Brushes', 'Lip Brushes', 'Brush Sets', 'Cleaning Tools']),
  unnest(ARRAY['brush-foundation', 'brush-powder', 'brush-contour', 'brush-eye', 'brush-lip', 'brush-sets', 'brush-cleaning']),
  (SELECT id FROM categories WHERE slug = 'makeup-brushes'),
  unnest(ARRAY['Четки за фон дьо тен', 'Четки за пудра', 'Четки за контуриране', 'Четки за очи', 'Четки за устни', 'Комплекти четки', 'Инструменти за почистване']),
  '🖌️'
ON CONFLICT (slug) DO NOTHING;

-- Makeup Sponges (beauty-tools-sponges)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Beauty Blenders', 'Silicone Sponges', 'Wedge Sponges', 'Powder Puffs', 'Konjac Sponges', 'Sponge Holders']),
  unnest(ARRAY['sponge-beautyblender', 'sponge-silicone', 'sponge-wedge', 'sponge-powder', 'sponge-konjac', 'sponge-holders']),
  (SELECT id FROM categories WHERE slug = 'beauty-tools-sponges'),
  unnest(ARRAY['Бюти блендъри', 'Силиконови гъби', 'Клиновидни гъби', 'Пудрени пухчета', 'Конджак гъби', 'Държачи за гъби']),
  '🧽'
ON CONFLICT (slug) DO NOTHING;

-- Makeup Palettes (makeup-palettes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Eyeshadow Palettes', 'Face Palettes', 'Lip Palettes', 'Contour Palettes', 'Blush Palettes', 'Highlighter Palettes']),
  unnest(ARRAY['palette-eyeshadow', 'palette-face', 'palette-lip', 'palette-contour', 'palette-blush', 'palette-highlighter']),
  (SELECT id FROM categories WHERE slug = 'makeup-palettes'),
  unnest(ARRAY['Палитри сенки', 'Палитри за лице', 'Палитри за устни', 'Контуриращи палитри', 'Палитри руж', 'Палитри хайлайтър']),
  '🎨'
ON CONFLICT (slug) DO NOTHING;

-- Makeup Sets (makeup-sets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Starter Kits', 'Gift Sets', 'Travel Sets', 'Lip Sets', 'Eye Sets', 'Face Sets', 'Value Sets']),
  unnest(ARRAY['makeupset-starter', 'makeupset-gift', 'makeupset-travel', 'makeupset-lip', 'makeupset-eye', 'makeupset-face', 'makeupset-value']),
  (SELECT id FROM categories WHERE slug = 'makeup-sets'),
  unnest(ARRAY['Начални комплекти', 'Подаръчни комплекти', 'Пътни комплекти', 'Комплекти за устни', 'Комплекти за очи', 'Комплекти за лице', 'Изгодни комплекти']),
  '💄'
ON CONFLICT (slug) DO NOTHING;

-- Nail Polish (nail-polish)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Regular Polish', 'Gel Polish', 'Nail Art', 'Base Coats', 'Top Coats', 'Nail Treatments', 'Nail Polish Remover', 'Nail Sets']),
  unnest(ARRAY['nailpolish-regular', 'nailpolish-gel', 'nailpolish-art', 'nailpolish-base', 'nailpolish-top', 'nailpolish-treatment', 'nailpolish-remover', 'nailpolish-sets']),
  (SELECT id FROM categories WHERE slug = 'nail-polish'),
  unnest(ARRAY['Обикновен лак', 'Гел лак', 'Нейл арт', 'База', 'Топ лак', 'Лечебни лакове', 'Лакочистител', 'Комплекти лакове']),
  '💅'
ON CONFLICT (slug) DO NOTHING;

-- Nail Tools (beauty-tools-nails)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nail Files', 'Nail Clippers', 'Cuticle Tools', 'Nail Buffers', 'UV/LED Lamps', 'Nail Brushes', 'Nail Drill', 'Manicure Sets']),
  unnest(ARRAY['nailtool-files', 'nailtool-clippers', 'nailtool-cuticle', 'nailtool-buffers', 'nailtool-lamps', 'nailtool-brushes', 'nailtool-drill', 'nailtool-sets']),
  (SELECT id FROM categories WHERE slug = 'beauty-tools-nails'),
  unnest(ARRAY['Пили за нокти', 'Ножички за нокти', 'Инструменти за кутикули', 'Полиращи блокчета', 'UV/LED лампи', 'Четки за нокти', 'Фреза за нокти', 'Маникюрни комплекти']),
  '💅'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- BEAUTY TOOLS L3 CATEGORIES
-- =====================================================

-- Eyelash Curlers (beauty-tools-curlers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Standard Curlers', 'Heated Curlers', 'Mini Curlers', 'Silicone Pad Refills', 'Curler Sets']),
  unnest(ARRAY['curler-standard', 'curler-heated', 'curler-mini', 'curler-refills', 'curler-sets']),
  (SELECT id FROM categories WHERE slug = 'beauty-tools-curlers'),
  unnest(ARRAY['Стандартни щипки', 'С нагряване', 'Мини щипки', 'Резервни силиконови подложки', 'Комплекти']),
  '👁️'
ON CONFLICT (slug) DO NOTHING;

-- Facial Tools (beauty-tools-facial)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Face Rollers', 'Gua Sha', 'Facial Cleansing Devices', 'LED Masks', 'Microcurrent Devices', 'Dermaplaning Tools', 'Pore Extractors', 'Facial Steamers']),
  unnest(ARRAY['facialtool-rollers', 'facialtool-guasha', 'facialtool-cleansing', 'facialtool-led', 'facialtool-microcurrent', 'facialtool-dermaplaning', 'facialtool-extractors', 'facialtool-steamers']),
  (SELECT id FROM categories WHERE slug = 'beauty-tools-facial'),
  unnest(ARRAY['Ролери за лице', 'Гуа Ша', 'Почистващи устройства', 'LED маски', 'Микротокови устройства', 'Дермапланинг', 'Екстрактори', 'Пари за лице']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Hair Styling Tools (beauty-tools-hair)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hair Dryers', 'Flat Irons', 'Curling Irons', 'Hot Brushes', 'Hot Rollers', 'Crimpers', 'Hair Dryer Brushes']),
  unnest(ARRAY['hairtool-dryers', 'hairtool-flatirons', 'hairtool-curling', 'hairtool-hotbrush', 'hairtool-rollers', 'hairtool-crimpers', 'hairtool-dryerbrush']),
  (SELECT id FROM categories WHERE slug = 'beauty-tools-hair'),
  unnest(ARRAY['Сешоари', 'Преси', 'Маши', 'Четки с топлина', 'Ролки с нагряване', 'Кримпъри', 'Сешоар четки']),
  '💇'
ON CONFLICT (slug) DO NOTHING;

-- Makeup Mirrors (beauty-tools-mirrors)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Vanity Mirrors', 'Compact Mirrors', 'Magnifying Mirrors', 'Lighted Mirrors', 'Travel Mirrors', 'Wall Mirrors']),
  unnest(ARRAY['mirror-vanity', 'mirror-compact', 'mirror-magnifying', 'mirror-lighted', 'mirror-travel', 'mirror-wall']),
  (SELECT id FROM categories WHERE slug = 'beauty-tools-mirrors'),
  unnest(ARRAY['Тоалетни огледала', 'Компактни огледала', 'Увеличителни огледала', 'Огледала с осветление', 'Пътни огледала', 'Стенни огледала']),
  '🪞'
ON CONFLICT (slug) DO NOTHING;

-- Beauty Devices (bt-devices)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Facial Cleansing', 'Anti-Aging Devices', 'Hair Removal', 'Acne Devices', 'Massage Devices', 'LED Therapy']),
  unnest(ARRAY['btdevice-cleansing', 'btdevice-antiaging', 'btdevice-hairremoval', 'btdevice-acne', 'btdevice-massage', 'btdevice-led']),
  (SELECT id FROM categories WHERE slug = 'bt-devices'),
  unnest(ARRAY['Почистване на лице', 'Анти-ейдж устройства', 'Епилация', 'Устройства за акне', 'Масажни устройства', 'LED терапия']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Beauty Accessories (bt-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Makeup Bags', 'Brush Holders', 'Cosmetic Organizers', 'Makeup Cases', 'Beauty Towels', 'Headbands']),
  unnest(ARRAY['btacc-bags', 'btacc-brushholders', 'btacc-organizers', 'btacc-cases', 'btacc-towels', 'btacc-headbands']),
  (SELECT id FROM categories WHERE slug = 'bt-accessories'),
  unnest(ARRAY['Несесери', 'Държачи за четки', 'Органайзери', 'Куфари за грим', 'Кърпи за красота', 'Ленти за коса']),
  '👜'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- FRAGRANCE L3 CATEGORIES
-- =====================================================

-- Unisex Fragrances (fragrance-unisex)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Woody Fragrances', 'Fresh Fragrances', 'Oriental Fragrances', 'Citrus Fragrances', 'Niche Fragrances', 'Designer Fragrances']),
  unnest(ARRAY['unisex-frag-woody', 'unisex-frag-fresh', 'unisex-frag-oriental', 'unisex-frag-citrus', 'unisex-frag-niche', 'unisex-frag-designer']),
  (SELECT id FROM categories WHERE slug = 'fragrance-unisex'),
  unnest(ARRAY['Дървесни аромати', 'Свежи аромати', 'Ориенталски аромати', 'Цитрусови аромати', 'Нишови парфюми', 'Дизайнерски парфюми']),
  '🌸'
ON CONFLICT (slug) DO NOTHING;

-- Fragrance Gift Sets (fragrance-sets and fragrance-gift-sets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Women''s Gift Sets', 'Men''s Gift Sets', 'Unisex Gift Sets', 'Discovery Sets', 'Mini Sets', 'Luxury Sets']),
  unnest(ARRAY['fragset-women', 'fragset-men', 'fragset-unisex', 'fragset-discovery', 'fragset-mini', 'fragset-luxury']),
  (SELECT id FROM categories WHERE slug = 'fragrance-sets'),
  unnest(ARRAY['Дамски комплекти', 'Мъжки комплекти', 'Унисекс комплекти', 'Откриващи комплекти', 'Мини комплекти', 'Луксозни комплекти']),
  '🎁'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Women''s Gift Sets', 'Men''s Gift Sets', 'Travel Sets', 'Mini Sets', 'Luxury Sets']),
  unnest(ARRAY['fraggift-women', 'fraggift-men', 'fraggift-travel', 'fraggift-mini', 'fraggift-luxury']),
  (SELECT id FROM categories WHERE slug = 'fragrance-gift-sets'),
  unnest(ARRAY['Дамски комплекти', 'Мъжки комплекти', 'Пътни комплекти', 'Мини комплекти', 'Луксозни комплекти']),
  '🎁'
ON CONFLICT (slug) DO NOTHING;

-- Perfume Sets (perfume-sets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Full Size Sets', 'Travel Sets', 'Sampler Sets', 'Mini Perfume Sets', 'Body Care Sets']),
  unnest(ARRAY['perfumeset-full', 'perfumeset-travel', 'perfumeset-sampler', 'perfumeset-mini', 'perfumeset-bodycare']),
  (SELECT id FROM categories WHERE slug = 'perfume-sets'),
  unnest(ARRAY['Пълни комплекти', 'Пътни комплекти', 'Комплекти мостри', 'Мини парфюми', 'Комплекти за тяло']),
  '🎁'
ON CONFLICT (slug) DO NOTHING;

-- Sample Sets (fragrance-samples)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Women''s Samples', 'Men''s Samples', 'Niche Samples', 'Designer Samples', 'Discovery Boxes']),
  unnest(ARRAY['fragsample-women', 'fragsample-men', 'fragsample-niche', 'fragsample-designer', 'fragsample-discovery']),
  (SELECT id FROM categories WHERE slug = 'fragrance-samples'),
  unnest(ARRAY['Дамски мостри', 'Мъжки мостри', 'Нишови мостри', 'Дизайнерски мостри', 'Кутии за откриване']),
  '💐'
ON CONFLICT (slug) DO NOTHING;

-- Travel Size (travel-size-fragrance)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Mini Perfumes', 'Rollerball Perfumes', 'Travel Sprays', 'Atomizers', 'Purse Sprays']),
  unnest(ARRAY['travelsize-mini', 'travelsize-rollerball', 'travelsize-spray', 'travelsize-atomizer', 'travelsize-purse']),
  (SELECT id FROM categories WHERE slug = 'travel-size-fragrance'),
  unnest(ARRAY['Мини парфюми', 'Ролер парфюми', 'Пътни спрейове', 'Атомайзери', 'Парфюми за чанта']),
  '✈️'
ON CONFLICT (slug) DO NOTHING;

-- Rollerballs (rollerballs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Women''s Rollerballs', 'Men''s Rollerballs', 'Unisex Rollerballs', 'Oil Rollerballs', 'Perfume Rollerballs']),
  unnest(ARRAY['rollerball-women', 'rollerball-men', 'rollerball-unisex', 'rollerball-oil', 'rollerball-perfume']),
  (SELECT id FROM categories WHERE slug = 'rollerballs'),
  unnest(ARRAY['Дамски ролер', 'Мъжки ролер', 'Унисекс ролер', 'Маслени ролер', 'Парфюмни ролер']),
  '💧'
ON CONFLICT (slug) DO NOTHING;

-- Luxury Niche (luxury-niche-fragrance)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tom Ford', 'Creed', 'Maison Francis Kurkdjian', 'Le Labo', 'Byredo', 'Diptyque', 'Jo Malone', 'Other Niche']),
  unnest(ARRAY['niche-tomford', 'niche-creed', 'niche-mfk', 'niche-lelabo', 'niche-byredo', 'niche-diptyque', 'niche-jomalone', 'niche-other']),
  (SELECT id FROM categories WHERE slug = 'luxury-niche-fragrance'),
  unnest(ARRAY['Tom Ford', 'Creed', 'Maison Francis Kurkdjian', 'Le Labo', 'Byredo', 'Diptyque', 'Jo Malone', 'Други нишови']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- MEN'S GROOMING L3 CATEGORIES
-- =====================================================

-- Beard Care (mg-beard and beard-care)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Beard Oil', 'Beard Balm', 'Beard Wash', 'Beard Brush', 'Beard Comb', 'Beard Trimmer', 'Beard Wax', 'Beard Kits']),
  unnest(ARRAY['beard-oil', 'beard-balm', 'beard-wash', 'beard-brush', 'beard-comb', 'beard-trimmer', 'beard-wax', 'beard-kits']),
  (SELECT id FROM categories WHERE slug = 'mg-beard'),
  unnest(ARRAY['Масло за брада', 'Балсам за брада', 'Измиване за брада', 'Четка за брада', 'Гребен за брада', 'Тример за брада', 'Восък за брада', 'Комплекти за брада']),
  '🧔'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Beard Oil', 'Beard Balm', 'Beard Wash', 'Beard Brush', 'Beard Trimmer', 'Beard Kits']),
  unnest(ARRAY['beardcare-oil', 'beardcare-balm', 'beardcare-wash', 'beardcare-brush', 'beardcare-trimmer', 'beardcare-kits']),
  (SELECT id FROM categories WHERE slug = 'beard-care'),
  unnest(ARRAY['Масло за брада', 'Балсам за брада', 'Измиване за брада', 'Четка за брада', 'Тример за брада', 'Комплекти за брада']),
  '🧔'
ON CONFLICT (slug) DO NOTHING;

-- Shaving (mens-shaving)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Razors', 'Shaving Cream', 'Shaving Gel', 'Aftershave', 'Pre-Shave', 'Shaving Brushes', 'Razor Blades', 'Electric Shavers']),
  unnest(ARRAY['shaving-razors', 'shaving-cream', 'shaving-gel', 'shaving-aftershave', 'shaving-preshave', 'shaving-brushes', 'shaving-blades', 'shaving-electric']),
  (SELECT id FROM categories WHERE slug = 'mens-shaving'),
  unnest(ARRAY['Самобръсначки', 'Крем за бръснене', 'Гел за бръснене', 'Афтършейв', 'Пре-бръснене', 'Четки за бръснене', 'Ножчета', 'Електрически бръсначки']),
  '🪒'
ON CONFLICT (slug) DO NOTHING;

-- Men's Skincare (mens-skincare and mg-skincare)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Face Wash', 'Moisturizer', 'Eye Cream', 'Face Serum', 'Sunscreen', 'Anti-Aging', 'Acne Care']),
  unnest(ARRAY['mensskin-wash', 'mensskin-moisturizer', 'mensskin-eye', 'mensskin-serum', 'mensskin-sunscreen', 'mensskin-antiaging', 'mensskin-acne']),
  (SELECT id FROM categories WHERE slug = 'mens-skincare'),
  unnest(ARRAY['Измиване за лице', 'Хидратант', 'Крем за очи', 'Серум за лице', 'Слънцезащита', 'Анти-ейдж', 'Грижа за акне']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Face Wash', 'Moisturizer', 'Eye Cream', 'Sunscreen', 'Anti-Aging']),
  unnest(ARRAY['mgskin-wash', 'mgskin-moisturizer', 'mgskin-eye', 'mgskin-sunscreen', 'mgskin-antiaging']),
  (SELECT id FROM categories WHERE slug = 'mg-skincare'),
  unnest(ARRAY['Измиване за лице', 'Хидратант', 'Крем за очи', 'Слънцезащита', 'Анти-ейдж']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Men's Hair Care (mens-haircare and mg-haircare)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Shampoo', 'Conditioner', 'Hair Styling', 'Hair Loss', 'Pomade', 'Hair Gel', 'Hair Wax']),
  unnest(ARRAY['menshair-shampoo', 'menshair-conditioner', 'menshair-styling', 'menshair-hairloss', 'menshair-pomade', 'menshair-gel', 'menshair-wax']),
  (SELECT id FROM categories WHERE slug = 'mens-haircare'),
  unnest(ARRAY['Шампоан', 'Балсам', 'Стилизиране', 'Против косопад', 'Помада', 'Гел за коса', 'Восък за коса']),
  '💇‍♂️'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Shampoo', 'Conditioner', 'Hair Styling', 'Hair Loss', 'Pomade']),
  unnest(ARRAY['mghair-shampoo', 'mghair-conditioner', 'mghair-styling', 'mghair-hairloss', 'mghair-pomade']),
  (SELECT id FROM categories WHERE slug = 'mg-haircare'),
  unnest(ARRAY['Шампоан', 'Балсам', 'Стилизиране', 'Против косопад', 'Помада']),
  '💇‍♂️'
ON CONFLICT (slug) DO NOTHING;

-- Men's Body Care (mens-body-care, mens-bodycare, mg-bodycare)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Body Wash', 'Body Lotion', 'Deodorant', 'Body Spray', 'Shower Gel']),
  unnest(ARRAY['mensbody-wash', 'mensbody-lotion', 'mensbody-deodorant', 'mensbody-spray', 'mensbody-showergel']),
  (SELECT id FROM categories WHERE slug = 'mens-body-care'),
  unnest(ARRAY['Душ гел', 'Лосион за тяло', 'Дезодорант', 'Спрей за тяло', 'Душ гел']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Body Wash', 'Body Lotion', 'Deodorant', 'Body Spray']),
  unnest(ARRAY['mensbodycare-wash', 'mensbodycare-lotion', 'mensbodycare-deodorant', 'mensbodycare-spray']),
  (SELECT id FROM categories WHERE slug = 'mens-bodycare'),
  unnest(ARRAY['Душ гел', 'Лосион за тяло', 'Дезодорант', 'Спрей за тяло']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Body Wash', 'Body Lotion', 'Deodorant', 'Body Spray']),
  unnest(ARRAY['mgbody-wash', 'mgbody-lotion', 'mgbody-deodorant', 'mgbody-spray']),
  (SELECT id FROM categories WHERE slug = 'mg-bodycare'),
  unnest(ARRAY['Душ гел', 'Лосион за тяло', 'Дезодорант', 'Спрей за тяло']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Grooming Kits (grooming-kits)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Shaving Kits', 'Beard Kits', 'Travel Kits', 'Manicure Kits', 'Gift Sets', 'Complete Grooming Kits']),
  unnest(ARRAY['groomkit-shaving', 'groomkit-beard', 'groomkit-travel', 'groomkit-manicure', 'groomkit-gift', 'groomkit-complete']),
  (SELECT id FROM categories WHERE slug = 'grooming-kits'),
  unnest(ARRAY['Комплекти за бръснене', 'Комплекти за брада', 'Пътни комплекти', 'Маникюрни комплекти', 'Подаръчни комплекти', 'Пълни комплекти']),
  '✂️'
ON CONFLICT (slug) DO NOTHING;;
