
-- Phase 5: Movies & Music - Formats L3s (Blu-ray, 4K, CDs)

-- Blu-ray > Action & Adventure L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Marvel Blu-ray', 'DC Blu-ray', 'Bond Films', 'Fast & Furious', 'Mission Impossible', 'Martial Arts']),
  unnest(ARRAY['bluray-action-marvel', 'bluray-action-dc', 'bluray-action-bond', 'bluray-action-ff', 'bluray-action-mi', 'bluray-action-martial']),
  (SELECT id FROM categories WHERE slug = 'bluray-action'),
  unnest(ARRAY['Марвел', 'DC', 'Бонд филми', 'Бързи и яростни', 'Мисията невъзможна', 'Бойни изкуства']),
  '🎬',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Blu-ray > Sci-Fi & Fantasy L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Star Wars Blu-ray', 'Star Trek Blu-ray', 'Lord of the Rings', 'Harry Potter', 'Alien Franchise', 'Classic Sci-Fi']),
  unnest(ARRAY['bluray-scifi-starwars', 'bluray-scifi-startrek', 'bluray-scifi-lotr', 'bluray-scifi-hp', 'bluray-scifi-alien', 'bluray-scifi-classic']),
  (SELECT id FROM categories WHERE slug = 'bluray-scifi'),
  unnest(ARRAY['Междузвездни войни', 'Стар Трек', 'Властелинът на пръстените', 'Хари Потър', 'Пришълец франчайз', 'Класическа фантастика']),
  '🚀',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Blu-ray > Horror L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Slasher Films', 'Supernatural Horror', 'Psychological Horror', 'Zombie Films', 'Classic Horror', 'Horror Collections']),
  unnest(ARRAY['bluray-horror-slasher', 'bluray-horror-supernatural', 'bluray-horror-psych', 'bluray-horror-zombie', 'bluray-horror-classic', 'bluray-horror-collections']),
  (SELECT id FROM categories WHERE slug = 'bluray-horror'),
  unnest(ARRAY['Слашъри', 'Свръхестествени ужаси', 'Психологически ужаси', 'Зомби филми', 'Класически ужаси', 'Хорър колекции']),
  '👻',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- CDs > Rock L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Classic Rock CDs', 'Hard Rock CDs', 'Progressive Rock CDs', 'Alternative Rock CDs', 'Punk Rock CDs', 'Indie Rock CDs']),
  unnest(ARRAY['cd-rock-classic', 'cd-rock-hard', 'cd-rock-prog', 'cd-rock-alt', 'cd-rock-punk', 'cd-rock-indie']),
  (SELECT id FROM categories WHERE slug = 'cd-rock'),
  unnest(ARRAY['Класически рок', 'Хард рок', 'Прогресив рок', 'Алтернативен рок', 'Пънк рок', 'Инди рок']),
  '🎸',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- CDs > Metal L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Heavy Metal CDs', 'Thrash Metal CDs', 'Death Metal CDs', 'Black Metal CDs', 'Power Metal CDs', 'Doom Metal CDs']),
  unnest(ARRAY['cd-metal-heavy', 'cd-metal-thrash', 'cd-metal-death', 'cd-metal-black', 'cd-metal-power', 'cd-metal-doom']),
  (SELECT id FROM categories WHERE slug = 'cd-metal'),
  unnest(ARRAY['Хеви метъл', 'Траш метъл', 'Дет метъл', 'Блек метъл', 'Пауър метъл', 'Дуум метъл']),
  '🤘',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- CDs > Electronic L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['EDM CDs', 'House CDs', 'Techno CDs', 'Trance CDs', 'Ambient CDs', 'Synthwave CDs']),
  unnest(ARRAY['cd-elec-edm', 'cd-elec-house', 'cd-elec-techno', 'cd-elec-trance', 'cd-elec-ambient', 'cd-elec-synthwave']),
  (SELECT id FROM categories WHERE slug = 'cd-electronic'),
  unnest(ARRAY['EDM', 'Хаус', 'Техно', 'Транс', 'Амбиент', 'Синтуейв']),
  '🎧',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- CDs > Classical L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Symphonies', 'Concertos', 'Chamber Music', 'Opera', 'Choral', 'Solo Instrumental']),
  unnest(ARRAY['cd-class-symphony', 'cd-class-concerto', 'cd-class-chamber', 'cd-class-opera', 'cd-class-choral', 'cd-class-solo']),
  (SELECT id FROM categories WHERE slug = 'cd-classical'),
  unnest(ARRAY['Симфонии', 'Концерти', 'Камерна музика', 'Опера', 'Хорова', 'Солова инструментална']),
  '🎻',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- CDs > Jazz L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Classic Jazz', 'Bebop', 'Cool Jazz', 'Fusion Jazz', 'Vocal Jazz', 'Contemporary Jazz']),
  unnest(ARRAY['cd-jazz-classic', 'cd-jazz-bebop', 'cd-jazz-cool', 'cd-jazz-fusion', 'cd-jazz-vocal', 'cd-jazz-contemporary']),
  (SELECT id FROM categories WHERE slug = 'cd-jazz'),
  unnest(ARRAY['Класически джаз', 'Бибоп', 'Кул джаз', 'Фюжън джаз', 'Вокален джаз', 'Съвременен джаз']),
  '🎷',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Audio Equipment > Turntables L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Belt Drive Turntables', 'Direct Drive Turntables', 'Portable Turntables', 'DJ Turntables', 'Turntable Accessories', 'Cartridges & Stylus']),
  unnest(ARRAY['turntables-belt', 'turntables-direct', 'turntables-portable', 'turntables-dj', 'turntables-accessories', 'turntables-cartridge']),
  (SELECT id FROM categories WHERE slug = 'audio-turntables'),
  unnest(ARRAY['Ремъчни грамофони', 'Директен привод', 'Преносими грамофони', 'DJ грамофони', 'Аксесоари за грамофони', 'Глави и игли']),
  '📀',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Audio Equipment > Speakers L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Bookshelf Speakers', 'Floor Standing Speakers', 'Powered Speakers', 'Bluetooth Speakers', 'Subwoofers', 'Speaker Stands']),
  unnest(ARRAY['speakers-bookshelf', 'speakers-floor', 'speakers-powered', 'speakers-bluetooth', 'speakers-subwoofer', 'speakers-stands']),
  (SELECT id FROM categories WHERE slug = 'audio-speakers'),
  unnest(ARRAY['Рафтови тонколони', 'Подови тонколони', 'Активни тонколони', 'Блутут тонколони', 'Субуфери', 'Стойки за тонколони']),
  '🔊',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
