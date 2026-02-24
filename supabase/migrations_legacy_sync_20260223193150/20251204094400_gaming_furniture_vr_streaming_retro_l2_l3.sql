
-- =====================================================
-- GAMING CATEGORY EXPANSION - Phase 4: Gaming Furniture, VR/AR, Streaming, Retro Gaming
-- =====================================================

-- ===== Gaming Furniture L2/L3 =====
-- Gaming Furniture L1 ID: 0719a6ef-a5b7-4334-b3fa-fc5223b82ffb

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Chairs', 'Гейминг столове', 'gaming-chairs-cat', '0719a6ef-a5b7-4334-b3fa-fc5223b82ffb', '🪑', 1, 'Ergonomic gaming chairs', 'Ергономични гейминг столове');

WITH chair_id AS (SELECT id FROM categories WHERE slug = 'gaming-chairs-cat')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Racing Style Chairs', 'Състезателни столове', 'chairs-racing', (SELECT id FROM chair_id), 1),
  ('Ergonomic Gaming Chairs', 'Ергономични гейминг столове', 'chairs-ergonomic', (SELECT id FROM chair_id), 2),
  ('Gaming Rocker Chairs', 'Гейминг люлеещи столове', 'chairs-rocker', (SELECT id FROM chair_id), 3),
  ('Gaming Bean Bags', 'Гейминг пуфове', 'chairs-bean-bags', (SELECT id FROM chair_id), 4),
  ('Premium Gaming Chairs', 'Премиум гейминг столове', 'chairs-premium', (SELECT id FROM chair_id), 5),
  ('Kids Gaming Chairs', 'Детски гейминг столове', 'chairs-kids', (SELECT id FROM chair_id), 6),
  ('Chair Accessories', 'Аксесоари за столове', 'chair-accessories', (SELECT id FROM chair_id), 7);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Desks', 'Гейминг бюра', 'gaming-desks-cat', '0719a6ef-a5b7-4334-b3fa-fc5223b82ffb', '🖥️', 2, 'Gaming desks and workstations', 'Гейминг бюра и работни станции');

WITH desk_id AS (SELECT id FROM categories WHERE slug = 'gaming-desks-cat')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Standard Gaming Desks', 'Стандартни гейминг бюра', 'desks-standard', (SELECT id FROM desk_id), 1),
  ('L-Shaped Gaming Desks', 'L-образни гейминг бюра', 'desks-l-shaped', (SELECT id FROM desk_id), 2),
  ('Standing Gaming Desks', 'Стоящи гейминг бюра', 'desks-standing', (SELECT id FROM desk_id), 3),
  ('Compact Gaming Desks', 'Компактни гейминг бюра', 'desks-compact', (SELECT id FROM desk_id), 4),
  ('RGB Gaming Desks', 'RGB Гейминг бюра', 'desks-rgb', (SELECT id FROM desk_id), 5),
  ('Desk Accessories', 'Аксесоари за бюра', 'desk-accessories', (SELECT id FROM desk_id), 6);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Room Setup', 'Обзавеждане за гейминг стая', 'gaming-room-setup', '0719a6ef-a5b7-4334-b3fa-fc5223b82ffb', '🏠', 3, 'Gaming room accessories and setup items', 'Аксесоари и артикули за гейминг стая');

WITH room_id AS (SELECT id FROM categories WHERE slug = 'gaming-room-setup')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Monitor Arms & Mounts', 'Стойки и монтаж за монитори', 'room-monitor-mounts', (SELECT id FROM room_id), 1),
  ('Cable Management', 'Управление на кабели', 'room-cable-management', (SELECT id FROM room_id), 2),
  ('RGB Lighting', 'RGB Осветление', 'room-rgb-lighting', (SELECT id FROM room_id), 3),
  ('LED Strip Lights', 'LED Ленти', 'room-led-strips', (SELECT id FROM room_id), 4),
  ('Acoustic Panels', 'Акустични панели', 'room-acoustic-panels', (SELECT id FROM room_id), 5),
  ('Gaming Shelves', 'Гейминг рафтове', 'room-shelves', (SELECT id FROM room_id), 6),
  ('Headphone Stands', 'Стойки за слушалки', 'room-headphone-stands', (SELECT id FROM room_id), 7),
  ('Controller Displays', 'Поставки за контролери', 'room-controller-displays', (SELECT id FROM room_id), 8);

-- ===== Gaming Accessories L2/L3 =====
-- Gaming Accessories L1 ID: efc3d631-d910-4be4-b8dd-03959cd0810c

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Glasses', 'Гейминг очила', 'gaming-glasses', 'efc3d631-d910-4be4-b8dd-03959cd0810c', '👓', 1, 'Blue light blocking gaming glasses', 'Очила за защита от синя светлина');

WITH glasses_id AS (SELECT id FROM categories WHERE slug = 'gaming-glasses')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Blue Light Glasses', 'Очила против синя светлина', 'glasses-blue-light', (SELECT id FROM glasses_id), 1),
  ('Prescription Gaming Glasses', 'Гейминг очила с диоптър', 'glasses-prescription', (SELECT id FROM glasses_id), 2),
  ('Clip-On Gaming Lenses', 'Клипсващи гейминг лещи', 'glasses-clip-on', (SELECT id FROM glasses_id), 3);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Bags & Cases', 'Гейминг чанти и калъфи', 'gaming-bags', 'efc3d631-d910-4be4-b8dd-03959cd0810c', '🎒', 2, 'Gaming backpacks and carry cases', 'Гейминг раници и калъфи за пренасяне');

WITH bags_id AS (SELECT id FROM categories WHERE slug = 'gaming-bags')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Gaming Backpacks', 'Гейминг раници', 'bags-backpacks', (SELECT id FROM bags_id), 1),
  ('Laptop Gaming Bags', 'Чанти за гейминг лаптоп', 'bags-laptop', (SELECT id FROM bags_id), 2),
  ('PC Tower Cases', 'Калъфи за PC кутии', 'bags-tower', (SELECT id FROM bags_id), 3),
  ('LAN Party Bags', 'Чанти за LAN парти', 'bags-lan', (SELECT id FROM bags_id), 4);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Gaming Merchandise', 'Гейминг мърчандайз', 'gaming-merchandise', 'efc3d631-d910-4be4-b8dd-03959cd0810c', '👕', 3, 'Gaming apparel and collectibles', 'Гейминг облекло и колекционерски артикули');

WITH merch_id AS (SELECT id FROM categories WHERE slug = 'gaming-merchandise')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Gaming T-Shirts', 'Гейминг тениски', 'merch-tshirts', (SELECT id FROM merch_id), 1),
  ('Gaming Hoodies', 'Гейминг суитчъри', 'merch-hoodies', (SELECT id FROM merch_id), 2),
  ('Gaming Figures', 'Гейминг фигурки', 'merch-figures', (SELECT id FROM merch_id), 3),
  ('Gaming Posters', 'Гейминг плакати', 'merch-posters', (SELECT id FROM merch_id), 4),
  ('Gaming Mugs', 'Гейминг чаши', 'merch-mugs', (SELECT id FROM merch_id), 5),
  ('Gaming Collectibles', 'Гейминг колекционерски', 'merch-collectibles', (SELECT id FROM merch_id), 6);

-- ===== VR & AR Gaming L2/L3 =====
-- VR & AR Gaming L1 ID: 72917089-5657-4f92-aff2-6881c99eaf5e

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('VR Headsets', 'VR Очила', 'vr-headsets', '72917089-5657-4f92-aff2-6881c99eaf5e', '🥽', 1, 'Virtual reality headsets', 'Очила за виртуална реалност');

WITH vr_id AS (SELECT id FROM categories WHERE slug = 'vr-headsets')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Standalone VR Headsets', 'Самостоятелни VR очила', 'vr-standalone', (SELECT id FROM vr_id), 1),
  ('PC VR Headsets', 'PC VR Очила', 'vr-pc', (SELECT id FROM vr_id), 2),
  ('PlayStation VR', 'PlayStation VR', 'vr-playstation', (SELECT id FROM vr_id), 3),
  ('Meta Quest', 'Meta Quest', 'vr-meta-quest', (SELECT id FROM vr_id), 4),
  ('Valve Index', 'Valve Index', 'vr-valve-index', (SELECT id FROM vr_id), 5),
  ('HP Reverb', 'HP Reverb', 'vr-hp-reverb', (SELECT id FROM vr_id), 6);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('VR Accessories', 'VR Аксесоари', 'vr-accessories', '72917089-5657-4f92-aff2-6881c99eaf5e', '🎮', 2, 'VR controllers and accessories', 'VR контролери и аксесоари');

WITH vr_acc_id AS (SELECT id FROM categories WHERE slug = 'vr-accessories')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('VR Controllers', 'VR Контролери', 'vr-controllers', (SELECT id FROM vr_acc_id), 1),
  ('VR Face Covers', 'VR Лицеви покривала', 'vr-face-covers', (SELECT id FROM vr_acc_id), 2),
  ('VR Head Straps', 'VR Ремъци за глава', 'vr-head-straps', (SELECT id FROM vr_acc_id), 3),
  ('VR Charging Docks', 'VR Зарядни станции', 'vr-charging', (SELECT id FROM vr_acc_id), 4),
  ('VR Prescription Lenses', 'VR Лещи с диоптър', 'vr-lenses', (SELECT id FROM vr_acc_id), 5),
  ('VR Cable Management', 'VR Управление на кабели', 'vr-cable-management', (SELECT id FROM vr_acc_id), 6);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('VR Games & Experiences', 'VR Игри и преживявания', 'vr-games', '72917089-5657-4f92-aff2-6881c99eaf5e', '🎮', 3, 'VR games and experiences', 'VR игри и преживявания');

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('AR Gaming', 'AR Гейминг', 'ar-gaming', '72917089-5657-4f92-aff2-6881c99eaf5e', '📱', 4, 'Augmented reality gaming devices', 'Устройства за игри с добавена реалност');

-- ===== Streaming & Content Creation L2/L3 =====
-- Streaming L1 ID: 33a68d5c-bc22-4509-b4fb-d34dcc0fc66f

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Capture Cards', 'Кепчър карти', 'capture-cards', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', '📹', 1, 'Video capture devices for streaming', 'Видео кепчър устройства за стрийминг');

WITH capture_id AS (SELECT id FROM categories WHERE slug = 'capture-cards')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Internal Capture Cards', 'Вътрешни кепчър карти', 'capture-internal', (SELECT id FROM capture_id), 1),
  ('External Capture Cards', 'Външни кепчър карти', 'capture-external', (SELECT id FROM capture_id), 2),
  ('4K Capture Cards', '4K Кепчър карти', 'capture-4k', (SELECT id FROM capture_id), 3);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Stream Decks', 'Стрийм декове', 'stream-decks', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', '🎛️', 2, 'Stream control decks', 'Контролни панели за стрийминг');

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Streaming Microphones', 'Микрофони за стрийминг', 'streaming-microphones', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', '🎤', 3, 'Microphones for streaming and content creation', 'Микрофони за стрийминг и създаване на съдържание');

WITH mic_id AS (SELECT id FROM categories WHERE slug = 'streaming-microphones')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('USB Streaming Microphones', 'USB Стрийминг микрофони', 'mic-usb', (SELECT id FROM mic_id), 1),
  ('XLR Streaming Microphones', 'XLR Стрийминг микрофони', 'mic-xlr', (SELECT id FROM mic_id), 2),
  ('Boom Arms', 'Стойки за микрофони', 'mic-boom-arms', (SELECT id FROM mic_id), 3),
  ('Pop Filters', 'Поп филтри', 'mic-pop-filters', (SELECT id FROM mic_id), 4),
  ('Audio Interfaces', 'Аудио интерфейси', 'mic-audio-interfaces', (SELECT id FROM mic_id), 5);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Webcams & Cameras', 'Уебкамери и камери', 'streaming-webcams', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', '📷', 4, 'Webcams and cameras for streaming', 'Уебкамери и камери за стрийминг');

WITH webcam_id AS (SELECT id FROM categories WHERE slug = 'streaming-webcams')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('1080p Webcams', '1080p Уебкамери', 'webcam-1080p', (SELECT id FROM webcam_id), 1),
  ('4K Webcams', '4K Уебкамери', 'webcam-4k', (SELECT id FROM webcam_id), 2),
  ('DSLR/Mirrorless for Streaming', 'DSLR/Безогледални за стрийминг', 'webcam-dslr', (SELECT id FROM webcam_id), 3);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Lighting Equipment', 'Осветително оборудване', 'streaming-lighting', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', '💡', 5, 'Lighting for streaming and content creation', 'Осветление за стрийминг и създаване на съдържание');

WITH light_id AS (SELECT id FROM categories WHERE slug = 'streaming-lighting')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Ring Lights', 'Пръстенни лампи', 'light-ring', (SELECT id FROM light_id), 1),
  ('Key Lights', 'Основни лампи', 'light-key', (SELECT id FROM light_id), 2),
  ('Light Panels', 'Светлинни панели', 'light-panels', (SELECT id FROM light_id), 3),
  ('Light Bars', 'Светлинни ленти', 'light-bars', (SELECT id FROM light_id), 4);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Green Screens', 'Зелени екрани', 'green-screens', '33a68d5c-bc22-4509-b4fb-d34dcc0fc66f', '🟩', 6, 'Chroma key backgrounds', 'Хрома ключ фонове');

-- ===== Retro Gaming L2/L3 =====
-- Retro Gaming L1 ID: 7ffc181e-5bf2-4d81-998d-6d30446ae15b

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Retro Consoles', 'Ретро конзоли', 'retro-consoles', '7ffc181e-5bf2-4d81-998d-6d30446ae15b', '🕹️', 1, 'Classic gaming consoles', 'Класически гейминг конзоли');

WITH retro_console_id AS (SELECT id FROM categories WHERE slug = 'retro-consoles')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Nintendo NES/SNES', 'Nintendo NES/SNES', 'retro-nintendo', (SELECT id FROM retro_console_id), 1),
  ('Sega Genesis/Mega Drive', 'Sega Genesis/Mega Drive', 'retro-sega', (SELECT id FROM retro_console_id), 2),
  ('PlayStation 1/2/3', 'PlayStation 1/2/3', 'retro-playstation', (SELECT id FROM retro_console_id), 3),
  ('Xbox/Xbox 360', 'Xbox/Xbox 360', 'retro-xbox', (SELECT id FROM retro_console_id), 4),
  ('Atari', 'Atari', 'retro-atari', (SELECT id FROM retro_console_id), 5),
  ('Arcade Cabinets', 'Аркадни машини', 'retro-arcade', (SELECT id FROM retro_console_id), 6),
  ('Mini Consoles', 'Мини конзоли', 'retro-mini', (SELECT id FROM retro_console_id), 7);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Retro Games', 'Ретро игри', 'retro-games', '7ffc181e-5bf2-4d81-998d-6d30446ae15b', '🎮', 2, 'Classic video games', 'Класически видео игри');

WITH retro_games_id AS (SELECT id FROM categories WHERE slug = 'retro-games')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('NES Games', 'NES Игри', 'retro-nes-games', (SELECT id FROM retro_games_id), 1),
  ('SNES Games', 'SNES Игри', 'retro-snes-games', (SELECT id FROM retro_games_id), 2),
  ('Sega Games', 'Sega Игри', 'retro-sega-games', (SELECT id FROM retro_games_id), 3),
  ('PS1/PS2 Games', 'PS1/PS2 Игри', 'retro-ps-games', (SELECT id FROM retro_games_id), 4),
  ('N64 Games', 'N64 Игри', 'retro-n64-games', (SELECT id FROM retro_games_id), 5),
  ('GameBoy Games', 'GameBoy Игри', 'retro-gameboy-games', (SELECT id FROM retro_games_id), 6);

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES ('Retro Accessories', 'Ретро аксесоари', 'retro-accessories', '7ffc181e-5bf2-4d81-998d-6d30446ae15b', '🎮', 3, 'Classic gaming accessories', 'Класически гейминг аксесоари');

WITH retro_acc_id AS (SELECT id FROM categories WHERE slug = 'retro-accessories')
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Retro Controllers', 'Ретро контролери', 'retro-controllers', (SELECT id FROM retro_acc_id), 1),
  ('AV Cables & Adapters', 'AV Кабели и адаптери', 'retro-av-cables', (SELECT id FROM retro_acc_id), 2),
  ('Memory Cards', 'Мемори карти', 'retro-memory-cards', (SELECT id FROM retro_acc_id), 3),
  ('Console Mods', 'Модификации за конзоли', 'retro-mods', (SELECT id FROM retro_acc_id), 4);
;
