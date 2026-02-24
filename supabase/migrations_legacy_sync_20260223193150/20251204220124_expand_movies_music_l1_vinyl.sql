
-- =====================================================
-- 🎬 MOVIES & MUSIC: EXPAND VINYL & CDS
-- =====================================================

DO $$
DECLARE
    movies_music_l0_id UUID := '07e94dbe-f6de-4231-bdde-77a13aa0babc';
    vinyl_id UUID;
    cds_id UUID;
    cassettes_id UUID;
BEGIN
    -- L1: Vinyl Records (update existing)
    UPDATE categories SET 
        name = 'Vinyl Records',
        name_bg = 'Грамофонни плочи',
        display_order = 1,
        icon = '💿',
        description = 'LP records, singles, picture discs and collectible vinyl',
        description_bg = 'LP плочи, сингли, пикчър дискове и колекционерски винили'
    WHERE slug = 'vinyl-records' AND parent_id = movies_music_l0_id
    RETURNING id INTO vinyl_id;

    -- Add more L2 categories to Vinyl
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('LP Records (12")', 'LP плочи (12")', 'vinyl-lp', vinyl_id, 1),
    ('Singles (7")', 'Сингли (7")', 'vinyl-singles', vinyl_id, 2),
    ('EP Records (10")', 'EP плочи (10")', 'vinyl-ep', vinyl_id, 3),
    ('Picture Discs', 'Пикчър дискове', 'vinyl-picture', vinyl_id, 4),
    ('Colored Vinyl', 'Цветни плочи', 'vinyl-colored', vinyl_id, 5),
    ('Box Sets', 'Бокс сетове', 'vinyl-box-sets', vinyl_id, 6),
    ('Limited Editions', 'Лимитирани издания', 'vinyl-limited', vinyl_id, 7),
    ('Vintage/Antique Vinyl', 'Винтидж/антикварни', 'vinyl-vintage', vinyl_id, 8),
    ('New Releases', 'Нови издания', 'vinyl-new', vinyl_id, 9),
    ('Used Vinyl', 'Втора употреба', 'vinyl-used', vinyl_id, 10)
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;

    -- L3: Vinyl by Genre (more comprehensive)
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Rock Vinyl', 'Рок плочи', 'vinyl-rock', vinyl_id, 11),
    ('Pop Vinyl', 'Поп плочи', 'vinyl-pop', vinyl_id, 12),
    ('Jazz Vinyl', 'Джаз плочи', 'vinyl-jazz', vinyl_id, 13),
    ('Classical Vinyl', 'Класическа музика', 'vinyl-classical', vinyl_id, 14),
    ('Electronic Vinyl', 'Електронна музика', 'vinyl-electronic', vinyl_id, 15),
    ('Hip-Hop Vinyl', 'Хип-хоп плочи', 'vinyl-hiphop', vinyl_id, 16),
    ('Metal Vinyl', 'Метъл плочи', 'vinyl-metal', vinyl_id, 17),
    ('Punk Vinyl', 'Пънк плочи', 'vinyl-punk', vinyl_id, 18),
    ('Soul & R&B Vinyl', 'Соул и R&B', 'vinyl-soul-rnb', vinyl_id, 19),
    ('Reggae Vinyl', 'Реге плочи', 'vinyl-reggae', vinyl_id, 20),
    ('Country Vinyl', 'Кънтри плочи', 'vinyl-country', vinyl_id, 21),
    ('Folk Vinyl', 'Фолк плочи', 'vinyl-folk', vinyl_id, 22),
    ('Blues Vinyl', 'Блус плочи', 'vinyl-blues', vinyl_id, 23),
    ('Soundtracks Vinyl', 'Саундтраци', 'vinyl-soundtracks', vinyl_id, 24),
    ('Bulgarian Music Vinyl', 'Българска музика', 'vinyl-bulgarian', vinyl_id, 25),
    ('World Music Vinyl', 'Световна музика', 'vinyl-world', vinyl_id, 26)
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;

    -- L1: CDs (new)
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('CDs', 'Компактдискове', 'music-cds', movies_music_l0_id, '💿', 2, 'Music CDs, albums, singles and box sets', 'Музикални CD дискове, албуми, сингли и бокс сетове')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO cds_id;

    -- L2: CDs by genre
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Rock CDs', 'Рок', 'cd-rock', cds_id, 1),
    ('Pop CDs', 'Поп', 'cd-pop', cds_id, 2),
    ('Jazz CDs', 'Джаз', 'cd-jazz', cds_id, 3),
    ('Classical CDs', 'Класическа', 'cd-classical', cds_id, 4),
    ('Electronic CDs', 'Електронна', 'cd-electronic', cds_id, 5),
    ('Hip-Hop CDs', 'Хип-хоп', 'cd-hiphop', cds_id, 6),
    ('Metal CDs', 'Метъл', 'cd-metal', cds_id, 7),
    ('R&B & Soul CDs', 'R&B и соул', 'cd-rnb', cds_id, 8),
    ('Country CDs', 'Кънтри', 'cd-country', cds_id, 9),
    ('Bulgarian Music CDs', 'Българска музика', 'cd-bulgarian', cds_id, 10),
    ('Soundtracks CDs', 'Саундтраци', 'cd-soundtracks', cds_id, 11),
    ('World Music CDs', 'Световна музика', 'cd-world', cds_id, 12),
    ('Box Sets & Collections', 'Бокс сетове', 'cd-box-sets', cds_id, 13)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Cassettes (new)
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Cassettes', 'Касети', 'music-cassettes', movies_music_l0_id, '📼', 3, 'Audio cassettes, vintage tapes and new releases', 'Аудио касети, винтидж ленти и нови издания')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO cassettes_id;

    -- L2: Cassettes
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Vintage Cassettes', 'Винтидж касети', 'cassette-vintage', cassettes_id, 1),
    ('New Release Cassettes', 'Нови касети', 'cassette-new', cassettes_id, 2),
    ('Blank Cassettes', 'Празни касети', 'cassette-blank', cassettes_id, 3)
    ON CONFLICT (slug) DO NOTHING;

END $$;
;
