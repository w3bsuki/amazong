
-- =====================================================
-- HOBBIES PART 2: Handmade & Crafts L2/L3 Categories
-- Focus: Etsy-style handmade marketplace
-- =====================================================

DO $$
DECLARE
  handmade_id UUID;
  cat_id UUID;
BEGIN
  SELECT id INTO handmade_id FROM categories WHERE slug = 'handmade';
  
  -- L2: Handmade Jewelry (already exists, add L3)
  SELECT id INTO cat_id FROM categories WHERE slug = 'handmade-jewelry';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Handmade Necklaces', 'Ръчни огърлици', 'handmade-necklaces', cat_id, '📿', 1),
    ('Handmade Bracelets', 'Ръчни гривни', 'handmade-bracelets', cat_id, '📿', 2),
    ('Handmade Earrings', 'Ръчни обеци', 'handmade-earrings', cat_id, '💎', 3),
    ('Handmade Rings', 'Ръчни пръстени', 'handmade-rings', cat_id, '💍', 4),
    ('Beaded Jewelry', 'Мъниста бижута', 'handmade-beaded', cat_id, '🔮', 5),
    ('Wire Wrapped Jewelry', 'Телени бижута', 'handmade-wire', cat_id, '✨', 6),
    ('Resin Jewelry', 'Смола бижута', 'handmade-resin-jewelry', cat_id, '💧', 7),
    ('Polymer Clay Jewelry', 'Полимерна глина', 'handmade-polymer-clay', cat_id, '🎨', 8)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L2: Handmade Clothing (already exists, add L3)
  SELECT id INTO cat_id FROM categories WHERE slug = 'handmade-clothing';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Knitted Items', 'Плетени изделия', 'handmade-knitted', cat_id, '🧶', 1),
    ('Crocheted Items', 'Плетка на една кука', 'handmade-crocheted', cat_id, '🧵', 2),
    ('Embroidered Items', 'Бродирани изделия', 'handmade-embroidered', cat_id, '🪡', 3),
    ('Hand-Sewn Clothes', 'Ръчно шити дрехи', 'handmade-sewn-clothes', cat_id, '👗', 4),
    ('Baby & Kids Handmade', 'Ръчно за бебета и деца', 'handmade-baby-clothes', cat_id, '👶', 5),
    ('Handmade Bags', 'Ръчни чанти', 'handmade-bags', cat_id, '👜', 6),
    ('Scarves & Shawls', 'Шалове и наметала', 'handmade-scarves', cat_id, '🧣', 7),
    ('Hats & Headwear', 'Шапки и шапчици', 'handmade-hats', cat_id, '🧢', 8)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L2: Home Décor Crafts (already exists, add L3)
  SELECT id INTO cat_id FROM categories WHERE slug = 'home-decor-crafts';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Candles & Holders', 'Свещи и поставки', 'handmade-candles', cat_id, '🕯️', 1),
    ('Wall Art & Signs', 'Стенно изкуство', 'handmade-wall-art', cat_id, '🖼️', 2),
    ('Pottery & Ceramics', 'Керамика и грънчарство', 'handmade-pottery', cat_id, '🏺', 3),
    ('Macrame', 'Макраме', 'handmade-macrame', cat_id, '🪢', 4),
    ('Woodworking', 'Дървообработка', 'handmade-woodworking', cat_id, '🪵', 5),
    ('Wreaths & Florals', 'Венци и цветя', 'handmade-wreaths', cat_id, '💐', 6),
    ('Dream Catchers', 'Капани за сънища', 'handmade-dreamcatchers', cat_id, '🕸️', 7),
    ('Terrariums & Planters', 'Терариуми и саксии', 'handmade-terrariums', cat_id, '🌱', 8)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L2: Craft Supplies (already exists, add L3)
  SELECT id INTO cat_id FROM categories WHERE slug = 'craft-supplies';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Beads & Findings', 'Мъниста и фурнитура', 'craft-beads', cat_id, '🔮', 1),
    ('Yarn & Fiber', 'Прежда и влакна', 'craft-yarn', cat_id, '🧶', 2),
    ('Fabric & Textiles', 'Плат и текстил', 'craft-fabric', cat_id, '🧵', 3),
    ('Leather & Supplies', 'Кожа и материали', 'craft-leather', cat_id, '🪡', 4),
    ('Resin & Molds', 'Смола и форми', 'craft-resin', cat_id, '💧', 5),
    ('Wood Blanks', 'Дървени заготовки', 'craft-wood-blanks', cat_id, '🪵', 6),
    ('Tools & Equipment', 'Инструменти', 'craft-tools', cat_id, '🔧', 7),
    ('Embroidery Supplies', 'Бродерия материали', 'craft-embroidery', cat_id, '🪡', 8)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- NEW L2: Bath & Body Handmade
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Bath & Body', 'Баня и тяло', 'handmade-bath-body', handmade_id, '🧼', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Handmade Soaps', 'Ръчни сапуни', 'handmade-soaps', cat_id, '🧼', 1),
  ('Bath Bombs', 'Бомбички за баня', 'handmade-bath-bombs', cat_id, '💣', 2),
  ('Lotions & Creams', 'Лосиони и кремове', 'handmade-lotions', cat_id, '🧴', 3),
  ('Lip Balms', 'Балсами за устни', 'handmade-lip-balm', cat_id, '💋', 4),
  ('Beard Products', 'Продукти за брада', 'handmade-beard', cat_id, '🧔', 5),
  ('Essential Oils', 'Етерични масла', 'handmade-oils', cat_id, '🌿', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- NEW L2: Personalized & Custom
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Personalized & Custom', 'Персонализирани', 'handmade-personalized', handmade_id, '✨', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Custom Portraits', 'Персонализирани портрети', 'handmade-portraits', cat_id, '🖼️', 1),
  ('Name Signs', 'Табелки с имена', 'handmade-name-signs', cat_id, '📝', 2),
  ('Pet Portraits', 'Портрети на домашни любимци', 'handmade-pet-portraits', cat_id, '🐕', 3),
  ('Custom Gifts', 'Персонализирани подаръци', 'handmade-custom-gifts', cat_id, '🎁', 4),
  ('Engraved Items', 'Гравирани предмети', 'handmade-engraved', cat_id, '✍️', 5),
  ('Wedding Items', 'Сватбени аксесоари', 'handmade-wedding', cat_id, '💒', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- NEW L2: Bulgarian Traditional Crafts
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Bulgarian Crafts', 'Български занаяти', 'handmade-bulgarian', handmade_id, '🇧🇬', 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Martenitsi', 'Мартеници', 'handmade-martenitsi', cat_id, '❤️', 1),
  ('Embroidery & Shevitsi', 'Бродерия и шевици', 'handmade-shevitsi', cat_id, '🪡', 2),
  ('Rose Products', 'Продукти от рози', 'handmade-rose', cat_id, '🌹', 3),
  ('Woodcarving', 'Дърворезба', 'handmade-woodcarving', cat_id, '🪵', 4),
  ('Pottery Troyan Style', 'Троянска керамика', 'handmade-troyan', cat_id, '🏺', 5),
  ('Copper Craft', 'Медникарство', 'handmade-copper', cat_id, '🥄', 6),
  ('Icon Painting', 'Иконопис', 'handmade-icons', cat_id, '🖼️', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

END $$;
;
