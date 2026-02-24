
-- ============================================
-- E-MOBILITY COMPLETE CATEGORY HIERARCHY
-- L0: E-Mobility (already exists)
-- L1: 9 main subcategories
-- L2: 52 subcategories
-- L3: 89 subcategories
-- ============================================

-- Get the E-Mobility L0 ID
DO $$
DECLARE
  v_emobility_id UUID := '2ab6ebd1-f22d-4088-af7e-60b61a372903';
  
  -- L1 IDs
  v_escooters_id UUID;
  v_ebikes_id UUID;
  v_eboards_id UUID;
  v_hoverboards_id UUID;
  v_eunicycles_id UUID;
  v_egokarts_id UUID;
  v_accessories_id UUID;
  v_parts_id UUID;
  v_charging_id UUID;
  
  -- L2 IDs for E-Scooters
  v_escooter_adult_id UUID;
  v_escooter_kids_id UUID;
  v_escooter_offroad_id UUID;
  v_escooter_seated_id UUID;
  v_escooter_performance_id UUID;
  
  -- L2 IDs for E-Bikes
  v_ebike_city_id UUID;
  v_ebike_mountain_id UUID;
  v_ebike_folding_id UUID;
  v_ebike_cargo_id UUID;
  v_ebike_fat_id UUID;
  v_ebike_road_id UUID;
  v_ebike_commuter_id UUID;
  v_ebike_kids_id UUID;
  
  -- L2 IDs for E-Boards
  v_eboard_skateboard_id UUID;
  v_eboard_longboard_id UUID;
  v_eboard_onewheel_id UUID;
  v_eboard_surfboard_id UUID;
  
  -- L2 IDs for Hoverboards
  v_hover_standard_id UUID;
  v_hover_offroad_id UUID;
  v_hover_gokart_id UUID;
  v_hover_segway_id UUID;
  
  -- L2 IDs for E-Unicycles
  v_euc_beginner_id UUID;
  v_euc_commuter_id UUID;
  v_euc_performance_id UUID;
  v_euc_offroad_id UUID;
  
  -- L2 IDs for E-Go-Karts
  v_kart_kids_id UUID;
  v_kart_adult_id UUID;
  v_kart_drift_id UUID;
  
  -- L2 IDs for Accessories
  v_acc_helmets_id UUID;
  v_acc_protection_id UUID;
  v_acc_bags_id UUID;
  v_acc_locks_id UUID;
  v_acc_lights_id UUID;
  v_acc_phone_id UUID;
  v_acc_mirrors_id UUID;
  v_acc_storage_id UUID;
  
  -- L2 IDs for Parts
  v_parts_batteries_id UUID;
  v_parts_motors_id UUID;
  v_parts_controllers_id UUID;
  v_parts_tires_id UUID;
  v_parts_brakes_id UUID;
  v_parts_suspension_id UUID;
  v_parts_handlebars_id UUID;
  v_parts_displays_id UUID;
  v_parts_lights_id UUID;
  
  -- L2 IDs for Charging
  v_charge_home_id UUID;
  v_charge_portable_id UUID;
  v_charge_fast_id UUID;
  v_charge_solar_id UUID;
  v_charge_stations_id UUID;

BEGIN
  -- ============================================
  -- L1 CATEGORIES (9 total)
  -- ============================================
  
  -- 1. E-Scooters
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('E-Scooters', 'Електрически тротинетки', 'emob-escooters', v_emobility_id, '🛴', 1,
    'Electric kick scooters for personal transportation', 'Електрически тротинетки за лично придвижване')
  RETURNING id INTO v_escooters_id;
  
  -- 2. E-Bikes
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('E-Bikes', 'Електрически велосипеди', 'emob-ebikes', v_emobility_id, '🚲', 2,
    'Electric bicycles with pedal-assist and throttle', 'Електрически велосипеди с подпомагане и газ')
  RETURNING id INTO v_ebikes_id;
  
  -- 3. E-Skateboards & Boards
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('E-Skateboards & Boards', 'Електрически скейтборди', 'emob-eboards', v_emobility_id, '🛹', 3,
    'Electric skateboards, longboards, and onewheel devices', 'Електрически скейтборди, лонгборди и onewheel')
  RETURNING id INTO v_eboards_id;
  
  -- 4. Hoverboards & Segways
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Hoverboards & Segways', 'Ховърборди и сегуеи', 'emob-hoverboards', v_emobility_id, '🛞', 4,
    'Self-balancing scooters and personal transporters', 'Самобалансиращи тротинетки и персонални транспортни средства')
  RETURNING id INTO v_hoverboards_id;
  
  -- 5. E-Unicycles (EUC)
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('E-Unicycles', 'Електрически моноколела', 'emob-eunicycles', v_emobility_id, '🎡', 5,
    'Electric unicycles for advanced riders', 'Електрически моноколела за напреднали')
  RETURNING id INTO v_eunicycles_id;
  
  -- 6. Electric Go-Karts
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Electric Go-Karts', 'Електрически картинги', 'emob-gokarts', v_emobility_id, '🏎️', 6,
    'Small electric go-karts and drift karts', 'Малки електрически картинги и дрифт карти')
  RETURNING id INTO v_egokarts_id;
  
  -- 7. E-Mobility Accessories
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('E-Mobility Accessories', 'Аксесоари за електромобилност', 'emob-accessories', v_emobility_id, '🎒', 7,
    'Helmets, bags, locks, lights for e-mobility devices', 'Каски, чанти, катинари, светлини за електрически превозни средства')
  RETURNING id INTO v_accessories_id;
  
  -- 8. E-Mobility Parts
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('E-Mobility Parts', 'Части за електромобилност', 'emob-parts', v_emobility_id, '🔧', 8,
    'Replacement parts for electric personal vehicles', 'Резервни части за електрически превозни средства')
  RETURNING id INTO v_parts_id;
  
  -- 9. Charging & Power
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Charging & Power', 'Зареждане и захранване', 'emob-charging', v_emobility_id, '🔌', 9,
    'Chargers and power solutions for e-mobility', 'Зарядни устройства и захранване за електромобилност')
  RETURNING id INTO v_charging_id;

  -- ============================================
  -- L2 CATEGORIES - E-SCOOTERS (5)
  -- ============================================
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Adult E-Scooters', 'Тротинетки за възрастни', 'emob-escooters-adult', v_escooters_id, '🛴', 1,
    'Electric scooters designed for adults', 'Електрически тротинетки за възрастни')
  RETURNING id INTO v_escooter_adult_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Kids E-Scooters', 'Детски тротинетки', 'emob-escooters-kids', v_escooters_id, '🧒', 2,
    'Safe electric scooters for children', 'Безопасни електрически тротинетки за деца')
  RETURNING id INTO v_escooter_kids_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Off-Road E-Scooters', 'Офроуд тротинетки', 'emob-escooters-offroad', v_escooters_id, '🏔️', 3,
    'Rugged scooters for terrain riding', 'Тротинетки за терен и неравности')
  RETURNING id INTO v_escooter_offroad_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Seated E-Scooters', 'Тротинетки със седалка', 'emob-escooters-seated', v_escooters_id, '💺', 4,
    'Electric scooters with seats', 'Електрически тротинетки със седалка')
  RETURNING id INTO v_escooter_seated_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Performance E-Scooters', 'Мощни тротинетки', 'emob-escooters-performance', v_escooters_id, '⚡', 5,
    'High-speed performance scooters', 'Високоскоростни мощни тротинетки')
  RETURNING id INTO v_escooter_performance_id;

  -- L3 for Adult E-Scooters
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Commuter E-Scooters', 'Градски тротинетки', 'emob-escooters-commuter', v_escooter_adult_id, '🏙️', 1),
    ('Folding E-Scooters', 'Сгъваеми тротинетки', 'emob-escooters-folding', v_escooter_adult_id, '📦', 2),
    ('Lightweight E-Scooters', 'Леки тротинетки', 'emob-escooters-lightweight', v_escooter_adult_id, '🪶', 3),
    ('Long-Range E-Scooters', 'Тротинетки с голям обхват', 'emob-escooters-longrange', v_escooter_adult_id, '🛣️', 4);

  -- L3 for Performance E-Scooters
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Dual Motor E-Scooters', 'Двумоторни тротинетки', 'emob-escooters-dualmotor', v_escooter_performance_id, '⚡', 1),
    ('Racing E-Scooters', 'Състезателни тротинетки', 'emob-escooters-racing', v_escooter_performance_id, '🏁', 2),
    ('High-Speed E-Scooters', 'Високоскоростни тротинетки', 'emob-escooters-highspeed', v_escooter_performance_id, '💨', 3);

  -- ============================================
  -- L2 CATEGORIES - E-BIKES (8)
  -- ============================================
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('City E-Bikes', 'Градски електровелосипеди', 'emob-ebikes-city', v_ebikes_id, '🏙️', 1,
    'Urban electric bicycles for commuting', 'Градски електрически велосипеди за ежедневно придвижване')
  RETURNING id INTO v_ebike_city_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Mountain E-Bikes', 'Планински електровелосипеди', 'emob-ebikes-mountain', v_ebikes_id, '⛰️', 2,
    'Electric mountain bikes for trails', 'Електрически планински велосипеди за терен')
  RETURNING id INTO v_ebike_mountain_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Folding E-Bikes', 'Сгъваеми електровелосипеди', 'emob-ebikes-folding', v_ebikes_id, '📦', 3,
    'Compact folding electric bikes', 'Компактни сгъваеми електрически велосипеди')
  RETURNING id INTO v_ebike_folding_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Cargo E-Bikes', 'Товарни електровелосипеди', 'emob-ebikes-cargo', v_ebikes_id, '📦', 4,
    'Electric cargo bikes for deliveries', 'Електрически товарни велосипеди за доставки')
  RETURNING id INTO v_ebike_cargo_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Fat Tire E-Bikes', 'Електровелосипеди с дебели гуми', 'emob-ebikes-fat', v_ebikes_id, '🛞', 5,
    'Wide tire electric bikes', 'Електрически велосипеди с широки гуми')
  RETURNING id INTO v_ebike_fat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Road E-Bikes', 'Шосейни електровелосипеди', 'emob-ebikes-road', v_ebikes_id, '🛣️', 6,
    'Electric road bikes for speed', 'Електрически шосейни велосипеди')
  RETURNING id INTO v_ebike_road_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Commuter E-Bikes', 'Електровелосипеди за пътуване', 'emob-ebikes-commuter', v_ebikes_id, '💼', 7,
    'Electric bikes optimized for daily commutes', 'Електрически велосипеди за ежедневно пътуване')
  RETURNING id INTO v_ebike_commuter_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Kids E-Bikes', 'Детски електровелосипеди', 'emob-ebikes-kids', v_ebikes_id, '🧒', 8,
    'Electric bikes for children', 'Електрически велосипеди за деца')
  RETURNING id INTO v_ebike_kids_id;

  -- L3 for Mountain E-Bikes
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Hardtail E-MTB', 'Хардтейл E-MTB', 'emob-ebikes-mtb-hardtail', v_ebike_mountain_id, '🚵', 1),
    ('Full Suspension E-MTB', 'Двойно окачване E-MTB', 'emob-ebikes-mtb-fullsus', v_ebike_mountain_id, '🚵‍♂️', 2),
    ('Enduro E-MTB', 'Ендуро E-MTB', 'emob-ebikes-mtb-enduro', v_ebike_mountain_id, '🏔️', 3),
    ('Downhill E-MTB', 'Даунхил E-MTB', 'emob-ebikes-mtb-downhill', v_ebike_mountain_id, '⬇️', 4);

  -- L3 for Cargo E-Bikes
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Front Loader Cargo', 'Преден товарен', 'emob-ebikes-cargo-front', v_ebike_cargo_id, '📦', 1),
    ('Longtail Cargo', 'Дълъг товарен', 'emob-ebikes-cargo-longtail', v_ebike_cargo_id, '🚲', 2),
    ('Utility Cargo', 'Многофункционален товарен', 'emob-ebikes-cargo-utility', v_ebike_cargo_id, '🛠️', 3);

  -- ============================================
  -- L2 CATEGORIES - E-BOARDS (4)
  -- ============================================
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Electric Skateboards', 'Електрически скейтборди', 'emob-eboards-skateboard', v_eboards_id, '🛹', 1,
    'Motorized skateboards', 'Моторизирани скейтборди')
  RETURNING id INTO v_eboard_skateboard_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Electric Longboards', 'Електрически лонгборди', 'emob-eboards-longboard', v_eboards_id, '🛹', 2,
    'Electric longboards for cruising', 'Електрически лонгборди за разходки')
  RETURNING id INTO v_eboard_longboard_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Onewheel & Floatboards', 'Onewheel и флоутборди', 'emob-eboards-onewheel', v_eboards_id, '🎿', 3,
    'Single-wheel self-balancing boards', 'Едноколесни самобалансиращи дъски')
  RETURNING id INTO v_eboard_onewheel_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Electric Surfboards', 'Електрически сърф дъски', 'emob-eboards-surfboard', v_eboards_id, '🏄', 4,
    'Motorized surfboards and eFoils', 'Моторизирани сърф дъски и eFoil')
  RETURNING id INTO v_eboard_surfboard_id;

  -- L3 for Electric Skateboards
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Hub Motor Boards', 'Дъски с хъб мотор', 'emob-eboards-hub', v_eboard_skateboard_id, '⚙️', 1),
    ('Belt Drive Boards', 'Дъски с ремъчен привод', 'emob-eboards-belt', v_eboard_skateboard_id, '🔗', 2),
    ('Off-Road E-Boards', 'Офроуд електро дъски', 'emob-eboards-offroad', v_eboard_skateboard_id, '🏔️', 3),
    ('Mini E-Boards', 'Мини електро дъски', 'emob-eboards-mini', v_eboard_skateboard_id, '📏', 4);

  -- ============================================
  -- L2 CATEGORIES - HOVERBOARDS (4)
  -- ============================================
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Standard Hoverboards', 'Стандартни ховърборди', 'emob-hover-standard', v_hoverboards_id, '🛞', 1,
    'Classic self-balancing hoverboards', 'Класически самобалансиращи ховърборди')
  RETURNING id INTO v_hover_standard_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Off-Road Hoverboards', 'Офроуд ховърборди', 'emob-hover-offroad', v_hoverboards_id, '🏔️', 2,
    'All-terrain hoverboards', 'Ховърборди за всякакъв терен')
  RETURNING id INTO v_hover_offroad_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Hoverboard Go-Kart Kits', 'Ховърборд Go-Kart комплекти', 'emob-hover-gokart', v_hoverboards_id, '🏎️', 3,
    'Go-kart attachments for hoverboards', 'Go-kart добавки за ховърборди')
  RETURNING id INTO v_hover_gokart_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Segways & Ninebot', 'Segway и Ninebot', 'emob-hover-segway', v_hoverboards_id, '🛴', 4,
    'Personal transporters with handlebar', 'Персонални транспортни средства с кормило')
  RETURNING id INTO v_hover_segway_id;

  -- L3 for Standard Hoverboards
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('6.5 Inch Hoverboards', '6.5 инчови ховърборди', 'emob-hover-65', v_hover_standard_id, '📏', 1),
    ('8 Inch Hoverboards', '8 инчови ховърборди', 'emob-hover-8', v_hover_standard_id, '📏', 2),
    ('10 Inch Hoverboards', '10 инчови ховърборди', 'emob-hover-10', v_hover_standard_id, '📏', 3),
    ('Kids Hoverboards', 'Детски ховърборди', 'emob-hover-kids', v_hover_standard_id, '🧒', 4);

  -- ============================================
  -- L2 CATEGORIES - E-UNICYCLES (4)
  -- ============================================
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Beginner EUC', 'Моноколела за начинаещи', 'emob-euc-beginner', v_eunicycles_id, '🔰', 1,
    'Entry-level electric unicycles', 'Електрически моноколела за начинаещи')
  RETURNING id INTO v_euc_beginner_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Commuter EUC', 'Моноколела за придвижване', 'emob-euc-commuter', v_eunicycles_id, '🏙️', 2,
    'Electric unicycles for daily commute', 'Електрически моноколела за ежедневно придвижване')
  RETURNING id INTO v_euc_commuter_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Performance EUC', 'Мощни моноколела', 'emob-euc-performance', v_eunicycles_id, '⚡', 3,
    'High-speed performance unicycles', 'Високоскоростни мощни моноколела')
  RETURNING id INTO v_euc_performance_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Off-Road EUC', 'Офроуд моноколела', 'emob-euc-offroad', v_eunicycles_id, '🏔️', 4,
    'Rugged unicycles for terrain', 'Моноколела за терен')
  RETURNING id INTO v_euc_offroad_id;

  -- L3 for Performance EUC
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('High-Speed EUC', 'Високоскоростни моноколела', 'emob-euc-highspeed', v_euc_performance_id, '💨', 1),
    ('Long-Range EUC', 'Моноколела с голям обхват', 'emob-euc-longrange', v_euc_performance_id, '🛣️', 2),
    ('Suspension EUC', 'Моноколела с окачване', 'emob-euc-suspension', v_euc_performance_id, '🔧', 3);

  -- ============================================
  -- L2 CATEGORIES - E-GO-KARTS (3)
  -- ============================================
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Kids Go-Karts', 'Детски картинги', 'emob-kart-kids', v_egokarts_id, '🧒', 1,
    'Safe electric go-karts for children', 'Безопасни електрически картинги за деца')
  RETURNING id INTO v_kart_kids_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Adult Go-Karts', 'Картинги за възрастни', 'emob-kart-adult', v_egokarts_id, '🏎️', 2,
    'Electric go-karts for adults', 'Електрически картинги за възрастни')
  RETURNING id INTO v_kart_adult_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Drift Karts', 'Дрифт картинги', 'emob-kart-drift', v_egokarts_id, '🔄', 3,
    'Electric drift karts for fun', 'Електрически дрифт картинги')
  RETURNING id INTO v_kart_drift_id;

  -- ============================================
  -- L2 CATEGORIES - ACCESSORIES (8)
  -- ============================================
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Helmets', 'Каски', 'emob-acc-helmets', v_accessories_id, '⛑️', 1,
    'Safety helmets for e-mobility', 'Предпазни каски за електромобилност')
  RETURNING id INTO v_acc_helmets_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Protection Gear', 'Протектори', 'emob-acc-protection', v_accessories_id, '🦺', 2,
    'Knee pads, elbow pads, gloves', 'Наколенки, налакътници, ръкавици')
  RETURNING id INTO v_acc_protection_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Bags & Carriers', 'Чанти и носачи', 'emob-acc-bags', v_accessories_id, '🎒', 3,
    'Carrying bags and storage solutions', 'Чанти за пренасяне и съхранение')
  RETURNING id INTO v_acc_bags_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Locks & Security', 'Катинари и сигурност', 'emob-acc-locks', v_accessories_id, '🔒', 4,
    'Locks and anti-theft devices', 'Катинари и против кражба устройства')
  RETURNING id INTO v_acc_locks_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Lights & Reflectors', 'Светлини и отражатели', 'emob-acc-lights', v_accessories_id, '💡', 5,
    'LED lights and visibility accessories', 'LED светлини и аксесоари за видимост')
  RETURNING id INTO v_acc_lights_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Phone Mounts', 'Стойки за телефон', 'emob-acc-phone', v_accessories_id, '📱', 6,
    'Phone holders and mounts', 'Поставки и стойки за телефон')
  RETURNING id INTO v_acc_phone_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Mirrors', 'Огледала', 'emob-acc-mirrors', v_accessories_id, '🪞', 7,
    'Rearview mirrors for safety', 'Огледала за обратно виждане')
  RETURNING id INTO v_acc_mirrors_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Storage & Baskets', 'Съхранение и кошници', 'emob-acc-storage', v_accessories_id, '🧺', 8,
    'Baskets and storage accessories', 'Кошници и аксесоари за съхранение')
  RETURNING id INTO v_acc_storage_id;

  -- L3 for Helmets
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Full Face Helmets', 'Каски с пълно покритие', 'emob-acc-helmets-fullface', v_acc_helmets_id, '⛑️', 1),
    ('Half Shell Helmets', 'Полуотворени каски', 'emob-acc-helmets-half', v_acc_helmets_id, '⛑️', 2),
    ('Smart Helmets', 'Умни каски', 'emob-acc-helmets-smart', v_acc_helmets_id, '🧠', 3),
    ('Kids Helmets', 'Детски каски', 'emob-acc-helmets-kids', v_acc_helmets_id, '🧒', 4);

  -- L3 for Protection Gear
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Knee Pads', 'Наколенки', 'emob-acc-knees', v_acc_protection_id, '🦵', 1),
    ('Elbow Pads', 'Налакътници', 'emob-acc-elbows', v_acc_protection_id, '💪', 2),
    ('Wrist Guards', 'Ръкавели', 'emob-acc-wrists', v_acc_protection_id, '🤚', 3),
    ('Gloves', 'Ръкавици', 'emob-acc-gloves', v_acc_protection_id, '🧤', 4),
    ('Body Armor', 'Броня за тяло', 'emob-acc-armor', v_acc_protection_id, '🦺', 5);

  -- ============================================
  -- L2 CATEGORIES - PARTS (9)
  -- ============================================
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Batteries', 'Батерии', 'emob-parts-batteries', v_parts_id, '🔋', 1,
    'Replacement batteries for e-mobility', 'Резервни батерии за електромобилност')
  RETURNING id INTO v_parts_batteries_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Motors', 'Мотори', 'emob-parts-motors', v_parts_id, '⚙️', 2,
    'Electric motors and hub motors', 'Електрически мотори и хъб мотори')
  RETURNING id INTO v_parts_motors_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Controllers', 'Контролери', 'emob-parts-controllers', v_parts_id, '🎮', 3,
    'Motor controllers and ESCs', 'Моторни контролери и ESC')
  RETURNING id INTO v_parts_controllers_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Tires & Tubes', 'Гуми и вътрешни', 'emob-parts-tires', v_parts_id, '🛞', 4,
    'Replacement tires and inner tubes', 'Резервни гуми и вътрешни гуми')
  RETURNING id INTO v_parts_tires_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Brakes', 'Спирачки', 'emob-parts-brakes', v_parts_id, '🛑', 5,
    'Brake systems and pads', 'Спирачни системи и накладки')
  RETURNING id INTO v_parts_brakes_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Suspension', 'Окачване', 'emob-parts-suspension', v_parts_id, '🔧', 6,
    'Suspension forks and shocks', 'Вилки и амортисьори')
  RETURNING id INTO v_parts_suspension_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Handlebars & Grips', 'Кормила и грипове', 'emob-parts-handlebars', v_parts_id, '🎯', 7,
    'Handlebars, stems, and grips', 'Кормила, стемове и грипове')
  RETURNING id INTO v_parts_handlebars_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Displays & Speedometers', 'Дисплеи и скоростомери', 'emob-parts-displays', v_parts_id, '📟', 8,
    'Digital displays and speedometers', 'Дигитални дисплеи и скоростомери')
  RETURNING id INTO v_parts_displays_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Lights & Wiring', 'Светлини и окабеляване', 'emob-parts-lights', v_parts_id, '💡', 9,
    'Lighting parts and wiring harnesses', 'Части за осветление и окабеляване')
  RETURNING id INTO v_parts_lights_id;

  -- L3 for Batteries
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('E-Scooter Batteries', 'Батерии за тротинетки', 'emob-parts-batt-scooter', v_parts_batteries_id, '🛴', 1),
    ('E-Bike Batteries', 'Батерии за електровелосипеди', 'emob-parts-batt-ebike', v_parts_batteries_id, '🚲', 2),
    ('EUC Batteries', 'Батерии за моноколела', 'emob-parts-batt-euc', v_parts_batteries_id, '🎡', 3),
    ('Universal Batteries', 'Универсални батерии', 'emob-parts-batt-universal', v_parts_batteries_id, '🔋', 4);

  -- L3 for Motors
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Hub Motors', 'Хъб мотори', 'emob-parts-motors-hub', v_parts_motors_id, '⚙️', 1),
    ('Belt Drive Motors', 'Ремъчни мотори', 'emob-parts-motors-belt', v_parts_motors_id, '🔗', 2),
    ('Mid-Drive Motors', 'Среднопоставени мотори', 'emob-parts-motors-mid', v_parts_motors_id, '🔧', 3),
    ('Replacement Motors', 'Резервни мотори', 'emob-parts-motors-replacement', v_parts_motors_id, '🔄', 4);

  -- L3 for Tires
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Solid Tires', 'Плътни гуми', 'emob-parts-tires-solid', v_parts_tires_id, '⚫', 1),
    ('Pneumatic Tires', 'Пневматични гуми', 'emob-parts-tires-pneumatic', v_parts_tires_id, '⚪', 2),
    ('Off-Road Tires', 'Офроуд гуми', 'emob-parts-tires-offroad', v_parts_tires_id, '🏔️', 3),
    ('Inner Tubes', 'Вътрешни гуми', 'emob-parts-tires-tubes', v_parts_tires_id, '🔵', 4);

  -- ============================================
  -- L2 CATEGORIES - CHARGING (5)
  -- ============================================
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Home Chargers', 'Домашни зарядни', 'emob-charge-home', v_charging_id, '🏠', 1,
    'Standard home charging solutions', 'Стандартни домашни зарядни устройства')
  RETURNING id INTO v_charge_home_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Portable Chargers', 'Преносими зарядни', 'emob-charge-portable', v_charging_id, '🔌', 2,
    'Compact portable chargers', 'Компактни преносими зарядни')
  RETURNING id INTO v_charge_portable_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Fast Chargers', 'Бързи зарядни', 'emob-charge-fast', v_charging_id, '⚡', 3,
    'High-speed charging solutions', 'Високоскоростни зарядни решения')
  RETURNING id INTO v_charge_fast_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Solar Chargers', 'Соларни зарядни', 'emob-charge-solar', v_charging_id, '☀️', 4,
    'Solar-powered charging solutions', 'Соларни зарядни решения')
  RETURNING id INTO v_charge_solar_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Charging Stations', 'Зарядни станции', 'emob-charge-stations', v_charging_id, '⛽', 5,
    'Multi-device charging stations', 'Зарядни станции за много устройства')
  RETURNING id INTO v_charge_stations_id;

  -- L3 for Home Chargers
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Wall Chargers', 'Стенни зарядни', 'emob-charge-wall', v_charge_home_id, '🔌', 1),
    ('Desktop Chargers', 'Настолни зарядни', 'emob-charge-desktop', v_charge_home_id, '🖥️', 2),
    ('Multi-Port Chargers', 'Многопортови зарядни', 'emob-charge-multiport', v_charge_home_id, '🔢', 3);

  RAISE NOTICE 'E-Mobility categories created successfully!';
END;
$$;
;
