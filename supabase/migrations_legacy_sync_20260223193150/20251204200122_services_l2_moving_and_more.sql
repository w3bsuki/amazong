-- =====================================================
-- SERVICES L2: MOVING & RELOCATION (b1c2d3e4-1111-4000-8000-000000000003)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Local Moving
('b1c2d3e4-2004-4000-8000-000000000001', 'Local Moving', 'Местно преместване', 'moving-local', 'b1c2d3e4-1111-4000-8000-000000000003', '🚚', 1),
-- Long Distance Moving
('b1c2d3e4-2004-4000-8000-000000000002', 'Long Distance Moving', 'Преместване на дълги разстояния', 'moving-long-distance', 'b1c2d3e4-1111-4000-8000-000000000003', '🛤️', 2),
-- International Moving
('b1c2d3e4-2004-4000-8000-000000000003', 'International Moving', 'Международно преместване', 'moving-international', 'b1c2d3e4-1111-4000-8000-000000000003', '🌍', 3),
-- Packing Services
('b1c2d3e4-2004-4000-8000-000000000004', 'Packing Services', 'Услуги по опаковане', 'moving-packing', 'b1c2d3e4-1111-4000-8000-000000000003', '📦', 4),
-- Storage Services
('b1c2d3e4-2004-4000-8000-000000000005', 'Storage Services', 'Складови услуги', 'moving-storage', 'b1c2d3e4-1111-4000-8000-000000000003', '🏢', 5),
-- Furniture Assembly
('b1c2d3e4-2004-4000-8000-000000000006', 'Furniture Assembly', 'Сглобяване на мебели', 'moving-furniture-assembly', 'b1c2d3e4-1111-4000-8000-000000000003', '🔧', 6),
-- Junk Removal
('b1c2d3e4-2004-4000-8000-000000000007', 'Junk Removal', 'Извозване на боклук', 'moving-junk-removal', 'b1c2d3e4-1111-4000-8000-000000000003', '🗑️', 7),
-- Office Moving
('b1c2d3e4-2004-4000-8000-000000000008', 'Office Moving', 'Преместване на офиси', 'moving-office', 'b1c2d3e4-1111-4000-8000-000000000003', '🏢', 8),
-- Piano Moving
('b1c2d3e4-2004-4000-8000-000000000009', 'Piano & Heavy Items', 'Пиано и тежки предмети', 'moving-piano-heavy', 'b1c2d3e4-1111-4000-8000-000000000003', '🎹', 9),
-- Truck Rental
('b1c2d3e4-2004-4000-8000-000000000010', 'Truck & Van Rental', 'Наем на камион', 'moving-truck-rental', 'b1c2d3e4-1111-4000-8000-000000000003', '🚛', 10);

-- =====================================================
-- SERVICES L2: WELLNESS SERVICES (b1c2d3e4-1111-4000-8000-000000000004)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Therapy & Counseling
('b1c2d3e4-2005-4000-8000-000000000001', 'Therapy & Counseling', 'Терапия и консултиране', 'wellness-therapy', 'b1c2d3e4-1111-4000-8000-000000000004', '🧠', 1),
-- Nutrition & Diet
('b1c2d3e4-2005-4000-8000-000000000002', 'Nutrition & Diet', 'Хранене и диети', 'wellness-nutrition', 'b1c2d3e4-1111-4000-8000-000000000004', '🥗', 2),
-- Personal Training
('b1c2d3e4-2005-4000-8000-000000000003', 'Personal Training', 'Персонални тренировки', 'wellness-personal-training', 'b1c2d3e4-1111-4000-8000-000000000004', '💪', 3),
-- Yoga & Pilates
('b1c2d3e4-2005-4000-8000-000000000004', 'Yoga & Pilates', 'Йога и пилатес', 'wellness-yoga-pilates', 'b1c2d3e4-1111-4000-8000-000000000004', '🧘', 4),
-- Massage Services
('b1c2d3e4-2005-4000-8000-000000000005', 'Massage Services', 'Масажни услуги', 'wellness-massage', 'b1c2d3e4-1111-4000-8000-000000000004', '💆', 5),
-- Elderly Care
('b1c2d3e4-2005-4000-8000-000000000006', 'Elderly Care', 'Грижа за възрастни', 'wellness-elderly-care', 'b1c2d3e4-1111-4000-8000-000000000004', '👴', 6),
-- Home Healthcare
('b1c2d3e4-2005-4000-8000-000000000007', 'Home Healthcare', 'Домашни здравни грижи', 'wellness-home-healthcare', 'b1c2d3e4-1111-4000-8000-000000000004', '🏥', 7),
-- Alternative Medicine
('b1c2d3e4-2005-4000-8000-000000000008', 'Alternative Medicine', 'Алтернативна медицина', 'wellness-alternative', 'b1c2d3e4-1111-4000-8000-000000000004', '🌿', 8),
-- Acupuncture
('b1c2d3e4-2005-4000-8000-000000000009', 'Acupuncture', 'Акупунктура', 'wellness-acupuncture', 'b1c2d3e4-1111-4000-8000-000000000004', '📍', 9),
-- Chiropractic
('b1c2d3e4-2005-4000-8000-000000000010', 'Chiropractic', 'Хиропрактика', 'wellness-chiropractic', 'b1c2d3e4-1111-4000-8000-000000000004', '🦴', 10),
-- Life Coaching
('b1c2d3e4-2005-4000-8000-000000000011', 'Life Coaching', 'Лайф коучинг', 'wellness-life-coaching', 'b1c2d3e4-1111-4000-8000-000000000004', '🎯', 11),
-- Rehabilitation
('b1c2d3e4-2005-4000-8000-000000000012', 'Rehabilitation Services', 'Рехабилитация', 'wellness-rehabilitation', 'b1c2d3e4-1111-4000-8000-000000000004', '🏃', 12);;
