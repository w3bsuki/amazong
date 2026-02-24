-- Batch 4: Hidden Fashion, Collectibles, E-Mobility categories (fixed columns)
DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  -- [HIDDEN] Accessories
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'fashion-accessories-main';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Accessory Type', 'select', '["Belts","Scarves","Gloves","Hats","Sunglasses","Wallets","Hair Accessories"]', false, 1, true),
    (v_cat_id, 'Material', 'select', '["Leather","Fabric","Metal","Plastic","Mixed"]', false, 2, true),
    (v_cat_id, 'Gender', 'select', '["Men","Women","Unisex"]', false, 3, true),
    (v_cat_id, 'Condition', 'select', '["New with Tags","New without Tags","Like New","Good","Fair"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- [HIDDEN] Bags & Luggage
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'bags-luggage';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Bag Type', 'select', '["Backpack","Handbag","Tote","Crossbody","Clutch","Luggage","Duffel","Briefcase"]', false, 1, true),
    (v_cat_id, 'Material', 'select', '["Leather","Canvas","Nylon","Polyester","Synthetic"]', false, 2, true),
    (v_cat_id, 'Size', 'select', '["Small","Medium","Large","Extra Large"]', false, 3, true),
    (v_cat_id, 'Brand', 'text', NULL, false, 4, true),
    (v_cat_id, 'Condition', 'select', '["New with Tags","New without Tags","Like New","Good","Fair"]', true, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- [HIDDEN] Plus Size Men
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'fashion-plus-size-men';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Clothing Type', 'select', '["Shirts","Pants","Suits","Outerwear","Activewear","Underwear"]', false, 1, true),
    (v_cat_id, 'Size', 'select', '["XL","2XL","3XL","4XL","5XL","6XL"]', false, 2, true),
    (v_cat_id, 'Fit', 'select', '["Regular","Relaxed","Slim","Athletic"]', false, 3, true),
    (v_cat_id, 'Brand', 'text', NULL, false, 4, true),
    (v_cat_id, 'Condition', 'select', '["New with Tags","New without Tags","Like New","Good","Fair"]', true, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- [HIDDEN] Plus Size Women
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'fashion-plus-size-women';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Clothing Type', 'select', '["Tops","Dresses","Pants","Skirts","Outerwear","Activewear","Swimwear"]', false, 1, true),
    (v_cat_id, 'Size', 'select', '["1X","2X","3X","4X","5X","14","16","18","20","22","24","26","28","30"]', false, 2, true),
    (v_cat_id, 'Style', 'select', '["Casual","Formal","Business","Athletic","Bohemian"]', false, 3, true),
    (v_cat_id, 'Brand', 'text', NULL, false, 4, true),
    (v_cat_id, 'Condition', 'select', '["New with Tags","New without Tags","Like New","Good","Fair"]', true, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- [HIDDEN] Vintage Clothing
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'fashion-vintage-clothing';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Era', 'select', '["1920s","1930s","1940s","1950s","1960s","1970s","1980s","1990s","Y2K"]', false, 1, true),
    (v_cat_id, 'Clothing Type', 'select', '["Dresses","Tops","Bottoms","Outerwear","Accessories","Full Outfits"]', false, 2, true),
    (v_cat_id, 'Size', 'text', NULL, false, 3, true),
    (v_cat_id, 'Condition', 'select', '["Excellent","Very Good","Good","Fair","For Repair/Parts"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- [HIDDEN] Watches
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'fashion-watches-main';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Watch Type', 'select', '["Analog","Digital","Smart Watch","Luxury","Sport","Dress","Pocket Watch"]', false, 1, true),
    (v_cat_id, 'Brand', 'text', NULL, false, 2, true),
    (v_cat_id, 'Movement', 'select', '["Automatic","Quartz","Manual","Solar","Kinetic"]', false, 3, true),
    (v_cat_id, 'Case Material', 'select', '["Stainless Steel","Gold","Titanium","Ceramic","Plastic"]', false, 4, true),
    (v_cat_id, 'Gender', 'select', '["Men","Women","Unisex"]', false, 5, true),
    (v_cat_id, 'Condition', 'select', '["New with Tags","New without Tags","Pre-owned - Excellent","Pre-owned - Good","Pre-owned - Fair","For Parts"]', true, 6, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Collectibles: Autographs
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'coll-autographs';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Category', 'select', '["Sports","Music","Movies/TV","Historical","Political","Literary","Art"]', false, 1, true),
    (v_cat_id, 'Format', 'select', '["Photo","Document","Ball","Jersey","Album","Poster","Book","Other"]', false, 2, true),
    (v_cat_id, 'Authentication', 'select', '["PSA/DNA","JSA","Beckett","Other COA","No COA"]', false, 3, true),
    (v_cat_id, 'Condition', 'select', '["Mint","Near Mint","Very Good","Good","Fair"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Collectibles: Toys & Figures
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'coll-toys';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Action Figures","Dolls","Die-Cast","Plush","Board Games","Building Sets","Model Kits"]', false, 1, true),
    (v_cat_id, 'Franchise', 'text', NULL, false, 2, true),
    (v_cat_id, 'Era', 'select', '["Vintage (Pre-1970)","1970s","1980s","1990s","2000s","2010s","Modern"]', false, 3, true),
    (v_cat_id, 'Packaging', 'select', '["MISB (Mint in Sealed Box)","MIB (Mint in Box)","MOC (Mint on Card)","Loose - Complete","Loose - Incomplete"]', false, 4, true),
    (v_cat_id, 'Condition', 'select', '["Mint","Near Mint","Very Good","Good","Fair","Poor"]', true, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Collectibles: Rare Items
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'coll-rare';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Category', 'select', '["Limited Editions","Prototypes","Error Items","First Editions","Numbered Items","Artist Proofs"]', false, 1, true),
    (v_cat_id, 'Provenance', 'select', '["Documented","Partial Documentation","Undocumented"]', false, 2, true),
    (v_cat_id, 'Authentication', 'select', '["Third-Party Authenticated","COA Included","No Authentication"]', false, 3, true),
    (v_cat_id, 'Condition', 'select', '["Mint","Near Mint","Very Good","Good","Fair"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- E-Mobility: E-Skateboards
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'emob-eboards';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Electric Skateboard","Electric Longboard","Electric Surfskate","Electric Mountainboard"]', false, 1, true),
    (v_cat_id, 'Motor Power', 'select', '["Under 500W","500W-1000W","1000W-2000W","Over 2000W"]', false, 2, true),
    (v_cat_id, 'Top Speed', 'select', '["Under 20 km/h","20-30 km/h","30-40 km/h","Over 40 km/h"]', false, 3, true),
    (v_cat_id, 'Range', 'select', '["Under 10 km","10-20 km","20-30 km","Over 30 km"]', false, 4, true),
    (v_cat_id, 'Brand', 'text', NULL, false, 5, true),
    (v_cat_id, 'Condition', 'select', '["New","Like New","Good","Fair","For Parts"]', true, 6, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- E-Mobility: Electric Go-Karts
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'emob-gokarts';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Kids Go-Kart","Adult Go-Kart","Racing Go-Kart","Drift Kart"]', false, 1, true),
    (v_cat_id, 'Motor Power', 'select', '["Under 500W","500W-1000W","1000W-3000W","Over 3000W"]', false, 2, true),
    (v_cat_id, 'Age Group', 'select', '["Kids (5-8)","Kids (8-12)","Teens (12-16)","Adults"]', false, 3, true),
    (v_cat_id, 'Max Speed', 'select', '["Under 15 km/h","15-25 km/h","25-40 km/h","Over 40 km/h"]', false, 4, true),
    (v_cat_id, 'Brand', 'text', NULL, false, 5, true),
    (v_cat_id, 'Condition', 'select', '["New","Like New","Good","Fair","For Parts"]', true, 6, true)
    ON CONFLICT DO NOTHING;
  END IF;

  RAISE NOTICE 'Batch 4: Hidden Fashion, Collectibles, E-Mobility attributes added';
END $$;;
