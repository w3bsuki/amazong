
-- Phase 3.1.4: Automotive Body, Exterior & Interior L3 Categories

-- Body Parts L3 (parent: body-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Bumpers', 'Fenders', 'Hoods', 'Trunk Lids', 'Door Panels', 'Door Handles', 'Side Mirrors', 'Grilles', 'Spoilers', 'Body Kits', 'Quarter Panels', 'Rocker Panels']),
  unnest(ARRAY['body-bumpers', 'body-fenders', 'body-hoods', 'body-trunk-lids', 'body-door-panels', 'body-door-handles', 'body-mirrors', 'body-grilles', 'body-spoilers', 'body-kits', 'body-quarter-panels', 'body-rocker-panels']),
  (SELECT id FROM categories WHERE slug = 'body-parts'),
  unnest(ARRAY['Брони', 'Калници', 'Капаци', 'Капаци багажник', 'Врати', 'Дръжки', 'Огледала', 'Решетки', 'Спойлери', 'Body kit', 'Калници задни', 'Прагове']),
  '🚗'
ON CONFLICT (slug) DO NOTHING;

-- Exterior Parts L3 (parent: exterior-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Wind Deflectors', 'Bug Shields', 'Rain Guards', 'Mud Flaps', 'Running Boards', 'Nerf Bars', 'Roof Racks', 'Cargo Carriers', 'Bike Racks', 'Ski Racks', 'Tow Hooks']),
  unnest(ARRAY['ext-wind-deflectors', 'ext-bug-shields', 'ext-rain-guards', 'ext-mud-flaps', 'ext-running-boards', 'ext-nerf-bars', 'ext-roof-racks', 'ext-cargo-carriers', 'ext-bike-racks', 'ext-ski-racks', 'ext-tow-hooks']),
  (SELECT id FROM categories WHERE slug = 'exterior-parts'),
  unnest(ARRAY['Ветробрани', 'Дефлектори капак', 'Дефлектори врати', 'Калобрани', 'Степенки', 'Степенки тръбни', 'Багажници покрив', 'Товарни кутии', 'Стойки велосипеди', 'Стойки ски', 'Теглични куки']),
  '🚙'
ON CONFLICT (slug) DO NOTHING;

-- Exterior Accessories L3 (parent: auto-exterior-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Car Covers', 'Windshield Covers', 'Mirror Covers', 'Door Edge Guards', 'Body Side Moldings', 'Antenna Accessories', 'License Plate Frames', 'Emblems & Badges', 'Vinyl Wraps', 'Window Tint']),
  unnest(ARRAY['acc-car-covers', 'acc-windshield-covers', 'acc-mirror-covers', 'acc-door-guards', 'acc-body-moldings', 'acc-antennas', 'acc-license-frames', 'acc-emblems', 'acc-vinyl-wraps', 'acc-window-tint']),
  (SELECT id FROM categories WHERE slug = 'auto-exterior-accessories'),
  unnest(ARRAY['Покривала', 'Покривала стъкло', 'Капаци огледала', 'Протектори врати', 'Листви', 'Антени', 'Рамки номер', 'Емблеми', 'Фолио', 'Тонировка']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Interior Parts L3 (parent: interior-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dashboard Covers', 'Steering Wheels', 'Shift Knobs', 'Pedal Covers', 'Door Panels Interior', 'Headliners', 'Sun Visors', 'Carpet Kits', 'Center Consoles', 'Glove Box Parts']),
  unnest(ARRAY['int-dashboard-covers', 'int-steering-wheels', 'int-shift-knobs', 'int-pedal-covers', 'int-door-panels', 'int-headliners', 'int-sun-visors', 'int-carpet-kits', 'int-center-consoles', 'int-glove-box']),
  (SELECT id FROM categories WHERE slug = 'interior-parts'),
  unnest(ARRAY['Калъфи табло', 'Волани', 'Топки скорости', 'Педали', 'Тапицерия врати', 'Тавани', 'Сенници', 'Килими', 'Конзоли', 'Жабки']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Interior Accessories L3 (parent: auto-interior-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Steering Wheel Covers', 'Seat Belt Covers', 'Sunshades', 'Phone Mounts', 'Cup Holders', 'Trash Cans', 'Storage Organizers', 'Tissue Holders', 'Lumbar Supports', 'Neck Pillows']),
  unnest(ARRAY['int-acc-steering-covers', 'int-acc-seatbelt-covers', 'int-acc-sunshades', 'int-acc-phone-mounts', 'int-acc-cup-holders', 'int-acc-trash', 'int-acc-organizers', 'int-acc-tissue', 'int-acc-lumbar', 'int-acc-neck-pillows']),
  (SELECT id FROM categories WHERE slug = 'auto-interior-accessories'),
  unnest(ARRAY['Калъфи волан', 'Калъфи колани', 'Сенници', 'Стойки телефон', 'Поставки чаши', 'Кошчета', 'Органайзери', 'Кутии кърпички', 'Лумбални опори', 'Възглавници']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Seat Covers L3 (parent: auto-seat-covers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Universal Seat Covers', 'Custom Fit Seat Covers', 'Leather Seat Covers', 'Neoprene Seat Covers', 'Fabric Seat Covers', 'Heated Seat Covers', 'Waterproof Seat Covers', 'Pet Seat Covers', 'Bench Seat Covers']),
  unnest(ARRAY['seats-universal', 'seats-custom', 'seats-leather', 'seats-neoprene', 'seats-fabric', 'seats-heated', 'seats-waterproof', 'seats-pet', 'seats-bench']),
  (SELECT id FROM categories WHERE slug = 'auto-seat-covers'),
  unnest(ARRAY['Универсални', 'По мярка', 'Кожени', 'Неопренови', 'Текстилни', 'С подгряване', 'Водоустойчиви', 'За домашни любимци', 'За пейки']),
  '💺'
ON CONFLICT (slug) DO NOTHING;

-- Floor Mats L3 (parent: auto-mats)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['All-Weather Mats', 'Carpet Mats', 'Rubber Mats', 'Custom Fit Mats', 'Universal Mats', 'Truck Bed Mats', 'Cargo Mats', 'Heavy Duty Mats']),
  unnest(ARRAY['mats-all-weather', 'mats-carpet', 'mats-rubber', 'mats-custom', 'mats-universal', 'mats-truck-bed', 'mats-cargo', 'mats-heavy-duty']),
  (SELECT id FROM categories WHERE slug = 'auto-mats'),
  unnest(ARRAY['Всесезонни', 'Мокетени', 'Гумени', 'По мярка', 'Универсални', 'За каросерия', 'За багажник', 'Тежкотоварни']),
  '🧹'
ON CONFLICT (slug) DO NOTHING;

-- Glass & Windows L3 (parent: auto-glass)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Windshields', 'Rear Windows', 'Side Windows', 'Quarter Glass', 'Sunroof Glass', 'Window Regulators', 'Windshield Wipers', 'Wiper Blades', 'Washer Pumps', 'Defrosters']),
  unnest(ARRAY['glass-windshields', 'glass-rear', 'glass-side', 'glass-quarter', 'glass-sunroof', 'glass-regulators', 'glass-wipers', 'glass-wiper-blades', 'glass-washer-pumps', 'glass-defrosters']),
  (SELECT id FROM categories WHERE slug = 'auto-glass'),
  unnest(ARRAY['Предни стъкла', 'Задни стъкла', 'Странични стъкла', 'Малки стъкла', 'Шибидах стъкла', 'Стъклоповдигачи', 'Чистачки', 'Перки', 'Помпи течност', 'Подгрев стъкло']),
  '🪟'
ON CONFLICT (slug) DO NOTHING;
;
