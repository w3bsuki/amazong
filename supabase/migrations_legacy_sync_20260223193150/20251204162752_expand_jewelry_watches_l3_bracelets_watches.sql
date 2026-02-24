
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 3C: L3 Categories for BRACELETS & WATCHES
-- Date: December 4, 2025
-- ==============================================

-- L3 under Bangles
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'bracelets-bangles'), v.icon, v.display_order
FROM (VALUES
    ('Gold Bangles', 'Златни гривни', 'bangles-gold', '🥇', 1),
    ('Silver Bangles', 'Сребърни гривни', 'bangles-silver', '🥈', 2),
    ('Diamond Bangles', 'Гривни с диаманти', 'bangles-diamond', '💎', 3),
    ('Gemstone Bangles', 'Гривни с камъни', 'bangles-gemstone', '💠', 4),
    ('Stackable Bangles', 'Наслагващи се гривни', 'bangles-stackable', '📚', 5),
    ('Enamel Bangles', 'Емайлирани гривни', 'bangles-enamel', '🎨', 6)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Chain Bracelets
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'bracelets-chain'), v.icon, v.display_order
FROM (VALUES
    ('Link Bracelets', 'Звеневи гривни', 'chain-link', '🔗', 1),
    ('Cuban Link Bracelets', 'Кубински гривни', 'chain-cuban', '💪', 2),
    ('Figaro Bracelets', 'Фигаро гривни', 'chain-figaro', '⛓️', 3),
    ('Rope Bracelets', 'Въжени гривни', 'chain-rope', '🪢', 4),
    ('Cable Bracelets', 'Кабелни гривни', 'chain-cable', '⛓️', 5)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Body Jewelry
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'fashion-body'), v.icon, v.display_order
FROM (VALUES
    ('Nose Rings & Studs', 'Пиърсинг за нос', 'body-nose', '👃', 1),
    ('Belly Rings', 'Пиърсинг за пъп', 'body-belly', '🔘', 2),
    ('Toe Rings', 'Пръстени за крак', 'body-toe', '🦶', 3),
    ('Body Chains', 'Вериги за тяло', 'body-chains', '⛓️', 4),
    ('Ear Piercings', 'Пиърсинг за ухо', 'body-ear', '👂', 5),
    ('Septum Rings', 'Пиърсинг за септум', 'body-septum', '🔵', 6),
    ('Lip Rings', 'Пиърсинг за устна', 'body-lip', '💋', 7),
    ('Eyebrow Rings', 'Пиърсинг за вежда', 'body-eyebrow', '👁️', 8)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Luxury Watches (watches-luxury already has some, let's add more)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'watches-luxury'), v.icon, v.display_order
FROM (VALUES
    ('Panerai', 'Панераи', 'luxury-panerai', '🕐', 15),
    ('Hublot', 'Юбло', 'luxury-hublot', '⚫', 16),
    ('Vacheron Constantin', 'Вашерон Константин', 'luxury-vacheron', '👑', 17),
    ('A. Lange & Söhne', 'А. Ланге и синове', 'luxury-lange', '🇩🇪', 18),
    ('Zenith', 'Зенит', 'luxury-zenith', '⭐', 19),
    ('Blancpain', 'Бланпен', 'luxury-blancpain', '🌊', 20),
    ('Richard Mille', 'Ричард Мил', 'luxury-richardmille', '💎', 21)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Watch Straps
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'watches-straps-cat'), v.icon, v.display_order
FROM (VALUES
    ('Leather Straps', 'Кожени каишки', 'straps-leather', '🪶', 1),
    ('Metal Bracelets', 'Метални гривни', 'straps-metal', '⚙️', 2),
    ('Rubber & Silicone', 'Гумени и силиконови', 'straps-rubber', '🔵', 3),
    ('NATO Straps', 'НАТО каишки', 'straps-nato', '🪖', 4),
    ('Mesh Straps', 'Мрежести каишки', 'straps-mesh', '🕸️', 5),
    ('Exotic Leather', 'Екзотична кожа', 'straps-exotic', '🐊', 6),
    ('Canvas Straps', 'Платнени каишки', 'straps-canvas', '🎒', 7),
    ('Perlon Straps', 'Перлон каишки', 'straps-perlon', '🧵', 8)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Watch Accessories
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'watches-accessories-cat'), v.icon, v.display_order
FROM (VALUES
    ('Watch Boxes', 'Кутии за часовници', 'watch-acc-boxes', '📦', 1),
    ('Watch Winders', 'Навиващи устройства', 'watch-acc-winders', '🔄', 2),
    ('Watch Tools', 'Инструменти за часовници', 'watch-acc-tools', '🔧', 3),
    ('Travel Cases', 'Калъфи за пътуване', 'watch-acc-travel', '🧳', 4),
    ('Display Cases', 'Витрини', 'watch-acc-display', '🖼️', 5),
    ('Watch Rolls', 'Руло за часовници', 'watch-acc-rolls', '🎁', 6),
    ('Spring Bars & Pins', 'Пружини и щифтове', 'watch-acc-springbars', '📍', 7)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;

-- L3 under Watch by Brand (popular brands)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'watches-brands'), v.icon, v.display_order
FROM (VALUES
    ('Seiko', 'Сейко', 'brand-seiko', '🇯🇵', 1),
    ('Citizen', 'Ситизън', 'brand-citizen', '🌍', 2),
    ('Casio', 'Касио', 'brand-casio', '⌚', 3),
    ('G-Shock', 'Джи-Шок', 'brand-gshock', '💪', 4),
    ('Orient', 'Ориент', 'brand-orient', '🌏', 5),
    ('Timex', 'Таймекс', 'brand-timex', '⏰', 6),
    ('Bulova', 'Булова', 'brand-bulova', '🎵', 7),
    ('Hamilton', 'Хамилтън', 'brand-hamilton', '🎬', 8),
    ('Oris', 'Орис', 'brand-oris', '🇨🇭', 9),
    ('Swatch', 'Суоч', 'brand-swatch', '🎨', 10),
    ('Fossil', 'Фосил', 'brand-fossil', '🦴', 11),
    ('Michael Kors', 'Майкъл Корс', 'brand-mk', '👜', 12),
    ('Daniel Wellington', 'Даниел Уелингтън', 'brand-dw', '🇸🇪', 13)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg, icon = EXCLUDED.icon;
;
