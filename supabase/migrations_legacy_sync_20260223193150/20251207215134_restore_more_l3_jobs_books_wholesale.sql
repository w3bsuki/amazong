-- Restore more L3 categories for Jobs, Books & Media, Wholesale

-- Jobs L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Tech Jobs subcategories
  ('Software Developer Jobs', 'software-dev-jobs', 'Софтуерни разработчици', 'tech-jobs', 1),
  ('Web Developer Jobs', 'web-dev-jobs', 'Уеб разработчици', 'tech-jobs', 2),
  ('Mobile Developer Jobs', 'mobile-dev-jobs', 'Мобилни разработчици', 'tech-jobs', 3),
  ('DevOps Jobs', 'devops-jobs', 'DevOps позиции', 'tech-jobs', 4),
  ('Data Science Jobs', 'data-science-jobs', 'Data Science', 'tech-jobs', 5),
  ('QA Engineer Jobs', 'qa-engineer-jobs', 'QA инженери', 'tech-jobs', 6),
  ('IT Support Jobs', 'it-support-jobs', 'IT поддръжка', 'tech-jobs', 7),
  ('UI/UX Designer Jobs', 'ui-ux-jobs', 'UI/UX дизайнери', 'tech-jobs', 8),
  
  -- Healthcare Jobs subcategories
  ('Nursing Jobs', 'nursing-jobs', 'Медицински сестри', 'healthcare-jobs', 1),
  ('Doctor Jobs', 'doctor-jobs', 'Лекари', 'healthcare-jobs', 2),
  ('Pharmacy Jobs', 'pharmacy-jobs', 'Фармацевти', 'healthcare-jobs', 3),
  ('Dental Jobs', 'dental-jobs', 'Зъболекари', 'healthcare-jobs', 4),
  ('Caregiver Jobs', 'caregiver-jobs', 'Болногледачи', 'healthcare-jobs', 5),
  ('Medical Lab Jobs', 'medical-lab-jobs', 'Медицински лаборанти', 'healthcare-jobs', 6),
  
  -- Business Jobs subcategories
  ('Sales Jobs', 'sales-jobs', 'Продажби', 'business-jobs', 1),
  ('Marketing Jobs', 'marketing-jobs', 'Маркетинг', 'business-jobs', 2),
  ('Finance Jobs', 'finance-jobs', 'Финанси', 'business-jobs', 3),
  ('HR Jobs', 'hr-jobs', 'Човешки ресурси', 'business-jobs', 4),
  ('Accounting Jobs', 'accounting-jobs', 'Счетоводство', 'business-jobs', 5),
  ('Management Jobs', 'management-jobs', 'Мениджмънт', 'business-jobs', 6),
  ('Administrative Jobs', 'admin-jobs', 'Администрация', 'business-jobs', 7)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- Books & Media L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Books subcategories
  ('Fiction Books', 'fiction-books', 'Художествена литература', 'books', 1),
  ('Non-Fiction Books', 'non-fiction-books', 'Нехудожествена литература', 'books', 2),
  ('Children''s Books', 'childrens-books', 'Детски книги', 'books', 3),
  ('Textbooks', 'textbooks', 'Учебници', 'books', 4),
  ('Self-Help Books', 'self-help-books', 'Самопомощ', 'books', 5),
  ('Biography Books', 'biography-books', 'Биографии', 'books', 6),
  ('Business Books', 'business-books', 'Бизнес книги', 'books', 7),
  ('Cookbooks', 'cookbooks', 'Готварски книги', 'books', 8),
  ('Bulgarian Books', 'bulgarian-books', 'Българска литература', 'books', 9),
  
  -- Music subcategories
  ('Vinyl Records', 'vinyl-records', 'Грамофонни плочи', 'music', 1),
  ('CDs', 'cds', 'CD дискове', 'music', 2),
  ('Music Memorabilia', 'music-memorabilia', 'Музикални артикули', 'music', 3),
  ('Concert Tickets', 'concert-tickets', 'Билети за концерти', 'music', 4),
  ('Sheet Music', 'sheet-music', 'Ноти', 'music', 5),
  
  -- Movies subcategories
  ('DVDs', 'dvds', 'DVD филми', 'movies', 1),
  ('Blu-rays', 'blu-rays', 'Blu-ray филми', 'movies', 2),
  ('4K Movies', '4k-movies', '4K филми', 'movies', 3),
  ('TV Series', 'tv-series', 'ТВ сериали', 'movies', 4),
  ('Movie Memorabilia', 'movie-memorabilia', 'Филмови артикули', 'movies', 5)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- Wholesale L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Wholesale Electronics subcategories
  ('Wholesale Phones', 'wholesale-phones', 'Телефони на едро', 'wholesale-electronics', 1),
  ('Wholesale Tablets', 'wholesale-tablets', 'Таблети на едро', 'wholesale-electronics', 2),
  ('Wholesale Laptops', 'wholesale-laptops', 'Лаптопи на едро', 'wholesale-electronics', 3),
  ('Wholesale Accessories', 'wholesale-accessories', 'Аксесоари на едро', 'wholesale-electronics', 4),
  ('Wholesale Audio', 'wholesale-audio', 'Аудио на едро', 'wholesale-electronics', 5),
  ('Customer Returns Electronics', 'customer-returns-electronics', 'Върнати ел. артикули', 'wholesale-electronics', 6),
  
  -- Wholesale Clothing subcategories
  ('Wholesale Men''s Clothing', 'wholesale-mens', 'Мъжко облекло на едро', 'wholesale-clothing', 1),
  ('Wholesale Women''s Clothing', 'wholesale-womens', 'Дамско облекло на едро', 'wholesale-clothing', 2),
  ('Wholesale Kids Clothing', 'wholesale-kids', 'Детско облекло на едро', 'wholesale-clothing', 3),
  ('Wholesale Shoes', 'wholesale-shoes', 'Обувки на едро', 'wholesale-clothing', 4),
  ('Wholesale Accessories Fashion', 'wholesale-accessories-fashion', 'Аксесоари на едро', 'wholesale-clothing', 5),
  ('Overstock Clothing', 'overstock-clothing', 'Излишък от дрехи', 'wholesale-clothing', 6),
  
  -- Wholesale Food subcategories
  ('Wholesale Snacks', 'wholesale-snacks', 'Снаксове на едро', 'wholesale-food', 1),
  ('Wholesale Beverages', 'wholesale-beverages', 'Напитки на едро', 'wholesale-food', 2),
  ('Wholesale Canned Goods', 'wholesale-canned', 'Консерви на едро', 'wholesale-food', 3),
  ('Wholesale Organic', 'wholesale-organic', 'Био продукти на едро', 'wholesale-food', 4),
  ('Closeout Food', 'closeout-food', 'Ликвидация храни', 'wholesale-food', 5)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Electric Scooters subcategories
  ('Commuter Scooters', 'commuter-scooters', 'Градски тротинетки', 'electric-scooters', 1),
  ('Off-Road Scooters', 'offroad-scooters', 'Офроуд тротинетки', 'electric-scooters', 2),
  ('Kids Electric Scooters', 'kids-electric-scooters', 'Детски ел. тротинетки', 'electric-scooters', 3),
  ('Seated Electric Scooters', 'seated-scooters', 'Тротинетки със седалка', 'electric-scooters', 4),
  
  -- Electric Bikes subcategories
  ('City E-Bikes', 'city-ebikes', 'Градски електрически велосипеди', 'electric-bikes', 1),
  ('Mountain E-Bikes', 'mountain-ebikes', 'Планински ел. велосипеди', 'electric-bikes', 2),
  ('Folding E-Bikes', 'folding-ebikes', 'Сгъваеми ел. велосипеди', 'electric-bikes', 3),
  ('Cargo E-Bikes', 'cargo-ebikes', 'Карго ел. велосипеди', 'electric-bikes', 4),
  ('Road E-Bikes', 'road-ebikes', 'Шосейни ел. велосипеди', 'electric-bikes', 5),
  
  -- E-Mobility Parts subcategories
  ('E-Scooter Parts', 'escooter-parts', 'Части за ел. тротинетки', 'emobility-parts', 1),
  ('E-Bike Parts', 'ebike-parts', 'Части за ел. велосипеди', 'emobility-parts', 2),
  ('Batteries', 'emobility-batteries', 'Батерии за ел. возила', 'emobility-parts', 3),
  ('Chargers', 'emobility-chargers', 'Зарядни устройства', 'emobility-parts', 4),
  ('Motors', 'emobility-motors', 'Мотори', 'emobility-parts', 5),
  ('Accessories E-Mobility', 'emobility-accessories', 'Аксесоари', 'emobility-parts', 6)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;;
