
-- Phase 5: Books - Children's Books & Textbooks L3 Categories

-- Children's Books > Activity Books L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Coloring Books', 'Sticker Books', 'Puzzle Books', 'Craft Books', 'Workbooks', 'Maze Books']),
  unnest(ARRAY['children-activity-coloring', 'children-activity-sticker', 'children-activity-puzzle', 'children-activity-craft', 'children-activity-workbook', 'children-activity-maze']),
  (SELECT id FROM categories WHERE slug = 'children-activity'),
  unnest(ARRAY['Книжки за оцветяване', 'Книжки със стикери', 'Книжки с пъзели', 'Занаятчийски книжки', 'Работни тетрадки', 'Книжки с лабиринти']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Children's Books > Board Books L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Touch and Feel', 'First Words', 'Animal Board Books', 'Colors & Shapes', 'Numbers', 'Bedtime Stories']),
  unnest(ARRAY['children-board-touch', 'children-board-words', 'children-board-animal', 'children-board-colors', 'children-board-numbers', 'children-board-bedtime']),
  (SELECT id FROM categories WHERE slug = 'children-board-books'),
  unnest(ARRAY['Докоснете и усетете', 'Първи думи', 'Животински книжки', 'Цветове и форми', 'Числа', 'Приказки за лека нощ']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Children's Books > Fairy Tales L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Classic Fairy Tales', 'Bulgarian Folk Tales', 'World Folk Tales', 'Modern Fairy Tales', 'Princess Stories', 'Fables']),
  unnest(ARRAY['children-fairy-classic', 'children-fairy-bulgarian', 'children-fairy-world', 'children-fairy-modern', 'children-fairy-princess', 'children-fairy-fables']),
  (SELECT id FROM categories WHERE slug = 'children-fairy-tales'),
  unnest(ARRAY['Класически приказки', 'Български народни приказки', 'Световни народни приказки', 'Модерни приказки', 'Принцески истории', 'Басни']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Textbooks > College Textbooks L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Medical Textbooks', 'Law Textbooks', 'Economics Textbooks', 'Psychology Textbooks', 'History Textbooks', 'Science Textbooks', 'Literature Studies', 'Political Science']),
  unnest(ARRAY['textbooks-medical', 'textbooks-law', 'textbooks-economics', 'textbooks-psychology', 'textbooks-history', 'textbooks-science', 'textbooks-literature', 'textbooks-political']),
  (SELECT id FROM categories WHERE slug = 'college-textbooks'),
  unnest(ARRAY['Медицински учебници', 'Правни учебници', 'Икономически учебници', 'Учебници по психология', 'Учебници по история', 'Научни учебници', 'Литературознание', 'Политология']),
  '📚',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Textbooks > Computer Science L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Programming Languages', 'Data Structures', 'Algorithms', 'Database Systems', 'Web Development', 'Machine Learning', 'Cybersecurity', 'Software Engineering']),
  unnest(ARRAY['textbooks-cs-programming', 'textbooks-cs-data', 'textbooks-cs-algorithms', 'textbooks-cs-database', 'textbooks-cs-web', 'textbooks-cs-ml', 'textbooks-cs-security', 'textbooks-cs-software']),
  (SELECT id FROM categories WHERE slug = 'cs-textbooks'),
  unnest(ARRAY['Езици за програмиране', 'Структури от данни', 'Алгоритми', 'Бази данни', 'Уеб разработка', 'Машинно обучение', 'Киберсигурност', 'Софтуерно инженерство']),
  '📚',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Textbooks > Engineering L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Aerospace Engineering', 'Industrial Engineering', 'Biomedical Engineering']),
  unnest(ARRAY['textbooks-eng-mechanical', 'textbooks-eng-electrical', 'textbooks-eng-civil', 'textbooks-eng-chemical', 'textbooks-eng-aerospace', 'textbooks-eng-industrial', 'textbooks-eng-biomedical']),
  (SELECT id FROM categories WHERE slug = 'engineering-textbooks'),
  unnest(ARRAY['Машиностроене', 'Електротехника', 'Строително инженерство', 'Химическо инженерство', 'Авиационно инженерство', 'Индустриално инженерство', 'Биомедицинско инженерство']),
  '📚',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;
;
