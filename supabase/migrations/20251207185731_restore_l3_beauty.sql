
-- Restore L3 categories for Beauty

-- Makeup L3 categories (parent: 87b8035a-faa2-4278-a27c-a2a3b72fc7eb)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Foundation', 'makeup-foundation', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Фон дьо тен', 1),
  ('Concealer', 'makeup-concealer', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Коректор', 2),
  ('Powder', 'makeup-powder', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Пудра', 3),
  ('Blush', 'makeup-blush', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Руж', 4),
  ('Bronzer', 'makeup-bronzer', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Бронзант', 5),
  ('Highlighter', 'makeup-highlighter', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Хайлайтър', 6),
  ('Primer', 'makeup-primer', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Праймър', 7),
  ('Setting Spray', 'makeup-setting-spray', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Фиксиращ спрей', 8),
  ('Lipstick', 'makeup-lipstick', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Червило', 9),
  ('Lip Gloss', 'makeup-lip-gloss', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Гланц за устни', 10),
  ('Lip Liner', 'makeup-lip-liner', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Молив за устни', 11),
  ('Eyeshadow', 'makeup-eyeshadow', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Сенки за очи', 12),
  ('Mascara', 'makeup-mascara', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Спирала', 13),
  ('Eyeliner', 'makeup-eyeliner', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Очна линия', 14),
  ('Eyebrow Products', 'makeup-eyebrow', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Продукти за вежди', 15),
  ('False Lashes', 'makeup-false-lashes', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Изкуствени мигли', 16),
  ('Makeup Sets', 'makeup-sets', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Комплекти грим', 17),
  ('Makeup Brushes', 'makeup-brushes', '87b8035a-faa2-4278-a27c-a2a3b72fc7eb', 'Четки за грим', 18)
ON CONFLICT (slug) DO NOTHING;

-- Skincare L3 categories (parent: d4fabba5-aacb-4625-9a3b-c5eabf39149d)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Cleansers', 'skincare-cleansers', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Почистващи продукти', 1),
  ('Toners', 'skincare-toners', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Тоници', 2),
  ('Moisturizers', 'skincare-moisturizers', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Хидратанти', 3),
  ('Serums', 'skincare-serums', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Серуми', 4),
  ('Eye Creams', 'skincare-eye-creams', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Кремове за очи', 5),
  ('Face Masks', 'skincare-face-masks', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Маски за лице', 6),
  ('Exfoliators', 'skincare-exfoliators', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Ексфолианти', 7),
  ('Sunscreen', 'skincare-sunscreen', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Слънцезащитни продукти', 8),
  ('Anti-Aging', 'skincare-anti-aging', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Анти-ейдж', 9),
  ('Acne Treatment', 'skincare-acne', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Лечение на акне', 10),
  ('Face Oils', 'skincare-face-oils', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Масла за лице', 11),
  ('Lip Care', 'skincare-lip-care', 'd4fabba5-aacb-4625-9a3b-c5eabf39149d', 'Грижа за устни', 12)
ON CONFLICT (slug) DO NOTHING;

-- Hair Care L3 categories (parent: c0d9c89f-fe14-417d-a508-f6351a8776c6)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Shampoo', 'haircare-shampoo', 'c0d9c89f-fe14-417d-a508-f6351a8776c6', 'Шампоан', 1),
  ('Conditioner', 'haircare-conditioner', 'c0d9c89f-fe14-417d-a508-f6351a8776c6', 'Балсам', 2),
  ('Hair Masks', 'haircare-masks', 'c0d9c89f-fe14-417d-a508-f6351a8776c6', 'Маски за коса', 3),
  ('Hair Oils', 'haircare-oils', 'c0d9c89f-fe14-417d-a508-f6351a8776c6', 'Масла за коса', 4),
  ('Styling Products', 'haircare-styling', 'c0d9c89f-fe14-417d-a508-f6351a8776c6', 'Продукти за стилизиране', 5),
  ('Hair Color', 'haircare-color', 'c0d9c89f-fe14-417d-a508-f6351a8776c6', 'Боя за коса', 6),
  ('Hair Tools', 'haircare-tools', 'c0d9c89f-fe14-417d-a508-f6351a8776c6', 'Инструменти за коса', 7),
  ('Hair Treatments', 'haircare-treatments', 'c0d9c89f-fe14-417d-a508-f6351a8776c6', 'Лечения за коса', 8),
  ('Hair Extensions', 'haircare-extensions', 'c0d9c89f-fe14-417d-a508-f6351a8776c6', 'Удължители за коса', 9)
ON CONFLICT (slug) DO NOTHING;

-- Fragrance L3 categories (parent: a30ae4c8-954e-4708-90b4-4e2431242739)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Women''s Perfume', 'fragrance-womens', 'a30ae4c8-954e-4708-90b4-4e2431242739', 'Дамски парфюми', 1),
  ('Men''s Cologne', 'fragrance-mens', 'a30ae4c8-954e-4708-90b4-4e2431242739', 'Мъжки парфюми', 2),
  ('Unisex Fragrance', 'fragrance-unisex', 'a30ae4c8-954e-4708-90b4-4e2431242739', 'Унисекс аромати', 3),
  ('Body Mists', 'fragrance-body-mists', 'a30ae4c8-954e-4708-90b4-4e2431242739', 'Спрейове за тяло', 4),
  ('Gift Sets', 'fragrance-gift-sets', 'a30ae4c8-954e-4708-90b4-4e2431242739', 'Подаръчни комплекти', 5),
  ('Sample Sets', 'fragrance-samples', 'a30ae4c8-954e-4708-90b4-4e2431242739', 'Мостри', 6)
ON CONFLICT (slug) DO NOTHING;

-- Bath & Body L3 (parent: e4df7506-484c-40ab-9199-cb47b23f5898)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Body Wash', 'bath-body-wash', 'e4df7506-484c-40ab-9199-cb47b23f5898', 'Душ гел', 1),
  ('Body Lotion', 'bath-body-lotion', 'e4df7506-484c-40ab-9199-cb47b23f5898', 'Лосион за тяло', 2),
  ('Body Scrubs', 'bath-body-scrubs', 'e4df7506-484c-40ab-9199-cb47b23f5898', 'Скрабове за тяло', 3),
  ('Bath Bombs', 'bath-bombs', 'e4df7506-484c-40ab-9199-cb47b23f5898', 'Бомбички за вана', 4),
  ('Hand Care', 'bath-hand-care', 'e4df7506-484c-40ab-9199-cb47b23f5898', 'Грижа за ръце', 5),
  ('Foot Care', 'bath-foot-care', 'e4df7506-484c-40ab-9199-cb47b23f5898', 'Грижа за крака', 6),
  ('Deodorants', 'bath-deodorants', 'e4df7506-484c-40ab-9199-cb47b23f5898', 'Дезодоранти', 7)
ON CONFLICT (slug) DO NOTHING;

-- Men's Grooming L3 (parent: f87473ad-3149-44c6-94c5-5c3fe71b85a2)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Shaving', 'mens-shaving', 'f87473ad-3149-44c6-94c5-5c3fe71b85a2', 'Бръснене', 1),
  ('Beard Care', 'mens-beard', 'f87473ad-3149-44c6-94c5-5c3fe71b85a2', 'Грижа за брада', 2),
  ('Men''s Skincare', 'mens-skincare', 'f87473ad-3149-44c6-94c5-5c3fe71b85a2', 'Мъжка грижа за кожа', 3),
  ('Men''s Hair Care', 'mens-haircare', 'f87473ad-3149-44c6-94c5-5c3fe71b85a2', 'Мъжка грижа за коса', 4),
  ('Men''s Body Care', 'mens-bodycare', 'f87473ad-3149-44c6-94c5-5c3fe71b85a2', 'Мъжка грижа за тяло', 5)
ON CONFLICT (slug) DO NOTHING;

-- Beauty Tools L3 (parent: abaf6f32-d99b-4ff8-a5d9-e0b944fe8212)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Makeup Sponges', 'beauty-tools-sponges', 'abaf6f32-d99b-4ff8-a5d9-e0b944fe8212', 'Гъби за грим', 1),
  ('Makeup Mirrors', 'beauty-tools-mirrors', 'abaf6f32-d99b-4ff8-a5d9-e0b944fe8212', 'Огледала за грим', 2),
  ('Eyelash Curlers', 'beauty-tools-curlers', 'abaf6f32-d99b-4ff8-a5d9-e0b944fe8212', 'Шипки за мигли', 3),
  ('Facial Tools', 'beauty-tools-facial', 'abaf6f32-d99b-4ff8-a5d9-e0b944fe8212', 'Инструменти за лице', 4),
  ('Hair Styling Tools', 'beauty-tools-hair', 'abaf6f32-d99b-4ff8-a5d9-e0b944fe8212', 'Инструменти за коса', 5),
  ('Nail Tools', 'beauty-tools-nails', 'abaf6f32-d99b-4ff8-a5d9-e0b944fe8212', 'Инструменти за нокти', 6)
ON CONFLICT (slug) DO NOTHING;

-- Oral Care L3 (parent: a9005e6f-a0dd-4f29-8fec-3c3b425ac11d)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Toothpaste', 'oral-toothpaste', 'a9005e6f-a0dd-4f29-8fec-3c3b425ac11d', 'Паста за зъби', 1),
  ('Toothbrushes', 'oral-toothbrushes', 'a9005e6f-a0dd-4f29-8fec-3c3b425ac11d', 'Четки за зъби', 2),
  ('Mouthwash', 'oral-mouthwash', 'a9005e6f-a0dd-4f29-8fec-3c3b425ac11d', 'Вода за уста', 3),
  ('Dental Floss', 'oral-floss', 'a9005e6f-a0dd-4f29-8fec-3c3b425ac11d', 'Конец за зъби', 4),
  ('Teeth Whitening', 'oral-whitening', 'a9005e6f-a0dd-4f29-8fec-3c3b425ac11d', 'Избелване на зъби', 5)
ON CONFLICT (slug) DO NOTHING;
;
