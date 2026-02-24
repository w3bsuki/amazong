
-- Phase 3.4.2: Kids L3 Categories - Baby Gear & Safety

-- Diaper Bags L3 (parent: baby-diaper-bags)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Backpack Diaper Bags', 'Tote Diaper Bags', 'Messenger Bags', 'Dad Diaper Bags', 'Convertible Bags']),
  unnest(ARRAY['dbag-backpack', 'dbag-tote', 'dbag-messenger', 'dbag-dad', 'dbag-convert']),
  (SELECT id FROM categories WHERE slug = 'baby-diaper-bags'),
  unnest(ARRAY['Раници', 'Тоут чанти', 'Месинджър', 'За татковци', 'Трансформиращи се']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Travel Accessories L3 (parent: gear-travel-acc)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Travel Beds', 'Car Seat Covers', 'Stroller Bags', 'Car Mirrors', 'Window Shades', 'Travel Trays']),
  unnest(ARRAY['travelacc-bed', 'travelacc-cover', 'travelacc-bag', 'travelacc-mirror', 'travelacc-shade', 'travelacc-tray']),
  (SELECT id FROM categories WHERE slug = 'gear-travel-acc'),
  unnest(ARRAY['Пътни легла', 'Калъфи за столчета', 'Чанти за колички', 'Огледала', 'Сенници', 'Табли']),
  '🧳'
ON CONFLICT (slug) DO NOTHING;

-- Baby Gates L3 (parent: baby-gates)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pressure Mounted Gates', 'Hardware Mounted Gates', 'Retractable Gates', 'Extra Wide Gates', 'Outdoor Gates', 'Play Yard Gates']),
  unnest(ARRAY['gate-pressure', 'gate-hardware', 'gate-retract', 'gate-wide', 'gate-outdoor', 'gate-playyard']),
  (SELECT id FROM categories WHERE slug = 'baby-gates'),
  unnest(ARRAY['С натиск', 'С монтаж', 'Прибиращи се', 'Широки', 'За навън', 'За кошара']),
  '🚧'
ON CONFLICT (slug) DO NOTHING;

-- Baby Grooming L3 (parent: safety-grooming)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nail Clippers', 'Hair Brushes', 'Baby Shampoo', 'Baby Lotion', 'Baby Oil', 'Grooming Kits']),
  unnest(ARRAY['groom-nails', 'groom-brush', 'groom-shampoo', 'groom-lotion', 'groom-oil', 'groom-kit']),
  (SELECT id FROM categories WHERE slug = 'safety-grooming'),
  unnest(ARRAY['Ноктрезачки', 'Четки за коса', 'Шампоани', 'Лосиони', 'Олио', 'Комплекти']),
  '✂️'
ON CONFLICT (slug) DO NOTHING;

-- Baby Monitors L3 (parent: safety-monitors)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Video Monitors', 'Audio Monitors', 'Movement Monitors', 'Smart Monitors', 'Wi-Fi Monitors', 'Wearable Monitors']),
  unnest(ARRAY['monitor-video', 'monitor-audio', 'monitor-movement', 'monitor-smart', 'monitor-wifi', 'monitor-wear']),
  (SELECT id FROM categories WHERE slug = 'safety-monitors'),
  unnest(ARRAY['Видео', 'Аудио', 'За движение', 'Смарт', 'Wi-Fi', 'Носими']),
  '📹'
ON CONFLICT (slug) DO NOTHING;

-- Cabinet Locks L3 (parent: cabinet-locks)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Magnetic Locks', 'Adhesive Locks', 'Spring Locks', 'Drawer Locks', 'Refrigerator Locks']),
  unnest(ARRAY['lock-magnetic', 'lock-adhesive', 'lock-spring', 'lock-drawer', 'lock-fridge']),
  (SELECT id FROM categories WHERE slug = 'cabinet-locks'),
  unnest(ARRAY['Магнитни', 'Лепящи', 'Пружинни', 'За чекмеджета', 'За хладилник']),
  '🔒'
ON CONFLICT (slug) DO NOTHING;

-- Childproofing L3 (parent: safety-childproof)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Door Knob Covers', 'Stove Guards', 'Furniture Anchors', 'Window Guards', 'Toilet Locks', 'Edge Protectors']),
  unnest(ARRAY['childproof-door', 'childproof-stove', 'childproof-anchor', 'childproof-window', 'childproof-toilet', 'childproof-edge']),
  (SELECT id FROM categories WHERE slug = 'safety-childproof'),
  unnest(ARRAY['За дръжки', 'За печка', 'Укрепващи', 'За прозорци', 'За тоалетна', 'За ръбове']),
  '🛡️'
ON CONFLICT (slug) DO NOTHING;

-- Corner Guards L3 (parent: corner-guards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Foam Corner Guards', 'Silicone Guards', 'Table Edge Guards', 'Fireplace Guards']),
  unnest(ARRAY['corner-foam', 'corner-silicone', 'corner-table', 'corner-fireplace']),
  (SELECT id FROM categories WHERE slug = 'corner-guards'),
  unnest(ARRAY['Пенести', 'Силиконови', 'За маси', 'За камина']),
  '📐'
ON CONFLICT (slug) DO NOTHING;

-- Health & Wellness L3 (parent: safety-health)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Thermometers', 'Nasal Aspirators', 'Humidifiers', 'Vaporizers', 'Medicine Dispensers', 'First Aid Kits']),
  unnest(ARRAY['health-thermo', 'health-aspirator', 'health-humid', 'health-vapor', 'health-dispenser', 'health-firstaid']),
  (SELECT id FROM categories WHERE slug = 'safety-health'),
  unnest(ARRAY['Термометри', 'Аспиратори', 'Овлажнители', 'Вапоризатори', 'Дозатори', 'Първа помощ']),
  '🏥'
ON CONFLICT (slug) DO NOTHING;

-- Outlet Covers L3 (parent: outlet-covers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Plug Covers', 'Outlet Plates', 'Sliding Covers', 'Box Covers']),
  unnest(ARRAY['outlet-plug', 'outlet-plate', 'outlet-slide', 'outlet-box']),
  (SELECT id FROM categories WHERE slug = 'outlet-covers'),
  unnest(ARRAY['Капачки', 'Пластини', 'Плъзгащи', 'Кутии']),
  '🔌'
ON CONFLICT (slug) DO NOTHING;

-- Sun & Insect Protection L3 (parent: safety-sun)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Baby Sunscreen', 'Sun Hats', 'Sunglasses', 'Mosquito Nets', 'Bug Repellent', 'UV Suits']),
  unnest(ARRAY['sun-screen', 'sun-hat', 'sun-glasses', 'sun-net', 'sun-repel', 'sun-suits']),
  (SELECT id FROM categories WHERE slug = 'safety-sun'),
  unnest(ARRAY['Слънцезащитен крем', 'Шапки', 'Очила', 'Комарници', 'Репеленти', 'UV костюми']),
  '☀️'
ON CONFLICT (slug) DO NOTHING;
;
