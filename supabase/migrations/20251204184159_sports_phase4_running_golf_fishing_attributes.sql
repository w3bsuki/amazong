
-- Phase 4e: Category Attributes for Running, Golf, Fishing & Hunting

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- Running (L1) attributes
('0f7da028-a001-4000-8000-000000000001', '0f7da028-a4c3-4f98-8e8f-9d17d9147435', 'Running Type', 'Тип бягане', 'select', false, true,
 '["Road Running","Trail Running","Track","Race","Cross Country"]'::jsonb,
 '["Пътно","Планинско","Писта","Състезателно","Крос"]'::jsonb, 1),

('0f7da028-a001-4000-8000-000000000002', '0f7da028-a4c3-4f98-8e8f-9d17d9147435', 'Shoe Size EU', 'Размер обувки EU', 'select', false, true,
 '["36","37","38","39","40","41","42","43","44","45","46","47","48"]'::jsonb,
 '["36","37","38","39","40","41","42","43","44","45","46","47","48"]'::jsonb, 2),

('0f7da028-a001-4000-8000-000000000003', '0f7da028-a4c3-4f98-8e8f-9d17d9147435', 'Cushioning', 'Амортизация', 'select', false, true,
 '["Minimal","Light","Moderate","Maximum"]'::jsonb,
 '["Минимална","Лека","Средна","Максимална"]'::jsonb, 3),

('0f7da028-a001-4000-8000-000000000004', '0f7da028-a4c3-4f98-8e8f-9d17d9147435', 'Arch Support', 'Поддръжка на свода', 'select', false, true,
 '["Neutral","Stability","Motion Control"]'::jsonb,
 '["Неутрална","Стабилност","Контрол на движение"]'::jsonb, 4),

('0f7da028-a001-4000-8000-000000000005', '0f7da028-a4c3-4f98-8e8f-9d17d9147435', 'Drop', 'Спадане', 'select', false, true,
 '["0mm (Zero Drop)","1-4mm","5-8mm","9-12mm","13mm+"]'::jsonb,
 '["0мм (нулево)","1-4мм","5-8мм","9-12мм","13мм+"]'::jsonb, 5),

('0f7da028-a001-4000-8000-000000000006', '0f7da028-a4c3-4f98-8e8f-9d17d9147435', 'Gender', 'Пол', 'select', false, true,
 '["Men","Women","Unisex"]'::jsonb,
 '["Мъже","Жени","Унисекс"]'::jsonb, 6),

-- Golf (L1) attributes
('8c9d2e5c-a001-4000-8000-000000000001', '8c9d2e5c-71a3-46a5-830b-2b826917ef97', 'Club Type', 'Тип стик', 'select', false, true,
 '["Driver","Fairway Wood","Hybrid","Iron","Wedge","Putter","Complete Set"]'::jsonb,
 '["Драйвър","Фейруей уд","Хибрид","Айрън","Уедж","Путър","Комплект"]'::jsonb, 1),

('8c9d2e5c-a001-4000-8000-000000000002', '8c9d2e5c-71a3-46a5-830b-2b826917ef97', 'Flex', 'Гъвкавост', 'select', false, true,
 '["Ladies","Senior","Regular","Stiff","Extra Stiff"]'::jsonb,
 '["Дамски","Сениор","Обикновен","Твърд","Много твърд"]'::jsonb, 2),

('8c9d2e5c-a001-4000-8000-000000000003', '8c9d2e5c-71a3-46a5-830b-2b826917ef97', 'Hand', 'Ръка', 'select', false, true,
 '["Right-Handed","Left-Handed"]'::jsonb,
 '["Дясна ръка","Лява ръка"]'::jsonb, 3),

('8c9d2e5c-a001-4000-8000-000000000004', '8c9d2e5c-71a3-46a5-830b-2b826917ef97', 'Loft', 'Ъгъл', 'select', false, true,
 '["8-9°","9-10°","10-11°","11-12°","12-13°","45-50°","50-55°","55-60°"]'::jsonb,
 '["8-9°","9-10°","10-11°","11-12°","12-13°","45-50°","50-55°","55-60°"]'::jsonb, 4),

('8c9d2e5c-a001-4000-8000-000000000005', '8c9d2e5c-71a3-46a5-830b-2b826917ef97', 'Skill Level', 'Ниво на умения', 'select', false, true,
 '["Beginner","Intermediate","Advanced","Professional"]'::jsonb,
 '["Начинаещ","Средно напреднал","Напреднал","Професионалист"]'::jsonb, 5),

-- Fishing & Hunting (L1) attributes
('a1b2c3d4-a002-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000002', 'Activity', 'Активност', 'select', false, true,
 '["Sport Fishing","Sea Fishing","Carp Fishing","Fly Fishing","Hunting","Archery","Shooting"]'::jsonb,
 '["Спортен риболов","Морски риболов","Шарански риболов","Мухарство","Лов","Стрелба с лък","Стрелба"]'::jsonb, 1),

('a1b2c3d4-a002-4000-8000-000000000002', 'a1b2c3d4-1111-4000-8000-000000000002', 'Rod Length', 'Дължина на въдица', 'select', false, true,
 '["Under 2m","2-2.5m","2.5-3m","3-3.5m","3.5-4m","4-4.5m","4.5m+"]'::jsonb,
 '["Под 2м","2-2.5м","2.5-3м","3-3.5м","3.5-4м","4-4.5м","4.5м+"]'::jsonb, 2),

('a1b2c3d4-a002-4000-8000-000000000003', 'a1b2c3d4-1111-4000-8000-000000000002', 'Rod Action', 'Акция на въдица', 'select', false, true,
 '["Slow","Medium","Fast","Extra Fast"]'::jsonb,
 '["Бавна","Средна","Бърза","Много бърза"]'::jsonb, 3),

('a1b2c3d4-a002-4000-8000-000000000004', 'a1b2c3d4-1111-4000-8000-000000000002', 'Reel Type', 'Тип макара', 'select', false, true,
 '["Spinning","Baitcasting","Fly","Conventional","Spincast"]'::jsonb,
 '["Спининг","Мултипликатор","Мухарска","Конвенционална","Спинкаст"]'::jsonb, 4),

('a1b2c3d4-a002-4000-8000-000000000005', 'a1b2c3d4-1111-4000-8000-000000000002', 'Draw Weight', 'Сила на обтягане', 'select', false, true,
 '["Under 20 lbs","20-30 lbs","30-40 lbs","40-50 lbs","50-60 lbs","60-70 lbs","70+ lbs"]'::jsonb,
 '["Под 20 lbs","20-30 lbs","30-40 lbs","40-50 lbs","50-60 lbs","60-70 lbs","70+ lbs"]'::jsonb, 5);
;
