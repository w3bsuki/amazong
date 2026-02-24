
-- Batch 66: Clothing categories for Men and Women
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Mens Clothing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-clothing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Mens T-Shirts', 'Мъжки тениски', 'mens-t-shirts', v_parent_id, 1),
      ('Mens Shirts', 'Мъжки ризи', 'mens-shirts', v_parent_id, 2),
      ('Mens Pants', 'Мъжки панталони', 'mens-pants', v_parent_id, 3),
      ('Mens Jeans', 'Мъжки дънки', 'mens-jeans', v_parent_id, 4),
      ('Mens Shorts', 'Мъжки шорти', 'mens-shorts', v_parent_id, 5),
      ('Mens Sweaters', 'Мъжки пуловери', 'mens-sweaters', v_parent_id, 6),
      ('Mens Jackets', 'Мъжки якета', 'mens-jackets', v_parent_id, 7),
      ('Mens Suits', 'Мъжки костюми', 'mens-suits', v_parent_id, 8),
      ('Mens Activewear', 'Мъжко спортно облекло', 'mens-activewear', v_parent_id, 9),
      ('Mens Underwear', 'Мъжко бельо', 'mens-underwear', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Womens Clothing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-clothing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Womens Dresses', 'Дамски рокли', 'womens-dresses', v_parent_id, 1),
      ('Womens Tops', 'Дамски блузи', 'womens-tops', v_parent_id, 2),
      ('Womens Pants', 'Дамски панталони', 'womens-pants', v_parent_id, 3),
      ('Womens Jeans', 'Дамски дънки', 'womens-jeans', v_parent_id, 4),
      ('Womens Skirts', 'Дамски поли', 'womens-skirts', v_parent_id, 5),
      ('Womens Sweaters', 'Дамски пуловери', 'womens-sweaters', v_parent_id, 6),
      ('Womens Jackets', 'Дамски якета', 'womens-jackets', v_parent_id, 7),
      ('Womens Activewear', 'Дамско спортно облекло', 'womens-activewear', v_parent_id, 8),
      ('Womens Lingerie', 'Дамско бельо', 'womens-lingerie', v_parent_id, 9),
      ('Womens Swimwear', 'Дамски бански', 'womens-swimwear', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Mens Shoes deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-shoes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Mens Sneakers', 'Мъжки маратонки', 'mens-sneakers', v_parent_id, 1),
      ('Mens Dress Shoes', 'Мъжки официални обувки', 'mens-dress-shoes', v_parent_id, 2),
      ('Mens Boots', 'Мъжки ботуши', 'mens-boots', v_parent_id, 3),
      ('Mens Sandals', 'Мъжки сандали', 'mens-sandals', v_parent_id, 4),
      ('Mens Loafers', 'Мъжки мокасини', 'mens-loafers', v_parent_id, 5),
      ('Mens Athletic Shoes', 'Мъжки спортни обувки', 'mens-athletic-shoes', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Womens Shoes deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-shoes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Womens Heels', 'Дамски обувки на ток', 'womens-heels', v_parent_id, 1),
      ('Womens Flats', 'Дамски равни обувки', 'womens-flats', v_parent_id, 2),
      ('Womens Boots', 'Дамски ботуши', 'womens-boots', v_parent_id, 3),
      ('Womens Sandals', 'Дамски сандали', 'womens-sandals', v_parent_id, 4),
      ('Womens Sneakers', 'Дамски маратонки', 'womens-sneakers', v_parent_id, 5),
      ('Womens Athletic Shoes', 'Дамски спортни обувки', 'womens-athletic-shoes', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Mens Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Mens Watches', 'Мъжки часовници', 'mens-watches', v_parent_id, 1),
      ('Mens Belts', 'Мъжки колани', 'mens-belts', v_parent_id, 2),
      ('Mens Wallets', 'Мъжки портфейли', 'mens-wallets', v_parent_id, 3),
      ('Mens Sunglasses', 'Мъжки слънчеви очила', 'mens-sunglasses', v_parent_id, 4),
      ('Mens Ties', 'Мъжки вратовръзки', 'mens-ties', v_parent_id, 5),
      ('Mens Hats', 'Мъжки шапки', 'mens-hats', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Womens Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Womens Watches', 'Дамски часовници', 'womens-watches', v_parent_id, 1),
      ('Womens Handbags', 'Дамски чанти', 'womens-handbags', v_parent_id, 2),
      ('Womens Wallets', 'Дамски портфейли', 'womens-wallets', v_parent_id, 3),
      ('Womens Sunglasses', 'Дамски слънчеви очила', 'womens-sunglasses', v_parent_id, 4),
      ('Womens Scarves', 'Дамски шалове', 'womens-scarves', v_parent_id, 5),
      ('Womens Hats', 'Дамски шапки', 'womens-hats', v_parent_id, 6),
      ('Womens Belts', 'Дамски колани', 'womens-belts', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Jewelry deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'jewelry';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Necklaces', 'Колиета', 'necklaces', v_parent_id, 1),
      ('Earrings', 'Обици', 'earrings', v_parent_id, 2),
      ('Bracelets', 'Гривни', 'bracelets', v_parent_id, 3),
      ('Rings', 'Пръстени', 'rings', v_parent_id, 4),
      ('Anklets', 'Гривни за глезен', 'anklets', v_parent_id, 5),
      ('Brooches', 'Брошки', 'brooches', v_parent_id, 6),
      ('Jewelry Sets', 'Комплекти бижута', 'jewelry-sets', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
