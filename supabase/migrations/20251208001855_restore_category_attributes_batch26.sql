DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Vehicles - Cars
    SELECT id INTO v_category_id FROM categories WHERE slug = 'cars' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Body Type', 'Тип каросерия', 'select', true, true, '["Sedan", "Hatchback", "SUV", "Coupe", "Wagon", "Convertible", "Van", "Pickup"]', '["Седан", "Хечбек", "Джип", "Купе", "Комби", "Кабрио", "Ван", "Пикап"]', 1),
            (v_category_id, 'Fuel Type', 'Гориво', 'select', true, true, '["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG"]', '["Бензин", "Дизел", "Електрически", "Хибрид", "LPG", "Метан"]', 2),
            (v_category_id, 'Transmission', 'Трансмисия', 'select', false, true, '["Manual", "Automatic", "Semi-Automatic", "CVT"]', '["Ръчна", "Автоматична", "Полуавтоматична", "CVT"]', 3),
            (v_category_id, 'Mileage (km)', 'Километраж', 'number', false, true, NULL, NULL, 4),
            (v_category_id, 'Year', 'Година', 'number', true, true, NULL, NULL, 5),
            (v_category_id, 'Engine Size (cc)', 'Обем двигател (куб.см)', 'number', false, true, NULL, NULL, 6),
            (v_category_id, 'Power (HP)', 'Мощност (к.с.)', 'number', false, true, NULL, NULL, 7),
            (v_category_id, 'Drive Type', 'Задвижване', 'select', false, true, '["Front-Wheel", "Rear-Wheel", "All-Wheel", "4x4"]', '["Предно", "Задно", "4x4", "AWD"]', 8)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Vehicles - Motorcycles
    SELECT id INTO v_category_id FROM categories WHERE slug = 'motorcycles' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Type', 'Тип', 'select', true, true, '["Sport", "Cruiser", "Touring", "Off-Road", "Scooter", "Naked", "Adventure"]', '["Спортен", "Круизър", "Туристически", "Офроуд", "Скутер", "Naked", "Adventure"]', 1),
            (v_category_id, 'Engine Size (cc)', 'Обем двигател (куб.см)', 'number', true, true, NULL, NULL, 2),
            (v_category_id, 'Year', 'Година', 'number', true, true, NULL, NULL, 3),
            (v_category_id, 'Mileage (km)', 'Километраж', 'number', false, true, NULL, NULL, 4),
            (v_category_id, 'License Category', 'Категория', 'select', false, true, '["AM", "A1", "A2", "A"]', '["AM", "A1", "A2", "A"]', 5)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Vehicles - Boats
    SELECT id INTO v_category_id FROM categories WHERE slug = 'boats' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Boat Type', 'Тип лодка', 'select', true, true, '["Motorboat", "Sailboat", "Yacht", "Jet Ski", "Fishing Boat", "Inflatable", "Kayak", "Canoe"]', '["Моторна лодка", "Платноходка", "Яхта", "Джет", "Риболовна", "Надуваема", "Каяк", "Кану"]', 1),
            (v_category_id, 'Length (m)', 'Дължина (м)', 'number', false, true, NULL, NULL, 2),
            (v_category_id, 'Year', 'Година', 'number', false, true, NULL, NULL, 3),
            (v_category_id, 'Engine Power (HP)', 'Мощност двигател (к.с.)', 'number', false, true, NULL, NULL, 4),
            (v_category_id, 'Capacity (persons)', 'Капацитет (лица)', 'number', false, true, NULL, NULL, 5)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Vehicles - ATVs
    SELECT id INTO v_category_id FROM categories WHERE slug = 'atvs' OR slug = 'atv' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Type', 'Тип', 'select', true, true, '["Sport", "Utility", "Youth", "Side-by-Side"]', '["Спортно", "Работно", "Детско", "Side-by-Side"]', 1),
            (v_category_id, 'Engine Size (cc)', 'Обем двигател (куб.см)', 'number', true, true, NULL, NULL, 2),
            (v_category_id, 'Year', 'Година', 'number', false, true, NULL, NULL, 3),
            (v_category_id, 'Drive Type', 'Задвижване', 'select', false, true, '["2WD", "4WD", "Selectable"]', '["2WD", "4WD", "Избираемо"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Vehicles - Trucks
    SELECT id INTO v_category_id FROM categories WHERE slug = 'trucks' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Truck Type', 'Тип камион', 'select', true, true, '["Light", "Medium", "Heavy", "Tractor", "Dump Truck", "Refrigerated"]', '["Лекотоварен", "Среден", "Тежкотоварен", "Влекач", "Самосвал", "Хладилен"]', 1),
            (v_category_id, 'Load Capacity (tons)', 'Товароносимост (тона)', 'number', false, true, NULL, NULL, 2),
            (v_category_id, 'Year', 'Година', 'number', true, true, NULL, NULL, 3),
            (v_category_id, 'Mileage (km)', 'Километраж', 'number', false, true, NULL, NULL, 4),
            (v_category_id, 'Fuel Type', 'Гориво', 'select', false, true, '["Diesel", "Electric", "CNG", "LPG"]', '["Дизел", "Електрически", "Метан", "LPG"]', 5)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Vehicles - Bicycles
    SELECT id INTO v_category_id FROM categories WHERE slug = 'bicycles' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Bike Type', 'Тип велосипед', 'select', true, true, '["Mountain", "Road", "City", "BMX", "Hybrid", "Folding", "Electric", "Kids"]', '["Планински", "Шосеен", "Градски", "BMX", "Хибриден", "Сгъваем", "Електрически", "Детски"]', 1),
            (v_category_id, 'Frame Size', 'Размер рамка', 'select', false, true, '["XS", "S", "M", "L", "XL"]', '["XS", "S", "M", "L", "XL"]', 2),
            (v_category_id, 'Wheel Size', 'Размер гуми', 'select', false, true, '["12\"", "16\"", "20\"", "24\"", "26\"", "27.5\"", "29\"", "700c"]', '["12\"", "16\"", "20\"", "24\"", "26\"", "27.5\"", "29\"", "700c"]', 3),
            (v_category_id, 'Frame Material', 'Материал рамка', 'select', false, true, '["Aluminum", "Steel", "Carbon Fiber", "Titanium"]', '["Алуминий", "Стомана", "Карбон", "Титан"]', 4),
            (v_category_id, 'Gears', 'Скорости', 'select', false, true, '["Single Speed", "7-9", "10-12", "18-21", "24-27", "30+"]', '["Една скорост", "7-9", "10-12", "18-21", "24-27", "30+"]', 5)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
