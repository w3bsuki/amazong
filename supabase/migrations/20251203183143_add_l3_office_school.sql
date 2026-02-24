
-- L3 for Office Supplies
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Pens & Pencils', 'Химикалки и моливи', 'office-pens', id, 1 FROM categories WHERE slug = 'office-supplies'
UNION ALL
SELECT 'Notebooks & Paper', 'Тетрадки и хартия', 'office-notebooks', id, 2 FROM categories WHERE slug = 'office-supplies'
UNION ALL
SELECT 'Folders & Binders', 'Папки и класьори', 'office-folders', id, 3 FROM categories WHERE slug = 'office-supplies'
UNION ALL
SELECT 'Desk Organizers', 'Органайзери за бюро', 'office-organizers', id, 4 FROM categories WHERE slug = 'office-supplies'
UNION ALL
SELECT 'Staplers & Punches', 'Телбоди и перфоратори', 'office-staplers', id, 5 FROM categories WHERE slug = 'office-supplies';

-- L3 for Printers & Ink
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Inkjet Printers', 'Мастиленоструйни принтери', 'printers-inkjet', id, 1 FROM categories WHERE slug = 'printers'
UNION ALL
SELECT 'Laser Printers', 'Лазерни принтери', 'printers-laser', id, 2 FROM categories WHERE slug = 'printers'
UNION ALL
SELECT 'Ink Cartridges', 'Касети с мастило', 'printers-ink', id, 3 FROM categories WHERE slug = 'printers'
UNION ALL
SELECT 'Toner Cartridges', 'Тонер касети', 'printers-toner', id, 4 FROM categories WHERE slug = 'printers'
UNION ALL
SELECT '3D Printers', '3D принтери', 'printers-3d', id, 5 FROM categories WHERE slug = 'printers';

-- L3 for School Supplies
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Backpacks', 'Раници', 'school-backpacks', id, 1 FROM categories WHERE slug = 'school-supplies'
UNION ALL
SELECT 'Pencil Cases', 'Несесери', 'school-pencilcases', id, 2 FROM categories WHERE slug = 'school-supplies'
UNION ALL
SELECT 'Art Supplies', 'Материали за изобразително изкуство', 'school-art', id, 3 FROM categories WHERE slug = 'school-supplies'
UNION ALL
SELECT 'Calculators', 'Калкулатори', 'school-calculators', id, 4 FROM categories WHERE slug = 'school-supplies'
UNION ALL
SELECT 'Textbooks', 'Учебници', 'school-textbooks', id, 5 FROM categories WHERE slug = 'school-supplies';
;
