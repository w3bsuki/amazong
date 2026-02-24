
-- Phase 3.4.3: Kids L3 Categories - Diapering & Potty

-- Changing Pads L3 (parent: changing-pads)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Contoured Pads', 'Flat Pads', 'Portable Pads', 'Waterproof Pads', 'Pad Covers']),
  unnest(ARRAY['cpad-contour', 'cpad-flat', 'cpad-portable', 'cpad-waterproof', 'cpad-cover']),
  (SELECT id FROM categories WHERE slug = 'changing-pads'),
  unnest(ARRAY['Контурни', 'Плоски', 'Преносими', 'Водоустойчиви', 'Калъфи']),
  '🛏️'
ON CONFLICT (slug) DO NOTHING;

-- Changing Supplies L3 (parent: diaper-changing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Changing Mats', 'Diaper Caddies', 'Changing Accessories', 'Disposable Liners']),
  unnest(ARRAY['change-mat', 'change-caddy', 'change-acc', 'change-liner']),
  (SELECT id FROM categories WHERE slug = 'diaper-changing'),
  unnest(ARRAY['Постелки', 'Органайзери', 'Аксесоари', 'Подложки']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Cloth Diapers L3 (parent: diaper-cloth)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['All-in-One', 'Pocket Diapers', 'Prefolds', 'Covers', 'Inserts', 'Swim Diapers']),
  unnest(ARRAY['cloth-aio', 'cloth-pocket', 'cloth-prefold', 'cloth-cover', 'cloth-insert', 'cloth-swim']),
  (SELECT id FROM categories WHERE slug = 'diaper-cloth'),
  unnest(ARRAY['Всичко в едно', 'С джоб', 'Сгънати', 'Калъфи', 'Вложки', 'За плуване']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Cloth Diapers (duplicate) L3 (parent: cloth-diapers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fitted Diapers', 'Hybrid Diapers', 'Flat Diapers', 'Diaper Sprayers']),
  unnest(ARRAY['cloth2-fitted', 'cloth2-hybrid', 'cloth2-flat', 'cloth2-spray']),
  (SELECT id FROM categories WHERE slug = 'cloth-diapers'),
  unnest(ARRAY['Оформени', 'Хибридни', 'Плоски', 'Спрейове']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Diaper Bags L3 (parent: diaper-bags)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Shoulder Bags', 'Mini Bags', 'Designer Bags', 'Insulated Bags']),
  unnest(ARRAY['dbag2-shoulder', 'dbag2-mini', 'dbag2-designer', 'dbag2-insulated']),
  (SELECT id FROM categories WHERE slug = 'diaper-bags'),
  unnest(ARRAY['За рамо', 'Мини', 'Дизайнерски', 'Изолирани']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Diaper Cream L3 (parent: diaper-cream)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Zinc Oxide Cream', 'Barrier Cream', 'Organic Cream', 'Petroleum Jelly', 'Powder']),
  unnest(ARRAY['cream-zinc', 'cream-barrier', 'cream-organic', 'cream-petroleum', 'cream-powder']),
  (SELECT id FROM categories WHERE slug = 'diaper-cream'),
  unnest(ARRAY['С цинков оксид', 'Бариерен', 'Органичен', 'Вазелин', 'Пудра']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Diaper Pails L3 (parent: diaper-pails)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Odor Lock Pails', 'Step Pails', 'Hands-Free Pails', 'Pail Refills', 'Portable Pails']),
  unnest(ARRAY['pail-odor', 'pail-step', 'pail-hands', 'pail-refill', 'pail-portable']),
  (SELECT id FROM categories WHERE slug = 'diaper-pails'),
  unnest(ARRAY['Срещу миризми', 'С педал', 'Без ръце', 'Пълнители', 'Преносими']),
  '🗑️'
ON CONFLICT (slug) DO NOTHING;

-- Diaper Rash Care L3 (parent: diaper-rash)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Treatment Cream', 'Prevention Cream', 'Healing Ointment', 'Spray Treatment']),
  unnest(ARRAY['rash-treat', 'rash-prevent', 'rash-ointment', 'rash-spray']),
  (SELECT id FROM categories WHERE slug = 'diaper-rash'),
  unnest(ARRAY['Лечебен', 'Превантивен', 'Мехлем', 'Спрей']),
  '🩹'
ON CONFLICT (slug) DO NOTHING;

-- Diapers L3 (parent: diapers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Newborn Diapers', 'Size 1', 'Size 2', 'Size 3', 'Size 4', 'Size 5', 'Size 6', 'Overnight Diapers']),
  unnest(ARRAY['diaper-nb', 'diaper-s1', 'diaper-s2', 'diaper-s3', 'diaper-s4', 'diaper-s5', 'diaper-s6', 'diaper-night']),
  (SELECT id FROM categories WHERE slug = 'diapers'),
  unnest(ARRAY['Новородени', 'Размер 1', 'Размер 2', 'Размер 3', 'Размер 4', 'Размер 5', 'Размер 6', 'Нощни']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Disposable Diapers L3 (parent: diaper-disposable)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Regular Diapers', 'Eco-Friendly', 'Sensitive Skin', 'Training Pants', 'Pull-Ups']),
  unnest(ARRAY['disp-regular', 'disp-eco', 'disp-sensitive', 'disp-training', 'disp-pullup']),
  (SELECT id FROM categories WHERE slug = 'diaper-disposable'),
  unnest(ARRAY['Обикновени', 'Еко', 'За чувствителна кожа', 'За обучение', 'Pull-Ups']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Potty Training L3 (parent: diaper-potty)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Potty Chairs', 'Potty Seats', 'Step Stools', 'Training Pants', 'Potty Books', 'Reward Charts']),
  unnest(ARRAY['potty-chair', 'potty-seat', 'potty-stool', 'potty-pants', 'potty-books', 'potty-chart']),
  (SELECT id FROM categories WHERE slug = 'diaper-potty'),
  unnest(ARRAY['Гърнета', 'Седалки', 'Стъпала', 'Тренировъчни гащи', 'Книжки', 'Графики за награди']),
  '🚽'
ON CONFLICT (slug) DO NOTHING;

-- Rash Creams L3 (parent: rash-creams)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Maximum Strength', 'Natural Formulas', 'Daily Prevention', 'Medicated']),
  unnest(ARRAY['rashc-max', 'rashc-natural', 'rashc-daily', 'rashc-medicated']),
  (SELECT id FROM categories WHERE slug = 'rash-creams'),
  unnest(ARRAY['Максимална сила', 'Натурални', 'За ежедневна защита', 'Лечебни']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Wipes L3 (parent: wipes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Sensitive Wipes', 'Fragrance Free', 'Flushable Wipes', 'Water Wipes', 'Thick Wipes', 'Travel Wipes']),
  unnest(ARRAY['wipe-sensitive', 'wipe-fragrance', 'wipe-flush', 'wipe-water', 'wipe-thick', 'wipe-travel']),
  (SELECT id FROM categories WHERE slug = 'wipes'),
  unnest(ARRAY['За чувствителна кожа', 'Без аромат', 'За тоалетна', 'Водни', 'Дебели', 'За пътуване']),
  '🧻'
ON CONFLICT (slug) DO NOTHING;

-- Wipes & Creams L3 (parent: diaper-wipes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Wipe Warmers', 'Wipe Dispensers', 'Bulk Wipes', 'Wipe Cases']),
  unnest(ARRAY['wipec-warm', 'wipec-dispense', 'wipec-bulk', 'wipec-case']),
  (SELECT id FROM categories WHERE slug = 'diaper-wipes'),
  unnest(ARRAY['Загряващи', 'Дозатори', 'На едро', 'Кутии']),
  '🧻'
ON CONFLICT (slug) DO NOTHING;
;
