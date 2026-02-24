
-- Furniture - add missing useful attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Weight Capacity
('a30c2687-c797-46c8-b140-b41e0f128de7', 'Weight Capacity', 'Капацитет тегло', 'select', false, true,
 '["Light (Under 50kg)", "Standard (50-100kg)", "Heavy Duty (100-200kg)", "Extra Heavy (200kg+)"]'::jsonb,
 '["Лек (под 50кг)", "Стандартен (50-100кг)", "Тежък (100-200кг)", "Много тежък (200кг+)"]'::jsonb, 17),

-- Number of Pieces
('a30c2687-c797-46c8-b140-b41e0f128de7', 'Number of Pieces', 'Брой части', 'select', false, true,
 '["Single", "2-Piece Set", "3-Piece Set", "4+ Piece Set"]'::jsonb,
 '["Единичен", "2 части", "3 части", "4+ части"]'::jsonb, 18),

-- Outdoor/Indoor
('a30c2687-c797-46c8-b140-b41e0f128de7', 'Indoor/Outdoor', 'Вътрешен/Външен', 'select', false, true,
 '["Indoor Only", "Outdoor Safe", "Indoor/Outdoor"]'::jsonb,
 '["Само вътрешен", "Подходящ за двор", "Вътрешен/Външен"]'::jsonb, 19),

-- Seating Capacity (for sofas, dining)
('a30c2687-c797-46c8-b140-b41e0f128de7', 'Seating Capacity', 'Брой места', 'select', false, true,
 '["1 Person", "2 People", "3 People", "4 People", "5+ People"]'::jsonb,
 '["1 човек", "2 човека", "3 човека", "4 човека", "5+ човека"]'::jsonb, 20);
;
