
-- Phase 5: Services - Automotive & Cleaning L3s

-- Automotive > Auto Repair L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Engine Repair', 'Brake Repair', 'Suspension Repair', 'Exhaust Repair', 'Diagnostic Services', 'Scheduled Maintenance']),
  unnest(ARRAY['auto-repair-engine', 'auto-repair-brake', 'auto-repair-suspension', 'auto-repair-exhaust', 'auto-repair-diagnostic', 'auto-repair-scheduled']),
  (SELECT id FROM categories WHERE slug = 'svc-auto-repair'),
  unnest(ARRAY['Ремонт на двигател', 'Ремонт на спирачки', 'Ремонт на окачване', 'Ремонт на ауспух', 'Диагностика', 'Планиран сервиз']),
  '🔧',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Automotive > Car Wash & Detailing L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Express Wash', 'Full Service Wash', 'Interior Detailing', 'Exterior Detailing', 'Paint Correction', 'Ceramic Coating']),
  unnest(ARRAY['carwash-express', 'carwash-full', 'carwash-interior', 'carwash-exterior', 'carwash-paint', 'carwash-ceramic']),
  (SELECT id FROM categories WHERE slug = 'svc-auto-wash-detailing'),
  unnest(ARRAY['Експресно миене', 'Пълно миене', 'Детайлинг интериор', 'Детайлинг екстериор', 'Полиране', 'Керамично покритие']),
  '🚗',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Automotive > Tire Services L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Tire Replacement', 'Tire Balancing', 'Wheel Alignment', 'Tire Rotation', 'Flat Tire Repair', 'Seasonal Tire Change']),
  unnest(ARRAY['tire-replace', 'tire-balance', 'tire-align', 'tire-rotate', 'tire-flat', 'tire-seasonal']),
  (SELECT id FROM categories WHERE slug = 'svc-auto-tires'),
  unnest(ARRAY['Смяна на гуми', 'Баланс на гуми', 'Геометрия', 'Ротация на гуми', 'Ремонт на спукана гума', 'Сезонна смяна на гуми']),
  '🛞',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Cleaning > Residential Cleaning L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Regular Cleaning', 'Deep House Cleaning', 'One-time Cleaning', 'Apartment Cleaning', 'Villa Cleaning', 'Recurring Cleaning']),
  unnest(ARRAY['clean-res-regular', 'clean-res-deep', 'clean-res-onetime', 'clean-res-apartment', 'clean-res-villa', 'clean-res-recurring']),
  (SELECT id FROM categories WHERE slug = 'cleaning-residential'),
  unnest(ARRAY['Редовно почистване', 'Основно почистване', 'Еднократно почистване', 'Почистване на апартамент', 'Почистване на къща', 'Абонаментно почистване']),
  '🧹',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Cleaning > Commercial Cleaning L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Office Cleaning', 'Retail Store Cleaning', 'Restaurant Cleaning', 'Medical Facility Cleaning', 'School Cleaning', 'Warehouse Cleaning']),
  unnest(ARRAY['clean-com-office', 'clean-com-retail', 'clean-com-restaurant', 'clean-com-medical', 'clean-com-school', 'clean-com-warehouse']),
  (SELECT id FROM categories WHERE slug = 'cleaning-commercial'),
  unnest(ARRAY['Почистване на офис', 'Почистване на магазин', 'Почистване на ресторант', 'Почистване на клиника', 'Почистване на училище', 'Почистване на склад']),
  '🏢',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Cleaning > Carpet Cleaning L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Steam Carpet Cleaning', 'Dry Carpet Cleaning', 'Rug Cleaning', 'Pet Stain Removal', 'Area Rug Cleaning', 'Commercial Carpet Cleaning']),
  unnest(ARRAY['carpet-steam', 'carpet-dry', 'carpet-rug', 'carpet-pet', 'carpet-area', 'carpet-commercial']),
  (SELECT id FROM categories WHERE slug = 'cleaning-carpet'),
  unnest(ARRAY['Парно чистене на мокет', 'Сухо чистене на мокет', 'Чистене на килими', 'Премахване на петна от животни', 'Чистене на килими', 'Комерсиално чистене на мокет']),
  '🧼',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Cleaning > Window Cleaning L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Residential Windows', 'Commercial Windows', 'High-Rise Windows', 'Skylight Cleaning', 'Screen Cleaning', 'Post-Construction Windows']),
  unnest(ARRAY['window-residential', 'window-commercial', 'window-highrise', 'window-skylight', 'window-screen', 'window-post-construction']),
  (SELECT id FROM categories WHERE slug = 'cleaning-window'),
  unnest(ARRAY['Прозорци на жилища', 'Комерсиални прозорци', 'Високи сгради', 'Чистене на покривни прозорци', 'Чистене на комарници', 'Прозорци след строеж']),
  '🪟',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
