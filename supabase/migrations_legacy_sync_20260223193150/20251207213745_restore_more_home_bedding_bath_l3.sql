-- Restore more Home - Bedding & Bath L3 categories

-- Bedding L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Bed Sheets', 'bedding-sheets', 'Чаршафи', 1),
  ('Duvet Covers', 'bedding-duvet', 'Пликове за завивки', 2),
  ('Comforters', 'bedding-comforters', 'Завивки', 3),
  ('Blankets', 'bedding-blankets', 'Одеала', 4),
  ('Pillows', 'bedding-pillows', 'Възглавници', 5),
  ('Pillow Cases', 'bedding-pillowcases', 'Калъфки за възглавници', 6),
  ('Mattress Toppers', 'bedding-toppers', 'Топери', 7),
  ('Mattress Protectors', 'bedding-protectors', 'Протектори за матрак', 8),
  ('Weighted Blankets', 'bedding-weighted', 'Тежки одеала', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'home-bedding'
ON CONFLICT (slug) DO NOTHING;

-- Bath L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Bath Towels', 'bath-towels', 'Хавлии за баня', 1),
  ('Hand Towels', 'bath-hand-towels', 'Ръчни кърпи', 2),
  ('Bathrobes', 'bath-robes', 'Халати', 3),
  ('Bath Mats', 'bath-mats', 'Постелки за баня', 4),
  ('Shower Curtains', 'bath-curtains', 'Завеси за душ', 5),
  ('Bathroom Accessories', 'bath-accessories', 'Аксесоари за баня', 6),
  ('Bathroom Storage', 'bath-storage', 'Съхранение за баня', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'home-bath'
ON CONFLICT (slug) DO NOTHING;

-- Rugs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Area Rugs', 'rugs-area', 'Килими', 1),
  ('Runner Rugs', 'rugs-runner', 'Пътеки', 2),
  ('Round Rugs', 'rugs-round', 'Кръгли килими', 3),
  ('Shag Rugs', 'rugs-shag', 'Рошави килими', 4),
  ('Outdoor Rugs', 'rugs-outdoor', 'Външни килими', 5),
  ('Oriental Rugs', 'rugs-oriental', 'Ориенталски килими', 6),
  ('Kids Rugs', 'rugs-kids', 'Детски килими', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'home-rugs'
ON CONFLICT (slug) DO NOTHING;

-- Window Treatments L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Curtains', 'window-curtains', 'Завеси', 1),
  ('Drapes', 'window-drapes', 'Драперии', 2),
  ('Blinds', 'window-blinds', 'Щори', 3),
  ('Shades', 'window-shades', 'Сенници', 4),
  ('Valances', 'window-valances', 'Ламбрекени', 5),
  ('Curtain Rods', 'window-rods', 'Корнизи', 6),
  ('Blackout Curtains', 'window-blackout', 'Затъмняващи завеси', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'home-window'
ON CONFLICT (slug) DO NOTHING;

-- Storage & Organization L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Storage Bins', 'storage-bins', 'Кутии за съхранение', 1),
  ('Closet Organizers', 'storage-closet', 'Органайзери за гардероб', 2),
  ('Shoe Storage', 'storage-shoes', 'Съхранение за обувки', 3),
  ('Drawer Organizers', 'storage-drawers', 'Органайзери за чекмеджета', 4),
  ('Hangers', 'storage-hangers', 'Закачалки', 5),
  ('Baskets', 'storage-baskets', 'Кошници', 6),
  ('Shelving', 'storage-shelving', 'Рафтове', 7),
  ('Vacuum Storage Bags', 'storage-vacuum', 'Вакуумни торби', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'home-storage'
ON CONFLICT (slug) DO NOTHING;

-- Tables L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Dining Tables', 'tables-dining', 'Трапезни маси', 1),
  ('Coffee Tables', 'tables-coffee', 'Кафе маси', 2),
  ('Side Tables', 'tables-side', 'Странични маси', 3),
  ('Console Tables', 'tables-console', 'Конзолни маси', 4),
  ('End Tables', 'tables-end', 'Крайни маси', 5),
  ('Nesting Tables', 'tables-nesting', 'Вложени маси', 6),
  ('Extendable Tables', 'tables-extendable', 'Разтегателни маси', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'furn-tables'
ON CONFLICT (slug) DO NOTHING;

-- Chairs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Dining Chairs', 'chairs-dining', 'Трапезни столове', 1),
  ('Accent Chairs', 'chairs-accent', 'Акцентни столове', 2),
  ('Lounge Chairs', 'chairs-lounge', 'Лаундж столове', 3),
  ('Bar Stools', 'chairs-barstools', 'Бар столове', 4),
  ('Rocking Chairs', 'chairs-rocking', 'Люлеещи се столове', 5),
  ('Gaming Chairs', 'chairs-gaming', 'Гейминг столове', 6),
  ('Office Chairs', 'chairs-office', 'Офис столове', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'furn-chairs'
ON CONFLICT (slug) DO NOTHING;

-- Mattresses L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Memory Foam Mattresses', 'mattress-memory-foam', 'Мемори матраци', 1),
  ('Innerspring Mattresses', 'mattress-innerspring', 'Пружинни матраци', 2),
  ('Hybrid Mattresses', 'mattress-hybrid', 'Хибридни матраци', 3),
  ('Latex Mattresses', 'mattress-latex', 'Латексови матраци', 4),
  ('Adjustable Mattresses', 'mattress-adjustable', 'Регулируеми матраци', 5),
  ('Twin Mattresses', 'mattress-twin', 'Twin матраци', 6),
  ('Queen Mattresses', 'mattress-queen', 'Queen матраци', 7),
  ('King Mattresses', 'mattress-king', 'King матраци', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'furn-mattresses'
ON CONFLICT (slug) DO NOTHING;;
