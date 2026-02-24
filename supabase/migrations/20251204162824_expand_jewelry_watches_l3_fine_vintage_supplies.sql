
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 3D: L3 Categories for FINE, VINTAGE & SUPPLIES
-- Date: December 4, 2025
-- ==============================================

-- L3 under Gold Jewelry
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'fine-gold'), v.icon, v.display_order
FROM (VALUES
    ('24K Gold Jewelry', '24-каратово злато', 'gold-24k', '🥇', 1),
    ('22K Gold Jewelry', '22-каратово злато', 'gold-22k', '🥇', 2),
    ('18K Gold Jewelry', '18-каратово злато', 'gold-18k', '🥇', 3),
    ('14K Gold Jewelry', '14-каратово злато', 'gold-14k', '🥇', 4),
    ('10K Gold Jewelry', '10-каратово злато', 'gold-10k', '🥇', 5),
    ('9K Gold Jewelry', '9-каратово злато', 'gold-9k', '🥇', 6),
    ('White Gold Jewelry', 'Бяло злато', 'gold-white', '⬜', 7),
    ('Rose Gold Jewelry', 'Розово злато', 'gold-rose', '🌸', 8),
    ('Two-Tone Gold', 'Двуцветно злато', 'gold-twotone', '🌓', 9)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Pearl Jewelry
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'fine-pearls'), v.icon, v.display_order
FROM (VALUES
    ('Akoya Pearls', 'Акоя перли', 'fine-akoya', '⚪', 1),
    ('Freshwater Pearls', 'Сладководни перли', 'fine-freshwater', '💧', 2),
    ('South Sea Pearls', 'Южноморски перли', 'fine-southsea', '🌊', 3),
    ('Tahitian Pearls', 'Таитянски перли', 'fine-tahitian', '🌑', 4),
    ('Baroque Pearls', 'Барокови перли', 'fine-baroque', '🎭', 5),
    ('Keshi Pearls', 'Кеши перли', 'fine-keshi', '✨', 6)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Gemstone Jewelry
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'fine-gemstones'), v.icon, v.display_order
FROM (VALUES
    ('Ruby Jewelry', 'Бижута с рубин', 'gem-ruby', '🔴', 1),
    ('Sapphire Jewelry', 'Бижута със сапфир', 'gem-sapphire', '🔵', 2),
    ('Emerald Jewelry', 'Бижута с изумруд', 'gem-emerald', '🟢', 3),
    ('Opal Jewelry', 'Бижута с опал', 'gem-opal', '🌈', 4),
    ('Tourmaline Jewelry', 'Бижута с турмалин', 'gem-tourmaline', '💜', 5),
    ('Tanzanite Jewelry', 'Бижута с танзанит', 'gem-tanzanite', '🔮', 6),
    ('Aquamarine Jewelry', 'Бижута с аквамарин', 'gem-aquamarine', '💠', 7),
    ('Morganite Jewelry', 'Бижута с морганит', 'gem-morganite', '🌸', 8),
    ('Amethyst Jewelry', 'Бижута с аметист', 'gem-amethyst', '🟣', 9),
    ('Topaz Jewelry', 'Бижута с топаз', 'gem-topaz', '🟡', 10)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Luxury Brands (Fine Jewelry)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'fine-luxury-brands'), v.icon, v.display_order
FROM (VALUES
    ('Tiffany & Co.', 'Тифани и Ко', 'luxury-tiffany', '💎', 1),
    ('Cartier Jewelry', 'Бижута Картие', 'luxury-cartier-jewelry', '👑', 2),
    ('Bulgari', 'Булгари', 'luxury-bulgari', '🐍', 3),
    ('Van Cleef & Arpels', 'Ван Клиф и Арпелс', 'luxury-vancleef', '🌸', 4),
    ('Harry Winston', 'Хари Уинстън', 'luxury-harrywinston', '💎', 5),
    ('Chopard', 'Шопар', 'luxury-chopard', '❤️', 6),
    ('Graff', 'Граф', 'luxury-graff', '💍', 7),
    ('Piaget', 'Пиаже', 'luxury-piaget', '🌹', 8),
    ('David Yurman', 'Дейвид Юрман', 'luxury-yurman', '⛓️', 9),
    ('Pandora', 'Пандора', 'luxury-pandora', '🎀', 10)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Beads & Findings
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'supplies-beads'), v.icon, v.display_order
FROM (VALUES
    ('Gemstone Beads', 'Мъниста от камъни', 'beads-gemstone', '💎', 1),
    ('Glass Beads', 'Стъклени мъниста', 'beads-glass', '🔮', 2),
    ('Crystal Beads', 'Кристални мъниста', 'beads-crystal', '✨', 3),
    ('Metal Beads', 'Метални мъниста', 'beads-metal', '⚙️', 4),
    ('Seed Beads', 'Мъниста семена', 'beads-seed', '🌰', 5),
    ('Spacer Beads', 'Разделителни мъниста', 'beads-spacer', '⭕', 6),
    ('Clasps', 'Закопчалки', 'findings-clasps', '🔗', 7),
    ('Jump Rings', 'Халки', 'findings-jumprings', '⭕', 8),
    ('Crimp Beads', 'Кримп мъниста', 'findings-crimps', '📍', 9),
    ('Ear Wires', 'Кукички за обеци', 'findings-earwires', '🪝', 10),
    ('Headpins & Eyepins', 'Пинове', 'findings-pins', '📌', 11)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Storage & Display
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'supplies-storage'), v.icon, v.display_order
FROM (VALUES
    ('Jewelry Boxes', 'Кутии за бижута', 'storage-boxes', '📦', 1),
    ('Ring Holders', 'Поставки за пръстени', 'storage-ringholder', '💍', 2),
    ('Necklace Stands', 'Стойки за колиета', 'storage-necklacestand', '📿', 3),
    ('Earring Organizers', 'Органайзери за обеци', 'storage-earring', '✨', 4),
    ('Travel Cases', 'Калъфи за пътуване', 'storage-travel', '🧳', 5),
    ('Watch Boxes', 'Кутии за часовници', 'storage-watchbox', '⌚', 6),
    ('Velvet Trays', 'Кадифени тави', 'storage-trays', '🗄️', 7),
    ('Jewelry Armoires', 'Шкафове за бижута', 'storage-armoire', '🪞', 8)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;
;
