-- Phase 3: Pet Tech L2 Categories
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('GPS Trackers & Location', 'GPS тракери и локация', 'pet-gps-trackers', 'c9520d75-2afe-43ef-b37a-f2495606bd2a', NULL, 1, 'Pet GPS trackers and location devices', 'GPS тракери и устройства за локация'),
('Pet Cameras', 'Камери за домашни любимци', 'pet-cameras', 'c9520d75-2afe-43ef-b37a-f2495606bd2a', NULL, 2, 'Pet cameras and monitors', 'Камери и монитори за домашни любимци'),
('Smart Feeders & Waterers', 'Умни хранилки и поилки', 'smart-feeders', 'c9520d75-2afe-43ef-b37a-f2495606bd2a', NULL, 3, 'Smart automatic feeders and waterers', 'Умни автоматични хранилки и поилки'),
('Smart Pet Doors', 'Умни врати за домашни любимци', 'smart-pet-doors', 'c9520d75-2afe-43ef-b37a-f2495606bd2a', NULL, 4, 'Smart pet doors', 'Умни врати за домашни любимци'),
('Health Monitors & Wearables', 'Здравни монитори и носими устройства', 'pet-health-monitors', 'c9520d75-2afe-43ef-b37a-f2495606bd2a', NULL, 5, 'Pet health monitors and wearables', 'Здравни монитори и носими устройства'),
('Pet Apps & Software', 'Приложения и софтуер', 'pet-apps', 'c9520d75-2afe-43ef-b37a-f2495606bd2a', NULL, 6, 'Pet apps and software', 'Приложения и софтуер за домашни любимци')
ON CONFLICT (slug) DO NOTHING;

-- Pet Tech L3 - GPS Trackers
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Dog GPS Trackers', 'GPS тракери за кучета', 'dog-gps-trackers', id, NULL, 1, 'GPS trackers for dogs', 'GPS тракери за кучета'
FROM categories WHERE slug = 'pet-gps-trackers' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Cat GPS Trackers', 'GPS тракери за котки', 'cat-gps-trackers', id, NULL, 2, 'GPS trackers for cats', 'GPS тракери за котки'
FROM categories WHERE slug = 'pet-gps-trackers' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'GPS Collars', 'GPS нашийници', 'gps-collars', id, NULL, 3, 'GPS enabled collars', 'Нашийници с GPS'
FROM categories WHERE slug = 'pet-gps-trackers' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Bluetooth Trackers', 'Bluetooth тракери', 'bluetooth-trackers', id, NULL, 4, 'Bluetooth pet trackers', 'Bluetooth тракери за домашни любимци'
FROM categories WHERE slug = 'pet-gps-trackers' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'GPS Subscription Services', 'GPS абонаментни услуги', 'gps-subscriptions', id, NULL, 5, 'GPS tracking subscription services', 'GPS абонаментни услуги за проследяване'
FROM categories WHERE slug = 'pet-gps-trackers' ON CONFLICT (slug) DO NOTHING;

-- Pet Tech L3 - Pet Cameras
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Indoor Pet Cameras', 'Вътрешни камери', 'indoor-pet-cameras', id, NULL, 1, 'Indoor pet cameras', 'Вътрешни камери за домашни любимци'
FROM categories WHERE slug = 'pet-cameras' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Outdoor Pet Cameras', 'Външни камери', 'outdoor-pet-cameras', id, NULL, 2, 'Outdoor pet cameras', 'Външни камери за домашни любимци'
FROM categories WHERE slug = 'pet-cameras' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Treat-Dispensing Cameras', 'Камери с лакомства', 'treat-dispensing-cameras', id, NULL, 3, 'Cameras with treat dispensers', 'Камери с раздаватели на лакомства'
FROM categories WHERE slug = 'pet-cameras' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Two-Way Audio Cameras', 'Камери с двупосочно аудио', 'two-way-audio-cameras', id, NULL, 4, 'Cameras with two-way audio', 'Камери с двупосочно аудио'
FROM categories WHERE slug = 'pet-cameras' ON CONFLICT (slug) DO NOTHING;

-- Pet Tech L3 - Smart Feeders
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Automatic Pet Feeders', 'Автоматични хранилки', 'automatic-feeders', id, NULL, 1, 'Automatic pet feeders', 'Автоматични хранилки'
FROM categories WHERE slug = 'smart-feeders' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Smart Water Fountains', 'Умни фонтани за вода', 'smart-water-fountains', id, NULL, 2, 'Smart pet water fountains', 'Умни фонтани за вода'
FROM categories WHERE slug = 'smart-feeders' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'WiFi-Enabled Feeders', 'WiFi хранилки', 'wifi-feeders', id, NULL, 3, 'WiFi enabled feeders', 'Хранилки с WiFi'
FROM categories WHERE slug = 'smart-feeders' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Portion Control Feeders', 'Хранилки с контрол на порции', 'portion-control-feeders', id, NULL, 4, 'Portion control feeders', 'Хранилки с контрол на порции'
FROM categories WHERE slug = 'smart-feeders' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Microchip Feeders', 'Хранилки с микрочип', 'microchip-feeders', id, NULL, 5, 'Microchip-activated feeders', 'Хранилки, активирани с микрочип'
FROM categories WHERE slug = 'smart-feeders' ON CONFLICT (slug) DO NOTHING;

-- Pet Tech L3 - Smart Pet Doors
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Microchip Pet Doors', 'Врати с микрочип', 'microchip-pet-doors', id, NULL, 1, 'Microchip-activated pet doors', 'Врати с микрочип за домашни любимци'
FROM categories WHERE slug = 'smart-pet-doors' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'App-Controlled Doors', 'Врати с приложение', 'app-controlled-doors', id, NULL, 2, 'App-controlled pet doors', 'Врати с приложение'
FROM categories WHERE slug = 'smart-pet-doors' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Collar Key Doors', 'Врати с ключ на нашийник', 'collar-key-doors', id, NULL, 3, 'Collar key pet doors', 'Врати с ключ на нашийник'
FROM categories WHERE slug = 'smart-pet-doors' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Curfew Pet Doors', 'Врати с полицейски час', 'curfew-pet-doors', id, NULL, 4, 'Curfew-enabled pet doors', 'Врати с полицейски час'
FROM categories WHERE slug = 'smart-pet-doors' ON CONFLICT (slug) DO NOTHING;

-- Pet Tech L3 - Health Monitors
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Activity Trackers', 'Тракери за активност', 'pet-activity-trackers', id, NULL, 1, 'Pet activity trackers', 'Тракери за активност'
FROM categories WHERE slug = 'pet-health-monitors' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Smart Pet Scales', 'Умни везни за домашни любимци', 'smart-pet-scales', id, NULL, 2, 'Smart pet scales', 'Умни везни за домашни любимци'
FROM categories WHERE slug = 'pet-health-monitors' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Heart Rate Monitors', 'Монитори за сърдечен ритъм', 'pet-heart-monitors', id, NULL, 3, 'Pet heart rate monitors', 'Монитори за сърдечен ритъм'
FROM categories WHERE slug = 'pet-health-monitors' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Sleep Trackers', 'Тракери за сън', 'pet-sleep-trackers', id, NULL, 4, 'Pet sleep trackers', 'Тракери за сън'
FROM categories WHERE slug = 'pet-health-monitors' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Temperature Monitors', 'Температурни монитори', 'pet-temp-monitors', id, NULL, 5, 'Pet temperature monitors', 'Температурни монитори за домашни любимци'
FROM categories WHERE slug = 'pet-health-monitors' ON CONFLICT (slug) DO NOTHING;;
