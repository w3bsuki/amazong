
-- Restore L3 categories for Grocery, Software, Real Estate

-- Pantry & Dry Goods L2 (parent: e18261d3-51e1-4325-9047-e69e61d68d31)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Pasta & Noodles', 'pantry-pasta', 'e18261d3-51e1-4325-9047-e69e61d68d31', 'Паста и юфка', 1),
  ('Rice & Grains', 'pantry-rice', 'e18261d3-51e1-4325-9047-e69e61d68d31', 'Ориз и зърна', 2),
  ('Beans & Legumes', 'pantry-beans', 'e18261d3-51e1-4325-9047-e69e61d68d31', 'Боб и бобови', 3),
  ('Flour & Baking', 'pantry-flour', 'e18261d3-51e1-4325-9047-e69e61d68d31', 'Брашно и печене', 4),
  ('Oils & Vinegars', 'pantry-oils', 'e18261d3-51e1-4325-9047-e69e61d68d31', 'Олио и оцет', 5),
  ('Canned Goods', 'pantry-canned', 'e18261d3-51e1-4325-9047-e69e61d68d31', 'Консерви', 6),
  ('Sauces & Condiments', 'pantry-sauces', 'e18261d3-51e1-4325-9047-e69e61d68d31', 'Сосове и подправки', 7),
  ('Spices & Herbs', 'pantry-spices', 'e18261d3-51e1-4325-9047-e69e61d68d31', 'Подправки', 8),
  ('Soup & Broth', 'pantry-soup', 'e18261d3-51e1-4325-9047-e69e61d68d31', 'Супи и бульони', 9)
ON CONFLICT (slug) DO NOTHING;

-- Drinks & Beverages L2 (parent: df3da6b9-d7c4-4e8a-9b05-bcb8356ac415)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Water', 'drinks-water', 'df3da6b9-d7c4-4e8a-9b05-bcb8356ac415', 'Вода', 1),
  ('Soft Drinks', 'drinks-soda', 'df3da6b9-d7c4-4e8a-9b05-bcb8356ac415', 'Безалкохолни', 2),
  ('Juices', 'drinks-juices', 'df3da6b9-d7c4-4e8a-9b05-bcb8356ac415', 'Сокове', 3),
  ('Coffee', 'drinks-coffee', 'df3da6b9-d7c4-4e8a-9b05-bcb8356ac415', 'Кафе', 4),
  ('Tea', 'drinks-tea', 'df3da6b9-d7c4-4e8a-9b05-bcb8356ac415', 'Чай', 5),
  ('Energy Drinks', 'drinks-energy', 'df3da6b9-d7c4-4e8a-9b05-bcb8356ac415', 'Енергийни напитки', 6),
  ('Wine', 'drinks-wine', 'df3da6b9-d7c4-4e8a-9b05-bcb8356ac415', 'Вино', 7),
  ('Beer', 'drinks-beer', 'df3da6b9-d7c4-4e8a-9b05-bcb8356ac415', 'Бира', 8),
  ('Spirits', 'drinks-spirits', 'df3da6b9-d7c4-4e8a-9b05-bcb8356ac415', 'Спиртни напитки', 9)
ON CONFLICT (slug) DO NOTHING;

-- Snacks & Sweets L2 (parent: 59849ba2-de77-41fa-8064-980bef51226c)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Chips & Crisps', 'snacks-chips', '59849ba2-de77-41fa-8064-980bef51226c', 'Чипс', 1),
  ('Nuts & Seeds', 'snacks-nuts', '59849ba2-de77-41fa-8064-980bef51226c', 'Ядки', 2),
  ('Chocolate', 'snacks-chocolate', '59849ba2-de77-41fa-8064-980bef51226c', 'Шоколад', 3),
  ('Candy', 'snacks-candy', '59849ba2-de77-41fa-8064-980bef51226c', 'Бонбони', 4),
  ('Cookies & Biscuits', 'snacks-cookies', '59849ba2-de77-41fa-8064-980bef51226c', 'Бисквити', 5),
  ('Crackers', 'snacks-crackers', '59849ba2-de77-41fa-8064-980bef51226c', 'Крекери', 6),
  ('Popcorn', 'snacks-popcorn', '59849ba2-de77-41fa-8064-980bef51226c', 'Пуканки', 7),
  ('Dried Fruits', 'snacks-dried-fruits', '59849ba2-de77-41fa-8064-980bef51226c', 'Сушени плодове', 8)
ON CONFLICT (slug) DO NOTHING;

-- Dairy L2 (parent: ecad2331-3d3e-4aa6-b2a6-c1014a1119d7)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Milk', 'dairy-milk', 'ecad2331-3d3e-4aa6-b2a6-c1014a1119d7', 'Мляко', 1),
  ('Cheese', 'dairy-cheese', 'ecad2331-3d3e-4aa6-b2a6-c1014a1119d7', 'Сирене', 2),
  ('Yogurt', 'dairy-yogurt', 'ecad2331-3d3e-4aa6-b2a6-c1014a1119d7', 'Кисело мляко', 3),
  ('Butter & Margarine', 'dairy-butter', 'ecad2331-3d3e-4aa6-b2a6-c1014a1119d7', 'Масло и маргарин', 4),
  ('Eggs', 'dairy-eggs', 'ecad2331-3d3e-4aa6-b2a6-c1014a1119d7', 'Яйца', 5),
  ('Cream', 'dairy-cream', 'ecad2331-3d3e-4aa6-b2a6-c1014a1119d7', 'Сметана', 6),
  ('Plant-Based Dairy', 'dairy-plant-based', 'ecad2331-3d3e-4aa6-b2a6-c1014a1119d7', 'Растителни алтернативи', 7)
ON CONFLICT (slug) DO NOTHING;

-- Meat & Seafood L2 (parent: 514e5eeb-311e-4e90-bcc2-11f446ab5001)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Beef', 'meat-beef', '514e5eeb-311e-4e90-bcc2-11f446ab5001', 'Говеждо', 1),
  ('Pork', 'meat-pork', '514e5eeb-311e-4e90-bcc2-11f446ab5001', 'Свинско', 2),
  ('Chicken', 'meat-chicken', '514e5eeb-311e-4e90-bcc2-11f446ab5001', 'Пилешко', 3),
  ('Lamb', 'meat-lamb', '514e5eeb-311e-4e90-bcc2-11f446ab5001', 'Агнешко', 4),
  ('Fish', 'meat-fish', '514e5eeb-311e-4e90-bcc2-11f446ab5001', 'Риба', 5),
  ('Shellfish', 'meat-shellfish', '514e5eeb-311e-4e90-bcc2-11f446ab5001', 'Миди и морски дарове', 6),
  ('Deli Meats', 'meat-deli', '514e5eeb-311e-4e90-bcc2-11f446ab5001', 'Деликатеси', 7),
  ('Sausages', 'meat-sausages', '514e5eeb-311e-4e90-bcc2-11f446ab5001', 'Колбаси', 8)
ON CONFLICT (slug) DO NOTHING;

-- Business Software L2 (parent: 578347fa-cf05-4bfc-8ae7-11bc9f5d3887)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Accounting Software', 'biz-accounting', '578347fa-cf05-4bfc-8ae7-11bc9f5d3887', 'Счетоводен софтуер', 1),
  ('CRM Software', 'biz-crm', '578347fa-cf05-4bfc-8ae7-11bc9f5d3887', 'CRM софтуер', 2),
  ('ERP Software', 'biz-erp', '578347fa-cf05-4bfc-8ae7-11bc9f5d3887', 'ERP системи', 3),
  ('HR Software', 'biz-hr', '578347fa-cf05-4bfc-8ae7-11bc9f5d3887', 'HR софтуер', 4),
  ('Project Management', 'biz-project-mgmt', '578347fa-cf05-4bfc-8ae7-11bc9f5d3887', 'Управление на проекти', 5),
  ('Inventory Management', 'biz-inventory', '578347fa-cf05-4bfc-8ae7-11bc9f5d3887', 'Управление на инвентар', 6)
ON CONFLICT (slug) DO NOTHING;

-- Creative Software L2 (parent: 2103af6f-8f10-4b69-9f5f-b872d5ba8ace)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Photo Editing', 'creative-photo', '2103af6f-8f10-4b69-9f5f-b872d5ba8ace', 'Редактиране на снимки', 1),
  ('Video Editing', 'creative-video', '2103af6f-8f10-4b69-9f5f-b872d5ba8ace', 'Видео редактиране', 2),
  ('Graphic Design', 'creative-design', '2103af6f-8f10-4b69-9f5f-b872d5ba8ace', 'Графичен дизайн', 3),
  ('3D Modeling', 'creative-3d', '2103af6f-8f10-4b69-9f5f-b872d5ba8ace', '3D моделиране', 4),
  ('Music Production', 'creative-music', '2103af6f-8f10-4b69-9f5f-b872d5ba8ace', 'Музикална продукция', 5),
  ('Animation', 'creative-animation', '2103af6f-8f10-4b69-9f5f-b872d5ba8ace', 'Анимация', 6)
ON CONFLICT (slug) DO NOTHING;

-- Web & Development L2 (parent: 2966b78c-d860-4345-86e2-1329c1e8d0ae)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('IDEs & Code Editors', 'dev-ide', '2966b78c-d860-4345-86e2-1329c1e8d0ae', 'IDE и редактори', 1),
  ('Database Tools', 'dev-database', '2966b78c-d860-4345-86e2-1329c1e8d0ae', 'База данни', 2),
  ('Version Control', 'dev-version-control', '2966b78c-d860-4345-86e2-1329c1e8d0ae', 'Version Control', 3),
  ('API Tools', 'dev-api', '2966b78c-d860-4345-86e2-1329c1e8d0ae', 'API инструменти', 4),
  ('Testing Tools', 'dev-testing', '2966b78c-d860-4345-86e2-1329c1e8d0ae', 'Тестване', 5),
  ('Web Frameworks', 'dev-frameworks', '2966b78c-d860-4345-86e2-1329c1e8d0ae', 'Уеб фреймуорци', 6)
ON CONFLICT (slug) DO NOTHING;

-- Residential Sales L2 (parent: 2b174600-a166-48dd-9404-d824555f3612)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Apartments', 'res-apartments', '2b174600-a166-48dd-9404-d824555f3612', 'Апартаменти', 1),
  ('Houses', 'res-houses', '2b174600-a166-48dd-9404-d824555f3612', 'Къщи', 2),
  ('Villas', 'res-villas', '2b174600-a166-48dd-9404-d824555f3612', 'Вили', 3),
  ('Townhouses', 'res-townhouses', '2b174600-a166-48dd-9404-d824555f3612', 'Редови къщи', 4),
  ('Penthouses', 'res-penthouses', '2b174600-a166-48dd-9404-d824555f3612', 'Пентхауси', 5),
  ('Studios', 'res-studios', '2b174600-a166-48dd-9404-d824555f3612', 'Студия', 6),
  ('Maisonettes', 'res-maisonettes', '2b174600-a166-48dd-9404-d824555f3612', 'Мезонети', 7)
ON CONFLICT (slug) DO NOTHING;

-- Residential Rentals L2 (parent: 87565762-319d-4cfa-85cd-cabb157f75ef)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Apartment Rentals', 'rent-apartments', '87565762-319d-4cfa-85cd-cabb157f75ef', 'Апартаменти под наем', 1),
  ('House Rentals', 'rent-houses', '87565762-319d-4cfa-85cd-cabb157f75ef', 'Къщи под наем', 2),
  ('Room Rentals', 'rent-rooms', '87565762-319d-4cfa-85cd-cabb157f75ef', 'Стаи под наем', 3),
  ('Shared Accommodations', 'rent-shared', '87565762-319d-4cfa-85cd-cabb157f75ef', 'Споделено настаняване', 4),
  ('Short-Term Rentals', 'rent-short-term', '87565762-319d-4cfa-85cd-cabb157f75ef', 'Краткосрочен наем', 5)
ON CONFLICT (slug) DO NOTHING;

-- Commercial L2 (parent: aced61f5-67c0-4cd0-8c91-c10b653bc1b9)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Office Spaces', 'comm-office', 'aced61f5-67c0-4cd0-8c91-c10b653bc1b9', 'Офиси', 1),
  ('Retail Spaces', 'comm-retail', 'aced61f5-67c0-4cd0-8c91-c10b653bc1b9', 'Търговски площи', 2),
  ('Warehouses', 'comm-warehouse', 'aced61f5-67c0-4cd0-8c91-c10b653bc1b9', 'Складове', 3),
  ('Industrial Properties', 'comm-industrial', 'aced61f5-67c0-4cd0-8c91-c10b653bc1b9', 'Индустриални имоти', 4),
  ('Hotels & Hospitality', 'comm-hotel', 'aced61f5-67c0-4cd0-8c91-c10b653bc1b9', 'Хотели', 5),
  ('Restaurants & Cafes', 'comm-restaurant', 'aced61f5-67c0-4cd0-8c91-c10b653bc1b9', 'Ресторанти и кафенета', 6)
ON CONFLICT (slug) DO NOTHING;

-- Land L2 (parent: 9df696ac-5885-4a79-af93-41fb1b977c4b)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Building Plots', 'land-building', '9df696ac-5885-4a79-af93-41fb1b977c4b', 'УПИ', 1),
  ('Agricultural Land', 'land-agricultural', '9df696ac-5885-4a79-af93-41fb1b977c4b', 'Земеделска земя', 2),
  ('Forest Land', 'land-forest', '9df696ac-5885-4a79-af93-41fb1b977c4b', 'Горска земя', 3),
  ('Regulated Land', 'land-regulated', '9df696ac-5885-4a79-af93-41fb1b977c4b', 'Регулиран парцел', 4)
ON CONFLICT (slug) DO NOTHING;
;
