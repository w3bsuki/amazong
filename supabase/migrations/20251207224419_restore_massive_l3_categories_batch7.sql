
-- Batch 7: Home & Garden deep L3 categories
DO $$
DECLARE
  v_home_id UUID;
  v_furniture_id UUID;
  v_decor_id UUID;
  v_kitchen_id UUID;
  v_bedding_id UUID;
  v_bathroom_id UUID;
  v_garden_id UUID;
  v_lighting_id UUID;
  v_storage_id UUID;
  v_appliances_id UUID;
  v_outdoor_furn_id UUID;
BEGIN
  SELECT id INTO v_home_id FROM categories WHERE slug = 'home-garden';
  SELECT id INTO v_furniture_id FROM categories WHERE slug = 'furniture';
  SELECT id INTO v_decor_id FROM categories WHERE slug = 'home-decor';
  SELECT id INTO v_kitchen_id FROM categories WHERE slug = 'kitchen-dining';
  SELECT id INTO v_bedding_id FROM categories WHERE slug = 'bedding';
  SELECT id INTO v_bathroom_id FROM categories WHERE slug = 'bathroom';
  SELECT id INTO v_garden_id FROM categories WHERE slug = 'garden-outdoor';
  SELECT id INTO v_lighting_id FROM categories WHERE slug = 'lighting';
  SELECT id INTO v_storage_id FROM categories WHERE slug = 'storage-organization';
  SELECT id INTO v_appliances_id FROM categories WHERE slug = 'home-appliances';
  SELECT id INTO v_outdoor_furn_id FROM categories WHERE slug = 'outdoor-furniture';
  
  -- Furniture deep categories
  IF v_furniture_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Living Room Furniture', 'Мебели за дневна', 'furniture-living-room', v_furniture_id, 1),
    ('Sofas', 'Дивани', 'furniture-sofas', v_furniture_id, 2),
    ('Sectional Sofas', 'Ъглови дивани', 'furniture-sofas-sectional', v_furniture_id, 3),
    ('Sleeper Sofas', 'Разтегателни дивани', 'furniture-sofas-sleeper', v_furniture_id, 4),
    ('Loveseats', 'Двуместни дивани', 'furniture-loveseats', v_furniture_id, 5),
    ('Recliners', 'Реклайнери', 'furniture-recliners', v_furniture_id, 6),
    ('Coffee Tables', 'Холни маси', 'furniture-coffee-tables', v_furniture_id, 7),
    ('End Tables', 'Странични маси', 'furniture-end-tables', v_furniture_id, 8),
    ('TV Stands', 'ТВ шкафове', 'furniture-tv-stands', v_furniture_id, 9),
    ('Entertainment Centers', 'Секции за дневна', 'furniture-entertainment-centers', v_furniture_id, 10),
    ('Bookcases', 'Библиотеки', 'furniture-bookcases', v_furniture_id, 11),
    ('Bedroom Furniture', 'Мебели за спалня', 'furniture-bedroom', v_furniture_id, 12),
    ('Beds', 'Легла', 'furniture-beds', v_furniture_id, 13),
    ('Platform Beds', 'Платформени легла', 'furniture-beds-platform', v_furniture_id, 14),
    ('Storage Beds', 'Легла с място за съхранение', 'furniture-beds-storage', v_furniture_id, 15),
    ('Bunk Beds', 'Двуетажни легла', 'furniture-bunk-beds', v_furniture_id, 16),
    ('Mattresses', 'Матраци', 'furniture-mattresses', v_furniture_id, 17),
    ('Memory Foam Mattresses', 'Мемори матраци', 'furniture-mattresses-memory', v_furniture_id, 18),
    ('Hybrid Mattresses', 'Хибридни матраци', 'furniture-mattresses-hybrid', v_furniture_id, 19),
    ('Dressers', 'Скринове', 'furniture-dressers', v_furniture_id, 20),
    ('Nightstands', 'Нощни шкафчета', 'furniture-nightstands', v_furniture_id, 21),
    ('Wardrobes', 'Гардероби', 'furniture-wardrobes', v_furniture_id, 22),
    ('Dining Room Furniture', 'Мебели за трапезария', 'furniture-dining-room', v_furniture_id, 23),
    ('Dining Tables', 'Трапезни маси', 'furniture-dining-tables', v_furniture_id, 24),
    ('Dining Chairs', 'Трапезни столове', 'furniture-dining-chairs', v_furniture_id, 25),
    ('Bar Stools', 'Бар столове', 'furniture-bar-stools', v_furniture_id, 26),
    ('Buffets & Sideboards', 'Бюфети', 'furniture-buffets', v_furniture_id, 27),
    ('Office Furniture', 'Офис мебели', 'furniture-office', v_furniture_id, 28),
    ('Office Desks', 'Офис бюра', 'furniture-office-desks', v_furniture_id, 29),
    ('Office Chairs', 'Офис столове', 'furniture-office-chairs', v_furniture_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kitchen & Dining deep categories
  IF v_kitchen_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Cookware', 'Съдове за готвене', 'kitchen-cookware', v_kitchen_id, 1),
    ('Pots & Pans Sets', 'Комплекти тенджери и тигани', 'kitchen-cookware-sets', v_kitchen_id, 2),
    ('Frying Pans', 'Тигани', 'kitchen-frying-pans', v_kitchen_id, 3),
    ('Non-Stick Pans', 'Тигани с незалепващо', 'kitchen-pans-nonstick', v_kitchen_id, 4),
    ('Cast Iron', 'Чугунени съдове', 'kitchen-cast-iron', v_kitchen_id, 5),
    ('Saucepans', 'Касероли', 'kitchen-saucepans', v_kitchen_id, 6),
    ('Dutch Ovens', 'Гювечета', 'kitchen-dutch-ovens', v_kitchen_id, 7),
    ('Woks', 'Уокове', 'kitchen-woks', v_kitchen_id, 8),
    ('Bakeware', 'Форми за печене', 'kitchen-bakeware', v_kitchen_id, 9),
    ('Baking Sheets', 'Тави за печене', 'kitchen-baking-sheets', v_kitchen_id, 10),
    ('Cake Pans', 'Форми за торти', 'kitchen-cake-pans', v_kitchen_id, 11),
    ('Muffin Pans', 'Форми за мъфини', 'kitchen-muffin-pans', v_kitchen_id, 12),
    ('Cutlery', 'Прибори за хранене', 'kitchen-cutlery', v_kitchen_id, 13),
    ('Knives', 'Ножове', 'kitchen-knives', v_kitchen_id, 14),
    ('Chef Knives', 'Готварски ножове', 'kitchen-knives-chef', v_kitchen_id, 15),
    ('Knife Sets', 'Комплекти ножове', 'kitchen-knife-sets', v_kitchen_id, 16),
    ('Cutting Boards', 'Дъски за рязане', 'kitchen-cutting-boards', v_kitchen_id, 17),
    ('Kitchen Utensils', 'Кухненски прибори', 'kitchen-utensils', v_kitchen_id, 18),
    ('Spatulas', 'Шпатули', 'kitchen-spatulas', v_kitchen_id, 19),
    ('Whisks', 'Бъркалки', 'kitchen-whisks', v_kitchen_id, 20),
    ('Ladles', 'Черпаци', 'kitchen-ladles', v_kitchen_id, 21),
    ('Dinnerware', 'Сервизи', 'kitchen-dinnerware', v_kitchen_id, 22),
    ('Plates', 'Чинии', 'kitchen-plates', v_kitchen_id, 23),
    ('Bowls', 'Купи', 'kitchen-bowls', v_kitchen_id, 24),
    ('Mugs', 'Чаши', 'kitchen-mugs', v_kitchen_id, 25),
    ('Glassware', 'Стъклени изделия', 'kitchen-glassware', v_kitchen_id, 26),
    ('Wine Glasses', 'Чаши за вино', 'kitchen-wine-glasses', v_kitchen_id, 27),
    ('Food Storage', 'Съхранение на храна', 'kitchen-food-storage', v_kitchen_id, 28),
    ('Containers', 'Контейнери', 'kitchen-containers', v_kitchen_id, 29),
    ('Water Bottles', 'Бутилки за вода', 'kitchen-water-bottles', v_kitchen_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bedding deep categories
  IF v_bedding_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bed Sheets', 'Чаршафи', 'bedding-sheets', v_bedding_id, 1),
    ('Cotton Sheets', 'Памучни чаршафи', 'bedding-sheets-cotton', v_bedding_id, 2),
    ('Linen Sheets', 'Ленени чаршафи', 'bedding-sheets-linen', v_bedding_id, 3),
    ('Fitted Sheets', 'Чаршафи с ластик', 'bedding-sheets-fitted', v_bedding_id, 4),
    ('Comforters', 'Юргани', 'bedding-comforters', v_bedding_id, 5),
    ('Down Comforters', 'Пухени юргани', 'bedding-comforters-down', v_bedding_id, 6),
    ('Duvet Covers', 'Калъфки за юргани', 'bedding-duvet-covers', v_bedding_id, 7),
    ('Blankets', 'Одеяла', 'bedding-blankets', v_bedding_id, 8),
    ('Fleece Blankets', 'Флийс одеяла', 'bedding-blankets-fleece', v_bedding_id, 9),
    ('Weighted Blankets', 'Тежки одеяла', 'bedding-blankets-weighted', v_bedding_id, 10),
    ('Pillows', 'Възглавници', 'bedding-pillows', v_bedding_id, 11),
    ('Memory Foam Pillows', 'Мемори възглавници', 'bedding-pillows-memory', v_bedding_id, 12),
    ('Down Pillows', 'Пухени възглавници', 'bedding-pillows-down', v_bedding_id, 13),
    ('Body Pillows', 'Дълги възглавници', 'bedding-pillows-body', v_bedding_id, 14),
    ('Pillow Cases', 'Калъфки за възглавници', 'bedding-pillowcases', v_bedding_id, 15),
    ('Bed Skirts', 'Поли за легла', 'bedding-bed-skirts', v_bedding_id, 16),
    ('Mattress Pads', 'Протектори за матрак', 'bedding-mattress-pads', v_bedding_id, 17),
    ('Mattress Toppers', 'Топери за матрак', 'bedding-mattress-toppers', v_bedding_id, 18),
    ('Quilts', 'Кувертюри', 'bedding-quilts', v_bedding_id, 19),
    ('Throw Pillows', 'Декоративни възглавници', 'bedding-throw-pillows', v_bedding_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bathroom deep categories
  IF v_bathroom_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bath Towels', 'Хавлии за баня', 'bathroom-towels', v_bathroom_id, 1),
    ('Hand Towels', 'Хавлии за ръце', 'bathroom-hand-towels', v_bathroom_id, 2),
    ('Towel Sets', 'Комплекти хавлии', 'bathroom-towel-sets', v_bathroom_id, 3),
    ('Bath Mats', 'Постелки за баня', 'bathroom-mats', v_bathroom_id, 4),
    ('Shower Curtains', 'Завеси за душ', 'bathroom-shower-curtains', v_bathroom_id, 5),
    ('Bathroom Accessories', 'Аксесоари за баня', 'bathroom-accessories', v_bathroom_id, 6),
    ('Soap Dispensers', 'Дозатори за сапун', 'bathroom-soap-dispensers', v_bathroom_id, 7),
    ('Toothbrush Holders', 'Поставки за четки', 'bathroom-toothbrush-holders', v_bathroom_id, 8),
    ('Bathroom Mirrors', 'Огледала за баня', 'bathroom-mirrors', v_bathroom_id, 9),
    ('Bathroom Storage', 'Съхранение за баня', 'bathroom-storage', v_bathroom_id, 10),
    ('Medicine Cabinets', 'Шкафчета за лекарства', 'bathroom-medicine-cabinets', v_bathroom_id, 11),
    ('Shower Caddies', 'Поставки за душ', 'bathroom-shower-caddies', v_bathroom_id, 12),
    ('Toilet Accessories', 'Тоалетни аксесоари', 'bathroom-toilet-accessories', v_bathroom_id, 13),
    ('Toilet Brush Sets', 'Комплекти четки за тоалетна', 'bathroom-toilet-brushes', v_bathroom_id, 14),
    ('Trash Cans', 'Кошчета за отпадъци', 'bathroom-trash-cans', v_bathroom_id, 15),
    ('Robes', 'Халати', 'bathroom-robes', v_bathroom_id, 16),
    ('Bath Rugs', 'Килимчета за баня', 'bathroom-rugs', v_bathroom_id, 17),
    ('Scales', 'Кантари', 'bathroom-scales', v_bathroom_id, 18),
    ('Digital Scales', 'Дигитални кантари', 'bathroom-scales-digital', v_bathroom_id, 19),
    ('Bathroom Furniture', 'Мебели за баня', 'bathroom-furniture', v_bathroom_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Garden & Outdoor deep categories
  IF v_garden_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Garden Tools', 'Градински инструменти', 'garden-tools', v_garden_id, 1),
    ('Hand Tools', 'Ръчни инструменти', 'garden-hand-tools', v_garden_id, 2),
    ('Shovels', 'Лопати', 'garden-shovels', v_garden_id, 3),
    ('Rakes', 'Гребла', 'garden-rakes', v_garden_id, 4),
    ('Pruning Shears', 'Градинарски ножици', 'garden-pruning-shears', v_garden_id, 5),
    ('Lawn Mowers', 'Косачки', 'garden-lawn-mowers', v_garden_id, 6),
    ('Electric Mowers', 'Електрически косачки', 'garden-mowers-electric', v_garden_id, 7),
    ('Gas Mowers', 'Бензинови косачки', 'garden-mowers-gas', v_garden_id, 8),
    ('Robotic Mowers', 'Роботизирани косачки', 'garden-mowers-robotic', v_garden_id, 9),
    ('String Trimmers', 'Тримери', 'garden-trimmers', v_garden_id, 10),
    ('Leaf Blowers', 'Духалки за листа', 'garden-leaf-blowers', v_garden_id, 11),
    ('Chainsaws', 'Моторни триони', 'garden-chainsaws', v_garden_id, 12),
    ('Hedge Trimmers', 'Храсторези', 'garden-hedge-trimmers', v_garden_id, 13),
    ('Watering', 'Поливане', 'garden-watering', v_garden_id, 14),
    ('Garden Hoses', 'Градински маркучи', 'garden-hoses', v_garden_id, 15),
    ('Sprinklers', 'Разпръсквачи', 'garden-sprinklers', v_garden_id, 16),
    ('Watering Cans', 'Лейки', 'garden-watering-cans', v_garden_id, 17),
    ('Drip Irrigation', 'Капково напояване', 'garden-drip-irrigation', v_garden_id, 18),
    ('Planters', 'Саксии', 'garden-planters', v_garden_id, 19),
    ('Ceramic Planters', 'Керамични саксии', 'garden-planters-ceramic', v_garden_id, 20),
    ('Hanging Planters', 'Висящи саксии', 'garden-planters-hanging', v_garden_id, 21),
    ('Seeds', 'Семена', 'garden-seeds', v_garden_id, 22),
    ('Vegetable Seeds', 'Зеленчукови семена', 'garden-seeds-vegetable', v_garden_id, 23),
    ('Flower Seeds', 'Цветни семена', 'garden-seeds-flower', v_garden_id, 24),
    ('Soil & Fertilizers', 'Почви и торове', 'garden-soil-fertilizers', v_garden_id, 25),
    ('Potting Soil', 'Пръст за саксии', 'garden-potting-soil', v_garden_id, 26),
    ('Compost', 'Компост', 'garden-compost', v_garden_id, 27),
    ('Greenhouses', 'Оранжерии', 'garden-greenhouses', v_garden_id, 28),
    ('Garden Decor', 'Градинска декорация', 'garden-decor', v_garden_id, 29),
    ('Garden Furniture', 'Градински мебели', 'garden-furniture', v_garden_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Home Decor deep categories
  IF v_decor_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Wall Art', 'Стенно изкуство', 'decor-wall-art', v_decor_id, 1),
    ('Canvas Prints', 'Принтове на платно', 'decor-canvas-prints', v_decor_id, 2),
    ('Framed Art', 'Картини с рамка', 'decor-framed-art', v_decor_id, 3),
    ('Wall Decals', 'Стикери за стена', 'decor-wall-decals', v_decor_id, 4),
    ('Mirrors', 'Огледала', 'decor-mirrors', v_decor_id, 5),
    ('Wall Mirrors', 'Стенни огледала', 'decor-wall-mirrors', v_decor_id, 6),
    ('Floor Mirrors', 'Подови огледала', 'decor-floor-mirrors', v_decor_id, 7),
    ('Clocks', 'Часовници', 'decor-clocks', v_decor_id, 8),
    ('Wall Clocks', 'Стенни часовници', 'decor-wall-clocks', v_decor_id, 9),
    ('Alarm Clocks', 'Будилници', 'decor-alarm-clocks', v_decor_id, 10),
    ('Vases', 'Вази', 'decor-vases', v_decor_id, 11),
    ('Glass Vases', 'Стъклени вази', 'decor-vases-glass', v_decor_id, 12),
    ('Ceramic Vases', 'Керамични вази', 'decor-vases-ceramic', v_decor_id, 13),
    ('Candles', 'Свещи', 'decor-candles', v_decor_id, 14),
    ('Scented Candles', 'Ароматни свещи', 'decor-candles-scented', v_decor_id, 15),
    ('Candle Holders', 'Свещници', 'decor-candle-holders', v_decor_id, 16),
    ('Picture Frames', 'Рамки за снимки', 'decor-picture-frames', v_decor_id, 17),
    ('Throw Blankets', 'Декоративни одеяла', 'decor-throw-blankets', v_decor_id, 18),
    ('Decorative Pillows', 'Декоративни възглавници', 'decor-decorative-pillows', v_decor_id, 19),
    ('Rugs', 'Килими', 'decor-rugs', v_decor_id, 20),
    ('Area Rugs', 'Килими за стая', 'decor-area-rugs', v_decor_id, 21),
    ('Runner Rugs', 'Пътеки', 'decor-runner-rugs', v_decor_id, 22),
    ('Curtains', 'Пердета', 'decor-curtains', v_decor_id, 23),
    ('Blackout Curtains', 'Затъмняващи пердета', 'decor-curtains-blackout', v_decor_id, 24),
    ('Sheer Curtains', 'Прозрачни пердета', 'decor-curtains-sheer', v_decor_id, 25),
    ('Artificial Plants', 'Изкуствени растения', 'decor-artificial-plants', v_decor_id, 26),
    ('Artificial Flowers', 'Изкуствени цветя', 'decor-artificial-flowers', v_decor_id, 27),
    ('Figurines', 'Фигурки', 'decor-figurines', v_decor_id, 28),
    ('Sculptures', 'Скулптури', 'decor-sculptures', v_decor_id, 29),
    ('Home Fragrance', 'Домашни аромати', 'decor-home-fragrance', v_decor_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Lighting deep categories
  IF v_lighting_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Ceiling Lights', 'Таванни лампи', 'lighting-ceiling', v_lighting_id, 1),
    ('Chandeliers', 'Полилеи', 'lighting-chandeliers', v_lighting_id, 2),
    ('Pendant Lights', 'Висящи лампи', 'lighting-pendant', v_lighting_id, 3),
    ('Flush Mounts', 'Плафони', 'lighting-flush-mounts', v_lighting_id, 4),
    ('Table Lamps', 'Настолни лампи', 'lighting-table-lamps', v_lighting_id, 5),
    ('Desk Lamps', 'Бюро лампи', 'lighting-desk-lamps', v_lighting_id, 6),
    ('Bedside Lamps', 'Нощни лампи', 'lighting-bedside-lamps', v_lighting_id, 7),
    ('Floor Lamps', 'Подови лампи', 'lighting-floor-lamps', v_lighting_id, 8),
    ('Arc Floor Lamps', 'Дъгови подови лампи', 'lighting-floor-lamps-arc', v_lighting_id, 9),
    ('Torchiere Lamps', 'Факелни лампи', 'lighting-torchiere', v_lighting_id, 10),
    ('Wall Sconces', 'Стенни лампи', 'lighting-wall-sconces', v_lighting_id, 11),
    ('Outdoor Lighting', 'Външно осветление', 'lighting-outdoor', v_lighting_id, 12),
    ('Path Lights', 'Алейни светлини', 'lighting-path-lights', v_lighting_id, 13),
    ('Solar Lights', 'Соларни светлини', 'lighting-solar', v_lighting_id, 14),
    ('String Lights', 'Лампички', 'lighting-string-lights', v_lighting_id, 15),
    ('LED Strips', 'LED ленти', 'lighting-led-strips', v_lighting_id, 16),
    ('Smart Lighting', 'Смарт осветление', 'lighting-smart', v_lighting_id, 17),
    ('Smart Bulbs', 'Смарт крушки', 'lighting-smart-bulbs', v_lighting_id, 18),
    ('Light Bulbs', 'Крушки', 'lighting-bulbs', v_lighting_id, 19),
    ('LED Bulbs', 'LED крушки', 'lighting-led-bulbs', v_lighting_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
