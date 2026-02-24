
-- =====================================================
-- BULGARIAN TRADITIONAL L3 CATEGORIES MIGRATION
-- =====================================================

-- ===========================================
-- 1. TRADITIONAL FOODS L3
-- ===========================================

-- Honey & Bee Products (bg-honey-bee: cab8922f-c634-4b47-b7a2-bb7cca5dbc24)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Raw Honey', 'Суров мед', 'bg-raw-honey', 'cab8922f-c634-4b47-b7a2-bb7cca5dbc24', 1),
('Honeycomb', 'Пчелна пита', 'bg-honeycomb', 'cab8922f-c634-4b47-b7a2-bb7cca5dbc24', 2),
('Bee Pollen', 'Пчелен прашец', 'bg-pollen', 'cab8922f-c634-4b47-b7a2-bb7cca5dbc24', 3),
('Propolis', 'Прополис', 'bg-propolis', 'cab8922f-c634-4b47-b7a2-bb7cca5dbc24', 4),
('Royal Jelly', 'Пчелно млечице', 'bg-royal-jelly', 'cab8922f-c634-4b47-b7a2-bb7cca5dbc24', 5);

-- Dairy Products (bg-dairy: 17238831-c446-4b7f-813a-0cd5662d49c0)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Bulgarian Yogurt', 'Българско кисело мляко', 'bg-yogurt', '17238831-c446-4b7f-813a-0cd5662d49c0', 1),
('Sirene (White Cheese)', 'Сирене', 'bg-sirene', '17238831-c446-4b7f-813a-0cd5662d49c0', 2),
('Kashkaval', 'Кашкавал', 'bg-kashkaval', '17238831-c446-4b7f-813a-0cd5662d49c0', 3),
('Ayran', 'Айрян', 'bg-ayran', '17238831-c446-4b7f-813a-0cd5662d49c0', 4);

-- Meat Products (bg-meat: 27022884-7306-42d6-8d54-e418966d1ac9)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Lukanka', 'Луканка', 'bg-lukanka', '27022884-7306-42d6-8d54-e418966d1ac9', 1),
('Sudzhuk', 'Суджук', 'bg-sudzhuk', '27022884-7306-42d6-8d54-e418966d1ac9', 2),
('Pastarma', 'Пастърма', 'bg-pastarma', '27022884-7306-42d6-8d54-e418966d1ac9', 3),
('Shpek Salami', 'Шпек салам', 'bg-shpek', '27022884-7306-42d6-8d54-e418966d1ac9', 4),
('Kebapche & Kyufte', 'Кебапче и кюфте', 'bg-kebapche', '27022884-7306-42d6-8d54-e418966d1ac9', 5);

-- Preserved Foods (bg-preserved: c346a90b-3537-46a5-936e-265c10eeb5e0)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Lyutenitsa', 'Лютеница', 'bg-lyutenitsa', 'c346a90b-3537-46a5-936e-265c10eeb5e0', 1),
('Ajvar', 'Айвар', 'bg-ajvar', 'c346a90b-3537-46a5-936e-265c10eeb5e0', 2),
('Pickles (Turshia)', 'Туршия', 'bg-pickles', 'c346a90b-3537-46a5-936e-265c10eeb5e0', 3),
('Kompot', 'Компот', 'bg-kompot', 'c346a90b-3537-46a5-936e-265c10eeb5e0', 4),
('Jams & Marmalades', 'Конфитюри и сладка', 'bg-jams', 'c346a90b-3537-46a5-936e-265c10eeb5e0', 5);

-- Spices & Herbs (bg-spices: 7f679a61-2857-4a84-81f0-f0f8f21b8791)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Chubritsa (Savory)', 'Чубрица', 'bg-chubritsa', '7f679a61-2857-4a84-81f0-f0f8f21b8791', 1),
('Sharena Sol', 'Шарена сол', 'bg-sharena-sol', '7f679a61-2857-4a84-81f0-f0f8f21b8791', 2),
('Bulgarian Paprika', 'Българска червена пипер', 'bg-paprika', '7f679a61-2857-4a84-81f0-f0f8f21b8791', 3),
('Dried Herbs', 'Сушени билки', 'bg-dried-herbs', '7f679a61-2857-4a84-81f0-f0f8f21b8791', 4),
('Herb Teas', 'Билкови чайове', 'bg-herb-teas', '7f679a61-2857-4a84-81f0-f0f8f21b8791', 5);

-- Traditional Sweets (bg-sweets: 67f10d8d-cc3e-4ba4-ad42-3797b141cafb)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Baklava', 'Баклава', 'bg-baklava', '67f10d8d-cc3e-4ba4-ad42-3797b141cafb', 1),
('Turkish Delight (Lokum)', 'Локум', 'bg-lokum', '67f10d8d-cc3e-4ba4-ad42-3797b141cafb', 2),
('Halva', 'Халва', 'bg-halva', '67f10d8d-cc3e-4ba4-ad42-3797b141cafb', 3),
('Rose Jam (Sladko)', 'Сладко от рози', 'bg-rose-jam', '67f10d8d-cc3e-4ba4-ad42-3797b141cafb', 4),
('Kozunak', 'Козунак', 'bg-kozunak', '67f10d8d-cc3e-4ba4-ad42-3797b141cafb', 5);

-- ===========================================
-- 2. ROSE PRODUCTS L3
-- ===========================================

-- Rose Oil & Essence (bg-rose-oil: 559c4462-8a3e-4e14-b551-5da7956b13f3)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Rose Otto', 'Розово масло Ото', 'bg-rose-otto', '559c4462-8a3e-4e14-b551-5da7956b13f3', 1),
('Rose Absolute', 'Розов абсолют', 'bg-rose-absolute', '559c4462-8a3e-4e14-b551-5da7956b13f3', 2),
('Rose Water', 'Розова вода', 'bg-rose-water', '559c4462-8a3e-4e14-b551-5da7956b13f3', 3),
('Rose Hydrolate', 'Розов хидролат', 'bg-rose-hydrolate', '559c4462-8a3e-4e14-b551-5da7956b13f3', 4);

-- Rose Cosmetics (bg-rose-cosmetics: 65accd06-b84f-4fee-b6af-cee3029170e5)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Rose Face Cream', 'Розов крем за лице', 'bg-rose-cream', '65accd06-b84f-4fee-b6af-cee3029170e5', 1),
('Rose Soap', 'Розов сапун', 'bg-rose-soap', '65accd06-b84f-4fee-b6af-cee3029170e5', 2),
('Rose Face Mask', 'Розова маска за лице', 'bg-rose-mask', '65accd06-b84f-4fee-b6af-cee3029170e5', 3),
('Rose Body Lotion', 'Розов лосион за тяло', 'bg-rose-lotion', '65accd06-b84f-4fee-b6af-cee3029170e5', 4),
('Rose Lip Balm', 'Розов балсам за устни', 'bg-rose-lip', '65accd06-b84f-4fee-b6af-cee3029170e5', 5);

-- Rose Edibles (bg-rose-edibles: 7bf87c23-328f-42c5-8f67-ff7235914101)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Rose Jam', 'Конфитюр от рози', 'bg-rose-jam-edible', '7bf87c23-328f-42c5-8f67-ff7235914101', 1),
('Rose Liqueur', 'Розов ликьор', 'bg-rose-liqueur', '7bf87c23-328f-42c5-8f67-ff7235914101', 2),
('Rose Tea', 'Розов чай', 'bg-rose-tea', '7bf87c23-328f-42c5-8f67-ff7235914101', 3),
('Rose Candy', 'Розови бонбони', 'bg-rose-candy', '7bf87c23-328f-42c5-8f67-ff7235914101', 4);

-- Rose Gift Sets (bg-rose-gifts: 6fadf712-5925-40ac-a056-26a460f66d77)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Rose Oil Gift Sets', 'Комплекти с розово масло', 'bg-rose-oil-sets', '6fadf712-5925-40ac-a056-26a460f66d77', 1),
('Rose Cosmetics Gift Box', 'Подаръчна кутия розова козметика', 'bg-rose-gift-box', '6fadf712-5925-40ac-a056-26a460f66d77', 2),
('Rose Perfume', 'Розов парфюм', 'bg-rose-perfume', '6fadf712-5925-40ac-a056-26a460f66d77', 3);

-- ===========================================
-- 3. TRADITIONAL CRAFTS L3
-- ===========================================

-- Pottery & Ceramics (bg-pottery: fef44cc7-e08d-4b54-9185-168e04c31889)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Troyan Pottery', 'Троянска керамика', 'bg-troyan-pottery', 'fef44cc7-e08d-4b54-9185-168e04c31889', 1),
('Traditional Plates', 'Традиционни чинии', 'bg-trad-plates', 'fef44cc7-e08d-4b54-9185-168e04c31889', 2),
('Ceramic Jugs', 'Керамични стомни', 'bg-ceramic-jugs', 'fef44cc7-e08d-4b54-9185-168e04c31889', 3),
('Decorative Ceramics', 'Декоративна керамика', 'bg-decorative-ceramics', 'fef44cc7-e08d-4b54-9185-168e04c31889', 4);

-- Woodworking (bg-woodwork: b2187a1c-0609-4908-a009-8318b4ee5a34)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Wood Carvings', 'Дърворезби', 'bg-wood-carvings', 'b2187a1c-0609-4908-a009-8318b4ee5a34', 1),
('Wooden Icons', 'Дървени икони', 'bg-wooden-icons', 'b2187a1c-0609-4908-a009-8318b4ee5a34', 2),
('Wooden Spoons & Utensils', 'Дървени лъжици и прибори', 'bg-wooden-utensils', 'b2187a1c-0609-4908-a009-8318b4ee5a34', 3),
('Decorative Boxes', 'Декоративни кутии', 'bg-decorative-boxes', 'b2187a1c-0609-4908-a009-8318b4ee5a34', 4);

-- Textiles & Embroidery (bg-textiles: 97ae3135-9d90-4637-bf79-3e1a971bd95f)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Hand Embroidery', 'Ръчна бродерия', 'bg-embroidery', '97ae3135-9d90-4637-bf79-3e1a971bd95f', 1),
('Kilims & Rugs', 'Килими и черги', 'bg-kilims', '97ae3135-9d90-4637-bf79-3e1a971bd95f', 2),
('Tablecloths', 'Покривки за маса', 'bg-tablecloths', '97ae3135-9d90-4637-bf79-3e1a971bd95f', 3),
('Traditional Towels', 'Традиционни кърпи', 'bg-towels', '97ae3135-9d90-4637-bf79-3e1a971bd95f', 4);

-- Metalwork (bg-metalwork: 75a3eb88-035e-468a-8e9e-9ba6595acba7)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Copper Crafts', 'Медни изделия', 'bg-copper', '75a3eb88-035e-468a-8e9e-9ba6595acba7', 1),
('Filigree Jewelry', 'Филигран', 'bg-filigree', '75a3eb88-035e-468a-8e9e-9ba6595acba7', 2),
('Traditional Bells', 'Традиционни звънци', 'bg-bells', '75a3eb88-035e-468a-8e9e-9ba6595acba7', 3);

-- Icons & Religious Art (bg-icons: 97061e4d-e909-4fe7-a7ac-503c70ec0dc7)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Hand-painted Icons', 'Ръчно рисувани икони', 'bg-painted-icons', '97061e4d-e909-4fe7-a7ac-503c70ec0dc7', 1),
('Orthodox Items', 'Православни предмети', 'bg-orthodox', '97061e4d-e909-4fe7-a7ac-503c70ec0dc7', 2),
('Religious Crosses', 'Религиозни кръстове', 'bg-crosses', '97061e4d-e909-4fe7-a7ac-503c70ec0dc7', 3);

-- Folk Musical Instruments (bg-folk-instruments: efadd9a0-255f-499d-b329-49549ed4f0f6)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Gaida (Bagpipe)', 'Гайда', 'bg-gaida', 'efadd9a0-255f-499d-b329-49549ed4f0f6', 1),
('Kaval', 'Кавал', 'bg-kaval', 'efadd9a0-255f-499d-b329-49549ed4f0f6', 2),
('Gadulka', 'Гъдулка', 'bg-gadulka', 'efadd9a0-255f-499d-b329-49549ed4f0f6', 3),
('Tupan (Drum)', 'Тъпан', 'bg-tupan', 'efadd9a0-255f-499d-b329-49549ed4f0f6', 4),
('Tambura', 'Тамбура', 'bg-tambura', 'efadd9a0-255f-499d-b329-49549ed4f0f6', 5);

-- ===========================================
-- 4. FOLK COSTUMES L3
-- ===========================================

-- Women's Folk Costumes (bg-folk-women: ae69c74c-d5f0-4659-a802-a65e41b8218a)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Sukman (Dress)', 'Сукман', 'bg-sukman', 'ae69c74c-d5f0-4659-a802-a65e41b8218a', 1),
('Saya (Dress)', 'Сая', 'bg-saya', 'ae69c74c-d5f0-4659-a802-a65e41b8218a', 2),
('Chemise (Riza)', 'Риза', 'bg-riza', 'ae69c74c-d5f0-4659-a802-a65e41b8218a', 3),
('Aprons (Prestilka)', 'Престилки', 'bg-prestilka', 'ae69c74c-d5f0-4659-a802-a65e41b8218a', 4),
('Headdress', 'Кърпи и забрадки', 'bg-headdress', 'ae69c74c-d5f0-4659-a802-a65e41b8218a', 5);

-- Men's Folk Costumes (bg-folk-men: 6c96b8f0-b9f3-4869-adf4-0d01a14fa094)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Folk Shirts', 'Народни ризи', 'bg-folk-shirts', '6c96b8f0-b9f3-4869-adf4-0d01a14fa094', 1),
('Folk Trousers', 'Потури и панталони', 'bg-folk-trousers', '6c96b8f0-b9f3-4869-adf4-0d01a14fa094', 2),
('Vests (Yeleki)', 'Елеци', 'bg-yeleki', '6c96b8f0-b9f3-4869-adf4-0d01a14fa094', 3),
('Belts (Pojas)', 'Пояси', 'bg-pojas', '6c96b8f0-b9f3-4869-adf4-0d01a14fa094', 4),
('Hats (Kalpak)', 'Калпаци', 'bg-kalpak', '6c96b8f0-b9f3-4869-adf4-0d01a14fa094', 5);

-- Children's Folk Costumes (bg-folk-kids: 8d6c313a-818f-4208-93f0-496c12c58267)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Girls'' Costumes', 'Носии за момичета', 'bg-girls-costumes', '8d6c313a-818f-4208-93f0-496c12c58267', 1),
('Boys'' Costumes', 'Носии за момчета', 'bg-boys-costumes', '8d6c313a-818f-4208-93f0-496c12c58267', 2),
('Festival Wear', 'Празнични носии', 'bg-festival-wear', '8d6c313a-818f-4208-93f0-496c12c58267', 3);

-- Costume Accessories (bg-folk-accessories: ea6c0f9a-f5a6-44df-adbe-94146a5efa66)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Folk Jewelry', 'Народни бижута', 'bg-folk-jewelry', 'ea6c0f9a-f5a6-44df-adbe-94146a5efa66', 1),
('Tsarvuli (Shoes)', 'Цървули', 'bg-tsarvuli', 'ea6c0f9a-f5a6-44df-adbe-94146a5efa66', 2),
('Folk Bags', 'Народни торби', 'bg-folk-bags', 'ea6c0f9a-f5a6-44df-adbe-94146a5efa66', 3),
('Buckles & Ornaments', 'Токи и украси', 'bg-ornaments', 'ea6c0f9a-f5a6-44df-adbe-94146a5efa66', 4);

-- Regional Costumes (bg-folk-regional: 77e4a6ea-6054-493e-9e72-f8060fe85651)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Thracian Costumes', 'Тракийски носии', 'bg-thracian-costumes', '77e4a6ea-6054-493e-9e72-f8060fe85651', 1),
('Shop Region Costumes', 'Шопски носии', 'bg-shop-costumes', '77e4a6ea-6054-493e-9e72-f8060fe85651', 2),
('Rhodope Costumes', 'Родопски носии', 'bg-rhodope-costumes', '77e4a6ea-6054-493e-9e72-f8060fe85651', 3),
('Pirin Costumes', 'Пирински носии', 'bg-pirin-costumes', '77e4a6ea-6054-493e-9e72-f8060fe85651', 4),
('Dobrudzha Costumes', 'Добруджански носии', 'bg-dobrudzha-costumes', '77e4a6ea-6054-493e-9e72-f8060fe85651', 5);

-- ===========================================
-- 5. BULGARIAN WINE L3
-- ===========================================

-- Red Wine (bg-red-wine: 0a6ef40c-bf62-416d-9d1a-d5eb99787354)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Mavrud', 'Мавруд', 'bg-mavrud', '0a6ef40c-bf62-416d-9d1a-d5eb99787354', 1),
('Melnik', 'Широка мелнишка лоза', 'bg-melnik', '0a6ef40c-bf62-416d-9d1a-d5eb99787354', 2),
('Rubin', 'Рубин', 'bg-rubin', '0a6ef40c-bf62-416d-9d1a-d5eb99787354', 3),
('Gamza', 'Гъмза', 'bg-gamza', '0a6ef40c-bf62-416d-9d1a-d5eb99787354', 4),
('Pamid', 'Памид', 'bg-pamid', '0a6ef40c-bf62-416d-9d1a-d5eb99787354', 5);

-- White Wine (bg-white-wine: 255b6198-9d4a-43fe-b263-c4e62bb86b8c)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Dimyat', 'Димят', 'bg-dimyat', '255b6198-9d4a-43fe-b263-c4e62bb86b8c', 1),
('Misket', 'Мискет', 'bg-misket', '255b6198-9d4a-43fe-b263-c4e62bb86b8c', 2),
('Traminer', 'Траминер', 'bg-traminer', '255b6198-9d4a-43fe-b263-c4e62bb86b8c', 3),
('Chardonnay', 'Шардоне', 'bg-chardonnay', '255b6198-9d4a-43fe-b263-c4e62bb86b8c', 4);

-- Rosé Wine (bg-rose-wine: 6349a111-430c-4d56-9c1e-1f389ad52437)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Dry Rosé', 'Сухо розе', 'bg-dry-rose', '6349a111-430c-4d56-9c1e-1f389ad52437', 1),
('Semi-Sweet Rosé', 'Полусладко розе', 'bg-sweet-rose', '6349a111-430c-4d56-9c1e-1f389ad52437', 2);

-- Rakia (bg-rakia: 6a5a31ec-50b5-4208-9102-c649fc595c28)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Grape Rakia', 'Гроздова ракия', 'bg-grape-rakia', '6a5a31ec-50b5-4208-9102-c649fc595c28', 1),
('Plum Rakia (Slivova)', 'Сливова ракия', 'bg-plum-rakia', '6a5a31ec-50b5-4208-9102-c649fc595c28', 2),
('Apricot Rakia', 'Кайсиева ракия', 'bg-apricot-rakia', '6a5a31ec-50b5-4208-9102-c649fc595c28', 3),
('Muscat Rakia', 'Мускатова ракия', 'bg-muscat-rakia', '6a5a31ec-50b5-4208-9102-c649fc595c28', 4),
('Aged Rakia', 'Отлежала ракия', 'bg-aged-rakia', '6a5a31ec-50b5-4208-9102-c649fc595c28', 5);

-- Wine Accessories (bg-wine-accessories: 26dc1449-0642-4285-a844-9ff922a946d5)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Wine Glasses', 'Чаши за вино', 'bg-wine-glasses', '26dc1449-0642-4285-a844-9ff922a946d5', 1),
('Wine Openers', 'Тирбушони', 'bg-wine-openers', '26dc1449-0642-4285-a844-9ff922a946d5', 2),
('Decanters', 'Декантери', 'bg-decanters', '26dc1449-0642-4285-a844-9ff922a946d5', 3);

-- ===========================================
-- 6. SOUVENIRS L3
-- ===========================================

-- Martenitsi (bg-martenitsi: 3d167b5b-6530-456f-91b5-c55515dc9594)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Traditional Martenitsi', 'Традиционни мартеници', 'bg-trad-martenitsi', '3d167b5b-6530-456f-91b5-c55515dc9594', 1),
('Modern Martenitsi', 'Модерни мартеници', 'bg-modern-martenitsi', '3d167b5b-6530-456f-91b5-c55515dc9594', 2),
('Martenitsa Bracelets', 'Мартенишки гривни', 'bg-martenitsi-bracelets', '3d167b5b-6530-456f-91b5-c55515dc9594', 3),
('Decorative Martenitsi', 'Декоративни мартеници', 'bg-decorative-martenitsi', '3d167b5b-6530-456f-91b5-c55515dc9594', 4);

-- Magnets & Keychains (bg-magnets: f82ea3df-77e5-4791-95a9-25384b2333cc)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('City Magnets', 'Магнити с градове', 'bg-city-magnets', 'f82ea3df-77e5-4791-95a9-25384b2333cc', 1),
('Traditional Magnets', 'Традиционни магнити', 'bg-trad-magnets', 'f82ea3df-77e5-4791-95a9-25384b2333cc', 2),
('Keychains', 'Ключодържатели', 'bg-keychains', 'f82ea3df-77e5-4791-95a9-25384b2333cc', 3);

-- Postcards & Books (bg-postcards: 4b9c406e-7ffe-4272-904f-1ee1725982d9)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Postcards', 'Пощенски картички', 'bg-cards', '4b9c406e-7ffe-4272-904f-1ee1725982d9', 1),
('Bulgarian History Books', 'Книги за българска история', 'bg-history-books', '4b9c406e-7ffe-4272-904f-1ee1725982d9', 2),
('Bulgarian Cookbooks', 'Български готварски книги', 'bg-cookbooks', '4b9c406e-7ffe-4272-904f-1ee1725982d9', 3);

-- Mini Crafts & Figurines (bg-mini-crafts: 4ae1e400-19b3-4617-b20e-2470dbbe264e)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Mini Pottery', 'Мини керамика', 'bg-mini-pottery', '4ae1e400-19b3-4617-b20e-2470dbbe264e', 1),
('Mini Folk Costumes', 'Мини народни носии', 'bg-mini-costumes', '4ae1e400-19b3-4617-b20e-2470dbbe264e', 2),
('Figurines', 'Фигурки', 'bg-figurines', '4ae1e400-19b3-4617-b20e-2470dbbe264e', 3);

-- Bulgarian Symbols (bg-symbols: 7ed9abf7-293f-4928-a346-89e70b444a7e)
INSERT INTO public.categories (name, name_bg, slug, parent_id, display_order) VALUES
('Bulgarian Flags', 'Български знамена', 'bg-flags', '7ed9abf7-293f-4928-a346-89e70b444a7e', 1),
('Coat of Arms Items', 'Герб на България', 'bg-coat-arms', '7ed9abf7-293f-4928-a346-89e70b444a7e', 2),
('Patriotic Items', 'Патриотични изделия', 'bg-patriotic', '7ed9abf7-293f-4928-a346-89e70b444a7e', 3),
('Cyrillic Alphabet Items', 'Изделия с кирилица', 'bg-cyrillic', '7ed9abf7-293f-4928-a346-89e70b444a7e', 4);
;
