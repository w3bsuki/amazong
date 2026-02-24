
-- Phase 1: Add remaining L3 categories - Batch 4
-- Remaining Networking and TV categories

-- Gaming Routers L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['ASUS ROG Routers', 'NETGEAR Nighthawk', 'TP-Link Archer Gaming', 'WiFi 6 Gaming', 'WiFi 7 Gaming']),
  unnest(ARRAY['ASUS ROG рутери', 'NETGEAR Nighthawk', 'TP-Link Archer Gaming', 'WiFi 6 Gaming', 'WiFi 7 Gaming']),
  unnest(ARRAY['gaming-router-rog', 'gaming-router-nighthawk', 'gaming-router-archer', 'gaming-router-wifi6', 'gaming-router-wifi7']),
  (SELECT id FROM categories WHERE slug = 'networking-routers-gaming'),
  'Gamepad'
ON CONFLICT (slug) DO NOTHING;

-- Mesh Systems L3 subcategories (networking-mesh)
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Eero Mesh', 'Google Nest WiFi', 'NETGEAR Orbi', 'TP-Link Deco', 'ASUS ZenWiFi', 'Linksys Velop']),
  unnest(ARRAY['Eero Mesh', 'Google Nest WiFi', 'NETGEAR Orbi', 'TP-Link Deco', 'ASUS ZenWiFi', 'Linksys Velop']),
  unnest(ARRAY['mesh-eero', 'mesh-nest-wifi', 'mesh-orbi', 'mesh-deco', 'mesh-zenwifi', 'mesh-velop']),
  (SELECT id FROM categories WHERE slug = 'networking-mesh'),
  'Radio'
ON CONFLICT (slug) DO NOTHING;

-- Mesh Systems L3 (mesh-systems slug)
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['2-Pack Mesh', '3-Pack Mesh', '4+ Pack Mesh', 'WiFi 6 Mesh', 'WiFi 6E Mesh', 'WiFi 7 Mesh']),
  unnest(ARRAY['2 бр. Mesh', '3 бр. Mesh', '4+ бр. Mesh', 'WiFi 6 Mesh', 'WiFi 6E Mesh', 'WiFi 7 Mesh']),
  unnest(ARRAY['mesh-2pack', 'mesh-3pack', 'mesh-4pack-plus', 'mesh-wifi6', 'mesh-wifi6e', 'mesh-wifi7']),
  (SELECT id FROM categories WHERE slug = 'mesh-systems'),
  'Radio'
ON CONFLICT (slug) DO NOTHING;

-- Mesh WiFi L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Whole Home Mesh', 'Small Home Mesh', 'Large Home Mesh', 'Outdoor Mesh', 'Mesh with WiFi 6E']),
  unnest(ARRAY['Цял дом Mesh', 'Малък дом Mesh', 'Голям дом Mesh', 'Външен Mesh', 'Mesh с WiFi 6E']),
  unnest(ARRAY['mesh-whole-home', 'mesh-small-home', 'mesh-large-home', 'mesh-outdoor', 'mesh-with-wifi6e']),
  (SELECT id FROM categories WHERE slug = 'mesh-wifi'),
  'Radio'
ON CONFLICT (slug) DO NOTHING;

-- Modems L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Cable Modems', 'DSL Modems', 'Fiber Modems', 'DOCSIS 3.0', 'DOCSIS 3.1', 'Modem Router Combos']),
  unnest(ARRAY['Кабелни модеми', 'DSL модеми', 'Оптични модеми', 'DOCSIS 3.0', 'DOCSIS 3.1', 'Модем-рутер комбо']),
  unnest(ARRAY['modem-cable', 'modem-dsl', 'modem-fiber', 'modem-docsis30', 'modem-docsis31', 'modem-router-combo']),
  (SELECT id FROM categories WHERE slug = 'modems'),
  'Router'
ON CONFLICT (slug) DO NOTHING;

-- NAS L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['1-Bay NAS', '2-Bay NAS', '4-Bay NAS', '6-Bay+ NAS', 'Synology NAS', 'QNAP NAS', 'WD NAS']),
  unnest(ARRAY['1-Bay NAS', '2-Bay NAS', '4-Bay NAS', '6-Bay+ NAS', 'Synology NAS', 'QNAP NAS', 'WD NAS']),
  unnest(ARRAY['nas-1bay', 'nas-2bay', 'nas-4bay', 'nas-6bay-plus', 'nas-synology', 'nas-qnap', 'nas-wd']),
  (SELECT id FROM categories WHERE slug = 'networking-nas'),
  'HardDrive'
ON CONFLICT (slug) DO NOTHING;

-- Network Cables L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Short Cables (1-2m)', 'Medium Cables (3-5m)', 'Long Cables (10m+)', 'Bulk Cable Spools', 'Shielded Cables', 'Outdoor Cables']),
  unnest(ARRAY['Къси кабели (1-2m)', 'Средни кабели (3-5m)', 'Дълги кабели (10m+)', 'Кабели на руло', 'Екранирани кабели', 'Външни кабели']),
  unnest(ARRAY['cable-short', 'cable-medium', 'cable-long', 'cable-bulk', 'cable-shielded', 'cable-outdoor']),
  (SELECT id FROM categories WHERE slug = 'network-cables'),
  'Cable'
ON CONFLICT (slug) DO NOTHING;

-- Network Switches L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['5-Port Switches', '8-Port Switches', '16-Port Switches', '24-Port Switches', 'PoE Switches', 'Managed Switches', 'Unmanaged Switches']),
  unnest(ARRAY['5-портови суичове', '8-портови суичове', '16-портови суичове', '24-портови суичове', 'PoE суичове', 'Managed суичове', 'Unmanaged суичове']),
  unnest(ARRAY['switch-5port', 'switch-8port', 'switch-16port', 'switch-24port', 'switch-poe', 'switch-managed', 'switch-unmanaged']),
  (SELECT id FROM categories WHERE slug = 'networking-switches'),
  'Network'
ON CONFLICT (slug) DO NOTHING;

-- Powerline Adapters L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Basic Powerline', 'Gigabit Powerline', 'Powerline with WiFi', 'AV2 Powerline', 'Powerline Kits']),
  unnest(ARRAY['Основни Powerline', 'Gigabit Powerline', 'Powerline с WiFi', 'AV2 Powerline', 'Powerline комплекти']),
  unnest(ARRAY['powerline-basic', 'powerline-gigabit', 'powerline-wifi', 'powerline-av2', 'powerline-kits']),
  (SELECT id FROM categories WHERE slug = 'networking-powerline'),
  'Plug'
ON CONFLICT (slug) DO NOTHING;

-- Routers L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['WiFi 5 Routers', 'WiFi 6 Routers', 'WiFi 6E Routers', 'WiFi 7 Routers', 'Travel Routers', 'VPN Routers']),
  unnest(ARRAY['WiFi 5 рутери', 'WiFi 6 рутери', 'WiFi 6E рутери', 'WiFi 7 рутери', 'Пътнически рутери', 'VPN рутери']),
  unnest(ARRAY['router-wifi5', 'router-wifi6', 'router-wifi6e', 'router-wifi7', 'router-travel', 'router-vpn']),
  (SELECT id FROM categories WHERE slug = 'networking-routers'),
  'Router'
ON CONFLICT (slug) DO NOTHING;

-- WiFi 6 Routers L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Budget WiFi 6', 'Mid-Range WiFi 6', 'High-End WiFi 6', 'WiFi 6 AX3000', 'WiFi 6 AX6000']),
  unnest(ARRAY['Бюджетни WiFi 6', 'Средни WiFi 6', 'Висококлас WiFi 6', 'WiFi 6 AX3000', 'WiFi 6 AX6000']),
  unnest(ARRAY['wifi6-budget', 'wifi6-midrange', 'wifi6-highend', 'wifi6-ax3000', 'wifi6-ax6000']),
  (SELECT id FROM categories WHERE slug = 'networking-routers-wifi6'),
  'Wifi'
ON CONFLICT (slug) DO NOTHING;

-- WiFi Adapters L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['USB WiFi Adapters', 'PCIe WiFi Cards', 'WiFi 6 Adapters', 'WiFi 6E Adapters', 'Bluetooth + WiFi Combo']),
  unnest(ARRAY['USB WiFi адаптери', 'PCIe WiFi карти', 'WiFi 6 адаптери', 'WiFi 6E адаптери', 'Bluetooth + WiFi комбо']),
  unnest(ARRAY['adapter-usb-wifi', 'adapter-pcie-wifi', 'adapter-wifi6', 'adapter-wifi6e', 'adapter-bt-wifi']),
  (SELECT id FROM categories WHERE slug = 'networking-adapters-wifi'),
  'Wifi'
ON CONFLICT (slug) DO NOTHING;

-- WiFi Extenders L3 (networking-extenders)
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Plug-in Extenders', 'Desktop Extenders', 'Outdoor Extenders', 'WiFi 6 Extenders', 'Dual Band Extenders']),
  unnest(ARRAY['Plug-in усилватели', 'Desktop усилватели', 'Външни усилватели', 'WiFi 6 усилватели', 'Dual Band усилватели']),
  unnest(ARRAY['extender-plugin', 'extender-desktop', 'extender-outdoor', 'extender-wifi6', 'extender-dualband']),
  (SELECT id FROM categories WHERE slug = 'networking-extenders'),
  'WifiHigh'
ON CONFLICT (slug) DO NOTHING;

-- WiFi Extenders L3 (wifi-extenders)
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['TP-Link Extenders', 'NETGEAR Extenders', 'Linksys Extenders', 'ASUS Extenders']),
  unnest(ARRAY['TP-Link усилватели', 'NETGEAR усилватели', 'Linksys усилватели', 'ASUS усилватели']),
  unnest(ARRAY['extender-tplink', 'extender-netgear', 'extender-linksys', 'extender-asus']),
  (SELECT id FROM categories WHERE slug = 'wifi-extenders'),
  'WifiHigh'
ON CONFLICT (slug) DO NOTHING;

-- WiFi Range Extenders L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Single Band Extenders', 'Dual Band Extenders', 'Tri Band Extenders', 'Mesh Extenders']),
  unnest(ARRAY['Single Band усилватели', 'Dual Band усилватели', 'Tri Band усилватели', 'Mesh усилватели']),
  unnest(ARRAY['range-ext-single', 'range-ext-dual', 'range-ext-tri', 'range-ext-mesh']),
  (SELECT id FROM categories WHERE slug = 'wifi-range-extenders'),
  'WifiHigh'
ON CONFLICT (slug) DO NOTHING;

-- Budget TVs L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['32" Budget TVs', '40-43" Budget TVs', '50-55" Budget TVs', '65" Budget TVs', 'Budget Smart TVs', 'Budget 4K TVs']),
  unnest(ARRAY['32" бюджетни', '40-43" бюджетни', '50-55" бюджетни', '65" бюджетни', 'Бюджетни Smart TV', 'Бюджетни 4K TV']),
  unnest(ARRAY['budget-tv-32', 'budget-tv-40-43', 'budget-tv-50-55', 'budget-tv-65', 'budget-tv-smart', 'budget-tv-4k']),
  (SELECT id FROM categories WHERE slug = 'budget-tvs'),
  'Tv'
ON CONFLICT (slug) DO NOTHING;

-- Mini-LED TVs L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Samsung Mini-LED', 'LG QNED', 'TCL Mini-LED', 'Hisense Mini-LED', '55" Mini-LED', '65" Mini-LED', '75"+ Mini-LED']),
  unnest(ARRAY['Samsung Mini-LED', 'LG QNED', 'TCL Mini-LED', 'Hisense Mini-LED', '55" Mini-LED', '65" Mini-LED', '75"+ Mini-LED']),
  unnest(ARRAY['miniled-samsung', 'miniled-lg-qned', 'miniled-tcl', 'miniled-hisense', 'miniled-55', 'miniled-65', 'miniled-75plus']),
  (SELECT id FROM categories WHERE slug = 'mini-led-tvs'),
  'Tv'
ON CONFLICT (slug) DO NOTHING;

-- TV by Brand L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Samsung TVs', 'LG TVs', 'Sony TVs', 'TCL TVs', 'Hisense TVs', 'Philips TVs', 'Panasonic TVs', 'Toshiba TVs']),
  unnest(ARRAY['Samsung телевизори', 'LG телевизори', 'Sony телевизори', 'TCL телевизори', 'Hisense телевизори', 'Philips телевизори', 'Panasonic телевизори', 'Toshiba телевизори']),
  unnest(ARRAY['tv-brand-samsung', 'tv-brand-lg', 'tv-brand-sony', 'tv-brand-tcl', 'tv-brand-hisense', 'tv-brand-philips', 'tv-brand-panasonic', 'tv-brand-toshiba']),
  (SELECT id FROM categories WHERE slug = 'tv-by-brand'),
  'Tv'
ON CONFLICT (slug) DO NOTHING;

-- TV by Size L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Under 32"', '32" TVs', '40-43" TVs', '50-55" TVs', '65" TVs', '75" TVs', '77"+ TVs', '85"+ TVs', '98"+ TVs']),
  unnest(ARRAY['Под 32"', '32"', '40-43"', '50-55"', '65"', '75"', '77"+', '85"+', '98"+']),
  unnest(ARRAY['tv-size-under32', 'tv-size-32', 'tv-size-40-43', 'tv-size-50-55', 'tv-size-65', 'tv-size-75', 'tv-size-77plus', 'tv-size-85plus', 'tv-size-98plus']),
  (SELECT id FROM categories WHERE slug = 'tv-by-size'),
  'Tv'
ON CONFLICT (slug) DO NOTHING;

-- TV by Technology L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['LED TVs', 'QLED TVs', 'OLED TVs', 'Neo QLED TVs', 'QD-OLED TVs', 'Mini-LED TVs', 'Micro LED TVs']),
  unnest(ARRAY['LED телевизори', 'QLED телевизори', 'OLED телевизори', 'Neo QLED телевизори', 'QD-OLED телевизори', 'Mini-LED телевизори', 'Micro LED телевизори']),
  unnest(ARRAY['tv-tech-led', 'tv-tech-qled', 'tv-tech-oled', 'tv-tech-neo-qled', 'tv-tech-qd-oled', 'tv-tech-miniled', 'tv-tech-microled']),
  (SELECT id FROM categories WHERE slug = 'tv-by-technology'),
  'Tv'
ON CONFLICT (slug) DO NOTHING;
;
