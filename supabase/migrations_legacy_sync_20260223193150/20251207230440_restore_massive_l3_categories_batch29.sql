
-- Batch 29: Services, Grocery, Collectibles deep categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Services L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'home-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cleaning Services', 'Услуги по почистване', 'cleaning-services', v_parent_id, 1),
      ('Plumbing Services', 'ВиК услуги', 'plumbing-services', v_parent_id, 2),
      ('Electrical Services', 'Електро услуги', 'electrical-services', v_parent_id, 3),
      ('HVAC Services', 'Климатични услуги', 'hvac-services', v_parent_id, 4),
      ('Handyman Services', 'Майсторски услуги', 'handyman-services', v_parent_id, 5),
      ('Pest Control', 'Дезинсекция', 'pest-control', v_parent_id, 6),
      ('Landscaping', 'Озеленяване', 'landscaping', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'professional-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Legal Services', 'Правни услуги', 'legal-services', v_parent_id, 1),
      ('Accounting Services', 'Счетоводни услуги', 'accounting-services', v_parent_id, 2),
      ('Marketing Services', 'Маркетингови услуги', 'marketing-services', v_parent_id, 3),
      ('Web Design', 'Уеб дизайн', 'web-design', v_parent_id, 4),
      ('Photography Services', 'Фотографски услуги', 'photography-services', v_parent_id, 5),
      ('Translation Services', 'Преводачески услуги', 'translation-services', v_parent_id, 6),
      ('Consulting', 'Консултиране', 'consulting', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'personal-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tutoring', 'Частни уроци', 'tutoring', v_parent_id, 1),
      ('Personal Training', 'Персонален треньор', 'personal-training', v_parent_id, 2),
      ('Beauty Services', 'Козметични услуги', 'beauty-services', v_parent_id, 3),
      ('Pet Services', 'Услуги за домашни любимци', 'pet-services', v_parent_id, 4),
      ('Childcare', 'Гледане на деца', 'childcare', v_parent_id, 5),
      ('Senior Care', 'Грижа за възрастни', 'senior-care', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'event-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Catering', 'Кетъринг', 'catering', v_parent_id, 1),
      ('DJ Services', 'DJ услуги', 'dj-services', v_parent_id, 2),
      ('Event Planning', 'Организиране на събития', 'event-planning', v_parent_id, 3),
      ('Venue Rental', 'Наем на зали', 'venue-rental', v_parent_id, 4),
      ('Party Supplies', 'Консумативи за парти', 'party-supplies', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'automotive-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Auto Repair', 'Автосервиз', 'auto-repair', v_parent_id, 1),
      ('Car Wash Services', 'Услуги автомивка', 'car-wash-services', v_parent_id, 2),
      ('Towing', 'Пътна помощ', 'towing', v_parent_id, 3),
      ('Tire Services', 'Гумаджийски услуги', 'tire-services', v_parent_id, 4),
      ('Auto Detailing', 'Авто детайлинг', 'auto-detailing', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Grocery L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fresh-produce';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fruits', 'Плодове', 'fruits', v_parent_id, 1),
      ('Vegetables', 'Зеленчуци', 'vegetables', v_parent_id, 2),
      ('Herbs', 'Билки', 'herbs', v_parent_id, 3),
      ('Organic Produce', 'Биологични продукти', 'organic-produce', v_parent_id, 4),
      ('Salads', 'Салати', 'salads', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dairy-eggs';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Milk', 'Мляко', 'milk', v_parent_id, 1),
      ('Cheese', 'Сирене', 'cheese', v_parent_id, 2),
      ('Yogurt', 'Кисело мляко', 'yogurt', v_parent_id, 3),
      ('Butter & Cream', 'Масло и сметана', 'butter-cream', v_parent_id, 4),
      ('Eggs', 'Яйца', 'eggs', v_parent_id, 5),
      ('Plant-Based Dairy', 'Растителни млечни продукти', 'plant-based-dairy', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'meat-seafood';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Beef', 'Говеждо', 'beef', v_parent_id, 1),
      ('Pork', 'Свинско', 'pork', v_parent_id, 2),
      ('Chicken', 'Пилешко', 'chicken', v_parent_id, 3),
      ('Turkey', 'Пуешко', 'turkey', v_parent_id, 4),
      ('Fish', 'Риба', 'fish', v_parent_id, 5),
      ('Seafood', 'Морски дарове', 'seafood', v_parent_id, 6),
      ('Deli Meats', 'Месни деликатеси', 'deli-meats', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bakery';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bread', 'Хляб', 'bread', v_parent_id, 1),
      ('Pastries', 'Сладкиши', 'pastries', v_parent_id, 2),
      ('Cakes', 'Торти', 'cakes', v_parent_id, 3),
      ('Cookies', 'Бисквити', 'cookies', v_parent_id, 4),
      ('Muffins', 'Мъфини', 'muffins', v_parent_id, 5),
      ('Donuts', 'Понички', 'donuts', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'beverages';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Water', 'Вода', 'water', v_parent_id, 1),
      ('Soft Drinks', 'Безалкохолни напитки', 'soft-drinks', v_parent_id, 2),
      ('Juices', 'Сокове', 'juices', v_parent_id, 3),
      ('Coffee', 'Кафе', 'coffee', v_parent_id, 4),
      ('Tea', 'Чай', 'tea', v_parent_id, 5),
      ('Energy Drinks', 'Енергийни напитки', 'energy-drinks', v_parent_id, 6),
      ('Alcoholic Beverages', 'Алкохолни напитки', 'alcoholic-beverages', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pantry-staples';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pasta', 'Паста', 'pasta', v_parent_id, 1),
      ('Rice', 'Ориз', 'rice', v_parent_id, 2),
      ('Canned Goods', 'Консерви', 'canned-goods', v_parent_id, 3),
      ('Cooking Oils', 'Олио', 'cooking-oils', v_parent_id, 4),
      ('Sauces', 'Сосове', 'sauces', v_parent_id, 5),
      ('Spices', 'Подправки', 'spices', v_parent_id, 6),
      ('Flour & Sugar', 'Брашно и захар', 'flour-sugar', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'snacks';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Chips', 'Чипс', 'chips', v_parent_id, 1),
      ('Crackers', 'Крекери', 'crackers', v_parent_id, 2),
      ('Nuts', 'Ядки', 'nuts', v_parent_id, 3),
      ('Popcorn', 'Пуканки', 'popcorn', v_parent_id, 4),
      ('Candy', 'Бонбони', 'candy', v_parent_id, 5),
      ('Chocolate', 'Шоколад', 'chocolate', v_parent_id, 6),
      ('Dried Fruit', 'Сушени плодове', 'dried-fruit', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Collectibles L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'coins-currency';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Ancient Coins', 'Антични монети', 'ancient-coins', v_parent_id, 1),
      ('World Coins', 'Световни монети', 'world-coins', v_parent_id, 2),
      ('Bullion Coins', 'Инвестиционни монети', 'bullion-coins', v_parent_id, 3),
      ('Paper Money', 'Банкноти', 'paper-money', v_parent_id, 4),
      ('Coin Supplies', 'Консумативи за монети', 'coin-supplies', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'stamps';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('World Stamps', 'Световни пощенски марки', 'world-stamps', v_parent_id, 1),
      ('Bulgarian Stamps', 'Български пощенски марки', 'bulgarian-stamps', v_parent_id, 2),
      ('First Day Covers', 'Пликове първи ден', 'first-day-covers', v_parent_id, 3),
      ('Stamp Albums', 'Албуми за марки', 'stamp-albums', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sports-memorabilia';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Trading Cards', 'Търговски картички', 'trading-cards', v_parent_id, 1),
      ('Autographs', 'Автографи', 'autographs', v_parent_id, 2),
      ('Game-Used Items', 'Използвани в игри предмети', 'game-used-items', v_parent_id, 3),
      ('Sports Figures', 'Спортни фигурки', 'sports-figures', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'antiques';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Antique Furniture', 'Антикварни мебели', 'antique-furniture', v_parent_id, 1),
      ('Antique Jewelry', 'Антикварни бижута', 'antique-jewelry', v_parent_id, 2),
      ('Antique Pottery', 'Антикварна керамика', 'antique-pottery', v_parent_id, 3),
      ('Antique Art', 'Антикварно изкуство', 'antique-art', v_parent_id, 4),
      ('Antique Clocks', 'Антикварни часовници', 'antique-clocks', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vintage-items';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Vintage Clothing', 'Винтидж дрехи', 'vintage-clothing', v_parent_id, 1),
      ('Vintage Electronics', 'Винтидж електроника', 'vintage-electronics', v_parent_id, 2),
      ('Vintage Toys', 'Винтидж играчки', 'vintage-toys', v_parent_id, 3),
      ('Vintage Records', 'Винтидж плочи', 'vintage-records', v_parent_id, 4),
      ('Vintage Magazines', 'Винтидж списания', 'vintage-magazines', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
