-- Restore more L3 categories that may be missing

-- More Electronics L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Tablets subcategories
  ('Apple iPad', 'ipad', 'Apple iPad', 'tablets', 1),
  ('Samsung Galaxy Tab', 'galaxy-tab', 'Samsung Galaxy Tab', 'tablets', 2),
  ('Android Tablets', 'android-tablets', 'Android таблети', 'tablets', 3),
  ('Windows Tablets', 'windows-tablets', 'Windows таблети', 'tablets', 4),
  ('Kids Tablets', 'kids-tablets', 'Детски таблети', 'tablets', 5),
  ('E-Readers', 'e-readers', 'Четци за електронни книги', 'tablets', 6),
  
  -- Laptop subcategories
  ('Gaming Laptops', 'gaming-laptops', 'Геймърски лаптопи', 'laptops', 1),
  ('Business Laptops', 'business-laptops', 'Бизнес лаптопи', 'laptops', 2),
  ('MacBooks', 'macbooks', 'MacBooks', 'laptops', 3),
  ('Chromebooks', 'chromebooks', 'Chromebooks', 'laptops', 4),
  ('2-in-1 Laptops', '2-in-1-laptops', '2-в-1 лаптопи', 'laptops', 5),
  ('Budget Laptops', 'budget-laptops', 'Бюджетни лаптопи', 'laptops', 6),
  
  -- TV subcategories
  ('OLED TVs', 'oled-tvs', 'OLED телевизори', 'tvs', 1),
  ('QLED TVs', 'qled-tvs', 'QLED телевизори', 'tvs', 2),
  ('Smart TVs', 'smart-tvs', 'Smart телевизори', 'tvs', 3),
  ('LED TVs', 'led-tvs', 'LED телевизори', 'tvs', 4),
  ('Budget TVs', 'budget-tvs', 'Бюджетни телевизори', 'tvs', 5),
  
  -- Audio subcategories
  ('Over-Ear Headphones', 'over-ear-headphones', 'Слушалки над ушите', 'audio', 1),
  ('In-Ear Headphones', 'in-ear-headphones', 'Слушалки в ушите', 'audio', 2),
  ('True Wireless Earbuds', 'wireless-earbuds', 'Безжични тапи', 'audio', 3),
  ('Bluetooth Speakers', 'bluetooth-speakers', 'Bluetooth колони', 'audio', 4),
  ('Home Theater Systems', 'home-theater', 'Домашно кино', 'audio', 5),
  ('Soundbars', 'soundbars', 'Саундбарове', 'audio', 6),
  ('Portable Speakers', 'portable-speakers', 'Преносими колони', 'audio', 7),
  ('Studio Equipment', 'studio-equipment', 'Студийно оборудване', 'audio', 8),
  
  -- Camera subcategories
  ('DSLR Cameras', 'dslr-cameras', 'DSLR фотоапарати', 'cameras', 1),
  ('Mirrorless Cameras', 'mirrorless-cameras', 'Безогледални фотоапарати', 'cameras', 2),
  ('Action Cameras', 'action-cameras', 'Екшън камери', 'cameras', 3),
  ('Camera Lenses', 'camera-lenses', 'Обективи', 'cameras', 4),
  ('Camera Accessories', 'camera-accessories', 'Аксесоари за камери', 'cameras', 5),
  ('Tripods & Stabilizers', 'tripods-stabilizers', 'Статив и стабилизатори', 'cameras', 6),
  ('Lighting Equipment', 'lighting-equipment', 'Осветление', 'cameras', 7),
  
  -- Smart Home subcategories
  ('Smart Lights', 'smart-lights', 'Смарт осветление', 'smart-home', 1),
  ('Smart Speakers', 'smart-speakers', 'Смарт говорители', 'smart-home', 2),
  ('Smart Cameras', 'smart-cameras', 'Смарт камери', 'smart-home', 3),
  ('Smart Locks', 'smart-locks', 'Смарт брави', 'smart-home', 4),
  ('Smart Thermostats', 'smart-thermostats', 'Смарт термостати', 'smart-home', 5),
  ('Smart Plugs', 'smart-plugs', 'Смарт контакти', 'smart-home', 6),
  ('Smart Doorbells', 'smart-doorbells', 'Смарт звънци', 'smart-home', 7),
  
  -- Wearables subcategories
  ('Apple Watch', 'apple-watch', 'Apple Watch', 'wearables', 1),
  ('Samsung Galaxy Watch', 'samsung-watch', 'Samsung Galaxy Watch', 'wearables', 2),
  ('Garmin Watches', 'garmin-watches', 'Garmin часовници', 'wearables', 3),
  ('Fitbit', 'fitbit', 'Fitbit', 'wearables', 4),
  ('Other Smartwatches', 'other-smartwatches', 'Други смарт часовници', 'wearables', 5),
  ('Fitness Bands', 'fitness-bands', 'Фитнес гривни', 'wearables', 6)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- More Fashion L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Men's Clothing subcategories
  ('T-Shirts', 'mens-tshirts', 'Мъжки тениски', 'mens-clothing', 1),
  ('Shirts', 'mens-shirts', 'Мъжки ризи', 'mens-clothing', 2),
  ('Pants', 'mens-pants', 'Мъжки панталони', 'mens-clothing', 3),
  ('Jeans', 'mens-jeans', 'Мъжки дънки', 'mens-clothing', 4),
  ('Jackets', 'mens-jackets', 'Мъжки якета', 'mens-clothing', 5),
  ('Suits', 'mens-suits', 'Мъжки костюми', 'mens-clothing', 6),
  ('Sweaters', 'mens-sweaters', 'Мъжки пуловери', 'mens-clothing', 7),
  ('Activewear', 'mens-activewear', 'Мъжко спортно облекло', 'mens-clothing', 8),
  ('Underwear', 'mens-underwear', 'Мъжко бельо', 'mens-clothing', 9),
  ('Sleepwear', 'mens-sleepwear', 'Мъжки пижами', 'mens-clothing', 10),
  
  -- Women's Clothing subcategories
  ('Dresses', 'womens-dresses', 'Дамски рокли', 'womens-clothing', 1),
  ('Tops', 'womens-tops', 'Дамски блузи', 'womens-clothing', 2),
  ('Pants', 'womens-pants', 'Дамски панталони', 'womens-clothing', 3),
  ('Jeans', 'womens-jeans', 'Дамски дънки', 'womens-clothing', 4),
  ('Skirts', 'womens-skirts', 'Дамски поли', 'womens-clothing', 5),
  ('Jackets', 'womens-jackets', 'Дамски якета', 'womens-clothing', 6),
  ('Sweaters', 'womens-sweaters', 'Дамски пуловери', 'womens-clothing', 7),
  ('Activewear', 'womens-activewear', 'Дамско спортно облекло', 'womens-clothing', 8),
  ('Lingerie', 'womens-lingerie', 'Дамско бельо', 'womens-clothing', 9),
  ('Swimwear', 'womens-swimwear', 'Дамски бански', 'womens-clothing', 10),
  
  -- Shoes subcategories (assuming there's a shoes L2)
  ('Men''s Sneakers', 'mens-sneakers', 'Мъжки кецове', 'mens-shoes', 1),
  ('Men''s Dress Shoes', 'mens-dress-shoes', 'Мъжки официални обувки', 'mens-shoes', 2),
  ('Men''s Boots', 'mens-boots', 'Мъжки ботуши', 'mens-shoes', 3),
  ('Men''s Sandals', 'mens-sandals', 'Мъжки сандали', 'mens-shoes', 4),
  ('Women''s Sneakers', 'womens-sneakers', 'Дамски кецове', 'womens-shoes', 1),
  ('Women''s Heels', 'womens-heels', 'Дамски обувки на ток', 'womens-shoes', 2),
  ('Women''s Boots', 'womens-boots', 'Дамски ботуши', 'womens-shoes', 3),
  ('Women''s Flats', 'womens-flats', 'Дамски равни обувки', 'womens-shoes', 4),
  ('Women''s Sandals', 'womens-sandals', 'Дамски сандали', 'womens-shoes', 5)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- More Home & Garden L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Furniture subcategories
  ('Living Room Furniture', 'living-room-furniture', 'Мебели за хол', 'furniture', 1),
  ('Bedroom Furniture', 'bedroom-furniture', 'Мебели за спалня', 'furniture', 2),
  ('Dining Furniture', 'dining-furniture', 'Мебели за хранене', 'furniture', 3),
  ('Outdoor Furniture', 'outdoor-furniture', 'Градинска мебел', 'furniture', 4),
  ('Office Furniture Home', 'office-furniture-home', 'Офис мебели за дома', 'furniture', 5),
  ('Storage Furniture', 'storage-furniture', 'Мебели за съхранение', 'furniture', 6),
  
  -- Kitchen subcategories
  ('Small Kitchen Appliances', 'small-kitchen-appliances', 'Малки кухненски уреди', 'kitchen-appliances', 1),
  ('Large Kitchen Appliances', 'large-kitchen-appliances', 'Големи кухненски уреди', 'kitchen-appliances', 2),
  ('Cookware', 'cookware', 'Съдове за готвене', 'kitchen-appliances', 3),
  ('Kitchen Utensils', 'kitchen-utensils', 'Кухненски прибори', 'kitchen-appliances', 4),
  ('Food Storage', 'food-storage', 'Съхранение на храна', 'kitchen-appliances', 5),
  ('Coffee & Tea', 'coffee-tea', 'Кафе и чай', 'kitchen-appliances', 6),
  
  -- Garden subcategories
  ('Plants & Seeds', 'plants-seeds', 'Растения и семена', 'garden-outdoor', 1),
  ('Garden Tools', 'garden-tools-cat', 'Градински инструменти', 'garden-outdoor', 2),
  ('Lawn Care', 'lawn-care', 'Грижа за тревата', 'garden-outdoor', 3),
  ('Patio Furniture', 'patio-furniture', 'Мебели за двор', 'garden-outdoor', 4),
  ('BBQ & Grills', 'bbq-grills', 'Барбекю и скари', 'garden-outdoor', 5),
  ('Pool & Spa', 'pool-spa', 'Басейн и спа', 'garden-outdoor', 6),
  ('Outdoor Lighting', 'outdoor-lighting', 'Външно осветление', 'garden-outdoor', 7)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;;
