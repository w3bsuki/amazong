
-- Add additional Home Décor attributes (avoiding duplicates)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Size Category
('70e80536-5514-4413-bd4e-1d9573adc162', 'Size', 'Размер', 'select', false, true,
 '["Small (Under 30cm)", "Medium (30-60cm)", "Large (60-100cm)", "Extra Large (100cm+)"]'::jsonb,
 '["Малък (под 30см)", "Среден (30-60см)", "Голям (60-100см)", "Много голям (100см+)"]'::jsonb, 12),

-- Shape
('70e80536-5514-4413-bd4e-1d9573adc162', 'Shape', 'Форма', 'select', false, true,
 '["Rectangular", "Square", "Round", "Oval", "Irregular/Abstract", "Geometric"]'::jsonb,
 '["Правоъгълна", "Квадратна", "Кръгла", "Овална", "Неправилна/Абстрактна", "Геометрична"]'::jsonb, 13),

-- Rug Pile Height
('70e80536-5514-4413-bd4e-1d9573adc162', 'Pile Height', 'Височина на косъма', 'select', false, true,
 '["Flatweave (No Pile)", "Low Pile (Under 1cm)", "Medium Pile (1-2cm)", "High Pile/Shag (2cm+)"]'::jsonb,
 '["Плосък (без косъм)", "Нисък косъм (под 1см)", "Среден косъм (1-2см)", "Висок косъм/Шаг (2см+)"]'::jsonb, 14),

-- Indoor/Outdoor
('70e80536-5514-4413-bd4e-1d9573adc162', 'Indoor/Outdoor', 'Вътрешен/Външен', 'select', false, true,
 '["Indoor Only", "Outdoor Safe", "Indoor/Outdoor"]'::jsonb,
 '["Само вътрешен", "Подходящ за двор", "Вътрешен/Външен"]'::jsonb, 16);

-- Add Lighting specific attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Bulb Type
('0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Bulb Type', 'Тип крушка', 'select', false, true,
 '["LED", "Incandescent", "Halogen", "CFL/Fluorescent", "Smart Bulb", "Bulb Not Included"]'::jsonb,
 '["LED", "Крушка с нажежаема жичка", "Халогенна", "CFL/Флуоресцентна", "Смарт крушка", "Без крушка"]'::jsonb, 10),

-- Wattage
('0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Wattage', 'Мощност', 'select', false, true,
 '["Under 10W", "10-25W", "25-50W", "50-100W", "100W+"]'::jsonb,
 '["Под 10W", "10-25W", "25-50W", "50-100W", "100W+"]'::jsonb, 11),

-- Color Temperature
('0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Color Temperature', 'Цветна температура', 'select', false, true,
 '["Warm White (2700K)", "Soft White (3000K)", "Cool White (4000K)", "Bright White (5000K)", "Daylight (6500K)", "Adjustable/RGB"]'::jsonb,
 '["Топло бяла (2700K)", "Мека бяла (3000K)", "Хладно бяла (4000K)", "Ярко бяла (5000K)", "Дневна (6500K)", "Регулируема/RGB"]'::jsonb, 12),

-- Dimmable
('0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Dimmable', 'С димиране', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 13),

-- Smart Compatible
('0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Smart Compatible', 'Смарт съвместим', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 14),

-- Number of Lights
('0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Number of Lights', 'Брой светлини', 'select', false, true,
 '["1", "2", "3", "4", "5", "6", "7-10", "10+"]'::jsonb,
 '["1", "2", "3", "4", "5", "6", "7-10", "10+"]'::jsonb, 15),

-- Fixture Material
('0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Fixture Material', 'Материал', 'select', false, true,
 '["Metal", "Glass", "Crystal", "Fabric", "Wood", "Plastic", "Rattan", "Concrete"]'::jsonb,
 '["Метал", "Стъкло", "Кристал", "Плат", "Дърво", "Пластмаса", "Ратан", "Бетон"]'::jsonb, 16),

-- Mounting Type
('0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Mounting Type', 'Тип монтаж', 'select', false, true,
 '["Ceiling Mount", "Semi-Flush", "Pendant/Hanging", "Wall Mount", "Plug-In", "Freestanding", "Track Mount", "Recessed"]'::jsonb,
 '["Таванен монтаж", "Полувграден", "Висящ/Окачен", "Стенен монтаж", "На контакт", "Свободно стоящ", "На шина", "Вграден"]'::jsonb, 17),

-- Style
('0225f17c-8b3b-4e62-b6cf-36b07f07d3ec', 'Style', 'Стил', 'select', false, true,
 '["Modern", "Traditional", "Industrial", "Scandinavian", "Rustic", "Art Deco", "Minimalist", "Bohemian"]'::jsonb,
 '["Модерен", "Традиционен", "Индустриален", "Скандинавски", "Рустик", "Арт деко", "Минималистичен", "Бохо"]'::jsonb, 18);
;
