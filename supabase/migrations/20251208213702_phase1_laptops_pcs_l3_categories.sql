
-- Phase 1.3: Add L3 PC & Laptop Categories

-- Add MacBook Air Models under MacBook Air L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['MacBook Air M3 15"', 'MacBook Air M3 13"', 'MacBook Air M2 15"', 'MacBook Air M2 13"', 'MacBook Air M1']),
  unnest(ARRAY['macbook-air-m3-15', 'macbook-air-m3-13', 'macbook-air-m2-15', 'macbook-air-m2-13', 'macbook-air-m1']),
  (SELECT id FROM categories WHERE slug = 'laptops-macbook-air'),
  unnest(ARRAY['MacBook Air M3 15"', 'MacBook Air M3 13"', 'MacBook Air M2 15"', 'MacBook Air M2 13"', 'MacBook Air M1']),
  '💻'
ON CONFLICT (slug) DO NOTHING;

-- Add MacBook Pro Models under MacBook Pro L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['MacBook Pro M3 Max 16"', 'MacBook Pro M3 Pro 16"', 'MacBook Pro M3 Pro 14"', 'MacBook Pro M3 14"', 'MacBook Pro M2 Max', 'MacBook Pro M2 Pro', 'MacBook Pro M2', 'MacBook Pro M1 Pro', 'MacBook Pro M1 Max']),
  unnest(ARRAY['macbook-pro-m3-max-16', 'macbook-pro-m3-pro-16', 'macbook-pro-m3-pro-14', 'macbook-pro-m3-14', 'macbook-pro-m2-max', 'macbook-pro-m2-pro', 'macbook-pro-m2', 'macbook-pro-m1-pro', 'macbook-pro-m1-max']),
  (SELECT id FROM categories WHERE slug = 'laptops-macbook-pro'),
  unnest(ARRAY['MacBook Pro M3 Max 16"', 'MacBook Pro M3 Pro 16"', 'MacBook Pro M3 Pro 14"', 'MacBook Pro M3 14"', 'MacBook Pro M2 Max', 'MacBook Pro M2 Pro', 'MacBook Pro M2', 'MacBook Pro M1 Pro', 'MacBook Pro M1 Max']),
  '💻'
ON CONFLICT (slug) DO NOTHING;

-- Add Business Laptop Brands under Business Laptops L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Lenovo ThinkPad T Series', 'Lenovo ThinkPad X Series', 'Lenovo ThinkPad L Series', 'HP EliteBook Series', 'HP ProBook Series', 'Dell Latitude 9000', 'Dell Latitude 7000', 'Dell Latitude 5000', 'Dell Vostro', 'ASUS ExpertBook']),
  unnest(ARRAY['thinkpad-t-series', 'thinkpad-x-series', 'thinkpad-l-series', 'hp-elitebook-series', 'hp-probook-series', 'dell-latitude-9000', 'dell-latitude-7000', 'dell-latitude-5000', 'dell-vostro', 'asus-expertbook']),
  (SELECT id FROM categories WHERE slug = 'business-laptops'),
  unnest(ARRAY['Lenovo ThinkPad T Серия', 'Lenovo ThinkPad X Серия', 'Lenovo ThinkPad L Серия', 'HP EliteBook Серия', 'HP ProBook Серия', 'Dell Latitude 9000', 'Dell Latitude 7000', 'Dell Latitude 5000', 'Dell Vostro', 'ASUS ExpertBook']),
  '💼'
ON CONFLICT (slug) DO NOTHING;

-- Add Ultrabook Brands under Ultrabooks L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dell XPS 13', 'Dell XPS 15', 'Dell XPS 17', 'HP Spectre x360', 'HP Envy', 'ASUS ZenBook Pro', 'ASUS ZenBook S', 'ASUS ZenBook 14', 'Lenovo Yoga 9i', 'Lenovo Yoga Slim', 'LG Gram', 'Acer Swift', 'Razer Blade Stealth', 'Microsoft Surface Laptop']),
  unnest(ARRAY['dell-xps-13', 'dell-xps-15', 'dell-xps-17', 'hp-spectre-x360', 'hp-envy', 'asus-zenbook-pro', 'asus-zenbook-s', 'asus-zenbook-14', 'lenovo-yoga-9i', 'lenovo-yoga-slim', 'lg-gram', 'acer-swift', 'razer-blade-stealth', 'surface-laptop']),
  (SELECT id FROM categories WHERE slug = 'laptops-ultrabooks'),
  unnest(ARRAY['Dell XPS 13', 'Dell XPS 15', 'Dell XPS 17', 'HP Spectre x360', 'HP Envy', 'ASUS ZenBook Pro', 'ASUS ZenBook S', 'ASUS ZenBook 14', 'Lenovo Yoga 9i', 'Lenovo Yoga Slim', 'LG Gram', 'Acer Swift', 'Razer Blade Stealth', 'Microsoft Surface Laptop']),
  '💻'
ON CONFLICT (slug) DO NOTHING;

-- Add Mini PC Brands under Mini PCs L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Apple Mac Mini', 'Mac Mini M2', 'Mac Mini M2 Pro', 'Intel NUC', 'ASUS PN Series', 'Beelink Mini PCs', 'Minisforum', 'GEEKOM Mini PCs', 'GMK NucBox', 'Lenovo ThinkCentre Tiny']),
  unnest(ARRAY['apple-mac-mini', 'mac-mini-m2', 'mac-mini-m2-pro', 'intel-nuc', 'asus-pn-series', 'beelink-mini-pcs', 'minisforum', 'geekom-mini-pcs', 'gmk-nucbox', 'lenovo-thinkcentre-tiny']),
  (SELECT id FROM categories WHERE slug = 'mini-pcs'),
  unnest(ARRAY['Apple Mac Mini', 'Mac Mini M2', 'Mac Mini M2 Pro', 'Intel NUC', 'ASUS PN Серия', 'Beelink Мини Компютри', 'Minisforum', 'GEEKOM Мини Компютри', 'GMK NucBox', 'Lenovo ThinkCentre Tiny']),
  '🖥️'
ON CONFLICT (slug) DO NOTHING;

-- Add Workstation Laptop Brands under Workstation Laptops L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dell Precision 7000', 'Dell Precision 5000', 'Dell Precision 3000', 'Lenovo ThinkPad P Series', 'HP ZBook Fury', 'HP ZBook Power', 'HP ZBook Studio', 'ASUS ProArt StudioBook', 'MSI CreatorPro', 'Apple MacBook Pro Workstation']),
  unnest(ARRAY['dell-precision-7000', 'dell-precision-5000', 'dell-precision-3000', 'thinkpad-p-series', 'hp-zbook-fury', 'hp-zbook-power', 'hp-zbook-studio', 'asus-proart-studiobook', 'msi-creatorpro', 'macbook-pro-workstation']),
  (SELECT id FROM categories WHERE slug = 'laptops-workstations'),
  unnest(ARRAY['Dell Precision 7000', 'Dell Precision 5000', 'Dell Precision 3000', 'Lenovo ThinkPad P Серия', 'HP ZBook Fury', 'HP ZBook Power', 'HP ZBook Studio', 'ASUS ProArt StudioBook', 'MSI CreatorPro', 'Apple MacBook Pro Workstation']),
  '🖥️'
ON CONFLICT (slug) DO NOTHING;

-- Add Desktop Workstation Brands under Workstations L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dell Precision Tower', 'Lenovo ThinkStation P Series', 'HP Z Workstation', 'Apple Mac Studio', 'Apple Mac Pro', 'ASUS ProArt Desktop', 'BOXX Workstations']),
  unnest(ARRAY['dell-precision-tower', 'thinkstation-p-series', 'hp-z-workstation', 'apple-mac-studio', 'apple-mac-pro', 'asus-proart-desktop', 'boxx-workstations']),
  (SELECT id FROM categories WHERE slug = 'workstations'),
  unnest(ARRAY['Dell Precision Tower', 'Lenovo ThinkStation P Серия', 'HP Z Workstation', 'Apple Mac Studio', 'Apple Mac Pro', 'ASUS ProArt Desktop', 'BOXX Workstations']),
  '🖥️'
ON CONFLICT (slug) DO NOTHING;

-- Add 2-in-1 Laptop Models under 2-in-1 Laptops L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Microsoft Surface Pro', 'Lenovo Yoga 2-in-1', 'HP Spectre 2-in-1', 'Dell XPS 2-in-1', 'ASUS ZenBook Flip', 'Acer Spin', 'Samsung Galaxy Book Flex', 'Lenovo ThinkPad X1 Yoga']),
  unnest(ARRAY['surface-pro-2in1', 'lenovo-yoga-2in1', 'hp-spectre-2in1', 'dell-xps-2in1', 'asus-zenbook-flip', 'acer-spin', 'galaxy-book-flex', 'thinkpad-x1-yoga']),
  (SELECT id FROM categories WHERE slug = '2-in-1-laptops'),
  unnest(ARRAY['Microsoft Surface Pro', 'Lenovo Yoga 2-в-1', 'HP Spectre 2-в-1', 'Dell XPS 2-в-1', 'ASUS ZenBook Flip', 'Acer Spin', 'Samsung Galaxy Book Flex', 'Lenovo ThinkPad X1 Yoga']),
  '💻'
ON CONFLICT (slug) DO NOTHING;

-- Add Chromebook Brands under Chromebooks L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Google Pixelbook', 'ASUS Chromebook', 'Lenovo Chromebook Duet', 'HP Chromebook', 'Acer Chromebook', 'Samsung Chromebook', 'Dell Chromebook']),
  unnest(ARRAY['google-pixelbook', 'asus-chromebook', 'lenovo-chromebook-duet', 'hp-chromebook', 'acer-chromebook', 'samsung-chromebook', 'dell-chromebook']),
  (SELECT id FROM categories WHERE slug = 'chromebooks'),
  unnest(ARRAY['Google Pixelbook', 'ASUS Chromebook', 'Lenovo Chromebook Duet', 'HP Chromebook', 'Acer Chromebook', 'Samsung Chromebook', 'Dell Chromebook']),
  '💻'
ON CONFLICT (slug) DO NOTHING;

-- Add Student Laptop Options under Student Laptops L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Budget Student Laptops', 'MacBook Air for Students', 'Windows Student Laptops', 'Chromebook for Students', '2-in-1 for Students', 'Gaming Student Laptops']),
  unnest(ARRAY['budget-student-laptops', 'macbook-air-students', 'windows-student-laptops', 'chromebook-students', '2in1-students', 'gaming-student-laptops']),
  (SELECT id FROM categories WHERE slug = 'laptops-student'),
  unnest(ARRAY['Бюджетни Лаптопи за Ученици', 'MacBook Air за Студенти', 'Windows Лаптопи за Студенти', 'Chromebook за Студенти', '2-в-1 за Студенти', 'Гейминг за Студенти']),
  '🎓'
ON CONFLICT (slug) DO NOTHING;

-- Add Budget Laptop Categories under Budget Laptops L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Under $300 Laptops', '$300-$500 Laptops', 'Refurbished Laptops', 'Acer Aspire', 'HP Stream', 'Lenovo IdeaPad Budget', 'ASUS VivoBook Budget']),
  unnest(ARRAY['under-300-laptops', '300-500-laptops', 'refurbished-laptops', 'acer-aspire', 'hp-stream', 'lenovo-ideapad-budget', 'asus-vivobook-budget']),
  (SELECT id FROM categories WHERE slug = 'budget-laptops'),
  unnest(ARRAY['Под $300 Лаптопи', '$300-$500 Лаптопи', 'Реновирани Лаптопи', 'Acer Aspire', 'HP Stream', 'Lenovo IdeaPad Бюджетен', 'ASUS VivoBook Бюджетен']),
  '💰'
ON CONFLICT (slug) DO NOTHING;

-- Add All-in-One PC Brands under All-in-One PCs L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Apple iMac M3', 'Apple iMac M1', 'Dell Inspiron All-in-One', 'HP All-in-One', 'Lenovo IdeaCentre AIO', 'ASUS All-in-One', 'Microsoft Surface Studio']),
  unnest(ARRAY['apple-imac-m3', 'apple-imac-m1', 'dell-inspiron-aio', 'hp-all-in-one', 'lenovo-ideacentre-aio', 'asus-all-in-one', 'microsoft-surface-studio']),
  (SELECT id FROM categories WHERE slug = 'all-in-one-pcs'),
  unnest(ARRAY['Apple iMac M3', 'Apple iMac M1', 'Dell Inspiron All-in-One', 'HP All-in-One', 'Lenovo IdeaCentre AIO', 'ASUS All-in-One', 'Microsoft Surface Studio']),
  '🖥️'
ON CONFLICT (slug) DO NOTHING;
;
