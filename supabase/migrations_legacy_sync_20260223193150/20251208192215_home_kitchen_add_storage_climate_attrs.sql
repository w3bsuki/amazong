
-- Storage & Organization attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Condition
('bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Condition', 'Състояние', 'select', true, true,
 '["New", "Like New", "Good", "Used"]'::jsonb,
 '["Ново", "Като ново", "Добро", "Използвано"]'::jsonb, 1),

-- Material
('bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Material', 'Материал', 'select', false, true,
 '["Plastic", "Wood", "Metal", "Fabric", "Wicker/Rattan", "Cardboard", "Canvas"]'::jsonb,
 '["Пластмаса", "Дърво", "Метал", "Плат", "Ракита/Ратан", "Картон", "Платно"]'::jsonb, 10),

-- Stackable
('bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Stackable', 'За подреждане', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 11),

-- Has Wheels
('bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Has Wheels', 'С колела', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 12),

-- Waterproof
('bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Waterproof', 'Водоустойчив', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 13),

-- Size
('bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Size', 'Размер', 'select', false, true,
 '["Small", "Medium", "Large", "Extra Large", "Custom"]'::jsonb,
 '["Малък", "Среден", "Голям", "Много голям", "По поръчка"]'::jsonb, 14),

-- Storage Type
('bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Storage Type', 'Тип съхранение', 'select', false, true,
 '["Bins/Boxes", "Baskets", "Shelving", "Drawers", "Hooks/Hangers", "Racks", "Bags/Pouches"]'::jsonb,
 '["Кутии", "Кошници", "Рафтове", "Чекмеджета", "Куки/Закачалки", "Стелажи", "Торби/Калъфи"]'::jsonb, 15),

-- Room
('bc1b50d1-708a-48e6-924a-7b1c4195ec63', 'Room', 'Стая', 'multiselect', false, true,
 '["Bedroom", "Kitchen", "Bathroom", "Living Room", "Office", "Garage", "Closet", "Kids Room"]'::jsonb,
 '["Спалня", "Кухня", "Баня", "Хол", "Офис", "Гараж", "Гардероб", "Детска стая"]'::jsonb, 16);

-- Climate Control attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Condition
('f82b03cc-4581-44ef-adbb-3419575a8ae2', 'Condition', 'Състояние', 'select', true, true,
 '["New", "Like New", "Good", "Used"]'::jsonb,
 '["Ново", "Като ново", "Добро", "Използвано"]'::jsonb, 1),

-- BTU
('f82b03cc-4581-44ef-adbb-3419575a8ae2', 'BTU Rating', 'BTU мощност', 'select', false, true,
 '["Under 5000", "5000-8000", "8000-12000", "12000-18000", "18000+"]'::jsonb,
 '["Под 5000", "5000-8000", "8000-12000", "12000-18000", "18000+"]'::jsonb, 10),

-- Room Size Coverage
('f82b03cc-4581-44ef-adbb-3419575a8ae2', 'Room Size Coverage', 'Покритие на стая', 'select', false, true,
 '["Small (up to 15m²)", "Medium (15-25m²)", "Large (25-40m²)", "Very Large (40m²+)"]'::jsonb,
 '["Малка (до 15м²)", "Средна (15-25м²)", "Голяма (25-40м²)", "Много голяма (40м²+)"]'::jsonb, 11),

-- Energy Rating
('f82b03cc-4581-44ef-adbb-3419575a8ae2', 'Energy Rating', 'Енергиен клас', 'select', false, true,
 '["A+++", "A++", "A+", "A", "B", "C", "Not Rated"]'::jsonb,
 '["A+++", "A++", "A+", "A", "B", "C", "Без оценка"]'::jsonb, 12),

-- Noise Level
('f82b03cc-4581-44ef-adbb-3419575a8ae2', 'Noise Level', 'Ниво на шум', 'select', false, true,
 '["Silent (Under 30dB)", "Quiet (30-40dB)", "Moderate (40-50dB)", "Loud (50dB+)"]'::jsonb,
 '["Безшумен (под 30dB)", "Тих (30-40dB)", "Умерен (40-50dB)", "Шумен (50dB+)"]'::jsonb, 13),

-- Smart Compatible
('f82b03cc-4581-44ef-adbb-3419575a8ae2', 'Smart Compatible', 'Смарт съвместим', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 14),

-- Climate Type
('f82b03cc-4581-44ef-adbb-3419575a8ae2', 'Climate Type', 'Тип климатизация', 'select', false, true,
 '["Cooling Only", "Heating Only", "Both Heating & Cooling", "Humidifier", "Dehumidifier", "Air Purifier", "Fan"]'::jsonb,
 '["Само охлаждане", "Само отопление", "Охлаждане и отопление", "Овлажнител", "Изсушител", "Пречиствател", "Вентилатор"]'::jsonb, 15),

-- Installation Type
('f82b03cc-4581-44ef-adbb-3419575a8ae2', 'Installation Type', 'Тип монтаж', 'select', false, true,
 '["Portable/Freestanding", "Window Mount", "Wall Mount", "Split System", "Central/Ducted"]'::jsonb,
 '["Преносим/Свободно стоящ", "На прозорец", "Стенен", "Сплит система", "Централен/С канали"]'::jsonb, 16);
;
