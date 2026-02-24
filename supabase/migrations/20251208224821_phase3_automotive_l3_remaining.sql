
-- Phase 3.1.8: Remaining Automotive L3 Categories

-- ATVs & UTVs L3 (parent: vehicles-atv)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Sport ATVs', 'Utility ATVs', 'Youth ATVs', 'Side-by-Sides', 'UTVs', 'ATV Accessories']),
  unnest(ARRAY['atv-sport', 'atv-utility', 'atv-youth', 'atv-side-by-side', 'atv-utv', 'atv-accessories']),
  (SELECT id FROM categories WHERE slug = 'vehicles-atv'),
  unnest(ARRAY['Спортни ATV', 'Работни ATV', 'Детски ATV', 'Side-by-Side', 'UTV', 'ATV аксесоари']),
  '🏎️'
ON CONFLICT (slug) DO NOTHING;

-- Campers L3 (parent: campers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Travel Trailers', 'Motorhomes', 'Pop-Up Campers', 'Fifth Wheels', 'Truck Campers', 'Teardrop Trailers']),
  unnest(ARRAY['camper-travel-trailer', 'camper-motorhome', 'camper-popup', 'camper-fifth-wheel', 'camper-truck', 'camper-teardrop']),
  (SELECT id FROM categories WHERE slug = 'campers'),
  unnest(ARRAY['Туристически ремаркета', 'Кемпери', 'Pop-Up кемпери', 'Fifth Wheel', 'Кемпер пикапи', 'Teardrop']),
  '🏕️'
ON CONFLICT (slug) DO NOTHING;

-- Car Wash Services L3 (parent: car-wash-services)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Express Wash', 'Full Service Wash', 'Self Service Wash', 'Hand Wash', 'Touchless Wash']),
  unnest(ARRAY['wash-express', 'wash-full-service', 'wash-self-service', 'wash-hand', 'wash-touchless']),
  (SELECT id FROM categories WHERE slug = 'car-wash-services'),
  unnest(ARRAY['Експресно миене', 'Пълно обслужване', 'Самообслужване', 'Ръчно миене', 'Безконтактно']),
  '🚿'
ON CONFLICT (slug) DO NOTHING;

-- Cargo L3 (parent: cargo)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Cargo Boxes', 'Cargo Nets', 'Cargo Bars', 'Tie-Down Straps', 'Cargo Organizers']),
  unnest(ARRAY['cargo-boxes', 'cargo-nets', 'cargo-bars', 'cargo-tie-downs', 'cargo-organizers']),
  (SELECT id FROM categories WHERE slug = 'cargo'),
  unnest(ARRAY['Товарни кутии', 'Мрежи', 'Прегради', 'Колани', 'Органайзери']),
  '📦'
ON CONFLICT (slug) DO NOTHING;

-- EV Charging Adapters L3 (parent: ev-charging-adapters)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['J1772 Adapters', 'CCS Adapters', 'CHAdeMO Adapters', 'Tesla Adapters', 'NACS Adapters']),
  unnest(ARRAY['adapter-j1772', 'adapter-ccs', 'adapter-chademo', 'adapter-tesla', 'adapter-nacs']),
  (SELECT id FROM categories WHERE slug = 'ev-charging-adapters'),
  unnest(ARRAY['J1772 адаптери', 'CCS адаптери', 'CHAdeMO адаптери', 'Tesla адаптери', 'NACS адаптери']),
  '🔌'
ON CONFLICT (slug) DO NOTHING;

-- EV Charging Cables L3 (parent: ev-charging-cables)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Type 1 Cables', 'Type 2 Cables', 'CCS Cables', 'Extension Cables', 'Heavy Duty Cables']),
  unnest(ARRAY['cable-type1', 'cable-type2', 'cable-ccs', 'cable-extension', 'cable-heavy-duty']),
  (SELECT id FROM categories WHERE slug = 'ev-charging-cables'),
  unnest(ARRAY['Type 1 кабели', 'Type 2 кабели', 'CCS кабели', 'Удължители', 'Тежкотоварни кабели']),
  '🔌'
ON CONFLICT (slug) DO NOTHING;

-- Classic Cars L3 (parent: vehicles-classic)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['American Classics', 'European Classics', 'Japanese Classics', 'Muscle Cars', 'Vintage Cars', 'Classic Trucks']),
  unnest(ARRAY['classic-american', 'classic-european', 'classic-japanese', 'classic-muscle', 'classic-vintage', 'classic-trucks']),
  (SELECT id FROM categories WHERE slug = 'vehicles-classic'),
  unnest(ARRAY['Американски класики', 'Европейски класики', 'Японски класики', 'Мъсъл кари', 'Ретро автомобили', 'Ретро пикапи']),
  '🚗'
ON CONFLICT (slug) DO NOTHING;

-- Detailing Services L3 (parent: detailing-services)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Interior Detailing', 'Exterior Detailing', 'Full Detailing', 'Paint Correction', 'Ceramic Coating', 'PPF Installation']),
  unnest(ARRAY['detail-svc-interior', 'detail-svc-exterior', 'detail-svc-full', 'detail-svc-paint-correction', 'detail-svc-ceramic', 'detail-svc-ppf']),
  (SELECT id FROM categories WHERE slug = 'detailing-services'),
  unnest(ARRAY['Интериорен детайлинг', 'Екстериорен детайлинг', 'Пълен детайлинг', 'Корекция боя', 'Керамично покритие', 'PPF монтаж']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- EV Cooling L3 (parent: ev-cooling)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Battery Cooling Systems', 'Thermal Management', 'EV Coolant', 'Cooling Pumps']),
  unnest(ARRAY['ev-cool-battery', 'ev-cool-thermal', 'ev-cool-coolant', 'ev-cool-pumps']),
  (SELECT id FROM categories WHERE slug = 'ev-cooling'),
  unnest(ARRAY['Охлаждане батерия', 'Термо управление', 'EV антифриз', 'Помпи охлаждане']),
  '❄️'
ON CONFLICT (slug) DO NOTHING;

-- EV Electronics L3 (parent: ev-electronics)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['EV Controllers', 'Inverters', 'DC-DC Converters', 'Onboard Chargers', 'EV Displays']),
  unnest(ARRAY['ev-elec-controllers', 'ev-elec-inverters', 'ev-elec-dcdc', 'ev-elec-chargers', 'ev-elec-displays']),
  (SELECT id FROM categories WHERE slug = 'ev-electronics'),
  unnest(ARRAY['Контролери', 'Инвертори', 'DC-DC конвертори', 'Борд зарядни', 'Дисплеи']),
  '⚡'
ON CONFLICT (slug) DO NOTHING;

-- EV Motors L3 (parent: ev-motors)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['AC Motors', 'DC Motors', 'Hub Motors', 'Motor Controllers', 'Regenerative Systems']),
  unnest(ARRAY['ev-motor-ac', 'ev-motor-dc', 'ev-motor-hub', 'ev-motor-controllers', 'ev-motor-regen']),
  (SELECT id FROM categories WHERE slug = 'ev-motors'),
  unnest(ARRAY['AC мотори', 'DC мотори', 'Hub мотори', 'Контролери мотор', 'Рекуперативни системи']),
  '⚙️'
ON CONFLICT (slug) DO NOTHING;

-- EV Services L3 (parent: auto-ev-service)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Battery Diagnostics', 'Charger Installation', 'Software Updates', 'EV Maintenance', 'High Voltage Repairs']),
  unnest(ARRAY['ev-svc-battery-diag', 'ev-svc-charger-install', 'ev-svc-software', 'ev-svc-maintenance', 'ev-svc-high-voltage']),
  (SELECT id FROM categories WHERE slug = 'auto-ev-service'),
  unnest(ARRAY['Диагностика батерия', 'Монтаж зарядно', 'Софтуерни обновления', 'EV поддръжка', 'Високо напрежение']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- EV Tires L3 (parent: ev-tires)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['EV-Specific Tires', 'Low Rolling Resistance', 'EV Performance Tires', 'EV Winter Tires']),
  unnest(ARRAY['ev-tire-specific', 'ev-tire-low-resistance', 'ev-tire-performance', 'ev-tire-winter']),
  (SELECT id FROM categories WHERE slug = 'ev-tires'),
  unnest(ARRAY['EV специфични', 'Ниско съпротивление', 'EV спортни', 'EV зимни']),
  '🛞'
ON CONFLICT (slug) DO NOTHING;

-- Glass Repair Services L3 (parent: glass-repair-services)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Windshield Repair', 'Windshield Replacement', 'Side Window Replacement', 'Rear Window Replacement', 'Chip Repair']),
  unnest(ARRAY['glass-svc-repair', 'glass-svc-windshield', 'glass-svc-side', 'glass-svc-rear', 'glass-svc-chip']),
  (SELECT id FROM categories WHERE slug = 'glass-repair-services'),
  unnest(ARRAY['Ремонт стъкло', 'Смяна предно стъкло', 'Смяна странични', 'Смяна задно', 'Ремонт чип']),
  '🪟'
ON CONFLICT (slug) DO NOTHING;

-- Inspection & Diagnostics L3 (parent: auto-inspection)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pre-Purchase Inspection', 'Safety Inspection', 'Emissions Testing', 'OBD Diagnostics', 'Full Vehicle Inspection']),
  unnest(ARRAY['insp-pre-purchase', 'insp-safety', 'insp-emissions', 'insp-obd', 'insp-full']),
  (SELECT id FROM categories WHERE slug = 'auto-inspection'),
  unnest(ARRAY['Предпродажен преглед', 'ГТП', 'Емисии', 'OBD диагностика', 'Пълен преглед']),
  '🔍'
ON CONFLICT (slug) DO NOTHING;

-- Oil Change Services L3 (parent: oil-change-services)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Conventional Oil', 'Synthetic Oil', 'High Mileage Oil', 'Diesel Oil Change', 'Fleet Services']),
  unnest(ARRAY['oil-svc-conventional', 'oil-svc-synthetic', 'oil-svc-high-mileage', 'oil-svc-diesel', 'oil-svc-fleet']),
  (SELECT id FROM categories WHERE slug = 'oil-change-services'),
  unnest(ARRAY['Конвенционално масло', 'Синтетично масло', 'Голям пробег', 'Дизелово масло', 'Флот услуги']),
  '🛢️'
ON CONFLICT (slug) DO NOTHING;

-- Solar Charging L3 (parent: ev-solar-charging)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Solar Panels for EV', 'Solar Carports', 'Portable Solar Chargers', 'Solar-EV Integration']),
  unnest(ARRAY['solar-panels-ev', 'solar-carports', 'solar-portable', 'solar-ev-integration']),
  (SELECT id FROM categories WHERE slug = 'ev-solar-charging'),
  unnest(ARRAY['Соларни панели за EV', 'Соларни навеси', 'Преносими соларни', 'Соларна интеграция']),
  '☀️'
ON CONFLICT (slug) DO NOTHING;

-- Tire Services L3 (parent: auto-tire-service)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tire Mounting', 'Tire Balancing', 'Wheel Alignment', 'Tire Rotation', 'Flat Repair', 'TPMS Service']),
  unnest(ARRAY['tire-svc-mounting', 'tire-svc-balancing', 'tire-svc-alignment', 'tire-svc-rotation', 'tire-svc-flat', 'tire-svc-tpms']),
  (SELECT id FROM categories WHERE slug = 'auto-tire-service'),
  unnest(ARRAY['Монтаж гуми', 'Баланс', 'Геометрия', 'Ротация', 'Ремонт спукана', 'TPMS обслужване']),
  '🛞'
ON CONFLICT (slug) DO NOTHING;

-- Tire Services 2 L3 (parent: tire-services - duplicate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tire Storage', 'Nitrogen Fill', 'Run-Flat Repair']),
  unnest(ARRAY['tire-svc-storage', 'tire-svc-nitrogen', 'tire-svc-runflat']),
  (SELECT id FROM categories WHERE slug = 'tire-services'),
  unnest(ARRAY['Съхранение гуми', 'Азот', 'Ремонт Run-Flat']),
  '🛞'
ON CONFLICT (slug) DO NOTHING;

-- Towing & Recovery L3 (parent: auto-towing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Flatbed Towing', 'Wheel Lift Towing', 'Motorcycle Towing', 'Heavy Duty Towing', 'Roadside Assistance', 'Winch Services']),
  unnest(ARRAY['tow-flatbed', 'tow-wheel-lift', 'tow-motorcycle', 'tow-heavy-duty', 'tow-roadside', 'tow-winch']),
  (SELECT id FROM categories WHERE slug = 'auto-towing'),
  unnest(ARRAY['Платформа', 'Частично повдигане', 'Мотоциклети', 'Тежкотоварни', 'Пътна помощ', 'Лебедка']),
  '🚛'
ON CONFLICT (slug) DO NOTHING;

-- Trailers L3 (parent: trailers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Utility Trailers', 'Enclosed Trailers', 'Car Haulers', 'Boat Trailers', 'Motorcycle Trailers', 'Dump Trailers']),
  unnest(ARRAY['trailer-utility', 'trailer-enclosed', 'trailer-car-hauler', 'trailer-boat', 'trailer-motorcycle', 'trailer-dump']),
  (SELECT id FROM categories WHERE slug = 'trailers'),
  unnest(ARRAY['Товарни ремаркета', 'Закрити ремаркета', 'За коли', 'За лодки', 'За мотори', 'Самосвали']),
  '🚛'
ON CONFLICT (slug) DO NOTHING;

-- Tuning & Performance Services L3 (parent: auto-tuning-service)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['ECU Tuning', 'Dyno Tuning', 'Performance Upgrades', 'Exhaust Modifications', 'Suspension Tuning', 'Turbo Installation']),
  unnest(ARRAY['tune-ecu', 'tune-dyno', 'tune-upgrades', 'tune-exhaust', 'tune-suspension', 'tune-turbo']),
  (SELECT id FROM categories WHERE slug = 'auto-tuning-service'),
  unnest(ARRAY['ECU тунинг', 'Dyno тунинг', 'Performance ъпгрейди', 'Модификации ауспух', 'Тунинг окачване', 'Монтаж турбо']),
  '🏎️'
ON CONFLICT (slug) DO NOTHING;

-- Vans L3 (parent: vehicles-vans)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Cargo Vans For Sale', 'Passenger Vans For Sale', 'Minivans For Sale', 'Commercial Vans', 'Used Vans']),
  unnest(ARRAY['van-sale-cargo', 'van-sale-passenger', 'van-sale-mini', 'van-sale-commercial', 'van-sale-used']),
  (SELECT id FROM categories WHERE slug = 'vehicles-vans'),
  unnest(ARRAY['Товарни вани', 'Пътнически вани', 'Миниване', 'Търговски вани', 'Употребявани вани']),
  '🚐'
ON CONFLICT (slug) DO NOTHING;
;
