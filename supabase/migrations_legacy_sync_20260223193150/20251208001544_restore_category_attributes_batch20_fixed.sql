DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Haircare - Styling Products
    SELECT id INTO v_category_id FROM categories WHERE slug = 'styling-products' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Hair Spray", "Mousse", "Gel", "Wax", "Pomade", "Serum", "Oil", "Cream"]', '["Лак за коса", "Пяна", "Гел", "Восък", "Помада", "Серум", "Олио", "Крем"]', 1),
            (v_category_id, 'Hold Level', 'Ниво на задържане', 'select', false, true, '["Light", "Medium", "Strong", "Extra Strong"]', '["Леко", "Средно", "Силно", "Екстра силно"]', 2),
            (v_category_id, 'Hair Type', 'Тип коса', 'multiselect', false, true, '["All Types", "Fine", "Thick", "Curly", "Straight", "Wavy"]', '["Всички типове", "Тънка", "Гъста", "Къдрава", "Права", "Вълниста"]', 3),
            (v_category_id, 'Finish Type', 'Тип финиш', 'select', false, true, '["Matte", "Shiny", "Natural", "Wet Look"]', '["Матов", "Лъскав", "Естествен", "Мокър ефект"]', 4),
            (v_category_id, 'Volume (ml)', 'Обем (мл)', 'number', false, true, NULL, NULL, 5)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Haircare - Shampoos
    SELECT id INTO v_category_id FROM categories WHERE slug = 'shampoos' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Shampoo Type', 'Тип шампоан', 'select', true, true, '["Daily Use", "Deep Cleansing", "Moisturizing", "Anti-Dandruff", "Color Protection", "Volumizing", "Repair"]', '["Ежедневна употреба", "Дълбоко почистване", "Овлажняващ", "Против пърхот", "Защита на цвета", "За обем", "Възстановяващ"]', 1),
            (v_category_id, 'Hair Type', 'Тип коса', 'multiselect', false, true, '["Normal", "Oily", "Dry", "Damaged", "Color-Treated", "Fine", "Thick"]', '["Нормална", "Мазна", "Суха", "Увредена", "Боядисана", "Тънка", "Гъста"]', 2),
            (v_category_id, 'Ingredients', 'Съставки', 'multiselect', false, true, '["Sulfate-Free", "Paraben-Free", "Natural", "Keratin", "Argan Oil", "Biotin"]', '["Без сулфати", "Без парабени", "Натурален", "Кератин", "Арганово масло", "Биотин"]', 3),
            (v_category_id, 'Volume (ml)', 'Обем (мл)', 'number', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Haircare - Conditioners
    SELECT id INTO v_category_id FROM categories WHERE slug = 'conditioners' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Conditioner Type', 'Тип балсам', 'select', true, true, '["Rinse-Out", "Leave-In", "Deep Conditioning", "Detangling"]', '["Изплакващ се", "Без изплакване", "Дълбоко овлажняващ", "Разресващ"]', 1),
            (v_category_id, 'Hair Type', 'Тип коса', 'multiselect', false, true, '["All Types", "Dry", "Damaged", "Oily", "Color-Treated", "Curly"]', '["Всички типове", "Суха", "Увредена", "Мазна", "Боядисана", "Къдрава"]', 2),
            (v_category_id, 'Benefits', 'Ползи', 'multiselect', false, true, '["Moisturizing", "Strengthening", "Smoothing", "Volumizing", "Color Protection"]', '["Овлажняване", "Укрепване", "Изглаждане", "Обем", "Защита на цвета"]', 3),
            (v_category_id, 'Volume (ml)', 'Обем (мл)', 'number', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Oral Care - Toothpaste
    SELECT id INTO v_category_id FROM categories WHERE slug = 'toothpaste' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Type', 'Тип', 'select', true, true, '["Regular", "Whitening", "Sensitive", "Anti-Cavity", "Gum Care", "Kids"]', '["Обикновена", "Избелваща", "За чувствителни зъби", "Против кариес", "За венци", "Детска"]', 1),
            (v_category_id, 'Fluoride', 'Флуорид', 'boolean', false, true, NULL, NULL, 2),
            (v_category_id, 'Flavor', 'Аромат', 'select', false, true, '["Mint", "Spearmint", "Peppermint", "Bubblegum", "Fruit", "Unflavored"]', '["Мента", "Джоджен", "Пипермент", "Дъвка", "Плодов", "Без аромат"]', 3),
            (v_category_id, 'Volume (ml)', 'Обем (мл)', 'number', false, false, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Oral Care - Mouthwash
    SELECT id INTO v_category_id FROM categories WHERE slug = 'mouthwash' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Type', 'Тип', 'select', true, true, '["Antiseptic", "Cosmetic", "Natural", "Kids", "Whitening"]', '["Антисептична", "Козметична", "Натурална", "Детска", "Избелваща"]', 1),
            (v_category_id, 'Alcohol-Free', 'Без алкохол', 'boolean', false, true, NULL, NULL, 2),
            (v_category_id, 'Flavor', 'Аромат', 'select', false, true, '["Mint", "Spearmint", "Cinnamon", "Fruit"]', '["Мента", "Джоджен", "Канела", "Плодов"]', 3),
            (v_category_id, 'Volume (ml)', 'Обем (мл)', 'number', false, false, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Oral Care - Toothbrushes
    SELECT id INTO v_category_id FROM categories WHERE slug = 'toothbrushes' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Type', 'Тип', 'select', true, true, '["Manual", "Electric", "Battery-Powered", "Sonic"]', '["Ръчна", "Електрическа", "На батерии", "Звукова"]', 1),
            (v_category_id, 'Bristle Hardness', 'Твърдост на косъмчетата', 'select', false, true, '["Soft", "Medium", "Hard", "Extra Soft"]', '["Меки", "Средни", "Твърди", "Екстра меки"]', 2),
            (v_category_id, 'Age Group', 'Възрастова група', 'select', false, true, '["Adults", "Kids", "Baby", "Teens"]', '["Възрастни", "Деца", "Бебета", "Тийнейджъри"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
