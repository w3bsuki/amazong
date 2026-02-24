
-- =====================================================
-- HOME & KITCHEN PART 3: Kitchen & Dining L2/L3
-- =====================================================

DO $$
DECLARE
  kitchen_id UUID;
BEGIN
  SELECT id INTO kitchen_id FROM categories WHERE slug = 'kitchen-dining';

  -- Large Appliances
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Large Appliances', 'Големи уреди', 'kitchen-large-appliances', kitchen_id, '🏠', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO kitchen_id;

  -- Move existing large appliances under this new L2
  UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-large-appliances'), display_order = 1 WHERE slug = 'kitchen-fridge';
  UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-large-appliances'), display_order = 2 WHERE slug = 'kitchen-oven';
  UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-large-appliances'), display_order = 3 WHERE slug = 'kitchen-dishwasher';
  UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-large-appliances'), display_order = 4 WHERE slug = 'kitchen-microwave';

  -- Add more large appliances
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Washing Machines', 'Перални машини', 'kitchen-washer', (SELECT id FROM categories WHERE slug = 'kitchen-large-appliances'), '🧺', 5),
  ('Dryers', 'Сушилни', 'kitchen-dryer', (SELECT id FROM categories WHERE slug = 'kitchen-large-appliances'), '🧺', 6),
  ('Freezers', 'Фризери', 'kitchen-freezer', (SELECT id FROM categories WHERE slug = 'kitchen-large-appliances'), '❄️', 7),
  ('Range Hoods', 'Абсорбатори', 'kitchen-hood', (SELECT id FROM categories WHERE slug = 'kitchen-large-appliances'), '💨', 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Small Appliances
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Small Appliances', 'Малки уреди', 'kitchen-small-appliances', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '⚡', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Move and add small appliances
  UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), display_order = 1 WHERE slug = 'kitchen-coffee';
  UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), display_order = 2 WHERE slug = 'kitchen-blender';

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Toasters & Ovens', 'Тостери и фурни', 'small-toaster', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '🍞', 3),
  ('Air Fryers', 'Еър фрайъри', 'small-airfryer', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '🍟', 4),
  ('Electric Kettles', 'Електрически кани', 'small-kettle', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '☕', 5),
  ('Food Processors', 'Кухненски роботи', 'small-processor', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '🔪', 6),
  ('Juicers', 'Сокоизстисквачки', 'small-juicer', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '🍊', 7),
  ('Rice Cookers', 'Уреди за ориз', 'small-rice', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '🍚', 8),
  ('Slow Cookers', 'Бавни готварски съдове', 'small-slowcooker', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '🥘', 9),
  ('Electric Grills', 'Електрически скари', 'small-grill', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '🥩', 10),
  ('Sandwich Makers', 'Сандвич тостери', 'small-sandwich', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '🥪', 11),
  ('Waffle Makers', 'Гофретници', 'small-waffle', (SELECT id FROM categories WHERE slug = 'kitchen-small-appliances'), '🧇', 12)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Cookware L3
  UPDATE categories SET display_order = 3 WHERE slug = 'cookware' OR slug = 'kitchen-cookware';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Pots & Pans', 'Тенджери и тигани', 'cook-pots', (SELECT id FROM categories WHERE slug = 'cookware'), '🍳', 1),
  ('Frying Pans', 'Тигани', 'cook-frying', (SELECT id FROM categories WHERE slug = 'cookware'), '🍳', 2),
  ('Saucepans', 'Тенджери', 'cook-saucepan', (SELECT id FROM categories WHERE slug = 'cookware'), '🍲', 3),
  ('Dutch Ovens', 'Чугунени съдове', 'cook-dutch', (SELECT id FROM categories WHERE slug = 'cookware'), '🥘', 4),
  ('Woks', 'Уок тигани', 'cook-wok', (SELECT id FROM categories WHERE slug = 'cookware'), '🥡', 5),
  ('Cookware Sets', 'Комплекти', 'cook-sets', (SELECT id FROM categories WHERE slug = 'cookware'), '🍳', 6),
  ('Grill Pans', 'Грил тигани', 'cook-grill', (SELECT id FROM categories WHERE slug = 'cookware'), '🥩', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Bakeware L3
  UPDATE categories SET display_order = 4 WHERE slug = 'bakeware';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Baking Sheets', 'Тави за печене', 'bake-sheets', (SELECT id FROM categories WHERE slug = 'bakeware'), '🍪', 1),
  ('Cake Pans', 'Форми за торти', 'bake-cake', (SELECT id FROM categories WHERE slug = 'bakeware'), '🎂', 2),
  ('Muffin Pans', 'Форми за мъфини', 'bake-muffin', (SELECT id FROM categories WHERE slug = 'bakeware'), '🧁', 3),
  ('Bread Pans', 'Форми за хляб', 'bake-bread', (SELECT id FROM categories WHERE slug = 'bakeware'), '🍞', 4),
  ('Pie Dishes', 'Форми за пай', 'bake-pie', (SELECT id FROM categories WHERE slug = 'bakeware'), '🥧', 5),
  ('Baking Mats', 'Постелки за печене', 'bake-mats', (SELECT id FROM categories WHERE slug = 'bakeware'), '🍪', 6),
  ('Cooling Racks', 'Решетки за охлаждане', 'bake-racks', (SELECT id FROM categories WHERE slug = 'bakeware'), '🍪', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Dinnerware L3
  UPDATE categories SET display_order = 5 WHERE slug = 'dinnerware';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Dinner Plates', 'Чинии за хранене', 'dinner-plates', (SELECT id FROM categories WHERE slug = 'dinnerware'), '🍽️', 1),
  ('Bowls', 'Купи', 'dinner-bowls', (SELECT id FROM categories WHERE slug = 'dinnerware'), '🥣', 2),
  ('Dinnerware Sets', 'Сервизи', 'dinner-sets', (SELECT id FROM categories WHERE slug = 'dinnerware'), '🍽️', 3),
  ('Serving Platters', 'Подноси', 'dinner-platters', (SELECT id FROM categories WHERE slug = 'dinnerware'), '🍽️', 4),
  ('Mugs & Cups', 'Чаши и купи', 'dinner-mugs', (SELECT id FROM categories WHERE slug = 'dinnerware'), '☕', 5),
  ('Kids Dinnerware', 'Детски съдове', 'dinner-kids', (SELECT id FROM categories WHERE slug = 'dinnerware'), '👶', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Glassware L3
  UPDATE categories SET display_order = 6 WHERE slug = 'glassware';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Drinking Glasses', 'Чаши за пиене', 'glass-drinking', (SELECT id FROM categories WHERE slug = 'glassware'), '🥛', 1),
  ('Wine Glasses', 'Чаши за вино', 'glass-wine', (SELECT id FROM categories WHERE slug = 'glassware'), '🍷', 2),
  ('Beer Glasses', 'Чаши за бира', 'glass-beer', (SELECT id FROM categories WHERE slug = 'glassware'), '🍺', 3),
  ('Champagne Flutes', 'Чаши за шампанско', 'glass-champagne', (SELECT id FROM categories WHERE slug = 'glassware'), '🥂', 4),
  ('Whiskey Glasses', 'Чаши за уиски', 'glass-whiskey', (SELECT id FROM categories WHERE slug = 'glassware'), '🥃', 5),
  ('Cocktail Glasses', 'Коктейлни чаши', 'glass-cocktail', (SELECT id FROM categories WHERE slug = 'glassware'), '🍸', 6),
  ('Pitchers & Carafes', 'Кани и гарафи', 'glass-pitcher', (SELECT id FROM categories WHERE slug = 'glassware'), '🫗', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Cutlery L3
  UPDATE categories SET display_order = 7 WHERE slug = 'cutlery';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Flatware Sets', 'Комплекти прибори', 'cutlery-sets', (SELECT id FROM categories WHERE slug = 'cutlery'), '🍴', 1),
  ('Knives', 'Ножове', 'cutlery-knives', (SELECT id FROM categories WHERE slug = 'cutlery'), '🔪', 2),
  ('Forks', 'Вилици', 'cutlery-forks', (SELECT id FROM categories WHERE slug = 'cutlery'), '🍴', 3),
  ('Spoons', 'Лъжици', 'cutlery-spoons', (SELECT id FROM categories WHERE slug = 'cutlery'), '🥄', 4),
  ('Steak Knives', 'Ножове за стек', 'cutlery-steak', (SELECT id FROM categories WHERE slug = 'cutlery'), '🥩', 5),
  ('Serving Utensils', 'Прибори за сервиране', 'cutlery-serving', (SELECT id FROM categories WHERE slug = 'cutlery'), '🍴', 6),
  ('Kids Cutlery', 'Детски прибори', 'cutlery-kids', (SELECT id FROM categories WHERE slug = 'cutlery'), '👶', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Food Storage L3
  UPDATE categories SET display_order = 8 WHERE slug = 'food-storage';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Containers', 'Контейнери', 'storage-containers', (SELECT id FROM categories WHERE slug = 'food-storage'), '📦', 1),
  ('Glass Containers', 'Стъклени контейнери', 'storage-glass', (SELECT id FROM categories WHERE slug = 'food-storage'), '🫙', 2),
  ('Lunch Boxes', 'Кутии за храна', 'storage-lunchbox', (SELECT id FROM categories WHERE slug = 'food-storage'), '🍱', 3),
  ('Vacuum Sealers', 'Вакуум машини', 'storage-vacuum', (SELECT id FROM categories WHERE slug = 'food-storage'), '📦', 4),
  ('Zip Bags & Wraps', 'Торбички и фолио', 'storage-bags', (SELECT id FROM categories WHERE slug = 'food-storage'), '📦', 5),
  ('Spice Racks', 'Стойки за подправки', 'storage-spice', (SELECT id FROM categories WHERE slug = 'food-storage'), '🧂', 6),
  ('Bread Boxes', 'Кутии за хляб', 'storage-breadbox', (SELECT id FROM categories WHERE slug = 'food-storage'), '🍞', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Add Kitchen Utensils L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Kitchen Utensils', 'Кухненски прибори', 'kitchen-utensils', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '🥄', 9)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Spatulas', 'Шпатули', 'utensil-spatula', (SELECT id FROM categories WHERE slug = 'kitchen-utensils'), '🥄', 1),
  ('Whisks', 'Бъркалки', 'utensil-whisk', (SELECT id FROM categories WHERE slug = 'kitchen-utensils'), '🥄', 2),
  ('Tongs', 'Щипки', 'utensil-tongs', (SELECT id FROM categories WHERE slug = 'kitchen-utensils'), '🥄', 3),
  ('Ladles', 'Черпаци', 'utensil-ladle', (SELECT id FROM categories WHERE slug = 'kitchen-utensils'), '🥄', 4),
  ('Peelers & Graters', 'Белачки и ренета', 'utensil-peeler', (SELECT id FROM categories WHERE slug = 'kitchen-utensils'), '🥕', 5),
  ('Measuring Tools', 'Мерителни инструменти', 'utensil-measuring', (SELECT id FROM categories WHERE slug = 'kitchen-utensils'), '📏', 6),
  ('Cutting Boards', 'Дъски за рязане', 'utensil-cutting', (SELECT id FROM categories WHERE slug = 'kitchen-utensils'), '🔪', 7),
  ('Kitchen Scales', 'Кухненски везни', 'utensil-scale', (SELECT id FROM categories WHERE slug = 'kitchen-utensils'), '⚖️', 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

END $$;
;
