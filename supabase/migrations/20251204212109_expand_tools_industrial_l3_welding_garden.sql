-- =====================================================
-- L3 Categories for Welding Subcategories
-- =====================================================

-- MIG Welders (ac1b176f-d1e9-427f-ac8e-97e9f1a5959b)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), '110V MIG Welders', '110V MIG заварки', 'mig-110v', 'ac1b176f-d1e9-427f-ac8e-97e9f1a5959b', '⚡', 1),
  (gen_random_uuid(), '220V MIG Welders', '220V MIG заварки', 'mig-220v', 'ac1b176f-d1e9-427f-ac8e-97e9f1a5959b', '💪', 2),
  (gen_random_uuid(), 'Flux Core Welders', 'Самозащитни заварки', 'mig-flux-core', 'ac1b176f-d1e9-427f-ac8e-97e9f1a5959b', '🔥', 3),
  (gen_random_uuid(), 'Spool Guns', 'Пистолети със шпула', 'mig-spool-gun', 'ac1b176f-d1e9-427f-ac8e-97e9f1a5959b', '🎯', 4);

-- TIG Welders (aebfa75d-0dae-4355-b777-11d89b7cc9d7)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'AC/DC TIG Welders', 'AC/DC TIG заварки', 'tig-acdc', 'aebfa75d-0dae-4355-b777-11d89b7cc9d7', '⚡', 1),
  (gen_random_uuid(), 'DC TIG Welders', 'DC TIG заварки', 'tig-dc', 'aebfa75d-0dae-4355-b777-11d89b7cc9d7', '🔌', 2),
  (gen_random_uuid(), 'TIG Torches', 'TIG горелки', 'tig-torches', 'aebfa75d-0dae-4355-b777-11d89b7cc9d7', '🔥', 3);

-- Welding Helmets (1ab0f132-3f35-4563-83b0-30ff9dffed10)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'Auto-Darkening Helmets', 'Автоматични маски', 'helmets-auto-darkening', '1ab0f132-3f35-4563-83b0-30ff9dffed10', '🥽', 1),
  (gen_random_uuid(), 'Passive Helmets', 'Пасивни маски', 'helmets-passive', '1ab0f132-3f35-4563-83b0-30ff9dffed10', '⛑️', 2),
  (gen_random_uuid(), 'PAPR Helmets', 'Маски с филтриране', 'helmets-papr', '1ab0f132-3f35-4563-83b0-30ff9dffed10', '😷', 3),
  (gen_random_uuid(), 'Helmet Lenses', 'Лещи за маски', 'helmets-lenses', '1ab0f132-3f35-4563-83b0-30ff9dffed10', '👓', 4);

-- Soldering Stations (c04237b1-302a-439e-a80d-4287539cb358)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'Digital Soldering Stations', 'Дигитални поялни станции', 'soldering-digital', 'c04237b1-302a-439e-a80d-4287539cb358', '🔢', 1),
  (gen_random_uuid(), 'Soldering Irons', 'Поялници', 'soldering-irons', 'c04237b1-302a-439e-a80d-4287539cb358', '🔥', 2),
  (gen_random_uuid(), 'Soldering Gun', 'Поялни пистолети', 'soldering-guns', 'c04237b1-302a-439e-a80d-4287539cb358', '🔫', 3),
  (gen_random_uuid(), 'Desoldering Tools', 'Инструменти за разпояване', 'soldering-desoldering', 'c04237b1-302a-439e-a80d-4287539cb358', '🔧', 4),
  (gen_random_uuid(), 'Soldering Tips', 'Върхове за поялници', 'soldering-tips', 'c04237b1-302a-439e-a80d-4287539cb358', '📌', 5);

-- =====================================================
-- L3 Categories for Garden & Outdoor Power Equipment
-- =====================================================

-- Get L2 IDs first from garden-outdoor-power (05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19)
-- Lawn Mowers
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Push Mowers', 'Ръчни косачки', 'mowers-push', id, '🚶', 1 FROM categories WHERE slug = 'garden-lawn-mowers'
UNION ALL
SELECT gen_random_uuid(), 'Self-Propelled Mowers', 'Самоходни косачки', 'mowers-self-propelled', id, '🚗', 2 FROM categories WHERE slug = 'garden-lawn-mowers'
UNION ALL
SELECT gen_random_uuid(), 'Riding Mowers', 'Тракторни косачки', 'mowers-riding', id, '🚜', 3 FROM categories WHERE slug = 'garden-lawn-mowers'
UNION ALL
SELECT gen_random_uuid(), 'Zero-Turn Mowers', 'Zero-Turn косачки', 'mowers-zero-turn', id, '↩️', 4 FROM categories WHERE slug = 'garden-lawn-mowers'
UNION ALL
SELECT gen_random_uuid(), 'Robot Mowers', 'Роботизирани косачки', 'mowers-robot', id, '🤖', 5 FROM categories WHERE slug = 'garden-lawn-mowers'
UNION ALL
SELECT gen_random_uuid(), 'Reel Mowers', 'Барабанни косачки', 'mowers-reel', id, '🔄', 6 FROM categories WHERE slug = 'garden-lawn-mowers';

-- Chainsaws
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Gas Chainsaws', 'Бензинови резачки', 'chainsaws-gas', id, '⛽', 1 FROM categories WHERE slug = 'garden-chainsaws'
UNION ALL
SELECT gen_random_uuid(), 'Electric Chainsaws', 'Електрически резачки', 'chainsaws-electric', id, '🔌', 2 FROM categories WHERE slug = 'garden-chainsaws'
UNION ALL
SELECT gen_random_uuid(), 'Battery Chainsaws', 'Акумулаторни резачки', 'chainsaws-battery', id, '🔋', 3 FROM categories WHERE slug = 'garden-chainsaws'
UNION ALL
SELECT gen_random_uuid(), 'Chainsaw Bars & Chains', 'Шини и вериги', 'chainsaws-parts', id, '⛓️', 4 FROM categories WHERE slug = 'garden-chainsaws'
UNION ALL
SELECT gen_random_uuid(), 'Pole Saws', 'Резачки на прът', 'chainsaws-pole', id, '📏', 5 FROM categories WHERE slug = 'garden-chainsaws';

-- Pressure Washers
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Electric Pressure Washers', 'Електрически водоструйки', 'pressure-electric', id, '🔌', 1 FROM categories WHERE slug = 'garden-pressure-washers'
UNION ALL
SELECT gen_random_uuid(), 'Gas Pressure Washers', 'Бензинови водоструйки', 'pressure-gas', id, '⛽', 2 FROM categories WHERE slug = 'garden-pressure-washers'
UNION ALL
SELECT gen_random_uuid(), 'Commercial Pressure Washers', 'Професионални водоструйки', 'pressure-commercial', id, '🏭', 3 FROM categories WHERE slug = 'garden-pressure-washers'
UNION ALL
SELECT gen_random_uuid(), 'Pressure Washer Accessories', 'Аксесоари за водоструйки', 'pressure-accessories', id, '🧰', 4 FROM categories WHERE slug = 'garden-pressure-washers'
ON CONFLICT (slug) DO NOTHING;;
