
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 2C: L2 Categories for EARRINGS
-- Date: December 4, 2025
-- ==============================================

-- Insert L2 Categories under Earrings (jw-earrings)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'jw-earrings'),
    v.icon,
    v.display_order
FROM (VALUES
    ('Stud Earrings', 'Обеци пусети', 'earrings-studs', '⭐', 1),
    ('Hoop Earrings', 'Халки за уши', 'earrings-hoops', '⭕', 2),
    ('Drop & Dangle Earrings', 'Висящи обеци', 'earrings-drop', '💧', 3),
    ('Chandelier Earrings', 'Полилейни обеци', 'earrings-chandelier', '🌟', 4),
    ('Huggie Earrings', 'Хъги обеци', 'earrings-huggie', '🔵', 5),
    ('Clip-On Earrings', 'Клипсове', 'earrings-clipon', '📎', 6),
    ('Ear Cuffs', 'Ушни гривни', 'earrings-cuffs', '🌙', 7),
    ('Threader Earrings', 'Нишкови обеци', 'earrings-threader', '➿', 8),
    ('Pearl Earrings', 'Перлени обеци', 'earrings-pearls', '🦪', 9),
    ('Crawler Earrings', 'Пълзящи обеци', 'earrings-crawler', '🐛', 10),
    ('Men''s Earrings', 'Мъжки обеци', 'earrings-mens', '🧔', 11)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
;
