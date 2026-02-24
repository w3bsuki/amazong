
-- Phase 1.1: Add L3 Smartphone Categories
-- Add Google Pixel Series under Google Pixel L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pixel 9 Pro Series', 'Pixel 9 Series', 'Pixel 8 Pro Series', 'Pixel 8 Series', 'Pixel 7 Pro Series', 'Pixel 7 Series', 'Pixel Fold', 'Pixel Budget Series']),
  unnest(ARRAY['pixel-9-pro-series', 'pixel-9-series', 'pixel-8-pro-series', 'pixel-8-series', 'pixel-7-pro-series', 'pixel-7-series', 'pixel-fold', 'pixel-budget-series']),
  (SELECT id FROM categories WHERE slug = 'smartphones-pixel'),
  unnest(ARRAY['Pixel 9 Pro Серия', 'Pixel 9 Серия', 'Pixel 8 Pro Серия', 'Pixel 8 Серия', 'Pixel 7 Pro Серия', 'Pixel 7 Серия', 'Pixel Fold', 'Pixel Бюджетна Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Xiaomi Series under Xiaomi L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Xiaomi 14 Series', 'Xiaomi 13 Series', 'Xiaomi 12 Series', 'Redmi Note 13 Series', 'Redmi Note 12 Series', 'Redmi 13 Series', 'POCO F Series', 'POCO X Series', 'POCO M Series']),
  unnest(ARRAY['xiaomi-14-series', 'xiaomi-13-series', 'xiaomi-12-series', 'redmi-note-13-series', 'redmi-note-12-series', 'redmi-13-series', 'poco-f-series', 'poco-x-series', 'poco-m-series']),
  (SELECT id FROM categories WHERE slug = 'smartphones-xiaomi'),
  unnest(ARRAY['Xiaomi 14 Серия', 'Xiaomi 13 Серия', 'Xiaomi 12 Серия', 'Redmi Note 13 Серия', 'Redmi Note 12 Серия', 'Redmi 13 Серия', 'POCO F Серия', 'POCO X Серия', 'POCO M Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add OnePlus Series under OnePlus L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['OnePlus 12 Series', 'OnePlus 11 Series', 'OnePlus 10 Series', 'OnePlus Nord 4', 'OnePlus Nord 3', 'OnePlus Nord CE Series', 'OnePlus Open']),
  unnest(ARRAY['oneplus-12-series', 'oneplus-11-series', 'oneplus-10-series', 'oneplus-nord-4', 'oneplus-nord-3', 'oneplus-nord-ce-series', 'oneplus-open']),
  (SELECT id FROM categories WHERE slug = 'smartphones-oneplus'),
  unnest(ARRAY['OnePlus 12 Серия', 'OnePlus 11 Серия', 'OnePlus 10 Серия', 'OnePlus Nord 4', 'OnePlus Nord 3', 'OnePlus Nord CE Серия', 'OnePlus Open']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Huawei Series under Huawei L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Huawei Mate 60 Series', 'Huawei P60 Series', 'Huawei P50 Series', 'Huawei Nova Series', 'Huawei Mate X Series']),
  unnest(ARRAY['huawei-mate-60-series', 'huawei-p60-series', 'huawei-p50-series', 'huawei-nova-series', 'huawei-mate-x-series']),
  (SELECT id FROM categories WHERE slug = 'smartphones-huawei'),
  unnest(ARRAY['Huawei Mate 60 Серия', 'Huawei P60 Серия', 'Huawei P50 Серия', 'Huawei Nova Серия', 'Huawei Mate X Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Motorola Series under Motorola L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Motorola Edge Series', 'Motorola Razr Series', 'Moto G Series', 'Moto E Series', 'ThinkPhone']),
  unnest(ARRAY['motorola-edge-series', 'motorola-razr-series', 'moto-g-series', 'moto-e-series', 'thinkphone']),
  (SELECT id FROM categories WHERE slug = 'smartphones-motorola'),
  unnest(ARRAY['Motorola Edge Серия', 'Motorola Razr Серия', 'Moto G Серия', 'Moto E Серия', 'ThinkPhone']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Honor Series under Honor L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Honor Magic 6 Series', 'Honor Magic 5 Series', 'Honor 90 Series', 'Honor X Series', 'Honor Magic Fold']),
  unnest(ARRAY['honor-magic-6-series', 'honor-magic-5-series', 'honor-90-series', 'honor-x-series', 'honor-magic-fold']),
  (SELECT id FROM categories WHERE slug = 'smartphones-honor'),
  unnest(ARRAY['Honor Magic 6 Серия', 'Honor Magic 5 Серия', 'Honor 90 Серия', 'Honor X Серия', 'Honor Magic Fold']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Realme Series under Realme L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Realme GT 5 Series', 'Realme GT 3 Series', 'Realme 12 Pro Series', 'Realme 11 Series', 'Realme C Series', 'Realme Narzo Series']),
  unnest(ARRAY['realme-gt-5-series', 'realme-gt-3-series', 'realme-12-pro-series', 'realme-11-series', 'realme-c-series', 'realme-narzo-series']),
  (SELECT id FROM categories WHERE slug = 'smartphones-realme'),
  unnest(ARRAY['Realme GT 5 Серия', 'Realme GT 3 Серия', 'Realme 12 Pro Серия', 'Realme 11 Серия', 'Realme C Серия', 'Realme Narzo Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Oppo Series under Oppo L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Oppo Find X7 Series', 'Oppo Find X6 Series', 'Oppo Find N Series', 'Oppo Reno 11 Series', 'Oppo Reno 10 Series', 'Oppo A Series']),
  unnest(ARRAY['oppo-find-x7-series', 'oppo-find-x6-series', 'oppo-find-n-series', 'oppo-reno-11-series', 'oppo-reno-10-series', 'oppo-a-series']),
  (SELECT id FROM categories WHERE slug = 'smartphones-oppo'),
  unnest(ARRAY['Oppo Find X7 Серия', 'Oppo Find X6 Серия', 'Oppo Find N Серия', 'Oppo Reno 11 Серия', 'Oppo Reno 10 Серия', 'Oppo A Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Vivo Series under Vivo L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Vivo X100 Series', 'Vivo X90 Series', 'Vivo X Fold Series', 'Vivo V30 Series', 'Vivo Y Series', 'iQOO Series']),
  unnest(ARRAY['vivo-x100-series', 'vivo-x90-series', 'vivo-x-fold-series', 'vivo-v30-series', 'vivo-y-series', 'iqoo-series']),
  (SELECT id FROM categories WHERE slug = 'smartphones-vivo'),
  unnest(ARRAY['Vivo X100 Серия', 'Vivo X90 Серия', 'Vivo X Fold Серия', 'Vivo V30 Серия', 'Vivo Y Серия', 'iQOO Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Nokia Series under Nokia L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nokia X Series', 'Nokia G Series', 'Nokia C Series', 'Nokia XR Series']),
  unnest(ARRAY['nokia-x-series', 'nokia-g-series', 'nokia-c-series', 'nokia-xr-series']),
  (SELECT id FROM categories WHERE slug = 'smartphones-nokia'),
  unnest(ARRAY['Nokia X Серия', 'Nokia G Серия', 'Nokia C Серия', 'Nokia XR Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Sony Xperia Series under Sony L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Xperia 1 Series', 'Xperia 5 Series', 'Xperia 10 Series', 'Xperia Pro Series']),
  unnest(ARRAY['xperia-1-series', 'xperia-5-series', 'xperia-10-series', 'xperia-pro-series']),
  (SELECT id FROM categories WHERE slug = 'smartphones-sony'),
  unnest(ARRAY['Xperia 1 Серия', 'Xperia 5 Серия', 'Xperia 10 Серия', 'Xperia Pro Серия']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add Nothing Phone Series under Nothing L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nothing Phone 2a', 'Nothing Phone 2', 'Nothing Phone 1', 'CMF Phone']),
  unnest(ARRAY['nothing-phone-2a', 'nothing-phone-2', 'nothing-phone-1', 'cmf-phone']),
  (SELECT id FROM categories WHERE slug = 'smartphones-nothing'),
  unnest(ARRAY['Nothing Phone 2a', 'Nothing Phone 2', 'Nothing Phone 1', 'CMF Phone']),
  '📱'
ON CONFLICT (slug) DO NOTHING;
;
