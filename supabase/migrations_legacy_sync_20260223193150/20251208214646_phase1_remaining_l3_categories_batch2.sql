
-- Phase 1: Add remaining L3 categories - Batch 2
-- Desktop PCs, Laptops, and Monitors remaining L2s

-- All-in-One Computers L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['iMac', 'Windows All-in-One', 'Touch Screen AIO', 'Business All-in-One']),
  unnest(ARRAY['iMac', 'Windows All-in-One', 'Със сензорен екран', 'Бизнес All-in-One']),
  unnest(ARRAY['pc-imac', 'pc-windows-aio', 'pc-touch-aio', 'pc-business-aio']),
  (SELECT id FROM categories WHERE slug = 'pc-allinone'),
  'Monitor'
ON CONFLICT (slug) DO NOTHING;

-- Custom Build PCs L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Gaming Builds', 'Workstation Builds', 'Budget Builds', 'ITX Builds', 'Streaming Builds']),
  unnest(ARRAY['Гейминг билдове', 'Workstation билдове', 'Бюджетни билдове', 'ITX билдове', 'Стрийминг билдове']),
  unnest(ARRAY['pc-custom-gaming', 'pc-custom-workstation', 'pc-custom-budget', 'pc-custom-itx', 'pc-custom-streaming']),
  (SELECT id FROM categories WHERE slug = 'custom-build-pcs'),
  'Cpu'
ON CONFLICT (slug) DO NOTHING;

-- Chromebooks L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['11-12 inch Chromebooks', '13-14 inch Chromebooks', '15 inch Chromebooks', 'Chromebook Tablets', '2-in-1 Chromebooks']),
  unnest(ARRAY['11-12 инча Chromebook', '13-14 инча Chromebook', '15 инча Chromebook', 'Chromebook таблети', '2-в-1 Chromebook']),
  unnest(ARRAY['chromebook-11-12', 'chromebook-13-14', 'chromebook-15', 'chromebook-tablets', 'chromebook-2in1']),
  (SELECT id FROM categories WHERE slug = 'laptops-chromebooks'),
  'Laptop'
ON CONFLICT (slug) DO NOTHING;

-- Convertible Laptops L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Surface Pro', 'Lenovo Yoga', 'HP Spectre x360', 'Dell XPS 2-in-1', 'ASUS ZenBook Flip']),
  unnest(ARRAY['Surface Pro', 'Lenovo Yoga', 'HP Spectre x360', 'Dell XPS 2-in-1', 'ASUS ZenBook Flip']),
  unnest(ARRAY['convertible-surface-pro', 'convertible-yoga', 'convertible-spectre', 'convertible-xps', 'convertible-zenbook']),
  (SELECT id FROM categories WHERE slug = 'laptops-convertible'),
  'Laptop'
ON CONFLICT (slug) DO NOTHING;

-- Docking Stations L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['USB-C Docks', 'Thunderbolt Docks', 'USB-A Docks', 'Laptop Docking Stations', 'Monitor Docks']),
  unnest(ARRAY['USB-C докове', 'Thunderbolt докове', 'USB-A докове', 'Докинг станции', 'Докове за монитор']),
  unnest(ARRAY['dock-usbc', 'dock-thunderbolt', 'dock-usba', 'dock-laptop', 'dock-monitor']),
  (SELECT id FROM categories WHERE slug = 'laptops-docking-stations'),
  'PlugZap'
ON CONFLICT (slug) DO NOTHING;

-- Laptop Accessories L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Laptop Skins', 'Keyboard Covers', 'Privacy Screens', 'Webcam Covers', 'Port Adapters']),
  unnest(ARRAY['Скинове за лаптоп', 'Протектори клавиатура', 'Privacy екрани', 'Капаци камера', 'Адаптери за портове']),
  unnest(ARRAY['laptop-acc-skins', 'laptop-acc-keyboard-covers', 'laptop-acc-privacy', 'laptop-acc-webcam-covers', 'laptop-acc-port-adapters']),
  (SELECT id FROM categories WHERE slug = 'laptops-accessories'),
  'Laptop'
ON CONFLICT (slug) DO NOTHING;

-- Laptop Bags L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Laptop Backpacks', 'Laptop Sleeves', 'Messenger Bags', 'Briefcases', 'Rolling Laptop Bags']),
  unnest(ARRAY['Раници за лаптоп', 'Калъфи за лаптоп', 'Чанти през рамо', 'Куфарчета', 'Раници с колела']),
  unnest(ARRAY['laptop-bag-backpack', 'laptop-bag-sleeve', 'laptop-bag-messenger', 'laptop-bag-briefcase', 'laptop-bag-rolling']),
  (SELECT id FROM categories WHERE slug = 'laptops-bags'),
  'Briefcase'
ON CONFLICT (slug) DO NOTHING;

-- Laptop Chargers L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['USB-C Chargers', 'MagSafe Chargers', 'Universal Chargers', 'Car Chargers', 'GaN Chargers']),
  unnest(ARRAY['USB-C зарядни', 'MagSafe зарядни', 'Универсални зарядни', 'Зарядни за кола', 'GaN зарядни']),
  unnest(ARRAY['laptop-charger-usbc', 'laptop-charger-magsafe', 'laptop-charger-universal', 'laptop-charger-car', 'laptop-charger-gan']),
  (SELECT id FROM categories WHERE slug = 'laptops-chargers'),
  'BatteryCharging'
ON CONFLICT (slug) DO NOTHING;

-- Laptop Cooling L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Cooling Pads', 'Vacuum Coolers', 'Laptop Fans', 'Thermal Paste', 'Cooling Stands']),
  unnest(ARRAY['Охлаждащи подложки', 'Вакуумни охладители', 'Вентилатори', 'Термопаста', 'Охлаждащи стойки']),
  unnest(ARRAY['laptop-cool-pad', 'laptop-cool-vacuum', 'laptop-cool-fan', 'laptop-cool-paste', 'laptop-cool-stand']),
  (SELECT id FROM categories WHERE slug = 'laptops-cooling'),
  'Fan'
ON CONFLICT (slug) DO NOTHING;

-- Laptop Stands L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Adjustable Stands', 'Fixed Stands', 'Portable Stands', 'Ergonomic Stands', 'Multi-Device Stands']),
  unnest(ARRAY['Регулируеми стойки', 'Фиксирани стойки', 'Преносими стойки', 'Ергономични стойки', 'Мулти стойки']),
  unnest(ARRAY['laptop-stand-adjustable', 'laptop-stand-fixed', 'laptop-stand-portable', 'laptop-stand-ergonomic', 'laptop-stand-multi']),
  (SELECT id FROM categories WHERE slug = 'laptops-stands'),
  'MonitorUp'
ON CONFLICT (slug) DO NOTHING;

-- MacBooks L3 subcategories (additional)
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['MacBook Air M1', 'MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 14"', 'MacBook Pro 16"', 'MacBook Pro M3 Pro', 'MacBook Pro M3 Max']),
  unnest(ARRAY['MacBook Air M1', 'MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 14"', 'MacBook Pro 16"', 'MacBook Pro M3 Pro', 'MacBook Pro M3 Max']),
  unnest(ARRAY['macbook-air-m1', 'macbook-air-m2', 'macbook-air-m3', 'macbook-pro-14', 'macbook-pro-16', 'macbook-pro-m3pro', 'macbook-pro-m3max']),
  (SELECT id FROM categories WHERE slug = 'laptops-macbooks'),
  'Laptop'
ON CONFLICT (slug) DO NOTHING;

-- RTX Laptops L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['RTX 4090 Laptops', 'RTX 4080 Laptops', 'RTX 4070 Laptops', 'RTX 4060 Laptops', 'RTX 4050 Laptops']),
  unnest(ARRAY['RTX 4090 лаптопи', 'RTX 4080 лаптопи', 'RTX 4070 лаптопи', 'RTX 4060 лаптопи', 'RTX 4050 лаптопи']),
  unnest(ARRAY['rtx-laptop-4090', 'rtx-laptop-4080', 'rtx-laptop-4070', 'rtx-laptop-4060', 'rtx-laptop-4050']),
  (SELECT id FROM categories WHERE slug = 'laptops-gaming-rtx'),
  'Gamepad'
ON CONFLICT (slug) DO NOTHING;

-- Screen Protectors (Laptops) L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['MacBook Screen Protectors', 'Windows Laptop Protectors', 'Anti-Glare Protectors', 'Privacy Screen Protectors']),
  unnest(ARRAY['Протектори MacBook', 'Протектори Windows', 'Антирефлексни', 'Privacy протектори']),
  unnest(ARRAY['screen-prot-macbook', 'screen-prot-windows', 'screen-prot-antiglare', 'screen-prot-privacy']),
  (SELECT id FROM categories WHERE slug = 'laptops-screen-protectors'),
  'ShieldCheck'
ON CONFLICT (slug) DO NOTHING;

-- 144Hz Monitors L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['24" 144Hz', '27" 144Hz', '32" 144Hz', '144Hz Curved', '144Hz IPS']),
  unnest(ARRAY['24" 144Hz', '27" 144Hz', '32" 144Hz', '144Hz извит', '144Hz IPS']),
  unnest(ARRAY['mon-144hz-24', 'mon-144hz-27', 'mon-144hz-32', 'mon-144hz-curved', 'mon-144hz-ips']),
  (SELECT id FROM categories WHERE slug = 'monitors-gaming-144hz'),
  'Monitor'
ON CONFLICT (slug) DO NOTHING;

-- 240Hz Monitors L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['24" 240Hz', '27" 240Hz', '32" 240Hz', '240Hz 1080p', '240Hz 1440p']),
  unnest(ARRAY['24" 240Hz', '27" 240Hz', '32" 240Hz', '240Hz 1080p', '240Hz 1440p']),
  unnest(ARRAY['mon-240hz-24', 'mon-240hz-27', 'mon-240hz-32', 'mon-240hz-1080p', 'mon-240hz-1440p']),
  (SELECT id FROM categories WHERE slug = 'monitors-gaming-240hz'),
  'Monitor'
ON CONFLICT (slug) DO NOTHING;
;
