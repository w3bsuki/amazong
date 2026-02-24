
-- L3 for Makeup
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Foundation', 'Фон дьо тен', 'makeup-foundation', id, 1 FROM categories WHERE slug = 'face-makeup'
UNION ALL
SELECT 'Concealer', 'Коректор', 'makeup-concealer', id, 2 FROM categories WHERE slug = 'face-makeup'
UNION ALL
SELECT 'Powder', 'Пудра', 'makeup-powder', id, 3 FROM categories WHERE slug = 'face-makeup'
UNION ALL
SELECT 'Blush', 'Руж', 'makeup-blush', id, 4 FROM categories WHERE slug = 'face-makeup'
UNION ALL
SELECT 'Bronzer', 'Бронзант', 'makeup-bronzer', id, 5 FROM categories WHERE slug = 'face-makeup'
UNION ALL
SELECT 'Highlighter', 'Хайлайтър', 'makeup-highlighter', id, 6 FROM categories WHERE slug = 'face-makeup';

-- L3 for Eye Makeup
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Eyeshadow', 'Сенки', 'eye-shadow', id, 1 FROM categories WHERE slug = 'eye-makeup'
UNION ALL
SELECT 'Mascara', 'Спирала', 'eye-mascara', id, 2 FROM categories WHERE slug = 'eye-makeup'
UNION ALL
SELECT 'Eyeliner', 'Очна линия', 'eye-liner', id, 3 FROM categories WHERE slug = 'eye-makeup'
UNION ALL
SELECT 'Eyebrow Products', 'За вежди', 'eye-brows', id, 4 FROM categories WHERE slug = 'eye-makeup'
UNION ALL
SELECT 'False Lashes', 'Изкуствени мигли', 'eye-lashes', id, 5 FROM categories WHERE slug = 'eye-makeup';

-- L3 for Lip Makeup  
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Lipstick', 'Червило', 'lip-stick', id, 1 FROM categories WHERE slug = 'lip-makeup'
UNION ALL
SELECT 'Lip Gloss', 'Гланц', 'lip-gloss', id, 2 FROM categories WHERE slug = 'lip-makeup'
UNION ALL
SELECT 'Lip Liner', 'Молив за устни', 'lip-liner', id, 3 FROM categories WHERE slug = 'lip-makeup'
UNION ALL
SELECT 'Lip Balm', 'Балсам за устни', 'lip-balm', id, 4 FROM categories WHERE slug = 'lip-makeup';

-- L3 for Skincare
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Face Wash', 'Измиващ гел', 'skin-wash', id, 1 FROM categories WHERE slug = 'cleansers'
UNION ALL
SELECT 'Micellar Water', 'Мицеларна вода', 'skin-micellar', id, 2 FROM categories WHERE slug = 'cleansers'
UNION ALL
SELECT 'Toner', 'Тоник', 'skin-toner', id, 3 FROM categories WHERE slug = 'cleansers'
UNION ALL
SELECT 'Makeup Remover', 'Дегримьор', 'skin-remover', id, 4 FROM categories WHERE slug = 'cleansers';

-- L3 for Moisturizers
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Day Cream', 'Дневен крем', 'moist-day', id, 1 FROM categories WHERE slug = 'moisturizers'
UNION ALL
SELECT 'Night Cream', 'Нощен крем', 'moist-night', id, 2 FROM categories WHERE slug = 'moisturizers'
UNION ALL
SELECT 'Face Oil', 'Олио за лице', 'moist-oil', id, 3 FROM categories WHERE slug = 'moisturizers'
UNION ALL
SELECT 'Gel Moisturizer', 'Гел хидратант', 'moist-gel', id, 4 FROM categories WHERE slug = 'moisturizers';
;
