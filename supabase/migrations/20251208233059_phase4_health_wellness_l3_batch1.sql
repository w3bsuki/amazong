-- Phase 4: Health & Wellness - L3 Categories Batch 1 (Medical & Personal Care, Supplements)

DO $$
DECLARE
  -- Medical & Personal Care L2 IDs
  bp_monitors_id UUID := 'cbab6deb-c36c-4230-8e37-5d769c4e9eb5';
  diabetes_id UUID := 'dcff9b14-2964-4b8e-955b-aba6e72c138f';
  eye_care_id UUID := '1ac3ee0d-d300-430f-8e4b-10f0708a3589';
  first_aid_id UUID := 'c02179e1-0b20-4839-b8bb-c3f4a7ed8700';
  mobility_id UUID := 'f7b8554d-2dfb-4a87-a6ee-f46006d13081';
  mobility2_id UUID := '0273d3a9-e595-4cb8-95ef-f4e21a77fcc6';
  pain_id UUID := '6942bcdf-053c-44ba-a47e-66bedd644251';
  sleep_id UUID := 'f4e75818-8cb4-4355-8be2-0882f78e680b';
  thermo_id UUID := '8b05ee11-fd75-4656-bf05-4d2f84fa120c';
  vision_id UUID := 'a17e101b-a0a1-40c6-9f2b-d7c61bb6c07c';
  -- Supplements & Vitamins L2 IDs
  collagen_id UUID := '58f8f441-3af3-48e5-bb49-184c90654264';
  herbal_id UUID := '2dc2af65-6b9b-4ef6-b154-f739fe442ba3';
  immune_id UUID := 'd54e4390-f653-4049-9189-2f4e7490f122';
  joint_id UUID := 'a0dc2310-5589-4093-bcd7-40f4839c5136';
  minerals_id UUID := 'ec5c340a-2572-4bfc-a9a6-f766684f2b50';
  multivit_id UUID := '9ff45517-2511-4f17-b8bd-edab110c687b';
  omega_id UUID := '68e454ce-b262-4f65-a298-17a5948b36eb';
  probiotics_id UUID := '11a6be7f-3776-487b-9d7f-06e9dcd1bbf5';
  sleep_relax_id UUID := 'c21b1b3f-0329-45b4-ab24-d718ebaacba2';
  superfoods_id UUID := '0e6a27cb-ab9e-432b-a04c-3bd8137f7fbd';
  vit_b_id UUID := 'ce0f6574-1057-47cb-abb8-4a6eced36aa3';
  vit_c_id UUID := '6a32a1e5-87b9-412d-9272-24dc2c478cbe';
  vit_d_id UUID := 'f32d2c08-7d85-4b3d-a59b-bf0f25d06c7f';
BEGIN
  -- Blood Pressure Monitors L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Arm Blood Pressure Monitors', 'bp-arm', bp_monitors_id, 'Апарати за ръка', '💓', 1),
    ('Wrist Blood Pressure Monitors', 'bp-wrist', bp_monitors_id, 'Апарати за китка', '💓', 2),
    ('Portable BP Monitors', 'bp-portable', bp_monitors_id, 'Преносими апарати', '💓', 3),
    ('Smart BP Monitors', 'bp-smart', bp_monitors_id, 'Смарт апарати', '💓', 4),
    ('Professional BP Monitors', 'bp-professional', bp_monitors_id, 'Професионални апарати', '💓', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Diabetes Care L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Glucose Meters', 'diabetes-glucose-meters', diabetes_id, 'Глюкомери', '💉', 1),
    ('Test Strips', 'diabetes-test-strips', diabetes_id, 'Тест ленти', '💉', 2),
    ('Lancets', 'diabetes-lancets', diabetes_id, 'Ланцети', '💉', 3),
    ('Continuous Glucose Monitors', 'diabetes-cgm', diabetes_id, 'Непрекъснати глюкомери', '💉', 4),
    ('Insulin Supplies', 'diabetes-insulin', diabetes_id, 'Инсулинови принадлежности', '💉', 5),
    ('Diabetes Management Kits', 'diabetes-kits', diabetes_id, 'Комплекти за диабет', '💉', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Eye Care L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Eye Drops', 'eye-drops', eye_care_id, 'Капки за очи', '👁️', 1),
    ('Contact Lens Solutions', 'eye-contact-solution', eye_care_id, 'Разтвори за лещи', '👁️', 2),
    ('Eye Vitamins', 'eye-vitamins', eye_care_id, 'Витамини за очи', '👁️', 3),
    ('Eye Masks', 'eye-masks', eye_care_id, 'Маски за очи', '👁️', 4),
    ('Eye Cleansers', 'eye-cleansers', eye_care_id, 'Почистващи средства', '👁️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- First Aid L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('First Aid Kits', 'first-aid-kits', first_aid_id, 'Комплекти първа помощ', '🩹', 1),
    ('Bandages & Dressings', 'first-aid-bandages', first_aid_id, 'Превръзки', '🩹', 2),
    ('Antiseptics', 'first-aid-antiseptics', first_aid_id, 'Антисептици', '🩹', 3),
    ('Wound Care', 'first-aid-wound', first_aid_id, 'Грижа за рани', '🩹', 4),
    ('Emergency Supplies', 'first-aid-emergency', first_aid_id, 'Аварийни средства', '🩹', 5),
    ('CPR & AED Equipment', 'first-aid-cpr', first_aid_id, 'CPR и дефибрилатори', '🩹', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Mobility Aids L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Wheelchairs', 'mobility-wheelchairs', mobility2_id, 'Инвалидни колички', '♿', 1),
    ('Walkers', 'mobility-walkers', mobility2_id, 'Проходилки', '♿', 2),
    ('Canes', 'mobility-canes', mobility2_id, 'Бастуни', '♿', 3),
    ('Crutches', 'mobility-crutches', mobility2_id, 'Патерици', '♿', 4),
    ('Mobility Scooters', 'mobility-scooters', mobility2_id, 'Скутери за придвижване', '♿', 5),
    ('Rollators', 'mobility-rollators', mobility2_id, 'Ролатори', '♿', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Pain Relief L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Pain Relievers', 'pain-relievers', pain_id, 'Болкоуспокояващи', '💊', 1),
    ('Topical Pain Relief', 'pain-topical', pain_id, 'Локална терапия', '💊', 2),
    ('Heat & Cold Therapy', 'pain-heat-cold', pain_id, 'Топла/студена терапия', '💊', 3),
    ('TENS Units', 'pain-tens', pain_id, 'TENS апарати', '💊', 4),
    ('Massage Devices', 'pain-massage', pain_id, 'Масажни устройства', '💊', 5),
    ('Pain Patches', 'pain-patches', pain_id, 'Болкоуспокояващи пластири', '💊', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Sleep Aids L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Melatonin', 'sleep-melatonin', sleep_id, 'Мелатонин', '😴', 1),
    ('Sleep Gummies', 'sleep-gummies', sleep_id, 'Гумени бонбони за сън', '😴', 2),
    ('Herbal Sleep Aids', 'sleep-herbal', sleep_id, 'Билкови средства за сън', '😴', 3),
    ('Sleep Masks', 'sleep-masks', sleep_id, 'Маски за сън', '😴', 4),
    ('White Noise Machines', 'sleep-white-noise', sleep_id, 'Машини за бял шум', '😴', 5),
    ('Sleep Trackers', 'sleep-trackers', sleep_id, 'Тракери за сън', '😴', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Thermometers L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Digital Thermometers', 'thermo-digital', thermo_id, 'Дигитални термометри', '🌡️', 1),
    ('Forehead Thermometers', 'thermo-forehead', thermo_id, 'Челни термометри', '🌡️', 2),
    ('Ear Thermometers', 'thermo-ear', thermo_id, 'Ушни термометри', '🌡️', 3),
    ('Smart Thermometers', 'thermo-smart', thermo_id, 'Смарт термометри', '🌡️', 4),
    ('Basal Thermometers', 'thermo-basal', thermo_id, 'Базални термометри', '🌡️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Vision Care L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Reading Glasses', 'vision-reading', vision_id, 'Очила за четене', '👓', 1),
    ('Blue Light Glasses', 'vision-blue-light', vision_id, 'Очила против синя светлина', '👓', 2),
    ('Contact Lenses', 'vision-contacts', vision_id, 'Контактни лещи', '👓', 3),
    ('Lens Cases', 'vision-lens-cases', vision_id, 'Кутии за лещи', '👓', 4),
    ('Glasses Accessories', 'vision-accessories', vision_id, 'Аксесоари за очила', '👓', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Collagen L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Collagen Powder', 'collagen-powder', collagen_id, 'Колаген на прах', '✨', 1),
    ('Collagen Peptides', 'collagen-peptides', collagen_id, 'Колагенови пептиди', '✨', 2),
    ('Marine Collagen', 'collagen-marine', collagen_id, 'Морски колаген', '✨', 3),
    ('Collagen Capsules', 'collagen-capsules', collagen_id, 'Колаген капсули', '✨', 4),
    ('Collagen Drinks', 'collagen-drinks', collagen_id, 'Колагенови напитки', '✨', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Herbal Supplements L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Turmeric & Curcumin', 'herbal-turmeric', herbal_id, 'Куркума и куркумин', '🌿', 1),
    ('Ginger Supplements', 'herbal-ginger', herbal_id, 'Джинджифил', '🌿', 2),
    ('Ashwagandha', 'herbal-ashwagandha', herbal_id, 'Ашваганда', '🌿', 3),
    ('Echinacea', 'herbal-echinacea', herbal_id, 'Ехинацея', '🌿', 4),
    ('Ginseng', 'herbal-ginseng', herbal_id, 'Женшен', '🌿', 5),
    ('Milk Thistle', 'herbal-milk-thistle', herbal_id, 'Бял трън', '🌿', 6),
    ('Valerian Root', 'herbal-valerian', herbal_id, 'Валериана', '🌿', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Immune Support L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Vitamin C Immune', 'immune-vitamin-c', immune_id, 'Витамин C за имунитет', '🛡️', 1),
    ('Elderberry', 'immune-elderberry', immune_id, 'Бъз', '🛡️', 2),
    ('Zinc Supplements', 'immune-zinc', immune_id, 'Цинк добавки', '🛡️', 3),
    ('Immune Blends', 'immune-blends', immune_id, 'Имунни комплекси', '🛡️', 4),
    ('Immune Gummies', 'immune-gummies', immune_id, 'Гумени бонбони за имунитет', '🛡️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Joint & Mobility Supplements L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Glucosamine', 'joint-glucosamine', joint_id, 'Глюкозамин', '🦴', 1),
    ('Chondroitin', 'joint-chondroitin', joint_id, 'Хондроитин', '🦴', 2),
    ('MSM', 'joint-msm', joint_id, 'MSM', '🦴', 3),
    ('Hyaluronic Acid', 'joint-hyaluronic', joint_id, 'Хиалуронова киселина', '🦴', 4),
    ('Joint Formulas', 'joint-formulas', joint_id, 'Формули за стави', '🦴', 5),
    ('Turmeric for Joints', 'joint-turmeric', joint_id, 'Куркума за стави', '🦴', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Minerals L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Magnesium', 'minerals-magnesium', minerals_id, 'Магнезий', '⚡', 1),
    ('Zinc', 'minerals-zinc', minerals_id, 'Цинк', '⚡', 2),
    ('Iron', 'minerals-iron', minerals_id, 'Желязо', '⚡', 3),
    ('Calcium', 'minerals-calcium', minerals_id, 'Калций', '⚡', 4),
    ('Potassium', 'minerals-potassium', minerals_id, 'Калий', '⚡', 5),
    ('Multi-Minerals', 'minerals-multi', minerals_id, 'Мулти-минерали', '⚡', 6),
    ('Trace Minerals', 'minerals-trace', minerals_id, 'Микроелементи', '⚡', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Multivitamins L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Men''s Multivitamins', 'multi-mens', multivit_id, 'Мултивитамини за мъже', '💊', 1),
    ('Women''s Multivitamins', 'multi-womens', multivit_id, 'Мултивитамини за жени', '💊', 2),
    ('Children''s Multivitamins', 'multi-kids', multivit_id, 'Мултивитамини за деца', '💊', 3),
    ('Prenatal Vitamins', 'multi-prenatal', multivit_id, 'Пренатални витамини', '💊', 4),
    ('Senior Multivitamins', 'multi-senior', multivit_id, 'Мултивитамини за възрастни', '💊', 5),
    ('Whole Food Multis', 'multi-whole-food', multivit_id, 'Мултивитамини от цели храни', '💊', 6)
  ON CONFLICT (slug) DO NOTHING;

END $$;;
