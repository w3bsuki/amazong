
-- Phase 3.3.7: Pets L3 Categories - Small Animals

-- Ferret Supplies L3 (parent: ferret-supplies)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Ferret Food', 'Ferret Cages', 'Ferret Toys', 'Ferret Bedding', 'Ferret Harnesses', 'Ferret Treats']),
  unnest(ARRAY['ferret-food', 'ferret-cage', 'ferret-toys', 'ferret-bedding', 'ferret-harness', 'ferret-treats']),
  (SELECT id FROM categories WHERE slug = 'ferret-supplies'),
  unnest(ARRAY['Храна', 'Клетки', 'Играчки', 'Постеля', 'Нагръдници', 'Лакомства']),
  '🦡'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Accessories L3 (parent: small-animal-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Exercise Wheels', 'Exercise Balls', 'Tunnels', 'Hideouts', 'Playpens', 'Leashes']),
  unnest(ARRAY['smalla-wheel', 'smalla-ball', 'smalla-tunnel', 'smalla-hide', 'smalla-playpen', 'smalla-leash']),
  (SELECT id FROM categories WHERE slug = 'small-animal-accessories'),
  unnest(ARRAY['Колела', 'Топки', 'Тунели', 'Укрития', 'Кошари', 'Каишки']),
  '🐹'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Bedding L3 (parent: small-animal-bedding)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Paper Bedding', 'Wood Shavings', 'Fleece Liners', 'Hemp Bedding', 'Aspen Bedding', 'Odor Control']),
  unnest(ARRAY['sbed-paper', 'sbed-wood', 'sbed-fleece', 'sbed-hemp', 'sbed-aspen', 'sbed-odor']),
  (SELECT id FROM categories WHERE slug = 'small-animal-bedding'),
  unnest(ARRAY['Хартия', 'Талаш', 'Полар', 'Коноп', 'Aspen', 'Срещу миризми']),
  '🛏️'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Bowls & Bottles L3 (parent: small-animal-bowls)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Water Bottles', 'Food Bowls', 'Hay Racks', 'Gravity Feeders', 'Chew-Proof Bottles']),
  unnest(ARRAY['sbowl-bottle', 'sbowl-food', 'sbowl-hay', 'sbowl-gravity', 'sbowl-chew']),
  (SELECT id FROM categories WHERE slug = 'small-animal-bowls'),
  unnest(ARRAY['Поилки', 'Купички', 'Хранилки за сено', 'Гравитационни', 'Устойчиви']),
  '🥣'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Cages & Habitats L3 (parent: small-animal-cages)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hamster Cages', 'Guinea Pig Cages', 'Rabbit Hutches', 'Rat Cages', 'Chinchilla Cages', 'Modular Cages']),
  unnest(ARRAY['scage-hamster', 'scage-guinea', 'scage-rabbit', 'scage-rat', 'scage-chin', 'scage-modular']),
  (SELECT id FROM categories WHERE slug = 'small-animal-cages'),
  unnest(ARRAY['За хамстери', 'За морски свинчета', 'За зайци', 'За плъхове', 'За чинчили', 'Модулни']),
  '🏠'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Carriers L3 (parent: small-animal-carriers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Travel Cages', 'Soft Carriers', 'Exercise Playpens', 'Car Carriers']),
  unnest(ARRAY['scarrier-cage', 'scarrier-soft', 'scarrier-playpen', 'scarrier-car']),
  (SELECT id FROM categories WHERE slug = 'small-animal-carriers'),
  unnest(ARRAY['Транспортни клетки', 'Меки чанти', 'Кошари', 'За кола']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Grooming L3 (parent: small-animal-grooming)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Brushes', 'Nail Clippers', 'Dust Baths', 'Combs', 'Shampoos']),
  unnest(ARRAY['sgroom-brush', 'sgroom-nail', 'sgroom-dust', 'sgroom-comb', 'sgroom-shampoo']),
  (SELECT id FROM categories WHERE slug = 'small-animal-grooming'),
  unnest(ARRAY['Четки', 'Ноктрезачки', 'Прахови бани', 'Гребени', 'Шампоани']),
  '✂️'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Hay L3 (parent: small-animal-hay)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Timothy Hay', 'Orchard Grass', 'Alfalfa Hay', 'Meadow Hay', 'Hay Blends']),
  unnest(ARRAY['shay-timothy', 'shay-orchard', 'shay-alfalfa', 'shay-meadow', 'shay-blend']),
  (SELECT id FROM categories WHERE slug = 'small-animal-hay'),
  unnest(ARRAY['Тимотейка', 'Ливадна трева', 'Люцерна', 'Ливадно сено', 'Смеси']),
  '🌾'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Health L3 (parent: small-animal-health)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Vitamins', 'Probiotics', 'First Aid', 'Dental Care', 'Parasite Prevention']),
  unnest(ARRAY['shealth-vitamins', 'shealth-probio', 'shealth-aid', 'shealth-dental', 'shealth-parasite']),
  (SELECT id FROM categories WHERE slug = 'small-animal-health'),
  unnest(ARRAY['Витамини', 'Пробиотици', 'Първа помощ', 'За зъби', 'Срещу паразити']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Toys L3 (parent: small-animal-toys)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Chew Toys', 'Wooden Toys', 'Hanging Toys', 'Foraging Toys', 'Bridges', 'Seagrass Toys']),
  unnest(ARRAY['stoy-chew', 'stoy-wood', 'stoy-hanging', 'stoy-forage', 'stoy-bridge', 'stoy-seagrass']),
  (SELECT id FROM categories WHERE slug = 'small-animal-toys'),
  unnest(ARRAY['За гризане', 'Дървени', 'Висящи', 'За търсене', 'Мостове', 'От морска трева']),
  '🧸'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Treats L3 (parent: small-animal-treats)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fruit Treats', 'Vegetable Treats', 'Yogurt Drops', 'Seed Sticks', 'Herb Treats', 'Dental Treats']),
  unnest(ARRAY['streat-fruit', 'streat-veggie', 'streat-yogurt', 'streat-seed', 'streat-herb', 'streat-dental']),
  (SELECT id FROM categories WHERE slug = 'small-animal-treats'),
  unnest(ARRAY['Плодови', 'Зеленчукови', 'Йогурт дропчета', 'Семена на клечка', 'Билкови', 'За зъби']),
  '🍬'
ON CONFLICT (slug) DO NOTHING;
;
