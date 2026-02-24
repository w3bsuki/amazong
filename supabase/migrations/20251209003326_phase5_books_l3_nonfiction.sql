
-- Phase 5: Books - Non-Fiction L3 Categories

-- Non-Fiction > Art & Photography L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Fine Art', 'Photography Techniques', 'Art History', 'Contemporary Art', 'Graphic Design', 'Architecture Books', 'Museum Catalogs', 'Artist Monographs']),
  unnest(ARRAY['nonfiction-art-fine', 'nonfiction-art-photo', 'nonfiction-art-history', 'nonfiction-art-contemporary', 'nonfiction-art-design', 'nonfiction-art-architecture', 'nonfiction-art-museum', 'nonfiction-art-monographs']),
  (SELECT id FROM categories WHERE slug = 'nonfiction-art'),
  unnest(ARRAY['Изящно изкуство', 'Фотографски техники', 'История на изкуството', 'Съвременно изкуство', 'Графичен дизайн', 'Архитектура', 'Музейни каталози', 'Художници монографии']),
  '📚',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Non-Fiction > Biography & Memoir L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Political Biographies', 'Celebrity Biographies', 'Historical Biographies', 'Sports Biographies', 'Business Leaders', 'Artists & Musicians', 'Personal Memoirs', 'Royal Biographies']),
  unnest(ARRAY['nonfiction-bio-political', 'nonfiction-bio-celebrity', 'nonfiction-bio-historical', 'nonfiction-bio-sports', 'nonfiction-bio-business', 'nonfiction-bio-artists', 'nonfiction-bio-memoirs', 'nonfiction-bio-royal']),
  (SELECT id FROM categories WHERE slug = 'nonfiction-biography'),
  unnest(ARRAY['Политически биографии', 'Биографии на знаменитости', 'Исторически биографии', 'Спортни биографии', 'Бизнес лидери', 'Художници и музиканти', 'Лични мемоари', 'Кралски биографии']),
  '📚',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Non-Fiction > Business & Economics L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Entrepreneurship', 'Management', 'Marketing', 'Finance & Investing', 'Leadership', 'Economics', 'Personal Finance', 'Real Estate Investing', 'Startups']),
  unnest(ARRAY['nonfiction-business-entrepreneur', 'nonfiction-business-management', 'nonfiction-business-marketing', 'nonfiction-business-finance', 'nonfiction-business-leadership', 'nonfiction-business-economics', 'nonfiction-business-personal-finance', 'nonfiction-business-real-estate', 'nonfiction-business-startups']),
  (SELECT id FROM categories WHERE slug = 'nonfiction-business'),
  unnest(ARRAY['Предприемачество', 'Мениджмънт', 'Маркетинг', 'Финанси и инвестиции', 'Лидерство', 'Икономика', 'Лични финанси', 'Инвестиции в имоти', 'Стартъпи']),
  '📚',
  generate_series(1, 9)
ON CONFLICT (slug) DO NOTHING;

-- Non-Fiction > Cooking & Food L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Baking', 'World Cuisines', 'Healthy Cooking', 'Vegetarian & Vegan', 'Quick & Easy', 'Desserts', 'Bulgarian Recipes', 'Beverages & Cocktails', 'Celebrity Chefs']),
  unnest(ARRAY['nonfiction-cooking-baking', 'nonfiction-cooking-world', 'nonfiction-cooking-healthy', 'nonfiction-cooking-vegetarian', 'nonfiction-cooking-quick', 'nonfiction-cooking-desserts', 'nonfiction-cooking-bulgarian', 'nonfiction-cooking-beverages', 'nonfiction-cooking-celebrity']),
  (SELECT id FROM categories WHERE slug = 'nonfiction-cooking'),
  unnest(ARRAY['Печене', 'Световни кухни', 'Здравословна кухня', 'Вегетарианска и веган', 'Бързи рецепти', 'Десерти', 'Български рецепти', 'Напитки и коктейли', 'Знаменити готвачи']),
  '📚',
  generate_series(1, 9)
ON CONFLICT (slug) DO NOTHING;
;
