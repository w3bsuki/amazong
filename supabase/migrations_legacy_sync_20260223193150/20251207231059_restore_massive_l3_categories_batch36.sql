
-- Batch 36: More deep categories - Clothing, Fashion, Sports
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Men's Clothing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-shirts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dress Shirts', 'Официални ризи', 'mens-dress-shirts', v_parent_id, 1),
      ('Casual Shirts', 'Ежедневни ризи', 'mens-casual-shirts', v_parent_id, 2),
      ('Polo Shirts', 'Поло тениски', 'mens-polo-shirts', v_parent_id, 3),
      ('Flannel Shirts', 'Фланелени ризи', 'mens-flannel-shirts', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-pants';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dress Pants', 'Официални панталони', 'mens-dress-pants', v_parent_id, 1),
      ('Chinos', 'Чино панталони', 'mens-chinos', v_parent_id, 2),
      ('Cargo Pants', 'Карго панталони', 'mens-cargo-pants', v_parent_id, 3),
      ('Joggers', 'Джогъри', 'mens-joggers', v_parent_id, 4),
      ('Shorts', 'Къси панталони', 'mens-shorts', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-jeans';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Slim Fit Jeans', 'Слим джинси', 'mens-slim-jeans', v_parent_id, 1),
      ('Straight Fit Jeans', 'Прави джинси', 'mens-straight-jeans', v_parent_id, 2),
      ('Skinny Jeans', 'Скини джинси', 'mens-skinny-jeans', v_parent_id, 3),
      ('Relaxed Fit Jeans', 'Свободни джинси', 'mens-relaxed-jeans', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-jackets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Leather Jackets', 'Кожени якета', 'mens-leather-jackets', v_parent_id, 1),
      ('Denim Jackets', 'Дънкови якета', 'mens-denim-jackets', v_parent_id, 2),
      ('Bomber Jackets', 'Бомбър якета', 'mens-bomber-jackets', v_parent_id, 3),
      ('Winter Jackets', 'Зимни якета', 'mens-winter-jackets', v_parent_id, 4),
      ('Rain Jackets', 'Якета за дъжд', 'mens-rain-jackets', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Women's Clothing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-tops';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Blouses', 'Блузи', 'womens-blouses', v_parent_id, 1),
      ('Tank Tops', 'Потници', 'womens-tank-tops', v_parent_id, 2),
      ('Crop Tops', 'Къси топове', 'womens-crop-tops', v_parent_id, 3),
      ('Tunics', 'Туники', 'womens-tunics', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-dresses';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Casual Dresses', 'Ежедневни рокли', 'womens-casual-dresses', v_parent_id, 1),
      ('Evening Dresses', 'Вечерни рокли', 'womens-evening-dresses', v_parent_id, 2),
      ('Maxi Dresses', 'Макси рокли', 'womens-maxi-dresses', v_parent_id, 3),
      ('Mini Dresses', 'Мини рокли', 'womens-mini-dresses', v_parent_id, 4),
      ('Cocktail Dresses', 'Коктейлни рокли', 'womens-cocktail-dresses', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-jeans';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Skinny Jeans', 'Скини джинси', 'womens-skinny-jeans', v_parent_id, 1),
      ('Mom Jeans', 'Мом джинси', 'womens-mom-jeans', v_parent_id, 2),
      ('Boyfriend Jeans', 'Бойфренд джинси', 'womens-boyfriend-jeans', v_parent_id, 3),
      ('Wide Leg Jeans', 'Широки джинси', 'womens-wide-leg-jeans', v_parent_id, 4),
      ('High-Waisted Jeans', 'Джинси с висока талия', 'womens-high-waisted-jeans', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-skirts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Mini Skirts', 'Мини поли', 'womens-mini-skirts', v_parent_id, 1),
      ('Midi Skirts', 'Миди поли', 'womens-midi-skirts', v_parent_id, 2),
      ('Maxi Skirts', 'Макси поли', 'womens-maxi-skirts', v_parent_id, 3),
      ('Pencil Skirts', 'Молив поли', 'womens-pencil-skirts', v_parent_id, 4),
      ('Pleated Skirts', 'Плисирани поли', 'womens-pleated-skirts', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Shoes deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-sneakers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Running Sneakers', 'Маратонки за бягане', 'mens-running-sneakers', v_parent_id, 1),
      ('Casual Sneakers', 'Ежедневни маратонки', 'mens-casual-sneakers', v_parent_id, 2),
      ('High-Top Sneakers', 'Високи маратонки', 'mens-high-top-sneakers', v_parent_id, 3),
      ('Slip-On Sneakers', 'Слип-он маратонки', 'mens-slip-on-sneakers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-boots';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Chelsea Boots', 'Челси боти', 'mens-chelsea-boots', v_parent_id, 1),
      ('Work Boots', 'Работни боти', 'mens-work-boots', v_parent_id, 2),
      ('Hiking Boots', 'Туристически боти', 'mens-hiking-boots', v_parent_id, 3),
      ('Dress Boots', 'Официални боти', 'mens-dress-boots', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-heels';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Stilettos', 'Стилети', 'womens-stilettos', v_parent_id, 1),
      ('Block Heels', 'Токове', 'womens-block-heels', v_parent_id, 2),
      ('Wedges', 'Платформи', 'womens-wedges', v_parent_id, 3),
      ('Kitten Heels', 'Ниски токчета', 'womens-kitten-heels', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-boots';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Ankle Boots', 'Боти до глезена', 'womens-ankle-boots', v_parent_id, 1),
      ('Knee-High Boots', 'Ботуши до коляното', 'womens-knee-high-boots', v_parent_id, 2),
      ('Chelsea Boots', 'Челси боти', 'womens-chelsea-boots', v_parent_id, 3),
      ('Combat Boots', 'Кубинки', 'womens-combat-boots', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sports Equipment deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fitness-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Treadmills', 'Бягащи пътеки', 'treadmills', v_parent_id, 1),
      ('Exercise Bikes', 'Велоергометри', 'exercise-bikes', v_parent_id, 2),
      ('Ellipticals', 'Крос тренажори', 'ellipticals', v_parent_id, 3),
      ('Rowing Machines', 'Гребни тренажори', 'rowing-machines', v_parent_id, 4),
      ('Dumbbells', 'Дъмбели', 'dumbbells', v_parent_id, 5),
      ('Kettlebells', 'Кетълбели', 'kettlebells', v_parent_id, 6),
      ('Resistance Bands', 'Ластици', 'resistance-bands', v_parent_id, 7),
      ('Yoga Mats', 'Постелки за йога', 'yoga-mats', v_parent_id, 8),
      ('Weight Benches', 'Фитнес пейки', 'weight-benches', v_parent_id, 9),
      ('Pull-Up Bars', 'Лости за набиране', 'pull-up-bars', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cycling';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Road Bikes', 'Шосейни велосипеди', 'road-bikes', v_parent_id, 1),
      ('Mountain Bikes', 'Планински велосипеди', 'mountain-bikes', v_parent_id, 2),
      ('Electric Bikes', 'Електрически велосипеди', 'electric-bikes', v_parent_id, 3),
      ('BMX Bikes', 'BMX велосипеди', 'bmx-bikes', v_parent_id, 4),
      ('Folding Bikes', 'Сгъваеми велосипеди', 'folding-bikes', v_parent_id, 5),
      ('Kids Bikes', 'Детски велосипеди', 'kids-bikes', v_parent_id, 6),
      ('Bike Helmets', 'Каски за колоездене', 'bike-helmets', v_parent_id, 7),
      ('Bike Lights', 'Светлини за велосипед', 'bike-lights', v_parent_id, 8),
      ('Bike Locks', 'Ключалки за велосипед', 'bike-locks', v_parent_id, 9),
      ('Bike Accessories', 'Аксесоари за велосипед', 'bike-accessories-cycling', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'running';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Running Shoes', 'Обувки за бягане', 'running-shoes-sport', v_parent_id, 1),
      ('Running Apparel', 'Облекло за бягане', 'running-apparel', v_parent_id, 2),
      ('Running Watches', 'Часовници за бягане', 'running-watches', v_parent_id, 3),
      ('Running Accessories', 'Аксесоари за бягане', 'running-accessories', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'swimming';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Swimsuits', 'Бански', 'swimsuits', v_parent_id, 1),
      ('Swim Goggles', 'Очила за плуване', 'swim-goggles', v_parent_id, 2),
      ('Swim Caps', 'Шапки за плуване', 'swim-caps', v_parent_id, 3),
      ('Pool Accessories', 'Аксесоари за басейн', 'pool-accessories', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
