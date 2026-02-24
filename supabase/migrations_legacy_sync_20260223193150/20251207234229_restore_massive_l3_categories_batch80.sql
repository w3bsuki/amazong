
-- Batch 80: Final categories to exceed 7100
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Arts & Crafts deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'arts-crafts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Drawing Supplies', 'Принадлежности за рисуване', 'drawing-supplies', v_parent_id, 1),
      ('Painting Supplies', 'Принадлежности за боядисване', 'painting-supplies', v_parent_id, 2),
      ('Paper Crafts', 'Хартиени занаяти', 'paper-crafts', v_parent_id, 3),
      ('Fabric Crafts', 'Текстилни занаяти', 'fabric-crafts', v_parent_id, 4),
      ('Wood Crafts', 'Дървени занаяти', 'wood-crafts', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Party Themes deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'party-themes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Birthday Party', 'Рожден ден', 'birthday-party', v_parent_id, 1),
      ('Wedding Party', 'Сватба', 'wedding-party', v_parent_id, 2),
      ('Baby Shower', 'Бебешко парти', 'baby-shower', v_parent_id, 3),
      ('Graduation Party', 'Дипломиране', 'graduation-party', v_parent_id, 4),
      ('Holiday Party', 'Празнично парти', 'holiday-party', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cake Decorating deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cake-decorating';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cake Toppers', 'Топери за торти', 'cake-toppers', v_parent_id, 1),
      ('Fondant Tools', 'Инструменти за фондан', 'fondant-tools', v_parent_id, 2),
      ('Piping Tips', 'Накрайници за пош', 'piping-tips', v_parent_id, 3),
      ('Cake Stands', 'Стойки за торти', 'cake-stands', v_parent_id, 4),
      ('Cake Molds', 'Форми за торти', 'cake-molds', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Wedding Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wedding-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wedding Invitations', 'Сватбени покани', 'wedding-invitations', v_parent_id, 1),
      ('Wedding Favors', 'Сватбени подаръци', 'wedding-favors', v_parent_id, 2),
      ('Wedding Decor', 'Сватбена декорация', 'wedding-decor', v_parent_id, 3),
      ('Bridal Accessories', 'Булченски аксесоари', 'bridal-accessories', v_parent_id, 4),
      ('Wedding Cake Supplies', 'Принадлежности за сватбена торта', 'wedding-cake-supplies', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Shower Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-shower-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baby Shower Decor', 'Декорация за бебешко парти', 'baby-shower-decor', v_parent_id, 1),
      ('Baby Shower Games', 'Игри за бебешко парти', 'baby-shower-games', v_parent_id, 2),
      ('Baby Shower Favors', 'Подаръци за бебешко парти', 'baby-shower-favors', v_parent_id, 3),
      ('Gender Reveal', 'Разкриване на пола', 'gender-reveal', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Holiday Decorations deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'holiday-decorations';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Christmas Trees', 'Коледни елхи', 'christmas-trees', v_parent_id, 1),
      ('Christmas Ornaments', 'Коледни играчки', 'christmas-ornaments', v_parent_id, 2),
      ('Christmas Lights', 'Коледни лампички', 'christmas-lights', v_parent_id, 3),
      ('Christmas Stockings', 'Коледни чорапи', 'christmas-stockings', v_parent_id, 4),
      ('Christmas Wreaths', 'Коледни венци', 'christmas-wreaths', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Costumes deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'costumes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Halloween Costumes', 'Хелоуин костюми', 'halloween-costumes', v_parent_id, 1),
      ('Adult Costumes', 'Костюми за възрастни', 'adult-costumes', v_parent_id, 2),
      ('Kids Costumes', 'Детски костюми', 'kids-costumes', v_parent_id, 3),
      ('Pet Costumes', 'Костюми за домашни любимци', 'pet-costumes', v_parent_id, 4),
      ('Costume Accessories', 'Аксесоари за костюми', 'costume-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gardening Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gardening-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Garden Kneelers', 'Градински наколенки', 'garden-kneelers', v_parent_id, 1),
      ('Garden Aprons', 'Градински престилки', 'garden-aprons', v_parent_id, 2),
      ('Plant Labels', 'Етикети за растения', 'plant-labels', v_parent_id, 3),
      ('Garden Twine', 'Градински канап', 'garden-twine', v_parent_id, 4),
      ('Garden Markers', 'Градински маркери', 'garden-markers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bird Supplies Wild deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bird-supplies-wild';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bird Feeders', 'Хранилки за птици', 'bird-feeders', v_parent_id, 1),
      ('Bird Houses', 'Къщички за птици', 'bird-houses', v_parent_id, 2),
      ('Bird Seed', 'Семена за птици', 'bird-seed', v_parent_id, 3),
      ('Hummingbird Feeders', 'Хранилки за колибри', 'hummingbird-feeders', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Composting deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'composting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Compost Bins', 'Компостери', 'compost-bins', v_parent_id, 1),
      ('Compost Tumblers', 'Компост барабани', 'compost-tumblers', v_parent_id, 2),
      ('Worm Composters', 'Червен компост', 'worm-composters', v_parent_id, 3),
      ('Compost Thermometers', 'Термометри за компост', 'compost-thermometers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Irrigation deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'irrigation';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sprinklers', 'Пръскачки', 'sprinklers', v_parent_id, 1),
      ('Drip Irrigation', 'Капково напояване', 'drip-irrigation', v_parent_id, 2),
      ('Irrigation Timers', 'Таймери за напояване', 'irrigation-timers', v_parent_id, 3),
      ('Hose Reels', 'Макари за маркуч', 'hose-reels', v_parent_id, 4),
      ('Hose Nozzles', 'Накрайници за маркуч', 'hose-nozzles', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
