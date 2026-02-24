-- PETS PHASE 3: Add L3 categories for Cat Furniture, Litter, and Grooming
-- Cat Furniture ID: a9d3e886-ff2b-4697-b68b-b50917518dbb
-- Cat Litter ID: 49bd4ed0-d8ec-40dd-88b9-e4df5c0210ae
-- Cat Grooming ID: 334b4c40-1ffd-4991-b58a-b32944cd075e

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  -- Cat Furniture L3
  ('Cat Trees & Condos', 'Катерушки и къщички', 'cat-furniture-trees', 'a9d3e886-ff2b-4697-b68b-b50917518dbb', NULL, 1, 'Multi-level cat trees', 'Многоетажни катерушки'),
  ('Cat Scratching Posts', 'Драскалки', 'cat-furniture-scratching', 'a9d3e886-ff2b-4697-b68b-b50917518dbb', NULL, 2, 'Scratching posts and pads', 'Драскалки и подложки'),
  ('Wall-Mounted Cat Furniture', 'Стенни мебели за котки', 'cat-furniture-wall', 'a9d3e886-ff2b-4697-b68b-b50917518dbb', NULL, 3, 'Wall shelves and perches', 'Стенни рафтове и кацалки'),
  ('Cat Perches & Window Seats', 'Кацалки и седалки за прозорец', 'cat-furniture-perches', 'a9d3e886-ff2b-4697-b68b-b50917518dbb', NULL, 4, 'Window perches and seats', 'Кацалки за прозорец'),
  ('Cat Hammocks', 'Хамаци за котки', 'cat-furniture-hammocks', 'a9d3e886-ff2b-4697-b68b-b50917518dbb', NULL, 5, 'Hanging hammocks and loungers', 'Висящи хамаци'),
  ('Cat Houses', 'Къщички за котки', 'cat-furniture-houses', 'a9d3e886-ff2b-4697-b68b-b50917518dbb', NULL, 6, 'Indoor and outdoor cat houses', 'Къщички за котки за вътре и вън'),
  
  -- Cat Litter L3
  ('Clumping Cat Litter', 'Слепваща постеля', 'cat-litter-clumping', '49bd4ed0-d8ec-40dd-88b9-e4df5c0210ae', NULL, 1, 'Clumping clay litter', 'Слепваща глинена постеля'),
  ('Non-Clumping Cat Litter', 'Неслепваща постеля', 'cat-litter-non-clumping', '49bd4ed0-d8ec-40dd-88b9-e4df5c0210ae', NULL, 2, 'Non-clumping absorbent litter', 'Неслепваща абсорбираща постеля'),
  ('Natural & Biodegradable Litter', 'Натурална и биоразградима', 'cat-litter-natural', '49bd4ed0-d8ec-40dd-88b9-e4df5c0210ae', NULL, 3, 'Corn, wheat, pine, and paper litter', 'Постеля от царевица, пшеница, бор и хартия'),
  ('Crystal Cat Litter', 'Кристална постеля', 'cat-litter-crystal', '49bd4ed0-d8ec-40dd-88b9-e4df5c0210ae', NULL, 4, 'Silica gel crystals', 'Силикагелни кристали'),
  ('Cat Litter Boxes', 'Тоалетни кутии', 'cat-litter-boxes', '49bd4ed0-d8ec-40dd-88b9-e4df5c0210ae', NULL, 5, 'Standard and covered litter boxes', 'Стандартни и закрити тоалетни кутии'),
  ('Automatic Litter Boxes', 'Автоматични тоалетни', 'cat-litter-automatic', '49bd4ed0-d8ec-40dd-88b9-e4df5c0210ae', NULL, 6, 'Self-cleaning litter boxes', 'Самопочистващи се тоалетни кутии'),
  ('Litter Box Accessories', 'Аксесоари за тоалетна', 'cat-litter-accessories', '49bd4ed0-d8ec-40dd-88b9-e4df5c0210ae', NULL, 7, 'Liners, scoops, and mats', 'Подложки, лопатки и постелки'),
  ('Litter Deodorizers', 'Дезодоранти за постеля', 'cat-litter-deodorizers', '49bd4ed0-d8ec-40dd-88b9-e4df5c0210ae', NULL, 8, 'Odor control products', 'Продукти за контрол на миризми'),
  
  -- Cat Grooming L3
  ('Cat Shampoo & Conditioner', 'Шампоани и балсами', 'cat-grooming-shampoo', '334b4c40-1ffd-4991-b58a-b32944cd075e', NULL, 1, 'Cat shampoos and conditioners', 'Шампоани и балсами за котки'),
  ('Cat Brushes & Combs', 'Четки и гребени', 'cat-grooming-brushes', '334b4c40-1ffd-4991-b58a-b32944cd075e', NULL, 2, 'Brushes, combs, and deshedding tools', 'Четки, гребени и инструменти за козината'),
  ('Cat Nail Care', 'Грижа за ноктите', 'cat-grooming-nails', '334b4c40-1ffd-4991-b58a-b32944cd075e', NULL, 3, 'Nail clippers and caps', 'Ножички за нокти и калъфчета'),
  ('Cat Ear & Eye Care', 'Грижа за уши и очи', 'cat-grooming-ears-eyes', '334b4c40-1ffd-4991-b58a-b32944cd075e', NULL, 4, 'Ear cleaners and eye wipes', 'Почистващи за уши и кърпички за очи'),
  ('Cat Dental Care', 'Дентална грижа', 'cat-grooming-dental', '334b4c40-1ffd-4991-b58a-b32944cd075e', NULL, 5, 'Toothbrushes and toothpaste', 'Четки и паста за зъби'),
  ('Cat Hairball Remedies', 'Препарати за космени топки', 'cat-grooming-hairball', '334b4c40-1ffd-4991-b58a-b32944cd075e', NULL, 6, 'Hairball control and prevention', 'Контрол и превенция на космени топки')
ON CONFLICT (slug) DO NOTHING;;
