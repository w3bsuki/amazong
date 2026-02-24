
-- ============================================================
-- FASHION EXPANSION - PART 1: Bags & Luggage
-- ============================================================
-- Adding comprehensive Bags & Luggage L1 category with full L2/L3 hierarchy
-- Following the same patterns as Electronics expansion

-- Get Fashion parent ID
DO $$
DECLARE
  fashion_id UUID;
  bags_luggage_id UUID;
  handbags_id UUID;
  backpacks_id UUID;
  luggage_id UUID;
  briefcases_id UUID;
  travel_bags_id UUID;
  crossbody_id UUID;
  totes_id UUID;
  wallets_id UUID;
  pouches_id UUID;
  belt_bags_id UUID;
BEGIN
  SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';
  
  -- ============================================================
  -- L1: Bags & Luggage
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Bags & Luggage', 'Чанти и багаж', 'bags-luggage', fashion_id, '👜', 5, 'Handbags, backpacks, luggage, travel bags and wallets', 'Чанти, раници, куфари, пътни чанти и портфейли')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO bags_luggage_id;
  
  -- ============================================================
  -- L2: Handbags
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Handbags', 'Дамски чанти', 'fashion-handbags', bags_luggage_id, '👛', 1, 'Designer and everyday handbags')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO handbags_id;
  
  -- L3: Handbag subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Shoulder Bags', 'Чанти през рамо', 'handbags-shoulder', handbags_id, 1),
    ('Tote Bags', 'Тоте чанти', 'handbags-tote', handbags_id, 2),
    ('Crossbody Bags', 'Кросбоди чанти', 'handbags-crossbody', handbags_id, 3),
    ('Clutches & Evening', 'Клъчове и вечерни', 'handbags-clutches', handbags_id, 4),
    ('Satchels', 'Сачели', 'handbags-satchels', handbags_id, 5),
    ('Bucket Bags', 'Торбички', 'handbags-bucket', handbags_id, 6),
    ('Hobo Bags', 'Хобо чанти', 'handbags-hobo', handbags_id, 7),
    ('Top Handle Bags', 'Чанти с дръжка', 'handbags-top-handle', handbags_id, 8),
    ('Mini Bags', 'Мини чанти', 'handbags-mini', handbags_id, 9),
    ('Designer Handbags', 'Дизайнерски чанти', 'handbags-designer', handbags_id, 10)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Backpacks
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Backpacks', 'Раници', 'fashion-backpacks', bags_luggage_id, '🎒', 2, 'Everyday, travel and laptop backpacks')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO backpacks_id;
  
  -- L3: Backpack subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Everyday Backpacks', 'Ежедневни раници', 'backpacks-everyday', backpacks_id, 1),
    ('Laptop Backpacks', 'Раници за лаптоп', 'backpacks-laptop', backpacks_id, 2),
    ('Travel Backpacks', 'Пътни раници', 'backpacks-travel', backpacks_id, 3),
    ('Mini Backpacks', 'Мини раници', 'backpacks-mini', backpacks_id, 4),
    ('Designer Backpacks', 'Дизайнерски раници', 'backpacks-designer', backpacks_id, 5),
    ('School Backpacks', 'Ученически раници', 'backpacks-school', backpacks_id, 6),
    ('Anti-Theft Backpacks', 'Противокражбени раници', 'backpacks-anti-theft', backpacks_id, 7),
    ('Drawstring Bags', 'Торбички с връзки', 'backpacks-drawstring', backpacks_id, 8),
    ('Roll-Top Backpacks', 'Раници с навиване', 'backpacks-roll-top', backpacks_id, 9)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Luggage
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Luggage', 'Куфари', 'fashion-luggage', bags_luggage_id, '🧳', 3, 'Suitcases, carry-on and checked luggage')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO luggage_id;
  
  -- L3: Luggage subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Carry-On Luggage', 'Ръчен багаж', 'luggage-carry-on', luggage_id, 1),
    ('Checked Luggage', 'Регистриран багаж', 'luggage-checked', luggage_id, 2),
    ('Luggage Sets', 'Комплекти куфари', 'luggage-sets', luggage_id, 3),
    ('Hardside Luggage', 'Твърди куфари', 'luggage-hardside', luggage_id, 4),
    ('Softside Luggage', 'Меки куфари', 'luggage-softside', luggage_id, 5),
    ('Spinner Luggage', 'Куфари на колелца', 'luggage-spinner', luggage_id, 6),
    ('Garment Bags', 'Калъфи за дрехи', 'luggage-garment', luggage_id, 7),
    ('Kids Luggage', 'Детски куфари', 'luggage-kids', luggage_id, 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Briefcases & Work Bags
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Briefcases & Work Bags', 'Куфарчета и работни чанти', 'fashion-briefcases', bags_luggage_id, '💼', 4, 'Professional bags for work')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO briefcases_id;
  
  -- L3: Briefcase subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Classic Briefcases', 'Класически куфарчета', 'briefcases-classic', briefcases_id, 1),
    ('Laptop Briefcases', 'Куфарчета за лаптоп', 'briefcases-laptop', briefcases_id, 2),
    ('Messenger Bags', 'Месинджър чанти', 'briefcases-messenger', briefcases_id, 3),
    ('Portfolio Cases', 'Папки и портфолиа', 'briefcases-portfolio', briefcases_id, 4),
    ('Rolling Briefcases', 'Куфарчета на колелца', 'briefcases-rolling', briefcases_id, 5),
    ('Document Bags', 'Чанти за документи', 'briefcases-documents', briefcases_id, 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Travel Bags
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Travel Bags', 'Пътни чанти', 'fashion-travel-bags', bags_luggage_id, '✈️', 5, 'Duffle bags, weekenders and travel organizers')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO travel_bags_id;
  
  -- L3: Travel bag subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Duffel Bags', 'Дъфел чанти', 'travel-duffel', travel_bags_id, 1),
    ('Weekender Bags', 'Чанти за уикенд', 'travel-weekender', travel_bags_id, 2),
    ('Travel Organizers', 'Пътни органайзери', 'travel-organizers', travel_bags_id, 3),
    ('Toiletry Bags', 'Несесери', 'travel-toiletry', travel_bags_id, 4),
    ('Packing Cubes', 'Кубчета за пакетиране', 'travel-packing-cubes', travel_bags_id, 5),
    ('Shoe Bags', 'Торбички за обувки', 'travel-shoe-bags', travel_bags_id, 6),
    ('Compression Bags', 'Вакуумни торби', 'travel-compression', travel_bags_id, 7),
    ('Passport Holders & Wallets', 'Калъфи за паспорт', 'travel-passport', travel_bags_id, 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Wallets & Card Cases
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Wallets & Card Cases', 'Портфейли и калъфи за карти', 'fashion-wallets', bags_luggage_id, '👛', 6, 'Wallets, card holders and money clips')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO wallets_id;
  
  -- L3: Wallet subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bi-Fold Wallets', 'Портфейли на две', 'wallets-bifold', wallets_id, 1),
    ('Tri-Fold Wallets', 'Портфейли на три', 'wallets-trifold', wallets_id, 2),
    ('Long Wallets', 'Дълги портфейли', 'wallets-long', wallets_id, 3),
    ('Card Holders', 'Калъфи за карти', 'wallets-card-holders', wallets_id, 4),
    ('Money Clips', 'Щипки за пари', 'wallets-money-clips', wallets_id, 5),
    ('Coin Purses', 'Портмонета за монети', 'wallets-coin-purse', wallets_id, 6),
    ('Zip-Around Wallets', 'Портфейли с цип', 'wallets-zip-around', wallets_id, 7),
    ('Phone Wallets', 'Портфейли за телефон', 'wallets-phone', wallets_id, 8),
    ('RFID Wallets', 'RFID портфейли', 'wallets-rfid', wallets_id, 9),
    ('Designer Wallets', 'Дизайнерски портфейли', 'wallets-designer', wallets_id, 10)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Pouches & Wristlets
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Pouches & Wristlets', 'Несесери и портмонета', 'fashion-pouches', bags_luggage_id, '👝', 7, 'Small pouches, wristlets and cosmetic bags')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO pouches_id;
  
  -- L3: Pouch subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Wristlets', 'Портмонета на китка', 'pouches-wristlets', pouches_id, 1),
    ('Cosmetic Bags', 'Несесери за козметика', 'pouches-cosmetic', pouches_id, 2),
    ('Makeup Bags', 'Чанти за грим', 'pouches-makeup', pouches_id, 3),
    ('Tech Pouches', 'Калъфи за техника', 'pouches-tech', pouches_id, 4),
    ('Zipper Pouches', 'Несесери с цип', 'pouches-zipper', pouches_id, 5),
    ('Envelope Pouches', 'Плик несесери', 'pouches-envelope', pouches_id, 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Belt Bags & Fanny Packs
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Belt Bags & Fanny Packs', 'Чанти за кръст', 'fashion-belt-bags', bags_luggage_id, '🎒', 8, 'Belt bags, fanny packs and waist bags')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO belt_bags_id;
  
  -- L3: Belt bag subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Classic Fanny Packs', 'Класически чанти за кръст', 'belt-bags-classic', belt_bags_id, 1),
    ('Designer Belt Bags', 'Дизайнерски чанти за кръст', 'belt-bags-designer', belt_bags_id, 2),
    ('Running Belt Bags', 'Чанти за бягане', 'belt-bags-running', belt_bags_id, 3),
    ('Travel Waist Bags', 'Пътнически чанти за кръст', 'belt-bags-travel', belt_bags_id, 4),
    ('Chest Bags', 'Чанти за гърди', 'belt-bags-chest', belt_bags_id, 5),
    ('Sling Bags', 'Слинг чанти', 'belt-bags-sling', belt_bags_id, 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
END $$;
;
