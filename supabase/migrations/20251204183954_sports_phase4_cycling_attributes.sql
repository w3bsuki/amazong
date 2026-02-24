
-- Phase 4a: Category Attributes for Cycling
-- Cycling L1 ID: c712e6dd-61d5-4f0a-b7e9-a2e7de655072
-- Bikes L2 ID: 8a11c5b8-1832-4592-9c9a-56286a581387

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- Bikes attributes
('c712e6dd-a001-4000-8000-000000000001', '8a11c5b8-1832-4592-9c9a-56286a581387', 'Bike Type', 'Тип велосипед', 'select', false, true, 
 '["Road","Mountain","Hybrid","City","Gravel","BMX","Folding","Electric"]'::jsonb,
 '["Шосеен","Планински","Хибриден","Градски","Грейвъл","BMX","Сгъваем","Електрически"]'::jsonb, 1),

('c712e6dd-a001-4000-8000-000000000002', '8a11c5b8-1832-4592-9c9a-56286a581387', 'Frame Size', 'Размер на рамката', 'select', false, true,
 '["XS (13-14\")","S (15-16\")","M (17-18\")","L (19-20\")","XL (21-22\")","XXL (23+\")"]'::jsonb,
 '["XS (13-14\")","S (15-16\")","M (17-18\")","L (19-20\")","XL (21-22\")","XXL (23+\")"]'::jsonb, 2),

('c712e6dd-a001-4000-8000-000000000003', '8a11c5b8-1832-4592-9c9a-56286a581387', 'Wheel Size', 'Размер на колелата', 'select', false, true,
 '["12\"","14\"","16\"","20\"","24\"","26\"","27.5\"","29\"","700c"]'::jsonb,
 '["12\"","14\"","16\"","20\"","24\"","26\"","27.5\"","29\"","700c"]'::jsonb, 3),

('c712e6dd-a001-4000-8000-000000000004', '8a11c5b8-1832-4592-9c9a-56286a581387', 'Frame Material', 'Материал на рамката', 'select', false, true,
 '["Aluminum","Carbon Fiber","Steel","Titanium","Chromoly"]'::jsonb,
 '["Алуминий","Карбон","Стомана","Титан","Хромомолибден"]'::jsonb, 4),

('c712e6dd-a001-4000-8000-000000000005', '8a11c5b8-1832-4592-9c9a-56286a581387', 'Number of Gears', 'Брой скорости', 'select', false, true,
 '["Single Speed","7-Speed","18-Speed","21-Speed","24-Speed","27-Speed","30-Speed","11-Speed","12-Speed"]'::jsonb,
 '["Единична скорост","7 скорости","18 скорости","21 скорости","24 скорости","27 скорости","30 скорости","11 скорости","12 скорости"]'::jsonb, 5),

('c712e6dd-a001-4000-8000-000000000006', '8a11c5b8-1832-4592-9c9a-56286a581387', 'Brake Type', 'Тип спирачки', 'select', false, true,
 '["Rim Brakes","Disc Brakes (Mechanical)","Disc Brakes (Hydraulic)","Coaster Brake"]'::jsonb,
 '["Калиперни спирачки","Дискови (механични)","Дискови (хидравлични)","Задна спирачка"]'::jsonb, 6),

('c712e6dd-a001-4000-8000-000000000007', '8a11c5b8-1832-4592-9c9a-56286a581387', 'Suspension Type', 'Тип окачване', 'select', false, true,
 '["None (Rigid)","Hardtail","Full Suspension"]'::jsonb,
 '["Без (твърда)","Предно","Пълно окачване"]'::jsonb, 7),

('c712e6dd-a001-4000-8000-000000000008', '8a11c5b8-1832-4592-9c9a-56286a581387', 'Brand', 'Марка', 'select', false, true,
 '["Trek","Specialized","Giant","Cannondale","Scott","Cube","Merida","Bianchi","Canyon","BMC","Cross","Other"]'::jsonb,
 '["Trek","Specialized","Giant","Cannondale","Scott","Cube","Merida","Bianchi","Canyon","BMC","Cross","Друга"]'::jsonb, 8),

-- Cycling Accessories attributes
('c712e6dd-a002-4000-8000-000000000001', 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 'Accessory Type', 'Тип аксесоар', 'select', false, true,
 '["Light","Lock","Helmet","Bag","Pump","Tool","Computer","Rack","Bell","Fender","Bottle Cage"]'::jsonb,
 '["Светлина","Катинар","Каска","Чанта","Помпа","Инструмент","Компютър","Носач","Звънец","Калник","Поставка за бутилка"]'::jsonb, 1),

('c712e6dd-a002-4000-8000-000000000002', 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 'Light Type', 'Тип светлина', 'select', false, true,
 '["Front Light","Rear Light","Light Set","Reflectors"]'::jsonb,
 '["Предна","Задна","Комплект","Рефлектори"]'::jsonb, 2),

('c712e6dd-a002-4000-8000-000000000003', 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 'Helmet Size', 'Размер каска', 'select', false, true,
 '["XS (48-52cm)","S (52-55cm)","M (55-58cm)","L (58-61cm)","XL (61-64cm)"]'::jsonb,
 '["XS (48-52см)","S (52-55см)","M (55-58см)","L (58-61см)","XL (61-64см)"]'::jsonb, 3),

-- Cycling Clothing attributes  
('c712e6dd-a003-4000-8000-000000000001', 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 'Clothing Type', 'Тип облекло', 'select', false, true,
 '["Jersey","Shorts","Gloves","Shoes","Jacket","Socks","Bib Shorts","Base Layer"]'::jsonb,
 '["Фланелка","Шорти","Ръкавици","Обувки","Яке","Чорапи","Гащеризон","Бельо"]'::jsonb, 1),

('c712e6dd-a003-4000-8000-000000000002', 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 'Size', 'Размер', 'select', false, true,
 '["XS","S","M","L","XL","XXL","XXXL"]'::jsonb,
 '["XS","S","M","L","XL","XXL","XXXL"]'::jsonb, 2),

('c712e6dd-a003-4000-8000-000000000003', 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 'Gender', 'Пол', 'select', false, true,
 '["Men","Women","Unisex","Kids"]'::jsonb,
 '["Мъже","Жени","Унисекс","Деца"]'::jsonb, 3),

('c712e6dd-a003-4000-8000-000000000004', 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 'Season', 'Сезон', 'select', false, true,
 '["Summer","Winter","All-Season"]'::jsonb,
 '["Лято","Зима","Целогодишно"]'::jsonb, 4);
;
