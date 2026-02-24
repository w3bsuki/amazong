
-- Phase 3.1.1: Automotive Engine Parts L3 Categories
-- Adding proper L3 subcategories to engine-related L2 categories

-- Engine Parts L3 (parent: engine-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Air Filters', 'Oil Filters', 'Fuel Filters', 'Spark Plugs', 'Ignition Coils', 'Timing Belts', 'Timing Chains', 'Gaskets & Seals', 'Pistons', 'Camshafts', 'Crankshafts', 'Valves', 'Engine Mounts', 'Turbochargers', 'Superchargers']),
  unnest(ARRAY['engine-air-filters', 'engine-oil-filters', 'engine-fuel-filters', 'engine-spark-plugs', 'engine-ignition-coils', 'engine-timing-belts', 'engine-timing-chains', 'engine-gaskets-seals', 'engine-pistons', 'engine-camshafts', 'engine-crankshafts', 'engine-valves', 'engine-mounts', 'engine-turbochargers', 'engine-superchargers']),
  (SELECT id FROM categories WHERE slug = 'engine-parts'),
  unnest(ARRAY['Въздушни филтри', 'Маслени филтри', 'Горивни филтри', 'Запалителни свещи', 'Бобини', 'Ангренажни ремъци', 'Вериги ГРМ', 'Гарнитури и уплътнения', 'Бутала', 'Разпределителни валове', 'Колянови валове', 'Клапани', 'Тампони на двигателя', 'Турбокомпресори', 'Компресори']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- Oil & Fluids L3 (parent: oil-fluids)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Engine Oil', 'Transmission Fluid', 'Brake Fluid', 'Coolant & Antifreeze', 'Power Steering Fluid', 'Differential Fluid', 'Gear Oil', 'Fuel Additives', 'Oil Additives', 'Washer Fluid']),
  unnest(ARRAY['oil-engine', 'oil-transmission', 'oil-brake-fluid', 'oil-coolant', 'oil-power-steering', 'oil-differential', 'oil-gear', 'oil-fuel-additives', 'oil-additives', 'oil-washer-fluid']),
  (SELECT id FROM categories WHERE slug = 'oil-fluids'),
  unnest(ARRAY['Моторно масло', 'Трансмисионно масло', 'Спирачна течност', 'Антифриз', 'Хидравлично масло', 'Диференциално масло', 'Редукторно масло', 'Добавки за гориво', 'Добавки за масло', 'Течност за чистачки']),
  '🛢️'
ON CONFLICT (slug) DO NOTHING;

-- Cooling System L3 (parent: cooling-system)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Radiators', 'Water Pumps', 'Thermostats', 'Cooling Fans', 'Hoses & Pipes', 'Expansion Tanks', 'Radiator Caps', 'Fan Clutches', 'Oil Coolers', 'Intercoolers']),
  unnest(ARRAY['cooling-radiators', 'cooling-water-pumps', 'cooling-thermostats', 'cooling-fans', 'cooling-hoses', 'cooling-expansion-tanks', 'cooling-radiator-caps', 'cooling-fan-clutches', 'cooling-oil-coolers', 'cooling-intercoolers']),
  (SELECT id FROM categories WHERE slug = 'cooling-system'),
  unnest(ARRAY['Радиатори', 'Водни помпи', 'Термостати', 'Вентилатори', 'Маркучи и тръби', 'Разширителни съдове', 'Капачки на радиатор', 'Съединители вентилатор', 'Маслени охладители', 'Интеркулери']),
  '❄️'
ON CONFLICT (slug) DO NOTHING;

-- Exhaust Parts L3 (parent: exhaust-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Exhaust Manifolds', 'Catalytic Converters', 'Mufflers', 'Exhaust Pipes', 'Exhaust Tips', 'Headers', 'Downpipes', 'Resonators', 'Exhaust Gaskets', 'Oxygen Sensors']),
  unnest(ARRAY['exhaust-manifolds', 'exhaust-catalytic-converters', 'exhaust-mufflers', 'exhaust-pipes', 'exhaust-tips', 'exhaust-headers', 'exhaust-downpipes', 'exhaust-resonators', 'exhaust-gaskets', 'exhaust-oxygen-sensors']),
  (SELECT id FROM categories WHERE slug = 'exhaust-parts'),
  unnest(ARRAY['Изпускателни колектори', 'Катализатори', 'Заглушители', 'Изпускателни тръби', 'Накрайници', 'Хедъри', 'Даунпайпове', 'Резонатори', 'Гарнитури ауспух', 'Ламбда сонди']),
  '💨'
ON CONFLICT (slug) DO NOTHING;

-- Exhaust L3 (parent: exhaust - duplicate category)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Performance Exhaust Systems', 'Cat-Back Systems', 'Axle-Back Systems', 'Turbo-Back Systems', 'Exhaust Cutouts']),
  unnest(ARRAY['exhaust-performance-systems', 'exhaust-cat-back', 'exhaust-axle-back', 'exhaust-turbo-back', 'exhaust-cutouts']),
  (SELECT id FROM categories WHERE slug = 'exhaust'),
  unnest(ARRAY['Спортни ауспуси', 'Cat-Back системи', 'Axle-Back системи', 'Turbo-Back системи', 'Изпускателни клапи']),
  '💨'
ON CONFLICT (slug) DO NOTHING;

-- Transmission Parts L3 (parent: transmission-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Clutch Kits', 'Clutch Discs', 'Pressure Plates', 'Flywheels', 'Slave Cylinders', 'Master Cylinders', 'Shift Cables', 'Bearings', 'Synchros', 'Torque Converters']),
  unnest(ARRAY['trans-clutch-kits', 'trans-clutch-discs', 'trans-pressure-plates', 'trans-flywheels', 'trans-slave-cylinders', 'trans-master-cylinders', 'trans-shift-cables', 'trans-bearings', 'trans-synchros', 'trans-torque-converters']),
  (SELECT id FROM categories WHERE slug = 'transmission-parts'),
  unnest(ARRAY['Комплекти съединител', 'Феродови дискове', 'Притискащи дискове', 'Маховици', 'Работни цилиндри', 'Главни цилиндри', 'Кабели на скорости', 'Лагери', 'Синхрони', 'Хидротрансформатори']),
  '⚙️'
ON CONFLICT (slug) DO NOTHING;

-- Transmission L3 (parent: transmission)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Manual Transmissions', 'Automatic Transmissions', 'CVT Transmissions', 'Dual-Clutch Transmissions', 'Transfer Cases', 'Differentials']),
  unnest(ARRAY['trans-manual', 'trans-automatic', 'trans-cvt', 'trans-dual-clutch', 'trans-transfer-cases', 'trans-differentials']),
  (SELECT id FROM categories WHERE slug = 'transmission'),
  unnest(ARRAY['Механични скоростни кутии', 'Автоматични скоростни кутии', 'CVT скоростни кутии', 'Двусъединителни кутии', 'Раздатки', 'Диференциали']),
  '⚙️'
ON CONFLICT (slug) DO NOTHING;
;
