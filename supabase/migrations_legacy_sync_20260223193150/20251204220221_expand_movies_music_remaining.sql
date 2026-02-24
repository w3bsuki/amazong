
-- =====================================================
-- 🎬 MOVIES & MUSIC: REMAINING L1 CATEGORIES
-- =====================================================

DO $$
DECLARE
    movies_music_l0_id UUID := '07e94dbe-f6de-4231-bdde-77a13aa0babc';
    instruments_id UUID;
    equipment_id UUID;
    movie_mem_id UUID;
    music_mem_id UUID;
    digital_id UUID;
    concert_id UUID;
BEGIN
    -- L1: Musical Instruments (move from Hobbies or create if needed)
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Musical Instruments', 'Музикални инструменти', 'mm-instruments', movies_music_l0_id, '🎸', 8, 'Guitars, keyboards, drums, wind instruments and accessories', 'Китари, клавишни, барабани, духови инструменти и аксесоари')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO instruments_id;

    -- L2: Musical Instruments
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Guitars', 'Китари', 'instrument-guitar', instruments_id, 1),
    ('Bass Guitars', 'Бас китари', 'instrument-bass', instruments_id, 2),
    ('Keyboards & Pianos', 'Клавишни и пиана', 'instrument-keyboard', instruments_id, 3),
    ('Drums & Percussion', 'Барабани и перкусии', 'instrument-drums', instruments_id, 4),
    ('Wind Instruments', 'Духови инструменти', 'instrument-wind', instruments_id, 5),
    ('String Instruments', 'Струнни инструменти', 'instrument-string', instruments_id, 6),
    ('DJ Equipment', 'DJ оборудване', 'instrument-dj', instruments_id, 7),
    ('Folk Instruments', 'Народни инструменти', 'instrument-folk', instruments_id, 8),
    ('Amplifiers', 'Усилватели', 'instrument-amps', instruments_id, 9),
    ('Effect Pedals', 'Ефекти и педали', 'instrument-effects', instruments_id, 10),
    ('Instrument Accessories', 'Аксесоари', 'instrument-accessories', instruments_id, 11)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: Guitars
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Electric Guitars', 'Електрически китари', 'guitar-electric', (SELECT id FROM categories WHERE slug = 'instrument-guitar'), 1),
    ('Acoustic Guitars', 'Акустични китари', 'guitar-acoustic', (SELECT id FROM categories WHERE slug = 'instrument-guitar'), 2),
    ('Classical Guitars', 'Класически китари', 'guitar-classical', (SELECT id FROM categories WHERE slug = 'instrument-guitar'), 3),
    ('Guitar Accessories', 'Аксесоари за китара', 'guitar-accessories', (SELECT id FROM categories WHERE slug = 'instrument-guitar'), 4)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: Keyboards & Pianos
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Digital Pianos', 'Дигитални пиана', 'keyboard-digital', (SELECT id FROM categories WHERE slug = 'instrument-keyboard'), 1),
    ('Synthesizers', 'Синтезатори', 'keyboard-synth', (SELECT id FROM categories WHERE slug = 'instrument-keyboard'), 2),
    ('MIDI Controllers', 'MIDI контролери', 'keyboard-midi', (SELECT id FROM categories WHERE slug = 'instrument-keyboard'), 3),
    ('Acoustic Pianos', 'Акустични пиана', 'keyboard-acoustic', (SELECT id FROM categories WHERE slug = 'instrument-keyboard'), 4)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Audio Equipment
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Audio Equipment', 'Аудио оборудване', 'mm-audio-equipment', movies_music_l0_id, '🎛️', 9, 'Turntables, receivers, speakers and audio gear', 'Грамофони, усилватели, тонколони и аудио техника')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO equipment_id;

    -- L2: Audio Equipment
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Turntables', 'Грамофони', 'audio-turntables', equipment_id, 1),
    ('Receivers & Amplifiers', 'Ресийвъри и усилватели', 'audio-receivers', equipment_id, 2),
    ('Speakers', 'Тонколони', 'audio-speakers', equipment_id, 3),
    ('Headphones', 'Слушалки', 'audio-headphones-mm', equipment_id, 4),
    ('Record Cleaning', 'Почистване на плочи', 'audio-cleaning', equipment_id, 5),
    ('Cables & Connectors', 'Кабели и конектори', 'audio-cables', equipment_id, 6),
    ('Vintage Audio', 'Винтидж аудио', 'audio-vintage', equipment_id, 7),
    ('Home Theater', 'Домашно кино', 'audio-home-theater', equipment_id, 8),
    ('Cassette Players', 'Касетофони', 'audio-cassette-players', equipment_id, 9),
    ('CD Players', 'CD плейъри', 'audio-cd-players', equipment_id, 10)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Movie Memorabilia (update existing)
    UPDATE categories SET 
        display_order = 10,
        description = 'Movie posters, props, costumes and collectibles',
        description_bg = 'Филмови плакати, реквизит, костюми и колекционерски предмети'
    WHERE slug = 'movie-memorabilia' AND parent_id = movies_music_l0_id
    RETURNING id INTO movie_mem_id;

    -- L2: Movie Memorabilia
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Movie Posters', 'Филмови плакати', 'movie-posters', movie_mem_id, 1),
    ('Movie Props', 'Филмов реквизит', 'movie-props', movie_mem_id, 2),
    ('Autographed Items', 'Автографи', 'movie-autographs', movie_mem_id, 3),
    ('Costumes', 'Костюми', 'movie-costumes', movie_mem_id, 4),
    ('Press Kits', 'Прес китове', 'movie-press-kits', movie_mem_id, 5),
    ('Original Scripts', 'Оригинални сценарии', 'movie-scripts', movie_mem_id, 6)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Music Memorabilia (update existing)
    UPDATE categories SET 
        display_order = 11,
        description = 'Concert posters, artist merchandise, autographs and tour memorabilia',
        description_bg = 'Концертни плакати, мърч на артисти, автографи и турнейни сувенири'
    WHERE slug = 'music-memorabilia' AND parent_id = movies_music_l0_id
    RETURNING id INTO music_mem_id;

    -- L2: Music Memorabilia
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Concert Posters', 'Концертни плакати', 'music-posters', music_mem_id, 1),
    ('Band T-Shirts', 'Тениски на групи', 'music-tshirts', music_mem_id, 2),
    ('Autographed Music Items', 'Музикални автографи', 'music-autographs', music_mem_id, 3),
    ('Tour Merchandise', 'Турнейни сувенири', 'music-tour-merch', music_mem_id, 4),
    ('Vintage Band Posters', 'Винтидж плакати', 'music-vintage-posters', music_mem_id, 5),
    ('Backstage Passes', 'Бекстейдж пропуски', 'music-backstage', music_mem_id, 6)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Digital Music
    UPDATE categories SET 
        display_order = 12,
        description = 'Digital downloads, codes and streaming gift cards',
        description_bg = 'Дигитални сваляния, кодове и карти за стрийминг'
    WHERE slug = 'digital-music' AND parent_id = movies_music_l0_id
    RETURNING id INTO digital_id;

    -- L2: Digital Music
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Download Codes', 'Кодове за сваляне', 'digital-download-codes', digital_id, 1),
    ('Streaming Gift Cards', 'Карти за стрийминг', 'digital-streaming-cards', digital_id, 2),
    ('Digital Albums', 'Дигитални албуми', 'digital-albums', digital_id, 3)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Concerts & Live
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Concert Recordings', 'Концертни записи', 'mm-concerts', movies_music_l0_id, '🎤', 13, 'Live recordings, concert films and bootlegs', 'Концертни записи, филми от живо и бутлег записи')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO concert_id;

    -- L2: Concert Recordings
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Concert Films', 'Концертни филми', 'concert-films', concert_id, 1),
    ('Live Albums', 'Албуми на живо', 'concert-live-albums', concert_id, 2),
    ('Bootleg Recordings', 'Бутлег записи', 'concert-bootlegs', concert_id, 3)
    ON CONFLICT (slug) DO NOTHING;

END $$;
;
