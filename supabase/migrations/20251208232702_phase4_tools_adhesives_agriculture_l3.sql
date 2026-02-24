-- Phase 4: Tools & Industrial - Adhesives & Sealants + Agriculture L3 categories

DO $$
DECLARE
  -- Adhesives L2 IDs
  caulks_id UUID := 'a71a032d-cc5a-40a9-8661-4d26ff51c911';
  construction_id UUID := 'ac75cfd5-53f4-4322-a20a-7aec6b2c7ccf';
  epoxy_id UUID := '1c2b0170-928c-4afc-b821-114ac705d345';
  silicone_id UUID := '7e62c674-b8a1-4466-8c4b-d22f3cb49449';
  spray_id UUID := '8a6acc6c-21e6-4507-8327-be7710bf56de';
  super_glue_id UUID := 'f87a2bff-7310-4ebb-ada3-b729865583a6';
  tapes_id UUID := '1bb1dd8d-d61b-4969-b070-efcf96cd3920';
  thread_locker_id UUID := '2be61872-5982-4d60-be4f-41b2319e75fb';
  wood_glue_id UUID := 'c8edb94f-c4a8-4d7f-bf08-5355e387b950';
  -- Agriculture L2 IDs
  crop_id UUID := '0b39c415-5005-46e5-b19e-70714fe1c314';
  farm_equip_id UUID := '1eed96a5-13ae-4566-aa1c-652f4cccdcab';
  farm_supplies_id UUID := 'a1c175fd-35f7-471b-b5ee-6067fc0d13ba';
  livestock_id UUID := 'd864a8ae-2265-4e1b-a2bf-21b1b61fd113';
BEGIN
  -- Caulks & Sealers L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Acrylic Caulk', 'caulk-acrylic', caulks_id, 'Акрилен силикон', '🔧', 1),
    ('Silicone Caulk', 'caulk-silicone', caulks_id, 'Силиконов уплътнител', '🔧', 2),
    ('Polyurethane Caulk', 'caulk-polyurethane', caulks_id, 'Полиуретанов уплътнител', '🔧', 3),
    ('Latex Caulk', 'caulk-latex', caulks_id, 'Латексов уплътнител', '🔧', 4),
    ('Fire Stop Caulk', 'caulk-fire-stop', caulks_id, 'Огнеустойчив уплътнител', '🔧', 5),
    ('Waterproof Caulk', 'caulk-waterproof', caulks_id, 'Водоустойчив уплътнител', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Construction Adhesives L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Heavy Duty Adhesives', 'adhesive-heavy-duty', construction_id, 'Тежкотоварни лепила', '🔧', 1),
    ('Panel Adhesives', 'adhesive-panel', construction_id, 'Лепила за панели', '🔧', 2),
    ('Flooring Adhesives', 'adhesive-flooring', construction_id, 'Лепила за подове', '🔧', 3),
    ('Drywall Adhesives', 'adhesive-drywall', construction_id, 'Лепила за гипскартон', '🔧', 4),
    ('Subfloor Adhesives', 'adhesive-subfloor', construction_id, 'Лепила за под-основа', '🔧', 5),
    ('Foam Board Adhesives', 'adhesive-foam-board', construction_id, 'Лепила за пяна', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Epoxy Adhesives L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('5-Minute Epoxy', 'epoxy-5-minute', epoxy_id, '5-минутно епоксидно', '🔧', 1),
    ('30-Minute Epoxy', 'epoxy-30-minute', epoxy_id, '30-минутно епоксидно', '🔧', 2),
    ('Structural Epoxy', 'epoxy-structural', epoxy_id, 'Структурно епоксидно', '🔧', 3),
    ('Marine Epoxy', 'epoxy-marine', epoxy_id, 'Морско епоксидно', '🔧', 4),
    ('Metal Epoxy', 'epoxy-metal', epoxy_id, 'Епоксидно за метал', '🔧', 5),
    ('Clear Epoxy', 'epoxy-clear', epoxy_id, 'Прозрачно епоксидно', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Silicone Sealants L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Kitchen & Bath Silicone', 'silicone-kitchen-bath', silicone_id, 'Силикон за кухня и баня', '🔧', 1),
    ('Aquarium Silicone', 'silicone-aquarium', silicone_id, 'Силикон за аквариуми', '🔧', 2),
    ('High-Temp Silicone', 'silicone-high-temp', silicone_id, 'Високотемпературен силикон', '🔧', 3),
    ('RTV Silicone', 'silicone-rtv', silicone_id, 'RTV силикон', '🔧', 4),
    ('Neutral Cure Silicone', 'silicone-neutral', silicone_id, 'Неутрален силикон', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Spray Adhesives L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('General Purpose Spray', 'spray-general', spray_id, 'Универсален спрей', '🔧', 1),
    ('Heavy Duty Spray', 'spray-heavy-duty', spray_id, 'Тежкотоварен спрей', '🔧', 2),
    ('Repositionable Spray', 'spray-repositionable', spray_id, 'Репозициониращ спрей', '🔧', 3),
    ('Fabric Spray', 'spray-fabric', spray_id, 'Спрей за тъкани', '🔧', 4),
    ('Photo Mount Spray', 'spray-photo-mount', spray_id, 'Спрей за снимки', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Super Glues L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Liquid Super Glue', 'superglue-liquid', super_glue_id, 'Течно супер лепило', '🔧', 1),
    ('Gel Super Glue', 'superglue-gel', super_glue_id, 'Гел супер лепило', '🔧', 2),
    ('Industrial Super Glue', 'superglue-industrial', super_glue_id, 'Индустриално супер лепило', '🔧', 3),
    ('Flexible Super Glue', 'superglue-flexible', super_glue_id, 'Гъвкаво супер лепило', '🔧', 4),
    ('Brush-On Super Glue', 'superglue-brush-on', super_glue_id, 'Супер лепило с четка', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Tapes & Films L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Double-Sided Tape', 'tape-double-sided', tapes_id, 'Двустранна лепенка', '📦', 1),
    ('Duct Tape', 'tape-duct', tapes_id, 'Тиксо за въздуховоди', '📦', 2),
    ('Electrical Tape', 'tape-electrical', tapes_id, 'Изолирбанд', '📦', 3),
    ('Masking Tape', 'tape-masking', tapes_id, 'Маскираща лента', '📦', 4),
    ('Packing Tape', 'tape-packing', tapes_id, 'Опаковъчна лента', '📦', 5),
    ('Foam Tape', 'tape-foam', tapes_id, 'Пенеста лента', '📦', 6),
    ('Stretch Film', 'film-stretch', tapes_id, 'Стреч фолио', '📦', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Thread Lockers L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Blue Thread Locker', 'threadlock-blue', thread_locker_id, 'Син фиксатор за резби', '🔧', 1),
    ('Red Thread Locker', 'threadlock-red', thread_locker_id, 'Червен фиксатор за резби', '🔧', 2),
    ('Green Thread Locker', 'threadlock-green', thread_locker_id, 'Зелен фиксатор за резби', '🔧', 3),
    ('Purple Thread Locker', 'threadlock-purple', thread_locker_id, 'Виолетов фиксатор за резби', '🔧', 4),
    ('Retaining Compounds', 'threadlock-retaining', thread_locker_id, 'Фиксиращи съединения', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Wood Glues L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('PVA Wood Glue', 'woodglue-pva', wood_glue_id, 'PVA лепило за дърво', '🪵', 1),
    ('Polyurethane Wood Glue', 'woodglue-polyurethane', wood_glue_id, 'Полиуретаново лепило', '🪵', 2),
    ('Hide Glue', 'woodglue-hide', wood_glue_id, 'Туткал', '🪵', 3),
    ('Waterproof Wood Glue', 'woodglue-waterproof', wood_glue_id, 'Водоустойчиво лепило', '🪵', 4),
    ('Exterior Wood Glue', 'woodglue-exterior', wood_glue_id, 'Лепило за външна употреба', '🪵', 5),
    ('Instant Wood Glue', 'woodglue-instant', wood_glue_id, 'Моментно лепило за дърво', '🪵', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Crop Supplies L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Seeds & Planting', 'crop-seeds', crop_id, 'Семена и посадъчен материал', '🌱', 1),
    ('Fertilizers', 'crop-fertilizers', crop_id, 'Торове', '🌱', 2),
    ('Pesticides', 'crop-pesticides', crop_id, 'Пестициди', '🌱', 3),
    ('Herbicides', 'crop-herbicides', crop_id, 'Хербициди', '🌱', 4),
    ('Irrigation Supplies', 'crop-irrigation', crop_id, 'Напоителни материали', '🌱', 5),
    ('Soil Amendments', 'crop-soil', crop_id, 'Подобрители на почва', '🌱', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Farm Equipment L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Tractors', 'farm-tractors', farm_equip_id, 'Трактори', '🚜', 1),
    ('Tillers & Cultivators', 'farm-tillers', farm_equip_id, 'Култиватори', '🚜', 2),
    ('Harvesters', 'farm-harvesters', farm_equip_id, 'Комбайни', '🚜', 3),
    ('Plows & Seeders', 'farm-plows', farm_equip_id, 'Плугове и сеялки', '🚜', 4),
    ('Sprayers', 'farm-sprayers', farm_equip_id, 'Пръскачки', '🚜', 5),
    ('Balers', 'farm-balers', farm_equip_id, 'Балировачки', '🚜', 6),
    ('ATVs & UTVs', 'farm-atvs', farm_equip_id, 'ATVs и UTVs', '🚜', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Farm Supplies L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Fencing & Gates', 'farm-fencing', farm_supplies_id, 'Огради и порти', '🏡', 1),
    ('Barns & Storage', 'farm-barns', farm_supplies_id, 'Обори и складове', '🏡', 2),
    ('Water Systems', 'farm-water', farm_supplies_id, 'Водни системи', '🏡', 3),
    ('Power & Generators', 'farm-power', farm_supplies_id, 'Генератори', '🏡', 4),
    ('Farm Tools', 'farm-tools', farm_supplies_id, 'Фермерски инструменти', '🏡', 5),
    ('Workwear & Safety', 'farm-workwear', farm_supplies_id, 'Работно облекло', '🏡', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Livestock Supplies L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Animal Feed', 'livestock-feed', livestock_id, 'Фураж', '🐄', 1),
    ('Animal Health', 'livestock-health', livestock_id, 'Здраве на животните', '🐄', 2),
    ('Handling Equipment', 'livestock-handling', livestock_id, 'Оборудване за работа с животни', '🐄', 3),
    ('Feeders & Waterers', 'livestock-feeders', livestock_id, 'Хранилки и поилки', '🐄', 4),
    ('Grooming & Care', 'livestock-grooming', livestock_id, 'Грижа за животни', '🐄', 5),
    ('Breeding Supplies', 'livestock-breeding', livestock_id, 'Принадлежности за развъждане', '🐄', 6),
    ('Poultry Supplies', 'livestock-poultry', livestock_id, 'Птицевъдни принадлежности', '🐔', 7)
  ON CONFLICT (slug) DO NOTHING;

END $$;;
