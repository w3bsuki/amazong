-- Add L4 categories for Automotive (priority category with 0 L4s)

-- Get parent IDs first, then add L4s for vehicle-specific parts
-- Oil Filters by brand
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['BMW Oil Filters', 'Mercedes Oil Filters', 'VW/Audi Oil Filters', 'Toyota Oil Filters', 'Honda Oil Filters', 'Ford Oil Filters', 'Hyundai/Kia Oil Filters', 'Universal Oil Filters']),
  unnest(ARRAY['BMW Маслени филтри', 'Mercedes Маслени филтри', 'VW/Audi Маслени филтри', 'Toyota Маслени филтри', 'Honda Маслени филтри', 'Ford Маслени филтри', 'Hyundai/Kia Маслени филтри', 'Универсални маслени филтри']),
  unnest(ARRAY['oil-filter-bmw', 'oil-filter-mercedes', 'oil-filter-vw-audi', 'oil-filter-toyota', 'oil-filter-honda', 'oil-filter-ford', 'oil-filter-hyundai-kia', 'oil-filter-universal']),
  id,
  '🔧'
FROM categories WHERE slug = 'engine-oil-filters'
ON CONFLICT (slug) DO NOTHING;

-- Brake Pads by vehicle type
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Sedan Brake Pads', 'SUV Brake Pads', 'Truck Brake Pads', 'Sports Car Brake Pads', 'European Car Brake Pads', 'Japanese Car Brake Pads', 'American Car Brake Pads']),
  unnest(ARRAY['Накладки за седан', 'Накладки за SUV', 'Накладки за камион', 'Накладки за спортни коли', 'Накладки за европейски коли', 'Накладки за японски коли', 'Накладки за американски коли']),
  unnest(ARRAY['brake-pads-sedan', 'brake-pads-suv', 'brake-pads-truck', 'brake-pads-sports', 'brake-pads-european', 'brake-pads-japanese', 'brake-pads-american']),
  id,
  '🛞'
FROM categories WHERE slug IN ('ceramic-brake-pads', 'brake-pads')
LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Tires by size (common sizes)
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['15" Tires', '16" Tires', '17" Tires', '18" Tires', '19" Tires', '20" Tires', '21"+ Tires', 'Run-Flat Tires']),
  unnest(ARRAY['15" Гуми', '16" Гуми', '17" Гуми', '18" Гуми', '19" Гуми', '20" Гуми', '21"+ Гуми', 'Run-Flat Гуми']),
  unnest(ARRAY['tires-15inch', 'tires-16inch', 'tires-17inch', 'tires-18inch', 'tires-19inch', 'tires-20inch', 'tires-21plus', 'tires-runflat']),
  id,
  '🛞'
FROM categories WHERE slug = 'all-season-tires'
ON CONFLICT (slug) DO NOTHING;

-- Car Audio by type (under car-audio or auto-audio)
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Apple CarPlay Units', 'Android Auto Units', 'Single DIN Head Units', 'Double DIN Head Units', '10"+ Touchscreen Units', 'Bluetooth Head Units', 'Amplifier Kits', 'Subwoofer Kits']),
  unnest(ARRAY['Apple CarPlay устройства', 'Android Auto устройства', 'Single DIN устройства', 'Double DIN устройства', '10"+ Тъчскрийн', 'Bluetooth устройства', 'Усилвател комплекти', 'Субуфер комплекти']),
  unnest(ARRAY['audio-carplay', 'audio-android-auto', 'audio-single-din', 'audio-double-din', 'audio-10inch-touch', 'audio-bluetooth', 'audio-amp-kits', 'audio-sub-kits']),
  id,
  '🔊'
FROM categories WHERE slug = 'car-audio' OR slug = 'auto-audio'
LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Dash Cams by feature
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['4K Dash Cams', 'Dual Channel Dash Cams', 'Night Vision Dash Cams', 'Parking Mode Dash Cams', 'GPS Dash Cams', 'Mirror Dash Cams', 'Budget Dash Cams']),
  unnest(ARRAY['4K Видеорегистратори', 'Двуканални видеорегистратори', 'Нощно виждане видеорегистратори', 'Паркинг режим видеорегистратори', 'GPS Видеорегистратори', 'Огледало видеорегистратори', 'Бюджетни видеорегистратори']),
  unnest(ARRAY['dashcam-4k', 'dashcam-dual', 'dashcam-nightvision', 'dashcam-parking', 'dashcam-gps', 'dashcam-mirror', 'dashcam-budget']),
  id,
  '📹'
FROM categories WHERE slug = 'dash-cameras' OR slug = 'dashcams'
LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Car Batteries by type
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['AGM Batteries', 'Lithium Car Batteries', 'Deep Cycle Batteries', 'Start-Stop Batteries', 'Performance Batteries', 'Heavy Duty Batteries']),
  unnest(ARRAY['AGM Акумулатори', 'Литиеви автомобилни акумулатори', 'Deep Cycle акумулатори', 'Start-Stop акумулатори', 'Високопроизводителни акумулатори', 'Тежкотоварни акумулатори']),
  unnest(ARRAY['battery-agm', 'battery-lithium', 'battery-deep-cycle', 'battery-start-stop', 'battery-performance', 'battery-heavy-duty']),
  id,
  '🔋'
FROM categories WHERE slug = 'lead-acid-batteries' OR slug = 'car-batteries'
LIMIT 1
ON CONFLICT (slug) DO NOTHING;;
