
-- Phase 3.3.3: Pets L3 Categories - Fish & Aquatic

-- Aquarium Cleaning L3 (parent: aquarium-cleaning)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Gravel Vacuums', 'Algae Scrapers', 'Glass Cleaners', 'Filter Brushes', 'Siphons', 'Magnetic Cleaners']),
  unnest(ARRAY['clean-vacuum', 'clean-scraper', 'clean-glass', 'clean-brush', 'clean-siphon', 'clean-magnetic']),
  (SELECT id FROM categories WHERE slug = 'aquarium-cleaning'),
  unnest(ARRAY['Прахосмукачки', 'За алги', 'За стъкло', 'За филтри', 'Сифони', 'Магнитни']),
  '🧹'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Decor L3 (parent: fish-decor)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Aquarium Rocks', 'Driftwood', 'Caves & Hideouts', 'Ornaments', 'Backgrounds', 'Coral Decorations']),
  unnest(ARRAY['decor-rocks', 'decor-driftwood', 'decor-caves', 'decor-ornaments', 'decor-backgrounds', 'decor-coral']),
  (SELECT id FROM categories WHERE slug = 'fish-decor'),
  unnest(ARRAY['Камъни', 'Дърво', 'Пещери', 'Орнаменти', 'Фонове', 'Корали']),
  '🪨'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Decorations L3 (parent: aquarium-decor)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Plastic Plants', 'Silk Plants', 'Castles', 'Ship Wrecks', 'Bridges', 'LED Decorations']),
  unnest(ARRAY['decor-plastic', 'decor-silk', 'decor-castles', 'decor-ships', 'decor-bridges', 'decor-led']),
  (SELECT id FROM categories WHERE slug = 'aquarium-decor'),
  unnest(ARRAY['Пластмасови растения', 'Копринени', 'Замъци', 'Кораби', 'Мостове', 'LED']),
  '🏰'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Filters L3 (parent: fish-filters)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hang On Back', 'Canister Filters', 'Sponge Filters', 'Internal Filters', 'Undergravel', 'Filter Media']),
  unnest(ARRAY['filter-hob', 'filter-canister', 'filter-sponge', 'filter-internal', 'filter-under', 'filter-media']),
  (SELECT id FROM categories WHERE slug = 'fish-filters'),
  unnest(ARRAY['Външни', 'Канистрови', 'Гъбени', 'Вътрешни', 'Подгръндови', 'Филтърен материал']),
  '🌀'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Filters (duplicate) L3 (parent: aquarium-filters)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Power Filters', 'Bio Filters', 'UV Sterilizers', 'Protein Skimmers', 'Refugium']),
  unnest(ARRAY['filter-power', 'filter-bio', 'filter-uv', 'filter-skimmer', 'filter-refugium']),
  (SELECT id FROM categories WHERE slug = 'aquarium-filters'),
  unnest(ARRAY['Силови', 'Био филтри', 'UV стерилизатори', 'Скимери', 'Рефугиуми']),
  '🌀'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Heaters L3 (parent: aquarium-heaters)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Submersible Heaters', 'Inline Heaters', 'Heater Controllers', 'Heating Mats', 'Backup Heaters']),
  unnest(ARRAY['heater-submersible', 'heater-inline', 'heater-controller', 'heater-mat', 'heater-backup']),
  (SELECT id FROM categories WHERE slug = 'aquarium-heaters'),
  unnest(ARRAY['Потапяеми', 'Инлайн', 'Контролери', 'Нагревателни подложки', 'Резервни']),
  '🌡️'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Lighting L3 (parent: fish-lighting)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['LED Lights', 'Fluorescent Lights', 'Plant Grow Lights', 'Moonlight', 'Light Timers']),
  unnest(ARRAY['light-led', 'light-fluor', 'light-grow', 'light-moon', 'light-timer']),
  (SELECT id FROM categories WHERE slug = 'fish-lighting'),
  unnest(ARRAY['LED', 'Флуоресцентни', 'За растения', 'Нощни', 'Таймери']),
  '💡'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Lighting (duplicate) L3 (parent: aquarium-lighting)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Reef Lights', 'Freshwater Lights', 'Color Enhancing', 'Strip Lights', 'Clip On Lights']),
  unnest(ARRAY['light-reef', 'light-fresh', 'light-color', 'light-strip', 'light-clip']),
  (SELECT id FROM categories WHERE slug = 'aquarium-lighting'),
  unnest(ARRAY['За рифове', 'За сладководни', 'За цветове', 'Ленти', 'С щипка']),
  '💡'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Plants L3 (parent: fish-plants)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Live Plants', 'Floating Plants', 'Carpet Plants', 'Background Plants', 'Moss & Ferns', 'Plant Fertilizers']),
  unnest(ARRAY['plant-live', 'plant-float', 'plant-carpet', 'plant-background', 'plant-moss', 'plant-fert']),
  (SELECT id FROM categories WHERE slug = 'fish-plants'),
  unnest(ARRAY['Живи растения', 'Плаващи', 'Килимни', 'Фонови', 'Мъхове и папрати', 'Торове']),
  '🌿'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Pumps & Air L3 (parent: aquarium-pumps)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Air Pumps', 'Water Pumps', 'Powerheads', 'Wave Makers', 'Air Stones', 'Check Valves']),
  unnest(ARRAY['pump-air', 'pump-water', 'pump-power', 'pump-wave', 'pump-stone', 'pump-valve']),
  (SELECT id FROM categories WHERE slug = 'aquarium-pumps'),
  unnest(ARRAY['Въздушни помпи', 'Водни помпи', 'Powerheads', 'Вълни', 'Камъчета', 'Клапи']),
  '💨'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Substrate L3 (parent: aquarium-substrate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Gravel', 'Sand', 'Plant Substrate', 'Crushed Coral', 'River Rocks', 'Soil']),
  unnest(ARRAY['sub-gravel', 'sub-sand', 'sub-plant', 'sub-coral', 'sub-rocks', 'sub-soil']),
  (SELECT id FROM categories WHERE slug = 'aquarium-substrate'),
  unnest(ARRAY['Чакъл', 'Пясък', 'За растения', 'Корали', 'Речни камъни', 'Почва']),
  '🪨'
ON CONFLICT (slug) DO NOTHING;

-- Aquariums L3 (parent: fish-aquariums)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nano Tanks', 'Betta Tanks', 'Starter Kits', 'Rimless Tanks', 'Bowfront Tanks', 'Corner Tanks']),
  unnest(ARRAY['tank-nano', 'tank-betta', 'tank-starter', 'tank-rimless', 'tank-bowfront', 'tank-corner']),
  (SELECT id FROM categories WHERE slug = 'fish-aquariums'),
  unnest(ARRAY['Нано', 'За бети', 'Начални комплекти', 'Без рамка', 'Изпъкнали', 'Ъглови']),
  '🐠'
ON CONFLICT (slug) DO NOTHING;

-- Aquariums & Tanks L3 (parent: aquariums)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Small Tanks', 'Medium Tanks', 'Large Tanks', 'Custom Tanks', 'Tank Stands']),
  unnest(ARRAY['tank-small', 'tank-medium', 'tank-large', 'tank-custom', 'tank-stands']),
  (SELECT id FROM categories WHERE slug = 'aquariums'),
  unnest(ARRAY['Малки', 'Средни', 'Големи', 'По поръчка', 'Стойки']),
  '🐟'
ON CONFLICT (slug) DO NOTHING;

-- Heaters & Thermometers L3 (parent: fish-heaters)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Digital Thermometers', 'Analog Thermometers', 'Strip Thermometers', 'Wireless Thermometers']),
  unnest(ARRAY['thermo-digital', 'thermo-analog', 'thermo-strip', 'thermo-wireless']),
  (SELECT id FROM categories WHERE slug = 'fish-heaters'),
  unnest(ARRAY['Цифрови', 'Аналогови', 'Лентови', 'Безжични']),
  '🌡️'
ON CONFLICT (slug) DO NOTHING;

-- Pond Supplies L3 (parent: pond-supplies)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pond Pumps', 'Pond Filters', 'Pond Liners', 'Pond Plants', 'Pond Fish Food', 'Pond Treatments', 'Pond Aerators', 'Pond Nets']),
  unnest(ARRAY['pond-pumps', 'pond-filters', 'pond-liners', 'pond-plants', 'pond-food', 'pond-treatment', 'pond-aerators', 'pond-nets']),
  (SELECT id FROM categories WHERE slug = 'pond-supplies'),
  unnest(ARRAY['Помпи', 'Филтри', 'Фолио', 'Растения', 'Храна', 'Препарати', 'Аератори', 'Мрежи']),
  '🐸'
ON CONFLICT (slug) DO NOTHING;

-- Saltwater & Marine L3 (parent: saltwater-marine)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Reef Salt', 'Live Rock', 'Marine Food', 'Coral Food', 'Marine Supplements', 'Dosing Equipment']),
  unnest(ARRAY['marine-salt', 'marine-rock', 'marine-food', 'marine-coral', 'marine-supps', 'marine-dose']),
  (SELECT id FROM categories WHERE slug = 'saltwater-marine'),
  unnest(ARRAY['Сол за рифове', 'Жив камък', 'Храна', 'За корали', 'Добавки', 'Дозатори']),
  '🐙'
ON CONFLICT (slug) DO NOTHING;

-- Water Care & Testing L3 (parent: water-care)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Test Kits', 'Water Conditioners', 'pH Adjusters', 'Ammonia Removers', 'Bacteria Starters', 'Digital Testers']),
  unnest(ARRAY['test-kits', 'water-conditioner', 'water-ph', 'water-ammonia', 'water-bacteria', 'test-digital']),
  (SELECT id FROM categories WHERE slug = 'water-care'),
  unnest(ARRAY['Тестове', 'Подготовка', 'pH', 'За амоняк', 'Бактерии', 'Дигитални']),
  '🧪'
ON CONFLICT (slug) DO NOTHING;

-- Water Treatment L3 (parent: fish-water)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dechlorinators', 'Stress Coat', 'Ich Treatment', 'Fungus Treatment', 'Parasite Treatment']),
  unnest(ARRAY['water-dechlor', 'water-stress', 'water-ich', 'water-fungus', 'water-parasite']),
  (SELECT id FROM categories WHERE slug = 'fish-water'),
  unnest(ARRAY['Дехлориращи', 'Stress Coat', 'Срещу их', 'Срещу гъбички', 'Срещу паразити']),
  '💊'
ON CONFLICT (slug) DO NOTHING;
;
