
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 3A: L3 Categories for RINGS
-- Date: December 4, 2025
-- ==============================================

-- L3 under Engagement Rings
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'rings-engagement'), v.icon, v.display_order
FROM (VALUES
    ('Solitaire', 'Солитер', 'engagement-solitaire', '💍', 1),
    ('Halo', 'Хало', 'engagement-halo', '⭕', 2),
    ('Three-Stone', 'Три камъка', 'engagement-three-stone', '💎', 3),
    ('Side Stones', 'Странични камъни', 'engagement-side-stones', '✨', 4),
    ('Vintage Style', 'Винтидж стил', 'engagement-vintage', '🏛️', 5),
    ('Bezel Set', 'Безел', 'engagement-bezel', '🔵', 6),
    ('Pavé', 'Паве', 'engagement-pave', '💠', 7),
    ('Princess Cut', 'Принцеса', 'engagement-princess', '👑', 8),
    ('Cushion Cut', 'Кушон', 'engagement-cushion', '🔷', 9),
    ('Oval Cut', 'Овал', 'engagement-oval', '⬭', 10),
    ('Emerald Cut', 'Изумрудена форма', 'engagement-emerald', '📐', 11),
    ('Pear Shape', 'Круша', 'engagement-pear', '🍐', 12)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Wedding Bands
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'rings-wedding'), v.icon, v.display_order
FROM (VALUES
    ('Classic Plain Bands', 'Класически халки', 'wedding-classic', '⚪', 1),
    ('Diamond Bands', 'Халки с диаманти', 'wedding-diamond', '💎', 2),
    ('Eternity Bands', 'Вечни халки', 'wedding-eternity', '♾️', 3),
    ('Matching Sets', 'Чифт халки', 'wedding-sets', '💑', 4),
    ('Milgrain Bands', 'Милгрейн халки', 'wedding-milgrain', '⭕', 5),
    ('Curved & Contour', 'Извити халки', 'wedding-curved', '🌙', 6),
    ('Men''s Wedding Bands', 'Мъжки сватбени халки', 'wedding-mens', '🧔', 7),
    ('Women''s Wedding Bands', 'Дамски сватбени халки', 'wedding-womens', '👰', 8),
    ('Two-Tone Bands', 'Двуцветни халки', 'wedding-twotone', '🌓', 9)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Gemstone Rings
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'rings-gemstone'), v.icon, v.display_order
FROM (VALUES
    ('Diamond Rings', 'Пръстени с диаманти', 'gemstone-diamond', '💎', 1),
    ('Ruby Rings', 'Пръстени с рубин', 'gemstone-ruby', '🔴', 2),
    ('Sapphire Rings', 'Пръстени със сапфир', 'gemstone-sapphire', '🔵', 3),
    ('Emerald Rings', 'Пръстени с изумруд', 'gemstone-emerald', '🟢', 4),
    ('Opal Rings', 'Пръстени с опал', 'gemstone-opal', '🌈', 5),
    ('Amethyst Rings', 'Пръстени с аметист', 'gemstone-amethyst', '🟣', 6),
    ('Topaz Rings', 'Пръстени с топаз', 'gemstone-topaz', '🟡', 7),
    ('Aquamarine Rings', 'Пръстени с аквамарин', 'gemstone-aquamarine', '💠', 8),
    ('Tanzanite Rings', 'Пръстени с танзанит', 'gemstone-tanzanite', '🔮', 9),
    ('Morganite Rings', 'Пръстени с морганит', 'gemstone-morganite', '🌸', 10)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Men's Rings
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'rings-mens'), v.icon, v.display_order
FROM (VALUES
    ('Men''s Wedding Bands', 'Мъжки сватбени халки', 'mens-wedding-bands', '💒', 1),
    ('Signet Rings', 'Печатни пръстени', 'mens-signet', '👤', 2),
    ('Class Rings', 'Абитуриентски пръстени', 'mens-class', '🎓', 3),
    ('Championship Rings', 'Шампионски пръстени', 'mens-championship', '🏆', 4),
    ('Biker Rings', 'Байкърски пръстени', 'mens-biker', '🏍️', 5),
    ('Celtic Rings', 'Келтски пръстени', 'mens-celtic', '☘️', 6),
    ('Tungsten Rings', 'Волфрамови пръстени', 'mens-tungsten', '⚙️', 7),
    ('Titanium Rings', 'Титанови пръстени', 'mens-titanium', '🔩', 8)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;
;
