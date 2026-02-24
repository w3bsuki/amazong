
-- Batch 54: More categories - Antiques, Vintage, Handmade, Gift cards
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Antiques deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'antiques';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Antique Furniture', 'Антична мебел', 'antique-furniture', v_parent_id, 1),
      ('Antique Jewelry', 'Антични бижута', 'antique-jewelry', v_parent_id, 2),
      ('Antique Art', 'Антично изкуство', 'antique-art', v_parent_id, 3),
      ('Antique Clocks', 'Антични часовници', 'antique-clocks', v_parent_id, 4),
      ('Antique Silverware', 'Антични сребърни изделия', 'antique-silverware', v_parent_id, 5),
      ('Antique Pottery', 'Антична керамика', 'antique-pottery', v_parent_id, 6),
      ('Antique Books', 'Антични книги', 'antique-books', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Vintage deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vintage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Vintage Clothing', 'Винтидж облекло', 'vintage-clothing', v_parent_id, 1),
      ('Vintage Electronics', 'Винтидж електроника', 'vintage-electronics', v_parent_id, 2),
      ('Vintage Toys', 'Винтидж играчки', 'vintage-toys', v_parent_id, 3),
      ('Vintage Decor', 'Винтидж декор', 'vintage-decor', v_parent_id, 4),
      ('Vintage Records', 'Винтидж плочи', 'vintage-records', v_parent_id, 5),
      ('Vintage Cameras', 'Винтидж фотоапарати', 'vintage-cameras', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Handmade deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'handmade';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Handmade Jewelry', 'Ръчно изработени бижута', 'handmade-jewelry', v_parent_id, 1),
      ('Handmade Clothing', 'Ръчно изработени дрехи', 'handmade-clothing', v_parent_id, 2),
      ('Handmade Home Decor', 'Ръчно изработен декор', 'handmade-home-decor', v_parent_id, 3),
      ('Handmade Art', 'Ръчно изработено изкуство', 'handmade-art', v_parent_id, 4),
      ('Handmade Bags', 'Ръчно изработени чанти', 'handmade-bags', v_parent_id, 5),
      ('Handmade Candles', 'Ръчно изработени свещи', 'handmade-candles', v_parent_id, 6),
      ('Handmade Soaps', 'Ръчно изработени сапуни', 'handmade-soaps', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gift Cards deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gift-cards';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Retail Gift Cards', 'Подаръчни карти за магазини', 'retail-gift-cards', v_parent_id, 1),
      ('Restaurant Gift Cards', 'Подаръчни карти за ресторанти', 'restaurant-gift-cards', v_parent_id, 2),
      ('Entertainment Gift Cards', 'Подаръчни карти за развлечения', 'entertainment-gift-cards', v_parent_id, 3),
      ('Gaming Gift Cards', 'Гейминг подаръчни карти', 'gaming-gift-cards', v_parent_id, 4),
      ('Prepaid Cards', 'Предплатени карти', 'prepaid-cards', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tickets & Events deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tickets-events';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Concert Tickets', 'Билети за концерти', 'concert-tickets', v_parent_id, 1),
      ('Sports Tickets', 'Билети за спорт', 'sports-tickets', v_parent_id, 2),
      ('Theater Tickets', 'Театрални билети', 'theater-tickets', v_parent_id, 3),
      ('Festival Passes', 'Пропуски за фестивали', 'festival-passes', v_parent_id, 4),
      ('Travel Vouchers', 'Пътнически ваучери', 'travel-vouchers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Coupons & Deals deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'deals-discounts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Daily Deals', 'Дневни оферти', 'daily-deals', v_parent_id, 1),
      ('Clearance', 'Разпродажба', 'clearance', v_parent_id, 2),
      ('Bundle Deals', 'Пакетни оферти', 'bundle-deals', v_parent_id, 3),
      ('Seasonal Sales', 'Сезонни разпродажби', 'seasonal-sales', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Subscription Boxes deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'subscription-boxes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Beauty Boxes', 'Козметични кутии', 'beauty-boxes', v_parent_id, 1),
      ('Food Boxes', 'Кутии с храна', 'food-boxes', v_parent_id, 2),
      ('Book Boxes', 'Книжни кутии', 'book-boxes', v_parent_id, 3),
      ('Gaming Boxes', 'Гейминг кутии', 'gaming-boxes', v_parent_id, 4),
      ('Kids Boxes', 'Детски кутии', 'kids-boxes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Digital Products deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'digital-products';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('E-books', 'Е-книги', 'ebooks', v_parent_id, 1),
      ('Digital Music', 'Цифрова музика', 'digital-music', v_parent_id, 2),
      ('Software', 'Софтуер', 'software', v_parent_id, 3),
      ('Online Courses', 'Онлайн курсове', 'online-courses-digital', v_parent_id, 4),
      ('Digital Art', 'Цифрово изкуство', 'digital-art', v_parent_id, 5),
      ('Templates', 'Шаблони', 'templates', v_parent_id, 6),
      ('Stock Photos', 'Стокови снимки', 'stock-photos', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Software deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'software';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Operating Systems', 'Операционни системи', 'operating-systems', v_parent_id, 1),
      ('Office Software', 'Офис софтуер', 'office-software', v_parent_id, 2),
      ('Security Software', 'Софтуер за сигурност', 'security-software', v_parent_id, 3),
      ('Creative Software', 'Креативен софтуер', 'creative-software', v_parent_id, 4),
      ('Utility Software', 'Помощен софтуер', 'utility-software', v_parent_id, 5),
      ('Business Software', 'Бизнес софтуер', 'business-software', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
