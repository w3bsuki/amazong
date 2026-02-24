
-- =====================================================
-- 📚 BOOKS: EXPAND REMAINING L1 CATEGORIES
-- =====================================================

DO $$
DECLARE
    books_l0_id UUID := 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
    children_id UUID;
    textbooks_id UUID;
    bulgarian_id UUID;
    foreign_id UUID;
    accessories_id UUID;
    magazines_id UUID;
BEGIN
    -- L1: Children's Books (update existing)
    UPDATE categories SET 
        display_order = 3,
        icon = '🧒',
        description = 'Picture books, early readers, young adult and children''s literature',
        description_bg = 'Книжки с картинки, първи четива, младежка и детска литература'
    WHERE slug = 'childrens-books' AND parent_id = books_l0_id
    RETURNING id INTO children_id;

    -- Add L2 subcategories to Children's Books
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Picture Books', 'Книжки с картинки', 'children-picture', children_id, 1),
    ('Early Readers (0-5)', 'Първи четива (0-5)', 'children-early-readers', children_id, 2),
    ('Middle Grade (8-12)', 'Средна възраст (8-12)', 'children-middle-grade', children_id, 3),
    ('Young Adult (12+)', 'Тийнейджъри (12+)', 'children-young-adult', children_id, 4),
    ('Activity Books', 'Книги за занимания', 'children-activity', children_id, 5),
    ('Board Books', 'Картонени книжки', 'children-board-books', children_id, 6),
    ('Fairy Tales & Folklore', 'Приказки и фолклор', 'children-fairy-tales', children_id, 7),
    ('Educational Children''s', 'Образователни детски', 'children-educational', children_id, 8)
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;

    -- L3: Activity Books
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Coloring Books', 'Книжки за оцветяване', 'activity-coloring', (SELECT id FROM categories WHERE slug = 'children-activity'), 1),
    ('Sticker Books', 'Книжки със стикери', 'activity-sticker', (SELECT id FROM categories WHERE slug = 'children-activity'), 2),
    ('Puzzle & Game Books', 'Пъзели и игри', 'activity-puzzle', (SELECT id FROM categories WHERE slug = 'children-activity'), 3),
    ('Craft Books', 'Книжки за занаяти', 'activity-craft', (SELECT id FROM categories WHERE slug = 'children-activity'), 4),
    ('Workbooks', 'Работни тетрадки', 'activity-workbooks', (SELECT id FROM categories WHERE slug = 'children-activity'), 5)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Textbooks & Education (update existing)
    UPDATE categories SET 
        name = 'Textbooks & Education',
        name_bg = 'Учебници и образование',
        display_order = 4,
        icon = '🎓',
        description = 'School textbooks, university materials, language learning and test prep',
        description_bg = 'Училищни учебници, университетски материали, чуждоезиково обучение и подготовка за изпити'
    WHERE slug = 'textbooks' AND parent_id = books_l0_id
    RETURNING id INTO textbooks_id;

    -- Add L2 subcategories to Textbooks
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('School Textbooks (1-12)', 'Училищни учебници (1-12)', 'textbooks-school', textbooks_id, 1),
    ('University Textbooks', 'Университетски учебници', 'textbooks-university', textbooks_id, 2),
    ('Language Learning', 'Чуждоезиково обучение', 'textbooks-language', textbooks_id, 3),
    ('Test Preparation', 'Подготовка за изпити', 'textbooks-test-prep', textbooks_id, 4),
    ('Professional & Technical', 'Професионални и технически', 'textbooks-professional', textbooks_id, 5),
    ('Study Guides', 'Помагала', 'textbooks-study-guides', textbooks_id, 6),
    ('Reference Books', 'Справочници', 'textbooks-reference', textbooks_id, 7)
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;

    -- L3: Language Learning
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('English Learning', 'Английски език', 'language-english', (SELECT id FROM categories WHERE slug = 'textbooks-language'), 1),
    ('German Learning', 'Немски език', 'language-german', (SELECT id FROM categories WHERE slug = 'textbooks-language'), 2),
    ('French Learning', 'Френски език', 'language-french', (SELECT id FROM categories WHERE slug = 'textbooks-language'), 3),
    ('Spanish Learning', 'Испански език', 'language-spanish', (SELECT id FROM categories WHERE slug = 'textbooks-language'), 4),
    ('Italian Learning', 'Италиански език', 'language-italian', (SELECT id FROM categories WHERE slug = 'textbooks-language'), 5),
    ('Russian Learning', 'Руски език', 'language-russian', (SELECT id FROM categories WHERE slug = 'textbooks-language'), 6),
    ('Bulgarian for Foreigners', 'Български за чужденци', 'language-bulgarian-foreign', (SELECT id FROM categories WHERE slug = 'textbooks-language'), 7),
    ('Other Languages', 'Други езици', 'language-other', (SELECT id FROM categories WHERE slug = 'textbooks-language'), 8)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Bulgarian Literature
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Bulgarian Literature', 'Българска литература', 'books-bulgarian', books_l0_id, '🇧🇬', 10, 'Bulgarian classics, contemporary authors and poetry', 'Българска класика, съвременни автори и поезия')
    ON CONFLICT (slug) DO UPDATE SET parent_id = NULL -- make sure it's under Books L0
    RETURNING id INTO bulgarian_id;

    -- L2: Bulgarian Literature
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bulgarian Classics', 'Българска класика', 'bulgarian-classics', bulgarian_id, 1),
    ('Contemporary Bulgarian Authors', 'Съвременни български автори', 'bulgarian-contemporary', bulgarian_id, 2),
    ('Bulgarian Poetry', 'Българска поезия', 'bulgarian-poetry', bulgarian_id, 3),
    ('Bulgarian Revival Period', 'Възрожденска литература', 'bulgarian-revival', bulgarian_id, 4),
    ('Bulgarian Folklore', 'Български фолклор', 'bulgarian-folklore', bulgarian_id, 5),
    ('Bulgarian Historical Works', 'Български исторически произведения', 'bulgarian-history-lit', bulgarian_id, 6)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Foreign Language Books
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Foreign Language Books', 'Книги на чужди езици', 'books-foreign', books_l0_id, '🌍', 11, 'Books in English, German, French and other languages', 'Книги на английски, немски, френски и други езици')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO foreign_id;

    -- L2: Foreign Language Books
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('English Books', 'Книги на английски', 'foreign-english', foreign_id, 1),
    ('German Books', 'Книги на немски', 'foreign-german', foreign_id, 2),
    ('French Books', 'Книги на френски', 'foreign-french', foreign_id, 3),
    ('Russian Books', 'Книги на руски', 'foreign-russian', foreign_id, 4),
    ('Spanish Books', 'Книги на испански', 'foreign-spanish', foreign_id, 5),
    ('Italian Books', 'Книги на италиански', 'foreign-italian', foreign_id, 6),
    ('Other Language Books', 'Книги на други езици', 'foreign-other', foreign_id, 7)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Magazines & Periodicals
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Magazines & Periodicals', 'Списания и периодика', 'books-magazines', books_l0_id, '📰', 12, 'Magazines, journals, newspapers and periodicals', 'Списания, вестници и периодични издания')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO magazines_id;

    -- L2: Magazines
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Fashion & Lifestyle Magazines', 'Мода и лайфстайл', 'magazines-fashion', magazines_id, 1),
    ('News & Politics', 'Новини и политика', 'magazines-news', magazines_id, 2),
    ('Business Magazines', 'Бизнес списания', 'magazines-business', magazines_id, 3),
    ('Technology Magazines', 'Технологични списания', 'magazines-tech', magazines_id, 4),
    ('Sports Magazines', 'Спортни списания', 'magazines-sports', magazines_id, 5),
    ('Science Magazines', 'Научни списания', 'magazines-science', magazines_id, 6),
    ('Home & Garden Magazines', 'Дом и градина', 'magazines-home', magazines_id, 7),
    ('Automotive Magazines', 'Автомобилни списания', 'magazines-automotive', magazines_id, 8),
    ('Gaming Magazines', 'Гейминг списания', 'magazines-gaming', magazines_id, 9),
    ('Art & Photography Magazines', 'Изкуство и фотография', 'magazines-art', magazines_id, 10),
    ('Bulgarian Magazines', 'Български списания', 'magazines-bulgarian', magazines_id, 11)
    ON CONFLICT (slug) DO NOTHING;

    -- L1: Book Accessories
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Book Accessories', 'Аксесоари за книги', 'books-accessories', books_l0_id, '🔖', 13, 'Bookmarks, book covers, reading lights and e-reader accessories', 'Книгоразделители, корици, лампи за четене и аксесоари за е-четци')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO accessories_id;

    -- L2: Book Accessories
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bookmarks', 'Книгоразделители', 'accessories-bookmarks', accessories_id, 1),
    ('Book Covers & Sleeves', 'Корици за книги', 'accessories-covers', accessories_id, 2),
    ('Book Lights', 'Лампи за четене', 'accessories-lights', accessories_id, 3),
    ('Book Stands', 'Стойки за книги', 'accessories-stands', accessories_id, 4),
    ('E-Reader Accessories', 'Аксесоари за е-четци', 'accessories-ereader', accessories_id, 5),
    ('Bookshelves & Storage', 'Рафтове и съхранение', 'accessories-bookshelves', accessories_id, 6)
    ON CONFLICT (slug) DO NOTHING;

END $$;
;
