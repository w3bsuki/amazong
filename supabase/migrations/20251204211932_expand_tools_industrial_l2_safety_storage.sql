-- =====================================================
-- L2 Categories for Safety Equipment (aff61829-7b35-4858-8f74-1d0a3aa9a29d)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Hard Hats & Helmets', 'Каски', 'safety-hard-hats', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '⛑️', 'Construction and safety hard hats', 'Строителни и предпазни каски', 1),
  (gen_random_uuid(), 'Safety Glasses', 'Предпазни очила', 'safety-glasses', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '🥽', 'Safety glasses and goggles', 'Предпазни очила и маски', 2),
  (gen_random_uuid(), 'Work Gloves', 'Работни ръкавици', 'safety-gloves', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '🧤', 'Cut-resistant, chemical, welding gloves', 'Антисрезни, химически, заваръчни ръкавици', 3),
  (gen_random_uuid(), 'Respirators & Masks', 'Респиратори и маски', 'safety-respirators', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '😷', 'Dust masks, respirators, filters', 'Прахови маски, респиратори, филтри', 4),
  (gen_random_uuid(), 'Ear Protection', 'Защита за слуха', 'safety-ear-protection', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '🎧', 'Earmuffs, earplugs, hearing protection', 'Антифони, тапи за уши', 5),
  (gen_random_uuid(), 'Fall Protection', 'Защита от падане', 'safety-fall-protection', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '🪢', 'Harnesses, lanyards, anchors', 'Колани, въжета, точки за закрепване', 6),
  (gen_random_uuid(), 'Work Boots', 'Работни обувки', 'safety-work-boots', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '👢', 'Steel toe, composite toe boots', 'Обувки с метално, композитно бомбе', 7),
  (gen_random_uuid(), 'Hi-Vis Clothing', 'Светлоотразително облекло', 'safety-hi-vis', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '🦺', 'High visibility vests, jackets, pants', 'Светлоотразителни жилетки, якета, панталони', 8),
  (gen_random_uuid(), 'Knee Pads', 'Наколенки', 'safety-knee-pads', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '🦵', 'Professional knee pads', 'Професионални наколенки', 9),
  (gen_random_uuid(), 'First Aid Kits', 'Аптечки', 'safety-first-aid', 'aff61829-7b35-4858-8f74-1d0a3aa9a29d', '🏥', 'Workplace first aid kits', 'Работни аптечки', 10);

-- =====================================================
-- L2 Categories for Tool Storage (7b834eca-2355-47db-bb02-7ef509eafaa6)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Tool Boxes', 'Куфари за инструменти', 'storage-tool-boxes', '7b834eca-2355-47db-bb02-7ef509eafaa6', '🧰', 'Portable tool boxes and cases', 'Преносими куфари и кутии', 1),
  (gen_random_uuid(), 'Tool Chests', 'Сандъци за инструменти', 'storage-tool-chests', '7b834eca-2355-47db-bb02-7ef509eafaa6', '📦', 'Rolling and stationary tool chests', 'Подвижни и стационарни сандъци', 2),
  (gen_random_uuid(), 'Workbenches', 'Работни маси', 'storage-workbenches', '7b834eca-2355-47db-bb02-7ef509eafaa6', '🔧', 'Steel, wood, folding workbenches', 'Стоманени, дървени, сгъваеми маси', 3),
  (gen_random_uuid(), 'Tool Cabinets', 'Шкафове за инструменти', 'storage-tool-cabinets', '7b834eca-2355-47db-bb02-7ef509eafaa6', '🗄️', 'Garage and shop tool cabinets', 'Гаражни и работилнични шкафове', 4),
  (gen_random_uuid(), 'Parts Organizers', 'Органайзери за части', 'storage-parts-organizers', '7b834eca-2355-47db-bb02-7ef509eafaa6', '📋', 'Small parts bins and organizers', 'Кутии и органайзери за малки части', 5),
  (gen_random_uuid(), 'Tool Belts & Pouches', 'Колани и калъфи', 'storage-tool-belts', '7b834eca-2355-47db-bb02-7ef509eafaa6', '🎒', 'Tool belts, pouches, aprons', 'Колани, калъфи, престилки', 6),
  (gen_random_uuid(), 'Tool Bags', 'Чанти за инструменти', 'storage-tool-bags', '7b834eca-2355-47db-bb02-7ef509eafaa6', '👜', 'Soft-sided tool bags and totes', 'Меки чанти и торби', 7),
  (gen_random_uuid(), 'Wall Storage', 'Стенно съхранение', 'storage-wall', '7b834eca-2355-47db-bb02-7ef509eafaa6', '🔲', 'Pegboards, slatwall, wall organizers', 'Перфорирани плоскости, организатори', 8),
  (gen_random_uuid(), 'Garage Systems', 'Гаражни системи', 'storage-garage', '7b834eca-2355-47db-bb02-7ef509eafaa6', '🏠', 'Complete garage organization systems', 'Цялостни системи за гараж', 9)
ON CONFLICT (slug) DO NOTHING;;
