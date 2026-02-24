
-- WHOLESALE ATTRIBUTES - Pricing & Discounts (Part 2)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 7. Price Type / Incoterms
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Price Type (Incoterms)', 'Тип цена (Инкотермс)', 'select', false, true,
'["FOB (Free On Board)", "CIF (Cost, Insurance, Freight)", "EXW (Ex Works)", "DDP (Delivered Duty Paid)", "FCA (Free Carrier)", "CFR (Cost and Freight)", "Ex-Factory", "Delivered"]',
'["FOB (Франко борд)", "CIF (Цена, застраховка, навло)", "EXW (Франко завод)", "DDP (Доставено, мито платено)", "FCA (Франко превозвач)", "CFR (Цена и навло)", "Франко завод", "Доставено"]', 7),

-- 8. Price Tier
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Price Tier', 'Ценово ниво', 'select', false, true,
'["Wholesale", "Bulk/Volume", "Distributor", "Retailer", "Dropship", "Sample Price"]',
'["Търговия на едро", "Големи количества", "Дистрибутор", "На дребно", "Дропшипинг", "Мостра"]', 8),

-- 9. Bulk Discount
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Bulk Discount', 'Количествена отстъпка', 'select', false, true,
'["5% (10+ units)", "10% (50+ units)", "15% (100+ units)", "20% (500+ units)", "25% (1000+ units)", "Negotiable", "Tiered Pricing", "No Discount"]',
'["5% (10+ броя)", "10% (50+ броя)", "15% (100+ броя)", "20% (500+ броя)", "25% (1000+ броя)", "Договаряне", "Степенувано ценообразуване", "Без отстъпка"]', 9),

-- 10. Payment Terms
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Payment Terms', 'Условия на плащане', 'multiselect', false, true,
'["T/T (Bank Transfer)", "L/C (Letter of Credit)", "PayPal", "Western Union", "Trade Assurance", "Escrow", "30% Deposit + 70% Balance", "Net 30", "Net 60", "Net 90", "Cash on Delivery", "Credit Card"]',
'["Т/Т (Банков превод)", "L/C (Акредитив)", "PayPal", "Western Union", "Търговска гаранция", "Ескроу", "30% депозит + 70% баланс", "Нето 30 дни", "Нето 60 дни", "Нето 90 дни", "Наложен платеж", "Кредитна карта"]', 10),

-- 11. Currency
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Currency', 'Валута', 'select', false, true,
'["USD", "EUR", "BGN", "GBP", "CNY", "RUB", "TRY"]',
'["Щатски долар", "Евро", "Български лев", "Британски паунд", "Китайски юан", "Руска рубла", "Турска лира"]', 11);
;
