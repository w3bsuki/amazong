-- Phase 4: Tools & Industrial - Remaining L2 categories without L3 children
-- Batch 1: Abrasives, Adhesives, Agriculture, Automotive Tools, Cleaning Equipment

DO $$
DECLARE
  -- Abrasives L2
  cutoff_id UUID := 'd1ab7435-d491-4056-8f54-f1aa77d376b8';
  flap_id UUID := '1447cdde-a4b0-4bf3-b0c8-30d363d20af7';
  grinding_id UUID := 'b7b540f1-c335-4c71-9cf8-e8e08608afc2';
  polishing_id UUID := 'ea621a00-c15a-41b5-a8c4-f3b79ff3e087';
  belts_id UUID := '321c650a-ac07-4626-8af3-38e96e42b2ae';
  discs_id UUID := '1eb3d2f6-0fbc-43d6-85c8-ed357c8b69c3';
  sandpaper_id UUID := '779e78dd-7188-4c6d-9585-301bab6dd15f';
  steel_wool_id UUID := 'a72c4177-1605-4085-ab54-e25839f2c6f6';
  wire_brushes_id UUID := 'f056f968-8244-48c4-a090-b2e73cb45bb5';
BEGIN
  -- Cut-Off Wheels L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Metal Cut-Off Wheels', 'cutoff-metal', cutoff_id, 'Дискове за рязане на метал', '⚙️', 1),
    ('Masonry Cut-Off Wheels', 'cutoff-masonry', cutoff_id, 'Дискове за рязане на бетон', '⚙️', 2),
    ('Stainless Steel Cut-Off Wheels', 'cutoff-stainless', cutoff_id, 'Дискове за неръждаема стомана', '⚙️', 3),
    ('Diamond Cut-Off Wheels', 'cutoff-diamond', cutoff_id, 'Диамантени дискове', '⚙️', 4),
    ('Multi-Purpose Cut-Off Wheels', 'cutoff-multi', cutoff_id, 'Многоцелеви дискове', '⚙️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Flap Discs L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Aluminum Oxide Flap Discs', 'flap-aluminum-oxide', flap_id, 'Флапдискове от алуминиев оксид', '⚙️', 1),
    ('Zirconia Flap Discs', 'flap-zirconia', flap_id, 'Циркониеви флапдискове', '⚙️', 2),
    ('Ceramic Flap Discs', 'flap-ceramic', flap_id, 'Керамични флапдискове', '⚙️', 3),
    ('Type 27 Flap Discs', 'flap-type-27', flap_id, 'Флапдискове тип 27', '⚙️', 4),
    ('Type 29 Flap Discs', 'flap-type-29', flap_id, 'Флапдискове тип 29', '⚙️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Grinding Wheels L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Bench Grinding Wheels', 'grinding-bench', grinding_id, 'Дискове за настолни шлайфове', '⚙️', 1),
    ('Surface Grinding Wheels', 'grinding-surface', grinding_id, 'Дискове за повърхностно шлайфане', '⚙️', 2),
    ('Depressed Center Wheels', 'grinding-depressed', grinding_id, 'Вдлъбнати дискове', '⚙️', 3),
    ('Cup Wheels', 'grinding-cup', grinding_id, 'Чашкови дискове', '⚙️', 4),
    ('Cylindrical Wheels', 'grinding-cylindrical', grinding_id, 'Цилиндрични дискове', '⚙️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Polishing Compounds L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Metal Polishing Compounds', 'polish-metal', polishing_id, 'Пасти за полиране на метал', '✨', 1),
    ('Plastic Polishing Compounds', 'polish-plastic', polishing_id, 'Пасти за полиране на пластмаса', '✨', 2),
    ('Wood Polishing Compounds', 'polish-wood', polishing_id, 'Пасти за полиране на дърво', '✨', 3),
    ('Buffing Compounds', 'polish-buffing', polishing_id, 'Полиращи пасти', '✨', 4),
    ('Rouge Compounds', 'polish-rouge', polishing_id, 'Руж пасти', '✨', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Sanding Belts L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('3x21 Sanding Belts', 'belts-3x21', belts_id, 'Шлайфащи ленти 3x21', '⚙️', 1),
    ('3x24 Sanding Belts', 'belts-3x24', belts_id, 'Шлайфащи ленти 3x24', '⚙️', 2),
    ('4x24 Sanding Belts', 'belts-4x24', belts_id, 'Шлайфащи ленти 4x24', '⚙️', 3),
    ('4x36 Sanding Belts', 'belts-4x36', belts_id, 'Шлайфащи ленти 4x36', '⚙️', 4),
    ('Cloth Sanding Belts', 'belts-cloth', belts_id, 'Тъканни шлайфащи ленти', '⚙️', 5),
    ('Film Sanding Belts', 'belts-film', belts_id, 'Филмови шлайфащи ленти', '⚙️', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Sanding Discs L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Hook & Loop Sanding Discs', 'discs-hook-loop', discs_id, 'Велкро шлайфащи дискове', '⚙️', 1),
    ('PSA Sanding Discs', 'discs-psa', discs_id, 'PSA шлайфащи дискове', '⚙️', 2),
    ('5-Inch Sanding Discs', 'discs-5-inch', discs_id, '5-инчови шлайфащи дискове', '⚙️', 3),
    ('6-Inch Sanding Discs', 'discs-6-inch', discs_id, '6-инчови шлайфащи дискове', '⚙️', 4),
    ('Fiber Discs', 'discs-fiber', discs_id, 'Фибро дискове', '⚙️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Sandpaper & Sheets L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Coarse Grit Sandpaper', 'sandpaper-coarse', sandpaper_id, 'Едрозърнеста шкурка', '📄', 1),
    ('Medium Grit Sandpaper', 'sandpaper-medium', sandpaper_id, 'Среднозърнеста шкурка', '📄', 2),
    ('Fine Grit Sandpaper', 'sandpaper-fine', sandpaper_id, 'Финозърнеста шкурка', '📄', 3),
    ('Wet/Dry Sandpaper', 'sandpaper-wet-dry', sandpaper_id, 'Шкурка за мокро/сухо шлайфане', '📄', 4),
    ('Sanding Sponges', 'sandpaper-sponges', sandpaper_id, 'Шлайфащи гъби', '📄', 5),
    ('Emery Cloth', 'sandpaper-emery', sandpaper_id, 'Шмиргел', '📄', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Steel Wool & Pads L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Coarse Steel Wool', 'steel-wool-coarse', steel_wool_id, 'Едра стоманена вълна', '🔧', 1),
    ('Medium Steel Wool', 'steel-wool-medium', steel_wool_id, 'Средна стоманена вълна', '🔧', 2),
    ('Fine Steel Wool', 'steel-wool-fine', steel_wool_id, 'Фина стоманена вълна', '🔧', 3),
    ('Bronze Wool', 'wool-bronze', steel_wool_id, 'Бронзова вълна', '🔧', 4),
    ('Stainless Steel Wool', 'wool-stainless', steel_wool_id, 'Неръждаема стоманена вълна', '🔧', 5),
    ('Scouring Pads', 'pads-scouring', steel_wool_id, 'Почистващи тампони', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Wire Brushes & Wheels L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Wire Cup Brushes', 'wire-cup-brushes', wire_brushes_id, 'Телени чашкови четки', '🔧', 1),
    ('Wire Wheel Brushes', 'wire-wheel-brushes', wire_brushes_id, 'Телени дискови четки', '🔧', 2),
    ('Hand Wire Brushes', 'wire-hand-brushes', wire_brushes_id, 'Ръчни телени четки', '🔧', 3),
    ('Brass Brushes', 'wire-brass-brushes', wire_brushes_id, 'Месингови четки', '🔧', 4),
    ('Stainless Steel Brushes', 'wire-stainless-brushes', wire_brushes_id, 'Четки от неръждаема стомана', '🔧', 5),
    ('End Brushes', 'wire-end-brushes', wire_brushes_id, 'Челни четки', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

END $$;;
