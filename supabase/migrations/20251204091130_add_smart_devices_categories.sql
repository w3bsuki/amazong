-- Add more Smart Devices categories under smart-devices (19c94316-3774-49b7-bff8-80115941a039)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
-- Wearables - detailed
('Apple Watch', 'Apple Watch', 'apple-watch', '19c94316-3774-49b7-bff8-80115941a039', 1),
('Samsung Galaxy Watch', 'Samsung Galaxy Watch', 'galaxy-watch', '19c94316-3774-49b7-bff8-80115941a039', 2),
('Garmin Watches', 'Garmin часовници', 'garmin-watches', '19c94316-3774-49b7-bff8-80115941a039', 3),
('Fitbit', 'Fitbit', 'fitbit', '19c94316-3774-49b7-bff8-80115941a039', 4),
('Xiaomi/Amazfit Watches', 'Xiaomi/Amazfit часовници', 'amazfit-watches', '19c94316-3774-49b7-bff8-80115941a039', 5),
('Fitness Trackers', 'Фитнес тракери', 'fitness-trackers', '19c94316-3774-49b7-bff8-80115941a039', 6),
('Smart Rings', 'Смарт пръстени', 'smart-rings', '19c94316-3774-49b7-bff8-80115941a039', 7),
('Smart Glasses', 'Смарт очила', 'smart-glasses', '19c94316-3774-49b7-bff8-80115941a039', 8),
-- Smart Home
('Smart Speakers & Displays', 'Смарт колонки и дисплеи', 'smart-speakers-displays', '19c94316-3774-49b7-bff8-80115941a039', 10),
('Amazon Echo', 'Amazon Echo', 'amazon-echo', '19c94316-3774-49b7-bff8-80115941a039', 11),
('Google Nest', 'Google Nest', 'google-nest', '19c94316-3774-49b7-bff8-80115941a039', 12),
('Apple HomePod', 'Apple HomePod', 'apple-homepod', '19c94316-3774-49b7-bff8-80115941a039', 13),
('Smart Bulbs', 'Смарт крушки', 'smart-bulbs', '19c94316-3774-49b7-bff8-80115941a039', 15),
('Smart Light Strips', 'LED ленти', 'smart-light-strips', '19c94316-3774-49b7-bff8-80115941a039', 16),
('Smart Plugs', 'Смарт контакти', 'smart-plugs-new', '19c94316-3774-49b7-bff8-80115941a039', 17),
-- Security
('Video Doorbells', 'Видео звънци', 'video-doorbells-new', '19c94316-3774-49b7-bff8-80115941a039', 20),
('Indoor Security Cameras', 'Вътрешни камери', 'indoor-security-cameras', '19c94316-3774-49b7-bff8-80115941a039', 21),
('Outdoor Security Cameras', 'Външни камери', 'outdoor-security-cameras', '19c94316-3774-49b7-bff8-80115941a039', 22),
('Smart Locks', 'Смарт брави', 'smart-locks-new', '19c94316-3774-49b7-bff8-80115941a039', 23),
('Motion Sensors', 'Датчици за движение', 'motion-sensors-new', '19c94316-3774-49b7-bff8-80115941a039', 24),
-- Robot Vacuums by brand
('Roomba', 'Roomba', 'roomba', '19c94316-3774-49b7-bff8-80115941a039', 30),
('Roborock', 'Roborock', 'roborock', '19c94316-3774-49b7-bff8-80115941a039', 31),
('Ecovacs', 'Ecovacs', 'ecovacs', '19c94316-3774-49b7-bff8-80115941a039', 32),
('Dreame', 'Dreame', 'dreame', '19c94316-3774-49b7-bff8-80115941a039', 33),
-- Health Devices
('Blood Pressure Monitors', 'Апарати за кръвно', 'bp-monitors', '19c94316-3774-49b7-bff8-80115941a039', 40),
('Smart Scales', 'Смарт везни', 'smart-scales', '19c94316-3774-49b7-bff8-80115941a039', 41),
('Pulse Oximeters', 'Пулсоксиметри', 'pulse-oximeters', '19c94316-3774-49b7-bff8-80115941a039', 42),
('Smart Thermometers', 'Смарт термометри', 'smart-thermometers', '19c94316-3774-49b7-bff8-80115941a039', 43),
('Sleep Trackers', 'Тракери за сън', 'sleep-trackers', '19c94316-3774-49b7-bff8-80115941a039', 44)
ON CONFLICT (slug) DO NOTHING;;
