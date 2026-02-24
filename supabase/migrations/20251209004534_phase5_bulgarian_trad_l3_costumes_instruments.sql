
-- Phase 5: Bulgarian Traditional - Folk Costumes & Instruments L3s

-- Bulgarian Folk Costumes > Regional costumes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Men''s Dobrudzha', 'Women''s Dobrudzha', 'Children''s Dobrudzha']),
  unnest(ARRAY['dobrudzha-mens', 'dobrudzha-womens', 'dobrudzha-kids']),
  (SELECT id FROM categories WHERE slug = 'dobrudzha-costumes'),
  unnest(ARRAY['Мъжки добруджански', 'Дамски добруджански', 'Детски добруджански']),
  '👔',
  generate_series(1, 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Men''s Rhodope', 'Women''s Rhodope', 'Children''s Rhodope']),
  unnest(ARRAY['rhodope-mens', 'rhodope-womens', 'rhodope-kids']),
  (SELECT id FROM categories WHERE slug = 'rhodope-costumes'),
  unnest(ARRAY['Мъжки родопски', 'Дамски родопски', 'Детски родопски']),
  '👔',
  generate_series(1, 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Men''s Shopluk', 'Women''s Shopluk', 'Children''s Shopluk']),
  unnest(ARRAY['shopluk-mens', 'shopluk-womens', 'shopluk-kids']),
  (SELECT id FROM categories WHERE slug = 'shopluk-costumes'),
  unnest(ARRAY['Мъжки шопски', 'Дамски шопски', 'Детски шопски']),
  '👔',
  generate_series(1, 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Men''s Thracian', 'Women''s Thracian', 'Children''s Thracian']),
  unnest(ARRAY['thracian-mens', 'thracian-womens', 'thracian-kids']),
  (SELECT id FROM categories WHERE slug = 'thracian-costumes'),
  unnest(ARRAY['Мъжки тракийски', 'Дамски тракийски', 'Детски тракийски']),
  '👔',
  generate_series(1, 3)
ON CONFLICT (slug) DO NOTHING;

-- Folk Accessories L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Folk Headwear', 'Folk Jewelry', 'Folk Belts', 'Folk Footwear', 'Folk Bags & Pouches']),
  unnest(ARRAY['folk-headwear', 'folk-jewelry-bg', 'folk-belts', 'folk-footwear', 'folk-bags']),
  (SELECT id FROM categories WHERE slug = 'folk-accessories'),
  unnest(ARRAY['Народни шапки', 'Народни бижута', 'Народни колани', 'Народни обувки', 'Народни торби и калъфи']),
  '👒',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Bulgarian Instruments > Gaida L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Kaba Gaida', 'Thracian Gaida', 'Rhodope Gaida', 'Shopska Gaida', 'Gaida Accessories']),
  unnest(ARRAY['gaida-kaba', 'gaida-thracian', 'gaida-rhodope', 'gaida-shopska', 'gaida-accessories']),
  (SELECT id FROM categories WHERE slug = 'gaida'),
  unnest(ARRAY['Каба гайда', 'Тракийска гайда', 'Родопска гайда', 'Шопска гайда', 'Аксесоари за гайда']),
  '🎵',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Bulgarian Instruments > Gadulka L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Traditional Gadulka', 'Concert Gadulka', 'Gadulka Bows', 'Gadulka Strings', 'Gadulka Accessories']),
  unnest(ARRAY['gadulka-traditional', 'gadulka-concert', 'gadulka-bows', 'gadulka-strings', 'gadulka-accessories']),
  (SELECT id FROM categories WHERE slug = 'gadulka'),
  unnest(ARRAY['Традиционна гъдулка', 'Концертна гъдулка', 'Лъкове за гъдулка', 'Струни за гъдулка', 'Аксесоари за гъдулка']),
  '🎻',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Bulgarian Instruments > Kaval L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Traditional Kaval', 'Concert Kaval', 'Alto Kaval', 'Tenor Kaval', 'Kaval Accessories']),
  unnest(ARRAY['kaval-traditional', 'kaval-concert', 'kaval-alto', 'kaval-tenor', 'kaval-accessories']),
  (SELECT id FROM categories WHERE slug = 'kaval'),
  unnest(ARRAY['Традиционен кавал', 'Концертен кавал', 'Алтов кавал', 'Теноров кавал', 'Аксесоари за кавал']),
  '🎶',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Bulgarian Instruments > Tambura L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Bulgarian Tambura', 'Concert Tambura', 'Tambura Picks', 'Tambura Strings', 'Tambura Accessories']),
  unnest(ARRAY['tambura-bulgarian', 'tambura-concert', 'tambura-picks', 'tambura-strings', 'tambura-accessories']),
  (SELECT id FROM categories WHERE slug = 'tambura'),
  unnest(ARRAY['Българска тамбура', 'Концертна тамбура', 'Пластинки за тамбура', 'Струни за тамбура', 'Аксесоари за тамбура']),
  '🎸',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Bulgarian Instruments > Tapan L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Traditional Tapan', 'Professional Tapan', 'Tapan Drumsticks', 'Tapan Skins', 'Tapan Accessories']),
  unnest(ARRAY['tapan-traditional', 'tapan-professional', 'tapan-sticks', 'tapan-skins', 'tapan-accessories']),
  (SELECT id FROM categories WHERE slug = 'tapan'),
  unnest(ARRAY['Традиционен тъпан', 'Професионален тъпан', 'Пръчки за тъпан', 'Кожи за тъпан', 'Аксесоари за тъпан']),
  '🥁',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;
;
