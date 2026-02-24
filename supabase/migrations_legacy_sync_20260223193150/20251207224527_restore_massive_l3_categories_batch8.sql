
-- Batch 8: Fashion deep L3 categories (Men's, Women's, Kids')
DO $$
DECLARE
  v_fashion_id UUID;
  v_mens_id UUID;
  v_womens_id UUID;
  v_kids_id UUID;
  v_mens_clothing_id UUID;
  v_womens_clothing_id UUID;
  v_mens_shoes_id UUID;
  v_womens_shoes_id UUID;
  v_accessories_id UUID;
  v_bags_id UUID;
  v_watches_id UUID;
  v_jewelry_id UUID;
BEGIN
  SELECT id INTO v_fashion_id FROM categories WHERE slug = 'fashion';
  SELECT id INTO v_mens_id FROM categories WHERE slug = 'mens-fashion';
  SELECT id INTO v_womens_id FROM categories WHERE slug = 'womens-fashion';
  SELECT id INTO v_kids_id FROM categories WHERE slug = 'kids-fashion';
  SELECT id INTO v_mens_clothing_id FROM categories WHERE slug = 'mens-clothing';
  SELECT id INTO v_womens_clothing_id FROM categories WHERE slug = 'womens-clothing';
  SELECT id INTO v_mens_shoes_id FROM categories WHERE slug = 'mens-shoes';
  SELECT id INTO v_womens_shoes_id FROM categories WHERE slug = 'womens-shoes';
  SELECT id INTO v_accessories_id FROM categories WHERE slug = 'fashion-accessories';
  SELECT id INTO v_bags_id FROM categories WHERE slug = 'bags-luggage';
  SELECT id INTO v_watches_id FROM categories WHERE slug = 'watches';
  SELECT id INTO v_jewelry_id FROM categories WHERE slug = 'jewelry';
  
  -- Men's Clothing deep categories
  IF v_mens_clothing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('T-Shirts', 'Тениски', 'mens-tshirts', v_mens_clothing_id, 1),
    ('Graphic Tees', 'Тениски с принт', 'mens-tshirts-graphic', v_mens_clothing_id, 2),
    ('Plain T-Shirts', 'Едноцветни тениски', 'mens-tshirts-plain', v_mens_clothing_id, 3),
    ('Polo Shirts', 'Поло тениски', 'mens-polo-shirts', v_mens_clothing_id, 4),
    ('Dress Shirts', 'Ризи', 'mens-dress-shirts', v_mens_clothing_id, 5),
    ('Casual Shirts', 'Ежедневни ризи', 'mens-casual-shirts', v_mens_clothing_id, 6),
    ('Oxford Shirts', 'Оксфордски ризи', 'mens-oxford-shirts', v_mens_clothing_id, 7),
    ('Sweaters', 'Пуловери', 'mens-sweaters', v_mens_clothing_id, 8),
    ('Crewneck Sweaters', 'Пуловери с кръгла яка', 'mens-sweaters-crewneck', v_mens_clothing_id, 9),
    ('V-Neck Sweaters', 'Пуловери с V-образна яка', 'mens-sweaters-vneck', v_mens_clothing_id, 10),
    ('Cardigans', 'Жилетки', 'mens-cardigans', v_mens_clothing_id, 11),
    ('Hoodies', 'Суичъри с качулка', 'mens-hoodies', v_mens_clothing_id, 12),
    ('Zip-Up Hoodies', 'Суичъри с цип', 'mens-hoodies-zip', v_mens_clothing_id, 13),
    ('Pullover Hoodies', 'Суичъри без цип', 'mens-hoodies-pullover', v_mens_clothing_id, 14),
    ('Jackets', 'Якета', 'mens-jackets', v_mens_clothing_id, 15),
    ('Bomber Jackets', 'Бомбър якета', 'mens-jackets-bomber', v_mens_clothing_id, 16),
    ('Denim Jackets', 'Дънкови якета', 'mens-jackets-denim', v_mens_clothing_id, 17),
    ('Leather Jackets', 'Кожени якета', 'mens-jackets-leather', v_mens_clothing_id, 18),
    ('Winter Jackets', 'Зимни якета', 'mens-jackets-winter', v_mens_clothing_id, 19),
    ('Coats', 'Палта', 'mens-coats', v_mens_clothing_id, 20),
    ('Wool Coats', 'Вълнени палта', 'mens-coats-wool', v_mens_clothing_id, 21),
    ('Trench Coats', 'Тренч палта', 'mens-coats-trench', v_mens_clothing_id, 22),
    ('Jeans', 'Дънки', 'mens-jeans', v_mens_clothing_id, 23),
    ('Slim Fit Jeans', 'Дънки слим фит', 'mens-jeans-slim', v_mens_clothing_id, 24),
    ('Straight Fit Jeans', 'Дънки права кройка', 'mens-jeans-straight', v_mens_clothing_id, 25),
    ('Relaxed Fit Jeans', 'Дънки свободна кройка', 'mens-jeans-relaxed', v_mens_clothing_id, 26),
    ('Pants', 'Панталони', 'mens-pants', v_mens_clothing_id, 27),
    ('Chinos', 'Чино панталони', 'mens-chinos', v_mens_clothing_id, 28),
    ('Dress Pants', 'Официални панталони', 'mens-dress-pants', v_mens_clothing_id, 29),
    ('Cargo Pants', 'Карго панталони', 'mens-cargo-pants', v_mens_clothing_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Women's Clothing deep categories
  IF v_womens_clothing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Tops', 'Блузи', 'womens-tops', v_womens_clothing_id, 1),
    ('T-Shirts', 'Тениски', 'womens-tshirts', v_womens_clothing_id, 2),
    ('Blouses', 'Блузи', 'womens-blouses', v_womens_clothing_id, 3),
    ('Tank Tops', 'Потници', 'womens-tank-tops', v_womens_clothing_id, 4),
    ('Crop Tops', 'Къси топове', 'womens-crop-tops', v_womens_clothing_id, 5),
    ('Dresses', 'Рокли', 'womens-dresses', v_womens_clothing_id, 6),
    ('Casual Dresses', 'Ежедневни рокли', 'womens-dresses-casual', v_womens_clothing_id, 7),
    ('Formal Dresses', 'Официални рокли', 'womens-dresses-formal', v_womens_clothing_id, 8),
    ('Maxi Dresses', 'Макси рокли', 'womens-dresses-maxi', v_womens_clothing_id, 9),
    ('Mini Dresses', 'Мини рокли', 'womens-dresses-mini', v_womens_clothing_id, 10),
    ('Midi Dresses', 'Миди рокли', 'womens-dresses-midi', v_womens_clothing_id, 11),
    ('Skirts', 'Поли', 'womens-skirts', v_womens_clothing_id, 12),
    ('Mini Skirts', 'Мини поли', 'womens-skirts-mini', v_womens_clothing_id, 13),
    ('Midi Skirts', 'Миди поли', 'womens-skirts-midi', v_womens_clothing_id, 14),
    ('Maxi Skirts', 'Макси поли', 'womens-skirts-maxi', v_womens_clothing_id, 15),
    ('Jeans', 'Дънки', 'womens-jeans', v_womens_clothing_id, 16),
    ('Skinny Jeans', 'Дънки скини', 'womens-jeans-skinny', v_womens_clothing_id, 17),
    ('Boyfriend Jeans', 'Бойфренд дънки', 'womens-jeans-boyfriend', v_womens_clothing_id, 18),
    ('Mom Jeans', 'Мом дънки', 'womens-jeans-mom', v_womens_clothing_id, 19),
    ('Wide Leg Jeans', 'Широки дънки', 'womens-jeans-wide-leg', v_womens_clothing_id, 20),
    ('Pants', 'Панталони', 'womens-pants', v_womens_clothing_id, 21),
    ('Leggings', 'Клинове', 'womens-leggings', v_womens_clothing_id, 22),
    ('Sweaters', 'Пуловери', 'womens-sweaters', v_womens_clothing_id, 23),
    ('Cardigans', 'Жилетки', 'womens-cardigans', v_womens_clothing_id, 24),
    ('Jackets', 'Якета', 'womens-jackets', v_womens_clothing_id, 25),
    ('Blazers', 'Блейзъри', 'womens-blazers', v_womens_clothing_id, 26),
    ('Coats', 'Палта', 'womens-coats', v_womens_clothing_id, 27),
    ('Activewear', 'Спортно облекло', 'womens-activewear', v_womens_clothing_id, 28),
    ('Swimwear', 'Бански', 'womens-swimwear', v_womens_clothing_id, 29),
    ('Lingerie', 'Бельо', 'womens-lingerie', v_womens_clothing_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Men's Shoes deep categories
  IF v_mens_shoes_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sneakers', 'Кецове', 'mens-sneakers', v_mens_shoes_id, 1),
    ('Running Sneakers', 'Маратонки за бягане', 'mens-sneakers-running', v_mens_shoes_id, 2),
    ('Casual Sneakers', 'Ежедневни кецове', 'mens-sneakers-casual', v_mens_shoes_id, 3),
    ('High-Top Sneakers', 'Високи кецове', 'mens-sneakers-high-top', v_mens_shoes_id, 4),
    ('Low-Top Sneakers', 'Ниски кецове', 'mens-sneakers-low-top', v_mens_shoes_id, 5),
    ('Dress Shoes', 'Официални обувки', 'mens-dress-shoes', v_mens_shoes_id, 6),
    ('Oxfords', 'Оксфорд обувки', 'mens-shoes-oxfords', v_mens_shoes_id, 7),
    ('Derbies', 'Дерби обувки', 'mens-shoes-derbies', v_mens_shoes_id, 8),
    ('Loafers', 'Мокасини', 'mens-loafers', v_mens_shoes_id, 9),
    ('Penny Loafers', 'Пени мокасини', 'mens-loafers-penny', v_mens_shoes_id, 10),
    ('Boots', 'Боти', 'mens-boots', v_mens_shoes_id, 11),
    ('Chelsea Boots', 'Челси боти', 'mens-boots-chelsea', v_mens_shoes_id, 12),
    ('Chukka Boots', 'Чукка боти', 'mens-boots-chukka', v_mens_shoes_id, 13),
    ('Work Boots', 'Работни боти', 'mens-boots-work', v_mens_shoes_id, 14),
    ('Hiking Boots', 'Туристически обувки', 'mens-boots-hiking', v_mens_shoes_id, 15),
    ('Sandals', 'Сандали', 'mens-sandals', v_mens_shoes_id, 16),
    ('Flip Flops', 'Джапанки', 'mens-flip-flops', v_mens_shoes_id, 17),
    ('Slippers', 'Пантофи', 'mens-slippers', v_mens_shoes_id, 18),
    ('Athletic Shoes', 'Спортни обувки', 'mens-athletic-shoes', v_mens_shoes_id, 19),
    ('Basketball Shoes', 'Баскетболни обувки', 'mens-basketball-shoes', v_mens_shoes_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Women's Shoes deep categories
  IF v_womens_shoes_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sneakers', 'Кецове', 'womens-sneakers', v_womens_shoes_id, 1),
    ('Running Sneakers', 'Маратонки за бягане', 'womens-sneakers-running', v_womens_shoes_id, 2),
    ('Casual Sneakers', 'Ежедневни кецове', 'womens-sneakers-casual', v_womens_shoes_id, 3),
    ('Platform Sneakers', 'Платформени кецове', 'womens-sneakers-platform', v_womens_shoes_id, 4),
    ('Heels', 'Обувки с ток', 'womens-heels', v_womens_shoes_id, 5),
    ('Stilettos', 'Стилета', 'womens-stilettos', v_womens_shoes_id, 6),
    ('Block Heels', 'Блок токове', 'womens-block-heels', v_womens_shoes_id, 7),
    ('Kitten Heels', 'Ниски токове', 'womens-kitten-heels', v_womens_shoes_id, 8),
    ('Wedges', 'Платформи', 'womens-wedges', v_womens_shoes_id, 9),
    ('Flats', 'Равни обувки', 'womens-flats', v_womens_shoes_id, 10),
    ('Ballet Flats', 'Балеринки', 'womens-ballet-flats', v_womens_shoes_id, 11),
    ('Loafers', 'Мокасини', 'womens-loafers', v_womens_shoes_id, 12),
    ('Boots', 'Боти', 'womens-boots', v_womens_shoes_id, 13),
    ('Ankle Boots', 'Боти до глезена', 'womens-boots-ankle', v_womens_shoes_id, 14),
    ('Knee-High Boots', 'Боти до коляното', 'womens-boots-knee-high', v_womens_shoes_id, 15),
    ('Over-the-Knee Boots', 'Боти над коляното', 'womens-boots-over-knee', v_womens_shoes_id, 16),
    ('Chelsea Boots', 'Челси боти', 'womens-boots-chelsea', v_womens_shoes_id, 17),
    ('Sandals', 'Сандали', 'womens-sandals', v_womens_shoes_id, 18),
    ('Flat Sandals', 'Равни сандали', 'womens-sandals-flat', v_womens_shoes_id, 19),
    ('Heeled Sandals', 'Сандали с ток', 'womens-sandals-heeled', v_womens_shoes_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bags & Luggage deep categories
  IF v_bags_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Handbags', 'Дамски чанти', 'bags-handbags', v_bags_id, 1),
    ('Tote Bags', 'Тотбагове', 'bags-tote', v_bags_id, 2),
    ('Shoulder Bags', 'Чанти за рамо', 'bags-shoulder', v_bags_id, 3),
    ('Crossbody Bags', 'Кросбоди чанти', 'bags-crossbody', v_bags_id, 4),
    ('Clutches', 'Клъчове', 'bags-clutches', v_bags_id, 5),
    ('Satchels', 'Сачели', 'bags-satchels', v_bags_id, 6),
    ('Backpacks', 'Раници', 'bags-backpacks', v_bags_id, 7),
    ('Laptop Backpacks', 'Раници за лаптоп', 'bags-backpacks-laptop', v_bags_id, 8),
    ('Travel Backpacks', 'Раници за пътуване', 'bags-backpacks-travel', v_bags_id, 9),
    ('Briefcases', 'Куфарчета', 'bags-briefcases', v_bags_id, 10),
    ('Messenger Bags', 'Месенджър чанти', 'bags-messenger', v_bags_id, 11),
    ('Luggage', 'Багаж', 'bags-luggage', v_bags_id, 12),
    ('Carry-On Luggage', 'Ръчен багаж', 'bags-luggage-carry-on', v_bags_id, 13),
    ('Checked Luggage', 'Голям багаж', 'bags-luggage-checked', v_bags_id, 14),
    ('Luggage Sets', 'Комплекти куфари', 'bags-luggage-sets', v_bags_id, 15),
    ('Travel Bags', 'Пътни чанти', 'bags-travel', v_bags_id, 16),
    ('Duffel Bags', 'Спортни чанти', 'bags-duffel', v_bags_id, 17),
    ('Weekender Bags', 'Уикенд чанти', 'bags-weekender', v_bags_id, 18),
    ('Wallets', 'Портфейли', 'bags-wallets', v_bags_id, 19),
    ('Card Holders', 'Калъфи за карти', 'bags-card-holders', v_bags_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Watches deep categories
  IF v_watches_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Men''s Watches', 'Мъжки часовници', 'watches-mens', v_watches_id, 1),
    ('Dress Watches', 'Официални часовници', 'watches-mens-dress', v_watches_id, 2),
    ('Sport Watches', 'Спортни часовници', 'watches-mens-sport', v_watches_id, 3),
    ('Dive Watches', 'Водолазни часовници', 'watches-mens-dive', v_watches_id, 4),
    ('Chronograph Watches', 'Хронографи', 'watches-mens-chronograph', v_watches_id, 5),
    ('Women''s Watches', 'Дамски часовници', 'watches-womens', v_watches_id, 6),
    ('Fashion Watches', 'Модни часовници', 'watches-womens-fashion', v_watches_id, 7),
    ('Luxury Watches', 'Луксозни часовници', 'watches-luxury', v_watches_id, 8),
    ('Swiss Watches', 'Швейцарски часовници', 'watches-swiss', v_watches_id, 9),
    ('Automatic Watches', 'Автоматични часовници', 'watches-automatic', v_watches_id, 10),
    ('Quartz Watches', 'Кварцови часовници', 'watches-quartz', v_watches_id, 11),
    ('Digital Watches', 'Дигитални часовници', 'watches-digital', v_watches_id, 12),
    ('Smartwatches', 'Смарт часовници', 'watches-smartwatches', v_watches_id, 13),
    ('Watch Bands', 'Каишки за часовник', 'watches-bands', v_watches_id, 14),
    ('Leather Bands', 'Кожени каишки', 'watches-bands-leather', v_watches_id, 15),
    ('Metal Bands', 'Метални каишки', 'watches-bands-metal', v_watches_id, 16),
    ('Watch Accessories', 'Аксесоари за часовник', 'watches-accessories', v_watches_id, 17),
    ('Watch Boxes', 'Кутии за часовници', 'watches-boxes', v_watches_id, 18),
    ('Watch Winders', 'Навивачки за часовници', 'watches-winders', v_watches_id, 19),
    ('Watch Tools', 'Инструменти за часовници', 'watches-tools', v_watches_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Jewelry deep categories
  IF v_jewelry_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Necklaces', 'Колиета', 'jewelry-necklaces', v_jewelry_id, 1),
    ('Pendant Necklaces', 'Колиета с висулка', 'jewelry-necklaces-pendant', v_jewelry_id, 2),
    ('Chain Necklaces', 'Верижки', 'jewelry-necklaces-chain', v_jewelry_id, 3),
    ('Chokers', 'Чокери', 'jewelry-chokers', v_jewelry_id, 4),
    ('Earrings', 'Обици', 'jewelry-earrings', v_jewelry_id, 5),
    ('Stud Earrings', 'Обици бижута', 'jewelry-earrings-stud', v_jewelry_id, 6),
    ('Hoop Earrings', 'Халки', 'jewelry-earrings-hoop', v_jewelry_id, 7),
    ('Drop Earrings', 'Висящи обици', 'jewelry-earrings-drop', v_jewelry_id, 8),
    ('Bracelets', 'Гривни', 'jewelry-bracelets', v_jewelry_id, 9),
    ('Chain Bracelets', 'Верижни гривни', 'jewelry-bracelets-chain', v_jewelry_id, 10),
    ('Bangles', 'Твърди гривни', 'jewelry-bangles', v_jewelry_id, 11),
    ('Cuff Bracelets', 'Широки гривни', 'jewelry-bracelets-cuff', v_jewelry_id, 12),
    ('Rings', 'Пръстени', 'jewelry-rings', v_jewelry_id, 13),
    ('Engagement Rings', 'Годежни пръстени', 'jewelry-rings-engagement', v_jewelry_id, 14),
    ('Wedding Rings', 'Сватбени халки', 'jewelry-rings-wedding', v_jewelry_id, 15),
    ('Fashion Rings', 'Модни пръстени', 'jewelry-rings-fashion', v_jewelry_id, 16),
    ('Gold Jewelry', 'Златни бижута', 'jewelry-gold', v_jewelry_id, 17),
    ('Silver Jewelry', 'Сребърни бижута', 'jewelry-silver', v_jewelry_id, 18),
    ('Costume Jewelry', 'Бижутерия', 'jewelry-costume', v_jewelry_id, 19),
    ('Body Jewelry', 'Бижута за тяло', 'jewelry-body', v_jewelry_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
