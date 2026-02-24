
-- WHOLESALE ATTRIBUTES - Bulgarian B2B Market Specific (Part 7)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 33. Invoice Type (Фактура)
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Invoice Type', 'Тип фактура', 'select', false, true,
'["Company Invoice (VAT)", "EU Invoice", "Export Invoice (No VAT)", "Pro Forma Invoice", "Cash Receipt"]',
'["Фирмена фактура (с ДДС)", "ЕС фактура", "Износ фактура (без ДДС)", "Про форма фактура", "Касова бележка"]', 33),

-- 34. VAT Status (ДДС статус)
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'VAT Status', 'ДДС статус', 'select', false, true,
'["VAT Registered", "Non-VAT Registered", "VAT Exempt Transaction", "Reverse Charge (EU)", "Zero Rate (Export)"]',
'["Регистриран по ДДС", "Нерегистриран по ДДС", "Освободена сделка", "Обратно начисляване (ЕС)", "Нулева ставка (Износ)"]', 34),

-- 35. BULSTAT/EIK Required
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'BULSTAT/EIK Required', 'Изисква се БУЛСТАТ/ЕИК', 'select', false, true,
'["Required for B2B", "Not Required", "Preferred", "Required for Invoicing"]',
'["Изисква се за B2B", "Не се изисква", "Предпочитано", "Изисква се за фактуриране"]', 35),

-- 36. Bulgaria Delivery
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Bulgaria Delivery', 'Доставка в България', 'multiselect', false, true,
'["Econt Business", "Speedy Business", "Own Transport", "Pallet Delivery", "Express Delivery", "Standard Delivery", "Self Pickup (Sofia)", "Self Pickup (Other City)"]',
'["Еконт Бизнес", "Спиди Бизнес", "Собствен транспорт", "Палетна доставка", "Експресна доставка", "Стандартна доставка", "Лично вземане (София)", "Лично вземане (Друг град)"]', 36),

-- 37. Minimum Order Value Bulgaria
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Min Order Value (Bulgaria)', 'Мин. поръчка за България', 'select', false, true,
'["No Minimum", "100 BGN", "250 BGN", "500 BGN", "1,000 BGN", "2,500 BGN", "5,000 BGN", "10,000 BGN", "Negotiable"]',
'["Без минимум", "100 лв", "250 лв", "500 лв", "1,000 лв", "2,500 лв", "5,000 лв", "10,000 лв", "Договаряне"]', 37),

-- 38. Trade Discounts
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Trade Discounts', 'Търговски отстъпки', 'select', false, true,
'["Regular Customer 5%", "Regular Customer 10%", "Distributor 10-15%", "Distributor 15-20%", "Large Volume 20%+", "Negotiable", "Loyalty Program", "No Discount"]',
'["Редовен клиент 5%", "Редовен клиент 10%", "Дистрибутор 10-15%", "Дистрибутор 15-20%", "Голям обем 20%+", "Договаряне", "Програма за лоялност", "Без отстъпка"]', 38),

-- 39. Deferred Payment
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Deferred Payment', 'Разсрочено плащане', 'select', false, true,
'["Available", "Available with Guarantee", "Available for Regular Customers", "Not Available", "Upon Agreement"]',
'["Налично", "Налично с гаранция", "За редовни клиенти", "Не се предлага", "По договаряне"]', 39);
;
