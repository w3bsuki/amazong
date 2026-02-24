
-- =====================================================
-- 📚 BOOKS: ADD NON-FICTION L1 WITH SUBCATEGORIES
-- =====================================================

DO $$
DECLARE
    books_l0_id UUID := 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
    nonfiction_id UUID;
BEGIN
    -- L1: Non-Fiction
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
    VALUES ('Non-Fiction', 'Нехудожествена литература', 'books-nonfiction', books_l0_id, '📘', 2, 'Biographies, self-help, history, science and factual books', 'Биографии, личностно развитие, история, наука и документални книги')
    ON CONFLICT (slug) DO UPDATE SET 
        parent_id = EXCLUDED.parent_id,
        icon = EXCLUDED.icon,
        display_order = EXCLUDED.display_order
    RETURNING id INTO nonfiction_id;

    -- L2: Non-Fiction subcategories
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Biography & Memoir', 'Биографии и мемоари', 'nonfiction-biography', nonfiction_id, 1),
    ('Self-Help & Personal Development', 'Личностно развитие', 'nonfiction-self-help', nonfiction_id, 2),
    ('Business & Economics', 'Бизнес и икономика', 'nonfiction-business', nonfiction_id, 3),
    ('History', 'История', 'nonfiction-history', nonfiction_id, 4),
    ('Science & Nature', 'Наука и природа', 'nonfiction-science', nonfiction_id, 5),
    ('Philosophy', 'Философия', 'nonfiction-philosophy', nonfiction_id, 6),
    ('Psychology', 'Психология', 'nonfiction-psychology', nonfiction_id, 7),
    ('Politics & Social Sciences', 'Политика и социология', 'nonfiction-politics', nonfiction_id, 8),
    ('Travel', 'Пътешествия', 'nonfiction-travel', nonfiction_id, 9),
    ('True Crime', 'Реални престъпления', 'nonfiction-true-crime', nonfiction_id, 10),
    ('Health & Wellness', 'Здраве и уелнес', 'nonfiction-health', nonfiction_id, 11),
    ('Cooking & Food', 'Готварство и храна', 'nonfiction-cooking', nonfiction_id, 12),
    ('Art & Photography', 'Изкуство и фотография', 'nonfiction-art', nonfiction_id, 13),
    ('Religion & Spirituality', 'Религия и духовност', 'nonfiction-religion', nonfiction_id, 14),
    ('Sports & Recreation', 'Спорт и отдих', 'nonfiction-sports', nonfiction_id, 15),
    ('Parenting & Family', 'Родителство и семейство', 'nonfiction-parenting', nonfiction_id, 16),
    ('Humor', 'Хумор', 'nonfiction-humor', nonfiction_id, 17)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: Business & Economics
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Entrepreneurship', 'Предприемачество', 'business-entrepreneurship', (SELECT id FROM categories WHERE slug = 'nonfiction-business'), 1),
    ('Marketing & Sales', 'Маркетинг и продажби', 'business-marketing', (SELECT id FROM categories WHERE slug = 'nonfiction-business'), 2),
    ('Finance & Investing', 'Финанси и инвестиции', 'business-finance', (SELECT id FROM categories WHERE slug = 'nonfiction-business'), 3),
    ('Management & Leadership', 'Мениджмънт и лидерство', 'business-management', (SELECT id FROM categories WHERE slug = 'nonfiction-business'), 4),
    ('Economics', 'Икономика', 'business-economics-book', (SELECT id FROM categories WHERE slug = 'nonfiction-business'), 5),
    ('Real Estate Investing', 'Инвестиции в недвижими имоти', 'business-real-estate-book', (SELECT id FROM categories WHERE slug = 'nonfiction-business'), 6),
    ('Career & Success', 'Кариера и успех', 'business-career', (SELECT id FROM categories WHERE slug = 'nonfiction-business'), 7),
    ('Personal Finance', 'Лични финанси', 'business-personal-finance', (SELECT id FROM categories WHERE slug = 'nonfiction-business'), 8)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: History
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('World History', 'Световна история', 'history-world', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 1),
    ('Bulgarian History', 'Българска история', 'history-bulgarian', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 2),
    ('European History', 'Европейска история', 'history-european', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 3),
    ('Ancient History', 'Древна история', 'history-ancient', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 4),
    ('Military History', 'Военна история', 'history-military', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 5),
    ('WWII', 'Втора световна война', 'history-wwii', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 6),
    ('WWI', 'Първа световна война', 'history-wwi', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 7),
    ('Cold War', 'Студена война', 'history-cold-war', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 8),
    ('American History', 'Американска история', 'history-american', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 9),
    ('Asian History', 'Азиатска история', 'history-asian', (SELECT id FROM categories WHERE slug = 'nonfiction-history'), 10)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: Science & Nature
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Physics', 'Физика', 'science-physics', (SELECT id FROM categories WHERE slug = 'nonfiction-science'), 1),
    ('Biology', 'Биология', 'science-biology', (SELECT id FROM categories WHERE slug = 'nonfiction-science'), 2),
    ('Astronomy & Space', 'Астрономия и космос', 'science-astronomy', (SELECT id FROM categories WHERE slug = 'nonfiction-science'), 3),
    ('Earth Sciences', 'Науки за Земята', 'science-earth', (SELECT id FROM categories WHERE slug = 'nonfiction-science'), 4),
    ('Mathematics', 'Математика', 'science-mathematics', (SELECT id FROM categories WHERE slug = 'nonfiction-science'), 5),
    ('Technology', 'Технологии', 'science-technology', (SELECT id FROM categories WHERE slug = 'nonfiction-science'), 6),
    ('Chemistry', 'Химия', 'science-chemistry', (SELECT id FROM categories WHERE slug = 'nonfiction-science'), 7),
    ('Nature & Wildlife', 'Природа и дивеч', 'science-nature-wildlife', (SELECT id FROM categories WHERE slug = 'nonfiction-science'), 8),
    ('Popular Science', 'Научно-популярни', 'science-popular', (SELECT id FROM categories WHERE slug = 'nonfiction-science'), 9)
    ON CONFLICT (slug) DO NOTHING;

    -- L3: Psychology
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('General Psychology', 'Обща психология', 'psychology-general', (SELECT id FROM categories WHERE slug = 'nonfiction-psychology'), 1),
    ('Behavioral Psychology', 'Поведенческа психология', 'psychology-behavioral', (SELECT id FROM categories WHERE slug = 'nonfiction-psychology'), 2),
    ('Developmental Psychology', 'Психология на развитието', 'psychology-developmental', (SELECT id FROM categories WHERE slug = 'nonfiction-psychology'), 3),
    ('Social Psychology', 'Социална психология', 'psychology-social', (SELECT id FROM categories WHERE slug = 'nonfiction-psychology'), 4),
    ('Clinical Psychology', 'Клинична психология', 'psychology-clinical', (SELECT id FROM categories WHERE slug = 'nonfiction-psychology'), 5),
    ('Positive Psychology', 'Позитивна психология', 'psychology-positive', (SELECT id FROM categories WHERE slug = 'nonfiction-psychology'), 6)
    ON CONFLICT (slug) DO NOTHING;

END $$;
;
