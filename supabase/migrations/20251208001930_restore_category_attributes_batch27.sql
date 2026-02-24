DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Pets - Dogs
    SELECT id INTO v_category_id FROM categories WHERE slug = 'dogs' OR slug = 'dog-supplies' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Food", "Treats", "Toys", "Beds", "Collars & Leashes", "Grooming", "Health", "Training"]', '["Храна", "Лакомства", "Играчки", "Легла", "Нашийници", "Грижа", "Здраве", "Обучение"]', 1),
            (v_category_id, 'Dog Size', 'Размер куче', 'select', false, true, '["Small", "Medium", "Large", "Giant", "All Sizes"]', '["Малко", "Средно", "Голямо", "Гигантско", "Всички размери"]', 2),
            (v_category_id, 'Life Stage', 'Възраст', 'select', false, true, '["Puppy", "Adult", "Senior", "All Ages"]', '["Кученце", "Възрастно", "Старо", "Всички възрасти"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Pets - Cats
    SELECT id INTO v_category_id FROM categories WHERE slug = 'cats' OR slug = 'cat-supplies' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Food", "Treats", "Toys", "Beds", "Litter", "Scratchers", "Grooming", "Health"]', '["Храна", "Лакомства", "Играчки", "Легла", "Постелка", "Драскалки", "Грижа", "Здраве"]', 1),
            (v_category_id, 'Life Stage', 'Възраст', 'select', false, true, '["Kitten", "Adult", "Senior", "All Ages"]', '["Коте", "Възрастна", "Стара", "Всички възрасти"]', 2)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Pets - Fish & Aquarium
    SELECT id INTO v_category_id FROM categories WHERE slug = 'fish-aquarium' OR slug = 'aquarium' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Aquarium", "Filter", "Heater", "Lighting", "Food", "Decoration", "Plants", "Treatment"]', '["Аквариум", "Филтър", "Нагревател", "Осветление", "Храна", "Декорация", "Растения", "Препарат"]', 1),
            (v_category_id, 'Water Type', 'Тип вода', 'select', false, true, '["Freshwater", "Saltwater", "Both"]', '["Сладководен", "Соленоводен", "И двата"]', 2),
            (v_category_id, 'Tank Size', 'Размер аквариум', 'select', false, true, '["Small (< 50L)", "Medium (50-100L)", "Large (100-200L)", "XL (> 200L)"]', '["Малък (< 50L)", "Среден (50-100L)", "Голям (100-200L)", "XL (> 200L)"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Pets - Birds
    SELECT id INTO v_category_id FROM categories WHERE slug = 'birds' OR slug = 'bird-supplies' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Cage", "Food", "Treats", "Toys", "Perches", "Health", "Accessories"]', '["Клетка", "Храна", "Лакомства", "Играчки", "Кацалки", "Здраве", "Аксесоари"]', 1),
            (v_category_id, 'Bird Size', 'Размер птица', 'select', false, true, '["Small (Finch/Canary)", "Medium (Cockatiel)", "Large (Parrot)", "All Sizes"]', '["Малка (Финч/Канарче)", "Средна (Корела)", "Голяма (Папагал)", "Всички"]', 2)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Pets - Small Animals
    SELECT id INTO v_category_id FROM categories WHERE slug = 'small-animals' OR slug = 'small-pets' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Animal Type', 'Тип животно', 'select', true, true, '["Hamster", "Guinea Pig", "Rabbit", "Chinchilla", "Ferret", "Rat/Mouse", "Other"]', '["Хамстер", "Морско свинче", "Заек", "Чинчила", "Пор", "Плъх/Мишка", "Друго"]', 1),
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Cage/Habitat", "Food", "Bedding", "Toys", "Health", "Accessories"]', '["Клетка", "Храна", "Постелка", "Играчки", "Здраве", "Аксесоари"]', 2)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Jobs - Full-Time
    SELECT id INTO v_category_id FROM categories WHERE slug = 'full-time-jobs' OR slug = 'full-time' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Industry', 'Индустрия', 'select', true, true, '["IT", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Hospitality", "Construction"]', '["ИТ", "Финанси", "Здравеопазване", "Образование", "Производство", "Търговия", "Хотелиерство", "Строителство"]', 1),
            (v_category_id, 'Experience Level', 'Ниво опит', 'select', false, true, '["Entry Level", "Mid Level", "Senior", "Executive"]', '["Начално ниво", "Средно ниво", "Старши", "Ръководно"]', 2),
            (v_category_id, 'Work Type', 'Тип работа', 'select', false, true, '["On-Site", "Remote", "Hybrid"]', '["На място", "Дистанционно", "Хибридно"]', 3),
            (v_category_id, 'Salary Range', 'Заплата', 'text', false, false, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Jobs - Part-Time
    SELECT id INTO v_category_id FROM categories WHERE slug = 'part-time-jobs' OR slug = 'part-time' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Industry', 'Индустрия', 'select', true, true, '["IT", "Retail", "Food Service", "Education", "Customer Service", "Logistics", "Other"]', '["ИТ", "Търговия", "Хранене", "Образование", "Обслужване", "Логистика", "Друга"]', 1),
            (v_category_id, 'Hours Per Week', 'Часове седмично', 'select', false, true, '["< 10", "10-20", "20-30", "Flexible"]', '["< 10", "10-20", "20-30", "Гъвкаво"]', 2),
            (v_category_id, 'Schedule', 'График', 'multiselect', false, true, '["Weekdays", "Weekends", "Evenings", "Mornings", "Flexible"]', '["Делнични", "Почивни", "Вечери", "Сутрини", "Гъвкаво"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Jobs - Freelance
    SELECT id INTO v_category_id FROM categories WHERE slug = 'freelance-jobs' OR slug = 'freelance' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Category', 'Категория', 'select', true, true, '["Web Development", "Design", "Writing", "Marketing", "Translation", "Video", "Music", "Other"]', '["Уеб разработка", "Дизайн", "Писане", "Маркетинг", "Превод", "Видео", "Музика", "Друго"]', 1),
            (v_category_id, 'Project Type', 'Тип проект', 'select', false, true, '["One-Time", "Ongoing", "Long-Term Contract"]', '["Еднократен", "Текущ", "Дългосрочен договор"]', 2),
            (v_category_id, 'Budget Range', 'Бюджет', 'select', false, true, '["< 500 BGN", "500-2000 BGN", "2000-5000 BGN", "5000+ BGN", "Negotiable"]', '["< 500 лв", "500-2000 лв", "2000-5000 лв", "5000+ лв", "По договаряне"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
