-- =====================================================
-- L2 Categories for Painting & Finishing (fb0ae7fb-a15b-43c8-9994-7674a0f8f05f)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Paint Sprayers', 'Машини за боядисване', 'painting-sprayers', 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f', '🎨', 'Airless, HVLP, and handheld paint sprayers', 'Безвъздушни, HVLP и ръчни пръскачки', 1),
  (gen_random_uuid(), 'Brushes & Rollers', 'Четки и валяци', 'painting-brushes', 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f', '🖌️', 'Paint brushes, rollers, and frames', 'Бояджийски четки, валяци, рамки', 2),
  (gen_random_uuid(), 'Paint Trays & Buckets', 'Тави и кофи за боя', 'painting-trays', 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f', '🪣', 'Paint trays, liners, grid buckets', 'Тави за боя, вложки, решетъчни кофи', 3),
  (gen_random_uuid(), 'Masking & Tape', 'Маскиране и лента', 'painting-masking', 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f', '📏', 'Masking tape, painter''s tape, masking film', 'Хартиено тиксо, бояджийско тиксо, фолио', 4),
  (gen_random_uuid(), 'Drop Cloths & Covers', 'Покривала', 'painting-drop-cloths', 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f', '🎪', 'Canvas drop cloths, plastic sheeting', 'Платнени покривала, найлони', 5),
  (gen_random_uuid(), 'Extension Poles', 'Удължители', 'painting-poles', 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f', '📏', 'Telescoping and fixed extension poles', 'Телескопични и фиксирани удължители', 6),
  (gen_random_uuid(), 'Paint Prep Tools', 'Инструменти за подготовка', 'painting-prep', 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f', '🔧', 'Scrapers, sanders, prep tools', 'Шпакли, шкурки, подготвителни инструменти', 7),
  (gen_random_uuid(), 'Caulking Guns', 'Пистолети за силикон', 'painting-caulking', 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f', '🔧', 'Manual and powered caulking guns', 'Ръчни и електрически пистолети за фугиране', 8),
  (gen_random_uuid(), 'Painting Accessories', 'Бояджийски аксесоари', 'painting-accessories', 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f', '🧰', 'Paint can openers, mixers, accessories', 'Отварачки, бъркалки, аксесоари', 9);

-- =====================================================
-- L2 Categories for Abrasives & Finishing (509ae76f-ed12-4e84-b903-9240f369c546)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Sandpaper & Sheets', 'Шкурка и листове', 'abrasives-sandpaper', '509ae76f-ed12-4e84-b903-9240f369c546', '📄', 'Sandpaper sheets, rolls, and packs', 'Листове шкурка, ролки, пакети', 1),
  (gen_random_uuid(), 'Sanding Discs', 'Шлифовъчни дискове', 'abrasives-discs', '509ae76f-ed12-4e84-b903-9240f369c546', '⭕', 'Hook and loop, PSA sanding discs', 'Велкро и самозалепващи дискове', 2),
  (gen_random_uuid(), 'Sanding Belts', 'Шлифовъчни ленти', 'abrasives-belts', '509ae76f-ed12-4e84-b903-9240f369c546', '🔄', 'Sanding belts for belt sanders', 'Ленти за лентови шлайфи', 3),
  (gen_random_uuid(), 'Grinding Wheels', 'Шлифовъчни кръгове', 'abrasives-grinding-wheels', '509ae76f-ed12-4e84-b903-9240f369c546', '⚙️', 'Bench grinder and angle grinder wheels', 'Кръгове за шмиргел и ъглошлайф', 4),
  (gen_random_uuid(), 'Cut-Off Wheels', 'Отрезни дискове', 'abrasives-cutoff-wheels', '509ae76f-ed12-4e84-b903-9240f369c546', '💥', 'Metal and masonry cut-off wheels', 'Отрезни дискове за метал и бетон', 5),
  (gen_random_uuid(), 'Flap Discs', 'Ламелни дискове', 'abrasives-flap-discs', '509ae76f-ed12-4e84-b903-9240f369c546', '🔄', 'Flap discs for angle grinders', 'Ламелни дискове за ъглошлайф', 6),
  (gen_random_uuid(), 'Wire Brushes & Wheels', 'Телени четки и дискове', 'abrasives-wire-brushes', '509ae76f-ed12-4e84-b903-9240f369c546', '🔧', 'Wire wheels, cup brushes, hand brushes', 'Телени дискове, чашкови четки', 7),
  (gen_random_uuid(), 'Polishing Compounds', 'Полиращи пасти', 'abrasives-polishing', '509ae76f-ed12-4e84-b903-9240f369c546', '✨', 'Buffing and polishing compounds', 'Пасти за полиране и лъскане', 8),
  (gen_random_uuid(), 'Steel Wool & Pads', 'Телена вълна и гъби', 'abrasives-steel-wool', '509ae76f-ed12-4e84-b903-9240f369c546', '🧹', 'Steel wool, scouring pads, hand pads', 'Телена вълна, абразивни гъби', 9);

-- =====================================================
-- L2 Categories for Adhesives & Sealants (dd23ca2d-56f4-47ee-8585-1bda07caaeae)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Construction Adhesives', 'Строителни лепила', 'adhesives-construction', 'dd23ca2d-56f4-47ee-8585-1bda07caaeae', '🔧', 'Heavy duty and construction adhesives', 'Строителни и тежкотоварни лепила', 1),
  (gen_random_uuid(), 'Epoxy Adhesives', 'Епоксидни лепила', 'adhesives-epoxy', 'dd23ca2d-56f4-47ee-8585-1bda07caaeae', '🧪', 'Two-part epoxy adhesives', 'Двукомпонентни епоксидни лепила', 2),
  (gen_random_uuid(), 'Super Glues', 'Моментни лепила', 'adhesives-super-glue', 'dd23ca2d-56f4-47ee-8585-1bda07caaeae', '⚡', 'Cyanoacrylate instant adhesives', 'Цианоакрилатни моментни лепила', 3),
  (gen_random_uuid(), 'Wood Glues', 'Лепила за дърво', 'adhesives-wood-glue', 'dd23ca2d-56f4-47ee-8585-1bda07caaeae', '🪵', 'PVA, polyurethane wood glues', 'PVA, полиуретанови лепила за дърво', 4),
  (gen_random_uuid(), 'Silicone Sealants', 'Силикони', 'adhesives-silicone', 'dd23ca2d-56f4-47ee-8585-1bda07caaeae', '💧', 'Silicone and hybrid sealants', 'Силиконови и хибридни уплътнители', 5),
  (gen_random_uuid(), 'Caulks & Sealers', 'Фуги и уплътнители', 'adhesives-caulks', 'dd23ca2d-56f4-47ee-8585-1bda07caaeae', '🔧', 'Acrylic caulks, sealers', 'Акрилни фуги, уплътнители', 6),
  (gen_random_uuid(), 'Spray Adhesives', 'Лепила на спрей', 'adhesives-spray', 'dd23ca2d-56f4-47ee-8585-1bda07caaeae', '💨', 'Aerosol spray adhesives', 'Аерозолни лепила на спрей', 7),
  (gen_random_uuid(), 'Thread Lockers', 'Фиксатори за резба', 'adhesives-thread-locker', 'dd23ca2d-56f4-47ee-8585-1bda07caaeae', '🔩', 'Thread locking compounds', 'Фиксатори и осигурители за резба', 8),
  (gen_random_uuid(), 'Tapes & Films', 'Лепящи ленти и фолиа', 'adhesives-tapes', 'dd23ca2d-56f4-47ee-8585-1bda07caaeae', '📏', 'Double-sided, mounting, industrial tapes', 'Двустранни, монтажни, индустриални ленти', 9);

-- =====================================================
-- L2 Categories for HVAC Tools (6f86da67-c11d-4d7e-a180-918117feb834)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Refrigerant Tools', 'Инструменти за хладилен агент', 'hvac-refrigerant', '6f86da67-c11d-4d7e-a180-918117feb834', '❄️', 'Refrigerant recovery, charging tools', 'Рекуперация, зареждане на фреон', 1),
  (gen_random_uuid(), 'Manifold Gauges', 'Манометри комплекти', 'hvac-manifold', '6f86da67-c11d-4d7e-a180-918117feb834', '📊', 'Manifold gauge sets and hoses', 'Комплекти манометри и маркучи', 2),
  (gen_random_uuid(), 'Vacuum Pumps', 'Вакуум помпи', 'hvac-vacuum-pumps', '6f86da67-c11d-4d7e-a180-918117feb834', '💨', 'HVAC vacuum pumps', 'Вакуум помпи за ОВК', 3),
  (gen_random_uuid(), 'Leak Detectors', 'Детектори за течове', 'hvac-leak-detectors', '6f86da67-c11d-4d7e-a180-918117feb834', '🔍', 'Refrigerant leak detectors', 'Детектори за изтичане на фреон', 4),
  (gen_random_uuid(), 'Tubing Tools', 'Инструменти за тръби', 'hvac-tubing', '6f86da67-c11d-4d7e-a180-918117feb834', '🔧', 'Tube cutters, benders, flaring tools', 'Резачки, огъвачи, разширители', 5),
  (gen_random_uuid(), 'Duct Tools', 'Инструменти за въздуховоди', 'hvac-duct', '6f86da67-c11d-4d7e-a180-918117feb834', '📦', 'Duct crimpers, seamers, snips', 'Кримпери, фалцмашини, ножици', 6),
  (gen_random_uuid(), 'HVAC Testers', 'ОВК тестери', 'hvac-testers', '6f86da67-c11d-4d7e-a180-918117feb834', '📊', 'Temperature, humidity, airflow meters', 'Термометри, влагомери, анемометри', 7),
  (gen_random_uuid(), 'HVAC Accessories', 'ОВК аксесоари', 'hvac-accessories', '6f86da67-c11d-4d7e-a180-918117feb834', '🧰', 'Caps, cores, HVAC supplies', 'Капачки, вентили, ОВК консумативи', 8)
ON CONFLICT (slug) DO NOTHING;;
