DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Men's Grooming - Shaving
    SELECT id INTO v_category_id FROM categories WHERE slug = 'shaving' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Razor", "Shaving Cream", "Shaving Gel", "Aftershave", "Pre-Shave Oil", "Blades"]', '["Самобръсначка", "Крем за бръснене", "Гел за бръснене", "Афтършейв", "Масло преди бръснене", "Ножчета"]', 1),
            (v_category_id, 'Razor Type', 'Тип самобръсначка', 'select', false, true, '["Disposable", "Cartridge", "Safety", "Electric", "Straight"]', '["За еднократна употреба", "С касета", "Класическа", "Електрическа", "Бръснач"]', 2),
            (v_category_id, 'Skin Type', 'Тип кожа', 'multiselect', false, true, '["All Skin", "Sensitive", "Normal", "Oily", "Dry"]', '["Всички типове", "Чувствителна", "Нормална", "Мазна", "Суха"]', 3),
            (v_category_id, 'Blade Count', 'Брой ножчета', 'select', false, true, '["1", "2", "3", "4", "5", "6+"]', '["1", "2", "3", "4", "5", "6+"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Men's Grooming - Beard Care
    SELECT id INTO v_category_id FROM categories WHERE slug = 'beard-care' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Beard Oil", "Beard Balm", "Beard Wash", "Beard Brush", "Beard Comb", "Trimmer", "Beard Wax"]', '["Масло за брада", "Балсам за брада", "Шампоан за брада", "Четка за брада", "Гребен за брада", "Тример", "Восък за брада"]', 1),
            (v_category_id, 'Scent', 'Аромат', 'select', false, true, '["Unscented", "Woodsy", "Citrus", "Mint", "Sandalwood", "Cedar"]', '["Без аромат", "Дървесен", "Цитрусов", "Ментов", "Сандалово дърво", "Кедър"]', 2),
            (v_category_id, 'Beard Length', 'Дължина на брадата', 'select', false, true, '["Stubble", "Short", "Medium", "Long"]', '["Брадясал", "Къса", "Средна", "Дълга"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Beauty Tools - Hair Dryers
    SELECT id INTO v_category_id FROM categories WHERE slug = 'hair-dryers' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Wattage', 'Мощност (W)', 'number', true, true, NULL, NULL, 1),
            (v_category_id, 'Technology', 'Технология', 'multiselect', false, true, '["Ionic", "Ceramic", "Tourmaline", "Infrared", "AC Motor", "DC Motor"]', '["Йонна", "Керамична", "Турмалинова", "Инфрачервена", "AC мотор", "DC мотор"]', 2),
            (v_category_id, 'Heat Settings', 'Настройки за топлина', 'select', false, true, '["1", "2", "3", "Multiple"]', '["1", "2", "3", "Множество"]', 3),
            (v_category_id, 'Speed Settings', 'Настройки за скорост', 'select', false, true, '["1", "2", "3"]', '["1", "2", "3"]', 4),
            (v_category_id, 'Cool Shot', 'Студен въздух', 'boolean', false, true, NULL, NULL, 5),
            (v_category_id, 'Attachments', 'Приставки', 'multiselect', false, true, '["Concentrator", "Diffuser", "Comb", "Brush"]', '["Концентратор", "Дифузер", "Гребен", "Четка"]', 6)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Beauty Tools - Straighteners
    SELECT id INTO v_category_id FROM categories WHERE slug = 'straighteners' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Plate Material', 'Материал на плочите', 'select', true, true, '["Ceramic", "Titanium", "Tourmaline", "Keratin-Infused"]', '["Керамични", "Титаниеви", "Турмалинови", "С кератин"]', 1),
            (v_category_id, 'Plate Width', 'Ширина на плочите', 'select', false, true, '["Narrow (1\")", "Standard (1.5\")", "Wide (2\")"]', '["Тесни (2.5см)", "Стандартни (3.8см)", "Широки (5см)"]', 2),
            (v_category_id, 'Max Temperature', 'Макс. температура (°C)', 'number', false, true, NULL, NULL, 3),
            (v_category_id, 'Floating Plates', 'Плаващи плочи', 'boolean', false, true, NULL, NULL, 4),
            (v_category_id, 'Auto Shut-Off', 'Автоматично изключване', 'boolean', false, true, NULL, NULL, 5)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Beauty Tools - Curling Irons
    SELECT id INTO v_category_id FROM categories WHERE slug = 'curling-irons' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Barrel Size', 'Размер на цилиндъра', 'select', true, true, '["0.5\"", "0.75\"", "1\"", "1.25\"", "1.5\"", "2\""]', '["13мм", "19мм", "25мм", "32мм", "38мм", "50мм"]', 1),
            (v_category_id, 'Barrel Material', 'Материал', 'select', false, true, '["Ceramic", "Titanium", "Tourmaline", "Gold-Plated"]', '["Керамичен", "Титаниев", "Турмалинов", "Позлатен"]', 2),
            (v_category_id, 'Barrel Type', 'Тип цилиндър', 'select', false, true, '["Clamp", "Clipless Wand", "Conical", "Interchangeable"]', '["С щипка", "Без щипка", "Конусовиден", "Сменяеми"]', 3),
            (v_category_id, 'Max Temperature', 'Макс. температура (°C)', 'number', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Beauty Tools - Electric Shavers
    SELECT id INTO v_category_id FROM categories WHERE slug = 'electric-shavers' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Shaver Type', 'Тип самобръсначка', 'select', true, true, '["Foil", "Rotary", "Wet & Dry", "Body Groomer"]', '["Фолио", "Ротационна", "Мокро и сухо", "За тяло"]', 1),
            (v_category_id, 'Power Source', 'Захранване', 'select', false, true, '["Rechargeable", "Corded", "Battery", "Corded/Cordless"]', '["Акумулаторна", "С кабел", "На батерии", "С кабел/безжична"]', 2),
            (v_category_id, 'Waterproof', 'Водоустойчива', 'boolean', false, true, NULL, NULL, 3),
            (v_category_id, 'Cleaning System', 'Система за почистване', 'select', false, true, '["Manual", "Self-Cleaning", "Cleaning Station"]', '["Ръчна", "Самопочистваща", "Станция за почистване"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
