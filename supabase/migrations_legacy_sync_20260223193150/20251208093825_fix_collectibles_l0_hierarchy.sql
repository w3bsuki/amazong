
-- Fix collectibles L0 hierarchy: consolidate 32 L1s to ~14
DO $$
DECLARE
  v_collectibles_id UUID;
  v_coins_currency UUID;
  v_coll_comics UUID;
  v_stamps UUID;
  v_coll_toys UUID;
BEGIN
  SELECT id INTO v_collectibles_id FROM categories WHERE slug = 'collectibles';
  SELECT id INTO v_coins_currency FROM categories WHERE slug = 'coins-currency';
  SELECT id INTO v_coll_comics FROM categories WHERE slug = 'coll-comics';
  SELECT id INTO v_stamps FROM categories WHERE slug = 'stamps';
  SELECT id INTO v_coll_toys FROM categories WHERE slug = 'coll-toys';
  
  -- 1. Move coins-related items under coins-currency as L2s
  UPDATE categories SET parent_id = v_coins_currency
  WHERE slug IN ('coins-collectible', 'coins-collectibles', 'ancient-coins', 'bulgarian-coins', 
                 'gold-coins', 'silver-coins', 'world-coins', 'banknotes') 
    AND parent_id = v_collectibles_id;
  
  -- 2. Move comics items under coll-comics as L2s
  UPDATE categories SET parent_id = v_coll_comics
  WHERE slug IN ('comic-books', 'dc-comics', 'indie-comics', 'manga-comics', 
                 'marvel-comics', 'vintage-comics') 
    AND parent_id = v_collectibles_id;
  
  -- 3. Move stamps-collectibles under stamps
  UPDATE categories SET parent_id = v_stamps
  WHERE slug = 'stamps-collectibles' AND parent_id = v_collectibles_id;
  
  -- 4. Move figurines under coll-toys
  UPDATE categories SET parent_id = v_coll_toys
  WHERE slug IN ('figurines', 'figurines-collectibles') AND parent_id = v_collectibles_id;
  
  -- 5. Delete empty memorabilia
  DELETE FROM categories WHERE slug = 'memorabilia' AND parent_id = v_collectibles_id;
  
  RAISE NOTICE 'Collectibles L0 hierarchy fixed';
END $$;
;
