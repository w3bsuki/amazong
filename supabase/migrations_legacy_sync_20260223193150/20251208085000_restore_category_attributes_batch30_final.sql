DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Antiques
    SELECT id INTO v_category_id FROM categories WHERE slug = 'antiques' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Item Type', 'Тип артикул', 'select', true, true, '["Furniture", "Art", "Jewelry", "Ceramics", "Glassware", "Textiles", "Clocks", "Books"]', '["Мебели", "Изкуство", "Бижута", "Керамика", "Стъкло", "Текстил", "Часовници", "Книги"]', 1),
            (v_category_id, 'Era/Period', 'Ера/Период', 'select', false, true, '["Victorian", "Edwardian", "Art Deco", "Art Nouveau", "Mid-Century", "Vintage", "Ancient"]', '["Викториански", "Едуардиански", "Арт Деко", "Арт Нуво", "Средата на века", "Винтидж", "Античен"]', 2),
            (v_category_id, 'Condition', 'Състояние', 'select', false, true, '["Excellent", "Good", "Fair", "Restored", "As Found"]', '["Отлично", "Добро", "Задоволително", "Реставрирано", "Непроменено"]', 3),
            (v_category_id, 'Authenticity', 'Автентичност', 'select', false, true, '["Verified", "Certificate Included", "Unverified"]', '["Проверена", "Със сертификат", "Непроверена"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Vintage
    SELECT id INTO v_category_id FROM categories WHERE slug = 'vintage' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Item Type', 'Тип артикул', 'select', true, true, '["Clothing", "Accessories", "Electronics", "Toys", "Decor", "Media", "Sports"]', '["Дрехи", "Аксесоари", "Електроника", "Играчки", "Декор", "Медия", "Спорт"]', 1),
            (v_category_id, 'Decade', 'Десетилетие', 'select', false, true, '["1950s", "1960s", "1970s", "1980s", "1990s", "2000s"]', '["1950-те", "1960-те", "1970-те", "1980-те", "1990-те", "2000-те"]', 2),
            (v_category_id, 'Condition', 'Състояние', 'select', false, true, '["Mint", "Near Mint", "Good", "Fair", "For Parts/Repair"]', '["Мента", "Почти мента", "Добро", "Задоволително", "За части/ремонт"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Art Prints
    SELECT id INTO v_category_id FROM categories WHERE slug = 'art-prints' OR slug = 'prints' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Print Type', 'Тип принт', 'select', true, true, '["Canvas", "Poster", "Framed", "Limited Edition", "Photo Print", "Giclée"]', '["Канава", "Постер", "В рамка", "Лимитирано", "Фото принт", "Жикле"]', 1),
            (v_category_id, 'Style', 'Стил', 'select', false, true, '["Abstract", "Modern", "Classic", "Photography", "Pop Art", "Minimalist", "Nature"]', '["Абстрактно", "Модерно", "Класическо", "Фотография", "Поп арт", "Минимализъм", "Природа"]', 2),
            (v_category_id, 'Size', 'Размер', 'select', false, true, '["Small (< 30cm)", "Medium (30-60cm)", "Large (60-100cm)", "Extra Large (> 100cm)"]', '["Малък (< 30см)", "Среден (30-60см)", "Голям (60-100см)", "Много голям (> 100см)"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Action Figures
    SELECT id INTO v_category_id FROM categories WHERE slug = 'action-figures' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Franchise', 'Франчайз', 'select', true, true, '["Marvel", "DC", "Star Wars", "Anime", "Video Games", "Movies", "Other"]', '["Марвел", "DC", "Междузвездни войни", "Аниме", "Видео игри", "Филми", "Друго"]', 1),
            (v_category_id, 'Scale', 'Мащаб', 'select', false, true, '["1:12 (6\")", "1:10 (7\")", "1:6 (12\")", "1:4 (18\")", "Other"]', '["1:12 (15см)", "1:10 (18см)", "1:6 (30см)", "1:4 (45см)", "Друг"]', 2),
            (v_category_id, 'Condition', 'Състояние', 'select', false, true, '["New In Box", "Open Box", "Loose Complete", "Loose Incomplete"]', '["Нова в кутия", "Отворена кутия", "Без кутия пълна", "Без кутия непълна"]', 3),
            (v_category_id, 'Limited Edition', 'Лимитирана', 'boolean', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Model Kits
    SELECT id INTO v_category_id FROM categories WHERE slug = 'model-kits' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Model Type', 'Тип модел', 'select', true, true, '["Aircraft", "Cars", "Ships", "Military", "Sci-Fi", "Figures", "Buildings"]', '["Самолети", "Коли", "Кораби", "Военни", "Фантастика", "Фигури", "Сгради"]', 1),
            (v_category_id, 'Scale', 'Мащаб', 'select', false, true, '["1:72", "1:48", "1:35", "1:24", "1:18", "1:12", "Other"]', '["1:72", "1:48", "1:35", "1:24", "1:18", "1:12", "Друг"]', 2),
            (v_category_id, 'Skill Level', 'Ниво', 'select', false, true, '["Beginner", "Intermediate", "Advanced", "Expert"]', '["Начинаещ", "Среден", "Напреднал", "Експерт"]', 3),
            (v_category_id, 'Paint Required', 'Изисква боядисване', 'boolean', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Memorabilia
    SELECT id INTO v_category_id FROM categories WHERE slug = 'memorabilia' OR slug = 'sports-memorabilia' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Category', 'Категория', 'select', true, true, '["Sports", "Music", "Movies", "TV", "Historical", "Political"]', '["Спорт", "Музика", "Филми", "ТВ", "Исторически", "Политически"]', 1),
            (v_category_id, 'Item Type', 'Тип артикул', 'select', false, true, '["Autograph", "Jersey", "Equipment", "Poster", "Ticket", "Photo", "Other"]', '["Автограф", "Фланелка", "Екипировка", "Постер", "Билет", "Снимка", "Друго"]', 2),
            (v_category_id, 'Authenticated', 'Удостоверено', 'boolean', false, true, NULL, NULL, 3),
            (v_category_id, 'Certificate', 'Сертификат', 'boolean', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
