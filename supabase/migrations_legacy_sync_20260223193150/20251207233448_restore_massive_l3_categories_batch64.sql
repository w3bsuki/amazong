
-- Batch 64: More office, furniture, and various subcategories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Office Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Office Desks', 'Офис бюра', 'office-desks', v_parent_id, 1),
      ('Office Chairs', 'Офис столове', 'office-chairs', v_parent_id, 2),
      ('Standing Desks', 'Бюра за работа прав', 'standing-desks', v_parent_id, 3),
      ('Bookcases', 'Етажерки за книги', 'bookcases', v_parent_id, 4),
      ('Credenzas', 'Шкафове за офис', 'credenzas', v_parent_id, 5),
      ('Conference Tables', 'Конферентни маси', 'conference-tables', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Living Room Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'living-room-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sofas', 'Дивани', 'sofas', v_parent_id, 1),
      ('Loveseats', 'Двуместни дивани', 'loveseats', v_parent_id, 2),
      ('Sectionals', 'Секционни дивани', 'sectionals', v_parent_id, 3),
      ('Recliners', 'Фотьойли', 'recliners', v_parent_id, 4),
      ('Coffee Tables', 'Кафе масички', 'coffee-tables', v_parent_id, 5),
      ('End Tables', 'Крайни масички', 'end-tables', v_parent_id, 6),
      ('TV Stands', 'Стойки за телевизори', 'tv-stands', v_parent_id, 7),
      ('Entertainment Centers', 'Развлекателни центрове', 'entertainment-centers', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bedroom Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bedroom-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Beds', 'Легла', 'beds', v_parent_id, 1),
      ('Mattresses', 'Матраци', 'mattresses', v_parent_id, 2),
      ('Dressers', 'Скринове', 'dressers', v_parent_id, 3),
      ('Nightstands', 'Нощни шкафчета', 'nightstands', v_parent_id, 4),
      ('Wardrobes', 'Гардероби', 'wardrobes', v_parent_id, 5),
      ('Bedroom Sets', 'Спални комплекти', 'bedroom-sets', v_parent_id, 6),
      ('Headboards', 'Табли за легла', 'headboards', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Dining Room Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dining-room-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dining Tables', 'Трапезни маси', 'dining-tables', v_parent_id, 1),
      ('Dining Chairs', 'Трапезни столове', 'dining-chairs', v_parent_id, 2),
      ('Dining Sets', 'Трапезарии', 'dining-sets', v_parent_id, 3),
      ('Bar Stools', 'Бар столове', 'bar-stools', v_parent_id, 4),
      ('Buffets', 'Бюфети', 'buffets', v_parent_id, 5),
      ('China Cabinets', 'Витрини', 'china-cabinets', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kids Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kids-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Kids Beds', 'Детски легла', 'kids-beds', v_parent_id, 1),
      ('Bunk Beds', 'Двуетажни легла', 'bunk-beds', v_parent_id, 2),
      ('Kids Desks', 'Детски бюра', 'kids-desks', v_parent_id, 3),
      ('Kids Chairs', 'Детски столове', 'kids-chairs', v_parent_id, 4),
      ('Toy Chests', 'Сандъци за играчки', 'toy-chests', v_parent_id, 5),
      ('Kids Dressers', 'Детски скринове', 'kids-dressers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bathroom Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bathroom-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bathroom Vanities', 'Шкафове за баня', 'bathroom-vanities', v_parent_id, 1),
      ('Bathroom Cabinets', 'Шкафчета за баня', 'bathroom-cabinets', v_parent_id, 2),
      ('Medicine Cabinets', 'Аптечки', 'medicine-cabinets', v_parent_id, 3),
      ('Bathroom Shelves', 'Рафтове за баня', 'bathroom-shelves', v_parent_id, 4),
      ('Toilet Paper Holders', 'Поставки за тоалетна хартия', 'toilet-paper-holders', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Entryway Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'entryway-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Coat Racks', 'Закачалки за палта', 'coat-racks', v_parent_id, 1),
      ('Hall Trees', 'Закачалки за антре', 'hall-trees', v_parent_id, 2),
      ('Shoe Racks', 'Стелажи за обувки', 'shoe-racks', v_parent_id, 3),
      ('Entry Benches', 'Пейки за антре', 'entry-benches', v_parent_id, 4),
      ('Console Tables', 'Конзолни маси', 'console-tables', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Accent Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'accent-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Accent Chairs', 'Акцентни столове', 'accent-chairs', v_parent_id, 1),
      ('Accent Tables', 'Акцентни масички', 'accent-tables', v_parent_id, 2),
      ('Ottomans', 'Табуретки', 'ottomans', v_parent_id, 3),
      ('Benches', 'Пейки', 'benches', v_parent_id, 4),
      ('Room Dividers', 'Паравани', 'room-dividers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
