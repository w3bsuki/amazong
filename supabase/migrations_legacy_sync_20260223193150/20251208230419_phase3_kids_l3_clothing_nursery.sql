
-- Phase 3.4.4: Kids L3 Categories - Clothing & Nursery

-- Baby Clothing L3 (parent: baby-clothing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Onesies', 'Sleepers', 'Rompers', 'Bodysuits', 'Sets', 'Outerwear']),
  unnest(ARRAY['bcloth-onesie', 'bcloth-sleeper', 'bcloth-romper', 'bcloth-body', 'bcloth-set', 'bcloth-outer']),
  (SELECT id FROM categories WHERE slug = 'baby-clothing'),
  unnest(ARRAY['Гащеризонче', 'За спане', 'Ромпъри', 'Бодита', 'Комплекти', 'Връхни дрехи']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Baby Clothing (0-24M) L3 (parent: cloth-baby)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Newborn Sets', 'Baby Tops', 'Baby Bottoms', 'Baby Dresses', 'Baby Swimwear', 'Baby Socks']),
  unnest(ARRAY['cloth-nb-sets', 'cloth-nb-tops', 'cloth-nb-bottoms', 'cloth-nb-dress', 'cloth-nb-swim', 'cloth-nb-socks']),
  (SELECT id FROM categories WHERE slug = 'cloth-baby'),
  unnest(ARRAY['За новородени', 'Блузки', 'Панталонки', 'Рокли', 'Бански', 'Чорапки']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Baby Shoes L3 (parent: cloth-baby-shoes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Soft Soles', 'First Walkers', 'Booties', 'Sandals', 'Sneakers', 'Dress Shoes']),
  unnest(ARRAY['bshoe-soft', 'bshoe-first', 'bshoe-bootie', 'bshoe-sandal', 'bshoe-sneaker', 'bshoe-dress']),
  (SELECT id FROM categories WHERE slug = 'cloth-baby-shoes'),
  unnest(ARRAY['Меки подметки', 'Първи стъпки', 'Терлички', 'Сандали', 'Маратонки', 'Елегантни']),
  '👟'
ON CONFLICT (slug) DO NOTHING;

-- Boys Clothing L3 (parent: boys-clothing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Boys Shirts', 'Boys Pants', 'Boys Shorts', 'Boys Jackets', 'Boys Suits', 'Boys Sleepwear']),
  unnest(ARRAY['boys-shirt', 'boys-pants', 'boys-shorts', 'boys-jacket', 'boys-suit', 'boys-sleep']),
  (SELECT id FROM categories WHERE slug = 'boys-clothing'),
  unnest(ARRAY['Ризи', 'Панталони', 'Къси панталони', 'Якета', 'Костюми', 'За спане']),
  '👦'
ON CONFLICT (slug) DO NOTHING;

-- Girls Clothing L3 (parent: girls-clothing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Girls Dresses', 'Girls Tops', 'Girls Pants', 'Girls Skirts', 'Girls Jackets', 'Girls Sleepwear']),
  unnest(ARRAY['girls-dress', 'girls-tops', 'girls-pants', 'girls-skirt', 'girls-jacket', 'girls-sleep']),
  (SELECT id FROM categories WHERE slug = 'girls-clothing'),
  unnest(ARRAY['Рокли', 'Блузи', 'Панталони', 'Поли', 'Якета', 'За спане']),
  '👧'
ON CONFLICT (slug) DO NOTHING;

-- Kids Accessories L3 (parent: cloth-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Kids Hats', 'Kids Belts', 'Kids Socks', 'Kids Tights', 'Hair Accessories', 'Bags']),
  unnest(ARRAY['kacc-hats', 'kacc-belts', 'kacc-socks', 'kacc-tights', 'kacc-hair', 'kacc-bags']),
  (SELECT id FROM categories WHERE slug = 'cloth-accessories'),
  unnest(ARRAY['Шапки', 'Колани', 'Чорапи', 'Чорапогащи', 'За коса', 'Чанти']),
  '🎀'
ON CONFLICT (slug) DO NOTHING;

-- Kids Clothing (5-12Y) L3 (parent: cloth-kids)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Kids T-Shirts', 'Kids Jeans', 'Kids Hoodies', 'Kids Activewear', 'Kids Formal', 'Kids Outerwear']),
  unnest(ARRAY['kcloth-tshirt', 'kcloth-jeans', 'kcloth-hoodie', 'kcloth-active', 'kcloth-formal', 'kcloth-outer']),
  (SELECT id FROM categories WHERE slug = 'cloth-kids'),
  unnest(ARRAY['Тениски', 'Дънки', 'Суичъри', 'Спортни', 'Официални', 'Връхни']),
  '👕'
ON CONFLICT (slug) DO NOTHING;

-- School Uniforms L3 (parent: school-uniforms)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Uniform Shirts', 'Uniform Pants', 'Uniform Skirts', 'Uniform Dresses', 'Uniform Sweaters', 'School Shoes']),
  unnest(ARRAY['uni-shirt', 'uni-pants', 'uni-skirt', 'uni-dress', 'uni-sweater', 'uni-shoes']),
  (SELECT id FROM categories WHERE slug = 'school-uniforms'),
  unnest(ARRAY['Ризи', 'Панталони', 'Поли', 'Рокли', 'Пуловери', 'Обувки']),
  '🏫'
ON CONFLICT (slug) DO NOTHING;

-- Toddler Clothing L3 (parent: toddler-clothing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Toddler Sets', 'Toddler Tops', 'Toddler Bottoms', 'Toddler Dresses', 'Toddler Outerwear']),
  unnest(ARRAY['toddler-set', 'toddler-top', 'toddler-bottom', 'toddler-dress', 'toddler-outer']),
  (SELECT id FROM categories WHERE slug = 'toddler-clothing'),
  unnest(ARRAY['Комплекти', 'Блузки', 'Панталонки', 'Рокли', 'Връхни дрехи']),
  '🧒'
ON CONFLICT (slug) DO NOTHING;

-- Toddler Clothing (2-5Y) L3 (parent: cloth-toddler)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Toddler Shoes', 'Toddler Sleepwear', 'Toddler Swimwear', 'Toddler Underwear']),
  unnest(ARRAY['toddler2-shoe', 'toddler2-sleep', 'toddler2-swim', 'toddler2-under']),
  (SELECT id FROM categories WHERE slug = 'cloth-toddler'),
  unnest(ARRAY['Обувки', 'За спане', 'Бански', 'Бельо']),
  '🧒'
ON CONFLICT (slug) DO NOTHING;

-- Baby Bedding L3 (parent: baby-bedding)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Crib Sheets', 'Blankets', 'Sleep Sacks', 'Swaddles', 'Pillows', 'Bedding Sets']),
  unnest(ARRAY['bedding-sheet', 'bedding-blanket', 'bedding-sack', 'bedding-swaddle', 'bedding-pillow', 'bedding-set']),
  (SELECT id FROM categories WHERE slug = 'baby-bedding'),
  unnest(ARRAY['Чаршафи', 'Одеяла', 'Чувалчета', 'Повивалки', 'Възглавници', 'Комплекти']),
  '🛏️'
ON CONFLICT (slug) DO NOTHING;

-- Baby Mattresses L3 (parent: nursery-mattresses)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Foam Mattresses', 'Innerspring Mattresses', 'Organic Mattresses', 'Dual-Sided', 'Mattress Pads']),
  unnest(ARRAY['mattress-foam', 'mattress-spring', 'mattress-organic', 'mattress-dual', 'mattress-pad']),
  (SELECT id FROM categories WHERE slug = 'nursery-mattresses'),
  unnest(ARRAY['Пенести', 'С пружини', 'Органични', 'Двустранни', 'Протектори']),
  '🛏️'
ON CONFLICT (slug) DO NOTHING;

-- Bassinets L3 (parent: bassinets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Standard Bassinets', 'Bedside Bassinets', 'Portable Bassinets', 'Rocking Bassinets', 'Smart Bassinets']),
  unnest(ARRAY['bassinet-std', 'bassinet-bedside', 'bassinet-portable', 'bassinet-rock', 'bassinet-smart']),
  (SELECT id FROM categories WHERE slug = 'bassinets'),
  unnest(ARRAY['Стандартни', 'До леглото', 'Преносими', 'Люлеещи', 'Смарт']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Changing Tables L3 (parent: nursery-changing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Standard Tables', 'Dresser Combos', 'Wall-Mounted', 'Portable Tables', 'Corner Tables']),
  unnest(ARRAY['ctable-std', 'ctable-combo', 'ctable-wall', 'ctable-portable', 'ctable-corner']),
  (SELECT id FROM categories WHERE slug = 'nursery-changing'),
  unnest(ARRAY['Стандартни', 'С шкаф', 'За стена', 'Преносими', 'Ъглови']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Changing Tables (duplicate) L3 (parent: changing-tables)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Foldable Tables', 'With Storage', 'Modern Tables']),
  unnest(ARRAY['ctable2-fold', 'ctable2-storage', 'ctable2-modern']),
  (SELECT id FROM categories WHERE slug = 'changing-tables'),
  unnest(ARRAY['Сгъваеми', 'С място', 'Модерни']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;
;
