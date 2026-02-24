
-- Batch 6: Sports & Outdoors deep L3 categories
DO $$
DECLARE
  v_sports_id UUID;
  v_outdoor_id UUID;
  v_fitness_id UUID;
  v_camping_id UUID;
  v_fishing_id UUID;
  v_cycling_id UUID;
  v_water_id UUID;
  v_winter_id UUID;
  v_team_id UUID;
  v_golf_id UUID;
  v_tennis_id UUID;
  v_running_id UUID;
  v_martial_id UUID;
  v_yoga_id UUID;
  v_trekking_id UUID;
  v_hunting_id UUID;
BEGIN
  SELECT id INTO v_sports_id FROM categories WHERE slug = 'sports-outdoors';
  SELECT id INTO v_outdoor_id FROM categories WHERE slug = 'outdoor-recreation';
  SELECT id INTO v_fitness_id FROM categories WHERE slug = 'fitness-equipment';
  SELECT id INTO v_camping_id FROM categories WHERE slug = 'camping-hiking';
  SELECT id INTO v_fishing_id FROM categories WHERE slug = 'fishing';
  SELECT id INTO v_cycling_id FROM categories WHERE slug = 'cycling';
  SELECT id INTO v_water_id FROM categories WHERE slug = 'water-sports';
  SELECT id INTO v_winter_id FROM categories WHERE slug = 'winter-sports';
  SELECT id INTO v_team_id FROM categories WHERE slug = 'team-sports';
  SELECT id INTO v_golf_id FROM categories WHERE slug = 'golf';
  SELECT id INTO v_tennis_id FROM categories WHERE slug = 'tennis';
  SELECT id INTO v_running_id FROM categories WHERE slug = 'running-athletics';
  SELECT id INTO v_martial_id FROM categories WHERE slug = 'martial-arts-boxing';
  SELECT id INTO v_yoga_id FROM categories WHERE slug = 'yoga-pilates';
  SELECT id INTO v_trekking_id FROM categories WHERE slug = 'trekking-mountaineering';
  SELECT id INTO v_hunting_id FROM categories WHERE slug = 'hunting';
  
  -- Camping deep categories
  IF v_camping_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Tents', 'Палатки', 'camping-tents', v_camping_id, 1),
    ('2-Person Tents', '2-местни палатки', 'camping-tents-2-person', v_camping_id, 2),
    ('4-Person Tents', '4-местни палатки', 'camping-tents-4-person', v_camping_id, 3),
    ('Family Tents', 'Семейни палатки', 'camping-tents-family', v_camping_id, 4),
    ('Sleeping Bags', 'Спални чували', 'sleeping-bags', v_camping_id, 5),
    ('Summer Sleeping Bags', 'Летни спални чували', 'sleeping-bags-summer', v_camping_id, 6),
    ('Winter Sleeping Bags', 'Зимни спални чували', 'sleeping-bags-winter', v_camping_id, 7),
    ('Camping Mattresses', 'Къмпинг матраци', 'camping-mattresses', v_camping_id, 8),
    ('Inflatable Mattresses', 'Надуваеми матраци', 'camping-mattresses-inflatable', v_camping_id, 9),
    ('Camping Chairs', 'Къмпинг столове', 'camping-chairs', v_camping_id, 10),
    ('Folding Chairs', 'Сгъваеми столове', 'camping-chairs-folding', v_camping_id, 11),
    ('Camping Tables', 'Къмпинг маси', 'camping-tables', v_camping_id, 12),
    ('Camping Cookware', 'Къмпинг съдове', 'camping-cookware', v_camping_id, 13),
    ('Portable Stoves', 'Преносими печки', 'camping-portable-stoves', v_camping_id, 14),
    ('Gas Stoves', 'Газови печки', 'camping-gas-stoves', v_camping_id, 15),
    ('Camping Lanterns', 'Къмпинг фенери', 'camping-lanterns', v_camping_id, 16),
    ('LED Lanterns', 'LED фенери', 'camping-led-lanterns', v_camping_id, 17),
    ('Coolers', 'Хладилни чанти', 'camping-coolers', v_camping_id, 18),
    ('Hard Coolers', 'Твърди хладилни чанти', 'camping-coolers-hard', v_camping_id, 19),
    ('Soft Coolers', 'Меки хладилни чанти', 'camping-coolers-soft', v_camping_id, 20),
    ('Backpacks', 'Раници', 'camping-backpacks', v_camping_id, 21),
    ('Hiking Backpacks', 'Туристически раници', 'camping-hiking-backpacks', v_camping_id, 22),
    ('Daypacks', 'Дневни раници', 'camping-daypacks', v_camping_id, 23),
    ('Hammocks', 'Хамаци', 'camping-hammocks', v_camping_id, 24),
    ('Camping Hammocks', 'Къмпинг хамаци', 'camping-hammocks-outdoor', v_camping_id, 25),
    ('Tarps', 'Тенти', 'camping-tarps', v_camping_id, 26),
    ('Multi-Tools', 'Мултифункционални инструменти', 'camping-multitools', v_camping_id, 27),
    ('Survival Kits', 'Комплекти за оцеляване', 'camping-survival-kits', v_camping_id, 28),
    ('First Aid Kits', 'Комплекти първа помощ', 'camping-first-aid', v_camping_id, 29),
    ('Water Filters', 'Филтри за вода', 'camping-water-filters', v_camping_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fishing deep categories
  IF v_fishing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Fishing Rods', 'Въдици', 'fishing-rods', v_fishing_id, 1),
    ('Spinning Rods', 'Спининг въдици', 'fishing-rods-spinning', v_fishing_id, 2),
    ('Casting Rods', 'Кастинг въдици', 'fishing-rods-casting', v_fishing_id, 3),
    ('Fly Rods', 'Мухарски въдици', 'fishing-rods-fly', v_fishing_id, 4),
    ('Surf Rods', 'Сърф въдици', 'fishing-rods-surf', v_fishing_id, 5),
    ('Ice Fishing Rods', 'Въдици за лед', 'fishing-rods-ice', v_fishing_id, 6),
    ('Fishing Reels', 'Макари', 'fishing-reels', v_fishing_id, 7),
    ('Spinning Reels', 'Спининг макари', 'fishing-reels-spinning', v_fishing_id, 8),
    ('Baitcasting Reels', 'Мултипликатори', 'fishing-reels-baitcasting', v_fishing_id, 9),
    ('Fly Reels', 'Мухарски макари', 'fishing-reels-fly', v_fishing_id, 10),
    ('Fishing Line', 'Влакно', 'fishing-line', v_fishing_id, 11),
    ('Monofilament', 'Монофилно влакно', 'fishing-line-mono', v_fishing_id, 12),
    ('Braided Line', 'Плетено влакно', 'fishing-line-braided', v_fishing_id, 13),
    ('Fluorocarbon', 'Флуорокарбон', 'fishing-line-fluoro', v_fishing_id, 14),
    ('Lures', 'Примамки', 'fishing-lures', v_fishing_id, 15),
    ('Soft Baits', 'Меки примамки', 'fishing-lures-soft', v_fishing_id, 16),
    ('Hard Baits', 'Твърди примамки', 'fishing-lures-hard', v_fishing_id, 17),
    ('Jigs', 'Джигове', 'fishing-lures-jigs', v_fishing_id, 18),
    ('Spoons', 'Лъжици', 'fishing-lures-spoons', v_fishing_id, 19),
    ('Spinners', 'Въртящи се примамки', 'fishing-lures-spinners', v_fishing_id, 20),
    ('Hooks', 'Куки', 'fishing-hooks', v_fishing_id, 21),
    ('Circle Hooks', 'Кръгли куки', 'fishing-hooks-circle', v_fishing_id, 22),
    ('Treble Hooks', 'Тройни куки', 'fishing-hooks-treble', v_fishing_id, 23),
    ('Sinkers & Weights', 'Тежести', 'fishing-sinkers', v_fishing_id, 24),
    ('Tackle Boxes', 'Кутии за принадлежности', 'fishing-tackle-boxes', v_fishing_id, 25),
    ('Fishing Nets', 'Риболовни мрежи', 'fishing-nets', v_fishing_id, 26),
    ('Landing Nets', 'Кепове', 'fishing-nets-landing', v_fishing_id, 27),
    ('Fish Finders', 'Сонари', 'fishing-fish-finders', v_fishing_id, 28),
    ('Fishing Clothing', 'Риболовно облекло', 'fishing-clothing', v_fishing_id, 29),
    ('Waders', 'Гащеризони', 'fishing-waders', v_fishing_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cycling deep categories
  IF v_cycling_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Road Bikes', 'Шосейни велосипеди', 'cycling-road-bikes', v_cycling_id, 1),
    ('Carbon Road Bikes', 'Карбонови шосейни', 'cycling-road-bikes-carbon', v_cycling_id, 2),
    ('Aluminum Road Bikes', 'Алуминиеви шосейни', 'cycling-road-bikes-aluminum', v_cycling_id, 3),
    ('Mountain Bikes', 'Планински велосипеди', 'cycling-mountain-bikes', v_cycling_id, 4),
    ('Hardtail MTB', 'Хардтейл MTB', 'cycling-mtb-hardtail', v_cycling_id, 5),
    ('Full Suspension MTB', 'Двуокачени MTB', 'cycling-mtb-full-suspension', v_cycling_id, 6),
    ('City Bikes', 'Градски велосипеди', 'cycling-city-bikes', v_cycling_id, 7),
    ('Electric Bikes', 'Електрически велосипеди', 'cycling-electric-bikes', v_cycling_id, 8),
    ('E-MTB', 'Електрически MTB', 'cycling-e-mtb', v_cycling_id, 9),
    ('E-City Bikes', 'Електрически градски', 'cycling-e-city', v_cycling_id, 10),
    ('BMX Bikes', 'BMX велосипеди', 'cycling-bmx', v_cycling_id, 11),
    ('Kids Bikes', 'Детски велосипеди', 'cycling-kids-bikes', v_cycling_id, 12),
    ('Bike Helmets', 'Каски за велосипед', 'cycling-helmets', v_cycling_id, 13),
    ('Road Helmets', 'Шосейни каски', 'cycling-helmets-road', v_cycling_id, 14),
    ('MTB Helmets', 'MTB каски', 'cycling-helmets-mtb', v_cycling_id, 15),
    ('Cycling Clothing', 'Колоездачно облекло', 'cycling-clothing', v_cycling_id, 16),
    ('Cycling Jerseys', 'Колоездачни фланелки', 'cycling-jerseys', v_cycling_id, 17),
    ('Cycling Shorts', 'Колоездачни шорти', 'cycling-shorts', v_cycling_id, 18),
    ('Cycling Gloves', 'Колоездачни ръкавици', 'cycling-gloves', v_cycling_id, 19),
    ('Bike Locks', 'Ключалки за велосипед', 'cycling-locks', v_cycling_id, 20),
    ('U-Locks', 'U-образни ключалки', 'cycling-locks-u', v_cycling_id, 21),
    ('Chain Locks', 'Верижни ключалки', 'cycling-locks-chain', v_cycling_id, 22),
    ('Bike Lights', 'Светлини за велосипед', 'cycling-lights', v_cycling_id, 23),
    ('Front Lights', 'Предни светлини', 'cycling-lights-front', v_cycling_id, 24),
    ('Rear Lights', 'Задни светлини', 'cycling-lights-rear', v_cycling_id, 25),
    ('Bike Pumps', 'Помпи за велосипед', 'cycling-pumps', v_cycling_id, 26),
    ('Floor Pumps', 'Стационарни помпи', 'cycling-pumps-floor', v_cycling_id, 27),
    ('Mini Pumps', 'Мини помпи', 'cycling-pumps-mini', v_cycling_id, 28),
    ('Bike Tools', 'Инструменти за велосипед', 'cycling-tools', v_cycling_id, 29),
    ('Bike Repair Kits', 'Комплекти за ремонт', 'cycling-repair-kits', v_cycling_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Water Sports deep categories
  IF v_water_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Swimming', 'Плуване', 'water-sports-swimming', v_water_id, 1),
    ('Goggles', 'Очила за плуване', 'water-sports-goggles', v_water_id, 2),
    ('Swim Caps', 'Шапки за плуване', 'water-sports-swim-caps', v_water_id, 3),
    ('Swimwear', 'Бански', 'water-sports-swimwear', v_water_id, 4),
    ('Training Fins', 'Тренировъчни плавници', 'water-sports-training-fins', v_water_id, 5),
    ('Surfing', 'Сърфинг', 'water-sports-surfing', v_water_id, 6),
    ('Surfboards', 'Сърф дъски', 'water-sports-surfboards', v_water_id, 7),
    ('Shortboards', 'Къси дъски', 'water-sports-shortboards', v_water_id, 8),
    ('Longboards', 'Дълги дъски', 'water-sports-longboards', v_water_id, 9),
    ('Wetsuits', 'Неопрени', 'water-sports-wetsuits', v_water_id, 10),
    ('Full Wetsuits', 'Цели неопрени', 'water-sports-wetsuits-full', v_water_id, 11),
    ('Shorty Wetsuits', 'Къси неопрени', 'water-sports-wetsuits-shorty', v_water_id, 12),
    ('Diving', 'Гмуркане', 'water-sports-diving', v_water_id, 13),
    ('Scuba Gear', 'Екипировка за гмуркане', 'water-sports-scuba-gear', v_water_id, 14),
    ('Dive Masks', 'Маски за гмуркане', 'water-sports-dive-masks', v_water_id, 15),
    ('Snorkels', 'Шнорхели', 'water-sports-snorkels', v_water_id, 16),
    ('Dive Fins', 'Плавници за гмуркане', 'water-sports-dive-fins', v_water_id, 17),
    ('Regulators', 'Регулатори', 'water-sports-regulators', v_water_id, 18),
    ('BCDs', 'Жилетки за гмуркане', 'water-sports-bcds', v_water_id, 19),
    ('Kayaking', 'Каякинг', 'water-sports-kayaking', v_water_id, 20),
    ('Kayaks', 'Каяци', 'water-sports-kayaks', v_water_id, 21),
    ('Inflatable Kayaks', 'Надуваеми каяци', 'water-sports-kayaks-inflatable', v_water_id, 22),
    ('Paddles', 'Гребла', 'water-sports-paddles', v_water_id, 23),
    ('Life Jackets', 'Спасителни жилетки', 'water-sports-life-jackets', v_water_id, 24),
    ('Paddleboarding', 'Падълбординг', 'water-sports-sup', v_water_id, 25),
    ('SUP Boards', 'SUP дъски', 'water-sports-sup-boards', v_water_id, 26),
    ('Inflatable SUP', 'Надуваеми SUP', 'water-sports-sup-inflatable', v_water_id, 27),
    ('Wakeboarding', 'Уейкбординг', 'water-sports-wakeboarding', v_water_id, 28),
    ('Wakeboards', 'Уейкборд дъски', 'water-sports-wakeboards', v_water_id, 29),
    ('Water Skiing', 'Водни ски', 'water-sports-water-skiing', v_water_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Winter Sports deep categories
  IF v_winter_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Skiing', 'Ски', 'winter-sports-skiing', v_winter_id, 1),
    ('Alpine Skis', 'Алпийски ски', 'winter-sports-alpine-skis', v_winter_id, 2),
    ('All-Mountain Skis', 'Универсални ски', 'winter-sports-all-mountain-skis', v_winter_id, 3),
    ('Freeride Skis', 'Фрийрайд ски', 'winter-sports-freeride-skis', v_winter_id, 4),
    ('Carving Skis', 'Карвинг ски', 'winter-sports-carving-skis', v_winter_id, 5),
    ('Ski Boots', 'Ски обувки', 'winter-sports-ski-boots', v_winter_id, 6),
    ('Ski Bindings', 'Ски автомати', 'winter-sports-ski-bindings', v_winter_id, 7),
    ('Ski Poles', 'Ски щеки', 'winter-sports-ski-poles', v_winter_id, 8),
    ('Snowboarding', 'Сноуборд', 'winter-sports-snowboarding', v_winter_id, 9),
    ('Snowboards', 'Сноуборд дъски', 'winter-sports-snowboards', v_winter_id, 10),
    ('All-Mountain Boards', 'Универсални дъски', 'winter-sports-snowboards-all-mountain', v_winter_id, 11),
    ('Freestyle Boards', 'Фристайл дъски', 'winter-sports-snowboards-freestyle', v_winter_id, 12),
    ('Snowboard Boots', 'Сноуборд обувки', 'winter-sports-snowboard-boots', v_winter_id, 13),
    ('Snowboard Bindings', 'Сноуборд автомати', 'winter-sports-snowboard-bindings', v_winter_id, 14),
    ('Cross-Country Skiing', 'Ски бягане', 'winter-sports-cross-country', v_winter_id, 15),
    ('XC Skis', 'Ски за бягане', 'winter-sports-xc-skis', v_winter_id, 16),
    ('XC Boots', 'Обувки за ски бягане', 'winter-sports-xc-boots', v_winter_id, 17),
    ('Ice Skating', 'Кънки', 'winter-sports-ice-skating', v_winter_id, 18),
    ('Figure Skates', 'Фигурни кънки', 'winter-sports-figure-skates', v_winter_id, 19),
    ('Hockey Skates', 'Хокейни кънки', 'winter-sports-hockey-skates', v_winter_id, 20),
    ('Snow Helmets', 'Каски за сняг', 'winter-sports-helmets', v_winter_id, 21),
    ('Ski Helmets', 'Ски каски', 'winter-sports-ski-helmets', v_winter_id, 22),
    ('Snowboard Helmets', 'Сноуборд каски', 'winter-sports-snowboard-helmets', v_winter_id, 23),
    ('Goggles', 'Очила за сняг', 'winter-sports-goggles', v_winter_id, 24),
    ('Ski Goggles', 'Ски очила', 'winter-sports-ski-goggles', v_winter_id, 25),
    ('Winter Clothing', 'Зимно облекло', 'winter-sports-clothing', v_winter_id, 26),
    ('Ski Jackets', 'Ски якета', 'winter-sports-ski-jackets', v_winter_id, 27),
    ('Ski Pants', 'Ски панталони', 'winter-sports-ski-pants', v_winter_id, 28),
    ('Snow Gloves', 'Зимни ръкавици', 'winter-sports-gloves', v_winter_id, 29),
    ('Sledding', 'Шейни', 'winter-sports-sledding', v_winter_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Team Sports deep categories
  IF v_team_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Football/Soccer', 'Футбол', 'team-sports-football', v_team_id, 1),
    ('Soccer Balls', 'Футболни топки', 'team-sports-soccer-balls', v_team_id, 2),
    ('Soccer Cleats', 'Футболни обувки', 'team-sports-soccer-cleats', v_team_id, 3),
    ('Soccer Goals', 'Футболни врати', 'team-sports-soccer-goals', v_team_id, 4),
    ('Shin Guards', 'Кори', 'team-sports-shin-guards', v_team_id, 5),
    ('Soccer Jerseys', 'Футболни фланелки', 'team-sports-soccer-jerseys', v_team_id, 6),
    ('Basketball', 'Баскетбол', 'team-sports-basketball', v_team_id, 7),
    ('Basketballs', 'Баскетболни топки', 'team-sports-basketballs', v_team_id, 8),
    ('Basketball Hoops', 'Баскетболни кошове', 'team-sports-basketball-hoops', v_team_id, 9),
    ('Basketball Shoes', 'Баскетболни обувки', 'team-sports-basketball-shoes', v_team_id, 10),
    ('Volleyball', 'Волейбол', 'team-sports-volleyball', v_team_id, 11),
    ('Volleyballs', 'Волейболни топки', 'team-sports-volleyballs', v_team_id, 12),
    ('Volleyball Nets', 'Волейболни мрежи', 'team-sports-volleyball-nets', v_team_id, 13),
    ('Handball', 'Хандбал', 'team-sports-handball', v_team_id, 14),
    ('Handballs', 'Хандбални топки', 'team-sports-handballs', v_team_id, 15),
    ('Rugby', 'Ръгби', 'team-sports-rugby', v_team_id, 16),
    ('Rugby Balls', 'Ръгби топки', 'team-sports-rugby-balls', v_team_id, 17),
    ('Hockey', 'Хокей', 'team-sports-hockey', v_team_id, 18),
    ('Hockey Sticks', 'Хокейни стикове', 'team-sports-hockey-sticks', v_team_id, 19),
    ('Hockey Pucks', 'Хокейни шайби', 'team-sports-hockey-pucks', v_team_id, 20),
    ('Hockey Protective Gear', 'Хокейни предпазни средства', 'team-sports-hockey-protective', v_team_id, 21),
    ('Baseball', 'Бейзбол', 'team-sports-baseball', v_team_id, 22),
    ('Baseball Bats', 'Бейзболни бухалки', 'team-sports-baseball-bats', v_team_id, 23),
    ('Baseball Gloves', 'Бейзболни ръкавици', 'team-sports-baseball-gloves', v_team_id, 24),
    ('Baseballs', 'Бейзболни топки', 'team-sports-baseballs', v_team_id, 25),
    ('Cricket', 'Крикет', 'team-sports-cricket', v_team_id, 26),
    ('Cricket Bats', 'Крикет бухалки', 'team-sports-cricket-bats', v_team_id, 27),
    ('American Football', 'Американски футбол', 'team-sports-american-football', v_team_id, 28),
    ('Footballs', 'Топки за американски футбол', 'team-sports-footballs', v_team_id, 29),
    ('Training Equipment', 'Тренировъчно оборудване', 'team-sports-training', v_team_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fitness Equipment deep categories
  IF v_fitness_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Cardio Machines', 'Кардио машини', 'fitness-cardio-machines', v_fitness_id, 1),
    ('Treadmills', 'Бягащи пътеки', 'fitness-treadmills', v_fitness_id, 2),
    ('Folding Treadmills', 'Сгъваеми пътеки', 'fitness-treadmills-folding', v_fitness_id, 3),
    ('Exercise Bikes', 'Велоергометри', 'fitness-exercise-bikes', v_fitness_id, 4),
    ('Spin Bikes', 'Спин байкове', 'fitness-spin-bikes', v_fitness_id, 5),
    ('Recumbent Bikes', 'Лежащи велоергометри', 'fitness-recumbent-bikes', v_fitness_id, 6),
    ('Ellipticals', 'Кростренажори', 'fitness-ellipticals', v_fitness_id, 7),
    ('Rowing Machines', 'Гребни тренажори', 'fitness-rowing-machines', v_fitness_id, 8),
    ('Stair Climbers', 'Стълбищни тренажори', 'fitness-stair-climbers', v_fitness_id, 9),
    ('Strength Training', 'Силови тренировки', 'fitness-strength-training', v_fitness_id, 10),
    ('Dumbbells', 'Дъмбели', 'fitness-dumbbells', v_fitness_id, 11),
    ('Adjustable Dumbbells', 'Регулируеми дъмбели', 'fitness-dumbbells-adjustable', v_fitness_id, 12),
    ('Barbells', 'Щанги', 'fitness-barbells', v_fitness_id, 13),
    ('Olympic Barbells', 'Олимпийски щанги', 'fitness-barbells-olympic', v_fitness_id, 14),
    ('Weight Plates', 'Дискове за тежести', 'fitness-weight-plates', v_fitness_id, 15),
    ('Kettlebells', 'Гири', 'fitness-kettlebells', v_fitness_id, 16),
    ('Weight Benches', 'Лежанки за тежести', 'fitness-weight-benches', v_fitness_id, 17),
    ('Adjustable Benches', 'Регулируеми лежанки', 'fitness-benches-adjustable', v_fitness_id, 18),
    ('Power Racks', 'Силови клетки', 'fitness-power-racks', v_fitness_id, 19),
    ('Pull-Up Bars', 'Лостове за набиране', 'fitness-pull-up-bars', v_fitness_id, 20),
    ('Resistance Bands', 'Ластици за упражнения', 'fitness-resistance-bands', v_fitness_id, 21),
    ('Yoga Mats', 'Йога постелки', 'fitness-yoga-mats', v_fitness_id, 22),
    ('Foam Rollers', 'Фоам ролери', 'fitness-foam-rollers', v_fitness_id, 23),
    ('Ab Wheels', 'Колела за коремни', 'fitness-ab-wheels', v_fitness_id, 24),
    ('Jump Ropes', 'Въжета за скачане', 'fitness-jump-ropes', v_fitness_id, 25),
    ('Medicine Balls', 'Медицински топки', 'fitness-medicine-balls', v_fitness_id, 26),
    ('Battle Ropes', 'Бойни въжета', 'fitness-battle-ropes', v_fitness_id, 27),
    ('Suspension Trainers', 'TRX системи', 'fitness-suspension-trainers', v_fitness_id, 28),
    ('Fitness Trackers', 'Фитнес тракери', 'fitness-trackers', v_fitness_id, 29),
    ('Gym Accessories', 'Фитнес аксесоари', 'fitness-gym-accessories', v_fitness_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
