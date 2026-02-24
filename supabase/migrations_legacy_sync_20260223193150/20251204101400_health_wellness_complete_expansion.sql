
-- =====================================================
-- HEALTH & WELLNESS COMPLETE EXPANSION
-- L0 -> L1 -> L2 -> L3 Categories + Attributes
-- Based on patterns from grocery, beauty, electronics
-- =====================================================

-- First, get the parent IDs we need
DO $$
DECLARE
    health_id UUID := 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673';
    vitamins_id UUID := 'b2149a58-6db6-43f7-8237-da861e8dbdeb';
    medical_id UUID := 'ab4a5dff-c805-4d8d-a1d5-a5c399b6ec8a';
    fitness_id UUID := 'fc2fac98-e0c6-4bc0-a9c1-d0c94943e784';
    personal_care_id UUID := '3502dfcb-6a8a-432c-b506-3c3fd0eb5a5e';
    vision_id UUID := 'a17e101b-a0a1-40c6-9f2b-d7c61bb6c07c';
    mobility_id UUID := 'f7b8554d-2dfb-4a87-a6ee-f46006d13081';
    sleep_id UUID := 'c21b1b3f-0329-45b4-ab24-d718ebaacba2';
    omega_id UUID := 'f34571c7-67c8-43ee-ad4c-13ae3dafb0c3';
    joint_id UUID := 'a0dc2310-5589-4093-bcd7-40f4839c5136';
    womens_id UUID := '77fc5c7e-0a8a-4967-8dfc-b247e22e3d65';
    mens_id UUID := '1270c114-f1c5-4a5b-9ee4-81e4eea888c2';
    heart_id UUID := 'e283373f-1727-4fe0-91d2-dea0b19c2d35';
    childrens_id UUID := 'ca000000-0000-0000-0000-000000000100';
    weight_id UUID := 'e1da58d8-4d6a-41fb-8d10-bfc58c0524ea';
    superfoods_id UUID := '0e6a27cb-ab9e-432b-a04c-3bd8137f7fbd';
    
    -- New L2 IDs
    new_id UUID;
BEGIN
    -- =====================================================
    -- L2 CATEGORIES FOR VITAMINS & SUPPLEMENTS
    -- =====================================================
    
    -- Multivitamins
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Multivitamins', 'Мултивитамини', 'hw-multivitamins', vitamins_id, '💊', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Vitamin A
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Vitamin A', 'Витамин А', 'hw-vitamin-a', vitamins_id, '🥕', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Vitamin B Complex
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Vitamin B Complex', 'Витамин B Комплекс', 'hw-vitamin-b', vitamins_id, '⚡', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Vitamin C
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Vitamin C', 'Витамин C', 'hw-vitamin-c', vitamins_id, '🍊', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Vitamin D
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Vitamin D', 'Витамин D', 'hw-vitamin-d', vitamins_id, '☀️', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Vitamin E
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Vitamin E', 'Витамин E', 'hw-vitamin-e', vitamins_id, '🌻', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Vitamin K
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Vitamin K', 'Витамин K', 'hw-vitamin-k', vitamins_id, '🥬', 7)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR MEDICAL SUPPLIES
    -- =====================================================
    
    -- First Aid
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'First Aid', 'Първа помощ', 'hw-first-aid', medical_id, '🩹', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Bandages & Dressings
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Bandages & Dressings', 'Бинтове и превръзки', 'hw-bandages', medical_id, '🩹', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Blood Pressure Monitors
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Blood Pressure Monitors', 'Апарати за кръвно', 'hw-bp-monitors', medical_id, '💓', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Thermometers
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Thermometers', 'Термометри', 'hw-thermometers', medical_id, '🌡️', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Glucose Monitors
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Glucose Monitors', 'Глюкомери', 'hw-glucose-monitors', medical_id, '🩸', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Pulse Oximeters
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Pulse Oximeters', 'Пулсоксиметри', 'hw-oximeters', medical_id, '❤️', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Nebulizers & Inhalers
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Nebulizers & Inhalers', 'Небулайзери и инхалатори', 'hw-nebulizers', medical_id, '💨', 7)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Scales & Body Analysis
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Scales & Body Analysis', 'Кантари и анализатори', 'hw-scales', medical_id, '⚖️', 8)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Medical Tests
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Medical Tests', 'Медицински тестове', 'hw-medical-tests', medical_id, '🧪', 9)
    ON CONFLICT (slug) DO NOTHING;
    
    -- PPE & Safety
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'PPE & Safety', 'Предпазни средства', 'hw-ppe', medical_id, '😷', 10)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR FITNESS & NUTRITION
    -- =====================================================
    
    -- Protein Supplements
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Protein Supplements', 'Протеинови добавки', 'hw-protein', fitness_id, '💪', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Pre-Workout
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Pre-Workout', 'Предтренировъчни', 'hw-pre-workout', fitness_id, '⚡', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Post-Workout & Recovery
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Post-Workout & Recovery', 'Възстановяване', 'hw-post-workout', fitness_id, '🔄', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Amino Acids
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Amino Acids', 'Аминокиселини', 'hw-amino-acids', fitness_id, '🧬', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Creatine
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Creatine', 'Креатин', 'hw-creatine', fitness_id, '💪', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Energy Bars & Gels
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Energy Bars & Gels', 'Енергийни барове', 'hw-energy-bars', fitness_id, '🍫', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Sports Drinks
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Sports Drinks', 'Спортни напитки', 'hw-sports-drinks', fitness_id, '🥤', 7)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Mass Gainers
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Mass Gainers', 'Гейнъри', 'hw-mass-gainers', fitness_id, '📈', 8)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR VISION CARE
    -- =====================================================
    
    -- Contact Lenses
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Contact Lenses', 'Контактни лещи', 'hw-contact-lenses', vision_id, '👁️', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Lens Solutions
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Lens Solutions', 'Разтвори за лещи', 'hw-lens-solutions', vision_id, '💧', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Reading Glasses
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Reading Glasses', 'Очила за четене', 'hw-reading-glasses', vision_id, '📖', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Eye Drops
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Eye Drops', 'Капки за очи', 'hw-eye-drops', vision_id, '💧', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Eye Vitamins
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Eye Vitamins', 'Витамини за очи', 'hw-eye-vitamins', vision_id, '🥕', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Blue Light Glasses
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Blue Light Glasses', 'Очила за синя светлина', 'hw-blue-light-glasses', vision_id, '💻', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR MOBILITY & DISABILITY
    -- =====================================================
    
    -- Wheelchairs
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Wheelchairs', 'Инвалидни колички', 'hw-wheelchairs', mobility_id, '♿', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Walkers & Rollators
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Walkers & Rollators', 'Проходилки', 'hw-walkers', mobility_id, '🚶', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Canes & Crutches
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Canes & Crutches', 'Бастуни и патерици', 'hw-canes', mobility_id, '🦯', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Mobility Scooters
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Mobility Scooters', 'Скутери за мобилност', 'hw-mobility-scooters', mobility_id, '🛵', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Transfer Aids
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Transfer Aids', 'Помощни средства', 'hw-transfer-aids', mobility_id, '🛏️', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Orthopedic Supports
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Orthopedic Supports', 'Ортопедични средства', 'hw-orthopedic', mobility_id, '🦿', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR SLEEP & RELAXATION
    -- =====================================================
    
    -- Sleep Supplements
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Sleep Supplements', 'Добавки за сън', 'hw-sleep-supplements', sleep_id, '💤', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Melatonin
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Melatonin', 'Мелатонин', 'hw-melatonin', sleep_id, '🌙', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Sleep Aids & Devices
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Sleep Aids & Devices', 'Устройства за сън', 'hw-sleep-aids', sleep_id, '😴', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- White Noise Machines
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'White Noise Machines', 'Машини за бял шум', 'hw-white-noise', sleep_id, '🔊', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Sleep Masks
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Sleep Masks', 'Маски за сън', 'hw-sleep-masks', sleep_id, '🎭', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Aromatherapy
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Aromatherapy', 'Ароматерапия', 'hw-aromatherapy', sleep_id, '🌸', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR OMEGA & FISH OILS
    -- =====================================================
    
    -- Omega-3
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Omega-3', 'Омега-3', 'hw-omega-3', omega_id, '🐟', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Fish Oil
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Fish Oil', 'Рибено масло', 'hw-fish-oil', omega_id, '🐠', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Krill Oil
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Krill Oil', 'Крил масло', 'hw-krill-oil', omega_id, '🦐', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Cod Liver Oil
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Cod Liver Oil', 'Рибено масло от черен дроб', 'hw-cod-liver-oil', omega_id, '💊', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Vegan Omega
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Vegan Omega', 'Веган Омега', 'hw-vegan-omega', omega_id, '🌿', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR JOINT & MOBILITY
    -- =====================================================
    
    -- Glucosamine
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Glucosamine', 'Глюкозамин', 'hw-glucosamine', joint_id, '🦴', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Chondroitin
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Chondroitin', 'Хондроитин', 'hw-chondroitin', joint_id, '🦴', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- MSM
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'MSM', 'MSM', 'hw-msm', joint_id, '💊', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Collagen for Joints
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Collagen for Joints', 'Колаген за стави', 'hw-joint-collagen', joint_id, '✨', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Turmeric & Curcumin
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Turmeric & Curcumin', 'Куркума и куркумин', 'hw-turmeric', joint_id, '🟡', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Joint Support Formulas
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Joint Support Formulas', 'Формули за стави', 'hw-joint-formulas', joint_id, '💪', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR WOMEN'S HEALTH
    -- =====================================================
    
    -- Prenatal Vitamins
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Prenatal Vitamins', 'Пренатални витамини', 'hw-prenatal', womens_id, '🤰', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Postnatal & Breastfeeding
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Postnatal & Breastfeeding', 'След раждане и кърмене', 'hw-postnatal', womens_id, '👶', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Menstrual Health
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Menstrual Health', 'Менструално здраве', 'hw-menstrual', womens_id, '🌸', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Menopause Support
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Menopause Support', 'Подкрепа при менопауза', 'hw-menopause', womens_id, '🌺', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Hormone Balance
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Hormone Balance', 'Хормонален баланс', 'hw-hormone-balance', womens_id, '⚖️', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Iron for Women
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Iron for Women', 'Желязо за жени', 'hw-iron-women', womens_id, '🩸', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Fertility Support
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Fertility Support', 'Подкрепа за фертилност', 'hw-fertility', womens_id, '🌱', 7)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR MEN'S HEALTH
    -- =====================================================
    
    -- Prostate Health
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Prostate Health', 'Здраве на простатата', 'hw-prostate', mens_id, '🏥', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Testosterone Support
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Testosterone Support', 'Поддръжка на тестостерон', 'hw-testosterone', mens_id, '💪', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Male Fertility
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Male Fertility', 'Мъжка фертилност', 'hw-male-fertility', mens_id, '🌱', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Men's Multivitamins
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Men''s Multivitamins', 'Мултивитамини за мъже', 'hw-mens-multi', mens_id, '💊', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Hair & Beard Support
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Hair & Beard Support', 'Коса и брада', 'hw-hair-beard', mens_id, '🧔', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR HEART HEALTH
    -- =====================================================
    
    -- CoQ10
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'CoQ10', 'Коензим Q10', 'hw-coq10', heart_id, '❤️', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Heart Omega
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Heart Omega', 'Омега за сърцето', 'hw-heart-omega', heart_id, '🐟', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Cholesterol Support
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Cholesterol Support', 'Подкрепа за холестерол', 'hw-cholesterol', heart_id, '💓', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Blood Pressure Support
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Blood Pressure Support', 'Подкрепа за кръвно', 'hw-bp-support', heart_id, '🩺', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Circulation Support
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Circulation Support', 'Кръвообращение', 'hw-circulation', heart_id, '🔄', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR CHILDREN'S HEALTH
    -- =====================================================
    
    -- Kids Multivitamins
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Kids Multivitamins', 'Детски мултивитамини', 'hw-kids-multi', childrens_id, '🧒', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Kids Omega
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Kids Omega', 'Детска Омега', 'hw-kids-omega', childrens_id, '🐟', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Kids Probiotics
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Kids Probiotics', 'Детски пробиотици', 'hw-kids-probiotics', childrens_id, '🦠', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Kids Immune Support
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Kids Immune Support', 'Детска имунна подкрепа', 'hw-kids-immune', childrens_id, '🛡️', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Vitamin Gummies
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Vitamin Gummies', 'Витаминни желирани бонбони', 'hw-vitamin-gummies', childrens_id, '🍬', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR WEIGHT MANAGEMENT
    -- =====================================================
    
    -- Fat Burners
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Fat Burners', 'Фетбърнъри', 'hw-fat-burners', weight_id, '🔥', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Appetite Control
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Appetite Control', 'Контрол на апетита', 'hw-appetite', weight_id, '🍽️', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Meal Replacements
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Meal Replacements', 'Заместители на храна', 'hw-meal-replacement', weight_id, '🥤', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Metabolism Boosters
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Metabolism Boosters', 'Ускорители на метаболизма', 'hw-metabolism', weight_id, '⚡', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- CLA & L-Carnitine
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'CLA & L-Carnitine', 'CLA и L-Карнитин', 'hw-cla-carnitine', weight_id, '💊', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Detox & Cleanse
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Detox & Cleanse', 'Детокс и пречистване', 'hw-detox', weight_id, '🌿', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- =====================================================
    -- L2 CATEGORIES FOR SUPERFOODS & GREENS
    -- =====================================================
    
    -- Spirulina
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Spirulina', 'Спирулина', 'hw-spirulina', superfoods_id, '🌿', 1)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Chlorella
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Chlorella', 'Хлорела', 'hw-chlorella', superfoods_id, '🌱', 2)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Green Powders
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Green Powders', 'Зелени прахове', 'hw-green-powders', superfoods_id, '🥬', 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Wheatgrass
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Wheatgrass', 'Пшенична трева', 'hw-wheatgrass', superfoods_id, '🌾', 4)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Moringa
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Moringa', 'Моринга', 'hw-moringa', superfoods_id, '🌳', 5)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Maca
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Maca', 'Мака', 'hw-maca', superfoods_id, '🥔', 6)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Acai & Berry Powders
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Acai & Berry Powders', 'Акай и плодови прахове', 'hw-acai-berries', superfoods_id, '🫐', 7)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Chia & Flax Seeds
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES (gen_random_uuid(), 'Chia & Flax Seeds', 'Чиа и ленени семена', 'hw-chia-flax', superfoods_id, '🌰', 8)
    ON CONFLICT (slug) DO NOTHING;

END $$;
;
