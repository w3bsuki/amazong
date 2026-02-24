-- Phase 2.1.3: Fashion L3 Categories - Batch 3: Plus Size, Vintage, Tech Accessories, Umbrellas, Keychains
-- Target: Complete remaining Fashion L2 categories that need L3 children

-- =====================================================
-- PLUS SIZE L3 CATEGORIES
-- =====================================================

-- Plus Size Dresses (fashion-plus-size-dresses)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Maxi Dresses', 'Midi Dresses', 'Mini Dresses', 'Wrap Dresses', 'A-Line Dresses', 'Bodycon Dresses', 'Shirt Dresses', 'Cocktail Dresses', 'Evening Dresses']),
  unnest(ARRAY['plus-dress-maxi', 'plus-dress-midi', 'plus-dress-mini', 'plus-dress-wrap', 'plus-dress-aline', 'plus-dress-bodycon', 'plus-dress-shirt', 'plus-dress-cocktail', 'plus-dress-evening']),
  (SELECT id FROM categories WHERE slug = 'fashion-plus-size-dresses'),
  unnest(ARRAY['Макси рокли', 'Миди рокли', 'Мини рокли', 'Прегърни рокли', 'А-линия рокли', 'Бодикон рокли', 'Рокли риза', 'Коктейлни рокли', 'Вечерни рокли']),
  '👗'
ON CONFLICT (slug) DO NOTHING;

-- Plus Size Shirts (fashion-plus-size-shirts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Button-Down Shirts', 'T-Shirts', 'Polo Shirts', 'Casual Shirts', 'Dress Shirts', 'Flannel Shirts', 'Oxford Shirts', 'Hawaiian Shirts']),
  unnest(ARRAY['plus-shirt-button-down', 'plus-shirt-tshirt', 'plus-shirt-polo', 'plus-shirt-casual', 'plus-shirt-dress', 'plus-shirt-flannel', 'plus-shirt-oxford', 'plus-shirt-hawaiian']),
  (SELECT id FROM categories WHERE slug = 'fashion-plus-size-shirts'),
  unnest(ARRAY['Ризи с копчета', 'Тениски', 'Поло ризи', 'Ежедневни ризи', 'Официални ризи', 'Фланелени ризи', 'Оксфорд ризи', 'Хавайски ризи']),
  '👔'
ON CONFLICT (slug) DO NOTHING;

-- Plus Size Tops (fashion-plus-size-tops)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Blouses', 'Tunics', 'Tank Tops', 'Crop Tops', 'Peplum Tops', 'Off-Shoulder Tops', 'Wrap Tops', 'Camisoles']),
  unnest(ARRAY['plus-top-blouse', 'plus-top-tunic', 'plus-top-tank', 'plus-top-crop', 'plus-top-peplum', 'plus-top-off-shoulder', 'plus-top-wrap', 'plus-top-camisole']),
  (SELECT id FROM categories WHERE slug = 'fashion-plus-size-tops'),
  unnest(ARRAY['Блузи', 'Туники', 'Потници', 'Къси топове', 'Пеплум топове', 'Топове с паднало рамо', 'Прегърни топове', 'Бретели']),
  '👚'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VINTAGE L3 CATEGORIES
-- =====================================================

-- Vintage Dresses (fashion-vintage-dresses)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['1950s Dresses', '1960s Dresses', '1970s Dresses', '1980s Dresses', '1990s Dresses', 'Rockabilly Dresses', 'Bohemian Dresses', 'Victorian Style']),
  unnest(ARRAY['vintage-dress-50s', 'vintage-dress-60s', 'vintage-dress-70s', 'vintage-dress-80s', 'vintage-dress-90s', 'vintage-dress-rockabilly', 'vintage-dress-bohemian', 'vintage-dress-victorian']),
  (SELECT id FROM categories WHERE slug = 'fashion-vintage-dresses'),
  unnest(ARRAY['Рокли от 50-те', 'Рокли от 60-те', 'Рокли от 70-те', 'Рокли от 80-те', 'Рокли от 90-те', 'Рокабили рокли', 'Бохо рокли', 'Викториански стил']),
  '👗'
ON CONFLICT (slug) DO NOTHING;

-- Vintage Jackets (fashion-vintage-jackets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Denim Jackets', 'Leather Jackets', 'Bomber Jackets', 'Varsity Jackets', 'Military Jackets', 'Blazers', 'Windbreakers', 'Fur & Faux Fur']),
  unnest(ARRAY['vintage-jacket-denim', 'vintage-jacket-leather', 'vintage-jacket-bomber', 'vintage-jacket-varsity', 'vintage-jacket-military', 'vintage-jacket-blazer', 'vintage-jacket-windbreaker', 'vintage-jacket-fur']),
  (SELECT id FROM categories WHERE slug = 'fashion-vintage-jackets'),
  unnest(ARRAY['Дънкови якета', 'Кожени якета', 'Бомбър якета', 'Варсити якета', 'Военни якета', 'Сака', 'Ветровки', 'Косми и изкуствена кожа']),
  '🧥'
ON CONFLICT (slug) DO NOTHING;

-- Vintage Accessories (fashion-vintage-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Vintage Bags', 'Vintage Jewelry', 'Vintage Scarves', 'Vintage Hats', 'Vintage Belts', 'Vintage Sunglasses', 'Vintage Watches', 'Vintage Brooches']),
  unnest(ARRAY['vintage-acc-bags', 'vintage-acc-jewelry', 'vintage-acc-scarves', 'vintage-acc-hats', 'vintage-acc-belts', 'vintage-acc-sunglasses', 'vintage-acc-watches', 'vintage-acc-brooches']),
  (SELECT id FROM categories WHERE slug = 'fashion-vintage-accessories'),
  unnest(ARRAY['Винтидж чанти', 'Винтидж бижута', 'Винтидж шалове', 'Винтидж шапки', 'Винтидж колани', 'Винтидж слънчеви очила', 'Винтидж часовници', 'Винтидж брошки']),
  '🎀'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- OTHER FASHION L3 CATEGORIES
-- =====================================================

-- Tech Accessories (accessories-tech)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Phone Cases', 'Tablet Cases', 'Laptop Sleeves', 'Watch Bands', 'AirPods Cases', 'Charging Cables', 'Power Banks', 'Cable Organizers']),
  unnest(ARRAY['tech-acc-phone-cases', 'tech-acc-tablet-cases', 'tech-acc-laptop-sleeves', 'tech-acc-watch-bands', 'tech-acc-airpods-cases', 'tech-acc-charging-cables', 'tech-acc-power-banks', 'tech-acc-cable-organizers']),
  (SELECT id FROM categories WHERE slug = 'accessories-tech'),
  unnest(ARRAY['Калъфи за телефон', 'Калъфи за таблет', 'Калъфи за лаптоп', 'Каишки за часовник', 'Калъфи за AirPods', 'Зарядни кабели', 'Външни батерии', 'Организатори за кабели']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Umbrellas (accessories-umbrellas)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Compact Umbrellas', 'Golf Umbrellas', 'Automatic Umbrellas', 'UV Protection Umbrellas', 'Designer Umbrellas', 'Clear Umbrellas', 'Kids Umbrellas', 'Travel Umbrellas']),
  unnest(ARRAY['umbrella-compact', 'umbrella-golf', 'umbrella-automatic', 'umbrella-uv', 'umbrella-designer', 'umbrella-clear', 'umbrella-kids', 'umbrella-travel']),
  (SELECT id FROM categories WHERE slug = 'accessories-umbrellas'),
  unnest(ARRAY['Компактни чадъри', 'Голф чадъри', 'Автоматични чадъри', 'UV защита чадъри', 'Дизайнерски чадъри', 'Прозрачни чадъри', 'Детски чадъри', 'Пътни чадъри']),
  '☂️'
ON CONFLICT (slug) DO NOTHING;

-- Keychains & Small Accessories (accessories-keychains)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Metal Keychains', 'Leather Keychains', 'Designer Keychains', 'Novelty Keychains', 'Carabiner Keychains', 'Smart Keychains', 'Keyfobs', 'Bag Charms']),
  unnest(ARRAY['keychain-metal', 'keychain-leather', 'keychain-designer', 'keychain-novelty', 'keychain-carabiner', 'keychain-smart', 'keychain-fobs', 'keychain-bag-charms']),
  (SELECT id FROM categories WHERE slug = 'accessories-keychains'),
  unnest(ARRAY['Метални ключодържатели', 'Кожени ключодържатели', 'Дизайнерски ключодържатели', 'Забавни ключодържатели', 'Карабинер ключодържатели', 'Смарт ключодържатели', 'Ключодържатели', 'Висулки за чанта']),
  '🔑'
ON CONFLICT (slug) DO NOTHING;;
