
-- =====================================================
-- HEALTH & WELLNESS L3 EXPANSION
-- Adding L3 subcategories for key L2 categories
-- =====================================================

-- Get L2 parent IDs and add L3 categories
DO $$
DECLARE
    l2_protein_id UUID;
    l2_first_aid_id UUID;
    l2_contact_lenses_id UUID;
    l2_multivitamins_id UUID;
    l2_sleep_supplements_id UUID;
    l2_prenatal_id UUID;
BEGIN
    -- Get L2 IDs
    SELECT id INTO l2_protein_id FROM categories WHERE slug = 'hw-protein';
    SELECT id INTO l2_first_aid_id FROM categories WHERE slug = 'hw-first-aid';
    SELECT id INTO l2_contact_lenses_id FROM categories WHERE slug = 'hw-contact-lenses';
    SELECT id INTO l2_multivitamins_id FROM categories WHERE slug = 'hw-multivitamins';
    SELECT id INTO l2_sleep_supplements_id FROM categories WHERE slug = 'hw-sleep-supplements';
    SELECT id INTO l2_prenatal_id FROM categories WHERE slug = 'hw-prenatal';

    -- =====================================================
    -- L3 CATEGORIES FOR PROTEIN SUPPLEMENTS
    -- =====================================================
    
    IF l2_protein_id IS NOT NULL THEN
        INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
        (gen_random_uuid(), 'Whey Protein', 'Суроватъчен протеин', 'hw-whey-protein', l2_protein_id, '🥛', 1),
        (gen_random_uuid(), 'Whey Isolate', 'Суроватъчен изолат', 'hw-whey-isolate', l2_protein_id, '🥛', 2),
        (gen_random_uuid(), 'Casein Protein', 'Казеинов протеин', 'hw-casein', l2_protein_id, '🌙', 3),
        (gen_random_uuid(), 'Plant Protein', 'Растителен протеин', 'hw-plant-protein', l2_protein_id, '🌿', 4),
        (gen_random_uuid(), 'Pea Protein', 'Грахов протеин', 'hw-pea-protein', l2_protein_id, '🫛', 5),
        (gen_random_uuid(), 'Rice Protein', 'Оризов протеин', 'hw-rice-protein', l2_protein_id, '🍚', 6),
        (gen_random_uuid(), 'Soy Protein', 'Соев протеин', 'hw-soy-protein', l2_protein_id, '🫘', 7),
        (gen_random_uuid(), 'Egg Protein', 'Яйчен протеин', 'hw-egg-protein', l2_protein_id, '🥚', 8),
        (gen_random_uuid(), 'Collagen Protein', 'Колагенов протеин', 'hw-collagen-protein', l2_protein_id, '✨', 9),
        (gen_random_uuid(), 'Beef Protein', 'Говежди протеин', 'hw-beef-protein', l2_protein_id, '🥩', 10)
        ON CONFLICT (slug) DO NOTHING;
    END IF;

    -- =====================================================
    -- L3 CATEGORIES FOR FIRST AID
    -- =====================================================
    
    IF l2_first_aid_id IS NOT NULL THEN
        INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
        (gen_random_uuid(), 'First Aid Kits', 'Комплекти за първа помощ', 'hw-first-aid-kits', l2_first_aid_id, '🧰', 1),
        (gen_random_uuid(), 'Adhesive Bandages', 'Лепенки', 'hw-adhesive-bandages', l2_first_aid_id, '🩹', 2),
        (gen_random_uuid(), 'Gauze & Pads', 'Марли и тампони', 'hw-gauze-pads', l2_first_aid_id, '🩹', 3),
        (gen_random_uuid(), 'Medical Tape', 'Медицински тиксо', 'hw-medical-tape', l2_first_aid_id, '📏', 4),
        (gen_random_uuid(), 'Antiseptics', 'Антисептици', 'hw-antiseptics', l2_first_aid_id, '🧴', 5),
        (gen_random_uuid(), 'Wound Care', 'Грижа за рани', 'hw-wound-care', l2_first_aid_id, '💊', 6),
        (gen_random_uuid(), 'Splints & Braces', 'Шини и стегачи', 'hw-splints', l2_first_aid_id, '🦴', 7),
        (gen_random_uuid(), 'Ice Packs', 'Ледени пакети', 'hw-ice-packs', l2_first_aid_id, '🧊', 8)
        ON CONFLICT (slug) DO NOTHING;
    END IF;

    -- =====================================================
    -- L3 CATEGORIES FOR CONTACT LENSES
    -- =====================================================
    
    IF l2_contact_lenses_id IS NOT NULL THEN
        INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
        (gen_random_uuid(), 'Daily Disposable', 'Еднодневни', 'hw-daily-lenses', l2_contact_lenses_id, '📅', 1),
        (gen_random_uuid(), 'Weekly/Bi-weekly', 'Седмични', 'hw-weekly-lenses', l2_contact_lenses_id, '📆', 2),
        (gen_random_uuid(), 'Monthly', 'Месечни', 'hw-monthly-lenses', l2_contact_lenses_id, '🗓️', 3),
        (gen_random_uuid(), 'Colored Lenses', 'Цветни лещи', 'hw-colored-lenses', l2_contact_lenses_id, '🌈', 4),
        (gen_random_uuid(), 'Toric Lenses', 'Торични лещи', 'hw-toric-lenses', l2_contact_lenses_id, '👁️', 5),
        (gen_random_uuid(), 'Multifocal', 'Мултифокални', 'hw-multifocal-lenses', l2_contact_lenses_id, '🔍', 6)
        ON CONFLICT (slug) DO NOTHING;
    END IF;

    -- =====================================================
    -- L3 CATEGORIES FOR MULTIVITAMINS
    -- =====================================================
    
    IF l2_multivitamins_id IS NOT NULL THEN
        INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
        (gen_random_uuid(), 'Men''s Multivitamins', 'Мултивитамини за мъже', 'hw-multi-men', l2_multivitamins_id, '👨', 1),
        (gen_random_uuid(), 'Women''s Multivitamins', 'Мултивитамини за жени', 'hw-multi-women', l2_multivitamins_id, '👩', 2),
        (gen_random_uuid(), '50+ Multivitamins', 'Мултивитамини 50+', 'hw-multi-seniors', l2_multivitamins_id, '👴', 3),
        (gen_random_uuid(), 'Teen Multivitamins', 'Тийн мултивитамини', 'hw-multi-teen', l2_multivitamins_id, '🧑', 4),
        (gen_random_uuid(), 'Whole Food Multi', 'Цялостни храни мулти', 'hw-whole-food-multi', l2_multivitamins_id, '🥗', 5),
        (gen_random_uuid(), 'Gummy Multivitamins', 'Желирани мултивитамини', 'hw-gummy-multi', l2_multivitamins_id, '🍬', 6),
        (gen_random_uuid(), 'Liquid Multivitamins', 'Течни мултивитамини', 'hw-liquid-multi', l2_multivitamins_id, '🧪', 7),
        (gen_random_uuid(), 'Prenatal Multi', 'Пренатални мулти', 'hw-prenatal-multi', l2_multivitamins_id, '🤰', 8)
        ON CONFLICT (slug) DO NOTHING;
    END IF;

    -- =====================================================
    -- L3 CATEGORIES FOR SLEEP SUPPLEMENTS
    -- =====================================================
    
    IF l2_sleep_supplements_id IS NOT NULL THEN
        INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
        (gen_random_uuid(), 'Melatonin Supplements', 'Мелатонин добавки', 'hw-melatonin-supplements', l2_sleep_supplements_id, '🌙', 1),
        (gen_random_uuid(), 'Magnesium for Sleep', 'Магнезий за сън', 'hw-mag-sleep', l2_sleep_supplements_id, '💤', 2),
        (gen_random_uuid(), 'Valerian Root', 'Валериана', 'hw-valerian', l2_sleep_supplements_id, '🌿', 3),
        (gen_random_uuid(), 'GABA Supplements', 'ГАБА добавки', 'hw-gaba-sleep', l2_sleep_supplements_id, '🧠', 4),
        (gen_random_uuid(), 'Sleep Gummies', 'Желирани бонбони за сън', 'hw-sleep-gummies', l2_sleep_supplements_id, '🍬', 5),
        (gen_random_uuid(), 'Passionflower', 'Пасифлора', 'hw-passionflower', l2_sleep_supplements_id, '🌸', 6),
        (gen_random_uuid(), 'Chamomile Supplements', 'Лайка добавки', 'hw-chamomile-supplements', l2_sleep_supplements_id, '🌼', 7),
        (gen_random_uuid(), 'Sleep Blend Formulas', 'Формули за сън', 'hw-sleep-blends', l2_sleep_supplements_id, '💊', 8)
        ON CONFLICT (slug) DO NOTHING;
    END IF;

END $$;
;
