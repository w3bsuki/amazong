-- PETS PHASE 2: Add L2 categories for Small Animals
-- Small Animals ID: cb0b5930-b98a-4a72-8bcd-6523c43560e0

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  ('Small Animal Food', 'Храна за малки животни', 'small-animal-food', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '🥕', 1, 'Food for rabbits, guinea pigs, hamsters, and more', 'Храна за зайци, морски свинчета, хамстери и други'),
  ('Small Animal Treats', 'Лакомства за малки животни', 'small-animal-treats', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '🍎', 2, 'Treats and chews for small pets', 'Лакомства и дъвчащи продукти за малки любимци'),
  ('Small Animal Hay', 'Сено за малки животни', 'small-animal-hay', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '🌾', 3, 'Timothy hay, orchard grass, and hay varieties', 'Тимотейка, ливадна трева и разновидности сено'),
  ('Small Animal Cages & Habitats', 'Клетки и местообитания', 'small-animal-cages', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '🏠', 4, 'Cages, hutches, and habitat enclosures', 'Клетки, заешки къщички и заграждения'),
  ('Small Animal Bedding', 'Постеля за малки животни', 'small-animal-bedding', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '🛏️', 5, 'Paper, wood, and fleece bedding', 'Хартиена, дървесна и флийс постеля'),
  ('Small Animal Toys', 'Играчки за малки животни', 'small-animal-toys', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '🎾', 6, 'Chew toys, tunnels, and exercise wheels', 'Дъвчащи играчки, тунели и колела за упражнения'),
  ('Small Animal Health', 'Здраве на малки животни', 'small-animal-health', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '💊', 7, 'Vitamins, supplements, and health products', 'Витамини, добавки и здравни продукти'),
  ('Small Animal Grooming', 'Грижа за малки животни', 'small-animal-grooming', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '✨', 8, 'Brushes, nail clippers, and grooming supplies', 'Четки, ножички за нокти и продукти за грижа'),
  ('Small Animal Bowls & Bottles', 'Купи и бутилки', 'small-animal-bowls', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '🥣', 9, 'Water bottles, food bowls, and hay racks', 'Бутилки за вода, купи и стойки за сено'),
  ('Small Animal Carriers', 'Транспортни кутии', 'small-animal-carriers', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '🧳', 10, 'Travel carriers and playpens', 'Транспортни кутии и заграждения за игра'),
  ('Ferret Supplies', 'Продукти за порове', 'ferret-supplies', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', '🦡', 11, 'Ferret food, toys, and accessories', 'Храна, играчки и аксесоари за порове')
ON CONFLICT (slug) DO NOTHING;;
