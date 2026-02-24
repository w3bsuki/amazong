-- Phase 4: Hobbies - L3 Categories Batch 2 (Model Building, Outdoor, Creative Arts, Handmade)

DO $$
DECLARE
  -- Model Building L2 IDs
  diecast_id UUID := 'f339723e-cd4c-4612-9223-669cb06c19c0';
  aircraft_id UUID := 'ab50b61a-140c-41e0-b9d8-fc30bc154534';
  ships_id UUID := '40276bc7-6790-40fe-bb84-485719c5fe58';
  tools_id UUID := 'ed8695ba-c285-49e0-8f63-030a702d8799';
  trains_id UUID := 'b7a8f3b6-8ad7-4e6f-8ce4-e30ff7e81617';
  plastic_id UUID := '293c4e4e-e377-4b17-b239-7973c7f0fb74';
  rc_drones_id UUID := '0747c66a-1bfd-4f2b-931a-8175c0493ebd';
  rc_boats_id UUID := '39b96d60-ebb9-4fda-b104-51a812c6b9f2';
  rc_cars_id UUID := '7313add2-4f29-4374-802c-1f977c998737';
  rc_drones2_id UUID := 'e5500c1c-c1ab-4fc0-9218-af83b126511c';
  rc_heli_id UUID := '0ca74a8b-ae3c-4965-bd69-4e62ac24873d';
  rc_planes_id UUID := 'ca9a7b78-49b8-49f9-8fbf-76fec6727e6b';
  -- Outdoor Hobbies L2 IDs
  astronomy_id UUID := 'f1ee23f0-6f09-4cc6-a2e0-9fb6c0eebd88';
  birdwatching_id UUID := 'f326c6ca-c936-4e87-a9ba-57d47e5bdfd4';
  fishing_id UUID := '55eec819-8e0d-491d-a568-8c6e6de6d0f5';
  gardening_id UUID := '4d832a15-19f2-4c70-870c-1c7d0bf46542';
  hunting_id UUID := '1b170fce-ba82-42e3-a13d-771ace57dafc';
  -- Scale Models L2 ID
  scale_diecast_id UUID := '85ee582f-d8b6-4865-98cf-b1a082327645';
BEGIN
  -- Diecast Models L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('1:18 Scale Diecast', 'diecast-1-18', diecast_id, 'Мащаб 1:18', '🚗', 1),
    ('1:24 Scale Diecast', 'diecast-1-24', diecast_id, 'Мащаб 1:24', '🚗', 2),
    ('1:43 Scale Diecast', 'diecast-1-43', diecast_id, 'Мащаб 1:43', '🚗', 3),
    ('1:64 Scale Diecast', 'diecast-1-64', diecast_id, 'Мащаб 1:64', '🚗', 4),
    ('Hot Wheels', 'diecast-hotwheels', diecast_id, 'Hot Wheels', '🚗', 5),
    ('Matchbox', 'diecast-matchbox', diecast_id, 'Matchbox', '🚗', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Model Aircraft L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Military Aircraft Models', 'aircraft-military', aircraft_id, 'Военни самолети', '✈️', 1),
    ('Commercial Aircraft Models', 'aircraft-commercial', aircraft_id, 'Граждански самолети', '✈️', 2),
    ('Helicopter Models', 'aircraft-helicopters', aircraft_id, 'Хеликоптери', '🚁', 3),
    ('WWI & WWII Aircraft', 'aircraft-ww', aircraft_id, 'Самолети от световните войни', '✈️', 4),
    ('Aircraft Model Kits', 'aircraft-kits', aircraft_id, 'Комплекти самолети', '✈️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Model Ships L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Sailing Ships', 'ships-sailing', ships_id, 'Ветроходи', '⛵', 1),
    ('Warships', 'ships-warships', ships_id, 'Военни кораби', '🚢', 2),
    ('Cruise Ships', 'ships-cruise', ships_id, 'Круизни кораби', '🛳️', 3),
    ('Historical Ships', 'ships-historical', ships_id, 'Исторически кораби', '⛵', 4),
    ('Ship Model Kits', 'ships-kits', ships_id, 'Комплекти кораби', '🚢', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Model Tools & Paints L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Model Paints', 'model-paints', tools_id, 'Бои за модели', '🎨', 1),
    ('Airbrushes', 'model-airbrushes', tools_id, 'Аерографи', '🖌️', 2),
    ('Model Glue & Cement', 'model-glue', tools_id, 'Лепило за модели', '🔧', 3),
    ('Model Cutting Tools', 'model-cutting', tools_id, 'Режещи инструменти', '✂️', 4),
    ('Weathering Supplies', 'model-weathering', tools_id, 'Материали за състаряване', '🌧️', 5),
    ('Decals & Transfers', 'model-decals', tools_id, 'Декали и трансфери', '🏷️', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Model Trains L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('HO Scale Trains', 'trains-ho', trains_id, 'HO мащаб', '🚂', 1),
    ('N Scale Trains', 'trains-n', trains_id, 'N мащаб', '🚂', 2),
    ('O Scale Trains', 'trains-o', trains_id, 'O мащаб', '🚂', 3),
    ('Train Sets', 'trains-sets', trains_id, 'Комплекти влакове', '🚂', 4),
    ('Train Track & Scenery', 'trains-scenery', trains_id, 'Релси и декори', '🏔️', 5),
    ('Train Locomotives', 'trains-locomotives', trains_id, 'Локомотиви', '🚂', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Plastic Model Kits L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Car Model Kits', 'plastic-cars', plastic_id, 'Комплекти коли', '🚗', 1),
    ('Tank Model Kits', 'plastic-tanks', plastic_id, 'Комплекти танкове', '🛡️', 2),
    ('Gundam Model Kits', 'plastic-gundam', plastic_id, 'Gundam комплекти', '🤖', 3),
    ('Figure Model Kits', 'plastic-figures', plastic_id, 'Комплекти фигури', '🎭', 4),
    ('Sci-Fi Model Kits', 'plastic-scifi', plastic_id, 'Sci-Fi комплекти', '🚀', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- RC Cars L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('RC Crawlers', 'rc-crawlers', rc_cars_id, 'RC краулери', '🚙', 1),
    ('RC Monster Trucks', 'rc-monster-trucks', rc_cars_id, 'RC монстър тракове', '🚚', 2),
    ('RC Drift Cars', 'rc-drift', rc_cars_id, 'RC дрифт коли', '🏎️', 3),
    ('RC Buggies', 'rc-buggies', rc_cars_id, 'RC бъгита', '🏎️', 4),
    ('RC Trucks', 'rc-trucks', rc_cars_id, 'RC камиони', '🚛', 5),
    ('RC Car Parts', 'rc-car-parts', rc_cars_id, 'Части за RC коли', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- RC Drones L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Camera Drones', 'drones-camera', rc_drones2_id, 'Дронове с камера', '📷', 1),
    ('Racing Drones', 'drones-racing', rc_drones2_id, 'Състезателни дронове', '🏁', 2),
    ('Mini Drones', 'drones-mini', rc_drones2_id, 'Мини дронове', '🚁', 3),
    ('FPV Drones', 'drones-fpv', rc_drones2_id, 'FPV дронове', '🎮', 4),
    ('Drone Parts', 'drones-parts', rc_drones2_id, 'Части за дронове', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- RC Planes L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Trainer Planes', 'rc-planes-trainer', rc_planes_id, 'Тренировъчни самолети', '✈️', 1),
    ('Sport Planes', 'rc-planes-sport', rc_planes_id, 'Спортни самолети', '✈️', 2),
    ('Warbird Planes', 'rc-planes-warbird', rc_planes_id, 'Военни самолети', '✈️', 3),
    ('Gliders', 'rc-planes-gliders', rc_planes_id, 'Планери', '✈️', 4),
    ('RC Plane Parts', 'rc-planes-parts', rc_planes_id, 'Части за самолети', '🔧', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Astronomy L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Telescopes', 'astronomy-telescopes', astronomy_id, 'Телескопи', '🔭', 1),
    ('Binoculars for Stargazing', 'astronomy-binoculars', astronomy_id, 'Бинокли за астрономия', '🔭', 2),
    ('Telescope Mounts', 'astronomy-mounts', astronomy_id, 'Монтажи за телескопи', '🔭', 3),
    ('Astrophotography', 'astronomy-astro', astronomy_id, 'Астрофотография', '📷', 4),
    ('Star Charts & Maps', 'astronomy-charts', astronomy_id, 'Звездни карти', '🗺️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Birdwatching L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Birding Binoculars', 'bird-binoculars', birdwatching_id, 'Бинокли за птици', '🦅', 1),
    ('Spotting Scopes', 'bird-spotting', birdwatching_id, 'Зрителни тръби', '🔭', 2),
    ('Bird Feeders', 'bird-feeders', birdwatching_id, 'Хранилки за птици', '🐦', 3),
    ('Bird Houses', 'bird-houses', birdwatching_id, 'Къщички за птици', '🏠', 4),
    ('Field Guides', 'bird-guides', birdwatching_id, 'Полеви наръчници', '📚', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Fishing (Hobby) L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Fishing Rods', 'fishing-rods', fishing_id, 'Въдици', '🎣', 1),
    ('Fishing Reels', 'fishing-reels', fishing_id, 'Макари', '🎣', 2),
    ('Fishing Lures', 'fishing-lures', fishing_id, 'Примамки', '🎣', 3),
    ('Fishing Tackle', 'fishing-tackle', fishing_id, 'Риболовен инвентар', '🎣', 4),
    ('Fly Fishing', 'fishing-fly', fishing_id, 'Риболов с муха', '🎣', 5),
    ('Ice Fishing', 'fishing-ice', fishing_id, 'Зимен риболов', '❄️', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Hobby Gardening L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Seeds & Bulbs', 'garden-seeds', gardening_id, 'Семена и луковици', '🌱', 1),
    ('Garden Tools', 'garden-tools', gardening_id, 'Градински инструменти', '🧹', 2),
    ('Planters & Pots', 'garden-planters', gardening_id, 'Саксии и кашпи', '🪴', 3),
    ('Hydroponics', 'garden-hydroponics', gardening_id, 'Хидропоника', '💧', 4),
    ('Indoor Gardening', 'garden-indoor', gardening_id, 'Вътрешно градинарство', '🏠', 5),
    ('Composting', 'garden-compost', gardening_id, 'Компостиране', '♻️', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Hunting L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Hunting Optics', 'hunting-optics', hunting_id, 'Ловна оптика', '🔭', 1),
    ('Hunting Clothing', 'hunting-clothing', hunting_id, 'Ловно облекло', '🧥', 2),
    ('Hunting Accessories', 'hunting-accessories', hunting_id, 'Ловни аксесоари', '🎯', 3),
    ('Decoys', 'hunting-decoys', hunting_id, 'Примамки', '🦆', 4),
    ('Hunting Calls', 'hunting-calls', hunting_id, 'Свирки', '📯', 5),
    ('Trail Cameras', 'hunting-cameras', hunting_id, 'Камери за следене', '📷', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Scale Diecast & Vehicles L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Vintage Diecast', 'scale-vintage', scale_diecast_id, 'Винтидж модели', '🚗', 1),
    ('Sports Car Diecast', 'scale-sports', scale_diecast_id, 'Спортни коли', '🏎️', 2),
    ('Truck Diecast', 'scale-trucks', scale_diecast_id, 'Камиони', '🚛', 3),
    ('Military Vehicle Diecast', 'scale-military', scale_diecast_id, 'Военни превозни средства', '🪖', 4),
    ('Motorcycle Diecast', 'scale-motorcycles', scale_diecast_id, 'Мотоциклети', '🏍️', 5)
  ON CONFLICT (slug) DO NOTHING;

END $$;;
