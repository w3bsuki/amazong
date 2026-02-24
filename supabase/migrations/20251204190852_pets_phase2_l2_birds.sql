-- PETS PHASE 2: Add L2 categories for Birds
-- Birds ID: b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  ('Bird Food', 'Храна за птици', 'bird-food', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '🌾', 1, 'Bird seeds, pellets, and food mixes', 'Семена, пелети и смеси за птици'),
  ('Bird Treats', 'Лакомства за птици', 'bird-treats', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '🍬', 2, 'Bird treats, millet sprays, and snacks', 'Лакомства, просо и снаксове за птици'),
  ('Bird Cages & Habitats', 'Клетки и местообитания за птици', 'bird-cages', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '🏠', 3, 'Bird cages, aviaries, and flight cages', 'Клетки, волиери и летателни клетки'),
  ('Bird Toys & Accessories', 'Играчки и аксесоари за птици', 'bird-toys', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '🎠', 4, 'Bird toys, swings, mirrors, and bells', 'Играчки, люлки, огледала и звънчета'),
  ('Bird Perches & Stands', 'Кацалки и стойки за птици', 'bird-perches', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '🌿', 5, 'Bird perches, stands, and climbing toys', 'Кацалки, стойки и катерачки'),
  ('Bird Health & Grooming', 'Здраве и грижа за птици', 'bird-health', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '💊', 6, 'Bird vitamins, baths, and grooming supplies', 'Витамини, вани и продукти за грижа'),
  ('Bird Feeding Supplies', 'Хранилки и поилки за птици', 'bird-feeders', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '🥣', 7, 'Bird feeders, waterers, and food dishes', 'Хранилки, поилки и купи за храна'),
  ('Bird Nesting & Breeding', 'Гнезда и развъждане на птици', 'bird-nesting', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '🪺', 8, 'Nesting boxes, breeding supplies, and incubators', 'Къщички за гнездене, развъждане и инкубатори'),
  ('Bird Cage Accessories', 'Аксесоари за клетки', 'bird-cage-accessories', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '🔧', 9, 'Cage liners, covers, and cleaning supplies', 'Подложки, покривала и почистващи продукти'),
  ('Bird Travel Carriers', 'Транспортни кутии за птици', 'bird-carriers', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', '🧳', 10, 'Bird carriers and travel cages', 'Транспортни кутии и клетки за пътуване')
ON CONFLICT (slug) DO NOTHING;;
