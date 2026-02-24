-- Restore Gaming L3 categories
-- PC Gaming Keyboards L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Mechanical Keyboards', 'kb-mechanical', 'Механични клавиатури', 1),
  ('Membrane Keyboards', 'kb-membrane', 'Мембранни клавиатури', 2),
  ('Wireless Gaming Keyboards', 'kb-wireless', 'Безжични клавиатури', 3),
  ('TKL Keyboards', 'kb-tkl', 'TKL клавиатури', 4),
  ('60% Keyboards', 'kb-60percent', '60% клавиатури', 5),
  ('Full Size Keyboards', 'kb-fullsize', 'Пълноразмерни клавиатури', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'pc-gaming-keyboards'
ON CONFLICT (slug) DO NOTHING;

-- PC Gaming Mice L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Wired Gaming Mice', 'mice-wired', 'Жични мишки', 1),
  ('Wireless Gaming Mice', 'mice-wireless', 'Безжични мишки', 2),
  ('Ergonomic Gaming Mice', 'mice-ergonomic', 'Ергономични мишки', 3),
  ('Lightweight Gaming Mice', 'mice-lightweight', 'Леки мишки', 4),
  ('MMO Gaming Mice', 'mice-mmo', 'MMO мишки', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'pc-gaming-mice'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Monitors L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('144Hz Monitors', 'monitors-144hz', '144Hz монитори', 1),
  ('240Hz Monitors', 'monitors-240hz', '240Hz монитори', 2),
  ('360Hz Monitors', 'monitors-360hz', '360Hz монитори', 3),
  ('4K Gaming Monitors', 'monitors-4k-gaming', '4K гейминг монитори', 4),
  ('Ultrawide Gaming Monitors', 'monitors-ultrawide', 'Ultrawide монитори', 5),
  ('Curved Gaming Monitors', 'monitors-curved', 'Извити монитори', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'pc-gaming-monitors'
ON CONFLICT (slug) DO NOTHING;

-- PlayStation L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('PS5 Console', 'ps5-console', 'PS5 конзола', 1),
  ('PS5 Games', 'ps5-games', 'PS5 игри', 2),
  ('PS5 Controllers', 'ps5-controllers', 'PS5 контролери', 3),
  ('PS5 Accessories', 'ps5-accessories', 'PS5 аксесоари', 4),
  ('PS4 Console', 'ps4-console', 'PS4 конзола', 5),
  ('PS4 Games', 'ps4-games', 'PS4 игри', 6),
  ('PS4 Controllers', 'ps4-controllers', 'PS4 контролери', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'console-playstation'
ON CONFLICT (slug) DO NOTHING;

-- Xbox L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Xbox Series X', 'xbox-series-x', 'Xbox Series X', 1),
  ('Xbox Series S', 'xbox-series-s', 'Xbox Series S', 2),
  ('Xbox Games', 'xbox-games', 'Xbox игри', 3),
  ('Xbox Controllers', 'xbox-controllers', 'Xbox контролери', 4),
  ('Xbox Accessories', 'xbox-accessories', 'Xbox аксесоари', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'console-xbox'
ON CONFLICT (slug) DO NOTHING;

-- Nintendo L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Nintendo Switch OLED', 'switch-oled', 'Switch OLED', 1),
  ('Nintendo Switch', 'switch-standard', 'Switch стандартен', 2),
  ('Nintendo Switch Lite', 'switch-lite', 'Switch Lite', 3),
  ('Nintendo Switch Games', 'switch-games', 'Switch игри', 4),
  ('Nintendo Accessories', 'switch-accessories', 'Nintendo аксесоари', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'console-nintendo'
ON CONFLICT (slug) DO NOTHING;;
