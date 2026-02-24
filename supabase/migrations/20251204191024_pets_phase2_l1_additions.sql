-- PETS PHASE 2: Add additional L1 categories
-- Pets root ID: fbda10eb-556a-4db9-82e6-5f643f003a06

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  ('Pet Tech & Monitoring', 'Технологии и мониторинг', 'pet-tech', 'fbda10eb-556a-4db9-82e6-5f643f003a06', '📡', 8, 'GPS trackers, cameras, and smart pet devices', 'GPS тракери, камери и умни устройства за домашни любимци'),
  ('Pet Health & Pharmacy', 'Здраве и аптека за домашни любимци', 'pet-pharmacy', 'fbda10eb-556a-4db9-82e6-5f643f003a06', '💊', 9, 'Pet medications, supplements, and health products', 'Медикаменти, добавки и здравни продукти за домашни любимци'),
  ('Pet Travel & Carriers', 'Пътуване и транспорт', 'pet-travel', 'fbda10eb-556a-4db9-82e6-5f643f003a06', '✈️', 10, 'Pet carriers, car safety, and travel accessories', 'Транспортни кутии, безопасност в кола и аксесоари за пътуване'),
  ('Pet Memorials', 'Възпоменания за домашни любимци', 'pet-memorials', 'fbda10eb-556a-4db9-82e6-5f643f003a06', '🌈', 11, 'Memorial products, urns, and keepsakes', 'Възпоменателни продукти, урни и спомени'),
  ('Pet Gifts & Personalized', 'Подаръци и персонализирани', 'pet-gifts', 'fbda10eb-556a-4db9-82e6-5f643f003a06', '🎁', 12, 'Pet owner gifts and personalized items', 'Подаръци за собственици и персонализирани артикули')
ON CONFLICT (slug) DO NOTHING;;
