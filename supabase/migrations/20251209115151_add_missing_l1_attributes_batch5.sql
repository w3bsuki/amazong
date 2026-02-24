-- Batch 5: Books, Bulgarian, Real Estate, Memorabilia categories
DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  -- Book Accessories
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'books-accessories';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Bookmarks","Book Lights","Book Stands","Book Covers","Reading Glasses","E-Reader Cases","Book Storage"]', false, 1, true),
    (v_cat_id, 'Material', 'select', '["Leather","Fabric","Metal","Plastic","Wood"]', false, 2, true),
    (v_cat_id, 'Condition', 'select', '["New","Like New","Good","Fair"]', true, 3, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Bulgarian Literature
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'books-bulgarian';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Genre', 'select', '["Fiction","Poetry","Drama","Essays","Historical","Contemporary","Classic","Children"]', false, 1, true),
    (v_cat_id, 'Era', 'select', '["Revival Period","Pre-War","Socialist Era","Post-1989","Contemporary"]', false, 2, true),
    (v_cat_id, 'Format', 'select', '["Hardcover","Paperback","Collector Edition","First Edition"]', false, 3, true),
    (v_cat_id, 'Condition', 'select', '["New","Like New","Very Good","Good","Fair","Poor"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Bulgarian Spirits
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'bulgarian-spirits';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Rakia","Mastika","Menta","Brandy","Liqueur","Other"]', false, 1, true),
    (v_cat_id, 'Base', 'select', '["Grape","Plum","Apricot","Pear","Mixed Fruit","Anise"]', false, 2, true),
    (v_cat_id, 'Age', 'select', '["Unaged","1-3 Years","3-5 Years","5-10 Years","10+ Years"]', false, 3, true),
    (v_cat_id, 'Volume', 'select', '["200ml","350ml","500ml","700ml","1L","1.5L+"]', false, 4, true),
    (v_cat_id, 'Region', 'text', NULL, false, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Bulgarian Wines
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'bulgarian-wines';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Red","White","Rosé","Sparkling","Dessert"]', false, 1, true),
    (v_cat_id, 'Grape Variety', 'select', '["Mavrud","Melnik","Gamza","Dimyat","Misket","Pamid","Cabernet","Merlot","Chardonnay","Other"]', false, 2, true),
    (v_cat_id, 'Region', 'select', '["Thracian Valley","Struma Valley","Danubian Plain","Black Sea","Rose Valley","Sub-Balkan"]', false, 3, true),
    (v_cat_id, 'Vintage', 'text', NULL, false, 4, true),
    (v_cat_id, 'Classification', 'select', '["PGI","PDO","Reserve","Grand Reserve","Table Wine"]', false, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Bulgarian Wood Carving
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'bulgarian-wood-carving';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Religious Icons","Decorative Panels","Furniture","Utensils","Sculptures","Architectural Elements"]', false, 1, true),
    (v_cat_id, 'Style', 'select', '["Tryavna School","Samokov School","Bansko School","Contemporary","Folk"]', false, 2, true),
    (v_cat_id, 'Wood Type', 'select', '["Walnut","Linden","Oak","Cherry","Pine"]', false, 3, true),
    (v_cat_id, 'Era', 'select', '["Antique (Pre-1900)","Revival Period","20th Century","Contemporary"]', false, 4, true),
    (v_cat_id, 'Condition', 'select', '["Excellent","Very Good","Good","Fair","Needs Restoration"]', true, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- E-Books
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'books-ebooks';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Format', 'select', '["EPUB","PDF","MOBI","AZW3","Multiple Formats"]', false, 1, true),
    (v_cat_id, 'Genre', 'select', '["Fiction","Non-Fiction","Academic","Self-Help","Business","Technical"]', false, 2, true),
    (v_cat_id, 'Language', 'select', '["Bulgarian","English","Other"]', false, 3, true),
    (v_cat_id, 'DRM', 'select', '["DRM-Free","Adobe DRM","Kindle DRM"]', false, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Foreign Language Books
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'books-foreign';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Language', 'select', '["English","German","French","Spanish","Russian","Italian","Chinese","Japanese","Other"]', false, 1, true),
    (v_cat_id, 'Genre', 'select', '["Fiction","Non-Fiction","Academic","Language Learning","Children","Comics/Manga"]', false, 2, true),
    (v_cat_id, 'Format', 'select', '["Hardcover","Paperback","Mass Market","Special Edition"]', false, 3, true),
    (v_cat_id, 'Condition', 'select', '["New","Like New","Very Good","Good","Fair","Poor"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Magazines & Periodicals
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'books-magazines';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Fashion","News","Science","Technology","Sports","Entertainment","Business","Lifestyle","Academic"]', false, 1, true),
    (v_cat_id, 'Frequency', 'select', '["Single Issue","Subscription","Back Issue","Collection"]', false, 2, true),
    (v_cat_id, 'Language', 'select', '["Bulgarian","English","Other"]', false, 3, true),
    (v_cat_id, 'Condition', 'select', '["New","Like New","Good","Fair","Collectible Grade"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Self-Published & Zines
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'books-zines';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Zine","Self-Published Book","Chapbook","Art Book","Comics","Poetry"]', false, 1, true),
    (v_cat_id, 'Format', 'select', '["Print","Digital","Print + Digital"]', false, 2, true),
    (v_cat_id, 'Edition', 'select', '["Limited Edition","Numbered","Open Edition"]', false, 3, true),
    (v_cat_id, 'Condition', 'select', '["New","Like New","Good"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Entertainment Memorabilia
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'entertainment-memorabilia';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Category', 'select', '["Movie Props","TV Props","Concert Items","Theater","Theme Parks","Celebrity Items"]', false, 1, true),
    (v_cat_id, 'Type', 'select', '["Props","Costumes","Posters","Tickets","Programs","Photos","Awards"]', false, 2, true),
    (v_cat_id, 'Era', 'select', '["Pre-1950","1950s-1960s","1970s-1980s","1990s-2000s","2010s-Present"]', false, 3, true),
    (v_cat_id, 'Authentication', 'select', '["COA Included","Screen-Used Verified","Production Used","Replica","No COA"]', false, 4, true),
    (v_cat_id, 'Condition', 'select', '["Mint","Near Mint","Very Good","Good","Fair"]', true, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Folk Costumes
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'folk-costumes';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Region', 'select', '["Thracian","Shopski","Rhodope","Strandzha","Dobrudzha","Northern","Western","Other"]', false, 1, true),
    (v_cat_id, 'Type', 'select', '["Full Costume","Dress/Sukman","Shirt","Vest","Apron","Belt","Headwear","Accessories"]', false, 2, true),
    (v_cat_id, 'Gender', 'select', '["Women","Men","Children"]', false, 3, true),
    (v_cat_id, 'Era', 'select', '["Antique (Pre-1900)","Early 20th Century","Mid-Century","Contemporary Reproduction"]', false, 4, true),
    (v_cat_id, 'Condition', 'select', '["Excellent","Very Good","Good","Fair","Needs Restoration"]', true, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Souvenirs
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'souvenirs';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Magnets","Keychains","Figurines","Textiles","Ceramics","Jewelry","Art","Food Items"]', false, 1, true),
    (v_cat_id, 'Theme', 'select', '["Bulgarian Heritage","Cities","Nature","Rose","Religious","Sports","Humor"]', false, 2, true),
    (v_cat_id, 'Material', 'select', '["Ceramic","Wood","Metal","Textile","Glass","Plastic","Mixed"]', false, 3, true),
    (v_cat_id, 'Condition', 'select', '["New","Like New","Good"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Vintage Clothing (non-hidden)
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'vintage-clothing';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Era', 'select', '["1920s","1930s","1940s","1950s","1960s","1970s","1980s","1990s","Y2K"]', false, 1, true),
    (v_cat_id, 'Clothing Type', 'select', '["Dresses","Tops","Bottoms","Outerwear","Accessories","Full Outfits"]', false, 2, true),
    (v_cat_id, 'Size', 'text', NULL, false, 3, true),
    (v_cat_id, 'Condition', 'select', '["Excellent","Very Good","Good","Fair","For Repair/Parts"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  RAISE NOTICE 'Batch 5: Books, Bulgarian, Memorabilia attributes added';
END $$;;
