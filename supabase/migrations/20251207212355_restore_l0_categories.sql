-- Restore any missing L0 categories
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
VALUES
  ('Electronics', 'electronics', 'Електроника', '📱', 'Phones, computers, audio and smart devices', NULL, 1),
  ('Home & Kitchen', 'home', 'Дом и Кухня', '🏠', 'Furniture, kitchen, bedding and décor', NULL, 2),
  ('Fashion', 'fashion', 'Мода', '👗', 'Clothing, shoes, accessories and jewelry', NULL, 3),
  ('Beauty', 'beauty', 'Красота', '💄', 'Makeup, skincare, haircare and fragrances', NULL, 4),
  ('Sports & Outdoors', 'sports', 'Спорт и туризъм', '⚽', 'Sports equipment, fitness and outdoor gear', NULL, 5),
  ('Kids', 'baby-kids', 'Деца', '👶', 'Baby gear, kids clothing and toys', NULL, 6),
  ('Gaming', 'gaming', 'Гейминг', '🎮', 'Consoles, video games, PC gaming and accessories', NULL, 7),
  ('Automotive', 'automotive', 'Автомобили', '🚗', 'Vehicles, parts, accessories and services', NULL, 8),
  ('Pets', 'pets', 'Домашни любимци', '🐕', 'Food, toys and supplies for all pets', NULL, 9),
  ('Real Estate', 'real-estate', 'Имоти', '🏡', 'Property sales and rentals', NULL, 10),
  ('Software & Digital', 'software', 'Софтуер', '💿', 'Software, apps and digital products', NULL, 11),
  ('Collectibles', 'collectibles', 'Колекционерски', '🎨', 'Art, antiques, coins and memorabilia', NULL, 12),
  ('Wholesale', 'wholesale', 'Търговия на едро', '📦', 'Bulk and wholesale products', NULL, 13),
  ('Hobbies', 'hobbies', 'Хобита', '🎨', 'Creative hobbies and activities', NULL, 14),
  ('Jewelry & Watches', 'jewelry-watches', 'Бижута и часовници', '💎', 'Fine jewelry, watches and accessories', NULL, 15),
  ('Grocery & Food', 'grocery', 'Храна', '🛒', 'Food, beverages and household items', NULL, 16),
  ('Tools & Industrial', 'tools-industrial', 'Инструменти', '🔧', 'Power tools, hand tools and hardware', NULL, 17),
  ('E-Mobility', 'e-mobility', 'Електромобилност', '⚡', 'Electric vehicles, scooters and bikes', NULL, 18),
  ('Services & Events', 'services', 'Услуги', '🛠️', 'Professional and personal services', NULL, 19),
  ('Bulgarian Traditional', 'bulgarian-traditional', 'Българско', '🇧🇬', 'Traditional Bulgarian products', NULL, 20),
  ('Health & Wellness', 'health-wellness', 'Здраве', '💊', 'Vitamins, supplements and health products', NULL, 21),
  ('Books', 'books', 'Книги', '📚', 'Fiction, non-fiction, textbooks', NULL, 22),
  ('Movies & Music', 'movies-music', 'Филми и музика', '🎬', 'DVDs, vinyl, CDs and streaming', NULL, 23)
ON CONFLICT (slug) DO NOTHING;;
