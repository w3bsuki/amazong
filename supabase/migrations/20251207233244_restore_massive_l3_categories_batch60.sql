
-- Batch 60: Seasonal decor, Party supplies, and outdoor living
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Seasonal Decor deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'seasonal-decor';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Christmas Decor', 'Коледна декорация', 'christmas-decor', v_parent_id, 1),
      ('Halloween Decor', 'Хелоуин декорация', 'halloween-decor', v_parent_id, 2),
      ('Easter Decor', 'Великденска декорация', 'easter-decor', v_parent_id, 3),
      ('Thanksgiving Decor', 'Декорация за Деня на благодарността', 'thanksgiving-decor', v_parent_id, 4),
      ('Valentine Decor', 'Валентинска декорация', 'valentine-decor', v_parent_id, 5),
      ('Spring Decor', 'Пролетна декорация', 'spring-decor', v_parent_id, 6),
      ('Fall Decor', 'Есенна декорация', 'fall-decor', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Party Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'party-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Balloons', 'Балони', 'balloons', v_parent_id, 1),
      ('Party Banners', 'Банери за партита', 'party-banners', v_parent_id, 2),
      ('Party Tableware', 'Съдове за партита', 'party-tableware', v_parent_id, 3),
      ('Party Favors', 'Подаръци за гости', 'party-favors', v_parent_id, 4),
      ('Party Games', 'Игри за партита', 'party-games', v_parent_id, 5),
      ('Pinatas', 'Пинята', 'pinatas', v_parent_id, 6),
      ('Confetti', 'Конфети', 'confetti', v_parent_id, 7),
      ('Streamers', 'Серпантини', 'streamers', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gift Wrap deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gift-wrap';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wrapping Paper', 'Опаковъчна хартия', 'wrapping-paper', v_parent_id, 1),
      ('Gift Bags', 'Подаръчни торби', 'gift-bags', v_parent_id, 2),
      ('Gift Boxes', 'Подаръчни кутии', 'gift-boxes', v_parent_id, 3),
      ('Ribbons Bows', 'Панделки и цветя', 'ribbons-bows', v_parent_id, 4),
      ('Tissue Paper', 'Тишу хартия', 'tissue-paper', v_parent_id, 5),
      ('Gift Tags', 'Етикети за подаръци', 'gift-tags', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Patio Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'patio-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Outdoor Sofas', 'Градински дивани', 'outdoor-sofas', v_parent_id, 1),
      ('Patio Chairs', 'Градински столове', 'patio-chairs', v_parent_id, 2),
      ('Patio Tables', 'Градински маси', 'patio-tables', v_parent_id, 3),
      ('Outdoor Dining Sets', 'Градински маси за хранене', 'outdoor-dining-sets', v_parent_id, 4),
      ('Hammocks', 'Хамаци', 'hammocks', v_parent_id, 5),
      ('Outdoor Benches', 'Градински пейки', 'outdoor-benches', v_parent_id, 6),
      ('Porch Swings', 'Градински люлки', 'porch-swings', v_parent_id, 7),
      ('Outdoor Chaises', 'Шезлонги', 'outdoor-chaises', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Grills & Outdoor Cooking
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'grills-outdoor-cooking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Charcoal Grills', 'Грилове на въглища', 'charcoal-grills', v_parent_id, 1),
      ('Gas Grills', 'Газови грилове', 'gas-grills', v_parent_id, 2),
      ('Electric Grills', 'Електрически грилове', 'electric-grills', v_parent_id, 3),
      ('Smokers', 'Пушилни', 'smokers', v_parent_id, 4),
      ('Pizza Ovens', 'Пещи за пица', 'pizza-ovens', v_parent_id, 5),
      ('Fire Pits', 'Огнища', 'fire-pits', v_parent_id, 6),
      ('Grill Accessories', 'Аксесоари за грил', 'grill-accessories', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Umbrellas & Shade
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'umbrellas-shade';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Patio Umbrellas', 'Градински чадъри', 'patio-umbrellas', v_parent_id, 1),
      ('Cantilever Umbrellas', 'Висящи чадъри', 'cantilever-umbrellas', v_parent_id, 2),
      ('Market Umbrellas', 'Пазарни чадъри', 'market-umbrellas', v_parent_id, 3),
      ('Shade Sails', 'Сенници платна', 'shade-sails', v_parent_id, 4),
      ('Gazebos', 'Беседки', 'gazebos', v_parent_id, 5),
      ('Canopies', 'Навеси', 'canopies', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Outdoor Decor
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outdoor-decor';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Garden Statues', 'Градински статуи', 'garden-statues', v_parent_id, 1),
      ('Outdoor Fountains', 'Градински фонтани', 'outdoor-fountains', v_parent_id, 2),
      ('Garden Stakes', 'Градински колчета', 'garden-stakes', v_parent_id, 3),
      ('Wind Chimes', 'Вятърни камбанки', 'wind-chimes', v_parent_id, 4),
      ('Bird Baths', 'Поилки за птици', 'bird-baths', v_parent_id, 5),
      ('Garden Flags', 'Градински флагове', 'garden-flags', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Outdoor Lighting
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outdoor-lighting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('String Lights', 'Коледни лампички', 'string-lights-outdoor', v_parent_id, 1),
      ('Solar Lights', 'Соларни лампи', 'solar-lights', v_parent_id, 2),
      ('Path Lights', 'Лампи за пътеки', 'path-lights', v_parent_id, 3),
      ('Spotlights Outdoor', 'Прожектори', 'spotlights-outdoor', v_parent_id, 4),
      ('Lanterns Outdoor', 'Фенери', 'lanterns-outdoor', v_parent_id, 5),
      ('Wall Lanterns', 'Стенни фенери', 'wall-lanterns', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Garden Tools
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'garden-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Shovels', 'Лопати', 'shovels', v_parent_id, 1),
      ('Rakes', 'Гребла', 'rakes', v_parent_id, 2),
      ('Garden Hoses', 'Маркучи', 'garden-hoses', v_parent_id, 3),
      ('Pruning Shears', 'Градинарски ножици', 'pruning-shears', v_parent_id, 4),
      ('Wheelbarrows', 'Ръчни колички', 'wheelbarrows', v_parent_id, 5),
      ('Garden Gloves', 'Градински ръкавици', 'garden-gloves', v_parent_id, 6),
      ('Watering Cans', 'Лейки', 'watering-cans', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
