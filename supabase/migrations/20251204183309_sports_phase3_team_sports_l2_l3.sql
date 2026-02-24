
-- Phase 3a: Add L2 and L3 for Team Sports
-- Team Sports L1 ID: b9cf08ae-b177-45ee-bd4c-9af673b479e4

INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order) VALUES
-- L2: Football/Soccer
('b9cf08ae-2001-4000-8000-000000000001', 'Football', 'Футбол', 'team-football', '⚽', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 1),
('b9cf08ae-2002-4000-8000-000000000001', 'Football Balls', 'Футболни топки', 'football-balls', NULL, 'b9cf08ae-2001-4000-8000-000000000001', 1),
('b9cf08ae-2002-4000-8000-000000000002', 'Football Boots', 'Футболни обувки', 'football-boots', NULL, 'b9cf08ae-2001-4000-8000-000000000001', 2),
('b9cf08ae-2002-4000-8000-000000000003', 'Football Jerseys', 'Футболни фланелки', 'football-jerseys', NULL, 'b9cf08ae-2001-4000-8000-000000000001', 3),
('b9cf08ae-2002-4000-8000-000000000004', 'Football Shin Guards', 'Кори за футбол', 'football-shin-guards', NULL, 'b9cf08ae-2001-4000-8000-000000000001', 4),
('b9cf08ae-2002-4000-8000-000000000005', 'Football Goals', 'Футболни врати', 'football-goals', NULL, 'b9cf08ae-2001-4000-8000-000000000001', 5),
('b9cf08ae-2002-4000-8000-000000000006', 'Football Training', 'Тренировъчно оборудване', 'football-training', NULL, 'b9cf08ae-2001-4000-8000-000000000001', 6),

-- L2: Basketball
('b9cf08ae-2003-4000-8000-000000000001', 'Basketball', 'Баскетбол', 'team-basketball', '🏀', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 2),
('b9cf08ae-2003-4000-8000-000000000002', 'Basketball Balls', 'Баскетболни топки', 'basketball-balls', NULL, 'b9cf08ae-2003-4000-8000-000000000001', 1),
('b9cf08ae-2003-4000-8000-000000000003', 'Basketball Shoes', 'Баскетболни обувки', 'basketball-shoes', NULL, 'b9cf08ae-2003-4000-8000-000000000001', 2),
('b9cf08ae-2003-4000-8000-000000000004', 'Basketball Hoops', 'Баскетболни кошове', 'basketball-hoops', NULL, 'b9cf08ae-2003-4000-8000-000000000001', 3),
('b9cf08ae-2003-4000-8000-000000000005', 'Basketball Jerseys', 'Баскетболни фланелки', 'basketball-jerseys', NULL, 'b9cf08ae-2003-4000-8000-000000000001', 4),

-- L2: Volleyball
('b9cf08ae-2004-4000-8000-000000000001', 'Volleyball', 'Волейбол', 'team-volleyball', '🏐', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 3),
('b9cf08ae-2004-4000-8000-000000000002', 'Volleyball Balls', 'Волейболни топки', 'volleyball-balls', NULL, 'b9cf08ae-2004-4000-8000-000000000001', 1),
('b9cf08ae-2004-4000-8000-000000000003', 'Volleyball Nets', 'Волейболни мрежи', 'volleyball-nets', NULL, 'b9cf08ae-2004-4000-8000-000000000001', 2),
('b9cf08ae-2004-4000-8000-000000000004', 'Volleyball Shoes', 'Волейболни обувки', 'volleyball-shoes', NULL, 'b9cf08ae-2004-4000-8000-000000000001', 3),
('b9cf08ae-2004-4000-8000-000000000005', 'Knee Pads', 'Наколенки', 'volleyball-knee-pads', NULL, 'b9cf08ae-2004-4000-8000-000000000001', 4),

-- L2: Handball
('b9cf08ae-2005-4000-8000-000000000001', 'Handball', 'Хандбал', 'team-handball', '🤾', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 4),
('b9cf08ae-2005-4000-8000-000000000002', 'Handball Balls', 'Хандбални топки', 'handball-balls', NULL, 'b9cf08ae-2005-4000-8000-000000000001', 1),
('b9cf08ae-2005-4000-8000-000000000003', 'Handball Shoes', 'Хандбални обувки', 'handball-shoes', NULL, 'b9cf08ae-2005-4000-8000-000000000001', 2),

-- L2: Rugby
('b9cf08ae-2006-4000-8000-000000000001', 'Rugby', 'Ръгби', 'team-rugby', '🏉', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 5),
('b9cf08ae-2006-4000-8000-000000000002', 'Rugby Balls', 'Ръгби топки', 'rugby-balls', NULL, 'b9cf08ae-2006-4000-8000-000000000001', 1),
('b9cf08ae-2006-4000-8000-000000000003', 'Rugby Protective Gear', 'Защитно оборудване за ръгби', 'rugby-protective', NULL, 'b9cf08ae-2006-4000-8000-000000000001', 2),

-- L2: American Football
('b9cf08ae-2007-4000-8000-000000000001', 'American Football', 'Американски футбол', 'american-football', '🏈', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 6),
('b9cf08ae-2007-4000-8000-000000000002', 'American Football Balls', 'Топки за американски футбол', 'american-football-balls', NULL, 'b9cf08ae-2007-4000-8000-000000000001', 1),
('b9cf08ae-2007-4000-8000-000000000003', 'Football Helmets', 'Каски за американски футбол', 'american-football-helmets', NULL, 'b9cf08ae-2007-4000-8000-000000000001', 2),
('b9cf08ae-2007-4000-8000-000000000004', 'Football Pads', 'Протектори за американски футбол', 'american-football-pads', NULL, 'b9cf08ae-2007-4000-8000-000000000001', 3),

-- L2: Hockey
('b9cf08ae-2008-4000-8000-000000000001', 'Hockey', 'Хокей', 'team-hockey', '🏒', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 7),
('b9cf08ae-2008-4000-8000-000000000002', 'Hockey Sticks', 'Хокейни стикове', 'hockey-sticks', NULL, 'b9cf08ae-2008-4000-8000-000000000001', 1),
('b9cf08ae-2008-4000-8000-000000000003', 'Hockey Pucks', 'Шайби', 'hockey-pucks', NULL, 'b9cf08ae-2008-4000-8000-000000000001', 2),
('b9cf08ae-2008-4000-8000-000000000004', 'Hockey Skates', 'Хокейни кънки', 'hockey-skates', NULL, 'b9cf08ae-2008-4000-8000-000000000001', 3),
('b9cf08ae-2008-4000-8000-000000000005', 'Hockey Protective Gear', 'Хокейни предпазители', 'hockey-protective', NULL, 'b9cf08ae-2008-4000-8000-000000000001', 4),

-- L2: Baseball & Softball
('b9cf08ae-2009-4000-8000-000000000001', 'Baseball & Softball', 'Бейзбол и софтбол', 'baseball-softball', '⚾', 'b9cf08ae-b177-45ee-bd4c-9af673b479e4', 8),
('b9cf08ae-2009-4000-8000-000000000002', 'Baseball Bats', 'Бухалки за бейзбол', 'baseball-bats', NULL, 'b9cf08ae-2009-4000-8000-000000000001', 1),
('b9cf08ae-2009-4000-8000-000000000003', 'Baseball Gloves', 'Ръкавици за бейзбол', 'baseball-gloves', NULL, 'b9cf08ae-2009-4000-8000-000000000001', 2),
('b9cf08ae-2009-4000-8000-000000000004', 'Baseballs & Softballs', 'Топки за бейзбол и софтбол', 'baseballs', NULL, 'b9cf08ae-2009-4000-8000-000000000001', 3),
('b9cf08ae-2009-4000-8000-000000000005', 'Baseball Helmets', 'Каски за бейзбол', 'baseball-helmets', NULL, 'b9cf08ae-2009-4000-8000-000000000001', 4);
;
