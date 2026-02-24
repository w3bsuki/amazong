
-- L2 Categories for: Wholesale Electronics & Tech (60341efb-90c4-4e6c-9e89-84c002ac8688)
-- Update existing L2s and add new ones

-- Keep existing: Phone Accessories, Computer Parts, Cables & Adapters
UPDATE categories SET display_order = 1, name = 'Phone Accessories', name_bg = 'Аксесоари за телефони'
WHERE id = 'f6ea5b33-3169-4c03-94aa-c1592b697889';

UPDATE categories SET display_order = 2, name = 'Computer & Office Equipment', name_bg = 'Компютри и офис оборудване'
WHERE id = 'e1aced53-81aa-4b5e-b041-12eb4fe12fb5';

UPDATE categories SET display_order = 3
WHERE id = '80ea243a-2280-4d28-8052-d67479915916';

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Consumer Electronics', 'Потребителска електроника', 'wholesale-consumer-electronics', '60341efb-90c4-4e6c-9e89-84c002ac8688', 4),
('LED & Lighting', 'LED и осветление', 'wholesale-led-lighting', '60341efb-90c4-4e6c-9e89-84c002ac8688', 5),
('Security & Surveillance', 'Охрана и видеонаблюдение', 'wholesale-security-surveillance', '60341efb-90c4-4e6c-9e89-84c002ac8688', 6),
('Smart Devices & IoT', 'Смарт устройства и IoT', 'wholesale-smart-devices', '60341efb-90c4-4e6c-9e89-84c002ac8688', 7),
('Networking Equipment', 'Мрежово оборудване', 'wholesale-networking', '60341efb-90c4-4e6c-9e89-84c002ac8688', 8),
('Electronic Components', 'Електронни компоненти', 'wholesale-electronic-components', '60341efb-90c4-4e6c-9e89-84c002ac8688', 9);
;
