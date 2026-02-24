
-- Fix movies-music L0 hierarchy: consolidate 22 L1s to ~15
DO $$
DECLARE
  v_movies_music_id UUID;
  v_movies_dvd UUID;
  v_movies_bluray UUID;
  v_movies_4k UUID;
  v_music_cds UUID;
  v_cassettes UUID;
  v_mm_instruments UUID;
BEGIN
  SELECT id INTO v_movies_music_id FROM categories WHERE slug = 'movies-music';
  SELECT id INTO v_movies_dvd FROM categories WHERE slug = 'movies-dvd';
  SELECT id INTO v_movies_bluray FROM categories WHERE slug = 'movies-bluray';
  SELECT id INTO v_movies_4k FROM categories WHERE slug = 'movies-4k-uhd';
  SELECT id INTO v_music_cds FROM categories WHERE slug = 'music-cds';
  SELECT id INTO v_cassettes FROM categories WHERE slug = 'cassettes';
  SELECT id INTO v_mm_instruments FROM categories WHERE slug = 'mm-instruments';
  
  -- 1. Move DVD duplicates under movies-dvd
  UPDATE categories SET parent_id = v_movies_dvd
  WHERE slug IN ('dvds', 'dvds-bluray') AND parent_id = v_movies_music_id;
  
  -- 2. Move Blu-ray duplicate under movies-bluray
  UPDATE categories SET parent_id = v_movies_bluray
  WHERE slug = 'blu-rays' AND parent_id = v_movies_music_id;
  
  -- 3. Move 4K duplicate under movies-4k-uhd
  UPDATE categories SET parent_id = v_movies_4k
  WHERE slug = '4k-movies' AND parent_id = v_movies_music_id;
  
  -- 4. Move cds duplicate under music-cds
  UPDATE categories SET parent_id = v_music_cds
  WHERE slug = 'cds' AND parent_id = v_movies_music_id;
  
  -- 5. Move music-cassettes children under cassettes and delete
  UPDATE categories SET parent_id = v_cassettes
  WHERE parent_id = (SELECT id FROM categories WHERE slug = 'music-cassettes');
  DELETE FROM categories WHERE slug = 'music-cassettes' AND parent_id = v_movies_music_id;
  
  -- 6. Move sheet-music under mm-instruments
  UPDATE categories SET parent_id = v_mm_instruments
  WHERE slug = 'sheet-music' AND parent_id = v_movies_music_id;
  
  RAISE NOTICE 'Movies-music L0 hierarchy fixed';
END $$;
;
