
-- Add Kitchen & Dining specific attributes
-- L1 ID: cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Kitchen Material
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Material', 'Материал', 'select', false, true,
 '["Stainless Steel", "Cast Iron", "Aluminum", "Non-Stick/Teflon", "Ceramic", "Glass", "Silicone", "Plastic", "Wood", "Copper", "Carbon Steel"]'::jsonb,
 '["Неръждаема стомана", "Чугун", "Алуминий", "Незалепващо/Тефлон", "Керамика", "Стъкло", "Силикон", "Пластмаса", "Дърво", "Мед", "Въглеродна стомана"]'::jsonb, 10),

-- Capacity
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Capacity', 'Вместимост', 'select', false, true,
 '["Small (Under 1L)", "Medium (1-3L)", "Large (3-5L)", "Extra Large (5-10L)", "Industrial (10L+)"]'::jsonb,
 '["Малък (под 1Л)", "Среден (1-3Л)", "Голям (3-5Л)", "Много голям (5-10Л)", "Индустриален (10Л+)"]'::jsonb, 11),

-- Dishwasher Safe
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Dishwasher Safe', 'Подходящ за съдомиялна', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 12),

-- Oven Safe
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Oven Safe', 'Подходящ за фурна', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 13),

-- Induction Compatible
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Induction Compatible', 'Съвместим с индукция', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 14),

-- Set Size
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Set Size', 'Размер на комплект', 'select', false, true,
 '["Single Item", "2-Piece Set", "4-Piece Set", "6-Piece Set", "8-Piece Set", "10-Piece Set", "12+ Piece Set"]'::jsonb,
 '["Единичен артикул", "Комплект 2 части", "Комплект 4 части", "Комплект 6 части", "Комплект 8 части", "Комплект 10 части", "Комплект 12+ части"]'::jsonb, 15),

-- Power (for appliances)
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Power (Watts)', 'Мощност (Вата)', 'select', false, true,
 '["Under 500W", "500-1000W", "1000-1500W", "1500-2000W", "2000-3000W", "3000W+"]'::jsonb,
 '["Под 500W", "500-1000W", "1000-1500W", "1500-2000W", "2000-3000W", "3000W+"]'::jsonb, 16),

-- Energy Rating
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Energy Rating', 'Енергиен клас', 'select', false, true,
 '["A+++", "A++", "A+", "A", "B", "C", "D", "Not Applicable"]'::jsonb,
 '["A+++", "A++", "A+", "A", "B", "C", "D", "Не е приложимо"]'::jsonb, 17),

-- Cookware Coating
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Coating Type', 'Тип покритие', 'select', false, true,
 '["Non-Stick PTFE", "Ceramic Non-Stick", "Enamel", "Seasoned/Bare", "None"]'::jsonb,
 '["Незалепващо PTFE", "Керамично незалепващо", "Емайл", "Омазнен/Без покритие", "Без"]'::jsonb, 18),

-- Handle Type
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Handle Type', 'Тип дръжка', 'select', false, true,
 '["Stainless Steel", "Silicone-Wrapped", "Wooden", "Plastic", "Removable", "Stay-Cool"]'::jsonb,
 '["Неръждаема стомана", "Със силикон", "Дървена", "Пластмасова", "Сваляща се", "Остава хладна"]'::jsonb, 19),

-- Lid Included
('cfa4b2e9-3fbc-4f11-9ed0-0060a4c6484c', 'Lid Included', 'С капак', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 20);
;
