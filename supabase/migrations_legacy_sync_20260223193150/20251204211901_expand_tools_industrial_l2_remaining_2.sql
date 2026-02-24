-- =====================================================
-- L2 Categories for Fasteners & Hardware (97d0a86f-16a9-433b-b79d-df8adef9a28b)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Screws', 'Винтове', 'fasteners-screws', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '🔩', 'Wood, machine, self-tapping screws', 'Дървесни, машинни, самонарезни винтове', 1),
  (gen_random_uuid(), 'Bolts', 'Болтове', 'fasteners-bolts', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '🔩', 'Hex, carriage, anchor bolts', 'Шестостенни, карета, анкерни болтове', 2),
  (gen_random_uuid(), 'Nuts', 'Гайки', 'fasteners-nuts', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '⚙️', 'Hex, lock, wing nuts', 'Шестостенни, стопорни, пеперуди', 3),
  (gen_random_uuid(), 'Washers', 'Шайби', 'fasteners-washers', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '⭕', 'Flat, lock, fender washers', 'Плоски, пружинни, широки шайби', 4),
  (gen_random_uuid(), 'Nails & Staples', 'Пирони и скоби', 'fasteners-nails', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '📍', 'Finish, framing nails, staples', 'Декоративни, строителни пирони, скоби', 5),
  (gen_random_uuid(), 'Anchors', 'Анкери', 'fasteners-anchors', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '⚓', 'Wall, concrete, expansion anchors', 'Стенни, бетонови, разпъващи анкери', 6),
  (gen_random_uuid(), 'Brackets & Braces', 'Скоби и ъгли', 'fasteners-brackets', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '📐', 'Corner brackets, L-brackets, braces', 'Ъглови скоби, L-профили', 7),
  (gen_random_uuid(), 'Hinges', 'Панти', 'fasteners-hinges', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '🚪', 'Door, cabinet, specialty hinges', 'Панти за врати, шкафове, специални', 8),
  (gen_random_uuid(), 'Hooks & Hangers', 'Куки и закачалки', 'fasteners-hooks', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '🪝', 'Wall hooks, ceiling hooks, hangers', 'Стенни куки, тавански куки, закачалки', 9),
  (gen_random_uuid(), 'Chains & Cables', 'Вериги и кабели', 'fasteners-chains', '97d0a86f-16a9-433b-b79d-df8adef9a28b', '⛓️', 'Chains, wire rope, cables', 'Вериги, стоманени въжета, кабели', 10);

-- =====================================================
-- L2 Categories for Test & Measurement (5ef11798-3076-4ad1-a64d-011603b72d99)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Calipers', 'Шублери', 'measurement-calipers', '5ef11798-3076-4ad1-a64d-011603b72d99', '📏', 'Digital, dial, vernier calipers', 'Дигитални, механични, нониус шублери', 1),
  (gen_random_uuid(), 'Micrometers', 'Микрометри', 'measurement-micrometers', '5ef11798-3076-4ad1-a64d-011603b72d99', '🔍', 'Outside, inside, depth micrometers', 'Външни, вътрешни, дълбочинни', 2),
  (gen_random_uuid(), 'Laser Levels', 'Лазерни нивелири', 'measurement-laser-levels', '5ef11798-3076-4ad1-a64d-011603b72d99', '📐', 'Line, cross, rotary laser levels', 'Линейни, кръстати, ротационни лазери', 3),
  (gen_random_uuid(), 'Distance Meters', 'Лазерни ролетки', 'measurement-distance', '5ef11798-3076-4ad1-a64d-011603b72d99', '📏', 'Laser distance measurers', 'Лазерни измерители на разстояние', 4),
  (gen_random_uuid(), 'Thermal Cameras', 'Термокамери', 'measurement-thermal', '5ef11798-3076-4ad1-a64d-011603b72d99', '🌡️', 'Infrared thermal imaging cameras', 'Инфрачервени термографски камери', 5),
  (gen_random_uuid(), 'Oscilloscopes', 'Осцилоскопи', 'measurement-oscilloscopes', '5ef11798-3076-4ad1-a64d-011603b72d99', '📊', 'Digital and analog oscilloscopes', 'Дигитални и аналогови осцилоскопи', 6),
  (gen_random_uuid(), 'Stud Finders', 'Детектори за греди', 'measurement-stud-finders', '5ef11798-3076-4ad1-a64d-011603b72d99', '🔍', 'Electronic stud and wire finders', 'Електронни търсачи на греди и кабели', 7),
  (gen_random_uuid(), 'Inspection Cameras', 'Инспекционни камери', 'measurement-inspection', '5ef11798-3076-4ad1-a64d-011603b72d99', '📹', 'Borescopes, endoscopes', 'Бороскопи, ендоскопи', 8),
  (gen_random_uuid(), 'Measuring Accessories', 'Измервателни аксесоари', 'measurement-accessories', '5ef11798-3076-4ad1-a64d-011603b72d99', '🧰', 'Gauge blocks, stands, accessories', 'Калибри, стойки, аксесоари', 9);

-- =====================================================
-- L2 Categories for Tool Accessories & Parts (c830f31c-fb85-4a1a-b9c1-9f562cc83825)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Drill Bits', 'Свредла', 'accessories-drill-bits', 'c830f31c-fb85-4a1a-b9c1-9f562cc83825', '🔧', 'HSS, carbide, masonry drill bits', 'HSS, карбидни, бетонови свредла', 1),
  (gen_random_uuid(), 'Saw Blades', 'Триони и ножове', 'accessories-saw-blades', 'c830f31c-fb85-4a1a-b9c1-9f562cc83825', '🪚', 'Circular, reciprocating, jigsaw blades', 'Циркулярни, саблени, прободни ножове', 2),
  (gen_random_uuid(), 'Router Bits', 'Фрези', 'accessories-router-bits', 'c830f31c-fb85-4a1a-b9c1-9f562cc83825', '⚙️', 'Router bits and sets', 'Фрезери и комплекти фрези', 3),
  (gen_random_uuid(), 'Batteries & Chargers', 'Батерии и зарядни', 'accessories-batteries', 'c830f31c-fb85-4a1a-b9c1-9f562cc83825', '🔋', 'Tool batteries and chargers', 'Батерии и зарядни за инструменти', 4),
  (gen_random_uuid(), 'Replacement Parts', 'Резервни части', 'accessories-replacement', 'c830f31c-fb85-4a1a-b9c1-9f562cc83825', '🔄', 'Motors, switches, brushes, parts', 'Мотори, ключове, четки, части', 5),
  (gen_random_uuid(), 'Tool Attachments', 'Приставки за инструменти', 'accessories-attachments', 'c830f31c-fb85-4a1a-b9c1-9f562cc83825', '🔧', 'Adapters, extensions, attachments', 'Адаптери, удължители, приставки', 6),
  (gen_random_uuid(), 'Bit Sets', 'Комплекти битове', 'accessories-bit-sets', 'c830f31c-fb85-4a1a-b9c1-9f562cc83825', '🔩', 'Screwdriver bits and sets', 'Накрайници за отвертки и комплекти', 7),
  (gen_random_uuid(), 'Hole Saws', 'Боркорони', 'accessories-hole-saws', 'c830f31c-fb85-4a1a-b9c1-9f562cc83825', '⭕', 'Bi-metal, carbide hole saws', 'Биметални, карбидни боркорони', 8);

-- =====================================================
-- L2 Categories for Generators & Power (081743f1-b668-4d7c-8d57-eed4bd09b793)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Portable Generators', 'Преносими генератори', 'generators-portable', '081743f1-b668-4d7c-8d57-eed4bd09b793', '⚡', 'Gas and diesel portable generators', 'Бензинови и дизелови преносими генератори', 1),
  (gen_random_uuid(), 'Inverter Generators', 'Инверторни генератори', 'generators-inverter', '081743f1-b668-4d7c-8d57-eed4bd09b793', '🔌', 'Quiet inverter generators', 'Тихи инверторни генератори', 2),
  (gen_random_uuid(), 'Standby Generators', 'Стационарни генератори', 'generators-standby', '081743f1-b668-4d7c-8d57-eed4bd09b793', '🏠', 'Whole house standby generators', 'Домашни резервни генератори', 3),
  (gen_random_uuid(), 'Power Stations', 'Захранващи станции', 'generators-power-stations', '081743f1-b668-4d7c-8d57-eed4bd09b793', '🔋', 'Portable power stations', 'Преносими захранващи станции', 4),
  (gen_random_uuid(), 'Inverters', 'Инвертори', 'generators-inverters', '081743f1-b668-4d7c-8d57-eed4bd09b793', '⚡', 'Power inverters DC to AC', 'Инвертори DC към AC', 5),
  (gen_random_uuid(), 'Transfer Switches', 'Превключватели', 'generators-transfer', '081743f1-b668-4d7c-8d57-eed4bd09b793', '🔀', 'Manual and automatic transfer switches', 'Ръчни и автоматични превключватели', 6),
  (gen_random_uuid(), 'Generator Accessories', 'Аксесоари за генератори', 'generators-accessories', '081743f1-b668-4d7c-8d57-eed4bd09b793', '🧰', 'Covers, cords, maintenance kits', 'Калъфи, кабели, комплекти за поддръжка', 7);

-- =====================================================
-- L2 Categories for Cleaning Equipment (969a708b-b87a-4730-8010-de72bdd10026)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Pressure Washers', 'Водоструйки', 'cleaning-pressure-washers', '969a708b-b87a-4730-8010-de72bdd10026', '💦', 'Electric and gas pressure washers', 'Електрически и бензинови водоструйки', 1),
  (gen_random_uuid(), 'Shop Vacuums', 'Прахосмукачки за работилница', 'cleaning-shop-vacuums', '969a708b-b87a-4730-8010-de72bdd10026', '🧹', 'Wet/dry shop vacuums', 'Прахосмукачки за мокро/сухо', 2),
  (gen_random_uuid(), 'Steam Cleaners', 'Парочистачки', 'cleaning-steam-cleaners', '969a708b-b87a-4730-8010-de72bdd10026', '♨️', 'Handheld and canister steam cleaners', 'Ръчни и канистрови парочистачки', 3),
  (gen_random_uuid(), 'Floor Scrubbers', 'Подопочистващи машини', 'cleaning-floor-scrubbers', '969a708b-b87a-4730-8010-de72bdd10026', '🧽', 'Walk-behind and ride-on scrubbers', 'Пешеходни и тип количка', 4),
  (gen_random_uuid(), 'Carpet Cleaners', 'Машини за килими', 'cleaning-carpet-cleaners', '969a708b-b87a-4730-8010-de72bdd10026', '🏠', 'Carpet extractors and cleaners', 'Екстрактори и машини за килими', 5),
  (gen_random_uuid(), 'Cleaning Accessories', 'Почистващи аксесоари', 'cleaning-accessories', '969a708b-b87a-4730-8010-de72bdd10026', '🧰', 'Nozzles, hoses, cleaning supplies', 'Дюзи, маркучи, почистващи консумативи', 6)
ON CONFLICT (slug) DO NOTHING;;
