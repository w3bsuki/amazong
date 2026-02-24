DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Wholesale - Bulk Electronics
    SELECT id INTO v_category_id FROM categories WHERE slug = 'bulk-electronics' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Category', 'Категория продукт', 'select', true, true, '["Phones", "Tablets", "Laptops", "Accessories", "Components", "Cables"]', '["Телефони", "Таблети", "Лаптопи", "Аксесоари", "Компоненти", "Кабели"]', 1),
            (v_category_id, 'Minimum Order Quantity', 'Минимална поръчка', 'number', true, true, NULL, NULL, 2),
            (v_category_id, 'Condition', 'Състояние', 'select', false, true, '["New", "Refurbished", "Open Box", "Mixed"]', '["Нов", "Рефърбиш", "Отворена кутия", "Смесено"]', 3),
            (v_category_id, 'Warranty', 'Гаранция', 'select', false, true, '["None", "30 Days", "90 Days", "1 Year", "Manufacturer"]', '["Няма", "30 дни", "90 дни", "1 година", "Производител"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Wholesale - Bulk Clothing
    SELECT id INTO v_category_id FROM categories WHERE slug = 'bulk-clothing' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Clothing Type', 'Тип дрехи', 'select', true, true, '["T-Shirts", "Shirts", "Pants", "Dresses", "Jackets", "Accessories", "Underwear"]', '["Тениски", "Ризи", "Панталони", "Рокли", "Якета", "Аксесоари", "Бельо"]', 1),
            (v_category_id, 'Minimum Order Quantity', 'Минимална поръчка', 'number', true, true, NULL, NULL, 2),
            (v_category_id, 'Sizes Available', 'Налични размери', 'multiselect', false, true, '["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Mixed"]', '["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Смесени"]', 3),
            (v_category_id, 'Gender', 'Пол', 'select', false, true, '["Men", "Women", "Unisex", "Kids", "Mixed"]', '["Мъжки", "Дамски", "Унисекс", "Детски", "Смесено"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Wholesale - Bulk Food
    SELECT id INTO v_category_id FROM categories WHERE slug = 'bulk-food' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Food Category', 'Категория храна', 'select', true, true, '["Snacks", "Beverages", "Canned Goods", "Dry Goods", "Frozen", "Dairy", "Confectionery"]', '["Снаксове", "Напитки", "Консерви", "Сухи продукти", "Замразени", "Млечни", "Сладкарски"]', 1),
            (v_category_id, 'Minimum Order Quantity', 'Минимална поръчка', 'number', true, true, NULL, NULL, 2),
            (v_category_id, 'Shelf Life', 'Срок на годност', 'select', false, true, '["< 1 month", "1-3 months", "3-6 months", "6-12 months", "1+ years"]', '["< 1 месец", "1-3 месеца", "3-6 месеца", "6-12 месеца", "1+ години"]', 3),
            (v_category_id, 'Storage Requirements', 'Изисквания за съхранение', 'select', false, true, '["Room Temperature", "Refrigerated", "Frozen", "Cool & Dry"]', '["Стайна температура", "Хладилник", "Замразено", "Хладно и сухо"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Wholesale - Bulk Home Goods
    SELECT id INTO v_category_id FROM categories WHERE slug = 'bulk-home-goods' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Kitchenware", "Bathroom", "Cleaning", "Storage", "Decor", "Textiles"]', '["Кухненски", "Баня", "Почистване", "Съхранение", "Декор", "Текстил"]', 1),
            (v_category_id, 'Minimum Order Quantity', 'Минимална поръчка', 'number', true, true, NULL, NULL, 2),
            (v_category_id, 'Material', 'Материал', 'multiselect', false, true, '["Plastic", "Glass", "Metal", "Ceramic", "Wood", "Fabric"]', '["Пластмаса", "Стъкло", "Метал", "Керамика", "Дърво", "Плат"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Wholesale - Bulk Beauty
    SELECT id INTO v_category_id FROM categories WHERE slug = 'bulk-beauty' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Skincare", "Haircare", "Makeup", "Fragrances", "Nail Care", "Tools"]', '["Грижа за кожата", "Грижа за косата", "Грим", "Парфюми", "Маникюр", "Инструменти"]', 1),
            (v_category_id, 'Minimum Order Quantity', 'Минимална поръчка', 'number', true, true, NULL, NULL, 2),
            (v_category_id, 'Brand Type', 'Тип марка', 'select', false, true, '["Premium", "Mid-Range", "Budget", "Private Label"]', '["Премиум", "Среден клас", "Бюджетен", "Частна марка"]', 3),
            (v_category_id, 'Shelf Life', 'Срок на годност', 'select', false, true, '["6 months", "12 months", "24 months", "36 months"]', '["6 месеца", "12 месеца", "24 месеца", "36 месеца"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Wholesale - Bulk Toys
    SELECT id INTO v_category_id FROM categories WHERE slug = 'bulk-toys' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Toy Type', 'Тип играчка', 'select', true, true, '["Action Figures", "Dolls", "Educational", "Outdoor", "Puzzles", "Vehicles", "Plush"]', '["Екшън фигури", "Кукли", "Образователни", "За навън", "Пъзели", "Превозни", "Плюшени"]', 1),
            (v_category_id, 'Minimum Order Quantity', 'Минимална поръчка', 'number', true, true, NULL, NULL, 2),
            (v_category_id, 'Age Range', 'Възрастов диапазон', 'select', false, true, '["0-2", "3-5", "6-8", "9-12", "13+", "All Ages"]', '["0-2", "3-5", "6-8", "9-12", "13+", "Всички възрасти"]', 3),
            (v_category_id, 'Safety Certified', 'Сертифицирана безопасност', 'boolean', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
