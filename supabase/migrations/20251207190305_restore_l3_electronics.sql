
-- Restore L3 categories for Electronics

-- Audio L3 (parent: a0000000-0000-0000-0000-000000000001)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Headphones', 'audio-headphones', 'a0000000-0000-0000-0000-000000000001', 'Слушалки', 1),
  ('Earbuds', 'audio-earbuds', 'a0000000-0000-0000-0000-000000000001', 'Безжични слушалки', 2),
  ('Portable Speakers', 'audio-portable-speakers', 'a0000000-0000-0000-0000-000000000001', 'Преносими тонколони', 3),
  ('Home Speakers', 'audio-home-speakers', 'a0000000-0000-0000-0000-000000000001', 'Домашни тонколони', 4),
  ('Soundbars', 'audio-soundbars', 'a0000000-0000-0000-0000-000000000001', 'Саундбарове', 5),
  ('Home Theater', 'audio-home-theater', 'a0000000-0000-0000-0000-000000000001', 'Домашно кино', 6),
  ('Turntables', 'audio-turntables', 'a0000000-0000-0000-0000-000000000001', 'Грамофони', 7),
  ('AV Receivers', 'audio-receivers', 'a0000000-0000-0000-0000-000000000001', 'Ресивъри', 8),
  ('MP3 Players', 'audio-mp3', 'a0000000-0000-0000-0000-000000000001', 'MP3 плейъри', 9)
ON CONFLICT (slug) DO NOTHING;

-- PC & Laptops L3 (parent: 5c4a4eba-4ee9-44b9-95e2-7955ec4912d8)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Laptops', 'pc-laptops-all', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Лаптопи', 1),
  ('Desktop Computers', 'pc-desktops', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Настолни компютри', 2),
  ('All-in-One Computers', 'pc-allinone', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'All-in-One компютри', 3),
  ('Computer Monitors', 'pc-monitors', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Монитори', 4),
  ('Computer Components', 'pc-components', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Компоненти', 5),
  ('Keyboards', 'pc-keyboards', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Клавиатури', 6),
  ('Mice', 'pc-mice', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Мишки', 7),
  ('Printers', 'pc-printers', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Принтери', 8),
  ('Storage Drives', 'pc-storage', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Твърди дискове', 9),
  ('Networking', 'pc-networking', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Мрежово оборудване', 10),
  ('Webcams', 'pc-webcams', '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8', 'Уеб камери', 11)
ON CONFLICT (slug) DO NOTHING;

-- Tablets L3 (parent: 1ad60491-3aa6-43ec-8e30-91d7b4c889d9)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('iPad Pro', 'tablets-ipad-pro', '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', 'iPad Pro', 1),
  ('iPad Air', 'tablets-ipad-air', '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', 'iPad Air', 2),
  ('iPad Mini', 'tablets-ipad-mini', '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', 'iPad Mini', 3),
  ('Samsung Tablets', 'tablets-samsung', '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', 'Samsung таблети', 4),
  ('Android Tablets', 'tablets-android-all', '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', 'Android таблети', 5),
  ('Windows Tablets', 'tablets-windows-all', '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', 'Windows таблети', 6),
  ('Kids Tablets', 'tablets-kids', '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', 'Детски таблети', 7),
  ('E-Readers', 'tablets-ereaders', '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', 'Четци за електронни книги', 8),
  ('Tablet Accessories', 'tablets-accessories', '1ad60491-3aa6-43ec-8e30-91d7b4c889d9', 'Аксесоари за таблети', 9)
ON CONFLICT (slug) DO NOTHING;

-- Cameras L3 (parent: a7c14d7c-a6d6-457a-9333-2fa6755ccccd)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('DSLR Cameras', 'cameras-dslr', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'DSLR камери', 1),
  ('Mirrorless Cameras', 'cameras-mirrorless', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Безогледални камери', 2),
  ('Point & Shoot', 'cameras-compact', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Компактни камери', 3),
  ('Action Cameras', 'cameras-action', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Екшън камери', 4),
  ('Camcorders', 'cameras-camcorders', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Видеокамери', 5),
  ('Drones with Cameras', 'cameras-drones', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Дронове с камера', 6),
  ('Film Cameras', 'cameras-film', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Филмови камери', 7),
  ('Camera Lenses', 'cameras-lenses', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Обективи', 8),
  ('Camera Accessories', 'cameras-accessories', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Аксесоари за камера', 9),
  ('Tripods', 'cameras-tripods', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Статив', 10)
ON CONFLICT (slug) DO NOTHING;

-- Televisions L3 (parent: ea62ae60-2f54-47b8-b370-bda69173783f)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('4K TVs', 'tv-4k-all', 'ea62ae60-2f54-47b8-b370-bda69173783f', '4K телевизори', 1),
  ('8K TVs', 'tv-8k', 'ea62ae60-2f54-47b8-b370-bda69173783f', '8K телевизори', 2),
  ('OLED TVs', 'tv-oled-all', 'ea62ae60-2f54-47b8-b370-bda69173783f', 'OLED телевизори', 3),
  ('QLED TVs', 'tv-qled-all', 'ea62ae60-2f54-47b8-b370-bda69173783f', 'QLED телевизори', 4),
  ('Smart TVs', 'tv-smart', 'ea62ae60-2f54-47b8-b370-bda69173783f', 'Смарт телевизори', 5),
  ('TV Mounts', 'tv-mounts', 'ea62ae60-2f54-47b8-b370-bda69173783f', 'Стойки за телевизор', 6),
  ('Streaming Devices', 'tv-streaming', 'ea62ae60-2f54-47b8-b370-bda69173783f', 'Стрийминг устройства', 7),
  ('TV Accessories', 'tv-accessories', 'ea62ae60-2f54-47b8-b370-bda69173783f', 'Аксесоари за телевизор', 8)
ON CONFLICT (slug) DO NOTHING;

-- Smart Devices L3 (parent: 19c94316-3774-49b7-bff8-80115941a039)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Smart Speakers', 'smart-speakers', '19c94316-3774-49b7-bff8-80115941a039', 'Смарт тонколони', 1),
  ('Smart Displays', 'smart-displays', '19c94316-3774-49b7-bff8-80115941a039', 'Смарт дисплеи', 2),
  ('Smart Lighting', 'smart-lighting', '19c94316-3774-49b7-bff8-80115941a039', 'Смарт осветление', 3),
  ('Smart Thermostats', 'smart-thermostats', '19c94316-3774-49b7-bff8-80115941a039', 'Смарт термостати', 4),
  ('Smart Security', 'smart-security', '19c94316-3774-49b7-bff8-80115941a039', 'Смарт сигурност', 5),
  ('Smart Locks', 'smart-locks', '19c94316-3774-49b7-bff8-80115941a039', 'Смарт брави', 6),
  ('Smart Plugs', 'smart-plugs', '19c94316-3774-49b7-bff8-80115941a039', 'Смарт контакти', 7),
  ('Smart Doorbells', 'smart-doorbells', '19c94316-3774-49b7-bff8-80115941a039', 'Смарт звънци', 8),
  ('Smart Cameras', 'smart-cameras', '19c94316-3774-49b7-bff8-80115941a039', 'Смарт камери', 9)
ON CONFLICT (slug) DO NOTHING;

-- Electronics Accessories L3 (parent: a0000000-0000-0000-0000-000000000002)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Phone Cases', 'acc-phone-cases', 'a0000000-0000-0000-0000-000000000002', 'Калъфи за телефон', 1),
  ('Screen Protectors', 'acc-screen-protectors', 'a0000000-0000-0000-0000-000000000002', 'Протектори за екран', 2),
  ('Chargers & Cables', 'acc-chargers', 'a0000000-0000-0000-0000-000000000002', 'Зарядни и кабели', 3),
  ('Power Banks', 'acc-power-banks', 'a0000000-0000-0000-0000-000000000002', 'Външни батерии', 4),
  ('Adapters', 'acc-adapters', 'a0000000-0000-0000-0000-000000000002', 'Адаптери', 5),
  ('Mounts & Stands', 'acc-mounts', 'a0000000-0000-0000-0000-000000000002', 'Стойки', 6),
  ('Laptop Bags', 'acc-laptop-bags', 'a0000000-0000-0000-0000-000000000002', 'Чанти за лаптоп', 7),
  ('Memory Cards', 'acc-memory-cards', 'a0000000-0000-0000-0000-000000000002', 'Карти памет', 8)
ON CONFLICT (slug) DO NOTHING;
;
