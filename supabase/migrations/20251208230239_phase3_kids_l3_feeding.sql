
-- Phase 3.4.1: Kids L3 Categories - Baby Feeding

-- Baby Bibs L3 (parent: baby-bibs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Silicone Bibs', 'Cloth Bibs', 'Disposable Bibs', 'Bandana Bibs', 'Smock Bibs', 'Waterproof Bibs']),
  unnest(ARRAY['bib-silicone', 'bib-cloth', 'bib-disposable', 'bib-bandana', 'bib-smock', 'bib-waterproof']),
  (SELECT id FROM categories WHERE slug = 'baby-bibs'),
  unnest(ARRAY['Силиконови', 'Текстилни', 'Еднократни', 'Бандана', 'Престилки', 'Водоустойчиви']),
  '🍼'
ON CONFLICT (slug) DO NOTHING;

-- Baby Bottles L3 (parent: baby-bottles)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Glass Bottles', 'Plastic Bottles', 'Anti-Colic Bottles', 'Wide Neck Bottles', 'Standard Bottles', 'Disposable Bottles']),
  unnest(ARRAY['bottle-glass', 'bottle-plastic', 'bottle-anticolic', 'bottle-wide', 'bottle-standard', 'bottle-disp']),
  (SELECT id FROM categories WHERE slug = 'baby-bottles'),
  unnest(ARRAY['Стъклени', 'Пластмасови', 'Антиколик', 'Широко гърло', 'Стандартни', 'Еднократни']),
  '🍼'
ON CONFLICT (slug) DO NOTHING;

-- Baby Food L3 (parent: baby-food)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Purees', 'Cereals', 'Snacks', 'Organic Baby Food', 'Stage 1 Food', 'Stage 2 Food', 'Stage 3 Food']),
  unnest(ARRAY['food-puree', 'food-cereal', 'food-snack', 'food-organic', 'food-stage1', 'food-stage2', 'food-stage3']),
  (SELECT id FROM categories WHERE slug = 'baby-food'),
  unnest(ARRAY['Пюрета', 'Каши', 'Снаксове', 'Органични', 'Етап 1', 'Етап 2', 'Етап 3']),
  '🥣'
ON CONFLICT (slug) DO NOTHING;

-- Baby Food Makers L3 (parent: baby-food-makers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Blenders', 'Steamers', 'All-in-One Makers', 'Processor Sets', 'Storage Containers']),
  unnest(ARRAY['maker-blender', 'maker-steamer', 'maker-allinone', 'maker-processor', 'maker-storage']),
  (SELECT id FROM categories WHERE slug = 'baby-food-makers'),
  unnest(ARRAY['Блендери', 'Парни уреди', 'Комбинирани', 'Процесори', 'Контейнери']),
  '🥄'
ON CONFLICT (slug) DO NOTHING;

-- Baby Spoons & Utensils L3 (parent: baby-utensils)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Soft Tip Spoons', 'Self-Feeding Spoons', 'Fork Sets', 'Training Utensils', 'Travel Utensils']),
  unnest(ARRAY['utensil-soft', 'utensil-self', 'utensil-fork', 'utensil-training', 'utensil-travel']),
  (SELECT id FROM categories WHERE slug = 'baby-utensils'),
  unnest(ARRAY['Меки лъжици', 'За самохранене', 'Вилички', 'За обучение', 'За пътуване']),
  '🥄'
ON CONFLICT (slug) DO NOTHING;

-- Bottle Warmers L3 (parent: bottle-warmers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Electric Warmers', 'Portable Warmers', 'Car Warmers', 'Travel Warmers', 'Fast Warmers']),
  unnest(ARRAY['warmer-electric', 'warmer-portable', 'warmer-car', 'warmer-travel', 'warmer-fast']),
  (SELECT id FROM categories WHERE slug = 'bottle-warmers'),
  unnest(ARRAY['Електрически', 'Преносими', 'За кола', 'За пътуване', 'Бързи']),
  '🔥'
ON CONFLICT (slug) DO NOTHING;

-- Bottles & Nipples L3 (parent: feed-bottles)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Slow Flow Nipples', 'Medium Flow Nipples', 'Fast Flow Nipples', 'Variable Flow', 'Replacement Nipples']),
  unnest(ARRAY['nipple-slow', 'nipple-medium', 'nipple-fast', 'nipple-variable', 'nipple-replace']),
  (SELECT id FROM categories WHERE slug = 'feed-bottles'),
  unnest(ARRAY['Бавен поток', 'Среден поток', 'Бърз поток', 'Променлив', 'Резервни биберони']),
  '🍼'
ON CONFLICT (slug) DO NOTHING;

-- Breast Pumps L3 (parent: breast-pumps)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Electric Pumps', 'Manual Pumps', 'Double Pumps', 'Wearable Pumps', 'Hospital Grade', 'Pump Accessories']),
  unnest(ARRAY['pump-electric', 'pump-manual', 'pump-double', 'pump-wearable', 'pump-hospital', 'pump-accessories']),
  (SELECT id FROM categories WHERE slug = 'breast-pumps'),
  unnest(ARRAY['Електрически', 'Ръчни', 'Двойни', 'Носими', 'Болнични', 'Аксесоари']),
  '🤱'
ON CONFLICT (slug) DO NOTHING;

-- Breastfeeding L3 (parent: feed-breastfeeding)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nursing Covers', 'Breast Pads', 'Nipple Cream', 'Milk Storage Bags', 'Nursing Bras', 'Lactation Support']),
  unnest(ARRAY['bf-covers', 'bf-pads', 'bf-cream', 'bf-bags', 'bf-bras', 'bf-support']),
  (SELECT id FROM categories WHERE slug = 'feed-breastfeeding'),
  unnest(ARRAY['Покривала', 'Подложки', 'Крем', 'Торбички за мляко', 'Сутиени', 'За лактация']),
  '🤱'
ON CONFLICT (slug) DO NOTHING;

-- Feeding Accessories L3 (parent: feed-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Bottle Brushes', 'Drying Racks', 'Formula Dispensers', 'Bottle Covers', 'Feeding Mats']),
  unnest(ARRAY['feed-brush', 'feed-rack', 'feed-dispenser', 'feed-cover', 'feed-mat']),
  (SELECT id FROM categories WHERE slug = 'feed-accessories'),
  unnest(ARRAY['Четки', 'Сушилки', 'Дозатори', 'Калъфи', 'Подложки']),
  '🍽️'
ON CONFLICT (slug) DO NOTHING;

-- Formula L3 (parent: feed-formula)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Infant Formula', 'Toddler Formula', 'Specialty Formula', 'Organic Formula', 'Ready to Feed']),
  unnest(ARRAY['formula-infant', 'formula-toddler', 'formula-special', 'formula-organic', 'formula-ready']),
  (SELECT id FROM categories WHERE slug = 'feed-formula'),
  unnest(ARRAY['За бебета', 'За малки деца', 'Специални', 'Органични', 'Готови']),
  '🥛'
ON CONFLICT (slug) DO NOTHING;

-- Highchairs & Boosters L3 (parent: feed-highchairs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Full Size Highchairs', 'Portable Highchairs', 'Booster Seats', 'Hook-On Chairs', 'Convertible Highchairs']),
  unnest(ARRAY['highchair-full', 'highchair-portable', 'highchair-booster', 'highchair-hook', 'highchair-convert']),
  (SELECT id FROM categories WHERE slug = 'feed-highchairs'),
  unnest(ARRAY['Пълноразмерни', 'Преносими', 'Бустери', 'Закачващи се', 'Трансформиращи се']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Nursing Pillows L3 (parent: nursing-pillows)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['C-Shaped Pillows', 'U-Shaped Pillows', 'Wedge Pillows', 'Travel Pillows', 'Pillow Covers']),
  unnest(ARRAY['npillow-c', 'npillow-u', 'npillow-wedge', 'npillow-travel', 'npillow-cover']),
  (SELECT id FROM categories WHERE slug = 'nursing-pillows'),
  unnest(ARRAY['С-образни', 'U-образни', 'Клинове', 'За пътуване', 'Калъфки']),
  '🛋️'
ON CONFLICT (slug) DO NOTHING;

-- Pacifiers L3 (parent: pacifiers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Newborn Pacifiers', 'Orthodontic Pacifiers', 'Night Pacifiers', 'Pacifier Clips', 'Pacifier Cases']),
  unnest(ARRAY['paci-newborn', 'paci-ortho', 'paci-night', 'paci-clip', 'paci-case']),
  (SELECT id FROM categories WHERE slug = 'pacifiers'),
  unnest(ARRAY['За новородени', 'Ортодонтични', 'Нощни', 'Щипки', 'Кутийки']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Sippy Cups L3 (parent: feeding-sippy)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Spout Cups', 'Straw Cups', '360 Cups', 'Transition Cups', 'Weighted Straw Cups']),
  unnest(ARRAY['sippy-spout', 'sippy-straw', 'sippy-360', 'sippy-transition', 'sippy-weighted']),
  (SELECT id FROM categories WHERE slug = 'feeding-sippy'),
  unnest(ARRAY['С чучурка', 'Със сламка', '360°', 'Преходни', 'С тежест']),
  '🥤'
ON CONFLICT (slug) DO NOTHING;

-- Sterilizers L3 (parent: sterilizers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Electric Sterilizers', 'Microwave Sterilizers', 'UV Sterilizers', 'Cold Water Sterilizers', 'Travel Sterilizers']),
  unnest(ARRAY['sterilize-electric', 'sterilize-microwave', 'sterilize-uv', 'sterilize-cold', 'sterilize-travel']),
  (SELECT id FROM categories WHERE slug = 'sterilizers'),
  unnest(ARRAY['Електрически', 'За микровълнова', 'UV', 'Студена вода', 'За пътуване']),
  '✨'
ON CONFLICT (slug) DO NOTHING;
;
