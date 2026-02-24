-- =====================================================
-- SERVICES ATTRIBUTES: AVAILABILITY & LOCATION
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, placeholder, placeholder_bg, sort_order) VALUES

-- AVAILABILITY
('c1d2e3f4-0002-4000-8000-000000000001', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Availability', 'Наличност', 'select', false, true,
 '["Available Now", "Available This Week", "Available Next Week", "By Appointment Only", "Weekends Only", "Evenings Only", "24/7 Available"]'::jsonb,
 '["Налично веднага", "Налично тази седмица", "Налично следващата седмица", "Само с уговорка", "Само уикенди", "Само вечер", "24/7 наличен"]'::jsonb,
 'Select availability', 'Изберете наличност', 12),

('c1d2e3f4-0002-4000-8000-000000000002', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Working Days', 'Работни дни', 'multiselect', false, true,
 '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]'::jsonb,
 '["Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота", "Неделя"]'::jsonb,
 'Select working days', 'Изберете работни дни', 13),

('c1d2e3f4-0002-4000-8000-000000000003', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Working Hours', 'Работно време', 'select', false, true,
 '["Morning (8-12)", "Afternoon (12-18)", "Evening (18-22)", "Full Day (8-18)", "Flexible Hours", "24 Hours"]'::jsonb,
 '["Сутрин (8-12)", "Следобед (12-18)", "Вечер (18-22)", "Цял ден (8-18)", "Гъвкаво работно време", "24 часа"]'::jsonb,
 'Select working hours', 'Изберете работно време', 14),

('c1d2e3f4-0002-4000-8000-000000000004', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Response Time', 'Време за отговор', 'select', false, true,
 '["Within 1 hour", "Within 4 hours", "Same Day", "Within 24 hours", "Within 48 hours", "Within a week"]'::jsonb,
 '["До 1 час", "До 4 часа", "Същия ден", "До 24 часа", "До 48 часа", "До седмица"]'::jsonb,
 'Select response time', 'Изберете време за отговор', 15),

('c1d2e3f4-0002-4000-8000-000000000005', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Lead Time', 'Срок за изпълнение', 'select', false, true,
 '["Same Day", "1-2 Days", "3-5 Days", "1 Week", "2 Weeks", "1 Month", "Custom"]'::jsonb,
 '["Същия ден", "1-2 дни", "3-5 дни", "1 седмица", "2 седмици", "1 месец", "По договаряне"]'::jsonb,
 'Select lead time', 'Изберете срок за изпълнение', 16),

-- LOCATION & SERVICE AREA
('c1d2e3f4-0002-4000-8000-000000000006', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Service Location', 'Място на услугата', 'select', false, true,
 '["On-Site (Client Location)", "At Provider Location", "Remote/Online", "Both On-Site and Remote", "Mobile Service"]'::jsonb,
 '["На място при клиента", "При изпълнителя", "Дистанционно/Онлайн", "На място и дистанционно", "Мобилна услуга"]'::jsonb,
 'Select service location', 'Изберете място на услугата', 17),

('c1d2e3f4-0002-4000-8000-000000000007', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Service Area', 'Район на обслужване', 'select', false, true,
 '["Sofia Only", "Sofia Region", "Nationwide", "Multiple Cities", "International", "Online Only"]'::jsonb,
 '["Само София", "Софийска област", "В цялата страна", "Няколко града", "Международно", "Само онлайн"]'::jsonb,
 'Select service area', 'Изберете район на обслужване', 18),

('c1d2e3f4-0002-4000-8000-000000000008', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Travel Radius (km)', 'Радиус на пътуване (км)', 'select', false, true,
 '["5 km", "10 km", "20 km", "30 km", "50 km", "100 km", "Unlimited"]'::jsonb,
 '["5 км", "10 км", "20 км", "30 км", "50 км", "100 км", "Без ограничение"]'::jsonb,
 'Select travel radius', 'Изберете радиус на пътуване', 19),

('c1d2e3f4-0002-4000-8000-000000000009', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'City Coverage', 'Покритие по градове', 'multiselect', false, true,
 '["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen", "Other"]'::jsonb,
 '["София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора", "Плевен", "Сливен", "Добрич", "Шумен", "Друг"]'::jsonb,
 'Select cities covered', 'Изберете покрити градове', 20);;
