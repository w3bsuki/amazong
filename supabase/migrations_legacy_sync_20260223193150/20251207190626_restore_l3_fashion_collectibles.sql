
-- Restore L3 categories for Fashion and Collectibles

-- Men's Fashion L2 (parent: a1000000-0000-0000-0000-000000000001)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Men''s Shirts', 'mens-shirts', 'a1000000-0000-0000-0000-000000000001', 'Мъжки ризи', 1),
  ('Men''s T-Shirts', 'mens-tshirts', 'a1000000-0000-0000-0000-000000000001', 'Мъжки тениски', 2),
  ('Men''s Pants', 'mens-pants', 'a1000000-0000-0000-0000-000000000001', 'Мъжки панталони', 3),
  ('Men''s Jeans', 'mens-jeans', 'a1000000-0000-0000-0000-000000000001', 'Мъжки дънки', 4),
  ('Men''s Jackets', 'mens-jackets', 'a1000000-0000-0000-0000-000000000001', 'Мъжки якета', 5),
  ('Men''s Suits', 'mens-suits', 'a1000000-0000-0000-0000-000000000001', 'Мъжки костюми', 6),
  ('Men''s Sweaters', 'mens-sweaters', 'a1000000-0000-0000-0000-000000000001', 'Мъжки пуловери', 7),
  ('Men''s Activewear', 'mens-activewear', 'a1000000-0000-0000-0000-000000000001', 'Мъжко спортно облекло', 8),
  ('Men''s Underwear', 'mens-underwear', 'a1000000-0000-0000-0000-000000000001', 'Мъжко бельо', 9),
  ('Men''s Shoes', 'mens-shoes', 'a1000000-0000-0000-0000-000000000001', 'Мъжки обувки', 10)
ON CONFLICT (slug) DO NOTHING;

-- Women's Fashion L2 (parent: a1000000-0000-0000-0000-000000000002)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Women''s Dresses', 'womens-dresses', 'a1000000-0000-0000-0000-000000000002', 'Дамски рокли', 1),
  ('Women''s Tops', 'womens-tops', 'a1000000-0000-0000-0000-000000000002', 'Дамски топове', 2),
  ('Women''s Blouses', 'womens-blouses', 'a1000000-0000-0000-0000-000000000002', 'Дамски блузи', 3),
  ('Women''s Pants', 'womens-pants', 'a1000000-0000-0000-0000-000000000002', 'Дамски панталони', 4),
  ('Women''s Skirts', 'womens-skirts', 'a1000000-0000-0000-0000-000000000002', 'Дамски поли', 5),
  ('Women''s Jeans', 'womens-jeans', 'a1000000-0000-0000-0000-000000000002', 'Дамски дънки', 6),
  ('Women''s Jackets', 'womens-jackets', 'a1000000-0000-0000-0000-000000000002', 'Дамски якета', 7),
  ('Women''s Coats', 'womens-coats', 'a1000000-0000-0000-0000-000000000002', 'Дамски палта', 8),
  ('Women''s Sweaters', 'womens-sweaters', 'a1000000-0000-0000-0000-000000000002', 'Дамски пуловери', 9),
  ('Women''s Activewear', 'womens-activewear', 'a1000000-0000-0000-0000-000000000002', 'Дамско спортно облекло', 10),
  ('Women''s Lingerie', 'womens-lingerie', 'a1000000-0000-0000-0000-000000000002', 'Дамско бельо', 11),
  ('Women''s Shoes', 'womens-shoes', 'a1000000-0000-0000-0000-000000000002', 'Дамски обувки', 12),
  ('Women''s Swimwear', 'womens-swimwear', 'a1000000-0000-0000-0000-000000000002', 'Дамски бански', 13)
ON CONFLICT (slug) DO NOTHING;

-- Bags & Luggage L2 (parent: e9e5673e-1350-49b1-ba93-6070bfbaae50)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Handbags', 'bags-handbags', 'e9e5673e-1350-49b1-ba93-6070bfbaae50', 'Дамски чанти', 1),
  ('Backpacks', 'bags-backpacks', 'e9e5673e-1350-49b1-ba93-6070bfbaae50', 'Раници', 2),
  ('Crossbody Bags', 'bags-crossbody', 'e9e5673e-1350-49b1-ba93-6070bfbaae50', 'Чанти през рамо', 3),
  ('Tote Bags', 'bags-tote', 'e9e5673e-1350-49b1-ba93-6070bfbaae50', 'Тотбаг чанти', 4),
  ('Clutches', 'bags-clutches', 'e9e5673e-1350-49b1-ba93-6070bfbaae50', 'Клъч чанти', 5),
  ('Wallets', 'bags-wallets', 'e9e5673e-1350-49b1-ba93-6070bfbaae50', 'Портфейли', 6),
  ('Travel Luggage', 'bags-luggage', 'e9e5673e-1350-49b1-ba93-6070bfbaae50', 'Куфари', 7),
  ('Duffel Bags', 'bags-duffel', 'e9e5673e-1350-49b1-ba93-6070bfbaae50', 'Спортни чанти', 8)
ON CONFLICT (slug) DO NOTHING;

-- Fashion Accessories L2 (parent: dd888d60-9628-420c-93cd-dc6aa9f3accb)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Belts', 'acc-belts', 'dd888d60-9628-420c-93cd-dc6aa9f3accb', 'Колани', 1),
  ('Scarves', 'acc-scarves', 'dd888d60-9628-420c-93cd-dc6aa9f3accb', 'Шалове', 2),
  ('Hats & Caps', 'acc-hats', 'dd888d60-9628-420c-93cd-dc6aa9f3accb', 'Шапки', 3),
  ('Sunglasses', 'acc-sunglasses', 'dd888d60-9628-420c-93cd-dc6aa9f3accb', 'Слънчеви очила', 4),
  ('Gloves', 'acc-gloves', 'dd888d60-9628-420c-93cd-dc6aa9f3accb', 'Ръкавици', 5),
  ('Ties & Bowties', 'acc-ties', 'dd888d60-9628-420c-93cd-dc6aa9f3accb', 'Вратовръзки', 6),
  ('Hair Accessories', 'acc-hair', 'dd888d60-9628-420c-93cd-dc6aa9f3accb', 'Аксесоари за коса', 7)
ON CONFLICT (slug) DO NOTHING;

-- Antiques L2 (parent: cf5dfe29-f1d7-4423-9fe9-e2cc52371e7e)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Antique Furniture', 'antique-furniture', 'cf5dfe29-f1d7-4423-9fe9-e2cc52371e7e', 'Антикварни мебели', 1),
  ('Antique Clocks', 'antique-clocks', 'cf5dfe29-f1d7-4423-9fe9-e2cc52371e7e', 'Антикварни часовници', 2),
  ('Antique Porcelain', 'antique-porcelain', 'cf5dfe29-f1d7-4423-9fe9-e2cc52371e7e', 'Антикварен порцелан', 3),
  ('Antique Silver', 'antique-silver', 'cf5dfe29-f1d7-4423-9fe9-e2cc52371e7e', 'Антикварно сребро', 4),
  ('Antique Paintings', 'antique-paintings', 'cf5dfe29-f1d7-4423-9fe9-e2cc52371e7e', 'Антикварни картини', 5),
  ('Antique Books', 'antique-books', 'cf5dfe29-f1d7-4423-9fe9-e2cc52371e7e', 'Антикварни книги', 6),
  ('Antique Maps', 'antique-maps', 'cf5dfe29-f1d7-4423-9fe9-e2cc52371e7e', 'Антикварни карти', 7)
ON CONFLICT (slug) DO NOTHING;

-- Art L2 (parent: 6cf4e083-9242-4d3d-96a3-e0636293c429)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Paintings', 'art-paintings', '6cf4e083-9242-4d3d-96a3-e0636293c429', 'Картини', 1),
  ('Sculptures', 'art-sculptures', '6cf4e083-9242-4d3d-96a3-e0636293c429', 'Скулптури', 2),
  ('Photography', 'art-photography', '6cf4e083-9242-4d3d-96a3-e0636293c429', 'Фотография', 3),
  ('Prints & Posters', 'art-prints', '6cf4e083-9242-4d3d-96a3-e0636293c429', 'Постери', 4),
  ('Digital Art', 'art-digital', '6cf4e083-9242-4d3d-96a3-e0636293c429', 'Дигитално изкуство', 5),
  ('Mixed Media', 'art-mixed', '6cf4e083-9242-4d3d-96a3-e0636293c429', 'Смесени техники', 6)
ON CONFLICT (slug) DO NOTHING;

-- Coins & Currency L2 (parent: 5473c0f8-64e3-4b58-8cb4-1d70e59578b6)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Ancient Coins', 'coins-ancient', '5473c0f8-64e3-4b58-8cb4-1d70e59578b6', 'Антични монети', 1),
  ('World Coins', 'coins-world', '5473c0f8-64e3-4b58-8cb4-1d70e59578b6', 'Световни монети', 2),
  ('US Coins', 'coins-us', '5473c0f8-64e3-4b58-8cb4-1d70e59578b6', 'Американски монети', 3),
  ('Bulgarian Coins', 'coins-bulgarian', '5473c0f8-64e3-4b58-8cb4-1d70e59578b6', 'Български монети', 4),
  ('Paper Money', 'coins-paper', '5473c0f8-64e3-4b58-8cb4-1d70e59578b6', 'Банкноти', 5),
  ('Gold Coins', 'coins-gold', '5473c0f8-64e3-4b58-8cb4-1d70e59578b6', 'Златни монети', 6),
  ('Silver Coins', 'coins-silver', '5473c0f8-64e3-4b58-8cb4-1d70e59578b6', 'Сребърни монети', 7)
ON CONFLICT (slug) DO NOTHING;

-- Trading Cards L2 (parent: 8b5ca4c3-afaf-427c-876b-4dcc4883e72e)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Pokemon Cards', 'cards-pokemon', '8b5ca4c3-afaf-427c-876b-4dcc4883e72e', 'Pokemon карти', 1),
  ('Magic: The Gathering', 'cards-mtg', '8b5ca4c3-afaf-427c-876b-4dcc4883e72e', 'Magic карти', 2),
  ('Yu-Gi-Oh Cards', 'cards-yugioh', '8b5ca4c3-afaf-427c-876b-4dcc4883e72e', 'Yu-Gi-Oh карти', 3),
  ('Sports Cards', 'cards-sports', '8b5ca4c3-afaf-427c-876b-4dcc4883e72e', 'Спортни карти', 4),
  ('Collectible Card Games', 'cards-ccg', '8b5ca4c3-afaf-427c-876b-4dcc4883e72e', 'Колекционерски карти', 5)
ON CONFLICT (slug) DO NOTHING;

-- Collectible Toys & Figures L2 (parent: 9abc2ddd-2296-4a02-adc2-4f9dc4db9bdf)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Action Figures', 'coll-action-figures', '9abc2ddd-2296-4a02-adc2-4f9dc4db9bdf', 'Екшън фигури', 1),
  ('Funko Pops', 'coll-funko', '9abc2ddd-2296-4a02-adc2-4f9dc4db9bdf', 'Funko Pop', 2),
  ('LEGO Sets', 'coll-lego', '9abc2ddd-2296-4a02-adc2-4f9dc4db9bdf', 'LEGO', 3),
  ('Vintage Toys', 'coll-vintage-toys', '9abc2ddd-2296-4a02-adc2-4f9dc4db9bdf', 'Винтидж играчки', 4),
  ('Model Kits', 'coll-model-kits', '9abc2ddd-2296-4a02-adc2-4f9dc4db9bdf', 'Модели', 5),
  ('Diecast Models', 'coll-diecast', '9abc2ddd-2296-4a02-adc2-4f9dc4db9bdf', 'Метални модели', 6)
ON CONFLICT (slug) DO NOTHING;

-- Entertainment Memorabilia L2 (parent: dd984951-7368-46c2-8360-5306ce7440d5)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Movie Props', 'mem-movie-props', 'dd984951-7368-46c2-8360-5306ce7440d5', 'Филмови реквизити', 1),
  ('TV Show Memorabilia', 'mem-tv', 'dd984951-7368-46c2-8360-5306ce7440d5', 'ТВ сериали', 2),
  ('Music Memorabilia', 'mem-music', 'dd984951-7368-46c2-8360-5306ce7440d5', 'Музикални', 3),
  ('Disney Collectibles', 'mem-disney', 'dd984951-7368-46c2-8360-5306ce7440d5', 'Disney колекция', 4),
  ('Star Wars', 'mem-star-wars', 'dd984951-7368-46c2-8360-5306ce7440d5', 'Star Wars', 5),
  ('Marvel & DC', 'mem-marvel-dc', 'dd984951-7368-46c2-8360-5306ce7440d5', 'Marvel и DC', 6)
ON CONFLICT (slug) DO NOTHING;
;
