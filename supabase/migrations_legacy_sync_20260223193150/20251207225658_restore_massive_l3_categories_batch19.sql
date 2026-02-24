
-- Batch 19: More deep L3 categories - Photography, Camera accessories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Cameras & Photography - DSLR L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dslr-cameras';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Entry Level DSLR', 'DSLR начално ниво', 'entry-level-dslr', v_parent_id, 1),
      ('Mid-Range DSLR', 'DSLR средно ниво', 'mid-range-dslr', v_parent_id, 2),
      ('Professional DSLR', 'Професионални DSLR', 'professional-dslr', v_parent_id, 3),
      ('DSLR Body Only', 'DSLR само тяло', 'dslr-body-only', v_parent_id, 4),
      ('DSLR Kits', 'DSLR комплекти', 'dslr-kits', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cameras & Photography - Mirrorless L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mirrorless-cameras';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Full Frame Mirrorless', 'Пълен кадър безогледални', 'full-frame-mirrorless', v_parent_id, 1),
      ('APS-C Mirrorless', 'APS-C безогледални', 'aps-c-mirrorless', v_parent_id, 2),
      ('Micro Four Thirds', 'Микро четири трети', 'micro-four-thirds', v_parent_id, 3),
      ('Entry Mirrorless', 'Начални безогледални', 'entry-mirrorless', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Camera Lenses L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'camera-lenses';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Prime Lenses', 'Фикс обективи', 'prime-lenses', v_parent_id, 1),
      ('Zoom Lenses', 'Зум обективи', 'zoom-lenses', v_parent_id, 2),
      ('Telephoto Lenses', 'Телефото обективи', 'telephoto-lenses', v_parent_id, 3),
      ('Wide Angle Lenses', 'Широкоъгълни обективи', 'wide-angle-lenses', v_parent_id, 4),
      ('Macro Lenses', 'Макро обективи', 'macro-lenses', v_parent_id, 5),
      ('Fisheye Lenses', 'Рибешко око обективи', 'fisheye-lenses', v_parent_id, 6),
      ('Tilt-Shift Lenses', 'Тилт-шифт обективи', 'tilt-shift-lenses', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Camera Accessories L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tripods-monopods';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Travel Tripods', 'Пътни триноги', 'travel-tripods', v_parent_id, 1),
      ('Studio Tripods', 'Студийни триноги', 'studio-tripods', v_parent_id, 2),
      ('Video Tripods', 'Видео триноги', 'video-tripods', v_parent_id, 3),
      ('Monopods', 'Моноподи', 'monopods', v_parent_id, 4),
      ('Tripod Heads', 'Глави за триноги', 'tripod-heads', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'camera-bags-cases';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Camera Backpacks', 'Фото раници', 'camera-backpacks', v_parent_id, 1),
      ('Shoulder Bags', 'Чанти през рамо', 'camera-shoulder-bags', v_parent_id, 2),
      ('Hard Cases', 'Твърди куфари', 'camera-hard-cases', v_parent_id, 3),
      ('Lens Cases', 'Калъфи за обективи', 'lens-cases', v_parent_id, 4),
      ('Camera Straps', 'Каишки за фотоапарати', 'camera-straps', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'lighting-studio';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Continuous Lighting', 'Постоянно осветление', 'continuous-lighting', v_parent_id, 1),
      ('Strobe Lighting', 'Импулсно осветление', 'strobe-lighting', v_parent_id, 2),
      ('LED Panels', 'LED панели', 'led-panels', v_parent_id, 3),
      ('Light Modifiers', 'Модификатори на светлина', 'light-modifiers', v_parent_id, 4),
      ('Reflectors', 'Рефлектори', 'photo-reflectors', v_parent_id, 5),
      ('Backgrounds', 'Фонове', 'photo-backgrounds', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Drones L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'camera-drones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Consumer Drones', 'Потребителски дронове', 'consumer-drones', v_parent_id, 1),
      ('Professional Drones', 'Професионални дронове', 'professional-drones', v_parent_id, 2),
      ('Mini Drones', 'Мини дронове', 'mini-drones', v_parent_id, 3),
      ('FPV Drones', 'FPV дронове', 'fpv-drones', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'drone-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Drone Batteries', 'Батерии за дронове', 'drone-batteries', v_parent_id, 1),
      ('Drone Propellers', 'Перки за дронове', 'drone-propellers', v_parent_id, 2),
      ('Drone Cases', 'Куфари за дронове', 'drone-cases', v_parent_id, 3),
      ('Drone Filters', 'Филтри за дронове', 'drone-filters', v_parent_id, 4),
      ('Drone Chargers', 'Зарядни за дронове', 'drone-chargers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Action Cameras L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'action-cameras';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Waterproof Cameras', 'Водоустойчиви камери', 'waterproof-action-cameras', v_parent_id, 1),
      ('360 Cameras', '360 камери', '360-cameras', v_parent_id, 2),
      ('Action Cam Mounts', 'Стойки за екшън камери', 'action-cam-mounts', v_parent_id, 3),
      ('Action Cam Housings', 'Корпуси за екшън камери', 'action-cam-housings', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Video Equipment L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'camcorders';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('4K Camcorders', '4K видеокамери', '4k-camcorders', v_parent_id, 1),
      ('Professional Camcorders', 'Професионални видеокамери', 'professional-camcorders', v_parent_id, 2),
      ('Consumer Camcorders', 'Потребителски видеокамери', 'consumer-camcorders', v_parent_id, 3),
      ('Broadcast Cameras', 'Излъчващи камери', 'broadcast-cameras', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'video-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gimbals & Stabilizers', 'Гимбали и стабилизатори', 'gimbals-stabilizers', v_parent_id, 1),
      ('Video Monitors', 'Видео монитори', 'video-monitors', v_parent_id, 2),
      ('Video Cages', 'Видео кейджове', 'video-cages', v_parent_id, 3),
      ('Follow Focus Systems', 'Системи за фокус', 'follow-focus-systems', v_parent_id, 4),
      ('Matte Boxes', 'Компендиуми', 'matte-boxes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sports Equipment - Fitness L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cardio-machines';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Treadmills', 'Бягащи пътеки', 'treadmills', v_parent_id, 1),
      ('Ellipticals', 'Елиптични тренажори', 'ellipticals', v_parent_id, 2),
      ('Stationary Bikes', 'Стационарни велосипеди', 'stationary-bikes', v_parent_id, 3),
      ('Rowing Machines', 'Гребни тренажори', 'rowing-machines', v_parent_id, 4),
      ('Stair Climbers', 'Стълбищни тренажори', 'stair-climbers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'strength-training';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dumbbells', 'Дъмбели', 'dumbbells', v_parent_id, 1),
      ('Barbells', 'Щанги', 'barbells', v_parent_id, 2),
      ('Weight Plates', 'Тежести', 'weight-plates', v_parent_id, 3),
      ('Kettlebells', 'Кетълбели', 'kettlebells', v_parent_id, 4),
      ('Weight Benches', 'Лежанки за тежести', 'weight-benches', v_parent_id, 5),
      ('Power Racks', 'Силови рамки', 'power-racks', v_parent_id, 6),
      ('Cable Machines', 'Кабелни машини', 'cable-machines', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'yoga-pilates';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Yoga Mats', 'Постелки за йога', 'yoga-mats', v_parent_id, 1),
      ('Yoga Blocks', 'Блокове за йога', 'yoga-blocks', v_parent_id, 2),
      ('Yoga Straps', 'Колани за йога', 'yoga-straps', v_parent_id, 3),
      ('Pilates Rings', 'Пилатес пръстени', 'pilates-rings', v_parent_id, 4),
      ('Pilates Balls', 'Пилатес топки', 'pilates-balls', v_parent_id, 5),
      ('Foam Rollers', 'Фоум ролери', 'foam-rollers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sports Equipment - Cycling L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'road-bikes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Racing Bikes', 'Състезателни велосипеди', 'racing-bikes', v_parent_id, 1),
      ('Endurance Bikes', 'Велосипеди за издръжливост', 'endurance-bikes', v_parent_id, 2),
      ('Aero Bikes', 'Аеро велосипеди', 'aero-bikes', v_parent_id, 3),
      ('Gravel Bikes', 'Чакълови велосипеди', 'gravel-bikes', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mountain-bikes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cross Country MTB', 'Крос кънтри MTB', 'cross-country-mtb', v_parent_id, 1),
      ('Trail Bikes', 'Трейл велосипеди', 'trail-bikes', v_parent_id, 2),
      ('Enduro Bikes', 'Ендуро велосипеди', 'enduro-bikes', v_parent_id, 3),
      ('Downhill Bikes', 'Даунхил велосипеди', 'downhill-bikes', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cycling-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bike Helmets', 'Велосипедни каски', 'bike-helmets', v_parent_id, 1),
      ('Bike Lights', 'Велосипедни светлини', 'bike-lights', v_parent_id, 2),
      ('Bike Locks', 'Велосипедни заключалки', 'bike-locks', v_parent_id, 3),
      ('Bike Pumps', 'Велосипедни помпи', 'bike-pumps', v_parent_id, 4),
      ('Bike Bags', 'Велосипедни чанти', 'bike-bags', v_parent_id, 5),
      ('Cycling Computers', 'Велокомпютри', 'cycling-computers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
