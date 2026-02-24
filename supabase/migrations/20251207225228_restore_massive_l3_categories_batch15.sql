
-- Batch 15: More Home (Appliances, Cleaning), Art Supplies, Industrial deep categories
DO $$
DECLARE
  v_appliances_id UUID;
  v_kitchen_app_id UUID;
  v_laundry_id UUID;
  v_cleaning_id UUID;
  v_heating_id UUID;
  v_art_supplies_id UUID;
  v_painting_id UUID;
  v_drawing_id UUID;
  v_industrial_id UUID;
  v_safety_id UUID;
  v_fasteners_id UUID;
  v_electrical_ind_id UUID;
  v_plumbing_ind_id UUID;
BEGIN
  SELECT id INTO v_appliances_id FROM categories WHERE slug = 'home-appliances';
  SELECT id INTO v_kitchen_app_id FROM categories WHERE slug = 'kitchen-appliances';
  SELECT id INTO v_laundry_id FROM categories WHERE slug = 'laundry-appliances';
  SELECT id INTO v_cleaning_id FROM categories WHERE slug = 'cleaning-supplies';
  SELECT id INTO v_heating_id FROM categories WHERE slug = 'heating-cooling';
  SELECT id INTO v_art_supplies_id FROM categories WHERE slug = 'art-supplies';
  SELECT id INTO v_painting_id FROM categories WHERE slug = 'painting-supplies';
  SELECT id INTO v_drawing_id FROM categories WHERE slug = 'drawing-supplies';
  SELECT id INTO v_industrial_id FROM categories WHERE slug = 'industrial-scientific';
  SELECT id INTO v_safety_id FROM categories WHERE slug = 'safety-equipment';
  SELECT id INTO v_fasteners_id FROM categories WHERE slug = 'fasteners-hardware';
  SELECT id INTO v_electrical_ind_id FROM categories WHERE slug = 'electrical-supplies';
  SELECT id INTO v_plumbing_ind_id FROM categories WHERE slug = 'plumbing-supplies';
  
  -- Kitchen Appliances deep categories
  IF v_kitchen_app_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Coffee Makers', 'Кафемашини', 'appliances-coffee-makers', v_kitchen_app_id, 1),
    ('Espresso Machines', 'Еспресо машини', 'appliances-espresso', v_kitchen_app_id, 2),
    ('Drip Coffee Makers', 'Шварц машини', 'appliances-drip-coffee', v_kitchen_app_id, 3),
    ('French Press', 'Преса за кафе', 'appliances-french-press', v_kitchen_app_id, 4),
    ('Blenders', 'Блендери', 'appliances-blenders', v_kitchen_app_id, 5),
    ('Countertop Blenders', 'Настолни блендери', 'appliances-blenders-countertop', v_kitchen_app_id, 6),
    ('Immersion Blenders', 'Пасатори', 'appliances-blenders-immersion', v_kitchen_app_id, 7),
    ('Food Processors', 'Кухненски роботи', 'appliances-food-processors', v_kitchen_app_id, 8),
    ('Mixers', 'Миксери', 'appliances-mixers', v_kitchen_app_id, 9),
    ('Stand Mixers', 'Планетарни миксери', 'appliances-mixers-stand', v_kitchen_app_id, 10),
    ('Hand Mixers', 'Ръчни миксери', 'appliances-mixers-hand', v_kitchen_app_id, 11),
    ('Toasters', 'Тостери', 'appliances-toasters', v_kitchen_app_id, 12),
    ('Toaster Ovens', 'Мини фурни', 'appliances-toaster-ovens', v_kitchen_app_id, 13),
    ('Microwaves', 'Микровълнови фурни', 'appliances-microwaves', v_kitchen_app_id, 14),
    ('Air Fryers', 'Въздушни фритюрници', 'appliances-air-fryers', v_kitchen_app_id, 15),
    ('Instant Pots', 'Мултикукъри', 'appliances-instant-pots', v_kitchen_app_id, 16),
    ('Slow Cookers', 'Бавни готварски съдове', 'appliances-slow-cookers', v_kitchen_app_id, 17),
    ('Rice Cookers', 'Уреди за ориз', 'appliances-rice-cookers', v_kitchen_app_id, 18),
    ('Electric Kettles', 'Електрически кани', 'appliances-kettles', v_kitchen_app_id, 19),
    ('Juicers', 'Сокоизстисквачки', 'appliances-juicers', v_kitchen_app_id, 20),
    ('Dishwashers', 'Съдомиялни', 'appliances-dishwashers', v_kitchen_app_id, 21),
    ('Refrigerators', 'Хладилници', 'appliances-refrigerators', v_kitchen_app_id, 22),
    ('Freezers', 'Фризери', 'appliances-freezers', v_kitchen_app_id, 23),
    ('Ranges', 'Печки', 'appliances-ranges', v_kitchen_app_id, 24),
    ('Ovens', 'Фурни', 'appliances-ovens', v_kitchen_app_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Laundry Appliances deep categories
  IF v_laundry_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Washing Machines', 'Перални машини', 'laundry-washers', v_laundry_id, 1),
    ('Front Load Washers', 'Перални с предно зареждане', 'laundry-washers-front', v_laundry_id, 2),
    ('Top Load Washers', 'Перални с горно зареждане', 'laundry-washers-top', v_laundry_id, 3),
    ('Portable Washers', 'Преносими перални', 'laundry-washers-portable', v_laundry_id, 4),
    ('Dryers', 'Сушилни', 'laundry-dryers', v_laundry_id, 5),
    ('Electric Dryers', 'Електрически сушилни', 'laundry-dryers-electric', v_laundry_id, 6),
    ('Gas Dryers', 'Газови сушилни', 'laundry-dryers-gas', v_laundry_id, 7),
    ('Washer-Dryer Combos', 'Комбинирани перални', 'laundry-combos', v_laundry_id, 8),
    ('Irons', 'Ютии', 'laundry-irons', v_laundry_id, 9),
    ('Steam Irons', 'Парни ютии', 'laundry-irons-steam', v_laundry_id, 10),
    ('Garment Steamers', 'Парогенератори', 'laundry-steamers', v_laundry_id, 11),
    ('Ironing Boards', 'Дъски за гладене', 'laundry-ironing-boards', v_laundry_id, 12),
    ('Laundry Baskets', 'Кошове за пране', 'laundry-baskets', v_laundry_id, 13),
    ('Drying Racks', 'Сушилници', 'laundry-drying-racks', v_laundry_id, 14),
    ('Laundry Bags', 'Торби за пране', 'laundry-bags', v_laundry_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cleaning Supplies deep categories
  IF v_cleaning_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Vacuum Cleaners', 'Прахосмукачки', 'cleaning-vacuums', v_cleaning_id, 1),
    ('Upright Vacuums', 'Вертикални прахосмукачки', 'cleaning-vacuums-upright', v_cleaning_id, 2),
    ('Canister Vacuums', 'Прахосмукачки с контейнер', 'cleaning-vacuums-canister', v_cleaning_id, 3),
    ('Stick Vacuums', 'Стик прахосмукачки', 'cleaning-vacuums-stick', v_cleaning_id, 4),
    ('Handheld Vacuums', 'Ръчни прахосмукачки', 'cleaning-vacuums-handheld', v_cleaning_id, 5),
    ('Robot Vacuums', 'Роботи прахосмукачки', 'cleaning-vacuums-robot', v_cleaning_id, 6),
    ('Mops', 'Подочистачки', 'cleaning-mops', v_cleaning_id, 7),
    ('Spin Mops', 'Въртящи се подочистачки', 'cleaning-mops-spin', v_cleaning_id, 8),
    ('Steam Mops', 'Парни подочистачки', 'cleaning-mops-steam', v_cleaning_id, 9),
    ('Brooms', 'Метли', 'cleaning-brooms', v_cleaning_id, 10),
    ('Dustpans', 'Лопатки за боклук', 'cleaning-dustpans', v_cleaning_id, 11),
    ('Cleaning Solutions', 'Почистващи препарати', 'cleaning-solutions', v_cleaning_id, 12),
    ('All-Purpose Cleaners', 'Универсални препарати', 'cleaning-all-purpose', v_cleaning_id, 13),
    ('Glass Cleaners', 'Препарати за стъкла', 'cleaning-glass', v_cleaning_id, 14),
    ('Floor Cleaners', 'Препарати за под', 'cleaning-floor', v_cleaning_id, 15),
    ('Disinfectants', 'Дезинфектанти', 'cleaning-disinfectants', v_cleaning_id, 16),
    ('Sponges', 'Гъби', 'cleaning-sponges', v_cleaning_id, 17),
    ('Cleaning Cloths', 'Кърпи за почистване', 'cleaning-cloths', v_cleaning_id, 18),
    ('Microfiber Cloths', 'Микрофибърни кърпи', 'cleaning-cloths-microfiber', v_cleaning_id, 19),
    ('Trash Bags', 'Торби за боклук', 'cleaning-trash-bags', v_cleaning_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Heating & Cooling deep categories
  IF v_heating_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Air Conditioners', 'Климатици', 'heating-ac', v_heating_id, 1),
    ('Window AC', 'Прозоречни климатици', 'heating-ac-window', v_heating_id, 2),
    ('Portable AC', 'Преносими климатици', 'heating-ac-portable', v_heating_id, 3),
    ('Split AC', 'Сплит системи', 'heating-ac-split', v_heating_id, 4),
    ('Fans', 'Вентилатори', 'heating-fans', v_heating_id, 5),
    ('Tower Fans', 'Колонни вентилатори', 'heating-fans-tower', v_heating_id, 6),
    ('Ceiling Fans', 'Таванни вентилатори', 'heating-fans-ceiling', v_heating_id, 7),
    ('Pedestal Fans', 'Вентилатори на стойка', 'heating-fans-pedestal', v_heating_id, 8),
    ('Space Heaters', 'Преносими отоплители', 'heating-space-heaters', v_heating_id, 9),
    ('Electric Heaters', 'Електрически отоплители', 'heating-heaters-electric', v_heating_id, 10),
    ('Oil Heaters', 'Маслени радиатори', 'heating-heaters-oil', v_heating_id, 11),
    ('Infrared Heaters', 'Инфрачервени отоплители', 'heating-heaters-infrared', v_heating_id, 12),
    ('Dehumidifiers', 'Влагоуловители', 'heating-dehumidifiers', v_heating_id, 13),
    ('Humidifiers', 'Овлажнители', 'heating-humidifiers', v_heating_id, 14),
    ('Air Purifiers', 'Пречистватели за въздух', 'heating-air-purifiers', v_heating_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Art Supplies - Painting deep categories
  IF v_painting_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Acrylic Paints', 'Акрилни бои', 'art-acrylic', v_painting_id, 1),
    ('Acrylic Sets', 'Комплекти акрилни бои', 'art-acrylic-sets', v_painting_id, 2),
    ('Oil Paints', 'Маслени бои', 'art-oil', v_painting_id, 3),
    ('Oil Paint Sets', 'Комплекти маслени бои', 'art-oil-sets', v_painting_id, 4),
    ('Watercolors', 'Акварели', 'art-watercolors', v_painting_id, 5),
    ('Watercolor Sets', 'Комплекти акварели', 'art-watercolor-sets', v_painting_id, 6),
    ('Gouache', 'Гваш', 'art-gouache', v_painting_id, 7),
    ('Paint Brushes', 'Четки за рисуване', 'art-brushes', v_painting_id, 8),
    ('Brush Sets', 'Комплекти четки', 'art-brush-sets', v_painting_id, 9),
    ('Canvases', 'Платна', 'art-canvases', v_painting_id, 10),
    ('Stretched Canvases', 'Натегнати платна', 'art-canvases-stretched', v_painting_id, 11),
    ('Canvas Panels', 'Платнени панели', 'art-canvas-panels', v_painting_id, 12),
    ('Easels', 'Статив', 'art-easels', v_painting_id, 13),
    ('Table Easels', 'Настолни статив', 'art-easels-table', v_painting_id, 14),
    ('Palettes', 'Палитри', 'art-palettes', v_painting_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Art Supplies - Drawing deep categories
  IF v_drawing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Pencils', 'Моливи', 'art-pencils', v_drawing_id, 1),
    ('Graphite Pencils', 'Графитни моливи', 'art-pencils-graphite', v_drawing_id, 2),
    ('Colored Pencils', 'Цветни моливи', 'art-pencils-colored', v_drawing_id, 3),
    ('Charcoal', 'Въглен', 'art-charcoal', v_drawing_id, 4),
    ('Pastels', 'Пастели', 'art-pastels', v_drawing_id, 5),
    ('Oil Pastels', 'Маслени пастели', 'art-pastels-oil', v_drawing_id, 6),
    ('Chalk Pastels', 'Тебеширени пастели', 'art-pastels-chalk', v_drawing_id, 7),
    ('Markers', 'Маркери', 'art-markers', v_drawing_id, 8),
    ('Alcohol Markers', 'Алкохолни маркери', 'art-markers-alcohol', v_drawing_id, 9),
    ('Brush Pens', 'Четка-писалки', 'art-brush-pens', v_drawing_id, 10),
    ('Sketch Pads', 'Скицници', 'art-sketch-pads', v_drawing_id, 11),
    ('Drawing Paper', 'Хартия за рисуване', 'art-drawing-paper', v_drawing_id, 12),
    ('Erasers', 'Гуми', 'art-erasers', v_drawing_id, 13),
    ('Kneaded Erasers', 'Меки гуми', 'art-erasers-kneaded', v_drawing_id, 14),
    ('Blending Stumps', 'Стикове за размазване', 'art-blending-stumps', v_drawing_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Industrial - Safety Equipment deep categories
  IF v_safety_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Safety Glasses', 'Предпазни очила', 'safety-glasses', v_safety_id, 1),
    ('Safety Goggles', 'Защитни очила', 'safety-goggles', v_safety_id, 2),
    ('Face Shields', 'Щитове за лице', 'safety-face-shields', v_safety_id, 3),
    ('Hard Hats', 'Каски', 'safety-hard-hats', v_safety_id, 4),
    ('Safety Helmets', 'Предпазни каски', 'safety-helmets', v_safety_id, 5),
    ('Work Gloves', 'Работни ръкавици', 'safety-work-gloves', v_safety_id, 6),
    ('Cut Resistant Gloves', 'Устойчиви на срязване', 'safety-gloves-cut', v_safety_id, 7),
    ('Chemical Gloves', 'Химически устойчиви', 'safety-gloves-chemical', v_safety_id, 8),
    ('Ear Protection', 'Защита за уши', 'safety-ear-protection', v_safety_id, 9),
    ('Earplugs', 'Тапи за уши', 'safety-earplugs', v_safety_id, 10),
    ('Earmuffs', 'Антифони', 'safety-earmuffs', v_safety_id, 11),
    ('Respirators', 'Респиратори', 'safety-respirators', v_safety_id, 12),
    ('Dust Masks', 'Маски против прах', 'safety-dust-masks', v_safety_id, 13),
    ('Safety Vests', 'Светлоотразителни жилетки', 'safety-vests', v_safety_id, 14),
    ('Safety Boots', 'Работни обувки', 'safety-boots', v_safety_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
