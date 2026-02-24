
-- =====================================================
-- GAMING CATEGORY EXPANSION - Phase 3: Console Gaming L2/L3
-- =====================================================
-- Console Gaming L1 ID: 5e3bf113-4861-4221-a071-1933d40a6b0a

-- First delete existing L2s under Console Gaming to restructure
DELETE FROM categories WHERE parent_id = '5e3bf113-4861-4221-a071-1933d40a6b0a';

-- ===== Console Gaming L2: PlayStation =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('PlayStation', 'PlayStation', 'console-playstation-cat', '5e3bf113-4861-4221-a071-1933d40a6b0a', '🎮', 1, 'PlayStation consoles, games and accessories', 'PlayStation конзоли, игри и аксесоари');

WITH ps_id AS (SELECT id FROM categories WHERE slug = 'console-playstation-cat')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('PS5 Consoles', 'PS5 Конзоли', 'ps5-consoles', (SELECT id FROM ps_id), 1),
  ('PS5 Games', 'PS5 Игри', 'ps5-games', (SELECT id FROM ps_id), 2),
  ('PS5 Controllers', 'PS5 Контролери', 'ps5-controllers', (SELECT id FROM ps_id), 3),
  ('PS5 Accessories', 'PS5 Аксесоари', 'ps5-accessories', (SELECT id FROM ps_id), 4),
  ('PS4 Consoles', 'PS4 Конзоли', 'ps4-consoles', (SELECT id FROM ps_id), 5),
  ('PS4 Games', 'PS4 Игри', 'ps4-games', (SELECT id FROM ps_id), 6),
  ('PS4 Controllers', 'PS4 Контролери', 'ps4-controllers', (SELECT id FROM ps_id), 7),
  ('PS4 Accessories', 'PS4 Аксесоари', 'ps4-accessories', (SELECT id FROM ps_id), 8),
  ('PlayStation VR2', 'PlayStation VR2', 'psvr2', (SELECT id FROM ps_id), 9),
  ('PSN Gift Cards', 'PSN Подаръчни карти', 'psn-gift-cards', (SELECT id FROM ps_id), 10);

-- ===== Console Gaming L2: Xbox =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Xbox', 'Xbox', 'console-xbox-cat', '5e3bf113-4861-4221-a071-1933d40a6b0a', '🎮', 2, 'Xbox consoles, games and accessories', 'Xbox конзоли, игри и аксесоари');

WITH xbox_id AS (SELECT id FROM categories WHERE slug = 'console-xbox-cat')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Xbox Series X Consoles', 'Xbox Series X Конзоли', 'xbox-series-x', (SELECT id FROM xbox_id), 1),
  ('Xbox Series S Consoles', 'Xbox Series S Конзоли', 'xbox-series-s', (SELECT id FROM xbox_id), 2),
  ('Xbox Games', 'Xbox Игри', 'xbox-games', (SELECT id FROM xbox_id), 3),
  ('Xbox Controllers', 'Xbox Контролери', 'xbox-controllers', (SELECT id FROM xbox_id), 4),
  ('Xbox Accessories', 'Xbox Аксесоари', 'xbox-accessories', (SELECT id FROM xbox_id), 5),
  ('Xbox Elite Controllers', 'Xbox Elite Контролери', 'xbox-elite-controllers', (SELECT id FROM xbox_id), 6),
  ('Xbox One Consoles', 'Xbox One Конзоли', 'xbox-one-consoles', (SELECT id FROM xbox_id), 7),
  ('Xbox One Games', 'Xbox One Игри', 'xbox-one-games', (SELECT id FROM xbox_id), 8),
  ('Xbox Gift Cards', 'Xbox Подаръчни карти', 'xbox-gift-cards', (SELECT id FROM xbox_id), 9),
  ('Xbox Game Pass', 'Xbox Game Pass', 'xbox-game-pass', (SELECT id FROM xbox_id), 10);

-- ===== Console Gaming L2: Nintendo =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Nintendo', 'Nintendo', 'console-nintendo-cat', '5e3bf113-4861-4221-a071-1933d40a6b0a', '🎮', 3, 'Nintendo consoles, games and accessories', 'Nintendo конзоли, игри и аксесоари');

WITH nintendo_id AS (SELECT id FROM categories WHERE slug = 'console-nintendo-cat')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Nintendo Switch OLED', 'Nintendo Switch OLED', 'switch-oled', (SELECT id FROM nintendo_id), 1),
  ('Nintendo Switch', 'Nintendo Switch', 'switch-standard', (SELECT id FROM nintendo_id), 2),
  ('Nintendo Switch Lite', 'Nintendo Switch Lite', 'switch-lite', (SELECT id FROM nintendo_id), 3),
  ('Switch Games', 'Switch Игри', 'switch-games', (SELECT id FROM nintendo_id), 4),
  ('Switch Controllers', 'Switch Контролери', 'switch-controllers', (SELECT id FROM nintendo_id), 5),
  ('Joy-Con Controllers', 'Joy-Con Контролери', 'joycon-controllers', (SELECT id FROM nintendo_id), 6),
  ('Switch Accessories', 'Switch Аксесоари', 'switch-accessories', (SELECT id FROM nintendo_id), 7),
  ('Switch Carrying Cases', 'Switch Калъфи', 'switch-cases', (SELECT id FROM nintendo_id), 8),
  ('Nintendo eShop Cards', 'Nintendo eShop Карти', 'nintendo-eshop', (SELECT id FROM nintendo_id), 9),
  ('Amiibo', 'Amiibo', 'amiibo-figures', (SELECT id FROM nintendo_id), 10);

-- ===== Console Gaming L2: Console Accessories (General) =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Console Accessories', 'Конзолни аксесоари', 'console-accessories-cat', '5e3bf113-4861-4221-a071-1933d40a6b0a', '🎧', 4, 'Universal gaming console accessories', 'Универсални гейминг конзолни аксесоари');

WITH acc_id AS (SELECT id FROM categories WHERE slug = 'console-accessories-cat')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Console Headsets', 'Конзолни слушалки', 'console-headsets', (SELECT id FROM acc_id), 1),
  ('Charging Stations', 'Зарядни станции', 'console-charging-stations', (SELECT id FROM acc_id), 2),
  ('Controller Grips', 'Грипове за контролери', 'controller-grips', (SELECT id FROM acc_id), 3),
  ('Controller Skins', 'Скинове за контролери', 'controller-skins', (SELECT id FROM acc_id), 4),
  ('Console Stands', 'Стойки за конзоли', 'console-stands', (SELECT id FROM acc_id), 5),
  ('Console Cooling', 'Охлаждане за конзоли', 'console-cooling', (SELECT id FROM acc_id), 6),
  ('External Storage', 'Външно съхранение', 'console-external-storage', (SELECT id FROM acc_id), 7),
  ('Console Bags & Cases', 'Чанти и калъфи за конзоли', 'console-bags', (SELECT id FROM acc_id), 8);

-- ===== Console Gaming L2: Handheld Gaming =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Handheld Gaming', 'Преносим гейминг', 'handheld-gaming', '5e3bf113-4861-4221-a071-1933d40a6b0a', '📱', 5, 'Portable gaming devices', 'Преносими гейминг устройства');

WITH handheld_id AS (SELECT id FROM categories WHERE slug = 'handheld-gaming')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Steam Deck', 'Steam Deck', 'steam-deck', (SELECT id FROM handheld_id), 1),
  ('Steam Deck Accessories', 'Steam Deck Аксесоари', 'steam-deck-accessories', (SELECT id FROM handheld_id), 2),
  ('Asus ROG Ally', 'Asus ROG Ally', 'rog-ally', (SELECT id FROM handheld_id), 3),
  ('Lenovo Legion Go', 'Lenovo Legion Go', 'legion-go', (SELECT id FROM handheld_id), 4),
  ('Handheld Accessories', 'Аксесоари за преносими устройства', 'handheld-accessories', (SELECT id FROM handheld_id), 5),
  ('Retro Handhelds', 'Ретро преносими устройства', 'retro-handhelds', (SELECT id FROM handheld_id), 6);
;
