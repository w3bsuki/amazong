-- Restore Home & Kitchen L3 categories
-- Sofas L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Sectional Sofas', 'sofas-sectional', 'Ъглови дивани', 1),
  ('Loveseats', 'sofas-loveseats', 'Двуместни дивани', 2),
  ('Sleeper Sofas', 'sofas-sleeper', 'Разтегателни дивани', 3),
  ('Recliners', 'sofas-recliners', 'Реклайнери', 4),
  ('Futons', 'sofas-futons', 'Футони', 5),
  ('Armchairs', 'sofas-armchairs', 'Кресла', 6),
  ('Ottoman & Poufs', 'sofas-ottoman', 'Табуретки и пуфове', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'furn-sofas'
ON CONFLICT (slug) DO NOTHING;

-- Beds L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Platform Beds', 'beds-platform', 'Платформени легла', 1),
  ('Bed Frames', 'beds-frames', 'Рамки за легла', 2),
  ('Bunk Beds', 'beds-bunk', 'Двуетажни легла', 3),
  ('Daybeds', 'beds-daybeds', 'Диван-легла', 4),
  ('Headboards', 'beds-headboards', 'Табли', 5),
  ('Adjustable Beds', 'beds-adjustable', 'Регулируеми легла', 6),
  ('Kids Beds', 'beds-kids', 'Детски легла', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'furn-beds'
ON CONFLICT (slug) DO NOTHING;

-- Kitchen Appliances L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Refrigerators', 'appliances-refrigerators', 'Хладилници', 1),
  ('Ovens & Stoves', 'appliances-ovens', 'Печки и фурни', 2),
  ('Dishwashers', 'appliances-dishwashers', 'Съдомиялни', 3),
  ('Microwaves', 'appliances-microwaves', 'Микровълнови', 4),
  ('Washing Machines', 'appliances-washing', 'Перални', 5),
  ('Dryers', 'appliances-dryers', 'Сушилни', 6),
  ('Freezers', 'appliances-freezers', 'Фризери', 7),
  ('Range Hoods', 'appliances-hoods', 'Аспиратори', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'kitchen-large-appliances'
ON CONFLICT (slug) DO NOTHING;

-- Small Appliances L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Coffee Machines', 'appliances-coffee', 'Кафемашини', 1),
  ('Blenders & Mixers', 'appliances-blenders', 'Блендери и миксери', 2),
  ('Toasters & Ovens', 'appliances-toasters', 'Тостери и мини фурни', 3),
  ('Air Fryers', 'appliances-air-fryers', 'Еър фрайъри', 4),
  ('Electric Kettles', 'appliances-kettles', 'Електрически кани', 5),
  ('Food Processors', 'appliances-processors', 'Кухненски роботи', 6),
  ('Juicers', 'appliances-juicers', 'Сокоизстисквачки', 7),
  ('Rice Cookers', 'appliances-rice-cookers', 'Уреди за ориз', 8),
  ('Slow Cookers', 'appliances-slow-cookers', 'Уреди за бавно готвене', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'kitchen-small-appliances'
ON CONFLICT (slug) DO NOTHING;

-- Cookware L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Pots & Pans', 'cookware-pots-pans', 'Тенджери и тигани', 1),
  ('Frying Pans', 'cookware-frying', 'Тигани', 2),
  ('Saucepans', 'cookware-saucepans', 'Касероли', 3),
  ('Dutch Ovens', 'cookware-dutch-ovens', 'Чугунени тенджери', 4),
  ('Woks', 'cookware-woks', 'Уокове', 5),
  ('Cookware Sets', 'cookware-sets', 'Комплекти съдове', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'cookware'
ON CONFLICT (slug) DO NOTHING;

-- Lighting L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Chandeliers', 'lighting-chandeliers', 'Полилеи', 1),
  ('Pendant Lights', 'lighting-pendants', 'Висящи лампи', 2),
  ('Flush Mounts', 'lighting-flush', 'Плафони', 3),
  ('Track Lighting', 'lighting-track', 'Релсово осветление', 4),
  ('Recessed Lighting', 'lighting-recessed', 'Вградено осветление', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'light-ceiling'
ON CONFLICT (slug) DO NOTHING;

-- Home Decor L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Canvas Prints', 'decor-canvas', 'Канава принтове', 1),
  ('Framed Art', 'decor-framed', 'Картини в рамки', 2),
  ('Posters', 'decor-posters', 'Плакати', 3),
  ('Wall Stickers', 'decor-wall-stickers', 'Стикери за стена', 4),
  ('Metal Wall Art', 'decor-metal-art', 'Метални декорации', 5),
  ('Photo Frames', 'decor-photo-frames', 'Рамки за снимки', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'decor-wall-art'
ON CONFLICT (slug) DO NOTHING;;
