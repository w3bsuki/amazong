
-- Phase 5: Books - Fiction L3 Categories
-- Add L3 subcategories for all Fiction L2 categories

-- Fiction > Adventure L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Survival Adventure', 'Exploration Adventure', 'Historical Adventure', 'Sea Adventure', 'Jungle Adventure', 'Wilderness Adventure']),
  unnest(ARRAY['fiction-adventure-survival', 'fiction-adventure-exploration', 'fiction-adventure-historical', 'fiction-adventure-sea', 'fiction-adventure-jungle', 'fiction-adventure-wilderness']),
  (SELECT id FROM categories WHERE slug = 'fiction-adventure'),
  unnest(ARRAY['Приключения за оцеляване', 'Изследователски приключения', 'Исторически приключения', 'Морски приключения', 'Джунглови приключения', 'Пустинни приключения']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Fiction > Classics L3s  
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['19th Century Classics', '20th Century Classics', 'Victorian Classics', 'Russian Classics', 'American Classics', 'British Classics', 'French Classics', 'World Classics']),
  unnest(ARRAY['fiction-classics-19th', 'fiction-classics-20th', 'fiction-classics-victorian', 'fiction-classics-russian', 'fiction-classics-american', 'fiction-classics-british', 'fiction-classics-french', 'fiction-classics-world']),
  (SELECT id FROM categories WHERE slug = 'fiction-classics'),
  unnest(ARRAY['Класика от 19 век', 'Класика от 20 век', 'Викторианска класика', 'Руска класика', 'Американска класика', 'Британска класика', 'Френска класика', 'Световна класика']),
  '📚',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Fiction > Fantasy L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Epic Fantasy', 'Urban Fantasy', 'Dark Fantasy', 'High Fantasy', 'Sword & Sorcery', 'Mythological Fantasy', 'Romantic Fantasy', 'Young Adult Fantasy']),
  unnest(ARRAY['fiction-fantasy-epic', 'fiction-fantasy-urban', 'fiction-fantasy-dark', 'fiction-fantasy-high', 'fiction-fantasy-sword-sorcery', 'fiction-fantasy-mythology', 'fiction-fantasy-romantic', 'fiction-fantasy-ya']),
  (SELECT id FROM categories WHERE slug = 'fiction-fantasy'),
  unnest(ARRAY['Епична фентъзи', 'Градска фентъзи', 'Тъмна фентъзи', 'Висша фентъзи', 'Меч и магия', 'Митологична фентъзи', 'Романтична фентъзи', 'Младежка фентъзи']),
  '📚',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Fiction > Contemporary L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Literary Fiction', 'Domestic Fiction', 'Family Saga', 'Coming of Age', 'Psychological Fiction', 'Social Issues', 'Multicultural Fiction']),
  unnest(ARRAY['fiction-contemporary-literary', 'fiction-contemporary-domestic', 'fiction-contemporary-saga', 'fiction-contemporary-coming-of-age', 'fiction-contemporary-psychological', 'fiction-contemporary-social', 'fiction-contemporary-multicultural']),
  (SELECT id FROM categories WHERE slug = 'fiction-contemporary'),
  unnest(ARRAY['Литературна проза', 'Битова проза', 'Семейна сага', 'Роман за израстването', 'Психологическа проза', 'Социални теми', 'Мултикултурна проза']),
  '📚',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Fiction > Bulgarian Fiction L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Contemporary Bulgarian', 'Bulgarian Classics', 'Bulgarian Historical Fiction', 'Bulgarian Crime', 'Bulgarian Romance', 'Bulgarian Fantasy']),
  unnest(ARRAY['fiction-bulgarian-contemporary', 'fiction-bulgarian-classics', 'fiction-bulgarian-historical', 'fiction-bulgarian-crime', 'fiction-bulgarian-romance', 'fiction-bulgarian-fantasy']),
  (SELECT id FROM categories WHERE slug = 'fiction-bulgarian'),
  unnest(ARRAY['Съвременна българска проза', 'Българска класика', 'Българска историческа проза', 'Български криминални', 'Български любовни', 'Българска фентъзи']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
