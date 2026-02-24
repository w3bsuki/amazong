
-- KIDS CATEGORY IMPROVEMENT - PHASE 2C: Diapering L3 Categories
-- ================================================================

-- L3 for Disposable Diapers (ae74afa2-8f1d-4bc9-8ba6-6e157fd04e91)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Newborn Diapers', 'Пелени за новородени', 'diaper-newborn', 'ae74afa2-8f1d-4bc9-8ba6-6e157fd04e91', 1),
('Size 1-2 Diapers', 'Пелени размер 1-2', 'diaper-size12', 'ae74afa2-8f1d-4bc9-8ba6-6e157fd04e91', 2),
('Size 3-4 Diapers', 'Пелени размер 3-4', 'diaper-size34', 'ae74afa2-8f1d-4bc9-8ba6-6e157fd04e91', 3),
('Size 5-6 Diapers', 'Пелени размер 5-6', 'diaper-size56', 'ae74afa2-8f1d-4bc9-8ba6-6e157fd04e91', 4),
('Overnight Diapers', 'Нощни пелени', 'diaper-overnight', 'ae74afa2-8f1d-4bc9-8ba6-6e157fd04e91', 5),
('Swim Diapers', 'Бански пелени', 'diaper-swim', 'ae74afa2-8f1d-4bc9-8ba6-6e157fd04e91', 6);

-- L3 for Cloth Diapers (77212eac-5141-4a66-ae26-92c790efc04f)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('All-in-One Cloth Diapers', 'Всичко в едно', 'cloth-aio', '77212eac-5141-4a66-ae26-92c790efc04f', 1),
('Pocket Diapers', 'Джобни пелени', 'cloth-pocket', '77212eac-5141-4a66-ae26-92c790efc04f', 2),
('Prefold Diapers', 'Предварително сгънати', 'cloth-prefold', '77212eac-5141-4a66-ae26-92c790efc04f', 3),
('Diaper Covers', 'Калъфи за пелени', 'cloth-covers', '77212eac-5141-4a66-ae26-92c790efc04f', 4),
('Diaper Inserts', 'Подложки', 'cloth-inserts', '77212eac-5141-4a66-ae26-92c790efc04f', 5);

-- L3 for Wipes & Creams (69b84b21-bac1-43d5-ac5e-5a4a750a2826)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Baby Wipes', 'Мокри кърпи', 'wipes-baby', '69b84b21-bac1-43d5-ac5e-5a4a750a2826', 1),
('Diaper Cream', 'Крем за пелени', 'wipes-cream', '69b84b21-bac1-43d5-ac5e-5a4a750a2826', 2),
('Baby Powder', 'Бебешка пудра', 'wipes-powder', '69b84b21-bac1-43d5-ac5e-5a4a750a2826', 3),
('Rash Treatment', 'Лечение на обрив', 'wipes-rash', '69b84b21-bac1-43d5-ac5e-5a4a750a2826', 4);

-- L3 for Changing Supplies (21853ef0-3b22-4252-af58-6419b42486ff)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Changing Pads', 'Подложки за повиване', 'changing-pads', '21853ef0-3b22-4252-af58-6419b42486ff', 1),
('Changing Table Covers', 'Калъфи за маса', 'changing-covers', '21853ef0-3b22-4252-af58-6419b42486ff', 2),
('Disposable Changing Pads', 'Еднократни подложки', 'changing-disposable', '21853ef0-3b22-4252-af58-6419b42486ff', 3),
('Diaper Pails', 'Кошчета за пелени', 'changing-pails', '21853ef0-3b22-4252-af58-6419b42486ff', 4);

-- L3 for Potty Training (40acff77-9642-4d2e-8491-cc8c5ec249f8)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Potty Seats', 'Гърнета', 'potty-seats', '40acff77-9642-4d2e-8491-cc8c5ec249f8', 1),
('Training Pants', 'Тренировъчни гащички', 'potty-training-pants', '40acff77-9642-4d2e-8491-cc8c5ec249f8', 2),
('Step Stools', 'Стъпала', 'potty-stools', '40acff77-9642-4d2e-8491-cc8c5ec249f8', 3),
('Toilet Seat Adapters', 'Адаптери за тоалетна', 'potty-adapters', '40acff77-9642-4d2e-8491-cc8c5ec249f8', 4);
;
