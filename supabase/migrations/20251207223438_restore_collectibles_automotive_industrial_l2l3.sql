
-- Restore Collectibles, Automotive and Industrial categories
DO $$
DECLARE
  -- Collectibles L1 IDs
  v_collectibles_id UUID;
  v_coins_stamps_id UUID;
  v_sports_memorabilia_id UUID;
  v_entertainment_memorabilia_id UUID;
  v_vintage_antiques_id UUID;
  v_art_collectibles_id UUID;
  -- Automotive L1 IDs
  v_automotive_id UUID;
  v_car_parts_id UUID;
  v_car_electronics_id UUID;
  v_car_care_id UUID;
  v_motorcycle_parts_id UUID;
  v_truck_parts_id UUID;
  v_tools_equipment_id UUID;
  -- Industrial L1 IDs
  v_industrial_id UUID;
  v_industrial_supplies_id UUID;
  v_safety_equipment_id UUID;
  v_material_handling_id UUID;
  v_electrical_industrial_id UUID;
  v_hydraulics_id UUID;
BEGIN
  -- Get Collectibles parent
  SELECT id INTO v_collectibles_id FROM categories WHERE slug = 'collectibles';
  
  -- Get Collectibles L1 IDs
  SELECT id INTO v_coins_stamps_id FROM categories WHERE slug = 'coins-paper-money';
  SELECT id INTO v_sports_memorabilia_id FROM categories WHERE slug = 'sports-memorabilia';
  SELECT id INTO v_entertainment_memorabilia_id FROM categories WHERE slug = 'entertainment-memorabilia';
  SELECT id INTO v_vintage_antiques_id FROM categories WHERE slug = 'vintage-antiques';
  SELECT id INTO v_art_collectibles_id FROM categories WHERE slug = 'art-collectibles';

  -- Get Automotive parent
  SELECT id INTO v_automotive_id FROM categories WHERE slug = 'automotive';
  
  -- Get Automotive L1 IDs
  SELECT id INTO v_car_parts_id FROM categories WHERE slug = 'car-parts-accessories';
  SELECT id INTO v_car_electronics_id FROM categories WHERE slug = 'car-electronics';
  SELECT id INTO v_car_care_id FROM categories WHERE slug = 'car-care';
  SELECT id INTO v_motorcycle_parts_id FROM categories WHERE slug = 'motorcycle-parts';
  SELECT id INTO v_truck_parts_id FROM categories WHERE slug = 'truck-parts';
  SELECT id INTO v_tools_equipment_id FROM categories WHERE slug = 'automotive-tools';

  -- Get Industrial parent
  SELECT id INTO v_industrial_id FROM categories WHERE slug = 'industrial';
  
  -- Get Industrial L1 IDs
  SELECT id INTO v_industrial_supplies_id FROM categories WHERE slug = 'industrial-supplies';
  SELECT id INTO v_safety_equipment_id FROM categories WHERE slug = 'safety-equipment';
  SELECT id INTO v_material_handling_id FROM categories WHERE slug = 'material-handling';
  SELECT id INTO v_electrical_industrial_id FROM categories WHERE slug = 'industrial-electrical';
  SELECT id INTO v_hydraulics_id FROM categories WHERE slug = 'hydraulics-pneumatics';

  -- COLLECTIBLES L2 Categories
  IF v_coins_stamps_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('US Coins', 'Американски монети', 'us-coins', v_coins_stamps_id, 1),
    ('World Coins', 'Световни монети', 'world-coins', v_coins_stamps_id, 2),
    ('Ancient Coins', 'Антични монети', 'ancient-coins', v_coins_stamps_id, 3),
    ('Bullion', 'Кюлчета', 'bullion', v_coins_stamps_id, 4),
    ('US Stamps', 'Американски марки', 'us-stamps', v_coins_stamps_id, 5),
    ('World Stamps', 'Световни марки', 'world-stamps', v_coins_stamps_id, 6),
    ('Paper Money', 'Банкноти', 'paper-money', v_coins_stamps_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_sports_memorabilia_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Baseball Cards', 'Бейзболни картички', 'baseball-cards', v_sports_memorabilia_id, 1),
    ('Basketball Cards', 'Баскетболни картички', 'basketball-cards', v_sports_memorabilia_id, 2),
    ('Football Cards', 'Футболни картички', 'football-cards-us', v_sports_memorabilia_id, 3),
    ('Soccer Cards', 'Футболни картички', 'soccer-cards', v_sports_memorabilia_id, 4),
    ('Hockey Cards', 'Хокейни картички', 'hockey-cards', v_sports_memorabilia_id, 5),
    ('Autographed Items', 'Автографи', 'autographed-sports', v_sports_memorabilia_id, 6),
    ('Game Used Items', 'Използвани в игра', 'game-used-items', v_sports_memorabilia_id, 7),
    ('Sports Jerseys', 'Екипи', 'sports-jerseys', v_sports_memorabilia_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_entertainment_memorabilia_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Movie Props', 'Филмови реквизити', 'movie-props', v_entertainment_memorabilia_id, 1),
    ('TV Show Memorabilia', 'Сериални сувенири', 'tv-show-memorabilia', v_entertainment_memorabilia_id, 2),
    ('Music Memorabilia', 'Музикални сувенири', 'music-memorabilia', v_entertainment_memorabilia_id, 3),
    ('Celebrity Autographs', 'Автографи на знаменитости', 'celebrity-autographs', v_entertainment_memorabilia_id, 4),
    ('Posters', 'Постери', 'posters-collectible', v_entertainment_memorabilia_id, 5),
    ('Vintage Records', 'Ретро плочи', 'vintage-records-collectible', v_entertainment_memorabilia_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_vintage_antiques_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Antique Furniture', 'Антични мебели', 'antique-furniture', v_vintage_antiques_id, 1),
    ('Vintage Jewelry', 'Ретро бижута', 'vintage-jewelry', v_vintage_antiques_id, 2),
    ('Vintage Clothing', 'Ретро дрехи', 'vintage-clothing', v_vintage_antiques_id, 3),
    ('Vintage Toys', 'Ретро играчки', 'vintage-toys', v_vintage_antiques_id, 4),
    ('Antique China', 'Античен порцелан', 'antique-china', v_vintage_antiques_id, 5),
    ('Vintage Electronics', 'Ретро електроника', 'vintage-electronics', v_vintage_antiques_id, 6),
    ('Vintage Books', 'Ретро книги', 'vintage-books', v_vintage_antiques_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- AUTOMOTIVE L2 Categories
  IF v_car_electronics_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Car Stereos', 'Авто стерео системи', 'car-stereos', v_car_electronics_id, 1),
    ('Car Speakers', 'Авто говорители', 'car-speakers', v_car_electronics_id, 2),
    ('GPS Navigation', 'GPS навигация', 'gps-navigation', v_car_electronics_id, 3),
    ('Dash Cameras', 'Видеорегистратори', 'dash-cameras', v_car_electronics_id, 4),
    ('Backup Cameras', 'Камери за паркиране', 'backup-cameras', v_car_electronics_id, 5),
    ('Car Alarms', 'Авто аларми', 'car-alarms', v_car_electronics_id, 6),
    ('OBD Scanners', 'OBD скенери', 'obd-scanners', v_car_electronics_id, 7),
    ('Car Phone Mounts', 'Стойки за телефон', 'car-phone-mounts', v_car_electronics_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_car_care_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Car Wash', 'Автомивка', 'car-wash-products', v_car_care_id, 1),
    ('Car Wax', 'Вакса за кола', 'car-wax', v_car_care_id, 2),
    ('Interior Cleaners', 'Почистване интериор', 'interior-cleaners', v_car_care_id, 3),
    ('Tire Care', 'Грижа за гуми', 'tire-care', v_car_care_id, 4),
    ('Glass Cleaners', 'Почистване стъкла', 'glass-cleaners', v_car_care_id, 5),
    ('Air Fresheners', 'Ароматизатори', 'air-fresheners', v_car_care_id, 6),
    ('Detailing Supplies', 'Детайлинг продукти', 'detailing-supplies', v_car_care_id, 7),
    ('Paint Care', 'Грижа за боя', 'paint-care', v_car_care_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_motorcycle_parts_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Motorcycle Helmets', 'Мото каски', 'motorcycle-helmets', v_motorcycle_parts_id, 1),
    ('Motorcycle Jackets', 'Мото якета', 'motorcycle-jackets', v_motorcycle_parts_id, 2),
    ('Motorcycle Gloves', 'Мото ръкавици', 'motorcycle-gloves', v_motorcycle_parts_id, 3),
    ('Motorcycle Boots', 'Мото ботуши', 'motorcycle-boots', v_motorcycle_parts_id, 4),
    ('Motorcycle Exhaust', 'Мото ауспуси', 'motorcycle-exhaust', v_motorcycle_parts_id, 5),
    ('Motorcycle Tires', 'Мото гуми', 'motorcycle-tires', v_motorcycle_parts_id, 6),
    ('Motorcycle Batteries', 'Мото батерии', 'motorcycle-batteries', v_motorcycle_parts_id, 7),
    ('Motorcycle Luggage', 'Мото багаж', 'motorcycle-luggage', v_motorcycle_parts_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_tools_equipment_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Floor Jacks', 'Крикове', 'floor-jacks', v_tools_equipment_id, 1),
    ('Jack Stands', 'Авто стойки', 'jack-stands', v_tools_equipment_id, 2),
    ('Diagnostic Tools', 'Диагностични инструменти', 'diagnostic-tools', v_tools_equipment_id, 3),
    ('Mechanic Tool Sets', 'Механични комплекти', 'mechanic-tool-sets', v_tools_equipment_id, 4),
    ('Air Compressors', 'Авто компресори', 'auto-air-compressors', v_tools_equipment_id, 5),
    ('Battery Chargers', 'Зарядни за батерии', 'battery-chargers', v_tools_equipment_id, 6),
    ('Garage Storage', 'Гаражно съхранение', 'garage-storage', v_tools_equipment_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- INDUSTRIAL L2 Categories
  IF v_safety_equipment_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Hard Hats', 'Каски', 'hard-hats', v_safety_equipment_id, 1),
    ('Safety Glasses', 'Предпазни очила', 'safety-glasses', v_safety_equipment_id, 2),
    ('Work Gloves', 'Работни ръкавици', 'work-gloves', v_safety_equipment_id, 3),
    ('Safety Vests', 'Светлоотразителни жилетки', 'safety-vests', v_safety_equipment_id, 4),
    ('Respirators', 'Респиратори', 'respirators', v_safety_equipment_id, 5),
    ('Ear Protection', 'Защита за уши', 'ear-protection', v_safety_equipment_id, 6),
    ('Fall Protection', 'Защита от падане', 'fall-protection', v_safety_equipment_id, 7),
    ('First Aid Kits', 'Комплекти първа помощ', 'first-aid-kits-industrial', v_safety_equipment_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_material_handling_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Pallet Jacks', 'Палетни колички', 'pallet-jacks', v_material_handling_id, 1),
    ('Hand Trucks', 'Ръчни колички', 'hand-trucks', v_material_handling_id, 2),
    ('Forklifts', 'Мотокари', 'forklifts', v_material_handling_id, 3),
    ('Conveyor Systems', 'Конвейерни системи', 'conveyor-systems', v_material_handling_id, 4),
    ('Storage Racks', 'Стелажи', 'storage-racks', v_material_handling_id, 5),
    ('Bins & Containers', 'Кутии и контейнери', 'bins-containers', v_material_handling_id, 6),
    ('Dollies', 'Платформени колички', 'dollies', v_material_handling_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_hydraulics_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Hydraulic Pumps', 'Хидравлични помпи', 'hydraulic-pumps', v_hydraulics_id, 1),
    ('Hydraulic Cylinders', 'Хидравлични цилиндри', 'hydraulic-cylinders', v_hydraulics_id, 2),
    ('Hydraulic Hoses', 'Хидравлични маркучи', 'hydraulic-hoses', v_hydraulics_id, 3),
    ('Pneumatic Tools', 'Пневматични инструменти', 'pneumatic-tools', v_hydraulics_id, 4),
    ('Air Cylinders', 'Въздушни цилиндри', 'air-cylinders', v_hydraulics_id, 5),
    ('Valves', 'Клапани', 'hydraulic-valves', v_hydraulics_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Collectibles, Automotive and Industrial categories restored';
END $$;
;
