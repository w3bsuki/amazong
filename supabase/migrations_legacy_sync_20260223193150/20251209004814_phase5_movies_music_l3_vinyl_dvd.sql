
-- Phase 5: Movies & Music - Vinyl & DVD L3s

-- Let's check what Vinyl L2s exist first
-- Adding L3s to common vinyl categories

-- Vinyl Records by genre typically need artist/label breakdown
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['1960s Rock Vinyl', '1970s Rock Vinyl', '1980s Rock Vinyl', '1990s Rock Vinyl', 'Modern Rock Vinyl', 'Rock Reissues']),
  unnest(ARRAY['vinyl-rock-60s', 'vinyl-rock-70s', 'vinyl-rock-80s', 'vinyl-rock-90s', 'vinyl-rock-modern', 'vinyl-rock-reissue']),
  (SELECT id FROM categories WHERE slug = 'vinyl-rock'),
  unnest(ARRAY['Рок 60-те', 'Рок 70-те', 'Рок 80-те', 'Рок 90-те', 'Съвременен рок', 'Рок преиздания']),
  '💿',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Vinyl Jazz L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Blue Note Records', 'Prestige Records', 'Impulse Records', 'ECM Records', 'Contemporary Jazz Vinyl', 'Jazz Reissues']),
  unnest(ARRAY['vinyl-jazz-bluenote', 'vinyl-jazz-prestige', 'vinyl-jazz-impulse', 'vinyl-jazz-ecm', 'vinyl-jazz-contemporary', 'vinyl-jazz-reissue']),
  (SELECT id FROM categories WHERE slug = 'vinyl-jazz'),
  unnest(ARRAY['Blue Note Records', 'Prestige Records', 'Impulse Records', 'ECM Records', 'Съвременен джаз винил', 'Джаз преиздания']),
  '🎺',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Vinyl Classical L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Deutsche Grammophon', 'Decca Records', 'EMI Classics', 'RCA Red Seal', 'Contemporary Classical', 'Classical Box Sets']),
  unnest(ARRAY['vinyl-class-dg', 'vinyl-class-decca', 'vinyl-class-emi', 'vinyl-class-rca', 'vinyl-class-contemporary', 'vinyl-class-boxset']),
  (SELECT id FROM categories WHERE slug = 'vinyl-classical'),
  unnest(ARRAY['Deutsche Grammophon', 'Decca Records', 'EMI Classics', 'RCA Red Seal', 'Съвременна класика', 'Класически бокс сетове']),
  '🎼',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Vinyl Electronic L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['House Vinyl', 'Techno Vinyl', 'Trance Vinyl', 'Ambient Vinyl', 'IDM Vinyl', 'Electro Vinyl']),
  unnest(ARRAY['vinyl-elec-house', 'vinyl-elec-techno', 'vinyl-elec-trance', 'vinyl-elec-ambient', 'vinyl-elec-idm', 'vinyl-elec-electro']),
  (SELECT id FROM categories WHERE slug = 'vinyl-electronic'),
  unnest(ARRAY['Хаус винил', 'Техно винил', 'Транс винил', 'Амбиент винил', 'IDM винил', 'Електро винил']),
  '🎛️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- DVD Movies - Genre L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Hollywood Action', 'Asian Action', 'War Films', 'Spy Films', 'Disaster Films', 'Action Collections']),
  unnest(ARRAY['dvd-action-hollywood', 'dvd-action-asian', 'dvd-action-war', 'dvd-action-spy', 'dvd-action-disaster', 'dvd-action-collections']),
  (SELECT id FROM categories WHERE slug = 'dvd-action'),
  unnest(ARRAY['Холивудски екшъни', 'Азиатски екшъни', 'Военни филми', 'Шпионски филми', 'Филми за бедствия', 'Екшън колекции']),
  '🎬',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- DVD Comedy L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Romantic Comedy', 'Slapstick Comedy', 'Dark Comedy', 'Parody Films', 'Stand-Up Comedy', 'Comedy Collections']),
  unnest(ARRAY['dvd-comedy-romantic', 'dvd-comedy-slapstick', 'dvd-comedy-dark', 'dvd-comedy-parody', 'dvd-comedy-standup', 'dvd-comedy-collections']),
  (SELECT id FROM categories WHERE slug = 'dvd-comedy'),
  unnest(ARRAY['Романтични комедии', 'Слапстик комедии', 'Черни комедии', 'Пародии', 'Стендъп комедия', 'Комедийни колекции']),
  '😂',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- DVD Drama L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Period Drama', 'Biographical Drama', 'Courtroom Drama', 'Family Drama', 'Independent Drama', 'Award Winners']),
  unnest(ARRAY['dvd-drama-period', 'dvd-drama-bio', 'dvd-drama-court', 'dvd-drama-family', 'dvd-drama-indie', 'dvd-drama-awards']),
  (SELECT id FROM categories WHERE slug = 'dvd-drama'),
  unnest(ARRAY['Исторически драми', 'Биографични драми', 'Съдебни драми', 'Семейни драми', 'Независими драми', 'Носители на награди']),
  '🎭',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- DVD Documentary L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Nature Documentaries', 'Historical Documentaries', 'True Crime', 'Music Documentaries', 'Science Documentaries', 'Social Issues']),
  unnest(ARRAY['dvd-doc-nature', 'dvd-doc-history', 'dvd-doc-crime', 'dvd-doc-music', 'dvd-doc-science', 'dvd-doc-social']),
  (SELECT id FROM categories WHERE slug = 'dvd-documentary'),
  unnest(ARRAY['Документални за природата', 'Исторически документални', 'Криминални документални', 'Музикални документални', 'Научни документални', 'Социални проблеми']),
  '🎥',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- TV Series DVD L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Drama Series', 'Comedy Series', 'Sci-Fi Series', 'Crime Series', 'Reality TV', 'Anime Series']),
  unnest(ARRAY['dvd-tv-drama', 'dvd-tv-comedy', 'dvd-tv-scifi', 'dvd-tv-crime', 'dvd-tv-reality', 'dvd-tv-anime']),
  (SELECT id FROM categories WHERE slug = 'dvd-tv-series'),
  unnest(ARRAY['Драматични сериали', 'Комедийни сериали', 'Фантастични сериали', 'Криминални сериали', 'Риалити ТВ', 'Аниме сериали']),
  '📺',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
