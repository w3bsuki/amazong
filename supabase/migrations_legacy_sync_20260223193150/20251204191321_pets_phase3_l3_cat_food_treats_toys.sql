-- PETS PHASE 3: Add L3 categories for Cat Food, Treats, and Toys
-- Cat Food ID: 0a0d6f28-e183-43ae-af67-dfba3ff873e1
-- Cat Treats ID: 320064f9-43bc-4498-bdf2-60ba14616280
-- Cat Toys ID: a6d68106-3615-4bb0-8397-8f81b46ddf25

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  -- Cat Food L3
  ('Dry Cat Food', 'Суха храна за котки', 'cat-food-dry', '0a0d6f28-e183-43ae-af67-dfba3ff873e1', NULL, 1, 'Kibble and dry cat food', 'Гранули и суха храна за котки'),
  ('Wet Cat Food', 'Мокра храна за котки', 'cat-food-wet', '0a0d6f28-e183-43ae-af67-dfba3ff873e1', NULL, 2, 'Canned and pouch cat food', 'Консервирана храна за котки'),
  ('Kitten Food', 'Храна за котенца', 'cat-food-kitten', '0a0d6f28-e183-43ae-af67-dfba3ff873e1', NULL, 3, 'Food for kittens', 'Храна за котенца'),
  ('Senior Cat Food', 'Храна за възрастни котки', 'cat-food-senior', '0a0d6f28-e183-43ae-af67-dfba3ff873e1', NULL, 4, 'Food for older cats', 'Храна за възрастни котки'),
  ('Grain-Free Cat Food', 'Безглутенова храна', 'cat-food-grain-free', '0a0d6f28-e183-43ae-af67-dfba3ff873e1', NULL, 5, 'Grain-free formulas', 'Храна без зърнени храни'),
  ('Prescription Cat Food', 'Ветеринарна храна', 'cat-food-prescription', '0a0d6f28-e183-43ae-af67-dfba3ff873e1', NULL, 6, 'Veterinary diet and prescription food', 'Ветеринарни диети'),
  ('Raw & Freeze-Dried Cat Food', 'Сурова и замразена храна', 'cat-food-raw', '0a0d6f28-e183-43ae-af67-dfba3ff873e1', NULL, 7, 'Raw and freeze-dried foods', 'Сурова и лиофилизирана храна'),
  ('Indoor Cat Food', 'Храна за домашни котки', 'cat-food-indoor', '0a0d6f28-e183-43ae-af67-dfba3ff873e1', NULL, 8, 'Formulated for indoor cats', 'Храна за котки живеещи вкъщи'),
  
  -- Cat Treats L3
  ('Soft Cat Treats', 'Меки лакомства', 'cat-treats-soft', '320064f9-43bc-4498-bdf2-60ba14616280', NULL, 1, 'Soft and chewy treats', 'Меки и дъвчащи лакомства'),
  ('Crunchy Cat Treats', 'Хрупкави лакомства', 'cat-treats-crunchy', '320064f9-43bc-4498-bdf2-60ba14616280', NULL, 2, 'Crunchy treats and biscuits', 'Хрупкави лакомства и бисквити'),
  ('Dental Cat Treats', 'Дентални лакомства', 'cat-treats-dental', '320064f9-43bc-4498-bdf2-60ba14616280', NULL, 3, 'Dental health treats', 'Лакомства за дентално здраве'),
  ('Freeze-Dried Cat Treats', 'Лиофилизирани лакомства', 'cat-treats-freeze-dried', '320064f9-43bc-4498-bdf2-60ba14616280', NULL, 4, 'Freeze-dried meat treats', 'Лиофилизирани месни лакомства'),
  ('Lickable Cat Treats', 'Лижещи лакомства', 'cat-treats-lickable', '320064f9-43bc-4498-bdf2-60ba14616280', NULL, 5, 'Squeeze tubes and lick treats', 'Лакомства за лизане'),
  ('Catnip & Grass', 'Котешка трева и мента', 'cat-treats-catnip', '320064f9-43bc-4498-bdf2-60ba14616280', NULL, 6, 'Catnip and cat grass', 'Котешка мента и трева'),
  
  -- Cat Toys L3
  ('Interactive Cat Toys', 'Интерактивни играчки', 'cat-toys-interactive', 'a6d68106-3615-4bb0-8397-8f81b46ddf25', NULL, 1, 'Puzzle and interactive toys', 'Пъзели и интерактивни играчки'),
  ('Wand & Teaser Toys', 'Пръчици и дразнилки', 'cat-toys-wands', 'a6d68106-3615-4bb0-8397-8f81b46ddf25', NULL, 2, 'Feather wands and teasers', 'Пръчици с пера и дразнилки'),
  ('Ball & Chase Toys', 'Топки и гонещи играчки', 'cat-toys-balls', 'a6d68106-3615-4bb0-8397-8f81b46ddf25', NULL, 3, 'Balls and rolling toys', 'Топки и търкалящи се играчки'),
  ('Catnip Toys', 'Играчки с котешка мента', 'cat-toys-catnip', 'a6d68106-3615-4bb0-8397-8f81b46ddf25', NULL, 4, 'Catnip-filled toys', 'Играчки пълни с котешка мента'),
  ('Plush Cat Toys', 'Плюшени играчки', 'cat-toys-plush', 'a6d68106-3615-4bb0-8397-8f81b46ddf25', NULL, 5, 'Soft and plush toys', 'Меки и плюшени играчки'),
  ('Laser Cat Toys', 'Лазерни играчки', 'cat-toys-laser', 'a6d68106-3615-4bb0-8397-8f81b46ddf25', NULL, 6, 'Laser pointers and auto lasers', 'Лазерни указатели и автоматични лазери'),
  ('Electronic Cat Toys', 'Електронни играчки', 'cat-toys-electronic', 'a6d68106-3615-4bb0-8397-8f81b46ddf25', NULL, 7, 'Battery and automatic toys', 'Автоматични играчки с батерии'),
  ('Cat Tunnels', 'Котешки тунели', 'cat-toys-tunnels', 'a6d68106-3615-4bb0-8397-8f81b46ddf25', NULL, 8, 'Play tunnels and tubes', 'Тунели за игра')
ON CONFLICT (slug) DO NOTHING;;
