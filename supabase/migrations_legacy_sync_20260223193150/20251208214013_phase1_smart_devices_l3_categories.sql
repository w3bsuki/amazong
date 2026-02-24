
-- Phase 1.7: Add L3 Smart Devices Categories

-- Add Smartwatch Models under Smartwatches L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Apple Watch Ultra 2', 'Apple Watch Series 10', 'Apple Watch SE', 'Galaxy Watch 7', 'Galaxy Watch Ultra', 'Galaxy Watch FE', 'Garmin Fenix', 'Garmin Venu', 'Garmin Forerunner', 'Samsung Galaxy Watch', 'Amazfit Watches', 'Huawei Watch', 'Fossil Smartwatches', 'TicWatch', 'OnePlus Watch', 'Luxury Smartwatches', 'Kids Smartwatches']),
  unnest(ARRAY['apple-watch-ultra-2', 'apple-watch-series-10', 'apple-watch-se', 'galaxy-watch-7', 'galaxy-watch-ultra', 'galaxy-watch-fe', 'garmin-fenix', 'garmin-venu', 'garmin-forerunner', 'samsung-galaxy-watch', 'amazfit-watches', 'huawei-watch', 'fossil-smartwatches', 'ticwatch', 'oneplus-watch', 'luxury-smartwatches', 'kids-smartwatches']),
  (SELECT id FROM categories WHERE slug = 'smartwatches'),
  unnest(ARRAY['Apple Watch Ultra 2', 'Apple Watch Series 10', 'Apple Watch SE', 'Galaxy Watch 7', 'Galaxy Watch Ultra', 'Galaxy Watch FE', 'Garmin Fenix', 'Garmin Venu', 'Garmin Forerunner', 'Samsung Galaxy Watch', 'Amazfit Часовници', 'Huawei Watch', 'Fossil Смарт Часовници', 'TicWatch', 'OnePlus Watch', 'Луксозни Смарт Часовници', 'Детски Смарт Часовници']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Add Robot Vacuum Brands under Robot Vacuums L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['iRobot Roomba i Series', 'iRobot Roomba j Series', 'iRobot Roomba s Series', 'Roborock S Series', 'Roborock Q Series', 'Ecovacs Deebot', 'Dreame Bot', 'Shark Robot Vacuums', 'Eufy RoboVac', 'Xiaomi Robot Vacuums', 'Narwal Robot', 'Self-Empty Robot Vacuums', 'Mop Robot Vacuums', 'Budget Robot Vacuums']),
  unnest(ARRAY['roomba-i-series', 'roomba-j-series', 'roomba-s-series', 'roborock-s-series', 'roborock-q-series', 'ecovacs-deebot', 'dreame-bot', 'shark-robot-vacuums', 'eufy-robovac', 'xiaomi-robot-vacuums', 'narwal-robot', 'self-empty-robot-vacuums', 'mop-robot-vacuums', 'budget-robot-vacuums']),
  (SELECT id FROM categories WHERE slug = 'robot-vacuums'),
  unnest(ARRAY['iRobot Roomba i Серия', 'iRobot Roomba j Серия', 'iRobot Roomba s Серия', 'Roborock S Серия', 'Roborock Q Серия', 'Ecovacs Deebot', 'Dreame Bot', 'Shark Роботи', 'Eufy RoboVac', 'Xiaomi Роботи', 'Narwal Robot', 'Самоизпразващи се Роботи', 'Моп Роботи', 'Бюджетни Роботи']),
  '🤖'
ON CONFLICT (slug) DO NOTHING;

-- Add Smart Speaker Platforms under Smart Speakers L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Amazon Echo Dot', 'Amazon Echo', 'Amazon Echo Show', 'Amazon Echo Studio', 'Google Nest Mini', 'Google Nest Audio', 'Google Nest Hub', 'Google Nest Hub Max', 'Apple HomePod', 'Apple HomePod Mini', 'Sonos One', 'Sonos Era', 'Harman Kardon', 'Bose Smart Speakers']),
  unnest(ARRAY['amazon-echo-dot', 'amazon-echo-main', 'amazon-echo-show', 'amazon-echo-studio', 'google-nest-mini', 'google-nest-audio', 'google-nest-hub', 'google-nest-hub-max', 'apple-homepod', 'apple-homepod-mini', 'sonos-one', 'sonos-era', 'harman-kardon-smart', 'bose-smart-speakers']),
  (SELECT id FROM categories WHERE slug = 'smart-speakers'),
  unnest(ARRAY['Amazon Echo Dot', 'Amazon Echo', 'Amazon Echo Show', 'Amazon Echo Studio', 'Google Nest Mini', 'Google Nest Audio', 'Google Nest Hub', 'Google Nest Hub Max', 'Apple HomePod', 'Apple HomePod Mini', 'Sonos One', 'Sonos Era', 'Harman Kardon', 'Bose Смарт Колонки']),
  '🔊'
ON CONFLICT (slug) DO NOTHING;

-- Add Smart Lighting Types under Smart Lighting L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Philips Hue Bulbs', 'Philips Hue Strips', 'Philips Hue Lamps', 'LIFX Smart Bulbs', 'Nanoleaf Panels', 'Nanoleaf Essentials', 'Govee Lights', 'Govee Light Strips', 'Wyze Bulbs', 'Smart Light Switches', 'Smart Dimmers', 'Motion Sensor Lights', 'Outdoor Smart Lights']),
  unnest(ARRAY['philips-hue-bulbs', 'philips-hue-strips', 'philips-hue-lamps', 'lifx-smart-bulbs', 'nanoleaf-panels', 'nanoleaf-essentials', 'govee-lights', 'govee-light-strips', 'wyze-bulbs', 'smart-light-switches', 'smart-dimmers', 'motion-sensor-lights', 'outdoor-smart-lights']),
  (SELECT id FROM categories WHERE slug = 'smart-lighting'),
  unnest(ARRAY['Philips Hue Крушки', 'Philips Hue Ленти', 'Philips Hue Лампи', 'LIFX Смарт Крушки', 'Nanoleaf Панели', 'Nanoleaf Essentials', 'Govee Светлини', 'Govee Ленти', 'Wyze Крушки', 'Смарт Ключове', 'Смарт Димери', 'Сензорни Светлини', 'Външни Смарт Светлини']),
  '💡'
ON CONFLICT (slug) DO NOTHING;

-- Add Smart Security Types under Smart Security L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Ring Doorbells', 'Ring Cameras', 'Ring Alarm', 'Nest Doorbell', 'Nest Cameras', 'Arlo Pro Cameras', 'Arlo Essential', 'Eufy Cameras', 'Eufy Doorbells', 'Blink Cameras', 'SimpliSafe Systems', 'ADT Systems', 'Indoor Security Cameras', 'Outdoor Security Cameras', 'Floodlight Cameras', 'Baby Monitors']),
  unnest(ARRAY['ring-doorbells', 'ring-cameras', 'ring-alarm', 'nest-doorbell', 'nest-cameras', 'arlo-pro-cameras', 'arlo-essential', 'eufy-cameras', 'eufy-doorbells', 'blink-cameras', 'simplisafe-systems', 'adt-systems', 'indoor-security-cameras', 'outdoor-security-cameras', 'floodlight-cameras', 'baby-monitors']),
  (SELECT id FROM categories WHERE slug = 'smart-security'),
  unnest(ARRAY['Ring Звънци', 'Ring Камери', 'Ring Аларми', 'Nest Звънци', 'Nest Камери', 'Arlo Pro Камери', 'Arlo Essential', 'Eufy Камери', 'Eufy Звънци', 'Blink Камери', 'SimpliSafe Системи', 'ADT Системи', 'Вътрешни Охранителни Камери', 'Външни Охранителни Камери', 'Прожекторни Камери', 'Бебефони']),
  '🔒'
ON CONFLICT (slug) DO NOTHING;

-- Add Smart Lock Types under Smart Locks L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['August Smart Lock', 'Yale Smart Lock', 'Schlage Encode', 'Level Lock', 'Kwikset Halo', 'Lockly Vision', 'Eufy Smart Lock', 'Wyze Lock', 'Fingerprint Locks', 'Keypad Locks', 'Bluetooth Locks', 'WiFi Smart Locks', 'HomeKit Smart Locks']),
  unnest(ARRAY['august-smart-lock', 'yale-smart-lock', 'schlage-encode', 'level-lock', 'kwikset-halo', 'lockly-vision', 'eufy-smart-lock', 'wyze-lock', 'fingerprint-locks', 'keypad-locks', 'bluetooth-locks', 'wifi-smart-locks', 'homekit-smart-locks']),
  (SELECT id FROM categories WHERE slug = 'smart-locks'),
  unnest(ARRAY['August Смарт Ключалка', 'Yale Смарт Ключалка', 'Schlage Encode', 'Level Lock', 'Kwikset Halo', 'Lockly Vision', 'Eufy Смарт Ключалка', 'Wyze Lock', 'Пръстови Ключалки', 'Клавиатурни Ключалки', 'Bluetooth Ключалки', 'WiFi Смарт Ключалки', 'HomeKit Смарт Ключалки']),
  '🔐'
ON CONFLICT (slug) DO NOTHING;

-- Add Smart Thermostat Brands under Smart Thermostats L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nest Learning Thermostat', 'Nest Thermostat E', 'Ecobee Smart Thermostat', 'Ecobee with Sensors', 'Honeywell T-Series', 'Emerson Sensi', 'Amazon Smart Thermostat', 'Wyze Thermostat', 'Tado Smart Thermostat', 'Smart AC Controllers']),
  unnest(ARRAY['nest-learning-thermostat', 'nest-thermostat-e', 'ecobee-smart-thermostat', 'ecobee-with-sensors', 'honeywell-t-series', 'emerson-sensi', 'amazon-smart-thermostat', 'wyze-thermostat', 'tado-smart-thermostat', 'smart-ac-controllers']),
  (SELECT id FROM categories WHERE slug = 'smart-thermostats'),
  unnest(ARRAY['Nest Learning Thermostat', 'Nest Thermostat E', 'Ecobee Смарт Термостат', 'Ecobee със Сензори', 'Honeywell T-Серия', 'Emerson Sensi', 'Amazon Смарт Термостат', 'Wyze Термостат', 'Tado Смарт Термостат', 'Смарт Контролери за Климатик']),
  '🌡️'
ON CONFLICT (slug) DO NOTHING;

-- Add Fitness Tracker Types under Fitness Trackers L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fitbit Charge Series', 'Fitbit Inspire Series', 'Fitbit Luxe', 'Xiaomi Mi Band', 'Garmin Vivosmart', 'Garmin Vivomove', 'Amazfit Band', 'Samsung Galaxy Fit', 'Whoop Band', 'Oura Ring', 'Sleep Trackers', 'Sports Fitness Bands', 'Kids Fitness Trackers']),
  unnest(ARRAY['fitbit-charge-series', 'fitbit-inspire-series', 'fitbit-luxe', 'xiaomi-mi-band', 'garmin-vivosmart', 'garmin-vivomove', 'amazfit-band', 'samsung-galaxy-fit', 'whoop-band', 'oura-ring', 'sleep-trackers', 'sports-fitness-bands', 'kids-fitness-trackers']),
  (SELECT id FROM categories WHERE slug = 'fitness-trackers'),
  unnest(ARRAY['Fitbit Charge Серия', 'Fitbit Inspire Серия', 'Fitbit Luxe', 'Xiaomi Mi Band', 'Garmin Vivosmart', 'Garmin Vivomove', 'Amazfit Band', 'Samsung Galaxy Fit', 'Whoop Band', 'Oura Ring', 'Тракери за Сън', 'Спортни Фитнес Банди', 'Детски Фитнес Тракери']),
  '💪'
ON CONFLICT (slug) DO NOTHING;

-- Add Smart Home Device Types under Smart Home Devices L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Smart Plugs', 'Smart Power Strips', 'Smart Hubs', 'Smart Blinds', 'Smart Curtains', 'Smart Sensors', 'Water Leak Sensors', 'Door/Window Sensors', 'Smart Smoke Detectors', 'Air Quality Monitors', 'Smart Garage Controllers', 'Smart Pet Feeders', 'Smart Plant Monitors']),
  unnest(ARRAY['smart-plugs', 'smart-power-strips', 'smart-hubs', 'smart-blinds', 'smart-curtains', 'smart-sensors', 'water-leak-sensors', 'door-window-sensors', 'smart-smoke-detectors', 'air-quality-monitors', 'smart-garage-controllers', 'smart-pet-feeders', 'smart-plant-monitors']),
  (SELECT id FROM categories WHERE slug = 'smart-home-devices'),
  unnest(ARRAY['Смарт Контакти', 'Смарт Разклонители', 'Смарт Хъбове', 'Смарт Щори', 'Смарт Завеси', 'Смарт Сензори', 'Сензори за Теч', 'Сензори за Врати/Прозорци', 'Смарт Пожарни Детектори', 'Монитори за Качество на Въздуха', 'Смарт Гаражни Контролери', 'Смарт Хранилки за Домашни Любимци', 'Смарт Монитори за Растения']),
  '🏠'
ON CONFLICT (slug) DO NOTHING;
;
