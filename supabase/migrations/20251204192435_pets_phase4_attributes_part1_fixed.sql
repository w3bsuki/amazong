-- Phase 4: PETS Category Attributes (Part 1) - Fixed
-- Get the PETS root category ID
DO $$
DECLARE
    pets_id UUID;
BEGIN
    SELECT id INTO pets_id FROM categories WHERE slug = 'pets';
    
    -- Pet Type (Species)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Pet Type', 'Вид домашен любимец', 'select', 
            '["Dog", "Cat", "Bird", "Fish", "Small Animal", "Reptile", "Horse", "Other"]',
            '["Куче", "Котка", "Птица", "Риба", "Малко животно", "Влечуго", "Кон", "Друго"]',
            true, true, 1)
    ON CONFLICT DO NOTHING;
    
    -- Pet Size
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Pet Size', 'Размер на животното', 'select',
            '["Extra Small (Under 5 lbs)", "Small (5-15 lbs)", "Medium (15-40 lbs)", "Large (40-80 lbs)", "Extra Large (80+ lbs)", "All Sizes"]',
            '["Много малък (под 2 кг)", "Малък (2-7 кг)", "Среден (7-18 кг)", "Голям (18-35 кг)", "Много голям (35+ кг)", "Всички размери"]',
            false, true, 2)
    ON CONFLICT DO NOTHING;
    
    -- Life Stage
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Life Stage', 'Етап от живота', 'select',
            '["Puppy/Kitten", "Junior", "Adult", "Senior", "All Life Stages"]',
            '["Кученце/Котенце", "Младо", "Възрастно", "Старо", "Всички възрасти"]',
            false, true, 3)
    ON CONFLICT DO NOTHING;
    
    -- Brand
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Brand', 'Марка', 'select',
            '["Royal Canin", "Hills Science Diet", "Purina", "Blue Buffalo", "Pedigree", "Whiskas", "Friskies", "Iams", "Eukanuba", "Orijen", "Acana", "Wellness", "Nutro", "Merrick", "Taste of the Wild", "Canidae", "Instinct", "Natural Balance", "Fromm", "Ziwi Peak", "Petmate", "Kong", "Nylabone", "PetSafe", "Furminator", "Seresto", "Frontline", "NexGard", "Other"]',
            '["Royal Canin", "Hills Science Diet", "Purina", "Blue Buffalo", "Pedigree", "Whiskas", "Friskies", "Iams", "Eukanuba", "Orijen", "Acana", "Wellness", "Nutro", "Merrick", "Taste of the Wild", "Canidae", "Instinct", "Natural Balance", "Fromm", "Ziwi Peak", "Petmate", "Kong", "Nylabone", "PetSafe", "Furminator", "Seresto", "Frontline", "NexGard", "Друга"]',
            false, true, 4)
    ON CONFLICT DO NOTHING;
    
    -- Food Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Food Type', 'Тип храна', 'select',
            '["Dry Kibble", "Wet/Canned", "Fresh/Refrigerated", "Freeze-Dried", "Dehydrated", "Raw", "Semi-Moist", "Treats"]',
            '["Суха храна", "Влажна/Консервирана", "Прясна/Охладена", "Лиофилизирана", "Дехидратирана", "Сурова", "Полувлажна", "Лакомства"]',
            false, true, 5)
    ON CONFLICT DO NOTHING;
    
    -- Special Diet
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Special Diet', 'Специална диета', 'multiselect',
            '["Grain-Free", "Limited Ingredient", "High Protein", "Weight Management", "Sensitive Stomach", "Sensitive Skin", "Joint Support", "Dental Care", "Urinary Health", "Hairball Control", "Indoor Formula", "Outdoor Formula", "Organic", "Natural", "Holistic", "Veterinary Diet"]',
            '["Без зърнени храни", "Ограничени съставки", "Високопротеинова", "Контрол на теглото", "Чувствителен стомах", "Чувствителна кожа", "Подкрепа за стави", "Грижа за зъби", "Уринарно здраве", "Контрол на космени топки", "За домашни условия", "За открито", "Органична", "Натурална", "Холистична", "Ветеринарна диета"]',
            false, true, 6)
    ON CONFLICT DO NOTHING;
    
    -- Protein Source
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Protein Source', 'Източник на протеин', 'multiselect',
            '["Chicken", "Beef", "Lamb", "Fish", "Salmon", "Turkey", "Duck", "Venison", "Rabbit", "Pork", "Bison", "Kangaroo", "Plant-Based"]',
            '["Пиле", "Говеждо", "Агнешко", "Риба", "Сьомга", "Пуйка", "Патица", "Еленско", "Заек", "Свинско", "Бизон", "Кенгуру", "Растително"]',
            false, true, 7)
    ON CONFLICT DO NOTHING;
    
    -- Package Size/Weight
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Package Size', 'Размер на опаковката', 'select',
            '["Sample/Trial", "Small (1-5 lbs)", "Medium (6-15 lbs)", "Large (16-30 lbs)", "Extra Large (30+ lbs)", "Multi-Pack"]',
            '["Мостра/Проба", "Малка (0.5-2 кг)", "Средна (3-7 кг)", "Голяма (8-15 кг)", "Много голяма (15+ кг)", "Мулти-пакет"]',
            false, true, 8)
    ON CONFLICT DO NOTHING;
    
    -- Material (for toys, beds, accessories)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Material', 'Материал', 'select',
            '["Rubber", "Nylon", "Rope", "Plush/Fabric", "Leather", "Metal", "Plastic", "Wood", "Cotton", "Polyester", "Memory Foam", "Orthopedic Foam", "Ceramic", "Stainless Steel", "Silicone", "Natural Fibers"]',
            '["Гума", "Найлон", "Въже", "Плюш/Текстил", "Кожа", "Метал", "Пластмаса", "Дърво", "Памук", "Полиестер", "Мемори пяна", "Ортопедична пяна", "Керамика", "Неръждаема стомана", "Силикон", "Естествени влакна"]',
            false, true, 9)
    ON CONFLICT DO NOTHING;
    
    -- Color
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Color', 'Цвят', 'select',
            '["Black", "White", "Brown", "Gray", "Red", "Blue", "Green", "Pink", "Purple", "Orange", "Yellow", "Beige", "Multi-Color", "Pattern"]',
            '["Черен", "Бял", "Кафяв", "Сив", "Червен", "Син", "Зелен", "Розов", "Лилав", "Оранжев", "Жълт", "Бежов", "Многоцветен", "Шарка"]',
            false, true, 10)
    ON CONFLICT DO NOTHING;
END $$;;
