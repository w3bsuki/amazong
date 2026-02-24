-- Restore Kids & Baby L3 categories

-- Baby Strollers L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Standard Strollers', 'strollers-standard', 'Стандартни колички', 1),
  ('Jogging Strollers', 'strollers-jogging', 'Колички за джогинг', 2),
  ('Double Strollers', 'strollers-double', 'Двойни колички', 3),
  ('Umbrella Strollers', 'strollers-umbrella', 'Чадърни колички', 4),
  ('Travel System Strollers', 'strollers-travel', 'Комбинирани системи', 5),
  ('Lightweight Strollers', 'strollers-lightweight', 'Леки колички', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'baby-strollers'
ON CONFLICT (slug) DO NOTHING;

-- Car Seats L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Infant Car Seats', 'car-seats-infant', 'Столчета за новородени', 1),
  ('Convertible Car Seats', 'car-seats-convertible', 'Конвертируеми столчета', 2),
  ('Booster Seats', 'car-seats-booster', 'Бустер столчета', 3),
  ('All-in-One Car Seats', 'car-seats-allinone', 'Универсални столчета', 4),
  ('Car Seat Accessories', 'car-seats-accessories', 'Аксесоари за столчета', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'baby-car-seats'
ON CONFLICT (slug) DO NOTHING;

-- Baby Feeding L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Baby Bottles', 'feeding-bottles', 'Бебешки шишета', 1),
  ('Breast Pumps', 'feeding-breast-pumps', 'Помпи за кърма', 2),
  ('Baby Food Makers', 'feeding-food-makers', 'Уреди за бебешка храна', 3),
  ('High Chairs', 'feeding-high-chairs', 'Столчета за хранене', 4),
  ('Bibs', 'feeding-bibs', 'Лигавници', 5),
  ('Baby Formula', 'feeding-formula', 'Адаптирано мляко', 6),
  ('Sippy Cups', 'feeding-sippy-cups', 'Неразливащи се чаши', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'baby-feeding'
ON CONFLICT (slug) DO NOTHING;

-- Baby Nursery L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Cribs', 'nursery-cribs', 'Бебешки кошари', 1),
  ('Bassinets', 'nursery-bassinets', 'Люлки', 2),
  ('Changing Tables', 'nursery-changing-tables', 'Повивалници', 3),
  ('Baby Monitors', 'nursery-monitors', 'Бебефони', 4),
  ('Nursery Decor', 'nursery-decor', 'Декорация за детска стая', 5),
  ('Crib Bedding', 'nursery-bedding', 'Бебешко спално бельо', 6),
  ('Nursery Storage', 'nursery-storage', 'Съхранение за детска стая', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'baby-nursery'
ON CONFLICT (slug) DO NOTHING;

-- Action Figures L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Superhero Figures', 'figures-superhero', 'Супергерои', 1),
  ('Movie Figures', 'figures-movie', 'Филмови фигурки', 2),
  ('Anime Figures', 'figures-anime', 'Аниме фигурки', 3),
  ('Video Game Figures', 'figures-videogame', 'Фигурки от игри', 4),
  ('Wrestling Figures', 'figures-wrestling', 'Фигурки кечисти', 5),
  ('Military Figures', 'figures-military', 'Военни фигурки', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'toys-action-figures'
ON CONFLICT (slug) DO NOTHING;

-- Dolls L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Fashion Dolls', 'dolls-fashion', 'Модни кукли', 1),
  ('Baby Dolls', 'dolls-baby', 'Бебешки кукли', 2),
  ('Collectible Dolls', 'dolls-collectible', 'Колекционерски кукли', 3),
  ('Doll Houses', 'dolls-houses', 'Къщи за кукли', 4),
  ('Doll Accessories', 'dolls-accessories', 'Аксесоари за кукли', 5),
  ('Plush Dolls', 'dolls-plush', 'Плюшени кукли', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'toys-dolls'
ON CONFLICT (slug) DO NOTHING;

-- Building Sets L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('LEGO Sets', 'building-lego', 'LEGO комплекти', 1),
  ('Mega Bloks', 'building-megabloks', 'Mega Bloks', 2),
  ('Magnetic Tiles', 'building-magnetic', 'Магнитни плочки', 3),
  ('Wooden Blocks', 'building-wooden', 'Дървени блокчета', 4),
  ('Model Kits', 'building-models', 'Модели за сглобяване', 5),
  ('K''NEX', 'building-knex', 'K''NEX', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'toys-building'
ON CONFLICT (slug) DO NOTHING;

-- Outdoor Toys L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Swing Sets', 'outdoor-swings', 'Люлки', 1),
  ('Trampolines', 'outdoor-trampolines', 'Батути', 2),
  ('Playhouses', 'outdoor-playhouses', 'Къщички за игра', 3),
  ('Sandboxes', 'outdoor-sandboxes', 'Пясъчници', 4),
  ('Water Toys', 'outdoor-water-toys', 'Водни играчки', 5),
  ('Ride-On Toys', 'outdoor-rideon', 'Играчки за каране', 6),
  ('Sports Toys', 'outdoor-sports-toys', 'Спортни играчки', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'toys-outdoor'
ON CONFLICT (slug) DO NOTHING;

-- Educational Toys L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('STEM Toys', 'educational-stem', 'STEM играчки', 1),
  ('Learning Tablets', 'educational-tablets', 'Образователни таблети', 2),
  ('Science Kits', 'educational-science', 'Научни комплекти', 3),
  ('Math Games', 'educational-math', 'Математически игри', 4),
  ('Coding Toys', 'educational-coding', 'Играчки за програмиране', 5),
  ('Language Learning', 'educational-language', 'Езиково обучение', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'toys-educational'
ON CONFLICT (slug) DO NOTHING;

-- Board Games L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Strategy Games', 'games-strategy', 'Стратегически игри', 1),
  ('Party Games', 'games-party', 'Парти игри', 2),
  ('Family Games', 'games-family', 'Семейни игри', 3),
  ('Card Games', 'games-card', 'Карти игри', 4),
  ('Cooperative Games', 'games-cooperative', 'Кооперативни игри', 5),
  ('Trivia Games', 'games-trivia', 'Игри с въпроси', 6),
  ('Classic Games', 'games-classic', 'Класически игри', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'toys-games'
ON CONFLICT (slug) DO NOTHING;

-- Puzzles L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Jigsaw Puzzles', 'puzzles-jigsaw', 'Пъзели', 1),
  ('3D Puzzles', 'puzzles-3d', '3D пъзели', 2),
  ('Brain Teasers', 'puzzles-brain', 'Главоблъсканици', 3),
  ('Floor Puzzles', 'puzzles-floor', 'Подови пъзели', 4),
  ('Puzzle Mats', 'puzzles-mats', 'Пъзел постелки', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'toys-puzzles'
ON CONFLICT (slug) DO NOTHING;;
