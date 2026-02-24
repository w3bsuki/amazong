
-- =====================================================
-- HOBBIES COMPREHENSIVE EXPANSION - PART 1: L1 Categories
-- Total: 9 L1 categories with icons and Bulgarian names
-- =====================================================

-- Update Hobbies L0 icon and description
UPDATE categories SET 
  icon = '🎯',
  name_bg = 'Хобита',
  description = 'Crafts, models, games, music, and creative hobbies',
  description_bg = 'Занаяти, модели, игри, музика и творчески хобита',
  display_order = 22
WHERE slug = 'hobbies';

-- First, let's ensure we have the correct parent_id
DO $$
DECLARE
  hobbies_id UUID := '1f8594aa-0530-4a5a-b3ca-31cbe83bc055';
BEGIN
  
  -- Update existing L1 categories with better organization
  -- 1. Handmade & Crafts (already exists as 'handmade')
  UPDATE categories SET 
    name = 'Handmade & Crafts',
    name_bg = 'Ръчна изработка и занаяти',
    icon = '✂️',
    display_order = 1,
    description = 'Handmade jewelry, clothing, home décor, and craft supplies',
    description_bg = 'Ръчно изработени бижута, облекло, декорации и материали за занаяти'
  WHERE slug = 'handmade' AND parent_id = hobbies_id;

  -- 2. Trading Card Games (Play) - update existing
  UPDATE categories SET 
    name = 'Trading Card Games',
    name_bg = 'Търговски карти игри',
    icon = '🃏',
    display_order = 2,
    description = 'Pokemon, MTG, Yu-Gi-Oh! cards for playing and collecting',
    description_bg = 'Pokemon, MTG, Yu-Gi-Oh! карти за игра и колекция'
  WHERE slug = 'hobby-tcg' AND parent_id = hobbies_id;

  -- 3. Board Games & Puzzles - update existing 'hobby-tabletop'
  UPDATE categories SET 
    name = 'Board Games & Puzzles',
    name_bg = 'Настолни игри и пъзели',
    icon = '🎲',
    display_order = 3,
    description = 'Strategy, party, family games, and jigsaw puzzles',
    description_bg = 'Стратегически, парти, семейни игри и пъзели'
  WHERE slug = 'hobby-tabletop' AND parent_id = hobbies_id;

  -- 4. Model Building & RC - combine existing 'hobby-model-building' and 'hobby-rc-drones'
  UPDATE categories SET 
    name = 'Model Building & RC',
    name_bg = 'Моделизъм и RC',
    icon = '🚂',
    display_order = 4,
    description = 'Scale models, model kits, RC cars, drones, helicopters',
    description_bg = 'Мащабни модели, комплекти за моделизъм, RC коли, дронове'
  WHERE slug = 'hobby-model-building' AND parent_id = hobbies_id;

  -- 5. Musical Instruments (already exists)
  UPDATE categories SET 
    name = 'Musical Instruments',
    name_bg = 'Музикални инструменти',
    icon = '🎸',
    display_order = 5,
    description = 'Guitars, keyboards, drums, wind, and string instruments',
    description_bg = 'Китари, клавишни, барабани, духови и струнни инструменти'
  WHERE slug = 'musical-instruments' AND parent_id = hobbies_id;

  -- 6. Music & Vinyl (update existing 'movies-music')
  UPDATE categories SET 
    name = 'Music & Vinyl',
    name_bg = 'Музика и плочи',
    icon = '📀',
    display_order = 6,
    description = 'Vinyl records, CDs, cassettes, and music memorabilia',
    description_bg = 'Грамофонни плочи, CD-та, касети и музикални сувенири'
  WHERE slug = 'movies-music' AND parent_id = hobbies_id;

  -- 7. Books & Reading (already exists)
  UPDATE categories SET 
    name = 'Books & Reading',
    name_bg = 'Книги и четене',
    icon = '📚',
    display_order = 7,
    description = 'Fiction, non-fiction, rare books, and magazines',
    description_bg = 'Художествена, нехудожествена литература, редки книги и списания'
  WHERE slug = 'books' AND parent_id = hobbies_id;

  -- 8. Outdoor Hobbies - NEW L1
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Outdoor Hobbies', 'Хобита на открито', 'hobby-outdoor', hobbies_id, '🎣', 8, 
    'Fishing, hunting, birdwatching, and outdoor activities',
    'Риболов, лов, наблюдение на птици и дейности на открито')
  ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;

  -- 9. Creative Arts - NEW L1
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Creative Arts', 'Творчески изкуства', 'hobby-creative-arts', hobbies_id, '🎨', 9,
    'Painting, drawing, photography, calligraphy, and pottery',
    'Рисуване, чертане, фотография, калиграфия и грънчарство')
  ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;

  -- Remove/deprecate duplicate categories
  -- Mark 'hobby-collecting' as deprecated (should use Collectibles L0)
  UPDATE categories SET 
    name = '[DEPRECATED] Collecting',
    display_order = 9999
  WHERE slug = 'hobby-collecting' AND parent_id = hobbies_id;

  -- Mark 'hobby-scale-models' as deprecated (merged into model building)
  UPDATE categories SET 
    name = '[DEPRECATED] Scale Models',
    display_order = 9998
  WHERE slug = 'hobby-scale-models' AND parent_id = hobbies_id;

  -- Mark 'hobby-rc-drones' for reorganization under model building
  UPDATE categories SET 
    parent_id = (SELECT id FROM categories WHERE slug = 'hobby-model-building'),
    display_order = 10
  WHERE slug = 'hobby-rc-drones' AND parent_id = hobbies_id;

END $$;
;
