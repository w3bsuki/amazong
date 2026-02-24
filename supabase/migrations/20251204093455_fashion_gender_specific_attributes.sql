
-- Add gender-specific attributes for Kids and Women's
DO $$
DECLARE
  v_kids_id UUID;
  v_womens_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO v_kids_id FROM categories WHERE slug = 'fashion-kids';
  SELECT id INTO v_womens_id FROM categories WHERE slug = 'fashion-womens';

  -- Kids: Age Range attribute
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (
    v_kids_id,
    'Age Range',
    'Възрастова група',
    'select',
    false,
    true,
    '["0-3 Months", "3-6 Months", "6-12 Months", "12-18 Months", "18-24 Months", "2-3 Years", "3-4 Years", "4-5 Years", "5-6 Years", "6-7 Years", "7-8 Years", "8-9 Years", "9-10 Years", "10-11 Years", "11-12 Years", "12-13 Years", "13-14 Years", "14-16 Years"]'::jsonb,
    '["0-3 месеца", "3-6 месеца", "6-12 месеца", "12-18 месеца", "18-24 месеца", "2-3 години", "3-4 години", "4-5 години", "5-6 години", "6-7 години", "7-8 години", "8-9 години", "9-10 години", "10-11 години", "11-12 години", "12-13 години", "13-14 години", "14-16 години"]'::jsonb,
    1
  );

  -- Kids: Kids Size attribute (separate from adult sizes)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (
    v_kids_id,
    'Kids Size',
    'Детски размер',
    'select',
    false,
    true,
    '["Newborn", "0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2T", "3T", "4T", "5T", "XXS (4)", "XS (5-6)", "S (7-8)", "M (10-12)", "L (14-16)", "XL (18-20)"]'::jsonb,
    '["Новородено", "0-3М", "3-6М", "6-9М", "9-12М", "12-18М", "18-24М", "2Т", "3Т", "4Т", "5Т", "XXS (4)", "XS (5-6)", "S (7-8)", "M (10-12)", "L (14-16)", "XL (18-20)"]'::jsonb,
    2
  );

  -- Kids: Kids Shoe Size EU
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (
    v_kids_id,
    'Kids Shoe Size EU',
    'Детски размер обувки EU',
    'select',
    false,
    true,
    '["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39"]'::jsonb,
    '["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39"]'::jsonb,
    3
  );

  -- Women's: Cup Size (for lingerie/swimwear)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (
    v_womens_id,
    'Cup Size',
    'Размер чашка',
    'select',
    false,
    true,
    '["AA", "A", "B", "C", "D", "DD/E", "DDD/F", "G", "H", "I", "J", "K"]'::jsonb,
    '["AA", "A", "B", "C", "D", "DD/E", "DDD/F", "G", "H", "I", "J", "K"]'::jsonb,
    1
  );

  -- Women's: Band Size (for bras)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (
    v_womens_id,
    'Band Size',
    'Размер лента',
    'select',
    false,
    true,
    '["28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50"]'::jsonb,
    '["60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115"]'::jsonb,
    2
  );

  -- Women's: Dress Length
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (
    v_womens_id,
    'Dress Length',
    'Дължина на рокля',
    'select',
    false,
    true,
    '["Mini", "Above Knee", "Knee Length", "Midi", "Maxi", "Floor Length", "High-Low", "Asymmetrical"]'::jsonb,
    '["Мини", "Над коляното", "До коляното", "Миди", "Макси", "До пода", "Висока-ниска", "Асиметрична"]'::jsonb,
    3
  );

  -- Women's: Skirt Length
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (
    v_womens_id,
    'Skirt Length',
    'Дължина на пола',
    'select',
    false,
    true,
    '["Micro Mini", "Mini", "Above Knee", "Knee Length", "Midi", "Maxi", "Ankle Length"]'::jsonb,
    '["Микро мини", "Мини", "Над коляното", "До коляното", "Миди", "Макси", "До глезена"]'::jsonb,
    4
  );

  RAISE NOTICE 'Added 7 gender-specific attributes: 3 for Kids, 4 for Womens';
END $$;
;
