-- PETS PHASE 3: Add L3 categories for Dog Treats and Dog Toys
-- Dog Treats ID: 7e6d9bb9-a50f-4060-8e56-a22b5c46b37c
-- Dog Toys ID: d9352e8b-3297-453d-9faf-ebab68ca398f

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  -- Dog Treats L3
  ('Dental Dog Treats', 'Дентални лакомства', 'dog-treats-dental', '7e6d9bb9-a50f-4060-8e56-a22b5c46b37c', NULL, 1, 'Dental chews and treats', 'Дентални дъвки и лакомства'),
  ('Training Treats', 'Лакомства за обучение', 'dog-treats-training', '7e6d9bb9-a50f-4060-8e56-a22b5c46b37c', NULL, 2, 'Small treats for training', 'Малки лакомства за обучение'),
  ('Natural Dog Treats', 'Натурални лакомства', 'dog-treats-natural', '7e6d9bb9-a50f-4060-8e56-a22b5c46b37c', NULL, 3, 'Natural and organic treats', 'Натурални и органични лакомства'),
  ('Bully Sticks & Chews', 'Бичешки пръчици и дъвки', 'dog-treats-chews', '7e6d9bb9-a50f-4060-8e56-a22b5c46b37c', NULL, 4, 'Long-lasting chews and bully sticks', 'Дълготрайни дъвки и бичешки пръчици'),
  ('Jerky & Meat Treats', 'Месни лакомства', 'dog-treats-jerky', '7e6d9bb9-a50f-4060-8e56-a22b5c46b37c', NULL, 5, 'Jerky, dried meat treats', 'Джърки и сушени месни лакомства'),
  ('Biscuits & Cookies', 'Бисквити и кексчета', 'dog-treats-biscuits', '7e6d9bb9-a50f-4060-8e56-a22b5c46b37c', NULL, 6, 'Dog biscuits and cookies', 'Кучешки бисквити и кексчета'),
  
  -- Dog Toys L3
  ('Plush Dog Toys', 'Плюшени играчки', 'dog-toys-plush', 'd9352e8b-3297-453d-9faf-ebab68ca398f', NULL, 1, 'Soft and plush toys', 'Меки и плюшени играчки'),
  ('Chew Toys', 'Дъвчащи играчки', 'dog-toys-chew', 'd9352e8b-3297-453d-9faf-ebab68ca398f', NULL, 2, 'Durable chew toys', 'Издръжливи дъвчащи играчки'),
  ('Fetch & Ball Toys', 'Топки и хвърлящи играчки', 'dog-toys-fetch', 'd9352e8b-3297-453d-9faf-ebab68ca398f', NULL, 3, 'Balls and fetch toys', 'Топки и играчки за хвърляне'),
  ('Rope & Tug Toys', 'Въжета и дърпащи играчки', 'dog-toys-rope', 'd9352e8b-3297-453d-9faf-ebab68ca398f', NULL, 4, 'Rope toys and tug toys', 'Въжени играчки за дърпане'),
  ('Interactive Dog Toys', 'Интерактивни играчки', 'dog-toys-interactive', 'd9352e8b-3297-453d-9faf-ebab68ca398f', NULL, 5, 'Puzzle and interactive toys', 'Пъзели и интерактивни играчки'),
  ('Squeaky Toys', 'Пищящи играчки', 'dog-toys-squeaky', 'd9352e8b-3297-453d-9faf-ebab68ca398f', NULL, 6, 'Squeaky toys for dogs', 'Пищящи играчки за кучета'),
  ('Indestructible Toys', 'Неразрушими играчки', 'dog-toys-tough', 'd9352e8b-3297-453d-9faf-ebab68ca398f', NULL, 7, 'Heavy duty toys for aggressive chewers', 'Издръжливи играчки за агресивни дъвкачи')
ON CONFLICT (slug) DO NOTHING;;
