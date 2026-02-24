-- Restore Beauty L3 categories
-- Face Makeup L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Foundation', 'makeup-foundation', 'Фон дьо тен', 1),
  ('Concealer', 'makeup-concealer', 'Коректор', 2),
  ('Powder', 'makeup-powder', 'Пудра', 3),
  ('Blush', 'makeup-blush', 'Руж', 4),
  ('Bronzer', 'makeup-bronzer', 'Бронзант', 5),
  ('Highlighter', 'makeup-highlighter', 'Хайлайтър', 6),
  ('Primer', 'makeup-primer', 'Праймър', 7),
  ('Setting Spray', 'makeup-setting-spray', 'Фиксиращ спрей', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'face-makeup'
ON CONFLICT (slug) DO NOTHING;

-- Eye Makeup L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Eyeshadow Palettes', 'makeup-eyeshadow-palettes', 'Палитри сенки', 1),
  ('Single Eyeshadows', 'makeup-eyeshadow-singles', 'Единични сенки', 2),
  ('Mascara', 'makeup-mascara', 'Спирала', 3),
  ('Eyeliner', 'makeup-eyeliner', 'Очна линия', 4),
  ('Eyebrow Products', 'makeup-eyebrows', 'Продукти за вежди', 5),
  ('False Lashes', 'makeup-false-lashes', 'Изкуствени мигли', 6),
  ('Eye Primer', 'makeup-eye-primer', 'Праймър за очи', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'eye-makeup'
ON CONFLICT (slug) DO NOTHING;

-- Lip Makeup L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Lipstick', 'makeup-lipstick', 'Червило', 1),
  ('Lip Gloss', 'makeup-lip-gloss', 'Гланц за устни', 2),
  ('Liquid Lipstick', 'makeup-liquid-lipstick', 'Течно червило', 3),
  ('Lip Liner', 'makeup-lip-liner', 'Молив за устни', 4),
  ('Lip Balm', 'makeup-lip-balm', 'Балсам за устни', 5),
  ('Lip Plumper', 'makeup-lip-plumper', 'Уголемител за устни', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'lip-makeup'
ON CONFLICT (slug) DO NOTHING;

-- Skincare L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Face Cleanser', 'skincare-cleanser', 'Почистващ гел', 1),
  ('Face Wash', 'skincare-face-wash', 'Пяна за измиване', 2),
  ('Micellar Water', 'skincare-micellar', 'Мицеларна вода', 3),
  ('Makeup Remover', 'skincare-makeup-remover', 'Дегримьор', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'cleansers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Day Cream', 'skincare-day-cream', 'Дневен крем', 1),
  ('Night Cream', 'skincare-night-cream', 'Нощен крем', 2),
  ('Gel Moisturizer', 'skincare-gel-moisturizer', 'Хидратиращ гел', 3),
  ('Face Oil', 'skincare-face-oil', 'Масло за лице', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'moisturizers'
ON CONFLICT (slug) DO NOTHING;

-- Fragrance L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Women''s Perfume', 'fragrance-womens-perfume', 'Дамски парфюм', 1),
  ('Women''s EDT', 'fragrance-womens-edt', 'Дамска тоалетна вода', 2),
  ('Women''s Gift Sets', 'fragrance-womens-sets', 'Дамски комплекти', 3)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'fragrance-women'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Men''s Cologne', 'fragrance-mens-cologne', 'Мъжки одеколон', 1),
  ('Men''s EDT', 'fragrance-mens-edt', 'Мъжка тоалетна вода', 2),
  ('Men''s EDP', 'fragrance-mens-edp', 'Мъжка парфюмна вода', 3),
  ('Men''s Gift Sets', 'fragrance-mens-sets', 'Мъжки комплекти', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'fragrance-men'
ON CONFLICT (slug) DO NOTHING;

-- Hair Care L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Shampoo', 'haircare-shampoo', 'Шампоан', 1),
  ('Conditioner', 'haircare-conditioner', 'Балсам', 2),
  ('Hair Mask', 'haircare-mask', 'Маска за коса', 3),
  ('Hair Oil', 'haircare-oil', 'Масло за коса', 4),
  ('Leave-In Treatment', 'haircare-leave-in', 'Несмиваема грижа', 5),
  ('Scalp Treatment', 'haircare-scalp', 'Грижа за скалпа', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'haircare'
ON CONFLICT (slug) DO NOTHING;;
