
-- Garden & Outdoor L3s
INSERT INTO categories (name, name_bg, slug, parent_id) VALUES
-- Garden Hoses (9d0f890d-cc8e-4637-93ee-de063a2c794b)
('Expandable Hoses', 'Разтегливи маркучи', 'hoses-expandable', '9d0f890d-cc8e-4637-93ee-de063a2c794b'),
('Soaker Hoses', 'Капкови маркучи', 'hoses-soaker', '9d0f890d-cc8e-4637-93ee-de063a2c794b'),
('Hose Reels', 'Макари за маркучи', 'hoses-reels', '9d0f890d-cc8e-4637-93ee-de063a2c794b'),
('Hose Nozzles', 'Дюзи за маркучи', 'hoses-nozzles', '9d0f890d-cc8e-4637-93ee-de063a2c794b'),

-- Planters & Pots (85670a72-c0c7-4c6a-afec-86b4452b72e6)
('Ceramic Pots', 'Керамични саксии', 'pots-ceramic', '85670a72-c0c7-4c6a-afec-86b4452b72e6'),
('Plastic Pots', 'Пластмасови саксии', 'pots-plastic', '85670a72-c0c7-4c6a-afec-86b4452b72e6'),
('Hanging Planters', 'Висящи саксии', 'pots-hanging', '85670a72-c0c7-4c6a-afec-86b4452b72e6'),
('Self-Watering Planters', 'Саксии с автополиване', 'pots-selfwatering', '85670a72-c0c7-4c6a-afec-86b4452b72e6'),
('Window Boxes', 'Балконски сандъчета', 'pots-window', '85670a72-c0c7-4c6a-afec-86b4452b72e6'),

-- Soil & Fertilizers (c7d976bb-be8b-407c-815b-89243fb13590)
('Potting Soil', 'Почва за саксии', 'soil-potting', 'c7d976bb-be8b-407c-815b-89243fb13590'),
('Compost', 'Компост', 'soil-compost', 'c7d976bb-be8b-407c-815b-89243fb13590'),
('Fertilizers', 'Торове', 'soil-fertilizers', 'c7d976bb-be8b-407c-815b-89243fb13590'),
('Mulch', 'Мулч', 'soil-mulch', 'c7d976bb-be8b-407c-815b-89243fb13590');

-- Kitchen & Dining missing L3s
INSERT INTO categories (name, name_bg, slug, parent_id) VALUES
-- Bar Accessories (9ae0d3ec-a930-44a9-b828-959984eeb17c)
('Bar Tools', 'Барови инструменти', 'bar-tools', '9ae0d3ec-a930-44a9-b828-959984eeb17c'),
('Wine Accessories', 'Аксесоари за вино', 'bar-wine', '9ae0d3ec-a930-44a9-b828-959984eeb17c'),
('Ice Buckets', 'Ледарки', 'bar-ice', '9ae0d3ec-a930-44a9-b828-959984eeb17c'),
('Cocktail Shakers', 'Шейкъри за коктейли', 'bar-shakers', '9ae0d3ec-a930-44a9-b828-959984eeb17c'),

-- Coffee & Tea (c9a0091c-1d6f-40db-baac-076c1137ec90)
('Coffee Makers', 'Кафемашини', 'coffee-makers', 'c9a0091c-1d6f-40db-baac-076c1137ec90'),
('Espresso Machines', 'Еспресо машини', 'coffee-espresso', 'c9a0091c-1d6f-40db-baac-076c1137ec90'),
('Tea Kettles', 'Чайници', 'coffee-kettles', 'c9a0091c-1d6f-40db-baac-076c1137ec90'),
('Coffee Grinders', 'Мелачки за кафе', 'coffee-grinders', 'c9a0091c-1d6f-40db-baac-076c1137ec90'),
('French Press', 'Френска преса', 'coffee-french', 'c9a0091c-1d6f-40db-baac-076c1137ec90'),
('Coffee Mugs', 'Чаши за кафе', 'coffee-mugs', 'c9a0091c-1d6f-40db-baac-076c1137ec90'),

-- Kitchen Linens (08383a2b-6a64-4531-aca4-e283528c3883)
('Kitchen Towels', 'Кухненски кърпи', 'linens-towels', '08383a2b-6a64-4531-aca4-e283528c3883'),
('Oven Mitts', 'Ръкавици за фурна', 'linens-mitts', '08383a2b-6a64-4531-aca4-e283528c3883'),
('Aprons', 'Престилки', 'linens-aprons', '08383a2b-6a64-4531-aca4-e283528c3883'),
('Tablecloths', 'Покривки за маса', 'linens-tablecloths', '08383a2b-6a64-4531-aca4-e283528c3883'),
('Placemats', 'Подложки за хранене', 'linens-placemats', '08383a2b-6a64-4531-aca4-e283528c3883'),

-- Kitchen Organization (34ea12ab-b2fe-41aa-9251-b3f0a3fb455b)
('Spice Racks', 'Поставки за подправки', 'org-spice', '34ea12ab-b2fe-41aa-9251-b3f0a3fb455b'),
('Cabinet Organizers', 'Органайзери за шкаф', 'org-cabinet', '34ea12ab-b2fe-41aa-9251-b3f0a3fb455b'),
('Pantry Storage', 'Съхранение в килер', 'org-pantry', '34ea12ab-b2fe-41aa-9251-b3f0a3fb455b'),
('Paper Towel Holders', 'Държачи за хартия', 'org-paper', '34ea12ab-b2fe-41aa-9251-b3f0a3fb455b');

-- Home Improvement L3s
INSERT INTO categories (name, name_bg, slug, parent_id) VALUES
-- Electrical (0c9bc35e-8518-4572-9ce2-b4d0cdb0282a)
('Light Switches', 'Ключове за осветление', 'electrical-switches', '0c9bc35e-8518-4572-9ce2-b4d0cdb0282a'),
('Power Outlets', 'Контакти', 'electrical-outlets', '0c9bc35e-8518-4572-9ce2-b4d0cdb0282a'),
('Extension Cords', 'Удължители', 'electrical-cords', '0c9bc35e-8518-4572-9ce2-b4d0cdb0282a'),
('Electrical Panels', 'Електрически табла', 'electrical-panels', '0c9bc35e-8518-4572-9ce2-b4d0cdb0282a'),

-- Flooring (09a67be0-41a4-4a07-abcb-df79482ac0b4)
('Laminate Flooring', 'Ламинат', 'flooring-laminate', '09a67be0-41a4-4a07-abcb-df79482ac0b4'),
('Vinyl Flooring', 'Винилови подове', 'flooring-vinyl', '09a67be0-41a4-4a07-abcb-df79482ac0b4'),
('Hardwood Flooring', 'Дървени подове', 'flooring-hardwood', '09a67be0-41a4-4a07-abcb-df79482ac0b4'),
('Floor Tiles', 'Плочки за под', 'flooring-tiles', '09a67be0-41a4-4a07-abcb-df79482ac0b4'),

-- Hardware (a9ad993f-17e0-4544-855d-37f6e2c52bda)
('Door Handles', 'Дръжки за врата', 'hardware-handles', 'a9ad993f-17e0-4544-855d-37f6e2c52bda'),
('Cabinet Knobs', 'Дръжки за шкаф', 'hardware-knobs', 'a9ad993f-17e0-4544-855d-37f6e2c52bda'),
('Hinges', 'Панти', 'hardware-hinges', 'a9ad993f-17e0-4544-855d-37f6e2c52bda'),
('Locks', 'Брави', 'hardware-locks', 'a9ad993f-17e0-4544-855d-37f6e2c52bda'),
('Screws & Nails', 'Винтове и пирони', 'hardware-screws', 'a9ad993f-17e0-4544-855d-37f6e2c52bda'),

-- Painting & Wallpaper (e1a793e2-a792-4c8a-9ff3-5c04e9bcc6e0)
('Interior Paint', 'Интериорна боя', 'paint-interior', 'e1a793e2-a792-4c8a-9ff3-5c04e9bcc6e0'),
('Exterior Paint', 'Екстериорна боя', 'paint-exterior', 'e1a793e2-a792-4c8a-9ff3-5c04e9bcc6e0'),
('Wallpaper', 'Тапети', 'paint-wallpaper', 'e1a793e2-a792-4c8a-9ff3-5c04e9bcc6e0'),
('Paint Brushes & Rollers', 'Четки и валяци', 'paint-brushes', 'e1a793e2-a792-4c8a-9ff3-5c04e9bcc6e0'),

-- Plumbing (c9336261-4b95-4cb2-9798-771964536cf9)
('Faucets', 'Смесители', 'plumbing-faucets', 'c9336261-4b95-4cb2-9798-771964536cf9'),
('Showerheads', 'Душове', 'plumbing-showers', 'c9336261-4b95-4cb2-9798-771964536cf9'),
('Pipes & Fittings', 'Тръби и фитинги', 'plumbing-pipes', 'c9336261-4b95-4cb2-9798-771964536cf9'),
('Toilet Parts', 'Части за тоалетна', 'plumbing-toilet', 'c9336261-4b95-4cb2-9798-771964536cf9');

-- Office & School L3 (9d1566e4-2a7e-45e2-9eac-08601ccd1ede)
INSERT INTO categories (name, name_bg, slug, parent_id) VALUES
('Wall Calendars', 'Стенни календари', 'calendars-wall', '9d1566e4-2a7e-45e2-9eac-08601ccd1ede'),
('Desk Calendars', 'Настолни календари', 'calendars-desk', '9d1566e4-2a7e-45e2-9eac-08601ccd1ede'),
('Planners', 'Планери', 'planners', '9d1566e4-2a7e-45e2-9eac-08601ccd1ede'),
('Organizers', 'Органайзери', 'calendars-organizers', '9d1566e4-2a7e-45e2-9eac-08601ccd1ede');

-- Furniture - Entryway (7d68132e-acc6-45f4-a5cf-1eff1d70c45c)
INSERT INTO categories (name, name_bg, slug, parent_id) VALUES
('Coat Racks', 'Закачалки за палта', 'entryway-coatracks', '7d68132e-acc6-45f4-a5cf-1eff1d70c45c'),
('Entryway Benches', 'Пейки за входа', 'entryway-benches', '7d68132e-acc6-45f4-a5cf-1eff1d70c45c'),
('Console Tables', 'Конзолни маси', 'entryway-console', '7d68132e-acc6-45f4-a5cf-1eff1d70c45c'),
('Hall Trees', 'Мебели за входа', 'entryway-halltrees', '7d68132e-acc6-45f4-a5cf-1eff1d70c45c'),
('Umbrella Stands', 'Поставки за чадъри', 'entryway-umbrella', '7d68132e-acc6-45f4-a5cf-1eff1d70c45c');
;
