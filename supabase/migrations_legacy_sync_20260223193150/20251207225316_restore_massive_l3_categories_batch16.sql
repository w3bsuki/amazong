
-- Batch 16: More categories from various sections to reach target
DO $$
DECLARE
  v_mens_id UUID;
  v_womens_id UUID;
  v_kids_fashion_id UUID;
  v_kids_clothing_id UUID;
  v_maternity_id UUID;
  v_plus_size_id UUID;
  v_vintage_id UUID;
  v_activewear_id UUID;
  v_swim_id UUID;
  v_underwear_id UUID;
  v_sleepwear_id UUID;
BEGIN
  SELECT id INTO v_mens_id FROM categories WHERE slug = 'mens-fashion';
  SELECT id INTO v_womens_id FROM categories WHERE slug = 'womens-fashion';
  SELECT id INTO v_kids_fashion_id FROM categories WHERE slug = 'kids-fashion';
  SELECT id INTO v_kids_clothing_id FROM categories WHERE slug = 'kids-clothing';
  SELECT id INTO v_maternity_id FROM categories WHERE slug = 'maternity';
  SELECT id INTO v_plus_size_id FROM categories WHERE slug = 'plus-size';
  SELECT id INTO v_vintage_id FROM categories WHERE slug = 'vintage-fashion';
  SELECT id INTO v_activewear_id FROM categories WHERE slug = 'activewear';
  SELECT id INTO v_swim_id FROM categories WHERE slug = 'swimwear';
  SELECT id INTO v_underwear_id FROM categories WHERE slug = 'underwear';
  SELECT id INTO v_sleepwear_id FROM categories WHERE slug = 'sleepwear';
  
  -- Men's Fashion extended
  IF v_mens_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Suits', 'Костюми', 'mens-suits', v_mens_id, 31),
    ('Suit Jackets', 'Сака', 'mens-suits-jackets', v_mens_id, 32),
    ('Suit Pants', 'Панталони за костюм', 'mens-suits-pants', v_mens_id, 33),
    ('Tuxedos', 'Смокинги', 'mens-tuxedos', v_mens_id, 34),
    ('Vests', 'Жилетки', 'mens-vests', v_mens_id, 35),
    ('Dress Vests', 'Официални жилетки', 'mens-vests-dress', v_mens_id, 36),
    ('Shorts', 'Къси панталони', 'mens-shorts', v_mens_id, 37),
    ('Cargo Shorts', 'Карго шорти', 'mens-shorts-cargo', v_mens_id, 38),
    ('Board Shorts', 'Бордшорти', 'mens-shorts-board', v_mens_id, 39),
    ('Swimwear', 'Бански', 'mens-swimwear', v_mens_id, 40),
    ('Swim Trunks', 'Къси бански', 'mens-swim-trunks', v_mens_id, 41),
    ('Underwear', 'Бельо', 'mens-underwear', v_mens_id, 42),
    ('Boxers', 'Боксери', 'mens-boxers', v_mens_id, 43),
    ('Briefs', 'Слипове', 'mens-briefs', v_mens_id, 44),
    ('Undershirts', 'Потници', 'mens-undershirts', v_mens_id, 45),
    ('Sleepwear', 'Пижами', 'mens-sleepwear', v_mens_id, 46),
    ('Pajama Sets', 'Комплекти пижами', 'mens-pajamas', v_mens_id, 47),
    ('Robes', 'Халати', 'mens-robes', v_mens_id, 48),
    ('Activewear', 'Спортно облекло', 'mens-activewear', v_mens_id, 49),
    ('Athletic Shorts', 'Спортни шорти', 'mens-athletic-shorts', v_mens_id, 50),
    ('Athletic Pants', 'Спортни панталони', 'mens-athletic-pants', v_mens_id, 51),
    ('Tank Tops', 'Потници', 'mens-tank-tops', v_mens_id, 52),
    ('Compression Wear', 'Компресионно облекло', 'mens-compression', v_mens_id, 53),
    ('Track Jackets', 'Спортни якета', 'mens-track-jackets', v_mens_id, 54),
    ('Outerwear', 'Връхни дрехи', 'mens-outerwear', v_mens_id, 55)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Women's Fashion extended
  IF v_womens_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Suits', 'Костюми', 'womens-suits', v_womens_id, 31),
    ('Pant Suits', 'Костюми с панталон', 'womens-suits-pant', v_womens_id, 32),
    ('Skirt Suits', 'Костюми с пола', 'womens-suits-skirt', v_womens_id, 33),
    ('Jumpsuits', 'Гащеризони', 'womens-jumpsuits', v_womens_id, 34),
    ('Rompers', 'Къси гащеризони', 'womens-rompers', v_womens_id, 35),
    ('Shorts', 'Къси панталони', 'womens-shorts', v_womens_id, 36),
    ('Denim Shorts', 'Дънкови шорти', 'womens-shorts-denim', v_womens_id, 37),
    ('Joggers', 'Джогъри', 'womens-joggers', v_womens_id, 38),
    ('Hoodies', 'Суичъри', 'womens-hoodies', v_womens_id, 39),
    ('Sweatshirts', 'Блузи', 'womens-sweatshirts', v_womens_id, 40),
    ('Bodysuits', 'Бодита', 'womens-bodysuits', v_womens_id, 41),
    ('Tunics', 'Туники', 'womens-tunics', v_womens_id, 42),
    ('Vests', 'Елеци', 'womens-vests', v_womens_id, 43),
    ('Kimonos', 'Кимона', 'womens-kimonos', v_womens_id, 44),
    ('Ponchos', 'Пончо', 'womens-ponchos', v_womens_id, 45),
    ('Capes', 'Пелерини', 'womens-capes', v_womens_id, 46),
    ('Underwear', 'Бельо', 'womens-underwear', v_womens_id, 47),
    ('Bras', 'Сутиени', 'womens-bras', v_womens_id, 48),
    ('Panties', 'Бикини', 'womens-panties', v_womens_id, 49),
    ('Shapewear', 'Оформящо бельо', 'womens-shapewear', v_womens_id, 50),
    ('Sleepwear', 'Пижами', 'womens-sleepwear', v_womens_id, 51),
    ('Nightgowns', 'Нощници', 'womens-nightgowns', v_womens_id, 52),
    ('Maternity', 'За бременни', 'womens-maternity', v_womens_id, 53),
    ('Maternity Dresses', 'Рокли за бременни', 'womens-maternity-dresses', v_womens_id, 54),
    ('Maternity Tops', 'Блузи за бременни', 'womens-maternity-tops', v_womens_id, 55)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kids Clothing extended
  IF v_kids_fashion_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Boys Clothing', 'Облекло за момчета', 'kids-boys', v_kids_fashion_id, 1),
    ('Boys T-Shirts', 'Тениски за момчета', 'kids-boys-tshirts', v_kids_fashion_id, 2),
    ('Boys Pants', 'Панталони за момчета', 'kids-boys-pants', v_kids_fashion_id, 3),
    ('Boys Jeans', 'Дънки за момчета', 'kids-boys-jeans', v_kids_fashion_id, 4),
    ('Boys Shorts', 'Шорти за момчета', 'kids-boys-shorts', v_kids_fashion_id, 5),
    ('Boys Jackets', 'Якета за момчета', 'kids-boys-jackets', v_kids_fashion_id, 6),
    ('Boys Suits', 'Костюми за момчета', 'kids-boys-suits', v_kids_fashion_id, 7),
    ('Girls Clothing', 'Облекло за момичета', 'kids-girls', v_kids_fashion_id, 8),
    ('Girls Dresses', 'Рокли за момичета', 'kids-girls-dresses', v_kids_fashion_id, 9),
    ('Girls Tops', 'Блузи за момичета', 'kids-girls-tops', v_kids_fashion_id, 10),
    ('Girls Pants', 'Панталони за момичета', 'kids-girls-pants', v_kids_fashion_id, 11),
    ('Girls Skirts', 'Поли за момичета', 'kids-girls-skirts', v_kids_fashion_id, 12),
    ('Girls Jackets', 'Якета за момичета', 'kids-girls-jackets', v_kids_fashion_id, 13),
    ('Kids Shoes', 'Детски обувки', 'kids-shoes', v_kids_fashion_id, 14),
    ('Boys Shoes', 'Обувки за момчета', 'kids-shoes-boys', v_kids_fashion_id, 15),
    ('Girls Shoes', 'Обувки за момичета', 'kids-shoes-girls', v_kids_fashion_id, 16),
    ('Kids Sneakers', 'Детски кецове', 'kids-sneakers', v_kids_fashion_id, 17),
    ('Kids Boots', 'Детски боти', 'kids-boots', v_kids_fashion_id, 18),
    ('Kids Sandals', 'Детски сандали', 'kids-sandals', v_kids_fashion_id, 19),
    ('Kids Activewear', 'Детско спортно облекло', 'kids-activewear', v_kids_fashion_id, 20),
    ('Kids Swimwear', 'Детски бански', 'kids-swimwear', v_kids_fashion_id, 21),
    ('Kids Sleepwear', 'Детски пижами', 'kids-sleepwear', v_kids_fashion_id, 22),
    ('Kids Underwear', 'Детско бельо', 'kids-underwear', v_kids_fashion_id, 23),
    ('Kids Accessories', 'Детски аксесоари', 'kids-accessories', v_kids_fashion_id, 24),
    ('Kids Hats', 'Детски шапки', 'kids-hats', v_kids_fashion_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Activewear categories (if exists)
  IF v_activewear_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Running Wear', 'Облекло за бягане', 'activewear-running', v_activewear_id, 1),
    ('Running Shorts', 'Шорти за бягане', 'activewear-running-shorts', v_activewear_id, 2),
    ('Running Tights', 'Клинове за бягане', 'activewear-running-tights', v_activewear_id, 3),
    ('Yoga Wear', 'Облекло за йога', 'activewear-yoga', v_activewear_id, 4),
    ('Yoga Pants', 'Панталони за йога', 'activewear-yoga-pants', v_activewear_id, 5),
    ('Yoga Tops', 'Топове за йога', 'activewear-yoga-tops', v_activewear_id, 6),
    ('Gym Wear', 'Облекло за фитнес', 'activewear-gym', v_activewear_id, 7),
    ('Gym Shorts', 'Шорти за фитнес', 'activewear-gym-shorts', v_activewear_id, 8),
    ('Gym Tanks', 'Потници за фитнес', 'activewear-gym-tanks', v_activewear_id, 9),
    ('Sports Bras', 'Спортни сутиени', 'activewear-sports-bras', v_activewear_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Additional categories to increase count
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
  ('Vintage Clothing', 'Винтидж облекло', 'fashion-vintage-clothing', v_vintage_id, 1),
  ('Vintage Dresses', 'Винтидж рокли', 'fashion-vintage-dresses', v_vintage_id, 2),
  ('Vintage Jackets', 'Винтидж якета', 'fashion-vintage-jackets', v_vintage_id, 3),
  ('Vintage Accessories', 'Винтидж аксесоари', 'fashion-vintage-accessories', v_vintage_id, 4),
  ('Plus Size Women', 'Големи размери жени', 'fashion-plus-size-women', v_plus_size_id, 1),
  ('Plus Size Dresses', 'Рокли големи размери', 'fashion-plus-size-dresses', v_plus_size_id, 2),
  ('Plus Size Tops', 'Блузи големи размери', 'fashion-plus-size-tops', v_plus_size_id, 3),
  ('Plus Size Men', 'Големи размери мъже', 'fashion-plus-size-men', v_plus_size_id, 4),
  ('Plus Size Shirts', 'Ризи големи размери', 'fashion-plus-size-shirts', v_plus_size_id, 5)
  ON CONFLICT (slug) DO NOTHING;

END $$;
;
