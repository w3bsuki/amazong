
-- Phase 3.4.5: Kids L3 Categories - Nursery & Toys

-- Crib Mattresses L3 (parent: crib-mattresses)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Mini Crib Mattress', 'Standard Crib Mattress', 'Waterproof Mattress', 'Hypoallergenic']),
  unnest(ARRAY['cribmat-mini', 'cribmat-std', 'cribmat-water', 'cribmat-hypo']),
  (SELECT id FROM categories WHERE slug = 'crib-mattresses'),
  unnest(ARRAY['Мини', 'Стандартни', 'Водоустойчиви', 'Хипоалергенни']),
  '🛏️'
ON CONFLICT (slug) DO NOTHING;

-- Cribs L3 (parent: cribs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Standard Cribs', 'Convertible Cribs', 'Mini Cribs', 'Portable Cribs', 'Round Cribs']),
  unnest(ARRAY['crib-std', 'crib-convert', 'crib-mini', 'crib-portable', 'crib-round']),
  (SELECT id FROM categories WHERE slug = 'cribs'),
  unnest(ARRAY['Стандартни', 'Трансформиращи се', 'Мини', 'Преносими', 'Кръгли']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Cribs & Bassinets L3 (parent: nursery-cribs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['4-in-1 Cribs', '3-in-1 Cribs', 'Co-Sleepers', 'Travel Cribs']),
  unnest(ARRAY['ncrib-4in1', 'ncrib-3in1', 'ncrib-cosleep', 'ncrib-travel']),
  (SELECT id FROM categories WHERE slug = 'nursery-cribs'),
  unnest(ARRAY['4-в-1', '3-в-1', 'Co-Sleepers', 'За пътуване']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Dressers L3 (parent: nursery-dressers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['3-Drawer Dressers', '4-Drawer Dressers', '6-Drawer Dressers', 'Dresser Toppers', 'Combo Dressers']),
  unnest(ARRAY['dresser-3', 'dresser-4', 'dresser-6', 'dresser-top', 'dresser-combo']),
  (SELECT id FROM categories WHERE slug = 'nursery-dressers'),
  unnest(ARRAY['3 чекмеджета', '4 чекмеджета', '6 чекмеджета', 'С топер', 'Комбинирани']),
  '🗄️'
ON CONFLICT (slug) DO NOTHING;

-- Gliders & Rockers L3 (parent: nursery-gliders)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Glider Chairs', 'Rocking Chairs', 'Recliners', 'Ottomans', 'Swivel Gliders']),
  unnest(ARRAY['glider-chair', 'glider-rock', 'glider-recline', 'glider-ottoman', 'glider-swivel']),
  (SELECT id FROM categories WHERE slug = 'nursery-gliders'),
  unnest(ARRAY['Глайдери', 'Люлеещи', 'Реклайнери', 'Табуретки', 'Въртящи се']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Kids Bedroom L3 (parent: nursery-kids-bedroom)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Kids Beds', 'Bunk Beds', 'Loft Beds', 'Kids Desks', 'Kids Chairs', 'Kids Storage']),
  unnest(ARRAY['kbed-bed', 'kbed-bunk', 'kbed-loft', 'kbed-desk', 'kbed-chair', 'kbed-storage']),
  (SELECT id FROM categories WHERE slug = 'nursery-kids-bedroom'),
  unnest(ARRAY['Детски легла', 'Двуетажни', 'Високи легла', 'Бюра', 'Столове', 'Съхранение']),
  '🛏️'
ON CONFLICT (slug) DO NOTHING;

-- Mattresses & Bedding L3 (parent: nursery-bedding)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Toddler Mattresses', 'Mattress Protectors', 'Quilts', 'Duvet Covers', 'Pillow Cases']),
  unnest(ARRAY['nbed-toddler', 'nbed-protect', 'nbed-quilt', 'nbed-duvet', 'nbed-pillow']),
  (SELECT id FROM categories WHERE slug = 'nursery-bedding'),
  unnest(ARRAY['За малки деца', 'Протектори', 'Юргани', 'Спално бельо', 'Калъфки']),
  '🛏️'
ON CONFLICT (slug) DO NOTHING;

-- Night Lights L3 (parent: night-lights)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Plug-In Lights', 'Portable Lights', 'Projector Lights', 'Color Changing', 'Smart Lights', 'Animal Lights']),
  unnest(ARRAY['nlight-plug', 'nlight-portable', 'nlight-project', 'nlight-color', 'nlight-smart', 'nlight-animal']),
  (SELECT id FROM categories WHERE slug = 'night-lights'),
  unnest(ARRAY['За контакт', 'Преносими', 'Прожектори', 'Сменящи цвят', 'Смарт', 'Животни']),
  '💡'
ON CONFLICT (slug) DO NOTHING;

-- Nursery Décor L3 (parent: nursery-decor)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Wall Art', 'Mobiles', 'Rugs', 'Curtains', 'Wall Decals', 'Photo Frames']),
  unnest(ARRAY['ndecor-art', 'ndecor-mobile', 'ndecor-rug', 'ndecor-curtain', 'ndecor-decal', 'ndecor-frame']),
  (SELECT id FROM categories WHERE slug = 'nursery-decor'),
  unnest(ARRAY['Стенни картини', 'Въртележки', 'Килими', 'Завеси', 'Стикери', 'Рамки']),
  '🎨'
ON CONFLICT (slug) DO NOTHING;

-- Nursery Furniture L3 (parent: nursery-furniture)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Furniture Sets', 'Bookcases', 'Toy Boxes', 'Nightstands', 'Armoires']),
  unnest(ARRAY['nfurn-set', 'nfurn-book', 'nfurn-toybox', 'nfurn-night', 'nfurn-armoire']),
  (SELECT id FROM categories WHERE slug = 'nursery-furniture'),
  unnest(ARRAY['Комплекти', 'Библиотеки', 'Кутии за играчки', 'Нощни шкафчета', 'Гардероби']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Nursery Storage L3 (parent: nursery-storage)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Storage Bins', 'Closet Organizers', 'Hanging Storage', 'Baskets', 'Shelving Units']),
  unnest(ARRAY['nstor-bin', 'nstor-closet', 'nstor-hang', 'nstor-basket', 'nstor-shelf']),
  (SELECT id FROM categories WHERE slug = 'nursery-storage'),
  unnest(ARRAY['Кутии', 'За гардероб', 'Висящи', 'Кошници', 'Рафтове']),
  '📦'
ON CONFLICT (slug) DO NOTHING;

-- Baby & Toddler Toys L3 (parent: toys-baby)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Rattles', 'Teethers', 'Stacking Toys', 'Push Toys', 'Pull Toys', 'Activity Centers', 'Walkers']),
  unnest(ARRAY['btoy-rattle', 'btoy-teeth', 'btoy-stack', 'btoy-push', 'btoy-pull', 'btoy-activity', 'btoy-walker']),
  (SELECT id FROM categories WHERE slug = 'toys-baby'),
  unnest(ARRAY['Дрънкалки', 'Гризалки', 'Кули', 'За бутане', 'За теглене', 'Центрове', 'Проходилки']),
  '🧸'
ON CONFLICT (slug) DO NOTHING;

-- Electronic Toys L3 (parent: toys-electronic)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Learning Tablets', 'Musical Toys', 'Robot Toys', 'RC Toys', 'Interactive Toys', 'Gaming Toys']),
  unnest(ARRAY['etoy-tablet', 'etoy-music', 'etoy-robot', 'etoy-rc', 'etoy-interact', 'etoy-gaming']),
  (SELECT id FROM categories WHERE slug = 'toys-electronic'),
  unnest(ARRAY['Таблети', 'Музикални', 'Роботи', 'С дистанционно', 'Интерактивни', 'За игри']),
  '🤖'
ON CONFLICT (slug) DO NOTHING;

-- Plush & Stuffed Toys L3 (parent: plush-toys)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Teddy Bears', 'Animal Plush', 'Character Plush', 'Giant Plush', 'Weighted Plush', 'Musical Plush']),
  unnest(ARRAY['plush-bear', 'plush-animal', 'plush-character', 'plush-giant', 'plush-weighted', 'plush-music']),
  (SELECT id FROM categories WHERE slug = 'plush-toys'),
  unnest(ARRAY['Мечета', 'Животни', 'Герои', 'Големи', 'С тежест', 'Музикални']),
  '🧸'
ON CONFLICT (slug) DO NOTHING;

-- Pretend Play L3 (parent: toys-pretend)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Kitchen Sets', 'Doctor Kits', 'Tool Sets', 'Dress Up', 'Dolls & Accessories', 'Play Houses']),
  unnest(ARRAY['pretend-kitchen', 'pretend-doctor', 'pretend-tools', 'pretend-dress', 'pretend-dolls', 'pretend-house']),
  (SELECT id FROM categories WHERE slug = 'toys-pretend'),
  unnest(ARRAY['Кухни', 'Доктор комплекти', 'Инструменти', 'Костюми', 'Кукли', 'Къщички']),
  '🎭'
ON CONFLICT (slug) DO NOTHING;
;
