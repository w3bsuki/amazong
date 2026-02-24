-- Add more Accessories categories under electronics-accessories (a0000000-0000-0000-0000-000000000002)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
-- Phone Accessories
('Phone Cases', 'Калъфи за телефони', 'phone-cases-new', 'a0000000-0000-0000-0000-000000000002', 1),
('iPhone Cases', 'Калъфи за iPhone', 'iphone-cases', 'a0000000-0000-0000-0000-000000000002', 2),
('Samsung Cases', 'Калъфи за Samsung', 'samsung-cases', 'a0000000-0000-0000-0000-000000000002', 3),
('Screen Protectors', 'Протектори за екран', 'screen-protectors-new', 'a0000000-0000-0000-0000-000000000002', 4),
('Phone Chargers', 'Зарядни за телефони', 'phone-chargers', 'a0000000-0000-0000-0000-000000000002', 5),
('Wireless Chargers', 'Безжични зарядни', 'wireless-chargers', 'a0000000-0000-0000-0000-000000000002', 6),
('MagSafe Accessories', 'MagSafe аксесоари', 'magsafe-accessories', 'a0000000-0000-0000-0000-000000000002', 7),
('Power Banks', 'Външни батерии', 'power-banks-new', 'a0000000-0000-0000-0000-000000000002', 8),
('Phone Holders & Mounts', 'Стойки за телефони', 'phone-holders-mounts', 'a0000000-0000-0000-0000-000000000002', 9),
('Car Phone Mounts', 'Автомобилни стойки', 'car-phone-mounts', 'a0000000-0000-0000-0000-000000000002', 10),
('PopSockets & Grips', 'PopSocket и грипове', 'popsockets-grips', 'a0000000-0000-0000-0000-000000000002', 11),
('Selfie Sticks', 'Селфи стикове', 'selfie-sticks', 'a0000000-0000-0000-0000-000000000002', 12),
-- Cables & Adapters
('USB-C Cables', 'USB-C кабели', 'usb-c-cables', 'a0000000-0000-0000-0000-000000000002', 20),
('Lightning Cables', 'Lightning кабели', 'lightning-cables', 'a0000000-0000-0000-0000-000000000002', 21),
('HDMI Cables', 'HDMI кабели', 'hdmi-cables-acc-new', 'a0000000-0000-0000-0000-000000000002', 22),
('DisplayPort Cables', 'DisplayPort кабели', 'displayport-cables-new', 'a0000000-0000-0000-0000-000000000002', 23),
('Adapters & Converters', 'Адаптери и конвертори', 'adapters-converters-new', 'a0000000-0000-0000-0000-000000000002', 24),
('Docking Stations', 'Докинг станции', 'docking-stations-new', 'a0000000-0000-0000-0000-000000000002', 25),
('USB Hubs', 'USB хъбове', 'usb-hubs-new', 'a0000000-0000-0000-0000-000000000002', 26),
-- Laptop Accessories
('Laptop Bags & Sleeves', 'Чанти за лаптопи', 'laptop-bags-sleeves', 'a0000000-0000-0000-0000-000000000002', 30),
('Laptop Stands', 'Стойки за лаптопи', 'laptop-stands-new', 'a0000000-0000-0000-0000-000000000002', 31),
('Laptop Chargers', 'Зарядни за лаптопи', 'laptop-chargers-new', 'a0000000-0000-0000-0000-000000000002', 32),
('Laptop Cooling Pads', 'Охладители за лаптопи', 'laptop-cooling-pads', 'a0000000-0000-0000-0000-000000000002', 33),
('Privacy Screens', 'Филтри за поверителност', 'privacy-screens-new', 'a0000000-0000-0000-0000-000000000002', 34),
-- Tablet Accessories
('iPad Cases', 'Калъфи за iPad', 'ipad-cases', 'a0000000-0000-0000-0000-000000000002', 40),
('Samsung Tab Cases', 'Калъфи за Samsung Tab', 'samsung-tab-cases', 'a0000000-0000-0000-0000-000000000002', 41),
('Tablet Keyboards', 'Клавиатури за таблети', 'tablet-keyboards-new', 'a0000000-0000-0000-0000-000000000002', 42),
('Tablet Stands', 'Стойки за таблети', 'tablet-stands-new', 'a0000000-0000-0000-0000-000000000002', 43),
('Apple Pencil & Stylus', 'Apple Pencil и стилуси', 'stylus-pens-new', 'a0000000-0000-0000-0000-000000000002', 44)
ON CONFLICT (slug) DO NOTHING;;
