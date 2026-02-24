
-- Batch 17: More deep categories - Movies, Software, Wholesale, and misc
DO $$
DECLARE
  v_movies_id UUID;
  v_dvd_id UUID;
  v_bluray_id UUID;
  v_streaming_id UUID;
  v_software_id UUID;
  v_business_sw_id UUID;
  v_security_sw_id UUID;
  v_design_sw_id UUID;
  v_wholesale_id UUID;
  v_wholesale_electronics_id UUID;
  v_wholesale_clothing_id UUID;
  v_wholesale_food_id UUID;
  v_motor_id UUID;
  v_moto_parts_id UUID;
  v_boats_id UUID;
BEGIN
  SELECT id INTO v_movies_id FROM categories WHERE slug = 'movies-tv';
  SELECT id INTO v_dvd_id FROM categories WHERE slug = 'dvd';
  SELECT id INTO v_bluray_id FROM categories WHERE slug = 'blu-ray';
  SELECT id INTO v_streaming_id FROM categories WHERE slug = 'streaming';
  SELECT id INTO v_software_id FROM categories WHERE slug = 'software';
  SELECT id INTO v_business_sw_id FROM categories WHERE slug = 'business-software';
  SELECT id INTO v_security_sw_id FROM categories WHERE slug = 'security-software';
  SELECT id INTO v_design_sw_id FROM categories WHERE slug = 'design-software';
  SELECT id INTO v_wholesale_id FROM categories WHERE slug = 'wholesale';
  SELECT id INTO v_wholesale_electronics_id FROM categories WHERE slug = 'wholesale-electronics';
  SELECT id INTO v_wholesale_clothing_id FROM categories WHERE slug = 'wholesale-clothing';
  SELECT id INTO v_wholesale_food_id FROM categories WHERE slug = 'wholesale-food';
  SELECT id INTO v_motor_id FROM categories WHERE slug = 'motorcycles';
  SELECT id INTO v_moto_parts_id FROM categories WHERE slug = 'motorcycle-parts';
  SELECT id INTO v_boats_id FROM categories WHERE slug = 'boats-watercraft';
  
  -- Movies & TV deep categories
  IF v_movies_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Action Movies', 'Екшън филми', 'movies-action', v_movies_id, 1),
    ('Comedy Movies', 'Комедии', 'movies-comedy', v_movies_id, 2),
    ('Drama Movies', 'Драма', 'movies-drama', v_movies_id, 3),
    ('Horror Movies', 'Хорър филми', 'movies-horror', v_movies_id, 4),
    ('Sci-Fi Movies', 'Научна фантастика', 'movies-scifi', v_movies_id, 5),
    ('Thriller Movies', 'Трилъри', 'movies-thriller', v_movies_id, 6),
    ('Romance Movies', 'Романтични филми', 'movies-romance', v_movies_id, 7),
    ('Animation', 'Анимация', 'movies-animation', v_movies_id, 8),
    ('Documentary', 'Документални', 'movies-documentary', v_movies_id, 9),
    ('Family Movies', 'Семейни филми', 'movies-family', v_movies_id, 10),
    ('Foreign Films', 'Чуждестранни филми', 'movies-foreign', v_movies_id, 11),
    ('Classic Movies', 'Класически филми', 'movies-classic', v_movies_id, 12),
    ('TV Series', 'ТВ сериали', 'movies-tv-series', v_movies_id, 13),
    ('TV Dramas', 'Драматични сериали', 'movies-tv-dramas', v_movies_id, 14),
    ('TV Comedies', 'Комедийни сериали', 'movies-tv-comedies', v_movies_id, 15),
    ('Reality TV', 'Риалити ТВ', 'movies-reality-tv', v_movies_id, 16),
    ('Anime', 'Аниме', 'movies-anime', v_movies_id, 17),
    ('Korean Drama', 'Корейски драми', 'movies-korean', v_movies_id, 18),
    ('Movie Box Sets', 'Колекции филми', 'movies-box-sets', v_movies_id, 19),
    ('TV Box Sets', 'Колекции сериали', 'movies-tv-box-sets', v_movies_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Software deep categories
  IF v_software_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Operating Systems', 'Операционни системи', 'software-os', v_software_id, 1),
    ('Windows', 'Windows', 'software-windows', v_software_id, 2),
    ('macOS', 'macOS', 'software-macos', v_software_id, 3),
    ('Linux', 'Linux', 'software-linux', v_software_id, 4),
    ('Office Software', 'Офис софтуер', 'software-office', v_software_id, 5),
    ('Microsoft Office', 'Microsoft Office', 'software-ms-office', v_software_id, 6),
    ('Word Processing', 'Текстообработка', 'software-word', v_software_id, 7),
    ('Spreadsheets', 'Таблици', 'software-spreadsheets', v_software_id, 8),
    ('Presentation', 'Презентации', 'software-presentation', v_software_id, 9),
    ('Accounting Software', 'Счетоводен софтуер', 'software-accounting', v_software_id, 10),
    ('Project Management', 'Управление на проекти', 'software-project-mgmt', v_software_id, 11),
    ('Antivirus', 'Антивирусен софтуер', 'software-antivirus', v_software_id, 12),
    ('Internet Security', 'Интернет сигурност', 'software-internet-security', v_software_id, 13),
    ('VPN Software', 'VPN софтуер', 'software-vpn', v_software_id, 14),
    ('Backup Software', 'Софтуер за архивиране', 'software-backup', v_software_id, 15),
    ('Photo Editing', 'Обработка на снимки', 'software-photo-editing', v_software_id, 16),
    ('Video Editing', 'Видео обработка', 'software-video-editing', v_software_id, 17),
    ('Audio Software', 'Аудио софтуер', 'software-audio', v_software_id, 18),
    ('CAD Software', 'CAD софтуер', 'software-cad', v_software_id, 19),
    ('Development Tools', 'Инструменти за разработка', 'software-dev-tools', v_software_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Wholesale deep categories
  IF v_wholesale_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bulk Electronics', 'Електроника на едро', 'wholesale-bulk-electronics', v_wholesale_id, 1),
    ('Bulk Phone Cases', 'Калъфи на едро', 'wholesale-phone-cases', v_wholesale_id, 2),
    ('Bulk Cables', 'Кабели на едро', 'wholesale-cables', v_wholesale_id, 3),
    ('Bulk Chargers', 'Зарядни на едро', 'wholesale-chargers', v_wholesale_id, 4),
    ('Bulk Clothing', 'Облекло на едро', 'wholesale-bulk-clothing', v_wholesale_id, 5),
    ('Bulk T-Shirts', 'Тениски на едро', 'wholesale-tshirts', v_wholesale_id, 6),
    ('Bulk Jeans', 'Дънки на едро', 'wholesale-jeans', v_wholesale_id, 7),
    ('Bulk Shoes', 'Обувки на едро', 'wholesale-shoes', v_wholesale_id, 8),
    ('Bulk Toys', 'Играчки на едро', 'wholesale-toys', v_wholesale_id, 9),
    ('Bulk Beauty', 'Козметика на едро', 'wholesale-beauty', v_wholesale_id, 10),
    ('Bulk Food', 'Храна на едро', 'wholesale-bulk-food', v_wholesale_id, 11),
    ('Bulk Snacks', 'Снаксове на едро', 'wholesale-snacks', v_wholesale_id, 12),
    ('Bulk Beverages', 'Напитки на едро', 'wholesale-beverages', v_wholesale_id, 13),
    ('Restaurant Supplies', 'Консумативи за ресторанти', 'wholesale-restaurant', v_wholesale_id, 14),
    ('Retail Supplies', 'Търговски консумативи', 'wholesale-retail', v_wholesale_id, 15),
    ('Packaging Materials', 'Опаковъчни материали', 'wholesale-packaging', v_wholesale_id, 16),
    ('Office Bulk', 'Офис консумативи на едро', 'wholesale-office', v_wholesale_id, 17),
    ('Industrial Bulk', 'Индустриални стоки на едро', 'wholesale-industrial', v_wholesale_id, 18),
    ('Dropshipping Products', 'Продукти за дропшипинг', 'wholesale-dropshipping', v_wholesale_id, 19),
    ('Liquidation Lots', 'Ликвидационни партиди', 'wholesale-liquidation', v_wholesale_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Motorcycle Parts deep categories
  IF v_moto_parts_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Motorcycle Helmets', 'Мото каски', 'moto-helmets', v_moto_parts_id, 1),
    ('Full Face Helmets', 'Каски тип затворен', 'moto-helmets-full', v_moto_parts_id, 2),
    ('Open Face Helmets', 'Каски тип отворен', 'moto-helmets-open', v_moto_parts_id, 3),
    ('Modular Helmets', 'Модулни каски', 'moto-helmets-modular', v_moto_parts_id, 4),
    ('Motorcycle Jackets', 'Мото якета', 'moto-jackets', v_moto_parts_id, 5),
    ('Leather Jackets', 'Кожени мото якета', 'moto-jackets-leather', v_moto_parts_id, 6),
    ('Textile Jackets', 'Текстилни мото якета', 'moto-jackets-textile', v_moto_parts_id, 7),
    ('Motorcycle Pants', 'Мото панталони', 'moto-pants', v_moto_parts_id, 8),
    ('Motorcycle Gloves', 'Мото ръкавици', 'moto-gloves', v_moto_parts_id, 9),
    ('Motorcycle Boots', 'Мото боти', 'moto-boots', v_moto_parts_id, 10),
    ('Motorcycle Tires', 'Мото гуми', 'moto-tires', v_moto_parts_id, 11),
    ('Motorcycle Exhaust', 'Ауспуси', 'moto-exhaust', v_moto_parts_id, 12),
    ('Motorcycle Brakes', 'Мото спирачки', 'moto-brakes', v_moto_parts_id, 13),
    ('Motorcycle Chains', 'Вериги', 'moto-chains', v_moto_parts_id, 14),
    ('Motorcycle Batteries', 'Мото акумулатори', 'moto-batteries', v_moto_parts_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Boats & Watercraft deep categories
  IF v_boats_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Powerboats', 'Моторни лодки', 'boats-powerboats', v_boats_id, 1),
    ('Speed Boats', 'Бързи лодки', 'boats-speedboats', v_boats_id, 2),
    ('Fishing Boats', 'Рибарски лодки', 'boats-fishing', v_boats_id, 3),
    ('Sailboats', 'Ветроходи', 'boats-sailboats', v_boats_id, 4),
    ('Yachts', 'Яхти', 'boats-yachts', v_boats_id, 5),
    ('Jet Skis', 'Джетове', 'boats-jetskis', v_boats_id, 6),
    ('Inflatable Boats', 'Надуваеми лодки', 'boats-inflatable', v_boats_id, 7),
    ('Canoes', 'Канота', 'boats-canoes', v_boats_id, 8),
    ('Boat Parts', 'Части за лодки', 'boats-parts', v_boats_id, 9),
    ('Boat Motors', 'Лодъчни мотори', 'boats-motors', v_boats_id, 10),
    ('Boat Trailers', 'Ремаркета за лодки', 'boats-trailers', v_boats_id, 11),
    ('Marine Electronics', 'Морска електроника', 'boats-electronics', v_boats_id, 12),
    ('Boat Covers', 'Покривала за лодки', 'boats-covers', v_boats_id, 13),
    ('Anchors', 'Котви', 'boats-anchors', v_boats_id, 14),
    ('Marine Safety', 'Морска безопасност', 'boats-safety', v_boats_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
