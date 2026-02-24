-- Restore Food & Grocery L3 categories

-- Fresh Produce L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Fresh Fruits', 'produce-fruits', 'Пресни плодове', 1),
  ('Fresh Vegetables', 'produce-vegetables', 'Пресни зеленчуци', 2),
  ('Organic Produce', 'produce-organic', 'Био продукти', 3),
  ('Herbs', 'produce-herbs', 'Билки', 4),
  ('Salads', 'produce-salads', 'Салати', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'grocery-produce'
ON CONFLICT (slug) DO NOTHING;

-- Dairy Products L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Milk', 'dairy-milk', 'Мляко', 1),
  ('Cheese', 'dairy-cheese', 'Сирене', 2),
  ('Yogurt', 'dairy-yogurt', 'Кисело мляко', 3),
  ('Butter & Cream', 'dairy-butter', 'Масло и сметана', 4),
  ('Eggs', 'dairy-eggs', 'Яйца', 5),
  ('Plant-Based Dairy', 'dairy-plant-based', 'Растително мляко', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'grocery-dairy'
ON CONFLICT (slug) DO NOTHING;

-- Meat & Seafood L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Beef', 'meat-beef', 'Телешко', 1),
  ('Pork', 'meat-pork', 'Свинско', 2),
  ('Chicken', 'meat-chicken', 'Пилешко', 3),
  ('Lamb', 'meat-lamb', 'Агнешко', 4),
  ('Fish', 'meat-fish', 'Риба', 5),
  ('Shellfish', 'meat-shellfish', 'Морски дарове', 6),
  ('Deli Meats', 'meat-deli', 'Колбаси', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'grocery-meat'
ON CONFLICT (slug) DO NOTHING;

-- Bakery L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Bread', 'bakery-bread', 'Хляб', 1),
  ('Pastries', 'bakery-pastries', 'Сладкиши', 2),
  ('Cakes', 'bakery-cakes', 'Торти', 3),
  ('Cookies', 'bakery-cookies', 'Бисквити', 4),
  ('Bagels & Muffins', 'bakery-bagels', 'Бейгъли и мъфини', 5),
  ('Gluten-Free', 'bakery-gluten-free', 'Без глутен', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'grocery-bakery'
ON CONFLICT (slug) DO NOTHING;

-- Beverages L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Coffee', 'beverages-coffee', 'Кафе', 1),
  ('Tea', 'beverages-tea', 'Чай', 2),
  ('Soft Drinks', 'beverages-soft', 'Безалкохолни', 3),
  ('Juices', 'beverages-juices', 'Сокове', 4),
  ('Water', 'beverages-water', 'Вода', 5),
  ('Energy Drinks', 'beverages-energy', 'Енергийни напитки', 6),
  ('Wine', 'beverages-wine', 'Вино', 7),
  ('Beer', 'beverages-beer', 'Бира', 8),
  ('Spirits', 'beverages-spirits', 'Спиртни напитки', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'grocery-beverages'
ON CONFLICT (slug) DO NOTHING;

-- Pantry L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Pasta & Rice', 'pantry-pasta', 'Паста и ориз', 1),
  ('Canned Goods', 'pantry-canned', 'Консерви', 2),
  ('Oils & Vinegars', 'pantry-oils', 'Олио и оцет', 3),
  ('Spices & Seasonings', 'pantry-spices', 'Подправки', 4),
  ('Sauces & Condiments', 'pantry-sauces', 'Сосове', 5),
  ('Baking Supplies', 'pantry-baking', 'За печене', 6),
  ('Cereals', 'pantry-cereals', 'Зърнени храни', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'grocery-pantry'
ON CONFLICT (slug) DO NOTHING;

-- Snacks L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Chips & Crackers', 'snacks-chips', 'Чипс и крекери', 1),
  ('Nuts & Seeds', 'snacks-nuts', 'Ядки и семена', 2),
  ('Candy', 'snacks-candy', 'Бонбони', 3),
  ('Chocolate', 'snacks-chocolate', 'Шоколад', 4),
  ('Popcorn', 'snacks-popcorn', 'Пуканки', 5),
  ('Protein Bars', 'snacks-protein', 'Протеинови барове', 6),
  ('Dried Fruits', 'snacks-dried-fruits', 'Сушени плодове', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'grocery-snacks'
ON CONFLICT (slug) DO NOTHING;

-- Garden & Outdoor L3 - Plants
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Indoor Plants', 'plants-indoor', 'Стайни растения', 1),
  ('Outdoor Plants', 'plants-outdoor', 'Външни растения', 2),
  ('Flowers', 'plants-flowers', 'Цветя', 3),
  ('Trees & Shrubs', 'plants-trees', 'Дървета и храсти', 4),
  ('Succulents', 'plants-succulents', 'Сукуленти', 5),
  ('Vegetable Seeds', 'plants-vegetable-seeds', 'Зеленчукови семена', 6),
  ('Flower Seeds', 'plants-flower-seeds', 'Цветни семена', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'garden-plants'
ON CONFLICT (slug) DO NOTHING;

-- Garden Tools L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Hand Tools', 'garden-hand-tools', 'Ръчни инструменти', 1),
  ('Power Tools', 'garden-power-tools', 'Електроинструменти', 2),
  ('Lawn Mowers', 'garden-mowers', 'Косачки', 3),
  ('Trimmers', 'garden-trimmers', 'Тримери', 4),
  ('Hoses & Watering', 'garden-watering', 'Маркучи и поливане', 5),
  ('Wheelbarrows', 'garden-wheelbarrows', 'Колички', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'garden-tools'
ON CONFLICT (slug) DO NOTHING;

-- Outdoor Furniture L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Patio Sets', 'outdoor-patio-sets', 'Градински комплекти', 1),
  ('Outdoor Chairs', 'outdoor-chairs', 'Градински столове', 2),
  ('Outdoor Tables', 'outdoor-tables', 'Градински маси', 3),
  ('Hammocks', 'outdoor-hammocks', 'Хамаци', 4),
  ('Umbrellas', 'outdoor-umbrellas', 'Чадъри', 5),
  ('Gazebos', 'outdoor-gazebos', 'Беседки', 6),
  ('Outdoor Cushions', 'outdoor-cushions', 'Възглавници за градина', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'garden-furniture'
ON CONFLICT (slug) DO NOTHING;

-- Grills & BBQ L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Gas Grills', 'grills-gas', 'Газови грилове', 1),
  ('Charcoal Grills', 'grills-charcoal', 'Грилове на въглища', 2),
  ('Electric Grills', 'grills-electric', 'Електрически грилове', 3),
  ('Smokers', 'grills-smokers', 'Коптилни', 4),
  ('BBQ Accessories', 'grills-accessories', 'Аксесоари за барбекю', 5),
  ('Grill Covers', 'grills-covers', 'Покривала за грилове', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'garden-grills'
ON CONFLICT (slug) DO NOTHING;;
