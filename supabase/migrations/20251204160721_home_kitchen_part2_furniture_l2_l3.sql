
-- =====================================================
-- HOME & KITCHEN PART 2: Furniture L2/L3 Expansion
-- =====================================================

DO $$
DECLARE
  furn_id UUID;
  cat_id UUID;
BEGIN
  SELECT id INTO furn_id FROM categories WHERE slug = 'furniture';

  -- Clean up and consolidate Furniture L2s
  -- Sofas & Couches
  UPDATE categories SET display_order = 1 WHERE slug = 'furn-sofas';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Sectional Sofas', 'Ъглови дивани', 'sofa-sectional', (SELECT id FROM categories WHERE slug = 'furn-sofas'), '🛋️', 1),
  ('Loveseats', 'Двуместни дивани', 'sofa-loveseat', (SELECT id FROM categories WHERE slug = 'furn-sofas'), '🛋️', 2),
  ('Sleeper Sofas', 'Разтегателни дивани', 'sofa-sleeper', (SELECT id FROM categories WHERE slug = 'furn-sofas'), '🛏️', 3),
  ('Recliners', 'Релакс фотьойли', 'sofa-recliner', (SELECT id FROM categories WHERE slug = 'furn-sofas'), '🪑', 4),
  ('Futons', 'Футони', 'sofa-futon', (SELECT id FROM categories WHERE slug = 'furn-sofas'), '🛋️', 5),
  ('Armchairs', 'Кресла', 'sofa-armchair', (SELECT id FROM categories WHERE slug = 'furn-sofas'), '🪑', 6),
  ('Ottoman & Poufs', 'Табуретки и пуфове', 'sofa-ottoman', (SELECT id FROM categories WHERE slug = 'furn-sofas'), '🪑', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Beds & Mattresses
  UPDATE categories SET display_order = 2 WHERE slug = 'furn-beds';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Platform Beds', 'Платформени легла', 'bed-platform', (SELECT id FROM categories WHERE slug = 'furn-beds'), '🛏️', 1),
  ('Bed Frames', 'Рамки за легла', 'bed-frames', (SELECT id FROM categories WHERE slug = 'furn-beds'), '🛏️', 2),
  ('Bunk Beds', 'Двуетажни легла', 'bed-bunk', (SELECT id FROM categories WHERE slug = 'furn-beds'), '🛏️', 3),
  ('Daybeds', 'Кушетки', 'bed-daybed', (SELECT id FROM categories WHERE slug = 'furn-beds'), '🛏️', 4),
  ('Headboards', 'Табли за легло', 'bed-headboard', (SELECT id FROM categories WHERE slug = 'furn-beds'), '🛏️', 5),
  ('Adjustable Beds', 'Регулируеми легла', 'bed-adjustable', (SELECT id FROM categories WHERE slug = 'furn-beds'), '🛏️', 6),
  ('Kids Beds', 'Детски легла', 'bed-kids', (SELECT id FROM categories WHERE slug = 'furn-beds'), '🛏️', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Tables
  UPDATE categories SET display_order = 3 WHERE slug = 'furn-tables';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Dining Tables', 'Трапезни маси', 'table-dining', (SELECT id FROM categories WHERE slug = 'furn-tables'), '🪑', 1),
  ('Coffee Tables', 'Холни масички', 'table-coffee', (SELECT id FROM categories WHERE slug = 'furn-tables'), '☕', 2),
  ('Console Tables', 'Конзолни маси', 'table-console', (SELECT id FROM categories WHERE slug = 'furn-tables'), '🪑', 3),
  ('Side Tables', 'Помощни масички', 'table-side', (SELECT id FROM categories WHERE slug = 'furn-tables'), '🪑', 4),
  ('Nightstands', 'Нощни шкафчета', 'table-nightstand', (SELECT id FROM categories WHERE slug = 'furn-tables'), '🛏️', 5),
  ('Folding Tables', 'Сгъваеми маси', 'table-folding', (SELECT id FROM categories WHERE slug = 'furn-tables'), '🪑', 6),
  ('Outdoor Tables', 'Градински маси', 'table-outdoor', (SELECT id FROM categories WHERE slug = 'furn-tables'), '🌳', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Chairs
  UPDATE categories SET display_order = 4 WHERE slug = 'furn-chairs';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Dining Chairs', 'Трапезни столове', 'chair-dining', (SELECT id FROM categories WHERE slug = 'furn-chairs'), '🪑', 1),
  ('Office Chairs', 'Офис столове', 'chair-office', (SELECT id FROM categories WHERE slug = 'furn-chairs'), '🪑', 2),
  ('Gaming Chairs', 'Геймърски столове', 'chair-gaming', (SELECT id FROM categories WHERE slug = 'furn-chairs'), '🎮', 3),
  ('Accent Chairs', 'Акцентни столове', 'chair-accent', (SELECT id FROM categories WHERE slug = 'furn-chairs'), '🪑', 4),
  ('Bar Stools', 'Бар столове', 'chair-barstool', (SELECT id FROM categories WHERE slug = 'furn-chairs'), '🪑', 5),
  ('Rocking Chairs', 'Люлеещи се столове', 'chair-rocking', (SELECT id FROM categories WHERE slug = 'furn-chairs'), '🪑', 6),
  ('Folding Chairs', 'Сгъваеми столове', 'chair-folding', (SELECT id FROM categories WHERE slug = 'furn-chairs'), '🪑', 7),
  ('Kids Chairs', 'Детски столове', 'chair-kids', (SELECT id FROM categories WHERE slug = 'furn-chairs'), '👶', 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Mattresses (separate from beds)
  UPDATE categories SET display_order = 5 WHERE slug = 'mattresses';
  UPDATE categories SET parent_id = furn_id WHERE slug = 'mattresses';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Memory Foam', 'Мемори пяна', 'mattress-memory', (SELECT id FROM categories WHERE slug = 'mattresses'), '🛏️', 1),
  ('Innerspring', 'Пружинни', 'mattress-spring', (SELECT id FROM categories WHERE slug = 'mattresses'), '🛏️', 2),
  ('Hybrid', 'Хибридни', 'mattress-hybrid', (SELECT id FROM categories WHERE slug = 'mattresses'), '🛏️', 3),
  ('Latex', 'Латекс', 'mattress-latex', (SELECT id FROM categories WHERE slug = 'mattresses'), '🛏️', 4),
  ('Mattress Toppers', 'Топери', 'mattress-topper', (SELECT id FROM categories WHERE slug = 'mattresses'), '🛏️', 5),
  ('Mattress Protectors', 'Протектори', 'mattress-protector', (SELECT id FROM categories WHERE slug = 'mattresses'), '🛏️', 6),
  ('Kids Mattresses', 'Детски матраци', 'mattress-kids', (SELECT id FROM categories WHERE slug = 'mattresses'), '👶', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Storage & Shelving  
  UPDATE categories SET display_order = 6 WHERE slug = 'furn-storage';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Bookcases', 'Библиотеки', 'storage-bookcase', (SELECT id FROM categories WHERE slug = 'furn-storage'), '📚', 1),
  ('Cabinets', 'Шкафове', 'storage-cabinet', (SELECT id FROM categories WHERE slug = 'furn-storage'), '🗄️', 2),
  ('Dressers', 'Скринове', 'storage-dresser', (SELECT id FROM categories WHERE slug = 'furn-storage'), '🗄️', 3),
  ('Shoe Racks', 'Стойки за обувки', 'storage-shoes', (SELECT id FROM categories WHERE slug = 'furn-storage'), '👟', 4),
  ('Coat Racks', 'Закачалки', 'storage-coatrack', (SELECT id FROM categories WHERE slug = 'furn-storage'), '🧥', 5),
  ('Storage Benches', 'Пейки с място', 'storage-bench', (SELECT id FROM categories WHERE slug = 'furn-storage'), '🪑', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Wardrobes
  UPDATE categories SET display_order = 7 WHERE slug = 'wardrobes';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Sliding Door', 'С плъзгащи врати', 'wardrobe-sliding', (SELECT id FROM categories WHERE slug = 'wardrobes'), '🚪', 1),
  ('Hinged Door', 'С отваряеми врати', 'wardrobe-hinged', (SELECT id FROM categories WHERE slug = 'wardrobes'), '🚪', 2),
  ('Open Wardrobes', 'Отворени гардероби', 'wardrobe-open', (SELECT id FROM categories WHERE slug = 'wardrobes'), '👔', 3),
  ('Corner Wardrobes', 'Ъглови гардероби', 'wardrobe-corner', (SELECT id FROM categories WHERE slug = 'wardrobes'), '📐', 4),
  ('Kids Wardrobes', 'Детски гардероби', 'wardrobe-kids', (SELECT id FROM categories WHERE slug = 'wardrobes'), '👶', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Desks
  UPDATE categories SET display_order = 8 WHERE slug = 'desks';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Computer Desks', 'Компютърни бюра', 'desk-computer', (SELECT id FROM categories WHERE slug = 'desks'), '💻', 1),
  ('Standing Desks', 'Стоящи бюра', 'desk-standing', (SELECT id FROM categories WHERE slug = 'desks'), '🧍', 2),
  ('L-Shaped Desks', 'Г-образни бюра', 'desk-lshaped', (SELECT id FROM categories WHERE slug = 'desks'), '📐', 3),
  ('Writing Desks', 'Писмени бюра', 'desk-writing', (SELECT id FROM categories WHERE slug = 'desks'), '✍️', 4),
  ('Gaming Desks', 'Геймърски бюра', 'desk-gaming', (SELECT id FROM categories WHERE slug = 'desks'), '🎮', 5),
  ('Kids Desks', 'Детски бюра', 'desk-kids', (SELECT id FROM categories WHERE slug = 'desks'), '👶', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- TV Stands & Entertainment
  UPDATE categories SET display_order = 9 WHERE slug = 'tv-stands';
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('TV Cabinets', 'ТВ шкафове', 'tv-cabinet', (SELECT id FROM categories WHERE slug = 'tv-stands'), '📺', 1),
  ('Wall Mount TV Units', 'Стенни ТВ модули', 'tv-wallmount', (SELECT id FROM categories WHERE slug = 'tv-stands'), '📺', 2),
  ('Entertainment Centers', 'Развлекателни центрове', 'tv-entertainment', (SELECT id FROM categories WHERE slug = 'tv-stands'), '📺', 3),
  ('Media Consoles', 'Медийни конзоли', 'tv-console', (SELECT id FROM categories WHERE slug = 'tv-stands'), '📺', 4),
  ('Floating Shelves', 'Плаващи рафтове', 'tv-floating', (SELECT id FROM categories WHERE slug = 'tv-stands'), '📺', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

END $$;
;
