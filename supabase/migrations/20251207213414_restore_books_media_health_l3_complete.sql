-- Restore Books & Media L3 categories

-- Fiction Books L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Romance', 'books-romance', 'Романтика', 1),
  ('Mystery & Thriller', 'books-mystery', 'Мистерия и трилър', 2),
  ('Science Fiction', 'books-scifi', 'Научна фантастика', 3),
  ('Fantasy', 'books-fantasy', 'Фентъзи', 4),
  ('Horror', 'books-horror', 'Хорър', 5),
  ('Historical Fiction', 'books-historical', 'Исторически роман', 6),
  ('Literary Fiction', 'books-literary', 'Художествена литература', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'books-fiction'
ON CONFLICT (slug) DO NOTHING;

-- Non-Fiction Books L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Biography', 'books-biography', 'Биографии', 1),
  ('Self-Help', 'books-self-help', 'Самопомощ', 2),
  ('Business', 'books-business', 'Бизнес', 3),
  ('Science', 'books-science', 'Наука', 4),
  ('History', 'books-history', 'История', 5),
  ('Travel', 'books-travel', 'Пътешествия', 6),
  ('Cooking', 'books-cooking', 'Готварство', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'books-nonfiction'
ON CONFLICT (slug) DO NOTHING;

-- Music L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Vinyl Records', 'music-vinyl', 'Грамофонни плочи', 1),
  ('CDs', 'music-cds', 'Компактдискове', 2),
  ('Cassettes', 'music-cassettes', 'Касети', 3),
  ('Music Box Sets', 'music-box-sets', 'Музикални комплекти', 4),
  ('Limited Editions', 'music-limited', 'Лимитирани издания', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'media-music'
ON CONFLICT (slug) DO NOTHING;

-- Movies L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Blu-ray', 'movies-bluray', 'Blu-ray', 1),
  ('DVD', 'movies-dvd', 'DVD', 2),
  ('4K UHD', 'movies-4k', '4K UHD', 3),
  ('TV Series', 'movies-tv-series', 'Телевизионни сериали', 4),
  ('Documentaries', 'movies-documentaries', 'Документални филми', 5),
  ('Anime', 'movies-anime', 'Аниме', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'media-movies'
ON CONFLICT (slug) DO NOTHING;

-- Health & Wellness L3 - Vitamins
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Multivitamins', 'vitamins-multi', 'Мултивитамини', 1),
  ('Vitamin D', 'vitamins-d', 'Витамин D', 2),
  ('Vitamin C', 'vitamins-c', 'Витамин C', 3),
  ('B Vitamins', 'vitamins-b', 'B витамини', 4),
  ('Omega-3', 'vitamins-omega', 'Омега-3', 5),
  ('Probiotics', 'vitamins-probiotics', 'Пробиотици', 6),
  ('Minerals', 'vitamins-minerals', 'Минерали', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'health-vitamins'
ON CONFLICT (slug) DO NOTHING;

-- Health Equipment L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Blood Pressure Monitors', 'health-bp-monitors', 'Апарати за кръвно', 1),
  ('Glucose Monitors', 'health-glucose', 'Глюкомери', 2),
  ('Thermometers', 'health-thermometers', 'Термометри', 3),
  ('Pulse Oximeters', 'health-oximeters', 'Пулсоксиметри', 4),
  ('Scales', 'health-scales', 'Кантари', 5),
  ('TENS Units', 'health-tens', 'TENS апарати', 6),
  ('Nebulizers', 'health-nebulizers', 'Инхалатори', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'health-equipment'
ON CONFLICT (slug) DO NOTHING;

-- Medical Supplies L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('First Aid', 'medical-first-aid', 'Първа помощ', 1),
  ('Bandages', 'medical-bandages', 'Превръзки', 2),
  ('Masks', 'medical-masks', 'Маски', 3),
  ('Gloves', 'medical-gloves', 'Ръкавици', 4),
  ('Braces & Supports', 'medical-braces', 'Ортези', 5),
  ('Mobility Aids', 'medical-mobility', 'Помощни средства', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'health-medical'
ON CONFLICT (slug) DO NOTHING;

-- Personal Care L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Oral Care', 'personal-oral', 'Грижа за устата', 1),
  ('Hair Care', 'personal-hair-care', 'Грижа за косата', 2),
  ('Body Care', 'personal-body', 'Грижа за тялото', 3),
  ('Shaving', 'personal-shaving', 'Бръснене', 4),
  ('Feminine Care', 'personal-feminine', 'Дамска хигиена', 5),
  ('Deodorants', 'personal-deodorants', 'Дезодоранти', 6),
  ('Sun Care', 'personal-sun', 'Слънцезащита', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'health-personal-care'
ON CONFLICT (slug) DO NOTHING;;
