
-- Batch 76: Additional categories to exceed 7100
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Video Games deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'video-games';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Action Games', 'Екшън игри', 'action-games', v_parent_id, 1),
      ('Adventure Games', 'Приключенски игри', 'adventure-games', v_parent_id, 2),
      ('Sports Games', 'Спортни игри', 'sports-games', v_parent_id, 3),
      ('Racing Games', 'Състезателни игри', 'racing-games', v_parent_id, 4),
      ('RPG Games', 'RPG игри', 'rpg-games', v_parent_id, 5),
      ('Strategy Games', 'Стратегии', 'strategy-games', v_parent_id, 6),
      ('Simulation Games', 'Симулации', 'simulation-games', v_parent_id, 7),
      ('Fighting Games', 'Бойни игри', 'fighting-games', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Collectibles deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'collectibles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Coins Collectible', 'Монети', 'coins-collectible', v_parent_id, 1),
      ('Stamps', 'Марки', 'stamps', v_parent_id, 2),
      ('Trading Cards', 'Колекционерски карти', 'trading-cards', v_parent_id, 3),
      ('Sports Memorabilia', 'Спортни сувенири', 'sports-memorabilia', v_parent_id, 4),
      ('Movie Memorabilia', 'Филмови сувенири', 'movie-memorabilia', v_parent_id, 5),
      ('Figurines', 'Фигурки', 'figurines', v_parent_id, 6),
      ('Comic Books', 'Комикси', 'comic-books', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Travel deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'travel';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Luggage', 'Багаж', 'luggage', v_parent_id, 1),
      ('Travel Backpacks', 'Пътнически раници', 'travel-backpacks', v_parent_id, 2),
      ('Carry-On Bags', 'Ръчен багаж', 'carry-on-bags', v_parent_id, 3),
      ('Checked Bags', 'Регистриран багаж', 'checked-bags', v_parent_id, 4),
      ('Travel Accessories', 'Аксесоари за пътуване', 'travel-accessories', v_parent_id, 5),
      ('Packing Cubes', 'Органайзери за багаж', 'packing-cubes', v_parent_id, 6),
      ('Travel Pillows', 'Пътнически възглавници', 'travel-pillows', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Luggage deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'luggage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Spinner Luggage', 'Спинер куфари', 'spinner-luggage', v_parent_id, 1),
      ('Hardside Luggage', 'Твърди куфари', 'hardside-luggage', v_parent_id, 2),
      ('Softside Luggage', 'Меки куфари', 'softside-luggage', v_parent_id, 3),
      ('Luggage Sets', 'Комплекти куфари', 'luggage-sets', v_parent_id, 4),
      ('Garment Bags', 'Чанти за дрехи', 'garment-bags', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Watches deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'watches';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Analog Watches', 'Аналогови часовници', 'analog-watches', v_parent_id, 1),
      ('Digital Watches', 'Дигитални часовници', 'digital-watches', v_parent_id, 2),
      ('Dress Watches', 'Официални часовници', 'dress-watches', v_parent_id, 3),
      ('Sport Watches', 'Спортни часовници', 'sport-watches', v_parent_id, 4),
      ('Dive Watches', 'Водоустойчиви часовници', 'dive-watches', v_parent_id, 5),
      ('Watch Bands', 'Каишки за часовници', 'watch-bands', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sunglasses deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sunglasses';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Aviator Sunglasses', 'Авиаторски очила', 'aviator-sunglasses', v_parent_id, 1),
      ('Wayfarer Sunglasses', 'Уейфарър очила', 'wayfarer-sunglasses', v_parent_id, 2),
      ('Sport Sunglasses', 'Спортни слънчеви очила', 'sport-sunglasses', v_parent_id, 3),
      ('Polarized Sunglasses', 'Поляризирани очила', 'polarized-sunglasses', v_parent_id, 4),
      ('Round Sunglasses', 'Кръгли очила', 'round-sunglasses', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bags & Purses deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bags-purses';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tote Bags', 'Тотъл чанти', 'tote-bags', v_parent_id, 1),
      ('Crossbody Bags', 'Кростбоди чанти', 'crossbody-bags', v_parent_id, 2),
      ('Shoulder Bags', 'Чанти за рамо', 'shoulder-bags', v_parent_id, 3),
      ('Clutches', 'Клъч чанти', 'clutches', v_parent_id, 4),
      ('Messenger Bags', 'Месинджър чанти', 'messenger-bags', v_parent_id, 5),
      ('Backpacks Fashion', 'Модни раници', 'backpacks-fashion', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Footwear deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'footwear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Running Shoes', 'Обувки за бягане', 'running-shoes', v_parent_id, 1),
      ('Walking Shoes', 'Обувки за ходене', 'walking-shoes', v_parent_id, 2),
      ('Casual Shoes', 'Ежедневни обувки', 'casual-shoes', v_parent_id, 3),
      ('Formal Shoes', 'Официални обувки', 'formal-shoes', v_parent_id, 4),
      ('Slippers', 'Пантофи', 'slippers', v_parent_id, 5),
      ('Flip Flops', 'Джапанки', 'flip-flops', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Outerwear deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outerwear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Winter Jackets', 'Зимни якета', 'winter-jackets', v_parent_id, 1),
      ('Rain Jackets', 'Дъждобрани', 'rain-jackets', v_parent_id, 2),
      ('Leather Jackets', 'Кожени якета', 'leather-jackets', v_parent_id, 3),
      ('Puffer Jackets', 'Пухени якета', 'puffer-jackets', v_parent_id, 4),
      ('Trench Coats', 'Тренчкотове', 'trench-coats', v_parent_id, 5),
      ('Parkas', 'Парки', 'parkas', v_parent_id, 6),
      ('Fleece Jackets', 'Полар якета', 'fleece-jackets', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Activewear deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'activewear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Leggings', 'Клинове', 'leggings', v_parent_id, 1),
      ('Sports Bras', 'Спортни сутиени', 'sports-bras', v_parent_id, 2),
      ('Athletic Shorts', 'Спортни шорти', 'athletic-shorts', v_parent_id, 3),
      ('Tank Tops', 'Потници', 'tank-tops', v_parent_id, 4),
      ('Workout Shirts', 'Тренировъчни тениски', 'workout-shirts', v_parent_id, 5),
      ('Track Suits', 'Анцузи', 'track-suits', v_parent_id, 6),
      ('Compression Wear', 'Компресионно облекло', 'compression-wear', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
