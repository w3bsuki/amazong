
-- =====================================================
-- HEALTH & WELLNESS - REMAINING ATTRIBUTES
-- Add attributes for L1 categories that don't have any yet
-- =====================================================

DO $$
DECLARE
    womens_id UUID := '77fc5c7e-0a8a-4967-8dfc-b247e22e3d65';
    mens_id UUID := '1270c114-f1c5-4a5b-9ee4-81e4eea888c2';
    heart_id UUID := 'e283373f-1727-4fe0-91d2-dea0b19c2d35';
    childrens_id UUID := 'ca000000-0000-0000-0000-000000000100';
    immune_id UUID := 'd54e4390-f653-4049-9189-2f4e7490f122';
    superfoods_id UUID := '0e6a27cb-ab9e-432b-a04c-3bd8137f7fbd';
    collagen_id UUID := 'f110696e-6a53-4f8b-9976-2a170f99c962';
    energy_id UUID := 'df468c6a-1b09-4c91-a515-dc268905d7af';
    stress_id UUID := '2dddfc5d-e7d3-48d2-8b75-77a843306e69';
    longevity_id UUID := '89aa7b5c-499d-4982-930c-3c14f4b9f57d';
    blood_sugar_id UUID := '14e37220-d09e-4278-aa7a-576f59e44fcb';
BEGIN

    -- =====================================================
    -- WOMEN'S HEALTH ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        womens_id,
        'Women''s Health Focus',
        'Фокус върху женското здраве',
        'select',
        false,
        true,
        '["Prenatal", "Postnatal", "Fertility", "Menstrual Support", "Menopause", "Hormone Balance", "Bone Health", "Iron Supplement", "Breast Health", "General Women''s Health"]',
        '["Пренатален", "Постнатален", "Фертилност", "Менструална подкрепа", "Менопауза", "Хормонален баланс", "Костно здраве", "Желязо", "Гръдно здраве", "Общо женско здраве"]',
        10
    ) ON CONFLICT DO NOTHING;

    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        womens_id,
        'Life Stage',
        'Етап от живота',
        'select',
        false,
        true,
        '["Teens", "20s-30s", "Pregnant", "Breastfeeding", "Perimenopause", "Menopause", "Post-Menopause", "All Ages"]',
        '["Тийн", "20-30 години", "Бременна", "Кърмеща", "Перименопауза", "Менопауза", "Пост-менопауза", "Всички възрасти"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- MEN'S HEALTH ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        mens_id,
        'Men''s Health Focus',
        'Фокус върху мъжкото здраве',
        'select',
        false,
        true,
        '["Testosterone Support", "Prostate Health", "Male Fertility", "Erectile Function", "Hair Health", "Energy & Vitality", "Muscle Support", "Heart Health", "General Men''s Health"]',
        '["Поддръжка на тестостерон", "Здраве на простатата", "Мъжка фертилност", "Ерекция", "Здраве на косата", "Енергия и жизненост", "Мускулна подкрепа", "Сърдечно здраве", "Общо мъжко здраве"]',
        10
    ) ON CONFLICT DO NOTHING;

    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        mens_id,
        'Age Group',
        'Възрастова група',
        'select',
        false,
        true,
        '["Under 30", "30-40", "40-50", "50-60", "60+", "All Ages"]',
        '["Под 30", "30-40", "40-50", "50-60", "60+", "Всички възрасти"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- HEART HEALTH ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        heart_id,
        'Heart Support Type',
        'Тип сърдечна подкрепа',
        'select',
        false,
        true,
        '["Cholesterol Support", "Blood Pressure", "Circulation", "CoQ10", "Omega-3", "Antioxidant", "Blood Thinning", "Heart Rhythm", "General Heart Health"]',
        '["Подкрепа на холестерола", "Кръвно налягане", "Кръвообращение", "Коензим Q10", "Омега-3", "Антиоксидант", "Разреждане на кръвта", "Сърдечен ритъм", "Общо сърдечно здраве"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- CHILDREN'S HEALTH ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        childrens_id,
        'Child Age Range',
        'Възраст на детето',
        'select',
        false,
        true,
        '["0-2 years", "2-4 years", "4-8 years", "8-12 years", "12+ years", "All Ages"]',
        '["0-2 години", "2-4 години", "4-8 години", "8-12 години", "12+ години", "Всички възрасти"]',
        10
    ) ON CONFLICT DO NOTHING;

    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        childrens_id,
        'Kids Product Form',
        'Форма за деца',
        'select',
        false,
        true,
        '["Gummy", "Chewable", "Liquid/Drops", "Powder", "Capsule", "Spray"]',
        '["Желирана", "За дъвчене", "Течна/Капки", "Прах", "Капсула", "Спрей"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- IMMUNE SUPPORT ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        immune_id,
        'Immune Ingredient',
        'Имунна съставка',
        'select',
        false,
        true,
        '["Vitamin C", "Vitamin D", "Zinc", "Elderberry", "Echinacea", "Mushroom Blend", "Probiotics", "Propolis", "Beta-Glucan", "Combination Formula"]',
        '["Витамин C", "Витамин D", "Цинк", "Бъз", "Ехинацея", "Гъби", "Пробиотици", "Прополис", "Бета-глюкан", "Комбинирана формула"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- SUPERFOODS & GREENS ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        superfoods_id,
        'Superfood Type',
        'Тип суперхрана',
        'select',
        false,
        true,
        '["Spirulina", "Chlorella", "Wheatgrass", "Barley Grass", "Moringa", "Maca", "Acai", "Green Blend", "Berry Blend", "Mushroom Blend", "Sea Vegetables"]',
        '["Спирулина", "Хлорела", "Пшенична трева", "Ечемична трева", "Моринга", "Мака", "Акай", "Зелена смес", "Смес от плодове", "Смес от гъби", "Морски зеленчуци"]',
        10
    ) ON CONFLICT DO NOTHING;

    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        superfoods_id,
        'Processing Method',
        'Метод на обработка',
        'select',
        false,
        true,
        '["Raw", "Cold-Pressed", "Freeze-Dried", "Spray-Dried", "Organic", "Wild-Harvested"]',
        '["Суров", "Студено пресован", "Сублимационно сушен", "Спрей сушен", "Органичен", "Диворастящ"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- COLLAGEN & BEAUTY ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        collagen_id,
        'Collagen Type',
        'Тип колаген',
        'select',
        false,
        true,
        '["Type I", "Type II", "Type III", "Type I & III", "Multi-Collagen (I, II, III)", "Marine Collagen", "Bovine Collagen", "Chicken Collagen", "Vegan Collagen Booster"]',
        '["Тип I", "Тип II", "Тип III", "Тип I и III", "Мулти-колаген (I, II, III)", "Морски колаген", "Говежди колаген", "Пилешки колаген", "Веган бустър"]',
        10
    ) ON CONFLICT DO NOTHING;

    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        collagen_id,
        'Beauty Benefit',
        'Полза за красотата',
        'multiselect',
        false,
        true,
        '["Skin Elasticity", "Wrinkle Reduction", "Hair Growth", "Nail Strength", "Joint Support", "Gut Health", "Hydration"]',
        '["Еластичност на кожата", "Намаляване на бръчките", "Растеж на косата", "Сила на ноктите", "Подкрепа за стави", "Чревно здраве", "Хидратация"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- ENERGY & NOOTROPICS ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        energy_id,
        'Nootropic Type',
        'Тип ноотропик',
        'select',
        false,
        true,
        '["Racetams", "Choline Sources", "Adaptogens", "Amino Acids", "Natural Extracts", "Synthetic Nootropics", "Nootropic Stack"]',
        '["Рацетами", "Източници на холин", "Адаптогени", "Аминокиселини", "Натурални екстракти", "Синтетични ноотропици", "Ноотропичен стек"]',
        10
    ) ON CONFLICT DO NOTHING;

    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        energy_id,
        'Cognitive Benefit',
        'Когнитивна полза',
        'multiselect',
        false,
        true,
        '["Focus", "Memory", "Clarity", "Energy", "Mood", "Creativity", "Learning", "Neuroprotection"]',
        '["Фокус", "Памет", "Яснота", "Енергия", "Настроение", "Креативност", "Учене", "Невропротекция"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- STRESS & MOOD ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        stress_id,
        'Stress Support Type',
        'Тип подкрепа за стрес',
        'select',
        false,
        true,
        '["Adaptogen", "Amino Acid", "Herbal", "Vitamin/Mineral", "Combination Formula"]',
        '["Адаптоген", "Аминокиселина", "Билков", "Витамин/Минерал", "Комбинирана формула"]',
        10
    ) ON CONFLICT DO NOTHING;

    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        stress_id,
        'Mood Benefit',
        'Полза за настроението',
        'multiselect',
        false,
        true,
        '["Anxiety Relief", "Stress Reduction", "Calm & Relaxation", "Mood Elevation", "Depression Support", "Emotional Balance", "Cortisol Control"]',
        '["Облекчаване на тревожност", "Намаляване на стреса", "Спокойствие и релакс", "Повишаване на настроението", "Подкрепа при депресия", "Емоционален баланс", "Контрол на кортизола"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- LONGEVITY & ANTI-AGING ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        longevity_id,
        'Longevity Compound',
        'Съединение за дълголетие',
        'select',
        false,
        true,
        '["NMN", "NR (NAD+)", "Resveratrol", "Pterostilbene", "Spermidine", "Fisetin", "Quercetin", "CoQ10/Ubiquinol", "PQQ", "Senolytic Blend"]',
        '["NMN", "NR (NAD+)", "Ресвератрол", "Птеростилбен", "Спермидин", "Физетин", "Кверцетин", "Коензим Q10/Убиквинол", "PQQ", "Сенолитична смес"]',
        10
    ) ON CONFLICT DO NOTHING;

    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        longevity_id,
        'Anti-Aging Target',
        'Цел против стареене',
        'multiselect',
        false,
        true,
        '["Cellular Energy", "DNA Repair", "Autophagy", "Senescent Cell Clearance", "Mitochondria Support", "Telomere Health", "Skin Aging", "Cognitive Aging"]',
        '["Клетъчна енергия", "Поправка на ДНК", "Автофагия", "Премахване на стареещи клетки", "Поддръжка на митохондрии", "Здраве на теломерите", "Стареене на кожата", "Когнитивно стареене"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- BLOOD SUGAR SUPPORT ATTRIBUTES
    -- =====================================================
    
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        blood_sugar_id,
        'Blood Sugar Ingredient',
        'Съставка за кръвна захар',
        'select',
        false,
        true,
        '["Berberine", "Chromium", "Ceylon Cinnamon", "Alpha Lipoic Acid", "Gymnema", "Bitter Melon", "Fenugreek", "Combination Formula"]',
        '["Берберин", "Хром", "Цейлонска канела", "Алфа-липоева киселина", "Гимнема", "Горчив пъпеш", "Сминдух", "Комбинирана формула"]',
        10
    ) ON CONFLICT DO NOTHING;

END $$;
;
