
-- Phase 5: Wholesale L3 Categories - Automotive & Beauty

-- Wholesale Automotive L3s
INSERT INTO categories (name, name_bg, slug, parent_id)
SELECT name, name_bg, slug, parent_id FROM (VALUES
  -- Auto Tools & Equipment
  ('Hand Tools', 'Ръчни инструменти', 'wholesale-hand-tools', (SELECT id FROM categories WHERE slug = 'wholesale-auto-tools')),
  ('Power Tools', 'Електроинструменти', 'wholesale-power-tools-auto', (SELECT id FROM categories WHERE slug = 'wholesale-auto-tools')),
  ('Diagnostic Equipment', 'Диагностично оборудване', 'wholesale-diagnostic-equipment', (SELECT id FROM categories WHERE slug = 'wholesale-auto-tools')),
  ('Lifting Equipment', 'Подемно оборудване', 'wholesale-lifting-equipment', (SELECT id FROM categories WHERE slug = 'wholesale-auto-tools')),
  ('Garage Equipment', 'Гаражно оборудване', 'wholesale-garage-equipment', (SELECT id FROM categories WHERE slug = 'wholesale-auto-tools')),
  
  -- Car Care & Cleaning
  ('Car Wash Supplies', 'Автомивка консумативи', 'wholesale-car-wash-supplies', (SELECT id FROM categories WHERE slug = 'wholesale-car-care')),
  ('Polishing Products', 'Полиращи продукти', 'wholesale-polishing-products', (SELECT id FROM categories WHERE slug = 'wholesale-car-care')),
  ('Interior Care', 'Грижа за интериора', 'wholesale-interior-care', (SELECT id FROM categories WHERE slug = 'wholesale-car-care')),
  ('Detailing Supplies', 'Детайлинг консумативи', 'wholesale-detailing-supplies', (SELECT id FROM categories WHERE slug = 'wholesale-car-care')),
  
  -- Car Parts & Accessories
  ('Engine Parts', 'Части за двигател', 'wholesale-engine-parts', (SELECT id FROM categories WHERE slug = 'wholesale-car-parts')),
  ('Brake Systems', 'Спирачни системи', 'wholesale-brake-systems', (SELECT id FROM categories WHERE slug = 'wholesale-car-parts')),
  ('Suspension Parts', 'Окачване части', 'wholesale-suspension-parts', (SELECT id FROM categories WHERE slug = 'wholesale-car-parts')),
  ('Body Parts', 'Части за каросерия', 'wholesale-body-parts', (SELECT id FROM categories WHERE slug = 'wholesale-car-parts')),
  ('Electrical Parts', 'Електрически части', 'wholesale-electrical-parts-auto', (SELECT id FROM categories WHERE slug = 'wholesale-car-parts')),
  ('Filters', 'Филтри', 'wholesale-filters-auto', (SELECT id FROM categories WHERE slug = 'wholesale-car-parts')),
  
  -- Car Electronics
  ('Car Audio', 'Авто аудио', 'wholesale-car-audio', (SELECT id FROM categories WHERE slug = 'wholesale-car-electronics')),
  ('GPS & Navigation', 'GPS и навигация', 'wholesale-gps-navigation', (SELECT id FROM categories WHERE slug = 'wholesale-car-electronics')),
  ('Dash Cameras', 'Видеорегистратори', 'wholesale-dash-cameras', (SELECT id FROM categories WHERE slug = 'wholesale-car-electronics')),
  ('Car Alarms', 'Автоаларми', 'wholesale-car-alarms', (SELECT id FROM categories WHERE slug = 'wholesale-car-electronics')),
  
  -- Tires & Wheels
  ('Summer Tires', 'Летни гуми', 'wholesale-summer-tires', (SELECT id FROM categories WHERE slug = 'wholesale-tires-wheels')),
  ('Winter Tires', 'Зимни гуми', 'wholesale-winter-tires', (SELECT id FROM categories WHERE slug = 'wholesale-tires-wheels')),
  ('All-Season Tires', 'Всесезонни гуми', 'wholesale-allseason-tires', (SELECT id FROM categories WHERE slug = 'wholesale-tires-wheels')),
  ('Alloy Wheels', 'Алуминиеви джанти', 'wholesale-alloy-wheels', (SELECT id FROM categories WHERE slug = 'wholesale-tires-wheels')),
  ('Steel Wheels', 'Стоманени джанти', 'wholesale-steel-wheels', (SELECT id FROM categories WHERE slug = 'wholesale-tires-wheels'))
) AS t(name, name_bg, slug, parent_id)
ON CONFLICT (slug) DO NOTHING;

-- Wholesale Beauty L3s
INSERT INTO categories (name, name_bg, slug, parent_id)
SELECT name, name_bg, slug, parent_id FROM (VALUES
  -- Hair Care
  ('Shampoos & Conditioners', 'Шампоани и балсами', 'wholesale-shampoos-conditioners', (SELECT id FROM categories WHERE slug = 'wholesale-hair-care')),
  ('Hair Styling Products', 'Продукти за стайлинг', 'wholesale-hair-styling', (SELECT id FROM categories WHERE slug = 'wholesale-hair-care')),
  ('Hair Color', 'Боя за коса', 'wholesale-hair-color', (SELECT id FROM categories WHERE slug = 'wholesale-hair-care')),
  ('Hair Treatment', 'Лечебни продукти за коса', 'wholesale-hair-treatment', (SELECT id FROM categories WHERE slug = 'wholesale-hair-care')),
  ('Hair Accessories', 'Аксесоари за коса', 'wholesale-hair-accessories-beauty', (SELECT id FROM categories WHERE slug = 'wholesale-hair-care')),
  
  -- Nail Products
  ('Nail Polish', 'Лак за нокти', 'wholesale-nail-polish', (SELECT id FROM categories WHERE slug = 'wholesale-nail-products')),
  ('Gel & Acrylic', 'Гел и акрил', 'wholesale-gel-acrylic', (SELECT id FROM categories WHERE slug = 'wholesale-nail-products')),
  ('Nail Art Supplies', 'Консумативи за маникюр арт', 'wholesale-nail-art', (SELECT id FROM categories WHERE slug = 'wholesale-nail-products')),
  ('Nail Tools', 'Инструменти за маникюр', 'wholesale-nail-tools', (SELECT id FROM categories WHERE slug = 'wholesale-nail-products')),
  ('UV/LED Lamps', 'UV/LED лампи', 'wholesale-uv-led-lamps', (SELECT id FROM categories WHERE slug = 'wholesale-nail-products')),
  
  -- Fragrances
  ('Women''s Perfumes', 'Дамски парфюми', 'wholesale-womens-perfumes', (SELECT id FROM categories WHERE slug = 'wholesale-fragrances')),
  ('Men''s Colognes', 'Мъжки парфюми', 'wholesale-mens-colognes', (SELECT id FROM categories WHERE slug = 'wholesale-fragrances')),
  ('Unisex Fragrances', 'Унисекс парфюми', 'wholesale-unisex-fragrances', (SELECT id FROM categories WHERE slug = 'wholesale-fragrances')),
  ('Body Mists', 'Спрейове за тяло', 'wholesale-body-mists', (SELECT id FROM categories WHERE slug = 'wholesale-fragrances')),
  
  -- Personal Care
  ('Oral Care', 'Устна хигиена', 'wholesale-oral-care', (SELECT id FROM categories WHERE slug = 'wholesale-personal-care')),
  ('Body Wash & Soaps', 'Душ гелове и сапуни', 'wholesale-body-wash-soaps', (SELECT id FROM categories WHERE slug = 'wholesale-personal-care')),
  ('Deodorants', 'Дезодоранти', 'wholesale-deodorants', (SELECT id FROM categories WHERE slug = 'wholesale-personal-care')),
  ('Shaving Products', 'Продукти за бръснене', 'wholesale-shaving-products', (SELECT id FROM categories WHERE slug = 'wholesale-personal-care')),
  
  -- Beauty Tools
  ('Hair Dryers & Stylers', 'Сешоари и преси', 'wholesale-hair-dryers-stylers', (SELECT id FROM categories WHERE slug = 'wholesale-beauty-tools')),
  ('Makeup Brushes', 'Четки за грим', 'wholesale-makeup-brushes', (SELECT id FROM categories WHERE slug = 'wholesale-beauty-tools')),
  ('Mirrors', 'Огледала', 'wholesale-mirrors-beauty', (SELECT id FROM categories WHERE slug = 'wholesale-beauty-tools')),
  ('Epilators & Trimmers', 'Епилатори и тримери', 'wholesale-epilators-trimmers', (SELECT id FROM categories WHERE slug = 'wholesale-beauty-tools'))
) AS t(name, name_bg, slug, parent_id)
ON CONFLICT (slug) DO NOTHING;
;
