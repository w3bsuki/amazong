
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 2A: L2 Categories for RINGS
-- Date: December 4, 2025
-- ==============================================

-- Insert L2 Categories under Rings (jw-rings)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'jw-rings'),
    v.icon,
    v.display_order
FROM (VALUES
    ('Engagement Rings', 'Годежни пръстени', 'rings-engagement', '💍', 1),
    ('Wedding Bands', 'Сватбени халки', 'rings-wedding', '💒', 2),
    ('Fashion Rings', 'Модни пръстени', 'rings-fashion', '✨', 3),
    ('Cocktail Rings', 'Коктейлни пръстени', 'rings-cocktail', '🍸', 4),
    ('Promise Rings', 'Пръстени за обещание', 'rings-promise', '💕', 5),
    ('Anniversary Rings', 'Юбилейни пръстени', 'rings-anniversary', '🎉', 6),
    ('Eternity Rings', 'Вечни пръстени', 'rings-eternity', '♾️', 7),
    ('Signet Rings', 'Печатни пръстени', 'rings-signet', '👤', 8),
    ('Gemstone Rings', 'Пръстени с камъни', 'rings-gemstone', '💎', 9),
    ('Birthstone Rings', 'Пръстени по зодия', 'rings-birthstone', '🔮', 10),
    ('Religious Rings', 'Религиозни пръстени', 'rings-religious', '✝️', 11),
    ('Stackable Rings', 'Наслагващи се пръстени', 'rings-stackable', '📚', 12),
    ('Men''s Rings', 'Мъжки пръстени', 'rings-mens', '🧔', 13)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
;
