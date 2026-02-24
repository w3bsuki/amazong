
-- Phase 3.1.2: Automotive Brake & Suspension L3 Categories

-- Brake Parts L3 (parent: brake-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Brake Pads', 'Brake Rotors', 'Brake Calipers', 'Brake Lines', 'Brake Drums', 'Brake Shoes', 'Brake Hardware', 'ABS Sensors', 'Brake Boosters', 'Master Cylinders']),
  unnest(ARRAY['brake-pads', 'brake-rotors', 'brake-calipers', 'brake-lines', 'brake-drums', 'brake-shoes', 'brake-hardware', 'brake-abs-sensors', 'brake-boosters', 'brake-master-cylinders']),
  (SELECT id FROM categories WHERE slug = 'brake-parts'),
  unnest(ARRAY['Накладки', 'Спирачни дискове', 'Спирачни апарати', 'Спирачни маркучи', 'Спирачни барабани', 'Спирачни челюсти', 'Крепежни елементи', 'ABS сензори', 'Спирачни усилватели', 'Главни цилиндри']),
  '🛑'
ON CONFLICT (slug) DO NOTHING;

-- Brakes & Suspension L3 (parent: brakes-suspension)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Performance Brakes', 'Big Brake Kits', 'Slotted Rotors', 'Drilled Rotors', 'Ceramic Pads', 'Stainless Steel Lines', 'Coilovers', 'Lowering Springs', 'Lift Kits', 'Air Suspension']),
  unnest(ARRAY['brakes-performance', 'brakes-big-kits', 'brakes-slotted-rotors', 'brakes-drilled-rotors', 'brakes-ceramic-pads', 'brakes-ss-lines', 'suspension-coilovers', 'suspension-lowering', 'suspension-lift-kits', 'suspension-air']),
  (SELECT id FROM categories WHERE slug = 'brakes-suspension'),
  unnest(ARRAY['Спортни спирачки', 'Комплекти големи спирачки', 'Нарязани дискове', 'Пробити дискове', 'Керамични накладки', 'Стоманени маркучи', 'Койловъри', 'Понижаващи пружини', 'Повдигащи китове', 'Въздушно окачване']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- Suspension Parts L3 (parent: suspension-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Shock Absorbers', 'Struts', 'Coil Springs', 'Leaf Springs', 'Control Arms', 'Ball Joints', 'Tie Rod Ends', 'Sway Bars', 'Bushings', 'Wheel Hubs', 'Wheel Bearings', 'CV Axles', 'Drive Shafts']),
  unnest(ARRAY['susp-shocks', 'susp-struts', 'susp-coil-springs', 'susp-leaf-springs', 'susp-control-arms', 'susp-ball-joints', 'susp-tie-rods', 'susp-sway-bars', 'susp-bushings', 'susp-wheel-hubs', 'susp-wheel-bearings', 'susp-cv-axles', 'susp-drive-shafts']),
  (SELECT id FROM categories WHERE slug = 'suspension-parts'),
  unnest(ARRAY['Амортисьори', 'Макферсони', 'Спирални пружини', 'Ресори', 'Носачи', 'Шарнири', 'Накрайници кормилна', 'Стабилизатори', 'Тампони', 'Главини', 'Лагери', 'Полуоски', 'Карданни валове']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;
;
