DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Services - Home Services
    SELECT id INTO v_category_id FROM categories WHERE slug = 'home-services' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Service Type', 'Тип услуга', 'select', true, true, '["Cleaning", "Plumbing", "Electrical", "HVAC", "Painting", "Landscaping", "Handyman"]', '["Почистване", "ВиК", "Електро", "Климатизация", "Боядисване", "Озеленяване", "Майстор"]', 1),
            (v_category_id, 'Service Area', 'Район на обслужване', 'text', false, true, NULL, NULL, 2),
            (v_category_id, 'Availability', 'Наличност', 'multiselect', false, true, '["Weekdays", "Weekends", "Evenings", "24/7 Emergency"]', '["Делнични", "Почивни", "Вечери", "24/7 спешни"]', 3),
            (v_category_id, 'Licensed', 'Лицензиран', 'boolean', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Services - Professional Services
    SELECT id INTO v_category_id FROM categories WHERE slug = 'professional-services' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Service Type', 'Тип услуга', 'select', true, true, '["Legal", "Accounting", "Consulting", "Marketing", "IT Support", "Design", "Translation"]', '["Правни", "Счетоводни", "Консултантски", "Маркетинг", "IT поддръжка", "Дизайн", "Превод"]', 1),
            (v_category_id, 'Experience Years', 'Години опит', 'number', false, true, NULL, NULL, 2),
            (v_category_id, 'Delivery Method', 'Метод на доставка', 'multiselect', false, true, '["On-Site", "Remote", "Hybrid"]', '["На място", "Дистанционно", "Хибридно"]', 3),
            (v_category_id, 'Certified', 'Сертифициран', 'boolean', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Services - Events
    SELECT id INTO v_category_id FROM categories WHERE slug = 'event-services' OR slug = 'events' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Service Type', 'Тип услуга', 'select', true, true, '["Catering", "Photography", "DJ/Music", "Decoration", "Venue", "Planning", "Entertainment"]', '["Кетъринг", "Фотография", "DJ/Музика", "Декорация", "Място", "Планиране", "Забавление"]', 1),
            (v_category_id, 'Event Types', 'Типове събития', 'multiselect', false, true, '["Wedding", "Birthday", "Corporate", "Conference", "Festival", "Private"]', '["Сватба", "Рожден ден", "Корпоративно", "Конференция", "Фестивал", "Частно"]', 2),
            (v_category_id, 'Capacity', 'Капацитет', 'select', false, true, '["Small (< 50)", "Medium (50-100)", "Large (100-300)", "Extra Large (300+)"]', '["Малък (< 50)", "Среден (50-100)", "Голям (100-300)", "Много голям (300+)"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Real Estate - Residential
    SELECT id INTO v_category_id FROM categories WHERE slug = 'residential' OR slug = 'residential-properties' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Property Type', 'Тип имот', 'select', true, true, '["Apartment", "House", "Villa", "Studio", "Penthouse", "Townhouse"]', '["Апартамент", "Къща", "Вила", "Студио", "Пентхаус", "Редова къща"]', 1),
            (v_category_id, 'Listing Type', 'Тип обява', 'select', true, true, '["For Sale", "For Rent", "Short-Term Rental"]', '["Продава се", "Под наем", "Краткосрочен наем"]', 2),
            (v_category_id, 'Bedrooms', 'Спални', 'select', false, true, '["Studio", "1", "2", "3", "4", "5+"]', '["Студио", "1", "2", "3", "4", "5+"]', 3),
            (v_category_id, 'Bathrooms', 'Бани', 'select', false, true, '["1", "2", "3", "4+"]', '["1", "2", "3", "4+"]', 4),
            (v_category_id, 'Area (sqm)', 'Площ (кв.м)', 'number', false, true, NULL, NULL, 5),
            (v_category_id, 'Furnished', 'Обзаведен', 'select', false, true, '["Unfurnished", "Partially", "Fully Furnished"]', '["Необзаведен", "Частично", "Напълно обзаведен"]', 6)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Real Estate - Commercial
    SELECT id INTO v_category_id FROM categories WHERE slug = 'commercial' OR slug = 'commercial-properties' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Property Type', 'Тип имот', 'select', true, true, '["Office", "Retail", "Warehouse", "Industrial", "Restaurant", "Hotel"]', '["Офис", "Магазин", "Склад", "Промишлен", "Ресторант", "Хотел"]', 1),
            (v_category_id, 'Listing Type', 'Тип обява', 'select', true, true, '["For Sale", "For Rent", "For Lease"]', '["Продава се", "Под наем", "На лизинг"]', 2),
            (v_category_id, 'Area (sqm)', 'Площ (кв.м)', 'number', false, true, NULL, NULL, 3),
            (v_category_id, 'Parking', 'Паркинг', 'select', false, true, '["None", "Street", "Lot", "Underground"]', '["Няма", "Улица", "Паркинг", "Подземен"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Real Estate - Land
    SELECT id INTO v_category_id FROM categories WHERE slug = 'land' OR slug = 'land-properties' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Land Type', 'Тип земя', 'select', true, true, '["Agricultural", "Residential", "Commercial", "Industrial", "Forest", "Mixed"]', '["Земеделска", "Жилищна", "Търговска", "Промишлена", "Горска", "Смесена"]', 1),
            (v_category_id, 'Area (sqm)', 'Площ (кв.м)', 'number', true, true, NULL, NULL, 2),
            (v_category_id, 'Building Permit', 'Разрешение за строеж', 'boolean', false, true, NULL, NULL, 3),
            (v_category_id, 'Utilities Available', 'Налични удобства', 'multiselect', false, true, '["Water", "Electricity", "Gas", "Sewage", "Internet"]', '["Вода", "Ток", "Газ", "Канализация", "Интернет"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
