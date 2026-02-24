
-- Phase 4b: Category Attributes for Fitness
-- Fitness L1 ID: c450eb98-8ffe-4c18-a5dd-6c814bce2890
-- Cardio Equipment L2 ID: a4d8910f-b100-4fed-92b0-22c03e6e6cd3
-- Strength Training L2 ID: 304fbc78-6dbc-4a12-8905-4796295c68ac

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- Cardio Equipment attributes
('c450eb98-a001-4000-8000-000000000001', 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 'Cardio Type', 'Тип кардио уред', 'select', false, true,
 '["Treadmill","Exercise Bike","Elliptical","Rowing Machine","Stair Climber","Air Bike"]'::jsonb,
 '["Бягаща пътека","Велоергометър","Елиптичен","Гребен тренажор","Стълбищен","Ейр байк"]'::jsonb, 1),

('c450eb98-a001-4000-8000-000000000002', 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 'Resistance Type', 'Тип съпротивление', 'select', false, true,
 '["Magnetic","Air","Friction","Water","Electromagnetic"]'::jsonb,
 '["Магнитно","Въздушно","Фрикционно","Водно","Електромагнитно"]'::jsonb, 2),

('c450eb98-a001-4000-8000-000000000003', 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 'Max User Weight', 'Макс. тегло на потребител', 'select', false, true,
 '["Up to 100kg","100-120kg","120-150kg","150-180kg","180kg+"]'::jsonb,
 '["До 100кг","100-120кг","120-150кг","150-180кг","180кг+"]'::jsonb, 3),

('c450eb98-a001-4000-8000-000000000004', 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 'Foldable', 'Сгъваем', 'boolean', false, true, NULL, NULL, 4),

('c450eb98-a001-4000-8000-000000000005', 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 'Display Type', 'Тип дисплей', 'select', false, true,
 '["LCD","LED","HD Touch Screen","No Display"]'::jsonb,
 '["LCD","LED","HD Тъч екран","Без дисплей"]'::jsonb, 5),

-- Strength Training attributes
('c450eb98-a002-4000-8000-000000000001', '304fbc78-6dbc-4a12-8905-4796295c68ac', 'Equipment Type', 'Тип оборудване', 'select', false, true,
 '["Dumbbells","Barbells","Kettlebells","Weight Plates","Power Rack","Weight Bench","Pull-Up Bar","Medicine Ball"]'::jsonb,
 '["Дъмбели","Щанги","Гири","Дискове","Клетка","Пейка","Лост","Медицинска топка"]'::jsonb, 1),

('c450eb98-a002-4000-8000-000000000002', '304fbc78-6dbc-4a12-8905-4796295c68ac', 'Weight', 'Тегло', 'select', false, true,
 '["1-5kg","5-10kg","10-15kg","15-20kg","20-30kg","30-40kg","40-50kg","50kg+"]'::jsonb,
 '["1-5кг","5-10кг","10-15кг","15-20кг","20-30кг","30-40кг","40-50кг","50кг+"]'::jsonb, 2),

('c450eb98-a002-4000-8000-000000000003', '304fbc78-6dbc-4a12-8905-4796295c68ac', 'Material', 'Материал', 'select', false, true,
 '["Cast Iron","Steel","Rubber Coated","Chrome","Vinyl","Neoprene"]'::jsonb,
 '["Чугун","Стомана","Гумирани","Хром","Винил","Неопрен"]'::jsonb, 3),

('c450eb98-a002-4000-8000-000000000004', '304fbc78-6dbc-4a12-8905-4796295c68ac', 'Adjustable', 'Регулируем', 'boolean', false, true, NULL, NULL, 4),

-- Yoga & Pilates attributes
('c450eb98-a003-4000-8000-000000000001', 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 'Product Type', 'Тип продукт', 'select', false, true,
 '["Yoga Mat","Yoga Block","Yoga Strap","Yoga Bolster","Pilates Reformer","Yoga Wheel","Pilates Ring","Mat Bag"]'::jsonb,
 '["Постелка за йога","Блокче","Ремък","Възглавница","Пилатес реформер","Йога колело","Пилатес пръстен","Чанта за постелка"]'::jsonb, 1),

('c450eb98-a003-4000-8000-000000000002', 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 'Mat Thickness', 'Дебелина на постелка', 'select', false, true,
 '["2mm","4mm","6mm","8mm","10mm","15mm+"]'::jsonb,
 '["2мм","4мм","6мм","8мм","10мм","15мм+"]'::jsonb, 2),

('c450eb98-a003-4000-8000-000000000003', 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 'Mat Material', 'Материал на постелка', 'select', false, true,
 '["PVC","TPE","Natural Rubber","Cork","Jute","NBR Foam"]'::jsonb,
 '["PVC","TPE","Естествена гума","Корк","Юта","NBR пяна"]'::jsonb, 3),

-- Fitness Accessories attributes
('c450eb98-a004-4000-8000-000000000001', '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 'Accessory Type', 'Тип аксесоар', 'select', false, true,
 '["Resistance Band","Foam Roller","Exercise Ball","Ab Roller","Gym Gloves","Weight Belt","Gym Bag","Exercise Mat"]'::jsonb,
 '["Ластик","Фоам ролер","Фитнес топка","Коремен ролер","Фитнес ръкавици","Колан за тежести","Фитнес чанта","Постелка"]'::jsonb, 1),

('c450eb98-a004-4000-8000-000000000002', '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 'Resistance Level', 'Ниво на съпротивление', 'select', false, true,
 '["Extra Light","Light","Medium","Heavy","Extra Heavy"]'::jsonb,
 '["Много леко","Леко","Средно","Тежко","Много тежко"]'::jsonb, 2);
;
