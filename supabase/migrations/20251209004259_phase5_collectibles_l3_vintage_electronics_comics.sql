
-- Phase 5: Collectibles - Vintage Electronics, Comics & Vintage Clothing L3s

-- Vintage Electronics > Vintage Computers L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Apple II', 'Commodore 64', 'Atari Computers', 'IBM PC Compatibles', 'Amiga', 'ZX Spectrum', 'TRS-80', 'Pravetz']),
  unnest(ARRAY['vint-comp-apple2', 'vint-comp-c64', 'vint-comp-atari', 'vint-comp-ibm', 'vint-comp-amiga', 'vint-comp-zx', 'vint-comp-trs80', 'vint-comp-pravetz']),
  (SELECT id FROM categories WHERE slug = 'vintage-computers'),
  unnest(ARRAY['Apple II', 'Commodore 64', 'Atari компютри', 'IBM PC съвместими', 'Amiga', 'ZX Spectrum', 'TRS-80', 'Правец']),
  '💻',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Vintage Electronics > Retro Gaming L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Nintendo NES', 'Super Nintendo', 'Sega Genesis', 'Atari 2600', 'PlayStation 1', 'Nintendo 64', 'Sega Dreamcast', 'Game Boy']),
  unnest(ARRAY['vint-game-nes', 'vint-game-snes', 'vint-game-genesis', 'vint-game-atari', 'vint-game-ps1', 'vint-game-n64', 'vint-game-dreamcast', 'vint-game-gameboy']),
  (SELECT id FROM categories WHERE slug = 'vintage-gaming'),
  unnest(ARRAY['Nintendo NES', 'Super Nintendo', 'Sega Genesis', 'Atari 2600', 'PlayStation 1', 'Nintendo 64', 'Sega Dreamcast', 'Game Boy']),
  '🎮',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Vintage Electronics > Vintage Audio L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Turntables', 'Vintage Amplifiers', 'Reel-to-Reel', 'Cassette Decks', 'Vintage Speakers', 'Tube Equipment', 'Vintage Receivers', 'Walkmans']),
  unnest(ARRAY['vint-audio-turntable', 'vint-audio-amp', 'vint-audio-reel', 'vint-audio-cassette', 'vint-audio-speakers', 'vint-audio-tubes', 'vint-audio-receiver', 'vint-audio-walkman']),
  (SELECT id FROM categories WHERE slug = 'vintage-audio'),
  unnest(ARRAY['Грамофони', 'Винтидж усилватели', 'Макарни магнетофони', 'Касетофони', 'Винтидж тонколони', 'Лампова техника', 'Винтидж ресийвъри', 'Уокмани']),
  '🎵',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Vintage Electronics > Vintage Cameras L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['35mm Film Cameras', 'Medium Format', 'Large Format', 'Polaroid', 'Rangefinders', 'SLR Film Cameras', 'Movie Cameras', 'Bulgarian Cameras']),
  unnest(ARRAY['vint-cam-35mm', 'vint-cam-medium', 'vint-cam-large', 'vint-cam-polaroid', 'vint-cam-range', 'vint-cam-slr', 'vint-cam-movie', 'vint-cam-bg']),
  (SELECT id FROM categories WHERE slug = 'vintage-cameras'),
  unnest(ARRAY['35мм филмови камери', 'Среден формат', 'Голям формат', 'Полароид', 'Далекомерни', 'SLR филмови камери', 'Кинокамери', 'Български фотоапарати']),
  '📷',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Vintage Electronics > Vintage Phones L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Rotary Phones', 'Wall Phones', 'Payphones', 'Early Mobile Phones', 'Telegraphy Equipment', 'Vintage Answering Machines']),
  unnest(ARRAY['vint-phone-rotary', 'vint-phone-wall', 'vint-phone-pay', 'vint-phone-mobile', 'vint-phone-telegraph', 'vint-phone-answer']),
  (SELECT id FROM categories WHERE slug = 'vintage-phones'),
  unnest(ARRAY['Телефони с шайба', 'Стенни телефони', 'Таксофони', 'Ранни мобилни телефони', 'Телеграфна техника', 'Винтидж секретари']),
  '📞',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Comics > DC Comics L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Batman Comics', 'Superman Comics', 'Wonder Woman', 'Justice League', 'Flash Comics', 'Green Lantern', 'Aquaman', 'DC Vintage']),
  unnest(ARRAY['comics-dc-batman', 'comics-dc-superman', 'comics-dc-ww', 'comics-dc-justice', 'comics-dc-flash', 'comics-dc-gl', 'comics-dc-aquaman', 'comics-dc-vintage']),
  (SELECT id FROM categories WHERE slug = 'comics-dc'),
  unnest(ARRAY['Батман комикси', 'Супермен комикси', 'Уондър Уумън', 'Лигата на справедливостта', 'Флаш комикси', 'Зелен фенер', 'Аквамен', 'DC винтидж']),
  '🦇',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Comics > Marvel Comics L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Spider-Man Comics', 'X-Men Comics', 'Avengers Comics', 'Iron Man', 'Captain America', 'Hulk Comics', 'Thor Comics', 'Marvel Vintage']),
  unnest(ARRAY['comics-marvel-spidey', 'comics-marvel-xmen', 'comics-marvel-avengers', 'comics-marvel-ironman', 'comics-marvel-cap', 'comics-marvel-hulk', 'comics-marvel-thor', 'comics-marvel-vintage']),
  (SELECT id FROM categories WHERE slug = 'comics-marvel'),
  unnest(ARRAY['Спайдърмен комикси', 'X-Men комикси', 'Avengers комикси', 'Железния човек', 'Капитан Америка', 'Хълк комикси', 'Тор комикси', 'Марвел винтидж']),
  '🕷️',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Comics > Manga L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Shonen Manga', 'Shojo Manga', 'Seinen Manga', 'Josei Manga', 'Kodomo Manga', 'Classic Manga', 'Complete Sets']),
  unnest(ARRAY['comics-manga-shonen', 'comics-manga-shojo', 'comics-manga-seinen', 'comics-manga-josei', 'comics-manga-kodomo', 'comics-manga-classic', 'comics-manga-sets']),
  (SELECT id FROM categories WHERE slug = 'comics-manga'),
  unnest(ARRAY['Шонен манга', 'Шоджо манга', 'Сейнен манга', 'Джосей манга', 'Кодомо манга', 'Класическа манга', 'Пълни комплекти']),
  '🎌',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Comics > Independent Comics L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Image Comics', 'Dark Horse', 'IDW Publishing', 'Valiant Comics', 'Boom! Studios', 'Indie Creators']),
  unnest(ARRAY['comics-indie-image', 'comics-indie-dark', 'comics-indie-idw', 'comics-indie-valiant', 'comics-indie-boom', 'comics-indie-creators']),
  (SELECT id FROM categories WHERE slug = 'comics-indie'),
  unnest(ARRAY['Image Comics', 'Dark Horse', 'IDW Publishing', 'Valiant Comics', 'Boom! Studios', 'Независими автори']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Vintage Clothing > Eras L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['1920s Fashion', '1930s-1940s Fashion', '1950s Fashion', '1960s Fashion', '1970s Fashion', '1980s Fashion', '1990s Fashion']),
  unnest(ARRAY['vcloth-era-1920', 'vcloth-era-3040', 'vcloth-era-1950', 'vcloth-era-1960', 'vcloth-era-1970', 'vcloth-era-1980', 'vcloth-era-1990']),
  (SELECT id FROM categories WHERE slug = 'vintage-clothing-eras'),
  unnest(ARRAY['Мода 1920-те', 'Мода 1930-1940', 'Мода 1950-те', 'Мода 1960-те', 'Мода 1970-те', 'Мода 1980-те', 'Мода 1990-те']),
  '👗',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Vintage Clothing > Designer L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Chanel Vintage', 'Dior Vintage', 'Gucci Vintage', 'Versace Vintage', 'Yves Saint Laurent', 'Hermès Vintage', 'Other Designers']),
  unnest(ARRAY['vcloth-design-chanel', 'vcloth-design-dior', 'vcloth-design-gucci', 'vcloth-design-versace', 'vcloth-design-ysl', 'vcloth-design-hermes', 'vcloth-design-other']),
  (SELECT id FROM categories WHERE slug = 'vintage-clothing-designer'),
  unnest(ARRAY['Шанел винтидж', 'Диор винтидж', 'Гучи винтидж', 'Версаче винтидж', 'Ив Сен Лоран', 'Ермес винтидж', 'Други дизайнери']),
  '👜',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;
;
