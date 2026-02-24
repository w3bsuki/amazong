
-- Phase 1: Add remaining L3 categories - Batch 3
-- Audio, Monitors, Networking, TVs remaining L2s

-- Portable Speakers (duplicate slug) L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['JBL Speakers', 'Bose Speakers', 'Sony Speakers', 'Ultimate Ears', 'Anker Speakers', 'Marshall Speakers']),
  unnest(ARRAY['JBL тонколони', 'Bose тонколони', 'Sony тонколони', 'Ultimate Ears', 'Anker тонколони', 'Marshall тонколони']),
  unnest(ARRAY['portable-spk-jbl', 'portable-spk-bose', 'portable-spk-sony', 'portable-spk-ue', 'portable-spk-anker', 'portable-spk-marshall']),
  (SELECT id FROM categories WHERE slug = 'portable-speakers'),
  'Speaker'
ON CONFLICT (slug) DO NOTHING;

-- Soundbars & Speakers L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['2.0 Soundbars', '2.1 Soundbars', '3.1 Soundbars', '5.1 Soundbars', 'Dolby Atmos Soundbars', 'Soundbar Subwoofers']),
  unnest(ARRAY['2.0 саундбари', '2.1 саундбари', '3.1 саундбари', '5.1 саундбари', 'Dolby Atmos саундбари', 'Субуфери за саундбар']),
  unnest(ARRAY['soundbar-20', 'soundbar-21', 'soundbar-31', 'soundbar-51', 'soundbar-atmos', 'soundbar-subwoofer']),
  (SELECT id FROM categories WHERE slug = 'soundbars-speakers'),
  'Speaker'
ON CONFLICT (slug) DO NOTHING;

-- Curved Monitors L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['27" Curved', '32" Curved', '34" Curved Ultrawide', '49" Super Ultrawide', '1000R Curved', '1500R Curved']),
  unnest(ARRAY['27" извити', '32" извити', '34" извити ultrawide', '49" супер ultrawide', '1000R извити', '1500R извити']),
  unnest(ARRAY['curved-mon-27', 'curved-mon-32', 'curved-mon-34uw', 'curved-mon-49suw', 'curved-mon-1000r', 'curved-mon-1500r']),
  (SELECT id FROM categories WHERE slug = 'curved-monitors'),
  'Monitor'
ON CONFLICT (slug) DO NOTHING;

-- Monitor Arms L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Single Monitor Arms', 'Dual Monitor Arms', 'Triple Monitor Arms', 'Wall Mount Arms', 'Desk Clamp Arms', 'Gas Spring Arms']),
  unnest(ARRAY['Единични рамена', 'Двойни рамена', 'Тройни рамена', 'Стенни рамена', 'Настолни рамена', 'Газови рамена']),
  unnest(ARRAY['arm-single', 'arm-dual', 'arm-triple', 'arm-wall', 'arm-desk-clamp', 'arm-gas-spring']),
  (SELECT id FROM categories WHERE slug = 'monitors-arms'),
  'Maximize'
ON CONFLICT (slug) DO NOTHING;

-- Monitor Stands L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Basic Stands', 'Adjustable Stands', 'Riser Stands', 'Dual Monitor Stands', 'Laptop + Monitor Stands']),
  unnest(ARRAY['Основни стойки', 'Регулируеми стойки', 'Повдигащи стойки', 'Двойни стойки', 'Лаптоп + монитор стойки']),
  unnest(ARRAY['stand-basic', 'stand-adjustable', 'stand-riser', 'stand-dual-mon', 'stand-laptop-mon']),
  (SELECT id FROM categories WHERE slug = 'monitors-stands'),
  'MonitorUp'
ON CONFLICT (slug) DO NOTHING;

-- Office Monitors L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['24" Office', '27" Office', '32" Office', '4K Office', 'USB-C Office Monitors']),
  unnest(ARRAY['24" офис', '27" офис', '32" офис', '4K офис', 'USB-C офис монитори']),
  unnest(ARRAY['office-mon-24', 'office-mon-27', 'office-mon-32', 'office-mon-4k', 'office-mon-usbc']),
  (SELECT id FROM categories WHERE slug = 'monitors-office'),
  'Monitor'
ON CONFLICT (slug) DO NOTHING;

-- Portable Monitors L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['13-14" Portable', '15.6" Portable', '17" Portable', 'Touch Portable', 'OLED Portable', '4K Portable']),
  unnest(ARRAY['13-14" преносими', '15.6" преносими', '17" преносими', 'Touch преносими', 'OLED преносими', '4K преносими']),
  unnest(ARRAY['portable-mon-13-14', 'portable-mon-156', 'portable-mon-17', 'portable-mon-touch', 'portable-mon-oled', 'portable-mon-4k']),
  (SELECT id FROM categories WHERE slug = 'monitors-portable'),
  'MonitorSmartphone'
ON CONFLICT (slug) DO NOTHING;

-- Professional Monitors L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Color Accurate Monitors', 'Video Editing Monitors', 'Photo Editing Monitors', 'CAD Monitors', 'Reference Monitors']),
  unnest(ARRAY['Цветно точни монитори', 'За видео редакция', 'За фото редакция', 'CAD монитори', 'Референтни монитори']),
  unnest(ARRAY['pro-mon-color', 'pro-mon-video', 'pro-mon-photo', 'pro-mon-cad', 'pro-mon-reference']),
  (SELECT id FROM categories WHERE slug = 'monitors-professional'),
  'PencilRuler'
ON CONFLICT (slug) DO NOTHING;

-- Ultrawide Monitors L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['29" Ultrawide', '34" Ultrawide', '38" Ultrawide', '49" Super Ultrawide', '21:9 Ultrawide', '32:9 Super Ultrawide']),
  unnest(ARRAY['29" ultrawide', '34" ultrawide', '38" ultrawide', '49" супер ultrawide', '21:9 ultrawide', '32:9 супер ultrawide']),
  unnest(ARRAY['uw-mon-29', 'uw-mon-34', 'uw-mon-38', 'uw-mon-49', 'uw-mon-219', 'uw-mon-329']),
  (SELECT id FROM categories WHERE slug = 'ultrawide-monitors'),
  'Monitor'
ON CONFLICT (slug) DO NOTHING;

-- Access Points L3 subcategories  
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['WiFi 6 Access Points', 'WiFi 6E Access Points', 'WiFi 7 Access Points', 'Outdoor Access Points', 'Ceiling Access Points']),
  unnest(ARRAY['WiFi 6 access points', 'WiFi 6E access points', 'WiFi 7 access points', 'Външни access points', 'Таванни access points']),
  unnest(ARRAY['ap-wifi6', 'ap-wifi6e', 'ap-wifi7', 'ap-outdoor', 'ap-ceiling']),
  (SELECT id FROM categories WHERE slug = 'networking-access-points'),
  'Wifi'
ON CONFLICT (slug) DO NOTHING;

-- Cat6 Cables L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Cat6 1-3m', 'Cat6 5m', 'Cat6 10m', 'Cat6 20m+', 'Cat6a Cables', 'Flat Cat6 Cables']),
  unnest(ARRAY['Cat6 1-3m', 'Cat6 5m', 'Cat6 10m', 'Cat6 20m+', 'Cat6a кабели', 'Плоски Cat6 кабели']),
  unnest(ARRAY['cat6-1-3m', 'cat6-5m', 'cat6-10m', 'cat6-20m-plus', 'cat6a-cables', 'cat6-flat']),
  (SELECT id FROM categories WHERE slug = 'networking-cables-cat6'),
  'Cable'
ON CONFLICT (slug) DO NOTHING;

-- Ethernet Cables L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Cat5e Cables', 'Cat6 Cables', 'Cat6a Cables', 'Cat7 Cables', 'Cat8 Cables', 'Patch Cables']),
  unnest(ARRAY['Cat5e кабели', 'Cat6 кабели', 'Cat6a кабели', 'Cat7 кабели', 'Cat8 кабели', 'Patch кабели']),
  unnest(ARRAY['eth-cat5e', 'eth-cat6', 'eth-cat6a', 'eth-cat7', 'eth-cat8', 'eth-patch']),
  (SELECT id FROM categories WHERE slug = 'ethernet-cables'),
  'Cable'
ON CONFLICT (slug) DO NOTHING;

-- Firewalls L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Home Firewalls', 'Business Firewalls', 'UTM Appliances', 'VPN Firewalls']),
  unnest(ARRAY['Домашни firewalls', 'Бизнес firewalls', 'UTM устройства', 'VPN firewalls']),
  unnest(ARRAY['firewall-home', 'firewall-business', 'firewall-utm', 'firewall-vpn']),
  (SELECT id FROM categories WHERE slug = 'networking-firewalls'),
  'ShieldCheck'
ON CONFLICT (slug) DO NOTHING;
;
