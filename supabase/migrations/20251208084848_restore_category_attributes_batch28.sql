DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Office Supplies - Paper Products
    SELECT id INTO v_category_id FROM categories WHERE slug = 'paper-products' OR slug = 'paper' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Printer Paper", "Notebooks", "Envelopes", "Sticky Notes", "Labels", "Folders"]', '["Хартия за принтер", "Тетрадки", "Пликове", "Лепящи бележки", "Етикети", "Папки"]', 1),
            (v_category_id, 'Size', 'Размер', 'select', false, true, '["A4", "A5", "A3", "Letter", "Legal", "Other"]', '["A4", "A5", "A3", "Letter", "Legal", "Друг"]', 2),
            (v_category_id, 'Weight (gsm)', 'Плътност (gsm)', 'select', false, true, '["70-80", "90-100", "120+", "Premium"]', '["70-80", "90-100", "120+", "Премиум"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Office Supplies - Writing Instruments
    SELECT id INTO v_category_id FROM categories WHERE slug = 'writing-instruments' OR slug = 'pens-pencils' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Type', 'Тип', 'select', true, true, '["Ballpoint Pen", "Gel Pen", "Fountain Pen", "Marker", "Highlighter", "Pencil", "Mechanical Pencil"]', '["Химикал", "Гел химикал", "Писалка", "Маркер", "Текст маркер", "Молив", "Автоматичен молив"]', 1),
            (v_category_id, 'Ink Color', 'Цвят мастило', 'multiselect', false, true, '["Black", "Blue", "Red", "Green", "Multicolor"]', '["Черно", "Синьо", "Червено", "Зелено", "Многоцветно"]', 2),
            (v_category_id, 'Tip Size', 'Размер връх', 'select', false, true, '["Fine", "Medium", "Bold", "Extra Fine"]', '["Тънък", "Среден", "Дебел", "Много тънък"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Office Furniture
    SELECT id INTO v_category_id FROM categories WHERE slug = 'office-furniture' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Furniture Type', 'Тип мебел', 'select', true, true, '["Desk", "Chair", "Filing Cabinet", "Bookshelf", "Partition", "Reception"]', '["Бюро", "Стол", "Шкаф", "Етажерка", "Преградка", "Рецепция"]', 1),
            (v_category_id, 'Material', 'Материал', 'select', false, true, '["Wood", "Metal", "Glass", "Plastic", "Laminate"]', '["Дърво", "Метал", "Стъкло", "Пластмаса", "Ламинат"]', 2),
            (v_category_id, 'Ergonomic', 'Ергономичен', 'boolean', false, true, NULL, NULL, 3),
            (v_category_id, 'Assembly Required', 'Изисква монтаж', 'boolean', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- School Supplies
    SELECT id INTO v_category_id FROM categories WHERE slug = 'school-supplies' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Backpack", "Pencil Case", "Notebooks", "Art Supplies", "Calculators", "Rulers", "Scissors"]', '["Раница", "Несесер", "Тетрадки", "Арт материали", "Калкулатори", "Линии", "Ножици"]', 1),
            (v_category_id, 'Grade Level', 'Клас', 'select', false, true, '["Elementary", "Middle School", "High School", "University", "All"]', '["Начално", "Прогимназия", "Гимназия", "Университет", "Всички"]', 2)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Jewelry - Rings
    SELECT id INTO v_category_id FROM categories WHERE slug = 'rings' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Ring Type', 'Тип пръстен', 'select', true, true, '["Engagement", "Wedding", "Fashion", "Statement", "Stackable", "Signet"]', '["Годежен", "Сватбен", "Модерен", "Масивен", "За комбиниране", "Печатен"]', 1),
            (v_category_id, 'Metal', 'Метал', 'select', true, true, '["Gold", "Silver", "Platinum", "Rose Gold", "Titanium", "Stainless Steel"]', '["Злато", "Сребро", "Платина", "Розово злато", "Титан", "Неръждаема стомана"]', 2),
            (v_category_id, 'Gemstone', 'Скъпоценен камък', 'select', false, true, '["Diamond", "Ruby", "Sapphire", "Emerald", "Pearl", "None", "Other"]', '["Диамант", "Рубин", "Сапфир", "Изумруд", "Перла", "Без камък", "Друг"]', 3),
            (v_category_id, 'Ring Size', 'Размер', 'select', false, true, '["4", "5", "6", "7", "8", "9", "10", "11", "12"]', '["4", "5", "6", "7", "8", "9", "10", "11", "12"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Jewelry - Necklaces
    SELECT id INTO v_category_id FROM categories WHERE slug = 'necklaces' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Necklace Type', 'Тип колие', 'select', true, true, '["Pendant", "Chain", "Choker", "Statement", "Lariat", "Layered"]', '["С висулка", "Верижка", "Чокър", "Масивно", "Лариат", "Многослойно"]', 1),
            (v_category_id, 'Metal', 'Метал', 'select', true, true, '["Gold", "Silver", "Rose Gold", "Platinum", "Stainless Steel", "Plated"]', '["Злато", "Сребро", "Розово злато", "Платина", "Неръждаема стомана", "Позлатено"]', 2),
            (v_category_id, 'Length (cm)', 'Дължина (см)', 'select', false, true, '["40", "45", "50", "55", "60", "Adjustable"]', '["40", "45", "50", "55", "60", "Регулируема"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Jewelry - Earrings
    SELECT id INTO v_category_id FROM categories WHERE slug = 'earrings' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Earring Type', 'Тип обеци', 'select', true, true, '["Stud", "Hoop", "Drop", "Dangle", "Chandelier", "Huggie", "Clip-On"]', '["Обици", "Халки", "Висящи", "С висулка", "Полилей", "Прилепнали", "Щипка"]', 1),
            (v_category_id, 'Metal', 'Метал', 'select', true, true, '["Gold", "Silver", "Rose Gold", "Platinum", "Stainless Steel"]', '["Злато", "Сребро", "Розово злато", "Платина", "Неръждаема стомана"]', 2),
            (v_category_id, 'Hypoallergenic', 'Хипоалергенни', 'boolean', false, true, NULL, NULL, 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Jewelry - Bracelets
    SELECT id INTO v_category_id FROM categories WHERE slug = 'bracelets' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Bracelet Type', 'Тип гривна', 'select', true, true, '["Chain", "Bangle", "Cuff", "Charm", "Tennis", "Beaded", "Leather"]', '["Верижка", "Бангъл", "Маншет", "С талисмани", "Тенис", "С мъниста", "Кожена"]', 1),
            (v_category_id, 'Metal', 'Метал', 'select', true, true, '["Gold", "Silver", "Rose Gold", "Stainless Steel", "Mixed"]', '["Злато", "Сребро", "Розово злато", "Неръждаема стомана", "Смесен"]', 2),
            (v_category_id, 'Size', 'Размер', 'select', false, true, '["Small (16-17cm)", "Medium (18-19cm)", "Large (20-21cm)", "Adjustable"]', '["Малък (16-17см)", "Среден (18-19см)", "Голям (20-21см)", "Регулируем"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
