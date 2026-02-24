
-- Restore L3 categories for Home & Kitchen

-- Furniture L3 (parent: a30c2687-c797-46c8-b140-b41e0f128de7)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Living Room Furniture', 'furniture-living-room', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Мебели за хол', 1),
  ('Bedroom Furniture', 'furniture-bedroom', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Мебели за спалня', 2),
  ('Dining Room Furniture', 'furniture-dining', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Мебели за трапезария', 3),
  ('Office Furniture', 'furniture-office', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Офис мебели', 4),
  ('Outdoor Furniture', 'furniture-outdoor', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Градински мебели', 5),
  ('Kids Furniture', 'furniture-kids', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Детски мебели', 6),
  ('Bathroom Furniture', 'furniture-bathroom', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Мебели за баня', 7),
  ('Entryway Furniture', 'furniture-entryway', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Мебели за антре', 8),
  ('Sofas & Couches', 'furniture-sofas', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Дивани', 9),
  ('Chairs & Recliners', 'furniture-chairs', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Столове', 10),
  ('Tables', 'furniture-tables', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Маси', 11),
  ('Beds & Mattresses', 'furniture-beds', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Легла и матраци', 12),
  ('Wardrobes & Closets', 'furniture-wardrobes', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Гардероби', 13),
  ('Shelving & Bookcases', 'furniture-shelving', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'Рафтове и етажерки', 14),
  ('TV Stands & Media', 'furniture-tv-stands', 'a30c2687-c797-46c8-b140-b41e0f128de7', 'ТВ шкафове', 15)
ON CONFLICT (slug) DO NOTHING;

-- Kitchen & Dining L3 (parent: cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Cookware', 'kitchen-cookware', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Съдове за готвене', 1),
  ('Bakeware', 'kitchen-bakeware', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Форми за печене', 2),
  ('Kitchen Appliances', 'kitchen-appliances', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Кухненски уреди', 3),
  ('Dinnerware', 'kitchen-dinnerware', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Сервизи', 4),
  ('Flatware & Cutlery', 'kitchen-flatware', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Прибори', 5),
  ('Glassware', 'kitchen-glassware', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Чаши и стъклария', 6),
  ('Kitchen Tools', 'kitchen-tools', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Кухненски инструменти', 7),
  ('Food Storage', 'kitchen-food-storage', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Съхранение на храна', 8),
  ('Kitchen Organization', 'kitchen-organization', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Организация на кухня', 9),
  ('Coffee & Tea', 'kitchen-coffee-tea', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Кафе и чай', 10),
  ('Bar Accessories', 'kitchen-bar', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Бар аксесоари', 11),
  ('Kitchen Linens', 'kitchen-linens', 'cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Кухненски текстил', 12)
ON CONFLICT (slug) DO NOTHING;

-- Bedding & Bath L3 (parent: 4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Bed Sheets', 'bedding-sheets', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Чаршафи', 1),
  ('Comforters & Duvets', 'bedding-comforters', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Завивки', 2),
  ('Blankets & Throws', 'bedding-blankets', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Одеяла', 3),
  ('Pillows', 'bedding-pillows', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Възглавници', 4),
  ('Mattress Protectors', 'bedding-protectors', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Протектори за матрак', 5),
  ('Bath Towels', 'bath-towels', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Хавлии', 6),
  ('Shower Curtains', 'bath-curtains', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Завеси за баня', 7),
  ('Bath Accessories', 'bath-accessories', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Аксесоари за баня', 8),
  ('Bath Mats', 'bath-mats', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Килимчета за баня', 9),
  ('Robes & Slippers', 'bath-robes', '4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Халати и чехли', 10)
ON CONFLICT (slug) DO NOTHING;

-- Lighting L3 (parent: 0225f17c-8b3b-4e62-b6cf-36b07f07d3ec)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Ceiling Lights', 'lighting-ceiling', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Таванни лампи', 1),
  ('Floor Lamps', 'lighting-floor', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Стоящи лампи', 2),
  ('Table Lamps', 'lighting-table', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Настолни лампи', 3),
  ('Wall Lights', 'lighting-wall', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Стенни лампи', 4),
  ('Outdoor Lighting', 'lighting-outdoor', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Външно осветление', 5),
  ('LED Lighting', 'lighting-led', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'LED осветление', 6),
  ('Smart Lighting', 'lighting-smart', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Смарт осветление', 7),
  ('Light Bulbs', 'lighting-bulbs', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Крушки', 8),
  ('Chandeliers', 'lighting-chandeliers', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Полилеи', 9),
  ('Night Lights', 'lighting-night', '0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Нощни лампи', 10)
ON CONFLICT (slug) DO NOTHING;

-- Storage & Organization L3 (parent: bc1b50d1-708a-48e6-924a-7b1c4195ec63)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Closet Organizers', 'storage-closet', 'bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Органайзери за гардероб', 1),
  ('Storage Boxes', 'storage-boxes', 'bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Кутии за съхранение', 2),
  ('Baskets & Bins', 'storage-baskets', 'bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Кошници', 3),
  ('Hooks & Hangers', 'storage-hooks', 'bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Куки и закачалки', 4),
  ('Garage Storage', 'storage-garage', 'bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Гаражно съхранение', 5),
  ('Laundry Organization', 'storage-laundry', 'bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Организация на пране', 6),
  ('Drawer Organizers', 'storage-drawers', 'bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Органайзери за чекмеджета', 7),
  ('Shoe Storage', 'storage-shoes', 'bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Съхранение на обувки', 8)
ON CONFLICT (slug) DO NOTHING;

-- Household & Cleaning L3 (parent: c888b54a-6b8c-4931-9546-493ce79d5d70)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Cleaning Supplies', 'household-cleaning', 'c888b54a-6b8c-4931-9546-493ce79d5d70', 'Почистващи препарати', 1),
  ('Vacuums', 'household-vacuums', 'c888b54a-6b8c-4931-9546-493ce79d5d70', 'Прахосмукачки', 2),
  ('Mops & Brooms', 'household-mops', 'c888b54a-6b8c-4931-9546-493ce79d5d70', 'Моп и метли', 3),
  ('Trash & Recycling', 'household-trash', 'c888b54a-6b8c-4931-9546-493ce79d5d70', 'Кофи за боклук', 4),
  ('Laundry Supplies', 'household-laundry', 'c888b54a-6b8c-4931-9546-493ce79d5d70', 'Перилни препарати', 5),
  ('Ironing', 'household-ironing', 'c888b54a-6b8c-4931-9546-493ce79d5d70', 'Ютии и гладене', 6),
  ('Air Fresheners', 'household-fresheners', 'c888b54a-6b8c-4931-9546-493ce79d5d70', 'Освежители за въздух', 7),
  ('Pest Control', 'household-pest', 'c888b54a-6b8c-4931-9546-493ce79d5d70', 'Борба с вредители', 8)
ON CONFLICT (slug) DO NOTHING;

-- Home Décor L3 (parent: 70e80536-5514-4413-bd4e-1d9573adc162)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Wall Décor', 'decor-wall', '70e80536-5514-4413-bd4e-1d9573adc162', 'Декорация за стена', 1),
  ('Vases & Bowls', 'decor-vases', '70e80536-5514-4413-bd4e-1d9573adc162', 'Вази и купи', 2),
  ('Candles & Holders', 'decor-candles', '70e80536-5514-4413-bd4e-1d9573adc162', 'Свещи и свещници', 3),
  ('Artificial Plants', 'decor-plants', '70e80536-5514-4413-bd4e-1d9573adc162', 'Изкуствени растения', 4),
  ('Picture Frames', 'decor-frames', '70e80536-5514-4413-bd4e-1d9573adc162', 'Рамки за снимки', 5),
  ('Figurines & Sculptures', 'decor-figurines', '70e80536-5514-4413-bd4e-1d9573adc162', 'Фигурки и скулптури', 6),
  ('Seasonal Décor', 'decor-seasonal', '70e80536-5514-4413-bd4e-1d9573adc162', 'Сезонна декорация', 7)
ON CONFLICT (slug) DO NOTHING;

-- Garden & Outdoor L3 (parent: 575c6e46-23ab-40b6-b948-f4215c61972b)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Patio Furniture', 'garden-patio', '575c6e46-23ab-40b6-b948-f4215c61972b', 'Градински мебели', 1),
  ('Grills & Outdoor Cooking', 'garden-grills', '575c6e46-23ab-40b6-b948-f4215c61972b', 'Барбекю', 2),
  ('Gardening Tools', 'garden-tools', '575c6e46-23ab-40b6-b948-f4215c61972b', 'Градински инструменти', 3),
  ('Plants & Seeds', 'garden-plants', '575c6e46-23ab-40b6-b948-f4215c61972b', 'Растения и семена', 4),
  ('Outdoor Décor', 'garden-decor', '575c6e46-23ab-40b6-b948-f4215c61972b', 'Външна декорация', 5),
  ('Pools & Hot Tubs', 'garden-pools', '575c6e46-23ab-40b6-b948-f4215c61972b', 'Басейни и джакузи', 6),
  ('Outdoor Lighting', 'garden-lighting', '575c6e46-23ab-40b6-b948-f4215c61972b', 'Външно осветление', 7),
  ('Lawn Care', 'garden-lawn', '575c6e46-23ab-40b6-b948-f4215c61972b', 'Грижа за тревата', 8),
  ('Planters & Pots', 'garden-planters', '575c6e46-23ab-40b6-b948-f4215c61972b', 'Саксии', 9)
ON CONFLICT (slug) DO NOTHING;
;
