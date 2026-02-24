-- ================================================================
-- GROCERY L3: Meat - Beef Cuts
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Ground Beef', 'Мляно телешко', 'beef-ground', id, '🥩', 1
FROM categories WHERE slug = 'meat-beef';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Beef Steaks', 'Телешки стекове', 'beef-steak', id, '🥩', 2
FROM categories WHERE slug = 'meat-beef';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Beef Ribs', 'Телешки ребра', 'beef-ribs', id, '🍖', 3
FROM categories WHERE slug = 'meat-beef';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Beef Roasts', 'Телешко за печене', 'beef-roast', id, '🥩', 4
FROM categories WHERE slug = 'meat-beef';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Beef Tongue', 'Телешки език', 'beef-tongue', id, '🥩', 5
FROM categories WHERE slug = 'meat-beef';

-- ================================================================
-- GROCERY L3: Meat - Pork Cuts
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Ground Pork', 'Мляно свинско', 'pork-ground', id, '🥩', 1
FROM categories WHERE slug = 'meat-pork';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pork Chops', 'Свински котлети', 'pork-chops', id, '🥩', 2
FROM categories WHERE slug = 'meat-pork';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pork Ribs', 'Свински ребра', 'pork-ribs', id, '🍖', 3
FROM categories WHERE slug = 'meat-pork';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pork Tenderloin', 'Свинско филе', 'pork-tenderloin', id, '🥩', 4
FROM categories WHERE slug = 'meat-pork';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pork Shoulder', 'Свинска плешка', 'pork-shoulder', id, '🥩', 5
FROM categories WHERE slug = 'meat-pork';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pork Belly', 'Свинска гърди', 'pork-belly', id, '🥓', 6
FROM categories WHERE slug = 'meat-pork';

-- ================================================================
-- GROCERY L3: Meat - Chicken Cuts
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Whole Chicken', 'Цяло пиле', 'chicken-whole', id, '🍗', 1
FROM categories WHERE slug = 'meat-chicken';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chicken Breast', 'Пилешки гърди', 'chicken-breast', id, '🍗', 2
FROM categories WHERE slug = 'meat-chicken';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chicken Thighs', 'Пилешки бутчета', 'chicken-thighs', id, '🍗', 3
FROM categories WHERE slug = 'meat-chicken';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chicken Wings', 'Пилешки крилца', 'chicken-wings', id, '🍗', 4
FROM categories WHERE slug = 'meat-chicken';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chicken Drumsticks', 'Пилешки бутчета', 'chicken-drumsticks', id, '🍗', 5
FROM categories WHERE slug = 'meat-chicken';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Ground Chicken', 'Мляно пилешко', 'chicken-ground', id, '🍗', 6
FROM categories WHERE slug = 'meat-chicken';

-- ================================================================
-- GROCERY L3: Meat - Bulgarian Sausages
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Lukanka', 'Луканка', 'sausage-lukanka', id, '🌭', 1
FROM categories WHERE slug = 'meat-sausages';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sudzhuk', 'Суджук', 'sausage-sudzhuk', id, '🌭', 2
FROM categories WHERE slug = 'meat-sausages';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Nadenitsa', 'Наденица', 'sausage-nadenitsa', id, '🌭', 3
FROM categories WHERE slug = 'meat-sausages';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Kebapche Mix', 'Кебапчета (кайма)', 'sausage-kebapche', id, '🌭', 4
FROM categories WHERE slug = 'meat-sausages';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Kyufte Mix', 'Кюфтета (кайма)', 'sausage-kyufte', id, '🌭', 5
FROM categories WHERE slug = 'meat-sausages';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pastarma', 'Пастърма', 'sausage-pastarma', id, '🥓', 6
FROM categories WHERE slug = 'meat-sausages';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Frankfurt', 'Франкфуртски', 'sausage-frankfurt', id, '🌭', 7
FROM categories WHERE slug = 'meat-sausages';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chorizo', 'Чоризо', 'sausage-chorizo', id, '🌭', 8
FROM categories WHERE slug = 'meat-sausages';

-- ================================================================
-- GROCERY L3: Seafood - Fish
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Salmon', 'Сьомга', 'fish-salmon', id, '🐟', 1
FROM categories WHERE slug = 'seafood-fish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Trout', 'Пъстърва', 'fish-trout', id, '🐟', 2
FROM categories WHERE slug = 'seafood-fish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mackerel', 'Скумрия', 'fish-mackerel', id, '🐟', 3
FROM categories WHERE slug = 'seafood-fish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sardines', 'Сардини', 'fish-sardines', id, '🐟', 4
FROM categories WHERE slug = 'seafood-fish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Carp', 'Шаран', 'fish-carp', id, '🐟', 5
FROM categories WHERE slug = 'seafood-fish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Catfish', 'Сом', 'fish-catfish', id, '🐟', 6
FROM categories WHERE slug = 'seafood-fish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sea Bass', 'Лаврак', 'fish-seabass', id, '🐟', 7
FROM categories WHERE slug = 'seafood-fish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cod', 'Треска', 'fish-cod', id, '🐟', 8
FROM categories WHERE slug = 'seafood-fish';

-- ================================================================
-- GROCERY L3: Seafood - Shellfish
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Shrimp', 'Скариди', 'shellfish-shrimp', id, '🦐', 1
FROM categories WHERE slug = 'seafood-shellfish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mussels', 'Миди', 'shellfish-mussels', id, '🦪', 2
FROM categories WHERE slug = 'seafood-shellfish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Calamari/Squid', 'Калмари', 'shellfish-calamari', id, '🦑', 3
FROM categories WHERE slug = 'seafood-shellfish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Octopus', 'Октопод', 'shellfish-octopus', id, '🐙', 4
FROM categories WHERE slug = 'seafood-shellfish';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Crab', 'Раци', 'shellfish-crab', id, '🦀', 5
FROM categories WHERE slug = 'seafood-shellfish';;
