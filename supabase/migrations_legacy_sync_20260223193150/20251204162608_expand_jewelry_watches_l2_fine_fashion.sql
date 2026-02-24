
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 2F: L2 Categories for FINE & FASHION JEWELRY
-- Date: December 4, 2025
-- ==============================================

-- Insert L2 Categories under Fine Jewelry (fine-jewelry)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'fine-jewelry'),
    v.icon,
    v.display_order
FROM (VALUES
    ('Diamond Jewelry', 'Диамантени бижута', 'fine-diamonds', '💎', 1),
    ('Gold Jewelry', 'Златни бижута', 'fine-gold', '🥇', 2),
    ('Platinum Jewelry', 'Платинени бижута', 'fine-platinum', '⬜', 3),
    ('Pearl Jewelry', 'Перлени бижута', 'fine-pearls', '🦪', 4),
    ('Gemstone Jewelry', 'Бижута със скъпоценни камъни', 'fine-gemstones', '💠', 5),
    ('Birthstone Jewelry', 'Бижута по зодия', 'fine-birthstones', '🔮', 6),
    ('Jewelry Sets', 'Комплекти бижута', 'fine-sets', '🎁', 7),
    ('Luxury Brands', 'Луксозни марки', 'fine-luxury-brands', '👑', 8),
    ('Loose Diamonds', 'Разпръснати диаманти', 'fine-loose-diamonds', '✨', 9),
    ('Loose Gemstones', 'Разпръснати скъпоценни камъни', 'fine-loose-gemstones', '💎', 10)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;

-- Insert L2 Categories under Fashion Jewelry (costume-jewelry)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'costume-jewelry'),
    v.icon,
    v.display_order
FROM (VALUES
    ('Sterling Silver Jewelry', 'Сребърни бижута 925', 'fashion-silver', '🥈', 1),
    ('Stainless Steel Jewelry', 'Бижута от стомана', 'fashion-steel', '⚙️', 2),
    ('Costume Pieces', 'Бижутерия', 'fashion-costume', '✨', 3),
    ('Bohemian Jewelry', 'Бохо бижута', 'fashion-boho', '🌸', 4),
    ('Minimalist Jewelry', 'Минималистични бижута', 'fashion-minimalist', '➖', 5),
    ('Statement Pieces', 'Изявени бижута', 'fashion-statement', '💥', 6),
    ('Body Jewelry', 'Бижута за тяло', 'fashion-body', '🔥', 7),
    ('Designer Fashion Jewelry', 'Дизайнерски модни бижута', 'fashion-designer', '🏷️', 8),
    ('Seasonal Collections', 'Сезонни колекции', 'fashion-seasonal', '🍂', 9),
    ('Handmade Jewelry', 'Ръчно изработени бижута', 'fashion-handmade', '✋', 10)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
;
