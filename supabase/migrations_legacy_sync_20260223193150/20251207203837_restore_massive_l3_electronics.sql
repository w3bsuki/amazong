
-- MASSIVE L3 RESTORATION - ELECTRONICS
-- Smartphones L3
INSERT INTO categories (id, name, slug, parent_id, icon, display_order) VALUES
-- Under iPhone
(gen_random_uuid(), 'iPhone 16 Series', 'iphone-16-series', (SELECT id FROM categories WHERE slug = 'iphone'), '📱', 1),
(gen_random_uuid(), 'iPhone 15 Series', 'iphone-15-series', (SELECT id FROM categories WHERE slug = 'iphone'), '📱', 2),
(gen_random_uuid(), 'iPhone 14 Series', 'iphone-14-series', (SELECT id FROM categories WHERE slug = 'iphone'), '📱', 3),
(gen_random_uuid(), 'iPhone 13 Series', 'iphone-13-series', (SELECT id FROM categories WHERE slug = 'iphone'), '📱', 4),
(gen_random_uuid(), 'iPhone 12 Series', 'iphone-12-series', (SELECT id FROM categories WHERE slug = 'iphone'), '📱', 5),
(gen_random_uuid(), 'iPhone SE', 'iphone-se', (SELECT id FROM categories WHERE slug = 'iphone'), '📱', 6),
(gen_random_uuid(), 'iPhone Legacy', 'iphone-legacy', (SELECT id FROM categories WHERE slug = 'iphone'), '📱', 7),
-- Samsung Galaxy L3
(gen_random_uuid(), 'Galaxy S Series', 'galaxy-s-series', (SELECT id FROM categories WHERE slug = 'samsung-galaxy'), '📱', 1),
(gen_random_uuid(), 'Galaxy Z Fold', 'galaxy-z-fold', (SELECT id FROM categories WHERE slug = 'samsung-galaxy'), '📱', 2),
(gen_random_uuid(), 'Galaxy Z Flip', 'galaxy-z-flip', (SELECT id FROM categories WHERE slug = 'samsung-galaxy'), '📱', 3),
(gen_random_uuid(), 'Galaxy A Series', 'galaxy-a-series', (SELECT id FROM categories WHERE slug = 'samsung-galaxy'), '📱', 4),
(gen_random_uuid(), 'Galaxy M Series', 'galaxy-m-series', (SELECT id FROM categories WHERE slug = 'samsung-galaxy'), '📱', 5),
-- Tablets L3
(gen_random_uuid(), 'iPad Pro', 'ipad-pro', (SELECT id FROM categories WHERE slug = 'ipad'), '📟', 1),
(gen_random_uuid(), 'iPad Air', 'ipad-air', (SELECT id FROM categories WHERE slug = 'ipad'), '📟', 2),
(gen_random_uuid(), 'iPad Mini', 'ipad-mini', (SELECT id FROM categories WHERE slug = 'ipad'), '📟', 3),
(gen_random_uuid(), 'iPad 10th Gen', 'ipad-10th-gen', (SELECT id FROM categories WHERE slug = 'ipad'), '📟', 4),
-- PC Components L3
(gen_random_uuid(), 'Graphics Cards (GPUs)', 'gpus', (SELECT id FROM categories WHERE slug = 'pc-components'), '🎮', 1),
(gen_random_uuid(), 'Processors (CPUs)', 'cpus', (SELECT id FROM categories WHERE slug = 'pc-components'), '💻', 2),
(gen_random_uuid(), 'Memory (RAM)', 'ram', (SELECT id FROM categories WHERE slug = 'pc-components'), '🔧', 3),
(gen_random_uuid(), 'Storage', 'storage', (SELECT id FROM categories WHERE slug = 'pc-components'), '💾', 4),
(gen_random_uuid(), 'Motherboards', 'motherboards', (SELECT id FROM categories WHERE slug = 'pc-components'), '🔌', 5),
(gen_random_uuid(), 'Power Supplies (PSUs)', 'psus', (SELECT id FROM categories WHERE slug = 'pc-components'), '⚡', 6),
(gen_random_uuid(), 'PC Cases', 'pc-cases', (SELECT id FROM categories WHERE slug = 'pc-components'), '🖥️', 7),
(gen_random_uuid(), 'CPU Coolers', 'cpu-coolers', (SELECT id FROM categories WHERE slug = 'pc-components'), '❄️', 8),
(gen_random_uuid(), 'Case Fans', 'case-fans', (SELECT id FROM categories WHERE slug = 'pc-components'), '🌀', 9),
-- Headphones L3
(gen_random_uuid(), 'Over-Ear Headphones', 'over-ear-headphones', (SELECT id FROM categories WHERE slug = 'headphones'), '🎧', 1),
(gen_random_uuid(), 'On-Ear Headphones', 'on-ear-headphones', (SELECT id FROM categories WHERE slug = 'headphones'), '🎧', 2),
(gen_random_uuid(), 'In-Ear Earbuds', 'in-ear-headphones', (SELECT id FROM categories WHERE slug = 'headphones'), '🎧', 3),
(gen_random_uuid(), 'True Wireless Earbuds', 'tws-earbuds', (SELECT id FROM categories WHERE slug = 'headphones'), '🎧', 4),
(gen_random_uuid(), 'Gaming Headsets', 'gaming-headsets-audio', (SELECT id FROM categories WHERE slug = 'headphones'), '🎧', 5),
(gen_random_uuid(), 'Sports Headphones', 'sports-headphones', (SELECT id FROM categories WHERE slug = 'headphones'), '🎧', 6),
-- Speakers L3
(gen_random_uuid(), 'Bluetooth Speakers', 'bluetooth-speakers', (SELECT id FROM categories WHERE slug = 'speakers'), '🔊', 1),
(gen_random_uuid(), 'Smart Speakers', 'smart-speakers-audio', (SELECT id FROM categories WHERE slug = 'speakers'), '🔊', 2),
(gen_random_uuid(), 'Computer Speakers', 'computer-speakers', (SELECT id FROM categories WHERE slug = 'speakers'), '🔊', 3),
(gen_random_uuid(), 'Soundbars', 'soundbars', (SELECT id FROM categories WHERE slug = 'speakers'), '🔊', 4),
(gen_random_uuid(), 'Home Theater Systems', 'home-theater', (SELECT id FROM categories WHERE slug = 'speakers'), '🔊', 5),
-- TV L3
(gen_random_uuid(), 'OLED TVs', 'oled-tvs', (SELECT id FROM categories WHERE slug = 'televisions-category'), '📺', 1),
(gen_random_uuid(), 'QLED TVs', 'qled-tvs', (SELECT id FROM categories WHERE slug = 'televisions-category'), '📺', 2),
(gen_random_uuid(), 'Mini-LED TVs', 'mini-led-tvs', (SELECT id FROM categories WHERE slug = 'televisions-category'), '📺', 3),
(gen_random_uuid(), 'LED/LCD TVs', 'led-lcd-tvs', (SELECT id FROM categories WHERE slug = 'televisions-category'), '📺', 4),
(gen_random_uuid(), '4K TVs', '4k-tvs', (SELECT id FROM categories WHERE slug = 'televisions-category'), '📺', 5),
(gen_random_uuid(), '8K TVs', '8k-tvs', (SELECT id FROM categories WHERE slug = 'televisions-category'), '📺', 6),
-- Smart Devices - Wearables L3
(gen_random_uuid(), 'Smartwatches', 'smartwatches', (SELECT id FROM categories WHERE slug = 'wearables'), '⌚', 1),
(gen_random_uuid(), 'Fitness Trackers', 'fitness-trackers', (SELECT id FROM categories WHERE slug = 'wearables'), '⌚', 2),
(gen_random_uuid(), 'Smart Rings', 'smart-rings', (SELECT id FROM categories WHERE slug = 'wearables'), '💍', 3),
(gen_random_uuid(), 'Smart Glasses', 'smart-glasses', (SELECT id FROM categories WHERE slug = 'wearables'), '👓', 4),
-- Phone Accessories L3
(gen_random_uuid(), 'Phone Cases', 'phone-cases', (SELECT id FROM categories WHERE slug = 'phone-accessories'), '📱', 1),
(gen_random_uuid(), 'Screen Protectors', 'screen-protectors', (SELECT id FROM categories WHERE slug = 'phone-accessories'), '📱', 2),
(gen_random_uuid(), 'Phone Chargers', 'phone-chargers', (SELECT id FROM categories WHERE slug = 'phone-accessories'), '🔌', 3),
(gen_random_uuid(), 'Wireless Chargers', 'wireless-chargers', (SELECT id FROM categories WHERE slug = 'phone-accessories'), '🔌', 4),
(gen_random_uuid(), 'Power Banks', 'power-banks', (SELECT id FROM categories WHERE slug = 'phone-accessories'), '🔋', 5),
(gen_random_uuid(), 'Phone Holders & Mounts', 'phone-holders', (SELECT id FROM categories WHERE slug = 'phone-accessories'), '📱', 6)
ON CONFLICT (slug) DO NOTHING;
;
