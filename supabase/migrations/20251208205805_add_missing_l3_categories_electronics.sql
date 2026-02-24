-- PRODUCTION FIX: Add missing L3 categories for Electronics
-- Make structure consistent like iPhone (which has iPhone 15 Series, iPhone 16 Series, etc.)

-- Get parent IDs
DO $$
DECLARE
  gaming_desktops_id UUID;
  macbooks_id UUID;
  gaming_laptops_id UUID;
  samsung_phones_id UUID;
  pixel_phones_id UUID;
  smart_tvs_id UUID;
  monitors_id UUID;
  headphones_id UUID;
  gaming_pcs_id UUID;
  business_laptops_id UUID;
BEGIN
  -- Get Gaming Desktops ID (Electronics > Desktop PCs > Gaming Desktops)
  SELECT id INTO gaming_desktops_id FROM categories WHERE slug = 'gaming-desktops';
  
  -- Get MacBooks ID
  SELECT id INTO macbooks_id FROM categories WHERE slug = 'macbooks' OR slug = 'laptops-macbooks' LIMIT 1;
  
  -- Get Gaming Laptops ID  
  SELECT id INTO gaming_laptops_id FROM categories WHERE slug = 'gaming-laptops' OR slug = 'laptops-gaming' LIMIT 1;
  
  -- Get Samsung Phones ID
  SELECT id INTO samsung_phones_id FROM categories WHERE slug = 'smartphones-samsung';
  
  -- Get Pixel Phones ID
  SELECT id INTO pixel_phones_id FROM categories WHERE slug = 'smartphones-pixel';
  
  -- Get Smart TVs ID
  SELECT id INTO smart_tvs_id FROM categories WHERE slug = 'smart-tvs' OR slug = 'tvs-smart' LIMIT 1;
  
  -- Get Monitors ID
  SELECT id INTO monitors_id FROM categories WHERE slug = 'gaming-monitors' OR slug = 'monitors' LIMIT 1;
  
  -- Get Headphones ID
  SELECT id INTO headphones_id FROM categories WHERE slug = 'headphones' OR slug = 'audio-headphones' LIMIT 1;
  
  -- Get Gaming PCs ID (under Gaming L0)
  SELECT id INTO gaming_pcs_id FROM categories WHERE slug = 'gaming-pcs' OR slug = 'pc-gaming-desktops' LIMIT 1;
  
  -- Get Business Laptops ID
  SELECT id INTO business_laptops_id FROM categories WHERE slug = 'business-laptops';

  -- =====================================================
  -- GAMING DESKTOPS - Add brand/type L3 categories
  -- =====================================================
  IF gaming_desktops_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, description) VALUES
      ('ASUS ROG Gaming PCs', 'gaming-desktops-asus-rog', gaming_desktops_id, 'ASUS ROG геймърски компютри', 'Republic of Gamers desktop computers'),
      ('Alienware Gaming PCs', 'gaming-desktops-alienware', gaming_desktops_id, 'Alienware геймърски компютри', 'Dell Alienware gaming desktop computers'),
      ('HP OMEN Gaming PCs', 'gaming-desktops-hp-omen', gaming_desktops_id, 'HP OMEN геймърски компютри', 'HP OMEN gaming desktop computers'),
      ('Lenovo Legion Gaming PCs', 'gaming-desktops-lenovo-legion', gaming_desktops_id, 'Lenovo Legion геймърски компютри', 'Lenovo Legion gaming desktop computers'),
      ('MSI Gaming PCs', 'gaming-desktops-msi', gaming_desktops_id, 'MSI геймърски компютри', 'MSI gaming desktop computers'),
      ('Acer Predator Gaming PCs', 'gaming-desktops-acer-predator', gaming_desktops_id, 'Acer Predator геймърски компютри', 'Acer Predator gaming desktop computers'),
      ('Custom Built Gaming PCs', 'gaming-desktops-custom', gaming_desktops_id, 'Персонализирани геймърски компютри', 'Custom built gaming desktop computers'),
      ('Pre-built Gaming PCs', 'gaming-desktops-prebuilt', gaming_desktops_id, 'Сглобени геймърски компютри', 'Ready-to-use pre-built gaming computers'),
      ('Budget Gaming PCs', 'gaming-desktops-budget', gaming_desktops_id, 'Бюджетни геймърски компютри', 'Entry-level gaming desktop computers'),
      ('High-End Gaming PCs', 'gaming-desktops-high-end', gaming_desktops_id, 'Топ клас геймърски компютри', 'Premium high-performance gaming computers')
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- =====================================================
  -- MACBOOKS - Add model series L3 categories
  -- =====================================================
  IF macbooks_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, description) VALUES
      ('MacBook Air M3', 'macbooks-air-m3', macbooks_id, 'MacBook Air M3', 'Apple MacBook Air with M3 chip'),
      ('MacBook Air M2', 'macbooks-air-m2', macbooks_id, 'MacBook Air M2', 'Apple MacBook Air with M2 chip'),
      ('MacBook Pro 14"', 'macbooks-pro-14', macbooks_id, 'MacBook Pro 14"', 'Apple MacBook Pro 14-inch'),
      ('MacBook Pro 16"', 'macbooks-pro-16', macbooks_id, 'MacBook Pro 16"', 'Apple MacBook Pro 16-inch'),
      ('MacBook Pro M3', 'macbooks-pro-m3', macbooks_id, 'MacBook Pro M3', 'Apple MacBook Pro with M3/M3 Pro/M3 Max'),
      ('MacBook Pro M2', 'macbooks-pro-m2', macbooks_id, 'MacBook Pro M2', 'Apple MacBook Pro with M2 Pro/M2 Max'),
      ('MacBook Air 13"', 'macbooks-air-13', macbooks_id, 'MacBook Air 13"', 'Apple MacBook Air 13-inch'),
      ('MacBook Air 15"', 'macbooks-air-15', macbooks_id, 'MacBook Air 15"', 'Apple MacBook Air 15-inch')
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- =====================================================
  -- GAMING LAPTOPS - Add brand L3 categories
  -- =====================================================
  IF gaming_laptops_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, description) VALUES
      ('ASUS ROG Laptops', 'gaming-laptops-asus-rog', gaming_laptops_id, 'ASUS ROG лаптопи', 'ASUS Republic of Gamers gaming laptops'),
      ('Razer Blade Laptops', 'gaming-laptops-razer', gaming_laptops_id, 'Razer Blade лаптопи', 'Razer Blade gaming laptops'),
      ('MSI Gaming Laptops', 'gaming-laptops-msi', gaming_laptops_id, 'MSI геймърски лаптопи', 'MSI gaming laptops'),
      ('Alienware Laptops', 'gaming-laptops-alienware', gaming_laptops_id, 'Alienware лаптопи', 'Dell Alienware gaming laptops'),
      ('Lenovo Legion Laptops', 'gaming-laptops-lenovo', gaming_laptops_id, 'Lenovo Legion лаптопи', 'Lenovo Legion gaming laptops'),
      ('HP OMEN Laptops', 'gaming-laptops-hp-omen', gaming_laptops_id, 'HP OMEN лаптопи', 'HP OMEN gaming laptops'),
      ('Acer Predator Laptops', 'gaming-laptops-acer', gaming_laptops_id, 'Acer Predator лаптопи', 'Acer Predator gaming laptops'),
      ('Budget Gaming Laptops', 'gaming-laptops-budget', gaming_laptops_id, 'Бюджетни геймърски лаптопи', 'Entry-level gaming laptops'),
      ('RTX 40 Series Laptops', 'gaming-laptops-rtx40', gaming_laptops_id, 'Лаптопи с RTX 40 серия', 'Gaming laptops with RTX 4060/4070/4080/4090')
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- =====================================================
  -- SAMSUNG PHONES - Add series L3 categories (like iPhone)
  -- =====================================================
  IF samsung_phones_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, description) VALUES
      ('Galaxy S24 Series', 'samsung-galaxy-s24', samsung_phones_id, 'Galaxy S24 серия', 'Samsung Galaxy S24, S24+, S24 Ultra'),
      ('Galaxy S23 Series', 'samsung-galaxy-s23', samsung_phones_id, 'Galaxy S23 серия', 'Samsung Galaxy S23, S23+, S23 Ultra'),
      ('Galaxy S22 Series', 'samsung-galaxy-s22', samsung_phones_id, 'Galaxy S22 серия', 'Samsung Galaxy S22, S22+, S22 Ultra'),
      ('Galaxy Z Fold Series', 'samsung-galaxy-fold', samsung_phones_id, 'Galaxy Z Fold серия', 'Samsung Galaxy Z Fold foldable phones'),
      ('Galaxy Z Flip Series', 'samsung-galaxy-flip', samsung_phones_id, 'Galaxy Z Flip серия', 'Samsung Galaxy Z Flip foldable phones'),
      ('Galaxy A Series', 'samsung-galaxy-a', samsung_phones_id, 'Galaxy A серия', 'Samsung Galaxy A mid-range phones'),
      ('Galaxy M Series', 'samsung-galaxy-m', samsung_phones_id, 'Galaxy M серия', 'Samsung Galaxy M budget phones'),
      ('Galaxy FE Series', 'samsung-galaxy-fe', samsung_phones_id, 'Galaxy FE серия', 'Samsung Galaxy Fan Edition phones')
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- =====================================================
  -- PIXEL PHONES - Add series L3 categories
  -- =====================================================
  IF pixel_phones_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, description) VALUES
      ('Pixel 9 Series', 'pixel-9-series', pixel_phones_id, 'Pixel 9 серия', 'Google Pixel 9, 9 Pro, 9 Pro XL, 9 Pro Fold'),
      ('Pixel 8 Series', 'pixel-8-series', pixel_phones_id, 'Pixel 8 серия', 'Google Pixel 8, 8 Pro, 8a'),
      ('Pixel 7 Series', 'pixel-7-series', pixel_phones_id, 'Pixel 7 серия', 'Google Pixel 7, 7 Pro, 7a'),
      ('Pixel Fold', 'pixel-fold', pixel_phones_id, 'Pixel Fold', 'Google Pixel Fold foldable phone'),
      ('Pixel A Series', 'pixel-a-series', pixel_phones_id, 'Pixel A серия', 'Google Pixel budget A-series phones')
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- =====================================================
  -- SMART TVS - Add brand/type L3 categories
  -- =====================================================
  IF smart_tvs_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, description) VALUES
      ('Samsung QLED TVs', 'smart-tvs-samsung-qled', smart_tvs_id, 'Samsung QLED телевизори', 'Samsung QLED and Neo QLED TVs'),
      ('LG OLED TVs', 'smart-tvs-lg-oled', smart_tvs_id, 'LG OLED телевизори', 'LG OLED and OLED evo TVs'),
      ('Sony Bravia TVs', 'smart-tvs-sony-bravia', smart_tvs_id, 'Sony Bravia телевизори', 'Sony Bravia XR and Bravia TVs'),
      ('TCL TVs', 'smart-tvs-tcl', smart_tvs_id, 'TCL телевизори', 'TCL smart TVs'),
      ('Hisense TVs', 'smart-tvs-hisense', smart_tvs_id, 'Hisense телевизори', 'Hisense smart TVs'),
      ('4K UHD TVs', 'smart-tvs-4k', smart_tvs_id, '4K UHD телевизори', '4K Ultra HD resolution TVs'),
      ('8K TVs', 'smart-tvs-8k', smart_tvs_id, '8K телевизори', '8K resolution TVs'),
      ('OLED TVs', 'smart-tvs-oled', smart_tvs_id, 'OLED телевизори', 'All OLED technology TVs'),
      ('QLED TVs', 'smart-tvs-qled', smart_tvs_id, 'QLED телевизори', 'All QLED technology TVs'),
      ('Budget Smart TVs', 'smart-tvs-budget', smart_tvs_id, 'Бюджетни Smart телевизори', 'Affordable smart TVs')
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- =====================================================
  -- HEADPHONES - Add type L3 categories  
  -- =====================================================
  IF headphones_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, description) VALUES
      ('Over-Ear Headphones', 'headphones-over-ear', headphones_id, 'Големи слушалки', 'Full-size over-ear headphones'),
      ('On-Ear Headphones', 'headphones-on-ear', headphones_id, 'Слушалки на ухото', 'Compact on-ear headphones'),
      ('In-Ear Headphones', 'headphones-in-ear', headphones_id, 'Вътрешноушни слушалки', 'In-ear monitors and earphones'),
      ('Wireless Headphones', 'headphones-wireless', headphones_id, 'Безжични слушалки', 'Bluetooth and wireless headphones'),
      ('Noise Cancelling', 'headphones-anc', headphones_id, 'С шумопотискане', 'Active noise cancelling headphones'),
      ('Gaming Headsets', 'headphones-gaming', headphones_id, 'Геймърски слушалки', 'Gaming headsets with microphone'),
      ('Studio Headphones', 'headphones-studio', headphones_id, 'Студийни слушалки', 'Professional studio monitoring headphones'),
      ('Sports Headphones', 'headphones-sports', headphones_id, 'Спортни слушалки', 'Sweat-resistant sports headphones'),
      ('Sony Headphones', 'headphones-sony', headphones_id, 'Sony слушалки', 'Sony WH and WF series'),
      ('Apple AirPods', 'headphones-airpods', headphones_id, 'Apple AirPods', 'AirPods, AirPods Pro, AirPods Max'),
      ('Bose Headphones', 'headphones-bose', headphones_id, 'Bose слушалки', 'Bose QuietComfort and SoundLink'),
      ('Sennheiser Headphones', 'headphones-sennheiser', headphones_id, 'Sennheiser слушалки', 'Sennheiser HD and Momentum series')
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- =====================================================
  -- BUSINESS LAPTOPS - Add brand L3 categories
  -- =====================================================
  IF business_laptops_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, description) VALUES
      ('Lenovo ThinkPad', 'business-laptops-thinkpad', business_laptops_id, 'Lenovo ThinkPad', 'Lenovo ThinkPad business laptops'),
      ('Dell Latitude', 'business-laptops-latitude', business_laptops_id, 'Dell Latitude', 'Dell Latitude business laptops'),
      ('HP EliteBook', 'business-laptops-elitebook', business_laptops_id, 'HP EliteBook', 'HP EliteBook business laptops'),
      ('Dell XPS', 'business-laptops-xps', business_laptops_id, 'Dell XPS', 'Dell XPS premium laptops'),
      ('HP ProBook', 'business-laptops-probook', business_laptops_id, 'HP ProBook', 'HP ProBook business laptops'),
      ('Microsoft Surface', 'business-laptops-surface', business_laptops_id, 'Microsoft Surface', 'Microsoft Surface Pro and Laptop')
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;;
