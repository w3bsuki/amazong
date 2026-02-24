-- =====================================================
-- SERVICES ATTRIBUTES: BOOKING, BUSINESS & PROFESSIONAL
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, placeholder, placeholder_bg, sort_order) VALUES

-- BOOKING & SCHEDULING (new ones only)
('c1d2e3f4-0004-4000-8000-000000000001', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Deposit Required', 'Изисква се депозит', 'select', false, true,
 '["No Deposit", "10%", "20%", "30%", "50%", "Full Payment Upfront"]'::jsonb,
 '["Без депозит", "10%", "20%", "30%", "50%", "Пълно предплащане"]'::jsonb,
 'Select deposit requirement', 'Изберете изискване за депозит', 26),

('c1d2e3f4-0004-4000-8000-000000000002', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Minimum Booking', 'Минимална резервация', 'select', false, true,
 '["No Minimum", "1 Hour", "2 Hours", "Half Day", "Full Day", "Per Job"]'::jsonb,
 '["Без минимум", "1 час", "2 часа", "Половин ден", "Цял ден", "На задача"]'::jsonb,
 'Select minimum booking', 'Изберете минимална резервация', 27),

('c1d2e3f4-0004-4000-8000-000000000003', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Cancellation Policy', 'Политика за отказ', 'select', false, true,
 '["Free Cancellation", "24 Hour Notice", "48 Hour Notice", "72 Hour Notice", "Non-refundable", "Partial Refund"]'::jsonb,
 '["Безплатен отказ", "24 часа предизвестие", "48 часа предизвестие", "72 часа предизвестие", "Без възстановяване", "Частично възстановяване"]'::jsonb,
 'Select cancellation policy', 'Изберете политика за отказ', 28),

('c1d2e3f4-0004-4000-8000-000000000004', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Payment Methods', 'Методи на плащане', 'multiselect', false, true,
 '["Cash", "Bank Transfer", "Credit/Debit Card", "PayPal", "ePay", "Revolut", "Invoice", "Installments"]'::jsonb,
 '["В брой", "Банков превод", "Кредитна/Дебитна карта", "PayPal", "ePay", "Revolut", "Фактура", "На изплащане"]'::jsonb,
 'Select payment methods', 'Изберете методи на плащане', 29),

('c1d2e3f4-0004-4000-8000-000000000005', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Booking Method', 'Метод на резервация', 'multiselect', false, true,
 '["Phone Call", "WhatsApp", "Viber", "Email", "Online Form", "In-App Booking", "Walk-in"]'::jsonb,
 '["Телефонно обаждане", "WhatsApp", "Viber", "Имейл", "Онлайн форма", "Резервация в приложение", "На място"]'::jsonb,
 'Select booking methods', 'Изберете методи за резервация', 30),

-- PROFESSIONAL CREDENTIALS
('c1d2e3f4-0004-4000-8000-000000000006', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'License Number', 'Номер на лиценз', 'text', false, false,
 NULL, NULL,
 'Enter license number', 'Въведете номер на лиценз', 31),

('c1d2e3f4-0004-4000-8000-000000000007', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Languages Spoken', 'Езици', 'multiselect', false, true,
 '["Bulgarian", "English", "German", "Russian", "French", "Spanish", "Turkish", "Greek", "Romanian", "Other"]'::jsonb,
 '["Български", "Английски", "Немски", "Руски", "Френски", "Испански", "Турски", "Гръцки", "Румънски", "Друг"]'::jsonb,
 'Select languages', 'Изберете езици', 32),

('c1d2e3f4-0004-4000-8000-000000000008', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'VAT Registered', 'Регистрация по ДДС', 'select', false, true,
 '["Yes", "No"]'::jsonb,
 '["Да", "Не"]'::jsonb,
 'VAT registration status', 'Статус на ДДС регистрация', 33),

('c1d2e3f4-0004-4000-8000-000000000009', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Invoice Available', 'Издава фактура', 'select', false, true,
 '["Yes", "No", "Upon Request"]'::jsonb,
 '["Да", "Не", "При поискване"]'::jsonb,
 'Invoice availability', 'Издаване на фактура', 34),

('c1d2e3f4-0004-4000-8000-000000000010', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Years in Business', 'Години в бизнеса', 'select', false, true,
 '["Less than 1 year", "1-2 years", "3-5 years", "5-10 years", "10-20 years", "20+ years"]'::jsonb,
 '["По-малко от 1 година", "1-2 години", "3-5 години", "5-10 години", "10-20 години", "20+ години"]'::jsonb,
 'Select years in business', 'Изберете години в бизнеса', 35),

('c1d2e3f4-0004-4000-8000-000000000011', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Team Size', 'Размер на екипа', 'select', false, true,
 '["Solo/Individual", "2-5 people", "6-10 people", "11-25 people", "26-50 people", "50+ people"]'::jsonb,
 '["Самостоятелен", "2-5 души", "6-10 души", "11-25 души", "26-50 души", "50+ души"]'::jsonb,
 'Select team size', 'Изберете размер на екипа', 36),

('c1d2e3f4-0004-4000-8000-000000000012', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Rating', 'Рейтинг', 'select', false, true,
 '["5 Stars", "4+ Stars", "3+ Stars", "New Provider"]'::jsonb,
 '["5 звезди", "4+ звезди", "3+ звезди", "Нов доставчик"]'::jsonb,
 'Provider rating', 'Рейтинг на доставчика', 37),

('c1d2e3f4-0004-4000-8000-000000000013', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Reviews Count', 'Брой отзиви', 'number', false, false,
 NULL, NULL,
 'Number of reviews', 'Брой отзиви', 38),

('c1d2e3f4-0004-4000-8000-000000000014', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Portfolio URL', 'URL на портфолио', 'text', false, false,
 NULL, NULL,
 'Enter portfolio URL', 'Въведете URL на портфолио', 39),

('c1d2e3f4-0004-4000-8000-000000000015', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Website', 'Уебсайт', 'text', false, false,
 NULL, NULL,
 'Enter website URL', 'Въведете уебсайт', 40);;
