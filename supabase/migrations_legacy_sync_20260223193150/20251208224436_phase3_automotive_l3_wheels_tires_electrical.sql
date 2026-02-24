
-- Phase 3.1.3: Automotive Wheels, Tires & Electrical L3 Categories

-- Wheels & Tires L3 (parent: wheels-tires)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['All-Season Tires', 'Summer Tires', 'Winter Tires', 'Performance Tires', 'All-Terrain Tires', 'Mud-Terrain Tires', 'Run-Flat Tires', 'Spare Tires', 'Tire Repair Kits']),
  unnest(ARRAY['tires-all-season', 'tires-summer', 'tires-winter', 'tires-performance', 'tires-all-terrain', 'tires-mud-terrain', 'tires-run-flat', 'tires-spare', 'tires-repair-kits']),
  (SELECT id FROM categories WHERE slug = 'wheels-tires'),
  unnest(ARRAY['Всесезонни гуми', 'Летни гуми', 'Зимни гуми', 'Спортни гуми', 'All-Terrain гуми', 'Кални гуми', 'Run-Flat гуми', 'Резервни гуми', 'Ремонтни комплекти']),
  '🛞'
ON CONFLICT (slug) DO NOTHING;

-- Wheels & Rims L3 (parent: parts-wheels)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Alloy Wheels', 'Steel Wheels', 'Forged Wheels', 'Chrome Wheels', 'Black Wheels', 'Off-Road Wheels', 'Racing Wheels', 'Wheel Spacers', 'Lug Nuts', 'Center Caps', 'Valve Stems']),
  unnest(ARRAY['wheels-alloy', 'wheels-steel', 'wheels-forged', 'wheels-chrome', 'wheels-black', 'wheels-offroad', 'wheels-racing', 'wheels-spacers', 'wheels-lug-nuts', 'wheels-center-caps', 'wheels-valve-stems']),
  (SELECT id FROM categories WHERE slug = 'parts-wheels'),
  unnest(ARRAY['Алуминиеви джанти', 'Стоманени джанти', 'Ковани джанти', 'Хромирани джанти', 'Черни джанти', 'Офроуд джанти', 'Състезателни джанти', 'Разпънки', 'Болтове', 'Капачки', 'Вентили']),
  '🛞'
ON CONFLICT (slug) DO NOTHING;

-- Tires L3 (parent: parts-tires)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Passenger Tires', 'Truck Tires', 'SUV Tires', 'Commercial Tires', 'Motorcycle Tires', 'ATV Tires', 'Trailer Tires']),
  unnest(ARRAY['tires-passenger', 'tires-truck', 'tires-suv', 'tires-commercial', 'tires-motorcycle', 'tires-atv', 'tires-trailer']),
  (SELECT id FROM categories WHERE slug = 'parts-tires'),
  unnest(ARRAY['Леки автомобили', 'Камиони', 'Джипове', 'Товарни', 'Мотоциклетни', 'ATV гуми', 'Ремаркета']),
  '🛞'
ON CONFLICT (slug) DO NOTHING;

-- Electrical Parts L3 (parent: auto-electrical-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Starters', 'Alternators', 'Ignition Switches', 'Ignition Modules', 'Distributors', 'Wiring Harnesses', 'Fuses & Relays', 'Sensors', 'ECUs', 'Window Motors', 'Door Lock Actuators']),
  unnest(ARRAY['elec-starters', 'elec-alternators', 'elec-ignition-switches', 'elec-ignition-modules', 'elec-distributors', 'elec-wiring-harnesses', 'elec-fuses-relays', 'elec-sensors', 'elec-ecus', 'elec-window-motors', 'elec-door-actuators']),
  (SELECT id FROM categories WHERE slug = 'auto-electrical-parts'),
  unnest(ARRAY['Стартери', 'Алтернатори', 'Ключове запалване', 'Модули запалване', 'Делкота', 'Кабелни снопове', 'Бушони и релета', 'Сензори', 'Компютри', 'Стъклоповдигачи', 'Брави централно']),
  '⚡'
ON CONFLICT (slug) DO NOTHING;

-- Batteries L3 (parent: parts-batteries)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Lead-Acid Batteries', 'AGM Batteries', 'Lithium Batteries', 'Deep Cycle Batteries', 'Motorcycle Batteries', 'Marine Batteries', 'Battery Chargers', 'Jump Starters', 'Battery Terminals']),
  unnest(ARRAY['battery-lead-acid', 'battery-agm', 'battery-lithium', 'battery-deep-cycle', 'battery-motorcycle', 'battery-marine', 'battery-chargers', 'battery-jump-starters', 'battery-terminals']),
  (SELECT id FROM categories WHERE slug = 'parts-batteries'),
  unnest(ARRAY['Оловни акумулатори', 'AGM акумулатори', 'Литиеви акумулатори', 'Дълбок цикъл', 'Мотоциклетни', 'Морски', 'Зарядни устройства', 'Стартови устройства', 'Клеми']),
  '🔋'
ON CONFLICT (slug) DO NOTHING;

-- Lights & Bulbs L3 (parent: parts-lights)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Headlight Bulbs', 'LED Headlights', 'HID/Xenon Kits', 'Fog Light Bulbs', 'Tail Light Bulbs', 'Turn Signal Bulbs', 'Brake Light Bulbs', 'Interior Bulbs', 'License Plate Bulbs', 'DRL Bulbs']),
  unnest(ARRAY['lights-headlight-bulbs', 'lights-led-headlights', 'lights-hid-xenon', 'lights-fog-bulbs', 'lights-tail-bulbs', 'lights-turn-signal', 'lights-brake', 'lights-interior', 'lights-license-plate', 'lights-drl']),
  (SELECT id FROM categories WHERE slug = 'parts-lights'),
  unnest(ARRAY['Крушки фарове', 'LED фарове', 'HID/Ксенон комплекти', 'Крушки халогени', 'Крушки стопове', 'Крушки мигачи', 'Крушки стоп', 'Интериорни крушки', 'Крушки номер', 'DRL крушки']),
  '💡'
ON CONFLICT (slug) DO NOTHING;

-- Lighting L3 (parent: auto-lighting)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Headlight Assemblies', 'Tail Light Assemblies', 'Fog Lights', 'LED Light Bars', 'Work Lights', 'Underglow Kits', 'Interior LED Kits', 'Strobe Lights', 'Emergency Lights']),
  unnest(ARRAY['lighting-headlight-assemblies', 'lighting-tail-assemblies', 'lighting-fog', 'lighting-led-bars', 'lighting-work', 'lighting-underglow', 'lighting-interior-led', 'lighting-strobe', 'lighting-emergency']),
  (SELECT id FROM categories WHERE slug = 'auto-lighting'),
  unnest(ARRAY['Фарове комплект', 'Стопове комплект', 'Халогени', 'LED барове', 'Работни светлини', 'Underglow', 'Интериорни LED', 'Стробоскопи', 'Аварийни светлини']),
  '💡'
ON CONFLICT (slug) DO NOTHING;
;
