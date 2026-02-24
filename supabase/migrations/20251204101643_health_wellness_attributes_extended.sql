
-- =====================================================
-- HEALTH & WELLNESS EXTENDED ATTRIBUTES
-- Additional category-specific attributes
-- =====================================================

DO $$
DECLARE
    vision_id UUID := 'a17e101b-a0a1-40c6-9f2b-d7c61bb6c07c';
    mobility_id UUID := 'f7b8554d-2dfb-4a87-a6ee-f46006d13081';
    sleep_id UUID := 'c21b1b3f-0329-45b4-ab24-d718ebaacba2';
    omega_id UUID := 'f34571c7-67c8-43ee-ad4c-13ae3dafb0c3';
    joint_id UUID := 'a0dc2310-5589-4093-bcd7-40f4839c5136';
    womens_id UUID := '77fc5c7e-0a8a-4967-8dfc-b247e22e3d65';
    mens_id UUID := '1270c114-f1c5-4a5b-9ee4-81e4eea888c2';
    heart_id UUID := 'e283373f-1727-4fe0-91d2-dea0b19c2d35';
    weight_id UUID := 'e1da58d8-4d6a-41fb-8d10-bfc58c0524ea';
    probiotics_id UUID := '8589bb94-adc4-47d1-9205-685f96c48502';
    cbd_id UUID := 'f5231b56-37ef-49dd-9632-5f807e859a35';
    therapy_id UUID := '7910e76a-d0ba-4eb0-8a01-f5f3bc76dfd6';
    sports_id UUID := '7979ce0f-6f61-4911-b38e-0b1ac92c803a';
BEGIN

    -- =====================================================
    -- VISION CARE ATTRIBUTES
    -- =====================================================
    
    -- Lens Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        vision_id,
        'Lens Type',
        'Тип лещи',
        'select',
        false,
        true,
        '["Daily Disposable", "Weekly", "Bi-Weekly", "Monthly", "Extended Wear", "Colored", "Toric (Astigmatism)", "Multifocal"]',
        '["Еднодневни", "Седмични", "Двуседмични", "Месечни", "Удължено носене", "Цветни", "Торични (Астигматизъм)", "Мултифокални"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Lens Base Curve
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        vision_id,
        'Base Curve',
        'Базова крива',
        'select',
        false,
        true,
        '["8.4", "8.5", "8.6", "8.7", "8.8", "8.9", "9.0"]',
        '["8.4", "8.5", "8.6", "8.7", "8.8", "8.9", "9.0"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- MOBILITY & DISABILITY ATTRIBUTES
    -- =====================================================
    
    -- Mobility Aid Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        mobility_id,
        'Mobility Aid Type',
        'Тип помощно средство',
        'select',
        false,
        true,
        '["Manual Wheelchair", "Electric Wheelchair", "Walker", "Rollator", "Cane", "Crutches", "Knee Scooter", "Mobility Scooter", "Transfer Board", "Lift Chair"]',
        '["Ръчна инвалидна количка", "Електрическа количка", "Проходилка", "Ролатор", "Бастун", "Патерици", "Колянен скутер", "Скутер за мобилност", "Дъска за трансфер", "Подемен стол"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Weight Capacity
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        mobility_id,
        'Weight Capacity',
        'Капацитет на тегло',
        'select',
        false,
        true,
        '["Up to 100kg", "100-120kg", "120-150kg", "150-180kg", "180kg+", "Bariatric"]',
        '["До 100кг", "100-120кг", "120-150кг", "150-180кг", "180кг+", "Бариатричен"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- Foldable
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        mobility_id,
        'Foldable',
        'Сгъваем',
        'boolean',
        false,
        true,
        NULL,
        NULL,
        12
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- SLEEP & RELAXATION ATTRIBUTES
    -- =====================================================
    
    -- Sleep Aid Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        sleep_id,
        'Sleep Aid Type',
        'Тип помощ за сън',
        'select',
        false,
        true,
        '["Melatonin", "Herbal Blend", "Magnesium", "GABA", "Valerian", "CBD", "White Noise", "Light Therapy", "Sleep Mask", "Weighted Blanket"]',
        '["Мелатонин", "Билкова смес", "Магнезий", "ГАБА", "Валериана", "CBD", "Бял шум", "Светлинна терапия", "Маска за сън", "Утежнено одеяло"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Melatonin Dosage
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        sleep_id,
        'Melatonin Dosage',
        'Доза мелатонин',
        'select',
        false,
        true,
        '["0.5mg", "1mg", "3mg", "5mg", "10mg", "Time Release"]',
        '["0.5мг", "1мг", "3мг", "5мг", "10мг", "Удължено освобождаване"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- OMEGA & FISH OILS ATTRIBUTES
    -- =====================================================
    
    -- Omega Source
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        omega_id,
        'Omega Source',
        'Източник на омега',
        'select',
        false,
        true,
        '["Fish Oil", "Krill Oil", "Cod Liver Oil", "Algae (Vegan)", "Flaxseed", "Chia", "Hemp Seed", "Salmon Oil"]',
        '["Рибено масло", "Крил масло", "Масло от черен дроб на треска", "Водорасли (веган)", "Ленено семе", "Чиа", "Конопено семе", "Масло от сьомга"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- EPA/DHA Content
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        omega_id,
        'EPA/DHA Content',
        'Съдържание на EPA/DHA',
        'select',
        false,
        true,
        '["Standard (<1000mg)", "High (1000-1500mg)", "Extra High (1500-2000mg)", "Ultra (2000mg+)"]',
        '["Стандартно (<1000мг)", "Високо (1000-1500мг)", "Много високо (1500-2000мг)", "Ултра (2000мг+)"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- Purity
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        omega_id,
        'Purity',
        'Чистота',
        'select',
        false,
        true,
        '["Standard", "Molecularly Distilled", "Pharmaceutical Grade", "Triglyceride Form", "Wild-Caught"]',
        '["Стандартен", "Молекулярно дестилиран", "Фармацевтичен клас", "Триглицеридна форма", "Дива риба"]',
        12
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- JOINT & MOBILITY SUPPLEMENT ATTRIBUTES
    -- =====================================================
    
    -- Joint Ingredient
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        joint_id,
        'Key Ingredient',
        'Основна съставка',
        'select',
        false,
        true,
        '["Glucosamine", "Chondroitin", "MSM", "Collagen Type II", "Turmeric/Curcumin", "Boswellia", "Hyaluronic Acid", "Combination Formula"]',
        '["Глюкозамин", "Хондроитин", "MSM", "Колаген тип II", "Куркума/Куркумин", "Босвелия", "Хиалуронова киселина", "Комбинирана формула"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Glucosamine Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        joint_id,
        'Glucosamine Type',
        'Тип глюкозамин',
        'select',
        false,
        true,
        '["Glucosamine Sulfate", "Glucosamine HCl", "N-Acetyl Glucosamine", "Shellfish-Free"]',
        '["Глюкозамин сулфат", "Глюкозамин HCl", "N-ацетил глюкозамин", "Без черупчести"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- PROBIOTICS ATTRIBUTES
    -- =====================================================
    
    -- CFU Count
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        probiotics_id,
        'CFU Count',
        'Брой CFU',
        'select',
        false,
        true,
        '["1-5 Billion", "5-10 Billion", "10-25 Billion", "25-50 Billion", "50-100 Billion", "100 Billion+"]',
        '["1-5 милиарда", "5-10 милиарда", "10-25 милиарда", "25-50 милиарда", "50-100 милиарда", "100 милиарда+"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Probiotic Strains
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        probiotics_id,
        'Number of Strains',
        'Брой щамове',
        'select',
        false,
        true,
        '["Single Strain", "2-5 Strains", "5-10 Strains", "10-15 Strains", "15+ Strains"]',
        '["Един щам", "2-5 щама", "5-10 щама", "10-15 щама", "15+ щама"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- Refrigeration
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        probiotics_id,
        'Refrigeration Required',
        'Изисква хладилник',
        'boolean',
        false,
        true,
        NULL,
        NULL,
        12
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- CBD & MUSHROOMS ATTRIBUTES
    -- =====================================================
    
    -- CBD Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        cbd_id,
        'CBD Type',
        'Тип CBD',
        'select',
        false,
        true,
        '["Full Spectrum", "Broad Spectrum", "CBD Isolate", "THC-Free"]',
        '["Пълен спектър", "Широк спектър", "CBD изолат", "Без THC"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- CBD Strength
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        cbd_id,
        'CBD Strength',
        'Сила на CBD',
        'select',
        false,
        true,
        '["Low (<500mg)", "Medium (500-1000mg)", "High (1000-2000mg)", "Extra High (2000mg+)"]',
        '["Ниска (<500мг)", "Средна (500-1000мг)", "Висока (1000-2000мг)", "Много висока (2000мг+)"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- Mushroom Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        cbd_id,
        'Mushroom Type',
        'Тип гъба',
        'select',
        false,
        true,
        '["Lion''s Mane", "Reishi", "Chaga", "Cordyceps", "Turkey Tail", "Shiitake", "Maitake", "Mushroom Blend"]',
        '["Лъвска грива", "Рейши", "Чага", "Кордицепс", "Пуешка опашка", "Шийтаке", "Майтаке", "Смес от гъби"]',
        12
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- THERAPY & RECOVERY ATTRIBUTES
    -- =====================================================
    
    -- Therapy Device Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        therapy_id,
        'Therapy Type',
        'Тип терапия',
        'select',
        false,
        true,
        '["Massage Gun", "Red Light Therapy", "TENS/EMS", "Foam Roller", "Acupressure", "Cupping", "Compression", "Cold Therapy", "Heat Therapy", "Infrared Sauna"]',
        '["Масажен пистолет", "Червена светлина", "ТЕНС/ЕМС", "Фоум ролер", "Акупресура", "Вендузи", "Компресия", "Студена терапия", "Топлинна терапия", "Инфрачервена сауна"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Percussion Speed
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        therapy_id,
        'Percussion Speed',
        'Скорост на перкусия',
        'select',
        false,
        true,
        '["Up to 2000 RPM", "2000-3000 RPM", "3000-4000 RPM", "4000+ RPM", "Variable Speed"]',
        '["До 2000 об/мин", "2000-3000 об/мин", "3000-4000 об/мин", "4000+ об/мин", "Променлива скорост"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- SPORTS NUTRITION ATTRIBUTES
    -- =====================================================
    
    -- Sports Product Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        sports_id,
        'Product Type',
        'Тип продукт',
        'select',
        false,
        true,
        '["Pre-Workout", "Intra-Workout", "Post-Workout", "Protein Powder", "Mass Gainer", "BCAA", "EAA", "Creatine", "Beta-Alanine", "Electrolytes", "Energy Gel", "Energy Bar"]',
        '["Предтренировъчен", "По време на тренировка", "Следтренировъчен", "Протеин на прах", "Гейнър", "BCAA", "EAA", "Креатин", "Бета-аланин", "Електролити", "Енергиен гел", "Енергиен бар"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Creatine Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        sports_id,
        'Creatine Type',
        'Тип креатин',
        'select',
        false,
        true,
        '["Creatine Monohydrate", "Creatine HCl", "Micronized Creatine", "Creatine Ethyl Ester", "Buffered Creatine", "Creatine Nitrate"]',
        '["Креатин монохидрат", "Креатин HCl", "Микронизиран креатин", "Креатин етилов естер", "Буфериран креатин", "Креатин нитрат"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- WEIGHT MANAGEMENT ATTRIBUTES
    -- =====================================================
    
    -- Weight Product Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        weight_id,
        'Product Type',
        'Тип продукт',
        'select',
        false,
        true,
        '["Fat Burner", "Appetite Suppressant", "Carb Blocker", "Thermogenic", "Meal Replacement", "Metabolism Booster", "CLA", "L-Carnitine", "Green Tea Extract", "Detox"]',
        '["Фетбърнър", "Потискане на апетита", "Карб блокер", "Термогенен", "Заместител на храна", "Ускорител на метаболизма", "CLA", "L-Карнитин", "Екстракт от зелен чай", "Детокс"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Stimulant Content
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        weight_id,
        'Stimulant Content',
        'Съдържание на стимуланти',
        'select',
        false,
        true,
        '["Stimulant-Free", "Low Stimulant", "Moderate Stimulant", "High Stimulant"]',
        '["Без стимуланти", "Ниски стимуланти", "Умерени стимуланти", "Високи стимуланти"]',
        11
    ) ON CONFLICT DO NOTHING;

END $$;
;
