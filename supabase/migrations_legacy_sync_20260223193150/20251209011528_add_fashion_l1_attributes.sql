
-- Add universal fashion attributes to L1 categories (Men's, Women's, Kids, Unisex)
-- These will cascade down to subcategories via the inheritance logic

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  attr.name,
  attr.name_bg,
  attr.attribute_type,
  attr.is_required,
  attr.is_filterable,
  attr.options::jsonb,
  attr.options_bg::jsonb,
  attr.sort_order
FROM categories c
CROSS JOIN (VALUES
  ('Size', 'Размер', 'select', true, true, '["XXS","XS","S","M","L","XL","XXL","3XL","4XL","One Size"]'::text, '["XXS","XS","S","M","L","XL","XXL","3XL","4XL","Един размер"]'::text, 1),
  ('Color', 'Цвят', 'select', false, true, '["Black","White","Navy","Gray","Blue","Red","Green","Beige","Brown","Pink","Purple","Yellow","Orange","Multi"]'::text, '["Черно","Бяло","Тъмносиньо","Сиво","Синьо","Червено","Зелено","Бежово","Кафяво","Розово","Лилаво","Жълто","Оранжево","Многоцветно"]'::text, 2),
  ('Condition', 'Състояние', 'select', true, true, '["New with tags","New without tags","Like new","Good","Fair"]'::text, '["Ново с етикет","Ново без етикет","Като ново","Добро","Задоволително"]'::text, 3),
  ('Brand', 'Марка', 'select', false, true, '["Zara","H&M","Mango","Reserved","Bershka","Pull&Bear","Nike","Adidas","Puma","Levi''s","Tommy Hilfiger","Calvin Klein","Guess","Other"]'::text, '["Zara","H&M","Mango","Reserved","Bershka","Pull&Bear","Nike","Adidas","Puma","Levi''s","Tommy Hilfiger","Calvin Klein","Guess","Друга"]'::text, 4),
  ('Material', 'Материал', 'select', false, true, '["Cotton","Polyester","Wool","Silk","Linen","Denim","Leather","Synthetic","Blend","Other"]'::text, '["Памук","Полиестер","Вълна","Коприна","Лен","Деним","Кожа","Синтетика","Смес","Друг"]'::text, 5),
  ('Style', 'Стил', 'multiselect', false, true, '["Casual","Formal","Sporty","Elegant","Streetwear","Vintage","Bohemian","Minimalist"]'::text, '["Ежедневен","Официален","Спортен","Елегантен","Улична мода","Винтидж","Бохемски","Минималистичен"]'::text, 6),
  ('Season', 'Сезон', 'multiselect', false, true, '["Spring","Summer","Fall","Winter","All Season"]'::text, '["Пролет","Лято","Есен","Зима","Целогодишен"]'::text, 7)
) AS attr(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
WHERE c.slug IN ('fashion-mens', 'fashion-womens', 'fashion-kids', 'fashion-unisex')
ON CONFLICT DO NOTHING;
;
