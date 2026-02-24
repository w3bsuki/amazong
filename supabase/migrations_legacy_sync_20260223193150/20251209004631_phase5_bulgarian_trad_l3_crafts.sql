
-- Phase 5: Bulgarian Traditional - Traditional Crafts L3s

-- Traditional Crafts > Pottery & Ceramics L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Troyan Ceramics', 'Gabrovo Ceramics', 'Traditional Pots', 'Decorative Ceramics', 'Ceramic Tableware', 'Ceramic Figurines']),
  unnest(ARRAY['pottery-troyan', 'pottery-gabrovo', 'pottery-pots', 'pottery-decorative', 'pottery-tableware', 'pottery-figurines']),
  (SELECT id FROM categories WHERE slug = 'bg-pottery'),
  unnest(ARRAY['Троянска керамика', 'Габровска керамика', 'Традиционни гърнета', 'Декоративна керамика', 'Керамични съдове', 'Керамични фигурки']),
  '🏺',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Traditional Crafts > Woodworking L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Wood Carved Icons', 'Decorative Wood Boxes', 'Wooden Utensils', 'Carved Furniture', 'Wooden Sculptures', 'Traditional Spoons']),
  unnest(ARRAY['wood-icons', 'wood-boxes', 'wood-utensils', 'wood-furniture', 'wood-sculptures', 'wood-spoons']),
  (SELECT id FROM categories WHERE slug = 'bg-woodwork'),
  unnest(ARRAY['Дървени икони', 'Декоративни дървени кутии', 'Дървени прибори', 'Резбована мебел', 'Дървени скулптури', 'Традиционни лъжици']),
  '🪵',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Traditional Crafts > Textiles & Embroidery L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Embroidered Tablecloths', 'Embroidered Towels', 'Traditional Rugs', 'Folk Tapestries', 'Embroidered Shirts', 'Lace Work']),
  unnest(ARRAY['textile-tablecloths', 'textile-towels', 'textile-rugs', 'textile-tapestries', 'textile-shirts', 'textile-lace']),
  (SELECT id FROM categories WHERE slug = 'bg-textiles'),
  unnest(ARRAY['Бродирани покривки', 'Бродирани кърпи', 'Традиционни килими', 'Народни гоблени', 'Бродирани ризи', 'Дантела']),
  '🧵',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Traditional Crafts > Icons & Religious Art L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Hand-Painted Icons', 'Printed Icons', 'Icon Frames', 'Religious Accessories', 'Church Items']),
  unnest(ARRAY['icons-handpainted', 'icons-printed', 'icons-frames', 'icons-accessories', 'icons-church']),
  (SELECT id FROM categories WHERE slug = 'bg-icons'),
  unnest(ARRAY['Ръчно рисувани икони', 'Печатни икони', 'Рамки за икони', 'Религиозни аксесоари', 'Църковни предмети']),
  '✝️',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Traditional Crafts > Metalwork L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Copper Crafts', 'Bronze Work', 'Silver Filigree', 'Iron Forging', 'Decorative Metal']),
  unnest(ARRAY['metal-copper', 'metal-bronze', 'metal-silver', 'metal-iron', 'metal-decorative']),
  (SELECT id FROM categories WHERE slug = 'bg-metalwork'),
  unnest(ARRAY['Медни изделия', 'Бронзови изделия', 'Сребърна филигран', 'Ковано желязо', 'Декоративен метал']),
  '⚒️',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Traditional Crafts > Embroidery L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Cross-Stitch Patterns', 'Regional Embroidery', 'Embroidery Kits', 'Finished Embroidery', 'Embroidery Supplies']),
  unnest(ARRAY['embroidery-cross', 'embroidery-regional', 'embroidery-kits', 'embroidery-finished', 'embroidery-supplies']),
  (SELECT id FROM categories WHERE slug = 'crafts-embroidery'),
  unnest(ARRAY['Кръстат бод схеми', 'Регионална бродерия', 'Комплекти за бродерия', 'Готова бродерия', 'Консумативи за бродерия']),
  '🧵',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Traditional Crafts > Folk Musical Instruments L3s (different from Bulgarian Instruments L1)
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Mini Instruments', 'Instrument Replicas', 'Instrument Parts', 'Instrument Maintenance', 'Learning Materials']),
  unnest(ARRAY['folk-instr-mini', 'folk-instr-replicas', 'folk-instr-parts', 'folk-instr-maintenance', 'folk-instr-learning']),
  (SELECT id FROM categories WHERE slug = 'bg-folk-instruments'),
  unnest(ARRAY['Мини инструменти', 'Реплики на инструменти', 'Части за инструменти', 'Поддръжка на инструменти', 'Учебни материали']),
  '🎵',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;
;
