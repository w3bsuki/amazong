
-- Batch 65: Baby and Kids categories deeper
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Baby Gear deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-gear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Strollers', 'Колички', 'strollers', v_parent_id, 1),
      ('Car Seats', 'Столчета за кола', 'car-seats', v_parent_id, 2),
      ('Baby Carriers', 'Раници за бебета', 'baby-carriers', v_parent_id, 3),
      ('High Chairs', 'Столчета за хранене', 'high-chairs', v_parent_id, 4),
      ('Bouncers', 'Бънджита', 'bouncers', v_parent_id, 5),
      ('Baby Swings', 'Люлки за бебета', 'baby-swings', v_parent_id, 6),
      ('Play Yards', 'Кошари за игра', 'play-yards', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Nursery deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'nursery';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cribs', 'Креватчета', 'cribs', v_parent_id, 1),
      ('Bassinets', 'Кошчета', 'bassinets', v_parent_id, 2),
      ('Changing Tables', 'Маси за повиване', 'changing-tables', v_parent_id, 3),
      ('Nursery Gliders', 'Люлеещи столове', 'nursery-gliders', v_parent_id, 4),
      ('Crib Mattresses', 'Матраци за креватчета', 'crib-mattresses', v_parent_id, 5),
      ('Baby Bedding', 'Бебешко спално бельо', 'baby-bedding', v_parent_id, 6),
      ('Nursery Decor', 'Декорация за детска стая', 'nursery-decor', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Feeding deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-feeding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baby Bottles', 'Бебешки бутилки', 'baby-bottles', v_parent_id, 1),
      ('Bottle Warmers', 'Нагреватели за бутилки', 'bottle-warmers', v_parent_id, 2),
      ('Breast Pumps', 'Помпи за кърма', 'breast-pumps', v_parent_id, 3),
      ('Baby Formula', 'Бебешка формула', 'baby-formula', v_parent_id, 4),
      ('Baby Food', 'Бебешка храна', 'baby-food', v_parent_id, 5),
      ('Bibs', 'Лигавници', 'bibs', v_parent_id, 6),
      ('Sippy Cups', 'Чаши с капак', 'sippy-cups', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Safety deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-safety';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baby Gates', 'Бебешки портички', 'baby-gates', v_parent_id, 1),
      ('Outlet Covers', 'Капачки за контакти', 'outlet-covers', v_parent_id, 2),
      ('Cabinet Locks', 'Ключалки за шкафове', 'cabinet-locks', v_parent_id, 3),
      ('Corner Guards', 'Протектори за ъгли', 'corner-guards', v_parent_id, 4),
      ('Baby Monitors', 'Бебефони', 'baby-monitors', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Diapering deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'diapering';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Diapers', 'Памперси', 'diapers', v_parent_id, 1),
      ('Diaper Bags', 'Чанти за памперси', 'diaper-bags', v_parent_id, 2),
      ('Diaper Pails', 'Кошове за памперси', 'diaper-pails', v_parent_id, 3),
      ('Wipes', 'Мокри кърпички', 'wipes', v_parent_id, 4),
      ('Diaper Cream', 'Крем за памперс', 'diaper-cream', v_parent_id, 5),
      ('Changing Pads', 'Подложки за повиване', 'changing-pads', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Bath deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-bath';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baby Bathtubs', 'Бебешки вани', 'baby-bathtubs', v_parent_id, 1),
      ('Baby Shampoo', 'Бебешки шампоан', 'baby-shampoo', v_parent_id, 2),
      ('Baby Lotion', 'Бебешки лосион', 'baby-lotion', v_parent_id, 3),
      ('Bath Toys', 'Играчки за баня', 'bath-toys', v_parent_id, 4),
      ('Baby Towels', 'Бебешки кърпи', 'baby-towels', v_parent_id, 5),
      ('Bath Seats', 'Столчета за баня', 'bath-seats', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kids Clothing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kids-clothing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Girls Clothing', 'Момичешки дрехи', 'girls-clothing', v_parent_id, 1),
      ('Boys Clothing', 'Момчешки дрехи', 'boys-clothing', v_parent_id, 2),
      ('Baby Clothing', 'Бебешки дрехи', 'baby-clothing', v_parent_id, 3),
      ('Toddler Clothing', 'Дрехи за малки деца', 'toddler-clothing', v_parent_id, 4),
      ('Kids Shoes', 'Детски обувки', 'kids-shoes', v_parent_id, 5),
      ('School Uniforms', 'Училищни униформи', 'school-uniforms', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kids Shoes deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kids-shoes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Girls Shoes', 'Момичешки обувки', 'girls-shoes', v_parent_id, 1),
      ('Boys Shoes', 'Момчешки обувки', 'boys-shoes', v_parent_id, 2),
      ('Kids Sneakers', 'Детски маратонки', 'kids-sneakers', v_parent_id, 3),
      ('Kids Sandals', 'Детски сандали', 'kids-sandals', v_parent_id, 4),
      ('Kids Boots', 'Детски ботуши', 'kids-boots', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
