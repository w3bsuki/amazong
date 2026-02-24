
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 3B: L3 Categories for NECKLACES & EARRINGS
-- Date: December 4, 2025
-- ==============================================

-- L3 under Chains
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'necklaces-chains'), v.icon, v.display_order
FROM (VALUES
    ('Cable Chains', 'Кабелни вериги', 'chains-cable', '⛓️', 1),
    ('Rope Chains', 'Въжени вериги', 'chains-rope', '🪢', 2),
    ('Box Chains', 'Бокс вериги', 'chains-box', '📦', 3),
    ('Snake Chains', 'Змийски вериги', 'chains-snake', '🐍', 4),
    ('Figaro Chains', 'Фигаро вериги', 'chains-figaro', '🔗', 5),
    ('Curb Chains', 'Бордюрни вериги', 'chains-curb', '⛓️', 6),
    ('Ball & Bead Chains', 'Мънистени вериги', 'chains-ball', '📿', 7),
    ('Herringbone Chains', 'Херингбон вериги', 'chains-herringbone', '🐟', 8),
    ('Franco Chains', 'Франко вериги', 'chains-franco', '💪', 9),
    ('Cuban Link', 'Кубински вериги', 'chains-cuban', '🔗', 10),
    ('Byzantine Chains', 'Византийски вериги', 'chains-byzantine', '🏛️', 11),
    ('Singapore Chains', 'Сингапурски вериги', 'chains-singapore', '✨', 12)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Pendants
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'necklaces-pendants'), v.icon, v.display_order
FROM (VALUES
    ('Diamond Pendants', 'Диамантени медальони', 'pendants-diamond', '💎', 1),
    ('Gemstone Pendants', 'Медальони с камъни', 'pendants-gemstone', '💠', 2),
    ('Initial & Letter', 'Инициали и букви', 'pendants-initials', '🔤', 3),
    ('Heart Pendants', 'Сърца', 'pendants-heart', '❤️', 4),
    ('Cross Pendants', 'Кръстове', 'pendants-cross', '✝️', 5),
    ('Lockets', 'Медальони с отваряне', 'pendants-lockets', '🤍', 6),
    ('Bar Pendants', 'Бар медальони', 'pendants-bar', '➖', 7),
    ('Birthstone Pendants', 'Медальони по зодия', 'pendants-birthstone', '🔮', 8)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Pearl Necklaces
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'necklaces-pearls'), v.icon, v.display_order
FROM (VALUES
    ('Single Strand Pearls', 'Един ред перли', 'pearls-single', '📿', 1),
    ('Multi-Strand Pearls', 'Многоредни перли', 'pearls-multi', '🔗', 2),
    ('Pearl Pendants', 'Перлени медальони', 'pearls-pendant', '🦪', 3),
    ('Freshwater Pearls', 'Сладководни перли', 'pearls-freshwater', '💧', 4),
    ('Akoya Pearls', 'Акоя перли', 'pearls-akoya', '⚪', 5),
    ('South Sea Pearls', 'Южноморски перли', 'pearls-southsea', '🌊', 6),
    ('Tahitian Pearls', 'Таитянски перли', 'pearls-tahitian', '🌑', 7),
    ('Baroque Pearls', 'Барокови перли', 'pearls-baroque', '🎭', 8)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Stud Earrings
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'earrings-studs'), v.icon, v.display_order
FROM (VALUES
    ('Diamond Studs', 'Диамантени пусети', 'studs-diamond', '💎', 1),
    ('Pearl Studs', 'Перлени пусети', 'studs-pearl', '🦪', 2),
    ('Gold Studs', 'Златни пусети', 'studs-gold', '🥇', 3),
    ('Gemstone Studs', 'Пусети с камъни', 'studs-gemstone', '💠', 4),
    ('Fashion Studs', 'Модни пусети', 'studs-fashion', '✨', 5),
    ('Birthstone Studs', 'Пусети по зодия', 'studs-birthstone', '🔮', 6),
    ('CZ Studs', 'CZ пусети', 'studs-cz', '💍', 7)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Hoop Earrings
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'earrings-hoops'), v.icon, v.display_order
FROM (VALUES
    ('Small Hoops (10-15mm)', 'Малки халки', 'hoops-small', '⭕', 1),
    ('Medium Hoops (20-30mm)', 'Средни халки', 'hoops-medium', '⭕', 2),
    ('Large Hoops (40-50mm)', 'Големи халки', 'hoops-large', '⭕', 3),
    ('Oversized Hoops (60mm+)', 'Много големи халки', 'hoops-oversized', '🔴', 4),
    ('Diamond Hoops', 'Халки с диаманти', 'hoops-diamond', '💎', 5),
    ('Gold Hoops', 'Златни халки', 'hoops-gold', '🥇', 6),
    ('Silver Hoops', 'Сребърни халки', 'hoops-silver', '🥈', 7)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;
;
