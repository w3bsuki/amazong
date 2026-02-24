
-- =====================================================
-- GAMING CATEGORY EXPANSION - Phase 2: PC Gaming L2/L3
-- =====================================================
-- PC Gaming L1 ID: b474deee-40bd-47e5-9ebd-33246257fa9c

-- First delete existing L2s under PC Gaming that we'll restructure
DELETE FROM categories WHERE parent_id = 'b474deee-40bd-47e5-9ebd-33246257fa9c';

-- ===== PC Gaming L2: Gaming Keyboards =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Keyboards', 'Гейминг клавиатури', 'pc-gaming-keyboards', 'b474deee-40bd-47e5-9ebd-33246257fa9c', '⌨️', 1, 'Mechanical and membrane gaming keyboards', 'Механични и мембранни гейминг клавиатури');

-- Get the keyboard category ID and add L3s
WITH keyboard_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-keyboards')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Mechanical Keyboards', 'Механични клавиатури', 'kb-mechanical', (SELECT id FROM keyboard_id), 1),
  ('Membrane Keyboards', 'Мембранни клавиатури', 'kb-membrane', (SELECT id FROM keyboard_id), 2),
  ('60% Keyboards', '60% Клавиатури', 'kb-60-percent', (SELECT id FROM keyboard_id), 3),
  ('TKL Keyboards', 'TKL Клавиатури', 'kb-tkl', (SELECT id FROM keyboard_id), 4),
  ('Full-Size Keyboards', 'Пълноразмерни клавиатури', 'kb-full-size', (SELECT id FROM keyboard_id), 5),
  ('Wireless Gaming Keyboards', 'Безжични гейминг клавиатури', 'kb-wireless', (SELECT id FROM keyboard_id), 6),
  ('RGB Keyboards', 'RGB Клавиатури', 'kb-rgb', (SELECT id FROM keyboard_id), 7),
  ('Keycaps', 'Клавишни капачки', 'kb-keycaps', (SELECT id FROM keyboard_id), 8);

-- ===== PC Gaming L2: Gaming Mice =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Mice', 'Гейминг мишки', 'pc-gaming-mice', 'b474deee-40bd-47e5-9ebd-33246257fa9c', '🖱️', 2, 'High-performance gaming mice', 'Високопроизводителни гейминг мишки');

WITH mouse_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-mice')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Wired Gaming Mice', 'Кабелни гейминг мишки', 'mouse-wired', (SELECT id FROM mouse_id), 1),
  ('Wireless Gaming Mice', 'Безжични гейминг мишки', 'mouse-wireless', (SELECT id FROM mouse_id), 2),
  ('Ambidextrous Mice', 'Симетрични мишки', 'mouse-ambidextrous', (SELECT id FROM mouse_id), 3),
  ('Ergonomic Gaming Mice', 'Ергономични гейминг мишки', 'mouse-ergonomic', (SELECT id FROM mouse_id), 4),
  ('MMO Gaming Mice', 'MMO Гейминг мишки', 'mouse-mmo', (SELECT id FROM mouse_id), 5),
  ('FPS Gaming Mice', 'FPS Гейминг мишки', 'mouse-fps', (SELECT id FROM mouse_id), 6),
  ('Lightweight Gaming Mice', 'Леки гейминг мишки', 'mouse-lightweight', (SELECT id FROM mouse_id), 7);

-- ===== PC Gaming L2: Gaming Headsets =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Headsets', 'Гейминг слушалки', 'pc-gaming-headsets', 'b474deee-40bd-47e5-9ebd-33246257fa9c', '🎧', 3, 'Gaming headsets with microphones', 'Гейминг слушалки с микрофони');

WITH headset_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-headsets')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Wired Gaming Headsets', 'Кабелни гейминг слушалки', 'headset-wired', (SELECT id FROM headset_id), 1),
  ('Wireless Gaming Headsets', 'Безжични гейминг слушалки', 'headset-wireless', (SELECT id FROM headset_id), 2),
  ('7.1 Surround Headsets', '7.1 Съраунд слушалки', 'headset-surround', (SELECT id FROM headset_id), 3),
  ('Open-Back Gaming Headsets', 'Отворени гейминг слушалки', 'headset-open-back', (SELECT id FROM headset_id), 4),
  ('Noise Cancelling Headsets', 'Слушалки с шумопотискане', 'headset-anc', (SELECT id FROM headset_id), 5);

-- ===== PC Gaming L2: Gaming Mousepads =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Mousepads', 'Гейминг подложки', 'pc-gaming-mousepads', 'b474deee-40bd-47e5-9ebd-33246257fa9c', '🎯', 4, 'Gaming mousepads and desk mats', 'Гейминг подложки за мишка и бюро');

WITH mousepad_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-mousepads')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Cloth Mousepads', 'Текстилни подложки', 'mousepad-cloth', (SELECT id FROM mousepad_id), 1),
  ('Hard Surface Mousepads', 'Твърди подложки', 'mousepad-hard', (SELECT id FROM mousepad_id), 2),
  ('Extended Desk Mats', 'Разширени подложки', 'mousepad-extended', (SELECT id FROM mousepad_id), 3),
  ('RGB Mousepads', 'RGB Подложки', 'mousepad-rgb', (SELECT id FROM mousepad_id), 4),
  ('Wrist Rest Mousepads', 'Подложки с опора за китка', 'mousepad-wrist-rest', (SELECT id FROM mousepad_id), 5);

-- ===== PC Gaming L2: PC Controllers =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('PC Controllers', 'PC Контролери', 'pc-gaming-controllers', 'b474deee-40bd-47e5-9ebd-33246257fa9c', '🎮', 5, 'Game controllers for PC', 'Гейм контролери за PC');

WITH controller_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-controllers')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Xbox Style Controllers', 'Xbox стил контролери', 'controller-xbox-style', (SELECT id FROM controller_id), 1),
  ('PlayStation Style Controllers', 'PlayStation стил контролери', 'controller-ps-style', (SELECT id FROM controller_id), 2),
  ('Arcade Sticks', 'Аркадни стикове', 'controller-arcade-stick', (SELECT id FROM controller_id), 3),
  ('Racing Wheels', 'Волани за игри', 'controller-racing-wheel', (SELECT id FROM controller_id), 4),
  ('Flight Sticks', 'Джойстици за летене', 'controller-flight-stick', (SELECT id FROM controller_id), 5),
  ('Custom Controllers', 'Персонализирани контролери', 'controller-custom', (SELECT id FROM controller_id), 6);

-- ===== PC Gaming L2: Gaming Monitors =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Monitors', 'Гейминг монитори', 'pc-gaming-monitors-cat', 'b474deee-40bd-47e5-9ebd-33246257fa9c', '🖥️', 6, 'High refresh rate gaming monitors', 'Гейминг монитори с висока честота');

WITH monitor_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-monitors-cat')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('144Hz Gaming Monitors', '144Hz Гейминг монитори', 'monitor-144hz', (SELECT id FROM monitor_id), 1),
  ('240Hz Gaming Monitors', '240Hz Гейминг монитори', 'monitor-240hz', (SELECT id FROM monitor_id), 2),
  ('360Hz+ Gaming Monitors', '360Hz+ Гейминг монитори', 'monitor-360hz', (SELECT id FROM monitor_id), 3),
  ('4K Gaming Monitors', '4K Гейминг монитори', 'monitor-4k-gaming', (SELECT id FROM monitor_id), 4),
  ('Ultrawide Gaming Monitors', 'Ултраширокоекранни монитори', 'monitor-ultrawide-gaming', (SELECT id FROM monitor_id), 5),
  ('Curved Gaming Monitors', 'Извити гейминг монитори', 'monitor-curved-gaming', (SELECT id FROM monitor_id), 6),
  ('OLED Gaming Monitors', 'OLED Гейминг монитори', 'monitor-oled-gaming', (SELECT id FROM monitor_id), 7),
  ('Portable Gaming Monitors', 'Преносими гейминг монитори', 'monitor-portable-gaming', (SELECT id FROM monitor_id), 8);

-- ===== PC Gaming L2: Gaming PCs =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming PCs', 'Гейминг компютри', 'pc-gaming-computers', 'b474deee-40bd-47e5-9ebd-33246257fa9c', '💻', 7, 'Pre-built gaming desktop computers', 'Готови гейминг настолни компютри');

WITH pc_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-computers')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Entry-Level Gaming PCs', 'Входно ниво гейминг PC', 'gaming-pc-entry', (SELECT id FROM pc_id), 1),
  ('Mid-Range Gaming PCs', 'Среден клас гейминг PC', 'gaming-pc-mid', (SELECT id FROM pc_id), 2),
  ('High-End Gaming PCs', 'Висок клас гейминг PC', 'gaming-pc-high', (SELECT id FROM pc_id), 3),
  ('Extreme Gaming PCs', 'Екстремни гейминг PC', 'gaming-pc-extreme', (SELECT id FROM pc_id), 4),
  ('Mini Gaming PCs', 'Мини гейминг PC', 'gaming-pc-mini', (SELECT id FROM pc_id), 5),
  ('Gaming Laptops', 'Гейминг лаптопи', 'gaming-laptops-cat', (SELECT id FROM pc_id), 6);

-- ===== PC Gaming L2: PC Games =====
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('PC Games', 'PC Игри', 'pc-games-cat', 'b474deee-40bd-47e5-9ebd-33246257fa9c', '🎮', 8, 'PC video games', 'Видео игри за PC');

WITH games_id AS (SELECT id FROM categories WHERE slug = 'pc-games-cat')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Physical PC Games', 'Физически PC игри', 'pc-games-physical', (SELECT id FROM games_id), 1),
  ('Digital Game Codes', 'Дигитални игрови кодове', 'pc-games-digital', (SELECT id FROM games_id), 2),
  ('Steam Gift Cards', 'Steam подаръчни карти', 'pc-games-steam', (SELECT id FROM games_id), 3),
  ('Game Subscriptions', 'Игрови абонаменти', 'pc-games-subscriptions', (SELECT id FROM games_id), 4);
;
