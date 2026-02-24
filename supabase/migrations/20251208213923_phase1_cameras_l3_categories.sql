
-- Phase 1.6: Add L3 Camera Categories

-- Add Cinema Camera Types under Cinema Cameras L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Blackmagic Cinema Cameras', 'RED Cameras', 'Canon Cinema EOS', 'Sony Cinema Line', 'Panasonic Cinema', 'ARRI Cameras', 'Z CAM', 'Cinema Camera Accessories']),
  unnest(ARRAY['blackmagic-cinema-cameras', 'red-cameras', 'canon-cinema-eos', 'sony-cinema-line', 'panasonic-cinema', 'arri-cameras', 'z-cam', 'cinema-camera-accessories']),
  (SELECT id FROM categories WHERE slug = 'cinema-cameras'),
  unnest(ARRAY['Blackmagic Кино Камери', 'RED Камери', 'Canon Cinema EOS', 'Sony Cinema Line', 'Panasonic Cinema', 'ARRI Камери', 'Z CAM', 'Аксесоари за Кино Камери']),
  '🎬'
ON CONFLICT (slug) DO NOTHING;

-- Add Compact Camera Types under Compact Cameras L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Sony RX100 Series', 'Canon PowerShot', 'Ricoh GR Series', 'Fujifilm X100', 'Leica Compact', 'Panasonic Lumix', 'Premium Compacts', 'Travel Compacts', 'Vlogging Compacts', 'Waterproof Compacts']),
  unnest(ARRAY['sony-rx100-series', 'canon-powershot', 'ricoh-gr-series', 'fujifilm-x100', 'leica-compact', 'panasonic-lumix-compact', 'premium-compacts', 'travel-compacts', 'vlogging-compacts', 'waterproof-compacts']),
  (SELECT id FROM categories WHERE slug = 'compact-cameras'),
  unnest(ARRAY['Sony RX100 Серия', 'Canon PowerShot', 'Ricoh GR Серия', 'Fujifilm X100', 'Leica Компактни', 'Panasonic Lumix', 'Премиум Компактни', 'Пътуващи Компактни', 'Влогинг Компактни', 'Водоустойчиви Компактни']),
  '📷'
ON CONFLICT (slug) DO NOTHING;

-- Add Film Camera Types under Film Cameras L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['35mm Film Cameras', 'Medium Format Film', 'Large Format Film', 'Point and Shoot Film', 'SLR Film Cameras', 'Rangefinder Film', 'Leica Film Cameras', 'Vintage Film Cameras']),
  unnest(ARRAY['35mm-film-cameras', 'medium-format-film', 'large-format-film', 'point-and-shoot-film', 'slr-film-cameras', 'rangefinder-film', 'leica-film-cameras', 'vintage-film-cameras']),
  (SELECT id FROM categories WHERE slug = 'cameras-film'),
  unnest(ARRAY['35mm Филмови Камери', 'Средноформатни Филмови', 'Голямоформатни Филмови', 'Point and Shoot Филмови', 'SLR Филмови Камери', 'Rangefinder Филмови', 'Leica Филмови Камери', 'Винтидж Филмови Камери']),
  '📸'
ON CONFLICT (slug) DO NOTHING;

-- Add Instant Camera Brands under Instant Cameras L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fujifilm Instax Mini', 'Fujifilm Instax Wide', 'Fujifilm Instax Square', 'Polaroid Now', 'Polaroid Go', 'Kodak Printomatic', 'Instant Camera Film', 'Instant Camera Accessories']),
  unnest(ARRAY['fujifilm-instax-mini', 'fujifilm-instax-wide', 'fujifilm-instax-square', 'polaroid-now', 'polaroid-go', 'kodak-printomatic', 'instant-camera-film', 'instant-camera-accessories']),
  (SELECT id FROM categories WHERE slug = 'instant-cameras'),
  unnest(ARRAY['Fujifilm Instax Mini', 'Fujifilm Instax Wide', 'Fujifilm Instax Square', 'Polaroid Now', 'Polaroid Go', 'Kodak Printomatic', 'Филм за Моментни Снимки', 'Аксесоари за Моментни Камери']),
  '📸'
ON CONFLICT (slug) DO NOTHING;

-- Add Camcorder Types under Camcorders L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['4K Camcorders', 'Full HD Camcorders', 'Professional Camcorders', 'Broadcast Camcorders', 'Handheld Camcorders', 'Sony Handycam', 'Canon VIXIA', 'Panasonic Camcorders', 'Body Cams', 'Dash Cams']),
  unnest(ARRAY['4k-camcorders', 'full-hd-camcorders', 'professional-camcorders', 'broadcast-camcorders', 'handheld-camcorders', 'sony-handycam', 'canon-vixia', 'panasonic-camcorders', 'body-cams', 'dash-cams']),
  (SELECT id FROM categories WHERE slug = 'cameras-camcorders'),
  unnest(ARRAY['4K Видеокамери', 'Full HD Видеокамери', 'Професионални Видеокамери', 'Broadcast Видеокамери', 'Ръчни Видеокамери', 'Sony Handycam', 'Canon VIXIA', 'Panasonic Видеокамери', 'Боди Камери', 'Даш Камери']),
  '🎥'
ON CONFLICT (slug) DO NOTHING;

-- Add Lighting Equipment Types under Lighting Equipment L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['LED Panels', 'Ring Lights', 'Softboxes', 'Studio Strobes', 'Speedlights', 'Continuous Lighting', 'Light Stands', 'Reflectors & Diffusers', 'Godox Lighting', 'Aputure Lighting', 'Nanlite Lighting', 'Portable Lights']),
  unnest(ARRAY['led-panels-photo', 'ring-lights-photo', 'softboxes', 'studio-strobes', 'speedlights', 'continuous-lighting', 'light-stands-photo', 'reflectors-diffusers', 'godox-lighting', 'aputure-lighting', 'nanlite-lighting', 'portable-lights-photo']),
  (SELECT id FROM categories WHERE slug = 'lighting-equipment'),
  unnest(ARRAY['LED Панели', 'Ринг Светлини', 'Софтбоксове', 'Студийни Светкавици', 'Спийдлайтове', 'Постоянно Осветление', 'Стойки за Светлина', 'Рефлектори и Дифузьори', 'Godox Осветление', 'Aputure Осветление', 'Nanlite Осветление', 'Преносими Светлини']),
  '💡'
ON CONFLICT (slug) DO NOTHING;

-- Add Tripod Types under Tripods & Monopods L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Travel Tripods', 'Professional Tripods', 'Video Tripods', 'Carbon Fiber Tripods', 'Aluminum Tripods', 'Monopods', 'Tripod Heads', 'Ball Heads', 'Fluid Heads', 'Gimbal Heads', 'Mini Tripods', 'Table Tripods', 'Manfrotto Tripods', 'Gitzo Tripods', 'Benro Tripods']),
  unnest(ARRAY['travel-tripods', 'professional-tripods', 'video-tripods', 'carbon-fiber-tripods', 'aluminum-tripods', 'monopods', 'tripod-heads', 'ball-heads', 'fluid-heads', 'gimbal-heads', 'mini-tripods', 'table-tripods', 'manfrotto-tripods', 'gitzo-tripods', 'benro-tripods']),
  (SELECT id FROM categories WHERE slug = 'tripods-monopods'),
  unnest(ARRAY['Пътуващи Триподи', 'Професионални Триподи', 'Видео Триподи', 'Карбонови Триподи', 'Алуминиеви Триподи', 'Монопод', 'Глави за Триподи', 'Ball Глави', 'Fluid Глави', 'Gimbal Глави', 'Мини Триподи', 'Настолни Триподи', 'Manfrotto Триподи', 'Gitzo Триподи', 'Benro Триподи']),
  '📹'
ON CONFLICT (slug) DO NOTHING;
;
