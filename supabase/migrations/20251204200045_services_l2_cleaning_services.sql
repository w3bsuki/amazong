-- =====================================================
-- SERVICES L2: CLEANING SERVICES (b1c2d3e4-1111-4000-8000-000000000001)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Residential Cleaning
('b1c2d3e4-2002-4000-8000-000000000001', 'Residential Cleaning', 'Почистване на жилища', 'cleaning-residential', 'b1c2d3e4-1111-4000-8000-000000000001', '🏠', 1),
-- Commercial Cleaning
('b1c2d3e4-2002-4000-8000-000000000002', 'Commercial Cleaning', 'Почистване на офиси', 'cleaning-commercial', 'b1c2d3e4-1111-4000-8000-000000000001', '🏢', 2),
-- Deep Cleaning
('b1c2d3e4-2002-4000-8000-000000000003', 'Deep Cleaning', 'Основно почистване', 'cleaning-deep', 'b1c2d3e4-1111-4000-8000-000000000001', '✨', 3),
-- Move In/Out Cleaning
('b1c2d3e4-2002-4000-8000-000000000004', 'Move In/Out Cleaning', 'Почистване при нанасяне/изнасяне', 'cleaning-move-inout', 'b1c2d3e4-1111-4000-8000-000000000001', '📦', 4),
-- Carpet Cleaning
('b1c2d3e4-2002-4000-8000-000000000005', 'Carpet Cleaning', 'Пране на килими', 'cleaning-carpet', 'b1c2d3e4-1111-4000-8000-000000000001', '🧹', 5),
-- Window Cleaning
('b1c2d3e4-2002-4000-8000-000000000006', 'Window Cleaning', 'Почистване на прозорци', 'cleaning-window', 'b1c2d3e4-1111-4000-8000-000000000001', '🪟', 6),
-- Upholstery Cleaning
('b1c2d3e4-2002-4000-8000-000000000007', 'Upholstery Cleaning', 'Пране на мебели', 'cleaning-upholstery', 'b1c2d3e4-1111-4000-8000-000000000001', '🛋️', 7),
-- Post-Construction
('b1c2d3e4-2002-4000-8000-000000000008', 'Post-Construction Cleaning', 'Следремонтно почистване', 'cleaning-post-construction', 'b1c2d3e4-1111-4000-8000-000000000001', '🏗️', 8),
-- Pressure Washing
('b1c2d3e4-2002-4000-8000-000000000009', 'Pressure Washing', 'Почистване с водоструйка', 'cleaning-pressure-washing', 'b1c2d3e4-1111-4000-8000-000000000001', '💦', 9),
-- Duct Cleaning
('b1c2d3e4-2002-4000-8000-000000000010', 'Duct & Vent Cleaning', 'Почистване на вентилация', 'cleaning-duct-vent', 'b1c2d3e4-1111-4000-8000-000000000001', '💨', 10),
-- Gutter Cleaning
('b1c2d3e4-2002-4000-8000-000000000011', 'Gutter Cleaning', 'Почистване на улуци', 'cleaning-gutter', 'b1c2d3e4-1111-4000-8000-000000000001', '🍂', 11),
-- Industrial Cleaning
('b1c2d3e4-2002-4000-8000-000000000012', 'Industrial Cleaning', 'Индустриално почистване', 'cleaning-industrial', 'b1c2d3e4-1111-4000-8000-000000000001', '🏭', 12);;
