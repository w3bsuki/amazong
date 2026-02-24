
-- Add category attributes for gaming peripherals

-- Gaming Mice attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, sort_order) VALUES
-- DPI
((SELECT id FROM categories WHERE slug = 'gaming-mice'), 
 'DPI Range', 'DPI обхват', 'select', 
 '["Up to 8000", "8001-16000", "16001-25000", "25000+"]'::jsonb,
 '["До 8000", "8001-16000", "16001-25000", "25000+"]'::jsonb, 
 true, 1),
-- Connection
((SELECT id FROM categories WHERE slug = 'gaming-mice'), 
 'Connection', 'Връзка', 'select', 
 '["Wired", "Wireless 2.4GHz", "Bluetooth", "Wireless + Bluetooth"]'::jsonb,
 '["Кабелна", "Безжична 2.4GHz", "Bluetooth", "Безжична + Bluetooth"]'::jsonb, 
 true, 2),
-- Brand
((SELECT id FROM categories WHERE slug = 'gaming-mice'), 
 'Brand', 'Марка', 'select', 
 '["Logitech", "Razer", "SteelSeries", "Corsair", "Glorious", "Zowie", "Pulsar", "Other"]'::jsonb,
 '["Logitech", "Razer", "SteelSeries", "Corsair", "Glorious", "Zowie", "Pulsar", "Друга"]'::jsonb, 
 true, 3),
-- Weight
((SELECT id FROM categories WHERE slug = 'gaming-mice'), 
 'Weight', 'Тегло', 'select', 
 '["Under 60g", "60-80g", "80-100g", "100g+"]'::jsonb,
 '["Под 60g", "60-80g", "80-100g", "100g+"]'::jsonb, 
 true, 4);

-- Gaming Keyboards attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, sort_order) VALUES
-- Switch Type
((SELECT id FROM categories WHERE slug = 'gaming-keyboards'), 
 'Switch Type', 'Тип суичове', 'select', 
 '["Mechanical", "Optical", "Membrane", "Hybrid"]'::jsonb,
 '["Механични", "Оптични", "Мембранни", "Хибридни"]'::jsonb, 
 true, 1),
-- Layout
((SELECT id FROM categories WHERE slug = 'gaming-keyboards'), 
 'Layout', 'Оформление', 'select', 
 '["Full Size (100%)", "TKL (80%)", "75%", "65%", "60%"]'::jsonb,
 '["Пълен размер (100%)", "TKL (80%)", "75%", "65%", "60%"]'::jsonb, 
 true, 2),
-- Connection
((SELECT id FROM categories WHERE slug = 'gaming-keyboards'), 
 'Connection', 'Връзка', 'select', 
 '["Wired", "Wireless 2.4GHz", "Bluetooth", "Wireless + Bluetooth"]'::jsonb,
 '["Кабелна", "Безжична 2.4GHz", "Bluetooth", "Безжична + Bluetooth"]'::jsonb, 
 true, 3),
-- RGB
((SELECT id FROM categories WHERE slug = 'gaming-keyboards'), 
 'RGB Lighting', 'RGB осветление', 'boolean', 
 '[]'::jsonb, '[]'::jsonb, 
 true, 4);

-- Gaming Headsets attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, sort_order) VALUES
-- Connection
((SELECT id FROM categories WHERE slug = 'gaming-headsets'), 
 'Connection', 'Връзка', 'select', 
 '["Wired 3.5mm", "Wired USB", "Wireless 2.4GHz", "Bluetooth", "Wireless + Bluetooth"]'::jsonb,
 '["Кабелна 3.5mm", "Кабелна USB", "Безжична 2.4GHz", "Bluetooth", "Безжична + Bluetooth"]'::jsonb, 
 true, 1),
-- Surround Sound
((SELECT id FROM categories WHERE slug = 'gaming-headsets'), 
 'Surround Sound', 'Съраунд звук', 'select', 
 '["Stereo", "Virtual 7.1", "True 7.1", "Spatial Audio"]'::jsonb,
 '["Стерео", "Виртуален 7.1", "Истински 7.1", "Пространствен звук"]'::jsonb, 
 true, 2),
-- Microphone
((SELECT id FROM categories WHERE slug = 'gaming-headsets'), 
 'Microphone', 'Микрофон', 'select', 
 '["Built-in Boom", "Detachable", "Retractable", "None"]'::jsonb,
 '["Вграден", "Сваляем", "Прибиращ се", "Без"]'::jsonb, 
 true, 3),
-- Platform
((SELECT id FROM categories WHERE slug = 'gaming-headsets'), 
 'Compatible Platforms', 'Съвместими платформи', 'multiselect', 
 '["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"]'::jsonb,
 '["PC", "PlayStation", "Xbox", "Nintendo Switch", "Мобилни"]'::jsonb, 
 true, 4);

-- Controllers attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, sort_order) VALUES
-- Platform
((SELECT id FROM categories WHERE slug = 'controllers'), 
 'Platform', 'Платформа', 'multiselect', 
 '["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "Mobile"]'::jsonb,
 '["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "Мобилни"]'::jsonb, 
 true, 1),
-- Connection
((SELECT id FROM categories WHERE slug = 'controllers'), 
 'Connection', 'Връзка', 'select', 
 '["Wired", "Wireless", "Bluetooth", "Wireless + Bluetooth"]'::jsonb,
 '["Кабелна", "Безжична", "Bluetooth", "Безжична + Bluetooth"]'::jsonb, 
 true, 2),
-- Type
((SELECT id FROM categories WHERE slug = 'controllers'), 
 'Controller Type', 'Тип контролер', 'select', 
 '["Standard Gamepad", "Pro/Elite Controller", "Arcade Stick", "Flight Stick"]'::jsonb,
 '["Стандартен геймпад", "Pro/Elite контролер", "Аркаден стик", "Полетен стик"]'::jsonb, 
 true, 3);

-- Gaming Furniture attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, sort_order) VALUES
-- Furniture Type
((SELECT id FROM categories WHERE slug = 'gaming-furniture'), 
 'Type', 'Тип', 'select', 
 '["Gaming Chair", "Gaming Desk", "Monitor Arm", "Keyboard Tray"]'::jsonb,
 '["Геймърски стол", "Геймърско бюро", "Стойка за монитор", "Поставка за клавиатура"]'::jsonb, 
 true, 1),
-- Material for chairs
((SELECT id FROM categories WHERE slug = 'gaming-furniture'), 
 'Material', 'Материал', 'select', 
 '["PU Leather", "Mesh", "Fabric", "Real Leather", "Mixed"]'::jsonb,
 '["PU кожа", "Мрежа", "Плат", "Естествена кожа", "Смесен"]'::jsonb, 
 true, 2),
-- Max Weight Capacity
((SELECT id FROM categories WHERE slug = 'gaming-furniture'), 
 'Weight Capacity', 'Капацитет на тегло', 'select', 
 '["Up to 100kg", "100-120kg", "120-150kg", "150kg+"]'::jsonb,
 '["До 100кг", "100-120кг", "120-150кг", "150кг+"]'::jsonb, 
 true, 3);
;
