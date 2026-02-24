-- Batch 89: Completely new unique categories

-- Under Vitamins & Supplements (find parent first)
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'vitamins-supplements';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('B-Complex Vitamins', 'Витамини от група В', 'b-complex-vitamins', parent_id_var, 10),
      ('Magnesium Supplements', 'Магнезиеви добавки', 'magnesium-supplements', parent_id_var, 11),
      ('Zinc Supplements', 'Цинкови добавки', 'zinc-supplements', parent_id_var, 12),
      ('Collagen Supplements', 'Колагенови добавки', 'collagen-supplements', parent_id_var, 13),
      ('CoQ10 Supplements', 'CoQ10 добавки', 'coq10-supplements', parent_id_var, 14),
      ('Melatonin Sleep Aid', 'Мелатонин за сън', 'melatonin-sleep-aid', parent_id_var, 15),
      ('Turmeric Supplements', 'Добавки с куркума', 'turmeric-supplements', parent_id_var, 16)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Under Personal Care
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'personal-care';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Foot Care Products', 'Продукти за грижа за краката', 'foot-care-products', parent_id_var, 20),
      ('Hand Care Products', 'Продукти за грижа за ръцете', 'hand-care-products', parent_id_var, 21),
      ('Lip Care Products', 'Продукти за грижа за устните', 'lip-care-products', parent_id_var, 22),
      ('Body Scrubs', 'Скрабове за тяло', 'body-scrubs', parent_id_var, 23),
      ('Body Oils', 'Масла за тяло', 'body-oils', parent_id_var, 24)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;;
