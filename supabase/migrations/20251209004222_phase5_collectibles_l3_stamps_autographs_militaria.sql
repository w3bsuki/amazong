
-- Phase 5: Collectibles - Stamps, Autographs & Militaria L3s

-- Stamps > By Country L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Bulgarian Stamps', 'US Stamps', 'British Stamps', 'German Stamps', 'French Stamps', 'Russian Stamps', 'Chinese Stamps', 'Japanese Stamps']),
  unnest(ARRAY['stamps-country-bg', 'stamps-country-us', 'stamps-country-uk', 'stamps-country-de', 'stamps-country-fr', 'stamps-country-ru', 'stamps-country-cn', 'stamps-country-jp']),
  (SELECT id FROM categories WHERE slug = 'stamps-by-country'),
  unnest(ARRAY['Български марки', 'Американски марки', 'Британски марки', 'Немски марки', 'Френски марки', 'Руски марки', 'Китайски марки', 'Японски марки']),
  '📮',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Stamps > By Era L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Classic Era (1840-1900)', 'Early Modern (1901-1945)', 'Post-War (1946-1970)', 'Modern Era (1971-2000)', 'Contemporary (2001-present)', 'First Issues']),
  unnest(ARRAY['stamps-era-classic', 'stamps-era-early', 'stamps-era-postwar', 'stamps-era-modern', 'stamps-era-contemporary', 'stamps-era-first']),
  (SELECT id FROM categories WHERE slug = 'stamps-by-era'),
  unnest(ARRAY['Класическа ера (1840-1900)', 'Ранна модерна (1901-1945)', 'Следвоенна (1946-1970)', 'Модерна ера (1971-2000)', 'Съвременни (2001-сега)', 'Първи издания']),
  '📮',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Stamps > Topical Stamps L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Animals', 'Sports', 'Space', 'Art & Culture', 'Famous People', 'Transport', 'Nature', 'Olympics']),
  unnest(ARRAY['stamps-topic-animals', 'stamps-topic-sports', 'stamps-topic-space', 'stamps-topic-art', 'stamps-topic-people', 'stamps-topic-transport', 'stamps-topic-nature', 'stamps-topic-olympics']),
  (SELECT id FROM categories WHERE slug = 'stamps-topical'),
  unnest(ARRAY['Животни', 'Спорт', 'Космос', 'Изкуство и култура', 'Известни личности', 'Транспорт', 'Природа', 'Олимпийски игри']),
  '📮',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Stamps > Stamp Collections L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Beginner Collections', 'Country Collections', 'Thematic Collections', 'Worldwide Collections', 'Investment Collections', 'Estate Collections']),
  unnest(ARRAY['stamps-coll-beginner', 'stamps-coll-country', 'stamps-coll-thematic', 'stamps-coll-world', 'stamps-coll-invest', 'stamps-coll-estate']),
  (SELECT id FROM categories WHERE slug = 'stamps-collections'),
  unnest(ARRAY['Начинаещи колекции', 'Колекции по държави', 'Тематични колекции', 'Световни колекции', 'Инвестиционни колекции', 'Наследствени колекции']),
  '📮',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Autographs > Categories L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Sports Autographs', 'Music Autographs', 'Movie Star Autographs', 'Political Autographs', 'Historical Autographs', 'Literary Autographs', 'Art Autographs', 'Space & Science']),
  unnest(ARRAY['autographs-sports', 'autographs-music', 'autographs-movie', 'autographs-political', 'autographs-historical', 'autographs-literary', 'autographs-art', 'autographs-space']),
  (SELECT id FROM categories WHERE slug = 'coll-autographs'),
  unnest(ARRAY['Спортни автографи', 'Музикални автографи', 'Филмови звезди', 'Политически автографи', 'Исторически автографи', 'Литературни автографи', 'Художествени автографи', 'Космос и наука']),
  '✍️',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Militaria > Uniforms L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['WWI Uniforms', 'WWII Uniforms', 'Cold War Uniforms', 'Modern Military Uniforms', 'Bulgarian Military Uniforms', 'US Military Uniforms', 'German Military Uniforms']),
  unnest(ARRAY['milit-uni-ww1', 'milit-uni-ww2', 'milit-uni-cold', 'milit-uni-modern', 'milit-uni-bg', 'milit-uni-us', 'milit-uni-de']),
  (SELECT id FROM categories WHERE slug = 'militaria-uniforms'),
  unnest(ARRAY['Униформи ПСВ', 'Униформи ВСВ', 'Студена война униформи', 'Съвременни военни', 'Български военни униформи', 'Американски военни униформи', 'Немски военни униформи']),
  '🎖️',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Militaria > Medals & Badges L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['WWI Medals', 'WWII Medals', 'Bulgarian Medals', 'Soviet Medals', 'US Military Medals', 'British Medals', 'German Medals', 'Unit Badges']),
  unnest(ARRAY['milit-medal-ww1', 'milit-medal-ww2', 'milit-medal-bg', 'milit-medal-soviet', 'milit-medal-us', 'milit-medal-uk', 'milit-medal-de', 'milit-medal-badges']),
  (SELECT id FROM categories WHERE slug = 'militaria-medals'),
  unnest(ARRAY['Медали ПСВ', 'Медали ВСВ', 'Български медали', 'Съветски медали', 'Американски военни медали', 'Британски медали', 'Немски медали', 'Войскови значки']),
  '🎖️',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Militaria > Weapons L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Deactivated Firearms', 'Edged Weapons', 'Bayonets', 'Military Knives', 'Swords & Sabers', 'Daggers', 'Antique Weapons']),
  unnest(ARRAY['milit-weap-deact', 'milit-weap-edged', 'milit-weap-bayonet', 'milit-weap-knives', 'milit-weap-swords', 'milit-weap-daggers', 'milit-weap-antique']),
  (SELECT id FROM categories WHERE slug = 'militaria-weapons'),
  unnest(ARRAY['Обезопасени оръжия', 'Студено оръжие', 'Щикове', 'Военни ножове', 'Саби и мечове', 'Кинжали', 'Антикварни оръжия']),
  '⚔️',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Militaria > Documents L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Military ID Cards', 'Service Records', 'Letters & Correspondence', 'Maps & Charts', 'Manuals & Guides', 'Propaganda Materials', 'Photographs']),
  unnest(ARRAY['milit-doc-id', 'milit-doc-service', 'milit-doc-letters', 'milit-doc-maps', 'milit-doc-manuals', 'milit-doc-propaganda', 'milit-doc-photos']),
  (SELECT id FROM categories WHERE slug = 'militaria-documents'),
  unnest(ARRAY['Военни лични карти', 'Служебни досиета', 'Писма и кореспонденция', 'Карти и схеми', 'Наръчници и ръководства', 'Пропагандни материали', 'Снимки']),
  '📜',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Militaria > Equipment L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Helmets', 'Field Gear', 'Gas Masks', 'Canteens & Mess Kits', 'Optics & Binoculars', 'Communication Equipment', 'First Aid Kits']),
  unnest(ARRAY['milit-equip-helmets', 'milit-equip-field', 'milit-equip-gas', 'milit-equip-canteen', 'milit-equip-optics', 'milit-equip-comm', 'milit-equip-firstaid']),
  (SELECT id FROM categories WHERE slug = 'militaria-equipment'),
  unnest(ARRAY['Каски', 'Полево снаряжение', 'Противогази', 'Манерки и комплекти', 'Оптика и бинокли', 'Комуникационна техника', 'Аптечки']),
  '🪖',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;
;
