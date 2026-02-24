
-- KIDS CATEGORY IMPROVEMENT - PHASE 3C: Safety & Nursery Attributes
-- ================================================================

-- Baby Safety Attributes (72b7e068-0259-4037-8aa8-8d8f733ec83e)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('72b7e068-0259-4037-8aa8-8d8f733ec83e', 'Monitor Type', 'Тип монитор', 'select', false, true,
 '["Audio", "Video", "Smart/WiFi", "Movement/Breathing"]'::jsonb,
 '["Аудио", "Видео", "Смарт/WiFi", "Движение/Дишане"]'::jsonb, 1),
('72b7e068-0259-4037-8aa8-8d8f733ec83e', 'Monitor Range', 'Обхват', 'select', false, true,
 '["Up to 50m", "50-150m", "150-300m", "300m+", "WiFi/Unlimited"]'::jsonb,
 '["До 50м", "50-150м", "150-300м", "300м+", "WiFi/Неограничен"]'::jsonb, 2),
('72b7e068-0259-4037-8aa8-8d8f733ec83e', 'Night Vision', 'Нощно виждане', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 3),
('72b7e068-0259-4037-8aa8-8d8f733ec83e', 'Two-Way Audio', 'Двупосочно аудио', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 4),
('72b7e068-0259-4037-8aa8-8d8f733ec83e', 'Battery Operated', 'На батерии', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5);

-- Nursery Attributes (ff55aca1-5110-429a-9f15-42eba84da9d7)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('ff55aca1-5110-429a-9f15-42eba84da9d7', 'Crib Type', 'Тип креватче', 'select', false, true,
 '["Standard", "Convertible (4-in-1)", "Mini", "Portable", "Bassinet", "Co-Sleeper"]'::jsonb,
 '["Стандартно", "Конвертируемо (4-в-1)", "Мини", "Преносимо", "Кошче", "Приставка"]'::jsonb, 1),
('ff55aca1-5110-429a-9f15-42eba84da9d7', 'Mattress Size', 'Размер матрак', 'select', false, true,
 '["Standard Crib (60x120cm)", "Mini Crib (38x89cm)", "Bassinet", "Toddler"]'::jsonb,
 '["Стандартен (60x120см)", "Мини (38x89см)", "За кошче", "За малко дете"]'::jsonb, 2),
('ff55aca1-5110-429a-9f15-42eba84da9d7', 'Mattress Firmness', 'Твърдост матрак', 'select', false, true,
 '["Firm (Infant)", "Medium", "Dual-Sided"]'::jsonb,
 '["Твърд (Бебе)", "Среден", "Двустранен"]'::jsonb, 3),
('ff55aca1-5110-429a-9f15-42eba84da9d7', 'Material', 'Материал', 'select', false, true,
 '["Wood", "Metal", "MDF", "Rattan", "Plastic"]'::jsonb,
 '["Дърво", "Метал", "MDF", "Ратан", "Пластмаса"]'::jsonb, 4),
('ff55aca1-5110-429a-9f15-42eba84da9d7', 'Convertible', 'Трансформиращо се', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5);
;
