-- =====================================================
-- L2 Categories for Welding & Soldering (65d5cf4c-2072-477a-82da-1ec72330d7a9)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'MIG Welders', 'MIG заваръчни апарати', 'welding-mig', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '🔥', 'MIG/MAG welding machines', 'MIG/MAG заваръчни машини', 1),
  (gen_random_uuid(), 'TIG Welders', 'TIG заваръчни апарати', 'welding-tig', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '🔥', 'TIG/GTAW welding machines', 'TIG/GTAW заваръчни машини', 2),
  (gen_random_uuid(), 'Stick/Arc Welders', 'Електродъгови заварки', 'welding-stick', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '⚡', 'Stick/MMA/SMAW welding machines', 'Електродъгови заваръчни апарати', 3),
  (gen_random_uuid(), 'Multi-Process Welders', 'Многофункционални заварки', 'welding-multi', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '🔧', 'Multi-process welding machines', 'Многофункционални заваръчни апарати', 4),
  (gen_random_uuid(), 'Plasma Cutters', 'Плазмени резачки', 'welding-plasma', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '💥', 'Plasma cutting machines', 'Машини за плазмено рязане', 5),
  (gen_random_uuid(), 'Spot Welders', 'Точкови заварки', 'welding-spot', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '⚡', 'Spot welding machines', 'Точкови заваръчни машини', 6),
  (gen_random_uuid(), 'Soldering Stations', 'Поялни станции', 'welding-soldering-stations', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '🔥', 'Soldering irons and stations', 'Поялници и поялни станции', 7),
  (gen_random_uuid(), 'Brazing Equipment', 'Твърдо запояване', 'welding-brazing', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '🔥', 'Brazing torches and equipment', 'Горелки за твърдо запояване', 8),
  (gen_random_uuid(), 'Welding Helmets & Masks', 'Заваръчни маски', 'welding-helmets', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '🥽', 'Auto-darkening helmets and shields', 'Автоматични заваръчни маски', 9),
  (gen_random_uuid(), 'Welding Wire & Rods', 'Заваръчна тел и електроди', 'welding-consumables', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '🔧', 'Welding wire, rods and electrodes', 'Заваръчна тел, пръти и електроди', 10),
  (gen_random_uuid(), 'Welding Accessories', 'Заваръчни аксесоари', 'welding-accessories', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '🧰', 'Clamps, magnets, tables and accessories', 'Стяги, магнити, маси и аксесоари', 11),
  (gen_random_uuid(), 'Gas & Regulators', 'Газ и редуктори', 'welding-gas', '65d5cf4c-2072-477a-82da-1ec72330d7a9', '⛽', 'Welding gas, cylinders and regulators', 'Заваръчен газ, бутилки и редуктори', 12)
ON CONFLICT (slug) DO NOTHING;;
