
-- Batch 12: Real Estate, Services, Bulgarian Traditional, Collectibles deep categories
DO $$
DECLARE
  v_realestate_id UUID;
  v_residential_id UUID;
  v_commercial_id UUID;
  v_land_id UUID;
  v_services_id UUID;
  v_professional_id UUID;
  v_home_services_id UUID;
  v_bulgarian_id UUID;
  v_traditional_id UUID;
  v_crafts_id UUID;
  v_collectibles_id UUID;
  v_coins_id UUID;
  v_stamps_id UUID;
  v_antiques_id UUID;
  v_art_id UUID;
  v_memorabilia_id UUID;
BEGIN
  SELECT id INTO v_realestate_id FROM categories WHERE slug = 'real-estate';
  SELECT id INTO v_residential_id FROM categories WHERE slug = 'residential';
  SELECT id INTO v_commercial_id FROM categories WHERE slug = 'commercial';
  SELECT id INTO v_land_id FROM categories WHERE slug = 'land';
  SELECT id INTO v_services_id FROM categories WHERE slug = 'services';
  SELECT id INTO v_professional_id FROM categories WHERE slug = 'professional-services';
  SELECT id INTO v_home_services_id FROM categories WHERE slug = 'home-services';
  SELECT id INTO v_bulgarian_id FROM categories WHERE slug = 'bulgarian-traditional';
  SELECT id INTO v_traditional_id FROM categories WHERE slug = 'traditional-foods';
  SELECT id INTO v_crafts_id FROM categories WHERE slug = 'traditional-crafts';
  SELECT id INTO v_collectibles_id FROM categories WHERE slug = 'collectibles';
  SELECT id INTO v_coins_id FROM categories WHERE slug = 'coins-currency';
  SELECT id INTO v_stamps_id FROM categories WHERE slug = 'stamps';
  SELECT id INTO v_antiques_id FROM categories WHERE slug = 'antiques';
  SELECT id INTO v_art_id FROM categories WHERE slug = 'fine-art';
  SELECT id INTO v_memorabilia_id FROM categories WHERE slug = 'memorabilia';
  
  -- Residential Real Estate deep categories
  IF v_residential_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Apartments', 'Апартаменти', 'residential-apartments', v_residential_id, 1),
    ('Studio Apartments', 'Гарсониери', 'residential-studios', v_residential_id, 2),
    ('One-Bedroom', 'Едностайни', 'residential-one-bedroom', v_residential_id, 3),
    ('Two-Bedroom', 'Двустайни', 'residential-two-bedroom', v_residential_id, 4),
    ('Three-Bedroom', 'Тристайни', 'residential-three-bedroom', v_residential_id, 5),
    ('Penthouses', 'Пентхауси', 'residential-penthouses', v_residential_id, 6),
    ('Houses', 'Къщи', 'residential-houses', v_residential_id, 7),
    ('Single Family', 'Еднофамилни къщи', 'residential-single-family', v_residential_id, 8),
    ('Townhouses', 'Редови къщи', 'residential-townhouses', v_residential_id, 9),
    ('Villas', 'Вили', 'residential-villas', v_residential_id, 10),
    ('Vacation Homes', 'Ваканционни имоти', 'residential-vacation', v_residential_id, 11),
    ('Mountain Homes', 'Планински имоти', 'residential-mountain', v_residential_id, 12),
    ('Sea Properties', 'Морски имоти', 'residential-sea', v_residential_id, 13),
    ('Rural Properties', 'Селски имоти', 'residential-rural', v_residential_id, 14),
    ('New Construction', 'Ново строителство', 'residential-new', v_residential_id, 15),
    ('Luxury Homes', 'Луксозни имоти', 'residential-luxury', v_residential_id, 16),
    ('Foreclosures', 'Възбранени имоти', 'residential-foreclosures', v_residential_id, 17),
    ('Short Sales', 'Бързи продажби', 'residential-short-sales', v_residential_id, 18),
    ('Investment Properties', 'Инвестиционни имоти', 'residential-investment', v_residential_id, 19),
    ('For Rent', 'Под наем', 'residential-rent', v_residential_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Commercial Real Estate deep categories
  IF v_commercial_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Office Space', 'Офис площи', 'commercial-office', v_commercial_id, 1),
    ('Private Offices', 'Частни офиси', 'commercial-office-private', v_commercial_id, 2),
    ('Shared Offices', 'Споделени офиси', 'commercial-office-shared', v_commercial_id, 3),
    ('Co-Working Spaces', 'Ко-уъркинг', 'commercial-coworking', v_commercial_id, 4),
    ('Retail Space', 'Търговски площи', 'commercial-retail', v_commercial_id, 5),
    ('Shops', 'Магазини', 'commercial-shops', v_commercial_id, 6),
    ('Shopping Centers', 'Търговски центрове', 'commercial-malls', v_commercial_id, 7),
    ('Restaurants', 'Ресторанти', 'commercial-restaurants', v_commercial_id, 8),
    ('Industrial', 'Индустриални имоти', 'commercial-industrial', v_commercial_id, 9),
    ('Warehouses', 'Складове', 'commercial-warehouses', v_commercial_id, 10),
    ('Manufacturing', 'Производствени площи', 'commercial-manufacturing', v_commercial_id, 11),
    ('Distribution Centers', 'Дистрибуционни центрове', 'commercial-distribution', v_commercial_id, 12),
    ('Hotels', 'Хотели', 'commercial-hotels', v_commercial_id, 13),
    ('Medical Space', 'Медицински площи', 'commercial-medical', v_commercial_id, 14),
    ('Mixed Use', 'Смесено използване', 'commercial-mixed', v_commercial_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Professional Services deep categories
  IF v_professional_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Legal Services', 'Правни услуги', 'services-legal', v_professional_id, 1),
    ('Lawyers', 'Адвокати', 'services-lawyers', v_professional_id, 2),
    ('Notary Services', 'Нотариални услуги', 'services-notary', v_professional_id, 3),
    ('Accounting', 'Счетоводни услуги', 'services-accounting', v_professional_id, 4),
    ('Tax Services', 'Данъчни услуги', 'services-tax', v_professional_id, 5),
    ('Bookkeeping', 'Счетоводство', 'services-bookkeeping', v_professional_id, 6),
    ('Consulting', 'Консултации', 'services-consulting', v_professional_id, 7),
    ('Business Consulting', 'Бизнес консултации', 'services-business-consulting', v_professional_id, 8),
    ('IT Consulting', 'IT консултации', 'services-it-consulting', v_professional_id, 9),
    ('Marketing', 'Маркетинг', 'services-marketing', v_professional_id, 10),
    ('Digital Marketing', 'Дигитален маркетинг', 'services-digital-marketing', v_professional_id, 11),
    ('SEO Services', 'SEO услуги', 'services-seo', v_professional_id, 12),
    ('Translation', 'Преводи', 'services-translation', v_professional_id, 13),
    ('Web Development', 'Уеб разработка', 'services-web-dev', v_professional_id, 14),
    ('Graphic Design', 'Графичен дизайн', 'services-graphic-design', v_professional_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Home Services deep categories
  IF v_home_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Plumbing', 'Водопровод', 'services-plumbing', v_home_services_id, 1),
    ('Emergency Plumbing', 'Спешен водопровод', 'services-plumbing-emergency', v_home_services_id, 2),
    ('Electrical', 'Електрически услуги', 'services-electrical', v_home_services_id, 3),
    ('Electricians', 'Електротехници', 'services-electricians', v_home_services_id, 4),
    ('HVAC', 'Климатизация', 'services-hvac', v_home_services_id, 5),
    ('AC Installation', 'Монтаж на климатици', 'services-ac-installation', v_home_services_id, 6),
    ('AC Repair', 'Ремонт на климатици', 'services-ac-repair', v_home_services_id, 7),
    ('Cleaning', 'Почистване', 'services-cleaning', v_home_services_id, 8),
    ('House Cleaning', 'Почистване на дома', 'services-house-cleaning', v_home_services_id, 9),
    ('Carpet Cleaning', 'Пране на килими', 'services-carpet-cleaning', v_home_services_id, 10),
    ('Window Cleaning', 'Миене на прозорци', 'services-window-cleaning', v_home_services_id, 11),
    ('Moving Services', 'Преместване', 'services-moving', v_home_services_id, 12),
    ('Local Moving', 'Местно преместване', 'services-moving-local', v_home_services_id, 13),
    ('Landscaping', 'Озеленяване', 'services-landscaping', v_home_services_id, 14),
    ('Lawn Care', 'Поддръжка на тревни площи', 'services-lawn-care', v_home_services_id, 15),
    ('Painting', 'Боядисване', 'services-painting', v_home_services_id, 16),
    ('Interior Painting', 'Вътрешно боядисване', 'services-painting-interior', v_home_services_id, 17),
    ('Renovation', 'Ремонти', 'services-renovation', v_home_services_id, 18),
    ('Kitchen Renovation', 'Ремонт на кухня', 'services-renovation-kitchen', v_home_services_id, 19),
    ('Bathroom Renovation', 'Ремонт на баня', 'services-renovation-bathroom', v_home_services_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Traditional Foods deep categories
  IF v_traditional_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Rose Products', 'Продукти от рози', 'traditional-rose', v_traditional_id, 1),
    ('Rose Jam', 'Сладко от рози', 'traditional-rose-jam', v_traditional_id, 2),
    ('Rose Water', 'Розова вода', 'traditional-rose-water', v_traditional_id, 3),
    ('Rose Oil', 'Розово масло', 'traditional-rose-oil', v_traditional_id, 4),
    ('Honey Products', 'Пчелни продукти', 'traditional-honey', v_traditional_id, 5),
    ('Bulgarian Honey', 'Български мед', 'traditional-honey-bulgarian', v_traditional_id, 6),
    ('Propolis', 'Прополис', 'traditional-propolis', v_traditional_id, 7),
    ('Bee Pollen', 'Пчелен прашец', 'traditional-bee-pollen', v_traditional_id, 8),
    ('Dairy Products', 'Млечни продукти', 'traditional-dairy', v_traditional_id, 9),
    ('Bulgarian Yogurt', 'Българско кисело мляко', 'traditional-yogurt', v_traditional_id, 10),
    ('White Cheese', 'Бяло сирене', 'traditional-white-cheese', v_traditional_id, 11),
    ('Kashkaval', 'Кашкавал', 'traditional-kashkaval', v_traditional_id, 12),
    ('Preserved Foods', 'Консервирани храни', 'traditional-preserved', v_traditional_id, 13),
    ('Lutenitsa', 'Лютеница', 'traditional-lutenitsa', v_traditional_id, 14),
    ('Kyopolou', 'Кьопоолу', 'traditional-kyopolou', v_traditional_id, 15),
    ('Pickles', 'Туршия', 'traditional-pickles', v_traditional_id, 16),
    ('Dried Fruits', 'Сушени плодове', 'traditional-dried-fruits', v_traditional_id, 17),
    ('Herbs & Teas', 'Билки и чайове', 'traditional-herbs-teas', v_traditional_id, 18),
    ('Mountain Tea', 'Планински чай', 'traditional-mountain-tea', v_traditional_id, 19),
    ('Traditional Sweets', 'Традиционни сладкиши', 'traditional-sweets', v_traditional_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Traditional Crafts deep categories
  IF v_crafts_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Embroidery', 'Бродерии', 'crafts-embroidery', v_crafts_id, 1),
    ('Traditional Embroidery', 'Традиционни бродерии', 'crafts-embroidery-traditional', v_crafts_id, 2),
    ('Tablecloths', 'Покривки', 'crafts-tablecloths', v_crafts_id, 3),
    ('Pottery', 'Керамика', 'crafts-pottery', v_crafts_id, 4),
    ('Troyan Pottery', 'Троянска керамика', 'crafts-troyan-pottery', v_crafts_id, 5),
    ('Handmade Ceramics', 'Ръчна керамика', 'crafts-handmade-ceramics', v_crafts_id, 6),
    ('Woodwork', 'Дърворезба', 'crafts-woodwork', v_crafts_id, 7),
    ('Carved Items', 'Резбовани изделия', 'crafts-carved', v_crafts_id, 8),
    ('Wooden Utensils', 'Дървени прибори', 'crafts-wooden-utensils', v_crafts_id, 9),
    ('Textiles', 'Текстил', 'crafts-textiles', v_crafts_id, 10),
    ('Rugs', 'Килими', 'crafts-rugs', v_crafts_id, 11),
    ('Woven Blankets', 'Тъкани одеяла', 'crafts-woven-blankets', v_crafts_id, 12),
    ('Costumes', 'Носии', 'crafts-costumes', v_crafts_id, 13),
    ('Traditional Dresses', 'Традиционни рокли', 'crafts-traditional-dresses', v_crafts_id, 14),
    ('Regional Costumes', 'Регионални носии', 'crafts-regional-costumes', v_crafts_id, 15),
    ('Musical Instruments', 'Музикални инструменти', 'crafts-instruments', v_crafts_id, 16),
    ('Gaida', 'Гайда', 'crafts-gaida', v_crafts_id, 17),
    ('Kaval', 'Кавал', 'crafts-kaval', v_crafts_id, 18),
    ('Gadulka', 'Гъдулка', 'crafts-gadulka', v_crafts_id, 19),
    ('Jewelry', 'Бижута', 'crafts-jewelry', v_crafts_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Coins & Currency deep categories
  IF v_coins_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Ancient Coins', 'Антични монети', 'coins-ancient', v_coins_id, 1),
    ('Greek Coins', 'Гръцки монети', 'coins-ancient-greek', v_coins_id, 2),
    ('Roman Coins', 'Римски монети', 'coins-ancient-roman', v_coins_id, 3),
    ('Medieval Coins', 'Средновековни монети', 'coins-medieval', v_coins_id, 4),
    ('Modern Coins', 'Модерни монети', 'coins-modern', v_coins_id, 5),
    ('European Coins', 'Европейски монети', 'coins-european', v_coins_id, 6),
    ('American Coins', 'Американски монети', 'coins-american', v_coins_id, 7),
    ('Bulgarian Coins', 'Български монети', 'coins-bulgarian', v_coins_id, 8),
    ('Gold Coins', 'Златни монети', 'coins-gold', v_coins_id, 9),
    ('Silver Coins', 'Сребърни монети', 'coins-silver', v_coins_id, 10),
    ('Commemorative Coins', 'Възпоменателни монети', 'coins-commemorative', v_coins_id, 11),
    ('Paper Money', 'Хартиени пари', 'coins-paper-money', v_coins_id, 12),
    ('Banknotes', 'Банкноти', 'coins-banknotes', v_coins_id, 13),
    ('Coin Supplies', 'Консумативи за монети', 'coins-supplies', v_coins_id, 14),
    ('Coin Albums', 'Албуми за монети', 'coins-albums', v_coins_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Antiques deep categories
  IF v_antiques_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Antique Furniture', 'Антикварни мебели', 'antiques-furniture', v_antiques_id, 1),
    ('Antique Chairs', 'Антикварни столове', 'antiques-chairs', v_antiques_id, 2),
    ('Antique Tables', 'Антикварни маси', 'antiques-tables', v_antiques_id, 3),
    ('Antique Cabinets', 'Антикварни шкафове', 'antiques-cabinets', v_antiques_id, 4),
    ('Antique Clocks', 'Антикварни часовници', 'antiques-clocks', v_antiques_id, 5),
    ('Wall Clocks', 'Стенни часовници', 'antiques-clocks-wall', v_antiques_id, 6),
    ('Grandfather Clocks', 'Напольни часовници', 'antiques-clocks-grandfather', v_antiques_id, 7),
    ('Antique Jewelry', 'Антикварни бижута', 'antiques-jewelry', v_antiques_id, 8),
    ('Victorian Jewelry', 'Викторианска бижутерия', 'antiques-jewelry-victorian', v_antiques_id, 9),
    ('Art Deco Jewelry', 'Арт Деко бижута', 'antiques-jewelry-artdeco', v_antiques_id, 10),
    ('Antique Porcelain', 'Антикварен порцелан', 'antiques-porcelain', v_antiques_id, 11),
    ('China', 'Порцелан', 'antiques-china', v_antiques_id, 12),
    ('Figurines', 'Фигурки', 'antiques-figurines', v_antiques_id, 13),
    ('Antique Glass', 'Антикварно стъкло', 'antiques-glass', v_antiques_id, 14),
    ('Antique Books', 'Антикварни книги', 'antiques-books', v_antiques_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
