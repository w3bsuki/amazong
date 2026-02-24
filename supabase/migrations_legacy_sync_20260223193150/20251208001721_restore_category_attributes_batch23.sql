DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Hobbies - Arts & Crafts
    SELECT id INTO v_category_id FROM categories WHERE slug = 'arts-crafts' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Craft Type', 'Тип занаят', 'select', true, true, '["Painting", "Drawing", "Sculpting", "Knitting", "Crocheting", "Scrapbooking", "Jewelry Making", "Sewing"]', '["Рисуване", "Скициране", "Скулптура", "Плетене", "Хекелиране", "Скрапбукинг", "Бижутерия", "Шиене"]', 1),
            (v_category_id, 'Skill Level', 'Ниво', 'select', false, true, '["Beginner", "Intermediate", "Advanced", "Professional"]', '["Начинаещ", "Среден", "Напреднал", "Професионален"]', 2),
            (v_category_id, 'Includes Materials', 'Включва материали', 'boolean', false, true, NULL, NULL, 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Hobbies - Musical Instruments
    SELECT id INTO v_category_id FROM categories WHERE slug = 'musical-instruments' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Instrument Type', 'Тип инструмент', 'select', true, true, '["String", "Wind", "Percussion", "Keyboard", "Electronic"]', '["Струнни", "Духови", "Ударни", "Клавишни", "Електронни"]', 1),
            (v_category_id, 'Skill Level', 'Ниво', 'select', false, true, '["Beginner", "Intermediate", "Advanced", "Professional"]', '["Начинаещ", "Среден", "Напреднал", "Професионален"]', 2),
            (v_category_id, 'Acoustic/Electric', 'Акустичен/Електрически', 'select', false, true, '["Acoustic", "Electric", "Electro-Acoustic"]', '["Акустичен", "Електрически", "Електро-акустичен"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Hobbies - Books
    SELECT id INTO v_category_id FROM categories WHERE slug = 'books' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Genre', 'Жанр', 'select', true, true, '["Fiction", "Non-Fiction", "Sci-Fi", "Romance", "Mystery", "Biography", "Self-Help", "Children", "Educational"]', '["Художествена", "Нехудожествена", "Фантастика", "Романтика", "Мистерия", "Биография", "Самопомощ", "Детска", "Образователна"]', 1),
            (v_category_id, 'Format', 'Формат', 'select', false, true, '["Paperback", "Hardcover", "E-Book", "Audiobook"]', '["Мека корица", "Твърда корица", "Електронна", "Аудиокнига"]', 2),
            (v_category_id, 'Language', 'Език', 'select', false, true, '["Bulgarian", "English", "Other"]', '["Български", "Английски", "Друг"]', 3),
            (v_category_id, 'Age Group', 'Възрастова група', 'select', false, true, '["Children", "Young Adult", "Adult"]', '["Деца", "Младежи", "Възрастни"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Hobbies - Puzzles & Board Games
    SELECT id INTO v_category_id FROM categories WHERE slug = 'puzzles-board-games' OR slug = 'board-games' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Game Type', 'Тип игра', 'select', true, true, '["Puzzle", "Strategy", "Family", "Party", "Card", "Educational", "Cooperative"]', '["Пъзел", "Стратегическа", "Семейна", "Парти", "Карти", "Образователна", "Кооперативна"]', 1),
            (v_category_id, 'Players', 'Брой играчи', 'select', false, true, '["1", "2", "2-4", "2-6", "4+", "Party (6+)"]', '["1", "2", "2-4", "2-6", "4+", "Парти (6+)"]', 2),
            (v_category_id, 'Age Rating', 'Възрастова група', 'select', false, true, '["3+", "6+", "8+", "10+", "12+", "14+", "18+"]', '["3+", "6+", "8+", "10+", "12+", "14+", "18+"]', 3),
            (v_category_id, 'Playing Time', 'Време за игра', 'select', false, true, '["Under 30 min", "30-60 min", "1-2 hours", "2+ hours"]', '["Под 30 мин", "30-60 мин", "1-2 часа", "2+ часа"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Hobbies - Fishing Equipment
    SELECT id INTO v_category_id FROM categories WHERE slug = 'fishing-equipment' OR slug = 'fishing' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Equipment Type', 'Тип оборудване', 'select', true, true, '["Rod", "Reel", "Lures", "Line", "Tackle Box", "Accessories"]', '["Въдица", "Макара", "Примамки", "Влакно", "Кутия", "Аксесоари"]', 1),
            (v_category_id, 'Fishing Type', 'Тип риболов', 'select', false, true, '["Freshwater", "Saltwater", "Fly Fishing", "Ice Fishing", "Carp"]', '["Сладководен", "Морски", "Мухарски", "Ледов", "Шаранджийски"]', 2),
            (v_category_id, 'Rod Length', 'Дължина на въдицата', 'select', false, true, '["Short (< 2m)", "Medium (2-3m)", "Long (3-4m)", "Extra Long (> 4m)"]', '["Къса (< 2м)", "Средна (2-3м)", "Дълга (3-4м)", "Много дълга (> 4м)"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Hobbies - Camping & Hiking
    SELECT id INTO v_category_id FROM categories WHERE slug = 'camping-hiking' OR slug = 'camping' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Equipment Type', 'Тип оборудване', 'select', true, true, '["Tent", "Sleeping Bag", "Backpack", "Cooking Gear", "Lighting", "Furniture", "Accessories"]', '["Палатка", "Спален чувал", "Раница", "Готварско", "Осветление", "Мебели", "Аксесоари"]', 1),
            (v_category_id, 'Season Rating', 'Сезонност', 'select', false, true, '["1-Season", "2-Season", "3-Season", "4-Season"]', '["1 сезон", "2 сезона", "3 сезона", "4 сезона"]', 2),
            (v_category_id, 'Capacity (people)', 'Капацитет (хора)', 'select', false, true, '["1", "2", "3-4", "5-6", "7+"]', '["1", "2", "3-4", "5-6", "7+"]', 3),
            (v_category_id, 'Weight Class', 'Тегловна класа', 'select', false, true, '["Ultralight", "Light", "Standard", "Heavy Duty"]', '["Ултралека", "Лека", "Стандартна", "Тежка"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
