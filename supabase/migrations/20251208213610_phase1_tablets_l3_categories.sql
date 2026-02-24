
-- Phase 1.2: Add L3 Tablet Categories

-- Add iPad Models under iPad L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['iPad Pro M4', 'iPad Air M2', 'iPad 10th Gen', 'iPad Mini 6', 'iPad Pro M2', 'iPad Pro M1', 'iPad 9th Gen']),
  unnest(ARRAY['ipad-pro-m4', 'ipad-air-m2', 'ipad-10th-gen', 'ipad-mini-6', 'ipad-pro-m2', 'ipad-pro-m1', 'ipad-9th-gen']),
  (SELECT id FROM categories WHERE slug = 'tablets-ipad'),
  unnest(ARRAY['iPad Pro M4', 'iPad Air M2', 'iPad 10-то Поколение', 'iPad Mini 6', 'iPad Pro M2', 'iPad Pro M1', 'iPad 9-то Поколение']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Samsung Tab Models under Samsung Tablets L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9', 'Galaxy Tab S9 FE', 'Galaxy Tab A9+', 'Galaxy Tab A9', 'Galaxy Tab S8 Series', 'Galaxy Tab S7 Series']),
  unnest(ARRAY['galaxy-tab-s9-ultra', 'galaxy-tab-s9-plus', 'galaxy-tab-s9', 'galaxy-tab-s9-fe', 'galaxy-tab-a9-plus', 'galaxy-tab-a9', 'galaxy-tab-s8-series', 'galaxy-tab-s7-series']),
  (SELECT id FROM categories WHERE slug = 'tablets-samsung'),
  unnest(ARRAY['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9', 'Galaxy Tab S9 FE', 'Galaxy Tab A9+', 'Galaxy Tab A9', 'Galaxy Tab S8 Серия', 'Galaxy Tab S7 Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Android Tablet Brands under Android Tablets L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Xiaomi Pad 6 Series', 'Xiaomi Pad 5 Series', 'Lenovo Tab P12', 'Lenovo Tab P11', 'Amazon Fire HD 10', 'Amazon Fire HD 8', 'Amazon Fire 7', 'Huawei MatePad Series', 'OnePlus Pad']),
  unnest(ARRAY['xiaomi-pad-6-series', 'xiaomi-pad-5-series', 'lenovo-tab-p12', 'lenovo-tab-p11', 'amazon-fire-hd-10', 'amazon-fire-hd-8', 'amazon-fire-7', 'huawei-matepad-series', 'oneplus-pad']),
  (SELECT id FROM categories WHERE slug = 'tablets-android'),
  unnest(ARRAY['Xiaomi Pad 6 Серия', 'Xiaomi Pad 5 Серия', 'Lenovo Tab P12', 'Lenovo Tab P11', 'Amazon Fire HD 10', 'Amazon Fire HD 8', 'Amazon Fire 7', 'Huawei MatePad Серия', 'OnePlus Pad']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add E-Reader Models under E-Readers L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Kindle Paperwhite', 'Kindle Oasis', 'Kindle Scribe', 'Kindle Basic', 'Kobo Libra', 'Kobo Sage', 'Kobo Clara', 'Kobo Elipsa', 'PocketBook InkPad', 'Onyx Boox']),
  unnest(ARRAY['kindle-paperwhite', 'kindle-oasis', 'kindle-scribe', 'kindle-basic', 'kobo-libra', 'kobo-sage', 'kobo-clara', 'kobo-elipsa', 'pocketbook-inkpad', 'onyx-boox']),
  (SELECT id FROM categories WHERE slug = 'e-readers'),
  unnest(ARRAY['Kindle Paperwhite', 'Kindle Oasis', 'Kindle Scribe', 'Kindle Basic', 'Kobo Libra', 'Kobo Sage', 'Kobo Clara', 'Kobo Elipsa', 'PocketBook InkPad', 'Onyx Boox']),
  '📚'
ON CONFLICT (slug) DO NOTHING;

-- Add Lenovo Tab Models under Lenovo Tablets L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tab P12 Pro', 'Tab P11 Pro', 'Tab M10 Plus', 'Tab M9', 'Tab M8', 'Yoga Tab Series']),
  unnest(ARRAY['lenovo-tab-p12-pro', 'lenovo-tab-p11-pro', 'lenovo-tab-m10-plus', 'lenovo-tab-m9', 'lenovo-tab-m8', 'lenovo-yoga-tab-series']),
  (SELECT id FROM categories WHERE slug = 'tablets-lenovo'),
  unnest(ARRAY['Tab P12 Pro', 'Tab P11 Pro', 'Tab M10 Plus', 'Tab M9', 'Tab M8', 'Yoga Tab Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Kids Tablet Brands under Kids Tablets L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Amazon Fire Kids', 'Samsung Kids Tab', 'Lenovo Kids Tab', 'Educational Tablets', 'Learning Tablets']),
  unnest(ARRAY['amazon-fire-kids', 'samsung-kids-tab', 'lenovo-kids-tab', 'educational-tablets', 'learning-tablets']),
  (SELECT id FROM categories WHERE slug = 'tablets-kids'),
  unnest(ARRAY['Amazon Fire Kids', 'Samsung Kids Tab', 'Lenovo Kids Tab', 'Образователни Таблети', 'Таблети за Учене']),
  '🧒'
ON CONFLICT (slug) DO NOTHING;

-- Add Windows Tablet Models under Windows Tablets L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Surface Pro 9', 'Surface Pro 8', 'Surface Go 3', 'HP Elite x2', 'Lenovo ThinkPad X12', 'Dell Latitude Tablets', 'ASUS ProArt']),
  unnest(ARRAY['surface-pro-9', 'surface-pro-8', 'surface-go-3', 'hp-elite-x2', 'lenovo-thinkpad-x12', 'dell-latitude-tablets', 'asus-proart-tablet']),
  (SELECT id FROM categories WHERE slug = 'tablets-windows'),
  unnest(ARRAY['Surface Pro 9', 'Surface Pro 8', 'Surface Go 3', 'HP Elite x2', 'Lenovo ThinkPad X12', 'Dell Latitude Таблети', 'ASUS ProArt']),
  '💻'
ON CONFLICT (slug) DO NOTHING;
;
