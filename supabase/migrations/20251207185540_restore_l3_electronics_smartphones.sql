
-- Restore L3 categories for Smartphones
-- First get parent IDs

-- iPhone L3 categories under smartphones-iphone (5151e58c-5c54-4e03-adb0-414f29195a6c)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('iPhone 16 Pro Max', 'iphone-16-pro-max', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone 16 Pro Max', 1),
  ('iPhone 16 Pro', 'iphone-16-pro', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone 16 Pro', 2),
  ('iPhone 16 Plus', 'iphone-16-plus', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone 16 Plus', 3),
  ('iPhone 16', 'iphone-16', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone 16', 4),
  ('iPhone 15 Pro Max', 'iphone-15-pro-max', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone 15 Pro Max', 5),
  ('iPhone 15 Pro', 'iphone-15-pro', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone 15 Pro', 6),
  ('iPhone 15 Plus', 'iphone-15-plus', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone 15 Plus', 7),
  ('iPhone 15', 'iphone-15', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone 15', 8),
  ('iPhone 14 Series', 'iphone-14-series', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'Серия iPhone 14', 9),
  ('iPhone 13 Series', 'iphone-13-series', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'Серия iPhone 13', 10),
  ('iPhone SE', 'iphone-se', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone SE', 11),
  ('iPhone 12 & Earlier', 'iphone-12-earlier', '5151e58c-5c54-4e03-adb0-414f29195a6c', 'iPhone 12 и по-ранни', 12)
ON CONFLICT (slug) DO NOTHING;

-- Samsung L3 categories under smartphones-samsung (ded04255-f46e-4590-8a5a-bb8d6fd8fc48)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Galaxy S24 Ultra', 'galaxy-s24-ultra', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Galaxy S24 Ultra', 1),
  ('Galaxy S24+', 'galaxy-s24-plus', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Galaxy S24+', 2),
  ('Galaxy S24', 'galaxy-s24', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Galaxy S24', 3),
  ('Galaxy Z Fold 6', 'galaxy-z-fold-6', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Galaxy Z Fold 6', 4),
  ('Galaxy Z Flip 6', 'galaxy-z-flip-6', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Galaxy Z Flip 6', 5),
  ('Galaxy Z Fold 5', 'galaxy-z-fold-5', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Galaxy Z Fold 5', 6),
  ('Galaxy Z Flip 5', 'galaxy-z-flip-5', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Galaxy Z Flip 5', 7),
  ('Galaxy S23 Series', 'galaxy-s23-series', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Серия Galaxy S23', 8),
  ('Galaxy A Series', 'galaxy-a-series', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Серия Galaxy A', 9),
  ('Galaxy M Series', 'galaxy-m-series', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Серия Galaxy M', 10),
  ('Galaxy FE Series', 'galaxy-fe-series', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 'Серия Galaxy FE', 11)
ON CONFLICT (slug) DO NOTHING;

-- Xiaomi L3 categories under smartphones-xiaomi (0af09851-cd56-4360-bfaa-c8b6775b7077)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Xiaomi 14 Ultra', 'xiaomi-14-ultra', '0af09851-cd56-4360-bfaa-c8b6775b7077', 'Xiaomi 14 Ultra', 1),
  ('Xiaomi 14 Pro', 'xiaomi-14-pro', '0af09851-cd56-4360-bfaa-c8b6775b7077', 'Xiaomi 14 Pro', 2),
  ('Xiaomi 14', 'xiaomi-14', '0af09851-cd56-4360-bfaa-c8b6775b7077', 'Xiaomi 14', 3),
  ('Xiaomi 13 Series', 'xiaomi-13-series', '0af09851-cd56-4360-bfaa-c8b6775b7077', 'Серия Xiaomi 13', 4),
  ('Redmi Note 13 Series', 'redmi-note-13-series', '0af09851-cd56-4360-bfaa-c8b6775b7077', 'Серия Redmi Note 13', 5),
  ('Redmi Note 12 Series', 'redmi-note-12-series', '0af09851-cd56-4360-bfaa-c8b6775b7077', 'Серия Redmi Note 12', 6),
  ('Redmi Series', 'redmi-series', '0af09851-cd56-4360-bfaa-c8b6775b7077', 'Серия Redmi', 7),
  ('POCO Series', 'poco-series', '0af09851-cd56-4360-bfaa-c8b6775b7077', 'Серия POCO', 8)
ON CONFLICT (slug) DO NOTHING;

-- Google Pixel L3 categories under smartphones-pixel (7a5b4ebe-9935-4f75-92e7-50152abbbb42)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Pixel 9 Pro XL', 'pixel-9-pro-xl', '7a5b4ebe-9935-4f75-92e7-50152abbbb42', 'Pixel 9 Pro XL', 1),
  ('Pixel 9 Pro', 'pixel-9-pro', '7a5b4ebe-9935-4f75-92e7-50152abbbb42', 'Pixel 9 Pro', 2),
  ('Pixel 9 Pro Fold', 'pixel-9-pro-fold', '7a5b4ebe-9935-4f75-92e7-50152abbbb42', 'Pixel 9 Pro Fold', 3),
  ('Pixel 9', 'pixel-9', '7a5b4ebe-9935-4f75-92e7-50152abbbb42', 'Pixel 9', 4),
  ('Pixel 8 Series', 'pixel-8-series', '7a5b4ebe-9935-4f75-92e7-50152abbbb42', 'Серия Pixel 8', 5),
  ('Pixel 7 Series', 'pixel-7-series', '7a5b4ebe-9935-4f75-92e7-50152abbbb42', 'Серия Pixel 7', 6),
  ('Pixel A Series', 'pixel-a-series', '7a5b4ebe-9935-4f75-92e7-50152abbbb42', 'Серия Pixel A', 7)
ON CONFLICT (slug) DO NOTHING;

-- OnePlus L3 categories under smartphones-oneplus (819f7866-994c-4b56-85a9-d8d0ff60c20d)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('OnePlus 12', 'oneplus-12', '819f7866-994c-4b56-85a9-d8d0ff60c20d', 'OnePlus 12', 1),
  ('OnePlus 12R', 'oneplus-12r', '819f7866-994c-4b56-85a9-d8d0ff60c20d', 'OnePlus 12R', 2),
  ('OnePlus Open', 'oneplus-open', '819f7866-994c-4b56-85a9-d8d0ff60c20d', 'OnePlus Open', 3),
  ('OnePlus Nord Series', 'oneplus-nord-series', '819f7866-994c-4b56-85a9-d8d0ff60c20d', 'Серия OnePlus Nord', 4),
  ('OnePlus Ace Series', 'oneplus-ace-series', '819f7866-994c-4b56-85a9-d8d0ff60c20d', 'Серия OnePlus Ace', 5)
ON CONFLICT (slug) DO NOTHING;
;
