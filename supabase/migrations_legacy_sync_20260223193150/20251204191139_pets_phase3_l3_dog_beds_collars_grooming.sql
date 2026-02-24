-- PETS PHASE 3: Add L3 categories for Dog Beds, Collars, and Grooming
-- Dog Beds ID: 1a48f848-ffd2-417f-b5b0-1923ee182644
-- Dog Collars ID: cb4c55e0-7a7b-4353-b2bb-44b50d7f7fcf
-- Dog Grooming ID: 1f7b1802-3fb1-4705-bb4a-92b10a797375

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  -- Dog Beds L3
  ('Orthopedic Dog Beds', 'Ортопедични легла', 'dog-beds-orthopedic', '1a48f848-ffd2-417f-b5b0-1923ee182644', NULL, 1, 'Memory foam and orthopedic beds', 'Легла с мемори пяна и ортопедични'),
  ('Bolster Dog Beds', 'Легла с борд', 'dog-beds-bolster', '1a48f848-ffd2-417f-b5b0-1923ee182644', NULL, 2, 'Beds with raised edges', 'Легла с повдигнати ръбове'),
  ('Crate Mats & Pads', 'Подложки за клетки', 'dog-beds-crate', '1a48f848-ffd2-417f-b5b0-1923ee182644', NULL, 3, 'Crate mats and pads', 'Подложки и дюшеци за клетки'),
  ('Heated & Cooling Beds', 'Отопляеми и охлаждащи легла', 'dog-beds-heated', '1a48f848-ffd2-417f-b5b0-1923ee182644', NULL, 4, 'Temperature regulating beds', 'Легла с регулиране на температурата'),
  ('Elevated Dog Beds', 'Повдигнати легла', 'dog-beds-elevated', '1a48f848-ffd2-417f-b5b0-1923ee182644', NULL, 5, 'Raised and elevated beds', 'Повдигнати и въздушни легла'),
  ('Outdoor Dog Beds', 'Външни легла', 'dog-beds-outdoor', '1a48f848-ffd2-417f-b5b0-1923ee182644', NULL, 6, 'Weather-resistant outdoor beds', 'Водоустойчиви външни легла'),
  
  -- Dog Collars L3
  ('Standard Dog Collars', 'Стандартни нашийници', 'dog-collars-standard', 'cb4c55e0-7a7b-4353-b2bb-44b50d7f7fcf', NULL, 1, 'Basic dog collars', 'Стандартни нашийници за кучета'),
  ('Martingale Collars', 'Мартингейл нашийници', 'dog-collars-martingale', 'cb4c55e0-7a7b-4353-b2bb-44b50d7f7fcf', NULL, 2, 'Limited slip collars', 'Нашийници с ограничено приплъзване'),
  ('Personalized Dog Collars', 'Персонализирани нашийници', 'dog-collars-personalized', 'cb4c55e0-7a7b-4353-b2bb-44b50d7f7fcf', NULL, 3, 'Engraved and custom collars', 'Гравирани и персонализирани нашийници'),
  ('Light-Up & Reflective Collars', 'Светещи и светлоотразителни', 'dog-collars-led', 'cb4c55e0-7a7b-4353-b2bb-44b50d7f7fcf', NULL, 4, 'LED and reflective collars', 'LED и светлоотразителни нашийници'),
  ('Flea & Tick Collars', 'Противопаразитни нашийници', 'dog-collars-flea', 'cb4c55e0-7a7b-4353-b2bb-44b50d7f7fcf', NULL, 5, 'Pest prevention collars', 'Нашийници против паразити'),
  ('Dog ID Tags', 'Медальони за кучета', 'dog-collars-tags', 'cb4c55e0-7a7b-4353-b2bb-44b50d7f7fcf', NULL, 6, 'ID tags and charms', 'Медальони и украшения'),
  
  -- Dog Grooming L3
  ('Dog Shampoo & Conditioner', 'Шампоани и балсами', 'dog-grooming-shampoo', '1f7b1802-3fb1-4705-bb4a-92b10a797375', NULL, 1, 'Dog shampoos and conditioners', 'Шампоани и балсами за кучета'),
  ('Dog Brushes & Combs', 'Четки и гребени', 'dog-grooming-brushes', '1f7b1802-3fb1-4705-bb4a-92b10a797375', NULL, 2, 'Brushes, combs, and deshedding tools', 'Четки, гребени и инструменти за козината'),
  ('Dog Nail Care', 'Грижа за ноктите', 'dog-grooming-nails', '1f7b1802-3fb1-4705-bb4a-92b10a797375', NULL, 3, 'Nail clippers and grinders', 'Ножички и шлифовъчки за нокти'),
  ('Dog Ear Care', 'Грижа за ушите', 'dog-grooming-ears', '1f7b1802-3fb1-4705-bb4a-92b10a797375', NULL, 4, 'Ear cleaners and wipes', 'Почистващи препарати и кърпички за уши'),
  ('Dog Eye Care', 'Грижа за очите', 'dog-grooming-eyes', '1f7b1802-3fb1-4705-bb4a-92b10a797375', NULL, 5, 'Eye cleaners and wipes', 'Почистващи препарати за очи'),
  ('Dog Dental Care', 'Дентална грижа', 'dog-grooming-dental', '1f7b1802-3fb1-4705-bb4a-92b10a797375', NULL, 6, 'Toothbrushes, toothpaste, and dental products', 'Четки за зъби, паста и дентални продукти'),
  ('Dog Clippers & Trimmers', 'Машинки за подстригване', 'dog-grooming-clippers', '1f7b1802-3fb1-4705-bb4a-92b10a797375', NULL, 7, 'Hair clippers and trimmers', 'Машинки и тримери за подстригване'),
  ('Dog Dryers & Bathing', 'Сешоари и къпане', 'dog-grooming-bathing', '1f7b1802-3fb1-4705-bb4a-92b10a797375', NULL, 8, 'Dryers, tubs, and bathing accessories', 'Сешоари, вани и аксесоари за къпане')
ON CONFLICT (slug) DO NOTHING;;
