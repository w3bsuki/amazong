-- Restore Wholesale & Business L3 categories

-- Wholesale Electronics L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Wholesale Phones', 'wholesale-phones', 'Телефони на едро', 1),
  ('Wholesale Computers', 'wholesale-computers', 'Компютри на едро', 2),
  ('Wholesale Accessories', 'wholesale-accessories', 'Аксесоари на едро', 3),
  ('Wholesale Parts', 'wholesale-parts', 'Части на едро', 4),
  ('Wholesale Audio', 'wholesale-audio', 'Аудио на едро', 5),
  ('Wholesale Cables', 'wholesale-cables', 'Кабели на едро', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'wholesale-electronics'
ON CONFLICT (slug) DO NOTHING;

-- Wholesale Clothing L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Wholesale Mens Clothing', 'wholesale-mens', 'Мъжки дрехи на едро', 1),
  ('Wholesale Womens Clothing', 'wholesale-womens', 'Дамски дрехи на едро', 2),
  ('Wholesale Kids Clothing', 'wholesale-kids', 'Детски дрехи на едро', 3),
  ('Wholesale Shoes', 'wholesale-shoes', 'Обувки на едро', 4),
  ('Wholesale Accessories', 'wholesale-fashion-acc', 'Аксесоари на едро', 5),
  ('Wholesale Fabrics', 'wholesale-fabrics', 'Платове на едро', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'wholesale-clothing'
ON CONFLICT (slug) DO NOTHING;

-- Wholesale Food L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Wholesale Beverages', 'wholesale-beverages', 'Напитки на едро', 1),
  ('Wholesale Snacks', 'wholesale-snacks', 'Снаксове на едро', 2),
  ('Wholesale Grocery', 'wholesale-grocery', 'Хранителни стоки на едро', 3),
  ('Wholesale Frozen', 'wholesale-frozen', 'Замразени храни на едро', 4),
  ('Wholesale Confectionery', 'wholesale-confectionery', 'Сладкарски изделия на едро', 5),
  ('Wholesale Organic', 'wholesale-organic', 'Био продукти на едро', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'wholesale-food'
ON CONFLICT (slug) DO NOTHING;

-- Office Supplies L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Paper Products', 'office-paper', 'Хартиени продукти', 1),
  ('Writing Instruments', 'office-writing', 'Писалки', 2),
  ('Filing & Organization', 'office-filing', 'Организация на документи', 3),
  ('Desk Accessories', 'office-desk', 'Аксесоари за бюро', 4),
  ('Printing Supplies', 'office-printing', 'Консумативи за принтери', 5),
  ('Mailing Supplies', 'office-mailing', 'Пощенски консумативи', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'wholesale-office-supplies'
ON CONFLICT (slug) DO NOTHING;

-- Industrial Equipment L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Power Tools Industrial', 'industrial-power-tools', 'Индустриални електроинструменти', 1),
  ('Hand Tools Industrial', 'industrial-hand-tools', 'Индустриални ръчни инструменти', 2),
  ('Safety Equipment', 'industrial-safety', 'Предпазно оборудване', 3),
  ('Hydraulics', 'industrial-hydraulics', 'Хидравлика', 4),
  ('Pneumatics', 'industrial-pneumatics', 'Пневматика', 5),
  ('Pumps & Motors', 'industrial-pumps', 'Помпи и мотори', 6),
  ('Conveyor Systems', 'industrial-conveyor', 'Транспортни системи', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'wholesale-industrial'
ON CONFLICT (slug) DO NOTHING;

-- Packaging L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Boxes & Cartons', 'packaging-boxes', 'Кутии и картони', 1),
  ('Bags & Pouches', 'packaging-bags', 'Торби и пликове', 2),
  ('Tape & Adhesives', 'packaging-tape', 'Лепенки и залепващи', 3),
  ('Labels', 'packaging-labels', 'Етикети', 4),
  ('Bubble Wrap', 'packaging-bubble', 'Фолио с мехурчета', 5),
  ('Pallets', 'packaging-pallets', 'Палети', 6),
  ('Food Packaging', 'packaging-food', 'Опаковки за храна', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'wholesale-packaging'
ON CONFLICT (slug) DO NOTHING;

-- Restaurant Supplies L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Commercial Kitchen', 'restaurant-kitchen', 'Търговско кухненско оборудване', 1),
  ('Tableware', 'restaurant-tableware', 'Съдове за хранене', 2),
  ('Bar Equipment', 'restaurant-bar', 'Барово оборудване', 3),
  ('Food Storage', 'restaurant-storage', 'Съхранение на храна', 4),
  ('Disposables', 'restaurant-disposables', 'Еднократни съдове', 5),
  ('Cleaning Supplies', 'restaurant-cleaning', 'Почистващи материали', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'wholesale-restaurant'
ON CONFLICT (slug) DO NOTHING;

-- Construction Materials L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Lumber', 'construction-lumber', 'Дървен материал', 1),
  ('Cement & Concrete', 'construction-cement', 'Цимент и бетон', 2),
  ('Steel & Metals', 'construction-steel', 'Стомана и метали', 3),
  ('Roofing Materials', 'construction-roofing', 'Покривни материали', 4),
  ('Insulation', 'construction-insulation', 'Изолация', 5),
  ('Plumbing Materials', 'construction-plumbing', 'ВиК материали', 6),
  ('Electrical Materials', 'construction-electrical', 'Електроматериали', 7),
  ('Drywall', 'construction-drywall', 'Гипсокартон', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'wholesale-construction'
ON CONFLICT (slug) DO NOTHING;;
