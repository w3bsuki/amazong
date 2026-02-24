-- Phase 3: Pet Pharmacy L2 Categories
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Prescription Medications', 'Лекарства с рецепта', 'prescription-meds', '631b67cd-63e7-40c5-97aa-7cac56d807e8', NULL, 1, 'Prescription pet medications', 'Лекарства с рецепта за домашни любимци'),
('OTC Medications', 'Лекарства без рецепта', 'otc-medications', '631b67cd-63e7-40c5-97aa-7cac56d807e8', NULL, 2, 'Over the counter medications', 'Лекарства без рецепта'),
('Flea & Tick Prevention', 'Превенция на бълхи и кърлежи', 'flea-tick-prevention', '631b67cd-63e7-40c5-97aa-7cac56d807e8', NULL, 3, 'Flea and tick prevention', 'Превенция на бълхи и кърлежи'),
('Heartworm Prevention', 'Превенция на сърдечни червеи', 'heartworm-prevention', '631b67cd-63e7-40c5-97aa-7cac56d807e8', NULL, 4, 'Heartworm prevention', 'Превенция на сърдечни червеи'),
('Pet First Aid', 'Първа помощ за домашни любимци', 'pet-first-aid-supplies', '631b67cd-63e7-40c5-97aa-7cac56d807e8', NULL, 5, 'Pet first aid supplies', 'Консумативи за първа помощ'),
('Supplements & Vitamins', 'Добавки и витамини', 'pet-supplements-vitamins', '631b67cd-63e7-40c5-97aa-7cac56d807e8', NULL, 6, 'Pet supplements and vitamins', 'Добавки и витамини за домашни любимци')
ON CONFLICT (slug) DO NOTHING;

-- Pet Pharmacy L3 - Prescription Medications
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Antibiotics', 'Антибиотици', 'pet-antibiotics', id, NULL, 1, 'Pet antibiotics', 'Антибиотици за домашни любимци'
FROM categories WHERE slug = 'prescription-meds' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pain Medications', 'Обезболяващи', 'pet-pain-medications', id, NULL, 2, 'Pet pain medications', 'Обезболяващи за домашни любимци'
FROM categories WHERE slug = 'prescription-meds' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Anti-Inflammatory', 'Противовъзпалителни', 'pet-anti-inflammatory', id, NULL, 3, 'Anti-inflammatory medications', 'Противовъзпалителни лекарства'
FROM categories WHERE slug = 'prescription-meds' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Allergy Medications', 'Лекарства за алергии', 'pet-allergy-meds', id, NULL, 4, 'Allergy medications', 'Лекарства за алергии'
FROM categories WHERE slug = 'prescription-meds' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Heart Medications', 'Сърдечни лекарства', 'pet-heart-meds', id, NULL, 5, 'Heart medications', 'Сърдечни лекарства'
FROM categories WHERE slug = 'prescription-meds' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Thyroid Medications', 'Лекарства за щитовидна жлеза', 'pet-thyroid-meds', id, NULL, 6, 'Thyroid medications', 'Лекарства за щитовидна жлеза'
FROM categories WHERE slug = 'prescription-meds' ON CONFLICT (slug) DO NOTHING;

-- Pet Pharmacy L3 - Flea & Tick
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Topical Treatments', 'Локални третирания', 'topical-flea-tick', id, NULL, 1, 'Topical flea and tick treatments', 'Локални третирания против бълхи и кърлежи'
FROM categories WHERE slug = 'flea-tick-prevention' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Oral Flea & Tick', 'Орални препарати', 'oral-flea-tick', id, NULL, 2, 'Oral flea and tick prevention', 'Орални препарати против бълхи и кърлежи'
FROM categories WHERE slug = 'flea-tick-prevention' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Flea Collars', 'Нашийници против бълхи', 'flea-collars', id, NULL, 3, 'Flea and tick collars', 'Нашийници против бълхи и кърлежи'
FROM categories WHERE slug = 'flea-tick-prevention' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Flea Sprays', 'Спрейове против бълхи', 'flea-sprays', id, NULL, 4, 'Flea sprays', 'Спрейове против бълхи'
FROM categories WHERE slug = 'flea-tick-prevention' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Home & Yard Treatment', 'Третиране на дом и двор', 'home-yard-flea-treatment', id, NULL, 5, 'Home and yard flea treatment', 'Третиране на дом и двор против бълхи'
FROM categories WHERE slug = 'flea-tick-prevention' ON CONFLICT (slug) DO NOTHING;

-- Pet Pharmacy L3 - First Aid
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'First Aid Kits', 'Комплекти за първа помощ', 'pet-first-aid-kits', id, NULL, 1, 'Pet first aid kits', 'Комплекти за първа помощ'
FROM categories WHERE slug = 'pet-first-aid-supplies' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Bandages & Wraps', 'Превръзки и бинтове', 'pet-bandages', id, NULL, 2, 'Pet bandages and wraps', 'Превръзки и бинтове'
FROM categories WHERE slug = 'pet-first-aid-supplies' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Wound Care', 'Грижа за рани', 'pet-wound-care', id, NULL, 3, 'Pet wound care products', 'Продукти за грижа за рани'
FROM categories WHERE slug = 'pet-first-aid-supplies' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Eye & Ear Care', 'Грижа за очи и уши', 'pet-eye-ear-care', id, NULL, 4, 'Pet eye and ear care', 'Грижа за очи и уши'
FROM categories WHERE slug = 'pet-first-aid-supplies' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Recovery Cones', 'Възстановителни конуси', 'recovery-cones', id, NULL, 5, 'Recovery cones and collars', 'Възстановителни конуси и яки'
FROM categories WHERE slug = 'pet-first-aid-supplies' ON CONFLICT (slug) DO NOTHING;

-- Pet Travel L2 Categories
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Pet Carriers', 'Транспортни чанти', 'pet-carriers-travel', '4be7a8ef-679e-4ac0-b501-4d6fd4c73c3d', NULL, 1, 'Pet carriers for travel', 'Транспортни чанти за пътуване'),
('Car Travel', 'Пътуване с кола', 'pet-car-accessories', '4be7a8ef-679e-4ac0-b501-4d6fd4c73c3d', NULL, 2, 'Pet car travel accessories', 'Аксесоари за пътуване с кола'),
('Travel Bags & Totes', 'Чанти за пътуване', 'pet-travel-bags', '4be7a8ef-679e-4ac0-b501-4d6fd4c73c3d', NULL, 3, 'Pet travel bags and totes', 'Чанти за пътуване'),
('Travel Bowls & Bottles', 'Купички и бутилки за път', 'pet-travel-bowls', '4be7a8ef-679e-4ac0-b501-4d6fd4c73c3d', NULL, 4, 'Travel bowls and bottles', 'Купички и бутилки за път'),
('Airline Travel', 'Самолетно пътуване', 'airline-approved', '4be7a8ef-679e-4ac0-b501-4d6fd4c73c3d', NULL, 5, 'Airline approved carriers', 'Одобрени за самолет транспортни чанти'),
('Strollers & Wagons', 'Колички и вагони', 'pet-strollers', '4be7a8ef-679e-4ac0-b501-4d6fd4c73c3d', NULL, 6, 'Pet strollers and wagons', 'Колички и вагони за домашни любимци')
ON CONFLICT (slug) DO NOTHING;

-- Pet Travel L3 - Pet Carriers
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Hard-Sided Carriers', 'Твърди чанти', 'hard-sided-pet-carriers', id, NULL, 1, 'Hard-sided pet carriers', 'Твърди транспортни чанти'
FROM categories WHERE slug = 'pet-carriers-travel' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Soft-Sided Carriers', 'Меки чанти', 'soft-sided-pet-carriers', id, NULL, 2, 'Soft-sided pet carriers', 'Меки транспортни чанти'
FROM categories WHERE slug = 'pet-carriers-travel' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Backpack Carriers', 'Раници за носене', 'backpack-pet-carriers', id, NULL, 3, 'Backpack pet carriers', 'Раници за носене на домашни любимци'
FROM categories WHERE slug = 'pet-carriers-travel' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Rolling Carriers', 'Чанти на колелца', 'rolling-pet-carriers', id, NULL, 4, 'Rolling pet carriers', 'Транспортни чанти на колелца'
FROM categories WHERE slug = 'pet-carriers-travel' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Sling Carriers', 'Слинг чанти', 'sling-pet-carriers', id, NULL, 5, 'Sling pet carriers', 'Слинг чанти за домашни любимци'
FROM categories WHERE slug = 'pet-carriers-travel' ON CONFLICT (slug) DO NOTHING;

-- Pet Travel L3 - Car Travel
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Car Seat Covers', 'Покривала за седалки', 'pet-car-seat-covers', id, NULL, 1, 'Car seat covers for pets', 'Покривала за седалки за домашни любимци'
FROM categories WHERE slug = 'pet-car-accessories' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Car Booster Seats', 'Столчета за кола', 'pet-car-booster-seats', id, NULL, 2, 'Pet car booster seats', 'Столчета за кола за домашни любимци'
FROM categories WHERE slug = 'pet-car-accessories' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pet Seat Belts', 'Колани за домашни любимци', 'pet-seat-belts', id, NULL, 3, 'Pet seat belts and harnesses', 'Колани и нагръдници за домашни любимци'
FROM categories WHERE slug = 'pet-car-accessories' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Car Barriers', 'Бариери за кола', 'pet-car-barriers', id, NULL, 4, 'Pet car barriers', 'Бариери за кола'
FROM categories WHERE slug = 'pet-car-accessories' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pet Ramps', 'Рампи за домашни любимци', 'pet-car-ramps', id, NULL, 5, 'Pet car ramps', 'Рампи за кола'
FROM categories WHERE slug = 'pet-car-accessories' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Cargo Liners', 'Постелки за багажник', 'pet-cargo-liners', id, NULL, 6, 'Pet cargo liners', 'Постелки за багажник'
FROM categories WHERE slug = 'pet-car-accessories' ON CONFLICT (slug) DO NOTHING;;
