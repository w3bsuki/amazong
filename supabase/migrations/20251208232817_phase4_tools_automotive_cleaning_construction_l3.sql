-- Phase 4: Tools & Industrial - Automotive Tools, Cleaning Equipment, Construction L3 categories

DO $$
DECLARE
  -- Automotive Tools L2 IDs
  ac_tools_id UUID := 'c65b59e6-4be2-4ef0-970a-52aa49973eec';
  auto_compressors_id UUID := '81341dcd-1542-4d47-8394-a9838a1f6963';
  auto_sets_id UUID := 'e853cae1-ec5a-4d0e-b973-09f306ac6f7f';
  battery_chargers_id UUID := '7a4a6bd5-9312-4552-8e0b-ff239ee818a4';
  battery_tools_id UUID := 'ab154273-ccad-455f-be6e-b21677c18689';
  body_tools_id UUID := 'f25434ab-874e-4f35-ab5c-c6c727900b68';
  brake_tools_id UUID := '85088735-f225-4bcd-82b6-8dc98824e096';
  diag_tools_id UUID := '7c41aafc-ebf0-490f-8cb5-2df743e773e0';
  engine_tools_id UUID := '6a675493-509b-4abf-9cf6-250394c45e29';
  floor_jacks_id UUID := 'd48427c4-e2db-4893-a65e-9690db334472';
  jack_stands_id UUID := '9b9a595a-4b3a-4e0c-bb28-8ab9f4f69bbb';
  jump_starters_id UUID := '577863e9-d317-457a-baab-58b0275df1d9';
  mechanic_sets_id UUID := '8cedb477-84d0-40cb-908b-8867d4671633';
  fluid_tools_id UUID := 'eea41f27-31cf-47b1-96d2-f8939c4c6f76';
  susp_tools_id UUID := '410797a9-975d-4b04-bd80-a5a433900c41';
  tire_tools_id UUID := '9f351a1f-85e9-4487-b19a-3fda0f6336eb';
  tire_gauges_id UUID := '063744ed-f1c8-442b-ac5c-f8ac55c2b9ec';
  -- Cleaning Equipment L2 IDs
  carpet_clean_id UUID := 'e488242c-7fed-4531-b7f5-623caabcc23b';
  clean_acc_id UUID := '3ed8981d-17c9-481c-8d1e-cc19135741bc';
  floor_scrub_id UUID := '893f6b74-c5bb-430b-8c8f-27ea74212df2';
  pressure_wash_id UUID := '5c04fe4e-65aa-4c3b-aebf-255b0fb69b6c';
  shop_vac_id UUID := '58122d57-0649-47e9-80c9-c58a8310cb76';
  steam_clean_id UUID := '75cce3e4-e165-4456-84c4-398275b6661d';
  -- Construction L2 IDs
  concrete_mixer_id UUID := 'b2c88e2f-c83d-4b70-aa69-701f496966eb';
  concrete_vib_id UUID := '823db4bc-41fa-40f0-8985-30fea29102de';
BEGIN
  -- AC & Cooling Tools L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Refrigerant Recovery', 'ac-recovery', ac_tools_id, 'Възстановяване на хладилен агент', '❄️', 1),
    ('AC Manifold Gauges', 'ac-gauges', ac_tools_id, 'AC манометри', '❄️', 2),
    ('AC Leak Detectors', 'ac-leak-detectors', ac_tools_id, 'Детектори за течове', '❄️', 3),
    ('AC Recharge Kits', 'ac-recharge', ac_tools_id, 'Комплекти за зареждане', '❄️', 4),
    ('Cooling System Tools', 'ac-cooling-tools', ac_tools_id, 'Инструменти за охладителна система', '❄️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Auto Air Compressors L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('12V Tire Inflators', 'auto-compressor-12v', auto_compressors_id, '12V помпи за гуми', '🔧', 1),
    ('Portable Air Tanks', 'auto-compressor-tanks', auto_compressors_id, 'Преносими въздушни резервоари', '🔧', 2),
    ('Heavy Duty Inflators', 'auto-compressor-heavy', auto_compressors_id, 'Тежкотоварни компресори', '🔧', 3),
    ('Digital Tire Inflators', 'auto-compressor-digital', auto_compressors_id, 'Дигитални помпи', '🔧', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Auto Tool Sets L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Starter Tool Sets', 'auto-sets-starter', auto_sets_id, 'Начални комплекти', '🔧', 1),
    ('Professional Tool Sets', 'auto-sets-pro', auto_sets_id, 'Професионални комплекти', '🔧', 2),
    ('Specialized Tool Sets', 'auto-sets-specialized', auto_sets_id, 'Специализирани комплекти', '🔧', 3),
    ('Emergency Tool Kits', 'auto-sets-emergency', auto_sets_id, 'Аварийни комплекти', '🔧', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Battery Chargers L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Trickle Chargers', 'charger-trickle', battery_chargers_id, 'Поддържащи зарядни', '🔋', 1),
    ('Smart Chargers', 'charger-smart', battery_chargers_id, 'Смарт зарядни', '🔋', 2),
    ('Fast Chargers', 'charger-fast', battery_chargers_id, 'Бързи зарядни', '🔋', 3),
    ('Solar Chargers', 'charger-solar', battery_chargers_id, 'Соларни зарядни', '🔋', 4),
    ('Multi-Bank Chargers', 'charger-multi-bank', battery_chargers_id, 'Многоканални зарядни', '🔋', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Battery Tools L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Battery Testers', 'battery-testers', battery_tools_id, 'Тестери за акумулатори', '🔋', 1),
    ('Battery Terminal Tools', 'battery-terminal', battery_tools_id, 'Инструменти за клеми', '🔋', 2),
    ('Battery Carriers', 'battery-carriers', battery_tools_id, 'Носачи за акумулатори', '🔋', 3),
    ('Memory Savers', 'battery-memory', battery_tools_id, 'Запазващи паметта', '🔋', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Body & Frame Tools L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Dent Pullers', 'body-dent-pullers', body_tools_id, 'Издърпвачи за вдлъбнатини', '🔧', 1),
    ('Body Hammers', 'body-hammers', body_tools_id, 'Тенекеджийски чукове', '🔧', 2),
    ('Dollies', 'body-dollies', body_tools_id, 'Наковални', '🔧', 3),
    ('Frame Straighteners', 'body-frame', body_tools_id, 'Изправяне на рама', '🔧', 4),
    ('Spreaders', 'body-spreaders', body_tools_id, 'Разтегачи', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Brake Tools L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Brake Bleeders', 'brake-bleeders', brake_tools_id, 'Обезвъздушители', '🔧', 1),
    ('Caliper Tools', 'brake-caliper', brake_tools_id, 'Инструменти за апарати', '🔧', 2),
    ('Rotor Tools', 'brake-rotor', brake_tools_id, 'Инструменти за дискове', '🔧', 3),
    ('Drum Brake Tools', 'brake-drum', brake_tools_id, 'Инструменти за барабанни спирачки', '🔧', 4),
    ('Brake Line Tools', 'brake-line', brake_tools_id, 'Инструменти за спирачни тръбички', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Diagnostic Tools L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('OBD2 Scanners', 'diag-obd2', diag_tools_id, 'OBD2 скенери', '📊', 1),
    ('Professional Scanners', 'diag-professional', diag_tools_id, 'Професионални скенери', '📊', 2),
    ('Code Readers', 'diag-code-readers', diag_tools_id, 'Четци на кодове', '📊', 3),
    ('Multimeters', 'diag-multimeters', diag_tools_id, 'Мултиметри', '📊', 4),
    ('Oscilloscopes', 'diag-oscilloscopes', diag_tools_id, 'Осцилоскопи', '📊', 5),
    ('Smoke Machines', 'diag-smoke', diag_tools_id, 'Димни машини', '📊', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Engine Tools L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Timing Tools', 'engine-timing', engine_tools_id, 'Инструменти за ГРМ', '⚙️', 1),
    ('Compression Testers', 'engine-compression', engine_tools_id, 'Компресомери', '⚙️', 2),
    ('Cylinder Leak Testers', 'engine-leak', engine_tools_id, 'Тестери за теч', '⚙️', 3),
    ('Valve Tools', 'engine-valve', engine_tools_id, 'Инструменти за клапани', '⚙️', 4),
    ('Piston Ring Tools', 'engine-piston', engine_tools_id, 'Инструменти за бутални пръстени', '⚙️', 5),
    ('Bearing Pullers', 'engine-bearing', engine_tools_id, 'Лагерни екстрактори', '⚙️', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Floor Jacks L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('2-Ton Floor Jacks', 'jacks-2-ton', floor_jacks_id, '2-тонни крикове', '🔧', 1),
    ('3-Ton Floor Jacks', 'jacks-3-ton', floor_jacks_id, '3-тонни крикове', '🔧', 2),
    ('Low Profile Jacks', 'jacks-low-profile', floor_jacks_id, 'Нископрофилни крикове', '🔧', 3),
    ('Racing Jacks', 'jacks-racing', floor_jacks_id, 'Състезателни крикове', '🔧', 4),
    ('Aluminum Jacks', 'jacks-aluminum', floor_jacks_id, 'Алуминиеви крикове', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Jack Stands L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('2-Ton Jack Stands', 'stands-2-ton', jack_stands_id, '2-тонни стойки', '🔧', 1),
    ('3-Ton Jack Stands', 'stands-3-ton', jack_stands_id, '3-тонни стойки', '🔧', 2),
    ('6-Ton Jack Stands', 'stands-6-ton', jack_stands_id, '6-тонни стойки', '🔧', 3),
    ('Ratcheting Jack Stands', 'stands-ratcheting', jack_stands_id, 'Тресчоткови стойки', '🔧', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Jump Starters L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Lithium Jump Starters', 'jump-lithium', jump_starters_id, 'Литиеви стартери', '🔋', 1),
    ('Lead-Acid Jump Starters', 'jump-lead-acid', jump_starters_id, 'Оловни стартери', '🔋', 2),
    ('Ultracapacitor Jump Starters', 'jump-ultracap', jump_starters_id, 'Ултракондензаторни стартери', '🔋', 3),
    ('Professional Jump Starters', 'jump-professional', jump_starters_id, 'Професионални стартери', '🔋', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Pressure Washers L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Electric Pressure Washers', 'pressure-electric', pressure_wash_id, 'Електрически водоструйки', '💦', 1),
    ('Gas Pressure Washers', 'pressure-gas', pressure_wash_id, 'Бензинови водоструйки', '💦', 2),
    ('Commercial Pressure Washers', 'pressure-commercial', pressure_wash_id, 'Търговски водоструйки', '💦', 3),
    ('Pressure Washer Accessories', 'pressure-accessories', pressure_wash_id, 'Аксесоари за водоструйки', '💦', 4),
    ('Hot Water Pressure Washers', 'pressure-hot-water', pressure_wash_id, 'Водоструйки с топла вода', '💦', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Shop Vacuums L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Wet/Dry Vacuums', 'shopvac-wet-dry', shop_vac_id, 'Мокри/сухи прахосмукачки', '🔧', 1),
    ('Cordless Shop Vacuums', 'shopvac-cordless', shop_vac_id, 'Безжични прахосмукачки', '🔧', 2),
    ('Industrial Vacuums', 'shopvac-industrial', shop_vac_id, 'Индустриални прахосмукачки', '🔧', 3),
    ('HEPA Shop Vacuums', 'shopvac-hepa', shop_vac_id, 'HEPA прахосмукачки', '🔧', 4),
    ('Shop Vacuum Accessories', 'shopvac-accessories', shop_vac_id, 'Аксесоари за прахосмукачки', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Concrete Mixers L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Portable Concrete Mixers', 'concrete-mixer-portable', concrete_mixer_id, 'Преносими бетонобъркачки', '🏗️', 1),
    ('Drum Mixers', 'concrete-mixer-drum', concrete_mixer_id, 'Барабанни бетонобъркачки', '🏗️', 2),
    ('Wheelbarrow Mixers', 'concrete-mixer-wheelbarrow', concrete_mixer_id, 'Бетонобъркачки с количка', '🏗️', 3),
    ('Towable Mixers', 'concrete-mixer-towable', concrete_mixer_id, 'Теглими бетонобъркачки', '🏗️', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Concrete Vibrators L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Internal Vibrators', 'concrete-vib-internal', concrete_vib_id, 'Вътрешни вибратори', '🏗️', 1),
    ('External Vibrators', 'concrete-vib-external', concrete_vib_id, 'Външни вибратори', '🏗️', 2),
    ('Surface Vibrators', 'concrete-vib-surface', concrete_vib_id, 'Повърхностни вибратори', '🏗️', 3),
    ('Vibrator Motors', 'concrete-vib-motors', concrete_vib_id, 'Вибраторни мотори', '🏗️', 4)
  ON CONFLICT (slug) DO NOTHING;

END $$;;
