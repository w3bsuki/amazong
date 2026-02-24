
-- =====================================================
-- GAMING CATEGORY ATTRIBUTES - Comprehensive Set
-- =====================================================
-- Gaming L0 ID: 54c304d0-4eba-4075-9ef3-8cbcf426d9b0

-- Delete old gaming attributes first
DELETE FROM category_attributes WHERE category_id = '54c304d0-4eba-4075-9ef3-8cbcf426d9b0';

-- ===== Global Gaming Attributes (apply to all gaming products) =====
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('54c304d0-4eba-4075-9ef3-8cbcf426d9b0', 'Brand', 'Марка', 'select', false, true, 
  '["Razer", "Logitech", "Corsair", "SteelSeries", "HyperX", "ASUS ROG", "MSI", "Alienware", "Roccat", "Glorious", "Ducky", "Sony", "Microsoft", "Nintendo", "NZXT", "Secretlab", "noblechairs", "DXRacer", "Elgato", "Blue", "Rode", "Audio-Technica", "Other"]',
  '["Razer", "Logitech", "Corsair", "SteelSeries", "HyperX", "ASUS ROG", "MSI", "Alienware", "Roccat", "Glorious", "Ducky", "Sony", "Microsoft", "Nintendo", "NZXT", "Secretlab", "noblechairs", "DXRacer", "Elgato", "Blue", "Rode", "Audio-Technica", "Друга"]',
  1),

('54c304d0-4eba-4075-9ef3-8cbcf426d9b0', 'Condition', 'Състояние', 'select', true, true, 
  '["New", "Like New", "Very Good", "Good", "Acceptable", "For Parts"]',
  '["Ново", "Като ново", "Много добро", "Добро", "Приемливо", "За части"]',
  2),

('54c304d0-4eba-4075-9ef3-8cbcf426d9b0', 'Color', 'Цвят', 'select', false, true, 
  '["Black", "White", "Gray", "Red", "Blue", "Green", "Pink", "Purple", "RGB/Multi-color", "Custom"]',
  '["Черен", "Бял", "Сив", "Червен", "Син", "Зелен", "Розов", "Лилав", "RGB/Многоцветен", "Персонализиран"]',
  3),

('54c304d0-4eba-4075-9ef3-8cbcf426d9b0', 'RGB Lighting', 'RGB Осветление', 'boolean', false, true, '[]', '[]', 4),

('54c304d0-4eba-4075-9ef3-8cbcf426d9b0', 'Warranty', 'Гаранция', 'select', false, true, 
  '["No Warranty", "1 Month", "3 Months", "6 Months", "1 Year", "2 Years", "3+ Years", "Manufacturer Warranty"]',
  '["Без гаранция", "1 месец", "3 месеца", "6 месеца", "1 година", "2 години", "3+ години", "Гаранция от производител"]',
  5);

-- Get keyboard category ID
WITH kb_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-keyboards')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
((SELECT id FROM kb_id), 'Switch Type', 'Тип суичове', 'select', false, true,
  '["Cherry MX Red", "Cherry MX Blue", "Cherry MX Brown", "Cherry MX Black", "Cherry MX Speed", "Gateron Red", "Gateron Blue", "Gateron Brown", "Razer Green", "Razer Orange", "Razer Yellow", "Logitech GX Blue", "Logitech GX Red", "Logitech GX Brown", "Hot-Swappable", "Membrane", "Optical", "Other"]',
  '["Cherry MX Red", "Cherry MX Blue", "Cherry MX Brown", "Cherry MX Black", "Cherry MX Speed", "Gateron Red", "Gateron Blue", "Gateron Brown", "Razer Green", "Razer Orange", "Razer Yellow", "Logitech GX Blue", "Logitech GX Red", "Logitech GX Brown", "Hot-Swappable", "Мембранни", "Оптични", "Друг"]',
  10),

((SELECT id FROM kb_id), 'Keyboard Layout', 'Размер клавиатура', 'select', false, true,
  '["Full Size (100%)", "TKL (80%)", "75%", "65%", "60%", "40%", "Numpad Only"]',
  '["Пълноразмерна (100%)", "TKL (80%)", "75%", "65%", "60%", "40%", "Само нумпад"]',
  11),

((SELECT id FROM kb_id), 'Connection Type', 'Тип връзка', 'select', false, true,
  '["Wired USB", "Wired USB-C", "Wireless 2.4GHz", "Bluetooth", "Wired + Wireless", "Triple Mode (Wired/2.4GHz/BT)"]',
  '["Кабелен USB", "Кабелен USB-C", "Безжичен 2.4GHz", "Bluetooth", "Кабелен + Безжичен", "Три режима (Кабелен/2.4GHz/BT)"]',
  12),

((SELECT id FROM kb_id), 'Hot-Swappable', 'Hot-Swappable', 'boolean', false, true, '[]', '[]', 13),

((SELECT id FROM kb_id), 'N-Key Rollover', 'N-Key Rollover', 'boolean', false, true, '[]', '[]', 14),

((SELECT id FROM kb_id), 'Wrist Rest', 'Опора за китка', 'boolean', false, true, '[]', '[]', 15);

-- Get mouse category ID
WITH mouse_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-mice')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
((SELECT id FROM mouse_id), 'DPI/CPI', 'DPI/CPI', 'select', false, true,
  '["Up to 8000", "8000-12000", "12000-16000", "16000-20000", "20000-25000", "25000+"]',
  '["До 8000", "8000-12000", "12000-16000", "16000-20000", "20000-25000", "25000+"]',
  20),

((SELECT id FROM mouse_id), 'Sensor Type', 'Тип сензор', 'select', false, true,
  '["Optical", "Laser", "Hero (Logitech)", "Focus+ (Razer)", "TrueMove (SteelSeries)", "PAW3370", "PAW3399", "Other"]',
  '["Оптичен", "Лазерен", "Hero (Logitech)", "Focus+ (Razer)", "TrueMove (SteelSeries)", "PAW3370", "PAW3399", "Друг"]',
  21),

((SELECT id FROM mouse_id), 'Mouse Connection', 'Връзка мишка', 'select', false, true,
  '["Wired", "Wireless 2.4GHz", "Bluetooth", "Wired + Wireless", "Triple Mode"]',
  '["Кабелна", "Безжична 2.4GHz", "Bluetooth", "Кабелна + Безжична", "Три режима"]',
  22),

((SELECT id FROM mouse_id), 'Mouse Weight', 'Тегло мишка', 'select', false, true,
  '["Ultra Light (<60g)", "Light (60-80g)", "Medium (80-100g)", "Heavy (100-120g)", "Very Heavy (120g+)", "Adjustable"]',
  '["Ултра леко (<60g)", "Леко (60-80g)", "Средно (80-100g)", "Тежко (100-120g)", "Много тежко (120g+)", "Регулируемо"]',
  23),

((SELECT id FROM mouse_id), 'Number of Buttons', 'Брой бутони', 'select', false, true,
  '["2-4 Buttons", "5-6 Buttons", "7-9 Buttons", "10-12 Buttons", "12+ Buttons (MMO)"]',
  '["2-4 Бутона", "5-6 Бутона", "7-9 Бутона", "10-12 Бутона", "12+ Бутона (MMO)"]',
  24),

((SELECT id FROM mouse_id), 'Grip Style', 'Стил на хващане', 'select', false, true,
  '["Palm Grip", "Claw Grip", "Fingertip Grip", "Universal/All Grips"]',
  '["Палм грип", "Клоу грип", "Финтертип грип", "Универсален"]',
  25),

((SELECT id FROM mouse_id), 'Polling Rate', 'Честота на отговор', 'select', false, true,
  '["125Hz", "500Hz", "1000Hz", "2000Hz", "4000Hz", "8000Hz"]',
  '["125Hz", "500Hz", "1000Hz", "2000Hz", "4000Hz", "8000Hz"]',
  26);

-- Get headset category ID
WITH headset_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-headsets')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
((SELECT id FROM headset_id), 'Headset Connection', 'Връзка слушалки', 'select', false, true,
  '["Wired 3.5mm", "Wired USB", "Wireless 2.4GHz", "Bluetooth", "Wired + Wireless"]',
  '["Кабелни 3.5mm", "Кабелни USB", "Безжични 2.4GHz", "Bluetooth", "Кабелни + Безжични"]',
  30),

((SELECT id FROM headset_id), 'Surround Sound', 'Съраунд звук', 'select', false, true,
  '["Stereo", "Virtual 7.1", "True 7.1", "Dolby Atmos", "DTS:X", "3D Audio"]',
  '["Стерео", "Виртуален 7.1", "Истински 7.1", "Dolby Atmos", "DTS:X", "3D Audio"]',
  31),

((SELECT id FROM headset_id), 'Driver Size', 'Размер драйвер', 'select', false, true,
  '["40mm", "50mm", "53mm", "55mm+", "Other"]',
  '["40mm", "50mm", "53mm", "55mm+", "Друг"]',
  32),

((SELECT id FROM headset_id), 'Microphone Type', 'Тип микрофон', 'select', false, true,
  '["Fixed Boom", "Detachable Boom", "Retractable", "Flip-to-Mute", "No Microphone"]',
  '["Фиксиран", "Сваляем", "Прибиращ се", "Flip-to-Mute", "Без микрофон"]',
  33),

((SELECT id FROM headset_id), 'Noise Cancellation', 'Шумопотискане', 'select', false, true,
  '["None", "Passive", "Active (ANC)", "Hybrid ANC"]',
  '["Няма", "Пасивно", "Активно (ANC)", "Хибридно ANC"]',
  34),

((SELECT id FROM headset_id), 'Ear Cup Design', 'Дизайн на наушниците', 'select', false, true,
  '["Over-Ear Closed", "Over-Ear Open", "On-Ear"]',
  '["Над ухото затворени", "Над ухото отворени", "На ухото"]',
  35);

-- Get monitor category ID
WITH monitor_id AS (SELECT id FROM categories WHERE slug = 'pc-gaming-monitors-cat')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
((SELECT id FROM monitor_id), 'Screen Size', 'Размер на екрана', 'select', false, true,
  '["Under 24\"", "24-25\"", "27\"", "28-32\"", "34\" Ultrawide", "38\"+ Ultrawide", "49\" Super Ultrawide"]',
  '["Под 24\"", "24-25\"", "27\"", "28-32\"", "34\" Ултраширок", "38\"+ Ултраширок", "49\" Супер ултраширок"]',
  40),

((SELECT id FROM monitor_id), 'Resolution', 'Резолюция', 'select', false, true,
  '["1080p (Full HD)", "1440p (2K QHD)", "4K UHD", "1080p Ultrawide", "1440p Ultrawide", "5K"]',
  '["1080p (Full HD)", "1440p (2K QHD)", "4K UHD", "1080p Ултраширок", "1440p Ултраширок", "5K"]',
  41),

((SELECT id FROM monitor_id), 'Refresh Rate', 'Честота на опресняване', 'select', false, true,
  '["60Hz", "75Hz", "100Hz", "120Hz", "144Hz", "165Hz", "180Hz", "240Hz", "280Hz", "360Hz", "500Hz+"]',
  '["60Hz", "75Hz", "100Hz", "120Hz", "144Hz", "165Hz", "180Hz", "240Hz", "280Hz", "360Hz", "500Hz+"]',
  42),

((SELECT id FROM monitor_id), 'Panel Type', 'Тип панел', 'select', false, true,
  '["IPS", "VA", "TN", "OLED", "QD-OLED", "Mini-LED", "Nano IPS"]',
  '["IPS", "VA", "TN", "OLED", "QD-OLED", "Mini-LED", "Nano IPS"]',
  43),

((SELECT id FROM monitor_id), 'Response Time', 'Време за реакция', 'select', false, true,
  '["0.5ms", "1ms", "2ms", "4ms", "5ms+"]',
  '["0.5ms", "1ms", "2ms", "4ms", "5ms+"]',
  44),

((SELECT id FROM monitor_id), 'Adaptive Sync', 'Адаптивна синхронизация', 'multiselect', false, true,
  '["None", "G-Sync", "G-Sync Compatible", "G-Sync Ultimate", "FreeSync", "FreeSync Premium", "FreeSync Premium Pro"]',
  '["Няма", "G-Sync", "G-Sync Compatible", "G-Sync Ultimate", "FreeSync", "FreeSync Premium", "FreeSync Premium Pro"]',
  45),

((SELECT id FROM monitor_id), 'HDR Support', 'HDR Поддръжка', 'select', false, true,
  '["No HDR", "HDR10", "HDR400", "HDR600", "HDR1000", "HDR1400", "Dolby Vision"]',
  '["Без HDR", "HDR10", "HDR400", "HDR600", "HDR1000", "HDR1400", "Dolby Vision"]',
  46),

((SELECT id FROM monitor_id), 'Curved', 'Извит', 'boolean', false, true, '[]', '[]', 47);

-- Console Gaming attributes
WITH console_id AS (SELECT id FROM categories WHERE slug = 'console-gaming')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
((SELECT id FROM console_id), 'Console Platform', 'Конзолна платформа', 'select', false, true,
  '["PlayStation 5", "PlayStation 4", "Xbox Series X", "Xbox Series S", "Xbox One", "Nintendo Switch", "Nintendo Switch OLED", "Nintendo Switch Lite", "Steam Deck"]',
  '["PlayStation 5", "PlayStation 4", "Xbox Series X", "Xbox Series S", "Xbox One", "Nintendo Switch", "Nintendo Switch OLED", "Nintendo Switch Lite", "Steam Deck"]',
  50),

((SELECT id FROM console_id), 'Console Storage', 'Памет на конзола', 'select', false, true,
  '["256GB", "500GB", "512GB", "825GB", "1TB", "2TB"]',
  '["256GB", "500GB", "512GB", "825GB", "1TB", "2TB"]',
  51),

((SELECT id FROM console_id), 'Console Edition', 'Издание на конзола', 'select', false, true,
  '["Standard", "Digital Edition", "Limited Edition", "Bundle", "Slim", "Pro/Enhanced"]',
  '["Стандартно", "Дигитално издание", "Лимитирано издание", "Бъндъл", "Slim", "Pro/Enhanced"]',
  52),

((SELECT id FROM console_id), 'Game Genre', 'Жанр игра', 'multiselect', false, true,
  '["Action", "Adventure", "RPG", "Sports", "Racing", "Shooter", "Strategy", "Simulation", "Fighting", "Horror", "Puzzle", "Platformer", "Open World", "Battle Royale", "MMORPG", "Indie"]',
  '["Екшън", "Приключенска", "RPG", "Спортна", "Състезателна", "Шутър", "Стратегия", "Симулация", "Файтинг", "Хорър", "Пъзел", "Платформър", "Отворен свят", "Battle Royale", "MMORPG", "Инди"]',
  53),

((SELECT id FROM console_id), 'Game Rating (PEGI)', 'Рейтинг (PEGI)', 'select', false, true,
  '["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18"]',
  '["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18"]',
  54),

((SELECT id FROM console_id), 'Multiplayer', 'Мултиплейър', 'multiselect', false, true,
  '["Single Player Only", "Local Co-op", "Online Co-op", "Local PvP", "Online PvP", "Cross-Platform", "Split Screen"]',
  '["Само сингъл плейър", "Локален кооп", "Онлайн кооп", "Локален PvP", "Онлайн PvP", "Крос-платформен", "Сплит скрийн"]',
  55);

-- Gaming Chair attributes
WITH chair_id AS (SELECT id FROM categories WHERE slug = 'gaming-chairs-cat')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
((SELECT id FROM chair_id), 'Chair Style', 'Стил стол', 'select', false, true,
  '["Racing Style", "Ergonomic", "Executive", "Rocker", "Bean Bag", "Floor"]',
  '["Състезателен", "Ергономичен", "Екзекютив", "Люлеещ", "Пуф", "За под"]',
  60),

((SELECT id FROM chair_id), 'Max Weight Capacity', 'Макс. тегло', 'select', false, true,
  '["Up to 100kg", "100-120kg", "120-150kg", "150-180kg", "180kg+"]',
  '["До 100kg", "100-120kg", "120-150kg", "150-180kg", "180kg+"]',
  61),

((SELECT id FROM chair_id), 'Armrests', 'Подлакътници', 'select', false, true,
  '["None", "Fixed", "1D (Height)", "2D (Height + Width)", "3D (Height + Width + Depth)", "4D (All Directions)"]',
  '["Няма", "Фиксирани", "1D (Височина)", "2D (Височина + Ширина)", "3D (Височина + Ширина + Дълбочина)", "4D (Всички посоки)"]',
  62),

((SELECT id FROM chair_id), 'Chair Material', 'Материал', 'select', false, true,
  '["PU Leather", "Real Leather", "Fabric/Mesh", "Hybrid"]',
  '["PU Кожа", "Истинска кожа", "Плат/Мрежа", "Хибрид"]',
  63),

((SELECT id FROM chair_id), 'Recline Angle', 'Ъгъл на накланяне', 'select', false, true,
  '["90-120°", "90-135°", "90-155°", "90-180° (Full Flat)"]',
  '["90-120°", "90-135°", "90-155°", "90-180° (Пълно легнал)"]',
  64),

((SELECT id FROM chair_id), 'Lumbar Support', 'Лумбална поддръжка', 'select', false, true,
  '["None", "Fixed Pillow", "Adjustable Pillow", "Built-in Adjustable", "Built-in + Pillow"]',
  '["Няма", "Фиксирана възглавница", "Регулируема възглавница", "Вградена регулируема", "Вградена + Възглавница"]',
  65);

-- VR attributes
WITH vr_id AS (SELECT id FROM categories WHERE slug = 'vr-headsets')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
((SELECT id FROM vr_id), 'VR Type', 'Тип VR', 'select', false, true,
  '["Standalone", "PC VR (Tethered)", "PC VR (Wireless)", "PlayStation VR", "Mobile VR"]',
  '["Самостоятелен", "PC VR (с кабел)", "PC VR (безжичен)", "PlayStation VR", "Мобилен VR"]',
  70),

((SELECT id FROM vr_id), 'VR Resolution (per eye)', 'VR Резолюция (на око)', 'select', false, true,
  '["1080p", "1440p", "1832x1920", "2160x2160", "2448x2448", "2880x2880+"]',
  '["1080p", "1440p", "1832x1920", "2160x2160", "2448x2448", "2880x2880+"]',
  71),

((SELECT id FROM vr_id), 'VR Refresh Rate', 'VR Честота', 'select', false, true,
  '["72Hz", "80Hz", "90Hz", "120Hz", "144Hz"]',
  '["72Hz", "80Hz", "90Hz", "120Hz", "144Hz"]',
  72),

((SELECT id FROM vr_id), 'Tracking', 'Проследяване', 'select', false, true,
  '["Inside-Out", "Outside-In (Base Stations)", "Hybrid", "Controller-Based"]',
  '["Inside-Out", "Outside-In (Базови станции)", "Хибридно", "Базирано на контролер"]',
  73),

((SELECT id FROM vr_id), 'Controllers Included', 'Включени контролери', 'boolean', false, true, '[]', '[]', 74);

-- Streaming Equipment attributes
WITH stream_id AS (SELECT id FROM categories WHERE slug = 'streaming-equipment')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
((SELECT id FROM stream_id), 'Capture Resolution', 'Резолюция на запис', 'select', false, true,
  '["720p", "1080p 30fps", "1080p 60fps", "1440p 60fps", "4K 30fps", "4K 60fps", "4K 120fps"]',
  '["720p", "1080p 30fps", "1080p 60fps", "1440p 60fps", "4K 30fps", "4K 60fps", "4K 120fps"]',
  80),

((SELECT id FROM stream_id), 'Passthrough', 'Passthrough', 'select', false, true,
  '["1080p 60fps", "1440p 60fps", "4K 60fps", "4K 60fps HDR", "4K 120fps", "4K 144fps VRR"]',
  '["1080p 60fps", "1440p 60fps", "4K 60fps", "4K 60fps HDR", "4K 120fps", "4K 144fps VRR"]',
  81),

((SELECT id FROM stream_id), 'Interface', 'Интерфейс', 'select', false, true,
  '["USB 2.0", "USB 3.0", "USB-C", "PCIe", "Thunderbolt"]',
  '["USB 2.0", "USB 3.0", "USB-C", "PCIe", "Thunderbolt"]',
  82);

-- Retro Gaming attributes
WITH retro_id AS (SELECT id FROM categories WHERE slug = 'retro-gaming')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
((SELECT id FROM retro_id), 'Retro Console', 'Ретро конзола', 'select', false, true,
  '["NES", "SNES", "Nintendo 64", "GameCube", "Wii", "Game Boy", "GBA", "DS/3DS", "Sega Genesis/Mega Drive", "Sega Saturn", "Sega Dreamcast", "PlayStation 1", "PlayStation 2", "PlayStation 3", "PSP", "PS Vita", "Original Xbox", "Xbox 360", "Atari 2600", "Atari 7800", "Neo Geo", "TurboGrafx-16", "Other"]',
  '["NES", "SNES", "Nintendo 64", "GameCube", "Wii", "Game Boy", "GBA", "DS/3DS", "Sega Genesis/Mega Drive", "Sega Saturn", "Sega Dreamcast", "PlayStation 1", "PlayStation 2", "PlayStation 3", "PSP", "PS Vita", "Original Xbox", "Xbox 360", "Atari 2600", "Atari 7800", "Neo Geo", "TurboGrafx-16", "Друга"]',
  90),

((SELECT id FROM retro_id), 'Region', 'Регион', 'select', false, true,
  '["PAL", "NTSC-U", "NTSC-J", "Region Free"]',
  '["PAL", "NTSC-U", "NTSC-J", "Без регион"]',
  91),

((SELECT id FROM retro_id), 'Complete In Box', 'Пълен комплект в кутия', 'select', false, true,
  '["CIB (Complete In Box)", "Cartridge/Disc Only", "Box + Game (No Manual)", "Sealed/New"]',
  '["CIB (Пълен комплект)", "Само касета/диск", "Кутия + Игра (без мануал)", "Запечатана/Нова"]',
  92);
;
