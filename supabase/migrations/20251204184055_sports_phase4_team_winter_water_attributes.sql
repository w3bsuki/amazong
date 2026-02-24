
-- Phase 4c: Category Attributes for Team Sports, Winter Sports, Water Sports

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- Team Sports (L1) attributes
('b9cf08ae-a001-4000-8000-000000000001', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Sport', 'Спорт', 'select', false, true,
 '["Football","Basketball","Volleyball","Handball","Rugby","Hockey","Baseball"]'::jsonb,
 '["Футбол","Баскетбол","Волейбол","Хандбал","Ръгби","Хокей","Бейзбол"]'::jsonb, 1),

('b9cf08ae-a001-4000-8000-000000000002', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Ball Size', 'Размер на топка', 'select', false, true,
 '["Size 1","Size 2","Size 3","Size 4","Size 5","Official"]'::jsonb,
 '["Размер 1","Размер 2","Размер 3","Размер 4","Размер 5","Официален"]'::jsonb, 2),

('b9cf08ae-a001-4000-8000-000000000003', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Age Group', 'Възрастова група', 'select', false, true,
 '["Kids (4-8)","Youth (8-12)","Junior (12-16)","Adult","Professional"]'::jsonb,
 '["Деца (4-8)","Младежи (8-12)","Юноши (12-16)","Възрастни","Професионални"]'::jsonb, 3),

('b9cf08ae-a001-4000-8000-000000000004', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 'Brand', 'Марка', 'select', false, true,
 '["Nike","Adidas","Puma","Select","Molten","Wilson","Spalding","Mikasa","Other"]'::jsonb,
 '["Nike","Adidas","Puma","Select","Molten","Wilson","Spalding","Mikasa","Друга"]'::jsonb, 4),

-- Winter Sports (L1) attributes
('d452edd6-a001-4000-8000-000000000001', 'd452edd6-17db-448d-94c9-6a025376b077', 'Winter Sport', 'Зимен спорт', 'select', false, true,
 '["Skiing","Snowboarding","Cross-Country","Ice Skating","Sledding"]'::jsonb,
 '["Ски","Сноуборд","Ски бягане","Ледено пързаляне","Шейни"]'::jsonb, 1),

('d452edd6-a001-4000-8000-000000000002', 'd452edd6-17db-448d-94c9-6a025376b077', 'Ski/Board Length', 'Дължина ски/дъска', 'select', false, true,
 '["Under 140cm","140-150cm","150-160cm","160-170cm","170-180cm","180cm+"]'::jsonb,
 '["Под 140см","140-150см","150-160см","160-170см","170-180см","180см+"]'::jsonb, 2),

('d452edd6-a001-4000-8000-000000000003', 'd452edd6-17db-448d-94c9-6a025376b077', 'Boot Size EU', 'Размер обувки EU', 'select', false, true,
 '["23-25","25-27","27-29","29-31","36-38","38-40","40-42","42-44","44-46","46-48"]'::jsonb,
 '["23-25","25-27","27-29","29-31","36-38","38-40","40-42","42-44","44-46","46-48"]'::jsonb, 3),

('d452edd6-a001-4000-8000-000000000004', 'd452edd6-17db-448d-94c9-6a025376b077', 'Ability Level', 'Ниво на умения', 'select', false, true,
 '["Beginner","Intermediate","Advanced","Expert"]'::jsonb,
 '["Начинаещ","Средно напреднал","Напреднал","Експерт"]'::jsonb, 4),

('d452edd6-a001-4000-8000-000000000005', 'd452edd6-17db-448d-94c9-6a025376b077', 'Gender', 'Пол', 'select', false, true,
 '["Men","Women","Unisex","Kids"]'::jsonb,
 '["Мъже","Жени","Унисекс","Деца"]'::jsonb, 5),

-- Water Sports (L1) attributes
('51b26a07-a001-4000-8000-000000000001', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Water Sport', 'Воден спорт', 'select', false, true,
 '["Swimming","Surfing","Kayaking","SUP","Diving","Snorkeling","Water Polo","Wakeboarding"]'::jsonb,
 '["Плуване","Сърфинг","Каяк","Падълборд","Гмуркане","Шнорхелинг","Водна топка","Уейкборд"]'::jsonb, 1),

('51b26a07-a001-4000-8000-000000000002', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Size', 'Размер', 'select', false, true,
 '["XXS","XS","S","M","L","XL","XXL","XXXL"]'::jsonb,
 '["XXS","XS","S","M","L","XL","XXL","XXXL"]'::jsonb, 2),

('51b26a07-a001-4000-8000-000000000003', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Wetsuit Thickness', 'Дебелина неопрен', 'select', false, true,
 '["1mm","2mm","3mm","3/2mm","4/3mm","5/4mm","6/5mm"]'::jsonb,
 '["1мм","2мм","3мм","3/2мм","4/3мм","5/4мм","6/5мм"]'::jsonb, 3),

('51b26a07-a001-4000-8000-000000000004', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Board Length', 'Дължина на дъска', 'select', false, true,
 '["Under 6ft","6-7ft","7-8ft","8-9ft","9-10ft","10-11ft","11ft+"]'::jsonb,
 '["Под 6ft","6-7ft","7-8ft","8-9ft","9-10ft","10-11ft","11ft+"]'::jsonb, 4),

('51b26a07-a001-4000-8000-000000000005', '51b26a07-cc20-4285-9e84-bd693e9c1bc7', 'Inflatable', 'Надуваем', 'boolean', false, true, NULL, NULL, 5);
;
