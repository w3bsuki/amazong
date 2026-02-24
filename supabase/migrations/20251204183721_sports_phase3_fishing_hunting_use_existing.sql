
-- Phase 3i: Link existing Fishing/Hunting from Hobbies to Sports
-- Since fishing/hunting already exist under Hobbies, we'll add Sports-specific categories
-- and reference the existing detailed structure under Hobbies

-- Add L2 categories specific to Sports context
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order) VALUES
-- Sport Fishing (competitive/gear-focused)
('a1b2c3d4-2101-4000-8000-000000000001', 'Sport Fishing', 'Спортен риболов', 'sports-fishing', '🎣', 'a1b2c3d4-1111-4000-8000-000000000002', 1),
('a1b2c3d4-2101-4000-8000-000000000010', 'Carp Fishing', 'Шарански риболов', 'carp-fishing', NULL, 'a1b2c3d4-2101-4000-8000-000000000001', 1),
('a1b2c3d4-2101-4000-8000-000000000011', 'Sea Fishing', 'Морски риболов', 'sea-fishing', NULL, 'a1b2c3d4-2101-4000-8000-000000000001', 2),
('a1b2c3d4-2101-4000-8000-000000000012', 'Kayak Fishing', 'Риболов от каяк', 'kayak-fishing', NULL, 'a1b2c3d4-2101-4000-8000-000000000001', 3),
('a1b2c3d4-2101-4000-8000-000000000013', 'Fishing Electronics', 'Електроника за риболов', 'sports-fishing-electronics', NULL, 'a1b2c3d4-2101-4000-8000-000000000001', 4),

-- Sport Hunting (competitive/gear-focused)  
('a1b2c3d4-2102-4000-8000-000000000001', 'Sport Hunting', 'Спортен лов', 'sports-hunting', NULL, 'a1b2c3d4-1111-4000-8000-000000000002', 2),
('a1b2c3d4-2102-4000-8000-000000000010', 'Big Game Hunting', 'Лов на едър дивеч', 'big-game-hunting', NULL, 'a1b2c3d4-2102-4000-8000-000000000001', 1),
('a1b2c3d4-2102-4000-8000-000000000011', 'Bird Hunting', 'Лов на птици', 'bird-hunting', NULL, 'a1b2c3d4-2102-4000-8000-000000000001', 2),
('a1b2c3d4-2102-4000-8000-000000000012', 'Small Game Hunting', 'Лов на дребен дивеч', 'small-game-hunting', NULL, 'a1b2c3d4-2102-4000-8000-000000000001', 3),

-- Archery (Sport)
('a1b2c3d4-2103-4000-8000-000000000001', 'Archery', 'Стрелба с лък', 'sports-archery', '🏹', 'a1b2c3d4-1111-4000-8000-000000000002', 3),
('a1b2c3d4-2103-4000-8000-000000000002', 'Compound Bows', 'Съставни лъкове', 'archery-compound-bows', NULL, 'a1b2c3d4-2103-4000-8000-000000000001', 1),
('a1b2c3d4-2103-4000-8000-000000000003', 'Recurve Bows', 'Рекурвни лъкове', 'archery-recurve-bows', NULL, 'a1b2c3d4-2103-4000-8000-000000000001', 2),
('a1b2c3d4-2103-4000-8000-000000000004', 'Crossbows', 'Арбалети', 'archery-crossbows', NULL, 'a1b2c3d4-2103-4000-8000-000000000001', 3),
('a1b2c3d4-2103-4000-8000-000000000005', 'Arrows & Bolts', 'Стрели', 'archery-arrows-bolts', NULL, 'a1b2c3d4-2103-4000-8000-000000000001', 4),
('a1b2c3d4-2103-4000-8000-000000000006', 'Archery Targets', 'Мишени за стрелба', 'archery-sport-targets', NULL, 'a1b2c3d4-2103-4000-8000-000000000001', 5),
('a1b2c3d4-2103-4000-8000-000000000007', 'Bow Accessories', 'Аксесоари за лъкове', 'archery-bow-accessories', NULL, 'a1b2c3d4-2103-4000-8000-000000000001', 6),

-- Shooting Sports
('a1b2c3d4-2104-4000-8000-000000000001', 'Shooting Sports', 'Стрелкови спортове', 'shooting-sports', '🎯', 'a1b2c3d4-1111-4000-8000-000000000002', 4),
('a1b2c3d4-2104-4000-8000-000000000010', 'Air Guns', 'Въздушни оръжия', 'air-guns', NULL, 'a1b2c3d4-2104-4000-8000-000000000001', 1),
('a1b2c3d4-2104-4000-8000-000000000011', 'Airsoft', 'Еърсофт', 'airsoft-gear', NULL, 'a1b2c3d4-2104-4000-8000-000000000001', 2),
('a1b2c3d4-2104-4000-8000-000000000012', 'Shooting Targets', 'Мишени за стрелба', 'shooting-targets', NULL, 'a1b2c3d4-2104-4000-8000-000000000001', 3),
('a1b2c3d4-2104-4000-8000-000000000013', 'Shooting Accessories', 'Аксесоари за стрелба', 'shooting-sport-accessories', NULL, 'a1b2c3d4-2104-4000-8000-000000000001', 4);
;
