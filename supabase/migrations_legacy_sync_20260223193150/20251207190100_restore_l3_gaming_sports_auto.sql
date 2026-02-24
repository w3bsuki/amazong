
-- Restore L3 categories for Gaming

-- Console Gaming L3 (parent: 5e3bf113-4861-4221-a071-1933d40a6b0a)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('PlayStation 5', 'console-ps5', '5e3bf113-4861-4221-a071-1933d40a6b0a', 'PlayStation 5', 1),
  ('PlayStation 4', 'console-ps4', '5e3bf113-4861-4221-a071-1933d40a6b0a', 'PlayStation 4', 2),
  ('Xbox Series X|S', 'console-xbox-series', '5e3bf113-4861-4221-a071-1933d40a6b0a', 'Xbox Series X|S', 3),
  ('Xbox One', 'console-xbox-one', '5e3bf113-4861-4221-a071-1933d40a6b0a', 'Xbox One', 4),
  ('Nintendo Switch', 'console-switch', '5e3bf113-4861-4221-a071-1933d40a6b0a', 'Nintendo Switch', 5),
  ('Nintendo 3DS', 'console-3ds', '5e3bf113-4861-4221-a071-1933d40a6b0a', 'Nintendo 3DS', 6)
ON CONFLICT (slug) DO NOTHING;

-- PC Gaming L3 (parent: b474deee-40bd-47e5-9ebd-33246257fa9c)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Gaming Desktops', 'pc-gaming-desktops', 'b474deee-40bd-47e5-9ebd-33246257fa9c', 'Гейминг настолни компютри', 1),
  ('Gaming Laptops', 'pc-gaming-laptops', 'b474deee-40bd-47e5-9ebd-33246257fa9c', 'Гейминг лаптопи', 2),
  ('Gaming Monitors', 'pc-gaming-monitors', 'b474deee-40bd-47e5-9ebd-33246257fa9c', 'Гейминг монитори', 3),
  ('Gaming Keyboards', 'pc-gaming-keyboards', 'b474deee-40bd-47e5-9ebd-33246257fa9c', 'Гейминг клавиатури', 4),
  ('Gaming Mice', 'pc-gaming-mice', 'b474deee-40bd-47e5-9ebd-33246257fa9c', 'Гейминг мишки', 5),
  ('Gaming Headsets', 'pc-gaming-headsets', 'b474deee-40bd-47e5-9ebd-33246257fa9c', 'Гейминг слушалки', 6),
  ('Graphics Cards', 'pc-gaming-gpu', 'b474deee-40bd-47e5-9ebd-33246257fa9c', 'Видеокарти', 7),
  ('PC Components', 'pc-gaming-components', 'b474deee-40bd-47e5-9ebd-33246257fa9c', 'Компоненти', 8)
ON CONFLICT (slug) DO NOTHING;

-- Gaming Furniture L3 (parent: 0719a6ef-a5b7-4334-b3fa-fc5223b82ffb)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Gaming Chairs', 'gaming-chairs', '0719a6ef-a5b7-4334-b3fa-fc5223b82ffb', 'Гейминг столове', 1),
  ('Gaming Desks', 'gaming-desks', '0719a6ef-a5b7-4334-b3fa-fc5223b82ffb', 'Гейминг бюра', 2),
  ('Monitor Stands', 'gaming-monitor-stands', '0719a6ef-a5b7-4334-b3fa-fc5223b82ffb', 'Стойки за монитор', 3),
  ('Racing Cockpits', 'gaming-cockpits', '0719a6ef-a5b7-4334-b3fa-fc5223b82ffb', 'Рейсинг кокпити', 4)
ON CONFLICT (slug) DO NOTHING;

-- VR & AR Gaming L3 (parent: 72917089-5657-4f92-aff2-6881c99eaf5e)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('VR Headsets', 'vr-headsets', '72917089-5657-4f92-aff2-6881c99eaf5e', 'VR очила', 1),
  ('VR Accessories', 'vr-accessories', '72917089-5657-4f92-aff2-6881c99eaf5e', 'VR аксесоари', 2),
  ('VR Games', 'vr-games', '72917089-5657-4f92-aff2-6881c99eaf5e', 'VR игри', 3),
  ('AR Devices', 'ar-devices', '72917089-5657-4f92-aff2-6881c99eaf5e', 'AR устройства', 4)
ON CONFLICT (slug) DO NOTHING;

-- Streaming Equipment L3 (parent: 33a68d5c-bc22-4509-b4fb-d34dcc0fc66f)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Webcams', 'streaming-webcams', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', 'Уебкамери', 1),
  ('Microphones', 'streaming-microphones', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', 'Микрофони', 2),
  ('Capture Cards', 'streaming-capture', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', 'Кепчър карти', 3),
  ('Lighting', 'streaming-lighting', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', 'Осветление', 4),
  ('Green Screens', 'streaming-green-screens', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', 'Зелени екрани', 5),
  ('Stream Decks', 'streaming-decks', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', 'Стрийм декове', 6)
ON CONFLICT (slug) DO NOTHING;

-- Sports L3 categories

-- Team Sports L3 (parent: b9cf08ae-b177-45ee-bd4c-9af673b479e4)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Football', 'team-football', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Футбол', 1),
  ('Basketball', 'team-basketball', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Баскетбол', 2),
  ('Volleyball', 'team-volleyball', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Волейбол', 3),
  ('Baseball & Softball', 'team-baseball', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Бейзбол', 4),
  ('Hockey', 'team-hockey', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Хокей', 5),
  ('Rugby', 'team-rugby', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Ръгби', 6),
  ('Handball', 'team-handball', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Хандбал', 7)
ON CONFLICT (slug) DO NOTHING;

-- Exercise & Fitness L3 (parent: c450eb98-8ffe-4c18-a5dd-6c814bce2890)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Cardio Equipment', 'fitness-cardio', 'c450eb98-8ffe-4c18-a5dd-6c814bce2890', 'Кардио оборудване', 1),
  ('Strength Training', 'fitness-strength', 'c450eb98-8ffe-4c18-a5dd-6c814bce2890', 'Силови тренировки', 2),
  ('Yoga & Pilates', 'fitness-yoga', 'c450eb98-8ffe-4c18-a5dd-6c814bce2890', 'Йога и Пилатес', 3),
  ('Fitness Accessories', 'fitness-accessories', 'c450eb98-8ffe-4c18-a5dd-6c814bce2890', 'Фитнес аксесоари', 4),
  ('Weights & Dumbbells', 'fitness-weights', 'c450eb98-8ffe-4c18-a5dd-6c814bce2890', 'Тежести', 5),
  ('Exercise Bikes', 'fitness-bikes', 'c450eb98-8ffe-4c18-a5dd-6c814bce2890', 'Велоергометри', 6),
  ('Treadmills', 'fitness-treadmills', 'c450eb98-8ffe-4c18-a5dd-6c814bce2890', 'Бягащи пътеки', 7),
  ('Ellipticals', 'fitness-ellipticals', 'c450eb98-8ffe-4c18-a5dd-6c814bce2890', 'Крос тренажори', 8)
ON CONFLICT (slug) DO NOTHING;

-- Water Sports L3 (parent: 51b26a07-cc20-4285-9e84-bd693e9c1bc7)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Swimming', 'water-swimming', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Плуване', 1),
  ('Surfing', 'water-surfing', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Сърфиране', 2),
  ('Kayaking', 'water-kayaking', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Каякинг', 3),
  ('Diving', 'water-diving', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Гмуркане', 4),
  ('Paddleboarding', 'water-paddleboard', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'SUP', 5),
  ('Wakeboarding', 'water-wakeboard', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Уейкборд', 6),
  ('Jet Skiing', 'water-jetski', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Джетски', 7)
ON CONFLICT (slug) DO NOTHING;

-- Winter Sports L3 (parent: d452edd6-17db-448d-94c9-6a025376b077)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Skiing', 'winter-skiing', 'd452edd6-17db-448d-94c9-6a025376b077', 'Ски', 1),
  ('Snowboarding', 'winter-snowboard', 'd452edd6-17db-448d-94c9-6a025376b077', 'Сноуборд', 2),
  ('Ice Skating', 'winter-skating', 'd452edd6-17db-448d-94c9-6a025376b077', 'Кънки', 3),
  ('Sledding', 'winter-sledding', 'd452edd6-17db-448d-94c9-6a025376b077', 'Шейни', 4),
  ('Cross-Country Skiing', 'winter-cross-country', 'd452edd6-17db-448d-94c9-6a025376b077', 'Ски бягане', 5)
ON CONFLICT (slug) DO NOTHING;

-- Cycling L3 (parent: c712e6dd-61d5-4f0a-b7e9-a2e7de655072)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Road Bikes', 'cycling-road', 'c712e6dd-61d5-4f0a-b7e9-a2e7de655072', 'Шосейни велосипеди', 1),
  ('Mountain Bikes', 'cycling-mountain', 'c712e6dd-61d5-4f0a-b7e9-a2e7de655072', 'Планински велосипеди', 2),
  ('BMX', 'cycling-bmx', 'c712e6dd-61d5-4f0a-b7e9-a2e7de655072', 'BMX', 3),
  ('Cycling Accessories', 'cycling-accessories', 'c712e6dd-61d5-4f0a-b7e9-a2e7de655072', 'Аксесоари', 4),
  ('Cycling Apparel', 'cycling-apparel', 'c712e6dd-61d5-4f0a-b7e9-a2e7de655072', 'Облекло', 5),
  ('Bike Parts', 'cycling-parts', 'c712e6dd-61d5-4f0a-b7e9-a2e7de655072', 'Части', 6),
  ('Cycling Helmets', 'cycling-helmets', 'c712e6dd-61d5-4f0a-b7e9-a2e7de655072', 'Каски', 7)
ON CONFLICT (slug) DO NOTHING;

-- Hiking & Camping L3 (parent: b0e82c28-1823-41a8-a8c5-c17d99df496b)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Tents', 'camping-tents', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Палатки', 1),
  ('Sleeping Bags', 'camping-sleeping-bags', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Спални чували', 2),
  ('Backpacks', 'camping-backpacks', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Раници', 3),
  ('Camping Furniture', 'camping-furniture', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Къмпинг мебели', 4),
  ('Camping Cooking', 'camping-cooking', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Къмпинг готвене', 5),
  ('Hiking Boots', 'camping-boots', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Туристически обувки', 6),
  ('Navigation & GPS', 'camping-navigation', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Навигация', 7),
  ('Outdoor Clothing', 'camping-clothing', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Облекло', 8)
ON CONFLICT (slug) DO NOTHING;

-- Automotive L3 categories

-- Car Accessories L3 (parent: 68d23aaa-61c7-4394-8b3d-edc43cce0c74)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Car Electronics', 'auto-electronics', '68d23aaa-61c7-4394-8b3d-edc43cce0c74', 'Автоелектроника', 1),
  ('Car Interior', 'auto-interior', '68d23aaa-61c7-4394-8b3d-edc43cce0c74', 'Интериор', 2),
  ('Car Exterior', 'auto-exterior', '68d23aaa-61c7-4394-8b3d-edc43cce0c74', 'Екстериор', 3),
  ('Car Care', 'auto-care', '68d23aaa-61c7-4394-8b3d-edc43cce0c74', 'Грижа за кола', 4),
  ('Car Audio', 'auto-audio', '68d23aaa-61c7-4394-8b3d-edc43cce0c74', 'Аудио', 5),
  ('Car Safety', 'auto-safety', '68d23aaa-61c7-4394-8b3d-edc43cce0c74', 'Безопасност', 6),
  ('Floor Mats', 'auto-mats', '68d23aaa-61c7-4394-8b3d-edc43cce0c74', 'Стелки', 7),
  ('Seat Covers', 'auto-seat-covers', '68d23aaa-61c7-4394-8b3d-edc43cce0c74', 'Калъфи за седалки', 8)
ON CONFLICT (slug) DO NOTHING;

-- Auto Parts L3 (parent: 31cabda3-6f21-443a-bf2d-69326b12f06b)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Engine Parts', 'parts-engine', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Двигателни части', 1),
  ('Brake Parts', 'parts-brakes', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Спирачки', 2),
  ('Suspension', 'parts-suspension', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Окачване', 3),
  ('Filters', 'parts-filters', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Филтри', 4),
  ('Batteries', 'parts-batteries', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Акумулатори', 5),
  ('Tires', 'parts-tires', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Гуми', 6),
  ('Wheels & Rims', 'parts-wheels', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Джанти', 7),
  ('Lights & Bulbs', 'parts-lights', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Светлини', 8),
  ('Exhaust', 'parts-exhaust', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Ауспуси', 9),
  ('Body Parts', 'parts-body', '31cabda3-6f21-443a-bf2d-69326b12f06b', 'Каросерия', 10)
ON CONFLICT (slug) DO NOTHING;

-- Vehicles L3 (parent: 7acf2e95-428a-40fd-a841-d4933b666f02)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Cars', 'vehicles-cars', '7acf2e95-428a-40fd-a841-d4933b666f02', 'Автомобили', 1),
  ('Motorcycles', 'vehicles-motorcycles', '7acf2e95-428a-40fd-a841-d4933b666f02', 'Мотоциклети', 2),
  ('Trucks', 'vehicles-trucks', '7acf2e95-428a-40fd-a841-d4933b666f02', 'Камиони', 3),
  ('SUVs & Crossovers', 'vehicles-suv', '7acf2e95-428a-40fd-a841-d4933b666f02', 'Джипове', 4),
  ('Vans', 'vehicles-vans', '7acf2e95-428a-40fd-a841-d4933b666f02', 'Ванове', 5),
  ('Classic Cars', 'vehicles-classic', '7acf2e95-428a-40fd-a841-d4933b666f02', 'Класически коли', 6),
  ('ATVs & UTVs', 'vehicles-atv', '7acf2e95-428a-40fd-a841-d4933b666f02', 'ATV', 7)
ON CONFLICT (slug) DO NOTHING;

-- E-Scooters L3 (parent: 303e2f71-2fe9-469a-9888-60d075cd211f)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Adult E-Scooters', 'escooter-adult', '303e2f71-2fe9-469a-9888-60d075cd211f', 'Тротинетки за възрастни', 1),
  ('Kids E-Scooters', 'escooter-kids', '303e2f71-2fe9-469a-9888-60d075cd211f', 'Детски тротинетки', 2),
  ('E-Scooter Parts', 'escooter-parts', '303e2f71-2fe9-469a-9888-60d075cd211f', 'Части', 3),
  ('E-Scooter Accessories', 'escooter-accessories', '303e2f71-2fe9-469a-9888-60d075cd211f', 'Аксесоари', 4)
ON CONFLICT (slug) DO NOTHING;

-- E-Bikes L3 (parent: f21bf634-adf4-4c8e-bb7d-67e6e5980c19)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('City E-Bikes', 'ebike-city', 'f21bf634-adf4-4c8e-bb7d-67e6e5980c19', 'Градски електрически велосипеди', 1),
  ('Mountain E-Bikes', 'ebike-mountain', 'f21bf634-adf4-4c8e-bb7d-67e6e5980c19', 'Планински електрически велосипеди', 2),
  ('Folding E-Bikes', 'ebike-folding', 'f21bf634-adf4-4c8e-bb7d-67e6e5980c19', 'Сгъваеми', 3),
  ('E-Bike Batteries', 'ebike-batteries', 'f21bf634-adf4-4c8e-bb7d-67e6e5980c19', 'Батерии', 4),
  ('E-Bike Accessories', 'ebike-accessories', 'f21bf634-adf4-4c8e-bb7d-67e6e5980c19', 'Аксесоари', 5)
ON CONFLICT (slug) DO NOTHING;
;
