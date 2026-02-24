
-- Phase 3g: Add L3 for Exercise & Fitness (expand existing L2s)
-- Fitness L1 ID: c450eb98-8ffe-4c18-a5dd-6c814bce2890

INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order) VALUES
-- L3 under Cardio Equipment (a4d8910f-b100-4fed-92b0-22c03e6e6cd3)
('c450eb98-3001-4000-8000-000000000001', 'Treadmills', 'Бягащи пътеки', 'cardio-treadmills', NULL, 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 1),
('c450eb98-3001-4000-8000-000000000002', 'Exercise Bikes', 'Фитнес велосипеди', 'cardio-bikes', NULL, 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 2),
('c450eb98-3001-4000-8000-000000000003', 'Ellipticals', 'Елиптични тренажори', 'cardio-ellipticals', NULL, 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 3),
('c450eb98-3001-4000-8000-000000000004', 'Rowing Machines', 'Гребни тренажори', 'cardio-rowing', NULL, 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 4),
('c450eb98-3001-4000-8000-000000000005', 'Stair Climbers', 'Стълбищни тренажори', 'cardio-stair-climbers', NULL, 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 5),
('c450eb98-3001-4000-8000-000000000006', 'Jump Ropes', 'Въжета за скачане', 'cardio-jump-ropes', NULL, 'a4d8910f-b100-4fed-92b0-22c03e6e6cd3', 6),

-- L3 under Strength Training (304fbc78-6dbc-4a12-8905-4796295c68ac)
('c450eb98-3002-4000-8000-000000000001', 'Dumbbells', 'Дъмбели', 'strength-dumbbells', NULL, '304fbc78-6dbc-4a12-8905-4796295c68ac', 1),
('c450eb98-3002-4000-8000-000000000002', 'Barbells', 'Щанги', 'strength-barbells', NULL, '304fbc78-6dbc-4a12-8905-4796295c68ac', 2),
('c450eb98-3002-4000-8000-000000000003', 'Kettlebells', 'Гири', 'strength-kettlebells', NULL, '304fbc78-6dbc-4a12-8905-4796295c68ac', 3),
('c450eb98-3002-4000-8000-000000000004', 'Weight Plates', 'Дискове', 'strength-weight-plates', NULL, '304fbc78-6dbc-4a12-8905-4796295c68ac', 4),
('c450eb98-3002-4000-8000-000000000005', 'Power Racks', 'Клетки за упражнения', 'strength-power-racks', NULL, '304fbc78-6dbc-4a12-8905-4796295c68ac', 5),
('c450eb98-3002-4000-8000-000000000006', 'Weight Benches', 'Пейки за тежести', 'strength-benches', NULL, '304fbc78-6dbc-4a12-8905-4796295c68ac', 6),
('c450eb98-3002-4000-8000-000000000007', 'Pull-Up Bars', 'Лостове за набирания', 'strength-pull-up-bars', NULL, '304fbc78-6dbc-4a12-8905-4796295c68ac', 7),
('c450eb98-3002-4000-8000-000000000008', 'Medicine Balls', 'Медицински топки', 'strength-medicine-balls', NULL, '304fbc78-6dbc-4a12-8905-4796295c68ac', 8),

-- L3 under Yoga & Pilates (ede15da1-a35c-4bec-a5c1-ba88e56e0e2f)
('c450eb98-3003-4000-8000-000000000001', 'Yoga Mats', 'Постелки за йога', 'yoga-mats', NULL, 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 1),
('c450eb98-3003-4000-8000-000000000002', 'Yoga Blocks', 'Блокчета за йога', 'yoga-blocks', NULL, 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 2),
('c450eb98-3003-4000-8000-000000000003', 'Yoga Straps', 'Ремъци за йога', 'yoga-straps', NULL, 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 3),
('c450eb98-3003-4000-8000-000000000004', 'Yoga Bolsters', 'Възглавници за йога', 'yoga-bolsters', NULL, 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 4),
('c450eb98-3003-4000-8000-000000000005', 'Pilates Reformers', 'Пилатес реформери', 'pilates-reformers', NULL, 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 5),
('c450eb98-3003-4000-8000-000000000006', 'Yoga Wheels', 'Йога колела', 'yoga-wheels', NULL, 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 6),
('c450eb98-3003-4000-8000-000000000007', 'Pilates Rings', 'Пилатес пръстени', 'pilates-rings', NULL, 'ede15da1-a35c-4bec-a5c1-ba88e56e0e2f', 7),

-- L3 under Fitness Accessories (5f1b52e0-a87a-45cc-84e9-8156814ca30e)
('c450eb98-3004-4000-8000-000000000001', 'Resistance Bands', 'Ластици за съпротивление', 'fit-acc-bands', NULL, '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 1),
('c450eb98-3004-4000-8000-000000000002', 'Foam Rollers', 'Фоам ролери', 'fit-acc-foam-rollers', NULL, '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 2),
('c450eb98-3004-4000-8000-000000000003', 'Exercise Balls', 'Фитнес топки', 'fit-acc-exercise-balls', NULL, '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 3),
('c450eb98-3004-4000-8000-000000000004', 'Ab Rollers', 'Коремни ролери', 'fit-acc-ab-rollers', NULL, '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 4),
('c450eb98-3004-4000-8000-000000000005', 'Gym Gloves', 'Фитнес ръкавици', 'fit-acc-gloves', NULL, '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 5),
('c450eb98-3004-4000-8000-000000000006', 'Weight Lifting Belts', 'Колани за тежести', 'fit-acc-belts', NULL, '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 6),
('c450eb98-3004-4000-8000-000000000007', 'Gym Bags', 'Фитнес чанти', 'fit-acc-bags', NULL, '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 7),
('c450eb98-3004-4000-8000-000000000008', 'Exercise Mats', 'Постелки за упражнения', 'fit-acc-mats', NULL, '5f1b52e0-a87a-45cc-84e9-8156814ca30e', 8);
;
