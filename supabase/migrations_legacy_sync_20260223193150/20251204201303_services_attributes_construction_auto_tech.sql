-- =====================================================
-- SERVICES ATTRIBUTES: CONSTRUCTION, AUTOMOTIVE, TECH
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, placeholder, placeholder_bg, sort_order) VALUES

-- CONSTRUCTION & RENOVATION
('c1d2e3f4-0006-4000-8000-000000000001', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Construction Type', 'Тип строителство', 'multiselect', false, true,
 '["New Construction", "Renovation", "Remodeling", "Restoration", "Addition/Extension", "Demolition", "Interior Finish", "Exterior Finish"]'::jsonb,
 '["Ново строителство", "Ремонт", "Преустройство", "Реставрация", "Разширение", "Събаряне", "Вътрешно довършване", "Външно довършване"]'::jsonb,
 'Select construction types', 'Изберете типове строителство', 54),

('c1d2e3f4-0006-4000-8000-000000000002', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Specialization', 'Специализация', 'multiselect', false, true,
 '["Plumbing", "Electrical", "HVAC", "Roofing", "Flooring", "Painting", "Carpentry", "Masonry", "Tiling", "Drywall", "Insulation", "Windows & Doors", "Kitchen", "Bathroom", "Landscape"]'::jsonb,
 '["Водопровод", "Електричество", "ОВК", "Покриви", "Подови настилки", "Боядисване", "Дърводелство", "Зидария", "Плочки", "Гипсокартон", "Изолация", "Прозорци и врати", "Кухня", "Баня", "Озеленяване"]'::jsonb,
 'Select specializations', 'Изберете специализации', 55),

('c1d2e3f4-0006-4000-8000-000000000003', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Project Scale', 'Мащаб на проекта', 'select', false, true,
 '["Small (< 1000 BGN)", "Medium (1000-5000 BGN)", "Large (5000-20000 BGN)", "Major (20000-100000 BGN)", "Enterprise (100000+ BGN)"]'::jsonb,
 '["Малък (< 1000 лв)", "Среден (1000-5000 лв)", "Голям (5000-20000 лв)", "Мащабен (20000-100000 лв)", "Корпоративен (100000+ лв)"]'::jsonb,
 'Select project scale', 'Изберете мащаб на проекта', 56),

('c1d2e3f4-0006-4000-8000-000000000004', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Warranty Offered', 'Предлагана гаранция', 'select', false, true,
 '["No Warranty", "6 Months", "1 Year", "2 Years", "5 Years", "10 Years", "Lifetime"]'::jsonb,
 '["Без гаранция", "6 месеца", "1 година", "2 години", "5 години", "10 години", "Пожизнена"]'::jsonb,
 'Select warranty period', 'Изберете гаранционен период', 57),

-- AUTOMOTIVE SPECIFIC
('c1d2e3f4-0006-4000-8000-000000000005', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Vehicle Types Serviced', 'Обслужвани превозни средства', 'multiselect', false, true,
 '["Passenger Cars", "SUV/4x4", "Vans", "Trucks", "Motorcycles", "Electric Vehicles", "Hybrid Vehicles", "Classic Cars", "Luxury Vehicles", "Commercial Vehicles"]'::jsonb,
 '["Леки автомобили", "Джипове/4x4", "Ванове", "Камиони", "Мотоциклети", "Електромобили", "Хибридни", "Класически коли", "Луксозни автомобили", "Товарни превозни средства"]'::jsonb,
 'Select vehicle types', 'Изберете типове превозни средства', 58),

('c1d2e3f4-0006-4000-8000-000000000006', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Auto Service Type', 'Тип автосервиз', 'multiselect', false, true,
 '["Oil Change", "Brake Service", "Tire Service", "Engine Repair", "Transmission", "AC/Heating", "Electrical", "Body Work", "Paint", "Detailing", "Diagnostics", "Inspection", "Tuning", "MOT/GTP"]'::jsonb,
 '["Смяна на масло", "Спирачки", "Гуми", "Ремонт на двигател", "Скоростна кутия", "Климатик/Отопление", "Електрическа система", "Тенекеджийски услуги", "Боядисване", "Детайлинг", "Диагностика", "Преглед", "Тунинг", "ГТП"]'::jsonb,
 'Select service types', 'Изберете типове услуги', 59),

('c1d2e3f4-0006-4000-8000-000000000007', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Brand Specialization', 'Специализация по марки', 'multiselect', false, true,
 '["All Brands", "German (BMW, Mercedes, VW, Audi)", "Japanese (Toyota, Honda, Nissan)", "French (Peugeot, Renault, Citroen)", "Italian (Fiat, Alfa Romeo)", "American (Ford, Chevrolet)", "Korean (Hyundai, Kia)", "Czech (Skoda)", "Other European"]'::jsonb,
 '["Всички марки", "Немски (BMW, Mercedes, VW, Audi)", "Японски (Toyota, Honda, Nissan)", "Френски (Peugeot, Renault, Citroen)", "Италиански (Fiat, Alfa Romeo)", "Американски (Ford, Chevrolet)", "Корейски (Hyundai, Kia)", "Чешки (Skoda)", "Други европейски"]'::jsonb,
 'Select brand specialization', 'Изберете специализация по марки', 60),

-- TECH & IT SPECIFIC
('c1d2e3f4-0006-4000-8000-000000000008', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Tech Service Type', 'Тип IT услуга', 'multiselect', false, true,
 '["Computer Repair", "Software Development", "Web Development", "Mobile App Development", "Network Setup", "Data Recovery", "Cybersecurity", "Cloud Services", "IT Consulting", "Tech Support", "System Administration", "Database Management"]'::jsonb,
 '["Ремонт на компютри", "Разработка на софтуер", "Уеб разработка", "Мобилни приложения", "Мрежова настройка", "Възстановяване на данни", "Киберсигурност", "Облачни услуги", "IT консултации", "Техническа поддръжка", "Системна администрация", "Управление на бази данни"]'::jsonb,
 'Select tech services', 'Изберете IT услуги', 61),

('c1d2e3f4-0006-4000-8000-000000000009', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Technologies/Platforms', 'Технологии/Платформи', 'multiselect', false, true,
 '["Windows", "macOS", "Linux", "iOS", "Android", "WordPress", "Shopify", "React", "Angular", "Vue", "Node.js", "Python", ".NET", "PHP", "Java", "AWS", "Azure", "Google Cloud"]'::jsonb,
 '["Windows", "macOS", "Linux", "iOS", "Android", "WordPress", "Shopify", "React", "Angular", "Vue", "Node.js", "Python", ".NET", "PHP", "Java", "AWS", "Azure", "Google Cloud"]'::jsonb,
 'Select technologies', 'Изберете технологии', 62),

('c1d2e3f4-0006-4000-8000-000000000010', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Support Type', 'Тип поддръжка', 'multiselect', false, true,
 '["Remote Support", "On-Site Support", "Phone Support", "Email Support", "Chat Support", "24/7 Support", "Business Hours Only"]'::jsonb,
 '["Дистанционна поддръжка", "Поддръжка на място", "Телефонна поддръжка", "Имейл поддръжка", "Чат поддръжка", "24/7 поддръжка", "Само в работно време"]'::jsonb,
 'Select support types', 'Изберете типове поддръжка', 63);;
