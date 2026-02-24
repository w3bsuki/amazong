
-- Phase 3f: Add L3 for Cycling (expand existing L2s)
-- Cycling L1 ID: c712e6dd-61d5-4f0a-b7e9-a2e7de655072

INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order) VALUES
-- L3 under Bikes (8a11c5b8-1832-4592-9c9a-56286a581387)
('c712e6dd-3001-4000-8000-000000000001', 'Road Bikes', 'Шосейни велосипеди', 'bikes-road', NULL, '8a11c5b8-1832-4592-9c9a-56286a581387', 1),
('c712e6dd-3001-4000-8000-000000000002', 'Mountain Bikes', 'Планински велосипеди', 'bikes-mountain', NULL, '8a11c5b8-1832-4592-9c9a-56286a581387', 2),
('c712e6dd-3001-4000-8000-000000000003', 'Hybrid Bikes', 'Хибридни велосипеди', 'bikes-hybrid', NULL, '8a11c5b8-1832-4592-9c9a-56286a581387', 3),
('c712e6dd-3001-4000-8000-000000000004', 'City Bikes', 'Градски велосипеди', 'bikes-city', NULL, '8a11c5b8-1832-4592-9c9a-56286a581387', 4),
('c712e6dd-3001-4000-8000-000000000005', 'Gravel Bikes', 'Грейвъл велосипеди', 'bikes-gravel', NULL, '8a11c5b8-1832-4592-9c9a-56286a581387', 5),
('c712e6dd-3001-4000-8000-000000000006', 'BMX Bikes', 'BMX велосипеди', 'bikes-bmx', NULL, '8a11c5b8-1832-4592-9c9a-56286a581387', 6),
('c712e6dd-3001-4000-8000-000000000007', 'Folding Bikes', 'Сгъваеми велосипеди', 'bikes-folding', NULL, '8a11c5b8-1832-4592-9c9a-56286a581387', 7),

-- L3 under Bike Components (5a3e308c-122e-43fd-b6e5-fd68a86b648c)
('c712e6dd-3002-4000-8000-000000000001', 'Derailleurs', 'Дерайльори', 'bike-derailleurs', NULL, '5a3e308c-122e-43fd-b6e5-fd68a86b648c', 1),
('c712e6dd-3002-4000-8000-000000000002', 'Brakes', 'Спирачки', 'bike-brakes', NULL, '5a3e308c-122e-43fd-b6e5-fd68a86b648c', 2),
('c712e6dd-3002-4000-8000-000000000003', 'Wheels & Rims', 'Джанти и капли', 'bike-wheels-rims', NULL, '5a3e308c-122e-43fd-b6e5-fd68a86b648c', 3),
('c712e6dd-3002-4000-8000-000000000004', 'Tires & Tubes', 'Гуми и вътрешни', 'bike-tires-tubes', NULL, '5a3e308c-122e-43fd-b6e5-fd68a86b648c', 4),
('c712e6dd-3002-4000-8000-000000000005', 'Chains & Cassettes', 'Вериги и касети', 'bike-chains-cassettes', NULL, '5a3e308c-122e-43fd-b6e5-fd68a86b648c', 5),
('c712e6dd-3002-4000-8000-000000000006', 'Handlebars & Stems', 'Кормила и стемове', 'bike-handlebars-stems', NULL, '5a3e308c-122e-43fd-b6e5-fd68a86b648c', 6),
('c712e6dd-3002-4000-8000-000000000007', 'Pedals', 'Педали', 'bike-pedals', NULL, '5a3e308c-122e-43fd-b6e5-fd68a86b648c', 7),
('c712e6dd-3002-4000-8000-000000000008', 'Saddles & Seatposts', 'Седалки и колчета', 'bike-saddles-seatposts', NULL, '5a3e308c-122e-43fd-b6e5-fd68a86b648c', 8),
('c712e6dd-3002-4000-8000-000000000009', 'Forks & Suspension', 'Вилки и окачване', 'bike-forks-suspension', NULL, '5a3e308c-122e-43fd-b6e5-fd68a86b648c', 9),

-- L3 under Bike Accessories (f1dc9dbe-2391-4f3b-8775-3a87d21886f4)
('c712e6dd-3003-4000-8000-000000000001', 'Bike Lights', 'Велосипедни светлини', 'bike-lights', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 1),
('c712e6dd-3003-4000-8000-000000000002', 'Bike Locks', 'Катинари за велосипеди', 'bike-locks', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 2),
('c712e6dd-3003-4000-8000-000000000003', 'Bike Helmets', 'Велосипедни каски', 'bike-helmets', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 3),
('c712e6dd-3003-4000-8000-000000000004', 'Bike Bags & Panniers', 'Чанти и кошници', 'bike-bags-panniers', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 4),
('c712e6dd-3003-4000-8000-000000000005', 'Bike Pumps', 'Помпи за велосипеди', 'bike-pumps', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 5),
('c712e6dd-3003-4000-8000-000000000006', 'Bike Tools', 'Инструменти за велосипеди', 'bike-tools', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 6),
('c712e6dd-3003-4000-8000-000000000007', 'Bike Computers', 'Велокомпютри', 'bike-computers', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 7),
('c712e6dd-3003-4000-8000-000000000008', 'Bike Racks & Stands', 'Стойки и носачи', 'bike-racks-stands', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 8),
('c712e6dd-3003-4000-8000-000000000009', 'Bike Bells & Horns', 'Звънци и клаксони', 'bike-bells-horns', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 9),
('c712e6dd-3003-4000-8000-000000000010', 'Fenders & Mudguards', 'Калници', 'bike-fenders', NULL, 'f1dc9dbe-2391-4f3b-8775-3a87d21886f4', 10),

-- L3 under Bike Clothing (c0976ffb-341d-4dca-9b62-5a89647e6c50)
('c712e6dd-3004-4000-8000-000000000001', 'Cycling Jerseys', 'Велосипедни фланелки', 'cycling-jerseys', NULL, 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 1),
('c712e6dd-3004-4000-8000-000000000002', 'Cycling Shorts', 'Велосипедни шорти', 'cycling-shorts', NULL, 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 2),
('c712e6dd-3004-4000-8000-000000000003', 'Cycling Gloves', 'Велосипедни ръкавици', 'cycling-gloves', NULL, 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 3),
('c712e6dd-3004-4000-8000-000000000004', 'Cycling Shoes', 'Велосипедни обувки', 'cycling-shoes', NULL, 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 4),
('c712e6dd-3004-4000-8000-000000000005', 'Cycling Jackets', 'Велосипедни якета', 'cycling-jackets', NULL, 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 5),
('c712e6dd-3004-4000-8000-000000000006', 'Cycling Socks', 'Велосипедни чорапи', 'cycling-socks', NULL, 'c0976ffb-341d-4dca-9b62-5a89647e6c50', 6);
;
