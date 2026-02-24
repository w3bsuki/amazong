-- Phase 4: PETS Category Attributes (Part 3) - Additional Specific Attributes
DO $$
DECLARE
    pets_id UUID;
BEGIN
    SELECT id INTO pets_id FROM categories WHERE slug = 'pets';
    
    -- Grooming Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Grooming Type', 'Тип грууминг', 'select',
            '["Brush/Comb", "Shampoo", "Conditioner", "Deshedding", "Nail Care", "Ear Care", "Eye Care", "Dental", "Deodorizing", "Styling"]',
            '["Четка/Гребен", "Шампоан", "Балсам", "Премахване на козина", "Грижа за нокти", "Грижа за уши", "Грижа за очи", "Зъбна грижа", "Дезодориране", "Стилизиране"]',
            false, true, 21)
    ON CONFLICT DO NOTHING;
    
    -- Coat Type (for grooming products)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Coat Type', 'Тип козина', 'select',
            '["Short Hair", "Medium Hair", "Long Hair", "Double Coat", "Curly/Wavy", "Wire/Harsh", "Hairless", "All Coat Types"]',
            '["Късокосмест", "Средна козина", "Дългокосмест", "Двойна козина", "Къдрава/Вълнообразна", "Твърда", "Безкосмест", "Всички типове"]',
            false, true, 22)
    ON CONFLICT DO NOTHING;
    
    -- Litter Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Litter Type', 'Тип постелка', 'select',
            '["Clumping Clay", "Non-Clumping Clay", "Silica Gel/Crystal", "Recycled Paper", "Pine/Wood", "Corn", "Wheat", "Grass", "Walnut Shell", "Tofu/Soy"]',
            '["Сбиваща се глина", "Несбиваща се глина", "Силикагел/Кристал", "Рециклирана хартия", "Бор/Дърво", "Царевица", "Пшеница", "Трева", "Орехова черупка", "Тофу/Соя"]',
            false, true, 23)
    ON CONFLICT DO NOTHING;
    
    -- Scent
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Scent', 'Аромат', 'select',
            '["Unscented", "Fresh/Clean", "Lavender", "Oatmeal", "Coconut", "Aloe", "Tea Tree", "Cherry", "Vanilla", "Fresh Linen"]',
            '["Без аромат", "Свеж/Чист", "Лавандула", "Овесени ядки", "Кокос", "Алое", "Чаено дърво", "Череша", "Ванилия", "Свежо бельо"]',
            false, true, 24)
    ON CONFLICT DO NOTHING;
    
    -- Breed Size (specific for clothing/harnesses)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Breed Size', 'Размер на порода', 'select',
            '["Teacup", "Toy Breeds", "Small Breeds", "Medium Breeds", "Large Breeds", "Giant Breeds"]',
            '["Миниатюрни", "Той породи", "Малки породи", "Средни породи", "Големи породи", "Гигантски породи"]',
            false, true, 25)
    ON CONFLICT DO NOTHING;
    
    -- Training Purpose
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Training Purpose', 'Цел на обучение', 'select',
            '["Basic Obedience", "House Training", "Crate Training", "Leash Training", "Trick Training", "Behavior Correction", "Agility", "Hunting/Retrieval", "Service Dog"]',
            '["Основно послушание", "Обучение у дома", "Обучение в клетка", "Обучение с каишка", "Обучение на трикове", "Корекция на поведение", "Аджилити", "Лов/Апортиране", "Служебно куче"]',
            false, true, 26)
    ON CONFLICT DO NOTHING;
    
    -- Power Source (for electronic items)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Power Source', 'Източник на захранване', 'select',
            '["Battery", "Rechargeable", "USB", "AC Adapter", "Solar", "Manual"]',
            '["Батерия", "Презареждаем", "USB", "AC адаптер", "Слънчев", "Ръчен"]',
            false, true, 27)
    ON CONFLICT DO NOTHING;
    
    -- Connectivity (for tech products)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Connectivity', 'Свързаност', 'select',
            '["WiFi", "Bluetooth", "GPS/Cellular", "RFID/Microchip", "App-Enabled", "No Connectivity"]',
            '["WiFi", "Bluetooth", "GPS/Клетъчна мрежа", "RFID/Микрочип", "С приложение", "Без свързаност"]',
            false, true, 28)
    ON CONFLICT DO NOTHING;
    
    -- Weather/Temperature Suitability
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Weather Suitability', 'Подходящо за времето', 'multiselect',
            '["Cold Weather", "Hot Weather", "Rain/Water Resistant", "All Weather", "Indoor Only"]',
            '["Студено време", "Горещо време", "Устойчив на дъжд/вода", "Всяко време", "Само за закрито"]',
            false, true, 29)
    ON CONFLICT DO NOTHING;
    
    -- Washable
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Washable', 'Пригоден за пране', 'select',
            '["Machine Washable", "Hand Wash Only", "Spot Clean", "Not Washable", "Dishwasher Safe"]',
            '["Машинно пране", "Само ръчно пране", "Точково почистване", "Не се пере", "Безопасен за съдомиялна"]',
            false, true, 30)
    ON CONFLICT DO NOTHING;
END $$;;
