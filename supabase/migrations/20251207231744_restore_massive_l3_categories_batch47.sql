
-- Batch 47: More deep categories - Makeup, Fragrance, Sewing, Crafts
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Makeup deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'makeup';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Face Makeup', 'Грим за лице', 'face-makeup', v_parent_id, 1),
      ('Eye Makeup', 'Грим за очи', 'eye-makeup', v_parent_id, 2),
      ('Lip Makeup', 'Грим за устни', 'lip-makeup', v_parent_id, 3),
      ('Makeup Brushes', 'Четки за грим', 'makeup-brushes', v_parent_id, 4),
      ('Makeup Palettes', 'Палитри за грим', 'makeup-palettes', v_parent_id, 5),
      ('Setting Sprays', 'Фиксиращи спрейове', 'setting-sprays', v_parent_id, 6),
      ('Makeup Removers', 'Продукти за премахване на грим', 'makeup-removers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'face-makeup';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Foundations', 'Фон дьо тен', 'foundations', v_parent_id, 1),
      ('Concealers', 'Коректори', 'concealers', v_parent_id, 2),
      ('Blush', 'Руж', 'blush', v_parent_id, 3),
      ('Bronzers', 'Бронзанти', 'bronzers', v_parent_id, 4),
      ('Highlighters', 'Хайлайтъри', 'highlighters', v_parent_id, 5),
      ('Primers', 'Праймери', 'primers', v_parent_id, 6),
      ('Setting Powders', 'Пудри за фиксиране', 'setting-powders', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'eye-makeup';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Eyeshadows', 'Сенки за очи', 'eyeshadows', v_parent_id, 1),
      ('Eyeliners', 'Очни линии', 'eyeliners', v_parent_id, 2),
      ('Mascaras', 'Спирали', 'mascaras', v_parent_id, 3),
      ('False Lashes', 'Изкуствени мигли', 'false-lashes', v_parent_id, 4),
      ('Eyebrow Products', 'Продукти за вежди', 'eyebrow-products', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'lip-makeup';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Lipsticks', 'Червила', 'lipsticks', v_parent_id, 1),
      ('Lip Glosses', 'Гланцове за устни', 'lip-glosses', v_parent_id, 2),
      ('Lip Liners', 'Моливи за устни', 'lip-liners', v_parent_id, 3),
      ('Lip Stains', 'Тинтове за устни', 'lip-stains', v_parent_id, 4),
      ('Lip Balms', 'Балсами за устни', 'lip-balms', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fragrance deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fragrances';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Mens Cologne', 'Мъжки парфюми', 'mens-cologne', v_parent_id, 1),
      ('Womens Perfume', 'Дамски парфюми', 'womens-perfume', v_parent_id, 2),
      ('Unisex Fragrances', 'Унисекс парфюми', 'unisex-fragrances', v_parent_id, 3),
      ('Body Mists', 'Спрейове за тяло', 'body-mists', v_parent_id, 4),
      ('Fragrance Sets', 'Комплекти парфюми', 'fragrance-sets', v_parent_id, 5),
      ('Solid Perfumes', 'Твърди парфюми', 'solid-perfumes', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sewing & Fabric deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sewing-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sewing Machines', 'Шевни машини', 'sewing-machines', v_parent_id, 1),
      ('Sewing Thread', 'Конци', 'sewing-thread', v_parent_id, 2),
      ('Sewing Needles', 'Игли за шиене', 'sewing-needles', v_parent_id, 3),
      ('Sewing Scissors', 'Ножици за шиене', 'sewing-scissors', v_parent_id, 4),
      ('Pins & Pincushions', 'Карфици', 'pins-pincushions', v_parent_id, 5),
      ('Patterns', 'Шаблони', 'sewing-patterns', v_parent_id, 6),
      ('Zippers', 'Ципове', 'zippers', v_parent_id, 7),
      ('Buttons', 'Копчета', 'buttons', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fabrics';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cotton Fabric', 'Памучен плат', 'cotton-fabric', v_parent_id, 1),
      ('Silk Fabric', 'Копринен плат', 'silk-fabric', v_parent_id, 2),
      ('Linen Fabric', 'Ленен плат', 'linen-fabric', v_parent_id, 3),
      ('Wool Fabric', 'Вълнен плат', 'wool-fabric', v_parent_id, 4),
      ('Denim Fabric', 'Дънков плат', 'denim-fabric', v_parent_id, 5),
      ('Synthetic Fabrics', 'Синтетични платове', 'synthetic-fabrics', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Knitting & Yarn deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'knitting-crochet';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Yarn', 'Прежда', 'yarn', v_parent_id, 1),
      ('Knitting Needles', 'Игли за плетене', 'knitting-needles', v_parent_id, 2),
      ('Crochet Hooks', 'Куки за плетене', 'crochet-hooks', v_parent_id, 3),
      ('Knitting Patterns', 'Модели за плетене', 'knitting-patterns', v_parent_id, 4),
      ('Knitting Kits', 'Комплекти за плетене', 'knitting-kits', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'yarn';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cotton Yarn', 'Памучна прежда', 'cotton-yarn', v_parent_id, 1),
      ('Wool Yarn', 'Вълнена прежда', 'wool-yarn', v_parent_id, 2),
      ('Acrylic Yarn', 'Акрилна прежда', 'acrylic-yarn', v_parent_id, 3),
      ('Blend Yarn', 'Смесена прежда', 'blend-yarn', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Jewelry Making deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'jewelry-making';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Beads', 'Мъниста', 'beads', v_parent_id, 1),
      ('Jewelry Findings', 'Фурнитура за бижута', 'jewelry-findings', v_parent_id, 2),
      ('Jewelry Tools', 'Инструменти за бижута', 'jewelry-tools', v_parent_id, 3),
      ('Wire & Cord', 'Тел и корд', 'wire-cord', v_parent_id, 4),
      ('Charms & Pendants', 'Талисмани и висулки', 'charms-pendants', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Scrapbooking deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'scrapbooking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Scrapbook Albums', 'Скрапбук албуми', 'scrapbook-albums', v_parent_id, 1),
      ('Scrapbook Paper', 'Скрапбук хартия', 'scrapbook-paper', v_parent_id, 2),
      ('Embellishments', 'Декоративни елементи', 'embellishments', v_parent_id, 3),
      ('Die Cuts', 'Изрязани елементи', 'die-cuts', v_parent_id, 4),
      ('Stamps & Ink', 'Печати и мастила', 'stamps-ink', v_parent_id, 5),
      ('Stickers', 'Стикери за скрапбук', 'scrapbook-stickers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
