-- =====================================================
-- L2 Categories for Pneumatic & Air Tools (9ebb8809-b3c7-483c-acd3-0dcbab483b13)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Air Compressors', 'Компресори', 'pneumatic-compressors', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '💨', 'Portable and stationary air compressors', 'Преносими и стационарни компресори', 1),
  (gen_random_uuid(), 'Pneumatic Nail Guns', 'Пневматични такери', 'pneumatic-nailers', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '🔨', 'Framing, finish, and brad nailers', 'Такери за рамки, довършителни, брадва', 2),
  (gen_random_uuid(), 'Air Impact Wrenches', 'Пневматични гайковерти', 'pneumatic-impact', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '🔧', 'Air impact wrenches and drivers', 'Пневматични ударни гайковерти', 3),
  (gen_random_uuid(), 'Air Ratchets', 'Пневматични тресчотки', 'pneumatic-ratchets', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '🔧', 'Air ratchet wrenches', 'Пневматични тресчоточни ключове', 4),
  (gen_random_uuid(), 'Air Drills', 'Пневматични бормашини', 'pneumatic-drills', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '🔧', 'Pneumatic drills and drivers', 'Пневматични бормашини', 5),
  (gen_random_uuid(), 'Air Sanders', 'Пневматични шлайфи', 'pneumatic-sanders', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '✨', 'Air orbital and DA sanders', 'Пневматични орбитални шлайфи', 6),
  (gen_random_uuid(), 'Air Grinders', 'Пневматични шлайфмашини', 'pneumatic-grinders', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '⚙️', 'Die grinders and angle grinders', 'Права и ъглови шлайфмашини', 7),
  (gen_random_uuid(), 'Spray Guns', 'Бояджийски пистолети', 'pneumatic-spray-guns', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '🎨', 'HVLP and conventional spray guns', 'HVLP и конвенционални пръскачки', 8),
  (gen_random_uuid(), 'Air Hammers & Chisels', 'Пневматични чукове', 'pneumatic-hammers', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '🔨', 'Air chipping hammers and chisels', 'Пневматични къртачи и длета', 9),
  (gen_random_uuid(), 'Blow Guns & Inflators', 'Пистолети за въздух', 'pneumatic-blow-guns', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '💨', 'Air blow guns and tire inflators', 'Продухвачи и помпи за гуми', 10),
  (gen_random_uuid(), 'Air Hoses & Fittings', 'Маркучи и фитинги', 'pneumatic-hoses', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '🔧', 'Air hoses, reels and fittings', 'Въздушни маркучи, макари и фитинги', 11),
  (gen_random_uuid(), 'Air Tool Accessories', 'Аксесоари за пневматика', 'pneumatic-accessories', '9ebb8809-b3c7-483c-acd3-0dcbab483b13', '🧰', 'FRL units, lubricators, filters', 'FRL блокове, омаслители, филтри', 12)
ON CONFLICT (slug) DO NOTHING;;
