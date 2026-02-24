-- Phase 4: PETS Category Attributes (Part 5) - Final Attributes
DO $$
DECLARE
    pets_id UUID;
BEGIN
    SELECT id INTO pets_id FROM categories WHERE slug = 'pets';
    
    -- Horse Discipline
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Horse Discipline', 'Дисциплина за коне', 'select',
            '["All Disciplines", "Western", "English", "Dressage", "Jumping", "Trail/Pleasure", "Racing", "Endurance", "Polo", "Rodeo"]',
            '["Всички дисциплини", "Уестърн", "Английска езда", "Дресур", "Прескачане", "Рекреационна езда", "Състезания", "Издръжливост", "Поло", "Родео"]',
            false, true, 47)
    ON CONFLICT DO NOTHING;
    
    -- Horse Size
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Horse Size', 'Размер на кон', 'select',
            '["Pony (Under 14.2 hands)", "Small Horse (14.2-15.2 hands)", "Average (15.2-16.2 hands)", "Large (16.2-17.2 hands)", "Draft (17.2+ hands)"]',
            '["Пони (под 145 см)", "Малък кон (145-155 см)", "Среден (155-165 см)", "Голям (165-175 см)", "Тежковоз (175+ см)"]',
            false, true, 48)
    ON CONFLICT DO NOTHING;
    
    -- Blanket Weight
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Blanket Weight', 'Тегло на одеяло', 'select',
            '["Sheet/No Fill", "Lightweight (100-150g)", "Medium (200-250g)", "Heavyweight (300-400g)", "Extra Heavy (400+g)"]',
            '["Без пълнеж", "Леко (100-150г)", "Средно (200-250г)", "Тежко (300-400г)", "Много тежко (400+г)"]',
            false, true, 49)
    ON CONFLICT DO NOTHING;
    
    -- Filter Flow Rate (for aquariums)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Filter Flow Rate', 'Дебит на филтъра', 'select',
            '["Up to 50 GPH", "50-100 GPH", "100-200 GPH", "200-400 GPH", "400+ GPH"]',
            '["До 200 л/ч", "200-400 л/ч", "400-800 л/ч", "800-1500 л/ч", "1500+ л/ч"]',
            false, true, 50)
    ON CONFLICT DO NOTHING;
    
    -- Light Spectrum (for aquariums/reptiles)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Light Spectrum', 'Светлинен спектър', 'select',
            '["Full Spectrum", "UVA", "UVB", "Blue Actinic", "Plant Growth", "Moonlight", "Daylight"]',
            '["Пълен спектър", "UVA", "UVB", "Синя актинична", "За растения", "Лунна светлина", "Дневна светлина"]',
            false, true, 51)
    ON CONFLICT DO NOTHING;
    
    -- Heater Wattage
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Heater Wattage', 'Мощност на нагревател', 'select',
            '["25W", "50W", "75W", "100W", "150W", "200W", "300W"]',
            '["25W", "50W", "75W", "100W", "150W", "200W", "300W"]',
            false, true, 52)
    ON CONFLICT DO NOTHING;
    
    -- Terrarium Environment
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Terrarium Environment', 'Среда на терариум', 'select',
            '["Desert/Arid", "Tropical/Humid", "Temperate", "Aquatic", "Semi-Aquatic"]',
            '["Пустинна/Суха", "Тропическа/Влажна", "Умерена", "Водна", "Полуводна"]',
            false, true, 53)
    ON CONFLICT DO NOTHING;
    
    -- Safety Feature
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Safety Feature', 'Функция за безопасност', 'multiselect',
            '["Non-Toxic", "BPA-Free", "Lead-Free", "Phthalate-Free", "Choke-Safe", "Flame Retardant", "Reflective", "Breakaway"]',
            '["Нетоксичен", "Без BPA", "Без олово", "Без фталати", "Безопасен от задавяне", "Огнеустойчив", "Светлоотразителен", "С предпазител"]',
            false, true, 54)
    ON CONFLICT DO NOTHING;
    
    -- Age Range (in months)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Age Range', 'Възрастов диапазон', 'select',
            '["0-3 months", "3-6 months", "6-12 months", "1-3 years", "3-7 years", "7+ years", "All Ages"]',
            '["0-3 месеца", "3-6 месеца", "6-12 месеца", "1-3 години", "3-7 години", "7+ години", "Всички възрасти"]',
            false, true, 55)
    ON CONFLICT DO NOTHING;
    
    -- Eco-Friendly Features
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Eco Features', 'Екологични характеристики', 'multiselect',
            '["Biodegradable", "Recyclable", "Sustainable Materials", "Compostable", "Recycled Content", "Carbon Neutral", "Plastic-Free"]',
            '["Биоразградим", "Рециклируем", "Устойчиви материали", "Компостируем", "Рециклирано съдържание", "Въглеродно неутрален", "Без пластмаса"]',
            false, true, 56)
    ON CONFLICT DO NOTHING;
    
    -- Product Weight
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Product Weight', 'Тегло на продукт', 'select',
            '["Under 1 lb", "1-5 lbs", "5-10 lbs", "10-25 lbs", "25-50 lbs", "50+ lbs"]',
            '["Под 0.5 кг", "0.5-2 кг", "2-5 кг", "5-11 кг", "11-23 кг", "23+ кг"]',
            false, true, 57)
    ON CONFLICT DO NOTHING;
    
    -- Warranty
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Warranty', 'Гаранция', 'select',
            '["No Warranty", "30 Days", "90 Days", "1 Year", "2 Years", "Lifetime"]',
            '["Без гаранция", "30 дни", "90 дни", "1 година", "2 години", "Доживотна"]',
            false, true, 58)
    ON CONFLICT DO NOTHING;
END $$;;
