DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Bulgarian Traditional - Rose Products
    SELECT id INTO v_category_id FROM categories WHERE slug = 'rose-products' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Rose Oil", "Rose Water", "Rose Cream", "Rose Soap", "Rose Perfume", "Rose Jam"]', '["Розово масло", "Розова вода", "Розов крем", "Розов сапун", "Розов парфюм", "Розово сладко"]', 1),
            (v_category_id, 'Origin', 'Произход', 'select', false, true, '["Kazanlak Valley", "Karlovo", "Pavel Banya", "Other"]', '["Казанлъшка долина", "Карлово", "Павел Баня", "Друг"]', 2),
            (v_category_id, 'Certification', 'Сертификация', 'multiselect', false, true, '["Organic", "Natural", "Traditional Recipe", "PDO"]', '["Органичен", "Натурален", "Традиционна рецепта", "ЗНП"]', 3),
            (v_category_id, 'Volume/Weight', 'Обем/Тегло', 'text', false, false, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Bulgarian Traditional - Honey
    SELECT id INTO v_category_id FROM categories WHERE slug = 'honey' OR slug = 'bulgarian-honey' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Honey Type', 'Тип мед', 'select', true, true, '["Acacia", "Linden", "Wildflower", "Mountain", "Sunflower", "Honeydew", "Propolis"]', '["Акациев", "Липов", "Полски", "Планински", "Слънчогледов", "Манов", "Прополисов"]', 1),
            (v_category_id, 'Origin Region', 'Регион', 'select', false, true, '["Strandja", "Rhodope", "Rila", "Pirin", "Sredna Gora", "Other"]', '["Странджа", "Родопи", "Рила", "Пирин", "Средна гора", "Друг"]', 2),
            (v_category_id, 'Organic', 'Органичен', 'boolean', false, true, NULL, NULL, 3),
            (v_category_id, 'Raw/Processed', 'Суров/Преработен', 'select', false, true, '["Raw", "Processed", "Creamed"]', '["Суров", "Преработен", "Крем"]', 4),
            (v_category_id, 'Weight (g)', 'Тегло (г)', 'number', false, true, NULL, NULL, 5)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Bulgarian Traditional - Wine
    SELECT id INTO v_category_id FROM categories WHERE slug = 'wine' OR slug = 'bulgarian-wine' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Wine Type', 'Тип вино', 'select', true, true, '["Red", "White", "Rose", "Sparkling", "Dessert"]', '["Червено", "Бяло", "Розе", "Пенливо", "Десертно"]', 1),
            (v_category_id, 'Grape Variety', 'Сорт грозде', 'multiselect', false, true, '["Mavrud", "Melnik", "Rubin", "Gamza", "Dimyat", "Misket", "Chardonnay", "Cabernet"]', '["Мавруд", "Мелник", "Рубин", "Гъмза", "Димят", "Мискет", "Шардоне", "Каберне"]', 2),
            (v_category_id, 'Region', 'Регион', 'select', false, true, '["Thracian Valley", "Struma Valley", "Danube Plain", "Black Sea", "Rose Valley"]', '["Тракийска низина", "Струмска долина", "Дунавска равнина", "Черноморие", "Розова долина"]', 3),
            (v_category_id, 'Year', 'Година', 'number', false, true, NULL, NULL, 4),
            (v_category_id, 'Volume (ml)', 'Обем (мл)', 'number', false, false, NULL, NULL, 5)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Bulgarian Traditional - Rakia
    SELECT id INTO v_category_id FROM categories WHERE slug = 'rakia' OR slug = 'bulgarian-rakia' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Fruit Type', 'Вид плод', 'select', true, true, '["Grape", "Plum", "Apricot", "Apple", "Pear", "Quince", "Cherry", "Rose"]', '["Гроздова", "Сливова", "Кайсиева", "Ябълкова", "Крушова", "Дюлева", "Вишнева", "Розова"]', 1),
            (v_category_id, 'Aging', 'Отлежаване', 'select', false, true, '["Young", "Aged", "Oak-Aged", "Long-Aged"]', '["Млада", "Отлежала", "В дъб", "Дългогодишна"]', 2),
            (v_category_id, 'Alcohol %', 'Алкохол %', 'number', false, true, NULL, NULL, 3),
            (v_category_id, 'Volume (ml)', 'Обем (мл)', 'number', false, false, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Bulgarian Traditional - Herbs & Spices
    SELECT id INTO v_category_id FROM categories WHERE slug = 'herbs-spices' OR slug = 'bulgarian-herbs' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Type', 'Тип', 'select', true, true, '["Herbs", "Spices", "Tea Blends", "Medicinal"]', '["Билки", "Подправки", "Чайове", "Лечебни"]', 1),
            (v_category_id, 'Form', 'Форма', 'select', false, true, '["Dried", "Fresh", "Ground", "Whole", "Extract"]', '["Сушени", "Пресни", "Смлени", "Цели", "Екстракт"]', 2),
            (v_category_id, 'Origin', 'Произход', 'select', false, true, '["Rhodope", "Strandja", "Rila", "Balkan Range", "Other"]', '["Родопи", "Странджа", "Рила", "Стара планина", "Друг"]', 3),
            (v_category_id, 'Organic', 'Органичен', 'boolean', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Crafts & Textiles
    SELECT id INTO v_category_id FROM categories WHERE slug = 'crafts-textiles' OR slug = 'bulgarian-crafts' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Craft Type', 'Тип занаят', 'select', true, true, '["Embroidery", "Pottery", "Woodcarving", "Weaving", "Metalwork", "Leather"]', '["Бродерия", "Керамика", "Дърворезба", "Тъкачество", "Металообработка", "Кожарство"]', 1),
            (v_category_id, 'Region Style', 'Регионален стил', 'select', false, true, '["Thracian", "Rhodope", "Shopluk", "Dobrudzha", "Pirin", "General Bulgarian"]', '["Тракийски", "Родопски", "Шопски", "Добруджански", "Пирински", "Общобългарски"]', 2),
            (v_category_id, 'Handmade', 'Ръчна изработка', 'boolean', false, true, NULL, NULL, 3),
            (v_category_id, 'Material', 'Материал', 'multiselect', false, true, '["Cotton", "Wool", "Silk", "Linen", "Wood", "Clay", "Metal"]', '["Памук", "Вълна", "Коприна", "Лен", "Дърво", "Глина", "Метал"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
