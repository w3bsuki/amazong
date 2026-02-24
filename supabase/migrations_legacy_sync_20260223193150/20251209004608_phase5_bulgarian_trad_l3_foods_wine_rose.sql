
-- Phase 5: Bulgarian Traditional - Foods, Wine & Rose Products L3s

-- Traditional Foods > Bulgarian Cheese L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Sheep White Cheese', 'Cow White Cheese', 'Goat White Cheese', 'Mixed White Cheese']),
  unnest(ARRAY['cheese-sheep', 'cheese-cow', 'cheese-goat', 'cheese-mixed']),
  (SELECT id FROM categories WHERE slug = 'bulgarian-cheese'),
  unnest(ARRAY['Овче сирене', 'Краве сирене', 'Козе сирене', 'Смесено сирене']),
  '🧀',
  generate_series(1, 4)
ON CONFLICT (slug) DO NOTHING;

-- Traditional Foods > Bulgarian Yogurt L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Traditional Yogurt', 'Sheep Yogurt', 'Buffalo Yogurt', 'Yogurt Starter']),
  unnest(ARRAY['yogurt-traditional', 'yogurt-sheep', 'yogurt-buffalo', 'yogurt-starter']),
  (SELECT id FROM categories WHERE slug = 'bulgarian-yogurt'),
  unnest(ARRAY['Традиционно кисело мляко', 'Овче кисело мляко', 'Биволско кисело мляко', 'Закваска за кисело мляко']),
  '🥛',
  generate_series(1, 4)
ON CONFLICT (slug) DO NOTHING;

-- Traditional Foods > Lukanka L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Karlovo Lukanka', 'Gornooryahovski Sudzhuk', 'Starozagorska Lukanka', 'Smoked Lukanka']),
  unnest(ARRAY['lukanka-karlovo', 'lukanka-sudzhuk', 'lukanka-starozagorska', 'lukanka-smoked']),
  (SELECT id FROM categories WHERE slug = 'lukanka'),
  unnest(ARRAY['Карловска луканка', 'Горнооряховски суджук', 'Старозагорска луканка', 'Пушена луканка']),
  '🥓',
  generate_series(1, 4)
ON CONFLICT (slug) DO NOTHING;

-- Traditional Foods > Rakia L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Grape Rakia', 'Plum Rakia', 'Apricot Rakia', 'Rose Rakia', 'Aged Rakia', 'Muskatova Rakia']),
  unnest(ARRAY['rakia-grape', 'rakia-plum', 'rakia-apricot', 'rakia-rose', 'rakia-aged', 'rakia-muskat']),
  (SELECT id FROM categories WHERE slug = 'rakia'),
  unnest(ARRAY['Гроздова ракия', 'Сливова ракия', 'Кайсиева ракия', 'Розова ракия', 'Отлежала ракия', 'Мускатова ракия']),
  '🍶',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Bulgarian Wine > Red Wine L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Mavrud', 'Gamza', 'Melnik', 'Rubin', 'Cabernet Sauvignon BG', 'Merlot BG']),
  unnest(ARRAY['wine-mavrud', 'wine-gamza', 'wine-melnik', 'wine-rubin', 'wine-bg-cabernet', 'wine-bg-merlot']),
  (SELECT id FROM categories WHERE slug = 'bg-red-wine'),
  unnest(ARRAY['Мавруд', 'Гъмза', 'Мелник', 'Рубин', 'Каберне Совиньон', 'Мерло']),
  '🍷',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Bulgarian Wine > Rosé Wine L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Dry Rosé', 'Semi-Dry Rosé', 'Sweet Rosé', 'Sparkling Rosé']),
  unnest(ARRAY['wine-rose-dry', 'wine-rose-semidry', 'wine-rose-sweet', 'wine-rose-sparkling']),
  (SELECT id FROM categories WHERE slug = 'bg-rose-wine'),
  unnest(ARRAY['Сухо розе', 'Полусухо розе', 'Сладко розе', 'Пенливо розе']),
  '🍷',
  generate_series(1, 4)
ON CONFLICT (slug) DO NOTHING;

-- Rose Products > Rose Oil L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Pure Rose Oil', 'Rose Essential Oil', 'Rose Absolute', 'Rose Hydrosol', 'Rose Oil Sets']),
  unnest(ARRAY['rose-oil-pure', 'rose-oil-essential', 'rose-oil-absolute', 'rose-oil-hydrosol', 'rose-oil-sets']),
  (SELECT id FROM categories WHERE slug = 'rose-oil'),
  unnest(ARRAY['Чисто розово масло', 'Етерично розово масло', 'Розов абсолют', 'Розов хидролат', 'Комплекти розово масло']),
  '🌹',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Rose Products > Rose Cosmetics L3s  
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Rose Face Creams', 'Rose Body Lotions', 'Rose Serums', 'Rose Masks', 'Rose Lip Care', 'Rose Hair Care']),
  unnest(ARRAY['rose-cream-face', 'rose-lotion-body', 'rose-serum', 'rose-mask', 'rose-lip', 'rose-hair']),
  (SELECT id FROM categories WHERE slug = 'bg-rose-cosmetics'),
  unnest(ARRAY['Розови кремове за лице', 'Розови лосиони за тяло', 'Розови серуми', 'Розови маски', 'Розова грижа за устни', 'Розова грижа за коса']),
  '🌹',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Rose Products > Rose Soap L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Handmade Rose Soap', 'Rose Glycerin Soap', 'Rose Liquid Soap', 'Rose Shower Gel', 'Rose Soap Bars']),
  unnest(ARRAY['rose-soap-handmade', 'rose-soap-glycerin', 'rose-soap-liquid', 'rose-shower-gel', 'rose-soap-bars']),
  (SELECT id FROM categories WHERE slug = 'rose-soap'),
  unnest(ARRAY['Ръчен розов сапун', 'Розов глицеринов сапун', 'Течен розов сапун', 'Розов душ гел', 'Розови сапуни']),
  '🧼',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Rose Products > Rose Jam L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Classic Rose Jam', 'Rose Petal Jam', 'Rose Hip Jam', 'Rose & Honey']),
  unnest(ARRAY['jam-rose-classic', 'jam-rose-petal', 'jam-rosehip', 'jam-rose-honey']),
  (SELECT id FROM categories WHERE slug = 'rose-jam'),
  unnest(ARRAY['Класическо сладко от рози', 'Сладко от розови листенца', 'Сладко от шипки', 'Рози с мед']),
  '🍯',
  generate_series(1, 4)
ON CONFLICT (slug) DO NOTHING;

-- Souvenirs > Martenitsi L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Traditional Martenitsi', 'Bracelet Martenitsi', 'Pijo & Penda', 'Designer Martenitsi', 'Martenitsi Sets']),
  unnest(ARRAY['martenitsi-traditional', 'martenitsi-bracelet', 'martenitsi-pijo-penda', 'martenitsi-designer', 'martenitsi-sets']),
  (SELECT id FROM categories WHERE slug = 'bg-martenitsi'),
  unnest(ARRAY['Традиционни мартеници', 'Мартеници гривни', 'Пижо и Пенда', 'Дизайнерски мартеници', 'Комплекти мартеници']),
  '❤️',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Souvenirs > Bulgarian Symbols L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Lion Symbols', 'Cyrillic Art', 'Bulgarian Flag Items', 'Historical Symbols', 'Thracian Symbols']),
  unnest(ARRAY['symbols-lion', 'symbols-cyrillic', 'symbols-flag', 'symbols-historical', 'symbols-thracian']),
  (SELECT id FROM categories WHERE slug = 'bg-symbols'),
  unnest(ARRAY['Символи с лъв', 'Кирилска азбука', 'Артикули с българско знаме', 'Исторически символи', 'Тракийски символи']),
  '🦁',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;
;
