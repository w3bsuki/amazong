-- PETS PHASE 3: Add L3 categories for remaining Dog L2 categories
-- Dog Clothing ID: 96d68d18-69c2-4faa-88bc-00429e857d11
-- Dog Health ID: 19698de0-0656-43bd-89e1-7d74d8655a66
-- Dog Training ID: d0982d23-27da-4cbc-9cd9-e6ff3a5ba9bf
-- Dog Bowls ID: c062ef88-869c-462a-ae50-fea382643692

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  -- Dog Clothing L3
  ('Dog Sweaters & Hoodies', 'Пуловери и суитшърти', 'dog-clothing-sweaters', '96d68d18-69c2-4faa-88bc-00429e857d11', NULL, 1, 'Sweaters, hoodies, and knits', 'Пуловери, суитшърти и плетени дрехи'),
  ('Dog Coats & Jackets', 'Палта и якета', 'dog-clothing-coats', '96d68d18-69c2-4faa-88bc-00429e857d11', NULL, 2, 'Winter coats and rain jackets', 'Зимни палта и дъждобрани'),
  ('Dog Boots & Shoes', 'Ботуши и обувки', 'dog-clothing-boots', '96d68d18-69c2-4faa-88bc-00429e857d11', NULL, 3, 'Protective footwear', 'Защитни обувки'),
  ('Dog Costumes', 'Костюми за кучета', 'dog-clothing-costumes', '96d68d18-69c2-4faa-88bc-00429e857d11', NULL, 4, 'Halloween and holiday costumes', 'Костюми за Хелоуин и празници'),
  ('Dog Bandanas & Bows', 'Бандани и панделки', 'dog-clothing-bandanas', '96d68d18-69c2-4faa-88bc-00429e857d11', NULL, 5, 'Bandanas, bows, and ties', 'Бандани, панделки и папийонки'),
  ('Dog Life Jackets', 'Спасителни жилетки', 'dog-clothing-life-jackets', '96d68d18-69c2-4faa-88bc-00429e857d11', NULL, 6, 'Swimming and water safety vests', 'Жилетки за плуване и водна безопасност'),
  
  -- Dog Health L3
  ('Dog Vitamins & Supplements', 'Витамини и добавки', 'dog-health-vitamins', '19698de0-0656-43bd-89e1-7d74d8655a66', NULL, 1, 'Multivitamins and supplements', 'Мултивитамини и добавки'),
  ('Dog Hip & Joint Support', 'Подкрепа за стави', 'dog-health-joints', '19698de0-0656-43bd-89e1-7d74d8655a66', NULL, 2, 'Joint supplements and glucosamine', 'Добавки за стави и глюкозамин'),
  ('Dog Skin & Coat Health', 'Здраве на кожата и козината', 'dog-health-skin', '19698de0-0656-43bd-89e1-7d74d8655a66', NULL, 3, 'Omega fatty acids and skin support', 'Омега мастни киселини и грижа за кожата'),
  ('Dog Digestive Health', 'Храносмилателно здраве', 'dog-health-digestive', '19698de0-0656-43bd-89e1-7d74d8655a66', NULL, 4, 'Probiotics and digestive enzymes', 'Пробиотици и храносмилателни ензими'),
  ('Dog Calming & Anxiety', 'Успокояващи продукти', 'dog-health-calming', '19698de0-0656-43bd-89e1-7d74d8655a66', NULL, 5, 'Calming aids and anxiety relief', 'Успокояващи средства и облекчаване на тревожност'),
  ('Dog Flea & Tick', 'Противопаразитни продукти', 'dog-health-flea-tick', '19698de0-0656-43bd-89e1-7d74d8655a66', NULL, 6, 'Flea and tick prevention', 'Защита от бълхи и кърлежи'),
  ('Dog First Aid', 'Първа помощ', 'dog-health-first-aid', '19698de0-0656-43bd-89e1-7d74d8655a66', NULL, 7, 'First aid supplies and wound care', 'Продукти за първа помощ и грижа за рани'),
  
  -- Dog Training L3
  ('Dog Clickers & Whistles', 'Кликери и свирки', 'dog-training-clickers', 'd0982d23-27da-4cbc-9cd9-e6ff3a5ba9bf', NULL, 1, 'Training clickers and whistles', 'Кликери и свирки за обучение'),
  ('Dog Training Treats', 'Лакомства за обучение', 'dog-training-treats', 'd0982d23-27da-4cbc-9cd9-e6ff3a5ba9bf', NULL, 2, 'High-value training treats', 'Лакомства за обучение'),
  ('Dog Training Pads', 'Подложки за обучение', 'dog-training-pads', 'd0982d23-27da-4cbc-9cd9-e6ff3a5ba9bf', NULL, 3, 'Potty pads and training pads', 'Хигиенни подложки за обучение'),
  ('Dog Bark Control', 'Контрол на лаенето', 'dog-training-bark', 'd0982d23-27da-4cbc-9cd9-e6ff3a5ba9bf', NULL, 4, 'Anti-bark devices and training', 'Устройства против лаене'),
  ('Dog Muzzles', 'Намордници', 'dog-training-muzzles', 'd0982d23-27da-4cbc-9cd9-e6ff3a5ba9bf', NULL, 5, 'Basket and soft muzzles', 'Кошникови и меки намордници'),
  ('Dog Agility Equipment', 'Оборудване за аджилити', 'dog-training-agility', 'd0982d23-27da-4cbc-9cd9-e6ff3a5ba9bf', NULL, 6, 'Agility tunnels, jumps, and courses', 'Тунели, препятствия и курсове за аджилити'),
  
  -- Dog Bowls L3
  ('Elevated Dog Bowls', 'Повдигнати купи', 'dog-bowls-elevated', 'c062ef88-869c-462a-ae50-fea382643692', NULL, 1, 'Raised feeding stations', 'Повдигнати станции за хранене'),
  ('Slow Feeder Dog Bowls', 'Бавни хранилки', 'dog-bowls-slow', 'c062ef88-869c-462a-ae50-fea382643692', NULL, 2, 'Slow feed and puzzle bowls', 'Бавни хранилки и пъзел купи'),
  ('Automatic Dog Feeders', 'Автоматични хранилки', 'dog-bowls-automatic', 'c062ef88-869c-462a-ae50-fea382643692', NULL, 3, 'Automatic and timed feeders', 'Автоматични и програмируеми хранилки'),
  ('Dog Water Fountains', 'Фонтани за вода', 'dog-bowls-fountains', 'c062ef88-869c-462a-ae50-fea382643692', NULL, 4, 'Pet water fountains', 'Фонтани за вода за домашни любимци'),
  ('Travel Dog Bowls', 'Пътни купи', 'dog-bowls-travel', 'c062ef88-869c-462a-ae50-fea382643692', NULL, 5, 'Collapsible and portable bowls', 'Сгъваеми и преносими купи'),
  ('Stainless Steel Dog Bowls', 'Метални купи', 'dog-bowls-steel', 'c062ef88-869c-462a-ae50-fea382643692', NULL, 6, 'Stainless steel bowls', 'Купи от неръждаема стомана')
ON CONFLICT (slug) DO NOTHING;;
