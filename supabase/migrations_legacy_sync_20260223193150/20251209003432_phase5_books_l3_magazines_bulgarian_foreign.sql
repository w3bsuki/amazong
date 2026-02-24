
-- Phase 5: Books - Magazines, Bulgarian Lit, Foreign Language L3 Categories

-- Magazines > Various Magazine L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Digital Photography', 'Film Photography', 'Art Magazines', 'Design Magazines']),
  unnest(ARRAY['magazines-photo-digital', 'magazines-photo-film', 'magazines-art-magazines', 'magazines-art-design']),
  (SELECT id FROM categories WHERE slug = 'magazines-art'),
  unnest(ARRAY['Дигитална фотография', 'Филмова фотография', 'Списания за изкуство', 'Дизайн списания']),
  '📚',
  generate_series(1, 4)
ON CONFLICT (slug) DO NOTHING;

-- Magazines > Business L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Finance Magazines', 'Entrepreneurship', 'Management', 'Marketing Magazines', 'Tech Business']),
  unnest(ARRAY['magazines-business-finance', 'magazines-business-entrepreneur', 'magazines-business-management', 'magazines-business-marketing', 'magazines-business-tech']),
  (SELECT id FROM categories WHERE slug = 'magazines-business'),
  unnest(ARRAY['Финансови списания', 'Предприемачество', 'Мениджмънт', 'Маркетинг списания', 'Технологичен бизнес']),
  '📚',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Magazines > Bulgarian L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Bulgarian News', 'Bulgarian Lifestyle', 'Bulgarian Sports', 'Bulgarian Culture', 'Bulgarian Science']),
  unnest(ARRAY['magazines-bulgarian-news', 'magazines-bulgarian-lifestyle', 'magazines-bulgarian-sports', 'magazines-bulgarian-culture', 'magazines-bulgarian-science']),
  (SELECT id FROM categories WHERE slug = 'magazines-bulgarian'),
  unnest(ARRAY['Новинарски списания', 'Лайфстайл списания', 'Спортни списания', 'Културни списания', 'Научни списания']),
  '📚',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Bulgarian Literature > Bulgarian Books L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Bulgarian Prose', 'Bulgarian Poetry', 'Bulgarian Drama', 'Bulgarian Essays', 'Bulgarian Short Stories']),
  unnest(ARRAY['bulgarian-books-prose', 'bulgarian-books-poetry', 'bulgarian-books-drama', 'bulgarian-books-essays', 'bulgarian-books-short']),
  (SELECT id FROM categories WHERE slug = 'bulgarian-books'),
  unnest(ARRAY['Българска проза', 'Българска поезия', 'Българска драма', 'Български есета', 'Български разкази']),
  '📚',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Bulgarian Literature > Bulgarian Classics L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Ivan Vazov', 'Aleko Konstantinov', 'Hristo Botev', 'Pencho Slaveykov', 'Yordan Yovkov', 'Elin Pelin', 'Dimitar Dimov']),
  unnest(ARRAY['bulgarian-classics-vazov', 'bulgarian-classics-aleko', 'bulgarian-classics-botev', 'bulgarian-classics-pencho', 'bulgarian-classics-yovkov', 'bulgarian-classics-elin', 'bulgarian-classics-dimov']),
  (SELECT id FROM categories WHERE slug = 'bulgarian-classics'),
  unnest(ARRAY['Иван Вазов', 'Алеко Константинов', 'Христо Ботев', 'Пенчо Славейков', 'Йордан Йовков', 'Елин Пелин', 'Димитър Димов']),
  '📚',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Foreign Language > English L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['British Authors', 'American Authors', 'Australian Authors', 'Canadian Authors', 'Irish Authors']),
  unnest(ARRAY['foreign-english-british', 'foreign-english-american', 'foreign-english-australian', 'foreign-english-canadian', 'foreign-english-irish']),
  (SELECT id FROM categories WHERE slug = 'foreign-english'),
  unnest(ARRAY['Британски автори', 'Американски автори', 'Австралийски автори', 'Канадски автори', 'Ирландски автори']),
  '📚',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Foreign Language > French L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Classic French', 'Contemporary French', 'French Philosophy', 'French Poetry', 'French Crime']),
  unnest(ARRAY['foreign-french-classic', 'foreign-french-contemporary', 'foreign-french-philosophy', 'foreign-french-poetry', 'foreign-french-crime']),
  (SELECT id FROM categories WHERE slug = 'foreign-french'),
  unnest(ARRAY['Класическа френска', 'Съвременна френска', 'Френска философия', 'Френска поезия', 'Френски криминални']),
  '📚',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;
;
