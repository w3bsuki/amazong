
-- Phase 3h: Add L3 for Hiking & Camping (expand existing L2s)
-- Hiking & Camping L1 ID: b0e82c28-1823-41a8-a8c5-c17d99df496b

INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order) VALUES
-- L3 under Tents (3665e260-90fe-44e1-be9c-d63cb7e71a9b)
('b0e82c28-3001-4000-8000-000000000001', 'Backpacking Tents', 'Туристически палатки', 'tents-backpacking', NULL, '3665e260-90fe-44e1-be9c-d63cb7e71a9b', 1),
('b0e82c28-3001-4000-8000-000000000002', 'Camping Tents', 'Къмпинг палатки', 'tents-camping', NULL, '3665e260-90fe-44e1-be9c-d63cb7e71a9b', 2),
('b0e82c28-3001-4000-8000-000000000003', 'Family Tents', 'Семейни палатки', 'tents-family', NULL, '3665e260-90fe-44e1-be9c-d63cb7e71a9b', 3),
('b0e82c28-3001-4000-8000-000000000004', 'Pop-Up Tents', 'Саморазгъващи се палатки', 'tents-popup', NULL, '3665e260-90fe-44e1-be9c-d63cb7e71a9b', 4),
('b0e82c28-3001-4000-8000-000000000005', '4-Season Tents', 'Четирисезонни палатки', 'tents-4season', NULL, '3665e260-90fe-44e1-be9c-d63cb7e71a9b', 5),

-- L3 under Sleeping Bags (569245f5-1425-4733-a43c-f0303e2caf4f)
('b0e82c28-3002-4000-8000-000000000001', 'Summer Sleeping Bags', 'Летни спални чували', 'sleeping-bags-summer', NULL, '569245f5-1425-4733-a43c-f0303e2caf4f', 1),
('b0e82c28-3002-4000-8000-000000000002', '3-Season Sleeping Bags', 'Трисезонни спални чували', 'sleeping-bags-3season', NULL, '569245f5-1425-4733-a43c-f0303e2caf4f', 2),
('b0e82c28-3002-4000-8000-000000000003', 'Winter Sleeping Bags', 'Зимни спални чували', 'sleeping-bags-winter', NULL, '569245f5-1425-4733-a43c-f0303e2caf4f', 3),
('b0e82c28-3002-4000-8000-000000000004', 'Double Sleeping Bags', 'Двойни спални чували', 'sleeping-bags-double', NULL, '569245f5-1425-4733-a43c-f0303e2caf4f', 4),
('b0e82c28-3002-4000-8000-000000000005', 'Kids Sleeping Bags', 'Детски спални чували', 'sleeping-bags-kids', NULL, '569245f5-1425-4733-a43c-f0303e2caf4f', 5),

-- L3 under Hiking Backpacks (08757a18-af4a-4f87-aa07-c62769bc7de2)
('b0e82c28-3003-4000-8000-000000000001', 'Daypacks', 'Раници за ден', 'hiking-daypacks', NULL, '08757a18-af4a-4f87-aa07-c62769bc7de2', 1),
('b0e82c28-3003-4000-8000-000000000002', 'Backpacking Packs', 'Туристически раници', 'hiking-backpacking-packs', NULL, '08757a18-af4a-4f87-aa07-c62769bc7de2', 2),
('b0e82c28-3003-4000-8000-000000000003', 'Hydration Packs', 'Хидратационни раници', 'hiking-hydration-packs', NULL, '08757a18-af4a-4f87-aa07-c62769bc7de2', 3),
('b0e82c28-3003-4000-8000-000000000004', 'Trail Running Packs', 'Раници за бягане', 'hiking-trail-packs', NULL, '08757a18-af4a-4f87-aa07-c62769bc7de2', 4),

-- L3 under Camping Gear (346a7563-2893-4949-a958-2384f78f504d)
('b0e82c28-3004-4000-8000-000000000001', 'Sleeping Pads', 'Постелки за спане', 'camping-sleeping-pads', NULL, '346a7563-2893-4949-a958-2384f78f504d', 1),
('b0e82c28-3004-4000-8000-000000000002', 'Camp Chairs', 'Къмпинг столове', 'camping-chairs', NULL, '346a7563-2893-4949-a958-2384f78f504d', 2),
('b0e82c28-3004-4000-8000-000000000003', 'Camp Tables', 'Къмпинг маси', 'camping-tables', NULL, '346a7563-2893-4949-a958-2384f78f504d', 3),
('b0e82c28-3004-4000-8000-000000000004', 'Hammocks', 'Хамаци', 'camping-hammocks', NULL, '346a7563-2893-4949-a958-2384f78f504d', 4),
('b0e82c28-3004-4000-8000-000000000005', 'Camp Lighting', 'Къмпинг осветление', 'camping-lighting', NULL, '346a7563-2893-4949-a958-2384f78f504d', 5),
('b0e82c28-3004-4000-8000-000000000006', 'First Aid Kits', 'Аптечки за първа помощ', 'camping-first-aid', NULL, '346a7563-2893-4949-a958-2384f78f504d', 6),

-- L3 under Camping Cooking (4573f5c0-15e9-48ba-9899-d9fcfdf59200)
('b0e82c28-3005-4000-8000-000000000001', 'Camp Stoves', 'Къмпинг печки', 'camping-stoves', NULL, '4573f5c0-15e9-48ba-9899-d9fcfdf59200', 1),
('b0e82c28-3005-4000-8000-000000000002', 'Camp Cookware', 'Съдове за готвене', 'camping-cookware', NULL, '4573f5c0-15e9-48ba-9899-d9fcfdf59200', 2),
('b0e82c28-3005-4000-8000-000000000003', 'Camp Utensils', 'Прибори за хранене', 'camping-utensils', NULL, '4573f5c0-15e9-48ba-9899-d9fcfdf59200', 3),
('b0e82c28-3005-4000-8000-000000000004', 'Water Bottles', 'Бутилки за вода', 'camping-water-bottles', NULL, '4573f5c0-15e9-48ba-9899-d9fcfdf59200', 4),
('b0e82c28-3005-4000-8000-000000000005', 'Coolers', 'Хладилни чанти', 'camping-coolers', NULL, '4573f5c0-15e9-48ba-9899-d9fcfdf59200', 5),
('b0e82c28-3005-4000-8000-000000000006', 'Food Storage', 'Съхранение на храна', 'camping-food-storage', NULL, '4573f5c0-15e9-48ba-9899-d9fcfdf59200', 6),

-- Add new L2 categories under Hiking & Camping
('b0e82c28-2001-4000-8000-000000000001', 'Hiking Footwear', 'Туристически обувки', 'hiking-footwear', NULL, 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 7),
('b0e82c28-2001-4000-8000-000000000002', 'Hiking Boots', 'Туристически боти', 'hiking-boots', NULL, 'b0e82c28-2001-4000-8000-000000000001', 1),
('b0e82c28-2001-4000-8000-000000000003', 'Hiking Shoes', 'Туристически обувки', 'hiking-shoes', NULL, 'b0e82c28-2001-4000-8000-000000000001', 2),
('b0e82c28-2001-4000-8000-000000000004', 'Trail Running Shoes', 'Обувки за планинско бягане', 'hiking-trail-shoes', NULL, 'b0e82c28-2001-4000-8000-000000000001', 3),
('b0e82c28-2001-4000-8000-000000000005', 'Hiking Sandals', 'Туристически сандали', 'hiking-sandals', NULL, 'b0e82c28-2001-4000-8000-000000000001', 4),

('b0e82c28-2002-4000-8000-000000000001', 'Navigation & Safety', 'Навигация и безопасност', 'hiking-navigation', NULL, 'b0e82c28-1823-41a8-a8c5-c17d99df496b', 8),
('b0e82c28-2002-4000-8000-000000000002', 'GPS Devices', 'GPS устройства', 'hiking-gps', NULL, 'b0e82c28-2002-4000-8000-000000000001', 1),
('b0e82c28-2002-4000-8000-000000000003', 'Compasses', 'Компаси', 'hiking-compasses', NULL, 'b0e82c28-2002-4000-8000-000000000001', 2),
('b0e82c28-2002-4000-8000-000000000004', 'Headlamps', 'Челни лампи', 'hiking-headlamps', NULL, 'b0e82c28-2002-4000-8000-000000000001', 3),
('b0e82c28-2002-4000-8000-000000000005', 'Trekking Poles', 'Туристически щеки', 'hiking-trekking-poles', NULL, 'b0e82c28-2002-4000-8000-000000000001', 4);
;
