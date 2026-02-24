
-- Add L3 categories for Storage & Organization
INSERT INTO categories (name, name_bg, slug, parent_id) VALUES
-- Baskets & Bins (97540ba3-9c4b-458f-a9e2-88d880efcb31)
('Wicker Baskets', 'Плетени кошници', 'baskets-wicker', '97540ba3-9c4b-458f-a9e2-88d880efcb31'),
('Fabric Bins', 'Текстилни кутии', 'baskets-fabric', '97540ba3-9c4b-458f-a9e2-88d880efcb31'),
('Wire Baskets', 'Метални кошници', 'baskets-wire', '97540ba3-9c4b-458f-a9e2-88d880efcb31'),
('Decorative Baskets', 'Декоративни кошници', 'baskets-decorative', '97540ba3-9c4b-458f-a9e2-88d880efcb31'),

-- Closet Organizers (005ec396-d928-495d-b223-8540910b4543)
('Closet Systems', 'Гардеробни системи', 'closet-systems', '005ec396-d928-495d-b223-8540910b4543'),
('Hanging Organizers', 'Висящи органайзери', 'closet-hanging', '005ec396-d928-495d-b223-8540910b4543'),
('Shelf Dividers', 'Разделители за рафтове', 'closet-dividers', '005ec396-d928-495d-b223-8540910b4543'),
('Clothing Storage', 'Съхранение на дрехи', 'closet-clothing', '005ec396-d928-495d-b223-8540910b4543'),

-- Drawer Organizers (d9e135d3-b710-43df-a238-dab16aa8fbb5)
('Drawer Dividers', 'Разделители за чекмеджета', 'drawer-dividers', 'd9e135d3-b710-43df-a238-dab16aa8fbb5'),
('Jewelry Organizers', 'Органайзери за бижута', 'drawer-jewelry', 'd9e135d3-b710-43df-a238-dab16aa8fbb5'),
('Utensil Trays', 'Тавички за прибори', 'drawer-utensil', 'd9e135d3-b710-43df-a238-dab16aa8fbb5'),
('Makeup Organizers', 'Органайзери за козметика', 'drawer-makeup', 'd9e135d3-b710-43df-a238-dab16aa8fbb5'),

-- Garage & Workshop (0c89b9af-2cea-4b19-8325-70d6f73e6d70)
('Tool Storage', 'Съхранение на инструменти', 'garage-tools', '0c89b9af-2cea-4b19-8325-70d6f73e6d70'),
('Wall Organization', 'Стенна организация', 'garage-wall', '0c89b9af-2cea-4b19-8325-70d6f73e6d70'),
('Workbenches', 'Работни маси', 'garage-workbenches', '0c89b9af-2cea-4b19-8325-70d6f73e6d70'),
('Ceiling Storage', 'Таванно съхранение', 'garage-ceiling', '0c89b9af-2cea-4b19-8325-70d6f73e6d70'),

-- Hooks & Hangers (15a91d29-f3a3-4b7d-80aa-e25e533036c8)
('Wall Hooks', 'Стенни куки', 'hooks-wall', '15a91d29-f3a3-4b7d-80aa-e25e533036c8'),
('Over-Door Hooks', 'Куки за врата', 'hooks-door', '15a91d29-f3a3-4b7d-80aa-e25e533036c8'),
('Adhesive Hooks', 'Самозалепващи куки', 'hooks-adhesive', '15a91d29-f3a3-4b7d-80aa-e25e533036c8'),
('Clothes Hangers', 'Закачалки за дрехи', 'storage-clothes-hangers', '15a91d29-f3a3-4b7d-80aa-e25e533036c8'),

-- Laundry Organization (bd5bf830-e28e-4f20-ad45-844f96713db6)
('Laundry Baskets', 'Кошове за пране', 'laundry-storage-baskets', 'bd5bf830-e28e-4f20-ad45-844f96713db6'),
('Laundry Sorters', 'Сортиращи кошове', 'laundry-sorters', 'bd5bf830-e28e-4f20-ad45-844f96713db6'),
('Ironing Board Storage', 'Съхранение на дъска', 'laundry-ironing-storage', 'bd5bf830-e28e-4f20-ad45-844f96713db6'),

-- Shelving (f698fb73-9248-489f-b391-add8cf332c8e)
('Wall Shelves', 'Стенни рафтове', 'shelving-wall', 'f698fb73-9248-489f-b391-add8cf332c8e'),
('Floating Shelves', 'Плаващи рафтове', 'shelving-floating', 'f698fb73-9248-489f-b391-add8cf332c8e'),
('Corner Shelves', 'Ъглови рафтове', 'shelving-corner', 'f698fb73-9248-489f-b391-add8cf332c8e'),
('Freestanding Shelves', 'Свободно стоящи рафтове', 'shelving-freestanding', 'f698fb73-9248-489f-b391-add8cf332c8e'),

-- Shoe Storage (21039e2f-bf25-477b-b5af-7df8d18ccbd5)
('Shoe Racks', 'Стелажи за обувки', 'shoes-racks', '21039e2f-bf25-477b-b5af-7df8d18ccbd5'),
('Shoe Cabinets', 'Шкафове за обувки', 'shoes-cabinets', '21039e2f-bf25-477b-b5af-7df8d18ccbd5'),
('Over-Door Shoe Organizers', 'Органайзери за врата', 'shoes-door', '21039e2f-bf25-477b-b5af-7df8d18ccbd5'),
('Shoe Boxes', 'Кутии за обувки', 'shoes-boxes', '21039e2f-bf25-477b-b5af-7df8d18ccbd5'),

-- Storage Bins (f63b0804-3b52-4010-ab04-998b3137a1b1)
('Plastic Storage Bins', 'Пластмасови кутии', 'bins-plastic', 'f63b0804-3b52-4010-ab04-998b3137a1b1'),
('Clear Storage Bins', 'Прозрачни кутии', 'bins-clear', 'f63b0804-3b52-4010-ab04-998b3137a1b1'),
('Stackable Bins', 'Стекируеми кутии', 'bins-stackable', 'f63b0804-3b52-4010-ab04-998b3137a1b1'),
('Storage Totes', 'Съхранение с капак', 'bins-totes', 'f63b0804-3b52-4010-ab04-998b3137a1b1'),

-- Vacuum Storage Bags (2cb3576d-6568-4f40-8a41-6464964ae577)
('Space Saver Bags', 'Вакуумни торби', 'vacuum-space-bags', '2cb3576d-6568-4f40-8a41-6464964ae577'),
('Hanging Vacuum Bags', 'Висящи вакуумни торби', 'vacuum-hanging-bags', '2cb3576d-6568-4f40-8a41-6464964ae577'),
('Jumbo Vacuum Bags', 'Големи вакуумни торби', 'vacuum-jumbo-bags', '2cb3576d-6568-4f40-8a41-6464964ae577');
;
