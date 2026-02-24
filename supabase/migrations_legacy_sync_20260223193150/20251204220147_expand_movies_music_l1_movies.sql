
-- =====================================================
-- 🎬 MOVIES & MUSIC: EXPAND MOVIES/DVDs/BLU-RAY
-- =====================================================

DO $$
DECLARE
    movies_music_l0_id UUID := '07e94dbe-f6de-4231-bdde-77a13aa0babc';
    dvd_id UUID;
    bluray_id UUID;
    uhd_id UUID;
    vhs_id UUID;
BEGIN
    -- Update existing DVDs & Blu-ray and split into separate categories
    -- L1: DVDs
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('DVDs', 'DVD дискове', 'movies-dvd', movies_music_l0_id, '📀', 4, 'DVD movies, TV series, documentaries and special editions', 'DVD филми, сериали, документални и специални издания')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO dvd_id;

    -- L2: DVDs by genre
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Action & Adventure DVDs', 'Екшън и приключения', 'dvd-action', dvd_id, 1),
    ('Comedy DVDs', 'Комедии', 'dvd-comedy', dvd_id, 2),
    ('Drama DVDs', 'Драми', 'dvd-drama', dvd_id, 3),
    ('Horror DVDs', 'Ужаси', 'dvd-horror', dvd_id, 4),
    ('Sci-Fi & Fantasy DVDs', 'Фантастика и фентъзи', 'dvd-scifi', dvd_id, 5),
    ('Thriller DVDs', 'Трилъри', 'dvd-thriller', dvd_id, 6),
    ('Documentary DVDs', 'Документални', 'dvd-documentary', dvd_id, 7),
    ('Animation DVDs', 'Анимация', 'dvd-animation', dvd_id, 8),
    ('TV Series DVDs', 'ТВ сериали', 'dvd-tv-series', dvd_id, 9),
    ('Kids & Family DVDs', 'Детски и семейни', 'dvd-kids', dvd_id, 10),
    ('Bulgarian Movies DVDs', 'Български филми', 'dvd-bulgarian', dvd_id, 11),
    ('Classic Movies DVDs', 'Класически филми', 'dvd-classic', dvd_id, 12),
    ('Foreign Films DVDs', 'Чуждестранни филми', 'dvd-foreign', dvd_id, 13),
    ('Anime DVDs', 'Аниме', 'dvd-anime', dvd_id, 14),
    ('Music DVDs', 'Музикални DVD', 'dvd-music', dvd_id, 15),
    ('Sports DVDs', 'Спортни', 'dvd-sports', dvd_id, 16),
    ('Box Sets DVDs', 'Бокс сетове', 'dvd-box-sets', dvd_id, 17)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Blu-ray
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Blu-ray', 'Blu-ray дискове', 'movies-bluray', movies_music_l0_id, '💎', 5, 'Blu-ray movies, steelbooks, special editions and TV series', 'Blu-ray филми, стийлбуци, специални издания и сериали')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO bluray_id;

    -- L2: Blu-ray by genre
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Action & Adventure Blu-ray', 'Екшън и приключения', 'bluray-action', bluray_id, 1),
    ('Comedy Blu-ray', 'Комедии', 'bluray-comedy', bluray_id, 2),
    ('Drama Blu-ray', 'Драми', 'bluray-drama', bluray_id, 3),
    ('Horror Blu-ray', 'Ужаси', 'bluray-horror', bluray_id, 4),
    ('Sci-Fi & Fantasy Blu-ray', 'Фантастика и фентъзи', 'bluray-scifi', bluray_id, 5),
    ('Documentary Blu-ray', 'Документални', 'bluray-documentary', bluray_id, 6),
    ('Animation Blu-ray', 'Анимация', 'bluray-animation', bluray_id, 7),
    ('TV Series Blu-ray', 'ТВ сериали', 'bluray-tv-series', bluray_id, 8),
    ('Anime Blu-ray', 'Аниме', 'bluray-anime', bluray_id, 9),
    ('Steelbooks', 'Стийлбуци', 'bluray-steelbook', bluray_id, 10),
    ('3D Blu-ray', '3D Blu-ray', 'bluray-3d', bluray_id, 11),
    ('Criterion Collection', 'Criterion колекция', 'bluray-criterion', bluray_id, 12),
    ('Box Sets Blu-ray', 'Бокс сетове', 'bluray-box-sets', bluray_id, 13)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: 4K Ultra HD
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('4K Ultra HD', '4K Ultra HD', 'movies-4k-uhd', movies_music_l0_id, '🎬', 6, '4K UHD Blu-ray movies with HDR', '4K UHD Blu-ray филми с HDR')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO uhd_id;

    -- L2: 4K UHD
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Action 4K', 'Екшън', 'uhd-action', uhd_id, 1),
    ('Sci-Fi 4K', 'Фантастика', 'uhd-scifi', uhd_id, 2),
    ('Drama 4K', 'Драми', 'uhd-drama', uhd_id, 3),
    ('Animation 4K', 'Анимация', 'uhd-animation', uhd_id, 4),
    ('Documentary 4K', 'Документални', 'uhd-documentary', uhd_id, 5),
    ('Steelbooks 4K', 'Стийлбуци', 'uhd-steelbook', uhd_id, 6)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: VHS Tapes (vintage/collectible)
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('VHS Tapes', 'VHS касети', 'movies-vhs', movies_music_l0_id, '📼', 7, 'Vintage VHS tapes and collectible video cassettes', 'Винтидж VHS касети и колекционерски видеокасети')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO vhs_id;

    -- L2: VHS
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Horror VHS', 'Ужаси VHS', 'vhs-horror', vhs_id, 1),
    ('Sci-Fi VHS', 'Фантастика VHS', 'vhs-scifi', vhs_id, 2),
    ('Action VHS', 'Екшън VHS', 'vhs-action', vhs_id, 3),
    ('Kids VHS', 'Детски VHS', 'vhs-kids', vhs_id, 4),
    ('Bulgarian VHS', 'Български VHS', 'vhs-bulgarian', vhs_id, 5),
    ('Rare & Collectible VHS', 'Редки и колекционерски', 'vhs-rare', vhs_id, 6)
    ON CONFLICT (slug) DO NOTHING;

END $$;
;
