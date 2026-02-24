
-- =====================================================
-- HEALTH & WELLNESS ATTRIBUTES
-- Following pattern from grocery/beauty/electronics
-- =====================================================

-- Get category IDs
DO $$
DECLARE
    health_id UUID := 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673';
    vitamins_id UUID := 'b2149a58-6db6-43f7-8237-da861e8dbdeb';
    medical_id UUID := 'ab4a5dff-c805-4d8d-a1d5-a5c399b6ec8a';
    fitness_id UUID := 'fc2fac98-e0c6-4bc0-a9c1-d0c94943e784';
    personal_care_id UUID := '3502dfcb-6a8a-432c-b506-3c3fd0eb5a5e';
BEGIN

    -- =====================================================
    -- GLOBAL HEALTH ATTRIBUTES (Apply to all health products)
    -- =====================================================
    
    -- Product Form
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        health_id,
        'Product Form',
        'Форма на продукта',
        'select',
        false,
        true,
        '["Capsules", "Tablets", "Softgels", "Gummies", "Powder", "Liquid", "Drops", "Spray", "Topical", "Patches"]',
        '["Капсули", "Таблетки", "Софтгели", "Желирани", "Прах", "Течен", "Капки", "Спрей", "Локален", "Пластири"]',
        1
    ) ON CONFLICT DO NOTHING;

    -- Serving Size
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        health_id,
        'Serving Size',
        'Доза',
        'select',
        false,
        true,
        '["30 servings", "60 servings", "90 servings", "120 servings", "180 servings", "365 servings"]',
        '["30 дози", "60 дози", "90 дози", "120 дози", "180 дози", "365 дози"]',
        2
    ) ON CONFLICT DO NOTHING;

    -- Dietary Preference
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        health_id,
        'Dietary Preference',
        'Диетични предпочитания',
        'multiselect',
        false,
        true,
        '["Vegan", "Vegetarian", "Gluten-Free", "Non-GMO", "Organic", "Kosher", "Halal", "Sugar-Free", "Dairy-Free", "Soy-Free", "Nut-Free"]',
        '["Веган", "Вегетариански", "Без глутен", "Без ГМО", "Органичен", "Кошер", "Халал", "Без захар", "Без млечни", "Без соя", "Без ядки"]',
        3
    ) ON CONFLICT DO NOTHING;

    -- Target Audience
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        health_id,
        'Target Audience',
        'Целева група',
        'select',
        false,
        true,
        '["Men", "Women", "Children", "Seniors 50+", "Athletes", "Pregnant Women", "Teens", "All Adults"]',
        '["Мъже", "Жени", "Деца", "Възрастни 50+", "Спортисти", "Бременни", "Тийнейджъри", "Всички възрастни"]',
        4
    ) ON CONFLICT DO NOTHING;

    -- Certifications
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        health_id,
        'Certifications',
        'Сертификати',
        'multiselect',
        false,
        true,
        '["GMP Certified", "Third-Party Tested", "NSF Certified", "Informed Sport", "USP Verified", "EU Organic", "FDA Registered", "ISO Certified"]',
        '["GMP сертифициран", "Тестван от трета страна", "NSF сертифициран", "Informed Sport", "USP верифициран", "EU Organic", "FDA регистриран", "ISO сертифициран"]',
        5
    ) ON CONFLICT DO NOTHING;

    -- Brand
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        health_id,
        'Brand',
        'Марка',
        'text',
        false,
        true,
        NULL,
        NULL,
        6
    ) ON CONFLICT DO NOTHING;

    -- Country of Origin
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        health_id,
        'Country of Origin',
        'Страна на произход',
        'select',
        false,
        true,
        '["USA", "UK", "Germany", "Bulgaria", "European Union", "Japan", "Australia", "Canada", "Other"]',
        '["САЩ", "Великобритания", "Германия", "България", "Европейски съюз", "Япония", "Австралия", "Канада", "Друго"]',
        7
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- VITAMINS & SUPPLEMENTS SPECIFIC ATTRIBUTES
    -- =====================================================
    
    -- Vitamin Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        vitamins_id,
        'Vitamin Type',
        'Тип витамин',
        'select',
        false,
        true,
        '["Vitamin A", "Vitamin B1 (Thiamine)", "Vitamin B2 (Riboflavin)", "Vitamin B3 (Niacin)", "Vitamin B5 (Pantothenic)", "Vitamin B6", "Vitamin B7 (Biotin)", "Vitamin B9 (Folate)", "Vitamin B12", "Vitamin C", "Vitamin D3", "Vitamin D2", "Vitamin E", "Vitamin K1", "Vitamin K2", "B-Complex", "Multivitamin"]',
        '["Витамин А", "Витамин B1 (Тиамин)", "Витамин B2 (Рибофлавин)", "Витамин B3 (Ниацин)", "Витамин B5 (Пантотенова)", "Витамин B6", "Витамин B7 (Биотин)", "Витамин B9 (Фолат)", "Витамин B12", "Витамин C", "Витамин D3", "Витамин D2", "Витамин E", "Витамин K1", "Витамин K2", "B-Комплекс", "Мултивитамин"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Mineral Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        vitamins_id,
        'Mineral Type',
        'Тип минерал',
        'select',
        false,
        true,
        '["Calcium", "Magnesium", "Zinc", "Iron", "Potassium", "Selenium", "Copper", "Manganese", "Chromium", "Iodine", "Multi-Mineral"]',
        '["Калций", "Магнезий", "Цинк", "Желязо", "Калий", "Селен", "Мед", "Манган", "Хром", "Йод", "Мулти-минерал"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- Dosage Strength
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        vitamins_id,
        'Dosage Strength',
        'Сила на дозата',
        'select',
        false,
        true,
        '["Low Dose", "Standard Dose", "High Potency", "Extra Strength", "Time Release"]',
        '["Ниска доза", "Стандартна доза", "Висока сила", "Екстра сила", "Удължено действие"]',
        12
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- MEDICAL SUPPLIES SPECIFIC ATTRIBUTES
    -- =====================================================
    
    -- Medical Device Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        medical_id,
        'Device Type',
        'Тип устройство',
        'select',
        false,
        true,
        '["Blood Pressure Monitor", "Glucose Monitor", "Thermometer", "Pulse Oximeter", "Nebulizer", "TENS Unit", "Smart Scale", "Heart Rate Monitor", "Stethoscope", "Otoscope"]',
        '["Апарат за кръвно", "Глюкомер", "Термометър", "Пулсоксиметър", "Небулайзер", "ТЕНС уред", "Смарт кантар", "Пулсомер", "Стетоскоп", "Отоскоп"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Power Source
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        medical_id,
        'Power Source',
        'Захранване',
        'select',
        false,
        true,
        '["Battery", "USB Rechargeable", "AC Power", "Manual", "Solar"]',
        '["Батерия", "USB зареждане", "AC захранване", "Ръчно", "Соларно"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- Connectivity
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        medical_id,
        'Connectivity',
        'Свързаност',
        'select',
        false,
        true,
        '["Bluetooth", "WiFi", "USB", "App Compatible", "No Connectivity"]',
        '["Bluetooth", "WiFi", "USB", "Съвместимо с приложение", "Без свързаност"]',
        12
    ) ON CONFLICT DO NOTHING;

    -- Medical Grade
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        medical_id,
        'Medical Grade',
        'Медицински клас',
        'select',
        false,
        true,
        '["Professional/Clinical", "Home Use", "FDA Approved", "CE Marked"]',
        '["Професионален/Клиничен", "За домашна употреба", "FDA одобрен", "CE маркиран"]',
        13
    ) ON CONFLICT DO NOTHING;

    -- =====================================================
    -- FITNESS & NUTRITION SPECIFIC ATTRIBUTES
    -- =====================================================
    
    -- Protein Type
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        fitness_id,
        'Protein Type',
        'Тип протеин',
        'select',
        false,
        true,
        '["Whey Concentrate", "Whey Isolate", "Whey Hydrolysate", "Casein", "Micellar Casein", "Pea Protein", "Rice Protein", "Soy Protein", "Hemp Protein", "Egg White", "Beef Protein", "Collagen", "Plant Blend"]',
        '["Суроватъчен концентрат", "Суроватъчен изолат", "Суроватъчен хидролизат", "Казеин", "Мицеларен казеин", "Грахов протеин", "Оризов протеин", "Соев протеин", "Конопен протеин", "Яйчен белтък", "Говежди протеин", "Колаген", "Растителна смес"]',
        10
    ) ON CONFLICT DO NOTHING;

    -- Protein Per Serving
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        fitness_id,
        'Protein Per Serving',
        'Протеин на порция',
        'select',
        false,
        true,
        '["Under 20g", "20-25g", "25-30g", "30-40g", "40g+"]',
        '["Под 20г", "20-25г", "25-30г", "30-40г", "40г+"]',
        11
    ) ON CONFLICT DO NOTHING;

    -- Flavor
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        fitness_id,
        'Flavor',
        'Вкус',
        'select',
        false,
        true,
        '["Unflavored", "Chocolate", "Vanilla", "Strawberry", "Banana", "Cookies & Cream", "Peanut Butter", "Caramel", "Coffee", "Mint Chocolate", "Berry", "Tropical", "Other"]',
        '["Без вкус", "Шоколад", "Ванилия", "Ягода", "Банан", "Бисквита и сметана", "Фъстъчено масло", "Карамел", "Кафе", "Мента и шоколад", "Горски плодове", "Тропически", "Друг"]',
        12
    ) ON CONFLICT DO NOTHING;

    -- Goal
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        fitness_id,
        'Fitness Goal',
        'Фитнес цел',
        'multiselect',
        false,
        true,
        '["Muscle Building", "Weight Loss", "Endurance", "Recovery", "Energy", "Lean Muscle", "Strength", "Performance", "Mass Gain"]',
        '["Изграждане на мускули", "Отслабване", "Издръжливост", "Възстановяване", "Енергия", "Слаба мускулна маса", "Сила", "Представяне", "Качване на маса"]',
        13
    ) ON CONFLICT DO NOTHING;

    -- Caffeine Content
    INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
    VALUES (
        gen_random_uuid(),
        fitness_id,
        'Caffeine Content',
        'Съдържание на кофеин',
        'select',
        false,
        true,
        '["Caffeine-Free", "Low Caffeine (<100mg)", "Moderate (100-200mg)", "High (200-300mg)", "Very High (300mg+)"]',
        '["Без кофеин", "Нисък кофеин (<100мг)", "Умерен (100-200мг)", "Висок (200-300мг)", "Много висок (300мг+)"]',
        14
    ) ON CONFLICT DO NOTHING;

END $$;
;
