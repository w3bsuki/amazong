-- PETS PHASE 2: Add L2 categories for Reptiles
-- Reptiles ID: 55b80260-6ec0-4a78-b8d6-c5afcbc5701a

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  ('Reptile Food', 'Храна за влечуги', 'reptile-food', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '🦗', 1, 'Insects, frozen feeders, and reptile diets', 'Насекоми, замразени храни и диети за влечуги'),
  ('Reptile Terrariums', 'Терариуми за влечуги', 'reptile-terrariums', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '🏠', 2, 'Glass terrariums, vivariums, and enclosures', 'Стъклени терариуми, вивариуми и заграждения'),
  ('Reptile Lighting', 'Осветление за влечуги', 'reptile-lighting', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '☀️', 3, 'UVB bulbs, basking lights, and fixtures', 'UVB крушки, лампи за грейка и осветителни тела'),
  ('Reptile Heating', 'Отопление за влечуги', 'reptile-heating', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '🌡️', 4, 'Heat mats, ceramic heaters, and thermostats', 'Отоплителни подложки, керамични нагреватели и термостати'),
  ('Reptile Substrate', 'Субстрат за влечуги', 'reptile-substrate', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '🪨', 5, 'Bedding, substrate, and liners', 'Постеля, субстрат и подложки'),
  ('Reptile Decorations', 'Декорации за влечуги', 'reptile-decor', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '🌿', 6, 'Hides, plants, branches, and backgrounds', 'Скривалища, растения, клони и фонове'),
  ('Reptile Health', 'Здраве на влечуги', 'reptile-health', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '💊', 7, 'Vitamins, calcium, and supplements', 'Витамини, калций и добавки'),
  ('Reptile Bowls & Dishes', 'Купи и съдове', 'reptile-bowls', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '🥣', 8, 'Water bowls, food dishes, and misters', 'Купи за вода, съдове за храна и пулверизатори'),
  ('Reptile Humidity', 'Влажност за влечуги', 'reptile-humidity', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '💧', 9, 'Foggers, misters, and hygrometers', 'Генератори за мъгла, пулверизатори и хигрометри'),
  ('Turtle & Tortoise Supplies', 'Продукти за костенурки', 'turtle-supplies', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', '🐢', 10, 'Turtle tanks, docks, and specialty items', 'Аквариуми за костенурки, платформи и специализирани продукти')
ON CONFLICT (slug) DO NOTHING;;
