
-- Phase 4d: Category Attributes for Combat Sports, Hiking & Camping, Racket Sports

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- Combat Sports (L1) attributes
('88bbc89c-a001-4000-8000-000000000001', '88bbc89c-5f86-463d-8025-708ae988b6a7', 'Combat Sport', 'Боен спорт', 'select', false, true,
 '["Boxing","MMA","Martial Arts","Wrestling","Kickboxing","Fencing"]'::jsonb,
 '["Бокс","ММА","Бойни изкуства","Борба","Кикбокс","Фехтовка"]'::jsonb, 1),

('88bbc89c-a001-4000-8000-000000000002', '88bbc89c-5f86-463d-8025-708ae988b6a7', 'Glove Size', 'Размер ръкавици', 'select', false, true,
 '["6oz","8oz","10oz","12oz","14oz","16oz","18oz"]'::jsonb,
 '["6oz","8oz","10oz","12oz","14oz","16oz","18oz"]'::jsonb, 2),

('88bbc89c-a001-4000-8000-000000000003', '88bbc89c-5f86-463d-8025-708ae988b6a7', 'Uniform Size', 'Размер кимоно', 'select', false, true,
 '["000","00","0","1","2","3","4","5","6","7"]'::jsonb,
 '["000","00","0","1","2","3","4","5","6","7"]'::jsonb, 3),

('88bbc89c-a001-4000-8000-000000000004', '88bbc89c-5f86-463d-8025-708ae988b6a7', 'Protection Type', 'Тип протекция', 'multiselect', false, true,
 '["Head Guard","Shin Guards","Mouth Guard","Groin Guard","Body Protector","Hand Wraps"]'::jsonb,
 '["Каска","Кори","Зъболекар","Слабинна защита","Корем защита","Бандажи"]'::jsonb, 4),

('88bbc89c-a001-4000-8000-000000000005', '88bbc89c-5f86-463d-8025-708ae988b6a7', 'Belt Color', 'Цвят на колан', 'select', false, true,
 '["White","Yellow","Orange","Green","Blue","Purple","Brown","Black"]'::jsonb,
 '["Бял","Жълт","Оранжев","Зелен","Син","Лилав","Кафяв","Черен"]'::jsonb, 5),

-- Hiking & Camping (L1) attributes
('b0e82c28-a001-4000-8000-000000000001', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Activity', 'Активност', 'select', false, true,
 '["Hiking","Backpacking","Camping","Mountaineering","Trail Running"]'::jsonb,
 '["Туризъм","Планинарство","Къмпинг","Алпинизъм","Планинско бягане"]'::jsonb, 1),

('b0e82c28-a001-4000-8000-000000000002', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Tent Capacity', 'Капацитет палатка', 'select', false, true,
 '["1 Person","2 Person","3 Person","4 Person","5-6 Person","7+ Person"]'::jsonb,
 '["1 човек","2 човека","3 човека","4 човека","5-6 човека","7+ човека"]'::jsonb, 2),

('b0e82c28-a001-4000-8000-000000000003', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Season Rating', 'Сезонност', 'select', false, true,
 '["1 Season","2 Season","3 Season","3+ Season","4 Season"]'::jsonb,
 '["1 сезон","2 сезона","3 сезона","3+ сезона","4 сезона"]'::jsonb, 3),

('b0e82c28-a001-4000-8000-000000000004', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Backpack Volume', 'Обем раница', 'select', false, true,
 '["Under 20L","20-30L","30-40L","40-50L","50-65L","65-80L","80L+"]'::jsonb,
 '["Под 20L","20-30L","30-40L","40-50L","50-65L","65-80L","80L+"]'::jsonb, 4),

('b0e82c28-a001-4000-8000-000000000005', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Temperature Rating', 'Температурен рейтинг', 'select', false, true,
 '["Above 0°C","0°C to -5°C","-5°C to -10°C","-10°C to -20°C","Below -20°C"]'::jsonb,
 '["Над 0°C","0°C до -5°C","-5°C до -10°C","-10°C до -20°C","Под -20°C"]'::jsonb, 5),

('b0e82c28-a001-4000-8000-000000000006', 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 'Waterproof', 'Водоустойчив', 'boolean', false, true, NULL, NULL, 6),

-- Racket Sports (L1) attributes
('a1b2c3d4-a001-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001', 'Racket Sport', 'Ракетен спорт', 'select', false, true,
 '["Tennis","Badminton","Squash","Padel","Table Tennis"]'::jsonb,
 '["Тенис","Бадминтон","Скуош","Падел","Тенис на маса"]'::jsonb, 1),

('a1b2c3d4-a001-4000-8000-000000000002', 'a1b2c3d4-1111-4000-8000-000000000001', 'Racket Weight', 'Тегло на ракета', 'select', false, true,
 '["Under 260g","260-280g","280-300g","300-320g","320g+"]'::jsonb,
 '["Под 260г","260-280г","280-300г","300-320г","320г+"]'::jsonb, 2),

('a1b2c3d4-a001-4000-8000-000000000003', 'a1b2c3d4-1111-4000-8000-000000000001', 'Head Size', 'Размер на глава', 'select', false, true,
 '["Midsize (85-95 sq in)","Midplus (95-105 sq in)","Oversize (105-115 sq in)","Super Oversize (115+ sq in)"]'::jsonb,
 '["Среден (85-95 кв.ин)","Среден+ (95-105 кв.ин)","Голям (105-115 кв.ин)","Супер голям (115+ кв.ин)"]'::jsonb, 3),

('a1b2c3d4-a001-4000-8000-000000000004', 'a1b2c3d4-1111-4000-8000-000000000001', 'Grip Size', 'Размер дръжка', 'select', false, true,
 '["L0 (4 inches)","L1 (4 1/8)","L2 (4 1/4)","L3 (4 3/8)","L4 (4 1/2)","L5 (4 5/8)"]'::jsonb,
 '["L0 (4 инча)","L1 (4 1/8)","L2 (4 1/4)","L3 (4 3/8)","L4 (4 1/2)","L5 (4 5/8)"]'::jsonb, 4),

('a1b2c3d4-a001-4000-8000-000000000005', 'a1b2c3d4-1111-4000-8000-000000000001', 'String Pattern', 'Тип кордаж', 'select', false, true,
 '["16x19","18x20","16x18","Other"]'::jsonb,
 '["16x19","18x20","16x18","Друг"]'::jsonb, 5),

('a1b2c3d4-a001-4000-8000-000000000006', 'a1b2c3d4-1111-4000-8000-000000000001', 'Skill Level', 'Ниво', 'select', false, true,
 '["Beginner","Intermediate","Advanced","Professional"]'::jsonb,
 '["Начинаещ","Средно напреднал","Напреднал","Професионалист"]'::jsonb, 6);
;
