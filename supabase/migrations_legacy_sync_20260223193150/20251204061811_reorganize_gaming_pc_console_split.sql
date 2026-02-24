
-- Reorganize Gaming into PC Gaming and Console Gaming as main columns
DO $$
DECLARE
  gaming_root_id UUID := '54c304d0-4eba-4075-9ef3-8cbcf426d9b0';
  pc_gaming_id UUID;
  console_gaming_id UUID;
  peripherals_id UUID := '68ea77d8-f0e3-4bbc-a5f4-eb47074ef5ce'; -- Gaming Peripherals
  furniture_id UUID := '2c47d464-091f-49a4-8161-5a6ebbdfb58a'; -- Gaming Furniture
  consoles_id UUID := '8a363062-b7ff-4597-b383-dc5fbda839ff'; -- Video Game Consoles
  video_games_id UUID := '49a0173a-6fcb-4b86-9e94-dc1caf69bfd4'; -- Video Games
  accessories_id UUID := '235685ba-7c21-436e-8319-cb84dc95bcab'; -- Gaming Accessories
  pc_components_id UUID := 'e685481c-138a-43c7-bd4a-4c8665e6f00c'; -- PC Components (old pc-gaming)
BEGIN

  -- ========================================
  -- STEP 1: Create new L1 categories for the two-column split
  -- ========================================
  
  -- Create "PC Gaming" as a new main L1 category
  INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
  VALUES (
    gen_random_uuid(),
    'PC Gaming',
    'PC Гейминг',
    'pc-gaming-main',
    gaming_root_id,
    '🖥️',
    1
  )
  RETURNING id INTO pc_gaming_id;
  
  -- Create "Console Gaming" as a new main L1 category
  INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
  VALUES (
    gen_random_uuid(),
    'Console Gaming',
    'Конзолен гейминг',
    'console-gaming',
    gaming_root_id,
    '🎮',
    2
  )
  RETURNING id INTO console_gaming_id;

  -- ========================================
  -- STEP 2: Create L2 categories under PC Gaming
  -- ========================================
  
  -- PC Gaming -> Peripherals (mice, keyboards, headsets)
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES ('Peripherals', 'Периферия', 'pc-peripherals', pc_gaming_id, 1);
  
  -- PC Gaming -> Accessories (chairs, desks)
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES ('PC Accessories', 'Аксесоари', 'pc-accessories', pc_gaming_id, 2);
  
  -- PC Gaming -> Gaming PCs
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES ('Gaming PCs', 'Гейминг компютри', 'pc-gaming-pcs', pc_gaming_id, 3);
  
  -- PC Gaming -> Gaming Monitors
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES ('Gaming Monitors', 'Гейминг монитори', 'pc-gaming-monitors', pc_gaming_id, 4);

  -- ========================================
  -- STEP 3: Create L2 categories under Console Gaming
  -- ========================================
  
  -- Console Gaming -> PlayStation
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES ('PlayStation', 'PlayStation', 'console-playstation', console_gaming_id, 1);
  
  -- Console Gaming -> Xbox
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES ('Xbox', 'Xbox', 'console-xbox', console_gaming_id, 2);
  
  -- Console Gaming -> Nintendo
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES ('Nintendo', 'Nintendo', 'console-nintendo', console_gaming_id, 3);
  
  -- Console Gaming -> Accessories (controllers, etc)
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES ('Console Accessories', 'Аксесоари', 'console-accessories', console_gaming_id, 4);
  
  -- Console Gaming -> Games
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES ('Console Games', 'Игри', 'console-games', console_gaming_id, 5);

  -- ========================================
  -- STEP 4: Update display order for remaining L1 categories
  -- ========================================
  
  UPDATE categories SET display_order = 3 WHERE slug = 'trading-cards' AND parent_id = gaming_root_id;
  UPDATE categories SET display_order = 4 WHERE slug = 'board-games' AND parent_id = gaming_root_id;
  UPDATE categories SET display_order = 5 WHERE slug = 'gaming-merch' AND parent_id = gaming_root_id;
  
  -- ========================================
  -- STEP 5: Delete old L1 categories that are now reorganized
  -- ========================================
  
  -- First, move children of old categories to nowhere (they'll be orphaned but we'll clean up)
  -- Actually, let's just delete the old L1s and their children
  
  -- Delete children of Gaming Peripherals
  DELETE FROM categories WHERE parent_id = peripherals_id;
  -- Delete Gaming Peripherals itself
  DELETE FROM categories WHERE id = peripherals_id;
  
  -- Delete children of Gaming Furniture
  DELETE FROM categories WHERE parent_id = furniture_id;
  -- Delete Gaming Furniture itself
  DELETE FROM categories WHERE id = furniture_id;
  
  -- Delete children of Video Game Consoles (old structure)
  DELETE FROM categories WHERE parent_id = consoles_id;
  -- Delete Video Game Consoles itself
  DELETE FROM categories WHERE id = consoles_id;
  
  -- Delete children of Video Games
  DELETE FROM categories WHERE parent_id = video_games_id;
  -- Delete Video Games itself
  DELETE FROM categories WHERE id = video_games_id;
  
  -- Delete children of Gaming Accessories
  DELETE FROM categories WHERE parent_id = accessories_id;
  -- Delete Gaming Accessories itself
  DELETE FROM categories WHERE id = accessories_id;
  
  -- Delete children of PC Components (old pc-gaming)
  DELETE FROM categories WHERE parent_id = pc_components_id;
  -- Delete PC Components itself
  DELETE FROM categories WHERE id = pc_components_id;

END $$;
;
