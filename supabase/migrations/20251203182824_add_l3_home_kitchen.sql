
-- Check Home structure first, then add L3
-- L3 for Furniture (assuming it exists)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Sofas & Couches', 'Дивани и канапета', 'furn-sofas', id, 1 FROM categories WHERE slug = 'furniture'
UNION ALL
SELECT 'Beds & Mattresses', 'Легла и матраци', 'furn-beds', id, 2 FROM categories WHERE slug = 'furniture'
UNION ALL
SELECT 'Tables', 'Маси', 'furn-tables', id, 3 FROM categories WHERE slug = 'furniture'
UNION ALL
SELECT 'Chairs', 'Столове', 'furn-chairs', id, 4 FROM categories WHERE slug = 'furniture'
UNION ALL
SELECT 'Storage & Shelving', 'Шкафове и рафтове', 'furn-storage', id, 5 FROM categories WHERE slug = 'furniture'
UNION ALL
SELECT 'Office Furniture', 'Офис мебели', 'furn-office', id, 6 FROM categories WHERE slug = 'furniture'
UNION ALL
SELECT 'Outdoor Furniture', 'Градински мебели', 'furn-outdoor', id, 7 FROM categories WHERE slug = 'furniture';

-- L3 for Kitchen Appliances
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Refrigerators', 'Хладилници', 'kitchen-fridge', id, 1 FROM categories WHERE slug = 'kitchen-dining'
UNION ALL
SELECT 'Ovens & Stoves', 'Фурни и печки', 'kitchen-oven', id, 2 FROM categories WHERE slug = 'kitchen-dining'
UNION ALL
SELECT 'Dishwashers', 'Съдомиялни', 'kitchen-dishwasher', id, 3 FROM categories WHERE slug = 'kitchen-dining'
UNION ALL
SELECT 'Microwaves', 'Микровълнови', 'kitchen-microwave', id, 4 FROM categories WHERE slug = 'kitchen-dining'
UNION ALL
SELECT 'Coffee Machines', 'Кафе машини', 'kitchen-coffee', id, 5 FROM categories WHERE slug = 'kitchen-dining'
UNION ALL
SELECT 'Blenders & Mixers', 'Блендери и миксери', 'kitchen-blender', id, 6 FROM categories WHERE slug = 'kitchen-dining'
UNION ALL
SELECT 'Cookware & Bakeware', 'Съдове за готвене', 'kitchen-cookware', id, 7 FROM categories WHERE slug = 'kitchen-dining';

-- L3 for Cleaning Supplies (assuming it exists under home)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Vacuum Cleaners', 'Прахосмукачки', 'clean-vacuum', id, 1 FROM categories WHERE slug = 'cleaning-supplies'
UNION ALL
SELECT 'Robot Vacuums', 'Робот прахосмукачки', 'clean-robot', id, 2 FROM categories WHERE slug = 'cleaning-supplies'
UNION ALL
SELECT 'Steam Cleaners', 'Парочистачки', 'clean-steam', id, 3 FROM categories WHERE slug = 'cleaning-supplies'
UNION ALL
SELECT 'Mops & Brooms', 'Мопове и метли', 'clean-mops', id, 4 FROM categories WHERE slug = 'cleaning-supplies'
UNION ALL
SELECT 'Cleaning Products', 'Почистващи препарати', 'clean-products', id, 5 FROM categories WHERE slug = 'cleaning-supplies';
;
