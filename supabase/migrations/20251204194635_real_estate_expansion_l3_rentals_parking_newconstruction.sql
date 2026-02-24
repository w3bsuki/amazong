
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 3E: L3 FOR RENTALS, PARKING, NEW CONSTRUCTION
-- ============================================================================

-- L3 under Furnished Rentals
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'furnished-rentals'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Fully Furnished', 'Напълно обзаведени', 'fully-furnished-rent', 'Complete furnishings included', 'С пълно обзавеждане', 1),
    ('Partially Furnished', 'Частично обзаведени', 'partially-furnished', 'Basic furnishings included', 'С основно обзавеждане', 2),
    ('Luxury Furnished', 'Луксозно обзаведени', 'luxury-furnished-rent', 'High-end furnished rentals', 'Луксозно обзаведени имоти', 3),
    ('Corporate Housing', 'Корпоративни жилища', 'corporate-housing', 'Furnished for business travelers', 'За бизнес командировки', 4),
    ('Expat Rentals', 'Наем за чужденци', 'expat-rentals', 'Suitable for expatriates', 'Подходящи за чужденци', 5)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'furnished-rentals');

-- L3 under Short-Term Rentals
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'short-term-rentals'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Daily Rentals', 'Дневен наем', 'daily-rentals', 'Properties for daily rent', 'Имоти под наем на ден', 1),
    ('Weekly Rentals', 'Седмичен наем', 'weekly-rentals', 'Properties for weekly rent', 'Имоти под наем на седмица', 2),
    ('Monthly Rentals', 'Месечен наем', 'monthly-rentals', 'Properties for monthly rent', 'Имоти под наем на месец', 3),
    ('Airbnb Properties', 'Airbnb имоти', 'airbnb-properties', 'Airbnb suitable properties', 'Имоти подходящи за Airbnb', 4),
    ('Seasonal Rentals', 'Сезонен наем', 'seasonal-rentals', 'Seasonal rental properties', 'Сезонни имоти под наем', 5)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'short-term-rentals');

-- L3 under Student Housing
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'student-housing'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Student Apartments', 'Студентски апартаменти', 'student-apartments', 'Apartments near universities', 'Апартаменти близо до университети', 1),
    ('Student Rooms', 'Студентски стаи', 'student-rooms', 'Rooms for students', 'Стаи за студенти', 2),
    ('Student Studios', 'Студентски студия', 'student-studios', 'Studios for students', 'Студия за студенти', 3),
    ('Student Shared Housing', 'Студентско споделено', 'student-shared', 'Shared student accommodation', 'Споделено студентско жилище', 4),
    ('Dormitory Style', 'Общежитие', 'dormitory-style', 'Dormitory accommodation', 'Общежитие тип настаняване', 5)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'student-housing');

-- L3 under Garages
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'garages-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Single Garages', 'Единични гаражи', 'single-garages', 'Single car garages', 'Гаражи за един автомобил', 1),
    ('Double Garages', 'Двойни гаражи', 'double-garages', 'Two car garages', 'Гаражи за два автомобила', 2),
    ('Lockable Garages', 'Заключващи се гаражи', 'lockable-garages', 'Secure lockable garages', 'Сигурни заключващи се гаражи', 3),
    ('Electric Garages', 'Гаражи с ток', 'electric-garages', 'Garages with electricity', 'Гаражи с електричество', 4),
    ('Workshop Garages', 'Работилнични гаражи', 'workshop-garages', 'Garages suitable for workshop', 'Гаражи подходящи за работилница', 5)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'garages-sale');

-- L3 under New Apartments (New Construction)
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'new-apartments'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Act 16 Ready', 'С Акт 16', 'act16-apartments', 'Completed with Act 16', 'Завършени с Акт 16', 1),
    ('Act 15 Stage', 'Етап Акт 15', 'act15-apartments', 'Near completion Act 15', 'Близо до завършване Акт 15', 2),
    ('Under Construction', 'В строеж', 'under-construction-apt', 'Currently under construction', 'В момента в строеж', 3),
    ('Foundation Stage', 'Етап основи', 'foundation-stage', 'At foundation stage', 'На етап основи', 4),
    ('Early Bird Sales', 'Ранни продажби', 'early-bird-sales', 'Pre-construction discounts', 'Предстроителни отстъпки', 5),
    ('Green Building Certified', 'Зелено сертифициране', 'green-certified-new', 'Green building certified', 'Със зелен сертификат', 6)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'new-apartments');

-- L3 under New Developments
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'new-developments'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Residential Complexes', 'Жилищни комплекси', 'residential-complexes', 'New residential complexes', 'Нови жилищни комплекси', 1),
    ('Mixed-Use Developments', 'Смесени проекти', 'mixed-developments', 'Combined residential/commercial', 'Комбинирани жилищни/търговски', 2),
    ('Gated Developments', 'Затворени комплекси', 'gated-developments', 'Gated community developments', 'Затворени жилищни комплекси', 3),
    ('Waterfront Developments', 'Крайбрежни проекти', 'waterfront-developments', 'Waterfront new builds', 'Нови крайбрежни проекти', 4),
    ('City Center Developments', 'Централни проекти', 'city-center-developments', 'Urban center developments', 'Проекти в центъра на града', 5),
    ('Suburban Developments', 'Крайградски проекти', 'suburban-developments', 'Suburban new developments', 'Крайградски нови проекти', 6)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'new-developments');
;
