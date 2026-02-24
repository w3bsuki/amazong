
-- =====================================================
-- 📚 BOOKS: ADD FICTION L1 WITH SUBCATEGORIES
-- =====================================================

-- Get Books L0 ID
DO $$
DECLARE
    books_l0_id UUID := 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
    fiction_id UUID;
BEGIN
    -- L1: Fiction (Художествена литература)
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Fiction', 'Художествена литература', 'books-fiction', books_l0_id, '📖', 1, 'Novels, short stories, poetry and fictional works', 'Романи, разкази, поезия и художествени произведения')
    ON CONFLICT (slug) DO UPDATE SET 
        name = EXCLUDED.name, 
        name_bg = EXCLUDED.name_bg,
        parent_id = EXCLUDED.parent_id,
        icon = EXCLUDED.icon,
        display_order = EXCLUDED.display_order,
        description = EXCLUDED.description,
        description_bg = EXCLUDED.description_bg
    RETURNING id INTO fiction_id;

    -- L2: Fiction subcategories
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Literary Fiction', 'Съвременна проза', 'fiction-literary', fiction_id, 1),
    ('Mystery & Thriller', 'Криминални и трилъри', 'fiction-mystery-thriller', fiction_id, 2),
    ('Science Fiction', 'Научна фантастика', 'fiction-sci-fi', fiction_id, 3),
    ('Fantasy', 'Фентъзи', 'fiction-fantasy', fiction_id, 4),
    ('Romance', 'Романтика', 'fiction-romance', fiction_id, 5),
    ('Horror', 'Ужаси', 'fiction-horror', fiction_id, 6),
    ('Historical Fiction', 'Исторически романи', 'fiction-historical', fiction_id, 7),
    ('Classics', 'Класика', 'fiction-classics', fiction_id, 8),
    ('Short Stories', 'Разкази', 'fiction-short-stories', fiction_id, 9),
    ('Poetry', 'Поезия', 'fiction-poetry', fiction_id, 10),
    ('Adventure', 'Приключенски', 'fiction-adventure', fiction_id, 11),
    ('Humor & Satire', 'Хумор и сатира', 'fiction-humor', fiction_id, 12)
    ON CONFLICT (slug) DO UPDATE SET 
        name = EXCLUDED.name,
        name_bg = EXCLUDED.name_bg,
        parent_id = EXCLUDED.parent_id,
        display_order = EXCLUDED.display_order;

    -- L3: Mystery & Thriller subcategories
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Detective', 'Детективски', 'mystery-detective', (SELECT id FROM categories WHERE slug = 'fiction-mystery-thriller'), 1),
    ('Psychological Thriller', 'Психологически трилър', 'mystery-psychological', (SELECT id FROM categories WHERE slug = 'fiction-mystery-thriller'), 2),
    ('Crime Fiction', 'Криминален роман', 'mystery-crime', (SELECT id FROM categories WHERE slug = 'fiction-mystery-thriller'), 3),
    ('Legal Thriller', 'Съдебен трилър', 'mystery-legal', (SELECT id FROM categories WHERE slug = 'fiction-mystery-thriller'), 4),
    ('Spy Thriller', 'Шпионски трилър', 'mystery-spy', (SELECT id FROM categories WHERE slug = 'fiction-mystery-thriller'), 5),
    ('Cozy Mystery', 'Уютен криминален', 'mystery-cozy', (SELECT id FROM categories WHERE slug = 'fiction-mystery-thriller'), 6)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: Science Fiction subcategories
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Space Opera', 'Космическа опера', 'scifi-space-opera', (SELECT id FROM categories WHERE slug = 'fiction-sci-fi'), 1),
    ('Dystopian', 'Дистопия', 'scifi-dystopian', (SELECT id FROM categories WHERE slug = 'fiction-sci-fi'), 2),
    ('Cyberpunk', 'Киберпънк', 'scifi-cyberpunk', (SELECT id FROM categories WHERE slug = 'fiction-sci-fi'), 3),
    ('Hard Science Fiction', 'Твърда научна фантастика', 'scifi-hard', (SELECT id FROM categories WHERE slug = 'fiction-sci-fi'), 4),
    ('Time Travel', 'Пътуване във времето', 'scifi-time-travel', (SELECT id FROM categories WHERE slug = 'fiction-sci-fi'), 5),
    ('Post-Apocalyptic', 'Пост-апокалиптична', 'scifi-post-apocalyptic', (SELECT id FROM categories WHERE slug = 'fiction-sci-fi'), 6),
    ('Alien Contact', 'Извънземни контакти', 'scifi-alien', (SELECT id FROM categories WHERE slug = 'fiction-sci-fi'), 7)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: Fantasy subcategories
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Epic Fantasy', 'Епично фентъзи', 'fantasy-epic', (SELECT id FROM categories WHERE slug = 'fiction-fantasy'), 1),
    ('Urban Fantasy', 'Градско фентъзи', 'fantasy-urban', (SELECT id FROM categories WHERE slug = 'fiction-fantasy'), 2),
    ('Dark Fantasy', 'Тъмно фентъзи', 'fantasy-dark', (SELECT id FROM categories WHERE slug = 'fiction-fantasy'), 3),
    ('Young Adult Fantasy', 'Младежко фентъзи', 'fantasy-ya', (SELECT id FROM categories WHERE slug = 'fiction-fantasy'), 4),
    ('Paranormal', 'Паранормално', 'fantasy-paranormal', (SELECT id FROM categories WHERE slug = 'fiction-fantasy'), 5),
    ('Sword & Sorcery', 'Меч и магия', 'fantasy-sword-sorcery', (SELECT id FROM categories WHERE slug = 'fiction-fantasy'), 6),
    ('Fairy Tales', 'Приказки', 'fantasy-fairy-tales', (SELECT id FROM categories WHERE slug = 'fiction-fantasy'), 7)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: Romance subcategories
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Contemporary Romance', 'Съвременна романтика', 'romance-contemporary', (SELECT id FROM categories WHERE slug = 'fiction-romance'), 1),
    ('Historical Romance', 'Историческа романтика', 'romance-historical', (SELECT id FROM categories WHERE slug = 'fiction-romance'), 2),
    ('Romantic Suspense', 'Романтичен съспенс', 'romance-suspense', (SELECT id FROM categories WHERE slug = 'fiction-romance'), 3),
    ('Paranormal Romance', 'Паранормална романтика', 'romance-paranormal', (SELECT id FROM categories WHERE slug = 'fiction-romance'), 4),
    ('Romantic Comedy', 'Романтична комедия', 'romance-comedy', (SELECT id FROM categories WHERE slug = 'fiction-romance'), 5),
    ('Erotic Romance', 'Еротична романтика', 'romance-erotic', (SELECT id FROM categories WHERE slug = 'fiction-romance'), 6)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: Horror subcategories
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Supernatural Horror', 'Свръхестествен ужас', 'horror-supernatural', (SELECT id FROM categories WHERE slug = 'fiction-horror'), 1),
    ('Psychological Horror', 'Психологически ужас', 'horror-psychological', (SELECT id FROM categories WHERE slug = 'fiction-horror'), 2),
    ('Gothic Horror', 'Готически ужас', 'horror-gothic', (SELECT id FROM categories WHERE slug = 'fiction-horror'), 3),
    ('Cosmic Horror', 'Космически ужас', 'horror-cosmic', (SELECT id FROM categories WHERE slug = 'fiction-horror'), 4),
    ('Zombie Fiction', 'Зомби фикция', 'horror-zombie', (SELECT id FROM categories WHERE slug = 'fiction-horror'), 5)
    ON CONFLICT (slug) DO NOTHING;

END $$;
;
