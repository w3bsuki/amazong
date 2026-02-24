
-- Phase 3.2.6: Sports L3 Categories - Golf Clubs, Yoga, Swimming

-- Golf Bags L3 (parent: golf-bags)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Stand Bags', 'Cart Bags', 'Tour Bags', 'Carry Bags', 'Travel Bags']),
  unnest(ARRAY['bag-stand', 'bag-cart', 'bag-tour', 'bag-carry', 'bag-travel']),
  (SELECT id FROM categories WHERE slug = 'golf-bags'),
  unnest(ARRAY['Стоящи', 'За количка', 'Турне чанти', 'Преносими', 'За пътуване']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Golf Clubs L3 (parent: golf-clubs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Drivers', 'Fairway Woods', 'Hybrids', 'Irons', 'Wedges', 'Putters', 'Complete Sets']),
  unnest(ARRAY['club-drivers', 'club-woods', 'club-hybrids', 'club-irons', 'club-wedges', 'club-putters', 'club-sets']),
  (SELECT id FROM categories WHERE slug = 'golf-clubs'),
  unnest(ARRAY['Драйвери', 'Дървета', 'Хибриди', 'Железа', 'Уеджове', 'Пътери', 'Комплекти']),
  '🏌️'
ON CONFLICT (slug) DO NOTHING;

-- Swimming Accessories L3 (parent: swimming-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Swim Goggles', 'Swim Caps', 'Nose Clips', 'Ear Plugs', 'Kickboards', 'Pull Buoys', 'Swim Fins', 'Swim Snorkels', 'Swim Bags', 'Towels']),
  unnest(ARRAY['swim-goggles', 'swim-caps', 'swim-nose', 'swim-ear', 'swim-kickboards', 'swim-pullbuoy', 'swim-fins', 'swim-snorkels', 'swim-bags', 'swim-towels']),
  (SELECT id FROM categories WHERE slug = 'swimming-accessories'),
  unnest(ARRAY['Очила', 'Шапки', 'Щипки за нос', 'Тапи за уши', 'Дъски', 'Pull Buoys', 'Перки', 'Шнорхели', 'Чанти', 'Кърпи']),
  '🏊'
ON CONFLICT (slug) DO NOTHING;

-- Swimwear L3 (parent: swimwear)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Competition Swimsuits', 'Training Swimsuits', 'Jammers', 'Briefs', 'Bikinis', 'Rash Guards', 'Cover Ups', 'Kids Swimwear']),
  unnest(ARRAY['swim-competition', 'swim-training', 'swim-jammers', 'swim-briefs', 'swim-bikinis', 'swim-rashguards', 'swim-coverups', 'swim-kids']),
  (SELECT id FROM categories WHERE slug = 'swimwear'),
  unnest(ARRAY['Състезателни', 'Тренировъчни', 'Джамери', 'Бански', 'Бикини', 'Рашгарди', 'Парео', 'Детски']),
  '👙'
ON CONFLICT (slug) DO NOTHING;

-- Yoga Accessories L3 (parent: yoga-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Yoga Straps', 'Yoga Blocks', 'Yoga Bolsters', 'Meditation Cushions', 'Yoga Wheels', 'Yoga Blankets', 'Eye Pillows', 'Singing Bowls']),
  unnest(ARRAY['yoga-straps', 'yoga-blocks', 'yoga-bolsters', 'yoga-cushions', 'yoga-wheels', 'yoga-blankets', 'yoga-eye', 'yoga-bowls']),
  (SELECT id FROM categories WHERE slug = 'yoga-accessories'),
  unnest(ARRAY['Ленти', 'Блокове', 'Болстери', 'Възглавници', 'Колела', 'Одеяла', 'Възглавнички за очи', 'Тибетски купи']),
  '🧘'
ON CONFLICT (slug) DO NOTHING;

-- Yoga Apparel L3 (parent: yoga-apparel)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Yoga Pants', 'Yoga Leggings', 'Yoga Tops', 'Yoga Bras', 'Yoga Shorts', 'Yoga Jackets', 'Men Yoga Wear']),
  unnest(ARRAY['yoga-pants', 'yoga-leggings', 'yoga-tops', 'yoga-bras', 'yoga-shorts', 'yoga-jackets', 'yoga-men']),
  (SELECT id FROM categories WHERE slug = 'yoga-apparel'),
  unnest(ARRAY['Панталони', 'Клинове', 'Блузи', 'Спортни сутиени', 'Къси панталони', 'Якета', 'Мъжки']),
  '👚'
ON CONFLICT (slug) DO NOTHING;

-- Yoga Mats L3 (parent: yoga-mats)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Travel Yoga Mats', 'Thick Yoga Mats', 'Natural Rubber Mats', 'Cork Mats', 'Hot Yoga Mats', 'Kids Yoga Mats', 'Mat Bags']),
  unnest(ARRAY['mat-travel', 'mat-thick', 'mat-rubber', 'mat-cork', 'mat-hot', 'mat-kids', 'mat-bags']),
  (SELECT id FROM categories WHERE slug = 'yoga-mats'),
  unnest(ARRAY['За пътуване', 'Дебели', 'Натурален каучук', 'Корк', 'За гореща йога', 'Детски', 'Чанти за постелки']),
  '🧘'
ON CONFLICT (slug) DO NOTHING;

-- Running Gear L3 (parent: running-gear)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Running Shoes', 'Running Shorts', 'Running Tights', 'Running Tops', 'Running Jackets', 'Running Vests', 'Running Socks', 'Hydration Vests', 'Running Belts', 'Headlamps']),
  unnest(ARRAY['run-shoes', 'run-shorts', 'run-tights', 'run-tops', 'run-jackets', 'run-vests', 'run-socks', 'run-hydration', 'run-belts', 'run-headlamps']),
  (SELECT id FROM categories WHERE slug = 'running-gear'),
  unnest(ARRAY['Маратонки', 'Къси панталони', 'Клинове', 'Блузи', 'Якета', 'Елеци', 'Чорапи', 'Хидратация', 'Колани', 'Челници']),
  '🏃'
ON CONFLICT (slug) DO NOTHING;

-- Athletic Shoes L3 (parent: athletic-shoes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Running Shoes', 'Training Shoes', 'Walking Shoes', 'Court Shoes', 'Cleats', 'Trail Running']),
  unnest(ARRAY['ath-running', 'ath-training', 'ath-walking', 'ath-court', 'ath-cleats', 'ath-trail']),
  (SELECT id FROM categories WHERE slug = 'athletic-shoes'),
  unnest(ARRAY['Бягане', 'Тренировка', 'Разходки', 'Корт', 'Бутонки', 'Терен']),
  '👟'
ON CONFLICT (slug) DO NOTHING;

-- Athletic Clothing L3 (parent: athletic-clothing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Performance Tops', 'Compression Wear', 'Sports Bras', 'Athletic Shorts', 'Athletic Pants', 'Base Layers', 'Athletic Jackets']),
  unnest(ARRAY['ath-tops', 'ath-compression', 'ath-bras', 'ath-shorts', 'ath-pants', 'ath-base', 'ath-jackets']),
  (SELECT id FROM categories WHERE slug = 'athletic-clothing'),
  unnest(ARRAY['Блузи', 'Компресия', 'Спортни сутиени', 'Къси панталони', 'Панталони', 'Бейс слоеве', 'Якета']),
  '🏋️'
ON CONFLICT (slug) DO NOTHING;

-- Gym Equipment L3 (parent: gym-equipment)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dumbbells', 'Barbells', 'Kettlebells', 'Weight Plates', 'Benches', 'Power Racks', 'Cable Machines', 'Smith Machines', 'Leg Machines', 'Ab Equipment']),
  unnest(ARRAY['gym-dumbbells', 'gym-barbells', 'gym-kettlebells', 'gym-plates', 'gym-benches', 'gym-racks', 'gym-cables', 'gym-smith', 'gym-legs', 'gym-abs']),
  (SELECT id FROM categories WHERE slug = 'gym-equipment'),
  unnest(ARRAY['Дъмбели', 'Щанги', 'Гири', 'Дискове', 'Пейки', 'Рамки', 'Кабелни', 'Смит машини', 'За крака', 'За корем']),
  '🏋️'
ON CONFLICT (slug) DO NOTHING;

-- Home Gym L3 (parent: home-gym)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Multi Gyms', 'Adjustable Dumbbells', 'Resistance Bands', 'Pull Up Bars', 'Suspension Trainers', 'Gym Flooring', 'Home Cardio']),
  unnest(ARRAY['home-multi', 'home-dumbbells', 'home-bands', 'home-pullup', 'home-suspension', 'home-flooring', 'home-cardio']),
  (SELECT id FROM categories WHERE slug = 'home-gym'),
  unnest(ARRAY['Мултифункционални', 'Регулируеми дъмбели', 'Ластици', 'Лоста', 'Суспендери', 'Настилка', 'Кардио']),
  '🏠'
ON CONFLICT (slug) DO NOTHING;

-- Treadmills L3 (parent: treadmills)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Folding Treadmills', 'Commercial Treadmills', 'Walking Treadmills', 'Under Desk Treadmills', 'Manual Treadmills']),
  unnest(ARRAY['tread-folding', 'tread-commercial', 'tread-walking', 'tread-desk', 'tread-manual']),
  (SELECT id FROM categories WHERE slug = 'treadmills'),
  unnest(ARRAY['Сгъваеми', 'Професионални', 'За ходене', 'Под бюро', 'Механични']),
  '🏃'
ON CONFLICT (slug) DO NOTHING;

-- Exercise Bikes L3 (parent: exercise-bikes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Spin Bikes', 'Upright Bikes', 'Recumbent Bikes', 'Air Bikes', 'Desk Bikes', 'Smart Bikes']),
  unnest(ARRAY['bike-spin', 'bike-upright', 'bike-recumbent', 'bike-air', 'bike-desk', 'bike-smart']),
  (SELECT id FROM categories WHERE slug = 'exercise-bikes'),
  unnest(ARRAY['Спининг', 'Вертикални', 'Легнали', 'Въздушни', 'Настолни', 'Смарт']),
  '🚴'
ON CONFLICT (slug) DO NOTHING;

-- Ellipticals L3 (parent: ellipticals)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Front Drive Ellipticals', 'Rear Drive Ellipticals', 'Center Drive Ellipticals', 'Compact Ellipticals']),
  unnest(ARRAY['ellip-front', 'ellip-rear', 'ellip-center', 'ellip-compact']),
  (SELECT id FROM categories WHERE slug = 'ellipticals'),
  unnest(ARRAY['Преден привод', 'Заден привод', 'Централен', 'Компактни']),
  '🏃'
ON CONFLICT (slug) DO NOTHING;

-- Rowing Machines L3 (parent: rowing-machines)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Water Rowers', 'Air Rowers', 'Magnetic Rowers', 'Hydraulic Rowers', 'Smart Rowers']),
  unnest(ARRAY['row-water', 'row-air', 'row-magnetic', 'row-hydraulic', 'row-smart']),
  (SELECT id FROM categories WHERE slug = 'rowing-machines'),
  unnest(ARRAY['Водни', 'Въздушни', 'Магнитни', 'Хидравлични', 'Смарт']),
  '🚣'
ON CONFLICT (slug) DO NOTHING;
;
