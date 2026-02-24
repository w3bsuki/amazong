-- Restore Office & Business Tools L3 categories

-- Power Tools L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Drills', 'power-drills', 'Бормашини', 1),
  ('Impact Drivers', 'power-impact-drivers', 'Ударни гайковерти', 2),
  ('Circular Saws', 'power-circular-saws', 'Циркуляри', 3),
  ('Jigsaws', 'power-jigsaws', 'Прободни триони', 4),
  ('Reciprocating Saws', 'power-reciprocating', 'Саблени триони', 5),
  ('Sanders', 'power-sanders', 'Шлайфмашини', 6),
  ('Angle Grinders', 'power-grinders', 'Ъглошлайфи', 7),
  ('Routers', 'power-routers', 'Оберфрези', 8),
  ('Planers', 'power-planers', 'Ренде машини', 9),
  ('Miter Saws', 'power-miter-saws', 'Герунзи', 10)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'tools-power'
ON CONFLICT (slug) DO NOTHING;

-- Hand Tools L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Hammers', 'hand-hammers', 'Чукове', 1),
  ('Screwdrivers', 'hand-screwdrivers', 'Отвертки', 2),
  ('Wrenches', 'hand-wrenches', 'Гаечни ключове', 3),
  ('Pliers', 'hand-pliers', 'Клещи', 4),
  ('Hand Saws', 'hand-saws', 'Ръчни триони', 5),
  ('Measuring Tools', 'hand-measuring', 'Измервателни инструменти', 6),
  ('Chisels', 'hand-chisels', 'Длета', 7),
  ('Files', 'hand-files', 'Пили', 8),
  ('Tool Sets', 'hand-tool-sets', 'Комплекти инструменти', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'tools-hand'
ON CONFLICT (slug) DO NOTHING;

-- Office Furniture L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Office Desks', 'office-furn-desks', 'Офис бюра', 1),
  ('Office Chairs', 'office-furn-chairs', 'Офис столове', 2),
  ('Filing Cabinets', 'office-furn-filing', 'Картотеки', 3),
  ('Bookcases', 'office-furn-bookcases', 'Етажерки', 4),
  ('Conference Tables', 'office-furn-conference', 'Конферентни маси', 5),
  ('Reception Desks', 'office-furn-reception', 'Рецепции', 6),
  ('Standing Desks', 'office-furn-standing', 'Стоящи бюра', 7),
  ('Cubicle Systems', 'office-furn-cubicles', 'Офис преградни системи', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'office-furniture'
ON CONFLICT (slug) DO NOTHING;

-- Printers & Scanners L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Laser Printers', 'printers-laser', 'Лазерни принтери', 1),
  ('Inkjet Printers', 'printers-inkjet', 'Мастиленоструйни принтери', 2),
  ('All-in-One Printers', 'printers-allinone', 'Многофункционални принтери', 3),
  ('Photo Printers', 'printers-photo', 'Фотопринтери', 4),
  ('Label Printers', 'printers-label', 'Принтери за етикети', 5),
  ('Document Scanners', 'printers-scanners', 'Скенери', 6),
  ('3D Printers', 'printers-3d', '3D принтери', 7),
  ('Wide Format Printers', 'printers-wide', 'Широкоформатни принтери', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'office-printers'
ON CONFLICT (slug) DO NOTHING;

-- Networking L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Routers', 'network-routers', 'Рутери', 1),
  ('Switches', 'network-switches', 'Суичове', 2),
  ('Modems', 'network-modems', 'Модеми', 3),
  ('Access Points', 'network-access-points', 'Точки за достъп', 4),
  ('Network Cables', 'network-cables', 'Мрежови кабели', 5),
  ('Network Attached Storage', 'network-nas', 'NAS устройства', 6),
  ('Mesh WiFi Systems', 'network-mesh', 'Mesh WiFi системи', 7),
  ('Powerline Adapters', 'network-powerline', 'Powerline адаптери', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'computers-networking'
ON CONFLICT (slug) DO NOTHING;

-- Storage Devices L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('External Hard Drives', 'storage-external-hdd', 'Външни твърди дискове', 1),
  ('External SSDs', 'storage-external-ssd', 'Външни SSD', 2),
  ('USB Flash Drives', 'storage-usb', 'USB флаш памети', 3),
  ('SD Cards', 'storage-sd', 'SD карти', 4),
  ('MicroSD Cards', 'storage-microsd', 'MicroSD карти', 5),
  ('Memory Card Readers', 'storage-readers', 'Четци за карти', 6),
  ('Optical Drives', 'storage-optical', 'Оптични устройства', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'computers-storage'
ON CONFLICT (slug) DO NOTHING;

-- Computer Accessories L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Keyboards', 'comp-acc-keyboards', 'Клавиатури', 1),
  ('Computer Mice', 'comp-acc-mice', 'Компютърни мишки', 2),
  ('Mouse Pads', 'comp-acc-mousepads', 'Пад за мишка', 3),
  ('Webcams', 'comp-acc-webcams', 'Уебкамери', 4),
  ('USB Hubs', 'comp-acc-hubs', 'USB хъбове', 5),
  ('Docking Stations', 'comp-acc-docking', 'Докинг станции', 6),
  ('Laptop Stands', 'comp-acc-stands', 'Стойки за лаптоп', 7),
  ('Monitor Arms', 'comp-acc-monitor-arms', 'Рамена за монитори', 8),
  ('Laptop Bags', 'comp-acc-bags', 'Чанти за лаптоп', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'computers-accessories'
ON CONFLICT (slug) DO NOTHING;;
